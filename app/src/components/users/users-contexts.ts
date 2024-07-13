import { createContext } from "react";
import { IUsersAction, IUsersState } from "./UsersService";

export const DispatchUsersAction = createContext<React.Dispatch<IUsersAction>>(() => {});

export const UsersContext = createContext<IUsersState>({
    loading: false,
    users: [],
});
