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
// [GenAI Use] Prompt: "In JavaScript, how do I calculate how many full hours have passed between two Date objects?"
function applyDecay(fullness, lastTime) {
  const now = new Date()
  const before = new Date(lastTime)
  // [GenAI Use] LLM Response Start
  const hours = Math.floor((now - before) / (1000 * 60 * 60))
  // [GenAI Use] LLM Response End
  // [GenAI Use] Reflection: subtracting Dates gives ms so dividing by 1000*60*60 gets hours. Math.floor so it only decays after a full hour. I wrote the newFullness calc and the < 0 clamp myself to fit our game rules
  let newFullness = fullness - (hours * 3)
  // dont let it go negative
  if (newFullness < 0) newFullness = 0
  return newFullness
}

module.exports = { getLevel, getMood, applyDecay }