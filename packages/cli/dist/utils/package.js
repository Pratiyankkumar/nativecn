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
exports.getPackageInfo = getPackageInfo;
exports.getUserPackageInfo = getUserPackageInfo;
exports.isPackageInstalled = isPackageInstalled;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 * Get package information from package.json
 */
function getPackageInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJsonPath = path_1.default.resolve(__dirname, "../../package.json");
        try {
            const packageJson = yield fs_extra_1.default.readJSON(packageJsonPath);
            return {
                name: packageJson.name,
                version: packageJson.version,
            };
        }
        catch (error) {
            return {
                name: "@nativecn/cli",
                version: "0.1.0",
            };
        }
    });
}
/**
 * Get the user's project package.json
 */
function getUserPackageInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const packageJsonPath = path_1.default.join(cwd, "package.json");
        try {
            const packageJson = yield fs_extra_1.default.readJSON(packageJsonPath);
            return {
                path: packageJsonPath,
                data: packageJson,
                exists: true,
            };
        }
        catch (error) {
            return {
                path: packageJsonPath,
                data: {},
                exists: false,
            };
        }
    });
}
/**
 * Check if a package is installed in the user's project
 */
function isPackageInstalled(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, exists } = yield getUserPackageInfo();
        if (!exists) {
            return false;
        }
        const dependencies = Object.assign(Object.assign({}, data.dependencies), data.devDependencies);
        return !!dependencies[packageName];
    });
}
