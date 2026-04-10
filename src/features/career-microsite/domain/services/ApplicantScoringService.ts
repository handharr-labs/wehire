import { type ApplicationPayload } from '@/shared/domain/entities/ApplicationPayload';
import { type Job } from '@/shared/domain/entities/Job';

export interface ScoringInput {
  readonly payload: ApplicationPayload;
  readonly job: Job;
  readonly scoringEnabled: boolean;
}

export interface ApplicantScoringService {
  score(input: ScoringInput): number | null;
}

interface ScoringRule {
  readonly maxPoints: number;
  evaluate(input: ScoringInput): number | null;
}

const SALARY_RULE: ScoringRule = {
  maxPoints: 40,
  evaluate({ payload, job }): number | null {
    if (job.minSalary === 0 && job.maxSalary === 0) return null;
    return payload.expectedSalary >= job.minSalary && payload.expectedSalary <= job.maxSalary
      ? 40
      : 0;
  },
};

const DOMICILE_RULE: ScoringRule = {
  maxPoints: 30,
  evaluate({ payload, job }): number | null {
    if (!job.targetCity) return null;
    const cities = job.targetCity
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
    if (cities.length === 0) return null;
    return cities.includes(payload.city.trim().toLowerCase()) ? 30 : 0;
  },
};

const LINKEDIN_RULE: ScoringRule = {
  maxPoints: 15,
  evaluate({ payload }): number | null {
    return payload.linkedinUrl ? 15 : 0;
  },
};

const PORTFOLIO_RULE: ScoringRule = {
  maxPoints: 15,
  evaluate({ payload }): number | null {
    return payload.portfolioUrl ? 15 : 0;
  },
};

const ALL_RULES: readonly ScoringRule[] = [
  SALARY_RULE,
  DOMICILE_RULE,
  LINKEDIN_RULE,
  PORTFOLIO_RULE,
];

export class ApplicantScoringServiceImpl implements ApplicantScoringService {
  score(input: ScoringInput): number | null {
    console.log('[ApplicantScoring] scoringEnabled:', input.scoringEnabled);
    if (!input.scoringEnabled) return null;

    console.log('[ApplicantScoring] inputs:', {
      expectedSalary: input.payload.expectedSalary,
      city: input.payload.city,
      linkedinUrl: input.payload.linkedinUrl ?? null,
      portfolioUrl: input.payload.portfolioUrl ?? null,
      jobMinSalary: input.job.minSalary,
      jobMaxSalary: input.job.maxSalary,
      jobTargetCity: input.job.targetCity ?? null,
    });

    const RULE_NAMES = ['salary', 'domicile', 'linkedin', 'portfolio'] as const;
    let earnedPoints = 0;
    let applicableMaxPoints = 0;
    const ruleResults: Record<string, number | null> = {};

    ALL_RULES.forEach((rule, i) => {
      const result = rule.evaluate(input);
      ruleResults[RULE_NAMES[i]] = result;
      if (result === null) return;
      earnedPoints += result;
      applicableMaxPoints += rule.maxPoints;
    });

    console.log('[ApplicantScoring] rule results:', ruleResults);

    const finalScore = applicableMaxPoints === 0 ? 0 : Math.round((earnedPoints / applicableMaxPoints) * 100);
    console.log('[ApplicantScoring] final score:', finalScore, `(${earnedPoints}/${applicableMaxPoints} applicable pts)`);

    return finalScore;
  }
}
