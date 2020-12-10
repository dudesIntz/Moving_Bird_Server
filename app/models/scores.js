const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const ResultSchema = new mongoose.Schema(
  {
    score: {
      type: String,
      required: true
    },
    user: {
      required: true,
      type: mongoose.Types.ObjectId
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

ResultSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Result', ResultSchema)
