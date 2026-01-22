import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useLogin } from '../hooks/useLogin';

function Login() {
  // 1. Gom các trường nhập liệu vào một đối tượng duy nhất
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [validated, setValidated] = useState(false);
  const { state, performLogin } = useLogin();

  // 2. Hàm xử lý thay đổi input dùng chung cho tất cả các field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    // Truyền cả đối tượng formData vào hàm xử lý login
    performLogin(formData.username, formData.password);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-lg border-0">
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold text-primary">WELCOME</h2>

          {state.error && <Alert variant="danger" className="text-center">{state.error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                required
                name="username" // Thêm thuộc tính name để mapping với object
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                required
                name="password" // Thêm thuộc tính name để mapping với object
                type="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 fw-bold" 
              disabled={state.loading}
            >
              {state.loading ? <Spinner animation="border" size="sm" /> : 'ĐĂNG NHẬP'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;