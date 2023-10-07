import { Pipe, PipeTransform } from '@angular/core';
import { ConnectionType } from '../models/create-pipeline';
import { ConnectionProps, propsMap } from './connection-helper';

@Pipe({
    standalone: true,
    name: 'appConnectionStringJoin'
})

export class ConnectionStringJoinPipe implements PipeTransform {
    transform(value: string, connectionType: ConnectionType, connectionString: string, prop: ConnectionProps): any {
        const splittedConnection = connectionString.split(';')
        const props: { [key: string]: string } = splittedConnection.reduce((prev, curr) => {
            let keyValuePair = curr.split('=');
            if (keyValuePair.length === 1)
                return prev
            return { ...prev, [keyValuePair[0]]: keyValuePair[1] }
        }, {})

        // Fuck MSSQL, FUCK MICROSOFT WHY U NO USE SEMICOLON FOR SERVER , PORT SEPERATION
        if (connectionType === 'MSSQL' && prop === 'PORT') {
            let commaIndex = props['Server']?.indexOf(',');
            if (commaIndex > -1 && commaIndex)
                props['Server'] = props['Server'].slice(0, commaIndex) + ',' + value;
            else
                props['Server'] = props['Server'] + ',' + value;
            return Object.entries(props).map((p) => p.join("=")).join(";");
        }
        if (connectionType === 'MSSQL' && prop === 'HOST') {
            let commaIndex = props['Server']?.indexOf(',');
            if (commaIndex > -1 && commaIndex)
                props['Server'] =  value + ',' + props['Server'].slice(commaIndex);
            else
                props['Server'] = value;
            return Object.entries(props).map((p) => p.join("=")).join(";");
        }
        props[propsMap[connectionType][prop]] = value;
        return Object.entries(props).map((p) => p.join("=")).join(";");
    }
}