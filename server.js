const express = require("express");
const path    = require("path");
const app     = express();

app.use("/", express.static(path.join(__dirname, "public")));

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "tajna123";

app.use("/admin", (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    res.set("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).send("Pristup odbijen");
  }
  const [user, pass] = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");
  if (user === ADMIN_USER && pass === ADMIN_PASS) return next();
  res.set("WWW-Authenticate", 'Basic realm="Admin"');
  return res.status(401).send("Pogrešni podaci");
});

app.use("/admin", express.static(path.join(__dirname, "admin")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
