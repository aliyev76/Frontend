import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { getUserProfile } from "../../../../api/auth";
import Navbar from "../../../../components/OrderComponent/Navbar/DashboardNavbar";
import Sidebar from "../../../../components/OrderComponent/Sidebar/Sidebar";
import AreYouSureMsg from "../../../../components/OrderComponent/AreYouSureMessg/AreYouSureMessg";
import styles from "./UserPageLayout.module.css";
import { CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const UserPageLayout = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const channel = new BroadcastChannel(`user-session-${username}`);

  useEffect(() => {
    if (!username) {
      console.error("Username is missing in URL parameters.");
      navigate("/Error404");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(username, navigate);
        setUserProfile(profile);

        if (profile.username !== username) {
          navigate("/Error404");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to fetch user profile.");
        navigate("/Error404");
      }
    };

    fetchUserProfile();

    channel.onmessage = (message) => {
      if (message.data.type === "logout" && message.data.username === username) {
        localStorage.removeItem(`auth_${username}_user`);
        sessionStorage.removeItem(`auth_${username}_user`);
        navigate("/login");
      }
    };

    return () => {
      channel.close();
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
    localStorage.removeItem(`auth_${username}_user`);
    sessionStorage.removeItem(`auth_${username}_user`);
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

  if (!userProfile) {
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
        userType="user"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSignOut={handleSignOut}
      />
      <main className={styles.mainContent}>
        <Outlet context={{ userProfile, setUserProfile }} />
      </main>
      {showSignOutModal && (
        <AreYouSureMsg onConfirm={confirmSignOut} onCancel={cancelSignOut} />
      )}
    </div>
  );
};

export default UserPageLayout;

