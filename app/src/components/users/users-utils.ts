import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IUserMetadata } from "../../entities/user";

export async function fetchUsers(): Promise<IUserMetadata[]> {
    const res = await fetch(
        "http://sn2-env-2.eba-spskym4m.us-east-1.elasticbeanstalk.com:5000/api/users",
    );
    const users = (await res.json()) as IUserMetadata[];

    return users;
}

export async function fetchUser(username: string): Promise<IUserMetadata> {
    const res = await fetch(
        `http://sn2-env-2.eba-spskym4m.us-east-1.elasticbeanstalk.com:5000/api/users/${username}`,
    );
    const users = (await res.json()) as IUserMetadata[];

    return users[0];
}

export function useUsers(): UseQueryResult<IUserMetadata[]> {
    return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}
