export const getTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds / 60) % 60);
  // const seconds = seconds % 60;

  return `${hours != 0 ? (hours + 'h ') : ''}${minutes}m`;
}
export const getMonthCode = (date:Date): string => {
  return `${ date.getFullYear() }-${ String(date.getMonth() + 1).padStart(2, '0') }`
}

export const getWorkingDays = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // holidays by month
  const holidays = getHolidays();

  const isWorkingDay = !holidays[month].includes(currentDate.getDate())
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

  return { total, ahead, passed, isWorkingDay }
}

export const getHolidays = () => {
  return [[1,15], [19], [], [], [27], [19], [4], [], [2], [14], [11,28,29], [22,23,24,25,26,27,28,29,30,31]];
}