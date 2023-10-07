import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type DropdownItem = {
    value: any;
    display: string;
}

@Component({
    standalone: true,
    imports: [NgFor, NgIf],
    selector: 'app-base-dropdown',
    templateUrl: 'base-dropdown.component.html'
})

export class BaseDropdownComponent implements OnInit {

    @Input() label: string = "";
    @Input() items: DropdownItem[] = []
    @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();

    showDropdown: boolean = false;
    selectedItem: DropdownItem | undefined = undefined;

    constructor() { }

    ngOnInit() {
        this.selectedItem = this.items[0];
    }

    selectValue(item: any) {
        this.showDropdown = false;
        this.selectedItem = item
        this.itemSelected.emit(item.value);
    }
}