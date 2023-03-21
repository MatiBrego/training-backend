import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


import { Constants, NodeEnv, Logger } from '@utils';
import { router } from '@router';
import { ErrorHandling } from '@utils/errors';

const app = express();

Logger.info(`Server starting...`);

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')); // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()); // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()); // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST,
  })
);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Twitter Mini Api",
            version: "0.1.0",
            description:
                "Twitter clone api"
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: [
        "./src/domains/user/controller/*.ts",
        "./src/domains/auth/controller/*.ts",
        "./src/domains/follow/controller/*.ts",
        "./src/domains/health/controller/*.ts",
        "./src/domains/post/controller/*.ts",
    ],
};

app.use('/api', router);

app.use(ErrorHandling);

const specs = swaggerJSDoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`);
});
