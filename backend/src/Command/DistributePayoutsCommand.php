<?php

namespace App\Command;

use App\Entity\TokenLog;
use App\Repository\PaymentRepository;
use App\Repository\SellerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsCommand(
    name: 'app:distribute-payouts',
    description: 'Выплаты продавцам через ЮMoney',
)]
class DistributePayoutsCommand extends Command
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly SellerRepository $sellerRepository,
        private readonly HttpClientInterface $client,
        private readonly PaymentRepository $paymentRepository,
        private readonly EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $sellers = $this->sellerRepository->findApprovedSellersWithPositiveBalance();
        $token = $this->paymentRepository->findOneBy([])?->getAuthCode();

        if (!$token) {
            $io->error('Ошибка: не найден токен авторизации.');

            return Command::FAILURE;
        }

        foreach ($sellers as $seller) {
            $tokenLog = (new TokenLog())
                ->setType('request-payment')
                ->setCreatedAt(new \DateTimeImmutable());

            try {
                $response = $this->client->request('POST', 'https://yoomoney.ru/api/request-payment', [
                    'headers' => [
                        'Content-Type' => 'application/x-www-form-urlencoded',
                        'Authorization' => 'Bearer '.$token,
                    ],
                    'body' => http_build_query([
                        'amount_due' => $seller->getBalance(),
                        'to' => $seller->getCardNumber(),
                        'pattern_id' => 'p2p',
                    ]),
                ]);

                $data = json_decode($response->getContent(), true);

                if (isset($data['error']) || ($data['status'] ?? '') === 'refused') {
                    $errorMsg = $data['error_description'] ?? $data['error'] ?? 'Неизвестная ошибка';
                    $io->error("Ошибка при отправке платежа: $errorMsg");

                    $tokenLog->setMessage($errorMsg);
                    $tokenLog->setStatus('error');
                    $this->em->persist($tokenLog);
                    continue;
                }

                $tokenLog->setMessage('Запрос платежа успешен');
                $tokenLog->setStatus('success');
                $this->em->persist($tokenLog);

                $tokenLog = (new TokenLog())
                    ->setType('process-payment')
                    ->setCreatedAt(new \DateTimeImmutable());

                $secondResponse = $this->client->request('POST', 'https://yoomoney.ru/api/process-payment', [
                    'headers' => [
                        'Content-Type' => 'application/x-www-form-urlencoded',
                        'Authorization' => 'Bearer '.$token,
                    ],
                    'body' => http_build_query([
                        'request_id' => $data['request_id'],
                    ]),
                ]);

                $secondData = json_decode($secondResponse->getContent(), true);

                if (isset($secondData['error']) || ($secondData['status'] ?? '') === 'refused') {
                    $errorMsg = $secondData['error_description'] ?? $secondData['error'] ?? 'Ошибка при обработке платежа';
                    $io->error("Ошибка при обработке платежа: $errorMsg");

                    $tokenLog->setMessage($errorMsg);
                    $tokenLog->setStatus('error');
                    $this->em->persist($tokenLog);
                    continue;
                }

                $tokenLog->setMessage('Платеж успешно обработан');
                $tokenLog->setStatus('success');
                $this->em->persist($tokenLog);
                $seller->setBalance($seller->getBalance() - ($data['contract_amount'] - $data['fees']['service']));
            } catch (\Exception $e) {
                $io->error('Ошибка: '.$e->getMessage());
                $tokenLog->setMessage($e->getMessage());
                $tokenLog->setStatus('error');
                $this->em->persist($tokenLog);
            }

            $this->em->flush();
        }

        $io->success($this->translator->trans('Mass payments completed'));

        return Command::SUCCESS;
    }
}
