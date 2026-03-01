import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const CustomerNavbar = () => {
    const navigate = useNavigate();

    // Giả sử ta lưu tên user trong localStorage sau khi login
    const customerName = localStorage.getItem('customerName') || 'Khách hàng';

    const handleLogout = () => {
        localStorage.clear(); // Xóa token/session
        navigate('/login');
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3">
            <Container>
                {/* Logo / Brand */}
                <Navbar.Brand as={Link} to="/home" className="fw-bold text-primary">
                    🏨 HOTEL-BOOKING
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto ms-lg-4">
                        <Nav.Link as={Link} to="/booking/create" className="px-3">
                            Đặt phòng ngay
                        </Nav.Link>
                        <Nav.Link as={Link} to="/booking/history" className="px-3">
                            Lịch sử đặt phòng
                        </Nav.Link>
                    </Nav>

                    {/* User Profile & Logout */}
                    <Nav>
                        <NavDropdown 
                            title={<span><i className="bi bi-person-circle me-1"></i> Chào, {customerName}</span>} 
                            id="basic-nav-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item as={Link} to="/customer/profile">
                                Thông tin cá nhân
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                Đăng xuất
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomerNavbar;