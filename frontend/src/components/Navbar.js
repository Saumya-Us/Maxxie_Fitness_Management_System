import { Link } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/add">Add Supplement</Link>
      <Link to="/admin-dashboard">Admin Dashboard</Link>
    </nav>
  );
};

export default Navbar;
