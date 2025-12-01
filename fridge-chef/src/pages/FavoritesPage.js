import React from 'react';
import { Container } from 'react-bootstrap';
import MyRecipes from './MyRecipes';  // 기존 즐겨찾기 페이지

function FavoritesPage() {
  return (
    <Container className="mt-4 mb-4">
      <MyRecipes />
    </Container>
  );
}

export default FavoritesPage;
