import { CreatePipeline } from "./create-pipeline";

export type ConnectionSettings = Pick<CreatePipeline, 'connection' | 'connectionType'>

export type ContentSettings = Pick<CreatePipeline,  'query'>

export type CronSettings = Pick<CreatePipeline,  'cron'>

export type TransportSettings = Pick<CreatePipeline,  'emails' | 'fileAvailability'>

export type OutputSettings = Pick<CreatePipeline, 'format' | 'formatSettings'>