import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Loader() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "50vh",
                backgroundColor: "transparent",
            }}
        >
            <ProgressSpinner />
        </div>
    );
}
