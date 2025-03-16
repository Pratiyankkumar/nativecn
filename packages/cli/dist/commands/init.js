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
exports.initCommand = initCommand;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const execa_1 = __importDefault(require("execa"));
const chalk_1 = __importDefault(require("chalk"));
const prompts_1 = __importDefault(require("prompts"));
const config_1 = require("../utils/config");
const package_1 = require("../utils/package");
function initCommand() {
    return __awaiter(this, arguments, void 0, function* (options = {}) {
        console.log(chalk_1.default.bold("Initializing NativeCN in your project..."));
        // Check if package.json exists
        const packageInfo = yield (0, package_1.getUserPackageInfo)();
        if (!packageInfo.exists) {
            console.error(chalk_1.default.red("✗"), "No package.json found. Please run this command in a React Native project.");
            process.exit(1);
        }
        // Check if this is a React Native project
        const isReactNative = yield (0, package_1.isPackageInstalled)("react-native");
        if (!isReactNative) {
            console.error(chalk_1.default.red("✗"), "This does not appear to be a React Native project.");
            process.exit(1);
        }
        // Detect styling preference
        let styling = options.styling;
        if (!styling) {
            const isNativeWindInstalled = yield (0, package_1.isPackageInstalled)("nativewind");
            if (isNativeWindInstalled) {
                styling = "nativewind";
            }
            else {
                // Ask user for styling preference
                const response = yield (0, prompts_1.default)({
                    type: "select",
                    name: "styling",
                    message: "Which styling approach would you like to use?",
                    choices: [
                        {
                            title: "NativeWind (Tailwind CSS for React Native)",
                            value: "nativewind",
                        },
                        { title: "React Native StyleSheet", value: "stylesheet" },
                    ],
                });
                styling = response.styling;
                if (!styling) {
                    console.log(chalk_1.default.yellow("Operation cancelled"));
                    process.exit(0);
                }
            }
        }
        // Check if NativeWind is properly configured when using nativewind
        if (styling === "nativewind") {
            const hasNativeWindSetup = yield checkNativeWindSetup();
            if (!hasNativeWindSetup) {
                console.log(chalk_1.default.yellow("\nNativeWind is not fully configured in your project."));
                console.log("Please follow these steps to set up NativeWind first:");
                console.log("1. Install dependencies: npm install nativewind tailwindcss");
                console.log("2. Create a tailwind.config.js file");
                console.log("3. Set up your babel config and metro config for NativeWind");
                console.log("\nSee NativeWind docs for more details: https://www.nativewind.dev/getting-started");
                const continueResponse = yield (0, prompts_1.default)({
                    type: "confirm",
                    name: "continue",
                    message: "Do you want to continue anyway?",
                    initial: false
                });
                if (!continueResponse.continue) {
                    console.log(chalk_1.default.yellow("Operation cancelled"));
                    process.exit(0);
                }
            }
            // Check if tailwind.config.js exists
            const tailwindConfigPath = path_1.default.join(process.cwd(), "tailwind.config.js");
            if (yield fs_extra_1.default.pathExists(tailwindConfigPath)) {
                // Ask if user wants to add our preset
                const addPresetResponse = yield (0, prompts_1.default)({
                    type: "confirm",
                    name: "addPreset",
                    message: "Would you like to add the NativeCN preset to your tailwind.config.js?",
                    initial: true
                });
                if (addPresetResponse.addPreset) {
                    // Add our preset to their tailwind config
                    yield addPresetToTailwindConfig(tailwindConfigPath);
                }
                else {
                    console.log(chalk_1.default.yellow("\nWarning: Without the NativeCN preset, some components may not style correctly."));
                    console.log("You can manually add it to your tailwind.config.js later with:");
                    console.log("1. First create nativecn-preset.js with our theme (run 'npx nativecn preset')");
                    console.log("2. Add to your tailwind.config.js: presets: [require('./nativecn-preset')],");
                }
            }
            else {
                console.log(chalk_1.default.yellow("\nWarning: No tailwind.config.js found. Some components may not style correctly."));
                console.log("To set up tailwind.config.js with the NativeCN preset:");
                console.log("1. Create a basic tailwind.config.js file");
                console.log("2. Run 'npx nativecn preset' to generate the nativecn-preset.js file");
                console.log("3. Add to your tailwind.config.js: presets: [require('./nativecn-preset')],");
            }
        }
        // Check for existing theme providers
        const hasExistingTheme = yield checkForExistingThemeProvider();
        // Create components directory
        const componentsDir = path_1.default.join(process.cwd(), "components/ui");
        yield fs_extra_1.default.ensureDir(componentsDir);
        // Create config file
        yield (0, config_1.createConfig)({
            styling: styling,
            theme: {
                useExisting: hasExistingTheme.exists,
                existingThemePath: hasExistingTheme.path,
                defaultTheme: (options.theme || "light"),
                useSystemTheme: options.theme === "system",
            },
        });
        // Install only essential dependencies
        if (!options.skipInstall) {
            yield installEssentialDependencies(styling);
        }
        // Create utility files (not modifying existing ones)
        yield createUtilityFiles(styling, hasExistingTheme.exists);
        console.log();
        console.log(chalk_1.default.green("✓"), chalk_1.default.bold("NativeCN initialized successfully!"));
        console.log();
        console.log("Next steps:");
        console.log("  1. Add components to your project:");
        console.log("     npx nativecn add button card input");
        console.log();
        console.log("  2. Import and use components in your app:");
        console.log('     import Button from "./components/ui/button";');
        console.log();
    });
}
/**
 * Check if NativeWind is properly set up in the project
 */
function checkNativeWindSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const hasNativeWind = yield (0, package_1.isPackageInstalled)("nativewind");
        const hasTailwind = yield (0, package_1.isPackageInstalled)("tailwindcss");
        // Check for config files
        const hasTailwindConfig = yield fs_extra_1.default.pathExists(path_1.default.join(cwd, "tailwind.config.js"));
        return hasNativeWind && hasTailwind && hasTailwindConfig;
    });
}
/**
 * Add the NativeCN preset to the user's tailwind config
 */
function addPresetToTailwindConfig(configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let configContent = yield fs_extra_1.default.readFile(configPath, 'utf8');
            // Check if our preset is already there
            if (configContent.includes('nativecn-preset') || configContent.includes('@nativecn/components/preset')) {
                console.log(chalk_1.default.blue("i"), "NativeCN preset already in tailwind.config.js");
                return true;
            }
            // Create the nativecn-preset.js file in the user's project
            const presetContent = `/**
 * NativeCN default theme preset for tailwindcss
 * Generated by NativeCN CLI
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Light theme colors
        background: "#ffffff",
        foreground: "#252525",
        card: "#ffffff",
        "card-foreground": "#252525",
        popover: "#ffffff",
        "popover-foreground": "#252525",
        primary: "#343434",
        "primary-foreground": "#fbfbfb",
        secondary: "#f7f7f7",
        "secondary-foreground": "#343434",
        muted: "#f7f7f7",
        "muted-foreground": "#8d8d8d",
        accent: "#f7f7f7",
        "accent-foreground": "#343434",
        destructive: "#e13636",
        "destructive-foreground": "#e13636",
        border: "#ebebeb",
        input: "#ebebeb",
        ring: "#b4b4b4",
        
        // Dark mode colors
        dark: {
          background: "#252525",
          foreground: "#fbfbfb",
          card: "#252525",
          "card-foreground": "#fbfbfb",
          popover: "#252525",
          "popover-foreground": "#fbfbfb",
          primary: "#fbfbfb",
          "primary-foreground": "#343434",
          secondary: "#444444",
          "secondary-foreground": "#fbfbfb",
          muted: "#444444",
          "muted-foreground": "#b4b4b4",
          accent: "#444444",
          "accent-foreground": "#fbfbfb",
          destructive: "#9e2626",
          "destructive-foreground": "#f85d5d",
          border: "#444444",
          input: "#444444",
          ring: "#8d8d8d",
        },
        
        // Sidebar colors
        sidebar: {
          DEFAULT: "#fbfbfb",
          foreground: "#252525",
          primary: "#343434",
          "primary-foreground": "#fbfbfb",
          accent: "#f7f7f7",
          "accent-foreground": "#343434",
          border: "#ebebeb",
          ring: "#b4b4b4",
        },
        
        "sidebar-dark": {
          DEFAULT: "#343434",
          foreground: "#fbfbfb",
          primary: "#5e46ff",
          "primary-foreground": "#fbfbfb",
          accent: "#444444",
          "accent-foreground": "#fbfbfb",
          border: "#444444",
          ring: "#707070",
        },
      },
      borderRadius: {
        xl: 16,
        lg: 10,
        md: 8,
        sm: 6,
      },
    },
  },
}`;
            // Write the preset file to the user's project
            const userPresetPath = path_1.default.join(process.cwd(), 'nativecn-preset.js');
            yield fs_extra_1.default.writeFile(userPresetPath, presetContent);
            console.log(chalk_1.default.green("✓"), "Created nativecn-preset.js in your project");
            // Simple approach - find the module.exports and add our preset
            if (configContent.includes('module.exports')) {
                // If there's already a presets array
                if (configContent.includes('presets:')) {
                    // Add our preset to the existing presets array
                    configContent = configContent.replace(/presets:\s*\[([\s\S]*?)\]/, (match, presets) => {
                        const separator = presets.trim() ? ', ' : '';
                        return `presets: [${presets}${separator}require('./nativecn-preset')]`;
                    });
                }
                else {
                    // Add a new presets array
                    configContent = configContent.replace(/module\.exports\s*=\s*{/, 'module.exports = {\n  presets: [require(\'./nativecn-preset\')],');
                }
                // Check and update content array to include components path
                if (configContent.includes('content:')) {
                    const hasComponentsPath = configContent.includes('./components/') || configContent.includes('"./components/');
                    if (!hasComponentsPath) {
                        // Add components path to the content array
                        configContent = configContent.replace(/content:\s*\[([\s\S]*?)\]/, (match, content) => {
                            const separator = content.trim() ? ', ' : '';
                            return `content: [${content}${separator}"./components/**/*.{js,jsx,ts,tsx}"]`;
                        });
                        console.log(chalk_1.default.green("✓"), "Added components path to content array in tailwind.config.js");
                    }
                }
                else {
                    // If no content array exists, add it
                    configContent = configContent.replace(/module\.exports\s*=\s*{/, 'module.exports = {\n  content: ["./components/**/*.{js,jsx,ts,tsx}"],');
                    console.log(chalk_1.default.green("✓"), "Added content array with components path to tailwind.config.js");
                }
                yield fs_extra_1.default.writeFile(configPath, configContent);
                console.log(chalk_1.default.green("✓"), "Added NativeCN preset to tailwind.config.js");
                return true;
            }
            else {
                console.log(chalk_1.default.yellow("!"), "Couldn't modify tailwind.config.js - please add the preset manually:");
                console.log("presets: [require('./nativecn-preset')],");
                console.log("content: [...existing content, \"./components/**/*.{js,jsx,ts,tsx}\"],");
                return false;
            }
        }
        catch (error) {
            console.error(chalk_1.default.red("✗"), "Error modifying tailwind.config.js:", error);
            return false;
        }
    });
}
/**
 * Check for existing theme providers in the project
 */
function checkForExistingThemeProvider() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const potentialThemePaths = [
            "src/theme",
            "app/theme",
            "lib/theme",
            "context/theme",
            "hooks/theme",
        ];
        for (const dir of potentialThemePaths) {
            const fullPath = path_1.default.join(cwd, dir);
            if (yield fs_extra_1.default.pathExists(fullPath)) {
                const files = yield fs_extra_1.default.readdir(fullPath);
                for (const file of files) {
                    if (file.toLowerCase().includes("theme")) {
                        // Ask user if this is their theme provider
                        const response = yield (0, prompts_1.default)({
                            type: "confirm",
                            name: "useTheme",
                            message: `Found potential theme provider at ${dir}/${file}. Do you want to use this?`,
                            initial: true,
                        });
                        if (response.useTheme) {
                            return {
                                exists: true,
                                path: `${dir}/${file.replace(/\.[jt]sx?$/, "")}`,
                            };
                        }
                    }
                }
            }
        }
        // No theme provider found or confirmed
        return { exists: false, path: null };
    });
}
/**
 * Install essential dependencies only
 */
function installEssentialDependencies(styling) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.bold("Installing essential dependencies..."));
        // We only need to install minimal dependencies
        const dependencies = ["clsx", "tailwind-merge"];
        // Detect package manager
        const packageManager = yield detectPackageManager();
        const installCmd = packageManager === "yarn" ? "add" : "install";
        try {
            yield (0, execa_1.default)(packageManager, [installCmd, ...dependencies], {
                stdio: "inherit",
            });
            console.log(chalk_1.default.green("✓"), "Essential dependencies installed");
            return true;
        }
        catch (error) {
            console.error(chalk_1.default.red("✗"), "Failed to install dependencies:", error instanceof Error ? error.message : String(error));
            console.log(chalk_1.default.yellow("!"), "You can install them manually:", `${packageManager} ${installCmd} ${dependencies.join(" ")}`);
            return false;
        }
    });
}
/**
 * Detect the package manager being used
 */
function detectPackageManager() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        if (yield fs_extra_1.default.pathExists(path_1.default.join(cwd, "yarn.lock"))) {
            return "yarn";
        }
        if (yield fs_extra_1.default.pathExists(path_1.default.join(cwd, "pnpm-lock.yaml"))) {
            return "pnpm";
        }
        return "npm";
    });
}
/**
 * Create essential utility files without modifying existing ones
 */
function createUtilityFiles(styling, useExistingTheme) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        // Create utils directory if it doesn't exist
        const utilsDir = path_1.default.join(cwd, "lib");
        yield fs_extra_1.default.ensureDir(utilsDir);
        // Create cn.ts utility if it doesn't exist
        const cnPath = path_1.default.join(utilsDir, "utils.ts");
        if (!(yield fs_extra_1.default.pathExists(cnPath))) {
            const cnContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility for merging Tailwind CSS classes without style conflicts.
 * Can be used with or without NativeWind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
            yield fs_extra_1.default.writeFile(cnPath, cnContent);
            console.log(chalk_1.default.green("✓"), "Created utility functions in lib/utils.ts");
        }
        else {
            console.log(chalk_1.default.blue("i"), "lib/utils.ts already exists, skipping");
        }
    });
}
