import { Container, Row, Col, Card } from 'react-bootstrap'

function ListOfCorchid({ orchid }) {
  return (
    <Container className="mt-3">
      <Row>
        {orchid.map(o => (
          <Col md={4} key={o.id} className="mb-3">
            <Card>
              <Card.Img variant="top" src={o.image} />
              <Card.Body>
                <Card.Title>{o.orchidName}</Card.Title>
                <Card.Text>{o.description}</Card.Text>
                <p>price: ${o.price}</p>
                {o.isSpecial && <span className="badge bg-danger">special</span>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}


export default ListOfCorchid
