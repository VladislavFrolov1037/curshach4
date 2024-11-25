import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function UniversalModal({
                                           title = "Модальное окно", // Заголовок окна
                                           buttonLabel = "Открыть модальное окно", // Текст кнопки
                                           buttonIcon = "pi pi-pencil", // Иконка кнопки
                                           buttonClass = "p-button-primary mt-3", // Классы кнопки
                                           children, // Содержание модального окна
                                           footer, // Пользовательский футер
                                           onConfirm = () => {}, // Callback при нажатии "Сохранить"
                                           onCancel = () => {}, // Callback при закрытии
                                       }) {
    const [visible, setVisible] = useState(false);

    const handleConfirm = (e) => {
        e.preventDefault();

        onConfirm();

        setVisible(false);
    };

    const handleCancel = () => {
        onCancel();
        setVisible(false);
    };

    const footerContent = footer || (
        <div>
            <Button label="Отмена" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={handleConfirm} autoFocus />
        </div>
    );

    const show = () => setVisible(true);

    return (
        <>
            <Button label={buttonLabel} icon={buttonIcon} onClick={show} className={buttonClass} />
            <Dialog
                header={title}
                visible={visible}
                style={{ width: '50vw' }}
                onHide={handleCancel}
                footer={footerContent}
                draggable={false}
                resizable={false}
            >
                {children}
            </Dialog>
        </>
    );
}
