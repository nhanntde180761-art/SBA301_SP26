import React from 'react';
import { Form } from 'react-bootstrap';

function ValidationInput({ label, value, ...props }) {
  // Logic kiểm tra: Nếu có chữ thì Xanh, nếu trống thì Đỏ
  const isNotEmpty = value && value.toString().trim().length > 0;
  const isTouched = value !== undefined && value !== ''; 

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Control
        {...props}
        value={value}
        // QUAN TRỌNG: Hai dòng này quyết định màu sắc
        isValid={isNotEmpty}
        isInvalid={value !== undefined && !isNotEmpty} 
      />
      {/* Hiện tin nhắn tương ứng */}
      <Form.Control.Feedback type="valid">Hợp lệ! ✔️</Form.Control.Feedback>
      <Form.Control.Feedback type="invalid">Trường này không được để trống! ❌</Form.Control.Feedback>
    </Form.Group>
  );
}

export default ValidationInput;