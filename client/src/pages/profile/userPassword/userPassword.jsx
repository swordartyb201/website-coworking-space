import "./userPassword.css";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import Sidebar from "../../../components/profile/sidebar/sidebar";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import MenuList from "../../../components/menubar/MenuBar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Password = () => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangePassword = async () => {
    try {
      if (userInfo.newPassword !== userInfo.confirmNewPassword) {
        toast.error("Mật khẩu mới và xác nhận mật khẩu mới không trùng nhau!");
        return;
      }

      const response = await axios.put(
        `/auth/change-password/${user._id}`,
        userInfo
      );

      if (response.data.success) {
        toast.success("Mật khẩu đã được thay đổi thành công!");
      } else {
        toast.error("Thay đổi mật khẩu thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Mật khẩu cũ không đúng. Vui lòng thử lại!");
    }
  };

  return (
    <div>
      <Navbar />
      <MenuList />
      <div className="userPassword-container">
        <Sidebar className="userPassword-sidebar" />
        <div className="userPassword-change-container">
          <div className="userPassword-change-box">
            <h3>Đổi mật khẩu</h3>
            <p>
              Vì sự an toàn, Sky Office khuyến khích khách hàng sử dụng mật khẩu
              mạnh và không trùng với mật khẩu cũ.
            </p>
            <hr />
            <div className="userPassword__input-item">
              <label>Nhập mật khẩu cũ:</label>
              <input
                type="password"
                name="oldPassword"
                value={userInfo.oldPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="userPassword__input-item">
              <label>Nhập mật khẩu mới:</label>
              <input
                type="password"
                name="newPassword"
                value={userInfo.newPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="userPassword__input-item">
              <label>Nhập lại mật khẩu mới:</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={userInfo.confirmNewPassword}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={handleChangePassword}>Lưu thay đổi</button>
          </div>
          {/* <div className="userPassword__divider"></div>
          <div className="userPassword__warning">
            <p>Vui lòng chọn ảnh nhỏ hơn 5MB</p>
            <br />
            <p>Chọn hình ảnh phù hợp, không phản cảm</p>
          </div> */}
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Password;
