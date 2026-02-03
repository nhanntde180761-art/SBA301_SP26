import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        accountName: '',
        accountEmail: '',
        accountPassword: '',
        mobile: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Lấy dữ liệu từ sessionStorage khi load trang
    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setFormData({
                accountName: userData.accountName || '',
                accountEmail: userData.accountEmail || '',
                accountPassword: userData.accountPassword || '',
                mobile: userData.mobile || ''
            });
        }
    }, []);

    // 2. Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Gọi API cập nhật thông tin
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Giả định API cập nhật user theo ID
            const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, formData);
            
            if (response.data) {
                // Cập nhật lại session storage và state
                sessionStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
            }
        } catch (err) {
            setMessage({ type: 'danger', text: 'Lỗi cập nhật thông tin!' });
        }
    };

    if (!user) return <div className="text-center mt-5">Vui lòng đăng nhập...</div>;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    {message.text && <Alert variant={message.type} onClose={() => setMessage({type:'', text:''})} dismissible>{message.text}</Alert>}
                    
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="profile-header bg-primary p-5 text-center text-white">
                            <div className="avatar-circle mb-3 mx-auto">
                                {user.accountName?.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="fw-bold">{user.accountName}</h3>
                            <Badge bg="light" text="dark" pill>
                                {user.accountRole === 1 ? 'Administrator' : 'Staff'}
                            </Badge>
                        </div>

                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0">Thông tin cá nhân</h5>
                                <Button 
                                    variant={isEditing ? "outline-secondary" : "outline-primary"} 
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? "Hủy bỏ" : "Chỉnh sửa"}
                                </Button>
                            </div>

                            <Form onSubmit={handleUpdate}>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Họ và tên</Form.Label>
                                            <Form.Control 
                                                name="accountName"
                                                value={formData.accountName}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={!isEditing ? "bg-light border-0" : ""}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Email</Form.Label>
                                            <Form.Control 
                                                value={formData.accountEmail}
                                                readOnly
                                                className="bg-light border-0"
                                            />
                                            <Form.Text className="text-muted">Email không thể thay đổi.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Số điện thoại</Form.Label>
                                            <Form.Control 
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={!isEditing ? "bg-light border-0" : ""}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Mật khẩu</Form.Label>
                                            <Form.Control 
                                                type="password"
                                                name="accountPassword"
                                                value={formData.accountPassword}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={!isEditing ? "bg-light border-0" : ""}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {isEditing && (
                                    <div className="text-end mt-4">
                                        <Button variant="primary" type="submit" className="px-5">
                                            Lưu thay đổi
                                        </Button>
                                    </div>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;