import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import OrchidsData from '../listofOrchid/listofOrchid'; 

function OrchidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const orchid = OrchidsData.find((o) => String(o.id) === String(id));

  if (!orchid) return <Container className="py-5"><h4>Dữ liệu không tồn tại!</h4></Container>;

  return (
    <Container className="py-5">
      <Button variant="secondary" onClick={() => navigate('/')} className="mb-4">
        &larr; Back to List
      </Button>

      <Card className="shadow-lg border-0 overflow-hidden">
        <Row className="g-0">
          {/* Cột Ảnh - Đã sửa để ảnh lấp đầy (Full) ô */}
          <Col md={6} style={{ minHeight: '500px' }}> 
            <img 
              src={orchid.image} 
              alt={orchid.orchidName} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', // Ảnh sẽ lấp đầy ô, tự động cắt mép thừa để không bị méo
                display: 'block'
              }} 
            />
          </Col>

          {/* Cột Nội dung */}
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