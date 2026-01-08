const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Client } = require("pg");
const supertest = require("supertest");
const { setup } = require("./setup");

let app; 
let pool;
let container;

describe("/api/party", () => {
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

  describe("GET /api/party/valihuudot", () => {
    it("should return party statistics for valihuudot", async () => {
      const response = await supertest(app).get("/api/party/valihuudot");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      for (const party of response.body) {
        expect(party).toHaveProperty("party");
        expect(party).toHaveProperty("party_color");
        expect(party).toHaveProperty("total_valihuudot");
        expect(party).toHaveProperty("member_count");
        expect(typeof party.total_valihuudot).toBe("string");
        expect(typeof party.member_count).toBe("string");
      }
    });

    it("should return parties ordered by total_valihuudot descending", async () => {
      const response = await supertest(app).get("/api/party/valihuudot");
      expect(response.statusCode).toBe(200);
      
      if (response.body.length > 1) {
        const totals = response.body.map(p => parseInt(p.total_valihuudot, 10));
        const sortedTotals = [...totals].sort((a, b) => b - a);
        expect(totals).toEqual(sortedTotals);
      }
    });
  });

  describe("GET /api/party/speeches", () => {
    it("should return party statistics for speeches", async () => {
      const response = await supertest(app).get("/api/party/speeches");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Check that each party has required properties
      for (const party of response.body) {
        expect(party).toHaveProperty("party");
        expect(party).toHaveProperty("party_color");
        expect(party).toHaveProperty("total_speeches");
        expect(party).toHaveProperty("member_count");
        expect(typeof party.total_speeches).toBe("string");
        expect(typeof party.member_count).toBe("string");
      }
    });

    it("should return parties ordered by total_speeches descending", async () => {
      const response = await supertest(app).get("/api/party/speeches");
      expect(response.statusCode).toBe(200);
      
      if (response.body.length > 1) {
        const totals = response.body.map(p => parseInt(p.total_speeches, 10));
        const sortedTotals = [...totals].sort((a, b) => b - a);
        expect(totals).toEqual(sortedTotals);
      }
    });

    it("should correctly count speeches per party", async () => {
      const response = await supertest(app).get("/api/party/speeches");
      expect(response.statusCode).toBe(200);
      
      // Anna Korhonen (vihr) has 2 speeches in test data
      const vihrParty = response.body.find(p => p.party === "vihr");
      expect(vihrParty).toBeDefined();
      expect(parseInt(vihrParty.total_speeches, 10)).toBeGreaterThanOrEqual(2);
    });
  });
});

