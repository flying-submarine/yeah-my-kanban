import { useEffect, useRef, useState } from "react";
import { globalConfig } from "./config/global";
import { Sidebar } from "./components/Sidebar";
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { InputArea } from "./components/InputArea";
import { routerConfig } from "./config/router";
import { RouterView } from "./components/RouterView";
import { Skeleton } from "./components/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { ReduxStoreProps } from "./config/store";
import { onUpdate as updateAI } from "./store/ai";
import { matchPath, useNavigate } from "react-router-dom";
import { saveMdToHtml } from "./helpers/saveMdToHtml";
import { getAiChats } from "./helpers/getAiChats";
import { modelConfig } from "./config/model";
import { initialSessions, onUpdate as updateSessions } from "./store/sessions";
import { getAiContent } from "./helpers/getAiContent";
import { GenerativeContentBlob } from "@google/generative-ai";
import { getBase64Img } from "./helpers/getBase64Img";
import { sendUserAlert } from "./helpers/sendUserAlert";
import { sendUserConfirm } from "./helpers/sendUserConfirm";
import { PageScroller } from "./components/PageScroller";
import { LoginForm } from "./components/LoginForm";
import siteLogo from "./assets/logo.svg";
import setLocalStorage from "./helpers/setLocalStorage";
import i18n, { i18nConfig } from "./config/i18n";
import { setUserLocale } from "./helpers/setUserLocale";
import { useTranslation } from "react-i18next";
import { getCurrentLocale } from "./helpers/getCurrentLocale";

const App = () => {
    const { t } = useTranslation();
    const { sse, title, passcodes } = globalConfig;
    const { header, site } = title;
    const { routes } = routerConfig;
    const { fallback, resources } = i18nConfig;
    const locales = Object.entries(resources).reduce((acc, [key, value]) => {
        acc[key] = value.label;
        return acc;
    }, {} as Record<string, string>);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessions = useSelector(
        (state: ReduxStoreProps) => state.sessions.sessions
    );
    const ai = useSelector((state: ReduxStoreProps) => state.ai.ai);
    const mainSectionRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const [currentLocale, setCurrentLocale] = useState(fallback);
    const [hasLogined, setHasLogined] = useState(false);
    const [uploadInlineData, setUploadInlineData] =
        useState<GenerativeContentBlob>({ data: "", mimeType: "" });
    const [sidebarExpand, setSidebarExpand] = useState(false && window.innerWidth > 768);

    const setCurrentLocaleToState = async () =>
        setCurrentLocale(await getCurrentLocale(i18n));

    const handleSwitchLocale = (locale: string) => setUserLocale(i18n, locale);

    const matchUrl = () => {
        const routes = [
            { path: '/govFineQuery/:id', label: 'govFineQuery' },
            { path: '/chat/:id', label: 'Personal-Info Query' },
            { path: '/', label: 'chat' },
            { path: '/video', label: 'video' }
        ];
    
        for (let route of routes) {
            if (matchPath(route.path, location.pathname)) {
                return route.label;
            }
        }
    
        return '';
    };

    const handleExportSession = (id: string) => {
        const session = sessions[id];
        if (session) {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const sessionTime = new Date(parseInt(id)).toLocaleString();
            const exportTime = new Date().toLocaleString();
            let exportData = `# ${header}\n\n---\n\n- ${t(
                "App.handleExportSession.user_timezone"
            )} ${timezone}\n- ${t(
                "App.handleExportSession.session_time"
            )} ${sessionTime}\n- ${t(
                "App.handleExportSession.export_time"
            )} ${exportTime}\n\n---\n\n`;
            session.forEach(({ role, parts, timestamp, attachment }) => {
                if (!!attachment?.data.length) {
                    const { data, mimeType } = attachment;
                    const base64ImgData = `data:${mimeType};base64,${data}`;
                    parts += `\n\n<img alt="" src="${base64ImgData}" />`;
                }
                const timeString = new Date(timestamp).toLocaleString();
                exportData += `## ${
                    role === "user"
                        ? t("App.handleExportSession.role_user")
                        : t("App.handleExportSession.role_model")
                }@${timeString}\n\n${parts}\n\n`;
            });
            saveMdToHtml(
                exportData,
                `${t("App.handleExportSession.filename_prefix")}_${site}_${id}`
            );
        } else {
            sendUserAlert(t("App.handleExportSession.export_failed"), true);
        }
    };

    const handleRenameSession = (id: string, newTitle: string) => {
        if (!ai.busy) {
            const _sessions = {
                ...sessions,
                [id]: [
                    { ...sessions[id][0], title: newTitle },
                    ...sessions[id].slice(1),
                ],
            };
            dispatch(updateSessions(_sessions));
        } else {
            sendUserAlert(t("App.handleRenameSession.not_available"), true);
        }
    };

    const handleDeleteSession = (id: string) => {
        if (!ai.busy) {
            sendUserConfirm(t("App.handleDeleteSession.confirm_message"), {
                title: t("App.handleDeleteSession.confirm_title"),
                confirmText: t("App.handleDeleteSession.confirm_button"),
                cancelText: t("App.handleDeleteSession.cancel_button"),
                onConfirmed: () => {
                    navigate(routes.index.prefix);
                    const _sessions = { ...sessions };
                    delete _sessions[id];
                    dispatch(updateSessions(_sessions));
                    sendUserAlert(t("App.handleDeleteSession.on_confirmed"));
                },
            });
        } else {
            sendUserAlert(t("App.handleDeleteSession.not_available"), true);
        }
    };

    const handlePurgeSessions = () => {
        sendUserConfirm(t("App.handlePurgeSessions.confirm_message"), {
            title: t("App.handlePurgeSessions.confirm_title"),
            confirmText: t("App.handlePurgeSessions.confirm_button"),
            cancelText: t("App.handlePurgeSessions.cancel_button"),
            onConfirmed: () => {
                navigate(routes.index.prefix);
                dispatch(updateSessions(initialSessions));
                dispatch(updateAI({ ...ai, busy: false }));
                sendUserAlert(t("App.handlePurgeSessions.on_confirmed"));
            },
        });
    };

    const handleLogout = () => {
        sendUserConfirm(t("App.handleLogout.confirm_message"), {
            title: t("App.handleLogout.confirm_title"),
            confirmText: t("App.handleLogout.confirm_button"),
            cancelText: t("App.handleLogout.cancel_button"),
            onConfirmed: () => {
                sendUserAlert(t("App.handleLogout.on_confirmed"),false,500);
                setHasLogined(false);
                setLocalStorage("passcode", "", false);
            },
        });
    };

    const handleUpload = async (file: File | null) => {
        console.log(file, "file");
        // const formData = new FormData();
        // if (file) {
        //     formData.append("file", file);
        // }
        // fetch('/file/upload', {
        //     method: 'POST',
        //     body: file
        // }).then(response => {         
        //     console.log(response, "response");
        // }).catch(error => {
        //     console.error('Error:', error);
        //     }
        // );
        if (file) {
            const formData = new FormData();
            formData.append('file', file); // 'file' 是服务器端用来接收文件的字段名
        
            fetch('/file/upload', {
                method: 'POST',
                body: formData,
            }).then(response => {         
                console.log(response, "response");
            }).catch(error => {
                console.error('Error:', error);
            });
        } else {
            // 如果没有选择文件，则根据需要设置默认值或执行其他操作
            setUploadInlineData({ data: "", mimeType: "" });
        }
        
    };

    const handleSubmit = async (prompt: string) => {
        if (!prompt.trim().length) {
            sendUserAlert(t("App.handleSubmit.invalid_message"), true);
            return;
        }
        const { prefix, uri, suffix } = routes.chat;
        const { hash, pathname } = window.location;


        let { id } = (matchPath(
            { path: `${prefix}${uri}${suffix}` },
            hash.replace("#", "") || pathname
        )?.params as { id: string }) ?? { id: Date.now().toString() };

        const match = matchPath('/govFineQuery/:id', hash.replace("#", "") || pathname);

        const chartId = match && match.params.id ? match.params.id : id;
        
        const sessionDate = new Date(parseInt(chartId));
        if (isNaN(sessionDate.getTime()) || sessionDate.getFullYear() < 2020) {
            sendUserAlert(t("App.handleSubmit.invalid_session"), true);
            return;
        }
        const modelPlaceholder = t("App.handleSubmit.model_placeholder");
        let currentSessionHistory = chartId in sessions ? sessions[chartId] : [];
        const currentTimestamp = Date.now();
        let _sessions = {
            ...sessions,
            [chartId]: [
                ...(sessions[chartId] || []),
                {
                    role: "user",
                    parts: prompt,
                    timestamp: currentTimestamp,
                    attachment: uploadInlineData,
                },
                {
                    role: "model",
                    parts: modelPlaceholder,
                    timestamp: currentTimestamp,
                },
            ],
        };
        dispatch(updateAI({ ...ai, busy: true }));
        dispatch(updateSessions(_sessions));
        if(chartId) currentSessionHistory = chartId in sessions ? sessions[chartId] : [];
        !hash.includes("/govFineQuery") ? navigate(`${prefix}/${chartId}${suffix}`) : navigate(`/govFineQuery/${chartId}${suffix}`) ;

        const handler = (message: string, end: boolean,params:Object) => {
            if (end) {
                dispatch(updateAI({ ...ai, busy: false }));
            }
            // let prevParts = _sessions[chartId][_sessions[chartId].length - 1].parts;
            // if (prevParts === modelPlaceholder) {
            //     prevParts = "";
            // }
            _sessions = {
                ..._sessions,
                [chartId]: [
                    ..._sessions[chartId].slice(0, -1),
                    {
                        role: "model",
                        parts: `${message}`,
                        timestamp: Date.now(),
                        params: params
                    },
                ],
            };

            dispatch(updateSessions(_sessions));
        };
        if (!uploadInlineData.data.length) {
            await getAiChats(
                ai.model.pro,
                currentSessionHistory,
                prompt,
                sse,
                modelConfig,
                handler
            );
        } else {
            await getAiContent(
                ai.model.vision,
                prompt,
                uploadInlineData,
                sse,
                handler
            );
        }
        setUploadInlineData({ data: "", mimeType: "" });
    };

    useEffect(() => {
        document.querySelector(".loading")?.remove();
        if (!hasLogined && !!passcodes.length) {
            document.title = site;
        }
        setCurrentLocaleToState();
    }, [t, hasLogined, passcodes, site]);


    return (
        <Container
            className={
                !hasLogined && !!passcodes.length
                    ? "flex flex-col items-center justify-center min-h-screen p-10"
                    : ""
            }
            toaster={true}
        >
            {hasLogined || !passcodes.length ? (
                <>
                    <Sidebar
                        title={header}
                        locales={locales}
                        sessions={sessions}
                        expand={sidebarExpand}
                        currentLocale={currentLocale}
                        newChatUrl={routes.index.prefix}
                        onSwitchLocale={handleSwitchLocale}
                        onExportSession={handleExportSession}
                        onDeleteSession={handleDeleteSession}
                        onRenameSession={handleRenameSession}
                    />
                    <Container
                        ref={mainSectionRef}
                        className={`min-w-full overflow-y-auto overflow-x-hidden flex flex-col h-screen justify-between ${
                            !sidebarExpand ? "col-span-2" : ""
                        }`}
                    >
                        <Header
                            busy={ai.busy}
                            logoutIcon={!!passcodes.length}
                            newChatUrl={routes.index.prefix}
                            title={!sidebarExpand ? header : ""}
                            onPurgeSessions={handlePurgeSessions}
                            onToggleSidebar={() =>
                                setSidebarExpand((state) => !state)
                            }
                            onLogout={handleLogout}
                        />
                        <RouterView
                            routes={routes}
                            suspense={<Skeleton />}
                            routerProps={{
                                refs: { mainSectionRef, textAreaRef },
                            }}
                        />
                        <InputArea
                            minHeight={45}
                            ref={textAreaRef}
                            busy={ai.busy}
                            isChart = {window.location.hash.includes("/govFineQuery") }
                            onSubmit={handleSubmit}
                            onUpload={handleUpload}
                        />
                        {!ai.busy && (
                            <PageScroller
                                thresholds={{
                                    top: 200,
                                    bottom: 200,
                                    debounce: 50,
                                }}
                                monitorRef={mainSectionRef}
                            />
                        )}
                    </Container>
                </>
            ) : (
                <LoginForm
                    title={header}
                    logo={siteLogo}
                    passcodes={passcodes}
                    onPasscodeCorrect={() =>{
                        setHasLogined(true)
                        navigate(routes.index.prefix)
                    }}
                />
            )}
        </Container>
    );
};

export default App;
