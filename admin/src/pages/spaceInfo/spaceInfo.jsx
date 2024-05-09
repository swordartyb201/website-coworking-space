import "./spaceInfo.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ChartSpace from "../../components/chart/chartSpace/chartSpace";
import ListSpace from "../../components/table/tableSpace/tableSpace";
import useFetch from "../../hooks/useFetch";
import { Link, useLocation } from "react-router-dom";
import avtUser from "./avatar-default.png";

const Single = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const { data } = useFetch(`/spaces/find/${id}`);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top-spacesInfo">
          <div className="left">
            <Link to={`/spaces/edit/${id}`} className="editButton">
              Chỉnh sửa
            </Link>
            <h1 className="title">Thông tin cơ sở</h1>
            <div className="item">
              <img
                src={data.ava ? data.ava : avtUser}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Địa chỉ:</span>
                  {data.address}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Mô tả:</span>
                  {data.desc}
                </div>
                <h3 style={{ marginTop: "10px" }}>Ảnh chi tiết</h3>
                {data.photos && data.photos.length > 0 ? (
                  <div className="image-container">
                    {data.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt=""
                        className="detailImage"
                      />
                    ))}
                  </div>
                ) : (
                  <p>Không có ảnh chi tiết.</p>
                )}
              </div>
            </div>
          </div>
          <div className="right">
            <ChartSpace
              aspect={3 / 3}
              title="Lịch sử thu nhập ( 6 tháng gần nhất )"
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Đơn hàng gần nhất</h1>
          <ListSpace />
        </div>
      </div>
    </div>
  );
};

export default Single;
