import { useQuery } from "@tanstack/react-query";
import { IPost } from "../../entities/post";
import { IFeed } from "./Feed";
import BASE_URL from "../../utils/base-url";

export async function fetchUserPosts(username: string): Promise<IPost[]> {
    const res = await fetch(`${BASE_URL}/api/posts/${username}`);
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

export function useFeed(username: string) {
    return useQuery({
        queryKey: ["feeds", username],
        queryFn: async query => {
            const posts = await fetchUserPosts(query.queryKey[1]);

            return {
                username,
                posts,
            };
        },
        placeholderData: {
            username: username,
            posts: [],
        },
        enabled: !!username,
    });
}
