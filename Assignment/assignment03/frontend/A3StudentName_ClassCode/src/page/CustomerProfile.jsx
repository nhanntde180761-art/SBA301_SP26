import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';

const CustomerProfile = () => {
    const [profile, setProfile] = useState({ 
        id: '',
        customerFullName: '', 
        telephone: '', 
        emailAddress: '',
        customerBirthday: '' // 1. Thêm trường ngày sinh vào state
    });
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const userData = JSON.parse(userJson);
            setProfile({
                id: userData.id || userData.customerId,
                customerFullName: userData.customerFullName || '',
                telephone: userData.telephone || '',
                emailAddress: userData.emailAddress || '',
                customerBirthday: userData.customerBirthday || '' // Lấy ngày sinh từ user
            });
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        try {
            // Gửi dữ liệu cập nhật lên Backend
            await axiosClient.put('/customers/profile/update', profile);
            
            // CẬP NHẬT LẠI LOCALSTORAGE: Quan trọng để lưu giữ thông tin mới
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...profile };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ type: 'success', content: 'Cập nhật hồ sơ thành công!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', content: 'Lỗi cập nhật: ' + (err.response?.data || 'Server error') });
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-primary text-white p-3">
                            <h5 className="mb-0">Hồ sơ cá nhân</h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {message.content && (
                                <Alert variant={message.type} onClose={() => setMessage({type:'', content:''})} dismissible>
                                    {message.content}
                                </Alert>
                            )}

                            <Form onSubmit={handleUpdate}>
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Form.Label className="fw-bold">Họ tên</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            value={profile.customerFullName} 
                                            onChange={e => setProfile({...profile, customerFullName: e.target.value})} 
                                            required
                                        />
                                    </Col>
                                    
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-bold">Điện thoại</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            value={profile.telephone} 
                                            onChange={e => setProfile({...profile, telephone: e.target.value})} 
                                        />
                                    </Col>

                                    {/* 2. Thêm Input Ngày sinh */}
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-bold">Ngày sinh</Form.Label>
                                        <Form.Control 
                                            type="date"
                                            value={profile.customerBirthday} 
                                            onChange={e => setProfile({...profile, customerBirthday: e.target.value})} 
                                        />
                                    </Col>

                                    <Col md={12} className="mb-4">
                                        <Form.Label className="fw-bold text-muted">Email (Tài khoản - Không thể thay đổi)</Form.Label>
                                        <Form.Control 
                                            value={profile.emailAddress} 
                                            disabled 
                                            className="bg-light"
                                        />
                                    </Col>
                                </Row>
                                <div className="d-grid">
                                    <Button type="submit" variant="primary" size="lg">
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomerProfile;