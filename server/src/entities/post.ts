export type IPost = {
    /** Unique identifier of a single post. */
    id: number,
    /** Unique identifier of the user who published the post. */
    username: string;
    text: string;
    liked: boolean;
    /** UNIX time (milliseconds since the epoch). */
    datePublished: number;
};
