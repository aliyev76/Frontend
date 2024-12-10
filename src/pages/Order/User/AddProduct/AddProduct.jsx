import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ProductComponent from "../../../../components/OrderComponent/UserComponent/ProductComponent/ProductComponent";
import { addProduct } from "../../../../api/product";
import { generateExcelTemplate } from "../../../../api/api";
import axios from "axios"; // Import axios for file upload
import styles from "./AddProduct.module.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();
  const { userProfile } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("prime");
  const [numberOfProducts, setNumberOfProducts] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [file, setFile] = useState(null); // State for the uploaded file

  // Redirect if user profile is invalid
  useEffect(() => {
    if (!userProfile || userProfile.username !== urlUsername) {
      navigate("/Error_404");
    }
  }, [userProfile, urlUsername, navigate]);

  // Add multiple products
  const handleAddProduct = () => {
    const newProducts = Array.from({ length: numberOfProducts }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      category,
      modifications: { fivePrime: "", threePrime: "" },
      saflaştırma: category === "prime" ? "DSLT" : null,
      scale: "50 nmol",
      totalPrice: 0,
      oligoAdi: "",
      selected: true,
    }));
    setProducts((prev) => [...prev, ...newProducts]);
  };

  // Update total price whenever products change
  useEffect(() => {
    const newTotalPrice = products.reduce(
      (sum, product) => (product.selected ? sum + product.totalPrice : sum),
      0
    );
    setTotalPrice(newTotalPrice);
  }, [products]);

  // Update product data
  const handleProductUpdate = (updatedProduct, index) => {
    setProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = updatedProduct;
      return updatedProducts;
    });
  };

  // Remove product
  const handleRemoveProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit selected products
  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedProducts = products.filter((product) => product.selected);

    try {
      await addProduct(selectedProducts);
      toast.success("Products added successfully!");
      setProducts([]);
      setTotalPrice(0);
    } catch (error) {
      toast.error("Error adding products. Please try again.");
    }
  };

  // Download Excel template
  const handleDownloadTemplate = async () => {
    try {
      await generateExcelTemplate({ templateid: 1, rows: [] });
      toast.success("Template downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading template.");
    }
  };

  // Handle file change for import
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Import Excel file
  const handleImportExcel = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post('http://localhost:5000/api/excel/import', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Safely access the response and handle missing data
      const importedProducts = response.data.products?.map((product, index) => ({
        ...product,
        id: `${Date.now()}-${index}`,
        selected: true,
      })) || []; // Default to an empty array if no products are returned
  
      if (importedProducts.length === 0) {
        toast.warn("No products found in the uploaded file.");
        return;
      }
  
      setProducts((prev) => [...prev, ...importedProducts]);
      toast.success("File imported successfully!");
    } catch (error) {
      console.error("Error importing file:", error.response?.data || error.message);
      toast.error("Error importing file. Please try again.");
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Add Product</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.leftside}>
          {/* Category Selection */}
          <div className={styles.categorySelection}>
            <label htmlFor="category">Choose Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="prime">Prime</option>
              <option value="prop">Prop</option>
            </select>
          </div>

          {/* Number of Products */}
          <div>
            <label htmlFor="numberOfProducts">Number of Products:</label>
            <input
              id="numberOfProducts"
              type="number"
              min="1"
              value={numberOfProducts}
              onChange={(e) => setNumberOfProducts(Number(e.target.value))}
            />
          </div>

          {/* Add Product Button */}
          <div className={styles.orderSection}>
            <button type="button" onClick={handleAddProduct}>
              Add Product(s)
            </button>
          </div>

          {/* Product List */}
          {products.map((product, index) => (
            <ProductComponent
              key={product.id}
              index={index}
              category={product.category}
              productData={product}
              onRemove={handleRemoveProduct}
              onUpdate={handleProductUpdate}
            />
          ))}
        </div>

        {/* Right Side - Price Summary and Buttons */}
        <div className={styles.rightside}>
          {/* Submit Button */}
          <button
            className={styles.submitButton}
            type="submit"
            disabled={products.every((p) => !p.selected)}
          >
            Submit
          </button>

          {/* Total Price */}
          <div className={styles.totalPrice}>
            Total Price: {totalPrice.toFixed(2)} €
          </div>

          {/* Download Template Button */}
          <button type="button" onClick={handleDownloadTemplate}>
            Download Template
          </button>

          {/* Import Excel */}
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
            <button
              type="button"
              onClick={handleImportExcel}
              disabled={!file}
              style={{ marginTop: "10px" }}
            >
              Import Excel
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
