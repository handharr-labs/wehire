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
    if (!input.scoringEnabled) return null;

    let earnedPoints = 0;
    let applicableMaxPoints = 0;

    for (const rule of ALL_RULES) {
      const result = rule.evaluate(input);
      if (result === null) continue;
      earnedPoints += result;
      applicableMaxPoints += rule.maxPoints;
    }

    if (applicableMaxPoints === 0) return 0;

    return Math.round((earnedPoints / applicableMaxPoints) * 100);
  }
}
