import React from 'react';
import { Container } from 'react-bootstrap';

function Header() {
  return (
    <header className="text-center py-4 bg-light shadow-sm mb-4">
      <Container>
        <h1>Welcome to website</h1>
        <button style={{ 
          backgroundColor: 'deepskyblue', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '5px' 
        }}>
          Click Me
        </button>
      </Container>
    </header>
  );
}

export default Header;