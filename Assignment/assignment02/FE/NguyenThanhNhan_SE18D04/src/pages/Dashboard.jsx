import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalNews: 0,
        totalCats: 0,
        totalUsers: 0,
        totalTags: 0
    });
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = "http://localhost:8080/api";

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Lấy tất cả dữ liệu từ Backend
                const [newsRes, catRes, userRes, tagRes] = await Promise.all([
                    axios.get(`${API_BASE}/news-articles`),
                    axios.get(`${API_BASE}/categories`),
                    axios.get(`${API_BASE}/users`),
                    axios.get(`${API_BASE}/tags`)
                ]);

                // 1. Cập nhật số liệu thống kê
                setStats({
                    totalNews: newsRes.data.length,
                    totalCats: catRes.data.length,
                    totalUsers: userRes.data.length,
                    totalTags: tagRes.data.length
                });

                // 2. Lấy 5 tin tức mới nhất (Sắp xếp theo ID giảm dần)
                const sortedNews = [...newsRes.data].sort((a, b) => b.id - a.id);
                setLatestNews(sortedNews.slice(0, 5));

            } catch (err) {
                console.error("Dashboard Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        { label: 'Tổng bài viết', value: stats.totalNews, color: 'blue', icon: 'bi-journal-text' },
        { label: 'Danh mục', value: stats.totalCats, color: 'orange', icon: 'bi-grid' },
        { label: 'Người dùng', value: stats.totalUsers, color: 'green', icon: 'bi-people' },
        { label: 'Thẻ (Tags)', value: stats.totalTags, color: 'purple', icon: 'bi-tags' }
    ];

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="grow" variant="primary" />
        </div>
    );

    return (
        <div className="dashboard-wrapper p-4">
            {/* Header */}
            <div className="welcome-section mb-5">
                <h1 className="fw-bold text-dark mb-1">Dashboard</h1>
                <p className="text-secondary">
                    Hệ thống đang hoạt động với <span className="text-primary fw-bold">{stats.totalNews}</span> bài viết.
                </p>
            </div>

            {/* Thẻ thống kê số liệu thật */}
            <Row className="g-4 mb-5">
                {cards.map((item, i) => (
                    <Col key={i} lg={3} md={6}>
                        <div className={`premium-card card-${item.color} shadow-sm border-0`}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <span className="card-label">{item.label}</span>
                                    <h2 className="card-value mt-2 mb-0">{item.value}</h2>
                                </div>
                                <i className={`bi ${item.icon} fs-1 opacity-25`}></i>
                            </div>
                            <div className="card-progress mt-3">
                                <div className="progress-bar" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            <Row className="g-4">
                {/* Phần Tin tức mới cập nhật lấy từ API */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm custom-radius p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Tin tức mới cập nhật</h5>
                            <Badge bg="primary-subtle" className="text-primary px-3 py-2 rounded-pill">
                                Real-time Data
                            </Badge>
                        </div>
                        <div className="news-feed-list">
                            {latestNews.length > 0 ? latestNews.map((news) => (
                                <div key={news.id} className="news-item-premium d-flex align-items-center py-3 border-bottom">
                                    <div className="item-status-indicator me-3"></div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h6 className="mb-0 fw-bold text-dark text-truncate">{news.newsTitle}</h6>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="text-primary small fw-semibold">
                                                {news.category?.categoryName || 'General'}
                                            </span>
                                            <span className="text-muted small">•</span>
                                            <span className="text-muted small">
                                                By: {news.createdBy?.accountName || 'System'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ms-3 text-end">
                                        <Badge pill bg={news.newsStatus ? "success" : "secondary"} className="mb-1 d-block">
                                            {news.newsStatus ? "Published" : "Draft"}
                                        </Badge>
                                        <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                                            ID: #{news.id}
                                        </small>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-5 text-muted">Chưa có dữ liệu bài viết.</div>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Sidebar Thống kê nhanh */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm custom-radius p-4 bg-dark text-white h-100">
                        <h5 className="fw-bold mb-4">Hệ thống News</h5>
                        <div className="mb-4">
                            <small className="opacity-50 text-uppercase d-block mb-2">Tình trạng Server</small>
                            <div className="d-flex align-items-center">
                                <div className="spinner-grow spinner-grow-sm text-success me-2"></div>
                                <span className="text-success fw-bold">Online</span>
                            </div>
                        </div>
                        <hr className="opacity-25" />
                        <p className="small opacity-75 mt-auto mb-0">
                            Phần mềm quản lý tin tức (News Management System) - v1.0.26
                        </p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;