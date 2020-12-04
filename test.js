'use strict'

const data = function() {
  return function(val) {
    try {
      if (val[0]) {
        return val
      }
      throw 'err'
    } catch (err) {
      return new Error(err.message)
    }
    return val
  }
}

console.log(data()([12]))
console.log(data()([12]))
console.log(data()({}))
