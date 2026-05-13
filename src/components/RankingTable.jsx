import { formatScore } from "../utils/format";

function RankingTable({ rankings }) {
  return (
    <div>
      {rankings.map((item, index) => (
        <div key={index}>
          <p>
            {index + 1}위 |
            {item.nickname} |
            {item.department} |
            {formatScore(
              item.game,
              item.score
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default RankingTable;