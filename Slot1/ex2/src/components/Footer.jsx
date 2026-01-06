// Footer.jsx
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import avatar from '../assets/OIP.jpg'; // import ảnh từ thư mục assets

function Footer() {
  return (
    <footer className="bg-light text-center py-4 mt-auto">
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={2}>
            <Image
              src={avatar} // dùng biến import
              alt="Author Avatar"
              className="rounded-circle"
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
          </Col>
          <Col xs={8}>
            <h5>Tác giả: &copy; nhannt</h5>
            <small>All rights reserved.</small>
          </Col>
          <Col xs={2}>
            <a href="nhanntde18076@fpt.edu.vn">nhanntde18076@fpt.edu.vn</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
