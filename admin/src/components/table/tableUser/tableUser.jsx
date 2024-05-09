import "./tableUser.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const ListUser = () => {
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const userId = pathParts[pathParts.length - 1];
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/order/user/${userId}`);
        if (response && response.data) {
          const sortedData = response.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setOrderData(sortedData.reverse().slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Mã đơn hàng</TableCell>
            <TableCell className="tableCell">Cơ sở</TableCell>
            <TableCell className="tableCell">Loại phòng</TableCell>
            <TableCell className="tableCell">Ngày tạo đơn</TableCell>
            <TableCell className="tableCell">Đơn giá</TableCell>
            <TableCell className="tableCell">Phương thức thanh toán</TableCell>
            <TableCell className="tableCell">Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderData.map((row) => (
            <TableRow key={row._id}>
              <TableCell className="tableCell">{row._id}</TableCell>
              <TableCell className="tableCell">{row.location}</TableCell>
              <TableCell className="tableCell">{row.type}</TableCell>
              <TableCell className="tableCell">
                {format(new Date(row.createdAt), "HH:mm dd/MM/yyyy")}
              </TableCell>
              <TableCell className="tableCell">
                {row.price.toLocaleString() + " VNĐ"}
              </TableCell>
              <TableCell className="tableCell">{row.billing}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListUser;
