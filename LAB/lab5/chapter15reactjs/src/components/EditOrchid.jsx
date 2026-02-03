import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm, useWatch } from 'react-hook-form';

export default function EditOrchid() {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/orchids";
    const categoryUrl = import.meta.env.CATEGORY_API_URL || "http://localhost:8080/api/categories";

    const [categories, setCategories] = useState([]); // Lưu danh sách categories cho dropdown
    
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
        defaultValues: {
            orchidName: '',
            orchidURL: '',
            orchidDescription: '',
            categoryID: '', // Dùng ID thay vì text name
            isNatural: false,
            isAttractive: false
        }
    });

    const orchidURLPreview = useWatch({ control, name: 'orchidURL' });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch đồng thời thông tin Orchid và danh sách Categories
                const [orchidRes, catRes] = await Promise.all([
                    axios.get(`${baseUrl}/${id}`),
                    axios.get(categoryUrl)
                ]);

                const orchidData = orchidRes.data;
                setCategories(catRes.data);

                // Đổ dữ liệu vào form
                setValue("orchidName", orchidData.orchidName);
                setValue("orchidURL", orchidData.orchidURL);
                setValue("orchidDescription", orchidData.orchidDescription);
                setValue("isNatural", orchidData.isNatural);
                setValue("isAttractive", orchidData.isAttractive);
                
                // Quan trọng: Gán đúng ID của Category hiện tại vào dropdown
                if (orchidData.category) {
                    setValue("categoryID", orchidData.category.categoryID);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Failed to load data!");
            }
        };
        loadInitialData();
    }, [id, baseUrl, setValue]);

    const onSubmit = async (data) => {
        try {
            // Chuyển đổi data thành cấu trúc JSON mà Spring Boot mong đợi (@ManyToOne)
            const payload = {
                orchidID: parseInt(id),
                orchidName: data.orchidName,
                orchidURL: data.orchidURL,
                orchidDescription: data.orchidDescription,
                isNatural: data.isNatural,
                isAttractive: data.isAttractive,
                category: {
                    categoryID: parseInt(data.categoryID)
                }
            };

            await axios.put(`${baseUrl}/${id}`, payload);
            toast.success("Orchid updated successfully!");
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            const msg = error.response?.data?.message || "Update failed!";
            toast.error(msg);
        }
    };

    return (
        <Container className="py-5">
            <Toaster position="top-center" />
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white py-3">
                            <h4 className="text-primary mb-0 fw-bold">
                                <i className="bi bi-pencil-square me-2"></i>
                                Edit Orchid Details (ID: {id})
                            </h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={4} className="text-center mb-4 mb-md-0">
                                        <div className="border rounded p-2 bg-light mb-2" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {orchidURLPreview ? (
                                                <Image 
                                                    src={orchidURLPreview} 
                                                    fluid rounded 
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Invalid+URL'; }}
                                                />
                                            ) : (
                                                <div className="text-muted small">No Image Preview</div>
                                            )}
                                        </div>
                                        <p className="text-muted small">Current Preview</p>
                                    </Col>

                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Orchid Name</Form.Label>
                                            <Form.Control 
                                                {...register("orchidName", { required: "Name is required" })} 
                                                isInvalid={!!errors.orchidName}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.orchidName?.message}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Category</Form.Label>
                                            {/* Chuyển từ Input sang Select */}
                                            <Form.Select 
                                                {...register("categoryID", { required: "Please select a category" })}
                                                isInvalid={!!errors.categoryID}
                                            >
                                                <option value="">-- Select Category --</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.categoryID} value={cat.categoryID}>
                                                        {cat.categoryName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.categoryID?.message}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Image URL</Form.Label>
                                            <Form.Control 
                                                {...register("orchidURL", { required: "Image URL is required" })} 
                                                isInvalid={!!errors.orchidURL}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.orchidURL?.message}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Description</Form.Label>
                                            <Form.Control 
                                                as="textarea" rows={4} 
                                                {...register("orchidDescription")} 
                                            />
                                        </Form.Group>

                                        <div className="d-flex gap-5 mb-4 p-3 bg-light rounded">
                                            <Form.Check 
                                                type="switch" id="natural-switch" label="Natural Origin" 
                                                {...register("isNatural")} 
                                            />
                                            <Form.Check 
                                                type="switch" id="attractive-switch" label="Attractive" 
                                                {...register("isAttractive")} 
                                            />
                                        </div>

                                        <div className="d-flex gap-3">
                                            <Button variant="primary" type="submit" className="px-5 py-2 fw-bold">
                                                Save Changes
                                            </Button>
                                            <Button variant="outline-secondary" onClick={() => navigate('/')} className="px-4">
                                                Cancel
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}