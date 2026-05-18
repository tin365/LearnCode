import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
  pre({ children }) {
    return (
      <pre className="my-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-slate-100 p-3 text-sm font-mono leading-relaxed">
        {children}
      </pre>
    );
  },
  code({ className, children, ...props }) {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="break-words rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800"
        {...props}
      >
        {children}
      </code>
    );
  },
};
