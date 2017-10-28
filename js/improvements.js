var improvements = {
	'addProject': {
		'label': 'Improve project tech',
		'help': 'You will be able to start another project at the same time',
		'cost': 8000,
		'investigationTime': 600000, // 10m
		'load': function () {
			var cloned = document.createElement('button')
				cloned.innerText = 'Start project'
				cloned.className = 'startProject'
			cloned.addEventListener('click', function(){
				Projects.startProject(this)
			})
			Core._('#projects-section').appendChild(cloned)
		},
		'effect': function(){  },
		'inProgress': false,
		'showing': false
	},
	'computacionalTech': {
		'label': 'Research a new computacional technology',
		'help': 'Increase the computer upgrade version up to 20',
		'cost': 5000,
		'investigationTime': 600000, // 10m
		'load': function () {
			Core.showImprovementButton('upgradeComputer')
			Core.updateHUD()
		},
		'effect': function(){
			Core.base.maxComputerVersion = 20
			improvements.upgradeComputer.cost = improvements.upgradeComputer.cost + (Core.base.computerMultiplierCost * (Stats.computerVersion + 1))
		},
		'inProgress': false,
		'showing': false
	},
	'autoStartProjects': {
		'label': 'Click no more',
		'help': 'Your projects no longer need to start manually',
		'cost': 1000,
		'investigationTime': 180000, // 30m,
		'load': function () {  },
		'effect': function(){  },
		'inProgress': false,
		'showing': false
	},
	'autoSaveOnProjectComplete': {
		'label': 'Autosave on project complete',
		'help': 'Save your stats each time a project is completed',
		'cost': 100000,
		'investigationTime': 900000, // 15m
		'load': function () {  },
		'effect': function(){  },
		'inProgress': false,
		'showing': false
	},
	'intranetCommandPrompt': {
		'label': 'Intranet terminal',
		'help': 'Smash your keys without control to get some money. Some people do that, why not you?',
		'cost': 500,
		'investigationTime': 60000, // 1m
		'load': function () {
			if(Core._('#command-prompt')) return false
			terminal.init()
		},
		'effect': function(){  },
		'inProgress': false,
		'showing': false
	},
	'renewOffices': {
		'label': 'Renew offices look',
		'help': 'Renew your offices and create a better working environment to increase effectiveness',
		'cost': 500000,
		'investigationTime': 3600000, // 1h
		'load': function () {  },
		'effect': function(){  },
		'inProgress': false,
		'showing': false
	},
	'researchNewTorNetwork': {
		'label': 'Research a new TOR Network',
		'help': '',
		'cost': 3000,
		'investigationTime': 60000, // 1m
		'load': function () {  },
		'effect': function(){
			terminal.stats.torNetworkLevel++
			this.cost += this.cost * 0.05 // Linear
			this.investigationTime += 60000 // 1m más por cada nivel
			Core.showImprovementButton('researchNewTorNetwork')
		},
		'inProgress': false,
		'showing': false
	},
	'upgradeAV': {
		'label': 'Upgrade antivirus system',
		'help': '',
		'cost': 600,
		'investigationTime': 180000, // 3m
		'load': function () {  },
		'effect': function(){
			terminal.stats.virusDetectionLevel++
			this.cost += this.cost * 0.05 // Linear
			Core.showImprovementButton('upgradeAV')
		},
		'inProgress': false,
		'showing': false
	},
	'upgradeToolkit': {
		'label': 'Upgrade hacking toolkit',
		'help': '',
		'cost': 0,
		'investigationTime': 600000, // 10m
		'load': function () {  },
		'effect': function(){
			terminal.stats.toolkitLevel++
			this.investigationTime += this.investigationTime * 0.2
			Core.showImprovementButton('upgradeToolkit')
		},
		'inProgress': false,
		'showing': false
	},
	'upgradeComputer': {
		'label': 'Upgrade computer',
		'help': 'Everyone needs an upgrade<hr>Money per pulse: +0.1%<br>Pulse speed: -10ms<br>Project time: -0.3%',
		'cost': 0,
		'investigationTime': 10000, // 10s
		'load': function () {
			if(Stats.computerVersion <= Core.base.maxComputerVersion){
				if(Stats.computerVersion === 1 && !Shop.items.devmx300.owned && !Core.hasImprovement('intranetCommandPrompt')){
					Core.showImprovementButton('intranetCommandPrompt')
				}
				if(Core.base.maxComputerVersion < Stats.computerVersion + 1){
					if(!Core.hasImprovement('computacionalTech')){
						Core.showImprovementButton('computacionalTech')
					}else if(!Shop.items.devmx300.owned){
						Shop.showItemButton('devmx300')
					}else if(!Shop.items.dev550sx.owned){
						Shop.showItemButton('dev550sx')
					}else if(!Shop.items.devmainframe.owned){
						Shop.showItemButton('devmainframe')
					}
				}else{
					Core.showImprovementButton('upgradeComputer')
				}
				Core.updateHUD()
			}
		},
		'effect': function(){
			var cost = this.cost
			if(Stats.computerVersion <= Core.base.maxComputerVersion){
				Stats.computerVersion++
				// Core.base.moneyIncPerPulse += Core.base.moneyIncPerPulse * (Stats.computerVersion / 100)
				Core.base.pulseDuration -= 10
				Core.base.moneyIncPerPulse += Core.base.moneyIncPerPulse * 0.1
				Core.base.projectTimeReductionPercent += 0.3
				this.cost = cost + (Core.base.computerMultiplierCost * (Stats.computerVersion + 1))
			}
		},
		'inProgress': false,
		'showing': false
	},
	'personalBussinessWebsite': {
		'label': 'Create your own personal bussiness website',
		'help': 'Creating this website will help to increase trust with your clients and earn more with projects<hr>Money per pulse: +100%',
		'cost': 1000,
		'investigationTime': 3600000, // 1h
		'load': function () {  },
		'effect': function(){
			// Core.base.minOscilatingValue += 5
			Core.base.moneyIncPerPulse += Core.base.moneyIncPerPulse
		},
		'inProgress': false,
		'showing': false
	},
}
