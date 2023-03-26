const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const puppeteer = require('puppeteer')
const cheerio = require("cheerio")

let stockData = {}

async function performScraping(stock) {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(`https://www.macrotrends.net/stocks/charts/${stock}/stockname/financial-statements`, { waitUntil: 'networkidle0' })

    console.log($.html())

    const htmlContent = await page.content()
    const $ = cheerio.load(htmlContent)
    await browser.close()

    //financialStatementData
    const table = $('#jqxgrid')
    const tableHeading = $('.main_content_container.container-fluid > div:nth-child(2) > h2:first-child').text() || undefined

    if (table.length > 0 && tableHeading) {
          //years data
      let years = []
      if (table.length) {
        const yearsData = table.find('#columntablejqxgrid')
        if (yearsData.length) {
          const spanElements = yearsData.find('span')
          if (spanElements.length) {
            spanElements.each((index, element) => {
              years.push($(element).text())
            })
          }
        }
      }
      stockData = { ...stockData, Heading: tableHeading, [years[0]]: years.slice(2) }
      const ids = [
        "#row0jqxgrid",
        "#row1jqxgrid",
        "#row2jqxgrid",
        "#row3jqxgrid",
        "#row4jqxgrid",
        "#row5jqxgrid",
        "#row6jqxgrid",
        "#row7jqxgrid",
        "#row8jqxgrid",
        "#row9jqxgrid",
        "#row10jqxgrid",
        "#row11jqxgrid",
        "#row12jqxgrid",
        "#row13jqxgrid",
        "#row14jqxgrid",
        "#row15jqxgrid",
        "#row16jqxgrid",
        "#row17jqxgrid",
        "#row18jqxgrid",
        "#row19jqxgrid",
        "#row20jqxgrid",
        "#row21jqxgrid",
      ]
      //financialTableDataGeneration
      ids.forEach((id) => {
        generateYearlyDataArr(table, id, $)
      })
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
        stockData = { ...stockData, [Object.keys(dataObj)[0]]: dataObj[Object.keys(dataObj)[0]] }
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

exports.getAllStocks = catchAsync(async (req, res, next) => {
  
  res.status(200).json({
    message: "stocksData"
  })
})

exports.getStockData = catchAsync(async (req, res, next) => {
  const stock = req.params.stock

  const { stockData } = await performScraping(stock)

  if(Object.keys(stockData).length < 3) return next(new AppError('It was not possible to obtain stock data. Please contact the administrator.', 404))

  res.status(200).json({
    message: stockData
  })
})

//https://www.macrotrends.net/stocks/charts/UNH/unitedhealth-group/financial-statements
//https://www.macrotrends.net/stocks/charts/UNH/unitedhealth-group/cash-flow-statement
