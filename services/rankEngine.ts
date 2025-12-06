
import { Student, RankDefinition, UserRole } from '../types';
import { RANKS, RANK_ORDER } from '../constants';

// Helper to check if rank A is higher or equal to rank B
const isRankOrHigher = (currentId: string, targetId: string): boolean => {
    const currentIndex = RANK_ORDER.indexOf(currentId);
    const targetIndex = RANK_ORDER.indexOf(targetId);
    return currentIndex >= targetIndex && currentIndex !== -1 && targetIndex !== -1;
};

/**
 * Updates a single student's CC and checks for rank progression.
 * Returns the updated Student object.
 * @param student The student to update
 * @param ccAmount CC to add (can be 0 if just checking structure)
 * @param allStudents Full list of students (needed to check downline structure for leadership ranks)
 */
export const updateStudentRank = (student: Student, ccAmount: number, allStudents: Student[] = []): Student => {
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
    
    // Safety check if rank def exists
    if (!currentRankDef) return student;

    // Determine targets
    let targetCC = currentProgress.targetCC; 
    // If stored target is 0 or mismatch, try to sync from config (unless it's a structure rank with 0 CC target)
    if (targetCC === 0 && currentRankDef.targetCC > 0) {
        targetCC = currentRankDef.targetCC;
    }
    
    let nextRankId = currentRankDef.nextRankId;
    let nextRankDef = nextRankId ? RANKS[nextRankId] : null;
    
    let newRankId = currentProgress.currentRankId;
    let newTargetCC = targetCC;
    let cycleStart = currentProgress.cycleStartDate;
    let newRole = student.role;
    let history = [...currentProgress.history];

    // Check Promotion Condition
    if (nextRankDef) {
        let promoted = false;

        // Condition A: CC Based
        if (currentRankDef.targetCC > 0) {
            if (newCycleCC >= currentRankDef.targetCC) {
                promoted = true;
            }
        } 
        // Condition B: Structure Based (Manager Count)
        else if (currentRankDef.requiredManagersInDownline && currentRankDef.requiredManagersInDownline > 0) {
            // Count personally sponsored managers (Direct downlines who are MGR or above)
            // Note: We use allStudents passed in context
            const mySponsoredManagers = allStudents.filter(s => 
                s.sponsorId === student.handle && 
                s.rankProgress && 
                isRankOrHigher(s.rankProgress.currentRankId, 'MGR')
            ).length;

            if (mySponsoredManagers >= currentRankDef.requiredManagersInDownline) {
                promoted = true;
            }
        }

        if (promoted) {
            // 1. Archive current rank achievement
            history.push({
                rankId: newRankId,
                dateAchieved: new Date().toISOString(),
                totalCCAtTime: newLifetimeCC
            });

            // 2. Move to Next Rank
            newRankId = nextRankDef.id;
            
            // 3. Reset Cycle CC
            newCycleCC = 0; 
            
            // 4. Set New Target
            newTargetCC = nextRankDef.targetCC; // Might be 0 if next is also structure based
            
            // 5. Reset Timer
            cycleStart = new Date().toISOString();
            
            // 6. Update Role if applicable
            // Supervisor+ becomes SPONSOR role (if they weren't already)
            if (['AS_SUP', 'SUP'].includes(newRankId)) {
                if (student.role === UserRole.STUDENT) newRole = UserRole.SPONSOR;
            }
        }
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
