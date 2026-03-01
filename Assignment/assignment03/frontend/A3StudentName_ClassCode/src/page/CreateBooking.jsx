import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const CreateBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hàm format ngày sang YYYY-MM-DD để khớp với LocalDate của Java
    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [bookingDates, setBookingDates] = useState({ 
        startDate: formatDate(today), 
        endDate: formatDate(tomorrow) 
    });
    const [totalPrice, setTotalPrice] = useState(0);

    // 1. LẤY DỮ LIỆU PHÒNG TỪ TRANG HOME (SỬA Ở ĐÂY)
    useEffect(() => {
        if (location.state && location.state.room) {
            const r = location.state.room;
            console.log("Dữ liệu gốc từ Java:", r); // Để bạn kiểm tra trong F12

            // Chuẩn hóa dữ liệu: Tìm ID và Giá phòng dù Java đặt tên là gì
            const normalizedRoom = {
                ...r,
                id: r.id || r.roomId || r.roomID, // Tự tìm ID
                roomPrice: r.roomPrice || r.roomPricePerDay || r.actualPrice || 0
            };

            setSelectedRoom(normalizedRoom);
            setTotalPrice(normalizedRoom.roomPrice); 
        }
    }, [location.state]);

    // Tự động tính lại tổng tiền
    useEffect(() => {
        if (selectedRoom && selectedRoom.roomPrice && bookingDates.startDate && bookingDates.endDate) {
            const start = new Date(bookingDates.startDate);
            const end = new Date(bookingDates.endDate);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setTotalPrice(diffDays > 0 ? diffDays * selectedRoom.roomPrice : 0);
        }
    }, [bookingDates, selectedRoom]);

    const handleBooking = async () => {
        // 2. KIỂM TRA PHÒNG (SỬA Ở ĐÂY)
        if (!selectedRoom || !selectedRoom.id) {
            alert("Thông tin phòng không hợp lệ hoặc thiếu ID phòng từ Server!");
            return;
        }

        // 3. LẤY ID KHÁCH HÀNG (SỬA Ở ĐÂY)
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            alert("Vui lòng đăng nhập lại!");
            navigate('/login');
            return;
        }

        const userData = JSON.parse(userJson);
        const customerId = userData.id || userData.customerId || userData.customerID;

        if (!customerId) {
            alert("Không tìm thấy ID khách hàng. Vui lòng đăng nhập lại!");
            return;
        }

        setIsSubmitting(true);

        // 4. PAYLOAD CHUẨN ĐỂ GỬI QUA JAVA (SỬA Ở ĐÂY)
        const payload = {
            startDate: bookingDates.startDate,    // LocalDate
            endDate: bookingDates.endDate,        // LocalDate
            roomId: Number(selectedRoom.id),      // Integer
            totalAmount: Number(totalPrice),      // BigDecimal
            customerId: Number(customerId)        // Integer
        };

        console.log("Dữ liệu gửi đi:", payload);

        try {
            const response = await axiosClient.post('/bookings/create', payload);
            alert("🎉 Đặt phòng thành công!");
            navigate('/booking/history'); 
        } catch (err) {
            console.error("Lỗi từ Server:", err.response?.data);
            alert("❌ Lỗi: " + (err.response?.data || "Phòng đã có người đặt hoặc lỗi kết nối."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="bg-primary p-3 text-white text-center">
                    <h4 className="mb-0 fw-bold">XÁC NHẬN CHI TIẾT ĐẶT PHÒNG</h4>
                </div>
                
                <Card.Body className="p-4">
                    {selectedRoom ? (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-secondary">Ngày nhận phòng</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            min={formatDate(today)}
                                            value={bookingDates.startDate}
                                            onChange={(e) => {
                                                const newStart = e.target.value;
                                                const nextDay = new Date(newStart);
                                                nextDay.setDate(nextDay.getDate() + 1);
                                                setBookingDates({ 
                                                    startDate: newStart, 
                                                    endDate: formatDate(nextDay) 
                                                });
                                            }} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-secondary">Ngày trả phòng</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            min={formatDate(new Date(new Date(bookingDates.startDate).getTime() + 86400000))}
                                            value={bookingDates.endDate}
                                            onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Table hover responsive className="align-middle border mt-3">
                                <thead className="table-light text-uppercase small">
                                    <tr>
                                        <th>Thông tin phòng</th>
                                        <th className="text-center">Số đêm</th>
                                        <th className="text-end">Đơn giá/đêm</th>
                                        <th className="text-end">Tổng cộng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="fw-bold">Phòng số: {selectedRoom.roomNumber}</div>
                                            <div className="text-muted small">Loại: {selectedRoom.roomType}</div>
                                        </td>
                                        <td className="text-center">
                                            {selectedRoom.roomPrice > 0 ? (totalPrice / selectedRoom.roomPrice).toFixed(0) : 1} đêm
                                        </td>
                                        <td className="text-end">${selectedRoom.roomPrice?.toLocaleString()}</td>
                                        <td className="text-end fw-bold text-primary fs-5">
                                            ${totalPrice?.toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-between align-items-center mt-5 border-top pt-4">
                                <Button variant="outline-dark" onClick={() => navigate(-1)} className="px-4">
                                    Quay lại
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    className="px-5 fw-bold shadow" 
                                    onClick={handleBooking}
                                    disabled={isSubmitting || totalPrice <= 0}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            ĐANG XỬ LÝ...
                                        </>
                                    ) : (
                                        "XÁC NHẬN THANH TOÁN"
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <Alert variant="info">Dữ liệu phòng không hợp lệ hoặc trang bị tải lại (F5). Vui lòng chọn lại phòng!</Alert>
                            <Button variant="primary" onClick={() => navigate('/home')}>Xem danh sách phòng</Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateBooking;