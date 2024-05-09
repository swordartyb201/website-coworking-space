import axios from "axios";
import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "./resetPassword.css";
import logoImage from "../../img/logo.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { id, token } = useParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(
        "Mật khẩu và mật khẩu nhập lại không khớp. Vui lòng thử lại!"
      );
      return;
    }
    try {
      await axios.post(`/auth/reset-password/${id}/${token}`, {
        password,
      });
      toast.success("Đổi mật khẩu thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error("Đường link đã hết hạn. Vui lòng thử lại!");
    }
  };

  return (
    <div className="login-container">
      <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
        <img src={logoImage} alt="Logo" className="lLogo" />
      </Link>
      <div className="login">
        <div className="lContainer">
          <h1 className="ltext">Đổi mật khẩu</h1>
          <div className="divider"></div>
          <input
            type="password"
            id="password"
            placeholder="Mật khẩu mới"
            onChange={handleChange}
            className="lInput"
            autoComplete="off"
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={handleConfirmChange}
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

export default ResetPassword;
