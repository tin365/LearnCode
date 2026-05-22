import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

// Tailwind's md: breakpoint.
const MOBILE_QUERY = '(max-width: 767px)';

export function CodeEditor({ value, onChange, readOnly }: CodeEditorProps) {
  const editorRef = useRef<{ layout: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use 16px on mobile so iOS Safari doesn't auto-zoom on focus
  // (it zooms on any text input below 16px). 14px on desktop matches
  // the rest of the editor's compact density.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

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
        defaultLanguage="python"
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
