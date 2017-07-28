document.addEventListener('DOMContentLoaded', function(){
	Core.init()
})

window.onbeforeunload = function() {
	return "You will lose your progress"
}
