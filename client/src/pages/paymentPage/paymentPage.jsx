// PaymentPage.jsx
import "./paymentPage.css";
import Footer from "../../components/footer/Footer";
import MenuList from "../../components/menubar/MenuBar";
import Navbar from "../../components/navbar/Navbar";
import paypalImage from "./paypalbutton.png";
import creditImage from "./creditcardbutton.png";
import { AuthContext } from "../../context/AuthContext";
import getDisplayDateMode from "../../utils/dateMode";
import useFetch from "../../hooks/useFetch";

import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import StripeCheckout from "react-stripe-checkout";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
  const location = useLocation();
  const { spaceId, orderData } = location.state;

  const { user } = useContext(AuthContext);
  const { data: userInfo } = useFetch(`/users/${user._id}`);

  const navigate = useNavigate();

  const getMembershipDiscount = () => {
    const discountPercentage = getDiscountPercentage(userInfo.membership);
    return orderData.price * discountPercentage;
  };
  const amountInCents = Math.round(
    (orderData.price - getMembershipDiscount()) / 240
  );
  console.log(amountInCents);
  // Hàm xử lý thanh toán PayPal
  const handlePaypalPayment = async () => {
    try {
      // Gọi API để lấy thông tin thanh toán từ PayPal
      const response = await axios.post("/paypal/pay", {
        price: amountInCents / 100,
        description: "Mô tả đơn hàng",
        return_url: `http://localhost:4000/success/${orderData._id}`,
        cancel_url: `http://localhost:4000/cancel/${orderData._id}`,
      });

      const { approvalUrl } = response.data;
      // Chuyển hướng người dùng đến trang thanh toán PayPal
      window.location.href = approvalUrl;
    } catch (error) {
      toast.error("Lỗi khi tạo thanh toán PayPal. Vui lòng thử lại sau.");
      console.error(error);
    }
  };

  // Xử lý thanh toán Credit Card
  const handleCreditCardPayment = async (token) => {
    try {
      // Gọi API để thực hiện thanh toán Stripe
      const response = await axios.post("/stripe/pay", {
        token: token.id,
        amount: amountInCents,
        description: "Thanh toán đơn đặt phòng tại Sky Office",
        orderId: orderData._id,
      });

      if (response.data.success) {
        toast.success("Thanh toán thành công!");
        await axios.put(`/order/${orderData._id}`, {
          billing: "Credit Card",
        });
        navigate(`/success/${orderData._id}`);
      } else {
        toast.error("Lỗi khi xử lý thanh toán. Vui lòng thử lại sau.");
        navigate(`/cancel/${orderData._id}`);
      }
    } catch (error) {
      toast.error("Lỗi khi thực hiện thanh toán Stripe. Vui lòng thử lại sau.");
      console.error(error);
    }
  };

  const navigateBackAndCancelOrder = async () => {
    try {
      await axios.delete(`/order/${orderData._id}`);
      toast.success("Đã hủy đơn hàng!");
      navigate(`/spaces/${spaceId}`);
    } catch (error) {
      toast.error("Lỗi khi hủy đơn hàng. Vui lòng thử lại sau.");
      console.error(error);
    }
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paypal");

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div className="paymentPage">
      <Navbar />
      <MenuList />
      <div className="paymentPage-main">
        <div className="paymentPage-info-box">
          <h1>Thông tin đơn hàng</h1>
          <p>
            Đơn hàng sẽ bị hủy sau 30 phút nếu như bạn chưa thanh toán thành
            công!
          </p>
          <hr />
          <div className="paymentPage-info">
            <div className="paymentPage-info-item-box">
              <div className="paymentPage-info-item-label">
                <div>Họ tên người đặt hàng : </div>
                <div>Loại phòng thuê : </div>
                <div>Hình thức thuê :</div>
                <div>Đặt phòng tại : </div>
              </div>
              <div className="paymentPage-info-item-data">
                <div>{user.realname}</div>
                <div>{orderData.type}</div>
                <div>Theo {getDisplayDateMode(orderData.dateMode)}</div>
                <div>{orderData.location}</div>
              </div>
            </div>
            <div className="paymentPrice-divider"></div>
            <div className="paymentPage-info-item-box">
              <div className="paymentPage-info-item-label">
                <div>Ngày nhận phòng :</div>
                <div>Ngày trả phòng :</div>
                <div>
                  Tổng số {orderData.duration >= 1 ? "ngày" : "giờ"} thuê :
                </div>
                <div>Giá trị đơn hàng : </div>
                <div>Chiết khấu thành viên {userInfo.membership}: </div>
              </div>
              <div className="paymentPage-info-item-data">
                <div>
                  {format(new Date(orderData.startDate), "HH:mm dd/MM/yyyy")}
                </div>
                <div>
                  {format(new Date(orderData.endDate), "HH:mm dd/MM/yyyy")}
                </div>
                <div>
                  {orderData.duration >= 1
                    ? orderData.duration
                    : orderData.duration * 24}{" "}
                  {orderData.duration >= 1 ? "ngày" : "giờ"}
                </div>
                <div>{orderData.price.toLocaleString("vi-VN")} VND</div>
                <div>
                  {(getMembershipDiscount() / orderData.price) * 100}% (
                  {getMembershipDiscount().toLocaleString("vi-VN")} VND)
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="paymentPrice-button-container">
          <button
            className="paymentPrice-button-turnback"
            onClick={navigateBackAndCancelOrder}
            style={{ display: spaceId ? "block" : "none" }}
          >
            Quay lại và hủy đơn hàng
          </button>
          <div className="paymentPage-payment-container">
            <div className="paymentPage-payment-method">
              <div className="payment-method-header">
                <p>Chọn hình thức thanh toán</p>
              </div>
              <div className="paymentPage-payment-method-radio">
                <label>
                  <input
                    type="radio"
                    value="paypal"
                    checked={selectedPaymentMethod === "paypal"}
                    onChange={() => handlePaymentMethodChange("paypal")}
                  />
                  PayPal
                </label>
                <label>
                  <input
                    type="radio"
                    value="creditcard"
                    checked={selectedPaymentMethod === "creditcard"}
                    onChange={() => handlePaymentMethodChange("creditcard")}
                  />
                  Credit Card
                </label>
              </div>
            </div>
            <div className="paymentPrice-button">
              {selectedPaymentMethod === "paypal" && (
                <img
                  src={paypalImage}
                  alt="PayPal"
                  className="paymentPrice-image-paypal"
                  onClick={handlePaypalPayment}
                />
              )}
              {selectedPaymentMethod === "creditcard" && (
                <StripeCheckout
                  stripeKey="pk_test_51OY8Z6EBJzugYx4RcUOzkLPhJUhzgaaruEWVDKTABQQFtU5o7Phpy0BluzBPWUBcQ5FOJpKeg6SYxqZd6N5RewEg00VncBJcUK"
                  token={handleCreditCardPayment}
                  amount={amountInCents}
                  name="Sky Office"
                  description="Đặt phòng tại Sky Office"
                  email={user.email}
                >
                  <button className="paymentPrice-button-pay">
                    <img
                      src={creditImage}
                      alt="Credit Card"
                      className="paymentPrice-image-credit"
                    />
                    Credit Card
                  </button>
                </StripeCheckout>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default PaymentPage;

export const getDiscountPercentage = (membership) => {
  switch (membership) {
    case "Thân thiết":
      return 0.03; // 3%
    case "VIP":
      return 0.05; // 5%
    case "VVIP":
      return 0.1; // 10%
    default:
      return 0; // Không giảm giá
  }
};
