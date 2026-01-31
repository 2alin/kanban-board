import "./counterBadge.css";

interface CounterBadgeProps {
  amount: number;
}
export default function CounterBadge({ amount }: CounterBadgeProps) {
  if (amount <= 0) {
    return;
  }

  const textToDisplay = amount > 99 ? "99+" : amount.toString();

  return <span className="badge">{textToDisplay}</span>;
}
