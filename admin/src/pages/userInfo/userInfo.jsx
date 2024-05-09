import "./userInfo.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ChartUser from "../../components/chart/chartUser/chartUser";
import ListUser from "../../components/table/tableUser/tableUser";
import useFetch from "../../hooks/useFetch";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import avtUser from "./avatar-default.png";

const Single = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const { data } = useFetch(`/users/${id}`);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link to={`/users/edit/${id}`} className="editButton">
              Chỉnh sửa
            </Link>
            <h1 className="title">Thông tin</h1>
            <div className="item">
              <img
                src={data.img ? data.img : avtUser}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.realname}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  {data.email}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span> {data.phone}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Giới tính:</span> {data.sex}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ngày sinh:</span>
                  {data.birthday
                    ? format(new Date(data.birthday), "dd/MM/yyyy")
                    : "Chưa cập nhật"}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Địa chỉ:</span>{" "}
                  {data.address ? data.address : "Chưa cập nhật"}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Hạng thành viên:</span>{" "}
                  {data.membership}
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <ChartUser
              aspect={3 / 1}
              title="Lịch sử chi tiêu ( 6 tháng gần nhất )"
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Đơn hàng gần nhất</h1>
          <ListUser />
        </div>
      </div>
    </div>
  );
};

export default Single;
