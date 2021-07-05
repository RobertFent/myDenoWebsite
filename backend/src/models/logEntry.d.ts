export interface LogEntry {
    _id?: { $oid: string },
    timestamp: string,
    level: string,
    service: string,
    message: string,
}