import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      if (res.data.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "Bạn không phải là quản trị viên" },
        });
        toast.warning("Bạn không phải là quản trị viên");
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      toast.error("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h1 className="ltext">Đăng nhập</h1>
        <div className="divider"></div>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Đăng nhập
        </button>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default Login;
