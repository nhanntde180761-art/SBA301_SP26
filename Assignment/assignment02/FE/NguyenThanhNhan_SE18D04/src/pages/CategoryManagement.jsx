import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Badge, Modal, ListGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './CategoryManagement.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [validated, setValidated] = useState(false); // Trạng thái báo đỏ của Form

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const [formData, setFormData] = useState({
        id: null, 
        categoryName: '', 
        categoryDescription: '', 
        parentCategory: null, 
        isActive: true
    });
    const [selectedCategory, setSelectedCategory] = useState(null);

    const API_URL = "http://localhost:8080/api/categories";

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            if (Array.isArray(response.data)) setCategories(response.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleShowEdit = (category = null) => {
        setValidated(false); // Reset cảnh báo đỏ khi mở modal
        if (category) {
            setEditMode(true);
            setFormData({
                id: category.id,
                categoryName: category.categoryName || '',
                categoryDescription: category.categoryDescription || '',
                parentCategory: category.parentCategory ? category.parentCategory.id : null,
                isActive: category.isActive !== undefined ? category.isActive : true
            });
        } else {
            setEditMode(false);
            setFormData({ id: null, categoryName: '', categoryDescription: '', parentCategory: null, isActive: true });
        }
        setShowEditModal(true);
    };

    const handleSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        // Kiểm tra tính hợp lệ của Form (HTML5 Validation)
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        const payload = {
            id: formData.id,
            categoryName: formData.categoryName,
            categoryDescription: formData.categoryDescription,
            isActive: formData.isActive,
            parentCategory: formData.parentCategory ? { id: parseInt(formData.parentCategory) } : null
        };

        try {
            if (editMode) {
                await axios.put(`${API_URL}/${formData.id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            setShowEditModal(false);
            fetchCategories();
            alert("Lưu dữ liệu thành công!");
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || "Không thể lưu dữ liệu"));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchCategories();
                alert("Đã xóa danh mục!");
            } catch (error) {
                alert("Lỗi: Không thể xóa (danh mục có thể đang chứa tin tức hoặc danh mục con).");
            }
        }
    };

    return (
        <div className="category-page p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">Category Management</h2>
                <Button variant="primary" className="shadow-sm" onClick={() => handleShowEdit()}>
                    <i className="bi bi-plus-circle me-2"></i>+ Thêm danh mục
                </Button>
            </div>

            <Card className="shadow-sm border-0">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>ID</th>
                            <th>Tên danh mục</th>
                            <th>Danh mục cha</th> 
                            <th>Trạng thái</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>#{cat.id}</td>
                                    <td className="fw-bold">{cat.categoryName}</td>
                                    <td>
                                        {cat.parentCategory ? (
                                            <Badge bg="info" className="fw-normal">{cat.parentCategory.categoryName}</Badge>
                                        ) : (
                                            <span className="text-muted small">Gốc (Root)</span>
                                        )}
                                    </td>
                                    <td>
                                        <Badge bg={cat.isActive ? "success" : "danger"}>
                                            {cat.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="light" size="sm" className="me-2" onClick={() => { setSelectedCategory(cat); setShowDetailModal(true); }}>Xem</Button>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEdit(cat)}>Sửa</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cat.id)}>Xóa</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* MODAL THÊM/SỬA */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
                <Form noValidate validated={validated} onSubmit={handleSave}>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title className="fw-bold">{editMode ? "Cập nhật danh mục" : "Tạo danh mục mới"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Tên danh mục <span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        required
                                        type="text"
                                        placeholder="VD: Thể thao, Thời sự..."
                                        value={formData.categoryName} 
                                        onChange={e => setFormData({...formData, categoryName: e.target.value})} 
                                    />
                                    <Form.Control.Feedback type="invalid">Vui lòng nhập tên danh mục!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Danh mục cha</Form.Label>
                                    <Form.Select 
                                        value={formData.parentCategory || ""} 
                                        onChange={e => setFormData({...formData, parentCategory: e.target.value})}
                                    >
                                        <option value="">-- Cấp cao nhất (Gốc) --</option>
                                        {categories.filter(c => c.id !== formData.id).map(c => (
                                            <option key={c.id} value={c.id}>{c.categoryName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Mô tả danh mục</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={3}
                                        placeholder="Nhập mô tả ngắn về danh mục..."
                                        value={formData.categoryDescription} 
                                        onChange={e => setFormData({...formData, categoryDescription: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Check 
                                    type="switch"
                                    id="active-switch"
                                    label="Kích hoạt danh mục"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
                        <Button variant="primary" type="submit">Lưu thay đổi</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL CHI TIẾT */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Chi tiết danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCategory && (
                        <ListGroup variant="flush">
                            <ListGroup.Item className="d-flex justify-content-between">
                                <strong>Mã ID:</strong> <span>#{selectedCategory.id}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between">
                                <strong>Tên:</strong> <span className="fw-bold text-primary">{selectedCategory.categoryName}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between">
                                <strong>Danh mục cha:</strong> 
                                <span>{selectedCategory.parentCategory?.categoryName || <Badge bg="secondary">Gốc</Badge>}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Mô tả:</strong> <p className="text-muted mt-1 mb-0">{selectedCategory.categoryDescription || "Không có mô tả."}</p>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <strong>Trạng thái:</strong> 
                                <Badge bg={selectedCategory.isActive ? "success" : "danger"}>
                                    {selectedCategory.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                                </Badge>
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CategoryManagement;