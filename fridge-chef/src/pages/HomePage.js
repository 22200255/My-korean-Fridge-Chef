import React from 'react';
import { Container } from 'react-bootstrap';
import Search from './Search';  // 기존 페이지 재사용

function HomePage() {
  return (
    <Container className="mt-4 mb-4">
      <Search />
    </Container>
  );
}

export default HomePage;
