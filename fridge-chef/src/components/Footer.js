import React from 'react';
import { Container, Button } from 'react-bootstrap';

export default function Footer() {
  return (
    // mt-auto: 내용이 짧아도 푸터를 아래로 밀어냄 (Flexbox와 함께 사용 시)
    <footer className="py-4 mt-auto bg-light text-center border-top">
      <Container>
        
        {/* 출처 버튼 */}
        <a 
          href="https://www.foodsafetykorea.go.kr/api/newDatasetDetail.do" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button variant="outline-secondary" size="sm" style={{ fontSize: '0.8rem' }}>
            레시피 출처: 식품안전나라
          </Button>
        </a>
      </Container>
    </footer>
  );
}