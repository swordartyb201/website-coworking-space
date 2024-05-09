import "./sidebar.css";
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";

const userProfile = () => {
  return (
    <div>
      <div className="userProfile_sidebar">
        <div className="userProfile_sidebar-item">
          <Link to="/user/profile" className="userProfile_sidebar-link">
            <FontAwesomeIcon
              icon={faUser}
              className="userProfile_sidebar-icon"
            />
            Tài khoản
          </Link>
        </div>
        <hr />
        <div className="userProfile_sidebar-item">
          <Link to="/user/order" className="userProfile_sidebar-link">
            <FontAwesomeIcon
              icon={faCartShopping}
              className="userProfile_sidebar-icon"
            />
            Lịch sử đặt phòng
          </Link>
        </div>
        <hr />
        <div className="userProfile_sidebar-item">
          <Link to="/user/change-password" className="userProfile_sidebar-link">
            <FontAwesomeIcon
              icon={faUserLock}
              className="userProfile_sidebar-icon"
            />
            Mật khẩu và bảo mật
          </Link>
        </div>
      </div>
    </div>
  );
};

export default userProfile;
