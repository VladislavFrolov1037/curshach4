package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

var previousKeyboard tgbotapi.ReplyKeyboardMarkup

var notificationMapping = map[string]struct {
	notificationType string
	enable           bool
}{
	"Включить уведомления о доставке заказа":       {"order_delivery", true},
	"Выключить уведомления о доставке заказа":      {"order_delivery", false},
	"Включить рассылку уведомлений":                {"marketplace_notifications", true},
	"Выключить рассылку уведомлений":               {"marketplace_notifications", false},
	"Включить уведомления о промокодах и скидках":  {"promo_notifications", true},
	"Выключить уведомления о промокодах и скидках": {"promo_notifications", false},
}

type UserSettings struct {
	OrderNotification       bool `json:"order_notification"`
	MarketplaceNotification bool `json:"marketplace_notification"`
	PromoNotification       bool `json:"promo_notification"`
}

var userSettingsCache = make(map[int64]*UserSettings)

var mainKeyboard = tgbotapi.NewReplyKeyboard(
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("Настройка уведомлений"),
	),
)

var notificationKeyboard = tgbotapi.NewReplyKeyboard(
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("Уведомления при заказе"),
	),
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("Уведомления от маркетплейса"),
	),
	tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("Назад"),
	),
)

func main() {
	bot, err := tgbotapi.NewBotAPI("7741235746:AAE7aURxlcReC9H5QFGrwe9FghegF51Q7f0")
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = true

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message.IsCommand() {
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, "")

			switch update.Message.Command() {
			case "start":
				userID := update.Message.CommandArguments()
				tgID := update.Message.From.ID

				if saveUserToDatabase(userID, tgID) {
					msg.Text = "Ваш аккаунт Telegram успешно привязан к маркетплейсу"
					msg.ReplyMarkup = mainKeyboard
					previousKeyboard = mainKeyboard
				} else {
					msg.Text = "Произошла ошибка при привязке вашего аккаунта, попробуйте немного позже"
				}
			case "help":
				msg.Text = "Чтобы начать работу с ботом воспользуйтесь командой /start"
			default:
				msg.Text = "Команда не найдена.\nЧтобы получить информацию о существующих командах, можете воспользоваться командой /help"
			}

			if _, err := bot.Send(msg); err != nil {
				log.Panic(err)
			}
		}

		if update.Message != nil && !update.Message.IsCommand() {
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, "")

			switch update.Message.Text {
			case "Настройка уведомлений":
				msg.Text = "Выберите тип уведомлений"
				msg.ReplyMarkup = notificationKeyboard
				previousKeyboard = mainKeyboard

			case "Уведомления при заказе":
				msg.Text = "Выберите уведомление, которое хотите изменить"
				msg.ReplyMarkup = getOrderNotificationKeyboard(update.Message.From.ID)
				previousKeyboard = notificationKeyboard

			case "Уведомления от маркетплейса":
				msg.Text = "Выберите уведомление, которое хотите изменить"
				msg.ReplyMarkup = getMarketplaceNotificationKeyboard(update.Message.From.ID)
				previousKeyboard = notificationKeyboard

			case "Назад":
				msg.Text = "Вы вернулись назад"
				msg.ReplyMarkup = previousKeyboard
				previousKeyboard = mainKeyboard

			default:
				if action, exists := notificationMapping[update.Message.Text]; exists {
					updateNotificationSettings(update.Message.From.ID, action.notificationType, action.enable)
					msg.Text = "Настройки обновлены!"

					switch action.notificationType {
					case "order_delivery", "order_payment":
						msg.ReplyMarkup = getOrderNotificationKeyboard(update.Message.From.ID)
					case "marketplace_notifications", "promo_notifications":
						msg.ReplyMarkup = getMarketplaceNotificationKeyboard(update.Message.From.ID)
					}
				} else {
					msg.Text = "Команда не найдена.\nЧтобы получить информацию о существующих командах, можете воспользоваться командой /help"
				}
			}

			if _, err := bot.Send(msg); err != nil {
				log.Panic(err)
			}
		}
	}
}

func saveUserToDatabase(userID string, tgID int64) bool {
	if getUser(tgID) != nil {
		return true
	}

	const Url = "https://marketskam.ru/api/tg/update"

	resp, err := http.PostForm(Url,
		url.Values{"id": {userID}, "tg_id": {strconv.FormatInt(tgID, 10)}})

	if err != nil {
		log.Panic(err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Ошибка при сохранении в базу данных: %v", resp.StatusCode)
		return false
	}

	return true
}

func getUser(tgID int64) *UserSettings {
	if settings, exists := userSettingsCache[tgID]; exists {
		return settings
	}

	Url := fmt.Sprintf("https://marketskam.ru/api/tg/check/%d", tgID)

	resp, err := http.Get(Url)

	if err != nil {
		log.Panic(err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil
	}

	var settings UserSettings
	if err := json.NewDecoder(resp.Body).Decode(&settings); err != nil {
		log.Printf("Ошибка парсинга JSON: %v", err)
		return nil
	}

	userSettingsCache[tgID] = &settings

	return &settings
}

func updateNotificationSettings(tgID int64, notificationType string, enable bool) {
	settings, exists := userSettingsCache[tgID]
	if !exists {
		settings = &UserSettings{}
		userSettingsCache[tgID] = settings
	}

	switch notificationType {
	case "order_delivery":
		if settings.OrderNotification == enable {
			return
		}
		settings.OrderNotification = enable

	case "marketplace_notifications":
		if settings.MarketplaceNotification == enable {
			return
		}
		settings.MarketplaceNotification = enable

	case "promo_notifications":
		if settings.PromoNotification == enable {
			return
		}
		settings.PromoNotification = enable
	}

	action := "enable"
	if !enable {
		action = "disable"
	}

	data := url.Values{
		"tg_id":             {strconv.FormatInt(tgID, 10)},
		"notification_type": {notificationType},
		"action":            {action},
	}

	Url := "https://marketskam.ru/api/tg/notification/update"
	resp, err := http.PostForm(Url, data)
	if err != nil {
		log.Panic(err)
	}
	log.Println("RESP REPSO: ", resp)
	defer resp.Body.Close()
}

func getOrderNotificationKeyboard(tgID int64) tgbotapi.ReplyKeyboardMarkup {
	settings, exists := userSettingsCache[tgID]
	if !exists {
		settings = &UserSettings{}
	}

	var keyboard [][]tgbotapi.KeyboardButton

	if settings.OrderNotification {
		keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
			tgbotapi.NewKeyboardButton("Выключить уведомления о доставке заказа"),
		))
	} else {
		keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
			tgbotapi.NewKeyboardButton("Включить уведомления о доставке заказа"),
		))
	}

	keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("Назад"),
	))

	return tgbotapi.NewReplyKeyboard(keyboard...)
}

func getMarketplaceNotificationKeyboard(tgID int64) tgbotapi.ReplyKeyboardMarkup {
	settings, exists := userSettingsCache[tgID]
	if !exists {
		settings = &UserSettings{}
	}

	var keyboard [][]tgbotapi.KeyboardButton

	if settings.MarketplaceNotification {
		keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
			tgbotapi.NewKeyboardButton("Выключить рассылку уведомлений"),
		))
	} else {
		keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
			tgbotapi.NewKeyboardButton("Включить рассылку уведомлений"),
		))
	}

	if settings.PromoNotification {
		keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
			tgbotapi.NewKeyboardButton("Выключить уведомления о промокодах и скидках"),
		))
	} else {
		keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
			tgbotapi.NewKeyboardButton("Включить уведомления о промокодах и скидках"),
		))
	}

	keyboard = append(keyboard, tgbotapi.NewKeyboardButtonRow(
		tgbotapi.NewKeyboardButton("Назад"),
	))

	return tgbotapi.NewReplyKeyboard(keyboard...)
}
