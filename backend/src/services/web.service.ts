import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import { createServer } from 'http'
import { appConfig } from '../configs/app.config'
import { handleError } from '../middlewares/handle-error.middleware'
import mainRoute from '../routes/main.route'

export class WebService {
    protected static app = express();
    protected static port = appConfig.port || 4000;

    static async start() {
        this.useMiddlewares([
            express.json(),
            express.urlencoded({ extended: true }),
            helmet(),
            cors({ origin: appConfig.cors.origin }),
            compression(),
            morgan('dev'),
            handleError,
            mainRoute
        ]);

        const server = createServer(this.app)
        server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`)
        });
    };

    static useMiddlewares(middleware: any[]) {
        middleware.forEach(m => this.app.use(m))
    }
}


