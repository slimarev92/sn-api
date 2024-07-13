import { useEffect, useRef, useState } from "react";
import { IPost } from "../../entities/post";
import mainClasses from "./main-content.module.scss";

function Feed(props: { username: string; posts: IPost[] }) {
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

async function fetchFeed(username: string): Promise<IPost[]> {
  const res = await fetch(`http://localhost:7777/api/posts/${username}`);
  const posts = (await res.json()) as IPost[];

  return posts;
}

export default function Main() {
  const [feeds, setFeeds] = useState<IPost[][]>([]);
  const fetched = useRef<boolean>(false);

  useEffect(() => {
    if (fetched.current) {
      return;
    }

    fetchFeed("Abbey1971")
      .then((posts) => {
        setFeeds([posts]);
      })
      .then(() => {
        fetchFeed("Abigail1973").then((posts) => {
          setFeeds([...feeds, posts]);

          fetched.current = true;
        });
      });
  }, [feeds]);

  return (
    <main className={mainClasses.main}>
      <h2>main</h2>

      <div className={mainClasses.feed}>
        <Feed username={"f1"} posts={feeds[0] || []} />
      </div>
      <div className={mainClasses.feed}>
        <Feed username={"f2"} posts={feeds[1] || []} />
      </div>
    </main>
  );
}
