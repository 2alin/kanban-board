import "./counterBadge.css";

interface CounterBadgeProps {
  amount: number;
}
export default function CounterBadge({ amount }: CounterBadgeProps) {
  const maxAmountToDisplay = 99;
  let textToDisplay: string;

  if (amount <= 0) {
    // let's render the badge even if there's no amount
    // to avoid space tittle jumps when badge amount changes
    textToDisplay = "";
  } else {
    textToDisplay =
      amount > maxAmountToDisplay
        ? `${maxAmountToDisplay}+`
        : amount.toString();
  }

  return (
    <span className={`badge ${amount <= 0 && "empty"}`}>{textToDisplay}</span>
  );
}
