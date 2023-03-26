const catchAsync = require('../utils/catchAsync')

exports.getGuide = catchAsync(async (req, res, next) => {

    const stockSymbols = [
        'AAPL', 'ABT', 'ACN', 'ADBE', 'AIG', 'AMGN', 'AMT', 'AMZN', 'AXP', 'BA',
        'BAC', 'BIIB', 'BKNG', 'BLK', 'BMY', 'BRK.B', 'C', 'CAT', 'CHTR', 'CL',
        'CMCSA', 'COF', 'COP', 'COST', 'CRM', 'CSCO', 'CVS', 'CVX', 'DD', 'DHR',
        'DIS', 'DOW', 'DUK', 'EMR', 'EXC', 'F', 'FDX', 'GD', 'GE', 'GILD',
        'GM', 'GOOG', 'GOOGL', 'GS', 'HD', 'HON', 'IBM', 'INTC', 'JNJ', 'JPM',
        'KHC', 'KMI', 'KO', 'LLY', 'LMT', 'LOW', 'MA', 'MCD', 'MDLZ', 'MDT', 'MET', "META",
        'MMM', 'MO', 'MRK', 'MS', 'MSFT', 'NEE', 'NFLX', 'NKE', 'NVDA', 'ORCL',
        'PEP', 'PFE', 'PG', 'PM', 'PYPL', 'QCOM', 'RTX', 'SBUX', 'SLB', 'SO', 'SPG',
        'T', 'TGT', 'TMO', 'TSLA', 'TXN', 'UNH', 'UNP', 'UPS', 'USB', 'V', 'VZ',
        'WBA', 'WFC', 'WMT', 'XOM'
      ]
      
    res.render('guide', { stockSymbols })
})
