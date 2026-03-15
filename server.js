const express = require("express");
const path    = require("path");
const app     = express();

// CSP header koji dozvoljava Firebase
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://unpkg.com; " +
"connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://ipapi.co https://*.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https://*.openstreetmap.org;"
  );
  next();
});

// Javna stranica
app.use("/", express.static(path.join(__dirname, "public")));

// Admin panel
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
