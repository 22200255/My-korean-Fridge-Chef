// src/pages/Search.js

import React, { useMemo, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { RecipeContext } from '../context/RecipeContext';
import { checkAllergies } from '../utils/allergyUtils';
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  OverlayTrigger,
  Tooltip,
  Badge
} from 'react-bootstrap';

export default function Search() {
  const contextValue = useContext(RecipeContext) || {};
  const {
    searchState = {
      query: '',
      results: [],
      category: 'All',
      isExact: false,
      hasSearched: false
    },
    savedRecipes = [],
    dispatch
  } = contextValue;

  const { query, results, category, isExact, hasSearched } = searchState;

  const { loading, error, fetchRecipes } = useApi();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // 검색어가 비어 있을 때만 자동 포커스
  useEffect(() => {
    if (!query && inputRef.current) inputRef.current.focus();
  }, [query]);

  const updateSearchState = (updates) => {
    if (!dispatch) return;
    dispatch({ type: 'SET_SEARCH_STATE', payload: updates });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = (query || '').trim();
    if (!trimmed) {
      alert('재료를 입력해 주세요.');
      return;
    }
    const data = await fetchRecipes(trimmed);
    // 실제 검색이 실행되었음을 표시
    updateSearchState({ results: data, hasSearched: true });
  };

  const filteredData = useMemo(() => {
    if (!results) return [];

    let filtered = results;

    if (category !== 'All') {
      filtered = filtered.filter((item) => item.RCP_PAT2 === category);
    }

    if (isExact) {
      filtered = filtered.filter((recipe) => {
        if (!recipe.RCP_PARTS_DTLS) return false;
        const ingredients = recipe.RCP_PARTS_DTLS
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);
        return ingredients.includes((query || '').trim());
      });
    }

    return filtered;
  }, [results, category, isExact, query]);

  const goToDetail = (recipe) => {
    navigate('/recipe/view', { state: { recipe } });
  };

  const handleSave = (recipe) => {
    if (!dispatch) return;
    const currentSaved = savedRecipes || [];
    if (currentSaved.some((r) => r.RCP_SEQ === recipe.RCP_SEQ)) {
      alert('이미 저장된 레시피입니다.');
      return;
    }
    dispatch({ type: 'ADD', payload: recipe });
    alert('나만의 레시피북에 저장되었습니다.');
  };

  // 처음 화면인지 여부는 hasSearched 로만 판단
  const isInitial = !hasSearched;

  // 공통 검색 폼 (카테고리 / 입력 / 버튼 높이 50px 통일)
  const searchForm = (
    <Form onSubmit={handleSearch} className="mb-3">
      <Row className="g-2 align-items-center">
        {/* 왼쪽: 전체 종류(카테고리) */}
        <Col xs="auto">
          <Form.Select
            value={category}
            onChange={(e) => updateSearchState({ category: e.target.value })}
            style={{ height: '50px' }}
          >
            <option value="All">전체 종류</option>
            <option value="반찬">반찬</option>
            <option value="국&찌개">국&찌개</option>
            <option value="일품">일품</option>
            <option value="후식">후식</option>
          </Form.Select>
        </Col>

        {/* 가운데: 재료 입력 박스 */}
        <Col>
          <Form.Control
            ref={inputRef}
            style={{ height: '50px' }}
            type="text"
            placeholder="재료 입력 (예: 새우, 계란)"
            value={query}
            onChange={(e) => updateSearchState({ query: e.target.value })}
          />
        </Col>

        {/* 오른쪽: 검색 버튼 */}
        <Col xs="auto">
          <Button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--point-orange)',
              borderColor: 'var(--point-orange)',
              color: '#fff',
              fontWeight: 'bold',
              height: '50px',
              paddingInline: '16px'
            }}
          >
            {loading ? '검색 중...' : '검색'}
          </Button>
        </Col>
      </Row>

      {/* 아래: 재료명 정확히 일치만 보기 */}
      <div className="mt-2">
        <Form.Check
          type="switch"
          id="exact-switch"
          label="재료명 정확히 일치만 보기"
          checked={isExact}
          onChange={(e) => updateSearchState({ isExact: e.target.checked })}
        />
      </div>
    </Form>
  );

  // 처음 진입 화면
  if (isInitial) {
    return (
      <div style={{ paddingTop: '6rem' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <div className="text-center mb-4">
                <h1
                  style={{
                    color: 'var(--text-brown)',
                    fontWeight: 'bold'
                  }}
                >
                  냉장고 너머의 한상
                </h1>
                <p
                  style={{
                    color: 'var(--text-brown)',
                    opacity: 0.85
                  }}
                >
                  냉장고 속 재료를 입력하면, 그 재료로 만들 수 있는 한식 레시피를 추천해 드립니다.
                </p>
              </div>
              {searchForm}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // 한 번이라도 검색한 후 화면
  return (
    <Container className="mt-4 mb-4">
      <h2 className="mb-3">재료로 한식 레시피 찾기</h2>

      {searchForm}

      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredData.map((recipe, index) => {
          const allergies = checkAllergies(recipe.RCP_PARTS_DTLS || '');

          return (
            <Col key={index}>
              <Card className="h-100 shadow-sm border-0">
                <div
                  style={{ cursor: 'pointer', position: 'relative' }}
                  onClick={() => goToDetail(recipe)}
                >
                  <Card.Img
                    variant="top"
                    src={recipe.ATT_FILE_NO_MAIN}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />

                  {/* 알레르기 경고 배지 */}
                  {allergies.length > 0 && (
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <OverlayTrigger
                        placement="left"
                        overlay={
                          <Tooltip id={`alert-${index}`}>
                            포함된 알레르기 유발 가능 재료:
                            <br />
                            {allergies.join(', ')}
                          </Tooltip>
                        }
                      >
                        <Badge
                          bg="warning"
                          text="dark"
                          style={{ cursor: 'help' }}
                        >
                          알레르기 주의
                        </Badge>
                      </OverlayTrigger>
                    </div>
                  )}
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span
                      className="text-truncate"
                      style={{ maxWidth: '70%' }}
                    >
                      {recipe.RCP_NM}
                    </span>
                    <Badge bg="secondary">{recipe.RCP_PAT2}</Badge>
                  </Card.Title>

                  {/* 재료 목록 툴팁 */}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip id={`t-${index}`}>
                        {recipe.RCP_PARTS_DTLS}
                      </Tooltip>
                    }
                  >
                    <Card.Text
                      className="text-muted text-truncate"
                      style={{ cursor: 'help' }}
                    >
                      {recipe.RCP_PARTS_DTLS}
                    </Card.Text>
                  </OverlayTrigger>

                  <div className="mt-auto d-flex gap-2">
                    <Button
                      className="flex-grow-1"
                      onClick={() => goToDetail(recipe)}
                      style={{
                        backgroundColor: 'var(--point-orange)',
                        borderColor: 'var(--point-orange)',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    >
                      조리법 보기
                    </Button>
                    <Button
                      onClick={() => handleSave(recipe)}
                      style={{
                        backgroundColor: 'var(--sub-beige)',
                        borderColor: 'var(--sub-beige)',
                        color: 'var(--text-brown)',
                        fontWeight: 'bold'
                      }}
                    >
                      저장
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
