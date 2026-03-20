import type { AnalysisResult } from './types'

const demoResponses: { keywords: string[]; response: AnalysisResult }[] = [
  {
    keywords: ['gcash', 'verify', 'flagged', 'account', 'suspended', 'maya', 'bpi', 'bdo', 'otp'],
    response: {
      verdict: 'scam',
      confidence: 95,
      category: 'phishing',
      explanation: 'Mag-ingat! Ito ay phishing scam. Ang message na ito ay nagpapanggap na GCash o bangko, pero peke ang URL at hinihingi ang OTP mo. Hindi kailanman hihingi ang totoong GCash ng OTP mo sa text o chat.',
      redFlags: ['fake URL', 'requests OTP', 'impersonates financial institution', 'urgency tactics'],
      educationCard: {
        title: 'URL Analysis',
        content: 'Ginamit ng AI ang URL Analysis para i-check ang link. Tinitignan niya kung ang website address ay legitimate o peke — kasi madalas gumagawa ang scammers ng mga URL na halos kapareho ng totoo pero may konting pagkakaiba.',
      },
    },
  },
  {
    keywords: ['dswd', 'ayuda', 'beneficiary', 'sss', 'philhealth', 'bir', 'government', 'gobyerno', 'claim'],
    response: {
      verdict: 'scam',
      confidence: 92,
      category: 'government_impersonation',
      explanation: 'Scam ito! Nagpapanggap na government agency. Hindi magse-send ang DSWD, SSS, o PhilHealth ng text o chat message na may link para mag-claim ng ayuda. Pumunta ka directly sa official website o office nila.',
      redFlags: ['government impersonation', 'suspicious link', 'unsolicited benefit claim', 'urgency'],
      educationCard: {
        title: 'Pattern Recognition',
        content: 'Ginamit ng AI ang Pattern Recognition para ma-detect ito. Tinitignan niya ang mga paulit-ulit na pattern na ginagamit ng scammers — tulad ng pagpapanggap na gobyerno at paghingi ng personal info. Parang memorized na niya ang mga tricks ng scammers!',
      },
    },
  },
  {
    keywords: ['hiring', 'work from home', 'earn', 'no experience', 'apply now', 'income', 'p5,000', 'p2,000', 'per day'],
    response: {
      verdict: 'scam',
      confidence: 88,
      category: 'job_scam',
      explanation: 'Mukhang job scam ito. Nag-aalok ng unrealistic na sweldo na walang experience needed — classic red flag. Ang legitimate na employer ay may proper hiring process at hindi hihingi ng bayad o personal info sa text.',
      redFlags: ['unrealistic salary', 'no experience required', 'unsolicited job offer', 'requests personal info'],
      educationCard: {
        title: 'Natural Language Processing',
        content: 'Ginamit ng AI ang Natural Language Processing (NLP) para ma-analyze ang message. Naiintindihan ng NLP ang meaning at intention ng mga salita — kaya nakikita niya kung may nanlilinlang o nagmamanipula sa text.',
      },
    },
  },
  {
    keywords: ['congratulations', 'winner', 'won', 'prize', 'nanalo', 'premyo', 'lucky', 'reward', 'lottery', 'raffle'],
    response: {
      verdict: 'scam',
      confidence: 94,
      category: 'lottery_prize',
      explanation: 'Scam ito! Walang legitimate na promo o raffle na hihingi ng GCash number, OTP, o personal info para mag-claim. Kung hindi ka sumali sa contest, hindi ka mananalo — ganoon kasimple.',
      redFlags: ['unsolicited prize', 'requests financial info', 'too good to be true', 'no prior contest entry'],
      educationCard: {
        title: 'Sentiment Analysis',
        content: 'Ginamit ng AI ang Sentiment Analysis para ma-detect ang emotional manipulation. Nakikita niya kung ang message ay gumagamit ng excitement at greed para ma-pressure ka — classic scammer technique!',
      },
    },
  },
]

const safeResponse: AnalysisResult = {
  verdict: 'safe',
  confidence: 85,
  category: 'unknown',
  explanation: 'Mukhang safe naman ito! Wala kaming nakitang scam patterns sa message na ito. Pero mag-ingat pa rin — kapag may hinihingi na personal info o pera, i-verify muna.',
  redFlags: [],
  educationCard: {
    title: 'Natural Language Processing',
    content: 'Ginamit ng AI ang Natural Language Processing para i-analyze ang buong message. Tiningnan niya ang mga salita, tone, at intent — at walang nakitang manipulation o deception patterns. Ganito nag-iisip ang AI!',
  },
}

export function getDemoResponse(message: string): AnalysisResult {
  const lower = message.toLowerCase()
  for (const entry of demoResponses) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response
    }
  }
  return safeResponse
}

export function getDemoImageResponse(): AnalysisResult {
  return {
    verdict: 'scam',
    confidence: 91,
    category: 'phishing',
    explanation: 'Na-detect ng AI ang text sa screenshot mo. Mukhang phishing scam ito — may pekeng link at hinihingi ang personal info mo. Huwag i-click ang kahit anong link sa message na ito.',
    redFlags: ['extracted text from image', 'suspicious URL detected', 'requests personal information'],
    educationCard: {
      title: 'Computer Vision + NLP',
      content: 'Ginamit ng AI ang Computer Vision para basahin ang text sa screenshot mo, tapos NLP para i-analyze kung scam. Kaya kahit screenshot lang ang ipasa mo, kaya pa rin ng AI na suriin!',
    },
  }
}
