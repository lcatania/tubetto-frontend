import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone:true,
    name: 'appCronSplit'
})

export class CronSplitPipe implements PipeTransform {
    transform(value: string, index: number): any {
        return value.split(" ")[index];
    }
}