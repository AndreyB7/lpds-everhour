import { sendMail } from "./mailerService";
import { getTime } from "./everhourDBService";
import { getParametersData } from "./parametersDBService";
import { getTimeString } from "../helpers/time";

export const runMonitoring = async () => {
  const parameters = await getParametersData();
  const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`;
  const timeData = JSON.parse((await getTime()).data()?.[currentMonth]);
  let timeTotal = 0;
  if (timeData) {
    timeData.forEach((task: any) => timeTotal += task[4]);
  }
  sendMail('<h2>Everhour task report</h2>' +
    '<div>Project: ' + 'COA' + '</div>' +
    '<div>Tasks Time: ' + getTimeString(timeTotal) + '</div>' +
    '<div>Time Limit: ' + getTimeString(parameters.fullLimit) + '</div>' +
    '<div>Persent: ' + (timeTotal/parameters.fullLimit)*100 + '%' + '</div>' +
    '<hr>' +
    '<div>Date: ' + (new Date()).toISOString() + '</div>' +
    '');
}