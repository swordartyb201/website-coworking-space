import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const [list, setList] = useState();
  const [spaceData, setSpaceData] = useState();

  const { data } = useFetch(`/${path}`);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    setList(data);
    if (data && data.length > 0) {
      // Fetch dữ liệu bổ sung khi đường dẫn là "rooms"
      if (path === "rooms") {
        // Sử dụng row._id của phòng làm id
        const roomIds = data.map((room) => room._id);

        // Thực hiện Axios GET request cho từng id
        Promise.all(
          roomIds.map((id) =>
            axios
              .get(`/spaces/space/${id}`)
              .then((response) => response.data.name)
          )
        ).then((names) => {
          // Tổng hợp dữ liệu và cập nhật trạng thái
          const roomDataMap = {};
          names.forEach((name, index) => {
            roomDataMap[roomIds[index]] = name;
          });
          setSpaceData(roomDataMap);
        });
      }
    }
  }, [data, path]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
      setShowDeleteModal(false); // Đóng modal sau khi xóa thành công
      toast.success(`Xóa ${name(path)} thành công`);
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(`Đã xảy ra lỗi khi xóa ${name(path)}`);
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await axios.get(`/${path}/${id}`);
      const orderData = response.data;
      const alldates = getDatesAndHoursInRange(
        orderData.startDate,
        orderData.endDate
      );
      axios
        .delete(`/rooms/availability/${id}`, {
          data: { dates: alldates },
        })
        .then(() => {
          console.log("Ngày đã được xóa thành công!");
        })
        .catch((error) => {
          console.error("Error deleting dates:", error);
        });
      axios.get(`/order/totalPrice/${orderData.userId}`).then((response) => {
        const data = response.data;
        const newMembership = updateMembership(data.total);
        axios
          .put(`/users/${orderData.userId}`, {
            membership: newMembership,
          })
          .then(() => {
            console.log("Cập nhật hạng thành công!");
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      });
      await axios.delete(`/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
      setShowCancelModal(false); // Đóng modal sau khi xóa thành công
      toast.success(`Xóa ${name(path)} thành công`);
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(`Đã xảy ra lỗi khi xóa ${name(path)}`);
    }
  };

  const additionalColumn =
    path === "rooms"
      ? [
          {
            field: "additionalInfo",
            headerName: "Tên cơ sở",
            width: 230,
            headerAlign: "center",
            renderCell: (params) => (
              <span>{spaceData && spaceData[params.row._id]}</span>
            ),
          },
        ]
      : [];

  const openDeleteModal = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const deleteModal = (
    <div className="delete-modal">
      <div className="modal-content">
        <p>Bạn có chắc chắn muốn xóa {name(path)} này?</p>
        <div className="modal-buttons-box">
          <button
            className="modal-buttons"
            onClick={() => handleDelete(deleteItemId)}
          >
            Xác nhận
          </button>

          <button className="modal-buttons" onClick={closeDeleteModal}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );

  const openCancelModal = (id) => {
    setDeleteItemId(id);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  const cancelModal = (
    <div className="delete-modal">
      <div className="modal-content">
        <p>Bạn có chắc chắn muốn hủy đơn đặt phòng này?</p>
        <div className="modal-buttons-box">
          <button
            className="modal-buttons"
            onClick={() => handleCancel(deleteItemId)}
          >
            Xác nhận
          </button>

          <button className="modal-buttons" onClick={closeCancelModal}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );

  const actionColumn = [
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/${path}/${params.row._id}`} className="viewButton">
              Xem chi tiết
            </Link>
            {["users", "spaces", "rooms"].includes(path) && (
              <div
                className="deleteButton"
                onClick={() => openDeleteModal(params.row._id)}
              >
                Xóa
              </div>
            )}
            {path === "order" && (
              <button
                className="deleteButton"
                onClick={() => openCancelModal(params.row._id)}
              >
                Hủy đơn
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      {showDeleteModal && deleteModal}
      {showCancelModal && cancelModal}
      <div className="datatableTitle">
        {getTitle(path)}
        {path !== "order" && (
          <Link to={`/${path}/new`} className="link">
            Thêm mới
          </Link>
        )}
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(additionalColumn, actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Datatable;

const getTitle = (path) => {
  switch (path) {
    case "users":
      return "Danh sách tài khoản";
    case "spaces":
      return "Danh sách cơ sở";
    case "rooms":
      return "Danh sách phòng";
    case "order":
      return "Danh sách đơn hàng";
    default:
      return path; // Nếu không khớp với các trường hợp trên, hiển thị giá trị của path
  }
};

const name = (path) => {
  switch (path) {
    case "users":
      return "tài khoản";
    case "spaces":
      return "cơ sở";
    case "rooms":
      return "phòng";
    default:
      return path; // Nếu không khớp với các trường hợp trên, hiển thị giá trị của path
  }
};

export const getDatesAndHoursInRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startHour = new Date(startDate).getHours();
  const endHour = new Date(endDate).getHours();

  const datesAndHours = [];

  // Trường hợp 1: Nếu ngày của start = end
  if (start.toDateString() === end.toDateString()) {
    const date = new Date(start.getTime());

    // Lặp qua từng giờ trong ngày
    for (let hour = startHour; hour <= endHour; hour++) {
      const dateTime = new Date(date);
      dateTime.setHours(hour);
      datesAndHours.push(dateTime.getTime());
    }
  } else {
    // Trường hợp 2: Nếu ngày của end - start = 1
    if (end.getDate() - start.getDate() === 1) {
      // Bắt đầu lặp từ giờ của start tới 24 giờ
      for (let hour = startHour; hour <= 23; hour++) {
        const dateTime = new Date(start);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }
      // Bắt đầu lặp từ 1 cho tới giờ của end
      for (let hour = 0; hour <= endHour; hour++) {
        const dateTime = new Date(end);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }
    } else {
      // Trường hợp 3: Nếu ngày của end - 1 > start
      const date = new Date(start.getTime());

      // Lặp qua từng giờ từ giờ của start tới 24 giờ
      for (let hour = startHour; hour <= 23; hour++) {
        const dateTime = new Date(date);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }

      date.setDate(date.getDate() + 1);

      // Lặp lại từ 1 tới 24 giờ cho đến ngày end - 1
      while (date < end) {
        for (let hour = 0; hour <= 23; hour++) {
          const dateTime = new Date(date);
          dateTime.setHours(hour);
          datesAndHours.push(dateTime.getTime());
        }
        date.setDate(date.getDate() + 1);
      }

      // Lặp lại từ 1 tới giờ của end
      for (let hour = 0; hour <= endHour; hour++) {
        const dateTime = new Date(end);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }
    }
  }

  return datesAndHours;
};

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
