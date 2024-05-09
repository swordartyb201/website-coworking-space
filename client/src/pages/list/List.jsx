import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import MenuList from "../../components/menubar/MenuBar";
import Footer from "../../components/footer/Footer";
import { useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { format, addHours, addMonths, setMinutes, setHours } from "date-fns";
import { DateRange, Calendar } from "react-date-range";
import { SearchContext } from "../../context/SearchContext";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { vi } from "date-fns/locale";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const locations = [
    "Tất cả địa điểm",
    "Hà Đông",
    "Thanh Xuân",
    "Ba Đình",
    "Cầu Giấy",
  ];

  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);

  const resetDates = () => {
    setDates([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  const [dateMode, setDateMode] = useState(location.state.dateMode);

  const [selectedCheckInDay, setSelectedCheckInDay] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);
  const [selectedCheckInHour, setSelectedCheckInHour] = useState();
  const [selectedRentHours, setSelectedRentHours] = useState();

  // Xử lý thay đổi giờ nhận phòng
  const handleTimeChange = (e, type) => {
    const newValue = e.target.value;

    // Nếu là giờ nhận phòng thay đổi
    if (type === "checkInHour") {
      setSelectedCheckInHour(newValue);

      const newStartDate = addHours(
        setHours(setMinutes(new Date(selectedCheckInDay[0].startDate), 0), 0),
        newValue
      );

      setDates([
        {
          ...dates[0],
          startDate: newStartDate,
        },
      ]);

      const rentHours = selectedRentHours || 3; // Mặc định là 3 giờ nếu chưa chọn
      setSelectedRentHours(rentHours);
      const newEndDate = addHours(newStartDate, rentHours);
      setDates((prevDates) => [
        {
          ...prevDates[0],
          endDate: newEndDate,
        },
      ]);

      // Nếu là số giờ thuê thay đổi
    } else if (type === "rentHours") {
      setSelectedRentHours(newValue);

      const newEndDate = addHours(dates[0].startDate, newValue);
      setDates([
        {
          ...dates[0],
          endDate: newEndDate,
        },
      ]);
    }
  };

  const currentHour = new Date().getHours();
  const isToday =
    selectedCheckInDay[0].startDate.toDateString() ===
    new Date().toDateString();
  const checkInHoursArray = Array.from({ length: 24 }, (_, i) => i).filter(
    (hour) => !isToday || hour >= currentHour + 1
  );
  const rentHoursArray = [3, 4, 5, 6, 7, 8];

  const [fetchDestination, setFetchDestination] = useState(
    location.state.destination
  );

  const { data, loading, reFetch } = useFetch(
    `/spaces?location=${fetchDestination}`
  );

  const { dispatch } = useContext(SearchContext);

  const handleClick = async () => {
    let calculatedDuration;

    if (dateMode === "hour") {
      calculatedDuration = selectedRentHours / 24;
    } else if (dateMode === "day" || dateMode === "month") {
      const startDate = new Date(dates[0].startDate);
      const endDate = new Date(dates[0].endDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      calculatedDuration = timeDiff / (1000 * 60 * 60 * 24);
    } else {
      calculatedDuration = "";
    }
    setFetchDestination(destination);
    dispatch({
      type: "NEW_SEARCH",
      payload: {
        destination,
        dates,
        dateMode,
        duration: calculatedDuration,
      },
    });
    reFetch();
  };

  return (
    <div>
      <Navbar />
      <MenuList />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Tìm kiếm</h1>
            <div className="lsItem">
              <label>Địa điểm</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="listLocation"
              >
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className="list-buttons">
              <label>Chọn hình thức thuê</label>
              <div className="list-buttons-item">
                <div>
                  <button
                    onClick={() => {
                      setDateMode("hour");
                      resetDates();
                    }}
                    className={`list-buttons-datemode ${
                      dateMode === "hour" ? "selected" : ""
                    }`}
                  >
                    Theo giờ
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setDateMode("day");
                      resetDates();
                    }}
                    className={`list-buttons-datemode ${
                      dateMode === "day" ? "selected" : ""
                    }`}
                  >
                    Theo ngày
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setDateMode("month");
                      resetDates();
                    }}
                    className={`list-buttons-datemode ${
                      dateMode === "month" ? "selected" : ""
                    }`}
                  >
                    Theo tháng
                  </button>
                </div>
              </div>
            </div>
            <div className="lsItem-date">
              {dateMode === "hour" && (
                <>
                  <div className="list-time-box">
                    <div>
                      <div className="listText-time">Nhận phòng</div>
                      <span
                        onClick={() => setOpenDate(!openDate)}
                        className="list-input-time"
                      >
                        {`${format(dates[0].startDate, "HH:mm dd/MM ")}`}
                      </span>
                    </div>
                  </div>
                  <div className="list-time-box">
                    <div>
                      <div className="listText-time">Trả phòng</div>
                      <span
                        onClick={() => setOpenDate(!openDate)}
                        className="list-input-time"
                      >
                        {`${format(dates[0].endDate, "HH:mm dd/MM")}`}
                      </span>
                    </div>
                  </div>
                  {openDate && (
                    <>
                      <div className="listdate">
                        <Calendar
                          date={dates[0].startDate}
                          onChange={(date) => {
                            setDates([
                              {
                                startDate: date,
                                endDate: date,
                                key: "selection",
                              },
                            ]);
                            setSelectedCheckInDay([
                              {
                                startDate: date,
                                endDate: date,
                              },
                            ]);
                          }}
                          minDate={new Date()}
                          locale={vi}
                        />
                        <div>
                          <div className="list-select-hour">
                            <p>Giờ nhận phòng</p>
                            <select
                              value={selectedCheckInHour}
                              onChange={(e) =>
                                handleTimeChange(e, "checkInHour")
                              }
                              className="list-select-hour-input"
                            >
                              {checkInHoursArray.map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}:00
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="list-select-hour">
                            <p>Số giờ thuê</p>
                            <select
                              value={selectedRentHours}
                              onChange={(e) => handleTimeChange(e, "rentHours")}
                              className="list-select-hour-input"
                            >
                              {rentHoursArray.map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour} giờ
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {dateMode === "day" && (
                <>
                  <div className="list-time-box">
                    <div>
                      <div className="listText-time">Nhận phòng</div>
                      <span
                        onClick={() => setOpenDate(!openDate)}
                        className="list-input-time"
                      >
                        {`${format(dates[0].startDate, "dd/MM/yyyy")}`}
                      </span>
                    </div>
                  </div>
                  <div className="list-time-box">
                    <div>
                      <div className="listText-time">Trả phòng</div>
                      <span
                        onClick={() => setOpenDate(!openDate)}
                        className="list-input-time"
                      >
                        {`${format(dates[0].endDate, "dd/MM/yyyy")}`}
                      </span>
                    </div>
                  </div>
                  {openDate && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDates([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dates}
                      className="listdate-day"
                      minDate={new Date()}
                      style={{ width: "90%", height: "50%" }}
                      dateDisplayFormat="dd/MM/yyyy"
                      locale={vi}
                    />
                  )}
                </>
              )}
              {dateMode === "month" && (
                <>
                  <div className="list-time-box">
                    <div>
                      <div className="listText-time">Nhận phòng</div>
                      <span
                        onClick={() => setOpenDate(!openDate)}
                        className="list-input-time"
                      >
                        {`${format(dates[0].startDate, "dd/MM/yyyy")}`}
                      </span>
                    </div>
                  </div>
                  <div className="list-time-box">
                    <div>
                      <div className="listText-time">Trả phòng</div>
                      <span
                        onClick={() => setOpenDate(!openDate)}
                        className="list-input-time"
                      >
                        {`${format(
                          addMonths(dates[0].startDate, 1),
                          "dd/MM/yyyy"
                        )}`}
                      </span>
                    </div>
                  </div>
                  {openDate && (
                    <Calendar
                      date={dates[0].startDate}
                      onChange={(date) =>
                        setDates([
                          { startDate: date, endDate: addMonths(date, 1) },
                        ])
                      }
                      minDate={new Date()}
                      className="listdate"
                      locale={vi}
                    />
                  )}
                </>
              )}
            </div>
            <button onClick={handleClick}>Tìm kiếm</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Đang tải"
            ) : (
              <>
                {data.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
