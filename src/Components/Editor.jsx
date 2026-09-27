// src/Components/Editor.jsx
import React, { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import ACTIONS from '../Action';

/**
 * Monaco-based collaborative code editor.
 * Props:
 *   socket  - socket.io client instance (passed from EditorPage)
 *   roomId  - current room id
 */
const Editor = ({ socket, roomId }) => {
  const editorRef = useRef(null);
  // flag to avoid echo: when we set value from remote, we don't emit back
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!socket) return;

    // When we first join, server sends current code
    const handleSync = ({ code }) => {
      if (editorRef.current && code !== undefined) {
        isRemoteUpdate.current = true;
        editorRef.current.setValue(code);
        isRemoteUpdate.current = false;
      }
    };

    // When another user types, update our editor
    const handleCodeChange = ({ code }) => {
      if (editorRef.current && code !== undefined) {
        isRemoteUpdate.current = true;
        editorRef.current.setValue(code);
        isRemoteUpdate.current = false;
      }
    };

    socket.on('sync-code', handleSync);
    socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);

    return () => {
      socket.off('sync-code', handleSync);
      socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
    };
  }, [socket]);

  // Called every time the user edits the code
  const handleEditorChange = (value) => {
    if (isRemoteUpdate.current) return; // don't echo remote changes
    if (!socket) return;
    socket.emit(ACTIONS.CODE_CHANGE, { roomId, code: value });
  };

  // Save the Monaco editor instance so we can call setValue later
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue="// Start coding here..."
      theme="vs-dark"
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        wordWrap: 'on',
        fontSize: 16,
        scrollBeyondLastLine: false,
      }}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
    />
  );
};

export default Editor;
