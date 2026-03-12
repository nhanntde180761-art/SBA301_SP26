import { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Table, Button, Modal, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import api from '../api/axiosConfig.js';

function CarManagement() {
  const [cars, setCars] = useState([]);
  const [countries, setCountries] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ carName: '', countryID: '', unitsInStock: 0, unitPrice: 0 });

  // Trạng thái cho Modals
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirm, setShowConfirm] = useState({ show: false, id: null });
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState({ text: '', variant: '' });

  useEffect(() => {
    loadCars();
    api.get('/countries')
        .then(res => setCountries(Array.isArray(res.data) ? res.data : []))
        .catch(() => setCountries([]));
  }, []);

  const loadCars = () => api.get('/cars').then(res => setCars(Array.isArray(res.data) ? res.data : []));

  const showNotify = (text, variant = 'success') => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: '', variant: '' }), 3000);
  };

  const validate = () => {
    let err = {};
    if (formData.carName.length <= 10) err.carName = "Tên xe phải > 10 ký tự";
    if (formData.unitsInStock < 5 || formData.unitsInStock > 20) err.stock = "Số lượng từ 5-20";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pwd').value;
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setShowLogin(false);
      window.location.reload();
    } catch (e) {
      showNotify("Đăng nhập thất bại!", "danger");
    }
  };

  // Chuẩn bị dữ liệu để Update
  const startEdit = (car) => {
    setIsEdit(true);
    setFormData({
      carID: car.carID,
      carName: car.carName,
      countryID: car.countryID,
      unitsInStock: car.unitsInStock,
      unitPrice: car.unitPrice
    });
    window.scrollTo(0, 0); // Cuộn lên đầu trang để thấy Form
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      ...formData,
      unitsInStock: parseInt(formData.unitsInStock),
      unitPrice: parseInt(formData.unitPrice),
      countryID: parseInt(formData.countryID)
    };

    try {
      if (isEdit) {
        await api.put('/cars', payload);
        showNotify("Cập nhật thành công!");
      } else {
        await api.post('/cars', payload);
        showNotify("Thêm mới thành công!");
      }
      loadCars();
      resetForm();
    } catch (e) {
      showNotify("Thao tác thất bại!", "danger");
    }
  };

  const resetForm = () => {
    setFormData({ carName: '', countryID: '', unitsInStock: 0, unitPrice: 0 });
    setIsEdit(false);
    setErrors({});
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/cars?carID=${showConfirm.id}`);
      setCars(cars.filter(c => c.carID !== showConfirm.id));
      showNotify("Đã xóa xe!");
      setShowConfirm({ show: false, id: null });
    } catch (e) {
      showNotify("Xóa thất bại!", "danger");
    }
  };

  return (
      <div>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>DE180761 - Nguyen Thanh Nhan PE Spring 25</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link onClick={loadCars}>Home</Nav.Link>
              <NavDropdown title="Car Management">
                <NavDropdown.Item onClick={loadCars}>List all cars</NavDropdown.Item>
                <NavDropdown.Item href="#add-section">Create a new car</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {user ? (
                <div className="d-flex align-items-center">
                  <span className="text-white me-3">Welcome, {user.memberID}</span>
                  <Button variant="light" size="sm" onClick={() => {localStorage.clear(); window.location.reload();}}>Logout</Button>
                </div>
            ) : <Button variant="outline-light" onClick={() => setShowLogin(true)}>Login</Button>}
          </Container>
        </Navbar>

        <Container className="mt-4">
          {message.text && <Alert variant={message.variant}>{message.text}</Alert>}

          {/* Form Add/Update dành cho Admin */}
          {user?.role === 1 && (
              <div className="mb-4 p-4 border rounded bg-white shadow-sm">
                <h4 className="mb-3">{isEdit ? "Update Car" : "Add New Car"}</h4>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Car Name</Form.Label>
                    <Form.Control value={formData.carName} isInvalid={!!errors.carName}
                                  onChange={e => setFormData({ ...formData, carName: e.target.value })} />
                    <Form.Control.Feedback type="invalid">{errors.carName}</Form.Control.Feedback>
                  </Col>
                  <Col md={2}>
                    <Form.Label>Country</Form.Label>
                    <Form.Select value={formData.countryID} onChange={e => setFormData({ ...formData, countryID: e.target.value })}>
                      <option value="">Select...</option>
                      {countries.map(c => <option key={c.countryID} value={c.countryID}>{c.countryName}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type="number" value={formData.unitsInStock} isInvalid={!!errors.stock}
                                  onChange={e => setFormData({ ...formData, unitsInStock: e.target.value })} />
                    <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                  </Col>
                  <Col md={2}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" value={formData.unitPrice}
                                  onChange={e => setFormData({ ...formData, unitPrice: e.target.value })} />
                  </Col>
                  <Col md={2} className="d-flex align-items-end gap-2">
                    <Button className="w-100" onClick={handleSave}>{isEdit ? "Update" : "Add"}</Button>
                    {isEdit && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
                  </Col>
                </Row>
              </div>
          )}

          <Table striped bordered hover className="bg-white shadow-sm">
            <thead className="table-dark">
            <tr>
              <th>ID</th><th>Name</th><th>Country</th><th>Price</th><th>Stock</th><th>Action</th>
            </tr>
            </thead>
            <tbody>
            {cars.map(c => (
                <tr key={c.carID}>
                  <td>{c.carID}</td>
                  <td>{c.carName}</td>
                  <td>{c.countryName}</td>
                  <td>{c.unitPrice?.toLocaleString()}</td>
                  <td>{c.unitsInStock}</td>
                  <td>
                    {user?.role === 1 && (
                        <div className="d-flex gap-2">
                          <Button variant="warning" size="sm" onClick={() => startEdit(c)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => setShowConfirm({ show: true, id: c.carID })}>Delete</Button>
                        </div>
                    )}
                  </td>
                </tr>
            ))}
            </tbody>
          </Table>
        </Container>

        {/* Modal xác nhận xóa */}
        <Modal show={showConfirm.show} onHide={() => setShowConfirm({ show: false, id: null })} centered>
          <Modal.Header closeButton><Modal.Title>Xác nhận xóa</Modal.Title></Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa xe với ID: <strong>{showConfirm.id}</strong> không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm({ show: false, id: null })}>Hủy</Button>
            <Button variant="danger" onClick={handleDelete}>Đồng ý xóa</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Login */}
        <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
          <Modal.Header closeButton><Modal.Title>Login System</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control id="email" placeholder="email@example.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control id="pwd" type="password" />
            </Form.Group>
            <Button className="w-100" onClick={handleLogin}>Login Now</Button>
          </Modal.Body>
        </Modal>
      </div>
  );
}

export default CarManagement;