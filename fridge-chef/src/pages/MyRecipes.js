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
    <Container className="mt-4 mb-4">
      <h2 className="mb-3">나의 레시피북</h2>

      {savedRecipes.length === 0 ? (
        <p>아직 저장된 레시피가 없습니다. 검색 후 마음에 드는 레시피를 저장해 보세요!</p>
      ) : (
        <Row className="g-3">
          {savedRecipes.map((recipe) => (
            <Col key={recipe.RCP_SEQ} xs={12} md={6} lg={4}>
              <Card
                className="h-100 shadow-sm"
                style={{
                  borderRadius: 16,
                  border: '1px solid var(--sub-beige)',
                  overflow: 'hidden'
                }}
              >
                {recipe.ATT_FILE_NO_MAIN && (
                  <Card.Img
                    variant="top"
                    src={recipe.ATT_FILE_NO_MAIN}
                    style={{ height: 180, objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span
                      className="text-truncate"
                      style={{ maxWidth: '70%' }}
                    >
                      {recipe.RCP_NM}
                    </span>
                    <Badge bg="secondary">{recipe.RCP_PAT2}</Badge>
                  </Card.Title>

                  <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                    {recipe.RCP_WAY2}
                  </Card.Text>

                  {/* 메모 영역 */}
                  {editId === recipe.RCP_SEQ ? (
                    <>
                      <Form.Group className="mt-2">
                        <Form.Label>메모 수정</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={memoInput}
                          onChange={(e) => setMemoInput(e.target.value)}
                        />
                      </Form.Group>
                      <div className="mt-2 d-flex justify-content-end">
                        <Button
                          size="sm"
                          className="me-2"
                          onClick={() => saveEdit(recipe.RCP_SEQ)}
                          style={{
                            backgroundColor: 'var(--point-orange)',
                            borderColor: 'var(--point-orange)',
                            color: '#fff',
                            fontWeight: 'bold'
                          }}
                        >
                          저장
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setEditId(null)}
                          style={{
                            backgroundColor: 'var(--sub-beige)',
                            borderColor: 'var(--sub-beige)',
                            color: 'var(--text-brown)'
                          }}
                        >
                          취소
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Card.Text className="mt-2" style={{ fontSize: '0.9rem' }}>
                        <strong>메모:</strong>{' '}
                        {recipe.myMemo && recipe.myMemo.trim()
                          ? recipe.myMemo
                          : '메모가 없습니다.'}
                      </Card.Text>

                      <div className="mt-auto">
                        <Button
                          className="w-100 mb-2"
                          size="sm"
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

                        <div className="d-flex justify-content-end">
                          <Button
                            size="sm"
                            className="me-2"
                            onClick={() => startEdit(recipe)}
                            style={{
                              backgroundColor: 'var(--sub-beige)',
                              borderColor: 'var(--sub-beige)',
                              color: 'var(--text-brown)'
                            }}
                          >
                            메모 수정
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDelete(recipe.RCP_SEQ)}
                            style={{
                              backgroundColor: 'var(--main-brown)',
                              borderColor: 'var(--main-brown)',
                              color: '#fff'
                            }}
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
