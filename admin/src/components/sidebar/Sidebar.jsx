import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Sky Office</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">TRANG CHÍNH</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Tổng quan</span>
            </li>
          </Link>
          <p className="title">DANH SÁCH</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Tài khoản</span>
            </li>
          </Link>
          <Link to="/spaces" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Cơ sở</span>
            </li>
          </Link>
          <Link to="/rooms" style={{ textDecoration: "none" }}>
            <li>
              <MeetingRoomIcon className="icon" />
              <span>Phòng</span>
            </li>
          </Link>
          <Link to="/order" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Đơn đặt phòng</span>
            </li>
          </Link>
          <p className="title">TÀI KHOẢN</p>
          <Link to={`/users/${user._id}`} style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Thông tin tài khoản</span>
            </li>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }} onClick={logout}>
            <li>
              <ExitToAppIcon className="icon" />
              <span>Đăng xuất</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
