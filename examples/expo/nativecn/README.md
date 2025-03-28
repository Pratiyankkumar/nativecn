# NativeCN Test App Expo -

This is a test app for the NativeCN component library. It is built with Expo and NativeWind.

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Features

- Theme support (light/dark mode)
- Tailwind-powered styling with NativeWind

## Documentation

To test a component from the CLI package, run the following command:

```bash
npm i ../../../packages/cli
```

Then, run the following command to test a component:

```bash
npx @nativecn/cli add <component-name>
```

For example, to test the Button component, run the following command:

```bash
npx @nativecn/cli add button
```

This will add the Button component to the app, after which you can run the app and create a test tsx file to see the component in action.

## Contributing

Think of this app as a testing playground for the components you wish to add to the library. Ideally, you should first create a component in this app, thoroughly test it out and then add it to the library.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
