import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Badge, Modal, Spinner, Card } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Quản lý Modal
    const [modalConfig, setModalConfig] = useState({
        show: false,
        bookingId: null,
        newStatus: null,
        statusText: '',
        isProcessing: false,
        isSuccess: false
    });

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/bookings');
            const dataArray = Array.isArray(res.data) ? res.data : (res.data.bookingReservations || []);
            setBookings(dataArray);
        } catch (err) {
            console.error("Lỗi fetch:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    // 1. Mở Form xác nhận (Thay cho confirm local)
    const openConfirmModal = (id, status, text) => {
        setModalConfig({
            show: true,
            bookingId: id,
            newStatus: status,
            statusText: text,
            isProcessing: false,
            isSuccess: false
        });
    };

    // 2. Xử lý gửi API
    const handleAction = async () => {
        setModalConfig(prev => ({ ...prev, isProcessing: true }));
        try {
            await axiosClient.post(`/bookings/update-status/${modalConfig.bookingId}`, null, {
                params: { status: modalConfig.newStatus }
            });

            // Cập nhật danh sách local
            setBookings(prev => prev.map(b => 
                b.bookingId === modalConfig.bookingId ? { ...b, status: modalConfig.newStatus } : b
            ));

            // Chuyển Modal sang trạng thái thành công (Thay cho alert local)
            setModalConfig(prev => ({ ...prev, isProcessing: false, isSuccess: true }));
        } catch (err) {
            setModalConfig(prev => ({ ...prev, show: false }));
            console.error(err);
        }
    };

    const closeModal = () => setModalConfig({ ...modalConfig, show: false });

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <div className="p-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between">
                    <h5 className="mb-0">Quản lý Đặt phòng</h5>
                    <Button variant="outline-light" size="sm" onClick={fetchBookings}>Làm mới</Button>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive className="align-middle">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Phòng</th>
                                <th>Khách hàng</th>
                                <th>Thời gian</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b.bookingId}>
                                    <td><b>#{b.bookingId}</b></td>
                                    <td><Badge bg="secondary">{b.roomNumber}</Badge></td>
                                    <td>{b.customerName}</td>
                                    <td><small>{b.startDate} → {b.endDate}</small></td>
                                    <td className="text-center">
                                        {b.status === 1 && <Badge bg="warning" text="dark">Chờ duyệt</Badge>}
                                        {b.status === 2 && <Badge bg="success">Đã nhận</Badge>}
                                        {b.status === 3 && <Badge bg="danger">Từ chối</Badge>}
                                    </td>
                                    <td className="text-center">
                                        {b.status === 1 ? (
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button variant="success" size="sm" onClick={() => openConfirmModal(b.bookingId, 2, 'CHẤP NHẬN')}>Duyệt</Button>
                                                <Button variant="danger" size="sm" onClick={() => openConfirmModal(b.bookingId, 3, 'TỪ CHỐI')}>Từ chối</Button>
                                            </div>
                                        ) : <small className="text-muted">Đã xử lý</small>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* MODAL THÔNG BÁO DẠNG FORM (THAY THẾ TOÀN BỘ LOCAL ALERT/CONFIRM) */}
            <Modal show={modalConfig.show} onHide={closeModal} centered>
                <Modal.Header closeButton={!modalConfig.isProcessing}>
                    <Modal.Title>{modalConfig.isSuccess ? "Thành công" : "Xác nhận thao tác"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    {modalConfig.isProcessing ? (
                        <>
                            <Spinner animation="border" variant="primary" className="mb-3" />
                            <p>Đang gửi yêu cầu lên hệ thống...</p>
                        </>
                    ) : modalConfig.isSuccess ? (
                        <>
                            <div className="display-4 text-success mb-3">✔</div>
                            <h5>Thao tác hoàn tất!</h5>
                            <p>Đơn đặt phòng <b>#{modalConfig.bookingId}</b> đã được cập nhật.</p>
                        </>
                    ) : (
                        <p>Bạn có chắc chắn muốn <b className={modalConfig.newStatus === 2 ? "text-success" : "text-danger"}>{modalConfig.statusText}</b> đơn đặt phòng này không?</p>
                    )}
                </Modal.Body>
                {!modalConfig.isProcessing && (
                    <Modal.Footer className="justify-content-center border-0">
                        {modalConfig.isSuccess ? (
                            <Button variant="dark" onClick={closeModal} className="px-5">Đóng</Button>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={closeModal}>Hủy</Button>
                                <Button variant="primary" onClick={handleAction} className="px-4">Xác nhận</Button>
                            </>
                        )}
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

export default BookingManagement;