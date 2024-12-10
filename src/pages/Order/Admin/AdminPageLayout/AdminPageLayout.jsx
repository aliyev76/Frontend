import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { getUserProfile } from "../../../../api/auth";
import Navbar from "../../../../components/OrderComponent/Navbar/DashboardNavbar";
import Sidebar from "../../../../components/OrderComponent/Sidebar/Sidebar";
import AreYouSureMsg from "../../../../components/OrderComponent/AreYouSureMessg/AreYouSureMessg";
import styles from "./AdminPageLayout.module.css";
import { CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const AdminPageLayout = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [adminProfile, setAdminProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const channel = new BroadcastChannel(`admin-session-${username}`);

  useEffect(() => {
    if (!username) {
      console.error("Username is missing in URL parameters.");
      navigate("/Error404");
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        const profile = await getUserProfile(username, navigate);
        setAdminProfile(profile);

        if (profile.username !== username) {
          navigate("/Error404");
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setError("Failed to fetch admin profile.");
        navigate("/login");
      }
    };

    fetchAdminProfile();

    // Listen for changes in `localStorage` across tabs
    window.addEventListener("storage", (event) => {
      if (event.key && event.key.startsWith("auth_")) {
        const authKey = `auth_${username}`;
        const userData = JSON.parse(localStorage.getItem(authKey));

        if (!userData || !userData.token) {
          // Token is invalid or missing, force logout
          localStorage.removeItem(authKey);
          sessionStorage.removeItem(authKey);
          navigate("/login");
        }
      }
    });

    channel.onmessage = (message) => {
      if (message.data.type === "logout" && message.data.username === username) {
        localStorage.removeItem(`auth_${username}_admin`);
        sessionStorage.removeItem(`auth_${username}_admin`);
        navigate("/login");
      }
    };

    return () => {
      channel.close();
      window.removeEventListener("storage", () => {});
    };
  }, [username, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    channel.postMessage({ type: "logout", username });
    localStorage.removeItem(`auth_${username}_admin`);
    sessionStorage.removeItem(`auth_${username}_admin`);
    navigate("/login");
  };

  const cancelSignOut = () => {
    setShowSignOutModal(false);
  };

  if (error) {
    return (
      <div className={styles.centered}>
        <ErrorOutlineIcon className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className={styles.centered}>
        <CircularProgress className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.layoutContainer}>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar
        userType="admin"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSignOut={handleSignOut}
      />
      <main className={styles.mainContent}>
        <Outlet context={{ adminProfile, setAdminProfile }} />
      </main>
      {showSignOutModal && (
        <AreYouSureMsg onConfirm={confirmSignOut} onCancel={cancelSignOut} />
      )}
    </div>
  );
};

export default AdminPageLayout;

