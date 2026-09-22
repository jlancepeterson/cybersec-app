// Data for the "Spot the Red Flags" training mode.
// Each scenario is a realistic (fictional) email with a fixed set of
// interactive elements. Some elements are genuine red flags; others are
// plausible/benign details included so learners practice evaluating
// context rather than clicking everything.

export type RedFlagLevel = 'beginner' | 'intermediate' | 'expert'

export type RedFlagElementType = 'text' | 'link' | 'attachment' | 'qrcode'

export interface RedFlagBodyElement {
  id: string
  type: RedFlagElementType
  content: string
  isRedFlag: boolean
  explanation: string
}

export interface RedFlagScenario {
  id: string
  level: RedFlagLevel
  senderName: string
  senderEmail: string
  senderIsRedFlag: boolean
  senderExplanation: string
  subject: string
  subjectIsRedFlag: boolean
  subjectExplanation: string
  timestamp: string
  greeting: string
  bodyElements: RedFlagBodyElement[]
  closing: string
  whatYouShouldHaveNoticed: string
  whatShouldYouDo: string
  hints: string[]
}

export function countRedFlags(scenario: RedFlagScenario): number {
  return (
    (scenario.senderIsRedFlag ? 1 : 0) +
    (scenario.subjectIsRedFlag ? 1 : 0) +
    scenario.bodyElements.filter((element) => element.isRedFlag).length
  )
}

export function getScenariosForLevel(level: RedFlagLevel): RedFlagScenario[] {
  return redFlagScenarios.filter((scenario) => scenario.level === level)
}

export const levelInfo: Record<RedFlagLevel, { title: string; tagline: string; description: string }> = {
  beginner: {
    title: 'Beginner',
    tagline: 'Learn the Basics',
    description:
      'Recognizable warning signs: odd domains, urgent threats, unexpected attachments, and direct credential requests.',
  },
  intermediate: {
    title: 'Intermediate',
    tagline: 'Look Closer',
    description:
      'More convincing attempts: lookalike domains, believable business messages, fake documents, and payroll or invoice scams.',
  },
  expert: {
    title: 'Expert',
    tagline: 'Think Like an Attacker',
    description:
      'Sophisticated, professionally written attempts: executive impersonation, MFA social engineering, OAuth consent abuse, and QR phishing.',
  },
}

export const redFlagScenarios: RedFlagScenario[] = [
  // ----------------------------------------------------------------------
  // BEGINNER (10) — relatively obvious indicators
  // ----------------------------------------------------------------------
  {
    id: 'b1',
    level: 'beginner',
    senderName: 'IT Support',
    senderEmail: 'support@it-helpdesk-secure.net',
    senderIsRedFlag: true,
    senderExplanation:
      "This isn't your company's real domain. Attackers register lookalike helpdesk domains to appear official.",
    subject: 'URGENT: Your Password Expires in 1 Hour',
    subjectIsRedFlag: true,
    subjectExplanation: 'A short, artificial deadline is designed to make you act before you think.',
    timestamp: 'Mon, Sep 15 · 9:02 AM',
    greeting: 'Dear Employee,',
    bodyElements: [
      {
        id: 'b1-e1',
        type: 'text',
        content:
          'Your network password will expire in 60 minutes. Failure to update will result in immediate account suspension.',
        isRedFlag: true,
        explanation: 'Threatening an immediate consequence pressures you to skip normal verification steps.',
      },
      {
        id: 'b1-e2',
        type: 'link',
        content: 'Update Password Now: http://it-helpdesk-secure.net/reset (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The link leads to the same suspicious domain and asks for your current credentials.',
      },
      {
        id: 'b1-e3',
        type: 'text',
        content: 'This message was sent to all staff as part of routine account maintenance.',
        isRedFlag: false,
        explanation: "This line is filler text designed to sound routine — it isn't inherently suspicious on its own.",
      },
    ],
    closing: 'IT Helpdesk Team',
    whatYouShouldHaveNoticed:
      'The sender domain does not match the company, the subject and body create false urgency, and the link routes back to that same untrusted domain to collect your password.',
    whatShouldYouDo:
      "Don't click the link. Go directly to your company's known IT portal or call the helpdesk using a number you already have on file.",
    hints: [
      'Look closely at the domain in the sender\'s email address.',
      'Notice how little time you are being given to act.',
      'Check where the "update password" link actually leads.',
    ],
  },
  {
    id: 'b2',
    level: 'beginner',
    senderName: 'Delivery Service',
    senderEmail: 'notifications@ups-tracking-alerts.com',
    senderIsRedFlag: true,
    senderExplanation: 'Real shipping carriers send tracking updates from their own verified domains, not a generic alerts domain.',
    subject: 'Delivery Attempt Failed - Action Required',
    subjectIsRedFlag: false,
    subjectExplanation: 'A failed-delivery subject line is common wording used by legitimate carriers too — it is not suspicious by itself.',
    timestamp: 'Tue, Sep 16 · 2:14 PM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'b2-e1',
        type: 'text',
        content: 'We attempted to deliver your package today but were unable to complete the delivery.',
        isRedFlag: false,
        explanation: 'This sentence is plausible on its own and matches normal carrier language.',
      },
      {
        id: 'b2-e2',
        type: 'attachment',
        content: 'Delivery_Invoice_Details.zip.exe (simulated - not a real file)',
        isRedFlag: true,
        explanation: 'A compressed file ending in .exe disguised as an invoice is a classic malware delivery trick.',
      },
      {
        id: 'b2-e3',
        type: 'text',
        content: 'Please reschedule immediately or your package will be returned within 24 hours.',
        isRedFlag: true,
        explanation: 'The tight deadline and threat of losing your package is meant to rush you into clicking without thinking.',
      },
      {
        id: 'b2-e4',
        type: 'link',
        content: 'Reschedule Delivery: http://ups-tracking-alerts.com/reschedule (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The link points to the same unofficial domain rather than the real carrier website.',
      },
    ],
    closing: 'Customer Service',
    whatYouShouldHaveNoticed:
      'The sender domain is not an official carrier domain, an executable file is disguised as an invoice, urgency is used to rush you, and the link reinforces the fake domain.',
    whatShouldYouDo:
      'Never open unexpected .exe or .zip attachments. Track packages by typing the carrier\'s real website directly into your browser instead of clicking email links.',
    hints: [
      'Check the file extension on the attachment carefully.',
      'Ask yourself if a delivery notice would really include a compressed executable file.',
      'Compare the link domain to the carrier\'s real website.',
    ],
  },
  {
    id: 'b3',
    level: 'beginner',
    senderName: 'Michael Turner',
    senderEmail: 'mturner.ceo@gmail.com',
    senderIsRedFlag: true,
    senderExplanation: 'An executive emailing from a personal, free email address instead of the company domain is a strong warning sign.',
    subject: 'Need this done before my meeting - urgent',
    subjectIsRedFlag: true,
    subjectExplanation: 'Combining urgency with an authority figure is a common pressure tactic in gift card scams.',
    timestamp: 'Wed, Sep 17 · 8:47 AM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'b3-e1',
        type: 'text',
        content: "I'm stuck in back-to-back meetings and need you to buy gift cards for a client appreciation gift.",
        isRedFlag: true,
        explanation: 'Requests for gift cards as a form of payment are a well-known scam pattern, especially from "executives."',
      },
      {
        id: 'b3-e2',
        type: 'text',
        content: 'Please buy five $100 Amazon gift cards and send me the codes as soon as possible.',
        isRedFlag: true,
        explanation: 'Asking for the gift card codes directly is how scammers redeem the value instantly and untraceably.',
      },
      {
        id: 'b3-e3',
        type: 'text',
        content: "Keep this between us for now, I'll explain later.",
        isRedFlag: true,
        explanation: 'Requests for secrecy are designed to prevent you from verifying the request with anyone else.',
      },
    ],
    closing: 'Sent from my iPhone',
    whatYouShouldHaveNoticed:
      'The sender uses a personal email address instead of the company domain, the message pressures secrecy and urgency, and it asks for gift card codes — a payment method no legitimate business uses.',
    whatShouldYouDo:
      'Verify unusual requests from executives through a separate, known communication channel, such as calling them directly. Never purchase gift cards on request by email.',
    hints: [
      'Look at the domain used in the sender\'s email address.',
      'Notice the request for a specific payment method.',
      'Consider why the sender might ask you to keep this quiet.',
    ],
  },
  {
    id: 'b4',
    level: 'beginner',
    senderName: 'Account Security',
    senderEmail: 'security@paypa1-alerts.com',
    senderIsRedFlag: true,
    senderExplanation: 'The domain swaps the letter "l" for the number "1" — a simple lookalike trick.',
    subject: 'Your account has been limited',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject line alone is generic and mirrors wording real account-status emails also use.',
    timestamp: 'Thu, Sep 18 · 11:20 AM',
    greeting: 'Dear Customer,',
    bodyElements: [
      {
        id: 'b4-e1',
        type: 'text',
        content: "We've noticed unusual activity on your account and have limited some features until you verify your identity.",
        isRedFlag: false,
        explanation: 'This sentence alone reads like standard account-security language used by many legitimate companies.',
      },
      {
        id: 'b4-e2',
        type: 'link',
        content: 'Verify My Identity: http://paypa1-alerts.com/verify (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The link goes to the lookalike domain from the sender address rather than the real company site.',
      },
      {
        id: 'b4-e3',
        type: 'text',
        content: 'Please enter your full card number and password to restore full access.',
        isRedFlag: true,
        explanation: 'Legitimate companies never ask you to submit your full card number and password together by email.',
      },
    ],
    closing: 'Account Security Team',
    whatYouShouldHaveNoticed:
      'The sender domain is a lookalike, the verification link points to that same fake domain, and the message asks for full card and password details — something real companies never request this way.',
    whatShouldYouDo:
      'Log in by typing the company\'s real web address directly into your browser instead of clicking the email link, and never enter your password or card number from an email prompt.',
    hints: [
      'Look very carefully at each character in the sender\'s domain.',
      'Check whether the link domain matches the sender\'s domain.',
      'Notice exactly what information you are being asked to provide.',
    ],
  },
  {
    id: 'b5',
    level: 'beginner',
    senderName: 'HR Department',
    senderEmail: 'hr-updates@companyhr-benefits.info',
    senderIsRedFlag: true,
    senderExplanation: 'A `.info` domain unrelated to the real company is a common sign of a spoofed HR notice.',
    subject: 'Open Enrollment Ends Today',
    subjectIsRedFlag: true,
    subjectExplanation: 'An artificial same-day deadline pushes you to act without verifying the source.',
    timestamp: 'Fri, Sep 19 · 7:58 AM',
    greeting: 'Dear Team Member,',
    bodyElements: [
      {
        id: 'b5-e1',
        type: 'text',
        content: 'Open enrollment for benefits closes today at 5 PM. You must confirm your selections immediately.',
        isRedFlag: true,
        explanation: 'A hard same-day deadline is used to prevent you from taking time to verify the message.',
      },
      {
        id: 'b5-e2',
        type: 'link',
        content: 'Confirm Benefits: http://companyhr-benefits.info/login (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The link uses the same unofficial domain as the sender rather than your company\'s real HR portal.',
      },
      {
        id: 'b5-e3',
        type: 'text',
        content: 'Log in with your employee ID and current network password to continue.',
        isRedFlag: true,
        explanation: 'Being asked to enter your network password on an external benefits site is a credential-harvesting attempt.',
      },
    ],
    closing: 'Human Resources',
    whatYouShouldHaveNoticed:
      'The sender domain does not belong to your company, the deadline is artificially urgent, and the linked site asks for your network password rather than a benefits-specific login.',
    whatShouldYouDo:
      'Go to your company\'s official HR or benefits portal directly rather than clicking the email link, and confirm deadlines with HR through a known contact method.',
    hints: [
      'Compare the sender\'s domain to your real company domain.',
      'Think about how much time you are given to respond.',
      'Notice which password you are being asked to enter.',
    ],
  },
  {
    id: 'b6',
    level: 'beginner',
    senderName: 'Finance Team',
    senderEmail: 'billing@vendor-supplies-inc.co',
    senderIsRedFlag: true,
    senderExplanation: 'The domain is close to a real vendor name but uses a different top-level domain, a common impersonation trick.',
    subject: 'Invoice #4471 - Payment Overdue',
    subjectIsRedFlag: false,
    subjectExplanation: 'Overdue invoice subject lines are extremely common in legitimate billing emails too.',
    timestamp: 'Mon, Sep 22 · 10:05 AM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'b6-e1',
        type: 'text',
        content: 'Your account is past due. Please review the attached invoice and remit payment as soon as possible.',
        isRedFlag: false,
        explanation: 'This is standard billing language and is not suspicious by itself.',
      },
      {
        id: 'b6-e2',
        type: 'attachment',
        content: 'Invoice_4471.zip (simulated - not a real file)',
        isRedFlag: true,
        explanation: 'An unsolicited compressed attachment for an invoice you don\'t recognize is a common malware delivery method.',
      },
      {
        id: 'b6-e3',
        type: 'text',
        content: 'To avoid a late fee, wire payment directly to the account listed in the attachment within 24 hours.',
        isRedFlag: true,
        explanation: 'Urgent wire-transfer instructions tied to an unverified invoice are a classic invoice-fraud pattern.',
      },
    ],
    closing: 'Accounts Payable',
    whatYouShouldHaveNoticed:
      'The sender domain resembles but doesn\'t match a real vendor, an unexpected compressed attachment is included, and payment is demanded urgently by wire transfer.',
    whatShouldYouDo:
      'Verify any invoice and payment details by calling the vendor using a phone number from a previous, trusted invoice — not the number or link in this email.',
    hints: [
      'Compare this domain letter-by-letter with your real vendor\'s domain.',
      'Consider whether you were expecting this attachment.',
      'Notice the payment method and deadline being requested.',
    ],
  },
  {
    id: 'b7',
    level: 'beginner',
    senderName: 'Streaming Plus',
    senderEmail: 'billing@streaming-plus-support.com',
    senderIsRedFlag: true,
    senderExplanation: 'A generic "-support" domain rather than the real service\'s official domain is a common spoofing tactic.',
    subject: 'Your payment method was declined',
    subjectIsRedFlag: false,
    subjectExplanation: 'Declined-payment notices are common and legitimate wording used by many real subscription services.',
    timestamp: 'Tue, Sep 23 · 6:40 PM',
    greeting: 'Dear Member,',
    bodyElements: [
      {
        id: 'b7-e1',
        type: 'text',
        content: 'We were unable to process your last payment. Your subscription will be cancelled in 12 hours.',
        isRedFlag: true,
        explanation: 'A tight 12-hour countdown is used to prevent you from calmly checking whether this message is real.',
      },
      {
        id: 'b7-e2',
        type: 'link',
        content: 'Update Payment Info: http://streaming-plus-support.com/billing (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The link leads to the unofficial support domain rather than the real streaming service\'s site.',
      },
      {
        id: 'b7-e3',
        type: 'text',
        content: 'Enter your card number, expiration date, and security code to keep your account active.',
        isRedFlag: true,
        explanation: 'Requesting full card details, including the security code, by email is a direct credential/payment-theft attempt.',
      },
    ],
    closing: 'Billing Support',
    whatYouShouldHaveNoticed:
      'The sender domain isn\'t the real service, a short countdown pressures quick action, and the link requests full card details including the security code.',
    whatShouldYouDo:
      'Log in to the streaming service directly through its official app or website to check your billing status instead of using the email link.',
    hints: [
      'Check whether the sender domain matches the real service\'s domain.',
      'Notice how short the deadline is.',
      'Look at exactly what payment information is being requested.',
    ],
  },
  {
    id: 'b8',
    level: 'beginner',
    senderName: 'Document Share',
    senderEmail: 'noreply@securedocs-share-alert.com',
    senderIsRedFlag: true,
    senderExplanation: 'This is not a known document-sharing service domain — it\'s a generic name designed to sound official.',
    subject: 'A document has been shared with you',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject line mimics normal document-sharing notifications and is not suspicious by itself.',
    timestamp: 'Wed, Sep 24 · 1:12 PM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'b8-e1',
        type: 'text',
        content: 'A colleague has shared a file named "Q3_Salary_Review.xlsx" with you for viewing.',
        isRedFlag: false,
        explanation: 'This sentence by itself is a plausible description of a shared document.',
      },
      {
        id: 'b8-e2',
        type: 'link',
        content: 'View Document: http://securedocs-share-alert.com/view?id=8817 (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The link goes to an unfamiliar domain rather than a known file-sharing service like Google Drive or OneDrive.',
      },
      {
        id: 'b8-e3',
        type: 'text',
        content: 'You will be asked to sign in with your work email and password to open the file.',
        isRedFlag: true,
        explanation: 'Being asked to re-enter your work credentials on an unfamiliar site is a common way to steal login information.',
      },
    ],
    closing: 'Automated Notification',
    whatYouShouldHaveNoticed:
      'The document-sharing domain is unfamiliar and doesn\'t match a known service, and opening the file requires re-entering your work password on that unfamiliar site.',
    whatShouldYouDo:
      'Confirm with the colleague directly (in person, chat, or phone) that they actually shared a file before opening any link, and never enter your work password outside your company\'s known login page.',
    hints: [
      'Consider whether this looks like a real, well-known file-sharing service.',
      'Notice what you are asked to do to view the document.',
      'Think about whether entering your work password here makes sense.',
    ],
  },
  {
    id: 'b9',
    level: 'beginner',
    senderName: 'Payroll Services',
    senderEmail: 'payroll@company-payroll-updates.com',
    senderIsRedFlag: true,
    senderExplanation: 'This domain is not your employer\'s real payroll system domain.',
    subject: 'Direct Deposit Update Required',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject wording resembles routine payroll communication and isn\'t suspicious alone.',
    timestamp: 'Thu, Sep 25 · 9:30 AM',
    greeting: 'Dear Employee,',
    bodyElements: [
      {
        id: 'b9-e1',
        type: 'text',
        content: 'Our payroll system has been updated. All employees must re-enter their direct deposit information by Friday.',
        isRedFlag: false,
        explanation: 'This sentence alone sounds like a routine, plausible payroll system update.',
      },
      {
        id: 'b9-e2',
        type: 'link',
        content: 'Update Direct Deposit: http://company-payroll-updates.com/portal (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The link goes to an external domain rather than your employer\'s actual HR or payroll system.',
      },
      {
        id: 'b9-e3',
        type: 'text',
        content: 'Enter your bank routing number, account number, and login password to complete the update.',
        isRedFlag: true,
        explanation: 'A legitimate payroll update would use your company\'s existing HR system login, not a request for your password on an external page.',
      },
    ],
    closing: 'Payroll Department',
    whatYouShouldHaveNoticed:
      'The domain doesn\'t match your employer\'s real payroll system, and the linked page asks for full bank details plus your login password outside the normal HR portal.',
    whatShouldYouDo:
      'Only update direct deposit information by logging into your company\'s known HR/payroll system directly, and report this message to your security team.',
    hints: [
      'Check whether this matches your employer\'s real payroll domain.',
      'Notice where the update link actually leads.',
      'Look at what account details are being requested.',
    ],
  },
  {
    id: 'b10',
    level: 'beginner',
    senderName: 'Software License Team',
    senderEmail: 'licensing@office365-renewal-center.com',
    senderIsRedFlag: true,
    senderExplanation: 'This isn\'t an official Microsoft domain — it\'s a generic renewal-themed domain built to look official.',
    subject: 'License Expired: Renew Immediately to Avoid Data Loss',
    subjectIsRedFlag: true,
    subjectExplanation: 'The threat of data loss combined with "immediately" is designed to trigger a fast, unverified reaction.',
    timestamp: 'Fri, Sep 26 · 3:47 PM',
    greeting: 'Dear User,',
    bodyElements: [
      {
        id: 'b10-e1',
        type: 'text',
        content: 'Your software license expired today. All files and documents will be permanently deleted within 24 hours unless renewed.',
        isRedFlag: true,
        explanation: 'Threatening permanent data loss on a strict deadline is a pressure tactic, not how license expirations actually work.',
      },
      {
        id: 'b10-e2',
        type: 'attachment',
        content: 'Renewal_Form.exe (simulated - not a real file)',
        isRedFlag: true,
        explanation: 'A license "renewal form" delivered as an executable file is not a legitimate renewal process.',
      },
      {
        id: 'b10-e3',
        type: 'text',
        content: 'Run the attached form and sign in with your Microsoft account to reactivate your license.',
        isRedFlag: true,
        explanation: 'Running an attached executable and entering account credentials into it can install malware or steal your login.',
      },
    ],
    closing: 'Licensing Support Team',
    whatYouShouldHaveNoticed:
      'The sender domain isn\'t Microsoft\'s, the subject and body use data-loss threats to create urgency, and you\'re asked to run an executable file and log in through it.',
    whatShouldYouDo:
      'Never run executable attachments from unsolicited emails. Check and renew software licenses only through the official vendor account portal.',
    hints: [
      'Check whether the sender domain is an official Microsoft domain.',
      'Notice the consequence being threatened and its deadline.',
      'Look closely at the attachment\'s file type.',
    ],
  },

  // ----------------------------------------------------------------------
  // INTERMEDIATE (10) — more convincing, subtler indicators
  // ----------------------------------------------------------------------
  {
    id: 'i1',
    level: 'intermediate',
    senderName: 'Google Drive',
    senderEmail: 'drive-share@docs-google-mail.com',
    senderIsRedFlag: true,
    senderExplanation: 'This domain mimics Google branding but is not "google.com" or a genuine Google subdomain.',
    subject: 'Sarah Chen shared "Q3 Budget Review" with you',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject line convincingly matches real Google Drive sharing notifications.',
    timestamp: 'Mon, Oct 6 · 10:14 AM',
    greeting: 'Hi there,',
    bodyElements: [
      {
        id: 'i1-e1',
        type: 'text',
        content: 'Sarah Chen (sarah.chen@yourcompany-finance.com) has shared a spreadsheet with you for review before Friday\'s meeting.',
        isRedFlag: true,
        explanation: 'The named colleague\'s domain doesn\'t match your real company domain — a subtle sign this is impersonation, even though the message reads naturally.',
      },
      {
        id: 'i1-e2',
        type: 'link',
        content: 'Open in Google Drive (simulated - not a real link, hover text shows docs-google-mail.com)',
        isRedFlag: true,
        explanation: 'The visible text says "Google Drive," but the actual destination is the lookalike domain, not google.com.',
      },
      {
        id: 'i1-e3',
        type: 'text',
        content: 'You may need to confirm your Google account to view shared files outside your organization.',
        isRedFlag: true,
        explanation: 'Real Drive sharing doesn\'t require re-confirming your account through a link in the notification email itself.',
      },
    ],
    closing: 'This message was sent from Google Drive.',
    whatYouShouldHaveNoticed:
      'The colleague\'s email domain doesn\'t match the real company, the "Open in Google Drive" link actually points elsewhere, and you\'re prompted to reconfirm your account through the email rather than the app.',
    whatShouldYouDo:
      'Hover over links to check the real destination before clicking, and confirm unexpected shared files with the colleague directly through a known channel like chat or phone.',
    hints: [
      'Check the domain in the named colleague\'s email address.',
      'Hover over the "Open" button — does the link text match where it actually goes?',
      'Consider why you\'d need to "confirm your account" just to view a shared file.',
    ],
  },
  {
    id: 'i2',
    level: 'intermediate',
    senderName: 'Alex Martinez',
    senderEmail: 'alex.martinez@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'The address matches a real internal colleague and company domain, so it isn\'t suspicious by itself.',
    subject: 'Updated direct deposit for this pay period',
    subjectIsRedFlag: false,
    subjectExplanation: 'This is an ordinary subject a coworker or HR contact might reasonably send.',
    timestamp: 'Tue, Oct 7 · 8:55 AM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'i2-e1',
        type: 'text',
        content: 'I switched banks recently and need to update my direct deposit information before this Friday\'s payroll run.',
        isRedFlag: false,
        explanation: 'Sounds like a routine, plausible request from a coworker on its own.',
      },
      {
        id: 'i2-e2',
        type: 'text',
        content: 'Can you please update my account number to the one below and confirm once it\'s done? I don\'t want to miss this payment.',
        isRedFlag: true,
        explanation: 'Requesting a banking-detail change for someone else\'s payroll via email, with urgency, is a common account-compromise or impersonation tactic — this should always be verified out-of-band, even from a legitimate-looking address.',
      },
      {
        id: 'i2-e3',
        type: 'text',
        content: 'New account: 043-882-1195, Routing: 071000013',
        isRedFlag: true,
        explanation: 'Payroll or banking changes sent as plain text in an email, rather than through your official HR system, should always be independently verified before acting.',
      },
    ],
    closing: 'Thanks so much,\nAlex',
    whatYouShouldHaveNoticed:
      'Even though the sender address looks legitimate, the request to change someone\'s payroll banking details by email — with urgency and raw account numbers — is a classic pattern used when an account has been compromised or spoofed.',
    whatShouldYouDo:
      'Verify any banking or payroll change requests by speaking with the person directly (phone or in-person) before making changes, regardless of how legitimate the email address looks.',
    hints: [
      'The sender address itself may not be the problem here — think about what is actually being requested.',
      'Consider how payroll changes should normally be submitted at your company.',
      'Notice how the account numbers are delivered.',
    ],
  },
  {
    id: 'i3',
    level: 'intermediate',
    senderName: 'DocuSign',
    senderEmail: 'no-reply@docusign-esignatures.net',
    senderIsRedFlag: true,
    senderExplanation: 'Real DocuSign notifications come from "docusign.com" or "docusign.net" — this domain is close but not correct.',
    subject: 'Please review and sign: Vendor Agreement 2024-118',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject line closely matches how real e-signature requests are worded.',
    timestamp: 'Wed, Oct 8 · 2:31 PM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'i3-e1',
        type: 'text',
        content: 'You have a document waiting for your electronic signature. This agreement requires action before it expires.',
        isRedFlag: false,
        explanation: 'This wording closely mirrors real e-signature reminder emails.',
      },
      {
        id: 'i3-e2',
        type: 'link',
        content: 'Review Document (simulated - not a real link, hover text shows docusign-esignatures.net)',
        isRedFlag: true,
        explanation: 'The button text looks official, but the underlying link goes to a domain that only resembles DocuSign\'s real one.',
      },
      {
        id: 'i3-e3',
        type: 'text',
        content: 'Sign in with your email provider (Microsoft, Google, or Yahoo) to verify your identity before viewing.',
        isRedFlag: true,
        explanation: 'Genuine e-signature services don\'t ask you to log in with your personal email provider credentials to view a document — this is a credential-phishing technique.',
      },
    ],
    closing: 'Powered by DocuSign',
    whatYouShouldHaveNoticed:
      'The sending domain is a close imitation, the review link doesn\'t actually go to docusign.com, and you\'re asked to log in with your email provider account just to view a document.',
    whatShouldYouDo:
      'Access signature requests by logging into DocuSign directly through your browser rather than clicking email links, and never enter your email account password on a document-signing page.',
    hints: [
      'Compare this sender domain to the real DocuSign domain.',
      'Hover over the review button to see where it truly points.',
      'Notice what kind of account you\'re asked to sign in with.',
    ],
  },
  {
    id: 'i4',
    level: 'intermediate',
    senderName: 'Jordan Lee, Facilities',
    senderEmail: 'jordan.lee@yourcompany-facilities.com',
    senderIsRedFlag: true,
    senderExplanation: 'The domain adds "-facilities" to your company name — a subtle variation from your real domain.',
    subject: 'Parking garage access badge renewal',
    subjectIsRedFlag: false,
    subjectExplanation: 'A badge renewal notice is a believable, low-stakes internal message.',
    timestamp: 'Thu, Oct 9 · 11:02 AM',
    greeting: 'Hi Team,',
    bodyElements: [
      {
        id: 'i4-e1',
        type: 'text',
        content: 'Building access badges are being renewed this month. Please complete the short form to avoid losing garage access.',
        isRedFlag: false,
        explanation: 'This reads as a normal, low-stakes facilities notice.',
      },
      {
        id: 'i4-e2',
        type: 'link',
        content: 'Renew My Badge: http://yourcompany-facilities.com/badge-form (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The domain is close to your real company domain but subtly different — a lookalike used to seem trustworthy.',
      },
      {
        id: 'i4-e3',
        type: 'text',
        content: 'The form will ask for your employee ID and current network login to confirm your identity.',
        isRedFlag: true,
        explanation: 'A badge-renewal form has no legitimate reason to request your network login credentials.',
      },
    ],
    closing: 'Facilities Management',
    whatYouShouldHaveNoticed:
      'The domain is a subtle variation of your real company\'s domain, and a routine badge form is unexpectedly requesting your network login credentials.',
    whatShouldYouDo:
      'Complete facilities requests only through your company\'s known internal portal or intranet, and never provide network credentials on an external-looking form.',
    hints: [
      'Compare this domain character-by-character with your real company domain.',
      'Consider what a badge renewal form should reasonably ask for.',
      'Notice exactly what credentials are being requested.',
    ],
  },
  {
    id: 'i5',
    level: 'intermediate',
    senderName: 'Priya Nair',
    senderEmail: 'priya.nair@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches a legitimate coworker\'s real company address.',
    subject: 'Can you approve this invoice today?',
    subjectIsRedFlag: false,
    subjectExplanation: 'An invoice approval request is common, ordinary business communication.',
    timestamp: 'Fri, Oct 10 · 9:40 AM',
    greeting: 'Hey,',
    bodyElements: [
      {
        id: 'i5-e1',
        type: 'text',
        content: 'Our new marketing vendor sent this invoice and needs approval today so we don\'t lose our rate lock.',
        isRedFlag: false,
        explanation: 'This is a plausible, ordinary business explanation on its own.',
      },
      {
        id: 'i5-e2',
        type: 'attachment',
        content: 'Vendor_Invoice_Q4.htm (simulated - not a real file)',
        isRedFlag: true,
        explanation: 'Invoices are almost never sent as HTML files — this format is commonly used to host a hidden phishing login page instead of a real document.',
      },
      {
        id: 'i5-e3',
        type: 'text',
        content: 'Open the attachment and enter your approval credentials so the payment can process automatically.',
        isRedFlag: true,
        explanation: 'Being asked to "enter approval credentials" inside an attached file — rather than your real finance system — is a strong sign of credential theft.',
      },
    ],
    closing: 'Thanks!\nPriya',
    whatYouShouldHaveNoticed:
      'The invoice is delivered as an unusual HTML file rather than a normal document format, and it asks you to enter login credentials inside the attachment instead of your finance system.',
    whatShouldYouDo:
      'Process invoice approvals only inside your official finance/accounting platform, and confirm unusual attachment requests with the sender through a separate channel.',
    hints: [
      'Notice the file type of the attachment.',
      'Consider where invoice approvals should normally happen.',
      'Think about why credentials would be requested inside a file attachment.',
    ],
  },
  {
    id: 'i6',
    level: 'intermediate',
    senderName: 'Zoom',
    senderEmail: 'no-reply@zoom-video-meetings.com',
    senderIsRedFlag: true,
    senderExplanation: 'Real Zoom notifications come from "zoom.us" — this is a similarly themed but incorrect domain.',
    subject: 'Missed meeting: Recording available',
    subjectIsRedFlag: false,
    subjectExplanation: 'A missed-meeting recording notice is realistic wording used by legitimate meeting platforms.',
    timestamp: 'Mon, Oct 13 · 4:18 PM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'i6-e1',
        type: 'text',
        content: 'You missed a scheduled meeting today. A recording has been made available for your review.',
        isRedFlag: false,
        explanation: 'This wording closely mirrors real meeting-platform notifications.',
      },
      {
        id: 'i6-e2',
        type: 'link',
        content: 'View Recording (simulated - not a real link, hover text shows zoom-video-meetings.com)',
        isRedFlag: true,
        explanation: 'The button says "View Recording," but the real destination is a domain that only resembles Zoom\'s.',
      },
      {
        id: 'i6-e3',
        type: 'text',
        content: 'Sign in with your work email and password to access the recording.',
        isRedFlag: true,
        explanation: 'Real meeting platforms use your existing app session, not a fresh request for your work password from an email link.',
      },
    ],
    closing: 'Zoom Notifications',
    whatYouShouldHaveNoticed:
      'The sending domain only resembles Zoom\'s real one, the "View Recording" link goes elsewhere, and you\'re asked to re-enter your work password to view it.',
    whatShouldYouDo:
      'Check meeting recordings by opening the Zoom app or website directly rather than clicking email links, and avoid entering your work password on prompted pages.',
    hints: [
      'Compare this domain to the real meeting platform\'s domain.',
      'Hover over "View Recording" to check its real destination.',
      'Notice what you\'re asked to enter to view the recording.',
    ],
  },
  {
    id: 'i7',
    level: 'intermediate',
    senderName: 'Rachel Kim, Procurement',
    senderEmail: 'rachel.kim@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches a legitimate internal procurement contact.',
    subject: 'Updated banking details for Summit Vendor Group',
    subjectIsRedFlag: false,
    subjectExplanation: 'A vendor banking-update notice is a normal type of procurement communication.',
    timestamp: 'Tue, Oct 14 · 1:05 PM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'i7-e1',
        type: 'text',
        content: 'Summit Vendor Group emailed procurement this morning to say they\'ve switched banks ahead of next week\'s invoice payment.',
        isRedFlag: false,
        explanation: 'This is a plausible, routine-sounding update from a vendor relationship.',
      },
      {
        id: 'i7-e2',
        type: 'text',
        content: 'Their message came from billing@summitvendorgruop.com — please update our records and process the next payment to the new account before Friday.',
        isRedFlag: true,
        explanation: 'The vendor\'s email domain is misspelled ("gruop" instead of "group") — a typosquatted domain used to redirect vendor payments to an attacker-controlled account.',
      },
      {
        id: 'i7-e3',
        type: 'text',
        content: 'New account details are attached — no need to call them, they said email confirmation is fine this time.',
        isRedFlag: true,
        explanation: 'Discouraging phone verification for a banking change is a red flag on its own, regardless of how calm and routine the message sounds.',
      },
    ],
    closing: 'Thanks,\nRachel',
    whatYouShouldHaveNoticed:
      'The vendor\'s domain contains a subtle misspelling, and the message explicitly discourages verifying the banking change by phone — both signs of a business email compromise targeting vendor payments.',
    whatShouldYouDo:
      'Always verify vendor banking changes by phone using a number from a previous, trusted invoice — never rely solely on email, especially when a message discourages calling to confirm.',
    hints: [
      'Look very closely at the spelling of the vendor\'s domain.',
      'Notice how the message feels about phone verification.',
      'Consider why the request avoids a call to confirm the change.',
    ],
  },
  {
    id: 'i8',
    level: 'intermediate',
    senderName: 'Benefits Enrollment',
    senderEmail: 'enrollment@yourcompany-benefits-portal.com',
    senderIsRedFlag: true,
    senderExplanation: 'The domain adds extra words to your real company name — a subtle but real mismatch.',
    subject: 'Reminder: Confirm your 2025 benefits elections',
    subjectIsRedFlag: false,
    subjectExplanation: 'A benefits-election reminder is normal, expected communication during open enrollment.',
    timestamp: 'Wed, Oct 15 · 8:12 AM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'i8-e1',
        type: 'text',
        content: 'Open enrollment continues through the end of the month. Please review your elections when you have a chance.',
        isRedFlag: false,
        explanation: 'This is calm, low-pressure wording consistent with real HR communication.',
      },
      {
        id: 'i8-e2',
        type: 'link',
        content: 'Review My Elections: http://yourcompany-benefits-portal.com/login (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'The domain resembles your company\'s name but is a separate, unofficial site rather than your real HR system.',
      },
      {
        id: 'i8-e3',
        type: 'text',
        content: 'You\'ll be asked to confirm your Social Security number to verify your identity before making changes.',
        isRedFlag: true,
        explanation: 'Legitimate benefits portals you\'re already enrolled in do not need you to re-submit your Social Security number through an email link.',
      },
    ],
    closing: 'Benefits Administration',
    whatYouShouldHaveNoticed:
      'The domain is a lookalike of your real company\'s name, and the linked page requests your Social Security number to "verify identity" — something an already-established benefits account would not need.',
    whatShouldYouDo:
      'Access benefits elections only through your company\'s known HR system, and never submit your Social Security number through a link in an email.',
    hints: [
      'Compare this domain carefully with your real company\'s domain.',
      'Consider what information a familiar benefits site should already have.',
      'Notice exactly what personal information is being requested.',
    ],
  },
  {
    id: 'i9',
    level: 'intermediate',
    senderName: 'SharePoint',
    senderEmail: 'no-reply@sharepoint-notify.com',
    senderIsRedFlag: true,
    senderExplanation: 'Real SharePoint notifications originate from Microsoft domains, not a standalone "-notify" domain.',
    subject: 'New file uploaded to Finance Shared Library',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject convincingly matches genuine SharePoint activity notifications.',
    timestamp: 'Thu, Oct 16 · 3:27 PM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'i9-e1',
        type: 'text',
        content: 'A new file, "2024_Compensation_Summary.xlsx," was uploaded to a library you have access to.',
        isRedFlag: false,
        explanation: 'This sounds like a plausible, routine internal notification.',
      },
      {
        id: 'i9-e2',
        type: 'link',
        content: 'Open File (simulated - not a real link, hover text shows sharepoint-notify.com)',
        isRedFlag: true,
        explanation: 'The link text references SharePoint, but the underlying domain is not a genuine Microsoft address.',
      },
      {
        id: 'i9-e3',
        type: 'text',
        content: 'For security, please re-enter your Microsoft 365 credentials to access this restricted file.',
        isRedFlag: true,
        explanation: 'Being prompted to re-enter your Microsoft 365 password through a non-Microsoft link is a common credential-phishing setup.',
      },
    ],
    closing: 'Microsoft SharePoint',
    whatYouShouldHaveNoticed:
      'The sending domain is not a genuine Microsoft domain, the "Open File" link goes elsewhere, and you\'re prompted to re-enter your Microsoft 365 password on that unofficial page.',
    whatShouldYouDo:
      'Access shared files by going directly to portal.office.com or your organization\'s SharePoint site rather than clicking email links, and never re-enter credentials on a prompted page.',
    hints: [
      'Check whether this sender is a genuine Microsoft domain.',
      'Hover over "Open File" to see its real destination.',
      'Notice what credentials you\'re asked to re-enter.',
    ],
  },
  {
    id: 'i10',
    level: 'intermediate',
    senderName: 'David Osei, Finance Director',
    senderEmail: 'david.osei@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches a legitimate internal finance leader\'s address.',
    subject: 'Quick approval needed before end of day',
    subjectIsRedFlag: false,
    subjectExplanation: 'An end-of-day approval request is common and unremarkable phrasing from a manager.',
    timestamp: 'Fri, Oct 17 · 3:58 PM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'i10-e1',
        type: 'text',
        content: 'I\'m finalizing a supplier payment before month-end close and need one more approval to release it today.',
        isRedFlag: false,
        explanation: 'This reads as a normal, plausible business explanation from a finance leader.',
      },
      {
        id: 'i10-e2',
        type: 'text',
        content: 'I\'m in back-to-back meetings, so just reply "approved" and I\'ll take care of the rest — no need to open the finance system.',
        isRedFlag: true,
        explanation: 'Bypassing your normal approval system, even when asked calmly and by a familiar-looking sender, removes the checks designed to catch fraudulent payments.',
      },
      {
        id: 'i10-e3',
        type: 'text',
        content: 'The payment amount is $18,400 to a new supplier account we onboarded last week.',
        isRedFlag: true,
        explanation: 'A large payment to a recently onboarded, unfamiliar account requested outside the normal approval process is a common business email compromise pattern.',
      },
    ],
    closing: 'Thanks for the quick turnaround,\nDavid',
    whatYouShouldHaveNoticed:
      'The request asks you to skip your normal finance-approval system and reply informally, for a sizeable payment to a recently added supplier account — a pattern used in business email compromise even when the sender looks legitimate.',
    whatShouldYouDo:
      'Always process approvals through your official finance system, and confirm any request to bypass normal procedures directly with the requester by phone before acting.',
    hints: [
      'Think about whether skipping the normal approval process makes sense here.',
      'Consider how new and unfamiliar the supplier account is.',
      'Notice the size of the payment being approved informally.',
    ],
  },

  // ----------------------------------------------------------------------
  // EXPERT (10) — sophisticated, professionally written, subtle indicators
  // ----------------------------------------------------------------------
  {
    id: 'e1',
    level: 'expert',
    senderName: 'Microsoft Account Team',
    senderEmail: 'account-security@microsoft-verify-secure.com',
    senderIsRedFlag: true,
    senderExplanation: 'Despite the professional branding, this domain is not a genuine Microsoft domain (microsoft.com or account.microsoft.com).',
    subject: 'We detected a new sign-in to your Microsoft account',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject line closely and convincingly mirrors real Microsoft security alerts.',
    timestamp: 'Mon, Nov 3 · 7:22 AM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'e1-e1',
        type: 'text',
        content: 'We noticed a new sign-in to your account from a device in Lagos, Nigeria on November 3 at 6:58 AM. If this was you, no action is needed.',
        isRedFlag: false,
        explanation: 'This mirrors genuine account-activity notifications and is written calmly, without demanding immediate action.',
      },
      {
        id: 'e1-e2',
        type: 'link',
        content: 'Review Recent Activity (simulated - not a real link, hover text shows microsoft-verify-secure.com)',
        isRedFlag: true,
        explanation: 'Even though the surrounding message is calm and professional, the link destination is not a real Microsoft domain.',
      },
      {
        id: 'e1-e3',
        type: 'text',
        content: 'If this wasn\'t you, secure your account by verifying your identity and confirming your recovery details.',
        isRedFlag: true,
        explanation: 'The phrase "confirming your recovery details" is a soft way of asking for credential or account-recovery information outside Microsoft\'s real account portal.',
      },
    ],
    closing: 'Microsoft Account Team',
    whatYouShouldHaveNoticed:
      'The message is calm and well-written with no obvious urgency, which is exactly why it\'s convincing — but the sending domain isn\'t genuinely Microsoft\'s, and the review link and "recovery details" request both point away from Microsoft\'s real systems.',
    whatShouldYouDo:
      'Check account activity by signing in directly at account.microsoft.com, typed manually into your browser, rather than through any link in the email.',
    hints: [
      'A calm, well-written email can still be fake — check the sending domain regardless of tone.',
      'Hover over "Review Recent Activity" to see where it actually leads.',
      'Notice the specific wording used around "recovery details."',
    ],
  },
  {
    id: 'e2',
    level: 'expert',
    senderName: 'Amara Okafor, CEO',
    senderEmail: 'a.okafor@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'The address matches the real CEO\'s known company email — this alone isn\'t suspicious.',
    subject: 'Confidential — need your discretion on something',
    subjectIsRedFlag: true,
    subjectExplanation: 'Framing a request as confidential, even subtly, is a common way to discourage you from checking with others before acting.',
    timestamp: 'Tue, Nov 4 · 8:03 AM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'e2-e1',
        type: 'text',
        content: 'I\'m working on a sensitive acquisition and can\'t discuss details yet, but I need your help with something time-sensitive this morning.',
        isRedFlag: true,
        explanation: 'Using confidentiality around a high-stakes business event (like an acquisition) is a common pretext to prevent verification with others.',
      },
      {
        id: 'e2-e2',
        type: 'text',
        content: 'Can you process an outgoing wire for $42,750 to our new legal counsel\'s escrow account? I\'ll send the details separately.',
        isRedFlag: true,
        explanation: 'An unusual wire transfer request tied to secrecy, arriving separately from normal channels, is a hallmark of business email compromise — even from an authentic-looking executive address.',
      },
      {
        id: 'e2-e3',
        type: 'text',
        content: 'I\'m on a flight most of today, so please don\'t call — email is easiest for now.',
        isRedFlag: true,
        explanation: 'Explicitly discouraging phone verification while requesting a large, unusual payment is a strong sign of impersonation, regardless of how legitimate the sender address appears.',
      },
    ],
    closing: 'Thanks for handling this,\nAmara',
    whatYouShouldHaveNoticed:
      'Even with a legitimate-looking sender address, the combination of confidentiality framing, an unusual and time-pressured wire request, and explicit discouragement of phone verification together indicate executive impersonation or a compromised account.',
    whatShouldYouDo:
      'Always verify unusual payment requests from executives through a separate, previously known contact method, regardless of stated unavailability, and follow your standard wire-approval process without exception.',
    hints: [
      'Consider why confidentiality is being emphasized here.',
      'Notice how the payment request is delivered outside the normal process.',
      'Pay attention to how the message tries to discourage verification.',
    ],
  },
  {
    id: 'e3',
    level: 'expert',
    senderName: 'IT Security',
    senderEmail: 'itsecurity@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches your real internal IT security team\'s address.',
    subject: 'Action needed: Confirm your MFA re-enrollment',
    subjectIsRedFlag: false,
    subjectExplanation: 'MFA re-enrollment communications are a normal, expected type of IT security message.',
    timestamp: 'Wed, Nov 5 · 9:41 AM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'e3-e1',
        type: 'text',
        content: 'As part of our security upgrade, all employees are being migrated to a new multi-factor authentication system this week.',
        isRedFlag: false,
        explanation: 'This is calm, plausible, and consistent with real organizational security rollouts.',
      },
      {
        id: 'e3-e2',
        type: 'text',
        content: 'You may receive a phone call or push notification asking you to approve or provide a code — please approve it so your access isn\'t interrupted.',
        isRedFlag: true,
        explanation: 'Instructing employees in advance to approve any MFA prompt, without verifying it originated from their own sign-in attempt, sets up an MFA-fatigue or push-bombing social engineering attack.',
      },
      {
        id: 'e3-e3',
        type: 'text',
        content: 'If you\'re contacted by phone for verification, please share the six-digit code shown on your device to confirm your identity.',
        isRedFlag: true,
        explanation: 'No legitimate IT process ever requires you to read your MFA code aloud to someone over the phone — this is a direct account-takeover technique.',
      },
    ],
    closing: 'IT Security Team',
    whatYouShouldHaveNoticed:
      'Even from what appears to be a real internal address, the instructions to approve unexpected MFA prompts and to read a one-time code over the phone are both classic MFA social-engineering techniques, not legitimate security procedures.',
    whatShouldYouDo:
      'Never approve an MFA prompt or share a one-time code unless you personally just initiated that sign-in. Report unexpected MFA requests or phone verification requests to your real security team through a known channel.',
    hints: [
      'Think about whether it\'s ever appropriate to approve an MFA prompt you didn\'t request.',
      'Consider what a one-time code is actually meant to protect.',
      'Notice the specific instruction about phone verification.',
    ],
  },
  {
    id: 'e4',
    level: 'expert',
    senderName: 'Microsoft 365',
    senderEmail: 'no-reply@microsoftonline.com',
    senderIsRedFlag: false,
    senderExplanation: 'This is a legitimate Microsoft 365 sending domain, which is exactly why this scenario is deceptive.',
    subject: 'An app is requesting access to your account',
    subjectIsRedFlag: false,
    subjectExplanation: 'App-consent notifications are a genuine, expected type of Microsoft 365 message.',
    timestamp: 'Thu, Nov 6 · 12:15 PM',
    greeting: 'Hello,',
    bodyElements: [
      {
        id: 'e4-e1',
        type: 'text',
        content: 'The app "Quarterly Report Viewer" is requesting the following permissions on your account: read your mail, read your files, and sign in as you.',
        isRedFlag: true,
        explanation: 'A generic, unfamiliar third-party app requesting broad permissions like reading mail and signing in as you is a classic OAuth consent-phishing attempt, even through a legitimate Microsoft consent screen.',
      },
      {
        id: 'e4-e2',
        type: 'link',
        content: 'Accept Permissions (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'Accepting broad, unfamiliar app permissions grants a third party ongoing access to your account without needing your password at all.',
      },
      {
        id: 'e4-e3',
        type: 'text',
        content: 'This request was sent because someone attempted to open a shared file using this application.',
        isRedFlag: false,
        explanation: 'This context line is plausible and often included in real consent-request flows.',
      },
    ],
    closing: 'Microsoft 365',
    whatYouShouldHaveNoticed:
      'This message comes from a genuine Microsoft domain, but the unfamiliar app is requesting unusually broad permissions — including the ability to read your mail and sign in as you — which is a hallmark of OAuth consent-phishing, regardless of how legitimate the notification itself looks.',
    whatShouldYouDo:
      'Never approve permission requests from unfamiliar apps. Verify the app\'s legitimacy with your IT/security team first, and review or revoke app permissions through your account\'s security settings.',
    hints: [
      'A legitimate sending domain doesn\'t guarantee the request itself is safe — look at what is actually being asked.',
      'Consider how broad the requested permissions are.',
      'Think about whether you recognize and expected this application.',
    ],
  },
  {
    id: 'e5',
    level: 'expert',
    senderName: 'Facilities & Security',
    senderEmail: 'facilities@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches your real internal facilities team address.',
    subject: 'New visitor check-in process — scan to register',
    subjectIsRedFlag: false,
    subjectExplanation: 'A visitor check-in process update is a believable, low-stakes internal announcement.',
    timestamp: 'Fri, Nov 7 · 10:26 AM',
    greeting: 'Hi Team,',
    bodyElements: [
      {
        id: 'e5-e1',
        type: 'text',
        content: 'Starting next week, all guests will check in using a QR code posted at the front desk instead of the paper sign-in sheet.',
        isRedFlag: false,
        explanation: 'This describes a plausible, ordinary operational change on its own.',
      },
      {
        id: 'e5-e2',
        type: 'qrcode',
        content: '[QR code image] "Scan to preview the new check-in form" (simulated - not a real QR code)',
        isRedFlag: true,
        explanation: 'QR codes bypass normal link-preview checks because you can\'t see the destination before scanning — attackers use them to send you to credential-harvesting pages your usual instincts might not catch.',
      },
      {
        id: 'e5-e3',
        type: 'text',
        content: 'After scanning, sign in with your company account to preview how the form will look for guests.',
        isRedFlag: true,
        explanation: 'There\'s no legitimate reason a guest check-in preview would require you to sign in with your own company account credentials.',
      },
    ],
    closing: 'Facilities & Security',
    whatYouShouldHaveNoticed:
      'The QR code hides its real destination until scanned, and being asked to sign in with your company account just to "preview" a guest form has no legitimate purpose — together these suggest QR-code (quishing) credential phishing.',
    whatShouldYouDo:
      'Avoid scanning QR codes from emails on devices with access to company accounts. Verify new processes with facilities directly, and never sign in with work credentials after scanning an unexpected code.',
    hints: [
      'Consider what you can and can\'t see before scanning a QR code.',
      'Think about why a preview would need your company login.',
      'Notice who this message is asking you to sign in as.',
    ],
  },
  {
    id: 'e6',
    level: 'expert',
    senderName: 'Marcus Webb, VP Engineering',
    senderEmail: 'marcus.webb@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches a legitimate internal VP\'s address.',
    subject: 'Can you pull the customer export for the board deck?',
    subjectIsRedFlag: false,
    subjectExplanation: 'A data request tied to a board presentation is a believable ask from engineering leadership.',
    timestamp: 'Mon, Nov 10 · 2:48 PM',
    greeting: 'Hey,',
    bodyElements: [
      {
        id: 'e6-e1',
        type: 'text',
        content: 'The board deck needs updated customer metrics by tomorrow morning. Can you export the customer contact list from the CRM and send it over?',
        isRedFlag: true,
        explanation: 'A bulk customer-data export request, even from a familiar internal address, should go through your normal data-handling and approval process rather than an informal one-off request.',
      },
      {
        id: 'e6-e2',
        type: 'text',
        content: 'Just export it as a spreadsheet and attach it here directly — no need to go through the data request form this time, we\'re short on time.',
        isRedFlag: true,
        explanation: 'Explicitly bypassing your normal data-request approval process, especially under time pressure, is a common technique whether from a genuine but compromised account or an impersonation.',
      },
      {
        id: 'e6-e3',
        type: 'text',
        content: 'I\'ll be presenting this afternoon so the sooner the better — appreciate you jumping on it.',
        isRedFlag: false,
        explanation: 'On its own, this closing line is a normal, polite way to close a work request.',
      },
    ],
    closing: 'Thanks,\nMarcus',
    whatYouShouldHaveNoticed:
      'Regardless of how familiar the sender appears, a request to export bulk customer data while explicitly skipping the normal approval process is a red flag — this pattern is used both in account compromise and in social engineering that relies on trusted internal relationships.',
    whatShouldYouDo:
      'Always route data export requests through your official data-request process, and confirm any request to bypass it directly with the requester through a separate communication channel.',
    hints: [
      'Consider what your normal process is for exporting customer data.',
      'Notice which part of that process is being skipped, and why.',
      'Think about how time pressure is being used here.',
    ],
  },
  {
    id: 'e7',
    level: 'expert',
    senderName: 'Corporate Travel Desk',
    senderEmail: 'travel@corporate-travel-services.com',
    senderIsRedFlag: true,
    senderExplanation: 'This domain is generic and not tied to your company or its actual travel vendor, despite sounding official.',
    subject: 'Your upcoming flight itinerary requires confirmation',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject convincingly mirrors real travel-confirmation emails.',
    timestamp: 'Tue, Nov 11 · 6:05 AM',
    greeting: 'Dear Traveler,',
    bodyElements: [
      {
        id: 'e7-e1',
        type: 'text',
        content: 'Your itinerary for next week\'s conference travel has been generated and is pending confirmation before ticketing.',
        isRedFlag: false,
        explanation: 'This wording is calm and plausible, matching genuine travel-booking confirmations.',
      },
      {
        id: 'e7-e2',
        type: 'attachment',
        content: 'Itinerary_Confirmation.pdf.html (simulated - not a real file)',
        isRedFlag: true,
        explanation: 'A file with a double extension like ".pdf.html" is designed to look like a harmless PDF while actually opening as a webpage — often a hidden phishing login form.',
      },
      {
        id: 'e7-e3',
        type: 'text',
        content: 'Open the attached itinerary and sign in with your corporate email to confirm your seat selection.',
        isRedFlag: true,
        explanation: 'Being asked to enter your corporate email credentials inside a travel attachment, rather than your travel provider\'s real booking site, is a credential-phishing technique.',
      },
    ],
    closing: 'Corporate Travel Desk',
    whatYouShouldHaveNoticed:
      'The sending domain isn\'t tied to a known travel vendor, the attachment uses a disguised double file extension, and it requests your corporate login inside the file rather than through a real booking platform.',
    whatShouldYouDo:
      'Confirm travel itineraries only through your company\'s designated travel platform or booking agent, and never enter credentials inside a downloaded attachment.',
    hints: [
      'Look closely at the full file extension on the attachment.',
      'Consider whether this sender is your company\'s actual travel vendor.',
      'Notice where you\'re asked to enter your login information.',
    ],
  },
  {
    id: 'e8',
    level: 'expert',
    senderName: 'LinkedIn',
    senderEmail: 'messaging-noreply@linkedin-jobs-alert.com',
    senderIsRedFlag: true,
    senderExplanation: 'Genuine LinkedIn emails come from "linkedin.com" — this domain only imitates the branding.',
    subject: 'You have a new message from a recruiter at a Fortune 500 company',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject line is written to be flattering and plausible, closely resembling real LinkedIn notifications.',
    timestamp: 'Wed, Nov 12 · 5:33 PM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'e8-e1',
        type: 'text',
        content: 'A recruiter has sent you a message about a confidential leadership role. Sign in to view the full details and respond.',
        isRedFlag: false,
        explanation: 'This is calm, flattering, and closely matches genuine recruiter outreach — which is exactly what makes it believable.',
      },
      {
        id: 'e8-e2',
        type: 'link',
        content: 'View Message (simulated - not a real link, hover text shows linkedin-jobs-alert.com)',
        isRedFlag: true,
        explanation: 'The button references LinkedIn, but the underlying link goes to a domain that only imitates it.',
      },
      {
        id: 'e8-e3',
        type: 'text',
        content: 'For your security, please re-enter your LinkedIn email and password to view this confidential message.',
        isRedFlag: true,
        explanation: 'LinkedIn does not require you to re-enter your password through an email link to read a message — this is a credential-harvesting request.',
      },
    ],
    closing: 'The LinkedIn Team',
    whatYouShouldHaveNoticed:
      'The flattering, confidential framing is designed to lower your guard, but the sending domain isn\'t genuinely LinkedIn\'s, the link goes elsewhere, and you\'re asked to re-enter your password just to read a message.',
    whatShouldYouDo:
      'View LinkedIn messages by opening linkedin.com directly or the LinkedIn app rather than clicking email links, and never re-enter your password on a prompted page.',
    hints: [
      'A flattering message can still be fake — check the sending domain regardless.',
      'Hover over "View Message" to see its real destination.',
      'Notice what you\'re asked to provide just to read a message.',
    ],
  },
  {
    id: 'e9',
    level: 'expert',
    senderName: 'Legal Department',
    senderEmail: 'legal@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches your real internal legal department address.',
    subject: 'Litigation hold notice — response required',
    subjectIsRedFlag: false,
    subjectExplanation: 'Litigation hold notices are genuine, serious internal communications that legal departments do send.',
    timestamp: 'Thu, Nov 13 · 11:47 AM',
    greeting: 'Dear Colleague,',
    bodyElements: [
      {
        id: 'e9-e1',
        type: 'text',
        content: 'You have been identified as a custodian in an active litigation matter. You are required to preserve all related documents and correspondence.',
        isRedFlag: false,
        explanation: 'This is calm, formal language consistent with real legal hold notices.',
      },
      {
        id: 'e9-e2',
        type: 'text',
        content: 'Please review the attached list of custodians and confirm your compliance by entering your network credentials on the linked acknowledgment form.',
        isRedFlag: true,
        explanation: 'A legitimate legal hold acknowledgment would use your existing internal HR or document system login — not a separate form requesting your network credentials again.',
      },
      {
        id: 'e9-e3',
        type: 'link',
        content: 'Acknowledge Litigation Hold (simulated - not a real link)',
        isRedFlag: true,
        explanation: 'Even in a formal, believable legal context, an unfamiliar acknowledgment link requesting credentials is a common phishing vector — it should be verified before use.',
      },
    ],
    closing: 'Office of the General Counsel',
    whatYouShouldHaveNoticed:
      'The message is formal and plausible, matching a genuine legal process, but the acknowledgment form asks you to re-enter your network credentials on an external link — something a real internal legal system would not need.',
    whatShouldYouDo:
      'Verify any legal hold notice directly with your legal department by phone or in person before entering credentials anywhere, even when the message and formatting look entirely legitimate.',
    hints: [
      'A formal, serious tone doesn\'t rule out phishing — check what\'s actually being requested.',
      'Consider whether your existing internal systems would need a separate credential entry here.',
      'Notice where the acknowledgment link is asking you to go.',
    ],
  },
  {
    id: 'e10',
    level: 'expert',
    senderName: 'Nathan Brooks, CFO',
    senderEmail: 'nathan.brooks@yourcompany.com',
    senderIsRedFlag: false,
    senderExplanation: 'This matches the real CFO\'s known internal address — there is nothing visibly wrong with the sender itself.',
    subject: 'Vendor payment change — need this processed today',
    subjectIsRedFlag: false,
    subjectExplanation: 'This subject reads as an ordinary, professional finance request.',
    timestamp: 'Fri, Nov 14 · 1:19 PM',
    greeting: 'Hi,',
    bodyElements: [
      {
        id: 'e10-e1',
        type: 'text',
        content: 'Our supplier, Meridian Logistics, notified us this week that they\'ve moved to a new bank for international payments due to a merger.',
        isRedFlag: false,
        explanation: 'This is calm, professional, and a believable business explanation on its own.',
      },
      {
        id: 'e10-e2',
        type: 'text',
        content: 'I\'ve confirmed this with their account manager over email and attached the new remittance details. Please update our vendor file and process today\'s invoice to the new account.',
        isRedFlag: true,
        explanation: 'Stating that verification happened "over email" with the vendor is not the same as an independent, out-of-band confirmation — email threads themselves can be part of the same compromise.',
      },
      {
        id: 'e10-e3',
        type: 'text',
        content: 'I know this is a fairly large transfer, but the merger paperwork checks out and they need it processed before their banking transition completes Monday.',
        isRedFlag: true,
        explanation: 'A large, unusual banking change justified by a deadline — even when explained calmly and thoroughly by a legitimate-seeming executive — is the exact pattern used in vendor business email compromise.',
      },
    ],
    closing: 'Let me know once it\'s done,\nNathan',
    whatYouShouldHaveNoticed:
      'Despite a completely legitimate-looking sender and a calm, thorough, professional explanation, the underlying request — a large banking change for a vendor, "verified" only through email and justified by a deadline — matches a well-executed business email compromise.',
    whatShouldYouDo:
      'Verify all vendor banking changes through an independent channel, such as a phone call to a number from a prior invoice — never rely on confirmation that happened only through email, no matter how convincing or senior the requester appears.',
    hints: [
      'Consider how the vendor\'s bank change was actually verified.',
      'Notice the size of the payment and the deadline attached to it.',
      'Think about whether "checks out" is the same as independently confirmed.',
    ],
  },
]
