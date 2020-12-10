const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    answer: {
      required: true,
      type: String
    },
    options: {
      required: true,
      type: Array
    },
    optionType: {
      required: true,
      type: String
    },
    questionType: {
      type: String
    },
    keywords: {
      type: Array
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

QuestionSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Question', QuestionSchema)
