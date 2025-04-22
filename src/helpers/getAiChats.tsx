import { BaseParams, Part } from "@google/generative-ai";
import { SessionHistory } from "../store/sessions";
import { asyncSleep } from "./asyncSleep";
import getLocalStorage from "./getLocalStorage";

interface DataContent {
  optimize?: string;
  sql?: string;
  listString?: string;
  summer?: string;
  echarts?: string;
}

interface Data {
  status: string;
  content?: DataContent;
}

const readStreamResponse = async (
    response: Response,
    onChunk: (chunk: string, done: boolean) => void
  ) => {
    const reader = response.body?.getReader();
    if (!reader) return;
  
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
  
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
  
      // 拆分行（考虑跨 chunk 场景）
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? ""; // 最后一行可能是未完成的
  
      for (const line of lines) {
        // 只处理以 `data:` 开头的行
        if (line.startsWith("data:")) {
          const content = line.slice(5).trim();
  
          if (content === "[DONE]") {
            onChunk("", true); // 最后结束
            return;
          }
  
          if (content) {
            onChunk(content, false);
          }
        }
      }
    }
};
  
const handleEventSourceStream = (
  url: string,
  onChatMessage: (message: string, end: boolean, params: object) => void
) => {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data: Data = JSON.parse(event.data);
      const content = data.content ?? {
        optimize: "",
        sql: "",
        listString: "[]",
        summer: "",
        echarts: "",
      };

      const param: DataContent = { ...content };
      const text = content.summer || "";

      if (data.status === "init") {
        onChatMessage(text, false, param);
      }

      onChatMessage(text, false, param);

      if (data.status === "total_complete") {
        param.echarts = content.echarts;
        onChatMessage(text, true, param);
      }
    } catch (e) {
      console.error("解析 SSE 消息失败：", e);
    }
  };

  eventSource.onerror = (err) => {
    console.error("EventSource failed:", err);
    eventSource.close();
  };
};

export const getAiChats = async (
  type: string,
  history: SessionHistory[],
  prompts: string | Array<string | Part>,
  chartId: string,
  options: BaseParams,
  onChatMessage: (message: string, end: boolean, params: object) => void
) => {
  try {
    const userId = getLocalStorage("userIndex", "", false).replaceAll('"', "");

    if (type === "personalInfoQuery") {
      const res = await fetch("/chatMuti/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId:"wl",
          message: typeof prompts === "string" ? prompts : JSON.stringify(prompts),
        }),
      });

      if (!res.ok) {
        throw new Error(`请求失败，状态码: ${res.status}`);
      }

    //   await readStreamResponse(res, (chunk, done) => {
    //     onChatMessage(chunk, done, {});
    //   });
        let fullMessage = "";
        await readStreamResponse(res, (chunk, done) => {
            if (done) {
                console.log("完整内容：", fullMessage);
                onChatMessage(fullMessage, done, {});
            } else {
                fullMessage += chunk;
                console.log("追加片段：", chunk);
                onChatMessage(fullMessage, done, {});

            }
        });
    } else {
      const preUrl = "/dda/chat/bi/api/stream";
      const url = `${preUrl}?content=${encodeURIComponent(
        typeof prompts === "string" ? prompts : JSON.stringify(prompts)
      )}&userId=${userId}&sessionId=${chartId}`;

      handleEventSourceStream(url, onChatMessage);
    }
  } catch (e) {
    const err = e as Error;
    console.error("getAiChats 错误:", err);
    onChatMessage(err.message, true, {});
  }
};
