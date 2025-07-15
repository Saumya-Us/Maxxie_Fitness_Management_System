import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const CartBadge = ({ cartCount }) => {
  const navigate = useNavigate();

  return (
    <div className="cart-badge" onClick={() => navigate('/cart')}>
      <div className="cart-icon">
        <i className="fas fa-shopping-cart"></i>
        {cartCount > 0 && (
          <span className="cart-count">{cartCount}</span>
        )}
      </div>
    </div>
  );
};

export default CartBadge; 