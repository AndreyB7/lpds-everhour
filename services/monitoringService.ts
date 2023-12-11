import { getProjectsParams } from "../db/parametersDB";
import { getTimeString } from "../helpers/time";
import { tMonitoring, tProject } from "../types/types";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { sendMail } from "./mailerService";
import { slackMessage } from "./slackNotifierService";
import { getEHData } from "../db/everhourDB";

export const runProjectMonitoring = async (projectParams: tProject):Promise<tMonitoring> => {
  const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`
  const timeData = JSON.parse((await getEHData(projectParams.shortName)).data()?.time[currentMonth])
  let timeTotal = 0
  if (timeData) {
    timeData.forEach((task: any) => timeTotal += task[4])
  }

  return {
    timeTotal: getTimeString(timeTotal),
    fullLimit: getTimeString(projectParams.fullLimit),
    percent: (timeTotal / projectParams.fullLimit * 100).toFixed(1) + '%',
    time: (new Date()).toLocaleString(),
  }
}

export const runMonitoring = async () => {
  const projectsParams = await getProjectsParams()
  let monitoringData: { [key: string]: tMonitoring } = {};
  for (const projectShortName in projectsParams) {
    monitoringData[projectShortName] = await runProjectMonitoring(projectsParams[projectShortName])
  }
  const template = fs.readFileSync(path.join(__dirname, "../views/email.ejs")).toString()
  Promise.all(
    Object.keys(monitoringData).map(
      async (projectShortName) => {
        const html = ejs.render(template, monitoringData[projectShortName])
        sendMail('0129507@gmail.com', html)
        const projectData = monitoringData[projectShortName]
        await slackMessage(
          projectsParams[projectShortName].slackChatWebHook,
          `${projectShortName} time limit usage: ${ projectData.percent } (${ projectData.timeTotal } from ${ projectData.fullLimit })`
        )
      })
  ).catch(e => {
    console.error(e)
  })
}