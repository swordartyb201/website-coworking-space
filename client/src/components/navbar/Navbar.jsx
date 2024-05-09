import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import logoImage from "../../img/logo.png";
import avtUser from "../../img/avatar-default.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setIsUserMenuVisible(!isUserMenuVisible);
  };

  return (
    <div className="navbar">
      <div className="navbar__container-top">
        <img
          src={logoImage}
          alt="Logo"
          className="navbar__logo"
          onClick={() => navigate("/")}
        />
        <div className="navbar__items-top">
          {user ? (
            <>
              <img
                src={user && user.img ? user.img : avtUser}
                alt="AvtUser"
                className="navbar__user-avatar"
                onClick={toggleUserMenu}
              />
              <div
                className={`navbar__user-menu-wrap ${
                  isUserMenuVisible ? "visible" : "hidden"
                }`}
              >
                <div className="navbar__user-menu">
                  <div className="navbar___user-info">
                    <img
                      src={user && user.img ? user.img : avtUser}
                      alt="AvtUser"
                      className="navbar__avatar-menu"
                    />
                    <h3 className="navbar__username">{user.realname}</h3>
                  </div>
                  <hr />
                  <span
                    onClick={() => navigate("/user/profile")}
                    className="navbar__user-menu-link"
                  >
                    <p>Thông tin cá nhân</p>
                    <span>{">"}</span>
                  </span>
                  <span
                    onClick={() => navigate("/user/order")}
                    className="navbar__user-menu-link"
                  >
                    <p>Lịch sử đặt phòng</p>
                    <span>{">"}</span>
                  </span>
                  <span
                    to="/"
                    className="navbar__user-menu-link"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <p>Đăng xuất</p>
                    <span>{">"}</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <button className="navbar__button-top">Đăng kí</button>
              </Link>
              <Link
                to="/login"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <button className="navbar__button-top">Đăng nhập</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
