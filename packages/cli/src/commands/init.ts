import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs-extra';
import prompts from 'prompts';

import { createConfig } from '../utils/config';
import { isPackageInstalled, getUserPackageInfo } from '../utils/package';

interface InitOptions {
  styling?: 'nativewind' | 'stylesheet';
  theme?: 'light' | 'dark' | 'system';
  skipInstall?: boolean;
}

export async function initCommand(options: InitOptions = {}) {
  console.log(chalk.bold('Initializing NativeCN in your project...'));

  // Check if package.json exists
  const packageInfo = await getUserPackageInfo();

  if (!packageInfo.exists) {
    console.error(
      chalk.red('✗'),
      'No package.json found. Please run this command in a React Native project.'
    );
    process.exit(1);
  }

  // Check if this is a React Native project
  const isReactNative = await isPackageInstalled('react-native');

  if (!isReactNative) {
    console.error(chalk.red('✗'), 'This does not appear to be a React Native project.');
    process.exit(1);
  }

  // Detect styling preference
  let styling = options.styling;

  if (!styling) {
    const isNativeWindInstalled = await isPackageInstalled('nativewind');

    if (isNativeWindInstalled) {
      styling = 'nativewind';
    } else {
      // Ask user for styling preference
      const response = await prompts({
        type: 'select',
        name: 'styling',
        message: 'Which styling approach would you like to use?',
        choices: [
          {
            title: 'NativeWind (Tailwind CSS for React Native)',
            value: 'nativewind',
          },
          { title: 'React Native StyleSheet', value: 'stylesheet' },
        ],
      });

      styling = response.styling;

      if (!styling) {
        console.log(chalk.yellow('Operation cancelled'));
        process.exit(0);
      }
    }
  }

  // Always create the preset file regardless of styling method
  await createPresetFile();

  // Check if NativeWind is properly configured when using nativewind
  if (styling === 'nativewind') {
    const hasNativeWindSetup = await checkNativeWindSetup();

    if (!hasNativeWindSetup) {
      console.log(chalk.yellow('\nNativeWind is not fully configured in your project.'));
      console.log('Please follow these steps to set up NativeWind first:');
      console.log('1. Install dependencies: npm install nativewind tailwindcss');
      console.log('2. Create a tailwind.config.js file');
      console.log('3. Set up your babel config and metro config for NativeWind');
      console.log(
        '\nSee NativeWind docs for more details: https://www.nativewind.dev/getting-started'
      );

      const continueResponse = await prompts({
        type: 'confirm',
        name: 'continue',
        message: 'Do you want to continue anyway?',
        initial: false,
      });

      if (!continueResponse.continue) {
        console.log(chalk.yellow('Operation cancelled'));
        process.exit(0);
      }
    }

    // Check if tailwind.config.js exists
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
    if (await fs.pathExists(tailwindConfigPath)) {
      // Ask if user wants to add our preset
      const addPresetResponse = await prompts({
        type: 'confirm',
        name: 'addPreset',
        message: 'Would you like to add the NativeCN preset to your tailwind.config.js?',
        initial: true,
      });

      if (addPresetResponse.addPreset) {
        // Add our preset to their tailwind config
        await addPresetToTailwindConfig(tailwindConfigPath);
      } else {
        console.log(
          chalk.yellow(
            '\nWarning: Without the NativeCN preset, some components may not style correctly.'
          )
        );
        console.log('You can manually add it to your tailwind.config.js later with:');
        console.log("Add to your tailwind.config.js: presets: [require('./nativecn-preset')],");
      }
    } else {
      console.log(
        chalk.yellow(
          '\nWarning: No tailwind.config.js found. Some components may not style correctly.'
        )
      );
      console.log('To set up tailwind.config.js with the NativeCN preset:');
      console.log('1. Create a basic tailwind.config.js file');
      console.log("2. Add to your tailwind.config.js: presets: [require('./nativecn-preset')],");
    }
  }

  // Check for existing theme providers
  const hasExistingTheme = await checkForExistingThemeProvider();

  // Create components directory
  const componentsDir = path.join(process.cwd(), 'components/ui');
  await fs.ensureDir(componentsDir);

  // Create config file
  await createConfig({
    styling: styling as 'nativewind' | 'stylesheet',
    theme: {
      useExisting: hasExistingTheme.exists,
      existingThemePath: hasExistingTheme.path,
      defaultTheme: (options.theme || 'light') as 'light' | 'dark' | 'system',
      useSystemTheme: options.theme === 'system',
    },
  });

  // Install only essential dependencies
  if (!options.skipInstall) {
    await installEssentialDependencies();
  }

  // Create utility files (not modifying existing ones)
  await createUtilityFiles();

  console.log();
  console.log(chalk.green('✓'), chalk.bold('NativeCN initialized successfully!'));
  console.log();
  console.log('Next steps:');
  console.log('  1. Add components to your project:');
  console.log('     npx @nativecn/cli add button card input');
  console.log();
  console.log('  2. Import and use components in your app:');
  console.log('     import Button from "./components/ui/button";');
  console.log();
}

/**
 * Check if NativeWind is properly set up in the project
 */
async function checkNativeWindSetup(): Promise<boolean> {
  const cwd = process.cwd();
  const hasNativeWind = await isPackageInstalled('nativewind');
  const hasTailwind = await isPackageInstalled('tailwindcss');

  // Check for config files
  const hasTailwindConfig = await fs.pathExists(path.join(cwd, 'tailwind.config.js'));

  return hasNativeWind && hasTailwind && hasTailwindConfig;
}

/**
 * Add the NativeCN preset to the user's tailwind config
 */
async function addPresetToTailwindConfig(configPath: string): Promise<boolean> {
  try {
    let configContent = await fs.readFile(configPath, 'utf8');

    // Check if our preset is already there
    if (
      configContent.includes('nativecn-preset') ||
      configContent.includes('@nativecn/components/preset')
    ) {
      console.log(chalk.blue('i'), 'NativeCN preset already in tailwind.config.js');
      return true;
    }

    // We already created the preset file earlier, so we don't need to create it again here

    // Simple approach - find the module.exports and add our preset
    if (configContent.includes('module.exports')) {
      // If there's already a presets array
      if (configContent.includes('presets:')) {
        // Add our preset to the existing presets array
        configContent = configContent.replace(/presets:\s*\[([\s\S]*?)\]/, (match, presets) => {
          const separator = presets.trim() ? ', ' : '';
          return `presets: [${presets}${separator}require('./nativecn-preset')]`;
        });
      } else {
        // Add a new presets array
        configContent = configContent.replace(
          /module\.exports\s*=\s*{/,
          "module.exports = {\n  presets: [require('./nativecn-preset')],"
        );
      }

      // Check and update content array to include components path
      if (configContent.includes('content:')) {
        const hasComponentsPath =
          configContent.includes('./components/') || configContent.includes('"./components/');

        if (!hasComponentsPath) {
          // Add components path to the content array
          configContent = configContent.replace(/content:\s*\[([\s\S]*?)\]/, (match, content) => {
            const separator = content.trim() ? ', ' : '';
            return `content: [${content}${separator}"./components/**/*.{js,jsx,ts,tsx}"]`;
          });
          console.log(
            chalk.green('✓'),
            'Added components path to content array in tailwind.config.js'
          );
        }
      } else {
        // If no content array exists, add it
        configContent = configContent.replace(
          /module\.exports\s*=\s*{/,
          'module.exports = {\n  content: ["./components/**/*.{js,jsx,ts,tsx}"],'
        );
        console.log(
          chalk.green('✓'),
          'Added content array with components path to tailwind.config.js'
        );
      }

      await fs.writeFile(configPath, configContent);
      console.log(chalk.green('✓'), 'Added NativeCN preset to tailwind.config.js');
      return true;
    } else {
      console.log(
        chalk.yellow('!'),
        "Couldn't modify tailwind.config.js - please add the preset manually:"
      );
      console.log("presets: [require('./nativecn-preset')],");
      console.log('content: [...existing content, "./components/**/*.{js,jsx,ts,tsx}"],');
      return false;
    }
  } catch (error) {
    console.error(chalk.red('✗'), 'Error modifying tailwind.config.js:', error);
    return false;
  }
}

/**
 * Check for existing theme providers in the project
 */
async function checkForExistingThemeProvider() {
  const cwd = process.cwd();
  const potentialThemePaths = [
    'src/theme',
    'app/theme',
    'lib/theme',
    'context/theme',
    'hooks/theme',
  ];

  for (const dir of potentialThemePaths) {
    const fullPath = path.join(cwd, dir);

    if (await fs.pathExists(fullPath)) {
      const files = await fs.readdir(fullPath);

      for (const file of files) {
        if (file.toLowerCase().includes('theme')) {
          // Ask user if this is their theme provider
          const response = await prompts({
            type: 'confirm',
            name: 'useTheme',
            message: `Found potential theme provider at ${dir}/${file}. Do you want to use this?`,
            initial: true,
          });

          if (response.useTheme) {
            return {
              exists: true,
              path: `${dir}/${file.replace(/\.[jt]sx?$/, '')}`,
            };
          }
        }
      }
    }
  }

  // No theme provider found or confirmed
  return { exists: false, path: null };
}

/**
 * Install essential dependencies only
 */
async function installEssentialDependencies() {
  console.log(chalk.bold('Installing essential dependencies...'));

  // We only need to install minimal dependencies
  const dependencies = ['clsx', 'tailwind-merge', 'react-native-vector-icons'];

  // Dev dependencies
  const devDependencies = ['@types/react-native-vector-icons'];

  // Detect package manager
  const packageManager = await detectPackageManager();
  const installCmd = packageManager === 'yarn' ? 'add' : 'install';

  try {
    // Install regular dependencies
    await execa(packageManager, [installCmd, ...dependencies], {
      stdio: 'inherit',
    });

    // Install dev dependencies
    const devFlag = packageManager === 'npm' ? '--save-dev' : '-D';
    await execa(packageManager, [installCmd, devFlag, ...devDependencies], {
      stdio: 'inherit',
    });

    console.log(chalk.green('✓'), 'Essential dependencies installed');
    return true;
  } catch (error) {
    console.error(
      chalk.red('✗'),
      'Failed to install dependencies:',
      error instanceof Error ? error.message : String(error)
    );
    console.log(
      chalk.yellow('!'),
      'You can install them manually:',
      `${packageManager} ${installCmd} ${dependencies.join(' ')}`
    );
    return false;
  }
}

/**
 * Detect the package manager being used
 */
async function detectPackageManager() {
  const cwd = process.cwd();

  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }

  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  return 'npm';
}

/**
 * Create essential utility files without modifying existing ones
 */
async function createUtilityFiles() {
  const cwd = process.cwd();

  // Create utils directory if it doesn't exist
  const utilsDir = path.join(cwd, 'lib');
  await fs.ensureDir(utilsDir);

  // Create cn.ts utility if it doesn't exist
  const cnPath = path.join(utilsDir, 'utils.ts');
  if (!(await fs.pathExists(cnPath))) {
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

    await fs.writeFile(cnPath, cnContent);
    console.log(chalk.green('✓'), 'Created utility functions in lib/utils.ts');
  } else {
    console.log(chalk.blue('i'), 'lib/utils.ts already exists, skipping');
  }
}

/**
 * Create the nativecn-preset.js file in the user's project
 */
async function createPresetFile(): Promise<boolean> {
  try {
    const userPresetPath = path.join(process.cwd(), 'nativecn-preset.js');

    // Check if preset file already exists
    if (await fs.pathExists(userPresetPath)) {
      console.log(chalk.blue('i'), 'nativecn-preset.js already exists');
      return true;
    }

    // Copy the preset file from our templates
    const presetTemplatePath = path.resolve(__dirname, '../../templates/preset.js');
    if (await fs.pathExists(presetTemplatePath)) {
      await fs.copyFile(presetTemplatePath, userPresetPath);
      console.log(chalk.green('✓'), 'Created nativecn-preset.js in your project');
      return true;
    }

    // Fall back to creating the file from hard-coded content
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

    await fs.writeFile(userPresetPath, presetContent);
    console.log(chalk.green('✓'), 'Created nativecn-preset.js in your project');
    return true;
  } catch (error) {
    console.error(
      chalk.red('✗'),
      'Failed to create nativecn-preset.js:',
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}
