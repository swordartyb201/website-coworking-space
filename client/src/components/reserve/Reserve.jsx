import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import getDatesAndHoursInRange from "../../utils/dateUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format, addHours, addMonths, setMinutes, setHours } from "date-fns";
import { vi } from "date-fns/locale";
import { DateRange, Calendar } from "react-date-range";

const Reserve = ({ setOpen, spaceId, spaceData }) => {
  const [roomData, setRoomData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const { data } = useFetch(`/spaces/room/${spaceId}`);
  const [selectedItem, setSelectedItem] = useState(null);
  const {
    dates: searchDates,
    duration: searchDuration,
    dateMode: searchDatemode,
  } = useContext(SearchContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useContext(AuthContext);
  const [openDate, setOpenDate] = useState(false);

  const [dateMode, setDateMode] = useState(searchDatemode);
  const [duration, setDuration] = useState(searchDuration);
  const [dates, setDates] = useState(searchDates);

  const [selectedCheckInDay, setSelectedCheckInDay] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);

  const [selectedCheckInHour, setSelectedCheckInHour] = useState(
    new Date().getHours() + 1
  );

  const [selectedRentHours, setSelectedRentHours] = useState(3);

  const calculateDuration = () => {
    let calculatedDuration = 0;

    if (dateMode === "hour") {
      calculatedDuration = selectedRentHours / 24;
    } else if (dateMode === "day" || dateMode === "month") {
      const { startDate, endDate } = dates[0];
      const timeDiff = endDate.getTime() - startDate.getTime();
      calculatedDuration = timeDiff / (1000 * 60 * 60 * 24);
    }
    if (availableHours.length === 0) {
      calculatedDuration = 0;
    }
    setDuration(calculatedDuration);
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

  // Lấy tất cả các ngày trong khoảng thời gian đặt phòng
  const alldates = getDatesAndHoursInRange(
    dates[0].startDate,
    dates[0].endDate
  );

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
  // Kiểm tra xem phòng có sẵn không
  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };
  // Chọn phòng
  const handleSelect = async (roomId) => {
    const isSelected = selectedRoom === roomId;
    // Cập nhật state selectedItem khi có phòng được chọn
    if (!isSelected) {
      const selectedItemData = data.find((item) =>
        item.roomNumbers.some((roomNumber) => roomNumber._id === roomId)
      );
      setSelectedItem(selectedItemData);
    }
    setSelectedRoom(isSelected ? null : roomId);
  };

  // Tính tổng tiền
  const calculateTotalPrice = () => {
    if (selectedItem && duration) {
      const basePrice =
        dateMode === "hour"
          ? selectedItem.price * 1.2
          : dateMode === "month"
          ? selectedItem.price * 0.9
          : selectedItem.price;

      return Math.floor(basePrice * duration);
    }
    return 0;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [selectedItem, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getRoomNumber = async () => {
      try {
        if (selectedItem && selectedRoom) {
          const response = await axios.get(
            `/rooms/${selectedItem._id}/roomNumbers/${selectedRoom}`
          );
          const fetchedRoomData = response.data;
          setRoomData(fetchedRoomData);
        } else {
          // Nếu không có selectedRoom được chọn, đặt roomData thành null
          setRoomData(null);
        }
      } catch (error) {
        console.error("Error fetching room number data:", error);
      }
    };
    // Chỉ gọi hàm getRoomNumber khi selectedItem có giá trị
    if (selectedItem) {
      getRoomNumber();
    }
  }, [selectedItem, selectedRoom]);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      if (selectedRoom.length === 0) {
        // Hiển thị thông báo và không thực hiện hành động tiếp theo
        alert("Vui lòng chọn phòng trước khi thanh toán.");
        return;
      }

      if (totalPrice === 0) {
        // Hiển thị thông báo và không thực hiện hành động tiếp theo
        alert("Vui lòng chọn thời gian trước khi thanh toán.");
        return;
      }
      if (roomData && roomData.unavailableDates) {
        if (
          roomData.unavailableDates.some((date) =>
            alldates.includes(new Date(date).getTime())
          )
        ) {
          alert(
            "Không thể thanh toán vì ngày chọn đã được thuê, vui lòng chọn lại ngày."
          );
          return;
        }
      } else {
        // Xử lý trường hợp roomData hoặc roomData.unavailableDates không tồn tại
        alert("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
        return;
      }

      const orderData = {
        userId: user._id,
        roomId: selectedRoom,
        roomNumber: roomData.number,
        price: totalPrice,
        duration: duration,
        dateMode: dateMode,
        type: selectedItem.type,
        location: spaceData.name,
        startDate: dates[0].startDate,
        endDate: dates[0].endDate,
      };

      // Gửi request POST sử dụng Axios
      const response = await axios.post("/order", orderData);
      // Lấy ID của đơn hàng từ response
      const newOrderData = response.data;

      navigate("/payment", {
        state: {
          orderData: newOrderData,
          spaceId: spaceId,
        },
      });
    } catch (err) {}
  };

  const currentHour = new Date().getHours();
  const isToday =
    selectedCheckInDay[0].startDate.toDateString() ===
    new Date().toDateString();
  const disabledDatesArray =
    roomData && roomData.unavailableDates ? roomData.unavailableDates : [];

  const isDisabledHour = (hour, selectedCheckInDay, disabledDatesArray) => {
    const isDisabledHour = disabledDatesArray.some((disabledHour) => {
      const disabledDate = new Date(disabledHour);
      return (
        disabledDate.toDateString() ===
          selectedCheckInDay[0].startDate.toDateString() &&
        disabledDate.getHours() === hour
      );
    });

    return (!isToday || hour >= currentHour + 1) && !isDisabledHour;
  };

  const checkInHoursArray = Array.from({ length: 24 }, (_, i) => i).filter(
    (hour) => {
      return isDisabledHour(hour, selectedCheckInDay, disabledDatesArray);
    }
  );

  const rentHoursArray = [3, 4, 5, 6, 7, 8];
  const getAvailableHours = (dates, rentHoursArray, roomData) => {
    if (
      !dates[0] ||
      !dates[0].startDate ||
      !roomData ||
      !roomData.unavailableDates
    ) {
      return rentHoursArray;
    }

    const startDate = new Date(dates[0].startDate);
    const availableHours = rentHoursArray.filter((hour) => {
      const dateWithHour = addHours(startDate, hour);
      return !roomData.unavailableDates.some(
        (date) => dateWithHour.getTime() === new Date(date).getTime()
      );
    });

    return availableHours;
  };
  const availableHours = getAvailableHours(dates, rentHoursArray, roomData);
  const disabledDates =
    // dateMode === "hour"
    //   ? disabledDatesArray
    //       .map((dateString) => {
    //         const date = new Date(dateString);
    //         // Kiểm tra nếu disabledDatesArray có đủ 24 giờ của ngày đó
    //         const hasAllHours = Array.from({ length: 24 }, (_, i) => i).every(
    //           (hour) => {
    //             const checkDate = new Date(date);
    //             checkDate.setHours(hour);
    //             return disabledDatesArray.some((disabledDateString) => {
    //               const disabledDate = new Date(disabledDateString);
    //               return checkDate.getTime() === disabledDate.getTime();
    //             });
    //           }
    //         );
    //         if (hasAllHours) {
    //           return date;
    //         }
    //         return null; // Nếu không có đủ 24 giờ, trả về null để bỏ qua ngày này
    //       })
    //       .filter((date) => date !== null) :
    dateMode === "day" || dateMode === "month"
      ? disabledDatesArray
          .filter((disabledDateString) => {
            const disabledDate = new Date(disabledDateString);
            // Bỏ qua nếu có một giờ là 00 và chỉ có một phần tử của ngày đó
            return !disabledDatesArray.some(
              (otherDisabledDateString) =>
                new Date(otherDisabledDateString).getDate() ===
                  disabledDate.getDate() &&
                new Date(otherDisabledDateString).getHours() === 0 &&
                otherDisabledDateString !== disabledDateString
            );
          })
          .map((dateString) => new Date(dateString))
      : [];
  useEffect(() => {
    calculateDuration();
  }, [dateMode, selectedRentHours, dates]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="reserve">
      <div className="reContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />

        <div>
          <div className="list-buttons">
            <label style={{ fontSize: "15px" }}>Chọn hình thức thuê</label>
            <div className="list-buttons-item" style={{ marginTop: "8px" }}>
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
                    <div className="rsDate">
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
                        // disabledDates={disabledDates}
                      />
                      <div>
                        <div className="list-select-hour">
                          <p>Giờ nhận phòng</p>
                          <select
                            value={selectedCheckInHour}
                            onChange={(e) => handleTimeChange(e, "checkInHour")}
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
                            // defaultValue={availableHours[0]}
                          >
                            {availableHours.map((hour) => (
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
                    className="rsDate"
                    minDate={new Date()}
                    dateDisplayFormat="dd/MM/yyyy"
                    locale={vi}
                    disabledDates={disabledDates}
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
                    onChange={(date) =>
                      setDates([
                        { startDate: date, endDate: addMonths(date, 1) },
                      ])
                    }
                    minDate={new Date()}
                    className="rsDate"
                    locale={vi}
                    date={dates[0].startDate}
                    disabledDates={disabledDates}
                  />
                )}
              </>
            )}
          </div>
          <hr />
          <div className="rItem-container">
            <label>Lựa chọn loại phòng:</label>
            {data.map((item) => (
              <div className="rItem" key={item._id}>
                <div className="rItem-select">
                  <div className="rItemInfo">
                    <div>{item.type}</div>
                  </div>
                  <div className="rSelectRooms">
                    {item.roomNumbers.map((roomNumber) => (
                      <div className="room" key={roomNumber._id}>
                        <button
                          onClick={() => handleSelect(roomNumber._id)}
                          disabled={!isAvailable(roomNumber)}
                          className={`${
                            selectedRoom &&
                            selectedRoom.includes(roomNumber._id)
                              ? "selected"
                              : ""
                          } ${
                            !isAvailable(roomNumber) ? "disabled-button" : ""
                          }`}
                        >
                          {roomNumber.number}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <hr />
            <div className="rDuration">
              Tổng số {dateMode === "hour" ? "giờ" : "ngày"} thuê:{" "}
              {duration < 1 ? duration * 24 : duration}{" "}
              {dateMode === "hour" ? "giờ" : "ngày"}
            </div>
            <div className="rPrice">
              Tổng tiền:{" "}
              <span onChange={setTotalPrice}>
                {totalPrice.toLocaleString("vi-VN")}
              </span>{" "}
              VND
            </div>
          </div>
        </div>
        <button onClick={handleClick} className="rsButton">
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Reserve;
