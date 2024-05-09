import "./userOrder.css";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/profile/sidebar/sidebar";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import MenuList from "../../../components/menubar/MenuBar";
import useFetch from "../../../hooks/useFetch";
import getDatesAndHoursInRange from "../../../utils/dateUtils";
import getDisplayDateMode from "../../../utils/dateMode";

import QRCode from "qrcode.react";
import { format } from "date-fns";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const { user } = useContext(AuthContext);
  const {
    data: ordersData,
    loading,
    error,
    reFetch,
  } = useFetch(`/order/user/${user._id}`);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    const timeDifference = new Date(selectedOrder.startDate) - new Date();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 2 && selectedOrder.status === "Đã thanh toán") {
      setIsConfirmModalOpen(false);
      toast.error("Không thể hủy đơn hàng vì đã quá thời gian cho phép.");
    } else {
      axios
        .delete(`/order/${selectedOrder._id}`)
        .then((response) => {
          if (selectedOrder.status === "Chờ thanh toán") {
            console.log("Không cần xóa ngày vì đơn hàng chưa thanh toán.");
          } else {
            const alldates = getDatesAndHoursInRange(
              selectedOrder.startDate,
              selectedOrder.endDate
            );
            axios
              .delete(`/rooms/availability/${selectedOrder.roomId}`, {
                data: { dates: alldates },
              })
              .then(() => {
                console.log("Ngày đã được xóa thành công!");
              })
              .catch((error) => {
                console.error("Error deleting dates:", error);
              });
            axios.get(`/order/totalPrice/${user._id}`).then((response) => {
              const data = response.data;
              const newMembership = updateMembership(data.total);
              axios
                .put(`/users/${user._id}`, {
                  membership: newMembership,
                })
                .then(() => {
                  console.log("Cập nhật thành công!");
                })
                .catch((error) => {
                  console.error("Error updating user:", error);
                });
            });
          }
          toast.success("Đơn đặt phòng đã được hủy thành công!");
          reFetch();
          setIsConfirmModalOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting order:", error);
          toast.error("Có lỗi khi hủy đơn đặt phòng!");
        });
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
  };

  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <MenuList />
      <div className="userOrder-container">
        <Sidebar className="userOrder-sidebar" />
        <div className="userOrder-change-container">
          <div className="userOrder-change-box">
            <h3>Lịch sử đặt phòng</h3>
            <p>Hiển thị thông tin phòng bạn đã đặt tại Sky Office.</p>
            <hr />
            <table className="userOrder-table">
              <thead>
                <tr>
                  <th>Mã đơn đặt phòng</th>
                  <th>Đơn giá (VND)</th>
                  <th>Cơ sở</th>
                  <th>Vị trí phòng</th>
                  <th>Hình thức thanh toán</th>
                  <th>Trạng thái</th>
                  {/* Thêm các cột khác tùy ý */}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5">Error loading orders.</td>
                  </tr>
                ) : Array.isArray(ordersData) && ordersData.length > 0 ? (
                  ordersData.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.price.toLocaleString("vi-VN")}</td>
                      <td>{order.location}</td>
                      <td>{order.roomNumber}</td>
                      <td>{order.billing}</td>
                      <td>{order.status}</td>
                      <td>
                        <button
                          onClick={() => {
                            axios
                              .get(`/order/${order._id}`)
                              .then((response) => {
                                setSelectedOrder(response.data);
                                setIsModalOpen(true);
                                setIsConfirmModalOpen(false);
                              })
                              .catch((error) => {
                                console.error(
                                  "Error fetching order details:",
                                  error
                                );
                                toast.error("Error fetching order details");
                              });
                          }}
                          className="userOrder-table-button"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            axios
                              .get(`/order/${order._id}`)
                              .then((response) => {
                                setSelectedOrder(response.data);
                                setIsConfirmModalOpen(true);
                                setIsModalOpen(false);
                              })
                              .catch((error) => {
                                console.error(
                                  "Error fetching order details:",
                                  error
                                );
                                toast.error("Error fetching order details");
                              });
                          }}
                          className="userOrder-table-button"
                        >
                          Hủy đơn
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Cửa sổ modal với thông tin chi tiết */}
          {isModalOpen && (
            <div className="order-details-modal">
              <div className="userOrder-info-box">
                <h1>Thông tin đơn đặt phòng</h1>
                <hr />
                <div className="userOrder-info">
                  <div className="userOrder-info-item-box">
                    <div className="userOrder-info-item-label">
                      <p>Họ tên người đặt phòng : </p>
                      <p>Đặt phòng tại : </p>
                      <p>Loại phòng thuê : </p>
                      <p>Hình thức thuê :</p>

                      <p>
                        Tổng số {selectedOrder.duration >= 1 ? "ngày" : "giờ"}{" "}
                        thuê :
                      </p>
                    </div>
                    <div className="userOrder-info-item-data">
                      <p>{user.realname}</p>
                      <p>{selectedOrder.location}</p>
                      <p>{selectedOrder.type}</p>
                      <p>Theo {getDisplayDateMode(selectedOrder.dateMode)}</p>
                      <p>
                        {selectedOrder.duration >= 1
                          ? selectedOrder.duration
                          : selectedOrder.duration * 24}{" "}
                        {selectedOrder.duration >= 1 ? "ngày" : "giờ"}
                      </p>
                    </div>
                  </div>
                  <div className="userOrder-divider"></div>
                  <div className="userOrder-info-item-box">
                    <div className="userOrder-info-item-label">
                      <p>Tên phòng :</p>
                      <p>Ngày Checkin :</p>
                      <p>Ngày Checkout :</p>
                      <p>Hình thức thanh toán:</p>
                      <p>Giá trị đơn đặt phòng:</p>
                    </div>
                    <div className="userOrder-info-item-data">
                      <p>{selectedOrder.roomNumber || "none"}</p>
                      <p>
                        {format(
                          new Date(selectedOrder.startDate),
                          "HH:mm dd/MM/yyyy"
                        )}
                      </p>
                      <p>
                        {format(
                          new Date(selectedOrder.endDate),
                          "HH:mm dd/MM/yyyy"
                        )}
                      </p>
                      <p>{selectedOrder.billing}</p>
                      <p>{selectedOrder.price.toLocaleString("vi-VN")} VND</p>
                    </div>
                  </div>
                </div>
                <div className="qrCodeContainer">
                  {selectedOrder.status === "Chờ thanh toán" ? (
                    <>
                      <h4>
                        Đơn đặt phòng sẽ tự động hủy trong{" "}
                        {Math.ceil(
                          (new Date(selectedOrder.createdAt).getTime() +
                            30 * 60 * 1000 -
                            new Date().getTime()) /
                            (60 * 1000)
                        )}{" "}
                        phút nếu chưa thanh toán
                      </h4>
                      <button
                        onClick={() => {
                          navigate("/payment", {
                            state: {
                              spaceId: null,
                              orderData: selectedOrder,
                              orderId: selectedOrder._id,
                            },
                          });
                        }}
                        className="userOrder-modal-button"
                        style={{ marginTop: "5px" }}
                      >
                        Thanh toán
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>Đưa mã QR cho nhân viên để làm thủ tục nhận phòng</h3>
                      <QRCode value={selectedOrder._id} size={200} />
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="userOrder-modal-button"
              >
                Đóng
              </button>
            </div>
          )}
          {/* Cửa sổ modal xác nhận hủy */}
          {isConfirmModalOpen && (
            <div className="delete-confirmation-modal">
              <h3>Xác nhận hủy đơn đặt phòng</h3>
              <hr />
              <p>Đơn đặt phòng chỉ được hủy trước thời gian checkin 2 giờ</p>
              <p>Bạn có chắc muốn hủy đơn đặt phòng này?</p>
              <div className="delete-confirmation-modal-button">
                <button
                  onClick={handleConfirmDelete}
                  className="userOrder-modal-button"
                >
                  Xác nhận
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="userOrder-modal-button"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Order;

export const updateMembership = (orderPriceTotal) => {
  let membership = "Thường";

  if (orderPriceTotal >= 100000000) {
    membership = "VVIP";
  } else if (orderPriceTotal >= 20000000) {
    membership = "VIP";
  } else if (orderPriceTotal >= 5000000) {
    membership = "Thân thiết";
  }

  return membership;
};
