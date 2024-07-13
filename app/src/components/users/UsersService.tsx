import React, { useReducer } from "react";
import { IUserMetadata } from "../../entities/user";
import { assertUnreachable } from "../../utils";
import { DispatchUsersAction, UsersContext } from "./users-contexts";

export type IUsersState = {
    users: IUserMetadata[];
    loading: boolean;
};
export type IUserActionName = "loadStart" | "loadEnd" | "updateUser";
export type IUsersAction = {
    type: IUserActionName;
    payload?: unknown;
};

function handleLoadStart(prevState: IUsersState): IUsersState {
    return {
        ...prevState,
        loading: true,
    };
}

function handleLoadEnd(action: IUsersAction): IUsersState {
    return {
        loading: false,
        users: action.payload as IUserMetadata[],
    };
}

function handleUpdateUser(prevState: IUsersState, action: IUsersAction): IUsersState {
    const updatedUsers = [...prevState.users];
    const updatedUser = action.payload as IUserMetadata;
    const indexToUpdate = updatedUsers.findIndex(u => u.username === updatedUser.username);

    if (indexToUpdate === -1) {
        return { ...prevState };
    }

    updatedUsers[indexToUpdate] = updatedUser;

    return {
        ...prevState,
        users: updatedUsers,
    };
}

function reducer(prevState: IUsersState, action: IUsersAction): IUsersState {
    switch (action.type) {
        case "loadStart":
            return handleLoadStart(prevState);

        case "loadEnd":
            return handleLoadEnd(action);

        case "updateUser":
            return handleUpdateUser(prevState, action);
    }

    assertUnreachable(action.type);
}

// TODO SASHA: BETTER NAME THAN SERVICE?
export default function UsersService({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        users: [],
    });

    return (
        <DispatchUsersAction.Provider value={dispatch}>
            <UsersContext.Provider value={state}>{children}</UsersContext.Provider>
        </DispatchUsersAction.Provider>
    );
}
