import React, { useMemo } from 'react';
import { Row, Col, Card, Button, Container, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OrchidsData from '../listofOrchid/listofOrchid';
import Header from './Header';

function ListOfOrchid({ searchText, filterCategory, sortOption }) {
  const navigate = useNavigate();

  // Dùng useMemo để tối ưu hiệu năng và xử lý Sort/Filter
  const data = useMemo(() => {
    // Bước 1: Lọc (Filter)
    let filtered = OrchidsData.filter(
      (o) =>
        (filterCategory === '' || o.category === filterCategory) &&
        o.orchidName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Bước 2: Sắp xếp (Sort) - Sửa lại các điều kiện ở đây
    if (sortOption === 'name-asc') {
      filtered.sort((a, b) => a.orchidName.localeCompare(b.orchidName));
    } else if (sortOption === 'name-desc') {
      filtered.sort((a, b) => b.orchidName.localeCompare(a.orchidName));
    } else if (sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price); // Giả sử bạn có thuộc tính price
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchText, filterCategory, sortOption]); // Chỉ tính toán lại khi 1 trong 3 cái này thay đổi

  return (
    <Container className="pb-5 min-vh-100">
      <Header />
      <h2 className="text-center my-4 fw-bold text-uppercase">Danh Sách Hoa Lan</h2>

      {data.length > 0 ? (
        <Row className="g-4">
          {data.map((o) => (
            <Col xs={12} sm={6} md={4} lg={3} key={o.id}>
              <Card className="h-100 shadow-sm border-0 orchid-card">
                <div className="overflow-hidden" style={{ borderRadius: '8px 8px 0 0' }}>
                  <Card.Img 
                    variant="top" 
                    src={o.image} 
                    style={{ height: '220px', objectFit: 'cover' }} 
                  />
                </div>
                <Card.Body className="d-flex flex-column text-center">
                  <Card.Title className="fw-bold fs-5 mb-1">{o.orchidName}</Card.Title>
                  <div className="mb-3">
                    <Badge bg="secondary-subtle" className="text-secondary border">
                      {o.category}
                    </Badge>
                    {o.isSpecial && (
                      <div className="mt-2 text-danger fw-bold" style={{ fontSize: '0.9rem' }}>
                        <i className="bi bi-patch-check-fill"></i> Special
                      </div>
                    )}
                  </div>
                  <Button variant="outline-primary" className="mt-auto fw-bold w-100" onClick={() => navigate(`/detail/${o.id}`)}>
                    Xem chi tiết
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center py-5 my-5">
          <h4>Không tìm thấy hoa lan nào phù hợp!</h4>
        </Alert>
      )}
    </Container>
  );
}

export default ListOfOrchid;