import React from 'react';
import { Message } from 'primereact/message';

export default function Error({ error }) {
    return (
        <div className="custom-error-container">
            <Message severity="error" text={error} />
        </div>
    );
}