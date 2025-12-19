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
  // - landing: 중앙 랜딩 UI
  // - search: 기존 Search UI(원본 느낌)
  // - undefined: 최초 진입은 landing으로 처리
  const mode = location.state?.mode; // 'landing' | 'search' | undefined

  // ✅ 로고/브랜드 클릭으로 들어온 reset 신호 처리
  useEffect(() => {
    if (location.state?.reset) {
      if (dispatch) dispatch({ type: 'RESET_SEARCH' });
      setHasSearched(false);

      // reset state가 뒤로가기에 남지 않도록 replace
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

    // ✅ 검색 버튼을 눌러 검색이 수행된 뒤에만 랜딩 → 기존 화면으로 전환
    setHasSearched(true);
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

  // ✅ 랜딩 표시 조건
  // - mode가 search면 무조건 기존 화면
  // - mode가 landing이거나(undefined=최초 진입)면: 검색하기 전까지 랜딩 유지
  const resolvedMode = mode ?? 'landing';
  const isLanding = resolvedMode === 'landing' && !hasSearched;

  // ✅ 기존(원본 느낌) Search UI: 너가 보낸 코드 그대로 유지
  const OriginalSearchUI = (
    <Container className="mt-5">
      <h2>냉장고 재료로 레시피 찾기</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        {/* [수정] 순서 변경: 필터(Select) -> 입력창(Input) -> 버튼(Button) */}
        <Row className="g-2 align-items-center">
          {/* 1. 검색 필터 (왼쪽 배치) */}
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
            onChange={(e) => updateSearchState({ isExact: e.target.checked })}
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

  // ✅ 랜딩 UI(중앙 배치) — 검색 후/메뉴 진입은 이 UI를 쓰지 않음
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

            {/* 랜딩에서는 토글을 입력창 기준 왼쪽 아래 */}
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

        {/* 에러는 랜딩에서도 보여주기 */}
        {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
      </div>
    </Container>
  );

  return isLanding ? LandingUI : OriginalSearchUI;
}
