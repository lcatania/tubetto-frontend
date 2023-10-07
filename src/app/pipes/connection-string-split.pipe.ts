import { Pipe, PipeTransform } from '@angular/core';
import { ConnectionType } from '../models/create-pipeline';
import { ConnectionProps, propsMap } from './connection-helper';

@Pipe({
    standalone: true,
    name: 'appConnectionStringSplit',
})

export class ConnectionStringSplitPipe implements PipeTransform {
    transform(value: string, connectionType: ConnectionType, prop: ConnectionProps): string {
        const splittedConnection = value.split(';')
        const props: { [key: string]: string } = splittedConnection.reduce((prev, curr) => {
            let keyValuePair = curr.split('=');
            return { ...prev, [keyValuePair[0]]: keyValuePair[1] }
        }, {})
        // Fuck MSSQL, FUCK MICROSOFT WHY U NO USE SEMICOLON FOR SERVER , PORT SEPERATION
        if (connectionType === 'MSSQL' && prop === 'PORT')
            return props['Server']?.split(",")[1] ?? ""
        if (connectionType === 'MSSQL' && prop === 'HOST')
            return props['Server']?.split(",")[0] ?? ""
        return props[propsMap[connectionType][prop]] ?? ""
    }
}