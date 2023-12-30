import { EverhourTask, EverhourTasks, EverhourTime, EverhourTimeByTask } from "../types/types";
import { getTimeString } from "../helpers/time";

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