import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Badge, Button, Card } from 'react-bootstrap';

export default function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Search.js에서 보낸 레시피 데이터 받기
  const recipe = location.state?.recipe;

  // 데이터가 없으면(새로고침 등) 검색화면으로 돌려보냄 (방어 코드)
  useEffect(() => {
    if (!recipe) {
      alert("잘못된 접근입니다. 검색 화면으로 이동합니다.");
      navigate('/');
    }
  }, [recipe, navigate]);

  if (!recipe) return null;

  // 조리법(MANUAL)과 이미지(MANUAL_IMG)를 짝지어서 배열로 만들기
  const manuals = [];
  for (let i = 1; i <= 20; i++) {
    const index = i < 10 ? `0${i}` : i; // 01, 02... 10 형식 맞추기
    const text = recipe[`MANUAL${index}`];
    const img = recipe[`MANUAL_IMG${index}`];

    // 텍스트가 있는 경우에만 리스트에 추가
    if (text) {
      manuals.push({ step: i, text, img });
    }
  }

  return (
    <Container className="mt-5 mb-5">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        &larr; 뒤로 가기
      </Button>

      <Row>
        {/* 왼쪽: 완성된 요리 사진 및 정보 */}
        <Col md={5} className="mb-4">
          <Image src={recipe.ATT_FILE_NO_MAIN} fluid rounded className="mb-3 w-100 shadow-sm" />
          <h2 className="mb-2">{recipe.RCP_NM}</h2>
          <div className="mb-3">
            <Badge bg="primary" className="me-2">{recipe.RCP_PAT2}</Badge>
            <Badge bg="success">{recipe.RCP_WAY2}</Badge>
          </div>
          <Card className="bg-light border-0">
            <Card.Body>
              <Card.Title>📝 재료 준비</Card.Title>
              <Card.Text style={{ lineHeight: '1.8' }}>
                {recipe.RCP_PARTS_DTLS}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽: 상세 조리법 (Step by Step) */}
        <Col md={7}>
          <h3 className="mb-4 border-bottom pb-2">🍳 조리 순서</h3>
          {manuals.map((manual) => (
            <div key={manual.step} className="d-flex mb-4 align-items-start">
              <div className="me-3 text-center">
                <Badge bg="dark" pill style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {manual.step}
                </Badge>
              </div>
              <div className="flex-grow-1">
                <p className="fs-5 mb-2">{manual.text.replace(/^\d+\.\s*/, '')}</p> {/* 번호 중복 제거 */}
                {manual.img && (
                  <Image src={manual.img} rounded fluid style={{ maxHeight: '200px' }} />
                )}
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}