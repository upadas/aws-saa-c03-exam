import { generatedQuestions } from '../../aws-saa-c03-phase1-4/phase4_question_bank_1250.js'

const generatedDomainToAppDomain = {
  Security: 'Secure Architectures',
  Resilience: 'Resilient Architectures',
  Performance: 'High-Performing Architectures',
  Cost: 'Cost-Optimized Architectures',
}

const domainSetCounts = {
  'Secure Architectures': 3,
  'Resilient Architectures': 3,
  'High-Performing Architectures': 2,
  'Cost-Optimized Architectures': 2,
}

const masteryCorrectVariantsRequired = 3

const choiceWords = {
  1: 'ONE',
  2: 'TWO',
  3: 'THREE',
}

const domainStudyGuardrails = {
  Security: {
    context: 'The environment is already in private subnets with centralized logging, and the security team will reject long-lived credentials, public access shortcuts, or broad administrator policies.',
    correct: [
      'Scope IAM and resource policies to the exact actions, principals, and resources required by the workload.',
      'Keep the access path auditable with CloudTrail, AWS Config, or service-native logs so policy drift can be detected.',
    ],
    distractors: [
      'Open the resource temporarily and rely on source IP filtering as the primary control.',
      'Use a shared administrator credential and rotate it after each deployment.',
      'Move the workload to a public subnet so the service can be reached directly.',
    ],
  },
  Resilience: {
    context: 'The business wants the managed AWS pattern with automatic recovery where possible; manual runbooks alone are not acceptable for the primary failure path.',
    correct: [
      'Spread the design across multiple Availability Zones or failure domains when the selected service supports it.',
      'Configure health checks, retries, alarms, or failover tests so failures are detected and recovered automatically.',
    ],
    distractors: [
      'Rely on a larger single resource and manually replace it after users report errors.',
      'Keep the recovery copy in the same failure domain to simplify routing.',
      'Disable health checks during incidents to avoid replacing unhealthy capacity.',
    ],
  },
  Performance: {
    context: 'The workload has measurable latency or throughput pressure, and the team wants to solve the bottleneck without blindly scaling every component.',
    correct: [
      'Use CloudWatch or service metrics with a realistic load test to verify that the selected design removes the bottleneck.',
      'Keep frequently accessed data or traffic close to consumers by using caching, reader endpoints, partitioning, or edge networking where it applies.',
    ],
    distractors: [
      'Increase one central compute instance and leave the data path unchanged.',
      'Move all data to archival storage before measuring access patterns.',
      'Disable service metrics to reduce ingestion overhead during tuning.',
    ],
  },
  Cost: {
    context: 'The solution must reduce spend without weakening durability, availability, security, or the stated user experience.',
    correct: [
      'Use Cost Explorer, allocation tags, or AWS Budgets to validate that the design reduces the intended cost driver.',
      'Automate lifecycle, right-sizing, or scaling controls so unused capacity is reduced after demand changes.',
    ],
    distractors: [
      'Choose the cheapest storage or compute class even if it changes the access, durability, or recovery requirement.',
      'Disable monitoring and backups first because they are visible line items on the bill.',
      'Purchase peak capacity for the full term before measuring baseline and burst demand.',
    ],
  },
}

const triggerInsights = [
  {
    pattern: /ec2.*without stored keys|without stored keys|stored credentials|stored keys/i,
    detail: 'The application needs AWS API access from EC2, but storing IAM user keys in code, user data, or environment variables would create long-lived credential risk.',
  },
  {
    pattern: /s3.*private|private.*s3|direct s3|s3 url|cloudfront.*s3|origin access|oai|oac/i,
    detail: 'If CloudFront or private VPC access is involved, distinguish the private origin/access-control mechanism from merely making the S3 bucket reachable.',
  },
  {
    pattern: /transfer acceleration|accelerated.*upload|large file uploads|global.*uploads/i,
    detail: 'For globally distributed uploads, compare S3 Transfer Acceleration and multipart upload against changing the origin Region or over-scaling compute.',
  },
  {
    pattern: /api gateway.*private|ecs.*api gateway|ec2.*api gateway|vpc link/i,
    detail: 'API Gateway does not attach security groups to reach private compute directly; private integrations require the correct VPC integration pattern.',
  },
  {
    pattern: /as2|sftp|transfer family|datasync/i,
    detail: 'Watch for protocol support: DataSync is strong for NFS/SMB-style movement, while AWS Transfer Family is the right cue for managed SFTP or AS2.',
  },
  {
    pattern: /dms|live.*database|source.*online|database migration|stream.*s3/i,
    detail: 'Separate live replication and streaming cues from one-time file movement; DMS and DataSync are not interchangeable.',
  },
  {
    pattern: /fast snapshot restore|fsr|snapshot.*restore|restore.*ec2/i,
    detail: 'Low-RTO restores from EBS snapshots need Fast Snapshot Restore in the target Availability Zone, not just a copied snapshot.',
  },
  {
    pattern: /global accelerator|udp|static ip|dns caching|blue-green/i,
    detail: 'Global Accelerator is the cue when static anycast IPs, UDP/TCP acceleration, or DNS-cache avoidance matters more than HTTP caching.',
  },
  {
    pattern: /rds.*multi-az db cluster|read scaling|reader endpoint|offload reads/i,
    detail: 'For RDS, distinguish legacy Multi-AZ failover from Multi-AZ DB clusters or read replicas when the scenario also needs read scaling.',
  },
  {
    pattern: /glue.*bookmark|reprocess|etl/i,
    detail: 'Glue job bookmarks are the cue when the problem is repeated processing of data already handled by a prior successful run.',
  },
]

const optionTextRewrites = [
  [/^Store IAM user keys in environment variables$/i, 'Store an IAM user access key in encrypted environment variables on the instance and rotate it periodically'],
  [/^Embed credentials in application code$/i, 'Embed an IAM user access key in the application configuration and rely on deployment controls to protect it'],
  [/^Make the target resource public$/i, 'Make the target resource public and restrict clients later with source IP or application-level checks'],
  [/^Give every user the same administrator key$/i, 'Give users one shared administrator credential and rotate it after access reviews'],
  [/^Use EC2 status checks only$/i, 'Rely only on EC2 status checks and handle application-level failures with manual operational response'],
  [/^Create a larger instance$/i, 'Scale up the instance size without changing health checks, failover, or recovery behavior'],
  [/^Reduce desired capacity$/i, 'Reduce desired capacity and replace failed instances manually after alarms notify operators'],
  [/^Move the origin to one central region only$/i, 'Move the origin to one central Region and expect all users to use that regional path'],
  [/^Increase origin instance size only$/i, 'Increase only the origin instance size while leaving caching and edge routing unchanged'],
  [/^Use S3 Glacier$/i, 'Move the active content to S3 Glacier storage classes before measuring retrieval latency requirements'],
  [/^Use Dedicated Hosts$/i, 'Move the workload to Dedicated Hosts before measuring whether tenancy is the cost driver'],
  [/^Use provisioned IOPS$/i, 'Provision maximum IOPS for the workload even though the requirement is not storage latency-bound'],
  [/^Use On-Demand only without evaluating flexibility$/i, 'Use only On-Demand capacity for all baseline and burst work without evaluating interruption tolerance'],
]

function studyGuardrailFor(item) {
  return domainStudyGuardrails[item.domain] || domainStudyGuardrails.Security
}

function insightFor(item) {
  const haystack = `${item.service} ${item.trigger} ${item.text} ${item.answerSummary}`.toLowerCase()
  return triggerInsights.find(insight => insight.pattern.test(haystack))?.detail
}

function displayedTypeFor(item) {
  if (item.variant === 5 && item.difficulty === 'Hard') return 'choose-three'
  if (item.variant === 3 && item.difficulty !== 'Easy') return 'choose-two'
  return 'single'
}

function rewriteOptionText(text) {
  return optionTextRewrites.find(([pattern]) => pattern.test(text))?.[1] || text
}

function supportingCorrectOptions(item, count) {
  const guardrail = studyGuardrailFor(item)
  return guardrail.correct.slice(0, Math.max(0, count - 1)).map((text, index) => ({
    id: String.fromCharCode(101 + index),
    text,
    originalIndex: 4 + index,
    correct: true,
    explanation: `This complements the main design by preserving the ${item.domain.toLowerCase()} requirement instead of treating the service choice as the only control.`,
  }))
}

function supportingDistractorOptions(item, existingCount) {
  const guardrail = studyGuardrailFor(item)
  return guardrail.distractors.slice(0, Math.max(1, 6 - existingCount)).map((text, index) => ({
    id: String.fromCharCode(101 + existingCount + index),
    text,
    originalIndex: existingCount + index,
    correct: false,
    explanation: 'This sounds operationally plausible, but it changes or weakens one of the scenario constraints instead of satisfying it.',
  }))
}

function buildPrompt(item, displayedType) {
  const guardrail = studyGuardrailFor(item)
  const insight = insightFor(item)
  const choiceCount = displayedType === 'choose-three' ? 3 : displayedType === 'choose-two' ? 2 : 1
  const directive = choiceCount > 1
    ? `Which ${choiceWords[choiceCount]} choices should the solutions architect include?`
    : 'Which option is the best recommendation?'
  const scenarioLead = item.variant >= 4
    ? 'A solutions architect is reviewing a production design after a failed proof of concept.'
    : item.text
      .replace(/\ba online\b/gi, 'an online')
      .replace(/\s*(Which solution should a solutions architect recommend|Which architecture best meets the requirement|What should the architect implement|Which option best balances these requirements|Which choice meets the requirement without adding unnecessary complexity)\?\s*$/i, '.')
      .replace(/\.\.+/g, '.')
      .trim()
  const nuance = insight ? ` ${insight}` : ''
  const requirement = scenarioLead.toLowerCase().includes(item.trigger.toLowerCase())
    ? ''
    : ` The key requirement is: ${item.trigger}.`

  return `${scenarioLead} ${guardrail.context}${requirement}${nuance} ${directive}`
}

function normalizeQuestion(item) {
  const domain = generatedDomainToAppDomain[item.domain] || item.domain
  const sourceCorrectOptionIds = item.correctOptionIds || item.options
    .filter(option => option.correct)
    .map(option => option.id)
  const displayedType = displayedTypeFor(item)
  const correctCount = displayedType === 'choose-three' ? 3 : displayedType === 'choose-two' ? 2 : 1
  const baseOptions = item.options.map((option, index) => ({
    id: option.id,
    text: rewriteOptionText(option.text),
    originalIndex: index,
    correct: Boolean(option.correct),
    explanation: option.explanation,
  }))
  const options = [
    ...baseOptions,
    ...supportingCorrectOptions(item, correctCount),
  ]
  const finalOptions = [
    ...options,
    ...(displayedType === 'single' ? [] : supportingDistractorOptions(item, options.length)),
  ]
  const correctOptionIds = finalOptions
    .filter(option => option.correct)
    .map(option => option.id)

  return {
    id: item.id,
    objectiveId: item.objectiveId,
    objectiveName: `${item.service}: ${item.trigger}`,
    variant: item.variant,
    domain,
    sourceDomain: item.domain,
    service: item.service,
    difficulty: item.difficulty,
    type: correctOptionIds.length > 1 ? 'multiple' : 'single',
    question: buildPrompt(item, displayedType),
    options: finalOptions,
    answers: correctOptionIds,
    correctOptionIds,
    sourceCorrectOptionIds,
    answerSummary: item.answerSummary,
    explanation: item.explanation,
    trigger: item.trigger,
    adaptive: {
      ...item.adaptive,
      minimumCorrectVariantsForMastery: Math.max(
        masteryCorrectVariantsRequired,
        item.adaptive?.minimumCorrectVariantsForMastery || masteryCorrectVariantsRequired,
      ),
    },
    services: [item.service],
    tags: [
      item.domain,
      item.service,
      item.difficulty,
      item.objectiveId,
      `variant-${item.variant}`,
      item.trigger,
      item.sourceType,
    ].filter(Boolean),
  }
}

export const questions = generatedQuestions.map(normalizeQuestion)

const objectiveGroupsByDomain = Object.fromEntries(
  Object.keys(domainSetCounts).map(domain => [
    domain,
    [...questions
      .filter(question => question.domain === domain)
      .reduce((groups, question) => {
        const group = groups.get(question.objectiveId) || []
        group.push(question)
        groups.set(question.objectiveId, group)
        return groups
      }, new Map())
      .values()]
      .map(group => group.sort((a, b) => a.variant - b.variant)),
  ]),
)

function practiceSetQuestionsForDomain(domain, count, setIndex) {
  const groups = objectiveGroupsByDomain[domain]
  const offset = setIndex * count

  return Array.from({ length: count }, (_, slot) => {
    const group = groups[(offset + slot) % groups.length]
    return group[(setIndex + slot) % group.length]
  })
}

export const questionSets = Array.from({ length: 10 }, (_, index) => {
  const setNumber = index + 1
  const questionIds = Object.entries(domainSetCounts).flatMap(([domain, count]) => (
    practiceSetQuestionsForDomain(domain, count, index)
      .map(question => question.id)
  ))

  return {
    id: `set-${setNumber}`,
    name: `Practice Set ${setNumber}`,
    description: '10 original scenario variants weighted close to the SAA-C03 blueprint.',
    questionIds,
  }
})
