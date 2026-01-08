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
    process.env.POSTGRES_HOST = container.getHost();
    process.env.POSTGRES_PORT = container.getPort().toString();
    process.env.POSTGRES_USER = container.getUsername();
    process.env.POSTGRES_PASSWORD = container.getPassword();
    process.env.POSTGRES_DB = container.getDatabase();

    // Load app and pool after env variables are set
    app = require("../app");
    pool = require("../utils/dbUtils").pool;

    // Create and connect a client manually to run setup
    const client = new Client({
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

  describe("GET /api/member_of_parliament", () => {
    it("should return all members of parliament", async () => {
      const response = await supertest(app).get("/api/member_of_parliament");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);
      
      for (const member of response.body) {
        expect(member).toHaveProperty("person_id");
        expect(member).toHaveProperty("firstname");
        expect(member).toHaveProperty("lastname");

        expect(member).toHaveProperty("valihuuto_count");
        expect(member).toHaveProperty("speech_count");
        expect(member).toHaveProperty("birth_year");
        expect(member).toHaveProperty("parliament_group");
      }
    });

    it("should correctly count valihuudot and speeches", async () => {
      const response = await supertest(app).get("/api/member_of_parliament");
      expect(response.statusCode).toBe(200);
      
      const anna = response.body.find(m => m.person_id === 1);
      expect(anna).toBeDefined();
      expect(parseInt(anna.valihuuto_count, 10)).toBe(1);
      expect(parseInt(anna.speech_count, 10)).toBe(2);
      
      const eero = response.body.find(m => m.person_id === 4);
      expect(eero).toBeDefined();
      expect(parseInt(eero.valihuuto_count, 10)).toBe(0);
      expect(parseInt(eero.speech_count, 10)).toBe(0);
    });
  });

  describe("GET /api/member_of_parliament/:person_id", () => {
    it("should return a single member by person_id", async () => {
      const response = await supertest(app).get("/api/member_of_parliament/1");
      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe("Anna");
      expect(response.body.lastname).toBe("Korhonen");
      expect(response.body.valihuuto_count).toBe("1");
      expect(response.body.speech_count).toBe("2");
    });

    it("should return 404 for non-existing member", async () => {
      const response = await supertest(app).get("/api/member_of_parliament/999");
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Member not found");
    });

  });
});
