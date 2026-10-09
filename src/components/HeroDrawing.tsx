/* Generated from the approved static design. Edit freely. */
export function HeroDrawing({ label, bendLine }: { label: string; bendLine: string }) {
  return (
<svg className="drawing" viewBox="0 0 580 470" role="img" aria-label={label}>
        <defs><filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5"/></filter></defs>
        <path className="d-plate" fill="#1F3D5C" fillRule="evenodd" d="M60 60H400L500 160V360Q500 400 460 400H100Q60 400 60 360Z M108 130a22 22 0 1 0 44 0a22 22 0 1 0-44 0Z M108 330a22 22 0 1 0 44 0a22 22 0 1 0-44 0Z M252 190H368a22 22 0 0 1 0 44H252a22 22 0 0 1 0-44Z M424 300a16 16 0 1 0 32 0a16 16 0 1 0-32 0Z"/>
        <path className="d-dim" d="M40 258H520" stroke="#8FA9C2" strokeWidth="1.2" strokeDasharray="14 5 3 5" fill="none"/>
        <path id="outline" className="d-outline" pathLength="1" fill="none" stroke="#3AA9F0" strokeWidth="2.5" strokeLinejoin="round" d="M60 60H400L500 160V360Q500 400 460 400H100Q60 400 60 360Z"/>
        <circle className="d-hole h1" pathLength="1" cx="130" cy="130" r="22" fill="none" stroke="#3AA9F0" strokeWidth="2.5"/>
        <circle className="d-hole h2" pathLength="1" cx="130" cy="330" r="22" fill="none" stroke="#3AA9F0" strokeWidth="2.5"/>
        <path className="d-hole h3" pathLength="1" fill="none" stroke="#3AA9F0" strokeWidth="2.5" d="M252 190H368a22 22 0 0 1 0 44H252a22 22 0 0 1 0-44Z"/>
        <circle className="d-hole h4" pathLength="1" cx="440" cy="300" r="16" fill="none" stroke="#3AA9F0" strokeWidth="2.5"/>
        <g className="laser" opacity="0">
          <set attributeName="opacity" to="1" begin="0.5s" fill="freeze"/><set attributeName="opacity" to="0" begin="3.7s" fill="freeze"/>
          <circle r="11" fill="#3AA9F0" filter="url(#glow)"/><circle r="4" fill="#E6F5FF"/>
          <animateMotion dur="3.2s" begin="0.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".5 0 .2 1"><mpath href="#outline"/></animateMotion>
        </g>
        <g className="d-dim" stroke="#8FA9C2" strokeWidth="1.2" fill="none"><path d="M60 436H500M60 428V444M500 428V444"/><path d="M540 60V400M532 60H548M532 400H548"/></g>
        <g className="d-dim" fill="#B4C6D8" fontFamily="Archivo,system-ui,sans-serif" fontSize="15" fontWeight="600" textAnchor="middle">
          <text x="280" y="426">440</text><text transform="translate(528 230) rotate(-90)">340</text><text x="180" y="124" textAnchor="start">Ø 44</text><text x="70" y="250" textAnchor="start" fontSize="13">{bendLine}</text>
        </g>
      </svg>
  );
}
