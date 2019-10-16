const request = require("supertest");
const server = require("./server");

describe("server.js tests", () => {
  describe("GET /people/:sortBy? endpoint", () => {
    it("should respond with a status code 200 OK", async () => {
      let response = await request(server).get("/people");
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text).length).toBe(87);
    }, 20000);

    it("first response with name should be Akbar", async () => {
      let response = await request(server).get("/people/name");
      expect(JSON.parse(response.text)[0].name).toBe("Ackbar");
      expect(JSON.parse(response.text).length).toBe(87);
    }, 20000);

    it("first response with mass should be Ratts Tyerell", async () => {
      let response = await request(server).get("/people/mass");
      expect(JSON.parse(response.text)[0].name).toBe("Ratts Tyerell");
      expect(JSON.parse(response.text).length).toBe(87);
    }, 20000);

    it("first response with height should be Yoda", async () => {
      let response = await request(server).get("/people/height");
      expect(JSON.parse(response.text)[0].name).toBe("Yoda");
      expect(JSON.parse(response.text).length).toBe(87);
    }, 20000);
  });

  describe("GET /planets endpoint", () => {
    it("Should respond with a status code 200 OK", async () => {
      let response = await request(server).get("/planets");
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text).length).toBe(61);
    }, 20000);

    it("Should include the names of the people instead of URLs", async () => {
      let response = await request(server).get("/planets");
      expect(JSON.parse(response.text)[0].residents[0]).toBe("Leia Organa");
      expect(JSON.parse(response.text)[0].residents[2]).toBe("Raymus Antilles");
      expect(JSON.parse(response.text)[8].residents[0]).toBe("Boba Fett");
    }, 40000);
  });
});
