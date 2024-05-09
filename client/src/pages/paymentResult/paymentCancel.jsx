// CancelPage.jsx
import React from "react";
import "./paymentCancel.css";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const CancelPage = () => {
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const orderId = pathParts[pathParts.length - 1];
  const { data: orderData } = useFetch(`/order/${orderId}`);
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    axios
      .delete(`/order/${orderId}`)
      .then((response) => {
        console.log("Deleted order:", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
      });
  };

  return (
    <div className="CancelPage">
      <h2>Thanh toán thất bại !</h2>
      <h2>Bạn có thể thanh toán lại hoặc hủy đơn đặt phòng</h2>
      <div className="cancelPage-button">
        <Link to="/">
          <button>Trang chủ</button>
        </Link>
        <button
          onClick={() => {
            navigate("/payment", {
              state: {
                spaceId: null,
                orderData: orderData,
                orderId: orderId,
              },
            });
          }}
        >
          Thanh toán lại
        </button>
        <button onClick={handleConfirmDelete}>Hủy đơn</button>
      </div>
    </div>
  );
};

export default CancelPage;
