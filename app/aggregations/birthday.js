const birthdayAggregation = () => {
  return [
    {
      $project: {
        year: {
          $year: '$dob'
        },
        month: {
          $month: '$dob'
        },
        day: {
          $dayOfMonth: '$dob'
        },
        name: '$name',
        aboutMe: '$aboutMe'
      }
    },
    {
      $match: {
        month: new Date('2019-04-23').getMonth() + 1,
        day: new Date('2019-04-23').getDate()
      }
    }
  ]
}


const currentMonthBirthDay = ()=>{
    return [
        {
          $project: {
            year: {
              $year: '$dob'
            },
            month: {
              $month: '$dob'
            },
            day: {
              $dayOfMonth: '$dob'
            },
            name: '$name',
            aboutMe: '$aboutMe'
          }
        },
        {
          $match: {
            month: new Date().getMonth() + 1,
            day: {$gt:new Date().getDate()}
          }
        }
      ]
}

module.exports = {
  birthdayAggregation,
  currentMonthBirthDay
}
