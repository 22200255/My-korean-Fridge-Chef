// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RecipeProvider } from './context/RecipeContext';

import AppNavBar from './components/NavBar';
import Footer from './components/Footer';  
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';

import './styles/Theme.css';

function App() {
  return (
    <RecipeProvider>
      <Router>
        <div className="app-main-container d-flex flex-column min-vh-100">
          <AppNavBar />

          <main className="app-content">
            <Routes>
              {/* 홈: 재료 입력 + 레시피 검색(Search를 HomePage에서 감싸서 사용) */}
              <Route path="/" element={<HomePage />} />

              {/* 레시피 목록 (Search 재사용) */}
              <Route path="/recipes" element={<RecipesPage />} />

              {/* 새 상세 경로 (/recipes/:id) – 나중에 확장 여지용 */}
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />

              {/* 기존 상세 경로도 그대로 유지 (/recipe/view) */}
              <Route path="/recipe/view" element={<RecipeDetailPage />} />

              {/* 즐겨찾기: 기존 MyRecipes 재사용 */}
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* 새 페이지들 */}
              <Route path="/about" element={<AboutPage />} />

              {/* 잘못된 경로 → 홈으로 */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </RecipeProvider>
  );
}

export default App;
