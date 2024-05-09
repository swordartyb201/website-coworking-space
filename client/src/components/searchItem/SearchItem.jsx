import { Link } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  return (
    <div className="searchItem">
      <img src={item.ava[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <p>Địa chỉ: {item.address}</p>
      </div>
      <div className="siDetails">
        <div className="siDetailTexts">
          <Link to={`/spaces/${item._id}`}>
            <button className="siCheckButton">Xem thông tin</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
