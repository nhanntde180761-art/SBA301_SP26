import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Kiểm tra điều kiện ngay lúc nhập
  const isPasswordShort = password.length > 0 && password.length < 6;
  const isUsernameEmpty = username.trim() === '' && username.length > 0;

  const handleLogin = (e) => {
    e.preventDefault();

    // Cảnh báo nếu password quá ngắn trước khi gửi
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (username === 'admin' && password === '123456') {
      setError('');
      alert('Đăng nhập thành công!');
      navigate('/orchids'); 
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng!');
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '380px' }} className="shadow border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 fw-bold text-primary">LOGIN</h2>
          
          {/* Cảnh báo lỗi tổng quát */}
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nhập tài khoản..."
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                isInvalid={isUsernameEmpty} // Hiện viền đỏ nếu rỗng
                required 
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng không để trống tài khoản.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nhập mật khẩu..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                isInvalid={isPasswordShort} // Hiện viền đỏ nếu quá ngắn
                required 
              />
              {/* Cảnh báo chi tiết dưới ô nhập liệu */}
              {isPasswordShort && (
                <Form.Text className="text-danger">
                  Mật khẩu phải đủ 6 ký tự.
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 fw-bold"
                disabled={isPasswordShort} // Khóa nút nếu chưa đủ 6 ký tự
              >
                Login
              </Button>
              <Button variant="outline-secondary" onClick={handleCancel} className="w-100">
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;