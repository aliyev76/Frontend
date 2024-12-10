import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add"; // Icon for Add Product
import styles from "./Sidebar.module.css";

const Sidebar = ({ userType, isSidebarOpen, toggleSidebar, onSignOut }) => {
  const navigate = useNavigate();
  const { username } = useParams();

  // Define nav items for user and admin separately
  const USER_NAV_ITEMS = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: `/user/${username}/dashboard`,
    },
    {
      title: "Order",
      icon: <ShoppingCartIcon />,
      path: `/user/${username}/order`,
    },
    {
      title: "Add Product",
      icon: <AddIcon />,
      path: `/user/${username}/add-product`,
    },
    {
      title: "Profile",
      icon: <AccountCircleIcon />,
      path: `/user/${username}/profile`,
    },
  ];

  const ADMIN_NAV_ITEMS = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: `/admin/${username}/dashboard`,
    },
    {
      title: "Reports",
      icon: <CloseIcon />,
      path: `/admin/${username}/reports`,
    },
    {
      title: "Orders",
      icon: <ShoppingCartIcon />,
      path: `/admin/${username}/orders`,
    },
  ];

  // Determine which nav items to display based on userType
  const NAV_ITEMS = userType === "admin" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <ul>
          {NAV_ITEMS.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <div
                className={styles.navLink}
                onClick={() => navigate(item.path)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className={styles.signOut} onClick={onSignOut}>
        <span className={styles.icon}>
          <CloseIcon />
        </span>
        <span className={styles.label}>Sign Out</span>
      </div>
    </aside>
  );
};

export default Sidebar;

