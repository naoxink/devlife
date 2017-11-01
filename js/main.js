document.addEventListener('DOMContentLoaded', function(){
	Core.init()
})

window.onbeforeunload = function() {
	return "You will lose your progress"
}

dragula([
	document.querySelector('.left'),
	document.querySelector('.right')
])

var initStyles = function(stylesList){
	for(var i = 0, len = stylesList.length; i < len; i++){
		var lnk = document.createElement('link')
		lnk.setAttribute('id', stylesList[i])
		lnk.setAttribute('rel', 'stylesheet')
		lnk.setAttribute('href', 'css/' + stylesList[i] + '.css?' + new Date().getTime())
		Core._('head').appendChild(lnk)
	}
}

initStyles([ 'terminal', 'mediaqueries' ])