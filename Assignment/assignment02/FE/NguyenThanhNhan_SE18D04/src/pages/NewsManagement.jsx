import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Spinner, Container } from 'react-bootstrap';
import axios from 'axios';
import NewsModal from '../components/NewsModal';
import './NewsManagement.css';

const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const API_BASE = "http://localhost:8080/api";

    const fetchData = async () => {
        setLoading(true);
        try {
            // Lấy đồng thời tất cả dữ liệu cần thiết
            const [newsRes, catRes, tagRes] = await Promise.all([
                axios.get(`${API_BASE}/news-articles`),
                axios.get(`${API_BASE}/categories`),
                axios.get(`${API_BASE}/tags`)
            ]);
            setNews(newsRes.data);
            setCategories(catRes.data);
            setTags(tagRes.data);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await axios.delete(`${API_BASE}/news-articles/${id}`);
                fetchData();
            } catch (err) { alert("Lỗi khi xóa bài viết!"); }
        }
    };

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">📰 News Management</h2>
                <Button variant="primary" className="shadow-sm" onClick={() => { setSelectedNews(null); setShow(true); }}>
                    + Create Article
                </Button>
            </div>

            <Card className="shadow-sm border-0 rounded-3">
                <Table hover responsive className="align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th className="ps-4">ID</th>
                            <th>Nội dung bài viết & Thẻ</th>
                            <th>Nguồn tin</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                        ) : news.map((item) => (
                            <tr key={item.id}>
                                <td className="ps-4 text-muted">#{item.id}</td>
                                <td>
                                    <div className="fw-bold mb-1">{item.newsTitle}</div>
                                    <div className="d-flex flex-wrap gap-1 align-items-center">
                                        <Badge bg="info" className="me-2">{item.category?.categoryName || "N/A"}</Badge>
                                        {/* HIỂN THỊ TAGS Ở ĐÂY */}
                                        {item.tags?.map(t => (
                                            <Badge key={t.id} pill bg="secondary" className="fw-normal" style={{fontSize: '0.7rem'}}>
                                                #{t.tagName}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>
                                <td><span className="text-muted small">{item.newsSource}</span></td>
                                <td>
                                    <Badge bg={item.newsStatus ? "success" : "warning"}>
                                        {item.newsStatus ? "Published" : "Draft"}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" className="me-2" 
                                        onClick={() => { setSelectedNews(item); setShow(true); }}>Sửa</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>Xóa</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <NewsModal 
                show={show} 
                handleClose={() => setShow(false)} 
                selectedNews={selectedNews}
                categories={categories}
                tags={tags}
                refreshData={fetchData}
            />
        </Container>
    );
};

export default NewsManagement;