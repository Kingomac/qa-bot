module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["."],
  moduleFileExtensionss: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "./tests/.*.ts$",
};
