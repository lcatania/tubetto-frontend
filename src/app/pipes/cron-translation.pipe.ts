import { Pipe, PipeTransform } from '@angular/core';
import cronstrue from 'cronstrue'

@Pipe({
    standalone: true,
    name: 'appCronTranslation'
})

export class CronTranslationPipe implements PipeTransform {
    transform(cron: string): string {
        return cronstrue.toString(cron, { use24HourTimeFormat: true , throwExceptionOnParseError:false});
    }
}