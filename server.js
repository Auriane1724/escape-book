const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API EscapeBook running on http://localhost:${PORT}`);
  console.log("✅ server.js utilise bien ./src/app.js");
});
