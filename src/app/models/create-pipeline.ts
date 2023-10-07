export type CreatePipeline = {
    name: string;
    connectionType: ConnectionType;
    connection: string;
    query: string;
    tz: string;
    format: Format;
    formatSettings: CSVSettings,
    cron: string,
    emails: string[]
    fileAvailability: FileAvailability;
}

export type ConnectionType = 'PG' | 'MYSQL' | 'MSSQL';
export type Format = 'CSV' | 'PARQUET' | 'JSON' | 'JSONL' | 'FEATHER' | 'YAML' | 'XML';
export type FileAvailability = 'ONCE' | 'HOUR' | 'DAY' | 'WEEK';

export type CSVSettings = {
    columnDelimiter: 'COMMA' | 'SEMICOLON' | 'SPACE' | 'TAB';
    stringDelimiter: 'SINGLEQUOTE' | 'DOUBLEQUOTE';
    mapping: Record<string,string>
}