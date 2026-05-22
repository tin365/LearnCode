import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useMediaQuery, MOBILE_QUERY } from '@/hooks/useMediaQuery';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  /** Monaco language id — defaults to 'python' for back-compat. */
  language?: 'python' | 'javascript' | 'java' | 'rust';
}

export function CodeEditor({ value, onChange, readOnly, language = 'python' }: CodeEditorProps) {
  const editorRef = useRef<{ layout: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 16px on mobile so iOS Safari doesn't auto-zoom on focus; 14px on
  // desktop to keep the editor compact.
  const isMobile = useMediaQuery(MOBILE_QUERY);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      editorRef.current?.layout();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function handleEditorDidMount(editor: { layout: () => void }) {
    editorRef.current = editor;
    editor.layout();
  }

  return (
    <div ref={containerRef} className="h-full w-full min-h-0">
      <Editor
        height="100%"
        // Use `language` (not `defaultLanguage`) so Monaco re-tokenises
        // when the user navigates between a Python and a JS problem
        // without unmounting the editor.
        language={language}
        theme="vs"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: isMobile ? 16 : 14,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          lineNumbers: 'on',
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          tabSize: 4,
          insertSpaces: true,
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'gutter',
          readOnly,
        }}
      />
    </div>
  );
}
