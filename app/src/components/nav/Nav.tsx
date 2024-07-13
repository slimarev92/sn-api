import { Dispatch, useContext, useEffect } from "react";
import { IUserMetadata } from "../../entities/user";
import navClasses from "./nav.module.scss";
import { DispatchUsersAction, UsersContext } from "../users/users-contexts";
import { IUsersAction } from "../users/UsersService";
import { fetchUsers } from "../users/users-utils";
import { DisaptchFeedsAction, FeedsState } from "../feeds/feeds-contexts";
import { IFeed, IFeedsAction, IFeedsState } from "../feeds/FeedsService";
import { fetchUserPosts } from "../feeds/feed-utils";

async function initialUsersLoad(dispatchUsersAction: Dispatch<IUsersAction>): Promise<void> {
    dispatchUsersAction({
        type: "loadStart",
    });

    const users = await fetchUsers();

    dispatchUsersAction({
        type: "loadEnd",
        payload: users,
    });
}

async function handleShowClick(
    user: IUserMetadata,
    feedsState: IFeedsState,
    dispatch: Dispatch<IFeedsAction>,
) {
    if (feedsState.feeds.find(f => f.username === user.username)) {
        return;
    }

    const feed: IFeed = {
        username: user.username,
        posts: await fetchUserPosts(user.username),
    };

    dispatch({
        type: "loadFeedEnd",
        payload: feed,
    });
}

function isFeedShown(user: IUserMetadata, feedsState: IFeedsState): boolean {
    return feedsState.feeds.some(f => f.username === user.username);
}

export default function Nav() {
    const usersState = useContext(UsersContext);
    const dispatchUsersAction = useContext(DispatchUsersAction);
    const feedsState = useContext(FeedsState);
    const dispatchFeedsAction = useContext(DisaptchFeedsAction);

    useEffect(() => {
        if (usersState.loading || usersState.users.length) {
            return;
        }

        initialUsersLoad(dispatchUsersAction);
    }, [dispatchUsersAction, usersState]);

    return (
        <nav className={navClasses.nav}>
            <h2>nav</h2>
            {usersState.loading ? (
                "Loading"
            ) : (
                <ul>
                    {usersState.users.map(u => (
                        <li key={u.username}>
                            <span>{u.username}</span>
                            <button
                                onClick={() => handleShowClick(u, feedsState, dispatchFeedsAction)}
                                disabled={isFeedShown(u, feedsState)}
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
