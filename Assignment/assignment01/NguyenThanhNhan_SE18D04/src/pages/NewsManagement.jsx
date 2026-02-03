import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import NewsModal from '../components/NewsModal';
import './NewsManagement.css'; // File CSS riêng cho News

const NewsManagement = () => {
    const [show, setShow] = useState(false);
    const [news, setNews] = useState([
        { id: 1, title: 'Khai giảng kỳ Spring 2026', categoryId: 1, status: 1, date: '2026-02-01' },
        { id: 2, title: 'Lễ tốt nghiệp đợt 1 2026', categoryId: 1, status: 1, date: '2026-02-03' }
    ]);
    const [selectedNews, setSelectedNews] = useState(null);

    const handleClose = () => setShow(false);
    
    const handleShowAdd = () => {
        setSelectedNews(null);
        setShow(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            setNews(news.filter(n => n.id !== id));
        }
    };

    return (
        <div className="news-page">
            {/* Header & Banner */}
            <div className="page-header-premium mb-4">
                <div className="banner-content-news shadow-sm">
                    <h2 className="fw-bold m-0">📰 News Management</h2>
                    <p className="text-muted m-0">Quản lý nội dung tin tức và bài viết hệ thống</p>
                </div>
                <Button className="btn-add-news" onClick={handleShowAdd}>
                    + Create Article
                </Button>
            </div>

            {/* Filter Section */}
            <Card className="filter-card shadow-sm border-0 mb-4">
                <Card.Body className="p-4">
                    <Form>
                        <Row className="g-3 align-items-end">
                            <Col lg={5}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">Tìm kiếm</Form.Label>
                                <Form.Control type="text" placeholder="Tìm theo tiêu đề..." className="premium-input" />
                            </Col>
                            <Col lg={3}>
                                <Form.Label className="small fw-bold text-muted text-uppercase">Danh mục</Form.Label>
                                <Form.Select className="premium-input">
                                    <option>Tất cả danh mục</option>
                                    <option>Education</option>
                                    <option>Events</option>
                                </Form.Select>
                            </Col>
                            <Col lg={4} className="d-flex gap-2">
                                <Button variant="dark" className="w-100 rounded-3 py-2 fw-bold shadow-sm">Lọc tin</Button>
                                <Button variant="outline-secondary" className="w-100 rounded-3 py-2 fw-bold">Làm mới</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Table Section */}
            <Card className="table-card shadow-sm border-0">
                <Card.Body className="p-0">
                    <Table hover responsive className="news-table mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Tiêu đề bài viết</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((item) => (
                                <tr key={item.id}>
                                    <td className="ps-4 text-muted">#{item.id}</td>
                                    <td>
                                        <div className="news-title-cell">{item.title}</div>
                                        <small className="text-muted">Education</small>
                                    </td>
                                    <td className="text-secondary">{item.date}</td>
                                    <td>
                                        <span className={`status-pill ${item.status === 1 ? 'active' : 'inactive'}`}>
                                            {item.status === 1 ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="news-actions">
                                            <button className="btn-action edit">Edit</button>
                                            <button className="btn-action delete" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <NewsModal 
                show={show} 
                handleClose={handleClose} 
                selectedNews={selectedNews}
                categories={[{id: 1, name: 'Education'}, {id: 2, name: 'Events'}]}
            />
        </div>
    );
};

export default NewsManagement;