import express from 'express';
import PrettyError from 'pretty-error';
import http from 'http';
import bodyParser from 'body-parser';
import expressSanitized from 'express-sanitized';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import config from '../src/config';
import mongoDb from './libs/mongoDb';
import authRouter from './routers/authRouter';
import SocketIo from 'socket.io';

mongoDb.connect();

const pretty = new PrettyError();
const app = express();
const server = new http.Server(app);
const io = new SocketIo(server);
io.path('/ws');

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSanitized());
app.use(methodOverride());

app.use('/', authRouter);

if (config.apiPort) {
    const runnable = app.listen(config.apiPort, (err) => {
        if (err) {
            console.error(err);
        }
        console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
        console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
    });
    io.on('connection', (socket) => {
        socket.emit('news', { msg: `'Hello World!' From Api Socket` });
        socket.on('test', (data) => {
        	console.log(data);
        });
    });
    io.listen(runnable);
}
