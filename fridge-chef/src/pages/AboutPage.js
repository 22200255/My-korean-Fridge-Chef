// src/pages/AboutPage.js

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AboutPage() {
  return (
    <Container className="mt-5 mb-5">
      <Row className="align-items-center">
        {/* 왼쪽: 로고 이미지 */}
        <Col
          xs={12}
          md={4}
          className="mb-5 mb-md-0 d-flex justify-content-center"
        >
          <img
            src="/assets/logo/logo.png"
            alt="냉장고 너머의 한(韓)상 로고"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--sub-beige)',
              backgroundColor: 'white'
            }}
          />
        </Col>

        {/* 오른쪽: 소개 및 기능 설명 */}
        <Col xs={12} md={8}>
          <h2
            className="mb-3"
            style={{
              color: 'var(--text-brown)',
              fontWeight: 'bold',
              fontSize: '2rem'
            }}
          >
            냉장고 너머의 한(韓)상
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-brown)',
              opacity: 0.9,
              lineHeight: '1.7'
            }}
          >
            안녕하세요. <strong>‘냉장고 너머의 한(韓)상’</strong>을 만든 팀,
            <strong> ‘냉장고를 부탁해’</strong>입니다.
            <br />
            냉장고 속에 있는 재료로 뭘 만들 수 있는지 고민되시나요?
            <br />
            혹은 오늘은 좀 색다른 요리를 하고 싶으신가요?
            <br />
            그렇다면 이 서비스가 여러분의 고민을 해결해드립니다.
            <br />
            냉장고 속 재료로 만들 수 있는
            <strong> 다양한 한식 레시피</strong>를 쉽고 빠르게 추천해주는 서비스입니다.
          </p>

          <h4
            className="mt-4 mb-3"
            style={{
              color: 'var(--text-brown)',
              fontWeight: 'bold',
              fontSize: '1.4rem'
            }}
          >
            제공 기능
          </h4>

          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: '1.2rem',
              color: 'var(--text-brown)',
              fontSize: '1rem',
              lineHeight: '1.9'
            }}
          >
            <li>
              <strong>재료 기반 레시피 검색</strong> —
              냉장고 속 재료 이름을 입력하면 그 재료가 포함된 한식 레시피를
              추천합니다.  
            </li>

            <li>
              <strong>레시피 상세 정보 제공</strong> —  
              대표 이미지, 재료 목록, 조리 순서, 과정별 사진을 포함한
              상세 설명을 확인할 수 있습니다.
            </li>

            <li>
              <strong>전체 레시피 둘러보기</strong> —  
              공공데이터(식품안전나라) 기반의 모든 한식 레시피를 종류별로
              확인할 수 있습니다.
            </li>

            <li>
              <strong>즐겨찾기 & 나만의 메모</strong> —  
              관심 있는 레시피를 저장하고, 메모를 남겨  
              나만의 레시피북을 구성할 수 있습니다.
            </li>

            <li>
              <strong>알레르기 주의 표시</strong> —  
              재료 문자열 분석을 통해 알레르기 유발 가능 재료를
              자동으로 감지하고 경고 표시를 제공합니다.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;
