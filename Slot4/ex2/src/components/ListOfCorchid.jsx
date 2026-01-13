import React, { useState } from 'react'
import { Row, Col, Container, Card, Button, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom' 
import OrchidsData from '../listofOrchid/listofOrchid'
import FilterSort from './FilterSort'
import SearchByName from './SearchByName'

function ListOfOrchid() {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [searchText, setSearchText] = useState('')

  // Logic filter và sort
  let data = OrchidsData.filter(
    (o) =>
      (filterCategory === '' || o.category === filterCategory) &&
      o.orchidName.toLowerCase().includes(searchText.toLowerCase())
  )

  // ... (giữ nguyên logic sort của bạn)

  return (
    <Container className="py-5">
      {/* Nếu bạn muốn Header chỉ xuất hiện ở trang danh sách, hãy đặt nó vào đây */}
      {/* <Header /> */}
      
      <h2 className="text-center mb-4">Danh sách hoa lan</h2>

      <SearchByName onSearch={setSearchText} />

      <FilterSort
        categories={[...new Set(OrchidsData.map((o) => o.category))]}
        onFilterChange={setFilterCategory}
        onSortChange={setSortOption}
      />

      <Row className="g-4">
        {data.map((o) => (
          <Col md={4} lg={3} sm={6} key={o.id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img src={o.image} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body className="d-flex flex-column text-center">
                <Card.Title>
                  {o.orchidName}
                  {o.isSpecial && <Badge bg="warning" text="dark" className="ms-1">special</Badge>}
                </Card.Title>
                <Card.Text>{o.category}</Card.Text>
                
                {/* Nút bấm thực hiện nhảy trang */}
                <Button 
                  variant="primary" 
                  className="mt-auto" 
                  onClick={() => navigate(`/detail/${o.id}`)}
                >
                  Detail
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default ListOfOrchid