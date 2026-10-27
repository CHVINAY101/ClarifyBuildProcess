import type { CSSProperties } from "react"

type Phase = "opening" | "arrival" | "seed" | "root" | "orbital" | "bloom" | "archive"

const contours = [
  "M610 790 C740 660 845 770 960 680 S1200 590 1470 710",
  "M620 816 C770 690 845 792 978 710 S1230 625 1480 740",
  "M640 842 C790 730 860 830 1000 745 S1230 670 1490 778",
  "M670 875 C810 770 875 865 1020 780 S1270 705 1510 815",
]
const roots = [
  "M0 880 C100 815 175 845 280 765 L340 700 M150 832 L170 775 L230 750 M280 765 L295 825 L370 865",
  "M0 910 C135 850 200 875 305 795 L375 750 M210 855 L245 915 L310 935",
  "M1440 875 C1320 790 1280 830 1160 755 L1100 690 M1300 814 L1270 755 L1210 730 M1160 755 L1140 825 L1060 860",
  "M1440 920 C1315 850 1255 890 1140 800 L1070 750 M1240 860 L1200 920 L1140 945",
]

export default function Atmosphere({
  phase,
  centered = false,
}: {
  phase: Phase
  centered?: boolean
}) {
  return (
    <div
      className="floran-environment absolute inset-0"
      data-atmosphere={phase}
      data-centered={centered}
      aria-hidden="true"
    >
      <div className="floran-environment-layer floran-mars-field">
        <svg
          className="floran-terrain"
          viewBox="0 0 1440 960"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {contours.map((path) => (
            <path key={path} d={path} />
          ))}
        </svg>
      </div>
      <div className="floran-environment-layer floran-seed-field">
        <svg
          className="floran-vascular"
          viewBox="0 0 1440 960"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path d="M1060 770 C1040 660 1100 560 1040 450 S1030 270 1090 170 M1055 670 C970 640 960 600 935 545 M1065 560 C1140 535 1160 480 1190 435 M1035 410 C980 375 965 320 950 290 M1045 310 C1110 290 1150 240 1165 210" />
        </svg>
      </div>
      <div className="floran-environment-layer floran-root-field">
        <svg
          className="floran-roots"
          viewBox="0 0 1440 960"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {roots.map((path) => (
            <path key={path} d={path} />
          ))}
        </svg>
      </div>
      <div className="floran-environment-layer floran-orbital-field" />
      <div className="floran-environment-layer floran-bloom-field" />
      <div className="floran-environment-particles">
        {Array.from({ length: 16 }, (_, index) => (
          <span
            key={index}
            className="floran-dust-mote"
            style={
              {
                left: `${12 + ((index * 37) % 78)}%`,
                top: `${18 + ((index * 23) % 72)}%`,
                "--mote-delay": `${-index * 2.7}s`,
                "--mote-duration": `${24 + (index % 5) * 4}s`,
                "--mote-size": `${index % 4 === 0 ? 2 : 1}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
