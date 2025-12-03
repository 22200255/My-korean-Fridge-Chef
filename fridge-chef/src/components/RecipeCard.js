// src/components/RecipeCard.js

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

function RecipeCard({ recipe, onClick, onToggleFavorite, isFavorite }) {
  if (!recipe) return null;

  const {
    RCP_NM,          // 레시피 이름
    ATT_FILE_NO_MAIN, // 이미지
    RCP_PARTS_DTLS,   // 재료 설명
    RCP_WAY2,         // 조리방법 (튀기기, 끓이기 등)
    RCP_PAT2          // 요리 종류 (반찬, 국 등)
  } = recipe;

  return (
    <Card
      className="mb-3 d-flex flex-column h-100"
      style={{
        borderRadius: 16,
        border: '1px solid var(--sub-beige)',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        backgroundColor: '#fff'
      }}
    >
      {ATT_FILE_NO_MAIN && (
        <Card.Img
          variant="top"
          src={ATT_FILE_NO_MAIN}
          alt={RCP_NM}
          style={{ height: 200, objectFit: 'cover' }}
        />
      )}

      <Card.Body className="d-flex flex-column">
        <Card.Title
          style={{
            color: 'var(--text-brown)',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          {RCP_NM}
        </Card.Title>

        <div className="mb-2">
          {RCP_WAY2 && (
            <Badge bg="light" text="dark" className="me-2">
              {RCP_WAY2}
            </Badge>
          )}
          {RCP_PAT2 && (
            <Badge bg="light" text="dark">
              {RCP_PAT2}
            </Badge>
          )}
        </div>

        {RCP_PARTS_DTLS && (
          <Card.Text
            style={{
              fontSize: '0.85rem',
              maxHeight: 70,
              overflow: 'hidden'
            }}
          >
            {RCP_PARTS_DTLS}
          </Card.Text>
        )}

        {/* 버튼 영역을 항상 카드 맨 아래로 보내기 */}
        <div className="mt-auto d-flex justify-content-between pt-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onClick}
            style={{
              borderColor: 'var(--sub-beige)',
              color: 'var(--text-brown)'
            }}
          >
            자세히 보기
          </Button>

          {onToggleFavorite && (
            <Button
              size="sm"
              style={{
                backgroundColor: isFavorite ? 'var(--point-orange)' : 'var(--sub-beige)',
                borderColor: isFavorite ? 'var(--point-orange)' : 'var(--sub-beige)',
                color: isFavorite ? '#fff' : 'var(--text-brown)'
              }}
              onClick={onToggleFavorite}
            >
              {isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;
