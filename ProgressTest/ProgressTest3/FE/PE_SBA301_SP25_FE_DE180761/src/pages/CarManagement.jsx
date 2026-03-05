import { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Table, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import api from '../api/axiosConfig.js';

function CarManagement() {
  const [cars, setCars] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ carName: '', countryID: '', unitsInStock: 0, unitPrice: 0 });

  useEffect(() => {
    loadCars();
    api.get('/countries').then(res => setCountries(res.data)).catch(() => {});
  }, []);

  const loadCars = () => api.get('/cars').then(res => setCars(res.data));

  const validate = () => {
    let err = {};
    if (formData.carName.length <= 10) err.carName = "Car Name > 10 chars";
    if (formData.unitsInStock < 5 || formData.unitsInStock > 20) err.stock = "Stock 5-20";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pwd').value;
    try {
      // Khớp với @RequestBody LoginRequest { email, password } của BE
      const res = await api.post('/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data)); // Lưu {token, role, memberID}
      
      setUser(res.data);
      setShowLogin(false);
      alert("Login Success!");
      window.location.reload(); // Reload để axios nhận token mới
    } catch (e) { 
      alert("Login Failed! Please check email/password"); 
    }
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      // Gửi đúng CarDTO sang BE
      const payload = {
        ...formData,
        unitsInStock: parseInt(formData.unitsInStock),
        unitPrice: parseInt(formData.unitPrice),
        countryID: parseInt(formData.countryID)
      };
      await api.post('/cars', payload);
      loadCars(); // Load lại list để có item mới nhất ở đầu (nhờ Sort ở BE)
      alert("Car added!");
      setFormData({ carName: '', countryID: '', unitsInStock: 0, unitPrice: 0 });
    } catch (e) { alert("Unauthorized or Invalid Data!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this car?")) {
      try {
        // Khớp với @RequestParam Integer carID của BE
        await api.delete(`/cars?carID=${id}`);
        setCars(cars.filter(c => c.carID !== id));
      } catch (e) { alert("Delete failed!"); }
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
        {/* Form Add chỉ dành cho Admin (Role 1) */}
        {user?.role === 1 && (
          <div id="add-section" className="mb-4 p-3 border rounded bg-light shadow-sm">
            <h5 className="mb-3">Add New Car</h5>
            <Row className="g-2">
              <Col md={3}>
                <Form.Control placeholder="Car Name" isInvalid={!!errors.carName} 
                  onChange={e => setFormData({...formData, carName: e.target.value})} />
                <Form.Control.Feedback type="invalid">{errors.carName}</Form.Control.Feedback>
              </Col>
              <Col md={2}>
                <Form.Select onChange={e => setFormData({...formData, countryID: e.target.value})}>
                  <option value="">Country</option>
                  {countries.map(c => <option key={c.countryID} value={c.countryID}>{c.countryName}</option>)}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Control type="number" placeholder="Stock" isInvalid={!!errors.stock} 
                  onChange={e => setFormData({...formData, unitsInStock: e.target.value})} />
              </Col>
              <Col md={2}>
                <Form.Control type="number" placeholder="Price" 
                  onChange={e => setFormData({...formData, unitPrice: e.target.value})} />
              </Col>
              <Col md={3}><Button className="w-100" onClick={handleAdd}>Add</Button></Col>
            </Row>
          </div>
        )}

        {/* Table list cars */}
        <Table striped bordered hover responsive>
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
                  {user?.role === 1 && <Button variant="danger" size="sm" onClick={() => handleDelete(c.carID)}>Delete</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton><Modal.Title>Login System</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control id="email" placeholder="Enter your email" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control id="pwd" type="password" placeholder="Enter password" />
          </Form.Group>
          <Button className="w-100" onClick={handleLogin}>Login Now</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CarManagement;