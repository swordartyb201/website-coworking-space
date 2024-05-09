const getDatesAndHoursInRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startHour = new Date(startDate).getHours();
  const endHour = new Date(endDate).getHours();

  const datesAndHours = [];

  // Trường hợp 1: Nếu ngày của start = end
  if (start.toDateString() === end.toDateString()) {
    const date = new Date(start.getTime());

    // Lặp qua từng giờ trong ngày
    for (let hour = startHour; hour <= endHour; hour++) {
      const dateTime = new Date(date);
      dateTime.setHours(hour);
      datesAndHours.push(dateTime.getTime());
    }
  } else {
    // Trường hợp 2: Nếu ngày của end - start = 1
    if (end.getDate() - start.getDate() === 1) {
      // Bắt đầu lặp từ giờ của start tới 24 giờ
      for (let hour = startHour; hour <= 23; hour++) {
        const dateTime = new Date(start);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }
      // Bắt đầu lặp từ 1 cho tới giờ của end
      for (let hour = 0; hour <= endHour; hour++) {
        const dateTime = new Date(end);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }
    } else {
      // Trường hợp 3: Nếu ngày của end - 1 > start
      const date = new Date(start.getTime());

      // Lặp qua từng giờ từ giờ của start tới 24 giờ
      for (let hour = startHour; hour <= 23; hour++) {
        const dateTime = new Date(date);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }

      date.setDate(date.getDate() + 1);

      // Lặp lại từ 1 tới 24 giờ cho đến ngày end - 1
      while (date < end) {
        for (let hour = 0; hour <= 23; hour++) {
          const dateTime = new Date(date);
          dateTime.setHours(hour);
          datesAndHours.push(dateTime.getTime());
        }
        date.setDate(date.getDate() + 1);
      }

      // Lặp lại từ 1 tới giờ của end
      for (let hour = 0; hour <= endHour; hour++) {
        const dateTime = new Date(end);
        dateTime.setHours(hour);
        datesAndHours.push(dateTime.getTime());
      }
    }
  }

  return datesAndHours;
};

export default getDatesAndHoursInRange;
