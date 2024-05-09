import "./widget.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

const Widget = ({ type }) => {
  let data;

  const [amount, setAmount] = useState(0);

  switch (type) {
    case "user":
      data = {
        title: "TÀI KHOẢN",
        isMoney: false,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ĐƠN HÀNG",
        isMoney: false,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "TỔNG DOANH THU",
        isMoney: true,
        // link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        switch (type) {
          case "user":
            response = await axios.get("/users/totalUsers");
            break;
          case "order":
            // Replace with the appropriate API endpoint for order amount
            response = await axios.get("/order/count-total-orders");
            break;
          case "earning":
            // Replace with the appropriate API endpoint for earning amount
            response = await axios.get("/order/total-orders-price");
            break;
          default:
            break;
        }

        if (response && response.data) {
          setAmount(response.data.amount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div className="widget">
      {data && (
        <div className="left">
          <span className="title">{data.title}</span>
          <span className="counter">
            {data.isMoney ? amount.toLocaleString() + " VNĐ" : amount}
          </span>
          <span className="link">{data.link}</span>
        </div>
      )}
      <div className="right">
        {/* <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div> */}
        {data && data.icon}
      </div>
    </div>
  );
};

export default Widget;
