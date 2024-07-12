
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable("users", table => {
        table.string("username", 100).notNullable().primary();
    });

    await knex.schema.createTable("posts", table => {
        table.increments("id");
        table.string("text", 1000).notNullable();
        table.boolean("liked").notNullable();
        table.integer("datePublished").notNullable();
        table.string("username", 100).notNullable().references("username").inTable("users");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = () => { };
