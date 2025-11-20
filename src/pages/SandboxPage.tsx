import { withProtected } from "@/utils/auth/use-protected";
import CodeEditor from "@monaco-editor/react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { useState } from "react";

const Sandbox = () => {
  const [code, setCode] = useState(
    `
export default function App() {
return (
<div style={{ padding: 20 }}>
<h1 style={{ color: 'teal' }}>Hello from Sandbox!</h1>
<p>Edit kode di sebelah kiri, hasil akan muncul otomatis.</p>
</div>
);
}
`.trim()
  );

  return (
    <div className="w-full min-h-screen flex">
      <div className="flex-1/2">
        <CodeEditor
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          beforeMount={(monaco) => {
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
              jsx: monaco.languages.typescript.JsxEmit.React,
              reactNamespace: "React",
              allowNonTsExtensions: true,
            });
          }}
        />
      </div>
      <div className="flex-1/2">
        <h2>Preview</h2>
        <SandpackProvider
          template="react"
          files={{
            "/App.js": code,
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

const SandboxPage = withProtected(Sandbox);
export default SandboxPage;
