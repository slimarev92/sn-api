import { Dispatch, useContext, useEffect } from "react";
import mainClasses from "./main-content.module.scss";
import { DisaptchFeedsAction, FeedsState } from "../feeds/feeds-contexts";
import { Feed } from "../feeds/Feed";
import { DispatchUsersAction, UsersContext } from "../users/users-contexts";
import { IFeed, IFeedsAction } from "../feeds/FeedsService";
import { IUsersAction, IUsersState } from "../users/UsersService";
import { fetchFeeds, fetchLikePost, fetchUserPosts } from "../feeds/feed-utils";
import { IPost } from "../../entities/post";
import { fetchUser } from "../users/users-utils";

async function loadInitialFeeds(
    dispatchFeedsAction: Dispatch<IFeedsAction>,
    usersState: IUsersState,
): Promise<void> {
    dispatchFeedsAction({
        type: "loadStart",
    });

    const usersToFetch = [usersState.users[0].username, usersState.users[1].username];
    const feeds = await fetchFeeds(usersToFetch);

    dispatchFeedsAction({
        type: "loadEnd",
        payload: feeds,
    });
}

async function likePost(
    post: IPost,
    liked: boolean,
    dispatchUsersAction: Dispatch<IUsersAction>,
    dispatchFeedsAction: Dispatch<IFeedsAction>,
): Promise<void> {
    await fetchLikePost({ ...post, liked });
    const updatedUser = await fetchUser(post.username);

    dispatchUsersAction({
        type: "updateUser",
        payload: updatedUser,
    });

    const feed: IFeed = {
        username: post.username,
        posts: await fetchUserPosts(post.username),
    };

    dispatchFeedsAction({
        type: "loadFeedEnd",
        payload: feed,
    });
}

export default function Main() {
    const feedsState = useContext(FeedsState);
    const dispatchFeedsAction = useContext(DisaptchFeedsAction);
    const dispatchUsersAction = useContext(DispatchUsersAction);
    const usersState = useContext(UsersContext);
    const isLoading = feedsState.loading || feedsState.feeds.length < 2;

    useEffect(() => {
        // Either we haven't loaded the users or we already did the initial loading of feeds or we're already loading.
        if (feedsState.loading || feedsState.feeds.length || !usersState.users.length) {
            return;
        }

        loadInitialFeeds(dispatchFeedsAction, usersState);
    }, [dispatchFeedsAction, usersState, feedsState]);

    const handleLikeClicked = (post: IPost, liked: boolean) => {
        likePost(post, liked, dispatchUsersAction, dispatchFeedsAction);
    };

    return (
        <main className={mainClasses.main}>
            <h2>main</h2>

            {isLoading ? (
                "Loading"
            ) : (
                <>
                    <div className={mainClasses.feed}>
                        <Feed feed={feedsState.feeds[0]} onLikeClick={handleLikeClicked} />
                    </div>
                    <div className={mainClasses.feed}>
                        <Feed feed={feedsState.feeds[1]} onLikeClick={handleLikeClicked} />
                    </div>
                </>
            )}
        </main>
    );
}
