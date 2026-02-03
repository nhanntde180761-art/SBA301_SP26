import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Card, Badge, Modal, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [validated, setValidated] = useState(false);

    // Khởi tạo formData khớp chính xác với POJO Backend (id viết thường)
    const [formData, setFormData] = useState({
        id: null,
        accountName: '',
        accountEmail: '',
        accountRole: 2,
        accountPassword: ''
    });

    const API_URL = "http://localhost:8080/api/users";

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            // Kiểm tra log để chắc chắn Backend trả về mảng chứa trường "id"
            console.log("Dữ liệu từ API:", res.data);
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi API:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleShowModal = (user = null) => {
        setValidated(false);
        if (user) {
            setEditMode(true);
            setFormData({ ...user }); // Khi sửa, user đã có trường .id
        } else {
            setEditMode(false);
            setFormData({ id: null, accountName: '', accountEmail: '', accountRole: 2, accountPassword: '' });
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            if (editMode) {
                // Backend dùng @PutMapping nhận @RequestBody SystemAccount
                await axios.put(API_URL, formData);
            } else {
                // Backend dùng @PostMapping nhận @RequestBody SystemAccount
                await axios.post(API_URL, formData);
            }
            setShowModal(false);
            fetchUsers();
            alert("Lưu dữ liệu thành công!");
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (userId) => {
        if (!userId) return alert("Không tìm thấy ID người dùng!");
        
        if (window.confirm(`Bạn có chắc muốn xóa người dùng ID: ${userId}?`)) {
            try {
                // Khớp với @DeleteMapping("/{id}") của Backend
                await axios.delete(`${API_URL}/${userId}`);
                fetchUsers();
            } catch (err) {
                alert("Lỗi khi xóa tài khoản!");
            }
        }
    };

    return (
        <Container fluid className="py-4">
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold text-primary">User Accounts</h4>
                    <Button variant="primary" onClick={() => handleShowModal()}>
                        <i className="bi bi-person-plus me-2"></i>Add New User
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive className="align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4 text-muted">No users found in database.</td></tr>
                            ) : (
                                users.map((u) => (
                                    /* Sửa lỗi key prop bằng cách dùng u.id */
                                    <tr key={u.id}> 
                                        <td><Badge bg="light" text="dark">#{u.id}</Badge></td>
                                        <td className="fw-bold">{u.accountName}</td>
                                        <td>{u.accountEmail}</td>
                                        <td>
                                            <Badge bg={u.accountRole === 1 ? "danger" : "info"}>
                                                {u.accountRole === 1 ? "ADMIN" : "STAFF"}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowModal(u)}>
                                                Edit
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form noValidate validated={validated} onSubmit={handleSave}>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title>{editMode ? "Update User" : "Register User"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={12} className="mb-3">
                                <Form.Label className="fw-bold">Full Name</Form.Label>
                                <Form.Control required type="text" placeholder="Enter name"
                                    value={formData.accountName} 
                                    onChange={e => setFormData({...formData, accountName: e.target.value})} />
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Label className="fw-bold">Email Address</Form.Label>
                                <Form.Control required type="email" placeholder="name@example.com"
                                    value={formData.accountEmail} 
                                    onChange={e => setFormData({...formData, accountEmail: e.target.value})} />
                            </Col>
                            {!editMode && (
                                <Col md={12} className="mb-3">
                                    <Form.Label className="fw-bold">Password</Form.Label>
                                    <Form.Control required type="password" placeholder="Min 6 characters"
                                        value={formData.accountPassword} 
                                        onChange={e => setFormData({...formData, accountPassword: e.target.value})} />
                                </Col>
                            )}
                            <Col md={12} className="mb-3">
                                <Form.Label className="fw-bold">Account Role</Form.Label>
                                <Form.Select value={formData.accountRole} 
                                    onChange={e => setFormData({...formData, accountRole: parseInt(e.target.value)})}>
                                    <option value={1}>Administrator</option>
                                    <option value={2}>Staff Member</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="link" className="text-muted" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit px-4">Save Account</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default UserManagement;