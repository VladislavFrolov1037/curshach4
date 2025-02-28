import React, {useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {Toast} from "primereact/toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faSync} from "@fortawesome/free-solid-svg-icons";
import {useLocation, useNavigate} from "react-router-dom";
// import { getTokenLogs } from "../../../services/admin";

const AdminToken = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const toast = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("success") === "1") {
            toast.current.show({
                severity: "success",
                summary: "Токен обновлён",
                detail: "Новый токен успешно создан",
                life: 3000,
            });

            params.delete("success");
            navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
        }
    }, [location, navigate]);

    const fetchLogs = async () => {
        try {
            // const response = await getTokenLogs();
            // setLogs(response);
        } catch (error) {
            console.error("Ошибка загрузки логов:", error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const statusTemplate = (rowData) => {
        return (
            <span className={`badge ${rowData.status === "успех" ? "bg-success" : "bg-danger"}`}>
                {rowData.status}
            </span>
        );
    };

    const handleUpdateToken = () => {
        setLoading(true);

        const client_id = '8919BAD7A0D5603569CA20488C3A66CD561C5E32238BD4CC2A6EAC9D1845507D';
        const scope = 'payment-p2p';
        const redirect_uri = 'https://s0fw11-176-215-208-47.ru.tuna.am/api/oAuth';
        const response_type = 'code';

        const authUrl = `https://yoomoney.ru/oauth/authorize?client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${response_type}`;

        window.location.href = authUrl;
    }


    return (
        <div className="container d-flex flex-column align-items-center min-vh-100">
            <Toast ref={toast} />
            <Card className="p-4 shadow-lg w-100 mb-4" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-3">Управление токеном</h2>
                <p className="text-muted text-center">
                    Вы можете сгенерировать новый токен ЮMoney для выплаты продавцам.
                </p>

                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />
                    <small>Перегенерируйте токен <strong>только если он перестал работать</strong>.</small>
                </div>

                <Button
                    className="btn btn-danger w-100 mt-3"
                    onClick={handleUpdateToken}
                    disabled={loading}
                >
                    {loading ? "Обновление..." : (
                        <>
                            <FontAwesomeIcon icon={faSync} className="me-2" /> Обновить токен
                        </>
                    )}
                </Button>
            </Card>

            {/*<Card className="p-4 shadow-lg w-100" style={{ maxWidth: "800px" }}>*/}
            {/*    <h4 className="text-center mb-3">Логи использования токена</h4>*/}
            {/*    <DataTable value={logs} paginator rows={5} emptyMessage="Логов пока нет.">*/}
            {/*        <Column field="created_at" header="Дата" />*/}
            {/*        <Column field="message" header="Сообщение" />*/}
            {/*        <Column field="status" header="Статус" body={statusTemplate} />*/}
            {/*    </DataTable>*/}
            {/*</Card>*/}
        </div>
    );
};

export default AdminToken;
