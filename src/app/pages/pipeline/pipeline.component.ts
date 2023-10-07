import { DatePipe, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { TooltipDirective } from 'src/app/directives/tooltip/tooltip.directive';
import { IconsModule } from 'src/app/icons/icons.module';
import { Pipeline } from 'src/app/models/pipeline';
import { CreatePipelineComponent } from 'src/app/partials/create-pipeline/create-pipeline.component';
import { DataService } from 'src/app/services/data.service';
import { calculateNextExecution } from 'src/app/utils/execution-utils';

@Component({
    standalone: true,
    imports: [
        CreatePipelineComponent,
        TooltipDirective,
        DatePipe,
        IconsModule,
        NgFor
    ],
    selector: 'app-pipeline',
    templateUrl: 'pipeline.component.html'
})

export class PipelineComponent implements OnInit {

    pipelines: Pipeline[] = [];
    isCreatePipelineModalVisible: boolean = false;
    isRefreshing: boolean = false;
    hoveredNextExecutionDistance: string = 'Next execution: 00:00:00';
    hoveredNextExecutionInterval!: any;
    refreshTimeout!: any;

    private router: Router;
    private dataService: DataService;

    constructor() {
        this.router = inject(Router);
        this.dataService = inject(DataService);
    }

    async ngOnInit() {
        this.pipelines = await lastValueFrom(this.dataService.getPipelines());
    }

    openDashboard(id: string) {
        this.router.navigate(['app','pipeline', id, 'overview'])
    }

    openLogs(id: string) {
        this.router.navigate(['pipeline', id, 'logs'])
    }

    showCreatePipelineModal() {
        this.isCreatePipelineModalVisible = true;
    }

    showExecutionTime(pipeline: Pipeline) {
        this.hoveredNextExecutionDistance = `Next execution: ${calculateNextExecution(pipeline.nextExecution)}`;
        this.hoveredNextExecutionInterval = setInterval(() => {
            this.hoveredNextExecutionDistance = `Next execution: ${calculateNextExecution(pipeline.nextExecution)}`
            if (this.hoveredNextExecutionDistance === 'Next execution: 00:00:00') {
                clearInterval(this.hoveredNextExecutionInterval)
                this.hoveredNextExecutionDistance = 'Calculating next execution...'
                this.refreshTimeout = setTimeout(() => {
                    lastValueFrom(this.dataService.getSinglePipeline(pipeline.id)).then((newPipeline) => {
                        pipeline.nextExecution = newPipeline.nextExecution
                        this.showExecutionTime(pipeline)
                        clearTimeout(this.refreshTimeout)
                    });
                }, 1000)
            }
        }, 1000)
    }

    hideExecutionTime() {
        this.hoveredNextExecutionDistance = 'Next execution: 00:00:00';
        if (this.hoveredNextExecutionInterval)
            clearInterval(this.hoveredNextExecutionInterval);
    }

}