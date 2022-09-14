const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');
const { body, validationResult } = require('express-validator');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here
app.get("/mario", async (req, res) => {
  const characters = await marioModel.find();
  res.status(200).json({
    characters
  })
});

app.get("/mario/:id", async (req, res) => {
  try {
    const character = await marioModel.findOne({ _id: req.params.id });
    res.status(200).json({
      character
    });
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
});

app.post("/mario", body("name").isString(), body("weight").isNumeric(), async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'either name or weight is missing' });
    }
    const charact = await marioModel.create({ name: req.body.name, weight: req.body.weight });
    res.status(201).json({
      charact
    })
  } catch (e) {
    res.status(400).json({ message: 'either name or weight is missing' });
  }
});

app.patch("/mario/:id", async (req, res) => {
  try {
    var updateObject = req.body;
    const character = await marioModel.updateOne({ _id: req.params.id }, { $set: updateObject });
    const char = await marioModel.findOne({ _id: req.params.id });
    res.status(200).json({
      char
    });
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
});

app.delete("/mario/:id", async (req, res) => {
  try {
    const character = await marioModel.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'character deleted'
    });
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
});

module.exports = app;