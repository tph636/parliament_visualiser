const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Client } = require("pg");
const supertest = require("supertest");
const { setup } = require("./setup");

let app; 
let pool;
let container;

describe("/api/valihuudot/:person_id/:page", () => {
  jest.setTimeout(60000); // Give Docker container time to start

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16").start();

    process.env.POSTGRES_HOST = container.getHost();
    process.env.POSTGRES_PORT = container.getPort().toString();
    process.env.POSTGRES_USER = container.getUsername();
    process.env.POSTGRES_PASSWORD = container.getPassword();
    process.env.POSTGRES_DB = container.getDatabase();

    app = require("../app");
    pool = require("../utils/dbUtils").pool;

    const client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    });

    await client.connect();
    await setup(client);
    await client.end();
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  it("should return the first page of valihuudot for a given member", async () => {
    const response = await supertest(app).get("/api/valihuudot/1/1"); // person_id 1, page 1
    expect(response.statusCode).toBe(200);
    expect(response.body.person_id).toBe("1");
    expect(response.body.page).toBe(1);
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBeLessThanOrEqual(10);
    for (const entry of response.body.results) {
      expect(entry).toHaveProperty("valihuuto");
      expect(entry).toHaveProperty("date");
    }
  });

  it("should return valihuudot for a valid member with entries", async () => {
    const response = await supertest(app).get("/api/valihuudot/3/1");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBeGreaterThan(0);
    for (const entry of response.body.results) {
        expect(entry).toHaveProperty("valihuuto");
        expect(entry.firstname).toBe("Jari");
    }
  });

  it("should return an empty array for a valid member with no valihuudot", async () => {
    const response = await supertest(app).get("/api/valihuudot/4/1");
    expect(response.statusCode).toBe(200);
    expect(response.body.person_id).toBe("4");
    expect(response.body.results).toEqual([]);
  });

  it("should return an empty array for out-of-range pagination", async () => {
    const response = await supertest(app).get("/api/valihuudot/1/999");
    expect(response.statusCode).toBe(200);
    expect(response.body.results).toEqual([]);
  });

  it("should handle non-existing person_id gracefully", async () => {
    const response = await supertest(app).get("/api/valihuudot/999/1");
    expect(response.statusCode).toBe(200);
    expect(response.body.results).toEqual([]);
  });
});
