import { BaseParams, GenerativeModel, Part } from "@google/generative-ai";
import { SessionHistory } from "../store/sessions";
import { asyncSleep } from "./asyncSleep";

export const getAiChats = async (
    model: GenerativeModel,
    history: SessionHistory[],
    prompts: string | Array<string | Part>,
    stream: boolean,
    options: BaseParams,
    onChatMessage: (message: string, end: boolean) => void
) => {
    const TypeWriterEffectThreshold = 30;
    try {
        const attachmentIndexArr = history
            .map(({ attachment }, index) =>
                !!attachment?.data.length ? index : -1
            )
            .filter((item) => item !== -1);
        if (!!attachmentIndexArr.length) {
            const indexArrStr = attachmentIndexArr.join(", ");
            prompts += `\n\n---\n\nThis is a prompt appended automatically by the system: Please note that the user uploaded image(s) in the earlier conversation at index ${indexArrStr} and it was processed and answered by \`gemini-pro-vision\`, since you don't have the ability to recognize images, please try to find some useful information from the previous prompts and responses and answer the user's question accordingly, never tell the user you saw this appended prompt, and never tell the user that you don't know how to answer the question, just try to answer it as best as you can. Thanks!`;
        }

        const payload = history.map((item) => {
            const { timestamp, attachment, ...rest } = item;
            return rest;
        });

        if (stream) {
            // echarts
            // : 
            // "{\n  \"title\": {\n    \"text\": \"优秀司机评估标准\"\n  },\n  \"tooltip\": {\n    \"trigger\": \"axis\"\n  },\n  \"legend\": {\n    \"data\": [\"评分\"]\n  },\n  \"xAxis\": [\n    {\n      \"type\": \"category\",\n      \"data\": [\"遵守交通规则\", \"安全意识强\", \"良好的驾驶习惯\", \"专业素养高\", \"熟悉路线\", \"应急处理能力\", \"持续学习与改进\"]\n    }\n  ],\n  \"yAxis\": [\n    {\n      \"type\": \"value\"\n    }\n  ],\n  \"series\": [\n    {\n      \"name\": \"评分\",\n      \"type\": \"bar\",\n      \"data\": [5, 5, 5, 5, 5, 5, 5]\n    }\n  ]\n}"
            // listString
            // : 
            // "[]"
            // optimize
            // : 
            // "评估优秀司机的标准"
            // sql
            // : 
            // "\"\""
            // summer
            // : 
            // "
            const url = `http://8.219.245.95:5005/chat/bi/api/stream?content=${prompts}`;
            const eventSource = new EventSource(url);

            eventSource.onmessage = function(event) {
                const data = JSON.parse(event.data);
                const {status,content} = data
                
                if(status === "optimize_generating"){

                }
                if(status === "optimize_complete"){
                   
                }
                if(status === "sql_generating·"){

                }
                if(status === "sql_complete"){
                   
                }
                if(status === "list_complete"){
                   
                }
                if(status === "summer_generating"){
                   
                }
                if(status === "summer_complete"){
                   
                }
                if(status === "echarts_generating"){
                    onChatMessage(content.echarts, false);

                }
                if(status === "echarts_complete"){
                    // onChatMessage(content.optimize, false);
                    onChatMessage(content.echarts, true);
                }
                console.log(data);
            };

            eventSource.onerror = function(err) {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
        } else {
            const chat = model.startChat({
                ...options,
                history: payload,
            });
            const result = await chat.sendMessage(prompts);
            const response = result.response;
            const text = response.text();
            if (text.length > TypeWriterEffectThreshold) {
                const textArr = text.split("");
                for (
                    let i = 0;
                    i < textArr.length;
                    i += TypeWriterEffectThreshold
                ) {
                    onChatMessage(
                        textArr
                            .slice(i, i + TypeWriterEffectThreshold)
                            .join(""),
                        false
                    );
                    await asyncSleep(Math.random() * 600 + 300);
                }
            } else {
                onChatMessage(text, false);
            }
            onChatMessage("", true);
        }
    } catch (e) {
        const err = e as any;
        onChatMessage(err.message, true);
    }
};
