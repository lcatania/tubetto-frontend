import { Pipe, PipeTransform } from '@angular/core';
import { ConnectionType } from '../models/create-pipeline';
import { propsMap, ConnectionProps } from './connection-helper';

@Pipe({
    standalone: true,
    name: 'appValidateConnection'
})

export class ValidateConnectionPipe implements PipeTransform {
    transform(value: string, connectionType: ConnectionType): boolean {
        let isValid = false;

        const splittedConnection = value.split(';')
        const connectionStringProps: { [key: string]: string } = splittedConnection.reduce((prev, curr) => {
            let keyValuePair = curr.split('=');
            return { ...prev, [keyValuePair[0]]: keyValuePair[1] }
        }, {})
        //TODO: Implement Micrsoft FUCKERY 
        const typeProps: ConnectionProps[] = Object.keys(propsMap[connectionType]) as ConnectionProps[];
        for (let index = 0; index < typeProps.length; index++) {
            const prop = typeProps[index];
            const value = connectionStringProps[propsMap[connectionType][prop]]
            // I hate MSSQL
            switch (prop) {
                case 'HOST':
                    if (connectionType === 'MSSQL') {
                        let mssqlHost = value.split(';')[0]
                        let mssqlPort = value.split(';')[1]
                        if(mssqlPort){
                            isValid = mssqlHost !== undefined && mssqlHost !== '' &&  !isNaN(Number(mssqlPort));        
                        }
                        else{
                            isValid = mssqlHost !== undefined && mssqlHost !== '';    
                        }
                        break;
                    }
                    isValid = value !== undefined && value !== '';
                    break;
                case 'PORT':
                    if(connectionType !== 'MSSQL')
                        isValid = !isNaN(Number(value));
                    break;
                case 'DATABASE':
                    isValid = value !== undefined && value !== '';
                    break;
                case 'PASSWORD':
                    isValid = value !== undefined && value !== '';
                    break;
                case 'USER':
                    isValid = value !== undefined && value !== '';
                    break;
            }
        }
        return isValid;
    }
}