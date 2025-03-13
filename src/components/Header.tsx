import menuIcon from "../assets/icons/bars-staggered-solid.svg";
import newChatIcon from "../assets/icons/square-plus-regular.svg";
import purgeIcon from "../assets/icons/broom-ball-solid.svg";
import LogoutIcon from "../assets/icons/right-from-bracket-solid.svg";
import { Link,useNavigate } from "react-router-dom";
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
    const  navigate = useNavigate();
    const {
        title,
        busy,
        newChatUrl,
        logoutIcon,
        onLogout,
        onToggleSidebar,
        onPurgeSessions,
    } = props;
    console.log(busy,'busy');
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value);
        navigate(event.target.value);
    };
    return (
        <header className="z-10 sticky top-0 flex px-2 py-3 items-center justify-between border-b bg-white">
            <button
                className="rounded-lg p-2"
                onClick={onToggleSidebar}
            >
                {/* <img src={menuIcon} className="size-4" alt="" /> */}
                <h1 className="font-semibold text-lg">{"DDA"}</h1>
            </button>
            <button className="rounded-lg p-2">
                <select
                    className="font-semibold text-lg border-0 rounded-lg p-1 outline-none focus:ring-0 focus:border-0 bg-white shadow-none appearance-none"
                    onChange={handleSelectChange}
                    disabled={busy}
                >
                    <option value={`chart/${Date.now().toString()}`}>Chart</option>
                    <option value="">Chat</option>
                    <option value="video">Video</option>
                </select>
            </button>
            <div className="flex">
                <Link
                    className="hover:bg-gray-200 rounded-lg p-2"
                    to={newChatUrl}
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
                    >
                        <img src={LogoutIcon} className="size-4" alt="" />
                    </button>
                )}
            </div>
        </header>
    );
};
