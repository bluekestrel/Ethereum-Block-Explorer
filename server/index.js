const cors = require('cors');
const express = require('express');

const app = express();
const PORT = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Hello World!"});
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});