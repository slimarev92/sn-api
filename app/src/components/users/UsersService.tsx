import React, { useReducer } from "react";
import { IUserMetadata } from "../../entities/user";
import { assertUnreachable } from "../../utils";
import { DispatchUsersActionContext, UsersContext } from "./user-contexts";

export type IUsersState = {
    users: IUserMetadata[];
    loading: boolean;
};
export type IUserActionName = "loadStart" | "loadEnd";
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

function reducer(prevState: IUsersState, action: IUsersAction): IUsersState {
    switch (action.type) {
        case "loadStart":
            return handleLoadStart(prevState);

        case "loadEnd":
            return handleLoadEnd(action);
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
        <DispatchUsersActionContext.Provider value={dispatch}>
            <UsersContext.Provider value={state}>{children}</UsersContext.Provider>
        </DispatchUsersActionContext.Provider>
    );
}
