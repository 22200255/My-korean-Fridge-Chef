// src/pages/RecipesPage.js

import React, { useEffect, useState, useMemo } from 'react';
import { Container, ButtonGroup, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const API_KEY = process.env.REACT_APP_API_KEY;

// Search에서 쓰던 카테고리와 동일
const CATEGORY_OPTIONS = [
  { value: 'All', label: '전체 종류' },
  { value: '반찬', label: '반찬' },
  { value: '국&찌개', label: '국 & 찌개' },
  { value: '일품', label: '일품 요리' },
  { value: '후식', label: '후식' },
];

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 페이지 처음 들어올 때 전체 레시피 한 번 불러오기
  useEffect(() => {
    const fetchAllRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        // ⚠ 필요에 따라 1/200 → 1/500, 1/1000 으로 늘릴 수 있음
        const url = `/api/${API_KEY}/COOKRCP01/json/1/200`;
        const response = await axios.get(url);

        // 공공데이터 포맷: data.COOKRCP01.row 에 레시피 배열이 들어있음
        const data = response.data;
        const rows =
          data &&
          data.COOKRCP01 &&
          Array.isArray(data.COOKRCP01.row)
            ? data.COOKRCP01.row
            : [];

        setAllRecipes(rows);
      } catch (err) {
        console.error('전체 레시피 불러오기 에러:', err);
        setError('레시피 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  // 카테고리로 필터링된 리스트
  const filteredRecipes = useMemo(() => {
    if (!allRecipes || allRecipes.length === 0) return [];

    if (selectedCategory === 'All') return allRecipes;

    return allRecipes.filter((recipe) => recipe.RCP_PAT2 === selectedCategory);
  }, [allRecipes, selectedCategory]);

  const goToDetail = (recipe) => {
    navigate('/recipe/view', { state: { recipe } });
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="mb-2">🍲 전체 레시피 목록</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-brown)' }}>
        공공데이터 API에서 불러온 <strong>전체 한식 레시피</strong>를 종류별로 둘러볼 수 있어요.
      </p>

      {/* 로딩 상태 */}
      {loading && (
        <div className="mt-4 text-center">
          <Spinner animation="border" role="status" size="sm" className="me-2" />
          <span>레시피를 불러오는 중입니다...</span>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {/* 데이터 없음 */}
      {!loading && !error && allRecipes.length === 0 && (
        <Alert variant="light" className="mt-3">
          불러온 레시피가 없습니다. API 키나 요청 범위(1/200)를 다시 확인해 주세요.
        </Alert>
      )}

      {/* 카테고리 버튼 */}
      {!loading && allRecipes.length > 0 && (
        <>
          <div className="mt-3 mb-3">
            <ButtonGroup>
              {CATEGORY_OPTIONS.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'warning' : 'light'}
                  onClick={() => setSelectedCategory(cat.value)}
                  style={{
                    border: '1px solid var(--sub-beige)',
                    color: 'var(--text-brown)',
                    fontWeight: selectedCategory === cat.value ? 'bold' : 'normal'
                  }}
                >
                  {cat.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* 필터링된 레시피 카드 목록 */}
          {filteredRecipes.length === 0 ? (
            <Alert variant="light">
              선택한 카테고리에 해당하는 레시피가 없습니다.
            </Alert>
          ) : (
            <Row className="mt-3">
              {filteredRecipes.map((recipe) => (
                <Col key={recipe.RCP_SEQ} xs={12} md={6} lg={4}>
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => goToDetail(recipe)}
                    // 여기서는 즐겨찾기 토글은 사용 X (즐겨찾기는 MyRecipes 쪽에서 관리)
                    onToggleFavorite={null}
                    isFavorite={false}
                  />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}
