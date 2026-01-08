import React, { useState } from 'react';
import { Row, Col, Container, Card, Button, Badge } from 'react-bootstrap';
import OrchidsData from '../listofOrchid/listofOrchid.js';
import ConfirmModal from './ConfirmModal';

export default function Orchids() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleShow = (orchid) => {
    setSelected(orchid);
    setShow(true);
  }

  const handleClose = () => setShow(false);

  return (
    <Container>
      <Row className="g-4">
        {OrchidsData.map((orchid) => (
          <Col md={3} key={orchid.id}>
            <Card className="h-100 d-flex flex-column">
              <Card.Img variant="top" src={orchid.image} style={{ objectFit: 'cover', height: '200px' }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>
                  {orchid.orchidName}{" "}
                  {orchid.isSpecial && <Badge bg="warning" text="dark">Special</Badge>}
                </Card.Title>
                <Card.Text>{orchid.category}</Card.Text>
                <Button 
                  variant="primary" 
                  onClick={() => handleShow(orchid)} 
                  className="mt-auto"
                >
                  Detail
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <ConfirmModal
        show={show}
        handleClose={handleClose}
        title={selected ? selected.orchidName : ''}
        body={selected && (
          <div>
            <img src={selected.image} alt={selected.orchidName} style={{ width: '100%' }} />
            <p>{selected.description}</p>
            {selected.isSpecial && <p><strong>Special</strong></p>}
          </div>
        )}
        onConfirm={handleClose}
      />
    </Container>
  )
}
