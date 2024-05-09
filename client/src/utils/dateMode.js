const getDisplayDateMode = (dateMode) => {
  switch (dateMode) {
    case "hour":
      return "giờ";
    case "day":
      return "ngày";
    case "month":
      return "tháng";
    default:
      return dateMode;
  }
};

export default getDisplayDateMode;
