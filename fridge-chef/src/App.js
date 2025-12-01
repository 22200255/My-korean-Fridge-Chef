import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Search from './pages/Search';
import MyRecipes from './pages/MyRecipes';
import { RecipeProvider } from './context/RecipeContext';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <RecipeProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          
          {/* [수정된 Navbar] expand 속성 제거 + flex 설정 추가 */}
          <Navbar bg="dark" variant="dark">
            {/* flex-nowrap: 자식 요소들이 절대 줄바꿈 하지 않음 */}
            <Container className="d-flex flex-nowrap justify-content-start">
              
              {/* text-nowrap: 텍스트 자체가 줄바꿈 되는 것도 방지 */}
              <Navbar.Brand as={Link} to="/" className="text-nowrap me-4">
                👨‍🍳 My Korean Chef
              </Navbar.Brand>
              
              {/* flex-row: 메뉴들을 항상 가로로 배치 */}
              <Nav className="d-flex flex-row gap-3">
                <Nav.Link as={Link} to="/" className="text-nowrap p-0">
                  레시피 검색
                </Nav.Link>
                <Nav.Link as={Link} to="/my" className="text-nowrap p-0">
                  나의 레시피북
                </Nav.Link>
              </Nav>

            </Container>
          </Navbar>

          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/my" element={<MyRecipes />} />
            </Routes>
          </div>

          <Footer />
          
        </div>
      </Router>
    </RecipeProvider>
  );
}

export default App;