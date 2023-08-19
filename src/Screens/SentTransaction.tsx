import { useLocation } from "react-router-dom"

const SentTransaction = () => {
  const { state } = useLocation();
  const { tx } = state;

  return (
    <div>
      { JSON.stringify(tx)}
    </div>
  );
}

export default SentTransaction;