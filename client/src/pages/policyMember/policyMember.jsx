// PolicyMember.js
import React from "react";
import "./policyMember.css";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import MenuList from "../../components/menubar/MenuBar";

const PolicyMember = () => {
  return (
    <div>
      <Navbar />
      <MenuList />
      <div className="policy-page">
        <h1>Chính Sách Ưu Đãi và Chiết Khấu Hạng Thành Viên</h1>

        <p>
          Chào mừng bạn đến với trang với chính sách ưu đãi và chiết khấu hạng
          thành viên của chúng tôi. Ở đây bạn sẽ tìm thấy mọi thông tin chi tiết
          về những lợi ích và quy định của chúng tôi.
        </p>

        <h2>Hạng Thành Viên:</h2>
        <ul>
          <li>
            <strong>Thường:</strong>
            <ul>
              <li>Chi tiêu dưới 5.000.000 VND.</li>
              <li>Chiết khấu đặt phòng: 0%.</li>
            </ul>
          </li>
          <li>
            <strong>Thân Thiết:</strong>
            <ul>
              <li>Chi tiêu từ 5.000.000 VND đến 19.999.999 VND.</li>
              <li>Chiết khấu đặt phòng: 3%.</li>
            </ul>
          </li>
          <li>
            <strong>VIP:</strong>
            <ul>
              <li>Chi tiêu từ 20.000.000 VND đến 99.999.999 VND.</li>
              <li>Chiết khấu đặt phòng: 5%.</li>
            </ul>
          </li>
          <li>
            <strong>VVIP:</strong>
            <ul>
              <li>Chi tiêu từ 100.000.000 VND trở lên.</li>
              <li>Chiết khấu đặt phòng: 10%.</li>
            </ul>
          </li>
        </ul>
        <h2>Cách Tính Tổng Chi Tiêu:</h2>
        <p>
          Tổng chi tiêu của bạn được tính dựa trên số tiền đã chi trên trang web
          của chúng tôi, bao gồm cả chi phí đặt phòng và các dịch vụ khác.
        </p>

        <h2>Lợi Ích Hạng Thành Viên:</h2>
        <ul>
          <li>
            <strong>Ưu Đãi Hàng Tháng:</strong> Nhận các ưu đãi đặc biệt hàng
            tháng dành riêng cho từng hạng thành viên.
          </li>
          <li>
            <strong>Ưu Đãi Chi Tiêu:</strong> Nhận điểm thưởng và ưu đãi khi đạt
            các mốc chi tiêu.
          </li>
          <li>
            <strong>Chiết Khấu Đặt Phòng:</strong>
            <ul>
              <li>Hạng thành viên Thân Thiết: 3%.</li>
              <li>Hạng thành viên VIP: 5%.</li>
              <li>Hạng thành viên VVIP: 10%.</li>
            </ul>
          </li>
        </ul>

        <h2>Lưu Ý Quan Trọng:</h2>
        <ul>
          <li>
            Tổng chi tiêu được cập nhật hàng tháng và ảnh hưởng đến hạng thành
            viên của bạn.
          </li>
          <li>
            Chiết khấu đặt phòng chỉ áp dụng khi đặt phòng trực tiếp trên trang
            web của chúng tôi.
          </li>
        </ul>

        <p>
          Chúng tôi trân trọng sự hỗ trợ và trung thành của bạn, và chúng tôi hy
          vọng chính sách ưu đãi này sẽ mang lại trải nghiệm tốt nhất cho bạn
          khi sử dụng dịch vụ của chúng tôi.
        </p>

        <p>Trân trọng,</p>
        <p>Đội ngũ Quản lý Khách Hàng</p>
      </div>
      <Footer />
    </div>
  );
};

export default PolicyMember;
