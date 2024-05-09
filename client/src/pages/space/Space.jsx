import "./space.css";
import Navbar from "../../components/navbar/Navbar";
import MenuList from "../../components/menubar/MenuBar";
import Footer from "../../components/footer/Footer";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import VPaoImage from "../../img/van-phong-ao.png";
import VPlamviecImage from "../../img/van-phong-lam-viec.png";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Space = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [openModal, setOpenModal] = useState(false);
  const { data, loading } = useFetch(`/spaces/find/${id}`);
  const { user } = useContext(AuthContext);
  // const navigate = useNavigate();

  const handleLoginNotification = () => {
    toast.error("Vui lòng đăng nhập để đặt phòng.");
    // setTimeout(() => {
    //   navigate("/login");
    // }, 2000);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      handleLoginNotification();
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <div>
      <Navbar />
      <MenuList />
      {loading ? (
        "loading"
      ) : (
        <div className="spaceContainer">
          <div className="spaceSlide-container">
            <div id="googleMap">
              {data.map && typeof data.map === "string" && (
                <iframe
                  title="Google Map"
                  src={data.map}
                  width="500"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </div>
            <div className="spaceSlide">
              <Slider {...settings}>
                {data.photos?.map((photo, index) => (
                  <div className="spaceImg-item" key={photo}>
                    <img
                      src={photo}
                      alt={`slider ${index}`}
                      className="spaceImgSlide"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="spaceName">
            <h1 style={{ paddingLeft: "50px" }}>{data.name}</h1>
          </div>
          <div className="spaceInf">
            <div className="spaceInf-left">
              <hr /> <p className="spaceInf-left-title"> Địa chỉ </p>{" "}
              <p className="spaceInf-left-text">{data.address}</p>
              <hr /> <p className="spaceInf-left-title"> Email </p>{" "}
              <p className="spaceInf-left-text"> contact@skyoffice.vn </p>
              <hr /> <p className="spaceInf-left-title"> Hotline 24/7</p>{" "}
              <p className="spaceInf-left-text"> (+84) 853 39 4567</p> <hr />
            </div>
            <div className="spaceInf-right">
              {" "}
              <p>{data.desc}</p>{" "}
            </div>
          </div>
          <div className="spaceColumn">
            <div className="spaceColumn-left">
              <div className="spaceColumn-left-box">
                <img src={VPaoImage} alt="" className="spaceImg" />
                <h3 className="spaceColumn-bold-text1">VĂN PHÒNG ẢO</h3>
                <p style={{ marginBottom: "10px", fontSize: "14px" }}>
                  Chỉ từ 22.000/ngày
                </p>
                <p className="spaceColumn-desc1">
                  Bạn sẽ được sử dụng văn phòng ảo ở Hà Nội để: làm văn phòng
                  đại diện, địa chỉ giao dịch, tiếp đối tác – khách hàng, địa
                  chỉ nhận bưu thư…
                </p>
              </div>

              <div className="spaceColumn-left-box">
                <img src={VPlamviecImage} alt="" className="spaceImg" />
                <h3 className="spaceColumn-bold-text1">VĂN PHÒNG TRỌN GÓI</h3>
                <p style={{ marginBottom: "10px", fontSize: "14px" }}>
                  Chỉ từ 300.000/ngày
                </p>
                <p className="spaceColumn-desc1">
                  Bạn sẽ sở hữu: 1 phòng làm việc riêng, phòng họp – phòng khách
                  sang trọng, thiết bị văn phòng hiện đại,… Và không lo đóng phí
                  điện – nước, internet.
                </p>
              </div>
            </div>
            <div className="spaceColumn-right">
              <div className="spaceColumn-right-box">
                <p className="spaceColumn-desc2">
                  Với vị trí đắc địa, văn phòng được thiết lập trang bị sẵn và
                  tiện ích được thiết kế linh hoạt, phù hợp, <b>Sky Office</b>{" "}
                  đảm bảo các doanh nghiệp có thể trực tiếp bắt tay vào làm việc
                  và vận hành nhanh chóng.
                </p>
                <button className="spaceButton" onClick={handleClick}>
                  Đặt phòng ngay
                </button>
              </div>
            </div>
          </div>
          <ToastContainer position="top-center" autoClose={3000} />
          <Footer />
        </div>
      )}
      {openModal && (
        <Reserve setOpen={setOpenModal} spaceId={id} spaceData={data} />
      )}
    </div>
  );
};

export default Space;
