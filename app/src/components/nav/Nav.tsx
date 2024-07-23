import { useContext } from "react";
import { IUserMetadata } from "../../entities/user";
import navClasses from "./nav.module.scss";
import { useUsers } from "../users/users-utils";
import { SelectedFeedsContext } from "../feeds/feeds-context";

function isFeedShown(user: IUserMetadata, selectedFeeds: string[]): boolean {
    return selectedFeeds.some(f => f === user.username);
}

export default function Nav() {
    const users = useUsers();
    const [selectedFeeds, setSelectedFeeds] = useContext(SelectedFeedsContext);

    const handleShowClick = (user: IUserMetadata) => {
        setSelectedFeeds([user.username, selectedFeeds[0]]);
    };

    return (
        <nav className={navClasses.nav}>
            <h2>nav</h2>
            {users.isPending ? (
                "Loading"
            ) : (
                <ul>
                    {users.data?.map(u => (
                        <li key={u.username}>
                            <span>{u.username}</span>
                            <button
                                onClick={() => handleShowClick(u)}
                                disabled={isFeedShown(u, selectedFeeds)}
                            >
                                Show
                            </button>
                            <span>{u.likedPosts}</span>/<span>{u.totalPosts}</span>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
