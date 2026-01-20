import React from 'react';
import { Carousel, Image } from 'react-bootstrap';
import Banners from '../listofOrchid/bannerData';

function Banner() {
  return (
    <Carousel fade interval={3000} className="mb-5 shadow">
      {Banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <Image
            className="d-block w-100"
            src={banner.image}
            alt={banner.title}
            style={{ 
                objectFit: 'cover', 
                height: '450px', 
                width: '100%' 
            }}
          />
          <Carousel.Caption 
            style={{ 
                background: 'rgba(0,0,0,0.5)', 
                borderRadius: '15px', 
                padding: '20px',
                bottom: '10%'
            }}
          >
            <h3 className="fw-bold">{banner.title}</h3>
            <p className="fs-5">{banner.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Banner;