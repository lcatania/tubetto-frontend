import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { BaseModalComponent } from '../base-modal/base-modal.component';
import { JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';
import { IconsModule } from 'src/app/icons/icons.module';
import { CSVSettings, ConnectionType, CreatePipeline } from 'src/app/models/create-pipeline';
import { ConnectionStringSplitPipe } from 'src/app/pipes/connection-string-split.pipe';
import { ConnectionStringJoinPipe } from 'src/app/pipes/connection-string-join.pipe';
import { ConnectionProps } from 'src/app/pipes/connection-helper';
import { ValidateConnectionPipe } from "../../pipes/validate-connection.pipe";
import { CronTranslationPipe } from "../../pipes/cron-translation.pipe";
import { CronSplitPipe } from "../../pipes/cron-split.pipe";
import { ConvertStepToIndexPipe } from 'src/app/pipes/convert-step-to-index.pipe';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ValidateQueryPipe } from 'src/app/pipes/validate-query.pipe';
import { BaseDropdownComponent, DropdownItem } from "../base-dropdown/base-dropdown.component";

export const ALL_STEPS = ['DATASOURCE', 'CONTENT', 'CONVERTER', 'TIMING', 'TRANSPORT'] as const;
export type StepTuple = typeof ALL_STEPS;
export type PipelineCreationStep = StepTuple[number];

@Component({
    standalone: true,
    selector: 'app-create-pipeline',
    templateUrl: 'create-pipeline.component.html',
    imports: [
        BaseModalComponent,
        NgIf,
        NgFor,
        KeyValuePipe,
        IconsModule,
        CodemirrorModule,
        FormsModule,
        ConnectionStringSplitPipe,
        ConnectionStringJoinPipe,
        ValidateConnectionPipe,
        CronTranslationPipe,
        CronSplitPipe,
        JsonPipe,
        ConvertStepToIndexPipe,
        ValidateQueryPipe,
        BaseDropdownComponent
    ]
})

export class CreatePipelineComponent implements OnInit {

    @Input() showModal: boolean = false;
    @Input() pipeline: CreatePipeline = {
        name: "",
        connectionType: 'PG',
        connection: '',
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        query: '',
        format: 'CSV',
        formatSettings: {
            columnDelimiter: 'COMMA',
            stringDelimiter: 'DOUBLEQUOTE',
            mapping: {

            }
        },
        cron: '* * * * *',
        emails: [],
        fileAvailability: 'ONCE'
    };

    @Output() dismissTriggered: EventEmitter<void> = new EventEmitter<void>();

    connectionStringJoinPipe = new ConnectionStringJoinPipe()
    currentStep: PipelineCreationStep = 'DATASOURCE'


    codeMirrorOptions: any = {
        theme: 'material',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        lineWrapping: false,
        extraKeys: { "Ctrl-Space": "autocomplete" },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        autoCloseBrackets: true,
        matchBrackets: true,
        lint: true,
        autofocus: true
    };

    queryAIPrompt: string = "";
    cronAIPrompt: string = "";
    isAILoading: boolean = false;
    isAIGenerated: boolean = false;
    isLoading: boolean = false;
    isSuccessful: boolean = false;
    queryContainsStar: boolean = false;
    dropdownCSVTabDelimiter: DropdownItem[] = [
        {
            value: 'COMMA',
            display: 'Comma ","'
        },
        {
            value: 'SEMICOLON',
            display: 'Semicolon ";"'
        },
        {
            value: 'TAB',
            display: 'Tab'
        },
        {
            value: 'SPACE',
            display: 'Space'
        }
    ]
    dropdownCSVStringDelimiter: DropdownItem[] = [
        {
            value: 'DOUBLEQUOTE',
            display: 'Double quote (")'
        },
        {
            value: "SINGLEQUOTE",
            display: "Single quote (')"
        }
    ]

    private dataService: DataService;

    constructor() {
        this.dataService = inject(DataService);
    }

    ngOnInit() {
    }

    setPage(step: PipelineCreationStep) {
        this.currentStep = step;
        if (step === 'CONVERTER') {
            this.generateMapping()
        }
    }

    generateMapping() {
        const selectIndex = this.pipeline.query.toLowerCase().indexOf('select')
        const fromIndex = this.pipeline.query.toLowerCase().indexOf('from')
        const queryFields = [...new Set(this.pipeline.query.substring(selectIndex + 6, fromIndex).split(',').map(f => f.trim()))];
        for (let index = 0; index < queryFields.length; index++) {
            const field = queryFields[index];
            if (field === '*')
                this.queryContainsStar = true;
            this.pipeline.formatSettings.mapping[field] = '';
        }
    }

    testConnection() {
        //TODO: Check if valid connection if not show error form
        console.error("NOT IMPLEMENTED")
    }

    generateQueryByAI() {
        if (this.queryAIPrompt != '') {
            //TODO: Check if valid connection if not show error form
        }
        console.error("NOT IMPLEMENTED")
    }

    setConnectionType(type: ConnectionType) {
        this.pipeline.connectionType = type;
        switch (type) {
            case 'MSSQL':
                this.codeMirrorOptions.mode = 'text/x-mssql';
                break;
            case 'PG':
                this.codeMirrorOptions.mode = 'text/x-pgsql';
                break;
            case 'MYSQL':
                this.codeMirrorOptions.mode = 'text/x-mysql';
                break;
        }
    }

    setConnectionString(value: Event, prop: ConnectionProps) {
        this.pipeline.connection = this.connectionStringJoinPipe.transform(((value as InputEvent).target as HTMLInputElement).value, this.pipeline.connectionType, this.pipeline.connection, prop);
    }

    addEmail(value: string) {
        this.pipeline.emails.push(value);
    }

    cronChanged(value: string, index: number) {
        const splittedCron = this.pipeline.cron.split(" ");
        splittedCron[index] = value;
        this.pipeline.cron = splittedCron.join(" ");
    }

    removeEmail(index: number) {
        this.pipeline.emails.splice(index, 1);
    }

    async save() {
        try {
            this.isLoading = true;
            const result = await lastValueFrom(this.dataService.savePipeline(this.pipeline));
            this.isSuccessful = true;
            setTimeout(() => {
                this.dismissTriggered.emit();
            }, 1000)
            //TODO: WAAAAIT..... DISMISS!
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    cancel() {
        this.currentStep = 'DATASOURCE'
        this.dismissTriggered.emit();
    }

    setFormatSetting(property: keyof CSVSettings, value: any) {
        switch (property) {
            case 'columnDelimiter':
                this.pipeline.formatSettings.columnDelimiter = value;
                break;
            case 'stringDelimiter':
                this.pipeline.formatSettings.stringDelimiter = value;
                break;
        }
        console.log(this.pipeline.formatSettings)
    }

    trackByMapping(index: number, item: any) {
        return index
    }


}