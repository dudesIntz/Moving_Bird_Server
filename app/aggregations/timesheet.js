const mongoose = require('mongoose')
module.exports = {
  getChart(id) {
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return [
      {
        $match: {
          task_id: mongoose.Types.ObjectId(id),
          date: {
            $lte: lastDay,
            $gte: firstDay
          }
        }
      },
      {
        $group: {
          _id: '$project',
          totalHours: { $sum: '$timespend.hours' },
          totalMinutes: { $sum: '$timespend.minutes' }
        }
      },
      {
        $addFields: {
          time: { $divide: ['$totalMinutes', 60] }
        }
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              title: '$_id',
              value: { $add: ['$totalHours', '$time'] }
            }
          }
        }
      }
    ]
  },

  exportTimesheet(req) {
    return [
      {
        $match: {
          task_id: mongoose.Types.ObjectId(req.task_id),
          date: {
            $lte: new Date(req.enddate),
            $gte: new Date(req.startdate)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
          details: {
            $push: {
              project: '$project',
              task: '$task',
              taskdetails: '$taskdetails',
              timespend: {
                $concat: [
                  { $toString: '$timespend.hours' },
                  ':',
                  { $toString: '$timespend.minutes' }
                ]
              }
            }
          }
        }
      },
      { $sort: { _id: -1 } }
    ]
  }
}
