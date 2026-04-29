import './brand-logo.css'

type BrandLogoProps = {
  size?: 'md' | 'lg'
}

export function BrandLogo({ size = 'lg' }: BrandLogoProps) {
  return (
    <div className={`brand-logo brand-logo--${size}`} aria-label="WEB 3.0">
      <span className="brand-logo__mark">W</span>
      <span className="brand-logo__text">WEB 3.0</span>
    </div>
  )
}
