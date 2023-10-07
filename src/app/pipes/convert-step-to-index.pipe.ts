import { Pipe, PipeTransform } from '@angular/core';
import { ALL_STEPS, PipelineCreationStep } from '../partials/create-pipeline/create-pipeline.component';

@Pipe({
    standalone:true,
    name: 'appConvertStepToIndex'
})

export class ConvertStepToIndexPipe implements PipeTransform {
    transform(value: PipelineCreationStep): any {
        return ALL_STEPS.findIndex(s => s === value);
    }
}