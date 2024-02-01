import { getProjectsParams } from "../db/parametersDB";
import { getMonthCode, getWorkingDays } from "../helpers/time";
import { tMonitoring, tProject } from "../types/types";
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

  const percentHoursUsed = (timeTotal / projectParams.fullLimit * 100).toFixed(0);

  return {
    shortName: projectParams.shortName,
    timeTotal: Math.floor(timeTotal / 3600),
    fullLimit: Math.floor(projectParams.fullLimit / 3600),
    percent: percentHoursUsed,
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

const tempNamesDict: { [key: string]: string } = {
  'COA': 'Coalesce',
  'SVT': 'Saviynt',
  'SWH': 'Sourcewhale'
};

export const sendMonitoringInfo = async (monitoringData: tMonitoring[]) => {
  const projectsParams = await getProjectsParams()
  const workingDays = getWorkingDays()
  const workingDaysPassedPercent = Math.floor(workingDays.passed.length / workingDays.total.length * 100);
  const template = fs.readFileSync(path.join(__dirname, "../views/email.ejs")).toString()
  Promise.all(
    monitoringData.map(
      async (pm) => {
        const html = ejs.render(template, pm)
        const project = projectsParams.find(p => p.shortName === pm.shortName)
        const projected = (+workingDaysPassedPercent > 0 ? +pm.percent / +workingDaysPassedPercent : 0) * pm.fullLimit
        if (!project) return
        sendMail(project.emailNotify, `Daily ${ project.shortName } Report`, html)
        let slackText =
          `*${ tempNamesDict[pm.shortName] ?? pm.shortName } Monthly Retainer Update*` +
          `\nHours used / retained: ${ pm.timeTotal } / ${ pm.fullLimit }` +
          `\n% of hours used: ${ pm.percent }%` +
          `\n% of working days passed: ${ workingDaysPassedPercent }%`

        if (workingDaysPassedPercent > 33 || +pm.percent > 50) {
          slackText += `\nProjected hours at current rate: ${ projected }`
        }

        await slackMessage(
          project.slackChatWebHook,
          slackText
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