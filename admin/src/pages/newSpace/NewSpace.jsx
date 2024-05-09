import "./newSpace.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { spaceInputs } from "../../formSource";
// import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewSpace = () => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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
      // Upload avatar image
      const avatarUrl = await uploadImage(avatarFile);

      // Upload other images
      const list = await Promise.all(Object.values(files).map(uploadImage));

      // Lấy id của các phòng
      const newspace = {
        ...info,
        ava: avatarUrl,
        photos: list,
      };
      await axios.post("/spaces", newspace);
      toast.success("Thêm cơ sở mới thành công");
      navigate("/spaces");
    } catch (err) {
      console.log(err);
      toast.error("Thêm cơ sở mới thất bại");
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Thêm cơ sở mới</h1>
        </div>
        <div className="bottom">
          <div className="left-space">
            <h3>Ảnh đại diện cơ sở</h3>
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
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
              <img
                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                alt=""
                style={{ width: "200px" }}
              />
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

              {spaceInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Mô tả</label>
                <textarea
                  id="desc"
                  onChange={handleChange}
                  placeholder="Nhập mô tả"
                  style={{ height: "100px", width: "250px" }}
                />
              </div>
              <div className="formInput">
                <button onClick={handleClick}>Gửi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewSpace;
