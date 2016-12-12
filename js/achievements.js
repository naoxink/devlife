var achievements = [
	{
		'title': 'Complete your first project',
		'check': function(){
			return Stats.projects >= 1
		},
		'done': false
	},
	{
		'title': 'Raise your money up to 1.000.000',
		'check': function(){
			return Stats.money >= 1000000
		},
		'done': false
	},
	{
		'title': 'Raise your money up to 10.000.000',
		'check': function(){
			return Stats.money >= 10000000
		},
		'done': false
	},
	{
		'title': 'Raise your money up to 100.000.000',
		'check': function(){
			return Stats.money >= 100000000
		},
		'done': false
	},
	{
		'title': 'Unlock the intranet skin',
		'check': function(){
			return Stats.improvements.indexOf('intranet') !== -1
		},
		'done': false
	},
	{
		'title': 'Unlock the new intranet skin',
		'check': function(){
			return Stats.improvements.indexOf('intranet2') !== -1
		},
		'done': false
	},
	{
		'title': 'Hire your first employee',
		'check': function(){
			return Stats.employees.length >= 1
		},
		'done': false
	},
	{
		'title': 'Upgrade your computer to version 20',
		'check': function(){
			return Stats.computerVersion >= 20
		},
		'done': false
	},
	{
		'title': 'Rent your first room',
		'check': function(){
			return Stats.rooms >= 1
		},
		'done': false
	},
	{
		'title': 'Rent your first floor',
		'check': function(){
			return Stats.floors >= 1
		},
		'done': false
	},
	{
		'title': 'Rent your first building',
		'check': function(){
			return Stats.buildings >= 1
		},
		'done': false
	},
	{
		'title': 'Rent your first warehouse',
		'check': function(){
			return Stats.warehouses >= 1
		},
		'done': false
	},
	{
		'title': 'Drop all your jobs',
		'check': function(){
			return Stats.jobs.length <= 0
		},
		'done': false
	},
	{
		'title': 'Achieve the minimum pulse speed',
		'check': function(){
			return Core.base.pulseDuration <= Core.base.minPulseDuration
		},
		'done': false
	},
	{
		'title': 'Unlock a parallel project',
		'check': function(){
			return Stats.improvements.indexOf('addProject') !== -1
		},
		'done': false
	}

]
