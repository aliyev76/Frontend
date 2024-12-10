import { useState } from "react";
import axios from "axios";
import styles from "./register.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!inputUsername || !inputEmail || !inputPassword || !inputAddress || !inputPhone) {
      setError(t("register.all_fields_required"));
      setSuccess("");
      return;
    }

    if (!validatePassword(inputPassword)) {
      setError(t("register.password_requirements"));
      setSuccess("");
      return;
    }

    const formData = {
      username: inputUsername,
      email: inputEmail,
      password: inputPassword,
      phone: inputPhone,
      address: inputAddress,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      setSuccess(t("register.success_message"));
      setError("");
      setInputUsername('');
      setInputEmail('');
      setInputPassword('');
      setInputPhone('');
      setInputAddress('');
    } catch (error) {
      setError(error.response?.data?.error || t("register.registration_failed"));
      setSuccess("");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <h3>{t("register.title")}</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder={t("register.username")}
            className={styles.inputField}
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={t("register.email")}
            className={styles.inputField}
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("register.password")}
            className={styles.inputField}
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
          <input
            type="phone"
            placeholder={t("register.phone")}
            className={styles.inputField}
            value={inputPhone}
            onChange={(e) => setInputPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("register.address")}
            className={styles.inputField}
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            required
          />
          <button className={styles.submitButton} type="submit">
            {t("register.submit")}
          </button>
        </form>
      </div>
      <p className={styles.signupText}>
        {t("register.already_have_account")} <Link to="/login">{t("login.title")}</Link>
      </p>
    </div>
  );
};

export default Register;

