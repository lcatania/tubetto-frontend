import { Component, OnInit } from '@angular/core';
import { IconsModule } from 'src/app/icons/icons.module';

@Component({
    standalone:true,
    imports: [IconsModule],
    selector: 'app-log',
    templateUrl: 'log.component.html'
})

export class LogComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}