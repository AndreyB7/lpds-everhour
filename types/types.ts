export type EverhourData = {
  time: {
    schema: []
    data: []
  },
  tasks: {
    schema: []
    data: []
  }
}

export type EverhourProjectData = {
  time: {
    [key:string]:string
  }
  tasks: {
    [key:string]:string
  }
}

export type EverhourRequestOptions = {
  period: string[];
  users: null;
  projects: string[];
  filters: never[];
  propagateSubtasks: boolean;
  propagateSubtasksTotals: boolean;
  tasksWithEstimate: boolean;
  loadParentTasks: boolean;
}

export type tProject = {
  shortName: string;
  everhourId: string;
  fullLimit: number;
  emailNotify: string;
  slackChatWebHook: string;
}

export type tParameters = {
  projects: {[key: string]: tProject}
}

export type tMonitoring = {
  timeTotal: string;
  fullLimit: string;
  percent: string;
  time: string;
}