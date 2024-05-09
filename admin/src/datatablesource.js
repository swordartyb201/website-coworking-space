export const userColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "user",
    headerName: "Tài khoản",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="avatar"
          />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "isAdmin",
    headerName: "Admin",
    width: 100,
  },
];

export const spaceColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Tên",
    width: 300,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.ava || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="ava"
          />
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "location",
    headerName: "Địa điểm",
    width: 120,
  },
];

export const roomColumns = [
  { field: "_id", headerName: "ID", width: 220 },
  {
    field: "type",
    headerName: "Loại phòng",
    width: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "price",
    headerName: "Giá phòng ( ngày )",
    width: 160,
    valueFormatter: (params) => {
      const value = params.value;
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    headerAlign: "center",
    align: "center",
  },
  {
    field: "pricePerHour",
    headerName: "Giá phòng (giờ)",
    width: 140,
    valueGetter: (params) => {
      const price = params.row.price;
      return price ? price / 24 : "Không có dữ liệu";
    },
    valueFormatter: (params) => {
      const value = params.value;
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    headerAlign: "center",
    align: "center",
  },
  {
    field: "roomNumbers",
    headerName: "Số phòng",
    width: 90,
    valueGetter: (params) => {
      if (params.value) {
        return params.value.length;
      } else {
        return "Không có dữ liệu";
      }
    },
    headerAlign: "center",
    align: "center",
  },
];

export const orderColumns = [
  { field: "_id", headerName: "ID", width: 200 },
  {
    field: "price",
    headerName: "Đơn giá",
    width: 110,
    valueFormatter: (params) => {
      const value = params.value;
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    headerAlign: "center",
    cellClassName: "cellWithPrice",
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 130,
    headerAlign: "center",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    },
  },
  {
    field: "location",
    headerName: "Cơ sở",
    width: 180,
    headerAlign: "center",
  },
  {
    field: "roomNumber",
    headerName: "Vị trí phòng",
    width: 110,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "billing",
    headerName: "Hình thức thanh toán",
    width: 140,
    headerAlign: "center",
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 120,
    headerAlign: "center",
  },
];
