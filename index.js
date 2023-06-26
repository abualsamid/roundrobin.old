
function shuffle(array) {
  let counter = array.length

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter)

    // Decrease counter by 1
    counter--

    // And swap the last element with it
    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}
const rotate = a => ([a.pop(),...a])

let players = require('./players.json')
const config = require('./config.json')
// let players = shuffle(require('./players.json'))
const COURTS = Math.floor(players.length/4)
const HAS_BYE = players.length % 4
let BYES = []
let teams = new Set()

console.log('<!doctype html>')
console.log('<html>')
console.log('<meta charset="utf-8">')
console.log('<meta name="viewport" content="width=device-width, initial-scale=1">')
console.log('<link rel="stylesheet" href="styles.css?v=1.0">')
console.log('<body>')
console.log(`<center><h2>${config.title} ${config.date}</h2></center>`)
console.log('<div">Games to 11, win by 1.')
console.log('Top team serves, bottom team choses side. Winning team writes the score down.')
console.log('</div>')
console.log('<br/>')
console.log('<table border="1">')
console.log('<tr><td>&nbsp;</td>')
  for(court=1;court<=COURTS;court++) {
    console.log(`<th>Court ${court}</th><th>Score</th>`)
  }
if (HAS_BYE) {
  console.log('<th>BYE</th>')
}
console.log('</tr>')
let i = 0
let found = false 
let player1, player2, player3, player4
let round = 1
while (i < 500 ) {
  let current_bye=[]
  found = false 
  let game = [...players]
  let bye_count = HAS_BYE
  if (HAS_BYE) {
    if ((BYES.length+HAS_BYE) > players.length) {
      BYES = []
    }
    const total = game.length
    for(let p = 0; p < total;p++) {
      if (!BYES.includes(game[p])) {
        current_bye.push(game.splice(p, 1)[0])
        bye_count--
        p-- 
        if(!bye_count) {
          break
        }
       
      }
    }
  }
  // console.log(game)
  let courts = []
  for (let court = 1; court <= COURTS; court++) {
    player1 = ""
    player2 = ''
    player3 = ''
    player4 = ''
    found = false 

    player1 = game.shift()

    for(let p = 0; p < game.length;p++) {
      if ( teams.has(`${player1}${game[p]}`) ||teams.has(`${game[p]}${player1}`)) {
      } else {
        player2 = game.splice(p, 1)[0]
        found = true 
        break
      }
    }
    
    if (found) {
      player3 = game.shift()
      player4 = ''
      found = false 
      for (let p = 0; p < game.length; p++) {
        if (teams.has(`${player3}${game[p]}`) || teams.has(`${game[p]}${player3}`)) {
        } else {
          player4 = game.splice(p, 1)[0]
          found = true 
          break
        }
      }
    }
    
    
    if (found) {
      courts[court] = [player1, player2, player3, player4]
      // courts[court] = `${player1} + ${player2}  <br>  ${player3} + ${player4}`
      // teams.add(`${player1}${player2}`)
      // teams.add(`${player3}${player4}`)
    } else {
      courts[court] = null 
    }    
  }
  found = true 
  for (let court = 1; court <= COURTS; court++) {
    if (courts[court] == null) {
      found = false 
    }
  }
  if (found) {
    console.log(`<tr><th>Game ${round}</th>`)
    for (court = 1; court <= COURTS; court++) {
      player1 = courts[court][0]
      player2 = courts[court][1]
      player3 = courts[court][2]
      player4 = courts[court][3]
      console.log(
        '<td colspan="2">' +
          `${player1} + ${player2}  <hr/>  ${player3} + ${player4}` +
          '</td>'
      )
      teams.add(`${player1}${player2}`)
      teams.add(`${player3}${player4}`)
    }
    if (HAS_BYE) {
      console.log(`<td>${current_bye}</td>`)
      BYES = BYES.concat(current_bye)
    }
    // console.log('<td>', teams, '</td>')
    console.log('</tr>')
    round++
    if (round>=players.length-2) {
      break
    }
  } 
  
  i++
  players = rotate(shuffle(players))
  
}

console.log('</table>')

console.log('</body></html>')
