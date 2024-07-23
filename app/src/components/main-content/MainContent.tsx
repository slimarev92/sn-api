import mainClasses from "./main-content.module.scss";
import { Feed } from "../feeds/Feed";
import { useFeed } from "../feeds/feeds-query";
import { useContext } from "react";
import { SelectedFeedsContext } from "../feeds/feeds-context";
import { useMutatePost } from "../feeds/posts-query";
import { IPost } from "../../entities/post";

export default function Main() {
    const [selectedFeeds] = useContext(SelectedFeedsContext);
    const firstFeed = useFeed(selectedFeeds[0]);
    const secondFeed = useFeed(selectedFeeds[1]);
    const mutatePost = useMutatePost();

    const handleLikeClicked = (post: IPost, liked: boolean) => {
        mutatePost.mutate({ ...post, liked });
    };

    return (
        <main className={mainClasses.main}>
            <h2>main</h2>

            <div className={mainClasses.feed}>
                {firstFeed.isPending || !firstFeed.data ? (
                    "Loading..."
                ) : (
                    <Feed feed={firstFeed.data} onLikeClick={handleLikeClicked} />
                )}
            </div>
            <div className={mainClasses.feed}>
                {secondFeed.isPending || !secondFeed.data ? (
                    "Loading..."
                ) : (
                    <Feed feed={secondFeed.data} onLikeClick={handleLikeClicked} />
                )}
            </div>
        </main>
    );
}
