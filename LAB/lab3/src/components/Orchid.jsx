import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import OrchidsData from '../listofOrchid/listofOrchid.js'; 

function OrchidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const orchid = OrchidsData.find((o) => String(o.id) === String(id));

  if (!orchid) return <Container className="py-5"><h4>Dữ liệu không tồn tại!</h4></Container>;

  return (
    <Container className="py-5">
      {/* Sửa tại đây: Navigate về '/orchids' thay vì '/' để tránh gặp trang Login */}
      <Button variant="secondary" onClick={() => navigate('/orchids')} className="mb-4">
        &larr; Back to List
      </Button>

      <Card className="shadow-lg border-0 overflow-hidden">
        <Row className="g-0">
          <Col md={6}>
            <img 
              src={orchid.image} 
              alt={orchid.orchidName} 
              style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover' }} 
            />
          </Col>
          <Col md={6} className="p-4">
            <Card.Body>
              <h1 className="fw-bold">{orchid.orchidName}</h1>
              <Badge bg="info" className="mb-3">{orchid.category}</Badge>
              <hr />
              <p className="text-muted lh-lg">{orchid.description}</p>
              <h3 className="text-primary fw-bold mt-4">Price: $99.00</h3>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default OrchidDetail;