var Core = {  }

Core.engine = {  }
Core.projects = {  }
Core.timers = {
	'oscilatingValue': null,
	'popup': null,
	'jobFinder': null
}

Core.init = function(fromLoad){
	// Core.initRecruitingSection()
	// Core.initRentingSection()
	// Core.jobFinder()
	Core.initOscilatingValue()
	Projects.quickProjectFinder()
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
	}else{
		Core.checkAchievements(true)
	}

	if(Stats.computerVersion < Core.base.maxComputerVersion){
		improvements.upgradeComputer.cost = Core.base.computerMultiplierCost * (Stats.computerVersion + 1)
	}
	Core.showImprovementButton('upgradeComputer')

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
	var bar = Core._('.salaries-timer-bar')
	var percent = 100
	Stats.monthTimeLeft = 60 // Seconds
	if(secondsLeft){
		Stats.monthTimeLeft = secondsLeft
		percent = (Stats.monthTimeLeft / 60) * 100
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
			percent = (Stats.monthTimeLeft / 60) * 100
			if(bar){ bar.style.width = percent + '%' }
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
	var button = document.createElement('button')
		button.className = 'startImprovement'
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
}

Core.startImprovement = function(ty, button){
	if(!improvements[ty]) return false
	improvements[ty].inProgress = true
	if(Stats.money < improvements[ty].cost) return false
	Stats.money -= improvements[ty].cost
	button.setAttribute('disabled', true)
	button.innerText = button.textContent = button.innerText.replace(/\(.*\)/g, '') + ' (Investigation in progress) (Time left: ' + Core.timeFormat(improvements[ty].investigationTime) + ')'
	Stats['imp' + ty + 'timeleft'] = improvements[ty].investigationTime / 1000
	window['interval' + ty] = setInterval(function(){
		if(Stats['imp' + ty + 'timeleft'] <= 0){
			Stats.improvements.push(ty)
			button.parentNode.removeChild(button)
			improvements[ty].effect()
			improvements[ty].inProgress = false
			clearInterval(window['interval' + ty])
			Stats.companyValue += improvements[ty].cost / 2
			Core.updateHUD()
		}else{
			button.innerText = button.textContent = button.innerText.replace(/\(.*\)/g, '') + ' (Investigation in progress) (Time left: ' + Core.timeFormat(Stats['imp' + ty + 'timeleft'] * 1000) + ')'
			Stats['imp' + ty + 'timeleft']--
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
	localStorage.setItem('savedDate', new Date())
	// Core.base
	for(var k in Core.base){
		localStorage.setItem('core.base.' + k, Core.base[k])
	}
	// Stats
	for(var k in Stats){
		if(k === 'employees'){
			for(var i = 0, len = Stats.employees.length; i < len; i++){
				localStorage.setItem('stats.employees.' + i, JSON.stringify(Stats.employees[i]))
			}
		}else if(k === 'improvements' || k === 'commandPrompt' || k === 'jobs'){
			localStorage.setItem('stats.' + k, JSON.stringify(Stats[k]))
		}else{
			localStorage.setItem('stats.' + k, Stats[k])
		}
	}
	localStorage.setItem('css', Core._('#css').getAttribute('href'))
	// Timers
	// - Coffee (Saved in Stats.coffeeTimeLeft)
	// - Energy Drink (Saved in Stats.energyDrinkTimeLeft)
	// - Improvements (Saved in Stats['imp' + ty + 'timeleft'])
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
	// Listar todo el localStorage
	for (var i = 0; i < localStorage.length; i++){
		var key = localStorage.key(i)
		var value = localStorage.getItem(localStorage.key(i))
		if(key.indexOf('core.base.') === 0){
			key = key.replace('core.base.', '')
			if(['true', 'false'].indexOf(value) !== -1){
					Core.base[key] = value === 'true'
				}else{
					Core.base[key] = !isNaN(value) ? parseFloat(value) : value
				}
		}else if(key.indexOf('stats.') === 0){
			key = key.replace('stats.', '')
			if(key.indexOf('employees.') === 0){
				var index = parseInt(key.replace('employees.', ''), 10)
				Stats.employees[index] = JSON.parse(value)
			}else if(key === 'jobs' || key === 'improvements'){
				Stats[key] = JSON.parse(value)
			}else if(key === 'commandPrompt'){
				Stats[key] = JSON.parse(value)
			}else{
				if(['true', 'false'].indexOf(value) !== -1){
					Stats[key] = value === 'true'
				}else{
					Stats[key] = !isNaN(value) ? parseFloat(value) : value
				}
			}
		}else if(key === 'css'){
			value = value.replace(/(\?.*$)/, '?' + new Date().getTime())
			Core._('#css').setAttribute('href', value)
		}else if(key === 'savedDate'){

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
	if(Core.projects){
		for(var projectID in Core.projects){
			if(Core.projects.hasOwnProperty(projectID) && Core.projects[projectID].engine){
				clearTimeout(Core.projects[projectID].engine)
			}
		}
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

	// Añadir las mejoras
	for(var i = 0, len = Stats.improvements.length; i < len; i++){
		improvements[Stats.improvements[i]].effect()
		Core._('.startImprovement[data-type=' + Stats.improvements[i] + ']')
	}
	// Core.showPopUp({
	// 	'title': 'Success!',
	// 	'description': 'Your game is loaded!'
	// })
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
	Core._('#reset').addEventListener('click', function(){
		if(confirm('ALL PROGRESS WILL BE LOST, are you sure you want to RESET?')){
			window.location.reload()
		}
	})
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
	Core._('#showcase').appendChild(item)
} 