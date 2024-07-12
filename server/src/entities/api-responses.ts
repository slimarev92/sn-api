export type IUsersApiResponse = {
    /** Unique identifier of the user */
    username: string,
    /** Total posts published by the user */
    totalPosts: number,
    /** The number of liked posts (always smaller than totalPosts) */
    likedPosts: number,
}[];

