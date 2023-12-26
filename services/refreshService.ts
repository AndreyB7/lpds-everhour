import { getEverhourAPIData } from "../api/everhourAPI";
import { setProjectEverhourData } from "../db/everhourDB";
import { getProjectsParams } from "../db/parametersDB";
import { tProject } from "../types/types";

// defaults
const EHRequestParams = {
  period: ["2023-11-01", "2023-11-30"],
  users: null,
  projects: ['as:1203069369206516'],
  filters: [],
  propagateSubtasks: false,
  propagateSubtasksTotals: false,
  tasksWithEstimate: false,
  loadParentTasks: true
};
export const everhourDataRefresh = async () => {

  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth()
  const firstDay = new Date(y, m, 1)
  const lastDay = new Date(y, m + 1, 0)

  EHRequestParams.period = [
    `${ firstDay.getFullYear() }-${ firstDay.getMonth() + 1 }-0${ firstDay.getDate() }`,
    `${ lastDay.getFullYear() }-${ lastDay.getMonth() + 1 }-${ lastDay.getDate() }`
  ];

  const projects = await getProjectsParams()

  const timeKey = `${ firstDay.getFullYear() }-${ firstDay.getMonth() + 1 }`

  const refreshProject = async (project: tProject) => {
    if (!project) return
    EHRequestParams.projects = [project.everhourId]
    const data = await getEverhourAPIData(EHRequestParams)
    if (data) {
      await setProjectEverhourData(project.shortName, timeKey, data)
    }
  }

  await Promise.all(
    projects.map(p => refreshProject(p))
  )
}