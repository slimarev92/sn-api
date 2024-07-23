import { IPost } from "../../entities/post";

export type IFeed = {
    username: string;
    posts: IPost[];
};

export function Feed({
    feed,
    onLikeClick,
}: {
    feed: IFeed;
    onLikeClick: (post: IPost, liked: boolean) => void;
}) {
    const { username, posts } = feed;

    return (
        <>
            <h2>{username}</h2>
            <ul>
                {posts.map(p => (
                    <li key={p.id}>
                        <div>{p.datePublished}</div>
                        <div>{p.text}</div>
                        <button onClick={() => onLikeClick(p, !p.liked)}>
                            {p.liked ? "UNLIKE" : "LIKE"}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}
