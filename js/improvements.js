var improvements = {
	'addProject': {
		'label': 'Improve project tech',
		'help': 'You will be able to start another project at the same time',
		'cost': 8000,
		'investigationTime': 600000, // 10m
		'effect': function(button){
			if(Core._('.startProject', true).length >= 2) return false
			var cloned = document.createElement('button')
				cloned.innerText = 'Start project'
				cloned.className = 'startProject'
			cloned.addEventListener('click', function(){
				Core.startProject(this)
			})
			Core._('#projects-section').appendChild(cloned)
			if(button){
				button.parentNode.removeChild(button)
			}
		},
		'inProgress': false
	},
	'intranet': {
		'label': 'Intranet design',
		'help': 'Develop a new intranet design',
		'cost': 0,
		'investigationTime': 180000, // 3m
		'effect': function(button){
			if(button){
				button.removeAttribute('disabled')
				button.innerText = 'Activate new intranet'
				button.onclick = function(){
					Core._('#css').setAttribute('href', 'css/intranet.css?' + new Date().getTime())
					button.parentNode.removeChild(button)
					Core.showImprovementButton('intranet2')
				}
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
			if(button){
				button.removeAttribute('disabled')
				button.innerText = 'Activate new intranet'
				button.onclick = function(){
					Core._('#css').setAttribute('href', 'css/intranet2.css?' + new Date().getTime())
					button.parentNode.removeChild(button)
				}
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
			if(button){
				button.parentNode.removeChild(button)
			}
			Core.base.maxComputerVersion = 20
			Core.base.nextComputerVersionCost = Core.base.nextComputerVersionCost + (Core.base.computerMultiplierCost * (Stats.computerVersion + 1))
			if(Core._('#PCCost')){
				Core._('#PCCost').innerText = Core.numberFormat(Core.base.nextComputerVersionCost)
				Core._('#upgradePC').setAttribute('disabled', true)
			}
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
		'effect': function(button){
			if(button){
				button.parentNode.removeChild(button)
			}
		},
		'inProgress': false
	},
	'intranetCommandPrompt': {
		'label': 'Develop an intranet terminal to enhance some code',
		'help': 'Smash your keys without control to get some money. Some people do that, why not you?',
		'cost': 500,
		'investigationTime': 60000, // 1m
		'effect': function(button){
			if(Core._('#command-prompt')) return false
			if(button){
				button.parentNode.removeChild(button)
			}
			var div = document.createElement('DIV')
				div.setAttribute('id', 'command-prompt')
			var span = document.createElement('SPAN')
				span.className = 'multiplier'
			var input = document.createElement('INPUT')
				input.setAttribute('type', 'text')
			div.appendChild(span)
			div.appendChild(input)
			Core._('body').appendChild(div)
			// keyup
			window.commandPrompt = {
				'multiplier': 1,
				'multiplierKeys': 0,
				'multiplierTime': 200,
				'maxMultiplier': 5
			}
			var cpNumberAnimation = function(){
				var cpna = document.createElement('SPAN')
					cpna.className = 'command-prompt-number-key-up'
					cpna.innerText = '+' + (Core.base.commandPromptInc * window.commandPrompt.multiplier) + Core.base.moneyChar
					cpna.style.left = (Math.floor(Math.random() * 200) + 10) + 'px'
					cpna.style.bottom = (Math.floor(Math.random() * 40) + 30) + 'px'
					cpna.style.opacity = 1
				Core._('body').appendChild(cpna)
				var animationTime = 100
				var animationID = 'cpnai-' + new Date().getTime()
				window[animationID] = setInterval(function(){
					if(animationTime <= 0){
						clearInterval(window[animationID])
						if(cpna){
							cpna.parentNode.removeChild(cpna)
							cpna = null
						}
					}else{
						animationTime--
						cpna.style.bottom = (parseInt(cpna.style.bottom, 10) + 1) + 'px'
						cpna.style.opacity = parseFloat(cpna.style.opacity) - 0.01
					}
					
				})
			}
			Core._('#command-prompt > input[type=text]').addEventListener('keyup', function(e){
				clearTimeout(window.commandPrompt.multiplierTimeout)
				window.commandPrompt.multiplierTimeout = setTimeout(function(){
					// Reset multiplier
					window.commandPrompt.multiplierTime = 1000
					window.commandPrompt.multiplier = 1
					window.commandPrompt.multiplierKeys = 0
					span.innerText = ''
				}, window.commandPrompt.multiplierTime)
				window.commandPrompt.multiplierKeys++
				if(window.commandPrompt.multiplierKeys >= 60){
					if(window.commandPrompt.multiplier < window.commandPrompt.maxMultiplier){
						window.commandPrompt.multiplier++
						window.commandPrompt.multiplierKeys = 0
						window.commandPrompt.multiplierTime *= 0.05
						if(window.commandPrompt.multiplierTime <= 150){
							window.commandPrompt.multiplierTime = 150
						}
						span.innerText = 'x' + window.commandPrompt.multiplier
					}
				}
				Stats.money += Core.base.commandPromptInc * window.commandPrompt.multiplier
				Stats.commandPrompt.keysPressed++
				cpNumberAnimation()
				Stats.commandPrompt.moneyEarned += Core.base.commandPromptInc
				if(this.value.length > Math.floor(Math.random() * 60) + 25 || e.keyCode === 13){
					if(this.value === 'hack achievement'){
						Stats.hackedAchievement = true
					}
					this.value = ''
				}
				Core.updateHUD()
			})
		},
		'inProgress': false
	}
}