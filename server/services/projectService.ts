import { EverhourTask, EverhourTasks, EverhourTime, EverhourTimeByTask } from "../types/types";
import { getMonthCode, getTimeString } from "../helpers/time";
import { getProjectEverhourData, getTasksSchema, getTimeSchema } from "../db/everhourDB";
import { getProjectLastUpdate } from "../db/logsDB";

const getTaskTotalTime = (taskTimeItems: EverhourTime[]) => {
  return taskTimeItems.map(tti => tti.time).reduce((s, time) => s + time);
}

export function buildTree(tasks: EverhourTasks, taskTimeDict: EverhourTimeByTask, parentId: string | null = null) {
  const branch: EverhourTask[] = [];

  tasks.forEach((task, idx) => {
    const id = task.id;
    if (task.parent == parentId) {
      const children = buildTree(tasks, taskTimeDict, id);
      if (children.length > 0) {
        task.children = children;
        const taskTotalTime = taskTimeDict[task.id] ? getTaskTotalTime(taskTimeDict[task.id]) : 0;
        task.timeSum = getTimeString(taskTotalTime);
        const childrenTimeSum = children
          .map((task) =>
            taskTimeDict[task.id] ? getTaskTotalTime(taskTimeDict[task.id]) : 0
          )
          .reduce((acc, curr) => acc + curr, 0);
        task.groupTimeSum = getTimeString(childrenTimeSum
          + (taskTimeDict[id] ? getTaskTotalTime(taskTimeDict[task.id]) : 0)
        )
        task.timeSum = getTimeString(taskTimeDict[id] ? getTaskTotalTime(taskTimeDict[task.id]) : 0)
      } else {
        task.timeSum = getTimeString(taskTimeDict[id] ? getTaskTotalTime(taskTimeDict[task.id]) : 0)
      }
      branch.push(task);
      delete tasks[idx];
    }
  })
  return branch;
}

export const convertDataToObject = <T>(data: string[], schema: string[]): T => {
  const convertedToObj = data.map(task => {
    const row: any = {}
    schema.forEach((key, idx) => {
      row[key] = task[idx]
    })
    return row
  })
  return convertedToObj as T
}

export const createTaskTimeDict = <T>(data: string[], schema: string[]): T => {
  const dict: any = {}
  data.forEach(task => {
    const row: any = {}
    schema.forEach((key, idx) => {
      row[key] = task[idx]
    })
    return dict[task[1]] ? dict[task[1]].push(row) : dict[task[1]] = [row]
  })

  return dict
}

export const getProjectData = async (projectShortName: string) => {
  const currentMonth = getMonthCode(new Date())
  const timeSchema = await getTimeSchema()
  const tasksSchema = await getTasksSchema()
  const projectData = await getProjectEverhourData(projectShortName)
  const taskDataRaw: string[] = projectData.tasks[currentMonth] ? JSON.parse(projectData.tasks[currentMonth]) : []
  const taskData = convertDataToObject<EverhourTasks>(taskDataRaw, tasksSchema)
  const timeDataRaw = projectData.time[currentMonth] ? JSON.parse(projectData.time[currentMonth]) : []
  const timeData = createTaskTimeDict<EverhourTimeByTask>(timeDataRaw, timeSchema)
  let timeTotal = 0
  Object.values(timeData).forEach((taskTimes) => taskTimes.forEach(task => timeTotal += task.time))
  return {
    lastUpdate: await getProjectLastUpdate(projectShortName),
    timeTotal: timeTotal > 0 ? getTimeString(timeTotal) : 'ND',
    tasks: buildTree(taskData, timeData),
  }
}