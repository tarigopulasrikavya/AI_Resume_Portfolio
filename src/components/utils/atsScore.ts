export const calculateATSScore = (data: any) => {
  let score = 0;

  if (data.fullName?.length > 0) score += 10;
  if (data.email?.length > 0) score += 10;
  if (data.phone?.length > 0) score += 10;
  if (data.summary?.length > 50) score += 20;
  if (data.skills?.length >= 3) score += 20;
  if (data.experience?.length > 0) score += 20;
  if (data.projects?.length > 0) score += 10;

  return score;
};