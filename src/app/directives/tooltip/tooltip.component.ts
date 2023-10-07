import { Component, OnInit } from '@angular/core';
import { TooltipPosition } from './tooltip.enum';
import { NgClass } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        NgClass
    ],
    selector: 'appTooltip',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['tooltip.component.scss']
})

export class TooltipComponent implements OnInit {

    position: TooltipPosition = 'DEFAULT';
    tooltip = '';
    left = 0;
    top = 0;
    visible = false;

    constructor() {
    }

    ngOnInit(): void {
    }
}