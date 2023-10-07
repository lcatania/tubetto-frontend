import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Pipeline, PipelineRun, PipelineStats } from '../models/pipeline';
import { PipelineLog, RunStatus } from '../models/log';
import { CreatePipeline } from '../models/create-pipeline';

@Injectable({ providedIn: 'root' })
export class DataService {

    BASE_URL: string = environment.BASE_URL;

    constructor(private httpClient: HttpClient) { }

    getPipelines() {
        return this.httpClient.get<Pipeline[]>(`${this.BASE_URL}/pipeline`)
    }

    getSinglePipeline(id: string) {
        return this.httpClient.get<Pipeline>(`${this.BASE_URL}/pipeline/${id}`)
    }

    getPipelineStats(id: string) {
        return this.httpClient.get<PipelineStats>(`${this.BASE_URL}/pipeline/${id}/stats`)
    }

    getPipelineLogs(id: string, skip: number = 0, take: number = 10) {
        return this.httpClient.get<PipelineLog[]>(`${this.BASE_URL}/pipeline/${id}/logs?skip=${skip}&take=${take}`)
    }

    getPipelineRuns(id: string, status: 'ALL' | 'SUCCESS' | 'FAILED') {
        return this.httpClient.get<PipelineRun[]>(`${this.BASE_URL}/pipeline/${id}/runs?status=${status}`)
    }

    savePipeline(pipeline: CreatePipeline) {
        return this.httpClient.post<Pipeline>(`${this.BASE_URL}/pipeline`, pipeline)
    }

    deletePipeline(id:string){
        return this.httpClient.delete<void>(`${this.BASE_URL}/pipeline/${id}`)
    }

}