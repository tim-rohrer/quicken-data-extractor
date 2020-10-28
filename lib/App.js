"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// eslint-disable-next-line no-unused-vars
const QuickenDataExtractor_1 = require("./QuickenDataExtractor");
class App {
    constructor() {
        this.allowedOrigins = [
            "http://localhost:3000",
            "http://localhost:5000",
            "http://dev2.itstechnical.net:3000",
        ];
        this.express = express_1.default();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express_1.default.Router();
        router.post("/fetch", async (req, res, next) => {
            try {
                const { apiKey } = req.body;
                if (apiKey !== "a12345") {
                    throw new Error("Invalid API Key.");
                }
                else {
                    const extractor = new QuickenDataExtractor_1.QuickenDataExtractor("./src/tests/fixtures/data.sqlite3");
                    const response = await extractor.fetchAndMigrateQuickenData();
                    // console.log("Resonse: ", response);
                    const appResults = {
                        responseTimestamp: new Date(),
                        quickenData: response,
                    };
                    res.json(appResults);
                }
            }
            catch (error) {
                next(error);
            }
        });
        // this.express.use(cors());
        this.express.use(cors_1.default({
            origin: (origin, callback) => {
                // allow requests with no origin
                // (like mobile apps or curl requests)
                if (!origin)
                    return callback(null, true);
                if (this.allowedOrigins.indexOf(origin) === -1) {
                    const msg = "The CORS policy for this site does not " +
                        "allow access from the specified Origin.";
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
        }));
        this.express.use(express_1.default.json({ limit: "50mb" }));
        this.express.use("/api", router);
        this.express.use((error, req, res, next) => {
            res
                .status(500)
                .send(`An unexpected server error occurred: ${error.message}`);
        });
    }
}
exports.default = new App().express;
