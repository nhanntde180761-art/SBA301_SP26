import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-wrapper">
            {/* Header chào mừng kiểu mới */}
            <div className="welcome-section mb-5">
                <h1 className="fw-bold text-dark">Dashboard</h1>
                <p className="text-secondary">Chào mừng trở lại, <span className="text-primary fw-semibold">Thanh Nhân</span>. Đây là những gì đang diễn ra hôm nay.</p>
            </div>

            {/* Grid thông số kiểu High-Tech */}
            <Row className="g-4 mb-5">
                {[
                    { label: 'Tổng bài viết', value: '1,240', trend: '+12%', color: 'blue' },
                    { label: 'Lượt xem', value: '45.2K', trend: '+8%', color: 'purple' },
                    { label: 'Danh mục', value: '18', trend: '0%', color: 'orange' },
                    { label: 'Người dùng', value: '892', trend: '+5%', color: 'green' }
                ].map((item, i) => (
                    <Col key={i} lg={3} md={6}>
                        <div className={`premium-card card-${item.color}`}>
                            <span className="card-label">{item.label}</span>
                            <div className="card-value-row">
                                <h2 className="card-value">{item.value}</h2>
                                <span className="card-trend">{item.trend}</span>
                            </div>
                            <div className="card-progress">
                                <div className="progress-bar"></div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm custom-radius p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Tin tức mới cập nhật</h5>
                            <button className="btn btn-light btn-sm rounded-pill px-3">Xem tất cả</button>
                        </div>
                        <div className="list-group list-group-flush">
                            {[
                                { title: 'Lễ tốt nghiệp 2026', time: '2 giờ trước', cat: 'Sự kiện' },
                                { title: 'Thông báo học phí kỳ Spring', time: '5 giờ trước', cat: 'Học vụ' },
                                { title: 'Workshop AI & Future', time: '1 ngày trước', cat: 'Công nghệ' }
                            ].map((news, idx) => (
                                <div key={idx} className="list-item-premium d-flex align-items-center py-3">
                                    <div className="item-dot me-3"></div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-semibold">{news.title}</h6>
                                        <small className="text-muted">{news.cat} • {news.time}</small>
                                    </div>
                                    <div className="badge-status">Sẵn sàng</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;