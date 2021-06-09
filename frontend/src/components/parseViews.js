module.exports = function parseViews(number) {
    if (number > 1000000) {
      number = number.toString()
      number = number.slice(0, -6)
      number += "m"
    } else if (number > 1000) {
      number = number.toString()
      number = number.slice(0, -3)
      number += "k"
    }
    return number
  }


