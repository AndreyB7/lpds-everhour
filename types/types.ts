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

export type tParameters = {
    fullLimit: number;
    emailNotify: string;
    fullLimitString?: string;
}