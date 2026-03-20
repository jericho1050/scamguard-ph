import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import type { AnalysisResult } from './types'
import { getDemoResponse, getDemoImageResponse } from './demo-responses'

const SYSTEM_PROMPT = `You are ScamGuard PH, an AI scam detection assistant for Filipino communities. Analyze the given message and determine if it is a scam.

CONTEXT: You analyze messages that Filipino people receive via SMS, social media, email, or messaging apps. Many scams in the Philippines target GCash, Maya, bank accounts (BPI, BDO, Metrobank), and impersonate government agencies (DSWD, SSS, PhilHealth, BIR).

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks, raw JSON only):
{
  "verdict": "scam" | "suspicious" | "safe",
  "confidence": <number 0-100>,
  "category": "phishing" | "smishing" | "job_scam" | "investment_scam" | "romance_scam" | "government_impersonation" | "lottery_prize" | "unknown",
  "explanation": "<2-3 sentence explanation in Taglish (mix of Tagalog and English) explaining WHY this is/isn't a scam. Use casual, friendly tone.>",
  "redFlags": ["<list of specific red flags found>"],
  "aiTechnique": "<which AI technique was used: 'Pattern Recognition', 'Natural Language Processing', 'Sentiment Analysis', or 'URL Analysis'>"
}

EXAMPLES:

Message: "GCash: Your account has been flagged. Verify now: https://gcash-verify.ph.com"
{"verdict":"scam","confidence":95,"category":"phishing","explanation":"Mag-ingat! Ito ay phishing scam. Ang URL na 'gcash-verify.ph.com' ay hindi official website ng GCash. Hindi magse-send ang GCash ng ganitong link sa text.","redFlags":["fake_url","impersonation_gcash","urgency"],"aiTechnique":"URL Analysis"}

Message: "Hi po, anong oras tayo magkikita bukas?"
{"verdict":"safe","confidence":95,"category":"unknown","explanation":"Mukhang safe naman ito! Walang nakitang scam patterns. Isa lang itong simpleng tanong.","redFlags":[],"aiTechnique":"Natural Language Processing"}`

const AI_EDUCATION_CARDS: Record<string, string> = {
  'Pattern Recognition': 'Ginamit ng AI ang Pattern Recognition para ma-detect ito. Tinitignan niya ang mga paulit-ulit na pattern na ginagamit ng scammers — tulad ng paghingi ng OTP, pekeng urgency, at mga suspicious na links.',
  'Natural Language Processing': 'Ginamit ng AI ang Natural Language Processing (NLP) para ma-analyze ang message. Naiintindihan ng NLP ang meaning at intention ng mga salita — kaya nakikita niya kung may nanlilinlang o nagmamanipula sa text.',
  'URL Analysis': 'Ginamit ng AI ang URL Analysis para i-check ang link. Tinitignan niya kung ang website address ay legitimate o peke — kasi madalas gumagawa ang scammers ng mga URL na halos kapareho ng totoo pero may konting pagkakaiba.',
  'Sentiment Analysis': 'Ginamit ng AI ang Sentiment Analysis para ma-detect ang emotional manipulation. Nakikita niya kung ang message ay gumagamit ng takot, urgency, o excitement para ma-pressure ka — classic scammer technique!',
}

export async function analyzeMessage(message: string, imageBase64?: string): Promise<AnalysisResult> {
  // If no AWS config, use demo responses
  const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
  if (!region) {
    return imageBase64 ? getDemoImageResponse() : getDemoResponse(message)
  }

  try {
    const client = new BedrockRuntimeClient({ region })

    // Build content array for multimodal support
    let content: unknown
    if (imageBase64) {
      // Extract base64 data and media type from data URL
      const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/)
      const mediaType = matches?.[1] || 'image/png'
      const base64Data = matches?.[2] || imageBase64

      content = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data,
          },
        },
        {
          type: 'text',
          text: message
            ? `Analyze this screenshot of a message for scams. Extract the text from the image first, then analyze it.\n\nAdditional context from user: "${message}"`
            : 'Analyze this screenshot of a message for scams. Extract the text from the image first, then analyze it.',
        },
      ]
    } else {
      content = `Analyze this message for scams:\n\n"${message}"`
    }

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 512,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    }

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-opus-4-6-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    })

    const response = await client.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    let text = responseBody.content[0].text
    // Strip markdown code blocks if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(text)

    return {
      verdict: parsed.verdict,
      confidence: parsed.confidence,
      category: parsed.category,
      explanation: parsed.explanation,
      redFlags: parsed.redFlags || [],
      educationCard: {
        title: parsed.aiTechnique || 'AI Analysis',
        content: AI_EDUCATION_CARDS[parsed.aiTechnique] || AI_EDUCATION_CARDS['Pattern Recognition'],
      },
    }
  } catch (error: unknown) {
    const err = error as Error & { name?: string; $metadata?: Record<string, unknown> }
    console.error('Bedrock analysis failed:', err.name, err.message)
    if (err.$metadata) console.error('Metadata:', JSON.stringify(err.$metadata))
    return imageBase64 ? getDemoImageResponse() : getDemoResponse(message)
  }
}
