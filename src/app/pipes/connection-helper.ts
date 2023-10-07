import { ConnectionType } from "../models/create-pipeline"

export type ConnectionProps = 'HOST' | 'PORT' | 'USER' | 'PASSWORD' | 'DATABASE'

export const propsMap: { [type in ConnectionType]: { [prop in ConnectionProps]: string } } = {
    'PG': {
        'HOST': 'Host',
        'PORT': 'Port',
        'USER': 'User ID',
        'PASSWORD': 'Password',
        'DATABASE': 'Database',
    },
    'MYSQL': {
        'HOST': 'Server',
        'PORT': 'Port',
        'USER': 'Uid',
        'PASSWORD': 'Pwd',
        'DATABASE': 'Database',
    },
    'MSSQL': {
        'HOST': 'Server',
        'USER': 'User Id',
        'PORT': '',
        'PASSWORD': 'Password',
        'DATABASE': 'Database',
    }
}