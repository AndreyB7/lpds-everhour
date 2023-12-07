export const getTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds / 60) % 60);
  // const seconds = seconds % 60;

  return hours + 'h ' + minutes + 'm';
}
