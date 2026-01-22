import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ConfirmModal from './ConfirmModal';

function FormExample() {
  const [validated, setValidated] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  const handleClose = () => setShowModal(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Kiểm tra tính hợp lệ của toàn bộ form và trạng thái checkbox
    if (form.checkValidity() === false || !agree) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // Thu thập dữ liệu từ các trường nhập liệu
    const data = {
      firstName: form.elements.validationFirstName.value,
      lastName: form.elements.validationLastName.value,
      phone: form.elements.validationPhone.value,
      email: form.elements.validationEmail.value,
    };
    
    setFormData(data);
    setShowModal(true);
    setValidated(true);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        {/* Giới hạn độ rộng của Form (chiếm 8/12 cột trên màn hình lớn) */}
        <Col md={10} lg={8}>
          
          <Form 
            noValidate 
            validated={validated} 
            onSubmit={handleSubmit} 
            className="text-start shadow p-4 bg-white rounded"
          >
            <h2 className="text-center mb-4">Trang Contact</h2>
            
            {/* Hàng 1: First Name & Last Name */}
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationFirstName">
                <Form.Label className="fw-bold">First Name</Form.Label>
                <Form.Control 
                  required 
                  type="text" 
                  placeholder="Enter first name" 
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập họ của bạn.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Hợp lệ!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationLastName">
                <Form.Label className="fw-bold">Last Name</Form.Label>
                <Form.Control 
                  required 
                  type="text" 
                  placeholder="Enter last name" 
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập tên của bạn.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Hợp lệ!</Form.Control.Feedback>
              </Form.Group>
            </Row>

            {/* Hàng 2: Phone & Email */}
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationPhone">
                <Form.Label className="fw-bold">Phone</Form.Label>
                <Form.Control
                  required
                  type="tel"
                  placeholder="0123456789"
                  pattern="^[0-9]{10,15}$"
                />
                <Form.Control.Feedback type="invalid">
                  Số điện thoại phải từ 10-15 chữ số.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Hợp lệ!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationEmail">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control 
                  required 
                  type="email" 
                  placeholder="example@gmail.com" 
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập địa chỉ email hợp lệ.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Hợp lệ!</Form.Control.Feedback>
              </Form.Group>
            </Row>

            {/* Checkbox đồng ý điều khoản */}
            <Form.Group className="mb-4 d-flex justify-content-center" controlId="validationAgree">
              <Form.Check
                type="checkbox"
                label="I agree to the terms and conditions"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
                feedback="Bạn phải đồng ý trước khi gửi."
                feedbackType="invalid"
              />
            </Form.Group>

            {/* Nút Submit căn giữa */}
            <div className="text-center">
              <Button 
                type="submit" 
                disabled={!agree} 
                className="px-5 py-2 fw-bold"
                variant="primary"
              >
                Submit Form
              </Button>
            </div>
          </Form>

        </Col>
      </Row>

      {/* Modal hiển thị thông tin sau khi kiểm tra xong */}
      <ConfirmModal
        show={showModal}
        handleClose={handleClose}
        title="Thông tin liên hệ đã ghi nhận"
        body={
          <div className="p-2">
            <p><strong>Họ:</strong> {formData.firstName}</p>
            <p><strong>Tên:</strong> {formData.lastName}</p>
            <p><strong>Số điện thoại:</strong> {formData.phone}</p>
            <p><strong>Email:</strong> {formData.email}</p>
          </div>
        }
        onConfirm={handleClose}
      />
    </Container>
  );
}

export default FormExample;