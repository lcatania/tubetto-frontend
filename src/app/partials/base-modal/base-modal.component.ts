import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconsModule } from 'src/app/icons/icons.module';

@Component({
    standalone: true,
    imports:[
        NgIf,
        IconsModule
    ],
    selector: 'app-base-modal',
    templateUrl: 'base-modal.component.html'
})

export class BaseModalComponent implements OnInit {

    @Input() title: string = "Base Modal";
    @Input() showFooter: boolean = true;
    @Input() size: 'small' | 'medium' | 'large' = 'small';
    @Input() showModal: boolean = false;

    @Input() confirmColorType: 'success' | 'danger' = "success";
    @Input() confirmText: string = "Confirm";
    @Input() dismissText: string = "Cancel";

    @Output() confirmTriggered: EventEmitter<void> = new EventEmitter<void>();
    @Output() dismissTriggered: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    ngOnInit() { }
}