const express = require("express");
const router = express.Router();
const db = require("./dbConnection");
const { noteCreateValidation } = require("./validation");
const jwt = require("jsonwebtoken");

router.post("/create_note", noteCreateValidation, (req, res, next) => {
  const theToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(theToken, "the-super-strong-secrect");
  db.query(
    `SELECT * FROM Users WHERE id = ${db.escape(decoded.id)};`,
    (err, result) => {
      if (result?.length) {
        db.query(
          `INSERT INTO Notes (userId, title, note) VALUES ('${
            decoded.id
          }', ${db.escape(req.body.title)}, ${db.escape(req.body.note)})`,
          (err, result) => {
            if (err) {
              throw err;
              return res.status(400).send({
                msg: err,
              });
            }
            return res.status(201).send({
              msg: "The user has been registerd with us!",
              data: result || {},
            });
          }
        );
      }
    }
  );
});

router.get("/", (req, res, next) => {
  const theToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(theToken, "the-super-strong-secrect");
  db.query(
    `SELECT * FROM Notes WHERE userId = ${db.escape(decoded.id)};`,
    (err, result) => {
      if (result?.length) {
        return res.send({
          error: false,
          data: result,
          message: "Fetch Successfully.",
        });
      }
    }
  );
});

module.exports = router;
