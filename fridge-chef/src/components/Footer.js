import React from 'react';
import { Container, Button } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer
      className="py-4 mt-auto text-center border-top"
      style={{ backgroundColor: 'var(--bg-cream)' }}
    >
      <Container>
        <a
          href="https://www.foodsafetykorea.go.kr/api/newDatasetDetail.do"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button
            size="sm"
            style={{
              fontSize: '0.8rem',
              backgroundColor: 'var(--sub-beige)',
              borderColor: 'var(--sub-beige)',
              color: 'var(--text-brown)'
            }}
          >
            레시피 출처: 식품안전나라
          </Button>
        </a>
      </Container>
    </footer>
  );
}
