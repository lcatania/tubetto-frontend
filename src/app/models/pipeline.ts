import { RunStatus } from "./log";

export type Pipeline = {
    id: string;
    name: string;
    nextExecution: string;
}

export type PipelineRun = {
    executedAt: string;
    status: RunStatus;
    fileSize: number | null;
    processTime: number | null;
    queryTime: number | null;
    executionTime: number | null;
}

export type PipelineStats = {
    avgExecutionTime: number | null;
    avgQueryTime: number | null;
    avgProcessTime: number | null;
    avgFilesize: number | null;
    nextExecution: string;
}