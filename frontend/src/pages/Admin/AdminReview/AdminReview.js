import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
    getReviewsWithReport,
    deleteReview,
    approveReport,
    rejectReport,
} from "../../../services/review";

const AdminReview = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getReviewsWithReport();
                setReports(response);
            } catch (error) {
                console.error("Ошибка при получении жалоб:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            if (newStatus === "approved") {
                await approveReport(id);

                const approvedComplaint = reports.find((r) => r.id === id);
                if (approvedComplaint) {
                    await deleteReview(approvedComplaint.reviewId);
                    console.log(`Отзыв ${approvedComplaint.reviewId} удален`);

                    // Удаляем все жалобы на этот отзыв
                    setReports((prev) =>
                        prev.filter((r) => r.reviewId !== approvedComplaint.reviewId)
                    );
                }
            } else if (newStatus === "rejected") {
                await rejectReport(id);

                // Обновляем статус у конкретной жалобы
                setReports((prev) =>
                    prev.map((r) =>
                        r.id === id ? { ...r, status: "rejected" } : r
                    )
                );
            }
        } catch (error) {
            console.error("Ошибка при смене статуса:", error);
        }
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <span
                className={`badge bg-${
                    rowData.status === "pending"
                        ? "warning"
                        : rowData.status === "approved"
                            ? "success"
                            : "danger"
                }`}
            >
                {rowData.status}
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-2">
                {rowData.status === "pending" && (
                    <>
                        <Button
                            icon="pi pi-check"
                            className="p-button-success p-button-sm"
                            onClick={() => handleStatusChange(rowData.id, "approved")}
                        />
                        <Button
                            icon="pi pi-times"
                            className="p-button-danger p-button-sm"
                            onClick={() => handleStatusChange(rowData.id, "rejected")}
                        />
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Жалобы на отзывы</h2>

            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <DataTable
                    value={reports}
                    paginator
                    rows={5}
                    sortField="createdAt"
                    sortOrder={-1}
                    className="p-datatable-striped"
                >
                    <Column field="id" header="ID" sortable />
                    <Column field="reason" header="Текст" />
                    <Column field="createdAt" header="Дата" sortable />
                    <Column header="Статус" body={statusBodyTemplate} sortable />
                    <Column field="reviewId" header="ID Отзыва" />
                    <Column field="userId" header="ID Пользователя" />
                    <Column header="Действия" body={actionBodyTemplate} />
                </DataTable>
            )}
        </div>
    );
};

export default AdminReview;
