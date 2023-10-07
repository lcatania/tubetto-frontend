export type PipelineLog = {
    content: string;
    status: RunStatus;
    executedAt: string;
    executionTime: number | null;
}

export type RunStatus = 'FAILED' | 'WARNING' | 'SUCCESS';