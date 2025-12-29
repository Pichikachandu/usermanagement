const request = require("supertest");
const app = require("../app");
const db = require("./setup");

jest.setTimeout(60000);

beforeAll(async () => {
    await db.connect();
});

afterEach(async () => {
    await db.clearDatabase();
});

afterAll(async () => {
    await db.closeDatabase();
});

describe("Auth APIs", () => {

    test("Signup – success", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                fullName: "Test User",
                email: "test@example.com",
                password: "StrongPass123"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    test("Signup – duplicate email", async () => {
        await request(app).post("/api/auth/signup").send({
            fullName: "Test User",
            email: "test@example.com",
            password: "StrongPass123"
        });

        const res = await request(app).post("/api/auth/signup").send({
            fullName: "Test User",
            email: "test@example.com",
            password: "StrongPass123"
        });

        expect(res.statusCode).toBe(409);
    });

    test("Login – success", async () => {
        await request(app).post("/api/auth/signup").send({
            fullName: "Test User",
            email: "test@example.com",
            password: "StrongPass123"
        });

        const res = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "test@example.com",
                password: "StrongPass123"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test("Login – wrong password", async () => {
        await request(app).post("/api/auth/signup").send({
            fullName: "Test User",
            email: "test@example.com",
            password: "StrongPass123"
        });

        const res = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "test@example.com",
                password: "WrongPass"
            });

        expect(res.statusCode).toBe(401);
    });

    test("Protected route – no token", async () => {
        const res = await request(app).get("/api/auth/me");
        expect(res.statusCode).toBe(401);
    });

});
