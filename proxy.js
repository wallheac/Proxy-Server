const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  req.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*')
  req.header('Access-Control-Allow-Headers', '*')
  next();
});

app.get('/organizer/panels', (req, res) => {
  request(
    { url: 'http://localhost:8080/organizer/panels' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json({content: JSON.parse(body)});
    }
  )
});

app.get('/organizer/papers', (req, res) => {
  let unassigned = req.query.unassigned
  let baseUrl = `http://localhost:8080/organizer/papers`
  let url = unassigned ? `${baseUrl}?unassigned=${unassigned}` : baseUrl
  request(
    { url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json({content: JSON.parse(body)});
    }
  )
});

app.post('/organizer/constructedpanel', (req, res) => {
  let url = `http://localhost:8080/organizer/constructedpanel`
  const body = req.body
  request.post({ url, body: [body], json: true },
    (error, response, body) => {
      if(error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error.message || body })
      }
      res.json(body)
    }
    )
})

app.post('/organizer/panel', (req, res) => {
  let url = `http://localhost:8080/organizer/panel`
  const body = req.body
  request.post({ url, body, json: true},
    (error, response, body) => {
      if(error || response.statusCode !== 200) {
        return res.status(500).json({type: 'error', message: error.message || body})
      }
      res.json(body)
    })
})

app.post('/organizer/paper/:paperId', (req, res) => {
  const id = req.params.paperId
  let url = `http://localhost:8080/organizer/paper/${id}`
  const body = req.body
  request.post({ url, body, json: true},
    (error, response, body) => {
      if(error || response.statusCode !== 200) {
        return res.status(500).json({type: 'error', message: error.message || body})
      }
      res.json(body)
    })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));