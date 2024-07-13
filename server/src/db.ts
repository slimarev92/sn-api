import knexFactory from "knex";
import { IUsername } from "./entities/username.js";
import { IUsersApiResponse } from "./entities/api-responses.js";
import { IPost } from "./entities/post.js";
import { difference } from "./utils.js";

const knex = knexFactory({
    client: "sqlite3",
    connection: {
        filename: "./interview.db",
    },
});

export async function getUsers(): Promise<IUsersApiResponse> {
    const response: IUsersApiResponse = [];
    const allUsernames = await getAllUsernames();
    const usernamesWithPosts = new Set<IUsername>();

    const queryResult = await knex
        .select("username")
        .count("*", { as: "count" })
        .from<IPost>("posts")
        .groupBy("username", "liked");

    while (queryResult.length) {
        const [notLiked, liked] = queryResult.splice(0, 2);

        usernamesWithPosts.add(notLiked.username);

        response.push({
            username: notLiked.username,
            totalPosts: Number(notLiked.count) + Number(liked.count),
            likedPosts: Number(liked.count),
        });
    }

    // Handle users who haven't posted anything.
    for (const username of difference(allUsernames, usernamesWithPosts).values()) {
        response.push({
            username,
            totalPosts: 0,
            likedPosts: 0,
        });
    }

    response.sort((first, second) => (first.username > second.username ? 1 : -1));

    return response;
}

export async function getUser(username: string): Promise<IUsersApiResponse | undefined> {
    const response: IUsersApiResponse = [];

    if (!(await doesUserExist(username))) {
        return undefined;
    }

    const queryResult = await knex
        .select("username")
        .count("*", { as: "count" })
        .from<IPost>("posts")
        .where("username", "=", username)
        .groupBy("username", "liked");

    while (queryResult.length) {
        const [notLiked, liked] = queryResult.splice(0, 2);

        response.push({
            username: notLiked.username,
            totalPosts: Number(notLiked.count) + Number(liked.count),
            likedPosts: Number(liked.count),
        });
    }

    return response;
}

export async function getAllUsernames(): Promise<Set<IUsername>> {
    const usernames = new Set<string>();

    const queryResult = await knex.select("username").from<{ username: IUsername }>("users");

    for (const row of queryResult) {
        usernames.add(row.username);
    }

    return usernames;
}

export async function getPosts(): Promise<IPost[]> {
    const posts = await knex.select("*").from<IPost>("posts");

    // sqlite hack
    for (const post of posts) {
        post.liked = Boolean(post.liked);
    }

    return posts;
}

export async function getUserPosts(username: string): Promise<IPost[]> {
    const posts = await knex.select("*").from<IPost>("posts").where("username", "=", username);

    // sqlite hack
    for (const post of posts) {
        post.liked = Boolean(post.liked);
    }

    return posts;
}

export async function doesUserExist(username: string): Promise<boolean> {
    const userOrNothing = await knex
        .from<{ username: string }>("users")
        .where("username", "=", username)
        .first();

    return !!userOrNothing;
}

export async function likePost(id: number, liked: boolean): Promise<IPost | undefined> {
    const posts = await knex
        .update({ liked: liked ? 1 : 0 })
        .from<IPost>("posts")
        .where("id", "=", id)
        .returning("*");

    return posts[0];
}
