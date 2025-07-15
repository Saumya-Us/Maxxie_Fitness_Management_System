import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles.css';

const ProductDetail = ({ supplements, addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = supplements.find(sup => sup._id === id);

  if (!product) {
    return <div className="container">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <button className="btn btn-back" onClick={() => navigate(-1)}>← Back</button>
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.imageUrl || 'default-supplement.jpg'} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="brand">By {product.brand}</p>
          <p className="category">{product.category}</p>
          <p className="price">Rs {product.price}</p>
          <p className="description">{product.description}</p>
          <div className="stock-info">
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.stock > 0 && <span className="stock-quantity">({product.stock} available)</span>}
          </div>
          <button 
            className="btn btn-primary add-to-cart"
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 