var Shop = {  }

Shop.buyCoffee = function(button){
	if(Stats.isCoffeePowered) return false
	var coffeePrice = Core.base.coffeePrice
	var coffeeInc = Core.base.coffeeInc
	var effectTime = Core.base.coffeeEffectTime
	if(Stats.money < coffeePrice) return false
	Stats.money -= coffeePrice
	Stats.coffeeIncrement = (Core.base.moneyIncPerPulse / (Stats.employees.length + 1)) * coffeeInc
	Core.base.moneyIncPerPulse += Stats.coffeeIncrement
	Stats.isCoffeePowered = true
	Core.updateHUD()
	Stats.coffeesBought++
	Shop.startCoffeeEffect(button, Stats.coffeeIncrement, effectTime)
}

Shop.startCoffeeEffect = function(button, increment, seconds){
	button.setAttribute('disabled', true)
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

Shop.buyEnergyDrink = function(button){
	if(Stats.isEnergyDrinkPowered) return false
	var energyDrinkCost = Core.base.energyDrinkPrice
	var energyDrinkInc = Core.base.energyDrinkInc
	var effectTime = Core.base.energyDrinkEffectTime
	if(Stats.money < energyDrinkCost) return false
	Stats.money -= energyDrinkCost
	Core.base.pulseDuration *= energyDrinkInc
	Stats.isEnergyDrinkPowered = true
	Core.updateHUD()
	Stats.energyDrinksBought++
	Shop.startEnergyDrinkEffect(button, energyDrinkInc, effectTime)
}

Shop.startEnergyDrinkEffect = function(button, increment, seconds){
	button.setAttribute('disabled', true)
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