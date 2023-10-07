import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'appValidateQuery'
})

export class ValidateQueryPipe implements PipeTransform {

    badKeyword: string[] = ['delete', 'insert', 'update', 'drop', 'alter', 'create']
    transform(query: string): any {
        if (query === '')
            return false;
        if (this.badKeyword.some((k) => query.includes(k)))
            return false;
        const searchStr = 'select';
        const searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        let startIndex = 0;
        let index = 0;
        let indices: number[] = [];
        query = query.toLowerCase();
        while ((index = query.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        if (!indices.includes(0) || indices.length === 0)
            return false;

        if (!query.includes('from'))
            return false;

        return true;
    }
}