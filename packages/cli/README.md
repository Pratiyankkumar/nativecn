[![NPM Version](https://img.shields.io/npm/v/@nativecn/cli.svg)](https://www.npmjs.com/package/@nativecn/cli)
[![Downloads](https://img.shields.io/npm/dm/@nativecn/cli.svg)](https://www.npmjs.com/package/@nativecn/cli)
[![License](https://img.shields.io/npm/l/@nativecn/cli.svg)](https://github.com/tailwiinder/nativecn/blob/main/LICENSE)

# @nativecn/cli

A CLI tool for initializing and managing NativeCN components in React Native projects.

## Installation

```bash
npm install @nativecn/cli
# or
npx @nativecn/cli [command]
```

## Usage

### Initialize NativeCN in your project

```bash
npx @nativecn/cli init
```

The init command will:

1. Detect if your project uses NativeWind or StyleSheet
2. Create a nativecn-preset.js file with theme configuration
3. Add components directory structure
4. Install essential dependencies
5. Create utility functions

### Add components to your project

```bash
npx @nativecn/cli add button input card
```

Options:

- `--dir <directory>` - Target directory for components (default: './components/ui')
- `--overwrite` - Overwrite existing components

### Generate NativeCN preset file

```bash
npx nativecn preset
```

Creates a nativecn-preset.js file with default theme colors.

## Available Components

- `button` - A customizable button component with different variants, sizes and states
- `accordion` - A vertically stacked set of interactive headings that reveal or hide associated content
- `alert` - A component that displays a brief, important message to get users' attention
- `alertdialog` - A modal dialog that interrupts the user with important content and expects a response
- `avatar` - An image component used to represent a user, with a fallback for showing initials
- `badge` - A small visual indicator for highlighting status, labels or counts
- `breadcrumb` - A navigation component that shows the current location in a hierarchical structure
- `aspectratio` - A component to maintain consistent width/height ratios across different screen sizes
- `card` - A container component that groups related content and actions
- `carousel` - A slideshow component for cycling through elements like images or slides of content
- `input-otp` - A one-time password input component with individual character boxes and auto-focus
- `skeleton` - A placeholder loading component that animates to indicate content is being loaded
- And more to come!

## License

MIT
