import { createContext } from "react";
import { IUsersAction, IUsersState } from "./UsersService";

export const DispatchUsersActionContext = createContext<React.Dispatch<IUsersAction>>(() => {});

export const UsersContext = createContext<IUsersState>({
    loading: false,
    users: [],
});
