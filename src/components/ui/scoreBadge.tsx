const ScoreBadge = (score: number) => {
  return (
    <div className="bg-black/5 w-min flex gap-2 items-center text-sm rounded-full px-3 py-1">
      {null}
      <p>
        <span className="font-bold">#</span>
        {score}
      </p>
    </div>
  );
};

export default ScoreBadge;
