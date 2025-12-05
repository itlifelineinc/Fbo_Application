
import { Student, RankDefinition, UserRole } from '../types';
import { RANKS } from '../constants';

/**
 * Updates a single student's CC and checks for rank progression.
 * Returns the updated Student object.
 */
export const updateStudentRank = (student: Student, ccAmount: number): Student => {
    // 1. Initialize rankProgress if missing (backward compatibility)
    const currentProgress = student.rankProgress || {
        currentRankId: 'NOVUS',
        currentCycleCC: 0,
        targetCC: 2, // Default Novus target
        cycleStartDate: new Date().toISOString(),
        history: []
    };

    // 2. Add CC to Lifetime Total (Always keeps growing)
    const newLifetimeCC = (student.caseCredits || 0) + ccAmount;

    // 3. Add CC to Current Cycle (Resets on promotion)
    let newCycleCC = currentProgress.currentCycleCC + ccAmount;
    
    // 4. Check Rank Progression Logic
    const currentRankDef = RANKS[currentProgress.currentRankId];
    // Safety check if rank def exists, otherwise fallback to Novus config
    const targetCC = currentProgress.targetCC > 0 ? currentProgress.targetCC : (currentRankDef?.targetCC || 2);
    
    let nextRankId = currentRankDef?.nextRankId;
    let nextRankDef = nextRankId ? RANKS[nextRankId] : null;
    
    let newRankId = currentProgress.currentRankId;
    let newTargetCC = targetCC;
    let cycleStart = currentProgress.cycleStartDate;
    let newRole = student.role;
    let history = [...currentProgress.history];

    // Check Promotion Condition
    if (nextRankDef && newCycleCC >= targetCC) {
        // PROMOTION EVENT!
        
        // 1. Archive current rank achievement
        history.push({
            rankId: newRankId,
            dateAchieved: new Date().toISOString(),
            totalCCAtTime: newLifetimeCC
        });

        // 2. Move to Next Rank
        newRankId = nextRankDef.id;
        
        // 3. RESET Cycle CC (The requested feature: "Reset Team CC for Next Rank")
        // We do NOT carry over overflow for the new cycle start unless specifically requested. 
        // Strict reset means they start from 0 for the next challenge.
        newCycleCC = 0; 
        
        // 4. Set New Target
        newTargetCC = nextRankDef.targetCC;
        
        // 5. Reset Timer
        cycleStart = new Date().toISOString();
        
        // 6. Update Role if applicable
        if (newRankId === 'AS_SUP' || newRankId === 'SUP') newRole = UserRole.SPONSOR;
        // Logic for further role updates can go here
    }

    return {
        ...student,
        caseCredits: newLifetimeCC, // Historical Record kept here
        role: newRole,
        rankProgress: {
            currentRankId: newRankId,
            currentCycleCC: newCycleCC,
            targetCC: newTargetCC,
            cycleStartDate: cycleStart,
            history: history
        }
    };
};
