const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const puppeteer = require('puppeteer')
const cheerio = require("cheerio")

async function performScraping(stock) {
  try {
    let stockData = {}
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })

    const statementsPromise = browser.newPage().then(page => {
      return page.goto(`https://www.macrotrends.net/stocks/charts/${stock}/stockname/financial-statements`, { waitUntil: 'networkidle0' })
        .then(() => page.content())
        .finally(() => page.close())
    })
    
    const cashFlowPromise = browser.newPage().then(page => {
      return page.goto(`https://www.macrotrends.net/stocks/charts/${stock}/stockname/cash-flow-statement`, { waitUntil: 'networkidle0' })
        .then(() => page.content())
        .finally(() => page.close())
    })
    
    const [htmlContent1, htmlContent2] = await Promise.all([statementsPromise, cashFlowPromise])
        
    const $1 = cheerio.load(htmlContent1)
    const $2 = cheerio.load(htmlContent2)
    
    await browser.close()

    //financialStatementData
    const table1 = $1('#jqxgrid')
    const table1Heading = $1('.main_content_container.container-fluid > div:nth-child(2) > h2:first-child').text() || undefined

    if (table1.length > 0 && table1Heading) {
      let years1 = []

      const yearsData1 = table1.find('#columntablejqxgrid')
      if (yearsData1.length) {
        const spanElements = yearsData1.find('span')
        if (spanElements.length) {
          spanElements.each((index, element) => {
            years1.push($1(element).text())
          })
        }
      }

      stockData = { ...stockData, "Income Statements" : { Heading: table1Heading, [years1[0]]: years1.slice(2) } }
      const ids1 = pushIdsToArray(21)
      ids1.forEach((id) => {
        const dataObj = generateYearlyDataArr(table1, id, $1, "Income Statements")
        stockData = {
          ...stockData,
          "Income Statements": {
            ...stockData["Income Statements"],
            [Object.keys(dataObj)[0]]: dataObj[Object.keys(dataObj)[0]]
          }
        }
      })
    }

    //cash flow statements
    const table2 = $2('#jqxgrid')
    const table2Heading = $2('.main_content_container.container-fluid > div:nth-child(2) > h2:first-child').text() || undefined

    if (table2.length > 0 && table2Heading) {
      let years2 = []

      const yearsData2 = table2.find('#columntablejqxgrid')
      if (yearsData2.length) {
        const spanElements = yearsData2.find('span')
        if (spanElements.length) {
          spanElements.each((index, element) => {
            years2.push($2(element).text())
          })
        }
      }

      stockData = { ...stockData, "Cash Flow Statements" : { Heading: table1Heading, [years2[0]]: years2.slice(2) } }

      const ids2 = pushIdsToArray(28)
      ids2.forEach((id) => {
        const dataObj = generateYearlyDataArr(table2, id, $2, "Cash Flowh Statements")
        stockData = {
          ...stockData,
          "Cash Flow Statements": {
            ...stockData["Cash Flow Statements"],
            [Object.keys(dataObj)[0]]: dataObj[Object.keys(dataObj)[0]]
          }
        }
      })
      const FCF = calculateFreeCashFlow(stockData["Cash Flow Statements"])
      stockData = { ...stockData,
      "Cash Flow Statements": {
        ...stockData["Cash Flow Statements"],
        "Free Cash Flow" : FCF
      }}
    }

    return { stockData }
  } catch (e) {
    console.error(e)
  }
}

function generateYearlyDataArr(htmlElement, id, $) {
  const dataArr = htmlElement.find(`${id}`)
  if (dataArr.length) {
    const divElements = dataArr.find('div[role="gridcell"] div')
    if (divElements.length) {
      let data = []
      divElements.each((index, element) => {
        data.push($(element).text())
      })
      if (data.length) {
        const dataObj = createObjectFromArray(data)
        return dataObj
      }
    }
  }
}

function createObjectFromArray(arr) {
  const nonEmptyArr = arr.filter(val => val !== "")
  const obj = {
    [nonEmptyArr[0]]: nonEmptyArr.slice(1)
  }
  return obj
}

function pushIdsToArray(num) {
  const ids = []
  for (let i = 0; i < num; i++) {
    ids.push(`#row${i}jqxgrid`)
  }
  return ids
}

function calculateFreeCashFlow(data) {
  const cashFlow = data["Cash Flow From Operating Activities"].map((val) => {
    const num = parseFloat(val.replace(/[^0-9.-]+/g, ""))
    return isNaN(num) ? 0 : num
  })
  const netChange = data["Net Change In Property, Plant, And Equipment"].map(
    (val) => {
      const num = parseFloat(val.replace(/[^0-9.-]+/g, ""))
      return isNaN(num) ? 0 : num
    }
  )
  const freeCashFlow = cashFlow.map((val, index) =>
    (val + netChange[index]).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  )
  return freeCashFlow
}

exports.getAllStocks = catchAsync(async (req, res, next) => {

  res.status(200).json({
    message: "stocksData"
  })
})

exports.getStockData = catchAsync(async (req, res, next) => {
  const stock = req.params.stock

  const { stockData } = await performScraping(stock)

  if (Object.keys(stockData)[0].length < 3 || Object.keys(stockData)[1].length < 3) return next(new AppError('It was not possible to obtain stock data. Please contact the administrator.', 404))

  res.status(200).json({
    message: stockData
  })
})