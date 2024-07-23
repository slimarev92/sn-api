import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { useUsers } from "../users/users-utils";

export const SelectedFeedsContext = createContext<[string[], Dispatch<SetStateAction<string[]>>]>([
    ["", ""],
    () => undefined,
]);

export function SelectedFeedsService({ children }: { children: ReactNode }) {
    const [feedNames, setFeedNames] = useState(["", ""]);
    const users = useUsers();
    const initialFeedsSetRef = useRef(false);

    useEffect(() => {
        if (users.data && !initialFeedsSetRef.current) {
            setFeedNames(users.data.slice(0, 2).map(u => u.username));

            initialFeedsSetRef.current = true;
        }
    }, [users]);

    return (
        <SelectedFeedsContext.Provider value={[feedNames, setFeedNames]}>
            {children}
        </SelectedFeedsContext.Provider>
    );
}
