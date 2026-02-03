import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Card, Badge, Modal, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const TagManagement = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [validated, setValidated] = useState(false);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: null, tagName: '', note: '' });

    const API_URL = "http://localhost:8080/api/tags";

    const fetchTags = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setTags(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tải Tag:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTags(); }, []);

    const handleShowModal = (tag = null) => {
        setValidated(false);
        if (tag) {
            setEditMode(true);
            setFormData({ id: tag.id, tagName: tag.tagName || '', note: tag.note || '' });
        } else {
            setEditMode(false);
            setFormData({ id: null, tagName: '', note: '' });
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
                await axios.put(`${API_URL}/${formData.id}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            setShowModal(false);
            fetchTags();
            alert("Lưu thẻ thành công!");
        } catch (err) {
            alert("Lỗi khi lưu: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchTags();
            } catch (err) {
                alert("Không thể xóa thẻ này (có thể đang được gắn vào bài viết)!");
            }
        }
    };

    return (
        <div className="tag-page p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Tag Management</h2>
                <Button variant="success" onClick={() => handleShowModal()}>
                    + Thêm Thẻ mới
                </Button>
            </div>

            <Card className="shadow-sm border-0">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tên Thẻ (Tag Name)</th>
                            <th>Ghi chú</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-5"><Spinner animation="grow" variant="success" /></td></tr>
                        ) : (
                            tags.map(tag => (
                                <tr key={tag.id}>
                                    <td><Badge bg="secondary">#{tag.id}</Badge></td>
                                    <td><span className="fw-bold text-success">#{tag.tagName}</span></td>
                                    <td className="text-muted">{tag.note || "---"}</td>
                                    <td className="text-center">
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(tag)}>
                                            Sửa
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(tag.id)}>
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* MODAL THÊM/SỬA (DẠNG NỔI CENTERED) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form noValidate validated={validated} onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? "Cập nhật Thẻ" : "Tạo Thẻ mới"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Tên Thẻ <span className="text-danger">*</span></Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text>#</InputGroup.Text>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="VD: hotnews, kpop..."
                                    value={formData.tagName}
                                    onChange={e => setFormData({ ...formData, tagName: e.target.value })}
                                />
                                <Form.Control.Feedback type="invalid">Vui lòng nhập tên thẻ!</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Ghi chú (Note)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Mô tả về thẻ này..."
                                value={formData.note}
                                onChange={e => setFormData({ ...formData, note: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="link" className="text-decoration-none" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button variant="success" type="submit">
                            {editMode ? "Cập nhật ngay" : "Tạo thẻ"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TagManagement;