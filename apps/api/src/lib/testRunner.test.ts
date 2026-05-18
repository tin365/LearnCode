import { describe, it, expect } from 'vitest';
import { calculateScore, runTests } from './testRunner.js';

describe('calculateScore', () => {
  it('returns 0 when not passed', () => {
    expect(calculateScore(false, 0)).toBe(0);
  });

  it('returns 100 with no hints', () => {
    expect(calculateScore(true, 0)).toBe(100);
  });

  it('deducts 10 per hint', () => {
    expect(calculateScore(true, 1)).toBe(90);
    expect(calculateScore(true, 2)).toBe(80);
  });

  it('minimum score is 70 with 3 hints', () => {
    expect(calculateScore(true, 3)).toBe(70);
    expect(calculateScore(true, 5)).toBe(70);
  });
});

describe('runTests', () => {
  it('runs greet function', () => {
    const code = `def hello_world():\n    return "Hello, World!"`;
    const result = runTests(code, [
      { expected: 'Hello, World!', isHidden: false, inputData: 'str(hello_world())' },
    ]);
    expect(result.passed).toBe(true);
  });
});
