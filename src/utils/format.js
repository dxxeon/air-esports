export function formatScore(game, score) {
  if (game === "사과게임") {
    return `${score}점`;
  }

  if (game === "눈빛보내기") {
    return `${Number(score).toFixed(1)}k`;
  }

  return score;
}