#!/usr/bin/env node
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
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const init_1 = require("./commands/init");
const add_1 = require("./commands/add");
const preset_1 = require("./commands/preset");
const package_1 = require("./utils/package");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageInfo = yield (0, package_1.getPackageInfo)();
        const program = new commander_1.Command()
            .name("nativecn")
            .description("CLI for managing NativeCN UI components")
            .version(packageInfo.version || "0.1.0");
        // Register commands
        program
            .command("init")
            .description("Initialize NativeCN in your project")
            .option("--styling <type>", "Styling approach to use (nativewind|stylesheet)", "nativewind")
            .option("--theme <mode>", "Default theme mode (light|dark|system)", "system")
            .option("--skip-install", "Skip dependency installation")
            .action(init_1.initCommand);
        program
            .command("add <component...>")
            .description("Add components to your project")
            .option("-d, --dir <directory>", "Target directory for the component", "./components/ui")
            .option("--overwrite", "Overwrite existing component", false)
            .action(add_1.addCommand);
        program
            .command("preset")
            .description("Generate the NativeCN preset file for tailwind.config.js")
            .action(preset_1.presetCommand);
        // Add more commands as needed
        program
            .command("list")
            .description("List all available components")
            .action(() => {
            console.log(chalk_1.default.green("Available components:"));
            console.log("  • button - A versatile button component");
            console.log("  • card - A container component with variants");
            console.log("  • input - Text input with various styles");
            console.log("  • checkbox - Selectable checkbox component");
            console.log("  • switch - Toggle switch component");
        });
        program.parse();
    });
}
main().catch((error) => {
    console.error(chalk_1.default.red("Error:"), error.message);
    process.exit(1);
});
