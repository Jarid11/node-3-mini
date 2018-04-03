require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const mc = require(`./controllers/messages_controller`);

const createInitialSession = require(`./middlewares/session`);
const filter = require(`./middlewares/filter`);

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 10000
    }
  })
);

app.use((req, res, next) => createInitialSession(req, res, next));
app.use((req, res, next) => {
  const { method } = req;

  if (method === "POST" || method === "PUT") {
    filter(req, res, next);
  } else {
    next();
  }
});

app.post("/api/messages", mc.create);
app.get("/api/messages", mc.read);
app.put("/api/messages", mc.update);
app.delete("/api/messages", mc.delete);
app.get("/api/messages/history", mc.history);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
