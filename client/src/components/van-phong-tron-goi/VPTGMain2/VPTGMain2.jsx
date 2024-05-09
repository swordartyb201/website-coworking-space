import "./VPTGMain2.css";
import VPTG1 from "../../../img/VPA-ECONOMY.jpg";
import VPTG2 from "../../../img/VPA-STANDARD.jpg";
import VPTG3 from "../../../img/VPA-BUSINESS.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignsPost,
  faMap,
  faPersonDress,
  faEnvelope,
  faPaperPlane,
  faToolbox,
  faMugSaucer,
  faUserPlus,
  faFax,
  faSquarePhone,
  faShareSquare,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";

const VPTGMain2 = () => {
  return (
    <div className="VPTG__main2">
      <div className="VPTG__main2-box1">
        <h2 className="VPTG__main2-title1">
          HÃY LỰA CHỌN GÓI VĂN PHÒNG ẢO CHO THUÊ PHÙ HỢP VỚI BẠN
        </h2>
        <div className="VPTG__main2-row-img">
          <img src={VPTG1} alt="" className="VPTG__main2-img" />
          <img src={VPTG2} alt="" className="VPTG__main2-img" />
          <img src={VPTG3} alt="" className="VPTG__main2-img" />
        </div>
      </div>

      <div className="VPTG__main2-box2">
        <h2>
          12 TIỆN ÍCH KHI SỬ DỤNG DỊCH VỤ CHO THUÊ VĂN PHÒNG ẢO TẠI SKY OFFICE:
        </h2>
        <div className="VPTG__main2-row">
          <div className="VPTG__main2-row-box">
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon
                icon={faSignsPost}
                className="VPTG__main2-icon"
              />
              <p className="VPTG__main2-text">
                Sử dụng địa chỉ văn phòng giao dịch
              </p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon icon={faMap} className="VPTG__main2-icon" />
              <p className="VPTG__main2-text">
                Địa chỉ chi nhánh, văn phòng đại diện
              </p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon
                icon={faPersonDress}
                className="VPTG__main2-icon"
              />
              <p className="VPTG__main2-text">Lễ tân, tiếp khách</p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon icon={faEnvelope} className="VPTG__main2-icon" />
              <p className="VPTG__main2-text">Tiếp nhận thư/bưu phẩm</p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="VPTG__main2-icon"
              />
              <p className="VPTG__main2-text">Chuyển tiếp thư/bưu phẩm</p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon icon={faToolbox} className="VPTG__main2-icon" />
              <p className="VPTG__main2-text">Tư vấn đăng ký kinh doanh</p>
            </div>
          </div>

          <div className="VPTG__main2-row-box">
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon
                icon={faMugSaucer}
                className="VPTG__main2-icon"
              />
              <p className="VPTG__main2-text">Nước uống (café, trà, nước)</p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon icon={faUserPlus} className="VPTG__main2-icon" />
              <p className="VPTG__main2-text">
                Nhân viên đại diện doanh nghiệp
              </p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon icon={faFax} className="VPTG__main2-icon" />
              <p className="VPTG__main2-text">Số fax chung</p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon
                icon={faSquarePhone}
                className="VPTG__main2-icon"
              />
              <p className="VPTG__main2-text">
                Điện thoại viên trả lời cuộc gọi
              </p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon
                icon={faShareSquare}
                className="VPTG__main2-icon"
              />
              <p className="VPTG__main2-text">
                Tổng đài nội bộ và chuyển cuộc gọi
              </p>
            </div>
            <div className="VPTG__main2-row-item">
              <FontAwesomeIcon icon={faTasks} className="VPTG__main2-icon" />
              <p className="VPTG__main2-text">Tư vấn đăng ký thuế ban đầu</p>
            </div>
          </div>
        </div>

        <div className="VPTG__main2-note-box">
          <h4 className="VPTG__main2-note-title">GHI CHÚ:</h4>
          <ul className="VPTG__main2-note-text">
            <li>
              Số lượng/thời lượng dịch vụ được quy định theo mỗi tháng, không có
              giá trị quy đổi hay cộng dồn cho các tháng sau.
            </li>
            <li>Giá trên chưa bao gồm VAT</li>
            <li>Tiện ích sử dụng trong giờ hành chính</li>
            <li>Sử dụng tiện ích trên tất cả các cơ sở của Hanoi Office</li>
            <li>
              Giá trên áp dụng cho Doanh nghiệp vốn Việt Nam, Doanh nghiệp vốn
              nước ngoài vui lòng ”{" "}
              <a href="tel:+84696996669" style={{ textDecoration: "none" }}>
                Liên hệ
              </a>{" "}
              “.
            </li>
            <li>Văn phòng phẩm phụ trội thanh toán theo thực tế sử dụng.</li>
            <li>
              Cước điện thoại thanh toán thực tế theo hóa đơn nhà cung cấp.
            </li>
            <li>
              Phí chuyển tiếp thư/ bưu phẩm theo yêu cầu sẽ thanh toán theo thực
              tế.
            </li>
            <li>
              Sử dụng phòng họp báo trước 24h; sử dụng khu vực tiếp khách chung
              báo trước 24h.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VPTGMain2;
