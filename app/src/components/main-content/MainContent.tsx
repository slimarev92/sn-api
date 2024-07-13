import { useContext, useEffect } from "react";
import { IPost } from "../../entities/post";
import mainClasses from "./main-content.module.scss";
import { DisaptchFeedsAction, FeedsState } from "../feeds/feeds-contexts";
import { Feed } from "../feeds/Feed";

async function fetchFeed(username: string): Promise<IPost[]> {
    const res = await fetch(`http://localhost:7777/api/posts/${username}`);
    const posts = (await res.json()) as IPost[];

    return posts;
}

export default function Main() {
    const feedsState = useContext(FeedsState);
    const dispatchFeedsAction = useContext(DisaptchFeedsAction);

    useEffect(() => {
        let firstUserPosts: IPost[] = [];

        dispatchFeedsAction({
            type: "loadStart",
        });

        fetchFeed("Abbey1971")
            .then((posts) => {
                firstUserPosts = posts;
            })
            .then(() => {
                fetchFeed("Abigail1973").then((secondUserPosts) => {
                    dispatchFeedsAction({
                        type: "loadEnd",
                        payload: [firstUserPosts, secondUserPosts],
                    });
                });
            });
    }, [dispatchFeedsAction]);

    return (
        <main className={mainClasses.main}>
            <h2>main</h2>

            {feedsState.loading ? (
                "Loading"
            ) : (
                <>
                    <div className={mainClasses.feed}>
                        <Feed username={"f1"} posts={feedsState.feeds[0] || []} />
                    </div>
                    <div className={mainClasses.feed}>
                        <Feed username={"f2"} posts={feedsState.feeds[1] || []} />
                    </div>
                </>
            )}
        </main>
    );
}
