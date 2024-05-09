import React from "react";
import "./menuBar.css";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  return (
    <div className="menuBar">
      <div className="menuBar__right">
        <div className="menuBar__item">
          <span
            className="menuBar__text"
            onClick={() => navigate("/")}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Trang chủ
          </span>
        </div>
        <div className="menuBar__item">
          <span
            className="menuBar__text"
            onClick={() => navigate("/gioi-thieu")}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Giới thiệu
          </span>
        </div>

        <div className="menuBar__item">
          <div className="menuBar__dropdown">
            <span
              className="menuBar__label"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Dịch vụ
            </span>
            <div className="menuBar__dropdown-content">
              <div className="menuBar__dropdown-content-box">
                <li className="menuBar__dropdown-content-item">
                  <span
                    className="menuBar__text"
                    onClick={() => navigate("/van-phong-ao")}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Văn phòng ảo
                  </span>
                </li>
                <li className="menuBar__dropdown-content-item">
                  <span
                    className="menuBar__text"
                    onClick={() => navigate("/van-phong-tron-goi")}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Văn phòng trọn gói
                  </span>
                </li>
                {/* <li className="menuBar__dropdown-content-item">
                  <Link
                    to="/phong-hop"
                    className="menuBar__link"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <span className="menuBar__text">Phòng họp</span>
                  </Link>
                </li>
                <li className="menuBar__dropdown-content-item">
                  <Link
                    to="/phong-hop-truc-tuyen"
                    className="menuBar__link"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <span className="menuBar__text">Phòng họp trực tuyến</span>
                  </Link>
                </li> */}
              </div>
            </div>
          </div>
        </div>
        <div className="menuBar__item">
          <span
            className="menuBar__text"
            onClick={() => navigate("/lien-he")}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Liên hệ
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
