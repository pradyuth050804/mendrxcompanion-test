const fs = require('fs');

async function testAll() {
  try {
    // 1. Fetch all clients from backend or just test Sridhar
    const names = ["Sridhar", "Priya Sharma", "John Doe"]; 
    for (const name of names) {
      const response = await fetch(`http://localhost:8080/companion/my-plan?identifier=${encodeURIComponent(name)}`);
      if (!response.ok) {
        console.log(`[${name}] API returned ${response.status}`);
        continue;
      }
      
      const json = await response.json();
      const sndPlan = json.data;
      
      if (!sndPlan) {
        console.log(`[${name}] sndPlan is null`);
        continue;
      }
      
      const latestDietPlanVersion = sndPlan?.dietPlanVersions?.reduce((latest, current) => {
        if (!latest) return current;
        return (current.versionNumber > latest.versionNumber) ? current : latest;
      }, null);
      
      const dayPlan = latestDietPlanVersion?.dayPlans?.[0] || null;
      
      console.log(`[${name}] DietVersions: ${sndPlan?.dietPlanVersions?.length}, LatestVer: ${latestDietPlanVersion?.versionNumber}, DayPlanExists: ${!!dayPlan}, PreMorning: ${dayPlan?.preMorning ? 'YES' : 'NO'}`);
      
      const supplements = sndPlan?.supplements || [];
      console.log(`[${name}] Supplements Count: ${supplements.length}`);
    }
  } catch(e) {
    console.error(e);
  }
}
testAll();
