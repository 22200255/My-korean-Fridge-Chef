// src/pages/HomePage.js
import React from 'react';
import { Container } from 'react-bootstrap';
import Search from './Search';

function HomePage() {
  return (
    <Container className="mb-4">
      <Search />
    </Container>
  );
}

export default HomePage;