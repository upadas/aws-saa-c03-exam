import { generatedQuestions } from '../../aws-saa-c03-phase1-4/phase4_question_bank_1250.js'
import { proPracticeQuestions } from './proPracticeBank.js'
import {
  EXAM_DOMAIN_COUNTS,
  PRACTICE_DOMAIN_PATTERN,
  PRACTICE_RESPONSE_PATTERN,
} from '../quizLogic.js'

const generatedDomainToAppDomain = {
  Security: 'Secure Architectures',
  Resilience: 'Resilient Architectures',
  Performance: 'High-Performing Architectures',
  Cost: 'Cost-Optimized Architectures',
}

const masteryCorrectVariantsRequired = 3

const choiceWords = {
  1: 'ONE',
  2: 'TWO',
  3: 'THREE',
}

const domainStudyGuardrails = {
  Security: {
    context: 'The environment already has centralized logging, and the security team will reject long-lived credentials, public access shortcuts, or broad administrator policies.',
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
    pattern: /transfer acceleration|accelerated.*upload|large file uploads|global.*uploads/i,
    detail: 'For globally distributed uploads, compare S3 Transfer Acceleration and multipart upload against changing the origin Region or over-scaling compute.',
  },
  {
    pattern: /private subnets.*s3|s3.*without nat|gateway.*s3|s3 gateway/i,
    detail: 'For private VPC access to S3, distinguish a gateway endpoint and route-table update from NAT egress or CloudFront origin controls.',
  },
  {
    pattern: /direct s3|s3 url|cloudfront.*s3|origin access|oai|oac|bypass cloudfront/i,
    detail: 'If CloudFront or private VPC access is involved, distinguish the private origin/access-control mechanism from merely making the S3 bucket reachable.',
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
    pattern: /dms|live.*database|source.*online|database migration|stream(?:ing)? data.*s3|s3.*firehose/i,
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

const styleProfiles = [
  {
    pattern: /IAM|Advanced Identity|Organizations and Accounts/i,
    context: 'The design review includes cross-account boundaries, console usability, and audit requirements, so the answer must separate identity, resource policy, and network controls instead of treating them as interchangeable.',
    correct: [
      'Use short-lived credentials or role assumption with a narrowly scoped policy for the exact principal and resource.',
      'Add the matching trust, resource, or condition policy so the permission works without broad account-level access.',
    ],
    distractors: [
      'Create duplicate IAM users in each account and share access keys through a secured deployment pipeline.',
      'Use a security group rule as the primary authorization control for an AWS API call.',
      'Grant administrator access temporarily and rely on CloudTrail to detect misuse after the fact.',
    ],
  },
  {
    pattern: /KMS|Data Protection|Database Security|Secrets and Certificates/i,
    context: 'Compliance requires encryption, rotation or lifecycle controls where supported, and evidence for auditors without custom key-handling scripts.',
    correct: [
      'Use an AWS managed or customer managed key pattern that supports the stated rotation, access, and audit requirements.',
      'Grant decrypt or secret access in both the identity policy and the key, secret, or resource policy where that service requires it.',
    ],
    distractors: [
      'Use customer-provided keys so the application can rotate keys locally without KMS audit events.',
      'Store the secret or key material in user data and rely on instance encryption for protection.',
      'Encrypt only the backup copy and leave the primary data store unchanged.',
    ],
  },
  {
    pattern: /S3 Security|S3 Durability and Recovery|S3 Cost|CloudFront Access/i,
    context: 'The workload uses S3 as a durable origin or data store, and the constraints include direct-URL protection, lifecycle behavior, object immutability, or private access from a VPC.',
    correct: [
      'Apply the S3 feature that matches the data-access lifecycle, such as Object Lock, legal hold, lifecycle transition, replication, or a gateway endpoint route.',
      'Use the bucket policy, endpoint policy, or CloudFront origin access control so access is private and limited to the intended path.',
    ],
    distractors: [
      'Move active objects directly to an archival class before checking retrieval and availability requirements.',
      'Use a NAT gateway or internet gateway as the primary control for S3 authorization.',
      'Make the bucket public and depend on application code to reject unauthorized object requests.',
    ],
  },
  {
    pattern: /Private Connectivity|Network Security|Advanced Networking|Networking Performance|Network Cost/i,
    context: 'The network design must distinguish public AWS service access, private VPC routing, hybrid routes, internet egress, and AZ-level failure isolation.',
    correct: [
      'Use the route table, endpoint, NAT, Direct Connect, or PrivateLink pattern that matches the traffic destination and keeps failure domains independent.',
      'Advertise or propagate only the specific prefixes required instead of replacing all internet routing with a default path through AWS.',
    ],
    distractors: [
      'Add a second default route to the same subnet route table and expect AWS to choose based on destination health.',
      'Use an egress-only internet gateway for IPv4 traffic from private subnets.',
      'Route all public internet traffic through Direct Connect when only AWS public service prefixes must use that link.',
    ],
  },
  {
    pattern: /EC2 and Auto Scaling|EC2 Performance|EC2 Cost|Infrastructure Recovery/i,
    context: 'The workload has variable demand or recovery requirements, so the answer must combine health checks, purchase model, and failure-domain placement rather than only changing instance size.',
    correct: [
      'Use Auto Scaling, launch templates, or mixed purchase options to match baseline, burst, and interruption-tolerant capacity.',
      'Use load balancer or application health checks so unhealthy capacity is replaced automatically in the right Availability Zone.',
    ],
    distractors: [
      'Scale up a single instance and keep all replacement logic in an operator runbook.',
      'Use Spot capacity for the entire workload even when a noninterruptible baseline is required.',
      'Restore from a copied snapshot without enabling faster restore behavior when the RTO depends on low-latency volume creation.',
    ],
  },
  {
    pattern: /RDS and Aurora|RDS Performance|Database Cost|Advanced Database/i,
    context: 'The database tier has availability, reporting, or migration constraints, so the answer must separate failover, read scaling, online replication, and backup/restore behavior.',
    correct: [
      'Use the managed database feature that matches the constraint, such as Multi-AZ, reader endpoints, read replicas, Aurora, or DMS ongoing replication.',
      'Keep recovery or migration data synchronized often enough to satisfy the stated RTO and RPO.',
    ],
    distractors: [
      'Send reporting traffic to a passive Multi-AZ standby that is not available for reads.',
      'Use snapshots alone for a workload that must stay online and synchronized during migration.',
      'Store database backups on instance store volumes because they are fast to access.',
    ],
  },
  {
    pattern: /Messaging and Decoupling|Event Routing|API and Application Security|Containers and Serverless|Serverless Performance/i,
    context: 'The application is event driven or API based, and the design must preserve ordering, retry behavior, least privilege, or private integration semantics.',
    correct: [
      'Use the managed integration that matches the event source and failure mode, such as resource-based Lambda permission, SQS FIFO, an on-failure destination, or VPC Link.',
      'Keep producers and consumers decoupled so downstream systems can retry independently without dropping events.',
    ],
    distractors: [
      'Invoke every downstream target synchronously from one function so failures are visible immediately.',
      'Use a standard queue when strict ordering is the stated requirement.',
      'Attach security groups directly to API Gateway instead of using the supported private integration pattern.',
    ],
  },
  {
    pattern: /CloudFront and Edge|Data Transfer Performance|Route 53 and Global Routing/i,
    context: 'Users are globally distributed, and the answer must distinguish HTTP caching, static anycast routing, UDP/TCP acceleration, DNS failover, and large-upload acceleration.',
    correct: [
      'Use the edge or routing service that matches the protocol and latency requirement, such as CloudFront, Global Accelerator, Route 53 health checks, or S3 Transfer Acceleration.',
      'Keep the origin or endpoint design compatible with failover, cache behavior, and the required protocol.',
    ],
    distractors: [
      'Use CloudFront for UDP traffic or non-HTTP protocols that require static anycast IP routing.',
      'Rely only on DNS TTL changes when the problem is DNS caching during a cutover.',
      'Move all global users to one central Region and only increase the origin size.',
    ],
  },
  {
    pattern: /Analytics|Logging and Incident Response|Detection and Governance|Observability and Governance Cost/i,
    context: 'The operations team needs queryable evidence, alerting with low noise, or incremental processing with minimal custom code.',
    correct: [
      'Use the service-native tracking feature, such as CloudWatch log subscription, Glue bookmarks, Config rules, CloudTrail, or composite alarms.',
      'Store or stream the operational data to the analytics target without reprocessing all historical data on every run.',
    ],
    distractors: [
      'Delete source data immediately after each job so duplicate processing cannot occur.',
      'Use one noisy metric alarm for every condition even when the requirement depends on multiple signals together.',
      'Build a custom scheduler to reread all historical objects because managed state tracking is unavailable.',
    ],
  },
  {
    pattern: /Storage Resilience|EBS and File Systems|Storage and Backup Cost|Data Migration and Replication|Migration Cost/i,
    context: 'The storage or migration plan must match file, block, object, protocol, throughput, and offline-transfer constraints.',
    correct: [
      'Choose the movement or storage service that matches the data shape, such as DataSync for file movement, Storage Gateway for hybrid block or file patterns, Transfer Family for SFTP or AS2, Snowball for offline transfer, or FSx for specialized file protocols.',
      'Place the migration or storage target so applications keep the required latency, durability, and shared-access behavior.',
    ],
    distractors: [
      'Use DataSync for AS2 transfers even though the managed protocol support belongs to AWS Transfer Family.',
      'Use S3 for a single object larger than the service object-size limit.',
      'Copy multi-terabyte data manually over a saturated internet link when no bandwidth is available.',
    ],
  },
]

const domainScenarioOpeners = {
  Security: [
    'A regulated SaaS company is moving a workload from a pilot account into production, and the architecture review is focused on auditability, least privilege, and blast radius.',
    'A healthcare analytics company operates multiple AWS accounts and must satisfy an internal security review before the next production release.',
    'A financial services platform is replacing manually managed access patterns with managed AWS controls before auditors review the design.',
  ],
  Resilience: [
    'An ecommerce platform is preparing for seasonal traffic and must remove single points of failure from a workload that is already receiving production traffic.',
    'A media company has an application that works during normal load but must continue operating through AZ impairments, retries, and planned releases.',
    'A business-critical application has recovery objectives that must be proven during an operational review, not only documented in a runbook.',
  ],
  Performance: [
    'A global application team is investigating latency and throughput complaints after a proof of concept passed functional testing but failed under realistic load.',
    'A data platform is scaling from a regional pilot to global users, and the architects must improve the bottleneck without scaling unrelated components.',
    'A production workload has measurable hot paths in compute, storage, networking, or data access, and the team wants a managed AWS optimization.',
  ],
  Cost: [
    'A platform team has been asked to reduce monthly spend after tagging showed one workload is driving most of the bill, but the business will not accept weaker durability or availability.',
    'A startup is moving from trial usage to a steady production baseline and wants to cut waste without choosing a service tier that changes the user experience.',
    'A finance review found unused capacity and data-transfer charges, and the solutions architect must lower cost while preserving the stated recovery and security requirements.',
  ],
}

const difficultyScenarioDetails = {
  Easy: [
    'The team wants the simplest managed AWS pattern that directly satisfies the requirement and avoids building custom operational tooling.',
    'The current design is intentionally small, but it must use the AWS control that maps to the stated requirement instead of an adjacent feature.',
    'Operations prefer a service-native configuration that can be explained clearly during a design review and verified with normal AWS telemetry.',
  ],
  Medium: [
    'The workload spans more than one failure boundary or account, so the design must account for permissions, routing, monitoring, and recovery behavior together.',
    'A previous implementation solved the happy path but failed when scale, failover, or access boundaries were tested during preproduction validation.',
    'The answer must satisfy the primary requirement while avoiding designs that merely move the bottleneck or introduce a new manual recovery step.',
  ],
  Hard: [
    'The proof of concept passed basic tests, but production readiness testing found an edge case involving scale, protocol support, failover, or cross-account access.',
    'Several teams proposed familiar AWS services, but the chosen design must satisfy the exact constraint without relying on unsupported integrations or broad permissions.',
    'The solution must handle the steady-state path and the failure path, and it must remain practical for a small operations team to run repeatedly.',
  ],
}

const correctQualifiers = [
  {
    pattern: /stateless allow and deny|network ACL/i,
    detail: 'this provides subnet-level stateless filtering with explicit allow and deny rules while security groups remain stateful ENI controls.',
  },
  {
    pattern: /signed URLs|signed cookies|private CloudFront|authorized users.*CloudFront/i,
    detail: 'this controls viewer access at CloudFront and should be paired with origin restrictions when direct origin access must be prevented.',
  },
  {
    pattern: /IAM|Advanced Identity|Organizations and Accounts/i,
    detail: 'this uses temporary or centrally governed access and can be constrained with least-privilege policies and audit trails.',
  },
  {
    pattern: /KMS|Data Protection|Database Security|Secrets and Certificates/i,
    detail: 'this keeps cryptographic or secret access under managed policy control and produces auditable service events.',
  },
  {
    pattern: /S3 Security|S3 Durability and Recovery|S3 Cost|CloudFront Access/i,
    detail: 'this matches the S3 or CloudFront access path while preserving private access, lifecycle, durability, or retention requirements.',
  },
  {
    pattern: /Private Connectivity|Network Security|Advanced Networking|Networking Performance|Network Cost|Hybrid and Perimeter Security/i,
    detail: 'this matches the traffic destination and route-control requirement without substituting an unrelated internet or hybrid path.',
  },
  {
    pattern: /EC2 and Auto Scaling|EC2 Performance|EC2 Cost|Infrastructure Recovery/i,
    detail: 'this addresses the actual capacity, health-check, placement, or recovery constraint instead of only changing instance size.',
  },
  {
    pattern: /RDS and Aurora|RDS Performance|Database Cost|Advanced Database/i,
    detail: 'this separates failover, read scaling, migration, and backup behavior so the database tier meets the stated objective.',
  },
  {
    pattern: /Messaging and Decoupling|Event Routing|API and Application Security|Containers and Serverless|Serverless Performance/i,
    detail: 'this preserves the required retry, ordering, private integration, or asynchronous failure-handling behavior.',
  },
  {
    pattern: /CloudFront and Edge|Data Transfer Performance|Route 53 and Global Routing/i,
    detail: 'this chooses the edge, routing, or transfer feature that fits the protocol, cache, failover, or global-latency requirement.',
  },
  {
    pattern: /Analytics|Logging and Incident Response|Detection and Governance|Observability and Governance Cost/i,
    detail: 'this uses service-native evidence, alerting, or incremental processing instead of rebuilding state manually.',
  },
  {
    pattern: /Storage Resilience|EBS and File Systems|Storage and Backup Cost|Data Migration and Replication|Migration Cost/i,
    detail: 'this matches the data shape, protocol, throughput, and recovery requirement with the appropriate managed storage or migration service.',
  },
]

const nearMissProfiles = [
  {
    pattern: /stateless allow and deny|network ACL|stateful allow/i,
    distractors: [
      () => 'Use security groups only, assuming their stateful behavior can also express explicit subnet-level deny rules.',
      () => 'Use route table blackhole routes to block specific client traffic, even though route tables do not evaluate protocol and port rules.',
      () => 'Deploy AWS WAF on the load balancer and assume it filters all subnet-level non-HTTP traffic.',
      () => 'Use AWS Network Firewall for every ENI-level rule, even though the requirement is for simple subnet-level stateless allow and deny controls.',
    ],
  },
  {
    pattern: /signed URLs|signed cookies|private CloudFront|authorized users.*CloudFront/i,
    distractors: [
      () => 'Use CloudFront origin access control only, which keeps an S3 origin private but does not by itself authorize individual viewers.',
      () => 'Make the S3 origin private and issue direct S3 presigned URLs to users, bypassing CloudFront viewer authorization.',
      () => 'Use AWS WAF geo match rules, which can filter by geography but do not prove that each viewer is authorized.',
      () => 'Require HTTPS between CloudFront and the origin only, leaving viewer authorization unchanged.',
    ],
  },
  {
    pattern: /IAM|Advanced Identity|Organizations and Accounts/i,
    distractors: [
      () => 'Store IAM access keys for the workload in Secrets Manager and retrieve them at startup so the keys are not hardcoded, but leave long-lived credentials in use.',
      () => 'Attach a broad AWS managed policy first and rely on CloudTrail or Access Analyzer findings to tighten the permissions after deployment.',
      () => 'Use network restrictions or a VPC endpoint policy as the primary authorization control while leaving the IAM principal broadly scoped.',
      () => 'Create separate IAM users in each account and rotate their access keys through the deployment pipeline.',
    ],
  },
  {
    pattern: /KMS|Data Protection|Database Security|Secrets and Certificates/i,
    distractors: [
      () => 'Enable default encryption only on the storage service and do not update the key policy, grant, or secret access permissions required by the application.',
      () => 'Move the credential or key material into instance user data and rely on volume encryption to protect it at rest.',
      () => 'Use an AWS managed key when the requirement calls for customer-controlled key policy changes, cross-account access, or immediate permission revocation.',
      () => 'Encrypt only exported backups and snapshots, leaving the primary data path unchanged.',
    ],
  },
  {
    pattern: /S3 Security|S3 Durability and Recovery|S3 Cost|CloudFront Access/i,
    distractors: [
      () => 'Make the S3 bucket private but issue direct S3 presigned URLs, bypassing the CloudFront viewer-control requirement.',
      () => 'Enable S3 Block Public Access only, without adding the bucket policy, origin access control, lifecycle, or retention setting required by the scenario.',
      () => 'Move active objects immediately to an archival storage class and rely on restore requests even though the workload needs online access.',
      () => 'Use a NAT gateway or internet gateway route as the main control for S3 authorization instead of an S3 policy or endpoint policy.',
    ],
  },
  {
    pattern: /Private Connectivity|Network Security|Advanced Networking|Networking Performance|Network Cost|Hybrid and Perimeter Security/i,
    distractors: [
      () => 'Add a second default route to the same subnet route table and expect AWS to choose the healthy route for each destination.',
      () => 'Use a private Direct Connect virtual interface for Amazon S3 public endpoints while continuing to send all other internet traffic over the existing ISP.',
      () => 'Deploy one NAT gateway in a single Availability Zone and route every private subnet through it to simplify operations.',
      () => 'Use an egress-only internet gateway for IPv4 traffic from private subnets.',
    ],
  },
  {
    pattern: /EC2 and Auto Scaling|EC2 Performance|EC2 Cost|Infrastructure Recovery/i,
    distractors: [
      () => 'Scale up one larger instance and create a CloudWatch alarm that tells operators to replace it manually after application errors begin.',
      () => 'Use Spot capacity for the entire workload, including the noninterruptible baseline that must stay available during capacity interruptions.',
      () => 'Keep EC2 status checks only and ignore load balancer or application health checks when deciding whether to replace unhealthy capacity.',
      () => 'Restore from copied EBS snapshots during an incident without enabling faster restore behavior where the RTO depends on immediate volume performance.',
    ],
  },
  {
    pattern: /RDS and Aurora|RDS Performance|Database Cost|Advanced Database/i,
    distractors: [
      () => 'Send reporting and read traffic to the Multi-AZ standby instance, assuming the standby can serve reads during normal operation.',
      () => 'Use snapshots alone for an online migration that must keep source changes synchronized until cutover.',
      () => 'Add read replicas as the only high-availability control and omit the failover or backup behavior required by the workload.',
      () => 'Store database backups on EC2 instance store volumes because restore reads are faster from local disks.',
    ],
  },
  {
    pattern: /Messaging and Decoupling|Event Routing|API and Application Security|Containers and Serverless|Serverless Performance/i,
    distractors: [
      () => 'Invoke all downstream services synchronously from one component so the caller immediately sees every dependency failure.',
      () => 'Use a standard SQS queue and application-side sorting when the requirement depends on strict ordering or deduplication semantics.',
      () => 'Rely on default retry behavior only and omit the dead-letter queue, destination, idempotency, or replay control needed for failed events.',
      () => 'Attach security groups directly to API Gateway instead of using the supported private integration pattern.',
    ],
  },
  {
    pattern: /CloudFront and Edge|Data Transfer Performance|Route 53 and Global Routing/i,
    distractors: [
      () => 'Use CloudFront for UDP or non-HTTP traffic that requires static anycast IPs and layer-4 acceleration.',
      () => 'Lower DNS TTLs only, even though client and resolver caching can still delay a global cutover.',
      () => 'Use only S3 multipart upload when the issue is global upload latency over long network paths.',
      () => 'Move every global user to a single regional endpoint and increase origin size instead of improving the edge or routing path.',
    ],
  },
  {
    pattern: /Analytics|Logging and Incident Response|Detection and Governance|Observability and Governance Cost/i,
    distractors: [
      () => 'Build a custom scheduler that rereads all historical data on each run because service-native state tracking is assumed unavailable.',
      () => 'Create one noisy metric alarm for every individual signal even when the incident condition depends on multiple correlated signals.',
      () => 'Store findings only in local application logs and query them manually during incidents.',
      () => 'Delete or overwrite source records immediately after processing so duplicate processing cannot occur.',
    ],
  },
  {
    pattern: /Storage Resilience|EBS and File Systems|Storage and Backup Cost|Data Migration and Replication|Migration Cost/i,
    distractors: [
      () => 'Use AWS DataSync for AS2 or SFTP business partner transfers because it is already used for internal file migrations.',
      () => 'Use AWS DMS to copy NFS or SMB file shares because the migration must remain online.',
      () => 'Copy multi-terabyte data manually over a saturated internet connection and retry failed batches with scripts.',
      () => 'Choose the lowest-cost storage class first and validate retrieval, minimum-duration, and availability constraints later.',
    ],
  },
]

const compoundProfiles = [
  {
    pattern: /without stored keys|stored credentials|stored keys/i,
    context: 'The instances are launched by an Auto Scaling group, pull artifacts from S3 during deployment, and must call AWS APIs after scale-out without anyone distributing secrets through user data or the CI/CD system.',
    correct: [
      'Attach the instance profile in the launch template so every replacement instance receives temporary credentials automatically.',
      'Scope the role policy to the exact AWS API actions and resource ARNs the application needs.',
    ],
  },
  {
    pattern: /another AWS account|external principal|third-party SaaS|cross-account|external ID/i,
    context: 'The access request crosses an account boundary, and both accounts need an auditable way to prove who can assume access and what actions are allowed after assumption.',
    correct: [
      'Configure the trust policy to name the approved principal, and use an external ID when a third-party SaaS provider assumes the role.',
      'Grant permissions in the target account role instead of creating long-lived IAM users in every account.',
    ],
  },
  {
    pattern: /least privilege|small set of actions|permission ceiling|approved permission/i,
    context: 'Developers will deploy frequently, so the control must prevent privilege expansion while still allowing the approved operational workflow.',
    correct: [
      'Use scoped actions, resource ARNs, and IAM conditions that match the workload access pattern.',
      'Use a permissions boundary, SCP, or permission set where the requirement is to prevent delegated administrators from exceeding central guardrails.',
    ],
  },
  {
    pattern: /S3 without NAT|private subnets need S3|gateway VPC endpoint|access S3 or DynamoDB frequently|private route.*S3/i,
    priority: 8,
    context: 'The VPC spans multiple Availability Zones, private subnets do not have public IP addresses, and security reviewers want AWS service traffic to avoid public internet egress and unnecessary NAT data processing charges.',
    correct: [
      'Associate the gateway endpoint with the route tables used by the private subnets that need S3 or DynamoDB access.',
      'Use endpoint and bucket policies to limit access to the intended buckets, principals, and actions.',
    ],
  },
  {
    pattern: /CloudFront.*S3|S3 directly|direct navigation|bypass CloudFront|origin access|OAI|OAC|private CloudFront|authorized users.*CloudFront/i,
    priority: 7,
    context: 'Users must receive content through CloudFront, the origin must not be readable by direct S3 URL, and the viewer authorization requirement is separate from the origin privacy requirement.',
    correct: [
      'Update the S3 bucket policy so only the CloudFront distribution origin access control can read the origin objects.',
      'Create a trusted key group and have the application issue short-lived signed URLs or signed cookies after it authorizes the viewer.',
    ],
  },
  {
    pattern: /Object Lock|immutable|retention|unchangeable|legal hold|Vault Lock/i,
    priority: 8,
    context: 'The legal team wants protection from accidental deletion and privileged-user tampering, while a small operations team must still prove that retention behavior is configured correctly.',
    correct: [
      'Enable versioning before applying Object Lock or immutable backup retention controls.',
      'Choose governance, compliance, legal hold, or vault lock behavior according to who may bypass or change retention.',
    ],
  },
  {
    pattern: /lifecycle|Deep Archive|rarely retrieved|retained|older than one month|25 years|Intelligent-Tiering|minimum-duration/i,
    context: 'The dataset has different access patterns by age, and the cost review must account for retrieval time, minimum storage duration, and whether recent data remains immediately available.',
    correct: [
      'Keep recent or frequently accessed data in an online storage class that satisfies the retrieval requirement.',
      'Use lifecycle transitions only after the access window changes, and validate retrieval and minimum-duration charges.',
    ],
  },
  {
    pattern: /DataSync|NFS|SMB|file migration|scheduled incremental|file systems require nightly|SFTP.*NFS/i,
    context: 'The source is a file system rather than a relational database, transfers must be repeatable, and the team wants verification and scheduling without custom copy scripts.',
    correct: [
      'Deploy a DataSync agent close to the on-premises file system when the source is NFS or SMB.',
      'Create source and destination locations, then run or schedule a DataSync task with verification enabled.',
    ],
  },
  {
    pattern: /DMS|CDC|database migration|source remains online|business downtime|Aurora.*synchronized|large.*database/i,
    priority: 8,
    context: 'The source database must stay online during migration, the target must remain synchronized until cutover, and the team must validate that the replicated data is consistent.',
    correct: [
      'Create a DMS replication task that performs full load and then captures ongoing source changes from a known start point.',
      'Monitor replication latency and validation results, then quiesce writes and redirect the application only after the target catches up.',
    ],
  },
  {
    pattern: /Snow|no available Network bandwidth|network transfer would take too long|cannot finish over the network|50 terabytes|very large dataset/i,
    context: 'The available network link cannot finish the initial transfer inside the migration window, but the transformed data still needs to land in AWS services for the recurring workload.',
    correct: [
      'Use a Snow Family device for the initial offline transfer when network bandwidth is the constraint.',
      'Use DataSync, DMS CDC, or another incremental mechanism only for deltas after the bulk data is loaded.',
    ],
  },
  {
    pattern: /Glue.*bookmark|processing all data|reprocess|ETL/i,
    context: 'The job already runs successfully, but each run rereads historical objects and increases processing time and cost as the bucket grows.',
    correct: [
      'Enable Glue job bookmarks so successful runs track which source data has already been processed.',
      'Keep the source data available and avoid deleting processed objects just to prevent duplicate ETL work.',
    ],
  },
  {
    pattern: /DDoS|Shield|SQL injection|XSS|WAF|Firewall Manager|geo match/i,
    context: 'The application is internet-facing across more than one account or distribution, and the security team needs managed protection without maintaining IP block lists by hand.',
    correct: [
      'Attach AWS WAF protections to the supported edge or load-balancing resource when layer-7 filtering is required.',
      'Use Shield Advanced or Firewall Manager when the scenario requires DDoS response support, cost protection, or centralized policy management.',
    ],
  },
  {
    pattern: /EventBridge.*Lambda|Lambda.*EventBridge|resource based policy|invoke.*function|JWT|usage plan|API Gateway.*private|VPC Link/i,
    context: 'The API or event source invokes a managed target, so the design must distinguish the function execution role from the resource-based permission that lets the service invoke the target.',
    correct: [
      'Add a resource-based permission that allows the invoking AWS service and source ARN to call the target.',
      'Use the supported authorizer, usage plan, or VPC Link integration instead of treating API Gateway like an ENI with security groups.',
    ],
  },
  {
    pattern: /SQS|SNS|dead-letter|DLQ|FIFO|ordered|multiple independent consumers|event consumers|visibility timeout|idempotency/i,
    context: 'Producers and consumers scale at different rates, failures must not drop events, and the design must preserve ordering only where the business requirement explicitly calls for it.',
    correct: [
      'Place a durable queue, DLQ, or on-failure destination in the path so failed work can be retried or inspected.',
      'Use FIFO message groups and deduplication only when ordered processing is required within the service limits.',
    ],
  },
  {
    pattern: /NAT gateway|private workloads need resilient|internet egress|private subnets require access to the internet|same-AZ routing/i,
    priority: 8,
    context: 'There are private subnets in multiple Availability Zones, workloads need outbound IPv4 internet access, and the architecture must avoid a single-AZ egress dependency.',
    correct: [
      'Place the NAT gateways in public subnets that have a route to the internet gateway.',
      'Use separate private route tables so each subnet sends default IPv4 egress to the NAT gateway in the same Availability Zone.',
    ],
  },
  {
    pattern: /Direct Connect|public interface|public services|S3.*existing ISP|public IP prefixes|BGP/i,
    priority: 8,
    context: 'The company wants AWS public service prefixes to use Direct Connect, but ordinary internet-bound traffic must continue to use the existing ISP path.',
    correct: [
      'Use a public virtual interface when the destination is an AWS public service endpoint such as Amazon S3.',
      'Advertise and propagate only the required public prefixes instead of sending a default route through AWS.',
    ],
  },
  {
    pattern: /Global Accelerator|UDP|static IP|DNS caching|blue-green|regional outage|proprietary DNS/i,
    priority: 8,
    context: 'The application cannot rely on HTTP caching, and operations want fast endpoint failover without waiting for every client or resolver to honor a DNS change.',
    correct: [
      'Configure a standard accelerator with listeners and regional endpoint groups for the application endpoints.',
      'Use accelerator health checks and traffic dials or weights to move traffic during failover or blue-green cutover.',
    ],
  },
  {
    pattern: /CloudFront|cacheable|static.*dynamic|HTTPS|custom origin|edge refresh|cache-key|global users download/i,
    context: 'The user base is global, the origin may serve both static and dynamic content, and the answer must separate cache behavior from origin capacity and DNS routing.',
    correct: [
      'Put CloudFront in front of the supported origin and configure cache, origin request, and HTTPS policies for the content type.',
      'Use invalidations or cache-control headers when the requirement includes predictable refresh of changed content.',
    ],
  },
  {
    pattern: /same database rows|ElastiCache and a cache-aside pattern|cached reads|microsecond cached reads/i,
    priority: 9,
    context: 'Repeated reads should be served from cache only when the application can preserve correctness through TTLs, invalidation, or cache-aside behavior.',
    correct: [
      'Keep the database as the source of truth and have the application populate the cache on misses.',
      'Set TTLs or invalidation logic so stale cached data does not violate the application requirement.',
    ],
  },
  {
    pattern: /read-heavy|reporting|reader endpoint|read throughput|read replicas|monthly reports|Aurora Replicas|ElastiCache|cache-aside/i,
    context: 'The database writer is healthy during normal traffic but reporting or repeated reads create CPU and I/O pressure, so the design must avoid sending read traffic to a passive standby.',
    correct: [
      'Route read-only reporting or analytics queries to read replicas, Aurora Replicas, or the Aurora reader endpoint where supported.',
      'Keep write traffic on the writer endpoint and monitor replica lag before relying on replicas for user-facing reads.',
    ],
  },
  {
    pattern: /ElastiCache for Redis|MemoryDB|Memcached|data structures|replication.*persistence|ephemeral object cache/i,
    priority: 8,
    context: 'The application team must distinguish an ephemeral cache from a durable in-memory data store, and the answer must account for replication, failover, persistence, and data-structure requirements.',
    correct: [
      'Use Redis-compatible options when the workload needs advanced data structures, replication, snapshots, or stronger durability semantics.',
      'Use Memcached only for simple ephemeral object caching when loss of cached data is acceptable.',
    ],
  },
  {
    pattern: /RDS Proxy|excessive RDS connections|connection recovery|many Lambda/i,
    context: 'The bottleneck is connection management rather than SQL query logic, and sudden concurrency increases can exhaust database sessions.',
    correct: [
      'Place RDS Proxy between the application and database to pool and reuse connections.',
      'Keep application retry logic aware of failover and connection reuse instead of opening a new database session for every invocation.',
    ],
  },
  {
    pattern: /Multi-AZ|standby-based HA|standby|database restoration|point-in-time|RTO|RPO|transaction logs/i,
    context: 'The database tier must satisfy both failure recovery and data-loss objectives, so backups, transaction logs, replicas, and standby behavior cannot be treated as the same control.',
    correct: [
      'Use Multi-AZ deployment for managed failover when the requirement is standby-based high availability.',
      'Use automated backups, point-in-time recovery, or transaction-log shipping when the requirement is recovery to a recent point before corruption.',
    ],
  },
  {
    pattern: /standby-based HA|relational database needs standby|RDS Multi-AZ deployment/i,
    priority: 8,
    context: 'The database should survive an Availability Zone failure with managed failover, but the standby is not intended to absorb normal reporting or read-scaling traffic.',
    correct: [
      'Deploy the database in a Multi-AZ configuration with DB subnets in separate Availability Zones.',
      'Point applications at the managed database endpoint and use retry logic so reconnection succeeds after failover.',
    ],
  },
  {
    pattern: /Auto Scaling|load balancer health|target tracking|CPU.*40|mixed instances|minimum healthy|application health failure/i,
    context: 'Capacity must follow application demand, but replacement decisions must use the health signal that represents user-visible failure, not only instance reachability.',
    correct: [
      'Configure the Auto Scaling group to use the load balancer or application health checks when failed application checks should replace instances.',
      'Use target tracking, instance refresh, or mixed instance policies according to whether the need is performance, rollout safety, or capacity diversity.',
    ],
  },
  {
    pattern: /Spot|Savings Plan|Reserved Instances|business hours|interruptible|predictable|baseline|sporadic/i,
    context: 'The workload has separate baseline and burst components, so the purchasing choice must match interruption tolerance and usage predictability rather than treating all compute the same.',
    correct: [
      'Cover predictable baseline usage with Savings Plans or Reserved Instances where the commitment fits.',
      'Use Spot or flexible capacity only for interruptible workers, queued jobs, or burst capacity that can tolerate interruption.',
    ],
  },
  {
    pattern: /EFS|FSx|SMB|Windows file shares|Linux.*file system|parallel file system|Lustre|ONTAP/i,
    context: 'Applications require shared file access, and the correct service depends on protocol, operating system compatibility, performance shape, and multi-AZ availability.',
    correct: [
      'Choose EFS for managed Linux NFS-style shared access or FSx for the required Windows, Lustre, ONTAP, or OpenZFS protocol.',
      'Select the storage class, throughput mode, and deployment type that satisfy availability and performance requirements.',
    ],
  },
  {
    pattern: /Macie|PII|sensitive information|financial information|Object Lambda/i,
    context: 'Sensitive data must be discovered or transformed before downstream applications consume it, and the team wants managed detection or transformation with minimal custom services.',
    correct: [
      'Use Macie or managed classification to identify sensitive data stored in S3 when discovery and notification are required.',
      'Use S3 Object Lambda or a controlled processing layer when the requirement is to transform or redact object data before returning it.',
    ],
  },
  {
    pattern: /CloudWatch.*OpenSearch|log subscription|composite alarm|false alarms|CloudTrail|Config|GuardDuty|Security Hub/i,
    context: 'Operations needs queryable evidence and alerts that correspond to real incidents instead of noisy single-metric alarms or manual log copying.',
    correct: [
      'Use CloudWatch Logs subscriptions, CloudTrail Lake, Config aggregation, or Security Hub according to the evidence source.',
      'Use composite alarms or event rules when action should happen only after multiple conditions or findings occur together.',
    ],
  },
  {
    pattern: /DynamoDB|NoSQL|hot partitions|DAX|global secondary index|Streams|LeadingKeys|partition-key/i,
    context: 'The application needs low-latency access at scale, and the key design must account for access patterns, partition distribution, and item-level authorization.',
    correct: [
      'Model the partition key or secondary index around the required access pattern and avoid hot partitions.',
      'Use IAM condition keys, DAX, Streams, or on-demand capacity only when those features match the authorization, cache, event, or traffic requirement.',
    ],
  },
  {
    pattern: /Transfer Acceleration|multipart upload|large object upload|global.*upload|parallel parts/i,
    priority: 9,
    context: 'Clients are far from the target Region and upload failures are expensive, so the design must distinguish edge-optimized upload paths from parallelizing a single large object.',
    correct: [
      'Have upload clients use the S3 accelerate endpoint after Transfer Acceleration is enabled on the bucket.',
      'Use multipart upload for very large objects so parts can be uploaded in parallel and retried independently.',
    ],
  },
  {
    pattern: /Fast Snapshot Restore|snapshot.*restore|volume.*snapshot|initialization delay/i,
    context: 'The recovery plan depends on restored EBS volumes delivering full performance immediately, not after lazy block initialization during the first reads.',
    correct: [
      'Enable Fast Snapshot Restore for the snapshot in each target Availability Zone that needs immediate volume performance.',
      'Pre-warm or validate restored volume performance when Fast Snapshot Restore is not enabled or not appropriate.',
    ],
  },
  {
    pattern: /ECS|Fargate|container|task|image|Karpenter|Service Connect|Cloud Map/i,
    context: 'The workload is containerized, so the architecture must separate application code changes from orchestration, service discovery, scaling, and infrastructure capacity choices.',
    correct: [
      'Use ECS, EKS, Fargate, or managed node scaling according to the required orchestration control and operational overhead.',
      'Use service auto scaling, health checks, and private discovery so tasks can be replaced and discovered without manual host management.',
    ],
  },
  {
    pattern: /ACM|certificate|SSL|TLS|HTTPS/i,
    context: 'The web tier currently spends compute on TLS handling, and the certificate lifecycle must remain manageable as the application scales.',
    correct: [
      'Use ACM with a supported load balancer or CloudFront distribution to terminate TLS where managed certificates are supported.',
      'Keep origin protocol and viewer protocol policies aligned with the required end-to-end encryption posture.',
    ],
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

function styleProfileFor(item) {
  const haystack = `${item.service} ${item.trigger} ${item.text} ${item.answerSummary}`
  return styleProfiles.find(profile => profile.pattern.test(haystack)) || {
    context: 'The solution must satisfy every stated constraint with managed AWS services and avoid custom operational work where a service-native capability exists.',
    correct: [
      'Use the managed service feature that directly satisfies the stated availability, security, performance, or cost constraint.',
      'Validate the design with service-native monitoring, policy, or lifecycle controls so the architecture remains operable.',
    ],
    distractors: [
      'Replace the requirement with a manual process that depends on operators reacting after impact.',
      'Choose a service that solves only one part of the scenario while ignoring the main constraint.',
    ],
  }
}

function patternProfileFor(item, profiles) {
  const haystack = `${item.service} ${item.trigger} ${item.text} ${item.answerSummary}`
  return profiles
    .filter(profile => profile.pattern.test(haystack))
    .sort((left, right) => (right.priority || 0) - (left.priority || 0))[0]
}

function compoundProfileFor(item) {
  return patternProfileFor(item, compoundProfiles)
}

function usesCompoundScenario(item, displayedType) {
  return displayedType !== 'single' || item.difficulty === 'Hard' || item.variant >= 4
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

function objectiveNumber(item) {
  return Number(item.objectiveId?.match(/\d+/)?.[0] || 0)
}

function optionIdFor(index) {
  return String.fromCharCode(97 + index)
}

function pickStable(values, item, salt = 0) {
  return values[(objectiveNumber(item) + item.variant + salt) % values.length]
}

function normalizeRequirementText(trigger) {
  return trigger
    .replace(/^application\b/i, 'an application')
    .replace(/^applications\b/i, 'applications')
    .replace(/^company\b/i, 'the company')
    .replace(/^principal\b/i, 'a principal')
    .replace(/^bucket\b/i, 'a bucket')
    .replace(/^database\b/i, 'a database')
    .replace(/^workload\b/i, 'a workload')
    .replace(/^workloads\b/i, 'workloads')
}

function scenarioLeadFor(item) {
  const openers = domainScenarioOpeners[item.domain] || domainScenarioOpeners.Security
  const details = difficultyScenarioDetails[item.difficulty] || difficultyScenarioDetails.Medium
  const opener = pickStable(openers, item)
  const detail = pickStable(details, item, 1)
  const requirement = normalizeRequirementText(item.trigger)

  if (item.difficulty === 'Hard') {
    return `${opener} A proof of concept using ${item.service} passed simple tests, but production readiness testing exposed that ${requirement}. ${detail}`
  }

  if (item.difficulty === 'Medium') {
    return `${opener} During a migration or scale test, the team found that ${requirement}. ${detail}`
  }

  return `${opener} The immediate design requirement is that ${requirement}. ${detail}`
}

function correctQualifierFor(item) {
  return patternProfileFor(item, correctQualifiers)?.detail
    || 'this uses the managed AWS capability that directly satisfies the stated requirement and can be verified operationally.'
}

function refineCorrectOptionText(item, text) {
  return rewriteOptionText(text)
}

function normalizeComparableText(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function uniqueTexts(texts, usedTexts = []) {
  const used = new Set(usedTexts.map(normalizeComparableText))
  return texts.filter(text => {
    const key = normalizeComparableText(text)
    if (!key || used.has(key)) return false
    used.add(key)
    return true
  })
}

function distractorPoolFor(item) {
  const guardrail = studyGuardrailFor(item)
  const profile = styleProfileFor(item)
  const nearMiss = patternProfileFor(item, nearMissProfiles)
  const generatedNearMisses = nearMiss?.distractors.map(factory => factory(item)) || []
  const rotate = (pool, salt = 0) => {
    const offset = pool.length ? (objectiveNumber(item) + item.variant + salt) % pool.length : 0
    return [...pool.slice(offset), ...pool.slice(0, offset)]
  }

  return uniqueTexts([
    ...rotate(generatedNearMisses),
    ...rotate(profile.distractors, 1),
    ...rotate(guardrail.distractors, 2),
  ])
}

function selectDistractorTexts(item, count, usedTexts = []) {
  const pool = uniqueTexts(distractorPoolFor(item), usedTexts)
  if (pool.length >= count) return pool.slice(0, count)

  const fallback = uniqueTexts([
    ...pool,
    'Choose a service that solves an adjacent AWS problem but does not satisfy the scenario constraint.',
    'Replace the managed AWS capability with a custom script and manual operator review after each incident.',
  ], usedTexts)

  return fallback.slice(0, count)
}

function supportingCorrectOptions(item, count, usedTexts = []) {
  const guardrail = studyGuardrailFor(item)
  const profile = styleProfileFor(item)
  const compound = compoundProfileFor(item)
  const pool = uniqueTexts([
    ...(compound?.correct || []),
    ...profile.correct,
    ...guardrail.correct,
  ], usedTexts)
  return pool.slice(0, Math.max(0, count - 1)).map((text, index) => ({
    id: optionIdFor(4 + index),
    text,
    originalIndex: 4 + index,
    correct: true,
    explanation: `This complements the main design by preserving the ${item.domain.toLowerCase()} requirement instead of treating the service choice as the only control.`,
  }))
}

function supportingDistractorOptions(item, existingCount, usedTexts, targetCount) {
  const count = Math.max(0, targetCount - existingCount)
  return selectDistractorTexts(item, count, usedTexts).map((text, index) => ({
    id: optionIdFor(existingCount + index),
    text,
    originalIndex: existingCount + index,
    correct: false,
    explanation: 'This sounds operationally plausible, but it changes or weakens one of the scenario constraints instead of satisfying it.',
  }))
}

function buildPrompt(item, displayedType) {
  const guardrail = studyGuardrailFor(item)
  const profile = styleProfileFor(item)
  const compound = usesCompoundScenario(item, displayedType) ? compoundProfileFor(item) : null
  const insight = insightFor(item)
  const choiceCount = displayedType === 'choose-three' ? 3 : displayedType === 'choose-two' ? 2 : 1
  const directive = choiceCount > 1
    ? `Which ${choiceWords[choiceCount]} choices should the solutions architect include?`
    : 'Which option is the best recommendation?'
  const scenarioLead = scenarioLeadFor(item)
  const nuance = insight ? ` ${insight}` : ''
  const requirement = scenarioLead.toLowerCase().includes(item.trigger.toLowerCase())
    ? ''
    : ` The key requirement is: ${item.trigger}.`
  const compoundContext = compound ? ` ${compound.context}` : ''

  return `${scenarioLead}${compoundContext} ${profile.context} ${guardrail.context}${requirement}${nuance} ${directive}`
}

function normalizeQuestion(item) {
  const domain = generatedDomainToAppDomain[item.domain] || item.domain
  const sourceCorrectOptionIds = item.correctOptionIds || item.options
    .filter(option => option.correct)
    .map(option => option.id)
  const displayedType = displayedTypeFor(item)
  const correctCount = displayedType === 'choose-three' ? 3 : displayedType === 'choose-two' ? 2 : 1
  const targetOptionCount = correctCount === 3 ? 6 : correctCount === 2 ? 5 : 4
  const mainCorrectText = refineCorrectOptionText(item, item.answerSummary)
  const correctDetail = correctQualifierFor(item)
  const distractorTexts = selectDistractorTexts(
    item,
    item.options.filter(option => !option.correct).length,
    [mainCorrectText],
  )
  let distractorIndex = 0
  const baseOptions = item.options.map((option, index) => ({
    id: option.id || optionIdFor(index),
    text: option.correct
      ? mainCorrectText
      : distractorTexts[distractorIndex++] || rewriteOptionText(option.text),
    originalIndex: index,
    correct: Boolean(option.correct),
    explanation: option.correct
      ? `${option.explanation} In this scenario, ${correctDetail}`
      : option.explanation,
  }))
  const options = [
    ...baseOptions,
    ...supportingCorrectOptions(item, correctCount, [mainCorrectText, ...baseOptions.map(option => option.text)]),
  ]
  const finalOptions = [
    ...options,
    ...(displayedType === 'single'
      ? []
      : supportingDistractorOptions(
        item,
        options.length,
        options.map(option => option.text),
        targetOptionCount,
      )),
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

export const generatedBankQuestions = generatedQuestions.map(normalizeQuestion)

export const questions = [...generatedBankQuestions, ...proPracticeQuestions]

function rotated(items, offset) {
  if (!items.length) return items
  const safeOffset = offset % items.length
  return [...items.slice(safeOffset), ...items.slice(0, safeOffset)]
}

function practiceSetQuestions(setIndex) {
  const setNumber = setIndex + 1
  const setQuestions = proPracticeQuestions.filter(question => question.practiceSet === setNumber)
  const intents = new Set()

  return PRACTICE_DOMAIN_PATTERN.map((domain, slotIndex) => {
    const question = setQuestions[slotIndex]
    if (!question || question.domain !== domain ||
        question.correctOptionIds.length !== PRACTICE_RESPONSE_PATTERN[slotIndex]) {
      throw new Error(`Practice set ${setNumber} slot ${slotIndex + 1} does not match the blueprint pattern.`)
    }
    if (intents.has(question.intentGroup)) {
      throw new Error(`Practice set ${setNumber} repeats intent ${question.intentGroup}.`)
    }
    intents.add(question.intentGroup)
    return question
  })
}

function examDomainPattern() {
  const remaining = { ...EXAM_DOMAIN_COUNTS }
  const pattern = []
  const domains = Object.keys(EXAM_DOMAIN_COUNTS)

  while (pattern.length < Object.values(EXAM_DOMAIN_COUNTS).reduce((sum, count) => sum + count, 0)) {
    domains.forEach(domain => {
      if (remaining[domain] > 0) {
        pattern.push(domain)
        remaining[domain] -= 1
      }
    })
  }

  return pattern
}

function examVariantPreference(examIndex, slotIndex) {
  const pattern = [4, 2, 3, 5, 1, 4, 3, 2, 5, 1]
  return pattern[(examIndex * 3 + slotIndex) % pattern.length]
}

function fullLengthExamQuestionForSlot(domain, examIndex, slotIndex, usedQuestionIds, selected) {
  const preferredVariant = examVariantPreference(examIndex, slotIndex)
  const domainQuestions = generatedBankQuestions.filter(question => (
    question.domain === domain && !usedQuestionIds.has(question.id)
  ))
  const candidateGroups = [
    domainQuestions.filter(question => (
      question.variant === preferredVariant &&
        !selected.objectives.has(question.objectiveId) &&
        !selected.services.has(question.service)
    )),
    domainQuestions.filter(question => (
      !selected.objectives.has(question.objectiveId) &&
        !selected.services.has(question.service)
    )),
    domainQuestions.filter(question => (
      question.variant === preferredVariant &&
        !selected.objectives.has(question.objectiveId)
    )),
    domainQuestions.filter(question => !selected.objectives.has(question.objectiveId)),
    domainQuestions,
  ]
  const pool = candidateGroups.find(group => group.length)
  const ordered = rotated(pool || [], examIndex * 37 + slotIndex * 17 + preferredVariant * 13)
  return ordered[0]
}

function fullLengthExamQuestions(examIndex, usedQuestionIds) {
  const selected = {
    ids: new Set(),
    objectives: new Set(),
    services: new Set(),
  }

  return examDomainPattern().map((domain, slotIndex) => {
    const question = fullLengthExamQuestionForSlot(domain, examIndex, slotIndex, usedQuestionIds, selected)
    if (!question) {
      throw new Error(`Unable to build full-length exam ${examIndex + 1}; no question available for ${domain}.`)
    }
    selected.ids.add(question.id)
    selected.objectives.add(question.objectiveId)
    selected.services.add(question.service)
    usedQuestionIds.add(question.id)
    return question
  })
}

export const questionSets = Array.from({ length: 10 }, (_, index) => {
  const setNumber = index + 1
  const questionIds = practiceSetQuestions(index).map(question => question.id)

  return {
    id: `set-${setNumber}`,
    name: `Practice Set ${setNumber}`,
    description: 'Senior-level scenarios with single-answer, choose-two, and choose-three tradeoffs. No repeated intents within the set.',
    questionIds,
  }
})

const fullLengthExamUsedQuestionIds = new Set()

export const fullLengthExams = Array.from({ length: 6 }, (_, index) => {
  const examNumber = index + 1
  const questionIds = fullLengthExamQuestions(index, fullLengthExamUsedQuestionIds)
    .map(question => question.id)

  return {
    id: `exam-${examNumber}`,
    name: `Full-Length Exam ${examNumber}`,
    description: '65 questions - 20 security, 17 resilience, 16 performance, 12 cost.',
    questionIds,
  }
})
