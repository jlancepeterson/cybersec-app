export type SimulatorEmail = {
  id: number
  senderName: string
  senderEmail: string
  subject: string
  timestamp: string
  body: string[]
  simulatedLink?: string
  attachment?: string
  isPhishing: boolean
  indicators: string[]
  explanation: string
}

// Fictional, safe examples for security-awareness training only.
// No real companies, functional links, or credential collection are involved.
export const simulatorEmails: SimulatorEmail[] = [
  {
    id: 1,
    senderName: 'IT Help Desk',
    senderEmail: 'helpdesk@micros0ft-verify.com',
    subject: 'Your account has been locked - action required',
    timestamp: 'Mon, Sep 22 · 8:41 AM',
    body: [
      'Dear User,',
      'Your account has been locked due to unusual activity. You must verify your identity within 30 minutes or your account will be permanently disabled.',
      'Click the link below and enter your username and password to restore access immediately.',
    ],
    simulatedLink: 'https://micros0ft-verify.com/restore-account (simulated - not a real link)',
    isPhishing: true,
    indicators: ['Lookalike domain', 'Urgent pressure', 'Credential request'],
    explanation:
      'The domain swaps a zero for the letter "o" in Microsoft, demands action in 30 minutes, and asks you to type your password on a linked page — three classic phishing signals together.',
  },
  {
    id: 2,
    senderName: 'NorthPeak Outfitters',
    senderEmail: 'orders@northpeakoutfitters.com',
    subject: 'Your order #48213 has shipped',
    timestamp: 'Mon, Sep 22 · 10:02 AM',
    body: [
      'Hi Alex,',
      'Good news! Your recent order (#48213) has shipped and is on its way. You can track the package anytime from your account order history.',
      'Thanks for shopping with us.',
    ],
    isPhishing: false,
    indicators: ['Matches known sender domain', 'No urgency or threats', 'No credential or payment request'],
    explanation:
      'The sender domain matches the retailer\'s real domain, there is no pressure to act immediately, and the message does not ask for a password, payment, or personal information.',
  },
  {
    id: 3,
    senderName: 'Marcus Bell (CEO)',
    senderEmail: 'marcus.bell@corp-outlook.com',
    subject: 'Quick favor before my flight',
    timestamp: 'Mon, Sep 22 · 11:53 AM',
    body: [
      'Hey, are you at your desk?',
      "I'm boarding a flight shortly and need you to pick up 5 gift cards ($100 each) for a client thank-you. I'll reimburse you tonight — just send me the card codes as soon as you get them, I'm on a tight schedule.",
      'Please keep this between us for now, I want it to be a surprise.',
    ],
    isPhishing: true,
    indicators: ['Gift-card request', 'Urgency', 'Executive impersonation', 'Secrecy request'],
    explanation:
      "A real executive would not ask you to buy gift cards and send back the codes by email. The urgency, secrecy, and casual tone impersonating the CEO are hallmark gift-card scam tactics.",
  },
  {
    id: 4,
    senderName: 'IT Security Team',
    senderEmail: 'security-alerts@corp-itsupport-mfa.com',
    subject: 'Confirm your recent multi-factor authentication code',
    timestamp: 'Mon, Sep 22 · 1:17 PM',
    body: [
      'Hello,',
      'Our system detected repeated multi-factor authentication attempts on your account. To confirm your identity and stop the alerts, please reply to this email with the 6-digit verification code you just received.',
      'This helps us close the security ticket on our end.',
    ],
    isPhishing: true,
    indicators: ['MFA code request', 'Domain mismatch', 'Spoofed sender display name'],
    explanation:
      'Legitimate IT teams never ask you to send back an MFA code by email or reply. The display name looks official, but the domain is not the company\'s real IT domain — this is an MFA relay scam.',
  },
  {
    id: 5,
    senderName: 'Priya Natarajan',
    senderEmail: 'priya.natarajan@yourcompany.com',
    subject: 'Meeting moved to 2:30 PM today',
    timestamp: 'Mon, Sep 22 · 2:00 PM',
    body: [
      'Hi team,',
      'Quick heads up — I moved our project sync from 3:00 PM to 2:30 PM today so I can catch an earlier call. Same video link as usual.',
      'See you shortly!',
    ],
    isPhishing: false,
    indicators: ['Internal sender domain', 'Routine, low-stakes content', 'No links or requests for sensitive info'],
    explanation:
      'This comes from a known colleague at the correct internal domain, contains no links, attachments, or requests for sensitive information, and describes a normal scheduling change.',
  },
  {
    id: 6,
    senderName: 'Human Resources',
    senderEmail: 'hr-payroll@yourcompanyhr.net',
    subject: 'Update your direct deposit information',
    timestamp: 'Tue, Sep 23 · 9:12 AM',
    body: [
      'Hello,',
      'As part of our annual payroll system update, please review and confirm your direct deposit details using the attached form so your next paycheck is not delayed.',
      'Complete and return the attached form at your earliest convenience.',
    ],
    attachment: 'Direct_Deposit_Update.exe (simulated attachment)',
    isPhishing: true,
    indicators: ['Payroll/direct-deposit scam', 'Domain mismatch', 'Unexpected executable attachment'],
    explanation:
      'The domain is close to, but not exactly, the real company HR domain, and the "form" is an executable file rather than a document — a common way to trick employees into redirecting their paycheck or running malware.',
  },
  {
    id: 7,
    senderName: 'Diane Castillo, CFO',
    senderEmail: 'diane.castillo@yourcompany-finance.com',
    subject: 'Confidential wire request',
    timestamp: 'Tue, Sep 23 · 11:30 AM',
    body: [
      'Hi,',
      'I need your help processing a confidential wire transfer to a new vendor before end of day. I am tied up in board meetings and cannot take calls, so please handle this over email.',
      'I will send the banking details in a follow-up message. Please keep this between the two of us until it is finalized — I will explain the context later.',
    ],
    isPhishing: true,
    indicators: ['Executive impersonation', 'Wire transfer request', 'Confidentiality request', 'Unreachable-by-phone pretext'],
    explanation:
      'This is a classic business email compromise (BEC) pattern: a senior-sounding request for a confidential wire transfer, an excuse for being unreachable by phone, and a request for secrecy — all designed to bypass normal verification.',
  },
  {
    id: 8,
    senderName: 'Internal IT Notifications',
    senderEmail: 'it-notifications@yourcompany.com',
    subject: 'Scheduled security patch this weekend',
    timestamp: 'Tue, Sep 23 · 3:45 PM',
    body: [
      'Hello,',
      'As part of our regular maintenance schedule, a security patch will be applied to company laptops this Saturday between 1:00 AM and 3:00 AM. No action is needed on your part.',
      'If your device is not connected to the network during this window, the update will apply automatically the next time you connect.',
    ],
    isPhishing: false,
    indicators: ['Internal sender domain', 'No action requested', 'Matches known maintenance schedule'],
    explanation:
      'The message comes from the real internal IT domain, requires no action, requests no information, and describes routine, expected maintenance — consistent with legitimate IT communications.',
  },
  {
    id: 9,
    senderName: 'Accounts Payable — Summit Vendor Group',
    senderEmail: 'billing@summitvendorgruop.com',
    subject: 'Invoice 88231 ready for review',
    timestamp: 'Wed, Sep 24 · 9:05 AM',
    body: [
      'Good morning,',
      'Please find invoice 88231 ready for your review in our vendor portal. The amount reflects services rendered last quarter, in line with our current agreement.',
      'At your earliest convenience, please log in to confirm receipt so we can proceed with processing.',
    ],
    simulatedLink: 'https://portal.summitvendorgruop.com/invoices/88231 (simulated - not a real link)',
    isPhishing: true,
    indicators: ['Typosquatted domain', 'Misleading portal link', 'Professional invoice pretext'],
    explanation:
      'The domain transposes two letters ("gruop" instead of "group") — easy to miss at a glance. The tone is calm and professional with no urgency, which is exactly what makes this more convincing than an obvious scam.',
  },
  {
    id: 10,
    senderName: 'IT Compliance Office',
    senderEmail: 'compliance@yourcornpany.com',
    subject: 'Annual access review — confirmation needed',
    timestamp: 'Wed, Sep 24 · 4:20 PM',
    body: [
      'Hello,',
      'As part of our annual access compliance review, we ask all employees to confirm their current system access by signing in through the link below before the review period closes.',
      'This is a standard, recurring request from our compliance team and applies to all staff.',
    ],
    simulatedLink: 'https://access-review.yourcornpany.com/confirm (simulated - not a real link)',
    isPhishing: true,
    indicators: ['Lookalike domain', 'Misleading sign-in link', 'IT/compliance impersonation'],
    explanation:
      'The domain replaces an "m" with "rn" to mimic the real company name ("yourcornpany" vs. "yourcompany") — a subtle trick that is easy to miss. There is no shouting urgency, just a calm, routine-sounding request, which is what makes late-stage phishing convincing.',
  },
]
