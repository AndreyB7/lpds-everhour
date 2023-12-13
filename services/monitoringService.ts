import { getProjectsParams } from "../db/parametersDB";
import { getTimeString } from "../helpers/time";
import { tMonitoring, tProject } from "../types/types";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { sendMail } from "./mailerService";
import { slackMessage } from "./slackNotifierService";
import { getEHData } from "../db/everhourDB";
import { getWorkingDays } from "../helpers/days";

export const runProjectMonitoring = async (projectParams: tProject): Promise<tMonitoring> => {
  const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`
  const timeData = JSON.parse((await getEHData(projectParams.shortName)).time[currentMonth])
  let timeTotal = 0
  if (timeData) {
    timeData.forEach((task: any) => timeTotal += task[4])
  }

  return {
    timeTotal: getTimeString(timeTotal),
    fullLimit: getTimeString(projectParams.fullLimit),
    percent: (timeTotal / projectParams.fullLimit * 100).toFixed(1) + '%',
    time: (new Date()).toString(),
  }
}

export const runMonitoring = async () => {
  const projectsParams = await getProjectsParams()
  const workingDays = getWorkingDays()
  let monitoringData: { [key: string]: tMonitoring } = {}
  for (const projectShortName in projectsParams) {
    monitoringData[projectShortName] = await runProjectMonitoring(projectsParams[projectShortName])
  }
  const template = fs.readFileSync(path.join(__dirname, "../views/email.ejs")).toString()
  Promise.all(
    Object.keys(monitoringData).map(
      async (projectShortName) => {
        const html = ejs.render(template, monitoringData[projectShortName])
        sendMail(projectsParams[projectShortName].emailNotify, `Daily ${ projectShortName } Report`, html)
        const projectData = monitoringData[projectShortName]
        await slackMessage(
          projectsParams[projectShortName].slackChatWebHook,
          `${ projectShortName } time limit usage: ${ projectData.percent } (${ projectData.timeTotal } from ${ projectData.fullLimit })` +
          `\n${ workingDays.ahead.length } working days from ${ workingDays.total.length } ahead.` +
          `\nPassed ${ (workingDays.passed.length / workingDays.total.length * 100).toFixed(1) }% of month.`
        )
      })
  ).catch(e => {
    console.error(e)
  })
}