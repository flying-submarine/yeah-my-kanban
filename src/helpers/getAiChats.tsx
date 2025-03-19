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
    // const TypeWriterEffectThreshold = 30;
    try {
        const attachmentIndexArr = history
            .map(({ attachment }, index) =>
                !!attachment?.data.length ? index : -1
            )
            .filter((item) => item !== -1);
        // if (!!attachmentIndexArr.length) {
        //     const indexArrStr = attachmentIndexArr.join(", ");
        //     prompts += `\n\n---\n\nThis is a prompt appended automatically by the system: Please note that the user uploaded image(s) in the earlier conversation at index ${indexArrStr} and it was processed and answered by \`gemini-pro-vision\`, since you don't have the ability to recognize images, please try to find some useful information from the previous prompts and responses and answer the user's question accordingly, never tell the user you saw this appended prompt, and never tell the user that you don't know how to answer the question, just try to answer it as best as you can. Thanks!`;
        // }

        // const payload = history.map((item) => {
        //     const { timestamp, attachment, ...rest } = item;
        //     return rest;
        // });

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
                console.log(data, "data");
                let param:DataContent = {...content}
                const text = content.summer || ""
                if(status === "init"){
                    onChatMessage(text, false, {
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
                onChatMessage(text, false, {
                    ...param
                });
                if(status === "echarts_complete"){
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
