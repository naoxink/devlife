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
	}else{
		Stats.money += Core.projects[projectID].profit / 2
	}
	Core.updateHUD()
	if([4, 24, 49, 99].indexOf(Stats.projects) !== -1){
		Core.showImprovementButton('addProject')
	}
	if(Stats.projects > 4 && !Core.hasImprovement('autoStartProjects') && !improvements['autoStartProjects'].showing){
		Core.showImprovementButton('autoStartProjects')
	}
}

Projects.pulse = function(projectID, button){
	var oscilatingPlus = 0
	if(Core.base.oscilatingValue > 0){
		oscilatingPlus = Core.base.moneyIncPerPulse * (Core.base.oscilatingValue / 10)
	}

	Core.projects[projectID].profit += Core.base.moneyIncPerPulse + Core.projects[projectID].moneyPlus
	Core.projects[projectID].profit += oscilatingPlus
	if(Core.base.projectProfitMultiplier){
		Core.projects[projectID].profit += Core.projects[projectID].profit * (Core.base.projectProfitMultiplier / 100)
	}
	var profitText = button.getAttribute('data-profit')
	if(profitText){
		profitText = profitText.replace(/Profit: ([0-9]+\.*.*)¢/, 'Profit: ' + Core.numberFormat(Core.projects[projectID].profit))
		if(oscilatingPlus > 0){
			profitText += ' (+' + Core.numberFormat(Core.projects[projectID].moneyPlus + oscilatingPlus, '/pulse)')
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

Projects.createProjectButton = function(){
	var startProjectButton = document.createElement('button')
		startProjectButton.innerText = startProjectButton.textContent = 'Start project'
		startProjectButton.className = 'startProject project'
	startProjectButton.addEventListener('click', function(){
		Projects.startProject(this)
	})
	Core._('#projects-section').appendChild(startProjectButton)
	Stats.parallelProjects++
	return startProjectButton
}

Projects.createQuickProjectButton = function(){
	var button = document.createElement('BUTTON')
		button.className = 'startProject quickProject'
		button.innerText = button.textContent = 'Quick project '
		button.setAttribute('disabled', true)
	Core._('#projects-section').appendChild(button)
	return button
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
	var button = Projects.createQuickProjectButton()
	Projects.startQuickProject(button)
	bthis.setAttribute('disabled', true)
}

Projects.startQuickProject = function(button){
	// Calcular tiempo (corto)
	var max = 10
	var min = 4
	var projectTime = Projects.calcQuickProjectTime(max, min)
	var projectID = 'qproject-' + new Date().getTime()
	Core.projects[projectID] = {  }
	// Plus de ganancia
	// Core.projects[projectID].moneyPlus = Core.base.moneyIncPerPulse * (Core.calcEmployeesMoneyInc() || 1)
	Core.projects[projectID].moneyPlus = 0
	Core.projects[projectID].moneyPlus += Core.projects[projectID].moneyPlus * ((30 - projectTime) / 100)
	Core.projects[projectID].profit = 0
	Core.projects[projectID].secondsLeft = projectTime
	Core.projects[projectID].dateStart = new Date()
	Core.projects[projectID].dateEnd = new Date(Date.now() + (projectTime * 1000))

	Projects.resumeQuickProject(projectID, button)
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
	var projectID = 'project-' + new Date().getTime()
	Core.projects[projectID] = {  }
	// Plus de ganancia
	// Core.projects[projectID].moneyPlus = Core.base.moneyIncPerPulse * Core.calcEmployeesMoneyInc()
	Core.projects[projectID].moneyPlus = 0
	if(Core.base.oscilatingValue > 0){
		Core.projects[projectID].moneyPlus += Core.base.moneyIncPerPulse * (Core.base.oscilatingValue / 10)
	}
	Core.projects[projectID].profit = 0
	Core.projects[projectID].secondsLeft = projectTime
	Core.projects[projectID].dateStart = new Date()
	Core.projects[projectID].dateEnd = new Date(Date.now() + (projectTime * 1000))

	Projects.resumeProject(projectID, button)
}

Projects.calcProjectTime = function(max, min){
	var projectTime = Math.floor(Math.random() * max) + min
		projectTime += projectTime * Math.round(Stats.projects / 10)
		projectTime -= projectTime * (Core.base.projectTimeReductionPercent / 100)
	return projectTime
}

Projects.isCancelled = function(){
	if(Core.base.oscilatingValue >= 0) return false
	var fail = Math.abs(Core.base.oscilatingValue) / 100
	var shot = Math.random()
	return fail > shot
}

Projects.resumeProject = function(projectID, button, isQuickProject){
	Projects.calcDiffPercent(projectID)
	var projectTime = Core.projects[projectID].secondsLeft
	button.setAttribute('disabled', true)
	if(!isQuickProject){
		button.innerText = button.textContent = 'Project'
	}else{
		button.innerText = button.textContent = 'Quick Project'
	}
	// Botón con relleno de cuenta atrás
	button.style.position = 'relative'
	var bar = document.createElement('div')
		bar.className = 'projectProgress'
		button.appendChild(bar)
	// Calcular % con la diferencia de las fechas
	var percent = Projects.calcDiffPercent(projectID)
	bar.style.width = percent + '%'
	var profitText = '(Time left: '+ Core.timeFormat(projectTime * 1000) +') (Profit: 0' + Core.base.moneyChar + ')'
	if(Core.projects[projectID].moneyPlus > 0){
		profitText += ' (+' + Core.numberFormat(Core.projects[projectID].moneyPlus ) + ')'
	}
	button.setAttribute('data-profit', profitText)
	Projects.start(projectID, button)
	Core.projects[projectID].timer = setInterval(function(){
		if(!isQuickProject && Projects.isCancelled()){
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
			delete Core.projects[projectID]
			return
		}
		Core.projects[projectID].secondsLeft--
		bar.setAttribute('data-percent', percent)
		var profitSecondsText = button.getAttribute('data-profit')
			profitSecondsText = profitSecondsText.replace(/Time left: \s*([0-9]+[h|m|s])*\s*([0-9]+[h|m|s])*\s*([0-9]+[h|m|s])*/g, 'Time left: ' + Core.timeFormat(Core.projects[projectID].secondsLeft * 1000))
			button.setAttribute('data-profit', profitSecondsText)
		if(Core.projects[projectID].secondsLeft <= 0){
			Projects.stop(projectID)
			if(!isQuickProject){
				button.removeAttribute('disabled')
				button.innerText = button.textContent = 'Start project'
				button.setAttribute('data-profit', '')
				if(Core.hasImprovement('autoStartProjects')){
					Projects.startProject(button)
				}
			}else{
				button.parentNode.removeChild(button)
			}
			Stats.projects++
			Core.updateHUD()
			Core.notification('Project finished', 'Profit: ' + Core.numberFormat(Core.projects[projectID].profit))
			delete Core.projects[projectID]
		}else{
			percent = Projects.calcDiffPercent(projectID)
			bar.style.width = percent + '%'
		}
	}, 1000)
}

Projects.resumeQuickProject = function(projectID, button){
	Projects.resumeProject(projectID, button, true)
}

Projects.calcDiffPercent = function(projectID){
	var dateStart = Core.projects[projectID].dateStart
	var dateEnd = Core.projects[projectID].dateEnd
	var secondsLeft = Core.projects[projectID].secondsLeft
	var diffSeconds = Core.secondsDiff(dateStart, dateEnd)
	return (secondsLeft * 100) / diffSeconds
}
