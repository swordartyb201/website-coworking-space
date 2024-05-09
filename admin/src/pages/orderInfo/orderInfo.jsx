import "./orderInfo.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/useFetch";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";

const OrderInfo = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const { data: orderInfo } = useFetch(`/order/${id}`);
  const { data: userInfo } = useFetch(`/users/${orderInfo.userId}`);

  if (!orderInfo || !userInfo) {
    return <div>Đang tải...</div>;
  }

  const getDisplayDateMode = (dateMode) => {
    switch (dateMode) {
      case "hour":
        return "giờ";
      case "day":
        return "ngày";
      case "month":
        return "tháng";
      default:
        return dateMode;
    }
  };
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top-orderinfo">
          <div className="left">
            <h1 className="title">Thông tin đơn đặt phòng</h1>
            <div className="item">
              <div className="details">
                <div>
                  <div className="detailItem">
                    <span className="itemKey">Tên người đặt phòng:</span>
                    {userInfo.realname}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    {userInfo.email}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Ngày tạo đơn:</span>{" "}
                    {orderInfo.createdAt
                      ? format(
                          new Date(orderInfo.createdAt),
                          "HH:mm dd/MM/yyyy"
                        )
                      : "Chưa cập nhật"}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Đơn giá:</span>{" "}
                    {orderInfo.price
                      ? orderInfo.price.toLocaleString("vi-VN") + " VNĐ"
                      : "Chưa cập nhật"}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Loại hình thuê:</span>
                    Theo {getDisplayDateMode(orderInfo.dateMode)}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Thời gian thuê:</span>{" "}
                    {orderInfo.duration >= 1
                      ? orderInfo.duration
                      : orderInfo.duration * 24}{" "}
                    {orderInfo.duration >= 1 ? "ngày" : "giờ"}
                  </div>
                </div>
                <div>
                  <div className="detailItem">
                    <span className="itemKey">Loại phòng thuê:</span>{" "}
                    {orderInfo.type}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Thuê tại:</span>{" "}
                    {orderInfo.location}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Ngày bắt đầu:</span>{" "}
                    {orderInfo.startDate
                      ? format(
                          new Date(orderInfo.startDate),
                          "HH:mm dd/MM/yyyy"
                        )
                      : "Chưa cập nhật"}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Ngày kết thúc:</span>{" "}
                    {orderInfo.endDate
                      ? format(new Date(orderInfo.endDate), "HH:mm dd/MM/yyyy")
                      : "Chưa cập nhật"}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Hình thức thanh toán:</span>{" "}
                    {orderInfo.billing}
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Trạng thái:</span>{" "}
                    {orderInfo.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
