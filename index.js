import express from 'express';
import { Spot } from '@binance/connector';
import bodyParser from 'body-parser'
import { getAllTrades } from './binanceClient';
const app = express();


app.use(bodyParser.json());

app.post('/binance', async (req, res) => {
  const { apiKey, apiSecret } = req.body;
  if (!apiKey || !apiSecret) {
    return res.status(400).json({ error: 'API key and secret are required' });
  }
  try {
    const client = new Spot(apiKey, apiSecret);
    const data = await getAllTrades(client);
    console.log(`Загружено ${data.length} трейдов`)
    res.status(200).json(data);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Слушаем порт
app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;