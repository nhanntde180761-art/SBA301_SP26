import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  
  // 1. Lấy dữ liệu user từ sessionStorage (ss)
  const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const role = userData.accountRole; // 1: Admin, 2: Staff
  const userName = userData.accountName || 'User';

  const handleLogout = () => {
    // Xóa sạch session và về trang login
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">FU NEWS</div>
          <div className="role-badge">{role === 1 ? 'ADMIN' : 'STAFF'}</div>
        </div>
        
        <nav className="nav-menu">
          {/* Link Dashboard linh hoạt theo role */}
          <NavLink to="dashboard" className="nav-item-link">Dashboard</NavLink>
          
          {/* CHỈ HIỂN THỊ NẾU LÀ ADMIN (ROLE 1) */}
          {role === 1 && (
            <>
              <NavLink to="category" className="nav-item-link">Category</NavLink>
              <NavLink to="users" className="nav-item-link">Users Management</NavLink>
          <NavLink to="tag" className="nav-item-link">Tag Management</NavLink>
            </>
          )}

          {/* DÙNG CHUNG CHO CẢ 2 */}
          <NavLink to="news" className="nav-item-link">News Management</NavLink>
          <NavLink to="settings" className="nav-item-link">Settings</NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout-custom">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="breadcrumb-text text-muted">
            {role === 1 ? 'Admin Panel' : 'Staff Portal'} / {userName}
          </div>
          <div className="user-info">
            Welcome, <strong>{userName}</strong>
          </div>
        </header>

        <main className="content-area">
          <div className="page-card">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;