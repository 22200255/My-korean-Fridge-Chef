import React, { useState, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';

export default function MyRecipes() {
  // [수정] Context에서 CRUD 함수들 가져오기
  const { savedRecipes = [], deleteRecipe, updateMemo } = useContext(RecipeContext) || {};
  const navigate = useNavigate();

  const [editId, setEditId] = useState(null);
  const [memoInput, setMemoInput] = useState('');

  const startEdit = (recipe) => {
    // [수정] 식약처 ID가 아닌 MockAPI의 id를 사용
    setEditId(recipe.id); 
    setMemoInput(recipe.myMemo || '');
  };

  const saveEdit = (id) => {
    // [수정] updateMemo 함수 호출
    if (updateMemo) {
      updateMemo(id, memoInput);
    }
    setEditId(null);
  };

  const handleDelete = (id) => {
    // [수정] deleteRecipe 함수 호출
    if (deleteRecipe) {
      deleteRecipe(id);
    }
  };

  const goToDetail = (recipe) => {
    navigate('/recipe/view', { state: { recipe } });
  };

  return (
    <Container className="mt-5">
      <h2>📒 나의 즐겨찾기 레시피 ({savedRecipes.length}개)</h2>
      {savedRecipes.length === 0 && <p className="text-muted">저장된 레시피가 없습니다.</p>}
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {savedRecipes.map((recipe) => (
          // [수정] key로 recipe.id 사용
          <Col key={recipe.id}>
            <Card className="h-100 shadow-sm">
              <div style={{cursor: 'pointer'}} onClick={() => goToDetail(recipe)}>
                <Card.Img variant="top" src={recipe.ATT_FILE_NO_MAIN} style={{height: '200px', objectFit: 'cover'}}/>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title 
                  style={{cursor: 'pointer'}} 
                  onClick={() => goToDetail(recipe)}
                >
                  {recipe.RCP_NM}
                </Card.Title>
                
                {/* [수정] editId 비교 시 recipe.id 사용 */}
                {editId === recipe.id ? (
                  <Form.Group className="mb-3">
                    <Form.Control 
                      as="textarea" 
                      value={memoInput} 
                      onChange={(e) => setMemoInput(e.target.value)} 
                    />
                    <div className="mt-2">
                      <Button size="sm" onClick={() => saveEdit(recipe.id)} className="me-2">저장</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditId(null)}>취소</Button>
                    </div>
                  </Form.Group>
                ) : (
                  <>
                    <Card.Text>📝 {recipe.myMemo || "메모 없음"}</Card.Text>
                    
                    <div className="mt-auto">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-100 mb-2" 
                        onClick={() => goToDetail(recipe)}
                      >
                        조리법 보기
                      </Button>
                      
                      <div className="d-flex justify-content-end">
                        <Button size="sm" variant="warning" className="me-2" onClick={() => startEdit(recipe)}>메모 수정</Button>
                        {/* [수정] 삭제 시 recipe.id 전달 */}
                        <Button size="sm" variant="danger" onClick={() => handleDelete(recipe.id)}>삭제</Button>
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}