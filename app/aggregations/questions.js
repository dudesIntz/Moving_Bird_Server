module.exports = {
  getRandomQuestions(count) {
    return [
      {
        $sample: { size: count || 5 }
      },{
        $project:{answer:0}
      }
    ]
  }
}
