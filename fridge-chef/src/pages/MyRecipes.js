import React, { useState, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';

export default function MyRecipes() {
  const { savedRecipes = [], dispatch } = useContext(RecipeContext) || {};
  const navigate = useNavigate();

  const [editId, setEditId] = useState(null);
  const [memoInput, setMemoInput] = useState('');

  const startEdit = (recipe) => {
    setEditId(recipe.RCP_SEQ);
    setMemoInput(recipe.myMemo || '');
  };

  const saveEdit = (id) => {
    if (!dispatch) return;
    dispatch({ type: 'UPDATE_MEMO', payload: { id, memo: memoInput } });
    setEditId(null);
    alert('메모가 저장되었습니다!');
  };

  const handleDelete = (id) => {
    if (!dispatch) return;
    if (window.confirm('정말 이 레시피를 삭제하시겠습니까?')) {
      dispatch({ type: 'DELETE', payload: id });
    }
  };

  const goToDetail = (recipe) => {
    navigate('/recipe/view', { state: { recipe } });
  };

  return (
    <Container className="mt-5">
      <h2> 나의 즐겨찾기 레시피 ({savedRecipes.length}개)</h2>
      {savedRecipes.length === 0 && <p className="text-muted">저장된 레시피가 없습니다.</p>}
      
      {/* [수정] lg={3} 추가하여 화면이 넓을 때 3등분으로 보이도록 변경 */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {savedRecipes.map((recipe) => (
          <Col key={recipe.RCP_SEQ}>
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
                    <Card.Text> {recipe.myMemo || "메모 없음"}</Card.Text>
                    
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
                        <Button size="sm" variant="danger" onClick={() => handleDelete(recipe.RCP_SEQ)}>삭제</Button>
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