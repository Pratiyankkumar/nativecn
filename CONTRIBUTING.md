# Contributing to NativeCN

Thank you for your interest in contributing to NativeCN! This document provides guidelines and instructions for contributing to this open-source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Adding New Components](#adding-new-components)
- [Pull Request Process](#pull-request-process)
- [Coding Style](#coding-style)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Documentation](#documentation)
- [Releasing](#releasing)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A React Native development environment

### Local Setup

1. **Clone the repository**

```bash
git clone https://github.com/tailwiinder/nativecn.git
cd nativecn
```

2. **Install dependencies**

```bash
npm install
```

3. **Build all packages**

```bash
npm run build
```

4. **Link the CLI for local development**

```bash
# Link the package globally
npm link

# Now you can run the CLI locally
npx @nativecn/cli init
npx @nativecn/cli add button
```

5. **Alternatively, link individual packages**

```bash
npm link @nativecn/cli
```

6. **Start development mode** (watches for changes and rebuilds)

```bash
npm run dev
```

## Project Structure

The project is organized as a monorepo using npm workspaces:

- `packages/cli`: Command-line interface for managing NativeCN components
- `packages/lib`: Utility functions and common code
- `examples/`: Example applications for testing and showcasing components
  - `examples/expo/nativecn`: Expo example application
  - `examples/react-native-cli/nativecn`: React Native CLI example application (coming soon)

## Development Workflow

1. **Create a new branch for your changes**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

3. **Run linting and tests**

```bash
npm run lint
```

Tests are not yet implemented, but will be added in the future.
To run those tests, you will need to use the following command:

```bash
npm run test
```

4. **Commit your changes** (see Commit Message Guidelines below)

5. **Submit a pull request**

## Adding New Components

### Component Development Workflow

We follow a test-first approach for component development:

1. **Test in Example Apps First**: Before adding a new component to the library, you should first implement and test it in our example applications:

   - Expo Example App: `/examples/expo/nativecn`
   - React Native CLI Example App: _(coming soon)_

   This ensures components work properly in real application environments before being formalized in the component library.

2. **Once Tested**: After validating your component in the example apps, proceed with adding it to the library as described below.

### Adding Component to the Library

To add a new component:

1. Add component template files in `packages/cli/templates/<component-name>/`:

   - `index.tsx.template`: Component template
   - `styles.ts.template`: Styles template

2. Update the component dependencies in `packages/cli/src/commands/add.ts` if needed

3. Add component documentation

4. Add tests for the component

### Testing New Component Templates in Applications

When you add a new component template, it won't be immediately available in applications that use the CLI until the package is published. To test new components during development:

#### Using Example Apps

The recommended workflow is to test your components in our provided example apps:

1. Navigate to the appropriate example app:

   ```bash
   # For the Expo example
   cd examples/expo/nativecn

   # For the React Native CLI example (coming soon)
   # cd examples/react-native-cli/nativecn
   ```

2. Use one of the methods below to make your local CLI changes available to the example app.

#### Method 1: Build, Pack, and Install (Manual but Reliable)

1. Build the CLI package to include your new templates:

   ```bash
   cd packages/cli
   npm run build
   ```

2. Create a local package (tarball):

   ```bash
   npm pack
   ```

   This creates a file like `nativecn-cli-x.y.z.tgz` in the current directory.

3. Install this local package in your example application:

   ```bash
   cd /path/to/nativecn/examples/expo/nativecn
   npm install /path/to/nativecn/packages/cli/nativecn-cli-x.y.z.tgz
   ```

4. Now you can test your new component:
   ```bash
   npx @nativecn/cli add your-new-component
   ```

#### Method 2: Using npm link (Easier Workflow)

1. Build the CLI package:

   ```bash
   cd packages/cli
   npm run build
   ```

2. Link the package globally:

   ```bash
   npm link
   ```

3. In your example application, link to the global package:

   ```bash
   cd /path/to/nativecn/examples/expo/nativecn
   npm link @nativecn/cli
   ```

4. Test your new component:

   ```bash
   npx @nativecn/cli add your-new-component
   ```

5. When finished testing, unlink the package:
   ```bash
   npm unlink @nativecn/cli
   ```

#### Method 3: Direct Path Installation (Simplest)

1. Build the CLI package:

   ```bash
   cd packages/cli
   npm run build
   ```

2. Install the package directly from the local path:

   ```bash
   cd /path/to/nativecn/examples/expo/nativecn
   npm install /path/to/nativecn/packages/cli
   ```

3. Test your new component:
   ```bash
   npx @nativecn/cli add your-new-component
   ```

Remember to rebuild the CLI package after making changes to component templates!

### Finalizing Your Component

After thoroughly testing your component in the example apps:

1. Make any necessary refinements to your component templates
2. Ensure documentation is complete
3. Submit a pull request following the [Pull Request Process](#pull-request-process)

## Pull Request Process

1. Ensure your code follows the project's coding style
2. Update the documentation as needed
3. Include tests for new features
4. Verify that all tests pass
5. Submit a pull request to the `main` branch
6. Address any feedback from reviewers

## Coding Style

This project uses ESLint and Prettier for code formatting. Please follow the existing style:

- Use TypeScript for type safety
- Follow React Native best practices
- Keep components small and focused
- Use NativeWind for styling when possible
- Write clear and concise code comments

Run the formatting tools before committing:

```bash
npm run format
npm run lint:fix
```

## Commit Message Guidelines

We follow conventional commits to maintain a readable git history:

```
type(scope): short description

Optional longer description

Optional footer
```

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat(button): add new outline variant`

## Documentation

- Update README.md with any necessary information
- Document components with proper JSDoc comments
- Include usage examples for new components
- Provide clear and concise descriptions of props and behavior

## Releasing

The release process is managed by maintainers. However, contributors should:

- Update CHANGELOG.md with their changes
- Bump version numbers according to semver guidelines
- Test build processes before requesting a release

Thank you for contributing to NativeCN!
