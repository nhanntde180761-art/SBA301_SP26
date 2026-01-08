import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function ListOfCorchid({ orchids = [], onViewDetail }) {
  return (
    <Container>
      <Row>
        {orchids.map((o) => (
          <Col md={4} key={o.id} className="mb-4">
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={o.image}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{o.orchidName}</Card.Title>
                <Card.Text>{o.category}</Card.Text>
                {o.isSpecial && (
                  <span className="badge bg-danger mb-2">special</span>
                )}
                <Button
                  variant="primary"
                  className="mt-auto"
                  onClick={() => onViewDetail(o)}
                >
                  xem chi tiết
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default ListOfCorchid
