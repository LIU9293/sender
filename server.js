const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const compression = require('compression');

//gzip
app.use(compression());

//static
app.use(express.static(path.resolve(__dirname, 'build')));

//always return index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port);

console.log('node server started on port ' + port);

