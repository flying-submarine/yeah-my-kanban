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
    type: string,
    history: SessionHistory[],
    prompts: string | Array<string | Part>,
    chartId: string,
    options: BaseParams,
    onChatMessage: (message: string, end: boolean,params:Object) => void
) => {
    try {
        const attachmentIndexArr = history
            .map(({ attachment }, index) =>
                !!attachment?.data.length ? index : -1
            )
            .filter((item) => item !== -1);

        if (type === "personalInfoQuery") {
            let preUrl = "/dda/chat/multi/api/stream"
           
            const url = `${preUrl}?content=${prompts}&userId=${'777'}&sessionId=${chartId}`;
            const eventSource = new EventSource(url);

            eventSource.onmessage = function(event) {
                const data = JSON.parse(event.data);
                const {status,content} = data
                console.log(data, "data");
                if(status === "generating"){
                    onChatMessage(content, false, {});
                }
             
                onChatMessage(content, false, {});
                if(status === "complete"){
                    onChatMessage(content, true, {});
                }
            };
            eventSource.onerror = function(err) {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
        } 
        else {
            let  preUrl = "/dda/chat/bi/api/stream"

            const url = `${preUrl}?content=${prompts}&userId=${'777'}&sessionId=${chartId}`;
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
                let param:DataContent = {...content}
                const text = content.summer || ""
                if(status === "init"){
                    onChatMessage(text, false, {
                        ...param
                    });
                }
                onChatMessage(text, false, {
                    ...param
                });
                if(status === "total_complete"){
                    param.echarts = content.echarts;
                    onChatMessage(text, true, {
                        ...param,
                    });
                }
            };

            eventSource.onerror = function(err) {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
        }
    } catch (e) {
        const err = e as any;
        onChatMessage(err.message, true,{});
    }
};
