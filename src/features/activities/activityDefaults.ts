const EMOJIS = ['🌱', '📚', '💻', '🎨', '🏃', '🧘', '🎸', '✍️', '🔬', '🌍']
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function pickForName<T>(name: string, options: T[]): T {
  return options[hashString(name) % options.length]
}

export function getActivityDefaults(name: string): { emoji: string; color: string } {
  return { emoji: pickForName(name, EMOJIS), color: pickForName(name, COLORS) }
}
