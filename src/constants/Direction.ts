export const DIRECTION_LABELS: Record<string, string> = {
    "Direction Générale": "Direction Générale",
    "Direction Générale Adjointe": "Direction Générale Adjointe",
    "Direction des Ressources Humaines": "Direction des Ressources Humaines",
    "Direction Administrative et Financière": "Direction Administrative et Financière",
    "Direction de la Production, Commercial et Marketing": "Direction de la Production, Commercial et Marketing",
}

export const DIRECTIONS = Object.keys(DIRECTION_LABELS)

export const getDirectionLabel = (direction?: string) =>
    direction ? DIRECTION_LABELS[direction] ?? direction : ""