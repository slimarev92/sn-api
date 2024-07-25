import knexFactory from "knex";
import { faker } from "@faker-js/faker";
import { IPost } from "./entities/post.js";
import { IUsername } from "./entities/username.js";
import dayjs from "dayjs";

const knex = knexFactory({
    client: "sqlite3",
    connection: {
        filename: "./interview.db",
    },
});

const NUM_OF_USERS = 100;
const MAX_NUM_OF_POSTS_PER_USER = 10_000;

/** Adds NUM_OF_USERS to the users table. */
async function seedUsers(): Promise<IUsername[]> {
    const usernames = new Set<string>();

    for (let i = 0; i < NUM_OF_USERS; i++) {
        while (true) {
            // Example: John1992
            let username = faker.person.firstName() + faker.number.int({ min: 1950, max: 2004 });

            if (!usernames.has(username)) {
                usernames.add(username);

                await knex.into("users").insert({ username });

                break;
            }
        }
    }

    console.log("Finished seeding users");

    return [...usernames];
}

/** Adds up to MAX_NUM_OF_POSTS_PER_USER posts for each user. */
async function seedPosts(usernames: IUsername[], userWithNoPosts: string): Promise<void> {
    for (const username of usernames) {
        const numOfPosts =
            userWithNoPosts === username ? 0 : Math.random() * MAX_NUM_OF_POSTS_PER_USER;
        const percentageOfLikedPosts = faker.number.int({ min: 10, max: 50 });

        await seedUserPosts(username, numOfPosts, percentageOfLikedPosts);
    }

    console.log("Finished seeding posts");
}

async function seedUserPosts(
    username: string,
    maxNumOfPosts: number,
    percentageOfLikedPosts: number,
): Promise<void> {
    let lastDate = getInitialDate();
    const posts: Omit<IPost, "id">[] = [];
    let actualPosts = 0;

    for (let i = 0; i < maxNumOfPosts; i++) {
        lastDate = getNextDate(lastDate);

        // Stop if we're about to add a date in the future.
        if (dayjs(lastDate).isAfter(dayjs())) {
            break;
        }

        posts.push({
            username,
            text: faker.lorem.words(20),
            liked: Math.random() * 100 < percentageOfLikedPosts,
            datePublished: Date.parse(lastDate.toISOString()),
        });

        if (posts.length >= 500) {
            await knex.into<Omit<IPost, "id">[]>("posts").insert(posts);

            actualPosts += posts.length;

            posts.splice(0);
        }
    }

    console.log(`Finished seeding ${actualPosts} posts for user ${username}`);
}

/** Returns the given date, plus 30 minutes to 1 day. */
function getNextDate(lastDate: Date): Date {
    const from = dayjs(lastDate).add(30, "minutes").toDate();
    const to = dayjs(lastDate).add(1, "days").toDate();

    return faker.date.between({ from, to });
}

/** Returns a random date between 15 to 5 years ago. */
function getInitialDate(): Date {
    const from = dayjs().subtract(15, "years").toDate();
    const to = dayjs().subtract(5, "years").toDate();

    return faker.date.between({ from, to });
}

export async function seed() {
    const users = await knex.select("*").from<{ username: IUsername }>("users");

    if (!users.length) {
        console.log("seeding users");

        const usernames = await seedUsers();

        await seedPosts(usernames, usernames[3]);
    } else {
        console.log("no need to seed users");
    }
}
