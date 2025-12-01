import React, { useState, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext'; // Context 사용
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';

export default function MyRecipes() {
  // Context에서 상태와 dispatch 가져오기 (더 이상 로컬스토리지 직접 접근 안 함)
  const { savedRecipes, dispatch } = useContext(RecipeContext);
  
  const [editId, setEditId] = useState(null);
  const [memoInput, setMemoInput] = useState("");

  const startEdit = (recipe) => {
    setEditId(recipe.RCP_SEQ);
    setMemoInput(recipe.myMemo);
  };

  const saveEdit = (id) => {
    // Reducer로 액션 전달 (UPDATE_MEMO)
    dispatch({ type: 'UPDATE_MEMO', payload: { id, memo: memoInput } });
    setEditId(null);
  };

  const handleDelete = (id) => {
    // Reducer로 액션 전달 (DELETE)
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <Container className="mt-5">
      <h2>📒 나의 즐겨찾기 레시피 ({savedRecipes.length}개)</h2>
      {savedRecipes.length === 0 && <p className="text-muted">저장된 레시피가 없습니다.</p>}
      
      <Row xs={1} md={2} className="g-4">
        {savedRecipes.map((recipe) => (
          <Col key={recipe.RCP_SEQ}>
            <Card>
              <Card.Img variant="top" src={recipe.ATT_FILE_NO_MAIN} style={{height: '200px', objectFit: 'cover'}}/>
              <Card.Body>
                <Card.Title>{recipe.RCP_NM}</Card.Title>
                
                {editId === recipe.RCP_SEQ ? (
                  <Form.Group className="mb-3">
                    <Form.Control 
                      as="textarea" 
                      value={memoInput} 
                      onChange={(e) => setMemoInput(e.target.value)} 
                    />
                    <div className="mt-2">
                      <Button size="sm" onClick={() => saveEdit(recipe.RCP_SEQ)} className="me-2">저장</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditId(null)}>취소</Button>
                    </div>
                  </Form.Group>
                ) : (
                  <>
                    <Card.Text>📝 {recipe.myMemo || "메모 없음"}</Card.Text>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => startEdit(recipe)}>메모 수정</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(recipe.RCP_SEQ)}>삭제</Button>
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