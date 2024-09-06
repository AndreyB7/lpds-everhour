import { ProjectEverhourAPI, ProjectToRender } from "../../types/types";
import { getTimeString, getWorkingDays } from "../helpers/time";
import { slackMessage } from "./slackNotifierService";

const getProjectsData = async () => {
  const response = await fetch('https://app.everhour.com/api/projects', {
    headers: {
      'X-Api-Key': process.env.EVERHOUR_API_KEY || '',
    }
  })

  if (!response.ok) {
    console.error(await response.json());
    throw new Error('Failed to fetch projects');
  }

  const projectsAll: ProjectEverhourAPI[] = await response.json();
  const projects: ProjectToRender[] = projectsAll.filter(p => p.status === 'open' && p.budget).map(p => ({
    id: p.id,
    name: p.name,
    budget: p.budget.budget,
    progress: p.budget.progress,
    period: p.budget.period,
  }));

  return projects
}

const getSlackText = (project: ProjectToRender) => {

  const projectPercentUsed = Math.floor((project.progress / project.budget) * 100)
  const workingDays = getWorkingDays()
  const workingDaysPassedPercent = +Math.floor(workingDays.passed.length / workingDays.total.length * 100)
  const projected = Math.floor((workingDaysPassedPercent > 0 ? projectPercentUsed / workingDaysPassedPercent : 0) * project.budget)

  let slackText =
    `*${ project.name } Project Update*` +
    `\n ${ project.period.charAt(0).toUpperCase() + project.period.slice(1) } hours used / total: ${ getTimeString(project.progress) } / ${ getTimeString(project.budget) } (${ projectPercentUsed }%)`

  if (project.period === 'monthly') {
    slackText += `\n${ workingDaysPassedPercent }% of Month working days passed`
    // if (workingDaysPassedPercent > 33 || projectPercentUsed > 50) {
    slackText += `\nProjected hours at current rate: ${ getTimeString(projected) }`
    // }
  }

  return slackText
}

export const runThresholdNotifier = async () => {
  try {
    const projects = await getProjectsData()

    await Promise.all(
      projects.map(async (p) => {
        const slackText = getSlackText(p)
        await slackMessage(
          process.env.NODE_ENV === 'development' ?
            process.env.SLACK_CHAT_WEBHOOK_DEV! :
            process.env.SLACK_CHAT_WEBHOOK_PROD!,
          slackText)
      })
    )
  } catch (e: any) {
    console.log('threshold service error: ', e.message)
  }
}
