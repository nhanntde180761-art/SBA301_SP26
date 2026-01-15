import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ content: '', type: '' }); // Lưu cả thông báo lỗi và thành công
  const [validated, setValidated] = useState(false); 
  const navigate = useNavigate();

  const isUsernameValid = username.trim() !== '';
  const isPasswordValid = password.length >= 6;

  const handleLogin = (e) => {
    e.preventDefault();
    setValidated(true);

    if (!isUsernameValid || !isPasswordValid) {
      setMessage({ content: 'Vui lòng kiểm tra các trường màu đỏ!', type: 'danger' });
      return;
    }

    // THAY THẾ alert() BẰNG LOGIC DƯỚI ĐÂY
    if (username === 'admin' && password === '123456') {
      setMessage({ content: 'Đăng nhập thành công! Đang chuyển hướng...', type: 'success' });
      
      // Đợi 1.5 giây để người dùng kịp nhìn thấy thông báo thành công rồi mới chuyển trang
      setTimeout(() => {
        navigate('/orchids');
      }, 1500);
      
    } else {
      setMessage({ content: 'Tài khoản hoặc mật khẩu không chính xác!', type: 'danger' });
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setMessage({ content: '', type: '' });
    setValidated(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="shadow-lg border-0 rounded-4">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 fw-bold text-primary">LOGIN</h2>
          
          {/* Hiển thị thông báo (Lỗi màu đỏ, Thành công màu xanh) ngay trên Card */}
          {message.content && (
            <Alert variant={message.type} className="text-center py-2 small">
              {message.content}
            </Alert>
          )}
          
          <Form noValidate onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nhập tài khoản..."
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                isInvalid={validated && !isUsernameValid}
                isValid={validated && isUsernameValid}
              />
              <Form.Control.Feedback type="invalid">Không được để trống.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nhập mật khẩu..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                isInvalid={validated && !isPasswordValid}
                isValid={validated && isPasswordValid}
              />
              <Form.Control.Feedback type="invalid">Mật khẩu tối thiểu 6 ký tự.</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg" className="fw-bold">
                Đăng Nhập
              </Button>
              <Button variant="link" onClick={handleCancel} className="text-muted text-decoration-none small">
                Hủy bỏ
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;