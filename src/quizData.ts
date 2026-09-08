export type QuizQuestion = {
  id: number
  sender: string
  subject: string
  body: string
  answer: 'phishing' | 'legitimate'
  signal: string
  explanation: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    sender: 'accounts@micros0ft-support.com',
    subject: 'Action required: unusual sign-in detected',
    body: "We noticed a sign-in from a new device. If this wasn't you, click below to secure your account immediately.",
    answer: 'phishing',
    signal: 'Spoofed sender',
    explanation: 'The domain uses a zero instead of the letter "o" in Microsoft, a classic spoofed sender trick.',
  },
  {
    id: 2,
    sender: 'billing@cloudstorage-pro.com',
    subject: 'URGENT: Your storage will be deleted in 2 hours',
    body: 'Your account will be permanently deleted in 2 hours unless you confirm your billing details right now.',
    answer: 'phishing',
    signal: 'Urgent pressure',
    explanation: 'A short, high-pressure deadline is designed to make you act before you think it through.',
  },
  {
    id: 3,
    sender: 'it-helpdesk@company-portal.net',
    subject: 'Password expiration notice',
    body: 'Your password expires today. Enter your current password and a new one on this page to avoid losing access.',
    answer: 'phishing',
    signal: 'Credential bait',
    explanation: "Legitimate IT systems don't ask you to submit your password through an emailed link.",
  },
  {
    id: 4,
    sender: 'invoices@vendor-supplies.co',
    subject: 'Invoice attached - payment overdue',
    body: 'Please see the attached invoice.zip for the overdue payment details and remit as soon as possible.',
    answer: 'phishing',
    signal: 'Unexpected attachment',
    explanation: 'An unsolicited compressed attachment tied to a vague overdue invoice is a common malware delivery method.',
  },
  {
    id: 5,
    sender: 'newsletter@yourfavoriteblog.com',
    subject: "This week's roundup: 5 articles worth reading",
    body: 'Hi there, here is your regular weekly digest of new posts. No action is needed, just enjoy the read!',
    answer: 'legitimate',
    signal: 'Routine, low-pressure email',
    explanation: 'No urgency, no credential request, and no unexpected attachment. This is a normal newsletter.',
  },
]
