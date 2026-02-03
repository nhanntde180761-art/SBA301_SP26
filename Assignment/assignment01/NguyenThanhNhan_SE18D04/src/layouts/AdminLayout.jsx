import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Sidebar -  */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">FU NEWS</div> {/*  Chèn logo AI của bạn vào đây */}
        </div>
        
        <nav className="nav-menu">
          <NavLink to="dashboard" className="nav-item-link">Dashboard</NavLink>
          <NavLink to="category" className="nav-item-link">Category</NavLink>
          <NavLink to="news" className="nav-item-link">News Management</NavLink>
          <NavLink to="users" className="nav-item-link">Users</NavLink>
          <NavLink to="settings" className="nav-item-link">Settings</NavLink>
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="btn btn-outline-light w-100 py-2" style={{borderRadius: '10px'}}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Wrapper -  */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="breadcrumb-text text-muted">System / Management</div>
          <div className="user-info">
            Welcome, <strong>Admin</strong>
          </div>
        </header>

        <main className="content-area">
          <div className="page-card">
            {/* Đây là nơi các trang News, Category hiển thị -  */}
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;