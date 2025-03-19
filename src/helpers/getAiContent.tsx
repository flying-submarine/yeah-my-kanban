import { GenerativeContentBlob, GenerativeModel } from "@google/generative-ai";
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
export const getAiContent = async (
    type: string,
    prompts: string,
    fileId: string,
    inlineData: GenerativeContentBlob,
    chartId: string,
    onContentMessage: (message: string, end: boolean,params:Object) => void
) => {
    
    const TypeWriterEffectThreshold = 30;
    try {
        let preUrl = "/chat/multi/api/stream"
          
            const url = `${preUrl}?content=${prompts}&fileId=${fileId}&userId=${'123'}&sessionId=${chartId}`;
            const eventSource = new EventSource(url);

            eventSource.onmessage = function(event) {
                const data = JSON.parse(event.data);
             
                const {status,content} = data
                console.log(data, "data");
                if(status === "generating"){
                    onContentMessage(content, false, {});
                }
             
                onContentMessage(content, false, {});
                if(status === "complete"){
                    onContentMessage(content, true, {});
                }
            };
            eventSource.onerror = function(err) {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
    } catch (e) {
        const err = e as any;
        onContentMessage(err.message, true,{});
    }
};
