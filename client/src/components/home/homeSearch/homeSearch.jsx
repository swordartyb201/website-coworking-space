import "./homeSearch.css";
import { DateRange, Calendar } from "react-date-range";
import { useContext, useState, useEffect } from "react";
import { format, addHours, addMonths, setMinutes, setHours } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../../context/SearchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faLocationDot,
  faMagnifyingGlass,
  faArrowRightFromBracket,
  faHourglassHalf,
  faSun,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

const HomeSearch = ({ type }) => {
  const [dateMode, setDateMode] = useState("day");
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Đặt state mới cho giờ nhận phòng và số giờ thuê
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

  const resetDates = () => {
    setDates([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  const navigate = useNavigate();

  const locations = [
    "Tất cả địa điểm",
    "Ba Đình",
    "Cầu Giấy",
    "Thanh Xuân",
    "Hà Đông",
  ];

  const { dispatch } = useContext(SearchContext);

  const handleSearch = () => {
    let calculatedDuration;

    if (dateMode === "hour") {
      // Nếu là chế độ theo giờ, duration là số giờ thuê / 24
      calculatedDuration = selectedRentHours / 24;
    } else if (dateMode === "day" || dateMode === "month") {
      // Nếu là chế độ theo ngày hoặc tháng, duration là tổng số ngày từ startdate tới enddate
      const startDate = new Date(dates[0].startDate);
      const endDate = new Date(dates[0].endDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      calculatedDuration = timeDiff / (1000 * 60 * 60 * 24);
    } else {
      // Nếu không phải bất kỳ chế độ nào, đặt giá trị mặc định
      calculatedDuration = "";
    }
    dispatch({
      type: "NEW_SEARCH",
      payload: { destination, dates, dateMode, duration: calculatedDuration },
    });
    navigate("/spaces", {
      state: { destination, dates, dateMode, duration: calculatedDuration },
    });
  };

  const currentHour = new Date().getHours();
  const isToday =
    selectedCheckInDay[0].startDate.toDateString() ===
    new Date().toDateString();
  const checkInHoursArray = Array.from({ length: 24 }, (_, i) => i).filter(
    (hour) => !isToday || hour >= currentHour + 1
  );
  // const hoursArray = Array.from({ length: 24 }, (_, i) => i + 1);
  const rentHoursArray = [3, 4, 5, 6, 7, 8];

  const SelectComponent = ({ value, onChange, className, children }) => (
    <select value={value} onChange={onChange} className={className}>
      {children}
    </select>
  );

  useEffect(() => {
    // Mặc định khi trang được tải, chọn giá trị đầu tiên trong mảng là "Tất cả địa điểm"
    setDestination(locations[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="header">
      <div className="header-container">
        <div className="headerSearchItem-buttons">
          <div>
            <button
              onClick={() => {
                setDateMode("hour");
                resetDates();
              }}
              className={`headerSearchItem-buttons-datemode ${
                dateMode === "hour" ? "selected" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faHourglassHalf}
                className={`headerSearchItem-datemode-icon ${
                  dateMode === "hour" ? "selected" : ""
                }`}
              />
              <p>Theo giờ</p>
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setDateMode("day");
                resetDates();
              }}
              className={`headerSearchItem-buttons-datemode ${
                dateMode === "day" ? "selected" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faSun}
                className={`headerSearchItem-datemode-icon ${
                  dateMode === "day" ? "selected" : ""
                }`}
              />
              <p>Theo ngày</p>
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setDateMode("month");
                resetDates();
              }}
              className={`headerSearchItem-buttons-datemode ${
                dateMode === "month" ? "selected" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faCalendarDays}
                className={`headerSearchItem-datemode-icon ${
                  dateMode === "month" ? "selected" : ""
                }`}
              />

              <p>Theo tháng</p>
            </button>
          </div>
        </div>
        <div className="headerSearch">
          <div className="headerSearchItem-location">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="headerIcon-location"
            />
            <div>
              <div className="headerSearchItemText">Địa điểm</div>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="headerSearchInput"
              >
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="header-divider"></div>
          <div className="headerSearchItem-time">
            {dateMode === "hour" && (
              <>
                <div className="headerSearchItem-time-box">
                  <FontAwesomeIcon
                    icon={faArrowRightToBracket}
                    className="headerIcon-location"
                  />
                  <div>
                    <div className="headerSearchItemText-time">Nhận phòng</div>
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >
                      {`${format(dates[0].startDate, "HH:mm dd/MM ")}`}
                    </span>
                  </div>
                </div>
                <div className="headerSearchItem-time-box">
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="headerIcon-location"
                  />
                  <div>
                    <div className="headerSearchItemText-time">Trả phòng</div>
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >
                      {`${format(dates[0].endDate, "HH:mm dd/MM")}`}
                    </span>
                  </div>
                </div>
                {openDate && (
                  <>
                    <div className="date">
                      <Calendar
                        selected={dates[0].startDate}
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
                      />
                      <div>
                        <div className="headerSearch-select-hour">
                          <p>Giờ nhận phòng</p>
                          <SelectComponent
                            value={selectedCheckInHour}
                            onChange={(e) => handleTimeChange(e, "checkInHour")}
                            className="headerSearch-select-hour-input"
                          >
                            {checkInHoursArray.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}:00
                              </option>
                            ))}
                          </SelectComponent>
                        </div>
                        <div className="headerSearch-select-hour">
                          <p>Số giờ thuê</p>
                          <SelectComponent
                            value={selectedRentHours}
                            onChange={(e) => handleTimeChange(e, "rentHours")}
                            className="headerSearch-select-hour-input"
                          >
                            {rentHoursArray.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour} giờ
                              </option>
                            ))}
                          </SelectComponent>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            {dateMode === "day" && (
              <>
                <div className="headerSearchItem-time-box">
                  <FontAwesomeIcon
                    icon={faArrowRightToBracket}
                    className="headerIcon-location"
                  />
                  <div>
                    <div className="headerSearchItemText-time">Nhận phòng</div>
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >
                      {`${format(dates[0].startDate, "dd/MM/yyyy")}`}
                    </span>
                  </div>
                </div>
                <div className="headerSearchItem-time-box">
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="headerIcon-location"
                  />
                  <div>
                    <div className="headerSearchItemText-time">Trả phòng</div>
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
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
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </>
            )}
            {dateMode === "month" && (
              <>
                <div className="headerSearchItem-time-box">
                  <FontAwesomeIcon
                    icon={faArrowRightToBracket}
                    className="headerIcon-location"
                  />
                  <div>
                    <div className="headerSearchItemText-time">Nhận phòng</div>
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >
                      {`${format(dates[0].startDate, "dd/MM/yyyy")}`}
                    </span>
                  </div>
                </div>
                <div className="headerSearchItem-time-box">
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="headerIcon-location"
                  />
                  <div>
                    <div className="headerSearchItemText-time">Trả phòng</div>
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
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
                    selected={dates[0].startDate}
                    onChange={(date) =>
                      setDates([
                        { startDate: date, endDate: addMonths(date, 1) },
                      ])
                    }
                    minDate={new Date()}
                    className="date"
                  />
                )}
              </>
            )}
          </div>
          <div className="header-divider"></div>
          <div className="headerSearchItem-button">
            <button className="headerBtn" onClick={handleSearch}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="headerIcon"
              />
              <p>Tìm kiếm</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;
