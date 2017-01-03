var employees = {
	'friend': {
		'label': 'Friend',
		'salary': 30,
		'increment': 0.005,
		'id': 'friends',
		'help': 'You can only hire 3.'
	},
	'programmer-junior': {
		'label': 'Programmer (Junior)',
		'salary': 1000,
		'increment': 0.01,
		'id': 'juniorProgrammers'
	},
	'programmer-senior': {
		'label': 'Programmer (Senior)',
		'salary': 2000,
		'increment': 0.015,
		'id': 'seniorProgrammers'
	},
	'designer-web': {
		'label': 'Web Designer',
		'salary': 1000,
		'increment': 0.0155,
		'id': 'webDesigners',
		'help': 'Unlocks intranet improvement.',
		'unlocks': function(){
			if(Stats['designer-web'] === 1 && !Core.hasImprovement('intranet') && !Core._('.startImprovement[data-type=intranet]', true).length){
				Core.showImprovementButton('intranet')
			}
		}
	},
	'seo': {
		'label': 'SEO',
		'salary': 1200,
		'increment': 0.016,
		'id': 'seo'
	},
	'project-manager': {
		'label': 'Project Manager',
		'salary': 2500,
		'increment': 0.01,
		'id': 'projectManagers',
		'help': 'Unlocks auto projects improvement.',
		'unlocks': function(){
			if(Stats['project-manager'] === 1 && !Core.hasImprovement('autoStartProjects') && !Core._('.startImprovement[data-type=autoStartProjects]', true).length){
				Core.showImprovementButton('autoStartProjects')
			}
		}
	}
}

Core.employeeNames = [
	'Adrián', 'Alberto', 'Alejandro', 'Andrés', 'Antonio', 'Benjamin', 'Bruno', 'Bryan', 'Carlos', 'Cristian', 'Daniel',
	'David', 'Diego', 'Dylan', 'Eduardo', 'Enrique', 'Fabián', 'Felipe', 'Fernando', 'Francisco', 'Gabriel', 'Gael', 'Guillermo',
	'Gustavo', 'Hugo', 'Héctor', 'Ian', 'Ignacio', 'Iker', 'Isaac', 'Iván', 'Javier', 'Jesús', 'Joel', 'Jonathan', 'Jorge',
	'José', 'Juan', 'Kevin', 'Lucas', 'Luis', 'Manuel', 'Marcos', 'Martín', 'Mateo', 'Miguel', 'Nacho', 'Nicolás', 'Omar', 'Pablo',
	'Pedro', 'Rafael', 'Ricardo', 'Roberto', 'Rodrigo', 'Samuel', 'Santiago', 'Sebastián', 'Sergio', 'Thiago', 'Uriel', 'Víctor',
	'Álvaro', 'Óscar', 'Adriana', 'Alba', 'Alicia', 'Ana', 'Andrea', 'Beatriz', 'Belén', 'Blanca', 'Bárbara', 'Camila', 'Carmen',
	'Carolina', 'Claudia', 'Cristina', 'Diana', 'Elena', 'Elizabeth', 'Emily', 'Emma', 'Erika', 'Esther', 'Fabiola', 'Fernanda',
	'Fátima', 'Gabriela', 'Gloria', 'Guadalupe', 'Génesis', 'Isabel', 'Jennifer', 'Jessica', 'Karen', 'Karina', 'Karla', 'Katherine',
	'Kiara', 'Laura', 'Lorena', 'Lucía', 'Luna', 'Lía', 'Martina', 'María', 'Miriam', 'Mónica', 'Natalia', 'Nicole', 'Noah', 'Pamela',
	'Paola', 'Patricia', 'Paula', 'Paulina', 'Rocío', 'Rosa', 'Sandra', 'Sara', 'Silvia', 'Sofía', 'Susana', 'Tania', 'Valentina',
	'Valeria', 'Vanessa', 'Verónica', 'Victoria', 'Ximena', 'Yesenia', 'Zoe'
]