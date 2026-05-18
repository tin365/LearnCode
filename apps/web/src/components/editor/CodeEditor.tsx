import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, readOnly }: CodeEditorProps) {
  const editorRef = useRef<{ layout: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
          fontSize: 14,
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
