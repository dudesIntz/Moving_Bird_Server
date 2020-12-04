const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    client: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true,
      ref: 'User'
    },
    members: [
      {
        member: {
          type: String,
          ref: 'User'
        },
        empId: {
          type: String
        },
        role: {
          type: String,
          enum: ["Programmer", "Tester", "Lead", "Supervisor", "Manager"],
          default: 'member'
        }
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true
  }
)
ProjectSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Project', ProjectSchema)
