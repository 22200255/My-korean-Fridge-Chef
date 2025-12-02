import React from 'react';

function Logo({ size = 60, showText = true }) {
  return (
    <div className="d-flex flex-column align-items-center">
      <img
        src="/assets/logo/logo.png"
        alt="한식 냉장고 로고"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: showText ? 8 : 0
        }}
      />
      {showText && (
        <span style={{ color: 'var(--text-brown)', fontWeight: 'bold' }}>
          한식 냉장고 레시피
        </span>
      )}
    </div>
  );
}

export default Logo;
