import React, { useEffect, useState } from 'react';
import { Table, Badge, Card, Container, Spinner, Alert } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';

const BookingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // 1. Lấy thông tin user từ localStorage
                const userJson = localStorage.getItem('user');
                if (!userJson) {
                    setError("Vui lòng đăng nhập để xem lịch sử!");
                    setLoading(false);
                    return;
                }

                const userData = JSON.parse(userJson);
                // Tìm ID (thử mọi trường hợp tên biến: id, customerId, customerID)
                const cId = userData.id || userData.customerId || userData.customerID;

                if (!cId) {
                    setError("Không tìm thấy mã khách hàng!");
                    setLoading(false);
                    return;
                }

                // 2. Gọi API lấy lịch sử theo ID khách hàng
                // Lưu ý: Đường dẫn này phải khớp với @GetMapping trong Controller của bạn
                const res = await axiosClient.get(`/customers/${cId}`);
                
                // Đảm bảo dữ liệu nhận được là mảng
                setHistory(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Lỗi lấy lịch sử:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu lịch sử!");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <Container className="text-center p-5"><Spinner animation="border" /></Container>;

    return (
        <div className="p-4">
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-dark text-white p-3">
                    <h5 className="mb-0">Lịch sử đặt phòng của bạn</h5>
                </Card.Header>
                <Card.Body>
                    {error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : history.length === 0 ? (
                        <Alert variant="info">Bạn chưa có đơn đặt phòng nào.</Alert>
                    ) : (
                        <Table hover responsive className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Phòng</th>
                                    <th>Nhận phòng</th>
                                    <th>Trả phòng</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(b => (
                                    <tr key={b.id || b.bookingId}>
                                        <td className="fw-bold">#{b.id || b.bookingId}</td>
                                        <td>{b.bookingDate}</td>
                                        <td>Phòng {b.roomNumber}</td>
                                        <td>{b.startDate}</td>
                                        <td>{b.endDate}</td>
                                        <td>
                                            <Badge bg={b.bookingStatus === 2 ? "success" : b.bookingStatus === 3 ? "danger" : "warning"}>
                                                {b.bookingStatus === 2 ? "Đã chấp nhận" : b.bookingStatus === 3 ? "Đã từ chối" : "Đang chờ"}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default BookingHistory;