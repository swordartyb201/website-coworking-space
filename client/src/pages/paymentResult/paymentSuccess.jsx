// SuccessPage.jsx
import "./paymentSuccess.css";
import { AuthContext } from "../../context/AuthContext";
import getDatesAndHoursInRange from "../../utils/dateUtils";
import getDisplayDateMode from "../../utils/dateMode";
import useFetch from "../../hooks/useFetch";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import QRCode from "qrcode.react";
import { format } from "date-fns";

const SuccessPage = () => {
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const orderId = pathParts[pathParts.length - 1];
  const { user } = useContext(AuthContext);
  const { data: orderPrice } = useFetch(`/order/totalPrice/${user._id}`);

  //  const urlParams = new URLSearchParams(window.location.search);
  // const paymentId = urlParams.get("paymentId");
  // const token = urlParams.get("token");
  // const PayerID = urlParams.get("PayerID");

  // // Kiểm tra xem có giá trị hay không trước khi sử dụng
  // if (paymentId && PayerID) {
  //   // Gọi axios với các tham số cần thiết
  //   axios
  //     .get("/payment/executePayment", {
  //       params: {
  //         paymentId: paymentId,
  //         token: token,
  //         PayerID: PayerID,
  //       },
  //     })
  //     .then((response) => {
  //       // Xử lý phản hồi từ server (nếu cần)
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       // Xử lý lỗi (nếu cần)
  //       console.error(error);
  //     });
  // } else {
  //   // Nếu một trong các tham số không có giá trị, xử lý hoặc thông báo lỗi
  //   console.error("Missing required parameters");
  // }
  const [qrCodeData] = useState(orderId);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi axios để lấy thông tin đơn hàng từ orderId
        const orderResponse = await axios.get(`/order/${orderId}`);
        const orderData = orderResponse.data;
        setOrderInfo(orderData);

        const { roomId, startDate, endDate } = orderData;
        const alldates = getDatesAndHoursInRange(startDate, endDate);
        // console.log(alldates.map((date) => format(date, "HH:mm dd/MM/yyyy")));

        await axios.put(`/rooms/availability/${roomId}`, {
          dates: alldates,
        });
        console.log("Room availability updated");
        await axios.put(`/order/${orderId}`, {
          status: "Đã thanh toán",
        });
        console.log("Order status updated");
        if (orderPrice && orderPrice.total) {
          const newMembership = updateMembership(orderPrice.total);
          await axios.put(`/users/${user._id}`, { membership: newMembership });
          console.log("Membership updated successfully");
        }
      } catch (error) {
        console.error(
          "Error updating room availability and order status:",
          error
        );
      }
    };
    if (orderId) {
      fetchData();
    }
  }, [orderId, orderPrice, user._id]);

  return (
    <div className="paymantSc-container">
      <h2>Thanh toán thành công!</h2>
      {orderInfo ? (
        <div className="paymentPage-info-box">
          <h1>Thông tin đơn đặt phòng</h1>
          <hr />
          <div className="paymentPage-info">
            <div className="paymentPage-info-item-box">
              <div className="paymentPage-info-item-label">
                <div>Họ tên người đặt phòng : </div>
                <div>Loại phòng thuê : </div>
                <div>Hình thức thuê :</div>
                <div>Đặt phòng tại : </div>
                <div>
                  Tổng số {orderInfo.duration >= 1 ? "ngày" : "giờ"} thuê :
                </div>
              </div>
              <div className="paymentPage-info-item-data">
                <div>{user.realname}</div>
                <div>{orderInfo.type}</div>
                <div>Theo {getDisplayDateMode(orderInfo.dateMode)}</div>
                <div>{orderInfo.location}</div>
                <div>
                  {orderInfo.duration >= 1
                    ? orderInfo.duration
                    : orderInfo.duration * 24}{" "}
                  {orderInfo.duration >= 1 ? "ngày" : "giờ"}
                </div>
              </div>
            </div>
            <div className="paymentPrice-divider"></div>
            <div
              className="paymentPage-info-item-box"
              style={{ marginTop: "5px" }}
            >
              <div className="paymentPage-info-item-label">
                <div>Mã đơn đặt phòng :</div>
                <div>Ngày nhận phòng :</div>
                <div>Ngày trả phòng :</div>
                <div>Hình thức thanh toán:</div>
                <div>Giá trị đơn đặt phòng:</div>
              </div>
              <div className="paymentPage-info-item-data">
                <div>{orderInfo._id}</div>
                <div>
                  {format(new Date(orderInfo.startDate), "HH:mm dd/MM/yyyy")}
                </div>
                <div>
                  {format(new Date(orderInfo.endDate), "HH:mm dd/MM/yyyy")}
                </div>
                <div>{orderInfo.billing}</div>
                <div>{orderInfo.price.toLocaleString("vi-VN")} VND</div>
              </div>
            </div>
          </div>
          <div className="qrCodeContainer">
            <h3>Đưa mã QR cho nhân viên để làm thủ tục nhận phòng</h3>
            <QRCode value={qrCodeData} size={256} />
          </div>
        </div>
      ) : (
        <p>Loading order information...</p>
      )}
      <Link to="/">
        <button className="paymantSc-button">Quay lại trang chủ</button>
      </Link>
    </div>
  );
};

export default SuccessPage;

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
