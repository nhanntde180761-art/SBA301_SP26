import { useReducer } from 'react';
import loginReducer, { initialState } from '../stores/login/loginReducer';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navigate = useNavigate();

  const performLogin = (username, password) => {
    // 1. Khởi động trạng thái loading
    dispatch({ type: 'LOGIN_START' });

    // 2. Xử lý logic đăng nhập (không dùng setTimeout nếu bạn muốn chạy ngay)
    if (username === 'admin' && password === '123456') {
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { name: 'Nguyễn Thành Nhân', role: 'Admin' } 
      });
      
      // Lưu vào localStorage để duy trì phiên làm việc
      localStorage.setItem('user', JSON.stringify({ name: 'Nguyễn Thành Nhân', isLogin: true }));
      
      // Điều hướng
      navigate('/orchids');
    } else {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Tài khoản hoặc mật khẩu không chính xác!' 
      });
    }
  };

  return { state, performLogin };
};

export default useLogin