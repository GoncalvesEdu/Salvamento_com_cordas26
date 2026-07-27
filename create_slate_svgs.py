import os

img_dir = r'C:\Users\Edu\.gemini\antigravity\scratch\salvamento-cordas-portal\images'
os.makedirs(img_dir, exist_ok=True)

slate_svgs = {
    'ancoragens_equalizadas.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>

        <!-- Slate Board Texture -->
        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <!-- Neon Cyan Title & Instruction Flow -->
        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>ANCORAGENS EQUALIZADAS Y</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>DISTRIBUIÇÃO DE CARGA EM ÂNGULO IDEAL (&lt;= 60°)</text>

        <!-- Neon Red Anchors -->
        <circle cx='180' cy='140' r='22' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <circle cx='180' cy='140' r='8' fill='#ff003c' filter='url(#neonRedGlow)'/>
        <text x='180' y='110' fill='#ff003c' font-size='10' font-weight='bold' text-anchor='middle' filter='url(#neonRedGlow)'>PONTO A</text>

        <circle cx='420' cy='140' r='22' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <circle cx='420' cy='140' r='8' fill='#ff003c' filter='url(#neonRedGlow)'/>
        <text x='420' y='110' fill='#ff003c' font-size='10' font-weight='bold' text-anchor='middle' filter='url(#neonRedGlow)'>PONTO B</text>

        <!-- Neon Lime Tactical Rope & Slings -->
        <path d='M 180 140 L 300 240 L 420 140' stroke='#39ff14' stroke-width='8' fill='none' stroke-linecap='round' stroke-linejoin='round' filter='url(#neonLimeGlow)'/>

        <!-- Master Rigging Ring / Carabiner (Neon Lime / Red) -->
        <circle cx='300' cy='240' r='18' fill='#030509' stroke='#39ff14' stroke-width='4' filter='url(#neonLimeGlow)'/>
        <line x1='300' y1='258' x2='300' y2='310' stroke='#ff003c' stroke-width='8' filter='url(#neonRedGlow)'/>

        <!-- Angle Arc & Cyan Flow Text -->
        <path d='M 250 198 A 60 60 0 0 1 350 198' fill='none' stroke='#00f0ff' stroke-width='2' stroke-dasharray='4 4' filter='url(#neonCyanGlow)'/>
        <text x='300' y='190' fill='#00f0ff' font-size='14' font-weight='bold' text-anchor='middle' filter='url(#neonCyanGlow)'>45°</text>

        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>50% CARGA EM CADA PONTO (EQUILÍBRIO)</text>
    </svg>''',

    'sistema_3para1.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>

        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <!-- Neon Cyan Title -->
        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>SISTEMA DE REDUÇÃO 3:1 (Z-RIG)</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>VANTAGEM MECÂNICA COM BLOQUEADOR PRUSIK</text>

        <!-- Red Anchor Plate -->
        <rect x='45' y='140' width='40' height='80' rx='8' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <circle cx='65' cy='160' r='8' fill='#ff003c'/>
        <circle cx='65' cy='200' r='8' fill='#39ff14'/>

        <!-- Neon Lime Main Rope Z-Pattern -->
        <path d='M 65 200 L 440 200' stroke='#39ff14' stroke-width='8' fill='none' stroke-linecap='round' filter='url(#neonLimeGlow)'/>
        <path d='M 440 200 Q 465 200 465 230 Q 465 260 240 260 Q 215 260 215 230 Q 215 200 230 200 L 530 200' stroke='#39ff14' stroke-width='8' fill='none' stroke-linecap='round' filter='url(#neonLimeGlow)'/>

        <!-- Traveling Pulley (Neon Lime) -->
        <circle cx='440' cy='200' r='24' fill='#030509' stroke='#39ff14' stroke-width='4' filter='url(#neonLimeGlow)'/>
        <circle cx='440' cy='200' r='8' fill='#39ff14'/>

        <!-- Red Prusik Locking Knot -->
        <rect x='375' y='190' width='30' height='20' rx='5' fill='#ff003c' stroke='#ffffff' stroke-width='2' filter='url(#neonRedGlow)'/>
        <text x='390' y='204' fill='#ffffff' font-size='9' font-weight='bold' text-anchor='middle'>PRUSIK</text>

        <!-- Directional Pulley (Red) -->
        <circle cx='215' cy='200' r='24' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <circle cx='215' cy='200' r='8' fill='#ff003c'/>

        <!-- Cyan Flow Labels -->
        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>VANTAGEM MECÂNICA REAL 3:1</text>
    </svg>''',

    'sistema_5para1.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>

        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <!-- Neon Cyan Title -->
        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>SISTEMA DE REDUÇÃO 5:1 (VECTOR SYSTEM)</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>SISTEMA DUPLO COM 5 PERNAS DE CORDA</text>

        <!-- Red Anchor Block Left -->
        <rect x='120' y='130' width='45' height='110' rx='10' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <circle cx='142' cy='155' r='12' fill='#ff003c'/>
        <circle cx='142' cy='215' r='12' fill='#ff003c'/>

        <!-- Lime Moving Block Right -->
        <rect x='410' y='130' width='45' height='110' rx='10' fill='#030509' stroke='#39ff14' stroke-width='4' filter='url(#neonLimeGlow)'/>
        <circle cx='432' cy='155' r='12' fill='#39ff14'/>
        <circle cx='432' cy='215' r='12' fill='#39ff14'/>

        <!-- 5 Neon Ropes -->
        <line x1='142' y1='155' x2='432' y2='155' stroke='#39ff14' stroke-width='6' filter='url(#neonLimeGlow)'/>
        <line x1='142' y1='175' x2='432' y2='175' stroke='#ff003c' stroke-width='6' filter='url(#neonRedGlow)'/>
        <line x1='142' y1='195' x2='432' y2='195' stroke='#39ff14' stroke-width='6' filter='url(#neonLimeGlow)'/>
        <line x1='142' y1='215' x2='432' y2='215' stroke='#ff003c' stroke-width='6' filter='url(#neonRedGlow)'/>

        <path d='M 432 155 C 480 155, 480 215, 432 215' stroke='#39ff14' stroke-width='6' fill='none' filter='url(#neonLimeGlow)'/>
        <path d='M 142 155 C 95 155, 95 215, 142 215' stroke='#ff003c' stroke-width='6' fill='none' filter='url(#neonRedGlow)'/>

        <line x1='142' y1='185' x2='550' y2='185' stroke='#39ff14' stroke-width='8' stroke-linecap='round' filter='url(#neonLimeGlow)'/>

        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>SISTEMA DE ALTA POTÊNCIA OPERACIONAL</text>
    </svg>''',

    'resgate_pickoff.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>
        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>RESGATE PICK-OFF (VÍTIMA PRESA)</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>DESCONEXÃO &amp; TRANSFERÊNCIA DE CARGA</text>

        <!-- Vertical Neon Ropes -->
        <line x1='240' y1='15' x2='240' y2='325' stroke='#39ff14' stroke-width='7' filter='url(#neonLimeGlow)'/>
        <line x1='360' y1='15' x2='360' y2='325' stroke='#ff003c' stroke-width='7' filter='url(#neonRedGlow)'/>

        <!-- Rescuer Box (Neon Lime) -->
        <rect x='200' y='110' width='80' height='80' rx='12' fill='#030509' stroke='#39ff14' stroke-width='4' filter='url(#neonLimeGlow)'/>
        <text x='240' y='155' fill='#39ff14' font-size='12' font-weight='bold' text-anchor='middle'>RESGATADOR</text>

        <!-- Victim Box (Neon Red) -->
        <rect x='320' y='170' width='80' height='80' rx='12' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <text x='360' y='215' fill='#ff003c' font-size='12' font-weight='bold' text-anchor='middle'>VÍTIMA</text>

        <!-- Pickoff Connecting Strap -->
        <line x1='280' y1='150' x2='320' y2='190' stroke='#00f0ff' stroke-width='5' stroke-dasharray='6 3' filter='url(#neonCyanGlow)'/>

        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>DESCIDA DUPLA CONTROLADA</text>
    </svg>''',

    'passagem_no.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>
        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>PASSAGEM DE NÓ EM CORDA</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>MANOBRA TÁTICA DE BYPASS E RETENÇÃO</text>

        <!-- Vertical Main Rope -->
        <line x1='300' y1='15' x2='300' y2='120' stroke='#39ff14' stroke-width='8' filter='url(#neonLimeGlow)'/>
        
        <!-- Knot in Center (Neon Red) -->
        <circle cx='300' cy='165' r='24' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <text x='300' y='172' fill='#ff003c' font-size='13' font-weight='bold' text-anchor='middle'>NÓ</text>

        <line x1='300' y1='210' x2='300' y2='325' stroke='#39ff14' stroke-width='8' filter='url(#neonLimeGlow)'/>

        <!-- Bypass Loop (Neon Lime & Cyan) -->
        <path d='M 285 100 C 180 100, 180 230, 285 230' stroke='#39ff14' stroke-width='6' fill='none' stroke-dasharray='7 4' filter='url(#neonLimeGlow)'/>
        <circle cx='185' cy='165' r='16' fill='#030509' stroke='#00f0ff' stroke-width='3' filter='url(#neonCyanGlow)'/>
        <circle cx='185' cy='165' r='6' fill='#00f0ff'/>

        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>RETENÇÃO DUPLA DE SEGURANÇA</text>
    </svg>''',

    'tirolesa_caboguia.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>
        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>TIROLESA / CABO GUIA</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>TRAVESSIA DE VÃOS &amp; TRANSPORTE DE CARGA</text>

        <!-- Red Anchors Left & Right -->
        <rect x='35' y='100' width='25' height='120' rx='6' fill='#030509' stroke='#ff003c' stroke-width='3' filter='url(#neonRedGlow)'/>
        <rect x='540' y='100' width='25' height='120' rx='6' fill='#030509' stroke='#ff003c' stroke-width='3' filter='url(#neonRedGlow)'/>

        <!-- Neon Lime Highline Cable -->
        <line x1='60' y1='135' x2='540' y2='135' stroke='#39ff14' stroke-width='8' filter='url(#neonLimeGlow)'/>

        <!-- Trolley Carriage -->
        <circle cx='300' cy='135' r='26' fill='#030509' stroke='#39ff14' stroke-width='4' filter='url(#neonLimeGlow)'/>
        <circle cx='300' cy='135' r='10' fill='#39ff14'/>

        <!-- Hanging Load -->
        <line x1='300' y1='161' x2='300' y2='215' stroke='#ff003c' stroke-width='6' filter='url(#neonRedGlow)'/>
        <rect x='260' y='215' width='80' height='45' rx='10' fill='#030509' stroke='#ff003c' stroke-width='3' filter='url(#neonRedGlow)'/>
        <text x='300' y='242' fill='#ffffff' font-size='13' font-weight='bold' text-anchor='middle'>CARGA</text>

        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>LINHA GUIA E RETENÇÃO CONTINUA</text>
    </svg>''',

    'maca_envelope.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>
        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>MANEJO DE MACA (ENVELOPE / SKED)</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>EMPACOTAMENTO &amp; SUSPENSÃO VERTICAL</text>

        <!-- Stretcher Body (Red) -->
        <rect x='140' y='160' width='320' height='65' rx='16' fill='#030509' stroke='#ff003c' stroke-width='4' filter='url(#neonRedGlow)'/>
        <text x='300' y='198' fill='#ffffff' font-size='13' font-weight='bold' text-anchor='middle'>VÍTIMA EMBALADA (SKED)</text>

        <!-- Lime Straps -->
        <line x1='200' y1='160' x2='200' y2='225' stroke='#39ff14' stroke-width='6' filter='url(#neonLimeGlow)'/>
        <line x1='300' y1='160' x2='300' y2='225' stroke='#39ff14' stroke-width='6' filter='url(#neonLimeGlow)'/>
        <line x1='400' y1='160' x2='400' y2='225' stroke='#39ff14' stroke-width='6' filter='url(#neonLimeGlow)'/>

        <!-- Suspension Bridle -->
        <line x1='300' y1='100' x2='200' y2='160' stroke='#39ff14' stroke-width='5' filter='url(#neonLimeGlow)'/>
        <line x1='300' y1='100' x2='400' y2='160' stroke='#39ff14' stroke-width='5' filter='url(#neonLimeGlow)'/>
        <circle cx='300' cy='100' r='18' fill='#030509' stroke='#00f0ff' stroke-width='3' filter='url(#neonCyanGlow)'/>
        <line x1='300' y1='15' x2='300' y2='82' stroke='#39ff14' stroke-width='8' filter='url(#neonLimeGlow)'/>

        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>BRIDLE DE ALTA ESTABILIDADE</text>
    </svg>''',

    'sistema_seguranca.svg': '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340' width='100%' height='100%'>
        <defs>
            <radialGradient id='slateBg' cx='50%' cy='50%' r='75%'>
                <stop offset='0%' stop-color='#0f172a'/>
                <stop offset='60%' stop-color='#090d16'/>
                <stop offset='100%' stop-color='#030509'/>
            </radialGradient>
            <pattern id='slateGrain' width='4' height='4' patternUnits='userSpaceOnUse'>
                <rect width='4' height='4' fill='#090d16'/>
                <circle cx='2' cy='2' r='0.8' fill='#1e293b' opacity='0.3'/>
            </pattern>
            <filter id='neonLimeGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonRedGlow' x='-30%' y='-30%' width='160%' height='160%'>
                <feGaussianBlur stdDeviation='6' result='blur1'/>
                <feGaussianBlur stdDeviation='2' result='blur2'/>
                <feMerge>
                    <feMergeNode in='blur1'/>
                    <feMergeNode in='blur2'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
            <filter id='neonCyanGlow' x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='3' result='blur'/>
                <feMerge>
                    <feMergeNode in='blur'/>
                    <feMergeNode in='SourceGraphic'/>
                </feMerge>
            </filter>
        </defs>
        <rect width='600' height='340' fill='url(#slateBg)'/>
        <rect width='600' height='340' fill='url(#slateGrain)' opacity='0.7'/>
        <rect x='12' y='12' width='576' height='316' rx='16' fill='none' stroke='#334155' stroke-width='2' opacity='0.6'/>

        <text x='300' y='52' fill='#00f0ff' font-family='sans-serif' font-weight='900' font-size='22' letter-spacing='1.5' text-anchor='middle' filter='url(#neonCyanGlow)'>SISTEMA DE SEGURANÇA (BELAY / TPB)</text>
        <text x='300' y='76' fill='#00f0ff' font-family='sans-serif' font-weight='600' font-size='12' letter-spacing='1' text-anchor='middle' opacity='0.9'>RETENÇÃO AUTOMÁTICA &amp; LINHA SECUNDÁRIA</text>

        <!-- Main Safety Line (Red) -->
        <line x1='300' y1='15' x2='300' y2='325' stroke='#ff003c' stroke-width='8' filter='url(#neonRedGlow)'/>

        <!-- Tandem Prusiks (Neon Lime) -->
        <rect x='280' y='110' width='40' height='24' rx='6' fill='#030509' stroke='#39ff14' stroke-width='3' filter='url(#neonLimeGlow)'/>
        <rect x='280' y='155' width='40' height='24' rx='6' fill='#030509' stroke='#39ff14' stroke-width='3' filter='url(#neonLimeGlow)'/>

        <!-- Load Releasing Hitch Box (Cyan) -->
        <rect x='140' y='125' width='90' height='50' rx='10' fill='#030509' stroke='#00f0ff' stroke-width='3' filter='url(#neonCyanGlow)'/>
        <text x='185' y='155' fill='#00f0ff' font-size='13' font-weight='bold' text-anchor='middle'>LRH</text>

        <line x1='230' y1='122' x2='280' y2='122' stroke='#39ff14' stroke-width='4' filter='url(#neonLimeGlow)'/>
        <line x1='230' y1='167' x2='280' y2='167' stroke='#39ff14' stroke-width='4' filter='url(#neonLimeGlow)'/>

        <rect x='160' y='292' width='280' height='30' rx='15' fill='#090d16' stroke='#00f0ff' stroke-width='1.5' filter='url(#neonCyanGlow)'/>
        <text x='300' y='312' fill='#00f0ff' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>TANDEM PRUSIK BELAY SEGURANÇA</text>
    </svg>'''
}

for filename, content in slate_svgs.items():
    path = os.path.join(img_dir, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Generated Dark Slate Board SVG:', path)
