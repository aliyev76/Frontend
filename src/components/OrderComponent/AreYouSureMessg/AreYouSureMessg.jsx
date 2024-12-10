import React from "react";
import styles from "./AreYouSureMessg.module.css";

const AreYouSureMsg = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Are you sure you want to sign out?</h3>
        <div className={styles.buttons}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreYouSureMsg;

