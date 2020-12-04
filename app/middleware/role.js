module.exports = {
  /**
   * Return all user Access
   */
  allUser() {
    return ['member', 'teamlead', 'admin', 'supervisor', 'manager']
  },

  middleLevelUser() {
    return ['teamlead', 'admin', 'supervisor', 'manager']
  },
  highLevelUser() {
    return ['admin', 'supervisor', 'manager']
  }
}
