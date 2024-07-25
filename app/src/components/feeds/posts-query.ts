import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { IPost } from "../../entities/post";
import { queryClient } from "../../utils/query-client";
import { IFeed } from "./Feed";

export async function fetchLikePost(post: IPost): Promise<IPost> {
    const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });

    const updatedPost = await res.json();

    return updatedPost;
}

export function useMutatePost(): UseMutationResult<IPost, Error, IPost> {
    return useMutation({
        mutationFn: (post: IPost) => {
            return fetchLikePost(post);
        },
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ["users"] });

            queryClient.setQueryData(["feeds", data.username], (oldData: IFeed) => {
                const nextFeed = { ...oldData };

                const postIndex = nextFeed.posts.findIndex(p => p.id === data.id);

                // TODO SASHA: PROPERLY HANDLE ERRORS.
                if (postIndex === -1) {
                    throw "err";
                }

                nextFeed.posts[postIndex] = { ...data };

                return nextFeed;
            });
        },
    });
}
