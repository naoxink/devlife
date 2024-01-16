const ThemeSwitcher = (() => {
  const availableThemes = {
    'terminal': 'Terminal',
    'intranet': 'Intranet 2000',
    'intranet2': 'Intra-nueue'
  }

  const init = () => {
    // Comprobar que tiene el item comprado
    if(!Shop.items.themeSwitcher.owned) return false

    const _link = Core._('link#terminal')
    const activeFilename = _link.getAttribute('href').match(/css\/(\w+)\.css/)[1]
    const _section = document.createElement('div')
    _section.className = 'button-section'
    _section.id = 'themes-switcher'
    const _header = document.createElement('p')
    _header.className = 'header'
    _header.innerText = 'Theme Switcher'
    _section.appendChild(_header)
    for(let filename in availableThemes){
      const _button = document.createElement('button')
      _button.id = `ts-${filename}`
      _button.className = 'ts-button'
      _button.innerText = availableThemes[filename]
      if(filename === activeFilename){
        _button.setAttribute('disabled', true)
      }
      _button.addEventListener('click', function(e) {
        e.preventDefault()
        _link.setAttribute('href', `css/${filename}.css?${Date.now()}`)
        Core._('.ts-button', 1).forEach(b => b.removeAttribute('disabled'))
        this.setAttribute('disabled', true)
      })
      _section.appendChild(_button)
    }
    Core._('.left').insertBefore(_section, Core._('.left .button-section'))
  }

  return { init }
})()