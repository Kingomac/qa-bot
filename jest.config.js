module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./tests/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "./.*.ts$",
};
