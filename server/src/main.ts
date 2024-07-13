import fastifyFactory from "fastify";
import { doesUserExist, getUser, getUserPosts, getUsers, likePost } from "./db.js";
import { IPost } from "./entities/post.js";
import fastifyCors from "@fastify/cors";

const fastify = fastifyFactory({
    logger: true,
});

// Disable CORS.
fastify.register(fastifyCors, () => {
    return false;
});

fastify.get("/api/users", async (_, reply) => {
    const response = await getUsers();

    reply.send(response);
});

fastify.get("/api/users/:username", async (request, reply) => {
    const { username } = request.params as { username: string };
    const response = await getUser(username);

    if (!response) {
        reply.status(400);

        return;
    }

    reply.send(response);
});

fastify.get("/api/posts/:username", async (request, reply) => {
    const { username } = request.params as { username: string };

    if (!(await doesUserExist(username))) {
        reply.status(400);

        return;
    }

    reply.send(await getUserPosts(username));
});

fastify.post("/api/posts/like", async (req, response) => {
    const post = req.body as IPost;

    const updatedPost = await likePost(post.id, post.liked);

    if (!updatedPost) {
        response.status(400);
    } else {
        response.send(updatedPost);
    }
});

fastify.listen({
    port: 7777,
});
