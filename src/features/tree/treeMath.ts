export const TOTAL_GROWTH_SEC = 2 * 60 * 60

export const STAGE_LABELS = ['Семя', 'Росток', 'Саженец', 'Молодое дерево', 'Цветение'] as const

/**
 * >1 = быстрый старт и медленное дозревание (первая стадия за пару минут,
 * дальше стадии всё дольше); 1 = линейный рост; <1 = медленный старт.
 */
export const GROWTH_CURVE = 3

/**
 * Непрерывное значение роста от 0 (семя) до STAGE_LABELS.length - 1 (цветение).
 * Целая часть — индекс текущей стадии, дробная — прогресс до следующей.
 */
export function getGrowth(
  elapsedSec: number,
  totalGrowthSec: number = TOTAL_GROWTH_SEC,
  curve: number = GROWTH_CURVE,
): number {
  const maxStageIndex = STAGE_LABELS.length - 1
  const t = Math.min(Math.max(elapsedSec, 0) / totalGrowthSec, 1)
  return maxStageIndex * Math.pow(t, 1 / curve)
}
