const fs = require('fs');
async function test() {
  try {
    const response = await fetch('http://localhost:8080/companion/my-plan?identifier=Sridhar');
    const json = await response.json();
    const sndPlan = json.data;
    
    console.log("versionCount:", sndPlan?.versionCount);
    console.log("dietPlanVersions length:", sndPlan?.dietPlanVersions?.length);
    
    const dayPlan = sndPlan?.dietPlanVersions?.[(sndPlan?.versionCount || 1) - 1]?.dayPlans?.[0] || null;
    console.log("dayPlan:", dayPlan ? "Exists" : "Null");
    
    if (dayPlan) {
      console.log("preMorning:", dayPlan.preMorning);
      const items = dayPlan.preMorning ? dayPlan.preMorning.split('\n') : [];
      console.log("parsed items:", items);
    }
  } catch(e) {
    console.error(e);
  }
}
test();
