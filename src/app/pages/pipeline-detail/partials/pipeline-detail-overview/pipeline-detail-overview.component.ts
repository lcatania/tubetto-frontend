import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { IconsModule } from 'src/app/icons/icons.module';
import { Pipeline, PipelineRun, PipelineStats } from 'src/app/models/pipeline';
import { differenceInHours, format, formatDistance, formatDistanceToNowStrict, formatDuration, intervalToDuration, parseISO } from 'date-fns';
import { DatePipe, NgIf } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { calculateNextExecution } from 'src/app/utils/execution-utils';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { TooltipDirective } from 'src/app/directives/tooltip/tooltip.directive';

type ChartSelectionProp = 'QUERY' | 'EXECUTION' | 'PROCESSING' | 'FILESIZE';

@Component({
    standalone: true,
    selector: 'app-pipeline-detail-overview',
    templateUrl: 'pipeline-detail-overview.component.html',
    imports: [
        NgIf,
        TooltipDirective,
        IconsModule,
        DatePipe,
    ]
})

export class PipelineDetailOverviewComponent implements OnInit, OnDestroy {


    pipelineStats: PipelineStats = {
        avgExecutionTime: 0,
        avgFilesize: 0,
        avgProcessTime: 0,
        avgQueryTime: 0,
        nextExecution: new Date().toISOString(),
    }
    pipelineRuns: PipelineRun[] = []
    nextExecutionInterval!: any
    refreshTimeout!: any;
    nextExecutionDistance!: string;
    chart!: Chart;
    selectedChartProp: ChartSelectionProp = 'EXECUTION';

    mappingPropTypeToName: { [prop in ChartSelectionProp]: keyof Omit<PipelineRun, 'executedAt' | 'status'> } = {
        EXECUTION: 'executionTime',
        FILESIZE: 'fileSize',
        PROCESSING: 'processTime',
        QUERY: 'queryTime'
    }

    routeSubscription!: Subscription;

    private dataService: DataService;
    private activatedRoute: ActivatedRoute;

    constructor() {
        this.dataService = inject(DataService);
        this.activatedRoute = inject(ActivatedRoute);
    }

    ngOnInit(): void {
        this.routeSubscription = this.activatedRoute.params.subscribe(async (params) => {
            this.pipelineStats = await lastValueFrom(this.dataService.getPipelineStats(params['id']));
            this.pipelineRuns = await lastValueFrom(this.dataService.getPipelineRuns(params['id'], 'ALL'));
            this.nextExecutionDistance = calculateNextExecution(this.pipelineStats.nextExecution);
            this.showExecutionTime(params['id'])
            this.createChart();
        });
    }

    showExecutionTime(id: string) {
        this.nextExecutionInterval = setInterval(() => {
            this.nextExecutionDistance = calculateNextExecution(this.pipelineStats.nextExecution);
            if (this.nextExecutionDistance === '00:00:00') {
                clearInterval(this.nextExecutionInterval)
                this.nextExecutionDistance = 'Calculating...'
                this.refreshTimeout = setTimeout(() => {
                    lastValueFrom(this.dataService.getPipelineStats(id)).then((newPipelineStats) => {
                        this.pipelineStats = newPipelineStats;
                        this.showExecutionTime(id)
                        clearTimeout(this.refreshTimeout)
                    });
                }, 1000)
            }
        }, 1000)
    }

    ngOnDestroy(): void {
        if (this.nextExecutionInterval)
            clearInterval(this.nextExecutionInterval);
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
        if (this.refreshTimeout)
            clearTimeout(this.refreshTimeout)
    }

    createChart() {
        this.chart = new Chart('myChart', {
            type: 'line',
            data: {
                labels: this.pipelineRuns.map(r => format(parseISO(r.executedAt), 'yyyy-MM-dd HH:mm:ss')),
                datasets: [
                    {
                        label: "Total execution Time (ms)",
                        data: this.pipelineRuns.map(r => r.executionTime),
                        backgroundColor: '#3730a3',
                        borderColor: '#6366f1',
                        hoverBorderColor: '#818cf8',
                        hoverBackgroundColor: '#312e81',
                    }
                ],
            },
            options: {
                aspectRatio: 2.5,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    selectChartProp(prop: ChartSelectionProp) {
        let updatedDataSet: {
            data: (number | null)[],
            label: string
        } = { data: [], label: '' }
        switch (prop) {
            case 'EXECUTION':
                updatedDataSet.data = this.pipelineRuns.map(r => r.executionTime)
                updatedDataSet.label = 'Execution time(ms)'
                break;
            case 'FILESIZE':
                const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
                const avgFileSize = ((this.pipelineRuns.map(r => r.fileSize).filter(r => r !== null) as number[]).reduce((prev: number, curr: number) => prev + curr)) / this.pipelineRuns.filter(r => r.fileSize !== null).length
                const exponent = Math.floor((Math.log(avgFileSize) / Math.log(1024)));
                updatedDataSet.data = this.pipelineRuns.map(r => !r.fileSize ? null : Math.round((r.fileSize / Math.pow(1024, exponent)) * 100) / 100)
                updatedDataSet.label = `File size(${units[exponent]})`
                break;
            case 'PROCESSING':
                updatedDataSet.data = this.pipelineRuns.map(r => r.processTime)
                updatedDataSet.label = 'Processing time(ms)'
                break;
            case 'QUERY':
                updatedDataSet.data = this.pipelineRuns.map(r => r.queryTime)
                updatedDataSet.label = 'Query time(ms)'
                break;
        }
        this.selectedChartProp = prop;
        this.chart.data.datasets[0].data = updatedDataSet.data;
        this.chart.data.datasets[0].label = updatedDataSet.label;
        this.chart.update();
    }

    builAvgTooltip() {
        return `
            <div class="flex gap-x-2 p-1">
                <div class="flex flex-col ">
                    <span>Avg. querying time:</span> 
                    <span>Avg. processing time:</span>
                    <span>Avg. execution time:</span>
                    <span>Avg. file size:</span>
                </div>
                <div class="flex flex-col ">
                     <b>${this.pipelineStats.avgQueryTime !== null ? this.pipelineStats.avgQueryTime + ' ms' : 'There is no data yet :('}</b> 
                     <b>${this.pipelineStats.avgProcessTime !== null ? this.pipelineStats.avgProcessTime + ' ms' : 'There is no data yet :('} </b>
                     <b>${this.pipelineStats.avgExecutionTime !== null ? this.pipelineStats.avgExecutionTime + ' ms' : 'There is no data yet :('} </b>
                     <b>${this.pipelineStats.avgFilesize !== null ? this.pipelineStats.avgFilesize : 'There is no data yet :('} </b>
                </div>
            </div>
            `
    }

}