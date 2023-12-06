export default {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
};