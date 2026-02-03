import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Form, Image, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';

export default function ListOfOrchids() {
    // Lưu ý: Đảm bảo các biến môi trường này đúng trong file .env
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/orchids";
    const categoryUrl = import.meta.env.CATEGORY_API_URL || "http://localhost:8080/api/categories"; 
    
    const [api, setAPI] = useState([]);
    const [categories, setCategories] = useState([]); // Khởi tạo mảng rỗng để tránh lỗi .map
    const [show, setShow] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleClose = () => { setShow(false); reset(); };
    const handleShow = () => setShow(true);

    // 1. Fetch dữ liệu Orchid và Category đồng thời
    const fetchData = async () => {
        try {
            const [orchidRes, catRes] = await Promise.all([
                axios.get(baseUrl),
                axios.get(categoryUrl)
            ]);

            setAPI(orchidRes.data);

            // Kiểm tra chắc chắn dữ liệu Category trả về là mảng
            if (Array.isArray(catRes.data)) {
                setCategories(catRes.data);
            } else {
                setCategories([]);
                console.error("API Category không trả về mảng:", catRes.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Không thể kết nối đến máy chủ!");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Xử lý xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
            try {
                await axios.delete(`${baseUrl}/${id}`);
                fetchData();
                toast.success("Xóa thành công!");
            } catch (error) {
                const msg = error.response?.data?.message || "Xóa thất bại!";
                toast.error(msg);
            }
        }
    };

    // 3. Xử lý thêm mới (Mapping @ManyToOne)
    const onSubmit = async (data) => {
        try {
            // Cấu trúc payload gửi đi phải khớp với Entity Orchid (có object category bên trong)
            const payload = {
                orchidName: data.orchidName,
                orchidURL: data.orchidURL,
                orchidDescription: data.orchidDescription,
                isNatural: data.isNatural,
                isAttractive: data.isAttractive,
                category: {
                    categoryID: parseInt(data.categoryID) // Ép kiểu về số nguyên
                }
            };

            await axios.post(baseUrl, payload);
            toast.success("Thêm hoa lan thành công!");
            handleClose();
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi khi thêm dữ liệu!";
            toast.error(msg);
        }
    };

    return (
        <Container className="mt-5">
            <Toaster position="top-right" />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">Quản lý Hoa Lan</h2>
                <Button variant="success" onClick={handleShow}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm hoa mới
                </Button>
            </div>

            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Ảnh</th>
                        <th>Tên hoa</th>
                        <th>Danh mục</th>
                        <th>Loại</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {api.map((item) => (
                        <tr key={item.orchidID} className="align-middle">
                            <td>{item.orchidID}</td>
                            <td>
                                <Image 
                                    src={item.orchidURL} 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                    rounded 
                                    alt={item.orchidName}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Img'; }}
                                />
                            </td>
                            <td className="fw-bold">{item.orchidName}</td>
                            <td>
                                {/* Truy cập an toàn vào object category */}
                                <Badge bg="secondary">{item.category?.categoryName || "N/A"}</Badge>
                            </td>
                            <td>
                                {item.isNatural ? 
                                    <Badge bg="success">Tự nhiên</Badge> : 
                                    <Badge bg="info">Công nghiệp</Badge>
                                }
                            </td>
                            <td className="text-center">
                                <Link to={`/edit/${item.orchidID}`} className="btn btn-sm btn-outline-primary me-2">
                                    Sửa
                                </Link>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.orchidID)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal thêm mới */}
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Đăng ký hoa lan mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label className="fw-bold">Tên hoa lan</Form.Label>
                                <Form.Control 
                                    {...register("orchidName", { required: "Không được để trống" })} 
                                    placeholder="Ví dụ: Cattleya" 
                                    isInvalid={!!errors.orchidName}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label className="fw-bold">Danh mục (Category)</Form.Label>
                                <Form.Select 
                                    {...register("categoryID", { required: "Vui lòng chọn danh mục" })}
                                    isInvalid={!!errors.categoryID}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {/* Sử dụng optional chaining để an toàn */}
                                    {Array.isArray(categories) && categories.map((cat) => (
                                        <option key={cat.categoryID} value={cat.categoryID}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.categoryID?.message}
                                </Form.Control.Feedback>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Đường dẫn ảnh (URL)</Form.Label>
                            <Form.Control {...register("orchidURL", { required: true })} placeholder="Dán link ảnh tại đây..." />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Mô tả</Form.Label>
                            <Form.Control as="textarea" rows={3} {...register("orchidDescription")} />
                        </Form.Group>

                        <div className="d-flex gap-4 mb-4">
                            <Form.Check type="switch" label="Tự nhiên" {...register("isNatural")} />
                            <Form.Check type="switch" label="Hấp dẫn" {...register("isAttractive")} />
                        </div>

                        <div className="text-end">
                            <Button variant="secondary" onClick={handleClose} className="me-2">Hủy</Button>
                            <Button variant="primary" type="submit" className="px-4">Lưu hoa lan</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}