import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();

  const onLogin = async (data) => {
    clearErrors('auth');
    setLoading(true);

    try {
      // Gọi API Login (Lưu ý: URL phải khớp với Controller của bạn)
      const response = await axios.post("http://localhost:8080/api/login", {
        accountEmail: data.email,
        accountPassword: data.password
      });

      if (response.data) {
        const user = response.data;
        // Lưu vào sessionStorage để truy xuất ở các trang khác
        sessionStorage.setItem('user', JSON.stringify(user));
        
        // Điều hướng dựa trên Role (Giả định Role 1 là Admin, 2 là Staff)
        if (user.accountRole === 1) {
          navigate('/admin/dashboard');
        } else {
          navigate('/staff/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      if (status === 401) {
        setError('auth', { type: 'manual', message: 'Email hoặc mật khẩu không chính xác!' });
      } else {
        setError('auth', { type: 'manual', message: 'Lỗi kết nối server. Vui lòng thử lại sau!' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card shadow-lg">
        <div className="login-header text-center">
          <div className="ai-logo">FU</div> 
          <h2 className="fw-bold">FUNews</h2>
          <p className="text-muted">Chào mừng trở lại! Vui lòng đăng nhập.</p>
        </div>
        
        <Form onSubmit={handleSubmit(onLogin)} className="login-form">
          {errors.auth && (
            <div className="alert alert-danger shadow-sm shake-animation py-2" role="alert">
              <small>{errors.auth.message}</small>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Email Address</Form.Label>
            <InputGroup hasValidation>
              <Form.Control 
                type="email" 
                placeholder="example@funews.com"
                isInvalid={!!errors.email || !!errors.auth}
                {...register('email', { 
                  required: 'Email không được để trống!',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email không đúng định dạng!' }
                })} 
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control 
                type="password" 
                placeholder="Enter password"
                isInvalid={!!errors.password || !!errors.auth}
                {...register('password', { required: 'Mật khẩu không được để trống!' })} 
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Check 
              type="checkbox" 
              label={<small className="text-muted">Ghi nhớ đăng nhập</small>} 
              id="remember-me"
            />
            <a href="#" className="text-decoration-none small text-primary fw-bold">Quên mật khẩu?</a>
          </div>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 btn-login-submit py-2 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Đăng nhập ngay"}
          </Button>
          
          <div className="login-footer text-center mt-4">
            <p className="text-muted small">Không có tài khoản? <a href="#" className="text-primary fw-bold text-decoration-none">Liên hệ Admin</a></p>
            <hr className="opacity-10" />
            <small className="text-muted">© 2026 News Management System</small>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;