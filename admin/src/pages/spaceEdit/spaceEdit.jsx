import "./spaceEdit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SpaceEdit = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const { data } = useFetch(`/spaces/find/${id}`);
  const [avatarFile, setAvatarFile] = useState();
  const [files, setFiles] = useState();
  const [spaceInfo, setSpaceInfo] = useState(data);

  useEffect(() => {
    setSpaceInfo(data);
  }, [data]);

  const handleChange = (e) => {
    setSpaceInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const navigate = useNavigate();

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");
    const uploadRes = await axios.post(
      "https://api.cloudinary.com/v1_1/skyoffice/upload",
      data
    );
    return uploadRes.data.url;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let updatedSpaceInfo = { ...spaceInfo };
      if (avatarFile) {
        const avatarUrl = await uploadImage(avatarFile);
        updatedSpaceInfo = { ...updatedSpaceInfo, img: avatarUrl };
      }
      if (files) {
        const list = await Promise.all(Object.values(files).map(uploadImage));
        updatedSpaceInfo = { ...updatedSpaceInfo, photos: list };
      }

      await axios.put(`/spaces/${id}`, updatedSpaceInfo);
      toast.success("Sửa thông tin cơ sở thành công");
      navigate("/spaces");
    } catch (err) {
      console.log(err);
      toast.error("Sửa thông tin cơ sở thất bại");
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Chỉnh sửa cơ sở</h1>
        </div>
        <div className="bottom">
          <div className="left-space">
            <h3>Ảnh đại diện cơ sở</h3>
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : data.ava}
              alt=""
              className="avatarImg"
            />
            <hr />
            <h3 style={{ marginTop: "10px" }}>Ảnh chi tiết cơ sở</h3>
            {files && files.length > 0 ? (
              <div className="image-container">
                {Array.from(files).map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`File ${index + 1}`}
                  />
                ))}
              </div>
            ) : (
              <div className="image-container">
                {data.photos && data.photos.length > 0 ? (
                  data.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt=""
                      className="detailImage"
                    />
                  ))
                ) : (
                  <img
                    src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                    alt=""
                    style={{ width: "200px" }}
                  />
                )}
              </div>
            )}
          </div>
          <div className="right-spaces">
            <form>
              <div className="formInput">
                <label htmlFor="avatarFile">
                  Ảnh đại diện:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="avatarFile"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label htmlFor="file">
                  Ảnh chi tiết:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>Tên cơ sở</label>
                <input
                  id="name"
                  onChange={handleChange}
                  defaultValue={data.name}
                />
              </div>
              <div className="formInput">
                <label>Quận</label>
                <input
                  id="location"
                  onChange={handleChange}
                  defaultValue={data.location}
                />
              </div>
              <div className="formInput">
                <label>Định vị Google Map</label>
                <input
                  id="map"
                  onChange={handleChange}
                  defaultValue={data.map}
                />
              </div>
              <div className="formInput">
                <label>Địa chỉ chi tiết</label>
                <textarea
                  id="address"
                  onChange={handleChange}
                  defaultValue={data.address}
                  style={{ height: "50px", width: "250px" }}
                />
              </div>
              <div className="formInput">
                <label>Mô tả</label>
                <textarea
                  id="desc"
                  onChange={handleChange}
                  defaultValue={data.desc}
                  style={{ height: "200px", width: "350px" }}
                />
              </div>
              <div className="formInput">
                <button onClick={handleClick}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SpaceEdit;
