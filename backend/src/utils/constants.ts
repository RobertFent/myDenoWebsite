import { LogLevel } from "./logger.ts";

export const PageInformation = {
    MainPage: {
        GetRoute: '/',
        HtmlFile: 'index.ejs'
    },
    VisitorsBook: {
        GetRoute: '/visitors_book',
        PostRoute: '/visitor_entry',
        HtmlFile: 'visitors_book.ejs'
    }
};

export const SERVER_PORT = 8071;
export const HOST_NAME = '0.0.0.0';
export const CONNECTION_STRING = 'mongodb://admin:admin@localhost:27017';
export const DEFAULT_DB = 'dev-website';
export const DEFAULT_LOG_LEVEL = LogLevel.DEBUG;
export const MONGO_ATLAS = false;