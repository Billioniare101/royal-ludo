export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function canRollDice(diceRolled: boolean): boolean {
  return !diceRolled;
}
