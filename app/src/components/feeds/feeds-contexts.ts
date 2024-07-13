import { createContext, Dispatch } from "react";
import { IFeedsState, IFeedsAction } from "./FeedsService";

export const FeedsState = createContext<IFeedsState>({
    loading: false,
    feeds: [],
});
export const DisaptchFeedsAction = createContext<Dispatch<IFeedsAction>>(
    () => {},
);
