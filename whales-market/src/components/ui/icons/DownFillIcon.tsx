// DownFillIcon — Figma icon: down_fill (node 22283:303)
// Source: WhalesMarket-v2 / Foundation / Iconography
// viewBox: 0 0 24 24
// Used for ALL dropdown indicators throughout the project.

interface DownFillIconProps {
  size?: number
  className?: string
}

export const DownFillIcon: React.FC<DownFillIconProps> = ({
  size = 16,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.0599 16.06C12.7787 16.3409 12.3974 16.4987 11.9999 16.4987C11.6024 16.4987 11.2212 16.3409 10.9399 16.06L5.2819 10.404C5.00064 10.1226 4.84268 9.74101 4.84277 9.34315C4.84287 8.94529 5.00101 8.56377 5.2824 8.2825C5.56379 8.00124 5.9454 7.84328 6.34325 7.84338C6.74111 7.84347 7.12264 8.00161 7.4039 8.283L11.9999 12.879L16.5959 8.283C16.8787 8.00963 17.2575 7.85826 17.6508 7.86149C18.0441 7.86472 18.4204 8.0223 18.6986 8.30028C18.9769 8.57826 19.1348 8.95441 19.1384 9.3477C19.142 9.741 18.991 10.12 18.7179 10.403L13.0609 16.061L13.0599 16.06Z"
    />
  </svg>
)
