import React from 'react';
import { Modal, Button, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RoomDetailModal = ({ show, handleClose, room }) => {
    const navigate = useNavigate();

    if (!room) return null;

    const handleBookingClick = () => {
        // Gửi "gói hàng" tên là 'room' sang trang CreateBooking
        navigate('/booking/create', { state: { room: room } });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">Chi tiết Phòng {room.roomNumber}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Row>
                    <Col md={6}>
                        <img 
                            src={room.image || 'https://www.bing.com/th/id/OIP.3qmjwCYDNX2cqUUFToQbKwHaEJ?w=193&h=135&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2'} 
                            alt="Room" className="img-fluid rounded shadow-sm"
                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                    </Col>
                    <Col md={6}>
                        <h3 className="text-primary fw-bold">${room.roomPrice} / đêm</h3>
                        <Badge bg="info" className="mb-3">{room.roomType}</Badge>
                        <ListGroup variant="flush" className="mb-4">
                            <ListGroup.Item><b>Sức chứa:</b> {room.roomCapacity} người</ListGroup.Item>
                            <ListGroup.Item><b>Mô tả:</b> {room.roomDescription || "N/A"}</ListGroup.Item>
                            <ListGroup.Item><b>Ghi chú:</b> {room.roomNote || "N/A"}</ListGroup.Item>
                        </ListGroup>
                        <div className="d-grid">
                            <Button variant="primary" size="lg" className="fw-bold" onClick={handleBookingClick}>
                                ĐẶT PHÒNG NGAY
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default RoomDetailModal;