export type Verdict = 'scam' | 'suspicious' | 'safe'

export type ScamCategory =
  | 'phishing'
  | 'smishing'
  | 'job_scam'
  | 'investment_scam'
  | 'romance_scam'
  | 'government_impersonation'
  | 'lottery_prize'
  | 'unknown'

export interface AnalysisResult {
  verdict: Verdict
  confidence: number
  category: ScamCategory
  explanation: string
  redFlags: string[]
  educationCard: {
    title: string
    content: string
  }
}
