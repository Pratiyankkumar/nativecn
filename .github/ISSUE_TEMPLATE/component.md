---
name: Component Development
about: Template for creating a new NativeCN component
title: 'feat(component): Add [Component Name] component'
labels: component, enhancement
assignees: ''
---

## Component Description

<!-- Provide a clear description of the component and its purpose -->

**Component Name:** [e.g., Button, Calendar, etc.]

**Purpose:** [Brief description of what this component does and when it should be used]

**Similar Components:** [Links to similar components in other libraries for reference, if any]

## Technical Requirements

### Core Features

- [ ] Basic component functionality
- [ ] Props interface defined with TypeScript
- [ ] NativeWind styling support
- [ ] Proper component state management
- [ ] Accessibility support (ARIA attributes, screen reader compatibility)

> **Note:** Reference [shadcn/ui](https://ui.shadcn.com/docs/components) default theme for styling guidelines, props structure, and additional features inspiration.

### Variants/Props

<!-- List the required variants and props -->

- [ ] Variant 1: [Description]
- [ ] Variant 2: [Description]
- [ ] ...

### Development Checklist

- [ ] Implement in example app first
  - [ ] Test in Expo example (`examples/expo/nativecn`)
  - [ ] Verify functionality
  - [ ] Test different use cases
- [ ] Create component templates
  - [ ] `packages/cli/templates/<component-name>/index.tsx.template`
  - [ ] `packages/cli/templates/<component-name>/styles.ts.template`
- [ ] Update CLI dependencies if needed
- [ ] Test component addition via CLI
  - [ ] `npx @nativecn/cli add <component-name>`

## Documentation Requirements

- [ ] JSDoc comments for component and props
- [ ] Usage examples with code snippets
- [ ] Props documentation
- [ ] Styling guide
- [ ] Accessibility instructions
- [ ] Known limitations or caveats (if any)

## Testing Criteria

- [ ] Works in Expo environment
- [ ] Responsive behavior
- [ ] Touch interactions work as expected
- [ ] Accessibility features tested
- [ ] Different variants/props tested
- [ ] Error states handled properly

## Additional Notes

<!-- Any additional information, considerations, or resources -->

## Definition of Done

- [ ] Component implemented and tested in example app
- [ ] Component templates added to CLI
- [ ] Documentation complete
- [ ] PR submitted following contribution guidelines
- [ ] Code review feedback addressed
- [ ] All tests passing
