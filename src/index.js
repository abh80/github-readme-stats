const express = require("express");
const app = express();

const StackExchange = require("./routes/StackExchange");


app.use("/stack-exchange", StackExchange);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
