const calculateMatchScore = (userSkills, jobRequirements) => {
    let score = 0;
  
    const skills = userSkills.toLowerCase().split(",");
    const requirements = jobRequirements.toLowerCase();
  
    skills.forEach(skill => {
      if (requirements.includes(skill.trim())) {
        score += 10;
      }
    });
  
    return Math.min(score, 100);
  };
  
  module.exports = {
    calculateMatchScore
  };