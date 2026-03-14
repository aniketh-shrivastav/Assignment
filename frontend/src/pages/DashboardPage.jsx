import { useEffect, useState } from "react";

import { request } from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  price: "",
};

const validateProduct = (form) => {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required";
  } else if (form.title.trim().length > 120) {
    errors.title = "Title must be at most 120 characters";
  }

  if (form.description.length > 1000) {
    errors.description = "Description must be at most 1000 characters";
  }

  if (form.price === "" || form.price === null) {
    errors.price = "Price is required";
  } else if (isNaN(Number(form.price))) {
    errors.price = "Price must be a valid number";
  } else if (Number(form.price) < 0) {
    errors.price = "Price cannot be negative";
  }

  return errors;
};

const DashboardPage = ({ token, user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await request({ path: "/products", token });
      setProducts(response.data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetFeedback = () => {
    setError("");
    setMessage("");
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetFeedback();

    const errors = validateProduct(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await request({
          path: `/products/${editingId}`,
          method: "PUT",
          body: payload,
          token,
        });
        setMessage("Product updated successfully");
      } else {
        await request({
          path: "/products",
          method: "POST",
          body: payload,
          token,
        });
        setMessage("Product created successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFieldErrors({});
    setForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
    });
  };

  const handleDelete = async (id) => {
    resetFeedback();

    try {
      await request({
        path: `/products/${id}`,
        method: "DELETE",
        token,
      });
      setMessage("Product deleted successfully");
      fetchProducts();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <div>
          <h2>Dashboard</h2>
          <p>
            Logged in as {user?.name} ({user?.role})
          </p>
        </div>
        <button onClick={onLogout} className="secondary-btn">
          Logout
        </button>
      </div>

      <div className="card">
        <h3>{editingId ? "Edit Product" : "Create Product"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            value={form.title}
            onChange={handleChange("title")}
            className={fieldErrors.title ? "input-error" : ""}
          />
          {fieldErrors.title && (
            <span className="field-error">{fieldErrors.title}</span>
          )}

          <label>
            Description{" "}
            <span className="field-hint">(optional, max 1000 chars)</span>
          </label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={3}
            className={fieldErrors.description ? "input-error" : ""}
          />
          {fieldErrors.description && (
            <span className="field-error">{fieldErrors.description}</span>
          )}

          <label>Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange("price")}
            className={fieldErrors.price ? "input-error" : ""}
          />
          {fieldErrors.price && (
            <span className="field-error">{fieldErrors.price}</span>
          )}

          <button type="submit">{editingId ? "Update" : "Create"}</button>
        </form>

        {editingId && (
          <button
            className="secondary-btn"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div className="card">
        <h3>Products</h3>
        {products.length === 0 ? (
          <p className="helper-text">No products yet.</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div className="product-item" key={product._id}>
                <h4>{product.title}</h4>
                <p>{product.description || "No description"}</p>
                <p className="price">${product.price.toFixed(2)}</p>
                <div className="actions">
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
