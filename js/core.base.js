Core.base = {
	'moneyChar': '¢',
	'pulseDuration': 1000,
	'moneyIncPerPulse': 3,
	'maxPulseDuration': 10000,
	'minPulseDuration': 1,
	'projectTimeReductionPercent': 0,
	'improvementTimeReductionPercent': 0,
	'computerMultiplierCost': 114,
	'maxComputerVersion': 10,
	'nextComputerVersionCost': 0,
	'maxFriendHiring': 3,
	'maxJobs': 4,

	'maxRooms': 3,
	'maxFloors': 3,
	'maxBuildings': 3,
	'maxWarehouses': 3,

	'numbersTickets': 100000,
	'timeRaffle': 5000,
	'lotteryPrize': 1000000,
	'lotteryTicketCost': 1,

	'coffeePrice': 5,
	'coffeeInc': 0.03, // Money increment per pulse
	'coffeeEffectTime': 180, // ms
	'energyDrinkPrice': 15,
	'energyDrinkInc': 0.75, // Pulse speed
	'energyDrinkEffectTime': 60,

	'commandPromptInc': 1,
	'notificationsRequested': false,

	'projectProfitMultiplier': 0,

	'quickProjectsMinTime': 5,
	'quickProjectsMaxTime': 10,
	'quickProjectsFinderTimeMagnifier': true,

	'oscilatingValue': 0.0,
	'minOscilatingValue': -10,
	'maxOscilatingValue': 10,
	'historicOscilatingValues': [  ],

	'wildPixelTypes': {
		'lucky': {
			'name': 'Lucky Pixel',
			'odds': [ 1, 30 ], // 30%
			'effect': function(callback){
				var inc = Math.floor(Stats.money * 1)
				Stats.money += inc
				return callback('+' + Core.numberFormat(inc))
			}
		},
		'rushy' : {
			'name': 'Rushy Pixel',
			'odds': [ 31, 60 ], // 30%
			'effect': function(callback){
				var multiplier = 2
				var secs = 15
				var oldMultiplier = Core.base.projectProfitMultiplier
				Core.base.projectProfitMultiplier = multiplier
				setTimeout(function(){
						Core.base.projectProfitMultiplier = oldMultiplier
						Core.updateHUD()
				}, secs * 1000)
				return callback('Increased your proyect profits by ' + (multiplier * 100) + '% for ' + secs + ' seconds!')
			}
		},
		'cursed': {
			'name': 'Cursed Pixel',
			'odds': [ 61, 75 ], // 15%
			'effect': function(callback){
				var multiplier = -1
				var secs = 15
				var oldMultiplier = Core.base.projectProfitMultiplier
				Core.base.projectProfitMultiplier = multiplier
				setTimeout(function(){
						Core.base.projectProfitMultiplier = oldMultiplier
						Core.updateHUD()
				}, secs * 1000)
				return callback('Reduced your proyect profits by ' + (multiplier * 100) + '% for ' + secs + ' seconds!')
			}
		},
		'???': {
			'name': '???',
			'odds': [ 76, 90 ], // 15%
			'effect': function(callback){
				return callback('')
			}
		},
		'???': {
			'name': '???',
			'odds': [ 91, 95 ], // 5%
			'effect': function(callback){
				return callback('')
			}
		},
		'???': {
			'name': '???',
			'odds': [ 96, 98 ], // 3%
			'effect': function(callback){
				return callback('')
			}
		},
		'???': {
			'name': '???',
			'odds': [ 98, 100 ], // 2%
			'effect': function(callback){
				return callback('')
			}
		}
	},
	'wildPixelMinSpawnTime': 60,
	'wildPixelMaxSpawnTime': 120,
	'wildPixelShowtime': 20
}