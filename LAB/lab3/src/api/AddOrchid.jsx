import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orchidService } from './orchidapi';
import ConfirmModal from '../components/ConfirmModal';
import ValidationInput from '../validation/ValidationInput';

function AddOrchid() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    orchidName: '',
    description: '',
    category: 'Dendrobium',
    image: '', // Chuỗi Base64 sẽ lưu tại đây
    isSpecial: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Chuyển đổi ảnh sang Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (Base64 làm file nặng lên 33%, nên tránh file quá lớn > 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String); 
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false || !formData.image) {
      setValidated(true);
      if (!formData.image) alert("Vui lòng chọn một file ảnh!");
    } else {
      setShowModal(true);
    }
  };

  const handleSave = async () => {
    try {
      // Lưu thẳng vào db.json qua API của json-server
      await orchidService.create(formData);
      
      setShowModal(false);
      alert("Thêm hoa thành công! Dữ liệu và ảnh đã lưu vào db.json");
      navigate('/orchids');
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Không thể kết nối với Server (json-server).");
    }
  };

  return (
    <Container className="mt-5 pb-5">
      <Card className="shadow-sm p-4">
        <h2 className="text-success text-center mb-4">THÊM HOA LAN</h2>
        <Form noValidate validated={validated} onSubmit={handleOpenConfirm}>
          <ValidationInput 
            label="Tên hoa" 
            name="orchidName" 
            value={formData.orchidName} 
            onChange={handleChange} 
            required 
          />
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Danh mục</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Dendrobium">Dendrobium</option>
                  <option value="Oncidium">Oncidium</option>
                  <option value="Cattleya">Cattleya</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Chọn ảnh</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required 
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={8}>
              <ValidationInput 
                label="Mô tả" 
                as="textarea" 
                rows={3} 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
            </Col>
            <Col md={4} className="text-center border rounded d-flex align-items-center justify-content-center bg-light">
              {preview ? (
                <Image src={preview} thumbnail style={{ maxHeight: '150px' }} />
              ) : (
                <span className="text-muted">Xem trước ảnh</span>
              )}
            </Col>
          </Row>

          <Form.Check 
            type="switch" 
            label="Hoa đặc biệt" 
            name="isSpecial" 
            checked={formData.isSpecial} 
            onChange={handleChange} 
            className="mb-4" 
          />

          <Button variant="success" type="submit" className="w-100">
            Xác nhận lưu
          </Button>
        </Form>
      </Card>

      <ConfirmModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        onConfirm={handleSave} 
        title="Xác nhận lưu" 
        body="Bạn có chắc chắn muốn thêm hoa này vào danh sách?" 
      />
    </Container>
  );
}

export default AddOrchid;