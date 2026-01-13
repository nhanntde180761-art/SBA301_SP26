import React, { useState } from 'react'
import { Row, Col, Container, Card, Button, Badge } from 'react-bootstrap'
import OrchidsData from '../listofOrchid/listofOrchid'
import FilterSort from './FilterSort'
import ConfirmModal from './ConfirmModal'
import SearchByName from './SearchByName'

function ListOfOrchid() {
  const [filterCategory, setFilterCategory] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState(null)
  const [searchText, setSearchText] = useState('')

  const handleShow = (orchid) => {
    setSelected(orchid)
    setShow(true)
  }

  const handleClose = () => setShow(false)

  // filter
  let data = OrchidsData.filter(
    (o) =>
      (filterCategory === '' || o.category === filterCategory) &&
      o.orchidName.toLowerCase().includes(searchText.toLowerCase())
  )

  // sort
  if (sortOption === 'price-asc') data.sort((a, b) => a.price - b.price)
  if (sortOption === 'price-desc') data.sort((a, b) => b.price - a.price)
  if (sortOption === 'name-asc') data.sort((a, b) => a.orchidName.localeCompare(b.orchidName))
  if (sortOption === 'name-desc') data.sort((a, b) => b.orchidName.localeCompare(a.orchidName))

  const categories = [...new Set(OrchidsData.map((o) => o.category))]

  // css inline cho card luôn đồng đều
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }

  const imgStyle = {
    height: '200px',
    objectFit: 'cover',
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">danh sách hoa lan</h2>

      <SearchByName onSearch={setSearchText} />

      <FilterSort
        categories={categories}
        onFilterChange={setFilterCategory}
        onSortChange={setSortOption}
      />

      <Row className="g-4">
        {data.map((o) => (
          <Col md={4} lg={3} sm={6} key={o.id}>
            <Card className="w-100" style={cardStyle}>
              <Card.Img src={o.image} style={imgStyle} />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">
                  {o.orchidName}{' '}
                  {o.isSpecial && (
                    <Badge bg="warning" text="dark">
                      special
                    </Badge>
                  )}
                </Card.Title>
                <Card.Text className="text-center">{o.category}</Card.Text>
                <Button className="mt-auto" onClick={() => handleShow(o)}>
                  detail
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <ConfirmModal
        show={show}
        handleClose={handleClose}
        title={selected?.orchidName}
        body={
          selected && (
            <>
              <img
                src={selected.image}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <p>{selected.description}</p>
              <p>price: ${selected.price}</p>
            </>
          )
        }
        onConfirm={handleClose}
      />
    </Container>
  )
}

export default ListOfOrchid
