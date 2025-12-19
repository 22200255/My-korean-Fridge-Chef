import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RecipeContext } from '../context/RecipeContext';
import { Container, Row, Col, Image, Badge, Button, Card } from 'react-bootstrap';

export default function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  // [수정] addRecipe 함수 가져오기
  const { addRecipe } = useContext(RecipeContext) || {};

  const recipe = location.state?.recipe;

  useEffect(() => {
    if (!recipe) {
      alert('잘못된 접근입니다. 검색 화면으로 이동합니다.');
      navigate('/');
    }
  }, [recipe, navigate]);

  if (!recipe) return null;

  const manuals = [];
  for (let i = 1; i <= 20; i++) {
    const index = i < 10 ? `0${i}` : i;
    const text = recipe[`MANUAL${index}`];
    const img = recipe[`MANUAL_IMG${index}`];
    if (text) manuals.push({ step: i, text, img });
  }

  // [수정] addRecipe 호출
  const handleSave = () => {
    if (addRecipe) {
      addRecipe(recipe);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            borderColor: 'var(--sub-beige)',
            color: 'var(--text-brown)'
          }}
        >
          &larr; 뒤로 가기
        </Button>
        
        <Button variant="success" onClick={handleSave}>
        이 레시피 저장하기
        </Button>
      </div>

      <Row>
        <Col md={5} className="mb-4">
          <Image
            src={recipe.ATT_FILE_NO_MAIN}
            fluid
            rounded
            className="mb-3 w-100 shadow-sm"
          />
          <h2 className="mb-2">{recipe.RCP_NM}</h2>
          <div className="mb-3">
            <Badge bg="primary" className="me-2">
              {recipe.RCP_PAT2}
            </Badge>
            <Badge bg="success">{recipe.RCP_WAY2}</Badge>
          </div>
          <Card className="bg-light border-0">
            <Card.Body>
              <Card.Title>재료 준비</Card.Title>
              <Card.Text style={{ lineHeight: '1.8' }}>
                {recipe.RCP_PARTS_DTLS}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <h3 className="mb-4 border-bottom pb-2">🍳 조리 순서</h3>
          {manuals.map((manual) => (
            <div
              key={manual.step}
              className="d-flex mb-4 align-items-start"
            >
              <div className="me-3 text-center">
                <Badge
                  bg="dark"
                  pill
                  style={{
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {manual.step}
                </Badge>
              </div>
              <div className="flex-grow-1">
                <p className="fs-5 mb-2">
                  {manual.text.replace(/^\d+\.\s*/, '')}
                </p>
                {manual.img && (
                  <Image
                    src={manual.img}
                    rounded
                    fluid
                    style={{ maxHeight: '200px' }}
                  />
                )}
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}