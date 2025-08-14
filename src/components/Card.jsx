import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const Card = forwardRef(({
  children,
  variant = 'default',
  className,
  padding = 'default',
  hover = true,
  ...props
}, ref) => {
  const baseClasses = 'rounded-xl transition-all duration-200'
  
  const variants = {
    default: 'bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 shadow-lg',
    glass: 'glass backdrop-blur-md bg-white/10 dark:bg-dark-800/10 border border-white/20 dark:border-dark-600/20 shadow-glass dark:shadow-glass-dark',
    elevated: 'bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 shadow-xl',
    outline: 'bg-transparent border-2 border-gray-200 dark:border-dark-700',
  }
  
  const paddingVariants = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02]' : ''
  
  const classes = cn(
    baseClasses,
    variants[variant],
    paddingVariants[padding],
    hoverClasses,
    className
  )
  
  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card
