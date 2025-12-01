import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Search from './pages/Search';
import MyRecipes from './pages/MyRecipes';
import RecipeDetail from './pages/RecipeDetail';
import { RecipeProvider } from './context/RecipeContext';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <RecipeProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          
          <Navbar bg="dark" variant="dark">
            <Container className="d-flex flex-nowrap justify-content-start">
              <Navbar.Brand as={Link} to="/" className="text-nowrap me-4">
                👨‍🍳 My Korean Chef
              </Navbar.Brand>
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
              <Route path="/recipe/view" element={<RecipeDetail />} />
            </Routes>
          </div>

          <Footer />
          
        </div>
      </Router>
    </RecipeProvider>
  );
}

export default App;