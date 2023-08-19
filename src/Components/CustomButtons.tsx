export const SolidButton = ({ onClick, label }: {
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  label: string
}) => {
  return (
    <button
      className="bg-blue-700 hover:bg-blue-900 font-semibold px-5 py-2 rounded-[1.3em] text-white"
      type="submit"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export const OutlinedButton = ({ onClick, label }: {
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  label: string
}) => {
  return (
    <button
      className="border border-blue-700 hover:border-blue-900 font-semibold px-5 py-2 rounded-[1.3em] text-blue-700"
      type="submit"
      onClick={onClick}
    >
      {label}
    </button>
  );
}