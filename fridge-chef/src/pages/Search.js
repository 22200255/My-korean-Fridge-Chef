import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // [추가] 이동을 위한 훅
import useApi from '../hooks/useApi';
import { RecipeContext } from '../context/RecipeContext';
import { Container, Form, Button, Card, Row, Col, Alert, Badge } from 'react-bootstrap';

export default function Search() {
  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExactMatch, setIsExactMatch] = useState(false);
  const [category, setCategory] = useState("All");

  const { dispatch } = useContext(RecipeContext);
  const { data, loading, error, fetchRecipes } = useApi();
  
  const navigate = useNavigate(); // [추가] 네비게이션 함수 생성
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

  const filteredData = useMemo(() => {
    if (!data) return [];
    let result = data;
    if (category !== "All") {
      result = result.filter(item => item.RCP_PAT2 === category);
    }
    if (isExactMatch) {
      result = result.filter(recipe => {
        const ingredients = recipe.RCP_PARTS_DTLS.split(/[,\n]/).map(s => s.trim());
        return ingredients.includes(searchQuery);
      });
    }
    return result;
  }, [data, isExactMatch, searchQuery, category]);

  // [추가] 상세 페이지로 이동하는 함수
  const goToDetail = (recipe) => {
    // state 옵션을 통해 클릭한 레시피 데이터를 그대로 들고 이동함
    navigate('/recipe/view', { state: { recipe } });
  };

  return (
    <Container className="mt-5">
      <h2>🍳 냉장고 재료로 레시피 찾기</h2>
      
      <Form onSubmit={handleSearch} className="mb-4">
        {/* ... (검색 폼 부분은 기존과 동일) ... */}
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
              {/* 이미지 클릭 시에도 상세페이지 이동하도록 수정 */}
              <div style={{cursor: 'pointer'}} onClick={() => goToDetail(recipe)}>
                <Card.Img variant="top" src={recipe.ATT_FILE_NO_MAIN} style={{height: '200px', objectFit: 'cover'}} />
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span className="text-truncate" style={{maxWidth: '70%'}}>{recipe.RCP_NM}</span>
                  <Badge bg="secondary">{recipe.RCP_PAT2}</Badge>
                </Card.Title>
                
                <Card.Text className="text-muted text-truncate">
                  {recipe.RCP_PARTS_DTLS}
                </Card.Text>

                <div className="mt-auto d-flex gap-2">
                  {/* [수정] 조리법 상세 버튼 */}
                  <Button variant="primary" className="flex-grow-1" onClick={() => goToDetail(recipe)}>
                    조리법 보기
                  </Button>
                  
                  {/* 저장 버튼 */}
                  <Button variant="outline-success" onClick={() => dispatch({ type: 'ADD', payload: recipe })}>
                    저장
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