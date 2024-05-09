import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  console.log(info);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (file) {
      data.append("file", file);
      data.append("upload_preset", "upload");
    }

    try {
      let url = "";
      if (file) {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/skyoffice/upload",
          data
        );
        url = uploadRes.data.url;
      }

      const newUser = file ? { ...info, img: url } : { ...info };

      await axios.post("/auth/register", newUser);
      toast.success("Tạo tài khoản thành công");
      setTimeout(() => {
        navigate("/users");
      }, 3000);
    } catch (err) {
      console.log(err);
      toast.error("Tạo tài khoản thất bại");
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right-user">
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
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Ngày sinh:</label>
                <input type="date" id="birthday" onChange={handleChange} />
              </div>
              <div className="formInput">
                <label>Giới tính:</label>
                <select name="sex" onChange={handleChange}>
                  <option value="Chưa xác định">Chưa xác định</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="formInput">
                <label>Admin</label>
                <select id="isAdmin" onChange={handleChange}>
                  <option value={false}>Không</option>
                  <option value={true}>Có</option>
                </select>
              </div>
              <button onClick={handleClick}>Gửi</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default New;
