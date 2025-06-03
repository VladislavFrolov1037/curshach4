import React, {useState, useEffect} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
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
    const [expandedRows, setExpandedRows] = useState(null);

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

    const confirmStatusChange = (id, newStatus) => {
        const message = newStatus === "approved"
            ? "Вы уверены, что хотите одобрить жалобу и удалить отзыв?"
            : "Вы уверены, что хотите отклонить жалобу?";

        confirmDialog({
            message,
            header: "Подтверждение действия",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => handleStatusChange(id, newStatus),
            rejectLabel: "Отмена"
        });
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            if (newStatus === "approved") {
                await approveReport(id);

                const approvedComplaint = reports.find((r) => r.id === id);
                if (approvedComplaint) {
                    await deleteReview(approvedComplaint.review.id);
                    console.log(`Отзыв ${approvedComplaint.review.id} удален`);

                    setReports((prev) =>
                        prev.filter((r) => r.review.id !== approvedComplaint.review.id)
                    );
                }
            } else if (newStatus === "rejected") {
                await rejectReport(id);

                setReports((prev) =>
                    prev.map((r) =>
                        r.id === id ? {...r, status: "rejected"} : r
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
                {rowData.status === "pending" ? "ожидает" : rowData.status === "approved" ? "одобрена" : "отклонена"}
            </span>
        );
    };

    const reviewBodyTemplate = (rowData) => {
        return rowData.review.comment ? (
            <span>
                {rowData.review.comment}
            </span>
        ) : (
            "N/A"
        );
    }

    const reviewGradeBodyTemplate = (rowData) => {
        return rowData.review.rating ? (
            <span>
                {rowData.review.rating}
            </span>
        ) : (
            "N/A"
        );
    }

    const reviewReportBodyTemplate = (rowData) => {
        return rowData.reason ? (
            <span>
                {rowData.reason}
            </span>
        ) : (
            "N/A"
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-2">
                {rowData.status === "pending" && (
                    <>
                        <Button
                            icon="pi pi-check"
                            className="p-button-success p-button-sm"
                            onClick={() => confirmStatusChange(rowData.id, "approved")}
                            tooltip="Одобрить жалобу и удалить отзыв"
                            tooltipOptions={{position: 'top'}}
                        />
                        <Button
                            icon="pi pi-times"
                            className="p-button-danger p-button-sm"
                            onClick={() => confirmStatusChange(rowData.id, "rejected")}
                            tooltip="Отклонить жалобу"
                            tooltipOptions={{position: 'top'}}
                        />
                    </>
                )}
            </div>
        );
    };

    const productLinkTemplate = (rowData) => {
        return rowData.review.product ? (
            <Link to={`/product/${rowData.review.product.id}`} target="_blank">
                {rowData.review.product.id}
            </Link>
        ) : (
            "N/A"
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <div className="row">
                    <div className="col-md-6">
                        <h5>Текст жалобы</h5>
                        <div className="p-3 bg-light rounded">
                            {data.reason || "Текст жалобы отсутствует"}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h5>Текст отзыва</h5>
                        <div className="p-3 bg-light rounded">
                            {data.review.text || "Текст отзыва отсутствует"}
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <h5>Информация о пользователе</h5>
                        <div className="p-3 bg-light rounded">
                            <p><strong>ID пользователя:</strong> {data.userId}</p>
                            <p><strong>ID отзыва:</strong> {data.review.id}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h5>Информация о товаре</h5>
                        <div className="p-3 bg-light rounded">
                            <p><strong>ID товара:</strong> {data.review.product?.id || "N/A"}</p>
                            <p><strong>Название товара:</strong> {data.review.product?.name || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-4">
            <ConfirmDialog/>
            <h2 className="mb-4">Жалобы на отзывы</h2>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <i className="pi pi-spinner pi-spin" style={{fontSize: '2rem'}}></i>
                </div>
            ) : reports.length === 0 ? (
                <div className="alert alert-info">Нет жалоб на отзывы</div>
            ) : (
                <DataTable
                    value={reports}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    sortField="createdAt"
                    sortOrder={-1}
                    className="p-datatable-striped"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column expander style={{width: '3em'}}/>
                    <Column field="id" header="ID жалобы" sortable/>
                    <Column
                        field="createdAt"
                        header="Дата жалобы"
                        sortable
                        body={(rowData) => new Date(rowData.createdAt).toLocaleString()}
                    />
                    <Column
                        header="Статус"
                        body={statusBodyTemplate}
                        sortable
                        style={{width: '120px'}}
                    />
                    <Column
                        header="Отзыв"
                        body={reviewBodyTemplate}
                        style={{width: '120px'}}
                    />
                    <Column
                        header="Оценка"
                        body={reviewGradeBodyTemplate}
                        style={{width: '120px'}}
                    />
                    <Column
                        header="ID товара"
                        body={productLinkTemplate}
                        style={{width: '100px'}}
                    />
                    <Column
                        header="Жалоба"
                        body={reviewReportBodyTemplate}
                        style={{width: '120px'}}
                    />
                    <Column
                        header="Действия"
                        body={actionBodyTemplate}
                        style={{width: '120px'}}
                    />
                </DataTable>
            )}
        </div>
    );
};

export default AdminReview;