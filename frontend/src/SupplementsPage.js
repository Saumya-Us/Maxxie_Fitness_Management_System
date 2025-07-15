import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartBadge from "./components/CartBadge";
import "./styles.css";

const SupplementsPage = () => {
  const [supplements, setSupplements] = useState([]);
  const [filteredSupplements, setFilteredSupplements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const categories = [
    "all",
    "protein",
    "pre-workout",
    "post-workout",
    "vitamins",
    "amino-acids"
  ];

  // Fetch supplements from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/supplements")
      .then((res) => res.json())
      .then((data) => {
        setSupplements(data);
        setFilteredSupplements(data);
      })
      .catch((error) => console.error("Error fetching supplements:", error));
  }, []);

  // Filter supplements based on category and search
  useEffect(() => {
    let filtered = supplements;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (supplement) => supplement.category.toLowerCase() === selectedCategory
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter((supplement) =>
        supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplement.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredSupplements(filtered);
  }, [selectedCategory, searchQuery, supplements]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="supplements-page">
      <header className="header">
        <h1>Supplement Store</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search supplements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CartBadge cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
      </header>

      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="supplements-grid">
        {filteredSupplements.map((supplement) => (
          <div key={supplement._id} className="supplement-card">
            <div 
              className="supplement-image" 
              onClick={() => navigate(`/product/${supplement._id}`)}
            >
              <img
                src={supplement.imageUrl || "default-supplement.jpg"}
                alt={supplement.name}
              />
              <div className="category-tag">{supplement.category}</div>
            </div>
            <div className="supplement-info">
              <h3>{supplement.name}</h3>
              <p className="brand">{supplement.brand}</p>
              <p className="price">Rs {supplement.price}</p>
              <button
                className="btn btn-primary add-to-cart"
                onClick={() => addToCart(supplement)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplementsPage;
