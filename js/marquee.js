Marquee = {
	'runing': false,
	'contentID': 'news-content',
	'jump': 1,
	'speed': 10,
	'queue': [  ],
	'_container': Core._("#news"),
	'_content': null,
	'timer': null
}

Marquee.show = function(text){
	if(Marquee.runing){
		return Marquee.addToQueue(text)
	}
	Marquee.runing = true
	Marquee._createContent(text)
	Marquee.timer = setTimeout(Marquee._check, 10)
}

Marquee._createContent = function(text){
	Marquee._content = document.createElement('span')
	Marquee._content.setAttribute('id', Marquee.contentID)
	Marquee._content.innerHTML = text
	Marquee._container.appendChild(Marquee._content)
	Marquee._content.style.left = news.offsetWidth + 'px'
}

Marquee._check = function(){
	var left = parseInt(Marquee._content.style.left, 10)
	if(left + Marquee._content.offsetWidth < 0){
		if(Marquee._content && Marquee._content.parentNode){
			Marquee._content.parentNode.removeChild(Marquee._content)
		}
		Marquee._content = null
		Marquee.timer = null
		Marquee.runing = false
		if(Marquee.hasQueue()){
			return Marquee.show(Marquee.getOne())
		}
		return true
	}
	Marquee._content.style.left = (left - Marquee.jump) + 'px'
	Marquee.timer = setTimeout(Marquee._check, 10)
}

Marquee.addToQueue = function(text){
	if(Marquee.queue.indexOf(text) === -1){
		Marquee.queue.push(text)
	}
}

Marquee.removeFromQueue = function(text){
	Marquee.queue = Marquee.queue.filter(function(t){
		return t !== text
	})
}

Marquee.getOne = function(){
	return Marquee.queue.shift()
}

Marquee.hasQueue = function(){
	return Marquee.queue.length > 0
}