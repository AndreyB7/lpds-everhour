import { sendMail } from "./mailerService";
import { getTime } from "./everhourDBService";
import { getParametersData } from "./parametersDBService";
import { getTimeString } from "../helpers/time";
import ejs from 'ejs';
import path from "path";
import { slackMessage } from "./slackNotifierService";
import db from "../db/db";
import collections from "../db/collections";

export const runMonitoring = async () => {
  const parameters = await getParametersData();
  const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`;
  const timeData = JSON.parse((await getTime()).data()?.[currentMonth]);
  let timeTotal = 0;
  if (timeData) {
    timeData.forEach((task: any) => timeTotal += task[4]);
  }

  const data = {
    timeTotal: getTimeString(timeTotal),
    fullLimit: getTimeString(parameters.fullLimit),
    percent: (timeTotal / parameters.fullLimit * 100).toFixed(1) + '%',
    time: (new Date()).toLocaleString(),
  }

  ejs.renderFile(path.join(__dirname, "../views/email.ejs"), data, {}, function (err, html) {
    if (err) {
      db.collection(collections.log.name)
        .doc(collections.log.docs.error)
        .set({ [(new Date()).toISOString()]: `ejs html render error: ${ err?.message }` })
      return
    }
    sendMail(parameters.emailNotify, html);
    slackMessage(`COA time limit usage: ${ data.percent }`);
  });
}