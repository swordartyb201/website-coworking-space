import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [spaceId, setSpaceId] = useState(undefined);
  const [rooms, setRooms] = useState([]);

  const { data, loading } = useFetch("/spaces");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    console.log(roomNumbers);
    try {
      await axios.post(`/rooms/${spaceId}`, { ...info, roomNumbers });
      toast.success("Thêm phòng mới thành công");
      navigate("/rooms");
    } catch (err) {
      console.log(err);
      toast.error("Thêm phòng mới thất bại");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Thêm phòng mới</h1>
        </div>
        <div className="bottom">
          <div className="right-rooms">
            <form>
              <div className="formInput">
                <label>Chọn 1 cơ sở</label>
                <select
                  id="spaceId"
                  onChange={(e) => setSpaceId(e.target.value)}
                >
                  {loading
                    ? "loading"
                    : data &&
                      data.map((space) => (
                        <option key={space._id} value={space._id}>
                          {space.name}
                        </option>
                      ))}
                </select>
              </div>
              {roomInputs.map((input) => (
                <div
                  className="formInput"
                  key={input.id}
                  style={{ maxWidth: "120px" }}
                >
                  <label>{input.label}</label>
                  {input.type === "select" ? (
                    <select id={input.id} onChange={handleChange}>
                      {input.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
              <div className="formInput">
                <label>Số phòng</label>
                <textarea onChange={(e) => setRooms(e.target.value)} />
              </div>
            </form>
            <button onClick={handleClick}>Thêm mới</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewRoom;
