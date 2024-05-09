import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./forgotPassword.css";
import logoImage from "../../img/logo.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState();

  const handleChange = (e) => {
    setEmail((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/forgot-password", email);
      toast.success("Gửi email thành công, vui lòng kiểm tra email của bạn!");
    } catch (err) {
      toast.error("Email không tồn tại");
    }
  };

  return (
    <div className="login-container">
      <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
        <img src={logoImage} alt="Logo" className="lLogo" />
      </Link>
      <div className="login">
        <div className="lContainer">
          <h1 className="ltext">Quên mật khẩu</h1>
          <div className="divider"></div>
          <p>Vui lòng nhập email của bạn</p>
          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={handleChange}
            className="lInput"
            autoComplete="off"
          />
          <button onClick={handleClick} className="lButton">
            Gửi
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ForgotPassword;
