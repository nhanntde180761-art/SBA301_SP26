import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Card, Badge } from 'react-bootstrap';
import './CategoryManagement.css'; // Đảm bảo bạn tạo file này

const CategoryManagement = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Education', description: 'Academic and university news', status: 1 },
        { id: 2, name: 'Technology', description: 'Software and hardware updates', status: 1 },
        { id: 3, name: 'Events', description: 'Student activities and workshops', status: 0 },
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter(cat => cat.id !== id));
        }
    };

    return (
        <div className="category-page">
            {/* Header Section */}
            <div className="page-header-premium mb-4">
                <div>
                    <h2 className="fw-bold">Category Management</h2>
                    <p className="text-muted">Quản lý và phân loại các danh mục tin tức hệ thống</p>
                </div>
                <Button className="btn-add-premium">
                    <span className="me-2">+</span> Add New Category
                </Button>
            </div>

            {/* Filter Grid */}
            <Card className="filter-card-premium mb-4">
                <Card.Body>
                    <Form>
                        <Row className="g-3 align-items-center">
                            <Col lg={7}>
                                <div className="search-wrapper-premium">
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..." 
                                        className="search-input-premium"
                                    />
                                </div>
                            </Col>
                            <Col lg={3}>
                                <Form.Select className="select-premium">
                                    <option>Tất cả trạng thái</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </Form.Select>
                            </Col>
                            <Col lg={2}>
                                <Button variant="dark" className="w-100 py-2 rounded-3 fw-bold">Tìm kiếm</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Table/Grid Section */}
            <Card className="table-card-premium shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="premium-table mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Mã ID</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả chi tiết</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((item) => (
                                <tr key={item.id}>
                                    <td className="ps-4 text-muted fw-medium">#{item.id}</td>
                                    <td>
                                        <div className="cat-name-cell">{item.name}</div>
                                    </td>
                                    <td>
                                        <span className="text-secondary small">{item.description}</span>
                                    </td>
                                    <td>
                                        <Badge className={`badge-premium ${item.status === 1 ? 'active' : 'inactive'}`}>
                                            {item.status === 1 ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <div className="action-buttons">
                                            <button className="btn-icon edit">Edit</button>
                                            <button 
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CategoryManagement;