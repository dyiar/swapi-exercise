const express = require("express");
const server = express();
const axios = require("axios");

const baseURL = "https://swapi.co/api";

// Middleware

server.use(express.json());

function compare(req, res, next) {}

async function getPages(people, next) {
  if (next != null) {
    let response = await axios.get(next);
    let resultsPeople = response.data.results;
    resultsPeople = [...people, resultsPeople];
    let nextPage = response.data.next;
    getPages(resultsPeople, nextPage);
  } else {
    // console.log(people)
    console.log("2");
    return people;
  }
}

// routes

server.get("/people", (req, res) => {
  axios
    .get(`${baseURL}/people`)
    .then(response => {
      let people = response.data.results;
      //   console.log(people)
      let next = response.data.next;
      getPages(people, next).then(people => {
        console.log(people);
        console.log("1");
      });

      // console.log(results)
    })
    .catch(err => res.status(404).send({ error: "Issue loading people" }));
});

module.exports = server;
