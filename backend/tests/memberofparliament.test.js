const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Client } = require("pg");
const supertest = require("supertest");
const { setup } = require("./setup");

let app; 
let pool;
let container;

describe("/api/member_of_parliament", () => {
  jest.setTimeout(60000); // Give Docker container time to start


  beforeAll(async () => {
    // Start PostgreSQL container with default env values
    container = await new PostgreSqlContainer("postgres:16").start();

    // Map container values to env variables for dbUtils.js
    process.env.DB_HOST = container.getHost();
    process.env.DB_PORT = container.getPort().toString();
    process.env.DB_USER = container.getUsername();
    process.env.DB_PASSWORD = container.getPassword();
    process.env.DB_NAME = container.getDatabase();

    // Load app and pool after env variables are set
    app = require("../app");
    pool = require("../utils/dbUtils").pool;

    // Create and connect a client manually to run setup
    client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    });

    await client.connect();
    await setup(client); // Create and populate tables
    await client.end();
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  it("should return all members of parliament", async () => {
    const response = await supertest(app).get("/api/member_of_parliament");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
    for (const member of response.body) {
      expect(member).toHaveProperty("person_id");
      expect(member).toHaveProperty("firstname");
      expect(member).toHaveProperty("valihuuto_count");
    }
  });

  it("should return a single member by person_id", async () => {
    const response = await supertest(app).get("/api/member_of_parliament/1");
    expect(response.statusCode).toBe(200);
    expect(response.body.firstname).toBe("Anna");
    expect(response.body.valihuuto_count).toBe("1");
  });

  it("should return 404 for non-existing member", async () => {
    const response = await supertest(app).get("/api/member_of_parliament/999");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Member not found");
  });
});
