import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false); 
  const navigate = useNavigate();

  // Điều kiện kiểm tra
  const isUsernameValid = username.trim() !== '';
  const isPasswordValid = password.length >= 6;

  const handleLogin = (e) => {
    e.preventDefault();
    setValidated(true); // Bật trạng thái kiểm tra màu sắc

    if (!isUsernameValid || !isPasswordValid) {
      setError('Vui lòng kiểm tra lại thông tin nhập liệu!');
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
    setValidated(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '380px' }} className="shadow border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 fw-bold text-primary">LOGIN</h2>
          
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          
          <Form noValidate onSubmit={handleLogin}>
            {/* USERNAME */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nhập tài khoản..."
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                // Hiện đỏ nếu bấm login mà trống, hiện xanh nếu đã nhập
                isInvalid={validated && !isUsernameValid}
                isValid={validated && isUsernameValid}
                required 
              />
              <Form.Control.Feedback type="valid">Tên Tài khoản hợp lệ!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Vui lòng nhập tài khoản.</Form.Control.Feedback>
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nhập mật khẩu..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                // Hiện đỏ nếu password ngắn, hiện xanh nếu từ 6 ký tự trở lên
                isInvalid={validated && !isPasswordValid}
                isValid={validated && isPasswordValid}
                required 
              />
              <Form.Control.Feedback type="valid">Mật khẩu đủ độ dài!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Mật khẩu phải từ 6 ký tự.</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" className="w-100 fw-bold">Login</Button>
              <Button variant="outline-secondary" onClick={handleCancel} className="w-100">Cancel</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;