var improvements = {
	'addProject': {
		'label': 'Improve project tech',
		'help': 'You will be able to start another project at the same time',
		'cost': 8000,
		'investigationTime': 600000, // 10m
		'effect': function(){
			var cloned = document.createElement('button')
				cloned.innerText = 'Start project'
				cloned.className = 'startProject'
			cloned.addEventListener('click', function(){
				Projects.startProject(this)
			})
			Core._('#projects-section').appendChild(cloned)
		},
		'inProgress': false
	},
	'computacionalTech': {
		'label': 'Research a new computacional technology',
		'help': 'Increase the computer upgrade version up to 20',
		'cost': 5000,
		'investigationTime': 600000, // 10m
		'effect': function(){
			Core.base.maxComputerVersion = 20
			improvements.upgradeComputer.cost = improvements.upgradeComputer.cost + (Core.base.computerMultiplierCost * (Stats.computerVersion + 1))
			Core.showImprovementButton('upgradeComputer')
			Core.updateHUD()
		},
		'inProgress': false
	},
	'autoStartProjects': {
		'label': 'Project managers independency',
		'help': 'Project Managers auto start projects',
		'cost': 10000,
		'investigationTime': 1800000, // 30m,
		'effect': function(){
			if(window.autoStartProjectsInterval){
				clearInterval(window.autoStartProjectsInterval)
				window.autoStartProjectsInterval = null
			}
			window.autoStartProjectsInterval = setInterval(function(){
				if(Stats['project-manager'] <= 0){
					return
				}else{
					var availableProjects = Core._('.startProject', true)
					var clicks = 0
					var done = false
					var i = 0
					var len = availableProjects.length
					while(!done && i < len){
						if(!availableProjects[i].getAttribute('disabled')){
							availableProjects[i].click()
							clicks++
							if(clicks >= Stats['project-manager']){
								done = true
							}
						}
						i++;
					}
				}
			}, 1000)
		},
		'inProgress': false
	},
	'autoSaveOnProjectComplete': {
		'label': 'Autosave on project complete',
		'help': 'Save your stats each time a project is completed',
		'cost': 100000,
		'investigationTime': 900000, // 15m
		'effect': function(){
			// Unavailable
		},
		'inProgress': false
	},
	'intranetCommandPrompt': {
		'label': 'Intranet terminal',
		'help': 'Smash your keys without control to get some money. Some people do that, why not you?',
		'cost': 500,
		'investigationTime': 60000, // 1m
		'effect': function(){
			if(Core._('#command-prompt')) return false
			terminal.init()
		},
		'inProgress': false
	},
	'renewOffices': {
		'label': 'Renew offices look',
		'help': 'Renew your offices and create a better working environment to increase effectiveness',
		'cost': 500000,
		'investigationTime': 3600000, // 1h
		'effect': function(){
			// Unavailable
		},
		'inProgress': false
	},
	'researchNewTorNetwork': {
		'label': 'Research a new TOR Network',
		'help': '',
		'cost': 3000,
		'investigationTime': 60000, // 1m
		'effect': function(){
			terminal.stats.torNetworkLevel++
			this.cost += this.cost * 0.05 // Linear
			this.investigationTime += 60000 // 1m más por cada nivel
			Core.showImprovementButton('researchNewTorNetwork')
		},
		'inProgress': false
	},
	'upgradeAV': {
		'label': 'Upgrade antivirus system',
		'help': '',
		'cost': 600,
		'investigationTime': 180000, // 3m
		'effect': function(){
			terminal.stats.virusDetectionLevel++
			this.cost += this.cost * 0.05 // Linear
			Core.showImprovementButton('upgradeAV')
		},
		'inProgress': false
	},
	'upgradeToolkit': {
		'label': 'Upgrade hacking toolkit',
		'help': '',
		'cost': 0,
		'investigationTime': 600000, // 10m
		'effect': function(){
			terminal.stats.toolkitLevel++
			this.investigationTime += this.investigationTime * 0.2
			Core.showImprovementButton('upgradeToolkit')
		},
		'inProgress': false
	},
	'upgradeComputer': {
		'label': 'Upgrade computer',
		'help': '',
		'cost': 0,
		'investigationTime': 10000, // 10s
		'effect': function(){
			var cost = this.cost
			if(Stats.money >= cost){
				if(Stats.computerVersion <= Core.base.maxComputerVersion){
					Stats.money -= cost
					Stats.companyValue += cost / 2
					Stats.computerVersion++
					if(Stats.computerVersion === 1 && !Shop.items.devmx300.owned){
						Core.showImprovementButton('intranetCommandPrompt')
					}
					Core.base.moneyIncPerPulse += Core.base.moneyIncPerPulse * (Stats.computerVersion / 100)
					Core.base.pulseDuration -= 10
					Core.base.projectTimeReductionPercent += 0.3
					this.cost = cost + (Core.base.computerMultiplierCost * (Stats.computerVersion + 1))
					if(Core.base.maxComputerVersion < Stats.computerVersion + 1){
						if(!Core.hasImprovement('computacionalTech')){
							Core.showImprovementButton('computacionalTech')
						}else if(!Shop.items.devmx300.owned){
							Shop.showItemButton('devmx300')
						}else if(!Shop.items.dev550sx.owned){
							Shop.showItemButton('dev550sx')
						}
					}else{
						Core.showImprovementButton('upgradeComputer')
					}
				}
			}else{
				Core.showImprovementButton('upgradeComputer')
			}
			Core.updateHUD()
		},
		'inProgress': false
	}
}
