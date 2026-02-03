import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Quan trọng: Tạo file CSS này ở bước 2

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'Admin' && credentials.password === 'Admin') {
      localStorage.setItem('role', '1');
      navigate('/admin/dashboard');
    } else {
      alert('Tài khoản hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card shadow-lg">
        <div className="login-header">
          {/* Thay bằng Logo AI của bạn */}
          <div className="ai-logo">FU</div> 
          <h2>FUNews</h2>
          <p>Management System</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group-custom">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter Admin"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
              required 
            />
          </div>
          
          <div className="input-group-custom">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter Admin"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
              required 
            />
          </div>
          
          <button className="btn-login" type="submit">Login</button>
          
          <div className="login-footer">
            <small>© 2026 News Management System</small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;