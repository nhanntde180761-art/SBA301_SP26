import React, { useState } from 'react';
import { Navbar, Button, Nav, Card } from 'react-bootstrap';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Lấy đường dẫn hiện tại để đổi màu Sidebar

    const [user] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="dashboard-container">
            {/* Navbar chung */}
            <Navbar bg="dark" variant="dark" className="px-4 shadow-sm">
                <Navbar.Brand className="fw-bold">🏨 STAFF PORTAL</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <span className="text-light me-3">Chào, {user.customerFullName}</span>
                    <Button variant="outline-warning" size="sm" onClick={handleLogout}>Đăng xuất</Button>
                </Navbar.Collapse>
            </Navbar>

            <div className="d-flex">
                {/* Sidebar chung */}
                <div className="sidebar-column border-end shadow-sm p-3">
                    <Nav variant="pills" className="flex-column">
                        <Nav.Link
                            className={`sidebar-link ${location.pathname.includes('rooms') ? 'active' : ''}`}
                            onClick={() => navigate('/dashboard/rooms')}
                        >
                            🏨 Quản lý Phòng
                        </Nav.Link>
                        <Nav.Link
                            className={`sidebar-link ${location.pathname.includes('customers') ? 'active' : ''}`}
                            onClick={() => navigate('/dashboard/customers')}
                        >
                            👥 Khách hàng
                        </Nav.Link>
                        <Nav.Link
                            className={`sidebar-link ${location.pathname.includes('bookings') ? 'active' : ''}`}
                            onClick={() => navigate('/dashboard/bookings')}
                        >
                            📅 Đặt phòng
                        </Nav.Link>
                    </Nav>
                </div>

                {/* Vùng nội dung biến đổi */}
                <div className="content-column flex-grow-1">
                    <Card className="main-card">
                        <Card.Body>
                            {/* CÁC TRANG CON SẼ HIỆN Ở ĐÂY */}
                            <Outlet />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;