import { ReactNode, useReducer } from "react";
import { IPost } from "../../entities/post";
import { assertUnreachable } from "../../utils";
import { FeedsState, DisaptchFeedsAction } from "./feeds-contexts";

export type IFeed = {
    username: string;
    posts: IPost[];
};
export type IFeedsState = {
    loading: boolean;
    feeds: IFeed[];
};
export type IFeedsActionName = "loadStart" | "loadEnd" | "loadFeedStart" | "loadFeedEnd";
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

function handleLoadEnd(feeds: IFeed[]): IFeedsState {
    return {
        loading: false,
        feeds,
    };
}

function handleLoadFeedStart(prevState: IFeedsState): IFeedsState {
    return {
        loading: true,
        feeds: prevState.feeds,
    };
}

function handleLoadFeedEnd(prevState: IFeedsState, action: IFeedsAction): IFeedsState {
    const payload = action.payload as IFeed;
    const existingFeedIndex = prevState.feeds.findIndex(f => f.username === payload.username);
    let newFeeds: IFeed[] = [];

    if (existingFeedIndex === -1) {
        newFeeds = [payload, prevState.feeds[0]];
    } else {
        newFeeds = [...prevState.feeds];
        newFeeds[existingFeedIndex] = payload;
    }

    return {
        loading: false,
        feeds: newFeeds,
    };
}

function reducer(prevState: IFeedsState, action: IFeedsAction): IFeedsState {
    switch (action.type) {
        case "loadStart":
            return handleLoadStart();

        case "loadEnd":
            return handleLoadEnd(action.payload as IFeed[]);

        case "loadFeedStart":
            return handleLoadFeedStart(prevState);

        case "loadFeedEnd":
            return handleLoadFeedEnd(prevState, action);
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
