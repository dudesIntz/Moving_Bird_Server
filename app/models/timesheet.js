const mongoose = require('mongoose')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const TimesheetSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    project: { type: String, required: true },
    task: { type: String, required: true },
    date: { type: Date, required: true },
    taskdetails: { type: String, default: '' },
    validated: { type: Boolean, default: false },
    timespend: {
      hours: {
        type: Number,
        required: true,
        validate: {
          validator(v) {
            if (v <= 24) {
              return true
            }
            return false
          },
          message: 'INVALID_HOUR'
        }
      },
      minutes: {
        type: Number,
        required: true,
        validate: {
          validator(v) {
            if (v <= 60) {
              return true
            }
            return false
          },
          message: 'INVALID_MINUTES'
        }
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

TimesheetSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Timesheet', TimesheetSchema)
