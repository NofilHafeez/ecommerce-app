import  { useState, useEffect} from "react";
import Footer from "../components/Footer";
import axios from "axios";

const AdminPage = () => {

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: "",
  });
  const [products, setProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewProduct((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
  
    if (!newProduct.image) {
      alert("Please select an image!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock);
    formData.append("price", newProduct.price);
    formData.append("image", newProduct.image);
   setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/product/create-product`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
        if (res.data.success) {
      setMessage({ type: "success", text: "Product added successfully!" });
      fetchProducts(); // ✅ Refresh full list
      setNewProduct({
        name: "",
        price: "",
        image: "",
        description: "",
        category: "",
        stock: "",
      });
    }

    } catch (err) {
      console.error("Error adding product:", err);
      setMessage({ type: "error", text: "Failed to add product. Try again!" });
    } finally { 
      setLoading(false);
    }
  };
  
  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [message]);


  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product/get-products`, {
        withCredentials: true,
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/product/delete-product/${id}`,
        {},
        { withCredentials: true }
      );
  
      if (res.data.success) {
  setMessage({ type: "success", text: "Product deleted successfully!" });
  fetchProducts(); // ✅ Refresh full list
}

    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage({ type: "error", text: "Failed to delete product." });
    }
  };
  

  return (
    <div className="w-full min-h-screen bg-[#ededed]">
          

      <div  className="w-full min-h-screen flex flex-col items-center">
        <h1 className="text-3xl text-black pt-30 text-center">Admin Page</h1>

        <div className="w-full max-w-4xl p-10 pb-30 pt-20 flex flex-col gap-10">
          <div className="w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl mb-6 font-bold">Add New Product</h2>
            <form className="grid grid-cols-2 gap-4" onSubmit={addProduct}>
              <div>
                <label className="block mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />

                <label className="block mt-4 mb-2">Product Description</label>
                <textarea
                  name="description"
                  className="w-full h-[100px] p-2 border rounded"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />

                <label className="block mt-4 mb-2">Product Category</label>
                <input
                  type="text"
                  name="category"
                  className="w-full p-2 border rounded"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Product Stock</label>
                <input
                  type="text"
                  name="stock"
                  className="w-full p-2 border rounded"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  required
                />

                <label className="block mt-4 mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  className="w-full p-2 border rounded"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />

                <label className="block mt-4 mb-2">Choose Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full p-2 border rounded"
                  onChange={handleImageUpload}
                  required
                />
              </div>
            <div>
                  {message && (
            <div
              className={`rounded text-black text-center ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </div>
          )}

      </div>

              <button type="submit" className="col-span-2 w-full py-2 px-5 bg-gray-500 text-white rounded mt-4">
                {!loading ? "Add Product" : "Creating.."} 
                 </button>
            </form>
          </div>

          <div className="w-full flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Products</h2>
            {products.map((product) => (
              <div key={product._id} className="flex justify-between items-center border-b py-4">
                <div className="flex">
                  <img src={product.image} className="w-32 h-32 object-cover object-top" alt={product.name} />
                  <div className="ml-4">
                    <h1 className="text-xl">{product.name}</h1>
                    <h2 className="font-bold">${product.price}</h2>
                  </div>
                </div>

                <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-4 py-2 rounded">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;
