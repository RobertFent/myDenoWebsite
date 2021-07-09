export interface VisitorEntry {
    _id?: { $oid: string },
    timestamp: string
    name: string,
    message: string,
    ip: string
}