
import API from "./api";

// Add Product
export const addProduct = async (products) => {
  const response = await API.post("/products", { products });
  return response.data;
};

// Get Products
export const getProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

// Update Product
export const updateProduct = async (id, updatedData) => {
  const response = await API.put(`/products/${id}`, updatedData);
  return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};
