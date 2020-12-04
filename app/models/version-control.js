const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const VersionSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    version: { type: String, required: true },
    uploadedby: { type: mongoose.Types.ObjectId, required: true },
    path: { type: String, required: true },
    description: { type: String, required: true },
    filescount: { type: Number, default: 0 },
    issues: { type: Array }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

VersionSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('projectVersion', VersionSchema)
