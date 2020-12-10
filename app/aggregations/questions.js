module.exports = {
  getRandomQuestions(count) {
    return [
      {
        $sample: { size: count || 5 }
      }
    ]
  }
}
