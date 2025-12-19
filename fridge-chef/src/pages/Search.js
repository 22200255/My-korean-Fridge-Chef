// src/pages/Search.js
import React, { useMemo, useRef, useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { RecipeContext } from '../context/RecipeContext';
import { checkAllergies } from '../utils/allergyUtils';
import Logo from '../components/Logo';
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

/**
 * query를 토큰으로 분리한다.
 * - 쉼표(,) 기준
 * - 공백 정리
 */
function parseQueryTokens(query) {
  return (query || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * 토글 ON일 때:
 * - 음식 이름(RCP_NM)에 query 토큰이 "포함"되어야 한다.
 * - 여러 토큰이면 AND 조건(전부 포함)으로 처리한다.
 */
function isNameMatch(rcpName, query) {
  const name = (rcpName || '').toLowerCase();
  const tokens = parseQueryTokens(query).map((t) => t.toLowerCase());

  if (tokens.length === 0) return true;
  if (!name) return false;

  return tokens.every((t) => name.includes(t));
}

export default function Search() {
  const contextValue = useContext(RecipeContext) || {};
  const {
    searchState = { query: "", results: [], category: "All", isExact: false },
    dispatch,
    addRecipe
  } = contextValue;

  const { query, results, category, isExact } = searchState;

  const { loading, error, fetchRecipes } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  // ✅ "검색 후" 화면 전환을 위해 사용 (입력만으로는 랜딩이 사라지지 않도록)
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ mode 제어
  const mode = location.state?.mode; // 'landing' | 'search' | undefined

  // ✅ 로고/브랜드 클릭으로 들어온 reset 신호 처리
  useEffect(() => {
    if (location.state?.reset) {
      if (dispatch) dispatch({ type: 'RESET_SEARCH' });
      setHasSearched(false);

      navigate('/', { replace: true, state: { mode: 'landing' } });
    }
  }, [location.state, dispatch, navigate]);

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

    const trimmed = query.trim();
    const data = await fetchRecipes(trimmed);
    let filtered = data || [];

    // 1) 카테고리 필터
    if (category !== 'All') {
      filtered = filtered.filter((r) => r.RCP_PAT2 === category);
    }

    // ✅ 2) 토글 ON이면 "음식 이름"에 query 포함된 것만
    if (isExact) {
      filtered = filtered.filter((r) => isNameMatch(r.RCP_NM, trimmed));
    }

    updateSearchState({
      query: trimmed,
      results: filtered,
      category,
      isExact
    });

    setHasSearched(true);
  };

  const goToDetail = (recipe) => {
    navigate('/recipe/view', { state: { recipe } });
  };

  const handleSave = (recipe) => {
    if (addRecipe) addRecipe(recipe);
  };

  // ✅ 토글/카테고리 변경 시 즉시 반영(검색 버튼 다시 누르지 않아도 적용)
  const filteredData = useMemo(() => {
    if (!results || results.length === 0) return [];
    let data = results;

    if (category !== 'All') {
      data = data.filter((r) => r.RCP_PAT2 === category);
    }

    if (isExact && query.trim()) {
      data = data.filter((r) => isNameMatch(r.RCP_NM, query.trim()));
    }

    return data;
  }, [results, category, isExact, query]);

  // ✅ 랜딩 표시 조건
  const resolvedMode = mode ?? 'landing';
  const isLanding = resolvedMode === 'landing' && !hasSearched;

  // ✅ 기존 Search UI
  const OriginalSearchUI = (
    <Container className="mt-5">
      <h2>냉장고 재료로 레시피 찾기</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2 align-items-center">
          <Col xs={6} md={3}>
            <Form.Select
              value={category}
              onChange={(e) => updateSearchState({ category: e.target.value })}
            >
              <option value="All">전체 종류</option>
              <option value="반찬">반찬</option>
              <option value="국&찌개">국&찌개</option>
              <option value="일품">일품</option>
              <option value="후식">후식</option>
            </Form.Select>
          </Col>

          <Col xs={12} md={6}>
            <Form.Control
              ref={inputRef}
              type="text"
              placeholder="재료 입력 (예: 새우, 계란)"
              value={query}
              onChange={(e) => updateSearchState({ query: e.target.value })}
            />
          </Col>

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

        {/* ✅ 토글: 전체 종류 하단 좌측 */}
        <Row className="g-2 mt-1">
          <Col xs={12} md={3} className="d-flex justify-content-start">
            <Form.Check
              type="switch"
              id="exact-switch"
              label="재료명 정확히 일치만 보기"
              checked={isExact}
              onChange={(e) => updateSearchState({ isExact: e.target.checked })}
            />
          </Col>
          <Col md={9} className="d-none d-md-block" />
        </Row>
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
                        <Badge bg="warning" text="dark" style={{ cursor: 'help' }}>
                          알레르기 주의
                        </Badge>
                      </OverlayTrigger>
                    </div>
                  )}
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span className="text-truncate" style={{ maxWidth: '70%' }}>
                      {recipe.RCP_NM}
                    </span>
                    <Badge bg="secondary">{recipe.RCP_PAT2}</Badge>
                  </Card.Title>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`parts-${index}`}>{recipe.RCP_PARTS_DTLS}</Tooltip>}
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

  // ✅ 랜딩 UI (유지)
  const LandingUI = (
    <Container className="search-landing">
      <div className="search-landing-center">
        <div className="search-landing-header">
          <Logo size={84} showText={false} />
          <h2 className="search-landing-title">냉장고 재료로 레시피 찾기</h2>
        </div>

        <Form onSubmit={handleSearch} className="search-landing-form">
          <div className="search-form-wrap">
            <Row className="g-2 align-items-center">
              <Col xs={12} md={2}>
                <Form.Select
                  className="search-input-lg"
                  value={category}
                  onChange={(e) => updateSearchState({ category: e.target.value })}
                >
                  <option value="All">전체 종류</option>
                  <option value="반찬">반찬</option>
                  <option value="국&찌개">국&찌개</option>
                  <option value="일품">일품</option>
                  <option value="후식">후식</option>
                </Form.Select>
              </Col>

              <Col xs={12} md={8}>
                <Form.Control
                  ref={inputRef}
                  className="search-input-lg"
                  type="text"
                  placeholder="재료 입력 (예: 새우, 계란)"
                  value={query}
                  onChange={(e) => updateSearchState({ query: e.target.value })}
                />
              </Col>

              <Col xs={12} md={2}>
                <Button
                  type="submit"
                  className="w-100 search-input-lg"
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

            <Row className="g-2 mt-1">
              <Col md={2} className="d-none d-md-block" />
              <Col xs={12} md={8} className="exact-switch-under-input">
                <Form.Check
                  type="switch"
                  id="exact-switch"
                  label="재료명 정확히 일치만 보기"
                  checked={isExact}
                  onChange={(e) => updateSearchState({ isExact: e.target.checked })}
                />
              </Col>
              <Col md={2} className="d-none d-md-block" />
            </Row>
          </div>
        </Form>

        {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
      </div>
    </Container>
  );

  return isLanding ? LandingUI : OriginalSearchUI;
}
