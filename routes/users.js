"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
<<<<<<< HEAD
}

=======
}
>>>>>>> a7fbf014d5d4bf18ef32ef338d129be348e4d6c6
