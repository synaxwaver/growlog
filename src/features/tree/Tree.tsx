import { getGrowth, STAGE_LABELS } from './treeMath'

const GROUND = (
  <line x1="20" y1="170" x2="180" y2="170" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
)

function SeedPlant() {
  return <ellipse cx="100" cy="163" rx="10" ry="7" fill="#78350f" />
}

function SproutPlant() {
  return (
    <>
      <line x1="100" y1="170" x2="100" y2="132" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
      <path d="M100,142 Q78,132 88,113 Q106,124 100,142" fill="#4ade80" />
      <path d="M100,150 Q122,140 112,121 Q94,132 100,150" fill="#4ade80" />
    </>
  )
}

function SaplingPlant() {
  return (
    <>
      <rect x="96" y="110" width="8" height="60" rx="3" fill="#92400e" />
      <circle cx="100" cy="95" r="28" fill="#22c55e" />
    </>
  )
}

function YoungTreePlant() {
  return (
    <>
      <rect x="94" y="85" width="12" height="85" rx="4" fill="#78350f" />
      <circle cx="78" cy="78" r="30" fill="#16a34a" />
      <circle cx="122" cy="78" r="30" fill="#16a34a" />
      <circle cx="100" cy="56" r="30" fill="#22c55e" />
    </>
  )
}

function BlossomPlant() {
  const blossoms = [
    [70, 68],
    [92, 48],
    [112, 62],
    [130, 80],
    [88, 78],
    [108, 92],
    [72, 92],
  ]
  return (
    <>
      <rect x="94" y="85" width="12" height="85" rx="4" fill="#78350f" />
      <circle cx="78" cy="78" r="30" fill="#16a34a" />
      <circle cx="122" cy="78" r="30" fill="#16a34a" />
      <circle cx="100" cy="56" r="30" fill="#22c55e" />
      {blossoms.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#f9a8d4" />
      ))}
    </>
  )
}

const PLANTS = [SeedPlant, SproutPlant, SaplingPlant, YoungTreePlant, BlossomPlant]

type TreeProps = {
  elapsedSec: number
}

export default function Tree({ elapsedSec }: TreeProps) {
  const maxIndex = PLANTS.length - 1
  const growth = getGrowth(elapsedSec)
  const stageIndex = Math.min(Math.floor(growth), maxIndex)
  const nextIndex = Math.min(stageIndex + 1, maxIndex)
  const progress = stageIndex === maxIndex ? 0 : growth - stageIndex

  const CurrentPlant = PLANTS[stageIndex]
  const NextPlant = PLANTS[nextIndex]
  const scale = 0.85 + 0.3 * (growth / maxIndex)

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ transform: `scale(${scale})`, transition: 'transform 1s linear' }}>
        <svg viewBox="0 0 200 200" width="200" height="200">
          {GROUND}
          <g style={{ opacity: 1 - progress, transition: 'opacity 1s linear' }}>
            <CurrentPlant />
          </g>
          <g style={{ opacity: progress, transition: 'opacity 1s linear' }}>
            <NextPlant />
          </g>
        </svg>
      </div>
      <span className="text-sm text-neutral-400 dark:text-neutral-500">
        {STAGE_LABELS[stageIndex]}
      </span>
    </div>
  )
}
