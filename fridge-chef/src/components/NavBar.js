// src/components/NavBar.js
import React, { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { RecipeContext } from '../context/RecipeContext';

function AppNavBar() {
  const navigate = useNavigate();
  const { dispatch } = useContext(RecipeContext) || {};

  const linkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--point-orange)' : 'var(--text-brown)',
    fontWeight: isActive ? 'bold' : 'normal',
    marginLeft: '12px',
    textDecoration: 'none'
  });

  // ✅ 로고/브랜드 클릭 → 무조건 랜딩 + 검색 상태 초기화
  const handleBrandClick = (e) => {
    e.preventDefault();
    if (dispatch) dispatch({ type: 'RESET_SEARCH' });
    navigate('/', { state: { reset: true, mode: 'landing' } });
  };

  // ✅ 상단 "재료로 찾기" 메뉴 클릭 → 기존 Search 화면(원본 느낌) 유지
  const handleGoSearchPage = (e) => {
    e.preventDefault();
    navigate('/', { state: { mode: 'search' } });
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{
        backgroundColor: 'var(--bg-cream)',
        borderBottom: '1px solid var(--sub-beige)'
      }}
    >
      <Container>
        {/* 왼쪽 상단 로고 + 텍스트 */}
        <Navbar.Brand
          href="/"
          onClick={handleBrandClick}
          className="d-flex align-items-center"
          style={{
            color: 'var(--text-brown)',
            fontWeight: 'bold',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          {/* ✅ 로고 선명도 개선: objectFit을 contain으로 + 브라우저가 더 선명하게 샘플링하도록 width/height 명시 */}
          <img
            src="/assets/logo/logo.png"
            srcSet="/assets/logo/logo.png 2x"
            alt="한식 냉장고 로고"
            width={40}
            height={40}
            style={{
              marginRight: 10,
              borderRadius: '50%',
              objectFit: 'contain'
            }}
          />
          <span>냉장고 너머의 한(韓)상</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center">
            {/* ✅ 재료로 찾기: 기존 Search 화면 모드로 진입 */}
            <Nav.Link href="/" onClick={handleGoSearchPage} style={linkStyle({ isActive: false })}>
              재료로 찾기
            </Nav.Link>

            <NavLink to="/recipes" style={linkStyle}>
              레시피 목록
            </NavLink>

            <NavLink to="/favorites" style={linkStyle}>
              즐겨찾기
            </NavLink>

            <NavLink to="/about" style={linkStyle}>
              소개
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
