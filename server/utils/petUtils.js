// pet helper functions
// used AI to help figure out the math for decay, prompt: "how to calculate hours between two dates in js"

// figure out what level the pet is based on exp
function getLevel(exp) {
  if (exp >= 300) return 3  // adult
  if (exp >= 150) return 2  // teen
  if (exp >= 50) return 1   // baby
  return 0                  // still an egg
}

// figure out mood based on how full the pet is
function getMood(fullness) {
  if (fullness > 60) return 'happy'
  if (fullness >= 30) return 'neutral'
  return 'sad'  // poor pet
}

// calculate how much fullness dropped since last time we checked
// drops 3 per hour, so if its been 5 hours thats -15
function applyDecay(fullness, lastTime) {
  const now = new Date()
  const before = new Date(lastTime)

  // get hours passed, round down so we dont over-deduct
  const hours = Math.floor((now - before) / (1000 * 60 * 60))
  const dropped = hours * 3

  // make sure it dont go below 0
  const result = fullness - dropped
  if (result < 0) return 0
  return result
}

module.exports = { getLevel, getMood, applyDecay }