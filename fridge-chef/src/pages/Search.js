import React, { useMemo, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { RecipeContext } from '../context/RecipeContext';
import { checkAllergies } from '../utils/allergyUtils'; // [추가] 알레르기 로직
import { Container, Form, Button, Card, Row, Col, Alert, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';

export default function Search() {
  // [수정] Context에서 검색 상태와 dispatch 가져오기
  const { searchState, dispatch } = useContext(RecipeContext);
  // 초기값이 없을 경우를 대비한 안전한 구조분해할당
  const { query, results, category, isExact } = searchState || { query: "", results: [], category: "All", isExact: false };

  const { loading, error, fetchRecipes } = useApi();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  
  useEffect(() => {
    // 검색어가 없을 때만 포커스 (뒤로가기 했을 땐 포커스 안 뺏기게)
    if (!query && inputRef.current) inputRef.current.focus();
  }, [query]);

  const updateSearchState = (updates) => {
    dispatch({ type: 'SET_SEARCH_STATE', payload: updates });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // API 호출 후 결과값을 바로 Context에 저장
    const data = await fetchRecipes(query);
    updateSearchState({ results: data });
  };

  // 필터링 로직
  const filteredData = useMemo(() => {
    if (!results) return [];
    
    let filtered = results;

    if (category !== "All") {
      filtered = filtered.filter(item => item.RCP_PAT2 === category);
    }

    if (isExact) {
      filtered = filtered.filter(recipe => {
        const ingredients = recipe.RCP_PARTS_DTLS.split(/[,\n]/).map(s => s.trim());
        return ingredients.includes(query);
      });
    }
    
    return filtered;
  }, [results, isExact, query, category]);

  const goToDetail = (recipe) => {
    navigate('/recipe/view', { state: { recipe } });
  };

  return (
    <Container className="mt-5">
      <h2>🍳 냉장고 재료로 레시피 찾기</h2>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2">
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
          <Col xs={6} md={3}>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "검색 중..." : "검색"}
            </Button>
          </Col>
        </Row>
        
        <div className="mt-2">
           <Form.Check 
              type="switch"
              id="custom-switch"
              label="재료명 정확히 일치만 보기"
              checked={isExact}
              onChange={(e) => updateSearchState({ isExact: e.target.checked })}
            />
        </div>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredData.map((recipe, index) => {
          // [추가] 알레르기 분석
          const allergies = checkAllergies(recipe.RCP_PARTS_DTLS);

          return (
            <Col key={index}>
              <Card className="h-100 shadow-sm border-0">
                <div style={{cursor: 'pointer', position: 'relative'}} onClick={() => goToDetail(recipe)}>
                  <Card.Img variant="top" src={recipe.ATT_FILE_NO_MAIN} style={{height: '200px', objectFit: 'cover'}} />
                  
                  {/* [추가] 알레르기 경고 호버 팝업 */}
                  {allergies.length > 0 && (
                    <div style={{position: 'absolute', top: 10, right: 10}}>
                      <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip id={`alert-${index}`}>포함된 알레르기 유발 물질:<br/>{allergies.join(', ')}</Tooltip>}
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
                    <span className="text-truncate" style={{maxWidth: '70%'}}>{recipe.RCP_NM}</span>
                    <Badge bg="secondary">{recipe.RCP_PAT2}</Badge>
                  </Card.Title>
                  
                  {/* [유지] 재료 목록 호버 팝업 */}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id={`t-${index}`}>{recipe.RCP_PARTS_DTLS}</Tooltip>}
                  >
                    <Card.Text 
                      className="text-muted text-truncate" 
                      style={{cursor:'help'}}
                    >
                      {recipe.RCP_PARTS_DTLS}
                    </Card.Text>
                  </OverlayTrigger>

                  <div className="mt-auto d-flex gap-2">
                    <Button variant="primary" className="flex-grow-1" onClick={() => goToDetail(recipe)}>
                      조리법 보기
                    </Button>
                    <Button variant="outline-success" onClick={() => dispatch({ type: 'ADD', payload: recipe })}>
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