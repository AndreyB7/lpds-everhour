export const getWorkingDays = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // holidays by month
  const holidays = getHolidays();

  const total = []
  const ahead = []
  const passed = []
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    if (holidays[month].includes(date.getDate())) {
      continue;
    }
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      total.push(date.getDate())
      if (date.getDate() >= currentDate.getDate()) {
        ahead.push(date.getDate())
      }
      if (date.getDate() < currentDate.getDate()) {
        passed.push(date.getDate())
      }
    }
  }

  return { total, ahead, passed }
}

export const getHolidays = () => {
  return [[1,15], [19], [], [], [27], [19], [4], [], [2], [14], [11,28,29], [22,25,26,27,28,29]];
}