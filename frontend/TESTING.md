# Testing Guide

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test AutoWheelLogo

# Run tests matching a pattern
npm test -- --testNamePattern="validation"
```

## Test Structure

```
src/
  components/
    __tests__/
      AutoWheelLogo.test.tsx
      ErrorBoundary.test.tsx
      LoadingSpinner.test.tsx
  hooks/
    __tests__/
      useDebounce.test.tsx
  validation/
    __tests__/
      inquirySchema.test.tsx
```

## Writing Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import useMyHook from '../useMyHook';

describe('useMyHook', () => {
  it('returns expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBeDefined();
  });
});
```

### Schema/Validation Tests

```typescript
import { mySchema } from '../mySchema';

describe('mySchema', () => {
  it('validates correct data', () => {
    const result = mySchema.safeParse({ field: 'value' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid data', () => {
    const result = mySchema.safeParse({ field: '' });
    expect(result.success).toBe(false);
  });
});
```

## Testing Best Practices

1. **Arrange-Act-Assert Pattern**
   - Arrange: Set up test data
   - Act: Execute the code being tested
   - Assert: Verify the results

2. **Test Isolation**
   - Each test should be independent
   - Use `beforeEach` and `afterEach` for setup/cleanup

3. **Descriptive Test Names**
   - Use clear, descriptive names
   - Format: "it should [expected behavior] when [condition]"

4. **Coverage Goals**
   - Aim for >80% code coverage
   - Focus on critical paths
   - Don't test implementation details

5. **Mock External Dependencies**
   - Mock API calls
   - Mock localStorage
   - Mock external libraries when needed

## Test Coverage

View coverage report:
```bash
npm test -- --coverage --watchAll=false
```

Coverage report will be generated in `coverage/` directory.

## Continuous Integration

Tests should run automatically on:
- Pre-commit (using Husky)
- Pull requests
- Before deployment

## Common Testing Patterns

### Testing Forms

```typescript
const user = userEvent.setup();

await user.type(screen.getByLabelText('Email'), 'test@example.com');
await user.click(screen.getByRole('button', { name: /submit/i }));

expect(screen.getByText('Success')).toBeInTheDocument();
```

### Testing Async Operations

```typescript
it('loads data asynchronously', async () => {
  render(<MyComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  const data = await screen.findByText('Data loaded');
  expect(data).toBeInTheDocument();
});
```

### Testing Error States

```typescript
it('displays error message on failure', async () => {
  // Mock API to return error
  jest.spyOn(api, 'getData').mockRejectedValue(new Error('Failed'));
  
  render(<MyComponent />);
  
  const error = await screen.findByText('Failed to load');
  expect(error).toBeInTheDocument();
});
```

## Resources

- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
