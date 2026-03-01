import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';
import RoomDetailModal from '../component/RoomDetailModal.jsx';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await axiosClient.get('/rooms');
                setRooms(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleShowDetail = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5 fw-bold">DANH SÁCH PHÒNG</h2>
            <Row>
                {rooms.map((room) => (
                    <Col key={room.id || room.roomNumber} xs={12} md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Img 
                                variant="top" 
                                src={room.image || 'https://www.bing.com/th/id/OIP.3qmjwCYDNX2cqUUFToQbKwHaEJ?w=193&h=135&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2'} 
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>Phòng {room.roomNumber}</Card.Title>
                                <Card.Text className="text-primary fw-bold">${room.roomPrice} / đêm</Card.Text>
                                <Button variant="primary" className="w-100" onClick={() => handleShowDetail(room)}>
                                    Xem chi tiết
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <RoomDetailModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                room={selectedRoom} 
            />
        </Container>
    );
};

export default Home;