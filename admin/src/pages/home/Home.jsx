import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/chart/Chart";
import Table from "../../components/table/table/Table";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Doanh thu 6 tháng gần nhất" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Đơn hàng gần đây</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
