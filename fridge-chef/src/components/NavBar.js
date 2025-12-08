import React, { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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

  // 로고/브랜드 클릭 → 검색 상태 초기화 + 홈으로 이동
  const handleBrandClick = (e) => {
    e.preventDefault(); // 기본 Link 동작 막고
    if (dispatch) {
      dispatch({ type: 'RESET_SEARCH' });
    }
    navigate('/'); // 홈으로 이동
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
          as={Link}
          to="/"
          onClick={handleBrandClick}
          className="d-flex align-items-center"
          style={{
            color: 'var(--text-brown)',
            fontWeight: 'bold',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          <img
            src="/assets/logo/logo.png"
            alt="한식 냉장고 로고"
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <span>냉장고 너머의 한(韓)상</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center">
            <NavLink to="/" style={linkStyle} end>
              재료로 찾기
            </NavLink>

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
