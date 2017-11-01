var achievements = [
	{
		'title': 'Starter',
		'help': 'Complete your first project',
		'check': function(){
			return Stats.projects >= 1
		},
		'done': false
	},
	{
		'title': 'Millionaire',
		'help': 'Raise your money up to ' + Core.numberFormat(1000000),
		'check': function(){
			return Stats.money >= 1000000
		},
		'done': false
	},
	{
		'title': 'Fully upgraded',
		'help': 'Upgrade your computer to version 20',
		'check': function(){
			return Stats.computerVersion >= 20
		},
		'done': false
	},
	{
		'title': 'The new one',
		'help': 'Buy the "Dev-MX300"',
		'check': function(){
			return Shop.items['devmx300'].owned
		},
		'done': false
	},
	{
		'title': 'The pro',
		'help': 'Buy the "Dev-550sx PRO"',
		'check': function(){
			return Shop.items['dev550sx'].owned
		},
		'done': false
	},
	{
		'title': 'Holy sh--',
		'help': 'Get the ultimate dev-mainframe',
		'check': function(){
			return Shop.items['devmainframe'].owned
		},
		'done': false
	},
	{
		'title': 'Just for me',
		'help': 'Drop all your jobs',
		'check': function(){
			return Stats.jobs.length <= 0
		},
		'done': false
	},
	{
		'title': 'Billy the kid',
		'help': 'Achieve the minimum pulse speed',
		'check': function(){
			return Core.base.pulseDuration <= Core.base.minPulseDuration
		},
		'done': false
	},
	{
		'title': 'With 4 hands',
		'help': 'Unlock a parallel project',
		'check': function(){
			return Stats.improvements.indexOf('addProject') !== -1
		},
		'done': false
	},
	{
		'title': 'Gambler',
		'help': 'Buy your first ticket for the lottery',
		'check': function(){
			return Stats.ticketsBought === 1
		},
		'done': false
	},
	{
		'title': 'Serious gambler',
		'help': 'Spend ' +  Core.numberFormat(100) + ' in the lottery',
		'check': function(){
			return Stats.ticketsBought * Core.base.lotteryTicketCost >= 100
		},
		'done': false
	},
	{
		'title': 'Win something',
		'help': 'Win a partial in the lottery',
		'check': function(){
			return Stats.partialWon
		},
		'done': false
	},
	{
		'title': 'The lucky guy',
		'help': 'Win the lottery',
		'check': function(){
			return Stats.lotteryWon
		},
		'done': false
	},
	{
		'title': '|-|4C|<3R',
		'help': 'You have to hack this achievement',
		'check': function(){ 
			return Stats.hackedAchievement
		},
		'done': false
	},
	{
		'title': 'Caffeine addict',
		'help': 'Buy 200 coffees',
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
		'help': 'Buy 200 energy drinks',
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
		'help': 'Spend ' + Core.numberFormat(200) + ' in the lottery',
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
		'help': 'Press 200 keys in the command prompt',
		'check': function(){
			return Stats.commandPromptKeysPressed >= 200
		},
		'progress': function(){
			return '' + Stats.commandPromptKeysPressed + '/' + 200
		},
		'done': false
	},
	{
		'title': 'Key spammer',
		'help': 'Make ' + Core.numberFormat(1000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPromptMoneyEarned >= 1000
		},
		'progress': function(){
			return '' + Core.numberFormat(Stats.commandPromptMoneyEarned) + '/' + Core.numberFormat(1000)
		},
		'done': false
	},
	{
		'title': 'Shine bright like a diamond',
		'help': 'Buy the "I\'m a rich b**ch" diamond plate',
		'check': function(){
			return Shop.items.imRichDiamondPlate.owned
		},
		'done': false
	},
	{
		'title': 'A wild pixel appeared!',
		'help': 'Click 1 wild pixel',
		'check': function(){
			return Stats.wildPixelsClicked >= 1
		},
		'done': false
	},
	{
		'title': 'Nope, absolutelly nothing',
		'help': 'Just a Passive Pixel can do it',
		'check': function(){
			return Core.base.wildPixelTypes.passive.poped >= 1
		},
		'done': false
	},





	{
		'title': 'Multiemployed',
		'help': 'Get the maximum jobs at the same time',
		'check': function(){
			return Stats.jobs.length === Core.base.maxJobs
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Show must go on',
		'help': 'Complete 10 projects',
		'check': function(){
			return Stats.projects >= 10
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Can\'t stop me now',
		'help': 'Complete 100 projects',
		'check': function(){
			return Stats.projects >= 100
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Need some change?',
		'help': 'Raise your money up to ' + Core.numberFormat(10000000),
		'check': function(){
			return Stats.money >= 10000000
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'The world is yours',
		'help': 'Raise your money up to ' + Core.numberFormat(100000000),
		'check': function(){
			return Stats.money >= 100000000
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Keys on fire',
		'help': 'Make ' + Core.numberFormat(10000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPrompMoneyEarned >= 10000
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Key blender',
		'help': 'Make ' + Core.numberFormat(100000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPrompMoneyEarned >= 100000
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Command guru',
		'help': 'Make ' + Core.numberFormat(1000000) + ' with the command prompt',
		'check': function(){
			return Stats.commandPrompMoneyEarned >= 1000000
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Holy glory',
		'help': 'Click 1 glorius pixel',
		'check': function(){
			return Core.base.wildPixelTypes.glorius.poped >= 1
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Need more luck',
		'help': 'Click 100 wild pixel',
		'check': function(){
			return Stats.wildPixelsClicked >= 100
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'Lazyness',
		'help': 'Get the improvement "Click no more"',
		'check': function(){
			return Core.hasImprovement('autoStartProjects')
		},
		'done': false,
		'hidden': true
	},
	{
		'title': 'I like this job',
		'help': 'Get the same job twice at the same time',
		'check': function(){
			var exists = false
			for(var i = 0, len = Stats.jobs.length; i < len; i++){
				for(var x = (i+1), lenx = Stats.jobs.length; x < lenx; x++){
					if(Stats.jobs[i].name === Stats.jobs[x].name){
						exists = true
						break
					}
				}
				if(exists) break
			}
			return exists
		},
		'done': false,
		'hidden': true
	}

]
