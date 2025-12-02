import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

function AppNavBar() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--point-orange)' : 'var(--text-brown)',
    fontWeight: isActive ? 'bold' : 'normal',
    marginLeft: '12px'
  });

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: 'var(--bg-cream)',
        borderBottom: '1px solid var(--sub-beige)'
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/assets/logo/logo.png"  // public/assets/logo/logo.png 에 둘 것
            alt="로고"
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <span style={{ color: 'var(--text-brown)', fontWeight: 'bold' }}>
            한식 냉장고 레시피
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink to="/" style={linkStyle}>
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
