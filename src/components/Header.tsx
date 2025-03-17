import { Link, useNavigate, useLocation } from "react-router-dom";
import menuIcon from "../assets/logo.svg";
import newChatIcon from "../assets/icons/square-plus-regular.svg";
import purgeIcon from "../assets/icons/broom-ball-solid.svg";
import LogoutIcon from "../assets/icons/right-from-bracket-solid.svg";

interface HeaderProps {
    readonly title?: string;
    readonly busy: boolean;
    readonly newChatUrl: string;
    readonly logoutIcon: boolean;
    readonly onLogout: () => void;
    readonly onToggleSidebar: () => void;
    readonly onPurgeSessions: () => void;
}

export const Header = (props: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation(); // 获取当前路由信息
    const {
        title,
        busy,
        newChatUrl,
        logoutIcon,
        onLogout,
        onToggleSidebar,
        onPurgeSessions,
    } = props;

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(event.target.value);
    };

    // 根据当前路径决定下拉菜单的默认选项
    const defaultOptionValue = location.pathname.includes('govFineQuery') ? 'govFineQuery' : 
        location.pathname.includes('voiceAssistant') ? 'voiceAssistant' : '';
    return (
        <header className="z-10 sticky top-0 flex px-2 py-1 items-center justify-between border-b bg-white">
            <button
                className="rounded-lg p-2"
                // onClick={onToggleSidebar}
            >
                <img src={menuIcon} className="w-[4rem] h-[3rem] size-16" alt="" />
            </button>
            

            <button className="rounded-lg p-2">
                <select
                    className="font-semibold font text-sm border-0 rounded-lg p-1 outline-none focus:ring-0 focus:border-0 bg-white shadow-none appearance-none"
                    onChange={handleSelectChange}
                    disabled={busy}
                    value={defaultOptionValue} // 设置默认选中的值
                >
                    <option value={"govFineQuery"}>🏛️ Gov-Fine Query</option>
                    <option value="">👱 Personal-Info Query</option>
                    <option value="voiceAssistant">🤖 Voice Assistant</option>
                </select>
            </button>
            <div className="flex">
                <Link
                    className="hover:bg-gray-200 rounded-lg p-2"
                    onClick={(e) => busy && e.preventDefault()} // 防止点击跳转
                    to={location.pathname.includes('govFineQuery') ? '/govFineQuery' : 
                        location.pathname.includes('voiceAssistant') ? '/voiceAssistant' : '/'}
                >
                    <img src={newChatIcon} className="size-4" alt="" />
                </Link>
                {/* <button
                    className="hover:bg-gray-200 rounded-lg p-2"
                    onClick={onPurgeSessions}
                >
                    <img src={purgeIcon} className="size-4" alt="" />
                </button> */}
                {logoutIcon && (
                    <button
                        className="hover:bg-gray-200 rounded-lg p-2"
                        onClick={onLogout}
                        disabled={busy}
                    >
                        <img src={LogoutIcon} className="size-4" alt="" />
                    </button>
                )}
            </div>
        </header>
    );
};