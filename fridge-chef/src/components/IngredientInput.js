import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

function IngredientInput({ value, onChange, onSubmit, placeholder = '예: 계란, 김치, 두부' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
        />
        <Button
          type="submit"
          style={{
            backgroundColor: 'var(--point-orange)',
            borderColor: 'var(--point-orange)',
            fontWeight: 'bold'
          }}
        >
          레시피 찾기
        </Button>
      </InputGroup>
    </Form>
  );
}

export default IngredientInput;
