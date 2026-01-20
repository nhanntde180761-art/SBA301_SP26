// 1. Khởi tạo trạng thái ban đầu (Initial State)
export const initialState = {
  user: null,           // Lưu thông tin người dùng (name, email, role...)
  isAuthenticated: false, // Trạng thái đã đăng nhập hay chưa
  loading: false,       // Trạng thái đang xử lý (hiện loading spinner)
  error: null,          // Lưu thông tin lỗi nếu đăng nhập thất bại
};

// 2. Định nghĩa hàm Reducer
const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload, // payload thường chứa object { username: 'admin', ... }
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload, // payload chứa thông báo lỗi
      };

    case 'LOGOUT':
      return {
        ...initialState, // Trả về trạng thái trắng ban đầu
      };

    default:
      // Nếu không khớp với action nào, trả về state hiện tại
      return state;
  }
};

export default loginReducer;