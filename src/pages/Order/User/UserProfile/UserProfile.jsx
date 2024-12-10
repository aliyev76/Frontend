import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useOutletContext, useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../../../api/auth";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const { userProfile, setUserProfile } = useOutletContext(); // Use context
  const [formData, setFormData] = useState({
    username: userProfile.username,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address,
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.email || !formData.phone || !formData.address) {
      setError("All fields are required.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      setError("Phone number must contain only digits.");
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile(userProfile.username, formData);

      const updatedData = {
        ...JSON.parse(localStorage.getItem(`auth_${userProfile.username}`)),
        profile: formData,
      };

      if (userProfile.username !== formData.username) {
        localStorage.removeItem(`auth_${userProfile.username}`);
        localStorage.setItem(`auth_${formData.username}`, JSON.stringify(updatedData));
      } else {
        localStorage.setItem(`auth_${userProfile.username}`, JSON.stringify(updatedData));
      }

      setUserProfile(formData); // Sync context
      toast.success("Profile updated successfully!");
      navigate(`/user/${formData.username}/profile`, { replace: true });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setError("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>User Profile</h2>
      <ToastContainer />
      {error && <div className={styles.error}>{error}</div>}
      {editMode ? (
        <form onSubmit={handleSubmit} className={styles.profileInfo}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className={styles.profileInfo}>
          <p>
            <strong>Username:</strong> {userProfile.username}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Phone:</strong> {userProfile.phone}
          </p>
          <p>
            <strong>Address:</strong> {userProfile.address}
          </p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

