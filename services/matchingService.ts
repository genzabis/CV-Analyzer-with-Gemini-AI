
import { Job, JobMatch } from "../types";
import { SEEDED_JOBS } from "../constants";

export const calculateMatchScores = (extractedSkills: string[]): JobMatch[] => {
  const normalizedExtracted = extractedSkills.map(s => s.toLowerCase().trim());
  
  return SEEDED_JOBS.map(job => {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    job.requiredSkills.forEach(skill => {
      const lowerSkill = skill.toLowerCase().trim();
      const isFound = normalizedExtracted.some(s => 
        s.includes(lowerSkill) || lowerSkill.includes(s)
      );

      if (isFound) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const score = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);

    return {
      jobId: job.id,
      jobTitle: job.title,
      score,
      matchedSkills,
      missingSkills
    };
  }).sort((a, b) => b.score - a.score);
};
