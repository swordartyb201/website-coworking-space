import "./roomEdit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoomEdit = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const { data: roomInfo } = useFetch(`/rooms/${id}`);
  const { data: spaceInfo, loading: spaceLoading } = useFetch("/spaces");

  useEffect(() => {
    setInfo(roomInfo);
  }, [roomInfo]);

  const [info, setInfo] = useState({});
  const [spaceId, setSpaceId] = useState(undefined);
  const [rooms, setRooms] = useState([]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    try {
      await axios.put(`/rooms/${spaceId}`, { ...info, roomNumbers });
      toast.success("Sửa thông tin phòng thành công");
      navigate(`/rooms/edit/${id}`);
    } catch (err) {
      console.log(err);
      toast.error("Sửa thông tin phòng thất bại");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Chỉnh sửa thông tin phòng</h1>
        </div>
        <div className="bottom">
          <div className="right-rooms">
            <form>
              <div className="formInput">
                <label>Loại phòng:</label>
                <select
                  id="type"
                  onChange={handleChange}
                  defaultValue={roomInfo.type}
                >
                  <option value="Văn phòng ảo">Văn phòng ảo</option>
                  <option value="Văn phòng trọn gói">Văn phòng trọn gói</option>
                </select>
              </div>
              <div className="formInput">
                <label>Giá phòng ( Theo ngày )</label>
                <input
                  id="price"
                  onChange={(e) => setRooms(e.target.value)}
                  type="number"
                  defaultValue={roomInfo.price}
                />
              </div>
              <div className="formInput">
                <label>Số phòng</label>
                <textarea
                  id="roomNumbers"
                  onChange={(e) => setRooms(e.target.value)}
                />
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

export default RoomEdit;
