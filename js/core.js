var Core = {  }

Core.engine = {  }
Core.projects = {  }

Core.init = function(fromLoad){
	document.title = 'devLife'
	Core.initRecruitingSection()
	Core.paySalaries()
	Core.payRents()
	Core.jobFinder()
	if(!fromLoad){
		Core.takeJob()
	}
	Core.base.nextComputerVersionCost = Core.base.computerMultiplierCost * (Stats.computerVersion + 1)
	Core._('#PCCost').innerText = Core.numberFormat(Core.base.nextComputerVersionCost)
	if(Notification.permission !== "granted"){
		Notification.requestPermission()
	}
	Core.addListeners()
	Core.updateHUD()
}

Core.start = function(projectID, button){
	Core.controlPulseDuration()
	Core.projects[projectID].engine = setTimeout(function(){
		Core.pulse(projectID, button)
	}, Core.base.pulseDuration)	
}

Core.stop = function(projectID){
	clearTimeout(Core.projects[projectID].engine)
	Core.projects[projectID].engine = null
	Stats.money += Core.projects[projectID].profit
	Core.updateHUD()
	if(Core.hasImprovement('autoSaveOnProjectComplete')){
		Core.save()
	}
}

Core.pulse = function(projectID, button){
	Core.projects[projectID].profit += Core.base.moneyIncPerPulse + Core.projects[projectID].moneyPlus
	var profitText = button.getAttribute('data-profit')
	if(profitText){
		profitText = profitText.replace(/Profit: ([0-9]+\.*.*)¢/, 'Profit: ' + Core.numberFormat(Core.projects[projectID].profit))
		button.setAttribute('data-profit', profitText)
	}
	Core.isRunning = false
	Core.controlPulseDuration()
	Core.updateHUD()
	Core.projects[projectID].engine = setTimeout(function(){
		Core.pulse(projectID, button)
	}, Core.base.pulseDuration)
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
	Core._('#incPerPulse').innerHTML = Core.numberFormat(Core.base.moneyIncPerPulse) + '/pulse'
	Core._('#computerVersion').innerHTML = 'v' + Stats.computerVersion
	Core._('#jobs').innerHTML = Stats.jobs.length
	Core._('#employees').innerHTML = Stats.employees.length
	Core._('#pulseSpeed').innerHTML = Core.base.pulseDuration.toFixed(3) + ' ms'
	Core._('#projects').innerText = Stats.projects
	// Core._('#PCCost').innerText = Core.numberFormat(Core.base.nextComputerVersionCost)
	// Edificios
	Core._('#availableSpaces').innerText = Stats.availableSpaces
	Core._('#rooms').innerText = Stats.rooms
	Core._('#floors').innerText = Stats.floors
	Core._('#buildings').innerText = Stats.buildings
	Core._('#warehouses').innerText = Stats.warehouses
	Core._('#rentsCost').innerText = Core.numberFormat(Core.calcRentCost())
	// Empleados
	// Controlar botones
	Core._('#salariesCost').innerText = Core.numberFormat(Core.calcSalariesCost())
	for(var type in employees){
		if(employees.hasOwnProperty(type)){
			Core._('#' + employees[type].id + 'Counter').innerText = Stats[type] || 0
			if(employees[type].salary < Stats.money){
				Core._('.hireEmployee[data-type=' + type + ']').removeAttribute('disabled')
			}else{
				Core._('.hireEmployee[data-type=' + type + ']').setAttribute('disabled', true)
			}
		}
	}
	if(Stats.money > 5 && Stats.isCoffeePowered === false){
		Core._('#buyCoffee').removeAttribute('disabled')
	}else{
		Core._('#buyCoffee').setAttribute('disabled', true)
	}
	if(Stats.money > 15 && Stats.isEnergyDrinkPowered === false){
		Core._('#buyEnergyDrink').removeAttribute('disabled')
	}else{
		Core._('#buyEnergyDrink').setAttribute('disabled', true)
	}
	if(Stats.money >= Core.base.nextComputerVersionCost && Core.base.maxComputerVersion > Stats.computerVersion){
		Core._('#upgradePC').removeAttribute('disabled')
	}else{
		Core._('#upgradePC').setAttribute('disabled', true)
	}
	var rooms = Core._('.rentRoom', true)
	for(var i = 0, len = rooms.length; i < len; i++){
		var el = rooms[i]
		if(el.className.indexOf('owned') !== -1) continue
		if(el.getAttribute('data-cost') < Stats.money){
			el.removeAttribute('disabled')
		}else{
			el.setAttribute('disabled', true)
		}
	}
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
}

Core.upgradeComputer = function(){
	var cost = Core.base.nextComputerVersionCost
	if(Stats.money >= cost && Stats.computerVersion < Core.base.maxComputerVersion){
		Stats.money -= cost
		Stats.computerVersion++
		Core.base.moneyIncPerPulse += Core.base.moneyIncPerPulse * (Stats.computerVersion / 100)
		Core.base.pulseDuration -= 10
		if(Core.base.maxComputerVersion >= Stats.computerVersion + 1){
			Core.base.nextComputerVersionCost = cost + (Core.base.computerMultiplierCost * (Stats.computerVersion + 1))
			Core._('#PCCost').innerText = Core.numberFormat(Core.base.nextComputerVersionCost)
			Core._('#upgradePC').setAttribute('disabled', true)
		}else{
			Core._('#upgradePC').setAttribute('disabled', true)
			Core._('#PCCost').innerText = 'Computer version maxed (' + Core.base.maxComputerVersion + ')'
			if(!Core.hasImprovement('computacionalTech')){
				Core.showImprovementButton('computacionalTech')
			}
		}
		Core.updateHUD()
	}
}

Core.buyCoffee = function(button){
	if(Stats.isCoffeePowered) return false
	var coffeePrice = Core.base.coffeePrice
	var coffeeInc = Core.base.coffeeInc
	var effectTime = Core.base.coffeeEffectTime
	if(Stats.money < coffeePrice) return false
	button.setAttribute('disabled', true)
	Stats.money -= coffeePrice
	var increment = (Core.base.moneyIncPerPulse / (Stats.employees.length + 1)) * coffeeInc
	Core.base.moneyIncPerPulse += increment
	Stats.isCoffeePowered = true
	Core.updateHUD()
	Stats.coffeesBought++
	Core.startCoffeeEffect(button, increment, effectTime)
}

Core.startCoffeeEffect = function(button, increment, seconds){
	Stats.coffeeTimeLeft = seconds
	button.innerText = 'Coffee time left: ' + Core.timeFormat(Stats.coffeeTimeLeft * 1000)
	window.coffeeInterval = setInterval(function(){
		if(Stats.coffeeTimeLeft <= 0){
			Core.base.moneyIncPerPulse -= increment
			Stats.isCoffeePowered = false
			button.innerText = 'Buy Coffee (' + Core.numberFormat(Core.base.coffeePrice) + ')'
			button.removeAttribute('disabled')
			clearInterval(window.coffeeInterval)
			delete Stats.coffeeTimeLeft
		}else{
			Stats.coffeeTimeLeft--
			button.innerText = 'Coffee time left: ' + Core.timeFormat(Stats.coffeeTimeLeft * 1000)
		}
		Core.updateHUD()
	}, 1000)
}

Core.buyEnergyDrink = function(button){
	if(Stats.isEnergyDrinkPowered) return false
	var energyDrinkCost = Core.base.energyDrinkPrice
	var energyDrinkInc = Core.base.energyDrinkInc
	var effectTime = Core.base.energyDrinkEffectTime
	if(Stats.money < energyDrinkCost) return false
	button.setAttribute('disabled', true)
	Stats.money -= energyDrinkCost
	Core.base.pulseDuration *= energyDrinkInc
	Stats.isEnergyDrinkPowered = true
	Core.updateHUD()
	Stats.energyDrinksBought++
	Core.startEnergyDrinkEffect(button, energyDrinkInc, effectTime)
}

Core.startEnergyDrinkEffect = function(button, increment, seconds){
	Stats.energyDrinkTimeLeft = seconds
	button.innerText = 'Energy Drink time left: ' + Core.timeFormat(Stats.energyDrinkTimeLeft * 1000)
	window.energyDrinkInterval = setInterval(function(){
		if(Stats.energyDrinkTimeLeft <= 0){
			Core.base.pulseDuration /= increment
			Stats.isEnergyDrinkPowered = false
			button.removeAttribute('disabled')
			button.innerText = 'Buy Energy Drink (' + Core.numberFormat(Core.base.energyDrinkPrice) + ')'
			clearInterval(window.energyDrinkInterval)
			delete Stats.energyDrinkTimeLeft
		}else{
			Stats.energyDrinkTimeLeft--
			button.innerText = 'Energy Drink time left: ' + Core.timeFormat(Stats.energyDrinkTimeLeft * 1000)
		}
		Core.updateHUD()
	}, 1000)
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

Core.paySalaries = function(){
	var statBar = Core._('.salaries-timer-bar')
	if(!statBar){
		statBar = document.createElement('div')
		statBar.className = 'salaries-timer-bar'
		Core._('#salaries-timer-bar-container').appendChild(statBar)
	}
	var percent = 100
	var salariesTimeout = 60
	var seconds = salariesTimeout
	window.salariesInterval = setInterval(function(){
		Core.updateHUD()
		seconds--
		if(seconds <= 0){
			clearInterval(window.salariesInterval)
			Stats.money -= Core.calcSalariesCost()
			Core.paySalaries()
		}
		percent = (seconds / salariesTimeout) * 100
		statBar.style.width = percent + '%'
	}, 1000)
}

Core.payRents = function(){
	var statBar = Core._('.rents-timer-bar')
	if(!statBar){
		statBar = document.createElement('div')
		statBar.className = 'rents-timer-bar'
		Core._('#rents-timer-bar-container').appendChild(statBar)
	}
	var percent = 100
	var rentsTimeout = 60
	var seconds = rentsTimeout
	window.rentsInterval = setInterval(function(){
		Core.updateHUD()
		seconds--
		if(seconds <= 0){
			clearInterval(window.rentsInterval)
			Stats.money -= Core.calcRentCost()
			Core.payRents()
		}
		percent = (seconds / rentsTimeout) * 100
		statBar.style.width = percent + '%'
	}, 1000)
}

Core.jobFinder = function(){
	var time = Math.floor(Math.random() * 60) + 25
		time *= 1000
	setTimeout(function(){
		Core._('#takeJob').removeAttribute('disabled')
		document.title = 'JOB OPORTUNITY! | devLife'
		setTimeout(function(){
			Core._('#takeJob').setAttribute('disabled', true)
			document.title = 'devLife'
			if(Stats.jobs.length < Core.base.maxJobs){
				Core.jobFinder()
			}
		}, 5000)
	}, time)
}

Core.takeJob = function(button){
	if(button) button.setAttribute('disabled', true)
	if(Stats.jobs.length >= Core.base.maxJobs) return false
	var job = jobs[(Math.floor(Math.random() * (jobs.length - 1)))]
		job.id = 'job-' + new Date().getTime()
	Core.base.moneyIncPerPulse += job.increment
	document.title = 'devLife'
	Stats.jobs.push(job)
	Core.addJobToList(job)
}

Core.addJobToList = function(job){
	var li = document.createElement('li')
	var text = document.createTextNode(job.name + ' (+' + Core.numberFormat(job.increment) + '/pulse)')
	var qjbutton = document.createElement('button')
		qjbutton.innerText = 'Quit job'
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
	Stats.availableSpaces += room.spaces
	button.removeAttribute('data-cost')
	button.removeAttribute('data-type')
	button.className += ' owned'
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
	Core.base.moneyIncPerPulse -= Stats.jobs[i].increment
	Stats.jobs.splice(j, 1)
	button.parentNode.parentNode.removeChild(button.parentNode)
	if(Stats.jobs === Core.base.maxJobs - 1){
		Core.jobFinder()
	}
}

Core._ = function(selector, multiple){
	return multiple ? document.querySelectorAll(selector) : document.querySelector(selector)
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
	if(type === 'friend' && Stats.friends >= Core.base.maxFriendHiring) return false
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

Core.startProject = function(button){
	var max = 30
	var min = 10
	var projectTime = Math.floor(Math.random() * max) + min
		projectTime += projectTime * Math.round(Stats.projects / 10)
	button.setAttribute('disabled', true)
	// Botón con relleno de cuenta atrás
	button.style.position = 'relative'
	var bar = document.createElement('div')
		bar.className = 'projectProgress'
		button.appendChild(bar)
	var percent = 100
	var projectID = 'project-' + new Date().getTime()
	Core.projects[projectID] = {  }
	// Plus de ganancia por trabajador
	Core.projects[projectID].moneyPlus = Core.base.moneyIncPerPulse * Core.calcEmployeesMoneyInc()
	Core.projects[projectID].profit = 0
	Core.projects[projectID].secondsLeft = projectTime
	button.setAttribute('data-profit', '(Time left: '+ Core.timeFormat(projectTime * 1000) +') (Profit: 0¢)')
	Core.start(projectID, button)
	Core.projects[projectID].timer = setInterval(function(){
		Core.projects[projectID].secondsLeft--
		bar.setAttribute('data-percent', percent)
		var profitSecondsText = button.getAttribute('data-profit')
			profitSecondsText = profitSecondsText.replace(/Time left: \s*([0-9]+[h|m|s])*\s*([0-9]+[h|m|s])*\s*([0-9]+[h|m|s])*/g, 'Time left: ' + Core.timeFormat(Core.projects[projectID].secondsLeft * 1000))
			button.setAttribute('data-profit', profitSecondsText)
		if(Core.projects[projectID].secondsLeft <= 0){
			clearInterval(Core.projects[projectID].timer)
			Core.stop(projectID)
			button.removeAttribute('disabled')
			button.innerText = 'Start project'
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

Core.showImprovementButton = function(id){
	var button = document.createElement('button')
		if(improvements[id].help){
			button.className = 'help ' + id
			button.setAttribute('data-title', improvements[id].help)
		}
		button.innerText = improvements[id].label + ' (' + Core.numberFormat(improvements[id].cost) + ') (Development time: ' + Core.timeFormat(improvements[id].investigationTime) + ')'
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
	button.innerText = button.innerText.replace(/\(.*\)/g, '') + ' (Investigation in progress) (Time left: ' + Core.timeFormat(improvements[ty].investigationTime) + ')'
	var seconds = improvements[ty].investigationTime / 1000
	window['interval' + ty] = setInterval(function(){
		if(seconds <= 0){
			Stats.improvements.push(ty)
			improvements[ty].effect(button)
			improvements[ty].inProgress = false
			clearInterval(window['interval' + ty])
		}else{
			seconds--
			button.innerText = button.innerText.replace(/\(.*\)/g, '') + ' (Investigation in progress) (Time left: ' + Core.timeFormat(seconds * 1000) + ')'
		}
	}, 1000)
}

Core.numberFormat = function(number){
	return number.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.') + ' ¢'
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
	Core._('#lottery #winner').innerText = '-'
	Core._('#lottery #owned').innerText = '-'
	Core._('#lottery #info').innerText = '-'
	Core._('#lottery #info').className = ''
	Stats.numTicket = Core.pad(Math.floor((Math.random() * Core.base.numbersTickets) + 1))
	Core._('#lottery #owned').innerText = Stats.numTicket
	button.setAttribute('disabled', true)
	Stats.ticketsBought++
	Core.startRaffle(button)
}

Core.startRaffle = function(button){
	Stats.raffleRunning = true
	window.raffleInterval = setInterval(function(){
		Core._('#lottery #winner').innerText = Math.floor((Math.random() * Core.base.numbersTickets) + 1)
	}, 1)
	setTimeout(function(){
		clearInterval(window.raffleInterval)
		Stats.raffleRunning = false
		// Generate winner
		Stats.winnerTicket = Core.pad(Math.floor((Math.random() * Core.base.numbersTickets) + 1))
		Core._('#lottery #winner').innerText = Stats.winnerTicket
		var state = 'lose'
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
			state = 'win: ' + Core.numberFormat(prize)
		}else if(partial){
			Stats.partialWon = true
			state = 'partial win: ' + Core.numberFormat(prize)
		}
		Stats.money += prize
		Core._('#lottery #info').className += ' ' + state
		Core._('#lottery #info').innerText = state
		button.removeAttribute('disabled')
	}, Core.base.timeRaffle)
}

Core.pad = function(number){
	var str = '' + number
	var pad = '000000'
	return pad.substring(0, pad.length - str.length) + str
}

Core.save = function(){
	if(!localStorage || !JSON || typeof JSON.stringify !== 'function') return false
	localStorage.setItem('core.base', JSON.stringify(Core.base))
	localStorage.setItem('stats', JSON.stringify(Stats))
	localStorage.setItem('css', Core._('#css').getAttribute('href'))
	return true
}

Core.load = function(){
	if(!localStorage || !JSON || typeof JSON.parse !== 'function') return false
	Core.base = JSON.parse(localStorage.getItem('core.base'))
	Stats = JSON.parse(localStorage.getItem('stats'))
	var css = localStorage.getItem('css')
	// Añadir los jobs a la lista
	Core._('ul.job-list').innerHTML = ''
	for(var i = 0, len = Stats.jobs.length; i < len; i++){
		Core.addJobToList(Stats.jobs[i])
	}
	// Cargar estilo
	Core._('#css').setAttribute('href', css)
	// Añadir las mejoras
	for(var i = 0, len = Stats.improvements.length; i < len; i++){
		Stats.improvements[i].effect()
	}
	// Limpieza de intervals/timeouts
	clearInterval(window.salariesInterval)
	clearInterval(window.rentsInterval)
	if(Core.projects){
		for(var projectID in Core.projects){
			if(Core.projects.hasOwnProperty(projectID) && Core.projects[projectID].engine){
				clearTimeout(Core.projects[projectID].engine)
			}
		}
	}
	Core.init(true) // Así no se agrega otro trabajo
	return true
}

Core.notification = function(title, text){
	if(!Notification) return false
	if(!title) title = 'DevLife'

	if(Notification.permission !== 'granted'){
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

Core.initRecruitingSection = function(){
	if(!employees) return false
	var HTMLTemplate = [
		'<div>',
			'<span class="help label stat" data-title="Increase the pulse speed ::increment::%. ::help::">::label::</span>',
			'<span class="hireContainer">',
				'<button class="fireEmployee" disabled="disabled" data-type="::type::">-</button>',
				'<span class="employeeCounter" id="::id::Counter">0</span>',
				'<button class="hireEmployee help" data-title="Hiring cost: ::cost::¢ per minute" data-type="::type::">+</button>',
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
}

Core.addListeners = function(){
	Core._('#toggle-achievement-list').addEventListener('click', function(){ Core.toggleAchievementList() })
	Core._('#upgradePC').addEventListener('click', function(){ Core.upgradeComputer() })
	Core._('#buyCoffee').addEventListener('click', function(){ Core.buyCoffee(this) })
	Core._('#buyEnergyDrink').addEventListener('click', function(){ Core.buyEnergyDrink(this) })
	Core._('#takeJob').addEventListener('click', function(){ Core.takeJob(this) })
	Core._('.startProject').addEventListener('click', function(){ Core.startProject(this) })
	Core._('#buyTicket').addEventListener('click', function(){ Core.buyTicket(this) })
	var hires = Core._('.hireEmployee', true)
	for(var i = 0, len = hires.length; i < len; i++){
		hires[i].addEventListener('click', function(){ Core.hireEmployee(this) })
	}
	var fires = Core._('.fireEmployee', true)
	for(var i = 0, len = fires.length; i < len; i++){
		fires[i].addEventListener('click', function(){ Core.fireEmployee(this) })
	}
	var rents = Core._('.rentRoom', true)
	for(var i = 0, len = rents.length; i < len; i++){
		rents[i].addEventListener('click', function(){
			var ty = this.getAttribute('data-type')
			Core.rentRoom(ty, this)
		})
	}
	var improvs = Core._('.startImprovement', true)
	for(var i = 0, len = improvs.length; i < len; i++){
		improvs[i].addEventListener('click', function(){
			var ty = this.getAttribute('data-type')
			Core.startImprovement(ty, this)
		})
	}
	Core._('#shareTwitter').addEventListener('click', function(){
		var text = 'I have ' + Core._('#money').innerText + ' and ' + Core._('#incPerPulse').innerText + ' of money rate in my DevLife. How much do you have?'
		var url = 'https://twitter.com/intent/tweet?text=:text&url=:url&hashtags=:hashtags'
			url = url.replace(':text', text)
			url = url.replace(':url', document.URL)
			url = url.replace(':hashtags', 'DevLife')
		window.open(url, "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=800, height=500, top="+((screen.height/2)-250)+", left="+((screen.width/2)-400))
	})
	var sections = Core._('.button-section > .header', true)
	for(var i = 0, len = sections.length; i < len; i++){
		sections[i].addEventListener('click', function(){
			if(this.parentNode.className.indexOf('compact') === -1){
				Core.addClass(this.parentNode, 'compact')
			}else{
				Core.removeClass(this.parentNode, 'compact')
			}
		})
	}
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

Core.checkAchievements = function(){
	if(achievements && achievements.length){
		for(var i = 0, len = achievements.length; i < len; i++){
			if(!achievements[i].done){
				achievements[i].done = achievements[i].check()
				if(achievements[i].done){
					Core.showAchievementPopUp(achievements[i])
				}
			}
		}
	}
}

Core.showAchievementPopUp = function(achievement){
	var bg = document.createElement('DIV')
		bg.className = 'achievementPopup'
	var container = document.createElement('DIV')
		container.className = 'container'
	var title = document.createElement('P')
		title.className = 'title'
		title.innerText = 'Achievement unlocked!'
	var description = document.createElement('P')
		description.className = 'description'
		description.innerText = achievement.title
	var close = document.createElement('BUTTON')
		close.className = 'closeBtn'
		close.innerText = 'Close'
		close.onclick = function(){
			Core._('.achievementPopup').remove()
		}
	container.appendChild(title)
	container.appendChild(description)
	container.appendChild(close)
	Core._('body')
		.appendChild(bg)
		.appendChild(container)
}

Core.refreshAchievementList = function(){
	if(!achievements || !achievements.length) return false
	var table = document.createElement('TABLE')
	for(var i = 0, len = achievements.length; i < len; i++){
		var tr = document.createElement('TR')
		var tdTitle = document.createElement('TD')
		var tdStatus = document.createElement('TD')
		var statusText = achievements[i].done ? 'Unlocked' : 'Locked'
		tdTitle.innerText = achievements[i].title
		tdStatus.innerText = statusText
		tr.className = statusText.toLowerCase()
		tr.appendChild(tdTitle)
		tr.appendChild(tdStatus)
		table.appendChild(tr)
	}
	var closeBtn = document.createElement('BUTTON')
		closeBtn.className = 'close'
		closeBtn.innerText = 'Close'
		closeBtn.onclick = function(){
			Core.toggleAchievementList()
		}
	var lastTr = document.createElement('TR')
	var lastTd = document.createElement('TD')
		lastTd.setAttribute('colspan', 2)
		lastTd.appendChild(closeBtn)
	lastTr.appendChild(lastTd)
	table.appendChild(lastTr)
	Core._('#achievement-list').innerHTML =''
	Core._('#achievement-list').appendChild(table)
}

Core.toggleAchievementList = function(){
	var _list = Core._('#achievement-list')
	if(Core.hasClass(_list, 'open')){
		_list.style.display = 'none'
		Core.removeClass(_list, 'open')
	}else{
		Core.refreshAchievementList()
		_list.style.display = 'block'
		Core.addClass(_list, 'open')
	}
}
