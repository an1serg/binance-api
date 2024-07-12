export const getAllPairs = async (client) => {
  try {
    const response = await client.exchangeInfo();
    return response.data.symbols.map(symbol => symbol.symbol);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTradesForPair = async (client, pair, dateFrom, dateTo) => {
  try {
    const response = await client.myTrades(pair, {
      limit: 1000,
      startTime: dateFrom,
      endTime: dateTo
    });
    return response.data;
  } catch (error) {
    console.log(`Error getTradesForPair!!!`)
    console.log(error)
    console.log(error.data)
    throw new Error(error.message);
  }
};

export const getOrdersForPair = async (client, pair) => {
  try {
    const response = await client.allOrders(pair, {
      limit: 1000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAccountInfo = async (client) => {
  try {
    const response = await client.account();
    return response.data.balances.filter(balance => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMyTrades = async (client, dateFrom, dateTo) => {
  try {
    let queryCounter = 0;
    const pairs = await getAllPairs(client);
    const accountInfo = await getAccountInfo(client);
    const trades = [];

    for (let i = 0; i < pairs.length; i++) {
      const accountBalance = accountInfo[i];
      if (accountBalance) {
        const asset = accountBalance.asset;
        const assetPairs = pairs.filter(pair => pair.includes(asset));
        
        for (let j = 0; j < assetPairs.length; j++) {
          console.log(`Получение данных для пары: ${assetPairs[j]}`)
          const pairTrades = await getTradesForPair(client, assetPairs[j], dateFrom, dateTo);
          trades.push(...pairTrades);
          queryCounter++;
          if (queryCounter % 100 === 0) console.log(`Выполнено ${queryCounter} запросов`)
        }
      }
    }

    return trades;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllOrders = async (client) => {
  try {
    let queryCounter = 0;
    const pairs = await getAllPairs(client);
    const accountInfo = await getAccountInfo(client);
    const trades = [];

    for (let i = 0; i < pairs.length; i++) {
      const accountBalance = accountInfo[i];
      if (accountBalance) {
        const asset = accountBalance.asset;
        const assetPairs = pairs.filter(pair => pair.includes(asset));
        
        for (let j = 0; j < assetPairs.length; j++) {
          const pairTrades = await getOrdersForPair(client, assetPairs[j]);
          trades.push(...pairTrades);
          queryCounter++;
          if (queryCounter % 100 === 0) console.log(`Выполнено ${queryCounter} запросов`)
        }
      }
    }

    return trades;
  } catch (error) {
    throw new Error(error.message);
  }
};