const API_URL = "http://localhost:5000/api/supplements";

export const getSupplements = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const getSupplementById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/supplements/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch supplement");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching supplement:", error);
    return null;
  }
};


export const createSupplement = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateSupplement = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteSupplement = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
