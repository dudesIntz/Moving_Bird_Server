const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const ResultSchema = new mongoose.Schema(
  {
    attempts: {type:Array, default:[]}
  },
  {
    versionKey: false,
    timestamps: true
  }
)

ResultSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Result', ResultSchema)
