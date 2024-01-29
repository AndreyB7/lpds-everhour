import { getProjectsParams } from "../db/parametersDB";
import { getMonthCode, getTimeString, getWorkingDays } from "../helpers/time";
import { tMonitoring, tProject } from "../../types/types";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { sendMail } from "./mailerService";
import { slackMessage } from "./slackNotifierService";
import { getProjectEverhourData } from "../db/everhourDB";
import { everhourDataRefresh } from "./refreshService";
import { getProjectLastUpdate, setLastMonitoring } from "../db/logsDB";

export const runProjectMonitoring = async (projectParams: tProject): Promise<tMonitoring> => {
  const currentMonthCode = getMonthCode(new Date());
  const timeData = JSON.parse((await getProjectEverhourData(projectParams.shortName)).time[currentMonthCode])
  let timeTotal = 0
  if (timeData) {
    timeData.forEach((task: any) => timeTotal += task[4])
  }

  return {
    shortName: projectParams.shortName,
    timeTotal: getTimeString(timeTotal),
    fullLimit: getTimeString(projectParams.fullLimit),
    percent: (timeTotal / projectParams.fullLimit * 100).toFixed(1) + '%',
    time: (await getProjectLastUpdate(projectParams.shortName)).timeString,
  }
}

export const runMonitoring = async () => {
  const projectsParams = await getProjectsParams()
  let monitoringData: tMonitoring[] = []
  for (const p of projectsParams) {
    monitoringData.push(await runProjectMonitoring(p))
  }
  setLastMonitoring(monitoringData)
  return monitoringData
}

export const sendMonitoringInfo = async (monitoringData: tMonitoring[]) => {
  const projectsParams = await getProjectsParams()
  const workingDays = getWorkingDays()
  const template = fs.readFileSync(path.join(__dirname, "../views/email.ejs")).toString()
  Promise.all(
    monitoringData.map(
      async (pm) => {
        const html = ejs.render(template, pm)
        const project = projectsParams.find(p => p.shortName === pm.shortName)
        if (!project) return
        sendMail(project.emailNotify, `Daily ${ project.shortName } Report`, html)
        await slackMessage(
          project.slackChatWebHook,
          `${ pm.shortName } time limit usage: ${ pm.percent } (${ pm.timeTotal } from ${ pm.fullLimit })` +
          `\n${ workingDays.ahead.length } from ${ workingDays.total.length } working days ahead.` +
          `\nPassed ${ (workingDays.passed.length / workingDays.total.length * 100).toFixed(1) }% of month.`
        )
      })
  ).catch(e => {
    console.error(e)
  })
}

export const scheduledMonitoring = async () => {
  const { isWorkingDay } = getWorkingDays()
  if (isWorkingDay) {
    await everhourDataRefresh()
    const monitoringData = await runMonitoring()
    await sendMonitoringInfo(monitoringData)
  }
}