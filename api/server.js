const express = require("express");
const server = express();
const axios = require("axios");

let peopleHash = {};
const baseURL = "https://swapi.co/api";

// Middleware

server.use(express.json());

function compare(key) {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    let A = key === "name" ? a[key].toUpperCase() : a[key];
    let B = key === "name" ? b[key].toUpperCase() : b[key];

    let comparison = 0;

    if (key === "name") {
      if (A > B) {
        comparison = 1;
      } else if (A < B) {
        comparison = -1;
      }
      return comparison;
    } else {
      if (A.length > 4) {
        let tempArray = A.split("");
        for (i = 0; i < tempArray.length; i++) {
          if (tempArray[i] == ",") {
            tempArray.splice(i, 1);
          }
        }
        A = tempArray.join("");
      } else if (B.length > 4) {
        let tempArray = B.split("");
        for (i = 0; i < tempArray.length; i++) {
          if (tempArray[i] == ",") {
            tempArray.splice(i, 1);
          }
        }
        B = tempArray.join("");
      }

      if (A != "unknown" && B != "unknown") {
        A = parseInt(A);
        B = parseInt(B);
      } else if (A == "unknown" && B == "unknown") {
        A = Infinity;
        B = Infinity;
      } else if (A == "unknown" && B != "unknown") {
        A = Infinity;
        B = parseInt(B);
      } else {
        B = Infinity;
        A = parseInt(A);
      }

      return A - B;
    }
  };
}

// routes

server.get(`/people/:sortby?`, async (req, res, next) => {
  const sortBy = Object.values(req.params);

  if (Object.keys(peopleHash).length === 87) {
    let people = [];
    Object.keys(peopleHash).forEach(key => {
      people.push(peopleHash[key]);
    });
    people.sort(compare(sortBy));
    res.status(200).send(people);
  } else {
    try {
      let response = await axios.get(`${baseURL}/people`);
      let people = await response.data.results;
      let next = await response.data.next;

      while (next != null) {
        response = await axios.get(next);
        people = await people.concat(response.data.results);
        next = await response.data.next;
      }

      people.sort(compare(sortBy));
      res.status(200).send(people);

      if (Object.keys(peopleHash).length === 0) {
        for (i = 0; i <= people.length - 1; i++) {
          peopleHash[people[i].url] = people[i];
        }
      }
    } catch (error) {
      return next(error);
    }
  }
});

server.get(`/planets`, async (req, res, next) => {
  try {
    let response = await axios.get(`${baseURL}/planets`);
    let planets = await response.data.results;
    let next = await response.data.next;

    while (next != null) {
      response = await axios.get(next);
      planets = await planets.concat(response.data.results);
      next = await response.data.next;
    }

    if (Object.keys(peopleHash).length === 87) {
      let count = 0;
      while (count <= planets.length - 1) {
        for (i = 0; i <= planets[count].residents.length - 1; i++) {
          planets[count].residents[i] =
            peopleHash[planets[count].residents[i].name];
        }
        count += 1;
      }
    } else {
      let count = 0;
      while (count <= planets.length - 1) {
        for (i = 0; i <= planets[count].residents.length - 1; i++) {
          temp = await axios.get(planets[count].residents[i]);
          peopleHash[temp.data.url] = await temp.data;
          planets[count].residents[i] = await temp.data.name;
        }
        count += 1;
      }
    }
    res.status(200).send(planets);
  } catch (error) {
    return next(error);
  }
});

module.exports = server;
