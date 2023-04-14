import type {Config} from 'jest';

const config: Config = {
    preset: "ts-jest",
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    testEnvironment: "node",
    rootDir: "./",
    roots:["./__tests__"],
    moduleNameMapper: {
        "@utils": "./"
    },
};

export default config;