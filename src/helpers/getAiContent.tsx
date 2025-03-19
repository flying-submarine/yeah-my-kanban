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
            if(type === "govFineQuery"){
                preUrl = "/chat/bi/api/stream"
            }
            const url = `${preUrl}?content=${prompts}&fileId=${fileId}&userId=${'123'}&sessionId=${chartId}`;
            const eventSource = new EventSource(url);

            eventSource.onmessage = function(event) {
                const data = JSON.parse(event.data);
                const {status,content={
                    optimize:"",
                    sql:"",
                    listString:"[]",
                    summer:"",
                    echarts:""
                }}:Data = data
                console.log(data, "data");
                let param:DataContent = {...content}
                const text = content.summer || ""
                if(status === "init"){
                    onContentMessage(text, false, {
                        ...param
                    });
                }
                // if(status === "optimize_generating"){
                //     onChatMessage(text, false, {
                //         ...param
                //     });
                // }
                // if(status === "optimize_complete"){
                //     onChatMessage(text, false, {
                //         ...param
                //     });
                // }
                // if(status === "sql_complete"){
                //     param.sql = content.sql
                //     onChatMessage(text, false, {
                //         ...param
                //     });
                // }
                // if(status === "list_complete"){
                //     param.listString = content.listString ? JSON.parse(content.listString) : [];
                //     onChatMessage(text, false, {
                //         ...param,
                //     });
                // }
                // if(status === "summer_generating"){
                //     onChatMessage(text, false, {
                //         ...param
                //     });
                // }
                // if(status === "summer_complete"){
                //     onChatMessage(text, false, {
                //         ...param,
                //     });
                // }
                onContentMessage(text, false, {
                    ...param
                });
                if(status === "echarts_complete"){
                    param.echarts = content.echarts;
                    onContentMessage(text, true, {
                        ...param,
                    });
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
