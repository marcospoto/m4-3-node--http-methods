"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { customers, stock } = require("./data/inventory");

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇

  .post("/order", (req, res) => {
    console.log(req.body);

    const {
      order,
      size,
      givenName,
      surname,
      email,
      address,
      city,
      province,
      postcode,
      country,
    } = req.body;
    const existingCust = customers;
    const sockInv = stock;
    const isExistingCust = customers.find(
      (customer) =>
        (givenName.toLowerCase() === customer.givenName.toLowerCase() &&
          surname.toLowerCase() === customer.surname.toLowerCase()) ||
        email.toLowerCase() === customer.email.toLowerCase() ||
        address.toLowerCase() === customer.address.toLowerCase()
    );

    if (isExistingCust) {
      res.status(200).json({
        status: "error",
        message: "repeat-customer",
      });
    } else if (stock[order] < 1 || stock["shirt"][size] < 1) {
      res.status(200).json({
        status: "error",
        message: "unavailable",
      });
    } else if (!email.includes("@")) {
      res.status(200).json({
        status: "error",
        error: "missing-data",
      });
    } else if (country.toLowerCase() !== "c anada") {
      res.status(200).json({
        status: "error",
        error: "undeliverable",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: "Your order was successfully submitted!",
      });
    }
  })

  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("/", (req, res) => {
    res.status(200).json({ msg: "now this has its own get endpoint" });
  })
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
