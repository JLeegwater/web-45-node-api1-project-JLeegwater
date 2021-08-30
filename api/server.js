// BUILD YOUR SERVER HERE
// IMPORTS
const express = require("express");
const Users = require("./users/model");
// INSTANCE OF EXPRESS APP
const server = express();
// GLOBAL MIDDLEWARE
server.use(express.json());
// ENDPOINTS

// [GET] / (Hello World endpoint)
server.get("/", (req, res) => {
  res.status(200).json({ message: "Hello there!" });
});

server.post("/api/users", (req, res) => {
  const newUser = { name: req.body.name, bio: req.body.bio };
  if (req.body.name && req.body.bio) {
    Users.insert(newUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  } else
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
});

server.get("/api/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("🚀 ~ file: server.js ~ line 21 ~ server.post ~ err", err);
      res.status(500).json({ message: err.message });
    });
});

server.get("/api/users/:id", (req, res) => {
  Users.findById(req.params.id)
    .then((user) => {
      user
        ? res.status(200).json(user)
        : res
            .status(404)
            .json({ message: "The user with the specified ID does not exist" });
    })
    .catch((err) => {
      console.log("🚀 ~ file: server.js ~ line 21 ~ server.post ~ err", err);
      res.status(500).json({ message: err.message });
    });
});

// [DELETE] /api/users/:id (D of CRUD, remove user with :id)
server.delete("/api/users/:id", (req, res) => {
  Users.remove(req.params.id)
    .then((user) => {
      user
        ? res.status(200).json(user)
        : res
            .status(404)
            .json({ message: `The user with the specified ID does not exist` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// [PUT] /api/users/:id (U of CRUD, update user with :id using JSON payload)
server.put("/api/users/:id", async (req, res) => {
  if (req.body.name && req.body.bio) {
    await Users.update(req.params.id, req.body)
      .then((user) => {
        user
          ? res.status(200).json(user)
          : res
              .status(404)
              .json({
                message: "The user with the specified ID does not exist",
              });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } else
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
});

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;
