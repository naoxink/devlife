var improvements = {
	'addProject': {
		'label': 'Improve project tech',
		'help': '',
		'cost': 8000,
		'investigationTime': 600000, // 10m
		'effect': function(button){
			var cloned = document.createElement('button')
				cloned.innerText = 'Start project'
				cloned.className = 'startProject'
			cloned.addEventListener('click', function(){
				Core.startProject(this)
			})
			Core._('#projects-section').appendChild(cloned)
			button.parentNode.removeChild(button)
		},
		'inProgress': false
	},
	'intranet': {
		'label': 'Intranet design',
		'help': 'Develop a new intranet design',
		'cost': 0,
		'investigationTime': 180000, // 3m
		'effect': function(button){
			button.removeAttribute('disabled')
			button.innerText = 'Activate new intranet'
			button.onclick = function(){
				Core._('#css').setAttribute('href', 'css/intranet.css?' + new Date().getTime())
				button.parentNode.removeChild(button)
				Core.showImprovementButton('intranet2')
			}
		},
		'inProgress': false
	},
	'intranet2': {
		'label': 'Upgrade intranet design',
		'help': 'Upgrade the intranet design',
		'cost': 0,
		'investigationTime': 540000, // 9m
		'effect': function(button){
			button.removeAttribute('disabled')
			button.innerText = 'Activate new intranet'
			button.onclick = function(){
				Core._('#css').setAttribute('href', 'css/intranet2.css?' + new Date().getTime())
				button.parentNode.removeChild(button)
			}
		},
		'inProgress': false
	},
	'computacionalTech': {
		'label': 'Research a new computacional technology',
		'help': 'Increase the computer upgrade version up to 20',
		'cost': 5000,
		'investigationTime': 600000, // 10m
		'effect': function(button){
			button.parentNode.removeChild(button)
			Core.base.maxComputerVersion = 20
			Core.base.nextComputerVersionCost = Core.base.nextComputerVersionCost + (Core.base.computerMultiplierCost * (Stats.computerVersion + 1))
			Core._('#PCCost').innerText = Core.numberFormat(Core.base.nextComputerVersionCost)
			Core._('#upgradePC').setAttribute('disabled', true)
		},
		'inProgress': false
	},
	'autoStartProjects': {
		'label': 'Project managers independency',
		'help': 'Project Managers auto start projects',
		'cost': 10000,
		'investigationTime': 1800000, // 30m,
		'effect': function(button){
			button.parentNode.removeChild(button)
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
		'effect': function(button){
			button.parentNode.removeChild(button)
		},
		'inProgress': false
	}
}