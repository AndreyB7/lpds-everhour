import { getWorkingDays } from "../helpers/time";
import { Project, tMonitoring } from "../../types/types";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { sendMail } from "./mailerService";
import { slackMessage } from "./slackNotifierService";
import { everhourDataRefresh } from "./refreshService";
import { getProjectLastUpdate, setLastMonitoring } from "../db/logsDB";
import { getProjects } from "../db/projectDB";
import { getProjectData } from "./projectService";

export const runProjectMonitoring = async (project: Project): Promise<tMonitoring> => {
  const needTaskTree = false;
  const projectData= await getProjectData(project.slug, needTaskTree)
  const timeTotal = projectData.timeTotalSeconds

  const percentHoursUsed = (timeTotal / (project.fullLimit * 3600) * 100).toFixed(0);

  return {
    slug: project.slug,
    type: project.type,
    fullName: project.fullName,
    timeTotal: Math.round(timeTotal / 3600),
    fullLimit: +project.fullLimit,
    percent: percentHoursUsed,
    time: (await getProjectLastUpdate(project.slug)).timeString,
  }
}

export const runMonitoring = async () => {
  const projects = await getProjects()
  let monitoringData: tMonitoring[] = []
  for (const p of projects) {
    if (p.everhourId) {
      monitoringData.push(await runProjectMonitoring(p))
    }
  }
  await setLastMonitoring(monitoringData)
  return monitoringData
}

export const sendMonitoringInfo = async (monitoringData: tMonitoring[]) => {
  const projects = await getProjects()
  const workingDays = getWorkingDays()
  const workingDaysPassedPercent = Math.floor(workingDays.passed.length / workingDays.total.length * 100);
  const template = fs.readFileSync(path.join(__dirname, "../views/email.ejs")).toString()
  Promise.all(
    monitoringData.map(
      async (pm) => {
        const html = ejs.render(template, pm)
        const project = projects.find(p => p.slug === pm.slug)
        const projected = Math.floor((+workingDaysPassedPercent > 0 ? +pm.percent / +workingDaysPassedPercent : 0) * pm.fullLimit)
        if (!project) return

        // mail
        if (project.emailNotify) {
          sendMail(project.emailNotify, `Daily ${ project.fullName } Report`, html)
        }

        // slack
        let slackText =
          `*${ pm.fullName } Monthly ${pm.type} Update*` +
          `\nHours used / retained: ${ pm.timeTotal } / ${ pm.fullLimit }` +
          `\n% of hours used: ${ pm.percent }%` +
          `\n% of working days passed: ${ workingDaysPassedPercent }%`

        if (workingDaysPassedPercent > 33 || +pm.percent > 50) {
          slackText += `\nProjected hours at current rate: ${ projected }`
        }

        if (project.slackChatWebHook) {
          await slackMessage(
            project.slackChatWebHook,
            slackText
          )
        }
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