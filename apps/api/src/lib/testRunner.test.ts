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

  it('formats Python None as "None" (not "null")', () => {
    const code = `def maybe():\n    return None`;
    const result = runTests(code, [
      { expected: 'None', isHidden: false, inputData: 'maybe()' },
    ]);
    expect(result.passed).toBe(true);
  });

  it('formats Python dicts as single-quoted JSON-like literals', () => {
    const code = `def make():\n    return {"a": 1, "b": 2}`;
    const result = runTests(code, [
      { expected: "{'a':1,'b':2}", isHidden: false, inputData: 'make()' },
    ]);
    expect(result.passed).toBe(true);
  });

  it('formats nested dict-with-list correctly', () => {
    const code = `def make():\n    return {"items": [1, 2, 3]}`;
    const result = runTests(code, [
      { expected: "{'items':[1,2,3]}", isHidden: false, inputData: 'make()' },
    ]);
    expect(result.passed).toBe(true);
  });

  it('strips parent process env from spawned python (security)', () => {
    const sentinel = 'should-not-leak-' + Date.now();
    process.env.SECRET_FIXTURE = sentinel;
    try {
      const code = `def check():\n    import os\n    return os.environ.get('SECRET_FIXTURE', 'STRIPPED')`;
      const result = runTests(code, [
        { expected: 'STRIPPED', isHidden: false, inputData: 'check()' },
      ]);
      expect(result.passed).toBe(true);
    } finally {
      delete process.env.SECRET_FIXTURE;
    }
  });
});

describe('runTests — Java', () => {
  it('passes a simple Solution.method test', () => {
    const code = `public class Solution {
  public static String helloWorld() {
    return "Hello, World!";
  }
}`;
    const result = runTests(
      code,
      [
        { inputData: 'Solution.helloWorld()', expected: 'Hello, World!', isHidden: false },
        { inputData: 'Solution.helloWorld().length()', expected: '13', isHidden: true },
        { inputData: 'Solution.helloWorld().equals("Hello, World!")', expected: 'true', isHidden: true },
      ],
      'java',
    );
    expect(result.passed).toBe(true);
  });

  it('reports compilation errors clearly', () => {
    const code = `public class Solution {
  public static String broken() {
    return "missing semicolon"
  }
}`;
    const result = runTests(
      code,
      [{ inputData: 'Solution.broken()', expected: 'x', isHidden: false }],
      'java',
    );
    expect(result.passed).toBe(false);
    expect(result.testResults[0].actual.toLowerCase()).toMatch(/error|';'/);
  });

  it('reports a runtime exception as the test result', () => {
    const code = `public class Solution {
  public static int divide() {
    return 1 / 0;
  }
}`;
    const result = runTests(
      code,
      [{ inputData: 'Solution.divide()', expected: '0', isHidden: false }],
      'java',
    );
    expect(result.passed).toBe(false);
    expect(result.testResults[0].actual.toLowerCase()).toContain('arithmetic');
  });

  it('handles parameter passing and numeric returns', () => {
    const code = `public class Solution {
  public static int add(int a, int b) {
    return a + b;
  }
}`;
    const result = runTests(
      code,
      [
        { inputData: 'Solution.add(2, 3)', expected: '5', isHidden: false },
        { inputData: 'Solution.add(-1, 1)', expected: '0', isHidden: true },
      ],
      'java',
    );
    expect(result.passed).toBe(true);
  });
}, 30_000);

describe('runTests — JavaScript', () => {
  it('passes a simple function-return test', () => {
    const code = `function helloWorld() { return "Hello, World!"; }`;
    const result = runTests(
      code,
      [{ inputData: 'helloWorld()', expected: '"Hello, World!"', isHidden: false }],
      'javascript',
    );
    expect(result.passed).toBe(true);
  });

  it('matches typeof and .length test cases', () => {
    const code = `function helloWorld() { return "Hello, World!"; }`;
    const result = runTests(
      code,
      [
        { inputData: 'typeof helloWorld()', expected: '"string"', isHidden: false },
        { inputData: 'helloWorld().length', expected: '13', isHidden: true },
      ],
      'javascript',
    );
    expect(result.passed).toBe(true);
  });

  it('fails when JS function returns the wrong value', () => {
    const code = `function greet(n) { return "Hi " + n; }`;
    const result = runTests(
      code,
      [{ inputData: 'greet("Alice")', expected: '"Hello, Alice!"', isHidden: false }],
      'javascript',
    );
    expect(result.passed).toBe(false);
    expect(result.testResults[0].actual).toBe('"Hi Alice"');
  });

  it('captures a thrown error as the test result', () => {
    const code = `function bad() { throw new Error("nope"); }`;
    const result = runTests(
      code,
      [{ inputData: 'bad()', expected: '"ok"', isHidden: false }],
      'javascript',
    );
    expect(result.passed).toBe(false);
    expect(result.testResults[0].actual).toContain('nope');
  });

  it('handles arrays and objects via JSON.stringify', () => {
    const code = `function make() { return { items: [1, 2, 3] }; }`;
    const result = runTests(
      code,
      [{ inputData: 'make()', expected: '{"items":[1,2,3]}', isHidden: false }],
      'javascript',
    );
    expect(result.passed).toBe(true);
  });

  it('strips parent process env from spawned node (security)', () => {
    const sentinel = 'should-not-leak-' + Date.now();
    process.env.SECRET_FIXTURE = sentinel;
    try {
      const code = `function check() { return process.env.SECRET_FIXTURE || "STRIPPED"; }`;
      const result = runTests(
        code,
        [{ inputData: 'check()', expected: '"STRIPPED"', isHidden: false }],
        'javascript',
      );
      expect(result.passed).toBe(true);
    } finally {
      delete process.env.SECRET_FIXTURE;
    }
  });
});
