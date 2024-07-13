import { ReactNode, useReducer } from "react";
import { IPost } from "../../entities/post";
import { assertUnreachable } from "../../utils";
import { FeedsState, DisaptchFeedsAction } from "./feeds-contexts";

export type IFeedsState = {
    loading: boolean;
    feeds: IPost[][];
};
export type IFeedsActionName = "loadStart" | "loadEnd";
export type IFeedsAction = {
    type: IFeedsActionName;
    payload?: unknown;
};

function handleLoadStart(): IFeedsState {
    return {
        loading: true,
        feeds: [],
    };
}

function handleLoadEnd(feeds: IPost[][]): IFeedsState {
    return {
        loading: false,
        feeds,
    };
}

function reducer(prevState: IFeedsState, action: IFeedsAction): IFeedsState {
    switch (action.type) {
        case "loadStart":
            return handleLoadStart();

        case "loadEnd":
            return handleLoadEnd(action.payload as IPost[][]);
    }

    assertUnreachable(action.type);
}

export function FeedsService({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        feeds: [],
    });

    return (
        <FeedsState.Provider value={state}>
            <DisaptchFeedsAction.Provider value={dispatch}>{children}</DisaptchFeedsAction.Provider>
        </FeedsState.Provider>
    );
}
