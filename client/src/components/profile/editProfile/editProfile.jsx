// editProfile.js
import React, { useState, useContext, useEffect } from "react";
import "./editProfile.css";
import { AuthContext } from "../../../context/AuthContext";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { data: userData, reFetch } = useFetch(`/users/${user._id}`);
  const { data: orderData, loading } = useFetch(
    `/order/totalPrice/${user._id}`
  );
  const [file, setFile] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: "",
    phone: "",
    realname: "",
    img: "",
    sex: "",
    birthday: "",
    address: "",
    totalPrice: "",
  });
  const handleInputChange = (e) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      let updatedUserInfo = { ...userInfo };
      if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/skyoffice/upload",
          data
        );
        const { url } = uploadRes.data;
        updatedUserInfo = { ...updatedUserInfo, img: url };
      }
      await axios.put(`/users/${user._id}`, updatedUserInfo);
      updateUser(updatedUserInfo);
      reFetch();
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.log(err);
      toast.error("Cập nhật thông tin thất bại!");
    }
  };

  useEffect(() => {
    setUserInfo({
      email: user.email || undefined,
      phone: user.phone || undefined,
      realname: user.realname || undefined,
      sex: user.sex || undefined,
      birthday: user.birthday || undefined,
      address: user.address || undefined,
      totalPrice: orderData.total || undefined,
    });
  }, [user, orderData]);

  return (
    <div className="editP">
      <div className="editPr__show-inf-box">
        <h3>Tổng quan</h3>
        <div className="editPr__show-inf">
          <div className="editPr__show-inf-flex">
            <div className="editPr__show-inf-item">
              <p>Tên đăng nhập</p>
              <div className="editPr__show-inf-item-data">
                {userData.username}
              </div>
            </div>
            <div className="editPr__show-inf-item">
              <p>Email</p>
              <div className="editPr__show-inf-item-data">{userData.email}</div>
            </div>
            <div className="editPr__show-inf-item">
              <p>Họ và tên</p>
              <div className="editPr__show-inf-item-data">
                {userData.realname}
              </div>
            </div>
            <div className="editPr__show-inf-item">
              <p>Số điện thoại</p>
              <div className="editPr__show-inf-item-data">{userData.phone}</div>
            </div>
          </div>
          <div className="editPr__show-inf-flex">
            <div className="editPr__show-inf-item">
              <p>Tổng chi tiêu</p>
              <div className="editPr__show-inf-item-data">
                {loading || !userInfo.totalPrice
                  ? "Đang tải..."
                  : `${userInfo.totalPrice.toLocaleString("vi-VN")} VNĐ`}
              </div>
            </div>
            <div className="editPr__show-inf-item">
              <p>Hạng thành viên</p>
              <div className="editPr__show-inf-item-data">
                {userData.membership}
              </div>
            </div>
            <div className="editPr__show-inf-item">
              <Link
                to="/policy-member"
                style={{
                  color: "blue",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Tìm hiểu thêm về ưu đãi hạng thành viên
              </Link>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div className="editPr__box">
        <div className="editPr__change-Pic-box">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : "https://cdn.divineshop.vn/image/catalog/icon/avatar-khach-hang-2-52544.png?hash=1649933269"
            }
            alt=""
            className=""
          />
          <div className="editPr__btn-pic">
            <label htmlFor="file">Sửa ảnh đại diện</label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
          <div className="editPr__divider"></div>
          <div className="editPr__warning-pic">
            <p>Vui lòng chọn ảnh nhỏ hơn 5MB</p>
            <br />
            <p>Chọn hình ảnh phù hợp, không phản cảm</p>
          </div>
        </div>
        <hr />
        <h3>Cá nhân</h3>
        <div className="editPr__input-item-container">
          <div className="editPr__input-item-container-flex">
            <div className="editPr__input-item">
              <label>Tên đầy đủ:</label>
              <input
                type="text"
                name="realname"
                value={userInfo.realname}
                onChange={handleInputChange}
                placeholder={user.realname}
              />
            </div>
            <div className="editPr__input-item">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                placeholder={user.email}
              />
            </div>
            <div className="editPr__input-item">
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
                placeholder={user.phone}
              />
            </div>
          </div>
          <div className="editPr__input-item-container-flex">
            <div className="editPr__input-item">
              <label>Giới tính:</label>
              <select
                name="sex"
                value={userInfo.sex}
                onChange={handleInputChange}
                placeholder={user.sex}
              >
                <option value="Chưa xác định">Chưa xác định</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="editPr__input-item">
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                placeholder={user.address}
              />
            </div>
            <div className="editPr__input-item">
              <label>Ngày sinh:</label>
              <input
                type="date"
                name="birthday"
                value={
                  userInfo.birthday
                    ? format(new Date(userInfo.birthday), "yyyy-MM-dd")
                    : ""
                }
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <button onClick={handleUpdateProfile}>Lưu thay đổi</button>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default EditProfile;
