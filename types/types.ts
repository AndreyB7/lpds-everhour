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
    [key: string]: string
  }
  tasks: {
    [key: string]: string
  }
}

export type EverhourTask = {
  id: string,
  parent: string,
  type: string,
  name: string,
  url: string,
  status: string,
  labels: [],
  createdAt: string,
  dueOn: string,
  startOn: string,
  iteration: string,
  points: number,
  projects: string[],
  number: number,
  estimate: number,
  time: {},
  attributes: null,
  metrics: null,
  unbillable: boolean,
  completed: boolean,
  completedAt: string,
  users: string[],
  // modified
  children?:EverhourTask[]
  items?:EverhourTask[]
  timeSum?: string
  groupTimeSum?: string
}

export type EverhourTasks = EverhourTask[]

export type EverhourTime = {
  id: string,
  task: string,
  user: string[],
  date: string,
  time: number,
  timerTime: number,
  comment: string,
  rate: number,
  isBillable: boolean,
  costRate: string,
  isInvoiced: boolean,
}

export type EverhourTimeByTask = {
  [id:string]: EverhourTime[]
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

export type initProject = {
  id?: string;
  shortName: string;
  fullName: string;
  slug: string;
  type: 'Retainer' | 'Project';
}

export type Project = initProject & {
  id: string;
  everhourId: string;
  fullLimit: number;
  emailNotify: string;
  slackChatWebHook: string;
}

export type tProject = {
  shortName: string;
  everhourId: string;
  fullLimit: number;
  emailNotify: string;
  slackChatWebHook: string;
}

export type projectFormState = {
  message: string,
  errors?: {
    [K in keyof Project]?: string[]
  }
}

export type createProjectFormState = {
  message: string,
  errors?: {
    [K in keyof Project]?: string[]
  }
}

export type tMonitoring = {
  shortName: string;
  timeTotal: number;
  fullLimit: number;
  percent: string;
  time: string;
}

export type TeamMember = {
  name: string,
  status: string,
  type: string
}