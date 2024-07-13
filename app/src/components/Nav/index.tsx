import { useEffect, useState } from "react";
import { IUserMetadata } from "../../entities/user";
import navClasses from "./nav.module.scss";

const fetchUsers = async () => {
  const res = await fetch("http://localhost:7777/api/users");
  const users = (await res.json()) as IUserMetadata[];

  return users;
};

export default function Nav() {
  const [users, setUsers] = useState<IUserMetadata[]>([]);

  useEffect(() => {
    fetchUsers().then((users) => setUsers(users));
  }, []);

  const handleShowClick = (user: IUserMetadata) => {
    return user;
  };

  return (
    <nav className={navClasses.nav}>
      <h2>nav</h2>
      <ul>
        {users.map((u) => (
          <li key={u.username}>
            <span>{u.username}</span>
            <button onClick={() => handleShowClick(u)}>Show</button>
            <span>{u.likedPosts}</span>/<span>{u.totalPosts}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
