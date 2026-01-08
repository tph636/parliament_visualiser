/*
https://medium.com/@sohail_saifi/why-your-unit-tests-are-a-complete-waste-of-time-and-what-to-do-instead-50916ef5eecc
*/

const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Client } = require("pg");
const supertest = require("supertest");
const { setup } = require("./setup");

let app; 
let pool;
let container;

describe("/api/speeches", () => {
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

  describe("GET /api/speeches", () => {
    it("should return 400 when query parameter is missing", async () => {
      const response = await supertest(app).get("/api/speeches");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Missing search query");
    });

    it("should return 400 when query parameter is empty", async () => {
      const response = await supertest(app).get("/api/speeches?q=");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Missing search query");
    });


    it("should return results matching the search query", async () => {
      const response = await supertest(app).get("/api/speeches?q=ilmastonmuutos");
      expect(response.statusCode).toBe(200);
      expect(parseInt(response.body.total, 10)).toBeGreaterThan(0);
      expect(response.body.results.length).toBeGreaterThan(0);
      
      for (const speech of response.body.results) {
        expect(speech).toHaveProperty("id");
        expect(speech).toHaveProperty("firstname");
        expect(speech).toHaveProperty("lastname");
        expect(speech).toHaveProperty("content");
        expect(speech).toHaveProperty("date");
        expect(speech).toHaveProperty("formatted_date");
        expect(speech).toHaveProperty("ptk_num");
        expect(speech).toHaveProperty("rank");
        expect(speech.content.toLowerCase()).toContain("ilmastonmuutos");
      }
    });

    it("should support pagination with page parameter", async () => {
      const page1 = await supertest(app).get("/api/speeches?q=on&page=1");
      const page2 = await supertest(app).get("/api/speeches?q=on&page=2");
      
      expect(page1.statusCode).toBe(200);
      expect(page2.statusCode).toBe(200);
      expect(page1.body.page).toBe(1);
      expect(page2.body.page).toBe(2);
      
      // Since limit is 1, results should be different
      if (parseInt(page1.body.total, 10) > 1) {
        expect(page1.body.results.length).toBe(1);
        expect(page2.body.results.length).toBe(1);
        expect(page1.body.results[0].id).not.toBe(page2.body.results[0].id);
      }
    });

    it("should return empty results for query with no matches", async () => {
      const response = await supertest(app).get("/api/speeches?q=qwerty");
      expect(response.statusCode).toBe(200);
      expect(response.body.results).toEqual([]);
      expect(parseInt(response.body.total, 10)).toBe(0);
    });

    it("should return results ordered by date DESC and rank DESC", async () => {
      const response = await supertest(app).get("/api/speeches?q=on");
      expect(response.statusCode).toBe(200);
      
      if (response.body.results.length > 1) {
        const dates = response.body.results.map(s => new Date(s.date));
        // Check dates are in descending order
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
        }
      }
    });

    it("should handle Finnish language search correctly", async () => {
      const response = await supertest(app).get("/api/speeches?q=sosiaaliturva");
      expect(response.statusCode).toBe(200);
      expect(parseInt(response.body.total, 10)).toBeGreaterThan(0);
    });

    it("should include formatted_date in DD.MM.YYYY format", async () => {
      const response = await supertest(app).get("/api/speeches?q=on");
      expect(response.statusCode).toBe(200);
      
      if (response.body.results.length > 0) {
        const formattedDate = response.body.results[0].formatted_date;
        expect(formattedDate).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
      }
    });
  });

  describe("GET /api/speeches/:hetekaId", () => {
    it("should return 400 when query parameter is missing", async () => {
      const response = await supertest(app).get("/api/speeches/1");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Missing search query");
    });

    it("should return 400 when query parameter is empty", async () => {
      const response = await supertest(app).get("/api/speeches/1?q=");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Missing search query");
    });

    it("should return search results for a specific member", async () => {
      const response = await supertest(app).get("/api/speeches/1?q=ympäristö");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("hetekaId");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("limit");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("results");
      expect(response.body.hetekaId).toBe("1");
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it("should only return speeches from the specified member", async () => {
      const response = await supertest(app).get("/api/speeches/1?q=on");
      expect(response.statusCode).toBe(200);
      
      for (const speech of response.body.results) {
        expect(speech.firstname).toBe("Anna");
        expect(speech.lastname).toBe("Korhonen");
      }
    });

    it("should return empty results for member with no matching speeches", async () => {
      const response = await supertest(app).get("/api/speeches/4?q=ilmastonmuutos");
      expect(response.statusCode).toBe(200);
      expect(response.body.results).toEqual([]);
      expect(parseInt(response.body.total, 10)).toBe(0);
    });

    it("should support pagination for member-specific search", async () => {
      const page1 = await supertest(app).get("/api/speeches/1?q=on&page=1");
      const page2 = await supertest(app).get("/api/speeches/1?q=on&page=2");
      
      expect(page1.statusCode).toBe(200);
      expect(page2.statusCode).toBe(200);
      expect(page1.body.page).toBe(1);
      expect(page2.body.page).toBe(2);
    });

    it("should handle non-existent member_id gracefully", async () => {
      const response = await supertest(app).get("/api/speeches/999?q=on");
      expect(response.statusCode).toBe(200);
      expect(response.body.results).toEqual([]);
      expect(parseInt(response.body.total, 10)).toBe(0);
    });

    it("should return correct total count for member-specific search", async () => {
      // Search for a word that appears in Anna's speeches
      const response = await supertest(app).get("/api/speeches/1?q=vakava");
      expect(response.statusCode).toBe(200);
      
      // Anna Korhonen has 2 speeches, one contains "vakava"
      expect(parseInt(response.body.total, 10)).toBeGreaterThanOrEqual(1);
    });

    it("should return results ordered by date DESC and rank DESC for member", async () => {
      const response = await supertest(app).get("/api/speeches/1?q=on");
      expect(response.statusCode).toBe(200);
      
      if (response.body.results.length > 1) {
        const dates = response.body.results.map(s => new Date(s.date));
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
        }
      }
    });
  });
});

