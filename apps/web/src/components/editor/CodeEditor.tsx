import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useMediaQuery, MOBILE_QUERY } from '@/hooks/useMediaQuery';

// Watch the <html class="dark"> toggle set by useTheme(). We can't
// import the React hook here (it's already used at module mount) and
// we want CodeEditor to react to live changes, so we subscribe to
// MutationObserver on the html element instead.
function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document === 'undefined'
      ? false
      : document.documentElement.classList.contains('dark'),
  );
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const obs = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  /** Monaco language id — defaults to 'python' for back-compat. */
  language?: 'python' | 'javascript' | 'java' | 'rust';
  /** Bound to Cmd/Ctrl+Enter inside the editor. */
  onRun?: () => void;
  /** Bound to Cmd/Ctrl+Shift+Enter inside the editor. */
  onSubmit?: () => void;
}

// Minimal subset of the Monaco editor instance we actually call. Avoids
// importing monaco-editor types into the bundle.
interface MonacoEditor {
  layout: () => void;
  addCommand: (keybinding: number, handler: () => void) => void;
}

// Minimal subset of the Monaco namespace.
interface MonacoNs {
  KeyMod: { CtrlCmd: number; Shift: number };
  KeyCode: { Enter: number };
}

export function CodeEditor({
  value,
  onChange,
  readOnly,
  language = 'python',
  onRun,
  onSubmit,
}: CodeEditorProps) {
  const editorRef = useRef<MonacoEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 16px on mobile so iOS Safari doesn't auto-zoom on focus; 14px on
  // desktop to keep the editor compact.
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isDark = useIsDark();

  // Keep refs to the latest callbacks so the Monaco commands (registered
  // once on mount) always invoke the freshest closures — without this,
  // pressing Cmd+Enter would call the handler from the first render
  // forever.
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);
  useEffect(() => {
    onRunRef.current = onRun;
    onSubmitRef.current = onSubmit;
  }, [onRun, onSubmit]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      editorRef.current?.layout();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function handleEditorDidMount(editor: MonacoEditor, monaco: MonacoNs) {
    editorRef.current = editor;
    editor.layout();
    // CtrlCmd resolves to Cmd on Mac and Ctrl elsewhere automatically.
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current?.();
    });
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        onSubmitRef.current?.();
      },
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full min-h-0">
      <Editor
        height="100%"
        // Use `language` (not `defaultLanguage`) so Monaco re-tokenises
        // when the user navigates between a Python and a JS problem
        // without unmounting the editor.
        language={language}
        theme={isDark ? 'vs-dark' : 'vs'}
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
