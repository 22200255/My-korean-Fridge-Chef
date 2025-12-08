// src/components/Footer.js

import React from 'react';
import { Container, Button } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer
      className="py-3 mt-auto border-top"
      style={{ backgroundColor: 'var(--bg-cream)' }}
    >
      <Container className="d-flex justify-content-between align-items-center">
        <div
          className="text-start"
          style={{ fontSize: '0.85rem', color: 'var(--text-brown)' }}
        >
          <div>오픈소스스튜디오 3분반</div>
          <div>팀: 냉장고를 부탁해</div>
        </div>

        {/* 오른쪽: API 출처 버튼 (클릭 시 식품안전나라로 이동) */}
        <div className="text-end">
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
              API출처: 식품안전나라
            </Button>
          </a>
        </div>
      </Container>
    </footer>
  );
}
