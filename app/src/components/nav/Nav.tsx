import { useContext, useEffect } from "react";
import { IUserMetadata } from "../../entities/user";
import navClasses from "./nav.module.scss";
import { DispatchUsersActionContext, UsersContext } from "../users/user-contexts";

const fetchUsers = async () => {
    const res = await fetch("http://localhost:7777/api/users");
    const users = (await res.json()) as IUserMetadata[];

    return users;
};

export default function Nav() {
    const usersState = useContext(UsersContext);
    const dispatchUsersAction = useContext(DispatchUsersActionContext);

    useEffect(() => {
        dispatchUsersAction({
            type: "loadStart",
        });

        fetchUsers().then((users) => {
            dispatchUsersAction({
                type: "loadEnd",
                payload: users,
            });
        });
    }, [dispatchUsersAction]);

    const handleShowClick = (user: IUserMetadata) => {
        return user;
    };

    return (
        <nav className={navClasses.nav}>
            <h2>nav</h2>
            {usersState.loading ? (
                "Loading"
            ) : (
                <ul>
                    {usersState.users.map((u) => (
                        <li key={u.username}>
                            <span>{u.username}</span>
                            <button onClick={() => handleShowClick(u)}>Show</button>
                            <span>{u.likedPosts}</span>/<span>{u.totalPosts}</span>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
