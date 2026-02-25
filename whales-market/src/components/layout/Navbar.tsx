import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Copy } from 'lucide-react'
import { clsx } from 'clsx'
import { WalletModal } from './WalletModal'
import { DownFillIcon } from '@/components/ui/icons/DownFillIcon'
import logoSvg      from '@/assets/images/logo.svg'
import avatarImg    from '@/assets/images/avatar.png'
import feeIconImg   from '@/assets/images/fee-icon.png'
import solanaImg    from '@/assets/images/solana-logo.png'
import usdcIconImg  from '@/assets/images/usdc-icon.png'

// ─── Figma Icons (node 22283:xxxx — WhalesMarket-v2 icon library) ─────────────

interface IconProps { size?: number; className?: string }

/** copy_2_line — node 22283:4259 */
const Copy2LineIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M7 0C6.46957 0 5.96086 0.210714 5.58579 0.585786C5.21071 0.960859 5 1.46957 5 2V4H7V2H18V13H16V15H18C18.5304 15 19.0391 14.7893 19.4142 14.4142C19.7893 14.0391 20 13.5304 20 13V2C20 1.46957 19.7893 0.960859 19.4142 0.585786C19.0391 0.210714 18.5304 0 18 0H7ZM2 5C1.46957 5 0.960859 5.21071 0.585786 5.58579C0.210714 5.96086 0 6.46957 0 7V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H13C13.5304 20 14.0391 19.7893 14.4142 19.4142C14.7893 19.0391 15 18.5304 15 18V7C15 6.46957 14.7893 5.96086 14.4142 5.58579C14.0391 5.21071 13.5304 5 13 5H2ZM2 7H13V18H2V7Z" />
  </svg>
)

/** arrow_right_up_line — node 22283:200 */
const ArrowRightUpLineIcon: React.FC<IconProps> = ({ size = 12, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M12.6447 0C12.9099 0 13.1643 0.105357 13.3518 0.292893C13.5394 0.48043 13.6447 0.734784 13.6447 1V9C13.6447 9.26522 13.5394 9.51957 13.3518 9.70711C13.1643 9.89464 12.9099 10 12.6447 10C12.3795 10 12.1251 9.89464 11.9376 9.70711C11.7501 9.51957 11.6447 9.26522 11.6447 9V3.414L1.69471 13.364C1.50611 13.5462 1.25351 13.647 0.99131 13.6447C0.729113 13.6424 0.478301 13.5372 0.292893 13.3518C0.107485 13.1664 0.00231622 12.9156 3.78026e-05 12.6534C-0.00224062 12.3912 0.0985537 12.1386 0.280712 11.95L10.2307 2H4.64471C4.3795 2 4.12514 1.89464 3.93761 1.70711C3.75007 1.51957 3.64471 1.26522 3.64471 1C3.64471 0.734784 3.75007 0.48043 3.93761 0.292893C4.12514 0.105357 4.3795 0 4.64471 0H12.6447Z" />
  </svg>
)

/** bill_fill — node 22283:4226 (Dashboard) */
const BillFillIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 20" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M13 0C13.7956 0 14.5587 0.316071 15.1213 0.87868C15.6839 1.44129 16 2.20435 16 3V19C15.9999 19.1883 15.9466 19.3728 15.8462 19.5322C15.7459 19.6916 15.6025 19.8194 15.4327 19.9009C15.2629 19.9824 15.0736 20.0143 14.8864 19.9929C14.6993 19.9715 14.522 19.8977 14.375 19.78L12.5 18.28L10.625 19.78C10.4329 19.9339 10.1908 20.0115 9.94505 19.9981C9.69929 19.9846 9.46712 19.881 9.293 19.707L8 18.414L6.707 19.707C6.533 19.8811 6.30091 19.9849 6.05514 19.9986C5.80938 20.0122 5.56721 19.9348 5.375 19.781L3.5 18.28L1.625 19.78C1.47797 19.8977 1.30069 19.9715 1.11356 19.9929C0.926432 20.0143 0.737068 19.9824 0.567269 19.9009C0.39747 19.8194 0.254141 19.6916 0.153782 19.5322C0.0534242 19.3728 0.00011764 19.1883 0 19V3C0 2.20435 0.316071 1.44129 0.87868 0.87868C1.44129 0.316071 2.20435 0 3 0H13ZM8 10H5C4.73478 10 4.48043 10.1054 4.29289 10.2929C4.10536 10.4804 4 10.7348 4 11C4 11.2652 4.10536 11.5196 4.29289 11.7071C4.48043 11.8946 4.73478 12 5 12H8C8.26522 12 8.51957 11.8946 8.70711 11.7071C8.89464 11.5196 9 11.2652 9 11C9 10.7348 8.89464 10.4804 8.70711 10.2929C8.51957 10.1054 8.26522 10 8 10ZM11 6H5C4.74512 6.00028 4.49997 6.09788 4.31463 6.27285C4.1293 6.44782 4.01776 6.68695 4.00283 6.94139C3.98789 7.19584 4.07067 7.44638 4.23426 7.64183C4.39785 7.83729 4.6299 7.9629 4.883 7.993L5 8H11C11.2549 7.99972 11.5 7.90212 11.6854 7.72715C11.8707 7.55218 11.9822 7.31305 11.9972 7.05861C12.0121 6.80416 11.9293 6.55362 11.7657 6.35817C11.6021 6.16271 11.3701 6.0371 11.117 6.007L11 6Z" />
  </svg>
)

/** check_fill — node 22283:7535 (active indicator) */
const CheckFillIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 15" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M19.5499 0.43968C19.8311 0.720971 19.9891 1.10243 19.9891 1.50018C19.9891 1.89793 19.8311 2.27939 19.5499 2.56068L8.30693 13.8037C8.15835 13.9523 7.98196 14.0702 7.78781 14.1506C7.59367 14.231 7.38558 14.2724 7.17543 14.2724C6.96529 14.2724 6.7572 14.231 6.56305 14.1506C6.36891 14.0702 6.19251 13.9523 6.04393 13.8037L0.457932 8.21868C0.314667 8.08031 0.200394 7.91479 0.12178 7.73179C0.0431668 7.54878 0.00178736 7.35195 5.66349e-05 7.15278C-0.00167409 6.95361 0.0362786 6.75609 0.1117 6.57175C0.187121 6.3874 0.298501 6.21993 0.43934 6.07909C0.580179 5.93825 0.747657 5.82687 0.932001 5.75145C1.11635 5.67603 1.31387 5.63807 1.51303 5.6398C1.7122 5.64153 1.90903 5.68291 2.09204 5.76153C2.27505 5.84014 2.44056 5.95441 2.57893 6.09768L7.17493 10.6937L17.4279 0.43968C17.5672 0.30029 17.7326 0.189715 17.9147 0.114273C18.0967 0.0388304 18.2919 0 18.4889 0C18.686 0 18.8811 0.0388304 19.0632 0.114273C19.2452 0.189715 19.4106 0.30029 19.5499 0.43968Z" />
  </svg>
)

/** pig_money_fill — node 22283:1357 (Staking) */
const PigMoneyFillIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 18" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M9.5 0C10.483 0.0000757481 11.439 0.321906 12.222 0.91634C13.0049 1.51077 13.5718 2.34514 13.836 3.292L13.888 3.497L15.758 3.03C15.8947 2.99598 16.037 2.99122 16.1757 3.01602C16.3143 3.04083 16.4462 3.09465 16.5626 3.17395C16.679 3.25325 16.7773 3.35626 16.8511 3.47621C16.925 3.59616 16.9726 3.73035 16.991 3.87L17 4V5.81C17.5638 6.35053 18.0258 6.988 18.364 7.692L18.502 8H19C19.2449 8.00003 19.4813 8.08996 19.6644 8.25272C19.8474 8.41547 19.9643 8.63975 19.993 8.883L20 9V12C20 12.1646 19.9594 12.3266 19.8818 12.4718C19.8042 12.6169 19.6919 12.7407 19.555 12.832L19.447 12.894L18.279 13.479C17.8008 14.4041 17.1082 15.2013 16.259 15.804L16 15.978V17C16 17.2449 15.91 17.4813 15.7473 17.6644C15.5845 17.8474 15.3603 17.9643 15.117 17.993L15 18H12C11.7551 18 11.5187 17.91 11.3356 17.7473C11.1526 17.5845 11.0357 17.3603 11.007 17.117L11 17H10C9.99997 17.2449 9.91004 17.4813 9.74728 17.6644C9.58453 17.8474 9.36025 17.9643 9.117 17.993L9 18H6C5.75507 18 5.51866 17.91 5.33563 17.7473C5.15259 17.5845 5.03566 17.3603 5.007 17.117L5 17V15.978C4.27758 15.5161 3.65355 14.9161 3.16377 14.2123C2.67399 13.5085 2.3281 12.7149 2.146 11.877C1.55633 11.7015 1.03481 11.3491 0.652053 10.8674C0.269291 10.3857 0.0437648 9.79807 0.006 9.184L0 9V8.5C0.000282707 8.24512 0.0978791 7.99997 0.272848 7.81463C0.447818 7.6293 0.686953 7.51776 0.941395 7.50283C1.19584 7.48789 1.44638 7.57067 1.64183 7.73426C1.83729 7.89785 1.9629 8.1299 1.993 8.383L2 8.5V9C2 9.148 2.032 9.289 2.09 9.415C2.24263 8.51471 2.58313 7.65665 3.08933 6.89667C3.59553 6.13668 4.25608 5.4918 5.028 5.004C4.95705 4.37448 5.01981 3.73708 5.21219 3.13349C5.40456 2.52991 5.72221 1.97374 6.14435 1.50138C6.56649 1.02903 7.0836 0.651121 7.66187 0.392396C8.24013 0.133671 8.8665 -0.0000440627 9.5 0ZM14 8C13.7348 8 13.4804 8.10536 13.2929 8.29289C13.1054 8.48043 13 8.73478 13 9C13 9.26522 13.1054 9.51957 13.2929 9.70711C13.4804 9.89464 13.7348 10 14 10C14.2652 10 14.5196 9.89464 14.7071 9.70711C14.8946 9.51957 15 9.26522 15 9C15 8.73478 14.8946 8.48043 14.7071 8.29289C14.5196 8.10536 14.2652 8 14 8ZM9.5 2C8.89429 2 8.30918 2.2199 7.85341 2.61884C7.39763 3.01778 7.1022 3.56862 7.022 4.169C7.50661 4.05646 8.0025 3.99976 8.5 4H11.877L11.947 3.983C11.8284 3.42196 11.5206 2.91874 11.075 2.5577C10.6295 2.19666 10.0734 1.99976 9.5 2Z" />
  </svg>
)

/** exit_line — node 22283:7700 (Incentives & Disconnect) */
const ExitLineIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 17 18" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M8 0C8.25488 0.000282707 8.50003 0.0978791 8.68537 0.272848C8.8707 0.447818 8.98223 0.686953 8.99717 0.941395C9.01211 1.19584 8.92933 1.44638 8.76574 1.64183C8.60215 1.83729 8.3701 1.9629 8.117 1.993L8 2H3C2.75507 2.00003 2.51866 2.08996 2.33563 2.25272C2.15259 2.41547 2.03566 2.63975 2.007 2.883L2 3V15C2.00003 15.2449 2.08996 15.4813 2.25272 15.6644C2.41547 15.8474 2.63975 15.9643 2.883 15.993L3 16H7.5C7.75488 16.0003 8.00003 16.0979 8.18537 16.2728C8.3707 16.4478 8.48223 16.687 8.49717 16.9414C8.51211 17.1958 8.42933 17.4464 8.26574 17.6418C8.10215 17.8373 7.8701 17.9629 7.617 17.993L7.5 18H3C2.23479 18 1.49849 17.7077 0.941739 17.1827C0.384993 16.6578 0.0498925 15.9399 0.005 15.176L0 15V3C-0.0000426217 2.23479 0.292325 1.49849 0.817284 0.941739C1.34224 0.384993 2.06011 0.0498925 2.824 0.005L3 0H8ZM13.707 5.464L16.535 8.293C16.7225 8.48053 16.8278 8.73484 16.8278 9C16.8278 9.26516 16.7225 9.51947 16.535 9.707L13.707 12.536C13.5194 12.7235 13.2649 12.8288 12.9996 12.8287C12.7344 12.8286 12.48 12.7231 12.2925 12.5355C12.105 12.3479 11.9997 12.0934 11.9998 11.8281C11.9999 11.5629 12.1054 11.3085 12.293 11.121L13.414 10H8C7.73478 10 7.48043 9.89464 7.29289 9.70711C7.10536 9.51957 7 9.26522 7 9C7 8.73478 7.10536 8.48043 7.29289 8.29289C7.48043 8.10536 7.73478 8 8 8H13.414L12.293 6.879C12.1054 6.69149 11.9999 6.43712 11.9998 6.17185C11.9997 5.90658 12.105 5.65214 12.2925 5.4645C12.48 5.27686 12.7344 5.17139 12.9996 5.1713C13.2649 5.1712 13.5194 5.27649 13.707 5.464Z" />
  </svg>
)

/** user_add_2_fill — node 22283:8757 (Referral) */
const UserAdd2FillIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M4 5C4 3.67392 4.52678 2.40215 5.46447 1.46447C6.40215 0.526784 7.67392 0 9 0C10.3261 0 11.5979 0.526784 12.5355 1.46447C13.4732 2.40215 14 3.67392 14 5C14 6.32608 13.4732 7.59785 12.5355 8.53553C11.5979 9.47322 10.3261 10 9 10C7.67392 10 6.40215 9.47322 5.46447 8.53553C4.52678 7.59785 4 6.32608 4 5ZM2.822 12.672C4.425 11.694 6.605 11 9 11C9.447 11 9.887 11.024 10.316 11.07C10.4878 11.0884 10.6518 11.151 10.7922 11.2517C10.9326 11.3524 11.0445 11.4878 11.117 11.6446C11.1895 11.8014 11.2202 11.9743 11.206 12.1465C11.1918 12.3186 11.1332 12.4842 11.036 12.627C10.3586 13.6212 9.99747 14.7969 10 16C10 16.92 10.207 17.79 10.575 18.567C10.6467 18.7184 10.6792 18.8853 10.6696 19.0525C10.66 19.2198 10.6085 19.3819 10.5199 19.524C10.4313 19.6662 10.3085 19.7838 10.1626 19.8661C10.0167 19.9484 9.85248 19.9927 9.685 19.995L9 20C6.771 20 4.665 19.86 3.087 19.442C2.302 19.234 1.563 18.936 1.003 18.486C0.41 18.01 0 17.345 0 16.5C0 15.713 0.358 14.977 0.844 14.361C1.338 13.736 2.021 13.161 2.822 12.671V12.672ZM16 12C16.2652 12 16.5196 12.1054 16.7071 12.2929C16.8946 12.4804 17 12.7348 17 13V15H19C19.2652 15 19.5196 15.1054 19.7071 15.2929C19.8946 15.4804 20 15.7348 20 16C20 16.2652 19.8946 16.5196 19.7071 16.7071C19.5196 16.8946 19.2652 17 19 17H17V19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20C15.7348 20 15.4804 19.8946 15.2929 19.7071C15.1054 19.5196 15 19.2652 15 19V17H13C12.7348 17 12.4804 16.8946 12.2929 16.7071C12.1054 16.5196 12 16.2652 12 16C12 15.7348 12.1054 15.4804 12.2929 15.2929C12.4804 15.1054 12.7348 15 13 15H15V13C15 12.7348 15.1054 12.4804 15.2929 12.2929C15.4804 12.1054 15.7348 12 16 12Z" />
  </svg>
)

/** link_2_line — node 22283:4590 (Link Wallet) */
const Link2LineIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 19 19" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M13.6318 7.26786C13.804 7.09568 14.0331 6.99225 14.2761 6.97697C14.5192 6.96169 14.7594 7.03561 14.9518 7.18486L15.0458 7.26786L17.1668 9.38986C18.1819 10.4061 18.7592 11.7791 18.7753 13.2154C18.7913 14.6516 18.2448 16.0372 17.2527 17.0759C16.2605 18.1145 14.9014 18.7238 13.4659 18.7735C12.0304 18.8232 10.6324 18.3094 9.57083 17.3419L9.38883 17.1679L7.26783 15.0469C7.08657 14.8673 6.98079 14.6253 6.97214 14.3703C6.96349 14.1153 7.05262 13.8667 7.22129 13.6753C7.38996 13.4839 7.62541 13.3642 7.87945 13.3407C8.13349 13.3172 8.3869 13.3916 8.58783 13.5489L8.68183 13.6319L10.8028 15.7539C11.4466 16.3979 12.3159 16.7657 13.2264 16.7792C14.1369 16.7927 15.0168 16.4508 15.6793 15.8261C16.3418 15.2015 16.7348 14.3432 16.7749 13.4335C16.8149 12.5238 16.4989 11.6343 15.8938 10.9539L15.7528 10.8039L13.6318 8.68286C13.5388 8.58999 13.4651 8.4797 13.4148 8.3583C13.3644 8.2369 13.3385 8.10678 13.3385 7.97536C13.3385 7.84395 13.3644 7.71382 13.4148 7.59242C13.4651 7.47102 13.5388 7.36073 13.6318 7.26786ZM6.55883 6.56086C6.73102 6.38868 6.96012 6.28525 7.20314 6.26997C7.44617 6.25469 7.68642 6.32861 7.87883 6.47786L7.97383 6.56086L12.2158 10.8039C12.3952 10.9838 12.4993 11.2253 12.5071 11.4792C12.5148 11.7332 12.4256 11.9806 12.2576 12.1711C12.0895 12.3617 11.8553 12.4812 11.6024 12.5053C11.3494 12.5294 11.0968 12.4563 10.8958 12.3009L10.8018 12.2179L6.55883 7.97586C6.46585 7.88299 6.39209 7.7727 6.34177 7.6513C6.29144 7.5299 6.26554 7.39978 6.26554 7.26836C6.26554 7.13695 6.29144 7.00682 6.34177 6.88542C6.39209 6.76402 6.46585 6.65373 6.55883 6.56086ZM1.60883 1.61086C2.60962 0.610092 3.95769 0.0336486 5.37264 0.00142705C6.7876 -0.0307945 8.16051 0.483686 9.20583 1.43786L9.38783 1.61186L11.5088 3.73186C11.6901 3.9114 11.7959 4.15343 11.8045 4.40841C11.8132 4.66339 11.724 4.91203 11.5554 5.10344C11.3867 5.29485 11.1512 5.41456 10.8972 5.43806C10.6432 5.46157 10.3897 5.38708 10.1888 5.22986L10.0948 5.14686L7.97383 3.02586C7.3301 2.38184 6.46073 2.01405 5.55025 2.00055C4.63978 1.98706 3.75989 2.32892 3.09736 2.95358C2.43483 3.57824 2.04183 4.43651 2.00177 5.3462C1.96172 6.2559 2.27776 7.14539 2.88283 7.82586L3.02383 7.97586L5.14483 10.0959C5.32608 10.2754 5.43186 10.5174 5.44051 10.7724C5.44916 11.0274 5.36003 11.276 5.19136 11.4674C5.02269 11.6589 4.78724 11.7786 4.5332 11.8021C4.27916 11.8256 4.02575 11.7511 3.82483 11.5939L3.73083 11.5109L1.61083 9.38986C0.579429 8.35842 0 6.95951 0 5.50086C0 4.04221 0.579429 2.6433 1.61083 1.61186L1.60883 1.61086Z" />
  </svg>
)

// ─── Nav links ────────────────────────────────────────────────────────────────

interface NavLink {
  label: string
  href: string
  activePaths: string[]
  hasDropdown?: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'Pre-market', href: '/',          activePaths: ['/', '/market', '/listing'] },
  { label: 'Dashboard',  href: '/portfolio', activePaths: ['/portfolio'] },
  { label: 'Earn',       href: '/points',    activePaths: ['/points'],  hasDropdown: true },
  { label: 'About',      href: '#',          activePaths: ['/about'],   hasDropdown: false },
]

// ─── Avatar dropdown nav items (Figma: Section 2) ────────────────────────────
// Figma: 4 items — Dashboard(bill_fill), Staking(pig_money_fill),
//        Incentives(exit_line), Referral(user_add_2_fill)

interface AvatarNavItem {
  id: string
  label: string
  href: string
  Icon: React.FC<IconProps>
}

const AVATAR_NAV_ITEMS: AvatarNavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',  href: '/portfolio', Icon: BillFillIcon   },
  { id: 'staking',    label: 'Staking',    href: '/staking',   Icon: PigMoneyFillIcon },
  { id: 'incentives', label: 'Incentives', href: '/points',    Icon: ExitLineIcon   },
  { id: 'referral',   label: 'Referral',   href: '/referral',  Icon: UserAdd2FillIcon },
]

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_BALANCE   = '18.32'
const MOCK_FEE_LABEL = '-0% FEE'

// ─── Chain selector ────────────────────────────────────────────────────────────
// Figma: 62×36px | p=8 | gap=6 | border=#252527 | r=8
// Solana icon: 16×16 rounded-[4px] | chevron slot: 20×20

const ChainButton: React.FC = () => (
  <button
    className="flex items-center gap-1.5 h-9 px-2 rounded-lg border border-[#252527]
               hover:bg-[#1b1b1c] active:bg-[#252527] transition-colors duration-150"
    aria-label="Select chain"
  >
    {/* Solana logo 16×16 r=4 */}
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <img
        src={solanaImg}
        alt="Solana"
        className="w-4 h-4 rounded-[4px] object-cover shrink-0"
      />
    </div>
    {/* down_fill icon 16×16 — #7a7a83 */}
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <DownFillIcon size={16} className="text-[#7a7a83]" />
    </div>
  </button>
)

// ─── Fee button ────────────────────────────────────────────────────────────────
// Figma: ~139×36px | p=8 | gap=6 | border=#252527 | r=8

const FeeButton: React.FC = () => (
  <button
    className="flex items-center gap-1.5 h-9 px-2 rounded-lg border border-[#252527]
               hover:bg-[#1b1b1c] active:bg-[#252527] transition-colors duration-150 whitespace-nowrap"
    aria-label="Fee info"
  >
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <img src={feeIconImg} alt="Fee" className="w-4 h-4 object-contain shrink-0" />
    </div>
    <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums">
      0.00
    </span>
    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-[500] leading-[12px] text-[#5bd197] bg-[#16c284]/10">
      {MOCK_FEE_LABEL}
    </span>
  </button>
)

// ─── Balance button ────────────────────────────────────────────────────────────
// Figma: 87×36px | pl=8 pr=12 | gap=6 | border=#252527 | r=8

const BalanceButton: React.FC = () => (
  <button
    className="flex items-center gap-1.5 h-9 pl-2 pr-3 rounded-lg border border-[#252527]
               hover:bg-[#1b1b1c] active:bg-[#252527] transition-colors duration-150"
    aria-label="Balance"
  >
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <img src={usdcIconImg} alt="USDC" className="w-4 h-4 object-contain shrink-0" />
    </div>
    <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums">
      {MOCK_BALANCE}
    </span>
  </button>
)

// ─── Main Navbar ───────────────────────────────────────────────────────────────

interface NavbarProps {
  walletAddress: string | null
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ walletAddress, onConnect, onDisconnect }) => {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [copied, setCopied]         = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarOpen) return
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [avatarOpen])

  // Close dropdown on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAvatarOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isActive = (link: NavLink): boolean => {
    if (link.href === '#') return false
    if (link.href === '/') {
      return pathname === '/' || link.activePaths.some(p => p !== '/' && pathname.startsWith(p))
    }
    return link.activePaths.some(p => pathname.startsWith(p))
  }

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  const copyAddress = () => {
    if (!walletAddress) return
    void navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* ───────────────────────────────────────────────────────────────────────
          Header — Figma: bg=#0a0a0b | border-bottom 1px #1b1b1c | h=60px
      ─────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0b] border-b border-[#1b1b1c]">

        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex items-center h-[60px] w-full">

          {/* ── Left: Logo + Nav ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center shrink-0 opacity-100 hover:opacity-80 active:opacity-60 transition-opacity duration-150"
            >
              <img src={logoSvg} alt="WhalesMarket" className="h-7 w-auto" />
            </Link>

            {/* Desktop Nav — Figma: p=8 r=8 gap=6 text-14 w500 */}
            <nav className="hidden md:flex items-center" aria-label="Main navigation">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={clsx(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-14 font-medium',
                    'transition-all duration-150 select-none whitespace-nowrap',
                    isActive(link)
                      ? 'text-[#5bd197]'
                      : 'text-[#f9f9fa] hover:bg-[#1b1b1c] active:bg-[#252527]',
                  )}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <DownFillIcon
                      size={14}
                      className={clsx(
                        'shrink-0 transition-colors',
                        isActive(link) ? 'text-[#5bd197]' : 'text-[#7a7a83]',
                      )}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Spacer ────────────────────────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Right: Header Functions (connected) or Connect Wallet ──────
              Figma: chain(62×36) + fee(~139×36) + balance(87×36) + avatar(36×36)
              All bordered: border=#252527 r=8, gap=8
          ─────────────────────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {walletAddress ? (
              <>
                <ChainButton />
                <FeeButton />
                <BalanceButton />

                {/* ── Avatar + Dropdown ──────────────────────────────────── */}
                {/* Figma: avatar 36×36 outer | inner 32×32 circle */}
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => setAvatarOpen(v => !v)}
                    className="w-9 h-9 p-0.5 flex items-center justify-center
                               hover:opacity-80 active:opacity-60 transition-opacity duration-150"
                    aria-label="Account menu"
                    aria-expanded={avatarOpen}
                    aria-haspopup="menu"
                  >
                    <img
                      src={avatarImg}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  </button>

                  {/* ── Avatar Dropdown ────────────────────────────────────
                      Figma node: 42665:136834
                      Container: 256×328px | bg=#1b1b1c | r=12px
                  ──────────────────────────────────────────────────────── */}
                  {avatarOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-[calc(100%+8px)] w-64 bg-[#1b1b1c] rounded-2xl overflow-hidden z-50 animate-dropdown-in"
                      style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.64), 0 0 0 1px rgba(255,255,255,0.06)' }}
                    >

                      {/* ── Section 1: User header ──────────────────────────
                          Figma: pad=16 all | gap=12 | border-b #252527
                          Height: 76px
                      ────────────────────────────────────────────────── */}
                      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#252527]">

                        {/* Avatar — 44×44 outer | 40×40 inner circle */}
                        <div className="w-11 h-11 flex items-center justify-center shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#252527] overflow-hidden flex items-center justify-center">
                            <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        {/* Wallet info column — gap=2 */}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">

                          {/* Address row — gap=4 */}
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="text-[16px] font-[500] leading-[24px] text-[#f9f9fa] truncate flex-1">
                              {displayAddress}
                            </span>
                            {/* copy_2_line — icon-slot 24×24 pad=4 */}
                            <button
                              onClick={copyAddress}
                              className="w-6 h-6 flex items-center justify-center shrink-0
                                         text-[#7a7a83] hover:text-[#f9f9fa] hover:bg-[#252527] rounded-md
                                         transition-colors duration-150"
                              style={{ boxSizing: 'border-box' }}
                              aria-label={copied ? 'Copied!' : 'Copy address'}
                              title={copied ? 'Copied!' : 'Copy address'}
                            >
                              {copied
                                ? <CheckFillIcon size={16} className="text-[#5bd197]" />
                                : <Copy2LineIcon size={16} />
                              }
                            </button>
                          </div>

                          {/* Explorer link — gap=2 | text 12px/400/#7a7a83 + arrow icon */}
                          <a
                            href={`https://solscan.io/account/${walletAddress ?? ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[12px] leading-[16px] font-[400]
                                       text-[#7a7a83] hover:text-[#b4b4ba] transition-colors duration-150 w-fit"
                          >
                            Open in Explorer
                            <ArrowRightUpLineIcon size={12} className="shrink-0" />
                          </a>
                        </div>
                      </div>

                      {/* ── Section 2: Nav items ────────────────────────────
                          Figma: pad=8 all | gap=4 | border-b #252527
                          4 items × 240×32px | item pad=6/8 | gap=8 | r=8
                          Height: 156px
                      ────────────────────────────────────────────────── */}
                      <div className="p-2 border-b border-[#252527] flex flex-col gap-1" role="group">
                        {AVATAR_NAV_ITEMS.map(item => {
                          const active = pathname === item.href || pathname.startsWith(item.href + '/')
                          return (
                            <Link
                              key={item.id}
                              to={item.href}
                              role="menuitem"
                              onClick={() => setAvatarOpen(false)}
                              className={clsx(
                                'flex items-center gap-2 w-full px-2 py-[6px] rounded-lg',
                                'text-[14px] font-[500] leading-[20px] transition-colors duration-150 select-none',
                                active
                                  ? 'bg-[#252527] text-[#f9f9fa]'
                                  : 'text-[#f9f9fa] hover:bg-[#252527]',
                              )}
                            >
                              {/* icon-slot — 20×20 with p=2 inner = 16×16 */}
                              <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                                <item.Icon size={16} className="shrink-0" />
                              </span>

                              {/* label */}
                              <span className="flex-1 text-left">{item.label}</span>

                              {/* check_fill (active indicator) — trailing icon-slot 20×20 */}
                              <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                                {active && (
                                  <CheckFillIcon size={16} className="text-[#5bd197] shrink-0" />
                                )}
                              </span>
                            </Link>
                          )
                        })}
                      </div>

                      {/* ── Section 3: Link Wallet ──────────────────────────
                          Figma: pad=8 all | border-b #252527
                          1 item | no default bg, hover shows bg
                          Height: 48px
                      ────────────────────────────────────────────────── */}
                      <div className="p-2 border-b border-[#252527]">
                        <button
                          role="menuitem"
                          className="flex items-center gap-2 w-full px-2 py-[6px] rounded-lg
                                     text-[14px] font-[500] leading-[20px] text-[#f9f9fa]
                                     hover:bg-[#252527] transition-colors duration-150"
                          onClick={() => setAvatarOpen(false)}
                        >
                          <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                            <Link2LineIcon size={16} className="shrink-0" />
                          </span>
                          <span className="flex-1 text-left">Link Wallet</span>
                        </button>
                      </div>

                      {/* ── Section 4: Disconnect ───────────────────────────
                          Figma: pad=8 all | NO border-b
                          icon + label both #fd5e67 (danger)
                          Height: 48px
                      ────────────────────────────────────────────────── */}
                      <div className="p-2">
                        <button
                          role="menuitem"
                          onClick={() => { onDisconnect(); setAvatarOpen(false) }}
                          className="flex items-center gap-2 w-full px-2 py-[6px] rounded-lg
                                     text-[14px] font-[500] leading-[20px] text-[#fd5e67]
                                     hover:bg-[#252527] transition-colors duration-150"
                        >
                          <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                            <ExitLineIcon size={16} className="shrink-0" />
                          </span>
                          <span className="flex-1 text-left">Disconnect</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Connect Wallet — Figma: white bg, #0a0a0b text */
              <button
                onClick={() => setWalletOpen(true)}
                className="inline-flex items-center justify-center h-9 px-4 rounded-lg
                           bg-white text-14 font-medium text-[#0a0a0b] leading-none
                           hover:bg-neutral-100 active:bg-neutral-200
                           transition-colors duration-150 whitespace-nowrap"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-2 p-2 rounded-lg text-[#7a7a83]
                       hover:text-[#f9f9fa] hover:bg-[#1b1b1c]
                       active:bg-[#252527] transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile drawer ───────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0b] border-t border-[#1b1b1c]">
            <nav className="flex flex-col p-4 gap-0.5 max-w-[1440px] mx-auto">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-3 rounded-lg text-14 font-medium transition-colors',
                    isActive(link)
                      ? 'text-[#5bd197] bg-[#16c284]/10'
                      : 'text-[#f9f9fa] hover:bg-[#1b1b1c] active:bg-[#252527]',
                  )}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <DownFillIcon size={14} className="text-[#7a7a83] opacity-60 shrink-0" />
                  )}
                </Link>
              ))}
              <div className="border-t border-[#252527] my-2" />
              {!walletAddress ? (
                <button
                  onClick={() => { setMobileOpen(false); setWalletOpen(true) }}
                  className="w-full h-10 rounded-lg bg-[#16c284] text-14 font-medium text-[#0a0a0b]
                             hover:bg-[#16c284]/90 active:bg-[#16c284]/80 transition-colors"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <div className="px-3 py-2">
                    <p className="text-12 text-[#7a7a83]">Connected</p>
                    <p className="text-14 font-medium text-[#f9f9fa]">{displayAddress}</p>
                  </div>
                  <button
                    onClick={() => { copyAddress(); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-14 text-[#b4b4ba]
                               hover:text-[#f9f9fa] hover:bg-[#1b1b1c] transition-colors"
                  >
                    <Copy size={14} />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                  <button
                    onClick={() => { onDisconnect(); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-14 text-[#fd5e67]
                               hover:bg-[#1b1b1c] transition-colors"
                  >
                    <LogOut size={14} />
                    Disconnect
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
        onConnect={(addr) => { onConnect(addr); setWalletOpen(false) }}
      />
    </>
  )
}
