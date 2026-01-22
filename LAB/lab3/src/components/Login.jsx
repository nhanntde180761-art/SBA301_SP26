import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orchidService } from '../api/orchidapi'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ content: '', type: '' });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  // Kiểm tra tính hợp lệ cơ bản của form
  const isUsernameValid = username.trim() !== '';
  const isPasswordValid = password.length > 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!isUsernameValid || !isPasswordValid) {
      setMessage({ content: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!', type: 'danger' });
      return;
    }

    try {
      setLoading(true);
      // 1. Lấy danh sách users từ JSON Server
      const response = await orchidService.getUsers();
      const users = response.data;

      // 2. Tìm user khớp với username và password từ db.json
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        // Lưu thông tin người dùng vào localStorage để sử dụng cho các trang khác (nếu cần)
        localStorage.setItem('user', JSON.stringify(user));

        setMessage({ content: `Chào mừng ${user.name}! Đang đăng nhập...`, type: 'success' });
        
        // Chuyển hướng sau 1.2 giây
        setTimeout(() => {
          navigate('/orchids');
        }, 1200);
      } else {
        setMessage({ content: 'Tài khoản hoặc mật khẩu không đúng!', type: 'danger' });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setMessage({ content: 'Không thể kết nối với máy chủ dữ liệu!', type: 'danger' });
    } finally {
      setLoading(false);
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
      <Card style={{ width: '400px' }} className="shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="bg-primary p-4 text-center">
          <h2 className="text-white fw-bold m-0">LOGIN</h2>
        </div>
        <Card.Body className="p-4">
          
          {message.content && (
            <Alert variant={message.type} className="text-center py-2 small mb-4">
              {message.content}
            </Alert>
          )}
          
          <Form noValidate onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ví dụ: admin"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                isInvalid={validated && !isUsernameValid}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">Vui lòng nhập tài khoản.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nhập mật khẩu..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                isInvalid={validated && !isPasswordValid}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">Vui lòng nhập mật khẩu.</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg" className="fw-bold shadow-sm" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Đăng Nhập'}
              </Button>
              <Button variant="outline-secondary" onClick={handleCancel} disabled={loading}>
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