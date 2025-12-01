import React from 'react';
import { Container } from 'react-bootstrap';
import RecipeDetail from './RecipeDetail';  // 기존 상세 페이지

function RecipeDetailPage() {
  return (
    <Container className="mt-4 mb-4">
      <RecipeDetail />
    </Container>
  );
}

export default RecipeDetailPage;
