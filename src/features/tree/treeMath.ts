export const TOTAL_GROWTH_SEC = 2 * 60 * 60

export const STAGE_LABELS = ['Семя', 'Росток', 'Саженец', 'Молодое дерево', 'Цветение'] as const

export function getStageIndex(elapsedSec: number, totalGrowthSec: number = TOTAL_GROWTH_SEC): number {
  const stageSec = totalGrowthSec / STAGE_LABELS.length
  const index = Math.floor(elapsedSec / stageSec)
  return Math.min(index, STAGE_LABELS.length - 1)
}
