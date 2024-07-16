import express from 'express';
import { Spot } from '@binance/connector';
import bodyParser from 'body-parser'
import { getMyTrades, getAllOrders } from './binanceClient.js';
import axios from 'axios';
const app = express();


app.use(bodyParser.json());

app.post('/binance/myTrades', async (req, res) => {
  const { apiKey, apiSecret, dateFrom, dateTo } = req.body;
  if (!apiKey || !apiSecret) {
    return res.status(400).json({ error: 'API key and secret are required' });
  }

  if (!dateFrom || !dateTo) {
    return res.status(400).json({ error: 'dateFrom and dateTo are required' })
  }

  try {
    console.log("Получение myTrades")
    const client = new Spot(apiKey, apiSecret);
    const data = await getMyTrades(client, dateFrom, dateTo);
    console.log(`Загружено ${data.length} трейдов`)
    res.status(200).json(data);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/binance/getExchangeRate', async (req, res) => {
  const {symbol, date} = req.body;
  if (!symbol || !date) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const baseUrl = 'https://api.binance.com';
    const endpoint = '/api/v3/klines';
    const pair = `${symbol}BTC`;

    const startDate = new Date(date).setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date).setUTCHours(23, 59, 59, 999);

    const params = {
        symbol: pair,
        interval: '1d',
        startTime: startDate,
        endTime: endDate,
        limit: 1
    };
    const response = await axios.get(`${baseUrl}${endpoint}`, { params });

    if (response.data.length === 0) {
        throw new Error('No data available for the specified date.');
    }

    const price = parseFloat(response.data[0][4]);
    return res.status(200).json(price);
  } catch (error) {
    console.error('Error fetching price:', error.message);
    return res.status(500).json({error: error})
}
})

app.post('/binance/allOrders', async (req, res) => {
  const { apiKey, apiSecret } = req.body;
  if (!apiKey || !apiSecret) {
    return res.status(400).json({ error: 'API key and secret are required' });
  }
  try {
    console.log("Получение allOrders")
    const client = new Spot(apiKey, apiSecret);
    const data = await getAllOrders(client);
    console.log(`Загружено ${data.length} трейдов`)
    res.status(200).json(data);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;