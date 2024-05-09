import "./userEdit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { format } from "date-fns";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserEdit = () => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({
    email: "",
    phone: "",
    realname: "",
    img: "",
    isAdmin: "",
    sex: "",
    birthday: "",
    address: "",
  });

  const location = useLocation();
  const id = location.pathname.split("/")[3];

  const { data } = useFetch(`/users/${id}`);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let updatedUserInfo = { ...info };
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

      await axios.put(`/users/${id}`, updatedUserInfo);
      toast.success("Sửa tài khoản thành công");
    } catch (err) {
      console.log(err);
      toast.error("Sửa tài khoản thất bại");
    }
  };

  useEffect(() => {
    setInfo({
      email: data.email || undefined,
      phone: data.phone || undefined,
      realname: data.realname || undefined,
      img: data.img || undefined,
      isAdmin: data.isAdmin || undefined,
      sex: data.sex || undefined,
      birthday: data.birthday || undefined,
      address: data.address || undefined,
    });
  }, [data]);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Chỉnh sửa tài khoản</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={file ? URL.createObjectURL(file) : data.img} alt="" />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Ảnh đại diện:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>Tên đầy đủ:</label>
                <input
                  type="text"
                  name="realname"
                  value={setInfo.realname}
                  onChange={handleChange}
                  placeholder={data.realname}
                />
              </div>
              <div className="formInput">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={setInfo.email}
                  onChange={handleChange}
                  placeholder={data.email}
                />
              </div>
              <div className="formInput">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={setInfo.phone}
                  onChange={handleChange}
                  placeholder={data.phone}
                />
              </div>

              <div className="formInput">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={setInfo.address}
                  onChange={handleChange}
                  placeholder={data.address}
                />
              </div>

              <div className="formInput">
                <label>Ngày sinh:</label>
                <input
                  type="date"
                  name="birthday"
                  value={
                    info.birthday
                      ? format(new Date(info.birthday), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
              <div className="formInput">
                <label>Giới tính:</label>
                <select
                  name="sex"
                  value={info.sex}
                  onChange={handleChange}
                  placeholder={data.sex}
                >
                  <option value="Chưa xác định">Chưa xác định</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="formInput">
                <label>Admin</label>
                <select
                  id="isAdmin"
                  onChange={handleChange}
                  value={info.isAdmin}
                >
                  <option value={false}>Không</option>
                  <option value={true}>Có</option>
                </select>
              </div>
            </form>
            <button onClick={handleClick}>Lưu</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserEdit;
