import { GenerativeContentBlob } from "@google/generative-ai";
import { createSlice } from "@reduxjs/toolkit";

interface DataContent {
    optimize?: string;
    sql?: string;
    listString?: string;
    summer?: string;
    echarts?: string;
}
export interface SessionHistory {
    readonly role: string;
    readonly parts: string;
    readonly timestamp: number;
    readonly attachment?: GenerativeContentBlob;
    readonly title?: string;
    readonly params?: DataContent;
}


export type Sessions = Record<string, SessionHistory[]>;
export const initialSessions: Sessions = {};

const slice = createSlice({
    name: "sessions",
    initialState: { sessions: initialSessions },
    reducers: {
        onUpdate: (state, action) => {
            const { payload } = action;
            state.sessions = payload;
        },
    },
});

export default slice.reducer;
export const { onUpdate } = slice.actions;
