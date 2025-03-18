import { BaseParams, GenerativeModel, Part } from "@google/generative-ai";
import { SessionHistory } from "../store/sessions";
import { asyncSleep } from "./asyncSleep";


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
export const getAiChats = async (
    model: GenerativeModel,
    history: SessionHistory[],
    prompts: string | Array<string | Part>,
    stream: boolean,
    options: BaseParams,
    onChatMessage: (message: string, end: boolean, params: Object) => void
) => {
    const TypeWriterEffectThreshold = 20; // 每次输出的字符数量
    let accumulatedText = ''; // 用来拼接返回的文本

    try {
        if (true) { // 保持使用 EventSource 流式获取数据
            const url = `/chat/bi/api/stream?content=${prompts}`;
            const eventSource = new EventSource(url);

            eventSource.onmessage = async function (event) {
                const data = JSON.parse(event.data);
                const { status, content = { optimize: "", sql: "", listString: "[]", summer: "", echarts: "" } }: Data = data;

                console.log(data, "data");

                let param: DataContent = { ...content };
                const text = content.summer || "";
                accumulatedText += text;
                // 模拟打字机效果：逐字输出
                const outputText = async (accumulatedText: string) => {
                    if (text.length > TypeWriterEffectThreshold) {
                        const textArr = text.split("");
                        for (let i = 0; i < textArr.length; i += TypeWriterEffectThreshold) {
                            onChatMessage(
                                textArr.slice(i, i + TypeWriterEffectThreshold).join(""),
                                false,
                                { ...param }
                            );
                            await asyncSleep(Math.random() * 0 + 10); // 模拟打字间隔
                        }
                    } else {
                        onChatMessage(accumulatedText, false, { ...param });
                    }
                    onChatMessage("", true, { ...param }); // 结束标志
                };

                if (status === "init") {
                    await outputText(accumulatedText);
                }

                // 其他状态处理（如有需要的话）
                if (status === "echarts_complete") {
                    param.echarts = content.echarts;
                    await outputText(accumulatedText); // 输出最终结果
                    // onChatMessage(accumulatedText, true, { ...param });
                }
            };

            eventSource.onerror = function (err) {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
        }
    } catch (e) {
        const err = e as any;
        onChatMessage(err.message, true, {});
    }
};
