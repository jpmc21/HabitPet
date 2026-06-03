// pet helper stuff

// exp to level, simple if else
function getLevel(exp) {
  if (exp >= 300) return 3  // adult
  if (exp >= 200) return 2  // teen  
  if (exp >= 100) return 1   // baby
  return 0  // egg
}

// mood from fullness
function getMood(fullness) {
  if (fullness > 60) return 'happy'
  if (fullness >= 30) return 'neutral'
  return 'sad'  // very hungry
}

// how much fullness dropped since lastTime
// every hour it goes down 3
function applyDecay(fullness, lastTime) {
  const now = new Date()
  const before = new Date(lastTime)
  // hours passed, round down
  const hours = Math.floor((now - before) / (1000 * 60 * 60))
  let newFullness = fullness - (hours * 3)
  // dont let it go negative
  if (newFullness < 0) newFullness = 0
  return newFullness
}

module.exports = { getLevel, getMood, applyDecay }