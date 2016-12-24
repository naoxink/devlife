var achievements = [
	{
		'title': 'Complete your first project',
		'check': function(){
			return Stats.projects >= 1
		},
		'done': false
	},
	{
		'title': 'Raise your money up to 1.000.000' + Core.base.moneyChar,
		'check': function(){
			return Stats.money >= 1000000
		},
		'done': false
	},
	{
		'title': 'Raise your money up to 10.000.000' + Core.base.moneyChar,
		'check': function(){
			return Stats.money >= 10000000
		},
		'done': false
	},
	{
		'title': 'Raise your money up to 100.000.000' + Core.base.moneyChar,
		'check': function(){
			return Stats.money >= 100000000
		},
		'done': false
	},
	{
		'title': 'Unlock the intranet skin',
		'check': function(){
			return Stats.improvements.indexOf('intranet') !== -1
		},
		'done': false
	},
	{
		'title': 'Unlock the new intranet skin',
		'check': function(){
			return Stats.improvements.indexOf('intranet2') !== -1
		},
		'done': false
	},
	{
		'title': 'Hire your first employee',
		'check': function(){
			return Stats.employees.length >= 1
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
		'title': 'Rent your first room',
		'check': function(){
			return Stats.rooms >= 1
		},
		'done': false
	},
	{
		'title': 'Rent your first floor',
		'check': function(){
			return Stats.floors >= 1
		},
		'done': false
	},
	{
		'title': 'Rent your first building',
		'check': function(){
			return Stats.buildings >= 1
		},
		'done': false
	},
	{
		'title': 'Rent your first warehouse',
		'check': function(){
			return Stats.warehouses >= 1
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
		'title': 'Spend 100' +  Core.base.moneyChar + ' in the lottery',
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
			return Stats.coffeesBought >= 500
		},
		'progress': function(){
			return '' + Stats.coffeesBought + '/' + 500
		},
		'done': false
	},
	{
		'title': 'Taurine addict',
		'check': function(){
			return Stats.energyDrinksBought >= 500
		},
		'progress': function(){
			return '' + Stats.energyDrinksBought + '/' + 500
		},
		'done': false
	},
	{
		'title': 'Lottery addict',
		'check': function(){
			return Stats.ticketsBought >= 500
		},
		'progress': function(){
			return '' + Stats.ticketsBought + '/' + 500
		},
		'done': false
	},
	{
		'title': 'Command prompt addict',
		'check': function(){
			return Stats.commandPrompt.keysPressed >= 500
		},
		'progress': function(){
			return '' + Stats.commandPrompt.keysPressed + '/' + 500
		},
		'done': false
	},
	{
		'title': 'Make 1.000¢ with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 1000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(1000)
		},
		'done': false
	},
	{
		'title': 'Make 10.000¢ with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 10000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(10000)
		},
		'done': false
	},
	{
		'title': 'Make 100.000¢ with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 100000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(100000)
		},
		'done': false
	},
	{
		'title': 'Make 1.000.000¢ with the command prompt',
		'check': function(){
			return Stats.commandPrompt.moneyEarned >= 1000000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPrompt.moneyEarned) + '/' + Core.numberFormat(1000000)
		},
		'done': false
	}

]
