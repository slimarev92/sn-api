import { IPost } from "../../entities/post";

export function Feed(props: { username: string; posts: IPost[] }) {
    const { username, posts } = props;

    return (
        <>
            <h2>{username}</h2>
            <ul>
                {posts.map((p) => (
                    <li key={p.id}>
                        <div>{p.datePublished}</div>
                        <div>{p.text}</div>
                        <div>{p.liked ? "LIKED" : "UNLIKED"}</div>
                    </li>
                ))}
            </ul>
        </>
    );
}
