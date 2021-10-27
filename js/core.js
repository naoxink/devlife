var Core = {  }

Core.engine = {  }
Core.projects = {  }
Core.improvementsInProgress = {  }
Core.timers = {
	'oscilatingValue': null,
	'popup': null,
	'jobFinder': null,
	'wildPixel': null
}

Core.init = function(fromLoad){
	// Core.initRecruitingSection()
	// Core.initRentingSection()
	// Core.jobFinder()
	// Core.initOscilatingValue()
	Stats.achievementsCount = achievements.length
	Core.initWildPixelSpawner()
	Projects.quickProjectFinder()
	if(Stats.computerVersion < Core.base.maxComputerVersion){
		improvements.upgradeComputer.cost = Core.base.computerMultiplierCost * (Stats.computerVersion + 1)
	}
	if(!fromLoad){
		Core.takeJob()
		Core.startMonthTimer()
		Core.addListeners()
		Projects.createProjectButton()
		// Mostrar los items iniciales de la tienda
		for(var key in Shop.items){
			if(Shop.items.hasOwnProperty(key) && Shop.items[key].initial){
				Shop.showItemButton(key)
			}
		}
		Core.showImprovementButton('upgradeComputer')
		Marquee.show('Welcome to devlife. You can now become the richest rich in the world.')
	}else{
		Core.checkAchievements(true)
	}

	if(!Core._('.startProject', true).length){
		Projects.createProjectButton()
	}

	if(Notification.permission !== "granted" && !Core.base.notificationsRequested){
		// Notification.requestPermission()
		Core.base.notificationsRequested = true
	}
	document.title = Stats.companyName + ' intranet | devLife'
	Core._('.navbar .brand').innerText = Stats.companyName + ' intranet'
	// Core.refreshAchievementList()
	Core.buildAchievementsList()
	Core.updateHUD()
}

Core.startMonthTimer = function(secondsLeft){
	Stats.monthTimeLeft = 60 // Seconds
	if(secondsLeft){
		Stats.monthTimeLeft = secondsLeft
	}
	window.monthInterval = setInterval(function(){
		if(Stats.monthTimeLeft <= 0){
			clearInterval(window.monthInterval)
			Stats.money += Core.calcSalaries()
			Core.startMonthTimer()
		}else{
			Stats.monthTimeLeft--
		}
		Core.updateHUD()
	}, 1000)
}

Core.calcSalaries = function(){
	var mySalaries = 0
	if(Stats.jobs && Stats.jobs.length){
		for(var i = 0, len = Stats.jobs.length; i < len; i++){
			mySalaries += Stats.jobs[i].increment
		}
	}
	return mySalaries
}

Core.controlPulseDuration = function(){
	if(Core.base.pulseDuration < Core.base.minPulseDuration){
		Core.base.pulseDuration = Core.base.minPulseDuration
	}else if(Core.base.pulseDuration > Core.base.maxPulseDuration){
		Core.base.pulseDuration = Core.base.maxPulseDuration
	}
}

Core.updateHUD = function(){
	Core.checkAchievements()
	// Dinero actual
	Core._('#money').innerHTML = Core.numberFormat(Stats.money)
	// Desglose dinero actual
	var moneyDetail = { 'Jobs': Core.numberFormat(Core.calcSalaries(), '/m') }
	Core.setHelp(Core._('#money').parentNode, 'Current money', moneyDetail)
	// Dinero por pulso
	var pulseDetail = {  }
	if(Stats.isCoffeePowered){
		pulseDetail['Coffee'] = '+' + Core.numberFormat(Stats.coffeeIncrement)
	}
	Core._('#incPerPulse').innerHTML = Core.numberFormat(Core.base.moneyIncPerPulse, '/pulse')
	Core.setHelp(Core._('#incPerPulse').parentNode, 'Money per pulse while active project', pulseDetail)

	if(Core.base.projectProfitMultiplier){
		Core._('#incPerPulse').innerHTML += ' <small>(Multiplier ' + (Core.base.projectProfitMultiplier > 0 ? '+' : '') +  (Core.base.projectProfitMultiplier * 100) + '%)</small>'
	}
	Core._('#pcmodel').innerHTML = Stats.computerModel
	Core._('#computerVersion').innerHTML = 'v' + Stats.computerVersion
	Core._('#jobs').innerHTML = Stats.jobs.length
	// Velocidad de pulso
	Core._('#pulseSpeed').innerHTML = parseFloat(Core.base.pulseDuration || 0).toFixed(3) + ' ms'
	var pulseSpeedDetail = {  }
	if(Stats.isEnergyDrinkPowered){
		pulseSpeedDetail['Energy drink'] = '-' + Math.abs(Core.base.pulseDuration - (Core.base.pulseDuration / Core.base.energyDrinkInc)) + 'ms'
	}
	Core.setHelp(Core._('#pulseSpeed').parentNode, 'Speed of making money during projects', pulseSpeedDetail)
	Core._('#projects').innerHTML = Stats.projects
	// Lotería
	Core._('#moneySpent').innerHTML = (Stats.ticketsBought * Core.base.lotteryTicketCost) + ' ' + Core.base.moneyChar
	Core._('#moneyWon').innerHTML = Stats.moneyWon + ' ' + Core.base.moneyChar
	Core._('#percentWon').innerHTML = Stats.percentWon + '%'
	var imprvs = Core._('.startImprovement', true)
	for(var i = 0, len = imprvs.length; i < len; i++){
		if(imprvs[i].getAttribute('data-cost') < Stats.money && improvements[imprvs[i].getAttribute('data-type')].inProgress === false){
			imprvs[i].removeAttribute('disabled')
		}else{
			imprvs[i].setAttribute('disabled', true)
		}
	}
	if(Stats.money >= Core.base.lotteryTicketCost && Stats.raffleRunning === false){
		Core._('#buyTicket').removeAttribute('disabled')
	}else{
		Core._('#buyTicket').setAttribute('disabled', true)
	}
	// Tienda
	var shopItems = Core._('.shopItem[data-cost]', true)
	if(shopItems.length){
		for(var i = 0, len = shopItems.length; i < len; i++){
			if(parseFloat(shopItems[i].getAttribute('data-cost')) > parseFloat(Stats.money) || (shopItems[i].getAttribute('data-running') && shopItems[i].getAttribute('data-running') === 'true')){
				shopItems[i].setAttribute('disabled', true)
			}else{
				shopItems[i].removeAttribute('disabled')
			}
		}
	}
	// Logros
	Core._('#achievement-resume').innerHTML = Stats.achievementsUnlocked + '/' + Stats.achievementsCount + ' (' + ((Stats.achievementsUnlocked * 100) / Stats.achievementsCount).toFixed(1) + '%)'
	// Desglose de logros
	Core.setHelp(Core._('#achievement-resume').parentNode, 'Achievements unlocked', { 'Hidden': Stats.achievementsHiddenUnlocked })
	Core._('#wild-pixels-poped').innerHTML = Stats.wildPixelsClicked
	var wppDetail = {  }
	for(var p in Core.base.wildPixelTypes){
		if(typeof Core.base.wildPixelTypes[p].poped === 'number'){
			wppDetail[Core.base.wildPixelTypes[p].name] = Core.base.wildPixelTypes[p].poped
		}
	}
	Core.setHelp(Core._('#wild-pixels-poped').parentNode, 'Wild pixels poped', wppDetail)
}

Core.jobFinder = function(button){
	Core.searchingJobs = true
	button.setAttribute('disabled', true)
	Core._('#job-finder-status').innerText = Core._('#job-finder-status').textContent = 'Searching'
	var time = Math.floor(Math.random() * 60) + 25
		time *= 1000
	Core.timers.jobFinder = setTimeout(function(){
		Core._('#takeJob').removeAttribute('disabled')
		document.title = 'JOB OPORTUNITY! | devLife'
		setTimeout(function(){
			clearTimeout(Core.timers.jobFinder)
			Core.timers.jobFinder = null
			Core._('#takeJob').setAttribute('disabled', true)
			document.title = Stats.companyName + ' intranet | devLife'
			if(Stats.jobs.length < Core.base.maxJobs){
				button.removeAttribute('disabled')
			}
			Core._('#job-finder-status').innerText = Core._('#job-finder-status').textContent = 'Not searching'
		}, 5000)
	}, time)
}

Core.takeJob = function(button){
	if(button) button.setAttribute('disabled', true)
	if(Stats.jobs.length < Core.base.maxJobs){
		var job = JSON.parse(JSON.stringify(jobs[(Math.floor(Math.random() * (jobs.length - 1)))]))
			job.id = 'job-' + new Date().getTime() + Stats.jobs.length
		document.title = Stats.companyName + ' intranet | devLife'
		Stats.jobs[Stats.jobs.length] = job
		Core.addJobToList(job)
	}else{
		clearTimeout(Core.timers.jobFinder)
		Core.timers.jobFinder = null
		Core._('#start-job-search').setAttribute('disabled', true)
		Core._('#job-finder-status').innerText = Core._('#job-finder-status').textContent = 'Not searching'
	}
}

Core.addJobToList = function(job){
	var li = document.createElement('li')
	var text = document.createTextNode(job.name + ' (+' + Core.numberFormat(job.increment, '/min)'))
	var qjbutton = document.createElement('button')
		qjbutton.innerText = qjbutton.textContent = 'Quit job'
		qjbutton.setAttribute('id', job.id)
		qjbutton.addEventListener('click', Core.quitJob)
		li.appendChild(text)
		li.appendChild(qjbutton)
	Core._('ul.job-list').appendChild(li)
}

Core.quitJob = function(button){
	button = button.srcElement || button.target
	var jobID = button.getAttribute('id')
	if(!jobID) return false
	var j = null
	for(var i = 0, len = Stats.jobs.length; i < len; i++){
		if(Stats.jobs[i].id === jobID){
			j = i
			break
		}
	}
	if(j === null) return false
	Stats.jobs.splice(j, 1)
	button.parentNode.parentNode.removeChild(button.parentNode)
	if(Core._('#start-job-search').getAttribute('disabled') !== undefined && Core.timers.jobFinder === null){
		Core._('#start-job-search').removeAttribute('disabled')
	}
}

Core._ = function(selector, multiple){
	return multiple ? [].slice.call(document.querySelectorAll(selector)) : document.querySelector(selector)
}

Core.showImprovementButton = function(id){
	if(Core._('#improvement-' + id, true).length) return false
	var button = document.createElement('button')
		button.className = 'startImprovement'
		button.setAttribute('id', 'improvement-' + id)
		if(improvements[id].help){
			button.className += ' help'
			button.setAttribute('data-title', improvements[id].help)
		}
		button.setAttribute('data-type', id)
		button.setAttribute('data-cost', improvements[id].cost)
		if(Stats.money < improvements[id].cost){
			button.setAttribute('disabled', true)
		}
		button.innerText = button.textContent = improvements[id].label + ' (' + Core.numberFormat(improvements[id].cost) + ') (Development time: ' + Core.timeFormat(improvements[id].investigationTime) + ')'
		button.addEventListener('click', function(){
			Core.startImprovement(id, this)
		})
	Core._('#improvements-section').appendChild(button)
	improvements[id].showing = true
	return button
}

Core.startImprovement = function(ty, button){
	if(!improvements[ty]) return false
	improvements[ty].inProgress = true
	if(Stats.money < improvements[ty].cost) return false
	Stats.money -= improvements[ty].cost
	button.setAttribute('disabled', true)
	button.innerText = button.textContent = button.innerText.replace(/\(.*\)/g, '') + ' (Investigation in progress) (Time left: ' + Core.timeFormat(improvements[ty].investigationTime) + ')'
	var impID = 'improvement-' + new Date().getTime()
	Core.improvementsInProgress[impID] = {  }
	Core.improvementsInProgress[impID].secondsLeft = improvements[ty].investigationTime / 1000
	Core.improvementsInProgress[impID].dateStart = new Date()
	Core.improvementsInProgress[impID].dateEnd = new Date(Date.now() + improvements[ty].investigationTime)
	Core.improvementsInProgress[impID].type = ty
	Core.updateHUD()
	Core.resumeImprovement(impID, button)
}

Core.resumeImprovement = function(impID, button){
	improvements[Core.improvementsInProgress[impID].type].inProgress = true
	Core.improvementsInProgress[impID].timer = setInterval(function(){
		if(Core.improvementsInProgress[impID].secondsLeft <= 0){
			Stats.improvements.push(Core.improvementsInProgress[impID].type)
			button.parentNode.removeChild(button)
			clearInterval(Core.improvementsInProgress[impID].timer)
			improvements[Core.improvementsInProgress[impID].type].showing = false
			improvements[Core.improvementsInProgress[impID].type].effect()
			improvements[Core.improvementsInProgress[impID].type].load()
			improvements[Core.improvementsInProgress[impID].type].inProgress = false
			Stats.companyValue += improvements[Core.improvementsInProgress[impID].type].cost / 2
			delete Core.improvementsInProgress[impID]
			Core.updateHUD()
		}else{
			button.innerText = button.textContent = button.innerText.replace(/\(.*\)/g, '') + ' (Investigation in progress) (Time left: ' + Core.timeFormat(Core.improvementsInProgress[impID].secondsLeft * 1000) + ')'
			Core.improvementsInProgress[impID].secondsLeft--
		}
	}, 1000)
}

Core.numberFormat = function(number, append){
	// /(\d)(?=(\d{3})+\,)/g, '$1.'
	var THOUSAND = '.'
	var DECIMAL = ','
	var EXTRA = ''
	var NUMBER_REGEX = new RegExp('(\\d)(?=(\\d{3})+' + DECIMAL + ')', 'g')
	final = number
	if(number > 999999){
		final = parseFloat(number / 1000000)
		EXTRA = ' Million '
	}else{
		final = parseFloat(number || 0)
	}
	final = final.toFixed(2)
			.replace(THOUSAND, DECIMAL)
	final = final.replace(NUMBER_REGEX, '$1' + THOUSAND)
	if(final.indexOf(DECIMAL + '00') !== -1){
		final = final.replace(DECIMAL + '00', '')
	}
	if(!append){
		append = Core.base.moneyChar
	}else{
		append = Core.base.moneyChar + append
	}
	return final + EXTRA + append
}

Core.timeFormat = function(s){
	function addZ(n) {
		return (n<10? '0':'') + n
	}

	var ms = s % 1000
	s = (s - ms) / 1000
	var secs = s % 60
	s = (s - secs) / 60
	var mins = s % 60
	var hrs = (s - mins) / 60

	var result = ''
	if(hrs)
		result += addZ(hrs) + 'h'
	if(hrs || mins)
		result += ' ' + addZ(mins) + 'm'
	if(mins || secs)
		result += ' ' + addZ(secs) + 's'
	return result
}

Core.buyTicket = function(button){
	if(Stats.money < Core.base.lotteryTicketCost) return false
	Stats.money -= Core.base.lotteryTicketCost
	Core._('#lottery #winner').innerText = Core._('#lottery #winner').textContent = '-'
	Core._('#lottery #owned').innerText = Core._('#lottery #owned').textContent = '-'
	Core._('#lottery #info').innerText = Core._('#lottery #info').textContent = '-'
	Core._('#lottery #info').className = ''
	Stats.numTicket = Core.pad(Math.floor((Math.random() * Core.base.numbersTickets) + 1))
	Core._('#lottery #owned').innerText = Core._('#lottery #owned').textContent = Stats.numTicket
	button.setAttribute('disabled', true)
	Stats.ticketsBought++
	Core.startRaffle(button)
	Core.updateHUD()
}

Core.startRaffle = function(button){
	Stats.raffleRunning = true
	window.raffleInterval = setInterval(function(){
		Core._('#lottery #winner').innerText = Core._('#lottery #winner').textContent = Math.floor((Math.random() * Core.base.numbersTickets) + 1)
	}, 1)
	setTimeout(function(){
		clearInterval(window.raffleInterval)
		Stats.raffleRunning = false
		// Generate winner
		Stats.winnerTicket = Core.pad(Math.floor((Math.random() * Core.base.numbersTickets) + 1))
		Core._('#lottery #winner').innerText = Core._('#lottery #winner').textContent = Stats.winnerTicket
		var prize = 0
		var partial = false
		var full = false
		if(Stats.numTicket === Stats.winnerTicket){
			prize += Core.base.lotteryPrize
			full = true
		}
		Stats.numTicket    = Stats.numTicket.substring(1, Stats.numTicket.length)
		Stats.winnerTicket = Stats.winnerTicket.substring(1, Stats.winnerTicket.length)
		if(Stats.numTicket === Stats.winnerTicket){
			prize += Core.base.lotteryTicketCost * 10000
			partial = true
		}
		Stats.numTicket    = Stats.numTicket.substring(1, Stats.numTicket.length)
		Stats.winnerTicket = Stats.winnerTicket.substring(1, Stats.winnerTicket.length)
		if(Stats.numTicket === Stats.winnerTicket){
			prize += Core.base.lotteryTicketCost * 1000
			partial = true
		}
		Stats.numTicket    = Stats.numTicket.substring(1, Stats.numTicket.length)
		Stats.winnerTicket = Stats.winnerTicket.substring(1, Stats.winnerTicket.length)
		if(Stats.numTicket === Stats.winnerTicket){
			prize += Core.base.lotteryTicketCost * 100
			partial = true
		}
		Stats.numTicket    = Stats.numTicket.substring(1, Stats.numTicket.length)
		Stats.winnerTicket = Stats.winnerTicket.substring(1, Stats.winnerTicket.length)
		if(Stats.numTicket === Stats.winnerTicket){
			prize += Core.base.lotteryTicketCost * 10
			partial = true
		}
		Stats.numTicket    = Stats.numTicket.substring(1, Stats.numTicket.length)
		Stats.winnerTicket = Stats.winnerTicket.substring(1, Stats.winnerTicket.length)
		if(Stats.numTicket === Stats.winnerTicket){
			prize += Core.base.lotteryTicketCost
			partial = true
		}
		if(full){
			Stats.lotteryWon = true
			Stats.lotteryWins++
			Core._('#lottery #info').className += ' win'
			Core._('#lottery #info').innerText = Core._('#lottery #info').textContent = 'win: ' + Core.numberFormat(prize)
		}else if(partial){
			Stats.partialWon = true
			Stats.lotteryWins++
			Core._('#lottery #info').className += ' win'
			Core._('#lottery #info').innerText = Core._('#lottery #info').textContent = 'partial win: ' + Core.numberFormat(prize)
		}else{
			Core._('#lottery #info').className += ' lose'
			Core._('#lottery #info').innerText = Core._('#lottery #info').textContent = 'lose'
		}
		Stats.money += prize
		Stats.moneyWon += prize
		Stats.percentWon = Math.floor((Stats.lotteryWins * 100) / Stats.ticketsBought)
		button.removeAttribute('disabled')
		Core.updateHUD()
	}, Core.base.timeRaffle)
}

Core.pad = function(number){
	var str = '' + number
	var pad = '000000'
	return pad.substring(0, pad.length - str.length) + str
}

Core.save = function(silent){
	if(!localStorage || !JSON || typeof JSON.stringify !== 'function') return false
	localStorage.clear()
	localStorage.setItem('dev-savedDate', new Date())
	// Cuántos botones de empezar proyecto tenemos
	localStorage.setItem('dev-stats-parallel-projects', Stats.parallelProjects)
	// Proyectos activos
	for(var pid in Core.projects){
			var pdata = {
				'secondsLeft': Core.projects[pid].secondsLeft,
				'moneyPlus': Core.projects[pid].moneyPlus,
				'profit': Core.projects[pid].profit,
				'dateStart': Core.projects[pid].dateStart,
				'dateEnd': Core.projects[pid].dateEnd,
				'quick': !!Core.projects[pid].quick
			}
			localStorage.setItem('dev-active-project-' + pid, JSON.stringify(pdata))
	}
	// Investigaciones activas
	for(var iid in Core.improvementsInProgress){
		var idata = {
			'secondsLeft': Core.improvementsInProgress[iid].secondsLeft,
			'dateStart': Core.improvementsInProgress[iid].dateStart,
			'dateEnd': Core.improvementsInProgress[iid].dateEnd,
			'type': Core.improvementsInProgress[iid].type
		}
		localStorage.setItem('dev-improvement-inProgress-' + iid, JSON.stringify(idata))
	}
	// Core.base
	for(var k in Core.base){
		if(k === 'wildPixelTypes') continue
		if(typeof Core.base[k] === 'object'){
			localStorage.setItem('dev-core-base-' + k, JSON.stringify(Core.base[k]))
		}else{
			localStorage.setItem('dev-core-base-' + k, Core.base[k])
		}
	}
	// Stats
	for(var k in Stats){
		if(k === 'improvements' || k === 'jobs' || k === 'showCase'){
			localStorage.setItem('dev-stats-' + k, JSON.stringify(Stats[k]))
		}else{
			localStorage.setItem('dev-stats-' + k, Stats[k])
		}
	}
	// Investigaciones que se están mostrando pero no están en progreso
	for(var k in improvements){
		if(improvements[k].showing && !improvements[k].inProgress){
			localStorage.setItem('dev-improv-showing-' + k, JSON.stringify({
				'cost': improvements[k].cost,
				'investigationTime': improvements[k].investigationTime,
				'inProgress': false,
				'showing': true,
				'type': k
			}))
		}
	}
	// Objetos de la tienda
	for(var itemID in Shop.items){
		localStorage.setItem('dev-shop-item-' + itemID, JSON.stringify({
			'showing': Shop.items[itemID].showing,
			'owned': Shop.items[itemID].owned
		}))
	}
	// Logros
	achievementsStr = ''
	for(var i = 0, len = achievements.length; i < len; i++){
		achievementsStr += achievements[i].done ? '1' : '0'
	}
	localStorage.setItem('dev-achievements', achievementsStr)

	Core.showPopUp({
		'title': 'Success!',
		'description': 'Your game is saved in this browser!'
	})
	return true
}

Core.load = function(){
	if(!localStorage || !JSON || typeof JSON.parse !== 'function') return false
	
	Core.clean()

	// Listar todo el localStorage
	for (var key in localStorage){
		var value = localStorage.getItem(key)

		if(key.indexOf('dev-stats-') === 0){ // Stats
			key = key.replace('dev-stats-', '')
			if(key === 'jobs' || key === 'improvements' || key === 'showCase'){
				Stats[key] = JSON.parse(value)
			}else{
				if(['true', 'false'].indexOf(value) !== -1){
					Stats[key] = value === 'true'
				}else{
					Stats[key] = !isNaN(value) ? parseFloat(value) : value
				}
			}

		}else if(key === 'dev-css'){ // CSS
			value = value.replace(/(\?.*$)/, '?' + new Date().getTime())
			Core._('#css').setAttribute('href', value)

		}else if(key.indexOf('dev-core-base-') === 0){ // Core.base
			key = key.replace('dev-core-base-', '')
			if(value.indexOf('[') === 0 && value.indexOf(']') === value.length -1){
				Core.base[key] = JSON.parse(value)
			}else if(['true', 'false'].indexOf(value) !== -1){
				Core.base[key] = value === 'true'
			}else{
				Core.base[key] = !isNaN(value) ? parseFloat(value) : value
			}

		}else if(key.indexOf('dev-shop-item-') === 0){ // Objetos de la tienda
			key = key.replace('dev-shop-item-', '')
			value = JSON.parse(value)
			if(value.showing === true && !value.owned){
				Shop.showItemButton(key)
			}
			Shop.items[key].owned = value.owned === true

		}else if(key.indexOf('dev-improv-showing-') === 0){ // Estado de las mejoras
			key = key.replace('dev-improv-showing-', '')
			value = JSON.parse(value)
			improvements[key].cost = value.cost
			improvements[key].investigationTime = value.investigationTime
			improvements[key].inProgress = value.inProgress
			improvements[key].showing = value.showing
			if(value.showing && !value.inProgress){
				Core.showImprovementButton(key)
			}

		}else if(key === 'dev-achievements'){ // Restaurar logros
			value = value.split('')
			for(var i = 0, len = value.length; i < len; i++){
				if(achievements[i] && value[i] === '1' && typeof achievements[i].unlock === 'function'){
					achievements[i].unlock()
				}
			}

		}else if(key.indexOf('dev-active-project-') === 0){ // Retomar proyectos
			var projectData = JSON.parse(value)
			Core.projects[key] = {
				'profit': projectData.profit || 0,
				'moneyPlus': projectData.moneyPlus || 0,
				'secondsLeft': projectData.secondsLeft || 0,
				'dateStart': new Date(projectData.dateStart) || new Date(),
				'dateEnd': new Date(projectData.dateEnd) || new Date(),
				'quick': !!projectData.quick
			}
			
			if(Core.projects[key].quick){
				// 2. Crear botón
				const button = Projects.createQuickProjectButton()
				// 3. Retomar proyecto
				Projects.resumeQuickProject(key, button)
			}else{
				// 2. Crear botón
				const button = Projects.createProjectButton()
				// 3. Retomar proyecto
				Projects.resumeProject(key, button)
			}

		}else if(key.indexOf('dev-improvement-inProgress-') === 0){ // Retomar investigaciones activas (Mejoras)
			var impData = JSON.parse(value)
			Core.improvementsInProgress[key] = {
				'secondsLeft': impData.secondsLeft || 0,
				'dateStart': new Date(impData.dateStart),
				'dateEnd': new Date(impData.dateEnd),
				'type': impData.type
			}
			// 2. Crear botón
			var button = Core.showImprovementButton(impData.type)
			// 3. Retomar el progreso
			Core.resumeImprovement(key, button)
		}
	}

	for(var i = 0, len = Stats.jobs.length; i < len; i++){
		Core.addJobToList(Stats.jobs[i])
	}
	var startProjectButtonCount = localStorage.getItem('dev-stats-parallel-projects') || 1
	if(Core._('.startProject', true).length < startProjectButtonCount){
		while(Core._('.startProject', true).length < startProjectButtonCount){
			Projects.createProjectButton()
		}
	}

	// Mostrar showCase
	for(var i = 0, len = Stats.showCase.length; i < len; i++){
		Core.addToShowcase(Stats.showCase[i])
	}

	// Mejoras investigadas
	for(var i = 0, len = Stats.improvements.length; i < len; i++){
		improvements[Stats.improvements[i]].load()
	}

	// Creación de nuevos timers
	if(Stats.monthTimeLeft){
		Core.startMonthTimer(Stats.monthTimeLeft)
	}
	if(Stats.coffeeTimeLeft){
		var button = Core._('#shop-item-coffee')
		Shop.items.coffee.buy(button, Stats.coffeeTimeLeft)
	}
	if(Stats.energyDrinkTimeLeft){
		var button = Core._('#shop-item-energyDrink')
		Shop.items.energyDrink.buy(button, Stats.energyDrinkTimeLeft)
	}
	if(Stats.marketingCampaignRunning && Stats.marketingCampaignTimeLeft){
		var button = Core._('#shop-item-marketingCampaign')
		Shop.items.marketingCampaign.buy(button, Stats.marketingCampaignTimeLeft)
	}

	// Desbloquear objetos
	for(var item in Shop.items){
		var unlocks = Shop.items[item].unlocks
		if(!unlocks) continue;
		var unlockItem = Shop.items[unlocks]
		if(Shop.items[item].owned && !unlockItem.owned){
			Shop.showItemButton(unlocks)
		}
	}

	Core.initWildPixelSpawner()

	Core.init(true) // Evitamos algunas líneas necesarias sólo al principio (Sin cargar)

	Core.showPopUp({
		'title': 'Success!',
		'description': 'Your game is loaded!'
	})
	return true
}

Core.clean = function(){
	// Limpieza de intervals/timeouts
	clearInterval(window.monthInterval)
	clearInterval(window.coffeeInterval)
	clearInterval(window.energyDrinkInterval)
	clearInterval(window.marketingCampaignInterval)
	clearInterval(Core.timers.wildPixel)
	window.monthInterval             = null
	window.coffeeInterval            = null
	window.energyDrinkInterval       = null
	window.marketingCampaignInterval = null
	Core.timers.wildPixel            = null
	Core.improvementsInProgress      = {  }
	Core.Projects                    = {  }
	Stats.parallelProjects           = 0

	// Limpiar items de la tienda
	var items = Core._('#shop .shopItem', true)
	for(var i = 0, len = items.length; i < len; i++){
		items[i].parentNode.removeChild(items[i])
	}
	// Limpiar botones de mejoras
	var impButtons = Core._('.startImprovement', true)
	for(var i = 0, len = impButtons.length; i < len; i++){
		impButtons[i].parentNode.removeChild(impButtons[i])
	}
	// Limpiar botones de proyectos
	var projectButtons = Core._('.startProject', true)
	for(var i = 0, len = projectButtons.length; i < len; i++){
		projectButtons[i].parentNode.removeChild(projectButtons[i])
	}
	// Limpiar estantería
	var items = Core._('#showcase .item', true)
	for(var i = 0, len = items.length; i < len; i++){
		items[i].parentNode.removeChild(items[i])
	}

	// Proyectos activos
	if(Core.projects){
		for(var pid in Core.projects){
			if(Core.projects.hasOwnProperty(pid) && Core.projects[pid].timer){
				clearInterval(Core.projects[pid].timer)
			}
		}
	}
	// Investigaciones activas (Mejoras)
	if(Core.improvementsInProgress){
		for(var iid in Core.improvementsInProgress){
			if(Core.improvementsInProgress.hasOwnProperty(iid) && Core.improvementsInProgress[iid].timer){
				clearInterval(Core.improvementsInProgress[iid].timer)
			}
		}
	}
	// Wild pixels
	var pixels = Core._('.wild-pixel', true)
	for(var w = 0, len = pixels.length; w < len; w++){
		if(pixels[w].parentNode){
			pixels[w].parentNode.removeChild(pixels[w])
		}
	}
	// Limpiar lista de trabajos
	Core._('ul.job-list').innerHTML = ''
}

Core.notification = function(title, text){
	if(!Notification) return false
	if(!title) title = 'DevLife'

	if(Notification.permission !== 'granted' && !Core.base.notificationsRequested){
		Notification.requestPermission()
	}else{
		var notification = new Notification(title, {
			'icon': 'img/code-icon.png',
			'body': text
		})
	}
}

Core.hasImprovement = function(ID){
	return Stats.improvements.indexOf(ID) !== -1
}

Core.addListeners = function(){
	Core._('#takeJob').addEventListener('click', function(){ Core.takeJob(this) })
	Core._('#start-job-search').addEventListener('click', function(){ Core.jobFinder(this) })
	Core._('#takeQuickProject').addEventListener('click', function(){ Projects.takeQuickProject(this) })
	Core._('#buyTicket').addEventListener('click', function(){ Core.buyTicket(this) })
	var improvs = Core._('.startImprovement', true)
	for(var i = 0, len = improvs.length; i < len; i++){
		improvs[i].addEventListener('click', function(){
			var ty = this.getAttribute('data-type')
			Core.startImprovement(ty, this)
		})
	}
	// Core._('#shareTwitter').addEventListener('click', function(){
	// 	var text = 'I have ' + Core._('#money').innerText + ' and ' + Core._('#incPerPulse').innerText + ' of money rate in my DevLife. How much do you have?'
	// 	var url = 'https://twitter.com/intent/tweet?text=:text&url=:url&hashtags=:hashtags'
	// 		url = url.replace(':text', text)
	// 		url = url.replace(':url', document.URL)
	// 		url = url.replace(':hashtags', 'DevLife')
	// 	window.open(url, "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=800, height=500, top="+((screen.height/2)-250)+", left="+((screen.width/2)-400))
	// })
	var sections = Core._('.button-section > .header', true)
	for(var i = 0, len = sections.length; i < len; i++){
		Core.addCompactFunctionality(sections[i])
	}
	Core._('#save').addEventListener('click', Core.save)
	Core._('#load').addEventListener('click', Core.load)
	Core._('#reset').addEventListener('click', function(){
		if(confirm('ALL PROGRESS WILL BE LOST, are you sure you want to RESET?')){
			if(localStorage){
				localStorage.clear()
			}
			window.location.reload()
		}
	})
	Core.tooltip = document.createElement('span')
	Core.tooltip.id = "tooltip"
	Core._('body').appendChild(Core.tooltip)
	document.onmousemove = function(event){
		if(Core.hasClass(event.target, 'help') || Core.hasClass(event.target.parentNode, 'help')){
			Core.tooltip.innerHTML = event.target.getAttribute('data-title') || event.target.parentNode.getAttribute('data-title')
			Core.tooltip.style.display = 'block'
			Core.tooltip.style.top = event.clientY + 15 + 'px'
			Core.tooltip.style.left = event.clientX + 15 + 'px'
			if((event.clientX + 300) > window.innerWidth){
				Core.tooltip.style.left = event.clientX - 430 + 'px'
			}
			if(Core.hasClass(event.target, 'hidden') || Core.hasClass(event.target.parentNode, 'hidden')){
				Core.tooltip.className = 'hidden'
			}else{
				Core.tooltip.className = ''
			}
		}else{
			Core.tooltip.className = ''
			Core.tooltip.style.display = 'none'
		}
	}
}

Core.addCompactFunctionality = function(header){
	header.addEventListener('click', function(){
		if(!Core.hasClass(this.parentNode, 'compact')){
			Core.addClass(this.parentNode, 'compact')
		}else{
			Core.removeClass(this.parentNode, 'compact')
		}
	})
}

Core.addClass = function(element, cssClass){
	if(!Core.hasClass(element, cssClass)){
		if(!element.className) element.className = cssClass
		else element.className += ' ' + cssClass
	}
}

Core.hasClass = function(element, cssClass){
	if(!element || !element.className) return false
	if(element.classList) return element.classList.contains(cssClass)
    return !!element.className.match(new RegExp('(\\s|^)' + cssClass + '(\\s|$)'))
}

Core.removeClass = function(element, cssClass){
	if(!element || !element.className) return false
	var rgx = new RegExp('\b*' + cssClass + '\b*', 'g')
	element.className = element.className.replace(rgx, '').replace(/^\s+|\s+$/g, '')
}

Core.showPopUp = function(data){
	if(Core._('.popup')){
		Core._('.popup').parentNode.removeChild(Core._('.popup'))
	}
	var bg = document.createElement('DIV')
		bg.className = 'popup'
	var container = document.createElement('DIV')
		container.className = 'container'
	var title = document.createElement('P')
		title.className = 'title'
		title.innerText = title.textContent = data.title
	var description = document.createElement('P')
		description.className = 'description'
		description.innerText = description.textContent = data.description
	var close = document.createElement('BUTTON')
		close.className = 'closeBtn'
		close.innerText = close.textContent = 'Close'
		close.onclick = function(){
			if(Core._('.popup')){
				Core._('.popup').parentNode.removeChild(Core._('.popup'))
			}
		}
	container.appendChild(title)
	container.appendChild(description)
	container.appendChild(close)
	Core._('body')
		.appendChild(bg)
		.appendChild(container)
	if(Core.timers.popup !== null){
		clearTimeout(Core.timers.popup)
		Core.timers.popup = null
	}
	var lastDocTitle = document.title
	document.title = data.title
	// Core.timers.popup = setTimeout(function(){
	// 	if(Core._('.popup')){
	// 		Core._('.popup').parentNode.removeChild(Core._('.popup'))
	// 	}
	// 	document.title = lastDocTitle
	// }, 5000)
	// Core.notification(data.title, data.description)
}

// Achievements
Core.checkAchievements = function(silent){
	if(achievements && achievements.length){
		for(var i = 0, len = achievements.length; i < len; i++){
			if(!achievements[i].done){
				achievements[i].done = achievements[i].check()
				if(achievements[i].done){
					if(!silent){
						Marquee.show('<strong>Achievement unlocked!</strong> ' + achievements[i].title)
					}
					achievements[i].unlock()
				}
				if(typeof achievements[i].update === 'function') achievements[i].update()
			}
		}
	}
}

Core.buildAchievementsList = function(){
	if(!achievements || !achievements.length) return false
	var table = document.createElement('TABLE')
	var tr = document.createElement('tr')
	var td = document.createElement('td')
		td.setAttribute('colspan', 2)
	var completed = 0
	var hiddenCompleted = 0
	td.className = 'header'
	tr.appendChild(td)
	table.appendChild(tr)
	var unlock = function(){
		this.done = true
		Core.removeClass(this.element, 'locked')
		Core.addClass(this.element, 'unlocked')
		if(this.hidden){
			if(this.help){
				Core.setHelp(this.element, this.help)
			}
			this.element.querySelector('td:first-child').innerHTML = this.title
			Stats.achievementsHiddenUnlocked++
		}
		this.element.querySelector('td:last-child').innerHTML = 'Unlocked'
		Stats.achievementsUnlocked++
		this.element.parentNode.parentNode.querySelector('tr:first-child td:first-child').innerHTML = Stats.achievementsUnlocked + '/' + Stats.achievementsCount + ' (' + ((Stats.achievementsUnlocked * 100) / Stats.achievementsCount).toFixed(1) + '%)'
	}
	var update = function(){
		if(typeof this.progress !== 'function') return false
		this.element.querySelector('td:first-child').innerHTML = this.title + ' <span class="achievement-progress-text">(' + this.progress() + ')</span>'
	}
	for(var i = 0, len = achievements.length; i < len; i++){
		var tr = document.createElement('TR')
		// Métodos de logros
		achievements[i].element = tr
		// Unlock
		achievements[i].unlock = unlock.bind(achievements[i])
		// Update progress
		achievements[i].update = update.bind(achievements[i])
		var title = achievements[i].title
		if(achievements[i].hidden === true && !achievements[i].done){
			title = '???'
		}
		if(achievements[i].help && (!achievements[i].hidden || achievements[i].done)){
			Core.setHelp(tr, achievements[i].help)
		}
		var tdTitle = document.createElement('TD')
		var tdStatus = document.createElement('TD')
		var statusText = achievements[i].done ? 'Unlocked' : 'Locked'
		tdTitle.innerText = tdTitle.textContent =  title
		if(!achievements[i].hidden && !achievements[i].done && achievements[i].progress && typeof achievements[i].progress === 'function'){
			tdTitle.innerHTML += ' <span class="achievement-progress-text">(' + achievements[i].progress() + ')</span>'
		}
		tdStatus.innerText = tdStatus.textContent = statusText
		Core.addClass(tr, statusText.toLowerCase())
		if(achievements[i].hidden){
			Core.addClass(tr, 'hidden')
		}
		tr.appendChild(tdTitle)
		tr.appendChild(tdStatus)
		table.appendChild(tr)
		if(achievements[i].done){
			completed++
			if(achievements[i].hidden){
				hiddenCompleted++
			}
		}
	}
	Stats.achievementsUnlocked = completed
	Stats.achievementsHiddenUnlocked = hiddenCompleted
	Core._('#achievement-list').innerHTML = ''
	td.innerHTML = 'Completed ' + ((completed * 100) / achievements.length).toFixed(1) + '% (' + completed + '/' + achievements.length + ')'
	Core._('#achievement-list').appendChild(table)
}



// Oscilating value
Core.initOscilatingValue = function(){
	Core.timers.oscilatingValue = setInterval(function(){
		var randBase = (Math.floor(Math.random() * Core.base.maxOscilatingValue) + Core.base.minOscilatingValue) + ((Core.base.maxOscilatingValue / 2) + 1)
		if(randBase > 0 && Core.base.oscilatingValue < Core.base.maxOscilatingValue){
			Core.base.oscilatingValue++
		}else if(randBase < 0 && Core.base.oscilatingValue > Core.base.minOscilatingValue){
			Core.base.oscilatingValue--
		}
		if(Core.base.historicOscilatingValues.length > 50){
			Core.base.historicOscilatingValues.shift()
		}
		Core.base.historicOscilatingValues.push(Core.base.oscilatingValue)
		Core.printOscilatingValueChart()
	}, 10000)
}

Core.printOscilatingValueChart = function(){
	Core._('#oscilating-value-container').innerHTML = ''
	for(var i = 0, len = Core.base.historicOscilatingValues.length; i < len; i++){
		var n = Core.base.historicOscilatingValues[i]
		Core.printBarChart(n)
	}
}

Core.printBarChart = function(value){
	var bar = document.createElement('DIV')
	bar.className = 'bar help'
	var abs = Math.abs(value)
	var stringValue = '' + abs + '0px'
	var barIntHeight = (parseInt(stringValue, 10) / 2)
	bar.style.height = barIntHeight + 'px'
	bar.style.left = (2 * Core._('#oscilating-value-container > .bar', true).length) + '%'

	bar.style.top = '50%'

	if(value > 0){
		bar.className += ' up'
		bar.style['margin-top'] = (-barIntHeight +1) + 'px'
	}else if(value < 0){
		bar.className += ' down'
	}else{
		bar.className += ' flat'
		bar.style.height = '1px'
	}
	bar.setAttribute('data-title', (value > 0 ? '+' : '') + (value * 10) + '%')
	Core._('#oscilating-value-container').appendChild(bar)
}


Core.addToShowcase = function(data){
	var imagePath = 'img/' + data.image
	if(Core._('#showcase .empty')){
		Core._('#showcase .empty').parentNode.removeChild(Core._('#showcase .empty'))
	}
	if(Core._('#showcase img[src="' + imagePath + '"]')){
		return true
	}
	var item = document.createElement('img')
	item.className = 'item help'
	item.setAttribute('data-title', data.title)
	item.src = imagePath
	Stats.showCase.push(data)
	Core._('#showcase').appendChild(item)
}

Core.secondsDiff = function(date1, date2){
	var dif = date1.getTime() - date2.getTime()
	var seconds_from_T1_to_T2 = dif / 1000
	return Math.abs(seconds_from_T1_to_T2)

}

// Wild Pixel
Core.initWildPixelSpawner = function(){
	if(Core.timers.wildPixel) return false;
	var seconds = Math.floor(Math.random() * (Core.base.wildPixelMaxSpawnTime - Core.base.wildPixelMinSpawnTime + 1) + Core.base.wildPixelMinSpawnTime)
	Core.timers.wildPixel = setTimeout(function(){
		Core.timers.wildPixel = null;
		Core.spawnWildPixel()
		Core.initWildPixelSpawner()
		setTimeout(function(){
			var p = Core._('.wild-pixel')
			if(p){
				p.parentNode.removeChild(p)
			}
		}, Core.base.wildPixelShowtime * 1000)
	}, seconds * 1000)
}

Core.popWildPixel = function(){
	// this = DOM pixel element
	var DOMPixel = this
	DOMPixel.style.padding = '10px'
	DOMPixel.style.opacity = 0
	setTimeout(function(){
		DOMPixel.parentNode.removeChild(DOMPixel)
	}, 250)
	var rand = Math.floor(Math.random() * 100) + 1
	var pixel = null
	// Elegir según las probabilidades de cada uno
	for(var p in Core.base.wildPixelTypes){
		if(rand >= Core.base.wildPixelTypes[p].odds[0] && rand <= Core.base.wildPixelTypes[p].odds[1]){
			Core.base.wildPixelTypes[p].poped++
			pixel = Core.base.wildPixelTypes[p]
		}
	}
	if(pixel === null) return false
	pixel.effect(function(text){
		Stats.wildPixelsClicked++
		Core.showPopUp({
			'title': pixel.name,
			'description': text
		})
		Core.updateHUD()
	})
}

Core.spawnWildPixel = function(){
	var pixel = document.createElement('div')
	pixel.className = 'wild-pixel help'
	pixel.setAttribute('data-title','???')
	pixel.style.top = (Math.floor(Math.random() * window.innerHeight) + 1) + 'px'
	pixel.style.left = (Math.floor(Math.random() * window.innerWidth) + 1) + 'px'
	if(pixel.style.top + pixel.height > window.innerHeight) pixel.style.top = (window.innerHeight - pixel.height) + 'px'
	if(pixel.style.left + pixel.width > window.innerWidth) pixel.style.left = (window.innerWidth - pixel.width) + 'px'
	pixel.onclick = Core.popWildPixel
	Core._('body').appendChild(pixel)
}

Core.setHelp = function(element, text, stats){
	if(!element) return false
	if(!Core.hasClass(element, 'help')){
		Core.addClass(element, 'help')
	}
	var title = text
	if(stats && typeof stats === 'object' && Object.keys(stats).length){
		title += '<hr>'
		for(var k in stats){
			title += k + ': ' + stats[k] + '<br>'
		}
	}
	title = title.replace(/\<br\>$/, '')
	element.setAttribute('data-title', title)
}
