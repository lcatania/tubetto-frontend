import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { IconsModule } from 'src/app/icons/icons.module';
import { Pipeline } from 'src/app/models/pipeline';
import { DataService } from 'src/app/services/data.service';
import { BaseModalComponent } from "../../partials/base-modal/base-modal.component";

@Component({
    standalone: true,
    selector: 'app-pipeline-detail',
    templateUrl: 'pipeline-detail.component.html',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        IconsModule,
        BaseModalComponent
    ]
})

export class PipelineDetailComponent implements OnInit, OnDestroy {

    pipeline!: Pipeline | undefined;

    routeSubscription!: Subscription;

    showDeletePipeline: boolean = false;

    private router: Router;
    private activatedRoute: ActivatedRoute;
    private dataService: DataService;


    constructor() {
        this.router = inject(Router);
        this.activatedRoute = inject(ActivatedRoute);
        this.dataService = inject(DataService);
    }

    ngOnInit(): void {
        this.routeSubscription = this.activatedRoute.params.subscribe(async (params) => {
            this.pipeline = await lastValueFrom(this.dataService.getSinglePipeline(params['id']));
        })
    }

    ngOnDestroy(): void {
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
    }

    navBack() {
        this.router.navigate(['pipeline'])
    }

    async deletePipeline() {
        if (!this.pipeline)
            return;

        await lastValueFrom(this.dataService.deletePipeline(this.pipeline.id))
        this.navBack();
        //TODO: Implement Delete
    }
}