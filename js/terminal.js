var terminal = {
	'_log': null,
	'_section': null,
	'_input': null,
	'_multiplier': null,
	// Stats
	'stats': {
		'torNetworkLevel': 0,
		'firewallSecurityLevel': 0,
		'virusDetectionLevel': 0,
		'toolkitLevel': 0,
		'hackSkillLevel': 0,
		'hacksSuccessfull': 0
	}
}

terminal.cpNumberAnimation = function(){
	var cpna = document.createElement('SPAN')
		cpna.className = 'command-prompt-number-key-up'
		cpna.innerText = '+' + (Core.base.commandPromptInc * window.commandPrompt.multiplier) + Core.base.moneyChar
		cpna.style.left = (Math.floor(Math.random() * 200) + 10) + 'px'
		cpna.style.bottom = (Math.floor(Math.random() * 40) + 30) + 'px'
		cpna.style.opacity = 1
	Core._('body').appendChild(cpna)
	var animationTime = 100
	var animationID = 'cpnai-' + new Date().getTime() + Core._('.command-prompt-number-key-up', true).length
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

terminal.addToLog = function(text){
	// controlar líneas ya escritas para no mantener
	// millones de líneas en el DOM
	var MAX_LOG_LINES = 50
	var lines = Core._('.terminal-log-line', true)
	if(lines.length >= MAX_LOG_LINES){
		var lines2Drop = lines.slice(0, lines.length - MAX_LOG_LINES)
		for(var i = 0, len = lines2Drop.length; i < len; i++){
			lines2Drop[i].parentNode.removeChild(lines2Drop[i])
			lines2Drop[i] = null
		}
	}
	lines = null
	// Añadir la línea actual
	var line = document.createElement('P')
		line.className = 'terminal-log-line'
		line.innerText = text
	terminal._log.appendChild(line)
	terminal._log.scrollTop = terminal._log.scrollHeight
}

terminal.keyUp = function(e){
	clearTimeout(window.commandPrompt.multiplierTimeout)
	window.commandPrompt.multiplierTimeout = setTimeout(function(){
		// Reset multiplier
		window.commandPrompt.multiplierTime = 1000
		window.commandPrompt.multiplier = 1
		window.commandPrompt.multiplierKeys = 0
		terminal._multiplier.innerText = ''
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
			terminal._multiplier.innerText = 'x' + window.commandPrompt.multiplier
		}
	}
	Stats.money += Core.base.commandPromptInc * window.commandPrompt.multiplier
	Stats.commandPrompt.keysPressed++
	terminal.cpNumberAnimation() // Sobrecarga en algunas ocasiones (Firefox)
	Stats.commandPrompt.moneyEarned += Core.base.commandPromptInc
	if(this.value.length > Math.floor(Math.random() * 60) + 25 || e.keyCode === 13){
		terminal.addToLog('$ ' + this.value)
		terminal.checkCommand(this.value)
		this.value = ''
	}
	Core.updateHUD()
}

terminal.init = function(){
	var container = document.createElement('DIV')
		container.className = 'button-section'
	var header = document.createElement('P')
		header.className = 'header'
		header.innerText = 'Terminal'
	terminal._log = document.createElement('DIV')
	terminal._log.className = 'command-prompt-log'
	var div = document.createElement('DIV')
		div.setAttribute('id', 'command-prompt')
	terminal._multiplier = document.createElement('SPAN')
	terminal._multiplier.className = 'multiplier'
	terminal._input = document.createElement('INPUT')
	terminal._input.setAttribute('type', 'text')
	div.appendChild(terminal._multiplier)
	div.appendChild(terminal._input)
	container.appendChild(header)
	container.appendChild(terminal._log)
	container.appendChild(div)
	Core._('.right').appendChild(container)
	Core.addCompactFunctionality(header)
	Shop.showItemButton('mechanicalKeyboard')
	// keyup
	window.commandPrompt = {
		'multiplier': 1,
		'multiplierKeys': 0,
		'multiplierTime': 200,
		'maxMultiplier': 5
	}
	Core._('#command-prompt > input[type=text]').addEventListener('keyup', terminal.keyUp)
}

terminal.enterDarkSide = function(){
	var csstransition = document.createElement('STYLE')
		csstransition.setAttribute('id', 'css-dark-side-transition')
		csstransition.innerHTML = '* { transition: all .5s; }'
	Core._('body').appendChild(csstransition)
	Core._('#css-dark-side').setAttribute('href', 'css/terminal-dark-side.css?' + new Date().getTime())
	setTimeout(function(){
		csstransition.parentNode.removeChild(csstransition)
		csstransition = null
	}, 3000)
	// Añadidos
	Core.showImprovementButton('researchNewTorNetwork')
	Core.showImprovementButton('upgradeToolkit')
}

terminal.checkCommand = function(text){
	switch(text){
		case 'hack achievement':
			Stats.hackedAchievement = true
			terminal.addToLog('! Achievement HACKED')
			break
		case 'activate dark-side':
			terminal.enterDarkSide()
			terminal.addToLog('! Dark side ACTIVATED')
			terminal.addToLog('! Antivirus not installed, please install using: "install dl-avirus"')
			break
		case 'install dl-avirus':
			if(terminal.stats.virusDetectionLevel > 0){
				terminal.addToLog('! Cannot install "dl-avirus". Already installed.')
				return false
			}
			terminal.stats.virusDetectionLevel = 1
			terminal.addToLog('Downloading "dl-avirus"...')
			terminal.addToLog('|####### | 94%')
			setTimeout(function(){
				terminal.addToLog('! Antivirus installed, you can now upgrade')
				Core.showImprovementButton('upgradeAV')
			}, 2000)
			break
		case 'start hack':
		case 'init hack':
			terminal.startHack()
			break
	}
}

terminal.startHack = function(){
	var hackTime = Math.floor(Math.random() * 30) + 10 // Tiempo base (segundos)
	var riskPercent = 100 // Porcentage de riesgo por defecto
	var skill = terminal.stats.hackSkillLevel / 100 // Porcentage multiplicador de habilidad de hack
	// Alteraciones según los modificadores
	if(terminal.stats.torNetworkLevel > 0){
		// Aumentar tiempo
		hackTime += hackTime * (terminal.stats.torNetworkLevel / 100)
		// Reducir porcentage de riesgo
		riskPercent -= riskPercent * (terminal.stats.torNetworkLevel / 100)
	}
	if(terminal.stats.firewallSecurityLevel > 0){
		// Tiempo igual
		// Reducir porcentage de riesgo (muy poco)
		riskPercent -= riskPercent * (terminal.stats.firewallSecurityLevel / 100)
	}
	if(terminal.stats.virusDetectionLevel > 0){
		// Tiempo igual
		// Riesgo igual
	}
	if(terminal.stats.toolkitLevel > 0){
		// Reducir tiempo
		hackTime -= hackTime * (terminal.stats.toolkitLevel / 100)
		// Reducir porcentage de riesgo
		riskPercent -= riskPercent * (terminal.stats.toolkitLevel / 100)
	}
	riskPercent -= riskPercent * skill // Añadir la habilidad
	riskPercent -= riskPercent * (terminal.stats.hacksSuccessfull / 100) // Añadir la experiencia
	hackTime -= hackTime * (terminal.stats.hacksSuccessfull / 100) // Reducir tiempo según la experiencia
	terminal.addToLog('Hack time: ' + hackTime)
	terminal.addToLog('Risk %: ' + riskPercent)
	if(riskPercent >= 98){
		terminal.addToLog('!!! Risk too high! You cannot hack this time!')
	}else{
		terminal.lauchHackAnimation(hackTime, riskPercent)
	}
}

terminal.lauchHackAnimation = function(hackTime, riskPercent){
	// Bloqueamos la terminal y vamos mostrando una pequeña "animación"
	// línea por línea en la que va mostrando detalles del hackeo
}

terminal.hackBusted = function(secondsPassed, initialHacktime, riskPercent){
	// Cuanto más tiempo lleve en el mismo hackeo es más probable que le pillen
	// descontando por supuesto el porcentage de riesgo y su habilidad
}