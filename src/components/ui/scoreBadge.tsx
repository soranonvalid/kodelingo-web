import React from "react";

const ScoreBadge = () => {
  return (
    <div className="bg-black/5 w-min flex gap-2 items-center text-sm rounded-full px-3 py-1">
      {getStatusBadge(rank)}
      <p>
        <span className="font-bold">#</span>
        {rank}
      </p>
    </div>
  );
};

export default ScoreBadge;
