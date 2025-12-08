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
    searchState = { query: "", results: [], category: "All", isExact: false },
    dispatch,
    addRecipe // Context에서 addRecipe 함수 가져오기
  } = contextValue;

  const { query, results, category, isExact } = searchState;

  const { loading, error, fetchRecipes } = useApi();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query && inputRef.current) inputRef.current.focus();
  }, [query]);

  const updateSearchState = (updates) => {
    dispatch &&
      dispatch({
        type: 'SET_SEARCH_STATE',
        payload: updates
      });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('재료를 입력해 주세요!');
      return;
    }

    const data = await fetchRecipes(query.trim());
    let filtered = data || [];

    // 1차 필터링
    if (category !== 'All') {
      filtered = filtered.filter((r) => r.RCP_PAT2 === category);
    }

    if (isExact && query.trim()) {
      const q = query.trim();
      filtered = filtered.filter(
        (r) => r.RCP_PARTS_DTLS && r.RCP_PARTS_DTLS.includes(q)
      );
    }

    updateSearchState({
      query: query.trim(),
      results: filtered,
      category,
      isExact
    });
  };

  const goToDetail = (recipe) => {
    navigate('/recipe/view', { state: { recipe } });
  };

  const handleSave = (recipe) => {
    if (addRecipe) {
      addRecipe(recipe);
    }
  };

  // 2차 필터링 (Memoization)
  const filteredData = useMemo(() => {
    if (!results || results.length === 0) return [];
    let data = results;

    if (category !== 'All') {
      data = data.filter((r) => r.RCP_PAT2 === category);
    }

    if (isExact && query.trim()) {
      const q = query.trim();
      data = data.filter(
        (r) => r.RCP_PARTS_DTLS && r.RCP_PARTS_DTLS.includes(q)
      );
    }

    return data;
  }, [results, category, isExact, query]);

  return (
    <Container className="mt-5">
      <h2>🍳 냉장고 재료로 레시피 찾기</h2>
      
      <Form onSubmit={handleSearch} className="mb-4">
        {/* [수정] 순서 변경: 필터(Select) -> 입력창(Input) -> 버튼(Button) */}
        <Row className="g-2 align-items-center">
          
          {/* 1. 검색 필터 (왼쪽 배치) */}
          <Col xs={6} md={3}>
            <Form.Select
              value={category}
              onChange={(e) =>
                updateSearchState({ category: e.target.value })
              }
            >
              <option value="All">전체 종류</option>
              <option value="반찬">반찬</option>
              <option value="국&찌개">국&찌개</option>
              <option value="일품">일품</option>
              <option value="후식">후식</option>
            </Form.Select>
          </Col>

          {/* 2. 검색어 입력 창 (중앙 배치) */}
          <Col xs={12} md={6}>
            <Form.Control
              ref={inputRef}
              type="text"
              placeholder="재료 입력 (예: 새우, 계란)"
              value={query}
              onChange={(e) => updateSearchState({ query: e.target.value })}
            />
          </Col>

          {/* 3. 검색 버튼 (오른쪽 배치) */}
          <Col xs={6} md={3}>
            <Button
              type="submit"
              className="w-100"
              disabled={loading}
              style={{
                backgroundColor: 'var(--point-orange)',
                borderColor: 'var(--point-orange)',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              {loading ? '검색 중...' : '검색'}
            </Button>
          </Col>
        </Row>

        {/* 토글 스위치 중앙 정렬 */}
        <div className="mt-2 d-flex justify-content-center">
          <Form.Check
            type="switch"
            id="exact-switch"
            label="재료명 정확히 일치만 보기"
            checked={isExact}
            onChange={(e) =>
              updateSearchState({ isExact: e.target.checked })
            }
          />
        </div>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredData.map((recipe, index) => {
          const allergies = checkAllergies(recipe.RCP_PARTS_DTLS);

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

                  {allergies.length > 0 && (
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <OverlayTrigger
                        placement="left"
                        overlay={
                          <Tooltip id={`tooltip-${index}`}>
                            {allergies.join(', ')}
                          </Tooltip>
                        }
                      >
                        <Badge bg="warning" text="dark" style={{cursor: 'help'}}>
                          ⚠️ 알레르기 주의
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

                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`parts-${index}`}>
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