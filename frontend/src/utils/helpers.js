export function getSupplementImageUrl(imagePath) {
  if (!imagePath) return '/placeholder.jpg';
  // If the path starts with /uploads, serve from backend
  if (imagePath.startsWith('/uploads')) {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}${imagePath}`;
  }
  // If the path starts with /images or is a relative public path
  if (imagePath.startsWith('/images') || imagePath.startsWith('/')) {
    return imagePath;
  }
  // Otherwise, fallback
  return '/placeholder.jpg';
}
