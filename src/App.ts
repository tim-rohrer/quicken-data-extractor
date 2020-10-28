import express from 'express';
import cors from 'cors';
// eslint-disable-next-line no-unused-vars
import { ExtractorResponse } from './QuickenDataExtractor';

interface AppResults {
  responseTimestamp: string;
  quickenData: ExtractorResponse;
}

class App {
  public express: express.Application;

  private storedRoutes: any = {};

  private allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://dev2.itstechnical.net:3000',
  ];

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.post('/fetch', (req, res, next) => {
      try {
        const { apiKey } = req.body;
        if (apiKey !== 'a12345') {

        }
        const stopSolver = new StopSolver(myRoutes);
        const suggestedStops = stopSolver.provideStopSolverResults(userParameters);

        const appResults: AppResults = {
          stopSolverRoutesID: routesID,
          stopSolverStops: suggestedStops,
        };
        res.json(appResults);
      } catch (error) {
        next(error);
      }
    });
    this.express.use(cors());
    // this.express.use(cors({
    //   origin: (origin, callback) => {
    //     // allow requests with no origin
    //     // (like mobile apps or curl requests)
    //     if (!origin) return callback(null, true);
    //     if (this.allowedOrigins.indexOf(origin) === -1) {
    //       const msg = 'The CORS policy for this site does not '
    //                 + 'allow access from the specified Origin.';
    //       return callback(new Error(msg), false);
    //     }
    //     return callback(null, true);
    //   },
    //   exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    // }));
    this.express.use(express.json({ limit: '50mb' }));
    this.express.use('/api', router);
    this.express.use((error: Error, req: any, res: any, next: any) => {
      console.log('Server error: ', error);
      res.status(500)
        .send(`An unexpected server error occurred: ${error.message}`);
    });
  }
}

export default new App().express;
