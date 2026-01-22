import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col, Card, Button, Container, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orchidService } from '../api/orchidapi'; 
import Header from './Header';
import ConfirmModal from './ConfirmModal';

function ListOfOrchid({ searchText, filterCategory, sortOption }) {
  const navigate = useNavigate();
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await orchidService.getAll(); 
      setOrchids(response.data); 
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await orchidService.delete(selectedId);
      setShowModal(false); 
      fetchData(); // Cập nhật lại danh sách ngay lập tức
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Không thể xóa lúc này, vui lòng thử lại.");
    }
  };

  const filteredData = useMemo(() => {
    let result = [...orchids].filter(
      (o) =>
        (filterCategory === '' || o.category === filterCategory) &&
        o.orchidName.toLowerCase().includes(searchText.toLowerCase())
    );

    if (sortOption === 'name-asc') {
      result.sort((a, b) => a.orchidName.localeCompare(b.orchidName));
    } else if (sortOption === 'name-desc') {
      result.sort((a, b) => b.orchidName.localeCompare(a.orchidName));
    }
    return result;
  }, [orchids, searchText, filterCategory, sortOption]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Đang kết nối dữ liệu...</p>
      </Container>
    );
  }

  return (
    <Container className="pb-5 min-vh-100">
      <Header />
      <div className="d-flex justify-content-between align-items-center my-4">
        <div>
          <h2 className="fw-bold text-uppercase m-0">Quản Lý Hoa Lan</h2>
          <small className="text-muted">Tìm thấy {filteredData.length} kết quả</small>
        </div>
        <Button variant="success" className="fw-bold px-4" onClick={() => navigate('/add')}>
          + Thêm Hoa Lan
        </Button>
      </div>

      {filteredData.length > 0 ? (
        <Row className="g-4">
          {filteredData.map((o) => (
            <Col xs={12} sm={6} md={4} lg={3} key={o.id}>
              <Card className="h-100 shadow-sm border-0 orchid-card">
                <div className="position-relative overflow-hidden" style={{ borderRadius: '8px 8px 0 0' }}>
                  <Card.Img 
                    variant="top" 
                    src={o.image} 
                    style={{ height: '220px', objectFit: 'cover' }} 
                  />
                  {o.isSpecial && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2 shadow">
                      Special
                    </Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column text-center">
                  <Card.Title className="fw-bold fs-5 mb-1">{o.orchidName}</Card.Title>
                  <div className="mb-3">
                    <Badge bg="light" className="text-secondary border">
                      {o.category}
                    </Badge>
                  </div>
                  <div className="d-flex gap-2 mt-auto">
                    <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => navigate(`/detail/${o.id}`)}>Chi tiết</Button>
                    <Button variant="outline-warning" size="sm" onClick={() => navigate(`/edit/${o.id}`)}>Sửa</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleOpenDeleteModal(o.id)}>Xóa</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center py-5">
          <h4>Không tìm thấy hoa lan nào!</h4>
        </Alert>
      )}

      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa dữ liệu"
        body="Bạn có chắc chắn muốn xóa hoa lan này? Dữ liệu sẽ biến mất vĩnh viễn khỏi máy chủ."
      />
    </Container>
  );
}

export default ListOfOrchid;