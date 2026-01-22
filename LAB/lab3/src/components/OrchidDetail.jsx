import React, { useState, useEffect } from 'react'; // Thêm useState, useEffect
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card, Spinner } from 'react-bootstrap';
import { orchidService } from '../api/orchidapi'; // Import service thay vì file data tĩnh

function OrchidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Tạo state để lưu trữ dữ liệu từ API
  const [orchid, setOrchid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrchid = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết theo ID (đảm bảo id được truyền đúng kiểu)
        const response = await orchidService.getById(id);
        setOrchid(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết hoa lan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrchid();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (!orchid) return <Container className="py-5"><h4>Dữ liệu không tồn tại!</h4></Container>;

  return (
    <Container className="py-5">
      <Button variant="secondary" onClick={() => navigate('/orchids')} className="mb-4">
        &larr; Back to List
      </Button>

      <Card className="shadow-lg border-0 overflow-hidden">
        <Row className="g-0">
          <Col md={6} style={{ minHeight: '500px' }}> 
            <img 
              src={orchid.image} 
              alt={orchid.orchidName} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          </Col>

          <Col md={6} className="d-flex align-items-center">
            <Card.Body className="p-5">
              <h1 className="fw-bold display-5">{orchid.orchidName}</h1>
              
              <div className="mb-3">
                <Badge bg="info" className="me-2 fs-6">{orchid.category}</Badge>
                {orchid.isSpecial && (
                  <Badge bg="warning" text="dark" className="fs-6">🌟 Special</Badge>
                )}
              </div>

              <hr />
              
              <h5 className="fw-bold text-secondary">Description:</h5>
              <p className="text-muted" style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.7' }}>
                {orchid.description}
              </p>

              <div className="mt-4 p-4 bg-light rounded-3 border-start border-primary border-5">
                <h3 className="text-primary mb-0 fw-bold">Price: $99.00</h3>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default OrchidDetail;