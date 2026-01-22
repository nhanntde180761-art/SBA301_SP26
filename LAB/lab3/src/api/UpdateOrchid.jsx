import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Spinner, Image } from 'react-bootstrap';
import { orchidService } from './orchidapi';
import ConfirmModal from '../components/ConfirmModal';

function UpdateOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [preview, setPreview] = useState(null); // Để xem trước ảnh mới

  // 1. Lấy dữ liệu cũ đổ vào Form
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await orchidService.getById(id);
        setFormData(res.data);
        setPreview(res.data.image); // Hiển thị ảnh cũ từ database
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết:", err);
      }
    };
    fetchDetail();
  }, [id]);

  // 2. Xử lý khi chọn ảnh mới (Chuyển sang Base64)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String); // Cập nhật ảnh xem trước
        setFormData({ ...formData, image: base64String }); // Lưu Base64 vào formData
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // 3. Gọi API Update
  const handleUpdate = async () => {
    try {
      await orchidService.update(id, formData);
      setShowModal(false);
      alert("Cập nhật thành công!");
      navigate('/orchids');
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  if (!formData) return (
    <div className="text-center mt-5">
      <Spinner animation="border" variant="warning" />
      <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <Container className="mt-5 pb-5">
      <Card className="shadow-sm border-0 p-4">
        <h2 className="fw-bold text-warning mb-4 text-center">CHỈNH SỬA HOA LAN</h2>
        
        <Form onSubmit={handleOpenConfirm}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted small">ID sản phẩm: {id}</Form.Label>
          </Form.Group>

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tên hoa lan</Form.Label>
                <Form.Control 
                  required type="text" 
                  value={formData.orchidName}
                  onChange={(e) => setFormData({...formData, orchidName: e.target.value})} 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Mô tả</Form.Label>
                <Form.Control 
                  required as="textarea" rows={5} 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </Form.Group>
            </Col>

            <Col md={4} className="text-center">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Ảnh hiện tại</Form.Label>
                <div className="border rounded p-2 bg-light mb-2">
                  <Image 
                    src={preview} 
                    fluid 
                    className="rounded shadow-sm" 
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                <Form.Text className="text-muted">Chọn ảnh khác để thay đổi</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Danh mục</Form.Label>
                <Form.Select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Dendrobium">Dendrobium</option>
                  <option value="Oncidium">Oncidium</option>
                  <option value="Cattleya">Cattleya</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-center">
              <Form.Group className="mt-3">
                <Form.Check 
                  type="switch"
                  label="Hoa Đặc Biệt (Special)"
                  checked={formData.isSpecial}
                  onChange={(e) => setFormData({...formData, isSpecial: e.target.checked})}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          <div className="d-flex gap-3 justify-content-center">
            <Button variant="warning" type="submit" className="px-5 fw-bold text-white shadow-sm">
              Lưu thay đổi
            </Button>
            <Button variant="outline-secondary" className="px-4" onClick={() => navigate('/orchids')}>
              Hủy bỏ
            </Button>
          </div>
        </Form>
      </Card>

      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        onConfirm={handleUpdate}
        title="Xác nhận cập nhật"
        body="Bạn có chắc chắn muốn cập nhật các thông tin này cho hoa lan?"
      />
    </Container>
  );
}

export default UpdateOrchid;