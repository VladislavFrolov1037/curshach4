import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputNumber} from "primereact/inputnumber";
import {Calendar} from "primereact/calendar";
import {Toast} from "primereact/toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import {generatePromoCode, getPromoCodes} from "../../../services/admin";
import Loader from "../../../components/Loader";

const AdminPromoCode = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [creating, setCreating] = useState(false);
    const toast = useRef(null);

    const [newPromo, setNewPromo] = useState({
        discount: 10,
        maxUses: 100,
        expiresAt: null,
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        setLoading(true);
        try {
            setPromoCodes(await getPromoCodes());
        } catch (error) {
            console.error("Ошибка при получении промокодов:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePromoCode = async () => {
        setCreating(true);
        try {
            const response = await generatePromoCode(newPromo);

            setPromoCodes([...promoCodes, response]);
            setShowDialog(false);
            setNewPromo({discount: 10, maxUses: 100, expiresAt: null});

            toast.current.show({severity: "success", summary: "Успех", detail: "Промокод создан!", life: 3000});
        } catch (error) {
            console.error("Ошибка при генерации промокода:", error);
            toast.current.show({
                severity: "error",
                summary: "Ошибка",
                detail: "Не удалось создать промокод",
                life: 3000
            });
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return <Loader/>;
    }

    return (
        <div className="container mt-4">
            <Toast ref={toast}/>
            <h3>Управление промокодами</h3>
            <Button label="Сгенерировать промокод" icon="pi pi-plus" onClick={() => setShowDialog(true)}
                    className="mb-3"/>

            <DataTable value={promoCodes} loading={loading} responsiveLayout="scroll">
                <Column field="code" header="Промокод"/>
                <Column field="discount" header="Скидка (%)"/>
                <Column field="maxUses" header="Макс. количество использований"/>
                <Column field="usedCount" header="Использовано"/>
                <Column field="expiresAt" header="Дата окончания"/>
                <Column field="createdAt" header="Дата создания"/>
            </DataTable>

            <Dialog header="Создание промокода" visible={showDialog} style={{width: "400px"}}
                    onHide={() => setShowDialog(false)}>
                <div className="p-fluid">
                    <label className="mt-3">Скидка (%)</label>
                    <InputNumber value={newPromo.discount}
                                 onValueChange={(e) => setNewPromo({...newPromo, discount: e.value})} min={1}
                                 max={100}/>

                    <label className="mt-3">Макс. использований</label>
                    <InputNumber value={newPromo.maxUses}
                                 onValueChange={(e) => setNewPromo({...newPromo, maxUses: e.value})} min={1}/>

                    <label className="mt-3">Дата окончания</label>
                    <Calendar value={newPromo.expiresAt}
                              onChange={(e) => setNewPromo({...newPromo, expiresAt: e.value})} showIcon
                              dateFormat="dd.mm.yy" selectionMode="single"/>

                    <Button label="Создать" icon="pi pi-check" className="mt-4"
                            onClick={handleGeneratePromoCode} disabled={creating}/>
                </div>
            </Dialog>
        </div>
    );
};

export default AdminPromoCode;
