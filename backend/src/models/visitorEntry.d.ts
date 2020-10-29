// todo optional id ok?
export interface VisitorEntry {
    _id?: { $oid: string },
    name: string,
    message: string,
    timestamp: string
}