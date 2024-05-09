import "./featured.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";

const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const Featured = () => {
  const [revenueData, setRevenueData] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    lastWeek: 0,
    lastMonth: 0,
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("/order/revenue-stats");
        if (response && response.data) {
          setRevenueData(response.data);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const isPositiveChangeWeek = revenueData.thisWeek > revenueData.lastWeek;
  const isPositiveChangeMonth = revenueData.thisMonth > revenueData.lastMonth;

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Doanh thu</h1>
      </div>
      <div className="bottom">
        <p className="title">Doanh thu hôm nay</p>
        <p className="amount">{formatCurrency(revenueData.today)}</p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Tuần này</div>
            <div
              className={
                isPositiveChangeWeek
                  ? "itemResult positive"
                  : "itemResult negative"
              }
            >
              <div className="resultAmount">
                {formatCurrency(revenueData.thisWeek)}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Tuần trước</div>
            <div
              className={
                isPositiveChangeWeek
                  ? "itemResult negative"
                  : "itemResult positive"
              }
            >
              <div className="resultAmount">
                {formatCurrency(revenueData.lastWeek)}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Tháng trước</div>
            <div
              className={
                isPositiveChangeMonth
                  ? "itemResult negative"
                  : "itemResult positive"
              }
            >
              <div className="resultAmount">
                {formatCurrency(revenueData.lastMonth)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
