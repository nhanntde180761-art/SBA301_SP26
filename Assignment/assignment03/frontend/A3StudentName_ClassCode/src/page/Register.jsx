import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Register = () => {
    const [formData, setFormData] = useState({ customerFullName: '', telephone: '', emailAddress: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post('/customers/register', formData);
            setMsg({ type: 'success', text: 'Đăng ký thành công! Đang chuyển hướng...' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMsg({ type: 'danger', text: 'Đăng ký thất bại, email có thể đã tồn tại.' });
        } finally { setLoading(false); }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }} className="shadow border-0">
                <Card.Body>
                    <h3 className="text-center mb-4 text-primary">Đăng ký Tài khoản</h3>
                    {msg.text && <Alert variant={msg.type}>{msg.text}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và Tên</Form.Label>
                            <Form.Control type="text" required onChange={e => setFormData({...formData, customerFullName: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control type="text" required onChange={e => setFormData({...formData, telephone: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required onChange={e => setFormData({...formData, emailAddress: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" required onChange={e => setFormData({...formData, password: e.target.value})} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : 'Đăng ký ngay'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;