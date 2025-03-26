# NativeCN Documentation

This documentation site showcases the components we are building for React Native, providing examples, usage guidelines, and API references.

## Overview

NativeCN is a collection of React Native components designed to help developers build beautiful mobile applications more efficiently, inspired by [shadcn/ui](https://ui.shadcn.com/). This documentation provides detailed information about each component, including:

- Component examples
- Usage guidelines
- API references
- Implementation details

## Local Development

First, run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit localhost:3000.

## Component Development Best Practices

When developing components for NativeCN, keep these important guidelines in mind:

1. **Handle undefined props safely**: Always include null checks when accessing nested properties based on props like `mode` or `variant`. This prevents errors when components are loaded directly or when context values aren't immediately available.

2. **Provide fallback values**: For components that rely on context values, always provide sensible defaults when the context might be undefined.

3. **Defensive styling access**: When accessing style objects with dynamic keys (like `buttonClassNames[`${mode}_variant_${variant}`]`), use conditional checks to ensure the key exists before accessing.

4. **Handle server-side rendering**: Components should work properly during SSR when certain browser-specific APIs or context values might not be available.

These practices help ensure components remain robust across different navigation patterns and loading scenarios.

## Credits

This documentation site is built using [Nextra](https://nextra.site), a Next.js-based documentation framework. The original template was created by [Shu Ding](https://github.com/shuding/nextra-docs-template).

## License

This project is licensed under the MIT License.
