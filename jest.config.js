/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		"^.+\\.js$": "babel-jest",
	},
	transformIgnorePatterns: ["node_modules/(?!(indent-string)/)"],
	rootDir: __dirname,
	testMatch: ["**/src/**/*.test.ts"],
};
