'use client'

import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

const Logo = () => {
    const theme = useTheme()
    const router = useRouter();

    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="25.000000pt"
            height="25.000000pt"
            fill={theme.resolvedTheme === 'dark' ? '#fff' : '#000'}
            viewBox="0 0 555.000000 555.000000"
            preserveAspectRatio="xMidYMid meet"
            onClick={() => router.push("/")}
            className='cursor-pointer'
        >
            <g
                transform="translate(0.000000,555.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
            >
                <path
                    d="M1762 3997 l-1012 -1012 0 -811 0 -810 1443 0 1442 1 3 -252 2 -253
-1445 0 -1445 0 0 -165 0 -165 1353 0 c745 0 1469 -3 1610 -7 l257 -6 0 1059
0 1059 -477 477 -478 478 180 180 180 180 552 -552 553 -553 0 -1157 0 -1158
165 0 165 0 0 1228 0 1227 -718 718 -717 717 -893 -893 -892 -892 0 -468 0
-467 -255 0 -255 0 0 572 0 573 967 967 968 968 -115 115 c-63 63 -117 115
-120 115 -3 0 -461 -456 -1018 -1013z m1450 -1074 l428 -428 0 -397 0 -398
-860 0 -860 0 0 397 0 398 427 427 c236 236 430 428 433 428 3 0 197 -192 432
-427z"
                />
            </g>
        </svg>

    )
}

export default Logo