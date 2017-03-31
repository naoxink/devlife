var terminal = {
	'_log': null,
	'_section': null,
	'_input': null,
	'_multiplier': null
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
	var line = document.createElement('P')
		line.innerText = '$ ' + text
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
		terminal.addToLog(this.value)
		if(this.value === 'hack achievement'){
			Stats.hackedAchievement = true
			terminal.addToLog('! Achievement HACKED')
		}
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