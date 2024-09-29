module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!axios)", 
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest",
  },
  moduleNameMapper: {
    axios: "axios/dist/node/axios.cjs",
  },
};
