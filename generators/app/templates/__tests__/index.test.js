import sayHello from '../src';

test('Says "Hello, World!" by default', () => {
  expect(sayHello()).toBe('Hello, World!');
});

test('Allows setting custom message', () => {
  expect(sayHello('Fresh')).toBe('Hello, Fresh!');
});
