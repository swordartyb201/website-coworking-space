import "./roomInfo.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ChartRoom from "../../components/chart/chartRoom/chartRoom";
import ListRoom from "../../components/table/tableRoom/tableRoom";
import useFetch from "../../hooks/useFetch";
import { Link, useLocation } from "react-router-dom";

const RoomInfo = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const { data: spaceData } = useFetch(`/spaces/space/${id}`);
  const { data: roomData } = useFetch(`/rooms/${id}`);

  if (!spaceData || !roomData) {
    return <div>Đang tải...</div>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link to={`/rooms/edit/${id}`} className="editButton">
              Chỉnh sửa
            </Link>
            <h1 className="title">Thông tin phòng</h1>
            <div className="item">
              <div className="details">
                <h2 className="itemTitle">Thuộc {spaceData.name}</h2>
                <div className="detailItem">
                  <span className="itemKey">Địa chỉ:</span>
                  {spaceData.address}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Loại văn phòng:</span>
                  {roomData.type}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Giá tháng:</span>
                  {formatCurrency(roomData.price * 30 * 0.9)}/ tháng
                </div>{" "}
                <div className="detailItem">
                  <span className="itemKey">Giá ngày:</span>
                  {formatCurrency(roomData.price)}/ ngày
                </div>
                <div className="detailItem">
                  <span className="itemKey">Giá giờ:</span>
                  {formatCurrency(Math.floor((roomData.price / 24) * 1.1))}/ giờ
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <ChartRoom
              aspect={3 / 1}
              title="Lịch sử thu nhập ( 6 tháng gần nhất )"
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Đơn hàng gần nhất</h1>
          <ListRoom />
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
