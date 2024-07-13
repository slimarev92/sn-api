import { IPost } from "../../entities/post";
import { IFeed } from "./FeedsService";

export async function fetchUserPosts(username: string): Promise<IPost[]> {
    const res = await fetch(`http://localhost:7777/api/posts/${username}`);
    const posts = (await res.json()) as IPost[];

    return posts;
}

export async function fetchFeeds(usernames: string[]): Promise<IFeed[]> {
    const feedsPromises = usernames.map(u => fetchUserPosts(u));
    const posts = await Promise.all(feedsPromises);

    return usernames.map<IFeed>((username, i) => {
        return {
            username,
            posts: posts[i],
        };
    });
}

export async function fetchLikePost(post: IPost): Promise<IPost> {
    const res = await fetch("http://localhost:7777/api/posts/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });

    const updatedPost = await res.json();

    return updatedPost;
}
