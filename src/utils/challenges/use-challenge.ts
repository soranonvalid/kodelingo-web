export const useChallenge = () => {
  const getDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "green";
      case "intermediate":
        return "orange";
      case "difficult":
        return "red";
      default:
        return "green";
    }
  };

  const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return { getDifficulty, formatDate };
};
