var Core = {  }

Core.engine = {  }
Core.projects = {  }
Core.improvements = {  }
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
	Core.initWildPixelSpawner()
	Projects.quickProjectFinder()
	if(Stats.computerVersion < Core.base.maxComputerVersion){
		improvements.upgradeComputer.cost = Core.base.computerMultiplierCost * (Stats.computerVersion + 1)
	}
	if(!fromLoad){
		Core.takeJob()
		Core.startMonthTimer()
		Core.addListeners()
		// Mostrar los items iniciales de la tienda
		for(var key in Shop.items){
			if(Shop.items.hasOwnProperty(key) && Shop.items[key].initial){
				Shop.showItemButton(key)
			}
		}
		Core.showImprovementButton('upgradeComputer')
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
	Core.refreshAchievementList()
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
			var mySalaries = 0
			if(Stats.jobs && Stats.jobs.length){
				for(var i = 0, len = Stats.jobs.length; i < len; i++){
					mySalaries += Stats.jobs[i].increment
				}
			}
			Stats.money += mySalaries
			Core.updateHUD()
			Core.startMonthTimer()
		}else{
			Stats.monthTimeLeft--
		}
	}, 1000)
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
	Core._('#money').innerHTML = Core.numberFormat(Stats.money)
	Core._('#incPerPulse').innerHTML = Core.numberFormat(Core.base.moneyIncPerPulse, '/pulse')
	if(Core.base.projectProfitMultiplier){
		Core._('#incPerPulse').innerHTML += ' <small>(Multiplier ' + (Core.base.projectProfitMultiplier > 0 ? '+' : '') +  (Core.base.projectProfitMultiplier * 100) + '%)</small>'
	}
	Core._('#pcmodel').innerHTML = Stats.computerModel
	Core._('#computerVersion').innerHTML = 'v' + Stats.computerVersion
	Core._('#jobs').innerHTML = Stats.jobs.length
	// Core._('#employees').innerHTML = Stats.employees.length
	Core._('#pulseSpeed').innerHTML = parseFloat(Core.base.pulseDuration || 0).toFixed(3) + ' ms'
	Core._('#projects').innerHTML = Stats.projects
	// Core._('#companyValue').innerText = Core.numberFormat(Stats.companyValue)
	// Core._('#PCCost').innerText = Core.numberFormat(Core.base.nextComputerVersionCost)
	// Edificios
	// Core._('#availableSpaces').innerText = Stats.availableSpaces
	// Core._('#rooms').innerText = Stats.rooms
	// Core._('#floors').innerText = Stats.floors
	// Core._('#buildings').innerText = Stats.buildings
	// Core._('#warehouses').innerText = Stats.warehouses
	// Core._('#rentsCost').innerText = Core.numberFormat(Core.calcRentCost())
	// Lotería
	Core._('#moneySpent').innerHTML = (Stats.ticketsBought * Core.base.lotteryTicketCost) + ' ' + Core.base.moneyChar
	Core._('#moneyWon').innerHTML = Stats.moneyWon + ' ' + Core.base.moneyChar
	Core._('#percentWon').innerHTML = Stats.percentWon + '%'
	// Empleados
	// Controlar botones
	// Core._('#salariesCost').innerText = Core.numberFormat(Core.calcSalariesCost())
	// for(var type in employees){
	// 	if(employees.hasOwnProperty(type)){
	// 		Core._('#' + employees[type].id + 'Counter').innerText = Stats[type] || 0
	// 		if(employees[type].salary < Stats.money){
	// 			Core._('.hireEmployee[data-type=' + type + ']').removeAttribute('disabled')
	// 		}else{
	// 			Core._('.hireEmployee[data-type=' + type + ']').setAttribute('disabled', true)
	// 		}
	// 		if(Stats[type] > 0){
	// 			Core._('.fireEmployee[data-type=' + type + ']').removeAttribute('disabled')
	// 		}
 //            if(employees[type].label === 'Friend' && Stats.friend >= Core.base.maxFriendHiring) {
	// 			Core._('.hireEmployee[data-type=' + type + ']').setAttribute('disabled', true)
 //            }
	// 	}
	// }
	// var rooms = Core._('.rentRoom', true)
	// for(var i = 0, len = rooms.length; i < len; i++){
	// 	var el = rooms[i]
	// 	if(el.className.indexOf('owned') !== -1) continue
	// 	if(el.getAttribute('data-cost') < Stats.money){
	// 		el.removeAttribute('disabled')
	// 	}else{
	// 		el.setAttribute('disabled', true)
	// 	}
	// }
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
}

Core.calcSalariesCost = function(){
	var qty = 0
	for(var key in employees){
		if(employees.hasOwnProperty(key)){
			qty += employees[key].salary * Stats[key]
		}
	}
	return qty <= 0 || isNaN(qty) ? 0 : qty
}

Core.calcEmployeesMoneyInc = function(){
	var qty = 0
		qty += employees['programmer-junior'].increment * Stats['programmer-junior']
		qty += employees['programmer-senior'].increment * Stats['programmer-senior']
		qty += employees['designer-web'].increment * Stats['designer-web']
		qty += employees['friend'].increment * Stats['friend']
	return qty <= 0 || isNaN(qty) ? 0 : qty
}

Core.calcRentCost = function(){
	var qty = 0
		qty += Rents.room.price * Stats.rooms
		qty += Rents.floor.price * Stats.floors
		qty += Rents.building.price * Stats.buildings
		qty += Rents.warehouse.price * Stats.warehouses
	return qty <= 0 || isNaN(qty) ? 0 : qty
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

Core.rentRoom = function(ty, button){
	var room = Rents[ty] || false
	if(room === false) return false
	if(Stats.money < room.price) return false
	switch(ty){
		case 'room':
			if(Core.base.maxRooms <= Stats.rooms) return false
			break
		case 'floor':
			if(Core.base.maxFloors <= Stats.floors || Stats.rooms < 2) return false
			break
		case 'building':
			if(Core.base.maxBuildings <= Stats.buildings || Stats.floors < 2) return false
			break
		case 'warehouse':
			if(Core.base.maxWarehouses <= Stats.warehouses || Stats.buildings < 2) return false
			break
	}
	Stats[ty + 's']++
	Stats.money -= room.price
	Stats.companyValue += room.price / 2
	Stats.availableSpaces += room.spaces
	button.removeAttribute('data-cost')
	button.removeAttribute('data-type')
	button.className += ' owned'
	var dropButton = document.createElement('BUTTON')
	dropButton.className = 'inline'
	dropButton.innerText = dropButton.textContent = ' Drop ' + ty
	dropButton.onclick = function(){ Core.dropRent(this) }
	dropButton.setAttribute('data-type', ty)
	button.appendChild(dropButton)
	Core.updateHUD()
}

Core.dropRent = function(button){
	var ty = button.getAttribute('data-type')
	if(!ty || !Rents[ty]) return false
	// El edificio tiene que estar vacío para poder dropearlo
	if(Rents[ty].spaces > Stats.availableSpaces){
		Core.showPopUp({
			'title': 'You can\'t drop this ' + ty,
			'description': 'There are people working there!'
		})
		return false
	}
	Stats[ty + 's']--
	Stats.companyValue -= Rents[ty].price / 2
	Stats.availableSpaces -= Rents[ty].spaces
	Core.initRentingSection()
	Core.updateHUD()
}

Core.quitJob = function(button){
	button = button.srcElement
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

Core.addEmployeeToList = function(type, helpText){
	var name = Core.employeeNames[(Math.floor(Math.random() * (Core.employeeNames.length - 1)))]
	var li = document.createElement('li')
	if(helpText){
		li.className = 'help'
		li.setAttribute('data-title', helpText)
	}
	var text = document.createTextNode(type + ': ' + name)
	var qjbutton = document.createElement('button')
		qjbutton.innerText = 'Fire'
		qjbutton.addEventListener('click', function(){
			Core.fireEmployee(type, this)
		})
		li.appendChild(text)
		li.appendChild(qjbutton)
	Core._('ul.employee-list').appendChild(li)
}

Core.hireEmployee = function(button){
	var type = button.getAttribute('data-type')
	if(!employees[type]) return false
	if(Stats.availableSpaces <= 0) return false
	if(employees[type].salary > Stats.money) return false
	Stats.money -= employees[type].salary
	Core.base.pulseDuration -= Core.base.pulseDuration * employees[type].increment
	Stats[type]++
	Stats.availableSpaces--
	Stats.employees.push({
		'type': type,
		'salary': employees[type].salary,
		'increment': employees[type].increment
	})
	if(typeof employees[type].unlocks === 'function'){
		employees[type].unlocks()
	}
	Core._('.fireEmployee[data-type=' + type + ']').removeAttribute('disabled')
	Core.updateHUD()
}

Core.fireEmployee = function(button){
	var type = button.getAttribute('data-type')
	if(!employees[type]) return false
	// Eliminar del array de empleados
	var index = -1
	for(var i = 0, len = Stats.employees.length; i < len; i++){
		if(Stats.employees[i].type === type){
			index = i
			break
		}
	}
	if(index === -1){
		button.setAttribute('disabled', true)
		return false
	}
	Stats[type]--
	Core.base.pulseDuration += Core.base.pulseDuration * employees[type].increment
	Stats.availableSpaces++
	Stats.employees.splice(index, 1)
	Core.updateHUD()
	if(Stats[type] === 0){
		Core._('.fireEmployee[data-type=' + type + ']').setAttribute('disabled', true)
	}
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
	Core.improvements[impID] = {  }
	Core.improvements[impID].secondsLeft = improvements[ty].investigationTime / 1000
	Core.improvements[impID].dateStart = new Date()
	Core.improvements[impID].dateEnd = new Date(Date.now() + improvements[ty].investigationTime)
	Core.improvements[impID].type = ty
	Core.updateHUD()
	Core.resumeImprovement(impID, button)
}

Core.resumeImprovement = function(impID, button){
	improvements[Core.improvements[impID].type].inProgress = true
	Core.improvements[impID].timer = setInterval(function(){
		if(Core.improvements[impID].secondsLeft <= 0){
			Stats.improvements.push(Core.improvements[impID].type)
			button.parentNode.removeChild(button)
			clearInterval(Core.improvements[impID].timer)
			improvements[Core.improvements[impID].type].showing = false
			improvements[Core.improvements[impID].type].effect()
			improvements[Core.improvements[impID].type].load()
			improvements[Core.improvements[impID].type].inProgress = false
			Stats.companyValue += improvements[Core.improvements[impID].type].cost / 2
			delete Core.improvements[impID]
			Core.updateHUD()
		}else{
			button.innerText = button.textContent = button.innerText.replace(/\(.*\)/g, '') + ' (Investigation in progress) (Time left: ' + Core.timeFormat(Core.improvements[impID].secondsLeft * 1000) + ')'
			Core.improvements[impID].secondsLeft--
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
	localStorage.setItem('savedDate', new Date())
	// Proyectos activos
	for(var pid in Core.projects){
		var pdata = {
			'secondsLeft': Core.projects[pid].secondsLeft,
			'moneyPlus': Core.projects[pid].moneyPlus,
			'profit': Core.projects[pid].profit,
			'dateStart': Core.projects[pid].dateStart,
			'dateEnd': Core.projects[pid].dateEnd
		}
		localStorage.setItem(pid, JSON.stringify(pdata))
	}
	// Investigaciones activas
	for(var iid in Core.improvements){
		var idata = {
			'secondsLeft': Core.improvements[iid].secondsLeft,
			'dateStart': Core.improvements[iid].dateStart,
			'dateEnd': Core.improvements[iid].dateEnd,
			'type': Core.improvements[iid].type
		}
		localStorage.setItem(iid, JSON.stringify(idata))
	}
	// Core.base
	for(var k in Core.base){
		if(k !== 'wildPixelTypes') continue
		if(typeof Core.base[k] === 'object'){
			localStorage.setItem('core.base.' + k, JSON.stringify(Core.base[k]))
		}else{
			localStorage.setItem('core.base.' + k, Core.base[k])
		}
	}
	// Stats
	for(var k in Stats){
		if(k === 'employees'){
			for(var i = 0, len = Stats.employees.length; i < len; i++){
				localStorage.setItem('stats.employees.' + i, JSON.stringify(Stats.employees[i]))
			}
		}else if(k === 'improvements' || k === 'commandPrompt' || k === 'jobs' || k === 'showCase'){
			localStorage.setItem('stats.' + k, JSON.stringify(Stats[k]))
		}else{
			localStorage.setItem('stats.' + k, Stats[k])
		}
	}
	// Investigaciones que se están mostrando
	for(var k in improvements){
		localStorage.setItem('improv-status-' + k, JSON.stringify({
			'label': improvements[k].label,
			'help': improvements[k].help,
			'cost': improvements[k].cost,
			'investigationTime': improvements[k].investigationTime,
			'inProgress': improvements[k].inProgress,
			'showing': improvements[k].showing,
			'type': k
		}))
	}
	// Objetos de la tienda
	for(var itemID in Shop.items){
		localStorage.setItem('shop-item-' + itemID, JSON.stringify({
			'showing': Shop.items[itemID].showing,
			'owned': Shop.items[itemID].owned
		}))
	}

	localStorage.setItem('css', Core._('#css').getAttribute('href'))
	if(!silent){
		Core.showPopUp({
			'title': 'Success!',
			'description': 'Your game is saved in this browser!'
		})
	}else{
		console.info('Game saved: ' + new Date())
	}
	return true
}

Core.load = function(){
	if(!localStorage || !JSON || typeof JSON.parse !== 'function') return false
	// Limpiar items de la tienda
	var items = Core._('#shop .shopItem', true)
	for(var i = 0, len = items.length; i < len; i++){
		items[i].parentNode.removeChild(items[i])
	}
	// Listar todo el localStorage
	for (var i = 0; i < localStorage.length; i++){
		var key = localStorage.key(i)
		var value = localStorage.getItem(localStorage.key(i))
		if(key.indexOf('stats.') === 0){ // Stats
			key = key.replace('stats.', '')
			if(key === 'jobs' || key === 'improvements' || key === 'commandPrompt' || key === 'showCase'){
				Stats[key] = JSON.parse(value)
			}else{
				if(['true', 'false'].indexOf(value) !== -1){
					Stats[key] = value === 'true'
				}else{
					Stats[key] = !isNaN(value) ? parseFloat(value) : value
				}
			}
		}else if(key === 'css'){ // CSS
			value = value.replace(/(\?.*$)/, '?' + new Date().getTime())
			Core._('#css').setAttribute('href', value)
		}else if(key.indexOf('core.base.') === 0){ // Core.base
			key = key.replace('core.base.', '')
			if(value.indexOf('[') === 0 && value.indexOf(']') === value.length -1){
				Core.base[key] = JSON.parse(value)
			}else if(['true', 'false'].indexOf(value) !== -1){
				Core.base[key] = value === 'true'
			}else{
				Core.base[key] = !isNaN(value) ? parseFloat(value) : value
			}
		}else if(key.indexOf('shop-item-') === 0){ // Objetos de la tienda
			key = key.replace('shop-item-', '')
			value = JSON.parse(value)
			if(value.showing === true){
				Shop.showItemButton(key)
			}
			Shop.items[key].owned = value.owned === true
		}else if(key.indexOf('improv-status-') === 0){ // Estado de las mejoras
			key = key.replace('improv-status-', '')
			value = JSON.parse(value)
			improvements[key].label = value.label
			improvements[key].help = value.help
			improvements[key].cost = value.cost
			improvements[key].investigationTime = value.investigationTime
			improvements[key].inProgress = value.inProgress
			improvements[key].showing = value.showing
		}
	}

	Core._('ul.job-list').innerHTML = ''
	for(var i = 0, len = Stats.jobs.length; i < len; i++){
		Core.addJobToList(Stats.jobs[i])
	}

	// Limpieza de intervals/timeouts
	clearInterval(window.monthInterval)
	clearInterval(window.coffeeInterval)
	clearInterval(window.energyDrinkInterval)
	clearInterval(window.marketingCampaignInterval)
	window.monthInterval             = null
	window.coffeeInterval            = null
	window.energyDrinkInterval       = null
	window.marketingCampaignInterval = null
	// Proyectos
	if(Core.projects){
		for(var pid in Core.projects){
			if(Core.projects.hasOwnProperty(pid) && Core.projects[pid].timer){
				clearInterval(Core.projects[pid].timer)
			}
		}
	}
	// Investigaciones (Mejoras)
	if(Core.improvements){
		for(var iid in Core.improvements){
			if(Core.improvements.hasOwnProperty(iid) && Core.improvements[iid].timer){
				clearInterval(Core.improvements[iid].timer)
			}
		}
	}
	// Retomar proyectos
	// 1. Limpiar botones actuales de proyectos
	var projectButtons = Core._('.startProject', true)
	for(var i = 0, len = projectButtons.length; i < len; i++){
		projectButtons[i].parentNode.removeChild(projectButtons[i])
	}
	// 2. Buscar los proyectos guardados
	for (var i = 0; i < localStorage.length; i++){
		var key = localStorage.key(i)
		var value = localStorage.getItem(localStorage.key(i))
		if(key.indexOf('project-') === 0){
			var projectData = JSON.parse(value)
			Core.projects[key] = {
				'profit': projectData.profit || 0,
				'moneyPlus': projectData.moneyPlus || 0,
				'secondsLeft': projectData.secondsLeft || 0,
				'dateStart': new Date(projectData.dateStart) || new Date(),
				'dateEnd': new Date(projectData.dateEnd) || new Date()
			}
			// 3. Crear botón
			var button = Projects.createProjectButton()
			// 4. Retomar proyecto
			Projects.resumeProject(key, button)
		}
		if(key.indexOf('qproject-') === 0){
			var projectData = JSON.parse(value)
			Core.projects[key] = {
				'profit': projectData.profit || 0,
				'moneyPlus': projectData.moneyPlus || 0,
				'secondsLeft': projectData.secondsLeft || 0,
				'dateStart': new Date(projectData.dateStart) || new Date(),
				'dateEnd': new Date(projectData.dateEnd) || new Date()
			}
			// 3. Crear botón
			var button = Projects.createQuickProjectButton()
			// 4. Retomar proyecto
			Projects.resumeQuickProject(key, button)
		}
	}
	
	// Retomar investigaciones activas (Mejoras)
	// 1. Limpiar botones actuales
	var impButtons = Core._('.startImprovement', true)
	for(var i = 0, len = impButtons.length; i < len; i++){
		impButtons[i].parentNode.removeChild(impButtons[i])
	}
	// 2. Buscar las investigaciones guardadas
	for (var i = 0; i < localStorage.length; i++){
		var key = localStorage.key(i)
		var value = localStorage.getItem(localStorage.key(i))
		if(key.indexOf('improvement-') === 0){
			var impData = JSON.parse(value)
			Core.improvements[key] = {
				'secondsLeft': impData.secondsLeft,
				'dateStart': new Date(impData.dateStart),
				'dateEnd': new Date(impData.dateEnd),
				'type': impData.type
			}
			// 3. Crear botón
			var button = Core.showImprovementButton(impData.type)
			// 4. Retomar el progreso
			Core.resumeImprovement(key, button)
		}
	}

	// Mostrar showCase
	var items = Core._('#showcase .item', true)
	for(var i = 0, len = items.length; i < len; i++){
		items[i].parentNode.removeChild(items[i])
	}
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

	Core.init(true) // Evitamos algunas líneas necesarias sólo al principio (Sin cargar)

	Core.showPopUp({
		'title': 'Success!',
		'description': 'Your game is loaded!'
	})
	return true
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

Core.initRentingSection = function(){
	var section = Core._('#renting-list')
		section.innerHTML = ''
	var rents = ['house', 'room', 'floor', 'building', 'warehouse']
	for(var r = 0, len = rents.length; r < len; r++){
		for(var n = 0; n < Rents[rents[r]].max; n++){
			var button = document.createElement('BUTTON')
				button.className = 'rentRoom'
				if(Stats[rents[r] + 's'] > n){
					button.className += ' owned'
					button.innerText = 'Rent ' + rents[r] + ': ' + Rents[rents[r]].spaces + ' seats. ' + Core.numberFormat(Rents[rents[r]].price) + '/m'
					if(rents[r] !== 'house'){
						var dropButton = document.createElement('BUTTON')
						dropButton.className = 'inline'
						dropButton.innerText = ' Drop ' + rents[r]
						dropButton.onclick = function(){ Core.dropRent(this) }
						dropButton.setAttribute('data-type', rents[r])
						button.appendChild(dropButton)
					}
				}else{
					button.setAttribute('disabled', true)
					button.setAttribute('data-cost', Rents[rents[r]].price)
					button.setAttribute('data-type', rents[r])
					button.innerText = 'Rent ' + rents[r] + ' (+' + Rents[rents[r]].spaces + ' seats)(' + Core.numberFormat(Rents[rents[r]].price) + '/m)'
				}
			section.appendChild(button)
		}
	}
	// Listeners
	var rents = Core._('.rentRoom', true)
	for(var i = 0, len = rents.length; i < len; i++){
		rents[i].addEventListener('click', function(){
			var ty = this.getAttribute('data-type')
			Core.rentRoom(ty, this)
		})
	}
}

Core.initRecruitingSection = function(){
	if(!employees) return false
	var HTMLTemplate = [
		'<div>',
			'<span class="help label stat" data-title="Increase the pulse speed ::increment::%. ::help::">::label::</span>',
			'<span class="hireContainer">',
				'<button class="fireEmployee" disabled="disabled" data-type="::type::">-</button>',
				'<span class="employeeCounter" id="::id::Counter">0</span>',
				'<button class="hireEmployee help" data-title="Hiring cost: ::cost::' + Core.base.moneyChar + ' per minute" data-type="::type::">+</button>',
			'</span>',
		'</div>'
	].join('')
	var HTML = ''
	for(var type in employees){
		if(employees.hasOwnProperty(type)){
			HTML += HTMLTemplate
						.replace('::label::', employees[type].label)
						.replace('::id::', employees[type].id)
						.replace(/::type::/g, type)
						.replace('::cost::', employees[type].salary)
						.replace('::increment::', employees[type].increment)
						.replace('::help::', employees[type].help || '')
		}
	}
	Core._('#employee-types').innerHTML = HTML
	// Listeners
	var hires = Core._('.hireEmployee', true)
	for(var i = 0, len = hires.length; i < len; i++){
		hires[i].addEventListener('click', function(){ Core.hireEmployee(this) })
	}
	var fires = Core._('.fireEmployee', true)
	for(var i = 0, len = fires.length; i < len; i++){
		fires[i].addEventListener('click', function(){ Core.fireEmployee(this) })
	}
}

Core.addListeners = function(){
	Core._('#takeJob').addEventListener('click', function(){ Core.takeJob(this) })
	Core._('#start-job-search').addEventListener('click', function(){ Core.jobFinder(this) })
	Core._('#takeQuickProject').addEventListener('click', function(){ Projects.takeQuickProject(this) })
	Core._('.startProject').addEventListener('click', function(){ Projects.startProject(this) })
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
			window.location.reload()
		}
	})
	Core.tooltip = document.createElement('span')
	Core.tooltip.id = "tooltip"
	Core._('body').appendChild(Core.tooltip)
	document.onmousemove = function(event){
		if(Core.hasClass(event.target, 'help')){
			Core.tooltip.innerHTML = event.target.getAttribute('data-title')
			Core.tooltip.style.display = 'block'
			Core.tooltip.style.top = event.clientY + 15 + 'px'
			Core.tooltip.style.left = event.clientX + 15 + 'px'
			if((event.clientX + 300) > window.innerWidth){
				Core.tooltip.style.left = event.clientX - 430 + 'px'
			}
		}else{
			Core.tooltip.style.display = 'none'
		}
	}
}

Core.addCompactFunctionality = function(header){
	header.addEventListener('click', function(){
		if(this.parentNode.className.indexOf('compact') === -1){
			Core.addClass(this.parentNode, 'compact')
		}else{
			Core.removeClass(this.parentNode, 'compact')
		}
	})
}

Core.addClass = function(element, cssClass){
	if(!Core.hasClass(element, cssClass)){
		element.className += ' ' + cssClass
	}
}

Core.hasClass = function(element, cssClass){
	var rgx = new RegExp('\b*' + cssClass + '\b*')
	return rgx.test(element.className)
}

Core.removeClass = function(element, cssClass){
	var rgx = new RegExp('\b*' + cssClass + '\b*', 'g')
	element.className = element.className.replace(rgx, '').replace(/^\s+|\s+$/g, '')
}

Core.checkAchievements = function(silent){
	if(achievements && achievements.length){
		for(var i = 0, len = achievements.length; i < len; i++){
			if(!achievements[i].done){
				achievements[i].done = achievements[i].check()
				if(achievements[i].done && !silent){
					Core.showPopUp({
						'title': 'Achievement unlocked!',
						'description': achievements[i].title
					})
				}
			}
		}
		Core.refreshAchievementList()
	}
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
	Core.timers.popup = setTimeout(function(){
		if(Core._('.popup')){
			Core._('.popup').parentNode.removeChild(Core._('.popup'))
		}
		document.title = lastDocTitle
	}, 5000)
	// Core.notification(data.title, data.description)
}

Core.refreshAchievementList = function(){
	if(!achievements || !achievements.length) return false
	var table = document.createElement('TABLE')
	for(var i = 0, len = achievements.length; i < len; i++){
		var tr = document.createElement('TR')
		var tdTitle = document.createElement('TD')
		var tdStatus = document.createElement('TD')
		var statusText = achievements[i].done ? 'Unlocked' : 'Locked'
		tdTitle.innerText = tdTitle.textContent = achievements[i].title
		if(!achievements[i].done && achievements[i].progress && typeof achievements[i].progress === 'function'){
			tdTitle.innerHTML += ' <span class="achievement-progress-text">(' + achievements[i].progress() + ')</span>'
		}
		tdStatus.innerText = tdStatus.textContent = statusText
		tr.className = statusText.toLowerCase()
		tr.appendChild(tdTitle)
		tr.appendChild(tdStatus)
		table.appendChild(tr)
	}
	Core._('#achievement-list').innerHTML =''
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
	if(Core._('#showcase .empty')){
		Core._('#showcase .empty').parentNode.removeChild(Core._('#showcase .empty'))
	}
	var item = document.createElement('div')
	item.className = 'item'
	item.title = data.title
	item.innerText = item.textContent = data.text
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
	var seconds = Math.floor(Math.random() * (Core.base.wildPixelMaxSpawnTime - Core.base.wildPixelMinSpawnTime + 1) + Core.base.wildPixelMinSpawnTime)
	Core.timers.wildPixel = setTimeout(function(){
		Core.spawWildPixel()
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
			pixel = Core.base.wildPixelTypes[p]
		}
	}
	if(pixel === null) return false
	pixel.effect(function(text){
		Core.showPopUp({
			'title': pixel.name + '!',
			'description': text
		})
		Core.updateHUD()
	})
}

Core.spawWildPixel = function(){
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