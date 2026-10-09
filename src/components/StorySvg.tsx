/* Generated from the approved static design. Edit freely. */
import type { Dict } from '@/lib/dictionaries/de';

export function StorySvg({ d }: { d: Dict['process'] }) {
  return (
<svg id="storySvg" viewBox="0 0 800 500" role="img" aria-label={d.svg}>
            <defs>
              <filter id="glow2" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6"/></filter>
              <clipPath id="coatClip"><rect x="170" y="100" width="0" height="260" data-fx="grow" data-w="470" data-r=".58,.85" data-scene="4"/></clipPath>
            </defs>

            {/* 1 Zeichnung oder Daten */}
            <g className="scene on" id="sc1">
              <rect x="160" y="30" width="480" height="380" rx="4" fill="#E8EFF5" data-fx="fade" data-r="0,.1"/>
              <g id="s1part"></g>
              <g data-fx="fade" data-r=".55,.72" stroke="#4F6376" strokeWidth="1.5" fill="none"><path d="M200 392H596M200 384V400M596 384V400M628 62V368M620 62H636M620 368H636"/></g>
              <g data-fx="fade" data-r=".55,.72" fill="#26405C" fontSize="20" fontWeight="700" textAnchor="middle"><text x="398" y="384">440</text><text transform="translate(618 215) rotate(-90)">340</text></g>
              <g data-fx="slide" data-d="160,0" data-r=".72,.95">
                <rect x="420" y="424" width="300" height="60" rx="6" fill="#3AA9F0"/>
                <path d="M440 438h20l10 10v22h-30z" fill="#06182B"/>
                <text x="486" y="464" fontSize="27" fontWeight="800" fill="#06182B">bauteil.dxf</text>
              </g>
            </g>

            {/* 2 CAD/CAM */}
            <g className="scene" id="sc2">
              <rect x="40" y="30" width="720" height="440" rx="10" fill="#08131F" stroke="#2B4A6C" strokeWidth="2"/>
              <rect x="56" y="46" width="688" height="408" fill="#0F2033"/>
              <rect x="72" y="70" width="420" height="210" fill="#1F3D5C" stroke="#3B5E84"/>
              <g id="nest2"></g>
              <text x="282" y="310" fontSize="22" fontWeight="600" fill="#A9BDD0" textAnchor="middle" data-fx="fade" data-r=".24,.4">{d.scene.nesting}</text>
              <g fontSize="26" fontWeight="700" fill="#EAF2F9">
                <g data-fx="fade" data-r=".03,.12"><rect x="524" y="86" width="30" height="30" rx="4" fill="none" stroke="#4F6F92" strokeWidth="2"/><text x="568" y="110">{d.scene.flatPattern}</text></g>
                <path d="M530 101l8 9l13-16" fill="none" stroke="#3DBE7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" data-fx="dash" data-r=".16,.24"/>
                <g data-fx="fade" data-r=".24,.34"><rect x="524" y="146" width="30" height="30" rx="4" fill="none" stroke="#4F6F92" strokeWidth="2"/><text x="568" y="170">{d.scene.nestingItem}</text></g>
                <path d="M530 161l8 9l13-16" fill="none" stroke="#3DBE7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" data-fx="dash" data-r=".64,.72"/>
                <g data-fx="fade" data-r=".72,.8"><rect x="524" y="206" width="30" height="30" rx="4" fill="none" stroke="#4F6F92" strokeWidth="2"/><text x="568" y="230">{d.scene.nc}</text></g>
                <path d="M530 221l8 9l13-16" fill="none" stroke="#3DBE7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" data-fx="dash" data-r=".9,.97"/>
              </g>
              <g fontFamily="ui-monospace,Menlo,Consolas,monospace" fontSize="20" fill="#8FA9C2">
                <text x="72" y="346" data-fx="fade" data-r=".74,.79">N10 G90 G71</text>
                <text x="72" y="374" data-fx="fade" data-r=".78,.83">N20 G00 X84.0 Y86.0</text>
                <text x="72" y="402" data-fx="fade" data-r=".82,.87">N30 M03</text>
                <text x="72" y="430" data-fx="fade" data-r=".86,.91">N40 G01 X140.0 Y86.0</text>
              </g>
            </g>

            {/* 3 Zuschneiden */}
            <g className="scene" id="sc3">
              <rect x="40" y="60" width="720" height="380" rx="4" fill="#183553" stroke="#2B4A6C" strokeWidth="2"/>
              <g id="nest3"></g>
              <g id="laserG" opacity="0">
                <g id="sparks" stroke="#3AA9F0" strokeWidth="2.5" strokeLinecap="round"><line x1="0" y1="0" x2="0" y2="0"/><line x1="0" y1="0" x2="0" y2="0"/><line x1="0" y1="0" x2="0" y2="0"/><line x1="0" y1="0" x2="0" y2="0"/><line x1="0" y1="0" x2="0" y2="0"/><line x1="0" y1="0" x2="0" y2="0"/></g>
                <path d="M-12 -46L12 -46L5 -8H-5Z" fill="#8FA9C2"/>
                <circle r="16" fill="#3AA9F0" filter="url(#glow2)"/>
                <circle r="5" fill="#E6F5FF"/>
              </g>
            </g>

            {/* 4 Abkanten */}
            <g className="scene" id="sc4">
              <path d="M250 300H340L400 380L460 300H550V430H250Z" fill="#1F3D5C" stroke="#3B5E84" strokeWidth="2" strokeLinejoin="round"/>
              <rect id="ram" x="340" y="-200" width="120" height="130" fill="#2B4A6C"/>
              <polygon id="punch" fill="#8FA9C2" points="0,0"/>
              <polyline id="sheet4" fill="none" stroke="#DDE7F0" strokeWidth="10" strokeLinejoin="round" points="250,300 400,300 550,300"/>
              <circle id="bend4" cx="400" cy="300" r="7" fill="#3AA9F0"/>
              <text id="angTxt" x="730" y="112" fontSize="60" fontWeight="800" textAnchor="end" fill="#EAF2F9">180°</text>
              <text x="730" y="144" fontSize="22" fontWeight="600" textAnchor="end" fill="#A9BDD0">{d.scene.bendAngle}</text>
              <text x="60" y="470" fontSize="22" fontWeight="600" fill="#A9BDD0">{d.scene.press}</text>
            </g>

            {/* 5 Fügen, Beschichten, Liefern */}
            <g className="scene" id="sc5">
              <g fontSize="30" fontWeight="800" fill="#EAF2F9" textAnchor="middle">
                <text x="400" y="72" data-fx="fade" data-r=".03,.08,.28,.32">{d.scene.assembling}</text>
                <text x="400" y="72" data-fx="fade" data-r=".33,.38,.55,.6">{d.scene.welding}</text>
                <text x="400" y="72" data-fx="fade" data-r=".6,.65,.84,.88">{d.scene.coating}</text>
              </g>
              <rect x="180" y="300" width="440" height="36" rx="2" fill="#B7C6D4" stroke="#8FA9C2" strokeWidth="2"/>
              <g data-fx="slide" data-d="0,-110" data-r=".02,.3">
                <rect x="380" y="120" width="40" height="180" fill="#B7C6D4" stroke="#8FA9C2" strokeWidth="2"/>
              </g>
              <g data-fx="fade" data-r=".32,.4,.55,.65" fill="#3AA9F0"><polygon points="380,300 358,300 380,278"/><polygon points="420,300 442,300 420,278"/></g>
              <g data-fx="fade" data-r=".5,.6" fill="#8FA9C2"><polygon points="380,300 358,300 380,278"/><polygon points="420,300 442,300 420,278"/></g>
              <g id="weldSparks" opacity="0" stroke="#8AD0FF" strokeWidth="2.5" strokeLinecap="round">
                <g transform="translate(372 294)"><line/><line/><line/><line/><line/></g>
                <g transform="translate(428 294)"><line/><line/><line/><line/><line/></g>
              </g>
              <g clipPath="url(#coatClip)">
                <rect x="180" y="300" width="440" height="36" rx="2" fill="#3AA9F0" stroke="#1E7FC0" strokeWidth="2"/>
                <rect x="380" y="120" width="40" height="180" fill="#3AA9F0" stroke="#1E7FC0" strokeWidth="2"/>
                <g fill="#3AA9F0"><polygon points="380,300 358,300 380,278"/><polygon points="420,300 442,300 420,278"/></g>
              </g>
              <circle cx="400" cy="402" r="34" fill="none" stroke="#3DBE7A" strokeWidth="4" pathLength="1" data-fx="dash" data-r=".86,.94"/>
              <path d="M384 402l12 12l22-24" fill="none" stroke="#3DBE7A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" data-fx="dash" data-r=".92,1"/>
              <text x="400" y="476" fontSize="26" fontWeight="800" fill="#EAF2F9" textAnchor="middle" data-fx="fade" data-r=".9,1">{d.scene.ready}</text>
            </g>
          </svg>
  );
}
