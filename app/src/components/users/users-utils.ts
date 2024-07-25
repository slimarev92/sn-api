import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IUserMetadata } from "../../entities/user";

export async function fetchUsers(): Promise<IUserMetadata[]> {
    const res = await fetch("/api/users");
    const users = (await res.json()) as IUserMetadata[];

    return users;
}

export async function fetchUser(username: string): Promise<IUserMetadata> {
    const res = await fetch(`/api/users/${username}`);
    const users = (await res.json()) as IUserMetadata[];

    return users[0];
}

export function useUsers(): UseQueryResult<IUserMetadata[]> {
    return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}
