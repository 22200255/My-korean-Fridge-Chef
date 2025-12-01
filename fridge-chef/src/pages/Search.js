import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import useApi from '../hooks/useApi';
import { RecipeContext } from '../context/RecipeContext'; // Context 사용
import { Container, Form, Button, Card, Row, Col, Alert, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';

export default function Search() {
  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExactMatch, setIsExactMatch] = useState(false);
  const [category, setCategory] = useState("All"); // [기능 추가 2] 카테고리 필터 상태

  // Context에서 dispatch 함수 가져오기 (강의안 99p)
  const { dispatch } = useContext(RecipeContext); 
  const { data, loading, error, fetchRecipes } = useApi();
  const inputRef = useRef(null);
  
  useEffect(() => {
    if(inputRef.current) inputRef.current.focus();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchQuery(inputVal);
    fetchRecipes(inputVal);
  };

  // 기존 saveRecipe 함수 제거 -> dispatch로 대체

  // [Hook 활용] useMemo로 필터링 로직 통합 (정확도 + 카테고리)
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let result = data;

    // 1. 카테고리 필터링 (Select Box 값 적용)
    if (category !== "All") {
      result = result.filter(item => item.RCP_PAT2 === category);
    }

    // 2. 정확도 필터링
    if (isExactMatch) {
      result = result.filter(recipe => {
        const ingredients = recipe.RCP_PARTS_DTLS.split(/[,\n]/).map(s => s.trim());
        return ingredients.includes(searchQuery);
      });
    }
    
    return result;
  }, [data, isExactMatch, searchQuery, category]); 

  return (
    <Container className="mt-5">
      <h2>🍳 냉장고 재료로 레시피 찾기</h2>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2">
          <Col xs={12} md={6}>
            <Form.Control 
              ref={inputRef}
              type="text" 
              placeholder="재료 입력 (예: 마, 계란)" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
          </Col>
          
          {/* [기능 추가 2] 요리 종류 선택 (강의안 134p Select) */}
          <Col xs={6} md={3}>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">전체 종류</option>
              <option value="반찬">반찬</option>
              <option value="국&찌개">국&찌개</option>
              <option value="일품">일품</option>
              <option value="후식">후식</option>
            </Form.Select>
          </Col>

          <Col xs={6} md={3}>
            <Button variant="primary" type="submit" className="w-100">검색</Button>
          </Col>
        </Row>
        
        <div className="mt-2">
           <Form.Check 
              type="switch"
              id="custom-switch"
              label="재료명 정확히 일치만 보기"
              checked={isExactMatch}
              onChange={(e) => setIsExactMatch(e.target.checked)}
            />
        </div>
      </Form>

      {loading && <p>로딩 중...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredData.map((recipe, index) => (
          <Col key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={recipe.ATT_FILE_NO_MAIN} style={{height: '200px', objectFit: 'cover'}} />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between">
                  {recipe.RCP_NM}
                  <Badge bg="secondary">{recipe.RCP_PAT2}</Badge>
                </Card.Title>
                
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`t-${index}`}>{recipe.RCP_PARTS_DTLS}</Tooltip>}
                >
                  <Card.Text className="text-muted text-truncate" style={{cursor:'pointer'}}>
                    <strong>재료:</strong> {recipe.RCP_PARTS_DTLS}
                  </Card.Text>
                </OverlayTrigger>

                <div className="mt-auto">
                  {/* Context의 dispatch 사용 */}
                  <Button variant="outline-success" className="w-100"
                    onClick={() => dispatch({ type: 'ADD', payload: recipe })}
                  >
                    내 레시피북에 저장
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}