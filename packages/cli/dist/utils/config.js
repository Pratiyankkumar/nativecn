"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = createConfig;
exports.readConfig = readConfig;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const defaultConfig = {
    styling: "nativewind",
    theme: {
        useExisting: false,
        existingThemePath: null,
        defaultTheme: "light",
        useSystemTheme: true,
    },
    components: {
        outDir: "./components/ui",
        defaultProps: {
            Button: {
                variant: "default",
                size: "default",
            },
        },
    },
};
/**
 * Create a NativeCN config file
 */
function createConfig() {
    return __awaiter(this, arguments, void 0, function* (configOptions = {}) {
        const cwd = process.cwd();
        const configPath = path_1.default.join(cwd, "nativecn.config.js");
        // Merge default config with provided options
        const config = Object.assign(Object.assign(Object.assign({}, defaultConfig), configOptions), { theme: Object.assign(Object.assign({}, defaultConfig.theme), configOptions.theme), components: Object.assign(Object.assign({}, defaultConfig.components), configOptions.components) });
        // Create config file content
        const configContent = `/** @type {import('@nativecn/cli').Config} */
module.exports = ${JSON.stringify(config, null, 2)};
`;
        try {
            yield fs_extra_1.default.writeFile(configPath, configContent);
            console.log(chalk_1.default.green("✓"), "Created NativeCN config file");
            return true;
        }
        catch (error) {
            console.error(chalk_1.default.red("✗"), "Failed to create config file");
            return false;
        }
    });
}
/**
 * Read the NativeCN config file
 */
function readConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const configPath = path_1.default.join(cwd, "nativecn.config.js");
        try {
            // Using require to load the config as a module
            delete require.cache[configPath];
            const config = require(configPath);
            return config;
        }
        catch (error) {
            console.warn(chalk_1.default.yellow("!"), "Config file not found, using defaults");
            return defaultConfig;
        }
    });
}
