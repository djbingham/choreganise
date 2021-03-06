import './Theme.css'


const Theme = ({ children, invert = false, ...props }) => {
  const themes = ['accent', 'caution', 'danger', 'dark', 'default', 'success']

  const classes = ['theme']

  const selectedTheme = Object.keys(props).find(theme => themes.includes(theme)) || 'default'
  classes.push(`theme-${selectedTheme}`)
  if (invert) {
    classes.push('theme-invert')
  }

  return (
    <span className={classes.join(' ')}>
      {children}
    </span>
  )
}

export default Theme
