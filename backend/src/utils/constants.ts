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

export const SERVER_PORT = 8070;
export const HOST_NAME = '127.0.0.1';
export const CONNECTION_STRING = 'mongodb://admin:admin@localhost:27017';
export const DEFAULT_DB = 'test';
export const MONGO_ATLAS = false;