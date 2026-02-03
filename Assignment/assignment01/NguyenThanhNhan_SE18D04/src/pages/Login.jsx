import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, Button, InputGroup } from 'react-bootstrap'; // Dùng thêm các component của Bootstrap
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();

  const onLogin = (data) => {
    clearErrors('auth');
    if (data.username === 'Admin' && data.password === 'Admin') {
      localStorage.setItem('role', '1');
      navigate('/admin/dashboard');
    } else {
      setError('auth', { type: 'manual', message: 'Tài khoản hoặc mật khẩu không đúng!' });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card shadow-lg">
        <div className="login-header text-center">
          <div className="ai-logo">FU</div> 
          <h2 className="fw-bold">FUNews</h2>
          <p className="text-muted">Welcome back! Please login to your account.</p>
        </div>
        
        <Form onSubmit={handleSubmit(onLogin)} className="login-form">
          {/* Cảnh báo lỗi đăng nhập tổng quát */}
          {errors.auth && (
            <div className="alert alert-danger shadow-sm shake-animation py-2" role="alert">
              <small>{errors.auth.message}</small>
            </div>
          )}

          {/* Username Group */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Username</Form.Label>
            <InputGroup hasValidation>
              <Form.Control 
                type="text" 
                placeholder="Enter Admin"
                isInvalid={!!errors.username || !!errors.auth}
                {...register('username', { required: 'Username cannot be empty!' })} 
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          
          {/* Password Group */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control 
                type="password" 
                placeholder="Enter Admin"
                isInvalid={!!errors.password || !!errors.auth}
                {...register('password', { required: 'Password cannot be empty!' })} 
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Options: Remember Me & Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Check 
              type="checkbox" 
              label={<small className="text-muted">Remember me</small>} 
              id="remember-me"
            />
            <a href="#" className="text-decoration-none small text-primary fw-bold">Forgot password?</a>
          </div>
          
          <Button variant="primary" type="submit" className="w-100 btn-login-submit py-2 fw-bold shadow-sm">
            Login Now
          </Button>
          
          <div className="login-footer text-center mt-4">
            <p className="text-muted small">Don't have an account? <a href="#" className="text-primary fw-bold text-decoration-none">Contact Admin</a></p>
            <hr className="opacity-10" />
            <small className="text-muted">© 2026 News Management System</small>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;