import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link ở đây
import axiosClient from '../api/axiosClient';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        emailAddress: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosClient.post('/login', credentials);

            if (response.status === 200) {
                const userData = response.data;
                localStorage.setItem('user', JSON.stringify(userData));

                const userRole = userData.customerRole; 

                if (userRole === "Staff") {
                    navigate('/dashboard'); 
                } else {
                    navigate('/home'); 
                }
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError("Sai email hoặc mật khẩu!");
            } else {
                setError("Lỗi kết nối đến Server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="shadow-sm border-0">
                <Card.Body className="p-4">
                    <h3 className="text-center mb-4 fw-bold text-primary">Đăng Nhập</h3>
                    
                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="emailAddress"
                                placeholder="name@example.com"
                                value={credentials.emailAddress}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 fw-bold mb-3" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                        </Button>

                        {/* PHẦN THÊM MỚI: NÚT TẠO TÀI KHOẢN */}
                        <div className="text-center mt-3">
                            <span className="text-muted small">Chưa có tài khoản? </span>
                            <Link to="/register" className="text-decoration-none small fw-bold">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;