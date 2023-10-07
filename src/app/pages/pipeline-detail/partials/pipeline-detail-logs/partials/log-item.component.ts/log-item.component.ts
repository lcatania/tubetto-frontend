import { DatePipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IconsModule } from 'src/app/icons/icons.module';
import { PipelineLog } from 'src/app/models/log';

@Component({
    standalone: true,
    selector: 'app-log-item',
    templateUrl: 'log-item.component.html',
    imports: [
        IconsModule,
        DatePipe,
        NgIf,
    ]
})

export class LogItemComponent implements OnInit {

    @Input() first:boolean = false;
    @Input() last:boolean = false;
    @Input() log: PipelineLog | undefined = undefined;

    open: boolean = false;

    constructor() { }

    ngOnInit() { }
}