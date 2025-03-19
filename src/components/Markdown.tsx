import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { Prism } from "react-syntax-highlighter";
import { setClipboardText } from "../helpers/setClipboardText";
import { a11yDark as style } from "react-syntax-highlighter/dist/esm/styles/prism";
import userThrottle from "../helpers/userThrottle";
import { useEffect, useState } from "react";
import userDebounce from "../helpers/userDebounce";
import type { Point } from "unist";
import { isObjectEqual } from "../helpers/isObjectEqual";
import { getPythonResult } from "../helpers/getPythonResult";
import { PyodideInterface } from "pyodide";
import { getPythonRuntime } from "../helpers/getPythonRuntime";
import { useTranslation } from "react-i18next";

interface MarkdownProps {
    readonly className?: string;
    // readonly typingEffect: string;
    // readonly pythonRepoUrl: string;
    // readonly pythonRuntime: PyodideInterface | null;
    // readonly onPythonRuntimeCreated: (pyodide: PyodideInterface) => void;
    readonly children: string;
}

const TraceLog = "😈 [TRACE]";
const DebugLog = "🚀 [DEBUG]";
const ErrorLog = "🤬 [ERROR]";
const PythonScriptDisplayName = "script.py";
const RunnerResultPlaceholder = `\n${DebugLog} Running Python Script...`;
const TypingEffectPlaceholder = "❚";
const ShellPrompt = `[user@${Math.random().toString(16).slice(-12)} ~]$ `;

export const Markdown = (props: MarkdownProps) => {
    const {
        className,
        children,
    } = props;

    return (
        <ReactMarkdown
            className={`prose text-sm lg:prose-base max-w-[100%] break-words ${
                className ?? ""
            }`}
            children={children}
            urlTransform={(url) => url}
        />
    );
};
