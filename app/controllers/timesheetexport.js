// Require library
var xl = require('excel4node')
const typeChecker = require('../middleware/typeChecker')
function excel(res, item) {
  // Create a new instance of a Workbook class
  const wb = new xl.Workbook()

  // Add Worksheets to the workbook
  const ws = wb.addWorksheet('Timesheet')
  const ws2 = wb.addWorksheet('Sheet 2')

  // Create a reusable style
  const style = wb.createStyle({
    font: {
      color: 'blue',
      size: 12
    }
  })

  // Create a reusable style
  const Titlestyle = wb.createStyle({
    font: {
      color: 'red',
      size: 14
    }
  })

  function createCell(data, row, column, style = {}) {
    if (typeChecker.isString(data)) {
      return ws
        .cell(row, column)
        .string(data)
        .style(style)
    }
    if (typeChecker.isNumber(data)) {
      return ws
        .cell(row, column)
        .number(data)
        .style(style)
    }

    if (typeChecker.isDate(data)) {
      return ws
        .cell(row, column)
        .date(data)
        .style(style)
    }
    if (typeChecker.isBoolean(data)) {
      return ws
        .cell(row, column)
        .bool(data)
        .style(style)
    }

    return {}
  }

  // returns { row: 2, col: 2}
  const excelRowCol = xl.getExcelRowCol('B2')

  const titles = [
    { title: 'Date', ref: '_id' },
    { title: 'Project', ref: 'project' },
    { title: 'Task', ref: 'task' },
    { title: 'Task Details', ref: 'taskdetails' },
    { title: 'Time Spend', ref: 'timespend' }
  ]

  titles.forEach((title, index) => {
    // cell value for title
    // @param { data, column, row , style}

    createCell(
      title.title,
      excelRowCol.row,
      excelRowCol.col + index,
      Titlestyle
    )
  })

  // generate excel for user data
  let currentRow = 1
  item.forEach((val, rowIndex) => {
    // generate excel for date
    createCell(val._id, excelRowCol.row + currentRow, excelRowCol.col, style)

    if (Array.isArray(val.details)) {
      // generate excel for project, task, taskdetails, timespend
      val.details.forEach((detail, rowIndex) => {
        titles.forEach((title, colIndex) => {
          const content = detail[title.ref]
          if (content) {
            createCell(
              content,
              excelRowCol.row + currentRow + rowIndex,
              excelRowCol.col + colIndex,
              style
            )
          }
        })
      })
    }
    currentRow += rowIndex + val.count + 1
  })

  //  res.send(ws);
  wb.write('timeSheet.xlsx', res)
}

module.exports = excel
