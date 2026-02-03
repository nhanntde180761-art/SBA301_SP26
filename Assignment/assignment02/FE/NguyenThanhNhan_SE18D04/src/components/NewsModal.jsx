import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const NewsModal = ({ show, handleClose, selectedNews, categories, tags, refreshData }) => {
    const [formData, setFormData] = useState({
        newsTitle: '', headline: '', newsContent: '', newsSource: '',
        category: { id: "" }, newsStatus: true, tags: []
    });

    useEffect(() => {
        if (selectedNews && show) {
            // Khi SỬA: Map lại dữ liệu từ selectedNews
            setFormData({
                ...selectedNews,
                category: selectedNews.category || { id: "" },
                tags: selectedNews.tags || []
            });
        } else {
            // Khi THÊM MỚI: Reset form
            setFormData({
                newsTitle: '', headline: '', newsContent: '', newsSource: '',
                category: { id: "" }, newsStatus: true, tags: []
            });
        }
    }, [selectedNews, show]);

    // Xử lý chọn/bỏ chọn Tag
    const handleTagToggle = (tagId) => {
        const isSelected = formData.tags.some(t => t.id === tagId);
        if (isSelected) {
            setFormData({ ...formData, tags: formData.tags.filter(t => t.id !== tagId) });
        } else {
            setFormData({ ...formData, tags: [...formData.tags, { id: tagId }] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                // Chuẩn hóa Category cho Hibernate
                category: formData.category.id ? { id: parseInt(formData.category.id) } : null,
                // Chuẩn hóa Tags cho Many-to-Many (chỉ gửi list ID dưới dạng object)
                tags: formData.tags.map(t => ({ id: t.id })),
                // Gán User ID tạm thời (nên lấy từ AuthContext nếu có)
                createdBy: selectedNews ? formData.createdBy : { id: 1 }
            };

            const API_URL = "http://localhost:8080/api/news-articles";
            if (selectedNews) {
                await axios.put(API_URL, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            refreshData();
            handleClose();
            alert("Lưu bài viết thành công!");
        } catch (err) {
            alert("Lỗi khi lưu bài viết!");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered shadow>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fw-bold">{selectedNews ? "📝 Edit Article" : "🆕 Create Article"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Label className="fw-bold">News Title</Form.Label>
                            <Form.Control required value={formData.newsTitle} onChange={e => setFormData({...formData, newsTitle: e.target.value})} />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="fw-bold">Category</Form.Label>
                            <Form.Select required value={formData.category.id} onChange={e => setFormData({...formData, category: {id: e.target.value}})}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                            </Form.Select>
                        </Col>
                        <Col md={6}>
                            <Form.Label className="fw-bold">News Source</Form.Label>
                            <Form.Control value={formData.newsSource} onChange={e => setFormData({...formData, newsSource: e.target.value})} />
                        </Col>
                        
                        {/* PHẦN CHỌN TAGS */}
                        <Col md={12}>
                            <Form.Label className="fw-bold">Tags</Form.Label>
                            <div className="p-3 border rounded-3 bg-light d-flex flex-wrap gap-3">
                                {tags.map(t => (
                                    <Form.Check 
                                        key={t.id}
                                        type="checkbox"
                                        id={`tag-modal-${t.id}`}
                                        label={t.tagName}
                                        checked={formData.tags.some(st => st.id === t.id)}
                                        onChange={() => handleTagToggle(t.id)}
                                    />
                                ))}
                            </div>
                        </Col>

                        <Col md={12}>
                            <Form.Label className="fw-bold">Content</Form.Label>
                            <Form.Control as="textarea" rows={6} value={formData.newsContent} onChange={e => setFormData({...formData, newsContent: e.target.value})} />
                        </Col>
                        <Col md={12}>
                            <Form.Check type="switch" label="Publish to website" checked={formData.newsStatus} onChange={e => setFormData({...formData, newsStatus: e.target.checked})} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="link" className="text-muted text-decoration-none" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" type="submit" className="px-4 shadow-sm">Save Article</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default NewsModal;