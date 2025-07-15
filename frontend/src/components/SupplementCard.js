import "../styles.css";
import { getSupplementImageUrl } from '../utils/helpers';

const SupplementCard = ({ supplement, onDelete, onEdit }) => (
  <div className="card">
    <img
      src={getSupplementImageUrl(supplement.image)}
      alt={supplement.name}
      style={{ width: '100%', height: 120, objectFit: 'contain', marginBottom: 8 }}
      onError={e => { e.target.src = '/placeholder.jpg'; }}
    />
    <h3>{supplement.name}</h3>
    <p>{supplement.description}</p>
    <p><strong>Price:</strong> Rs. {supplement.price}</p>
    <p><strong>Stock:</strong> {supplement.stock}</p>
    <button className="button" onClick={onEdit}>Edit</button>
    <button className="button" style={{ marginLeft: "10px", background: "red" }} onClick={() => onDelete(supplement._id)}>Delete</button>
  </div>
);

export default SupplementCard;
