import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import styles from './style.css';

export default function UniversalModal({
                                           title = "Модальное окно",
                                           buttonLabel = "Открыть модальное окно",
                                           buttonIcon = "pi pi-pencil",
                                           buttonClass = "p-button-primary mt-3 custom-button",
                                           children,
                                           footer,
                                           onConfirm = () => false,
                                           onCancel = () => {},
                                       }) {
    const [visible, setVisible] = useState(false);

    const handleConfirm = async (e) => {
        e.preventDefault();

        const shouldClose = await onConfirm();
        if (shouldClose) {
            setVisible(false);
        }
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
            <Button label={buttonLabel} icon={buttonIcon} onClick={show} className={`${buttonClass} ${styles.customButton}`} />
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
