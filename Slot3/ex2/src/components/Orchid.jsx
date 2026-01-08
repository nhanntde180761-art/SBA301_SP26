//tạo component Orchid hiển thị: id, name, description, hình ảnh và price, isSpecial của 1  hoa phong lan
//hiển thị trong 1 Card của react-bootstrap
import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/esm/Card';

function Orchid() {
    //Tạo 1 object orchid với các thuộc tính id, orchidName, description, image, price, isSpecial
    const orchid = {
        id: 1,
        orchidName: "Ceasar 4N",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta lobortis ex. Morbi cursus consectetur diam, non lobortis massa gravida eu. Duis molestie purus vel ligula suscipit, sit amet iaculis justo tempus. Cras pellentesque urna in feugiat fringilla. Vivamus dictum lacinia nulla, id rhoncus lectus fermentum et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta lobortis ex. or sit amet, consectetur adipiscing elit. Nulla porta lobortis ex. or sit amet, consectetur adipiscing elit",
        image: "/images/Orchid1.jpg",
        price: 25.00,
        isSpecial: true
    };
    return (
        <div>
            <Container className="py-5">
            <Row>
                <Col>   
                    <h2>Hoa phong lan</h2>
                    <Card>
                        <Card.Img variant="top" src={orchid.image} />
                        <Card.Body>
                            <Card.Title>{orchid.orchidName}</Card.Title>
                            <Card.Text>
                                <p>id: {orchid.id}</p>
                                <p>orchidName: {orchid.orchidName}</p>
                            </Card.Text>
                            <Card.Text>Description: {orchid.description}</Card.Text>
                            <Card.Text>Price: ${orchid.price}</Card.Text>
                            <Card.Text>isSpecial: {orchid.isSpecial.toString()}</Card.Text>
                    
                        </Card.Body>
                    </Card>
                </Col>
            </Row>  
            </Container>
        </div>
    );
}
export default Orchid;