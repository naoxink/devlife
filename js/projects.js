var Projects = {  }

Projects.start = function(projectID, button){
	Core.controlPulseDuration()
	Core.projects[projectID].engine = setTimeout(function(){
		Projects.pulse(projectID, button)
	}, Core.base.pulseDuration)
}

Projects.stop = function(projectID, isCancelled){
	clearInterval(Core.projects[projectID].timer)
	clearTimeout(Core.projects[projectID].engine)
	Core.projects[projectID].engine = null
	Core.projects[projectID].timer = null
	if(!isCancelled){
		Stats.money += Core.projects[projectID].profit
		Stats.companyValue += Core.projects[projectID].profit / 2
	}
	Core.updateHUD()
	// if(Core.hasImprovement('autoSaveOnProjectComplete')){
	// 	Core.save(true)
	// }else{
	// 	if(Stats.projects > 50 && !Core._('.startImprovement[data-type=autoSaveOnProjectComplete]')){
	// 		Core.showImprovementButton('autoSaveOnProjectComplete')
	// 	}
	// }
	if(Stats.projects > 4 && !Core.hasImprovement('addProject') && !Core._('.startImprovement[data-type=addProject]')){
		Core.showImprovementButton('addProject')
	}
	if(Stats.projects > 24 && !Shop.items.virtualPersonalAssistant.owned && !Shop.items.virtualPersonalAssistant.showing){
		Shop.showItemButton('virtualPersonalAssistant')
	}
}

Projects.pulse = function(projectID, button){
	var oscilatingPlus = 0
	if(Core.base.oscilatingValue > 0){
		oscilatingPlus = Core.base.moneyIncPerPulse * (Core.base.oscilatingValue / 10)
	}

	Core.projects[projectID].profit += Core.base.moneyIncPerPulse + Core.projects[projectID].moneyPlus
	Core.projects[projectID].profit += oscilatingPlus
	var profitText = button.getAttribute('data-profit')
	if(profitText){
		profitText = profitText.replace(/Profit: ([0-9]+\.*.*)¢/, 'Profit: ' + Core.numberFormat(Core.projects[projectID].profit))
		if(oscilatingPlus > 0){
			profitText += ' (+' + Core.numberFormat(Core.projects[projectID].moneyPlus + oscilatingPlus) + '/pulse)'
		}
		button.setAttribute('data-profit', profitText)
	}
	Core.isRunning = false
	Core.controlPulseDuration()
	Core.updateHUD()
	Core.projects[projectID].engine = setTimeout(function(){
		Projects.pulse(projectID, button)
	}, Core.base.pulseDuration)
}

// Quick projects
Projects.quickProjectFinder = function(){
	clearInterval(window.quickProjectFinderTimeout)
	var time = Math.floor(Math.random() * Core.base.quickProjectsMaxTime) + Core.base.quickProjectsMinTime
	if(Core.base.quickProjectsFinderTimeMagnifier){
		time += time * (Stats.projects / 3)
	}
	time *= 1000
	window.quickProjectFinderTimeout = setTimeout(function(){
		Core._('#takeQuickProject').removeAttribute('disabled')
		document.title = 'Quick project available! | devLife'
		setTimeout(function(){
			Core._('#takeQuickProject').setAttribute('disabled', true)
			document.title = Stats.companyName + ' intranet | devLife'
			Projects.quickProjectFinder()
		}, 15000)
	}, time)
}

Projects.takeQuickProject = function(bthis){
	document.title = Stats.companyName + ' intranet | devLife'
	var button = document.createElement('BUTTON')
		button.className = 'startProject'
		button.innerText = button.textContent = 'Quick project '
		button.setAttribute('disabled', true)
	Core._('#projects-section').appendChild(button)
	Projects.startQuickProject(button)
	bthis.setAttribute('disabled', true)
}

Projects.startQuickProject = function(button){
	// Calcular tiempo (corto)
	var max = 10
	var min = 4
	var projectTime = Projects.calcQuickProjectTime(max, min)
	// Porcentage
	// Iniciar interval actualizando la barra de siempre
	button.style.position = 'relative'
	var bar = document.createElement('div')
		bar.className = 'projectProgress'
		button.appendChild(bar)
	var percent = 100
	var projectID = 'qproject-' + new Date().getTime()
	Core.projects[projectID] = {  }
	// Plus de ganancia por trabajador
	Core.projects[projectID].moneyPlus = Core.base.moneyIncPerPulse * (Core.calcEmployeesMoneyInc() || 1)
	Core.projects[projectID].moneyPlus += Core.projects[projectID].moneyPlus * ((30 - projectTime) / 100)
	Core.projects[projectID].profit = 0
	Core.projects[projectID].secondsLeft = projectTime
	button.setAttribute('data-profit', '(Time left: '+ Core.timeFormat(projectTime * 1000) +') (Profit: 0' + Core.base.moneyChar + ')')
	Core.projects[projectID].timer = setInterval(function(){
		Core.projects[projectID].profit += Core.projects[projectID].moneyPlus
		Core.projects[projectID].secondsLeft--
		bar.setAttribute('data-percent', percent)
		if(Core.projects[projectID].secondsLeft <= 0){
			clearInterval(Core.projects[projectID].timer)
			Projects.stop(projectID)
			button.parentNode.removeChild(button)
			Stats.projects++
			Core.updateHUD()
			Core.notification('Project finished', 'Profit: ' + Core.numberFormat(Core.projects[projectID].profit))
		}else{
			percent = (Core.projects[projectID].secondsLeft / projectTime) * 100
			bar.style.width = percent + '%'
		}
		var profitText = '(Time left: '+ Core.timeFormat(Core.projects[projectID].secondsLeft * 1000) +') (Profit: ' + Core.numberFormat(Core.projects[projectID].profit) + ')'
			button.setAttribute('data-profit', profitText)
	}, 1000)
}

Projects.calcQuickProjectTime = function(max, min){
	var projectTime = Math.floor(Math.random() * max) + min
		projectTime += projectTime * (Stats.projects / 100)
	return projectTime
}

// Projects
Projects.startProject = function(button){
	var max = 30
	var min = 10
	var projectTime = Projects.calcProjectTime(max, min)
	button.setAttribute('disabled', true)
	button.innerText = button.textContent = 'Project'
	// Botón con relleno de cuenta atrás
	button.style.position = 'relative'
	var bar = document.createElement('div')
		bar.className = 'projectProgress'
		button.appendChild(bar)
	var percent = 100
	var projectID = 'project-' + new Date().getTime()
	Core.projects[projectID] = {  }
	// Plus de ganancia
	Core.projects[projectID].moneyPlus = Core.base.moneyIncPerPulse * Core.calcEmployeesMoneyInc()
	if(Core.base.oscilatingValue > 0){
		Core.projects[projectID].moneyPlus += Core.base.moneyIncPerPulse * (Core.base.oscilatingValue / 10)
	}
	Core.projects[projectID].profit = 0
	Core.projects[projectID].secondsLeft = projectTime

	var profitText = '(Time left: '+ Core.timeFormat(projectTime * 1000) +') (Profit: 0' + Core.base.moneyChar + ')'
	if(Core.projects[projectID].moneyPlus > 0){
		profitText += ' (+' + Core.numberFormat(Core.projects[projectID].moneyPlus ) + ')'
	}
	button.setAttribute('data-profit', profitText)
	Projects.start(projectID, button)
	Core.projects[projectID].timer = setInterval(function(){
		if(Projects.isCancelled()){
			Projects.stop(projectID, true)
			button.removeAttribute('disabled')
			button.innerText = button.textContent = 'Start project'
			button.setAttribute('data-profit', '')
			Core.updateHUD()
			Core.notification('Your project has been cancelled', '')
			Core.showPopUp({
				'title': 'Your project has been cancelled',
				'description': 'Try again when the projects demand is possitive'
			})
		}
		Core.projects[projectID].secondsLeft--
		bar.setAttribute('data-percent', percent)
		var profitSecondsText = button.getAttribute('data-profit')
			profitSecondsText = profitSecondsText.replace(/Time left: \s*([0-9]+[h|m|s])*\s*([0-9]+[h|m|s])*\s*([0-9]+[h|m|s])*/g, 'Time left: ' + Core.timeFormat(Core.projects[projectID].secondsLeft * 1000))
			button.setAttribute('data-profit', profitSecondsText)
		if(Core.projects[projectID].secondsLeft <= 0){
			Projects.stop(projectID)
			button.removeAttribute('disabled')
			button.innerText = button.textContent = 'Start project'
			button.setAttribute('data-profit', '')
			Stats.projects++
			Core.updateHUD()
			Core.notification('Project finished', 'Profit: ' + Core.numberFormat(Core.projects[projectID].profit))
		}else{
			percent = (Core.projects[projectID].secondsLeft / projectTime) * 100
			bar.style.width = percent + '%'
		}
	}, 1000)
}

Projects.calcProjectTime = function(max, min){
	var projectTime = Math.floor(Math.random() * max) + min
		projectTime += projectTime * Math.round(Stats.projects / 10)
		projectTime -= projectTime * Core.base.projectTimeReductionPercent
	return projectTime
}

Projects.isCancelled = function(){
	if(Core.base.oscilatingValue >= 0) return false
	var failPercent = Math.abs(Core.base.oscilatingValue) * 10
	var randomPercent = Math.floor(Math.random() * 100)
	// var experienceReduction = Stats.projects / 100
	// randomPercent -= randomPercent * experienceReduction
	return failPercent < randomPercent
}