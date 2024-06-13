export const getAllPairs = async (client) => {
  try {
    const response = await client.exchangeInfo();
    return response.data.symbols.map(symbol => symbol.symbol);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTradesForPair = async (client, pair) => {
  try {
    const response = await client.myTrades(pair, {
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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getAllTrades = async (client) => {
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
          const pairTrades = await getTradesForPair(client, assetPairs[j]);
          trades.push(...pairTrades);
          queryCounter++;
          console.log("Запрос " + queryCounter);
        }
      }
    }

    return trades;
  } catch (error) {
    throw new Error(error.message);
  }
};