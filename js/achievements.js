var achievements = [
	{
		'title': 'Complete your first project',
		'check': function(){
			return Stats.projects >= 1
		},
		'done': false
	},
	{
		'title': 'Raise your money up to ' + Core.numberFormat(1000000),
		'check': function(){
			return Stats.money >= 1000000
		},
		'done': false
	},
	{
		'title': 'Raise your money up to ' + Core.numberFormat(10000000),
		'check': function(){
			return Stats.money >= 10000000
		},
		'done': false
	},
	{
		'title': 'Raise your money up to ' + Core.numberFormat(100000000),
		'check': function(){
			return Stats.money >= 100000000
		},
		'done': false
	},
	{
		'title': 'Upgrade your computer to version 20',
		'check': function(){
			return Stats.computerVersion >= 20
		},
		'done': false
	},
	{
		'title': 'Buy the "Dev-MX300"',
		'check': function(){
			return Stats.computerModel === 'Dev-MX300'
		},
		'done': false
	},
	{
		'title': 'Buy the "Dev-550sx PRO"',
		'check': function(){
			return Stats.computerModel === 'Dev-550sx PRO'
		},
		'done': false
	},
	{
		'title': 'Drop all your jobs',
		'check': function(){
			return Stats.jobs.length <= 0
		},
		'done': false
	},
	{
		'title': 'Achieve the minimum pulse speed',
		'check': function(){
			return Core.base.pulseDuration <= Core.base.minPulseDuration
		},
		'done': false
	},
	{
		'title': 'Unlock a parallel project',
		'check': function(){
			return Stats.improvements.indexOf('addProject') !== -1
		},
		'done': false
	},
	{
		'title': 'Buy your first ticket for the lottery',
		'check': function(){
			return Stats.ticketsBought === 1
		},
		'done': false
	},
	{
		'title': 'Spend ' +  Core.numberFormat(100) + ' in the lottery',
		'check': function(){
			return Stats.ticketsBought * Core.base.lotteryTicketCost >= 100
		},
		'done': false
	},
	{
		'title': 'Win a partial in the lottery',
		'check': function(){
			return Stats.partialWon
		},
		'done': false
	},
	{
		'title': 'Win the lottery',
		'check': function(){
			return Stats.lotteryWon
		},
		'done': false
	},
	{
		'title': 'You have to hack this achievement',
		'check': function(){ 
			return Stats.hackedAchievement
		},
		'done': false
	},
	{
		'title': 'Caffeine addict',
		'check': function(){
			return Stats.coffeesBought >= 200
		},
		'progress': function(){
			return '' + Stats.coffeesBought + '/' + 200
		},
		'done': false
	},
	{
		'title': 'Taurine addict',
		'check': function(){
			return Stats.energyDrinksBought >= 200
		},
		'progress': function(){
			return '' + Stats.energyDrinksBought + '/' + 200
		},
		'done': false
	},
	{
		'title': 'Lottery addict',
		'check': function(){
			return Stats.ticketsBought >= 200
		},
		'progress': function(){
			return '' + Stats.ticketsBought + '/' + 200
		},
		'done': false
	},
	{
		'title': 'Command prompt addict',
		'check': function(){
			return Stats.commandPrompt.keysPressed >= 200
		},
		'progress': function(){
			return '' + Stats.commandPrompt.keysPressed + '/' + 200
		},
		'done': false
	},
	{
		'title': 'Make ' + Core.numberFormat(1000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 1000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(1000)
		},
		'done': false
	},
	{
		'title': 'Make ' + Core.numberFormat(10000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 10000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(10000)
		},
		'done': false
	},
	{
		'title': 'Make ' + Core.numberFormat(100000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 100000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(100000)
		},
		'done': false
	},
	{
		'title': 'Make ' + Core.numberFormat(1000000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 1000000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(1000000)
		},
		'done': false
	},
	{
		'title': 'Buy the "I\'m a rich b**ch" diamond plate',
		'check': function(){
			return Shop.items.imRichDiamondPlate.owned
		},
		'done': false
	}

]
