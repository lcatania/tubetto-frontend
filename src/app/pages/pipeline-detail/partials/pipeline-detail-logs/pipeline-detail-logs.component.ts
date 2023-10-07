import { Component, OnInit, inject } from '@angular/core';
import { IconsModule } from 'src/app/icons/icons.module';
import { LogItemComponent } from './partials/log-item.component.ts/log-item.component';
import { NgFor } from '@angular/common';
import { PipelineLog } from 'src/app/models/log';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';

@Component({
    standalone: true,
    imports: [
        IconsModule,
        NgFor,
        LogItemComponent
    ],
    selector: 'app-pipeline-detail-logs',
    templateUrl: 'pipeline-detail-logs.component.html'
})

export class PipelineDetailLogsComponent implements OnInit {

    logs: PipelineLog[] = []

    routeSubscription!: Subscription;

    private dataService: DataService;
    private activatedRoute: ActivatedRoute;


    constructor() {
        this.dataService = inject(DataService);
        this.activatedRoute = inject(ActivatedRoute);
    }

    ngOnInit(): void {
        this.routeSubscription = this.activatedRoute.params.subscribe(async (params) => {
            this.logs = await lastValueFrom(this.dataService.getPipelineLogs(params['id']));
        });
    }

    ngOnDestroy(): void {
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
    }
}