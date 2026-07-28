// Hand-authored senior-level SAA-C03 practice bank.
// 10 practice sets x 10 questions. Generated from reviewed authoring specs;
// each set has unique intentGroups (no sibling/same-intent questions per set).
// Regenerate via scripts in the session scratchpad if sets are re-authored.
export const proPracticeQuestions = [
  {
    "id": "PRO-001",
    "objectiveId": "PRO-001",
    "objectiveName": "IAM: Third-party vendor account access with confused-deputy protection",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "IAM",
    "difficulty": "Hard",
    "type": "single",
    "question": "A financial services company runs its production workloads in a single AWS account across two Regions. The company has signed a contract with a third-party SaaS monitoring vendor that collects metrics and configuration data by making API calls into customer accounts from the vendor's own AWS account. The company's security team requires that the vendor receive only read-level access, that no long-term credentials leave the company's control, and that the integration be protected against another of the vendor's customers tricking the vendor into reading the company's account. Which solution will meet these requirements with the LEAST operational overhead?",
    "options": [
      {
        "id": "a",
        "text": "Create an IAM user with read-only permissions, store its access keys in AWS Secrets Manager with 90-day automatic rotation, and grant the vendor an API to retrieve the current keys.",
        "correct": false,
        "explanation": "This still hands long-term credentials to an external party, violating the requirement that no long-term credentials leave the company's control, and rotation adds ongoing coordination overhead with the vendor."
      },
      {
        "id": "b",
        "text": "Create an IAM role with read-only permissions that trusts the vendor's AWS account, and add an aws:SourceIp condition in the trust policy limiting assumption to the vendor's published CIDR ranges.",
        "correct": false,
        "explanation": "An IP condition restricts where AssumeRole calls originate but does nothing to stop the confused-deputy problem, because every vendor customer request comes from the same vendor IP ranges."
      },
      {
        "id": "c",
        "text": "Create an IAM role with read-only permissions that trusts the vendor's AWS account, and require a vendor-generated unique external ID with an sts:ExternalId condition in the trust policy.",
        "correct": true,
        "explanation": "A cross-account role removes long-term credentials entirely, and the sts:ExternalId condition ensures the vendor can assume the role only on behalf of this specific customer, which is the standard confused-deputy mitigation."
      },
      {
        "id": "d",
        "text": "Attach resource-based policies to each monitored service, such as S3 buckets and SQS queues, granting the vendor's AWS account read access to those specific resources.",
        "correct": false,
        "explanation": "Many services the vendor must monitor do not support resource-based policies, and maintaining per-resource grants across two Regions creates far more operational overhead than a single assumable role."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Cross-account IAM role trusting the vendor account with an sts:ExternalId condition in the trust policy.",
    "explanation": "The discriminating constraints are no long-term external credentials and protection against the confused-deputy attack, which together point to a cross-account role with an external ID. IP-restricted trust and rotated IAM user keys each satisfy only one of the two constraints, and per-resource policies fail the least-operational-overhead qualifier.",
    "trigger": "Third-party vendor account access with confused-deputy protection",
    "intentGroup": "iam-cross-account-external-id",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "IAM"
    ],
    "tags": [
      "Secure Architectures",
      "IAM",
      "Hard",
      "PRO-001",
      "variant-1",
      "Third-party vendor account access with confused-deputy protection",
      "iam-cross-account-external-id",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-002",
    "objectiveId": "PRO-002",
    "objectiveName": "NAT Gateway: AZ-independent outbound internet from private subnets",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "NAT Gateway",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A healthcare analytics company runs an application on EC2 instances in private subnets across three Availability Zones in a single VPC. The instances download reference datasets over IPv4 from external HTTPS endpoints several times per hour. During a recent Availability Zone disruption, instances in the two healthy Availability Zones lost outbound internet access because their traffic was routed through infrastructure in the affected Availability Zone. The company requires that outbound internet access continue for instances in any healthy Availability Zone during a single-AZ failure, with no cross-AZ data path for egress traffic. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Deploy a NAT gateway in a public subnet in each of the three Availability Zones.",
        "correct": true,
        "explanation": "Per-AZ NAT gateways ensure that a failure in one Availability Zone cannot take down egress for the others, satisfying the AZ-independence requirement."
      },
      {
        "id": "b",
        "text": "Deploy a single NAT gateway in a public subnet and associate all three private subnets with a route table that targets it.",
        "correct": false,
        "explanation": "This recreates the original failure mode: a NAT gateway is a zonal resource, so an outage in its Availability Zone removes egress for all three private subnets."
      },
      {
        "id": "c",
        "text": "Attach an egress-only internet gateway to the VPC and add a default route to it from each private subnet.",
        "correct": false,
        "explanation": "An egress-only internet gateway handles IPv6 traffic only, so it cannot carry the IPv4 HTTPS downloads this workload requires."
      },
      {
        "id": "d",
        "text": "Create a separate route table for the private subnet in each Availability Zone with a default route to the NAT gateway in the same Availability Zone.",
        "correct": true,
        "explanation": "Zonal route tables keep each subnet's egress path inside its own Availability Zone, eliminating the cross-AZ dependency that caused the outage."
      },
      {
        "id": "e",
        "text": "Launch NAT instances in an Auto Scaling group spanning the three Availability Zones and update routes to the instances when replacements launch.",
        "correct": false,
        "explanation": "NAT instances require route updates and health management on every replacement, and a recovering Auto Scaling group still leaves an egress gap during failover, so this is weaker than managed per-AZ NAT gateways."
      }
    ],
    "answers": [
      "a",
      "d"
    ],
    "correctOptionIds": [
      "a",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d"
    ],
    "answerSummary": "One NAT gateway per AZ in public subnets, plus per-AZ private route tables targeting the same-AZ NAT gateway.",
    "explanation": "The two constraints are surviving a single-AZ failure and having no cross-AZ egress path, which requires both zonal NAT gateways and zonal routing so each subnet uses its local gateway. Either step alone leaves a cross-AZ dependency, and the IPv6-only and self-managed alternatives each break a stated constraint.",
    "trigger": "AZ-independent outbound internet from private subnets",
    "intentGroup": "nat-multi-az-egress",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "NAT Gateway"
    ],
    "tags": [
      "Resilient Architectures",
      "NAT Gateway",
      "Hard",
      "PRO-002",
      "variant-1",
      "AZ-independent outbound internet from private subnets",
      "nat-multi-az-egress",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-003",
    "objectiveId": "PRO-003",
    "objectiveName": "Aurora: Offload month-end reporting to an Aurora reader",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "Aurora",
    "difficulty": "Medium",
    "type": "single",
    "question": "An ecommerce company runs its order management system on an Amazon Aurora MySQL cluster with a single writer instance. During the last five business days of each month, the finance team runs a suite of long-running reporting queries against the database, and order-processing latency on the writer rises from 20 ms to over 900 ms. The reports scan large date ranges, run once per closing cycle, and must reflect near-current data. The company wants to restore OLTP performance during month-end without changing the reporting SQL. Which solution will meet these requirements MOST cost-effectively?",
    "options": [
      {
        "id": "a",
        "text": "Scale the writer instance to a larger instance class before each month-end close and scale it back down afterward.",
        "correct": false,
        "explanation": "Vertical scaling still leaves reporting and OLTP contending on the same instance and adds recurring resize operations with brief availability interruptions, making it neither clean isolation nor the cheapest fix."
      },
      {
        "id": "b",
        "text": "Add an Aurora Replica to the cluster and point the reporting tool at the cluster's reader endpoint.",
        "correct": true,
        "explanation": "An Aurora Replica shares the cluster storage volume with typically sub-second lag, so reports see near-current data while their scans are fully isolated from the writer, and the SQL is unchanged."
      },
      {
        "id": "c",
        "text": "Direct the reporting tool to the synchronous standby instance that Aurora maintains for Multi-AZ failover.",
        "correct": false,
        "explanation": "Aurora does not expose a passive standby for queries; read capacity comes from Aurora Replicas through the reader endpoint, so there is no standby endpoint to target."
      },
      {
        "id": "d",
        "text": "Deploy an ElastiCache for Redis cluster in front of the database and cache the results of the reporting queries.",
        "correct": false,
        "explanation": "Caching pays off for repeated reads, but these scans run once per monthly cycle over changing date ranges, so a cache adds cost and application changes without relieving the writer on first execution."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Add an Aurora Replica and route reporting to the cluster reader endpoint.",
    "explanation": "The constraints are isolating heavy analytical reads from OLTP, keeping data near-current, and avoiding SQL changes, which the shared-storage Aurora Replica satisfies directly. Vertical scaling and caching fail isolation or the once-per-cycle access pattern, and Aurora has no queryable failover standby.",
    "trigger": "Offload month-end reporting to an Aurora reader",
    "intentGroup": "aurora-reader-offload",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Aurora"
    ],
    "tags": [
      "High-Performing Architectures",
      "Aurora",
      "Medium",
      "PRO-003",
      "variant-1",
      "Offload month-end reporting to an Aurora reader",
      "aurora-reader-offload",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-004",
    "objectiveId": "PRO-004",
    "objectiveName": "S3: Three-stage lifecycle balancing retrieval speed against archive pricing",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "S3",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A payments company writes about 2 TB of application log objects to an S3 bucket every month. Regulations require the logs to be retained for 10 years. Analysts query the most recent 30 days of logs many times per day with Amazon Athena. During the first year after creation, internal auditors retrieve a small sample of older log objects a few times per quarter and expect results within seconds. After the first year, the logs are effectively never read. The company wants to minimize total storage cost while accounting for retrieval fees and minimum storage duration charges. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Transition the log objects to S3 Glacier Deep Archive 30 days after creation.",
        "correct": false,
        "explanation": "Deep Archive restores take hours, so auditors could not retrieve first-year samples within seconds, violating the stated access requirement."
      },
      {
        "id": "b",
        "text": "Keep the log objects in S3 Standard for the first 30 days after creation.",
        "correct": true,
        "explanation": "The newest 30 days are queried many times per day, so S3 Standard's lack of retrieval fees and minimum duration charges makes it the cheapest class for this hot window."
      },
      {
        "id": "c",
        "text": "Transition the log objects to S3 One Zone-IA 30 days after creation for the audit period.",
        "correct": false,
        "explanation": "One Zone-IA stores data in a single Availability Zone, an availability and durability trade-off that is inappropriate for logs under a 10-year regulatory retention mandate."
      },
      {
        "id": "d",
        "text": "Transition the log objects to S3 Glacier Instant Retrieval 30 days after creation.",
        "correct": true,
        "explanation": "Glacier Instant Retrieval provides millisecond access for the quarterly audit samples at a lower storage price than Standard-IA, and the objects stay well past its 90-day minimum duration."
      },
      {
        "id": "e",
        "text": "Move the log objects into S3 Intelligent-Tiering with the Deep Archive Access tier enabled 30 days after creation.",
        "correct": false,
        "explanation": "With the optional Deep Archive Access tier enabled, rarely touched first-year objects would sink into an archive tier that requires restores taking hours, breaking the seconds-level audit access, while per-object monitoring fees add cost on high log object counts."
      },
      {
        "id": "f",
        "text": "Transition the log objects to S3 Glacier Deep Archive 365 days after creation.",
        "correct": true,
        "explanation": "After the first year the logs are effectively never read, so the lowest-cost archive class is optimal for the remaining nine years, and retrieval fees are irrelevant at that point."
      }
    ],
    "answers": [
      "b",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "f"
    ],
    "answerSummary": "S3 Standard for days 0-30, Glacier Instant Retrieval from day 30 through the first year, Deep Archive from day 365 onward.",
    "explanation": "The discriminators are the seconds-level audit access during year one, the heavy 30-day query window, and the 10-year retention with negligible reads after year one. That access profile rules out early Deep Archive and archive-enabled Intelligent-Tiering, while the retention mandate rules out single-AZ storage.",
    "trigger": "Three-stage lifecycle balancing retrieval speed against archive pricing",
    "intentGroup": "s3-lifecycle-tiering",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "S3",
      "Hard",
      "PRO-004",
      "variant-1",
      "Three-stage lifecycle balancing retrieval speed against archive pricing",
      "s3-lifecycle-tiering",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-005",
    "objectiveId": "PRO-005",
    "objectiveName": "CloudFront: Lock S3 origin to a single CloudFront distribution via OAC",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "CloudFront",
    "difficulty": "Hard",
    "type": "single",
    "question": "A media company serves static website assets from an S3 bucket through an Amazon CloudFront distribution that has an AWS WAF web ACL attached. A penetration test found that the assets are also reachable directly at the bucket's S3 URLs, which bypasses the WAF rules and the company's geographic restrictions. The security team requires that the assets be retrievable only through this specific CloudFront distribution, with no application changes for end users. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create an origin access control for the origin and update the bucket policy to allow cloudfront.amazonaws.com only when aws:SourceArn equals the distribution's ARN.",
        "correct": true,
        "explanation": "OAC lets CloudFront sign origin requests, and the aws:SourceArn condition scopes bucket access to this one distribution, closing the direct-URL path without touching the client experience."
      },
      {
        "id": "b",
        "text": "Update the bucket policy to allow s3:GetObject for the cloudfront.amazonaws.com service principal and enable the S3 Block Public Access settings on the bucket to stop direct anonymous reads.",
        "correct": false,
        "explanation": "Without an aws:SourceArn condition, any CloudFront distribution in any AWS account could be configured to read the bucket, so the assets are not restricted to this specific distribution."
      },
      {
        "id": "c",
        "text": "Generate presigned URLs for each asset with a short expiration and update the distribution to serve the presigned URLs to viewers.",
        "correct": false,
        "explanation": "Presigned URLs require the application to mint and refresh links for every static asset, which changes the user-facing URL scheme and contradicts the no-application-change requirement."
      },
      {
        "id": "d",
        "text": "Configure the distribution to add a secret custom Referer header on origin requests and add a bucket policy condition that requires that header value.",
        "correct": false,
        "explanation": "The legacy Referer-header pattern depends on a static shared secret that can leak or be replayed by anyone who learns it, and AWS recommends OAC over header-based origin restrictions."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Origin access control plus a bucket policy allowing cloudfront.amazonaws.com only with aws:SourceArn matching the distribution ARN.",
    "explanation": "The constraints are exclusivity to one distribution and zero end-user impact, so the answer must combine OAC with a SourceArn-scoped bucket policy. Omitting the SourceArn condition leaves the bucket open to any distribution, and presigned URLs or Referer secrets fail the no-change or robustness constraints.",
    "trigger": "Lock S3 origin to a single CloudFront distribution via OAC",
    "intentGroup": "cloudfront-oac-origin-privacy",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "CloudFront"
    ],
    "tags": [
      "Secure Architectures",
      "CloudFront",
      "Hard",
      "PRO-005",
      "variant-1",
      "Lock S3 origin to a single CloudFront distribution via OAC",
      "cloudfront-oac-origin-privacy",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-006",
    "objectiveId": "PRO-006",
    "objectiveName": "SQS: DLQ for poison messages plus idempotent payment processing",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "SQS",
    "difficulty": "Medium",
    "type": "multiple",
    "question": "A retail company processes payment events through an Amazon SQS standard queue consumed by an ECS service. Two problems have been reported. First, a small number of malformed events fail on every processing attempt, are retried until the 4-day message retention period expires, and are then silently deleted, leaving no record for investigation. Second, when processing occasionally runs past the visibility timeout, the same payment event is delivered to another task and the customer is charged twice. The company must retain failing events for analysis and guarantee that a payment is applied at most once. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Convert the queue to an SQS FIFO queue and enable content-based deduplication.",
        "correct": false,
        "explanation": "FIFO deduplication only suppresses duplicate sends within a 5-minute window; it does not prevent redelivery of a message whose visibility timeout expired during processing, so double charges persist."
      },
      {
        "id": "b",
        "text": "Enable long polling on the queue with a 20-second receive wait time.",
        "correct": false,
        "explanation": "Long polling reduces empty receives and API cost but has no effect on poison-message loss or on duplicate delivery after a visibility timeout lapse."
      },
      {
        "id": "c",
        "text": "Configure a redrive policy with a maxReceiveCount that moves repeatedly failing messages to a dead-letter queue.",
        "correct": true,
        "explanation": "A redrive policy stops endless retries of malformed events and preserves them in a dead-letter queue for investigation instead of letting retention expiry delete them."
      },
      {
        "id": "d",
        "text": "Raise the queue's visibility timeout to a value above the longest observed processing time.",
        "correct": false,
        "explanation": "Tuning the visibility timeout lowers the chance of redelivery but cannot guarantee at-most-once application, since crashes and outlier durations still trigger redelivery of in-flight messages."
      },
      {
        "id": "e",
        "text": "Record each payment ID in a DynamoDB table with a conditional write and skip any event whose payment ID already exists.",
        "correct": true,
        "explanation": "A conditional write keyed on the payment ID makes processing idempotent, so a redelivered event is detected and discarded rather than charging the customer again."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Add a DLQ redrive policy for poison messages and make processing idempotent with conditional writes keyed on the payment ID.",
    "explanation": "The two independent requirements are retaining poison messages and enforcing at-most-once payment application, and each requires its own mechanism: a DLQ for the former and consumer idempotency for the latter. Timeout tuning and FIFO deduplication only shrink the duplicate window, and neither preserves failing events.",
    "trigger": "DLQ for poison messages plus idempotent payment processing",
    "intentGroup": "sqs-dlq-idempotency",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "SQS"
    ],
    "tags": [
      "Resilient Architectures",
      "SQS",
      "Medium",
      "PRO-006",
      "variant-1",
      "DLQ for poison messages plus idempotent payment processing",
      "sqs-dlq-idempotency",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-007",
    "objectiveId": "PRO-007",
    "objectiveName": "Global Accelerator: Static anycast IPs and edge onboarding for global UDP traffic",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "Global Accelerator",
    "difficulty": "Hard",
    "type": "single",
    "question": "A gaming studio hosts the backend for a real-time multiplayer title on EC2 fleets behind Network Load Balancers in us-east-1 and eu-central-1. Game clients communicate over a custom UDP protocol on port 7777, and players connect from every continent with a strict in-game latency budget. Several console platform partners require a small, fixed set of IP addresses to add to their outbound allowlists, and the studio wants client traffic to enter the AWS network as close to the player as possible with automatic failover between Regions. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create an Amazon CloudFront distribution and configure the two regional Network Load Balancers as origins with origin failover.",
        "correct": false,
        "explanation": "CloudFront accepts only HTTP and HTTPS from viewers, so it cannot carry the game's custom UDP protocol on port 7777."
      },
      {
        "id": "b",
        "text": "Create Route 53 latency-based routing records that resolve to Elastic IP addresses attached to the Network Load Balancers in both Regions.",
        "correct": false,
        "explanation": "This yields a different IP set per Region rather than one small fixed set for partner allowlists, and resolver DNS caching delays failover well beyond a real-time game's tolerance."
      },
      {
        "id": "c",
        "text": "Consolidate the backend behind a single Network Load Balancer with Elastic IP addresses in us-east-1 and register the fleets from both Regions as IP targets.",
        "correct": false,
        "explanation": "Fixed IPs are achieved, but every player worldwide must ingress in one Region over the public internet, breaking the latency budget and removing regional failover."
      },
      {
        "id": "d",
        "text": "Create an AWS Global Accelerator standard accelerator with the two Network Load Balancers as endpoints and publish its static anycast IP addresses.",
        "correct": true,
        "explanation": "Global Accelerator supports UDP, provides exactly two static anycast IPs for allowlisting, onboards traffic at the nearest edge location, and shifts traffic between regional endpoints in seconds on failure."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "AWS Global Accelerator with the regional NLBs as endpoints, publishing its two static anycast IP addresses.",
    "explanation": "The combined constraints are UDP protocol support, a fixed small IP set for allowlists, edge onboarding for latency, and fast cross-Region failover. CloudFront fails on protocol, DNS-based routing fails on static IPs and failover speed, and a single-Region NLB fails on latency and resilience.",
    "trigger": "Static anycast IPs and edge onboarding for global UDP traffic",
    "intentGroup": "global-accelerator-udp",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Global Accelerator"
    ],
    "tags": [
      "High-Performing Architectures",
      "Global Accelerator",
      "Hard",
      "PRO-007",
      "variant-1",
      "Static anycast IPs and edge onboarding for global UDP traffic",
      "global-accelerator-udp",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-008",
    "objectiveId": "PRO-008",
    "objectiveName": "Savings Plans: Match purchase model to each tier's usage profile",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Savings Plans",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A logistics company runs three tiers in one AWS account. A customer-facing web tier runs 24/7 on EC2 with a steady baseline of 40 vCPUs and little seasonal variation. A nightly batch tier re-rates shipping invoices for up to 6 hours, checkpoints its progress to S3, and can tolerate interruptions and reruns. An internal API tier, currently on Lambda, serves unpredictable bursts that vary tenfold week to week. Finance has asked for a 3-year cost strategy that maximizes discounts on predictable usage without paying for idle commitment on volatile usage. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Purchase a 3-year Compute Savings Plan with an hourly spend commitment sized to the web tier's steady 40-vCPU baseline.",
        "correct": true,
        "explanation": "The web baseline runs 24/7 with little variation, so a commitment sized exactly to it captures the deep discount with essentially no risk of paying for idle commitment."
      },
      {
        "id": "b",
        "text": "Purchase 3-year all-upfront Standard Reserved Instances sized to the combined peak capacity of all three tiers.",
        "correct": false,
        "explanation": "Committing to peak rather than baseline means paying reserved rates for capacity that sits idle outside bursts and batch windows, directly violating the no-idle-commitment requirement."
      },
      {
        "id": "c",
        "text": "Run the nightly batch tier on Spot Instances and rely on its S3 checkpointing to resume after interruptions.",
        "correct": true,
        "explanation": "The batch tier explicitly tolerates interruption and already checkpoints, which is the profile Spot pricing is designed for, yielding the largest discount on that tier."
      },
      {
        "id": "d",
        "text": "Move the steady web tier baseline to Spot Instances to obtain a larger discount than a commitment provides.",
        "correct": false,
        "explanation": "Spot capacity can be reclaimed with two minutes' notice, which is unacceptable for an always-on customer-facing tier that must hold its 40-vCPU baseline."
      },
      {
        "id": "e",
        "text": "Keep the internal API on Lambda at on-demand rates rather than folding its usage into a commitment.",
        "correct": true,
        "explanation": "Tenfold week-to-week swings make any fixed hourly commitment either wasteful or insufficient, so paying on-demand for the volatile tier is the cost-rational choice."
      },
      {
        "id": "f",
        "text": "Increase the Compute Savings Plan commitment to also cover the internal API tier's peak weekly concurrency.",
        "correct": false,
        "explanation": "A commitment sized to the volatile tier's peak would go unused most weeks, converting the intended discount into paid-for idle commitment."
      }
    ],
    "answers": [
      "a",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "e"
    ],
    "answerSummary": "Compute Savings Plan sized to the steady web baseline, Spot for the checkpointed nightly batch, and on-demand Lambda for the spiky internal API.",
    "explanation": "The discriminating constraints are maximizing discount on predictable usage while avoiding commitment on volatile usage, mapping each tier to the pricing model that fits its interruption tolerance and variability. Committing to peaks or to the spiky tier creates idle spend, and Spot on the baseline trades away required availability.",
    "trigger": "Match purchase model to each tier's usage profile",
    "intentGroup": "compute-purchase-mix",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Savings Plans"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Savings Plans",
      "Hard",
      "PRO-008",
      "variant-1",
      "Match purchase model to each tier's usage profile",
      "compute-purchase-mix",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-009",
    "objectiveId": "PRO-009",
    "objectiveName": "KMS: Auditable KMS key usage with rotation that avoids re-encryption",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "KMS",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An insurance company stores claim documents in Amazon S3. A new compliance framework requires that all documents be encrypted at rest, that every use of the encryption key be attributable in logs the auditors can review, and that key material be rotated every year. The platform team is small and has stated that any solution requiring them to re-encrypt the existing 400 TB of objects each year is unacceptable. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Enable default bucket encryption with SSE-S3 managed keys and rely on S3 server access logs for the audit trail.",
        "correct": false,
        "explanation": "SSE-S3 uses keys that S3 manages internally, producing no per-key AWS KMS API events, so auditors cannot attribute individual key-use operations as the framework demands."
      },
      {
        "id": "b",
        "text": "Configure default bucket encryption with SSE-KMS using a customer managed key that has automatic key rotation enabled.",
        "correct": true,
        "explanation": "A customer managed key gives auditable, policy-controlled encryption, and automatic rotation generates new key material yearly while KMS retains prior versions so existing objects decrypt without any re-encryption."
      },
      {
        "id": "c",
        "text": "Configure the application to upload objects with SSE-C, with the compliance team supplying the encryption key on each request.",
        "correct": false,
        "explanation": "SSE-C shifts key custody and every rotation onto the team, and rotating SSE-C key material requires re-uploading objects, which the team has ruled out at 400 TB."
      },
      {
        "id": "d",
        "text": "Create a new customer managed key each year and run an S3 Batch Operations copy job to re-encrypt all existing objects with it.",
        "correct": false,
        "explanation": "Annual Batch Operations re-encryption of 400 TB is exactly the manual re-encryption burden the team declared unacceptable, and automatic KMS rotation makes it unnecessary."
      },
      {
        "id": "e",
        "text": "Use CloudTrail to record the key's Decrypt and GenerateDataKey events and provide those logs to the auditors.",
        "correct": true,
        "explanation": "KMS API calls against a customer managed key are captured by CloudTrail, giving auditors an attributable record of every cryptographic use of the key."
      }
    ],
    "answers": [
      "b",
      "e"
    ],
    "correctOptionIds": [
      "b",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "e"
    ],
    "answerSummary": "SSE-KMS with a customer managed key with automatic rotation enabled, evidenced through CloudTrail KMS event logs.",
    "explanation": "The constraints that discriminate are per-use key auditability and yearly rotation without touching stored data. Only a customer managed KMS key emits CloudTrail events per cryptographic operation, and only KMS automatic rotation renews key material while old versions keep decrypting existing objects.",
    "trigger": "Auditable KMS key usage with rotation that avoids re-encryption",
    "intentGroup": "kms-cmk-rotation-audit",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "KMS"
    ],
    "tags": [
      "Secure Architectures",
      "KMS",
      "Hard",
      "PRO-009",
      "variant-1",
      "Auditable KMS key usage with rotation that avoids re-encryption",
      "kms-cmk-rotation-audit",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-010",
    "objectiveId": "PRO-010",
    "objectiveName": "RDS: Fast failover plus readable standbys via Multi-AZ DB cluster",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "RDS",
    "difficulty": "Hard",
    "type": "single",
    "question": "A ticketing platform runs on Amazon RDS for PostgreSQL in a Multi-AZ DB instance deployment. During a recent failover the database was unavailable for almost 2 minutes, which exceeded the platform's 40-second RTO for database interruptions and caused abandoned checkouts. The engineering team also notes that the standby instance is fully provisioned yet serves no traffic, while read-heavy seat-map queries load the primary. The team wants failover that typically completes in under 35 seconds and wants the standby capacity to serve read traffic. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Recreate the deployment as a Multi-AZ DB instance deployment on a larger instance class to shorten failover and absorb the read load.",
        "correct": false,
        "explanation": "In a Multi-AZ instance deployment the standby remains unreadable regardless of size, and instance-deployment failovers typically take 60 seconds or more, missing both requirements."
      },
      {
        "id": "b",
        "text": "Migrate to an RDS Multi-AZ DB cluster and direct the seat-map queries to the cluster's reader endpoint.",
        "correct": true,
        "explanation": "A Multi-AZ DB cluster keeps one writer and two readable standbys, fails over in typically under 35 seconds, and its reader endpoint puts the standby capacity to work on the read-heavy queries."
      },
      {
        "id": "c",
        "text": "Create a read replica of the primary for the seat-map queries and promote the replica if the primary becomes unavailable.",
        "correct": false,
        "explanation": "Replica promotion is a manual or scripted process using asynchronous replication, so it cannot deliver a dependable sub-35-second failover and risks losing recent commits."
      },
      {
        "id": "d",
        "text": "Deploy a cross-Region read replica and use Route 53 failover routing to shift database traffic to it during outages.",
        "correct": false,
        "explanation": "A cross-Region replica addresses regional disaster recovery, but promotion plus DNS failover takes minutes, and cross-Region replication lag makes it the wrong tool for a 35-second in-Region RTO."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Migrate to an RDS Multi-AZ DB cluster with one writer and two readable standbys, using the reader endpoint for read traffic.",
    "explanation": "The paired constraints are typically-under-35-second failover and productive use of standby capacity for reads, which only the Multi-AZ DB cluster topology delivers. The classic Multi-AZ instance deployment keeps its standby idle and fails over more slowly, and replica-promotion designs are manual and slower still.",
    "trigger": "Fast failover plus readable standbys via Multi-AZ DB cluster",
    "intentGroup": "rds-multiaz-db-cluster",
    "practiceSet": 1,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "RDS"
    ],
    "tags": [
      "Resilient Architectures",
      "RDS",
      "Hard",
      "PRO-010",
      "variant-1",
      "Fast failover plus readable standbys via Multi-AZ DB cluster",
      "rds-multiaz-db-cluster",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-011",
    "objectiveId": "PRO-011",
    "objectiveName": "Organizations: Prevent member accounts from disabling CloudTrail or leaving the organization.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "Organizations",
    "difficulty": "Hard",
    "type": "single",
    "question": "A financial services company manages 40 member accounts in AWS Organizations with all features enabled. Compliance policy requires that CloudTrail logging remain active in every account at all times and that no account can remove itself from the organization. During a recent audit, the company discovered that an administrator in one member account had stopped logging on the account's trail for several days. The security team already aggregates logs centrally and now needs a control that prevents these actions from succeeding in the first place, even when attempted by administrators in member accounts. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create an organization trail in the management account, enable log file integrity validation, and deliver the logs to a centralized S3 bucket.",
        "correct": false,
        "explanation": "An organization trail centralizes and validates logging, but it does not stop a member account administrator from stopping or deleting the account's own trails, and it does nothing to block organizations:LeaveOrganization. It is a logging control, not a preventive one."
      },
      {
        "id": "b",
        "text": "Attach IAM permissions boundaries that deny cloudtrail:StopLogging, cloudtrail:DeleteTrail, and organizations:LeaveOrganization to every IAM user and role in each member account.",
        "correct": false,
        "explanation": "Permissions boundaries are managed inside each member account, so an account administrator can detach or edit them. They cannot enforce a guardrail that member-account admins are unable to override."
      },
      {
        "id": "c",
        "text": "Attach an SCP at the organization root denying cloudtrail:StopLogging, cloudtrail:DeleteTrail, and organizations:LeaveOrganization.",
        "correct": true,
        "explanation": "SCPs are evaluated outside member-account control and cap what any principal in the account can do, including administrators. A deny SCP at the root is the only listed option that makes both actions fail preventively across all 40 accounts."
      },
      {
        "id": "d",
        "text": "Deploy an AWS Config rule with an automatic remediation action that re-enables any trail that stops logging.",
        "correct": false,
        "explanation": "Config with remediation is detective and corrective: logging is still interrupted until the remediation runs, and it cannot address an account leaving the organization. The requirement is to prevent the action from succeeding at all."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Attach a deny SCP at the organization root covering cloudtrail:StopLogging, cloudtrail:DeleteTrail, and organizations:LeaveOrganization.",
    "explanation": "The discriminating constraint is preventive versus detective control combined with immunity from member-account administrators. Only SCPs are enforced above the account boundary, so trails, boundaries, and Config remediation all fail one of those two tests.",
    "trigger": "Prevent member accounts from disabling CloudTrail or leaving the organization.",
    "intentGroup": "scp-preventive-guardrails",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Organizations"
    ],
    "tags": [
      "Secure Architectures",
      "Organizations",
      "Hard",
      "PRO-011",
      "variant-1",
      "Prevent member accounts from disabling CloudTrail or leaving the organization.",
      "scp-preventive-guardrails",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-012",
    "objectiveId": "PRO-012",
    "objectiveName": "Aurora: Cross-Region Aurora DR with ~1s RPO and ~1min RTO.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Aurora",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A global payments platform runs on an Aurora MySQL cluster across three Availability Zones in us-east-1, with an application tier behind an Application Load Balancer. A new regulatory mandate requires a cross-Region disaster recovery capability in eu-west-1 with an RPO of approximately 1 second and an RTO of approximately 1 minute. The company currently takes automated daily snapshots but has no cross-Region presence. The team must be able to fail over quickly without rebuilding replication after each drill. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Copy automated cluster snapshots to eu-west-1 every night and restore a new cluster from the latest copy during failover.",
        "correct": false,
        "explanation": "Nightly snapshot copies produce an RPO measured in hours and a restore-based RTO of tens of minutes or more. This fails both the 1-second RPO and the 1-minute RTO."
      },
      {
        "id": "b",
        "text": "Convert the cluster to an Aurora Global Database and add a secondary cluster in eu-west-1.",
        "correct": true,
        "explanation": "Aurora Global Database uses storage-level replication with typical lag under 1 second and supports promoting the secondary in about a minute. It is the only replication approach listed that meets both the RPO and RTO targets."
      },
      {
        "id": "c",
        "text": "Configure self-managed MySQL binlog replication from the cluster to an EC2-hosted replica in eu-west-1.",
        "correct": false,
        "explanation": "Binlog replication to EC2 puts lag, monitoring, and promotion entirely on the team, and replication lag under load routinely exceeds 1 second. It also loses Aurora's managed durability in the DR Region."
      },
      {
        "id": "d",
        "text": "Enable Aurora Backtrack on the cluster with a 72-hour target window for rapid recovery.",
        "correct": false,
        "explanation": "Backtrack rewinds the same cluster in the same Region to undo logical errors. It provides no second-Region copy, so it cannot satisfy a cross-Region DR mandate at all."
      },
      {
        "id": "e",
        "text": "Pre-provision the application tier in eu-west-1 and use managed failover with Route 53 health checks to promote the secondary cluster.",
        "correct": true,
        "explanation": "A 1-minute RTO requires the app tier to already exist in the DR Region and promotion plus traffic shift to be automated. Managed failover preserves the replication topology so drills do not require rebuilding replication."
      }
    ],
    "answers": [
      "b",
      "e"
    ],
    "correctOptionIds": [
      "b",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "e"
    ],
    "answerSummary": "Use Aurora Global Database with a secondary cluster in eu-west-1, plus a pre-provisioned app tier and managed failover with health-based routing.",
    "explanation": "The 1-second RPO eliminates snapshot copies and self-managed binlog replication, and the cross-Region requirement eliminates Backtrack. The 1-minute RTO then forces a pre-provisioned application tier with automated promotion and routing, not just the database replica.",
    "trigger": "Cross-Region Aurora DR with ~1s RPO and ~1min RTO.",
    "intentGroup": "aurora-global-database-dr",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Aurora"
    ],
    "tags": [
      "Resilient Architectures",
      "Aurora",
      "Hard",
      "PRO-012",
      "variant-1",
      "Cross-Region Aurora DR with ~1s RPO and ~1min RTO.",
      "aurora-global-database-dr",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-013",
    "objectiveId": "PRO-013",
    "objectiveName": "RDS Proxy: Lambda connection storms against RDS PostgreSQL need pooling.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "RDS Proxy",
    "difficulty": "Medium",
    "type": "single",
    "question": "An e-commerce company processes orders with AWS Lambda functions that write to an Amazon RDS for PostgreSQL db.r6g.xlarge instance. During flash sales, concurrency spikes to several hundred simultaneous function executions, and the database rejects new connections with too-many-connections errors even though CPU utilization stays below 40 percent. Each invocation currently opens its own database connection. The company wants to eliminate the connection exhaustion with the LEAST change to the application code. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create an RDS Proxy for the database and point the Lambda functions at the proxy endpoint.",
        "correct": true,
        "explanation": "RDS Proxy pools and multiplexes thousands of Lambda connections onto a small set of database connections, absorbing spikes without exhausting the writer. The only code change is swapping the endpoint, which matches the least-change constraint."
      },
      {
        "id": "b",
        "text": "Increase the max_connections value in a custom DB parameter group, apply the parameter group to the instance, and reboot it.",
        "correct": false,
        "explanation": "Raising max_connections trades connection slots for per-connection memory on an instance that is not CPU bound but will become memory bound. The next larger spike hits the new ceiling, so the root cause of unpooled connections remains."
      },
      {
        "id": "c",
        "text": "Scale the database to a larger instance class to raise the default connection limit.",
        "correct": false,
        "explanation": "A bigger instance raises the derived connection limit but pays for capacity the workload does not need, since CPU is under 40 percent. It postpones rather than removes the connection-storm problem."
      },
      {
        "id": "d",
        "text": "Add two read replicas and configure the Lambda functions to distribute their database queries across the replica endpoints.",
        "correct": false,
        "explanation": "Order processing is write-heavy, and writes must still go to the single writer, so its connection limit is still exhausted during spikes. Splitting reads also requires more application change than swapping an endpoint."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Put RDS Proxy between Lambda and the PostgreSQL database and point the functions at the proxy endpoint.",
    "explanation": "The discriminators are connection exhaustion without CPU pressure and the least-code-change constraint. Pooling at RDS Proxy fixes the storm at its source with an endpoint swap, whereas parameter, instance-size, and replica changes either mask the problem or require app rework.",
    "trigger": "Lambda connection storms against RDS PostgreSQL need pooling.",
    "intentGroup": "rds-proxy-connection-pooling",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "RDS Proxy"
    ],
    "tags": [
      "High-Performing Architectures",
      "RDS Proxy",
      "Medium",
      "PRO-013",
      "variant-1",
      "Lambda connection storms against RDS PostgreSQL need pooling.",
      "rds-proxy-connection-pooling",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-014",
    "objectiveId": "PRO-014",
    "objectiveName": "VPC Endpoints: Cut NAT data-processing and cross-AZ transfer for S3/DynamoDB-heavy traffic.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "VPC Endpoints",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An analytics company runs EC2 fleets in private subnets across three Availability Zones in a single VPC. The instances read and write tens of terabytes per day, almost entirely to Amazon S3 and Amazon DynamoDB, and all traffic currently leaves through NAT gateways. Cost Explorer shows that NAT gateway data-processing charges and inter-AZ data transfer are now the two largest line items on the bill. The company must cut these costs while keeping high availability for the remaining internet-bound traffic. Which combination of steps will meet these requirements MOST cost-effectively? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Create a gateway VPC endpoint for S3 and add it to the route tables of the private subnets.",
        "correct": true,
        "explanation": "A gateway endpoint routes S3 traffic off the NAT path at no hourly or per-GB endpoint charge. Because S3 is most of the traffic, this removes the bulk of the NAT data-processing cost."
      },
      {
        "id": "b",
        "text": "Create interface VPC endpoints for S3 in each Availability Zone to remove the NAT gateway charges.",
        "correct": false,
        "explanation": "Interface endpoints for S3 work, but they bill per hour per AZ plus per GB processed, so at tens of terabytes per day they largely replace one per-GB fee with another. The free gateway endpoint is the cost-effective choice here."
      },
      {
        "id": "c",
        "text": "Consolidate the three NAT gateways into a single NAT gateway in one Availability Zone.",
        "correct": false,
        "explanation": "One NAT gateway forces two AZs to send egress across AZ boundaries, adding the very inter-AZ transfer charges the company is trying to cut. It also creates a single point of failure, violating the availability requirement."
      },
      {
        "id": "d",
        "text": "Create a gateway VPC endpoint for DynamoDB and add it to the route tables of the private subnets.",
        "correct": true,
        "explanation": "DynamoDB is the other major destination, and its gateway endpoint is also free of hourly and per-GB endpoint charges. This takes the remaining bulk traffic off the NAT gateways."
      },
      {
        "id": "e",
        "text": "Deploy a Transit Gateway and route all outbound traffic through a centralized egress VPC.",
        "correct": false,
        "explanation": "Transit Gateway adds its own per-GB data-processing charge on top of attachment fees, so centralizing egress through it increases per-GB cost for this single-VPC workload. It solves a multi-VPC routing problem the company does not have."
      },
      {
        "id": "f",
        "text": "Keep one NAT gateway per Availability Zone and route each private subnet to the NAT gateway in its own AZ.",
        "correct": true,
        "explanation": "Same-AZ NAT routing eliminates cross-AZ hops for the residual internet-bound traffic while preserving AZ-independent egress. This addresses the inter-AZ transfer line item without sacrificing availability."
      }
    ],
    "answers": [
      "a",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "a",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d",
      "f"
    ],
    "answerSummary": "Add gateway endpoints for S3 and DynamoDB, and keep per-AZ NAT gateways with same-AZ subnet routing for remaining egress.",
    "explanation": "The constraints are per-GB cost at very high volume plus high availability. Gateway endpoints are the only zero-per-GB path for S3 and DynamoDB, and same-AZ NAT routing is the only option that removes inter-AZ charges without creating a single point of failure; interface endpoints and Transit Gateway both reintroduce per-GB fees.",
    "trigger": "Cut NAT data-processing and cross-AZ transfer for S3/DynamoDB-heavy traffic.",
    "intentGroup": "nat-and-data-transfer-cost",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "VPC Endpoints"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "VPC Endpoints",
      "Hard",
      "PRO-014",
      "variant-1",
      "Cut NAT data-processing and cross-AZ transfer for S3/DynamoDB-heavy traffic.",
      "nat-and-data-transfer-cost",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-015",
    "objectiveId": "PRO-015",
    "objectiveName": "Secrets Manager: Cross-account Secrets Manager read needs resource policy plus KMS key policy.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "Secrets Manager",
    "difficulty": "Hard",
    "type": "single",
    "question": "A company keeps a shared database credential in AWS Secrets Manager in security account A, encrypted with a customer managed AWS KMS key in the same account. An application that runs under an IAM role in workload account B must retrieve the secret at startup. The security team requires that the secret remain in account A as the single source of truth and that account B receive only the minimum permissions needed to read it. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Duplicate the secret into a Secrets Manager secret in account B and run a scheduled Lambda function to keep the two copies synchronized after each rotation.",
        "correct": false,
        "explanation": "Copying the secret creates a second source of truth that can drift between rotations, violating the single-source requirement. It also adds custom synchronization code to maintain."
      },
      {
        "id": "b",
        "text": "Re-encrypt the secret with the AWS managed aws/secretsmanager key and allow account B in the secret's resource policy.",
        "correct": false,
        "explanation": "AWS managed keys do not support cross-account grants or key policy edits, so principals in account B could never decrypt the secret. Cross-account Secrets Manager access requires a customer managed key."
      },
      {
        "id": "c",
        "text": "Create a role in account A with AdministratorAccess and let the application role in account B assume it to read the secret.",
        "correct": false,
        "explanation": "Cross-account role assumption can work, but granting AdministratorAccess for a single GetSecretValue call violates the minimum-permissions requirement. The blast radius of that role far exceeds the need."
      },
      {
        "id": "d",
        "text": "Grant account B's role secretsmanager:GetSecretValue in the secret's resource policy and kms:Decrypt in the KMS key policy.",
        "correct": true,
        "explanation": "Cross-account secret access needs both halves: the secret's resource policy authorizes retrieval, and the customer managed key's policy authorizes decryption of the protected value. This keeps the secret in account A with exactly the permissions required."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Grant account B's role GetSecretValue in the secret's resource policy and kms:Decrypt in the customer managed key's policy.",
    "explanation": "The discriminators are single source of truth and least privilege, plus the KMS fact that cross-account decryption requires a customer managed key with an explicit key policy grant. Duplication breaks the first constraint, an admin role breaks the second, and the AWS managed key is technically incapable of cross-account use.",
    "trigger": "Cross-account Secrets Manager read needs resource policy plus KMS key policy.",
    "intentGroup": "secrets-cross-account-access",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Secrets Manager"
    ],
    "tags": [
      "Secure Architectures",
      "Secrets Manager",
      "Hard",
      "PRO-015",
      "variant-1",
      "Cross-account Secrets Manager read needs resource policy plus KMS key policy.",
      "secrets-cross-account-access",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-016",
    "objectiveId": "PRO-016",
    "objectiveName": "EC2 Auto Scaling: ASG ignores ALB-unhealthy instances; needs ELB health checks plus grace period.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "EC2 Auto Scaling",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A media company serves a web application from an Auto Scaling group of EC2 instances behind an Application Load Balancer across two Availability Zones. Occasionally the application process on an instance hangs: the ALB marks the target unhealthy and returns HTTP 5xx errors for its share of traffic, but the Auto Scaling group never replaces the instance because EC2 status checks continue to pass. The application takes about four minutes to warm up after launch. The company wants unhealthy instances replaced automatically without healthy new instances being terminated during startup. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Reduce the deregistration delay on the ALB target group to 30 seconds.",
        "correct": false,
        "explanation": "Deregistration delay only controls how long in-flight requests drain when a target is being removed. It does not cause the Auto Scaling group to notice or replace a hung instance."
      },
      {
        "id": "b",
        "text": "Add a target tracking scaling policy based on average CPU utilization.",
        "correct": false,
        "explanation": "Scaling policies adjust capacity to load; a hung process often shows low CPU and would not trigger a scale event. Replacement of unhealthy instances is a health-check function, not a scaling-policy function."
      },
      {
        "id": "c",
        "text": "Configure the Auto Scaling group to use ELB health checks in addition to EC2 status checks.",
        "correct": true,
        "explanation": "With ELB health checks enabled, the group treats targets the ALB marks unhealthy as unhealthy and replaces them. This closes the exact gap where EC2 status checks pass while the application is hung."
      },
      {
        "id": "d",
        "text": "Set the health check grace period to cover the application's four-minute warm-up time.",
        "correct": true,
        "explanation": "Once ELB health checks drive replacement, a new instance failing checks during its warm-up would be terminated in a loop. A grace period longer than the boot time prevents churning healthy instances at startup."
      },
      {
        "id": "e",
        "text": "Enable detailed monitoring on the instances to publish metrics at 1-minute intervals.",
        "correct": false,
        "explanation": "Detailed monitoring improves metric resolution for dashboards and alarms but changes nothing about health evaluation or replacement. The group would still consider the hung instance healthy."
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "correctOptionIds": [
      "c",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "d"
    ],
    "answerSummary": "Enable ELB health checks on the Auto Scaling group and set a health check grace period that covers the four-minute warm-up.",
    "explanation": "Two constraints must be satisfied together: replace instances the ALB sees as unhealthy, and avoid terminating new instances during their warm-up. ELB health checks address the first, and the grace period addresses the second; either alone causes missed replacements or a termination loop.",
    "trigger": "ASG ignores ALB-unhealthy instances; needs ELB health checks plus grace period.",
    "intentGroup": "asg-elb-health-integration",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EC2 Auto Scaling"
    ],
    "tags": [
      "Resilient Architectures",
      "EC2 Auto Scaling",
      "Hard",
      "PRO-016",
      "variant-1",
      "ASG ignores ALB-unhealthy instances; needs ELB health checks plus grace period.",
      "asg-elb-health-integration",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-017",
    "objectiveId": "PRO-017",
    "objectiveName": "DAX: Microsecond DynamoDB reads with minimal app change points to DAX.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "DAX",
    "difficulty": "Medium",
    "type": "single",
    "question": "A retailer stores its product catalog in an Amazon DynamoDB table that receives about 50,000 read requests per second at peak, with a read-to-write ratio near 500:1 and a small set of hot items. The current single-digit-millisecond read latency is no longer sufficient; the personalization engine now requires microsecond-level response times for repeated reads. The development team wants to avoid rewriting the data access layer or managing cache invalidation logic. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Deploy an ElastiCache for Redis cluster and implement cache-aside logic in the application.",
        "correct": false,
        "explanation": "Redis can serve microsecond-adjacent reads, but cache-aside requires rewriting the data access layer and owning invalidation and TTL logic. That directly violates the minimal-change constraint."
      },
      {
        "id": "b",
        "text": "Provision a DAX cluster and point the application's DynamoDB client at the DAX endpoint.",
        "correct": true,
        "explanation": "DAX is a write-through, API-compatible cache that returns cached reads in microseconds. Swapping the client endpoint is the only change, and invalidation is handled by the service."
      },
      {
        "id": "c",
        "text": "Switch the table to on-demand capacity mode to absorb the peak read traffic.",
        "correct": false,
        "explanation": "On-demand changes how throughput is provisioned and billed, not how fast reads return. Latency stays at single-digit milliseconds regardless of capacity mode."
      },
      {
        "id": "d",
        "text": "Create a DynamoDB global table replica in a Region closer to the personalization engine.",
        "correct": false,
        "explanation": "Global tables reduce cross-Region network latency for geographically distant callers, but reads against any replica are still millisecond-scale. They cannot reach microsecond response times."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Add a DAX cluster and repoint the DynamoDB client at the DAX endpoint.",
    "explanation": "The paired constraints are microsecond reads and minimal application change. Only DAX delivers microsecond cache hits through the existing DynamoDB API; Redis needs an app rewrite, and capacity mode or global tables never change per-request latency class.",
    "trigger": "Microsecond DynamoDB reads with minimal app change points to DAX.",
    "intentGroup": "dynamodb-dax-microsecond-reads",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "DAX"
    ],
    "tags": [
      "High-Performing Architectures",
      "DAX",
      "Medium",
      "PRO-017",
      "variant-1",
      "Microsecond DynamoDB reads with minimal app change points to DAX.",
      "dynamodb-dax-microsecond-reads",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-018",
    "objectiveId": "PRO-018",
    "objectiveName": "S3: 900 TB with shifting access: tier intelligently, archive selectively, analyze first.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "S3",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A genomics company stores 900 TB of research data in Amazon S3 Standard across thousands of prefixes belonging to different study teams. Access patterns shift unpredictably: a prefix may be read heavily for weeks after a paper is published and then go untouched for months, while some archival prefixes have not been read in over a year. Retrieval must remain possible, and some downstream pipelines cannot tolerate multi-hour restore delays. The company wants to reduce storage cost without incurring surprise retrieval fees on data that turns hot again. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Create a lifecycle rule that transitions all objects to S3 Standard-IA 30 days after creation.",
        "correct": false,
        "explanation": "Standard-IA charges per-GB retrieval fees and a 30-day minimum, so prefixes that turn hot again after publication would generate exactly the surprise retrieval costs the company wants to avoid."
      },
      {
        "id": "b",
        "text": "Transition objects in prefixes with unpredictable access to S3 Intelligent-Tiering.",
        "correct": true,
        "explanation": "Intelligent-Tiering moves objects between access tiers automatically with no retrieval fees, so data that reheats after publication costs nothing extra to read. It is purpose-built for exactly this shifting pattern."
      },
      {
        "id": "c",
        "text": "Enable the optional Archive Access tiers of Intelligent-Tiering after confirming which pipelines can tolerate the retrieval times.",
        "correct": true,
        "explanation": "The opt-in archive tiers cut cost further for objects untouched for months, but restores from them are not instant. Reviewing pipeline retrieval SLAs first honors the constraint that some jobs cannot wait hours."
      },
      {
        "id": "d",
        "text": "Move the entire dataset to S3 One Zone-IA to reduce the per-GB storage rate.",
        "correct": false,
        "explanation": "One Zone-IA stores data in a single Availability Zone, reducing resilience for irreplaceable research data, and it still carries retrieval fees. A lower rate does not justify the durability trade-off across the whole dataset."
      },
      {
        "id": "e",
        "text": "Use S3 Storage Lens and storage class analysis to find prefixes with consistently cold access and apply targeted lifecycle rules to them.",
        "correct": true,
        "explanation": "Prefixes that are provably cold, such as those unread for a year, are cheaper under an explicit lifecycle transition than under Intelligent-Tiering monitoring charges. Analysis tooling identifies them without guessing."
      },
      {
        "id": "f",
        "text": "Create a lifecycle rule that transitions all objects to S3 Glacier Deep Archive after 60 days.",
        "correct": false,
        "explanation": "Deep Archive restores take up to 12 hours or more, which the latency-sensitive pipelines explicitly cannot tolerate. Blanket-archiving prefixes that reheat would also incur heavy retrieval charges."
      }
    ],
    "answers": [
      "b",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "b",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "c",
      "e"
    ],
    "answerSummary": "Use Intelligent-Tiering for unpredictable prefixes, opt into its Archive Access tiers after an SLA review, and use Storage Lens/storage class analysis to target predictable cold prefixes with explicit lifecycle rules.",
    "explanation": "The constraints in tension are cost reduction, no surprise retrieval fees on reheating data, and pipelines that cannot wait hours for restores. Intelligent-Tiering satisfies the first two for unpredictable data, the archive tiers need an SLA check before enabling, and analysis-driven lifecycle rules capture the cheaper path for provably cold prefixes; blanket IA, One Zone, or Deep Archive each violate at least one constraint.",
    "trigger": "900 TB with shifting access: tier intelligently, archive selectively, analyze first.",
    "intentGroup": "s3-intelligent-tiering-analysis",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "S3",
      "Hard",
      "PRO-018",
      "variant-1",
      "900 TB with shifting access: tier intelligently, archive selectively, analyze first.",
      "s3-intelligent-tiering-analysis",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-019",
    "objectiveId": "PRO-019",
    "objectiveName": "AWS WAF: Org-wide SQLi/XSS protection: WAF managed rules deployed by Firewall Manager.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "AWS WAF",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A healthcare SaaS provider exposes REST APIs through Amazon API Gateway in more than 30 AWS accounts that belong to one organization in AWS Organizations. A penetration test found that several APIs are vulnerable to SQL injection and cross-site scripting. The security team must apply consistent protection against these attacks to every existing and future API stage, enforce the rules centrally, and prevent individual account teams from removing them. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Create AWS WAF web ACLs that use managed rule groups for SQL injection and cross-site scripting, associated with the API stages.",
        "correct": true,
        "explanation": "AWS WAF is the layer-7 control that inspects requests to API Gateway, and the managed SQLi and XSS rule groups directly cover the findings from the penetration test. Web ACLs are the enforcement artifact the central policy will distribute."
      },
      {
        "id": "b",
        "text": "Subscribe the organization to AWS Shield Advanced and protect the API endpoints with it.",
        "correct": false,
        "explanation": "Shield Advanced defends against DDoS attacks and adds response support, but it does not evaluate request payloads for SQL injection or XSS. It addresses a different threat class than the pen-test findings."
      },
      {
        "id": "c",
        "text": "Enable Amazon GuardDuty in all accounts and send findings to a delegated Security Hub administrator.",
        "correct": false,
        "explanation": "GuardDuty detects threats from logs and telemetry after the fact; it never blocks an injection request in flight. The requirement is enforced prevention at the request layer, not detection."
      },
      {
        "id": "d",
        "text": "Direct each account team to build and maintain its own web ACL rules for its API stages.",
        "correct": false,
        "explanation": "Per-account hand-maintained ACLs drift, miss new stages, and can be deleted by the very teams the control must constrain. This fails both the consistency and the central-enforcement requirements."
      },
      {
        "id": "e",
        "text": "Use AWS Firewall Manager to define a WAF policy that deploys and enforces the web ACL across all accounts in the organization.",
        "correct": true,
        "explanation": "Firewall Manager applies the WAF policy organization-wide, auto-remediates new and non-compliant resources, and reapplies protections that account teams remove. It supplies the central enforcement that standalone WAF lacks."
      }
    ],
    "answers": [
      "a",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "e"
    ],
    "answerSummary": "Build WAF web ACLs with managed SQLi/XSS rule groups and enforce them across the organization with an AWS Firewall Manager policy.",
    "explanation": "Two constraints must hold at once: layer-7 injection protection and organization-wide enforcement that account teams cannot undo. WAF managed rules satisfy the first, Firewall Manager the second; Shield Advanced and GuardDuty target the wrong threat class, and per-account ACLs fail central enforcement.",
    "trigger": "Org-wide SQLi/XSS protection: WAF managed rules deployed by Firewall Manager.",
    "intentGroup": "waf-firewall-manager-multi-account",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "AWS WAF"
    ],
    "tags": [
      "Secure Architectures",
      "AWS WAF",
      "Hard",
      "PRO-019",
      "variant-1",
      "Org-wide SQLi/XSS protection: WAF managed rules deployed by Firewall Manager.",
      "waf-firewall-manager-multi-account",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-020",
    "objectiveId": "PRO-020",
    "objectiveName": "EBS: Slow post-restore EBS performance: enable Fast Snapshot Restore in target AZs.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "EBS",
    "difficulty": "Hard",
    "type": "single",
    "question": "A logistics company runs quarterly disaster recovery drills in which it restores a fleet of EC2 instances from EBS snapshots into two Availability Zones in the same Region. The drills keep missing the 30-minute RTO because the restored gp3 volumes perform poorly for the first several hours while blocks are lazily loaded from Amazon S3, and the database consistency checks that gate go-live run far over their time budget. The company needs the restored volumes to deliver full provisioned performance immediately at the next drill. Which solution will meet these requirements with the LEAST operational overhead?",
    "options": [
      {
        "id": "a",
        "text": "Run a script on each restored volume that reads every block before the consistency checks start.",
        "correct": false,
        "explanation": "Manually initializing volumes by reading all blocks does eliminate the lazy-load penalty, but it takes hours for large volumes and must be orchestrated across the whole fleet every drill. It trades the RTO problem for heavy recurring operations work."
      },
      {
        "id": "b",
        "text": "Restore the snapshots to io2 volumes with a higher provisioned IOPS setting.",
        "correct": false,
        "explanation": "The first-touch latency comes from blocks being fetched from S3, which affects every volume type restored from a snapshot. Paying for io2 IOPS does not remove the initialization penalty."
      },
      {
        "id": "c",
        "text": "Copy the snapshots to a second Region ahead of each drill and restore from the copies.",
        "correct": false,
        "explanation": "The drills already restore within the same Region, so a cross-Region copy adds transfer cost and process steps without changing lazy loading. Restored volumes in the second Region would hydrate from S3 just as slowly."
      },
      {
        "id": "d",
        "text": "Enable Fast Snapshot Restore on the snapshots in the two Availability Zones used for the drills.",
        "correct": true,
        "explanation": "FSR pre-initializes snapshots per Availability Zone so volumes created from them deliver full provisioned performance at creation with no hydration delay. It is a per-snapshot setting, requiring no scripts or process changes at drill time."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Enable Fast Snapshot Restore on the drill snapshots in the two target Availability Zones.",
    "explanation": "The binding constraints are immediate full performance on restore and least operational overhead. FSR removes lazy loading as a managed per-AZ snapshot attribute, while block-reading scripts meet the performance goal only with substantial recurring effort, and volume type or Region changes do not address initialization at all.",
    "trigger": "Slow post-restore EBS performance: enable Fast Snapshot Restore in target AZs.",
    "intentGroup": "ebs-fast-snapshot-restore",
    "practiceSet": 2,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EBS"
    ],
    "tags": [
      "Resilient Architectures",
      "EBS",
      "Hard",
      "PRO-020",
      "variant-1",
      "Slow post-restore EBS performance: enable Fast Snapshot Restore in target AZs.",
      "ebs-fast-snapshot-restore",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-021",
    "objectiveId": "PRO-021",
    "objectiveName": "S3 Object Lock: Immutable WORM retention that even root cannot shorten, with fast retrieval",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "S3 Object Lock",
    "difficulty": "Hard",
    "type": "single",
    "question": "A broker-dealer must retain electronic trade confirmations in a write-once, read-many (WORM) format for 7 years to satisfy financial regulations. During examinations, auditors must be able to retrieve any individual record within seconds. The compliance team also requires that no identity in the AWS account, including the account root user and administrators, can shorten the retention period or delete a record before the 7 years elapse. A trading application writes the records to an S3 bucket. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Enable S3 Versioning on the bucket and apply S3 Object Lock in governance mode with a 7-year retention period, and attach an SCP that denies the s3:BypassGovernanceRetention permission to all principals.",
        "correct": false,
        "explanation": "Governance mode remains bypassable by design, and the SCP that blocks s3:BypassGovernanceRetention can itself be modified or removed by organization administrators later, so retention is not truly immutable against all identities."
      },
      {
        "id": "b",
        "text": "Enable S3 Versioning with MFA delete on the bucket and apply a legal hold to each trade confirmation object as it is written.",
        "correct": false,
        "explanation": "A legal hold has no fixed retention period and can be removed at any time by a user with s3:PutObjectLegalHold, and MFA delete only adds a step for authorized deleters rather than preventing deletion."
      },
      {
        "id": "c",
        "text": "Enable S3 Versioning on the bucket and apply S3 Object Lock in compliance mode with a 7-year retention period on the trade confirmation objects.",
        "correct": true,
        "explanation": "Compliance mode prevents every identity, including the root user, from shortening the retention period or deleting protected object versions until the period expires, and objects remain retrievable in milliseconds from S3."
      },
      {
        "id": "d",
        "text": "Archive the trade confirmations to an S3 Glacier vault and apply a Vault Lock policy that enforces a 7-year retention period.",
        "correct": false,
        "explanation": "Vault Lock does enforce immutable WORM retention, but Glacier vault retrievals take minutes to hours, which fails the requirement that auditors retrieve any record within seconds."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "S3 Object Lock in compliance mode with a 7-year retention period (with versioning enabled).",
    "explanation": "Two constraints must be weighed together: immutability against every identity including root, and second-level retrieval during audits. Only Object Lock compliance mode satisfies the immutability bar, because governance mode and legal holds depend on revocable permissions or policies, and Glacier Vault Lock is immutable but violates the retrieval-latency constraint.",
    "trigger": "Immutable WORM retention that even root cannot shorten, with fast retrieval",
    "intentGroup": "s3-object-lock-compliance-mode",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3 Object Lock"
    ],
    "tags": [
      "Secure Architectures",
      "S3 Object Lock",
      "Hard",
      "PRO-021",
      "variant-1",
      "Immutable WORM retention that even root cannot shorten, with fast retrieval",
      "s3-object-lock-compliance-mode",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-022",
    "objectiveId": "PRO-022",
    "objectiveName": "Amazon MQ: AZ-resilient ActiveMQ without rewriting OpenWire/AMQP clients",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Amazon MQ",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A company runs an order-processing system that uses an Apache ActiveMQ broker on a single EC2 instance in one Availability Zone. Producer services publish over the OpenWire protocol, and consumer services running on a second EC2 instance in the same Availability Zone consume over AMQP. A recent AZ disruption halted all order flow for several hours. The company must ensure that both the messaging layer and the consumers survive the loss of an Availability Zone, and it wants to avoid rewriting the producer and consumer code. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Replace the ActiveMQ broker with Amazon SQS standard queues and update the producers and consumers to use the SQS API.",
        "correct": false,
        "explanation": "SQS is highly available, but it does not speak OpenWire or AMQP, so this forces the application rewrite the company explicitly wants to avoid."
      },
      {
        "id": "b",
        "text": "Migrate the broker to an Amazon MQ for ActiveMQ active/standby deployment that spans two Availability Zones.",
        "correct": true,
        "explanation": "Amazon MQ supports the existing OpenWire and AMQP clients with minimal endpoint changes, and the active/standby deployment fails over automatically to the second AZ."
      },
      {
        "id": "c",
        "text": "Deploy ActiveMQ on two EC2 instances in separate Availability Zones and replicate the KahaDB message store between them with a scheduled rsync job.",
        "correct": false,
        "explanation": "Periodic file-level rsync of a live KahaDB store risks message loss and corruption on failover and requires custom failover tooling, so it does not provide reliable AZ-level resilience."
      },
      {
        "id": "d",
        "text": "Migrate the broker to a single-instance Amazon MQ for ActiveMQ deployment on a larger instance type with EBS storage.",
        "correct": false,
        "explanation": "A single-instance Amazon MQ broker runs in one Availability Zone, so a larger instance type does nothing to protect the messaging layer from an AZ failure."
      },
      {
        "id": "e",
        "text": "Run the consumer services in an Auto Scaling group that spans multiple Availability Zones.",
        "correct": true,
        "explanation": "Spreading the consumers across AZs in an Auto Scaling group ensures order processing continues and unhealthy consumer instances are replaced when one AZ is lost."
      }
    ],
    "answers": [
      "b",
      "e"
    ],
    "correctOptionIds": [
      "b",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "e"
    ],
    "answerSummary": "Move the broker to an Amazon MQ active/standby deployment across two AZs, and run the consumers in a multi-AZ Auto Scaling group.",
    "explanation": "The discriminating constraints are protocol compatibility (OpenWire/AMQP with no code rewrite) and AZ-level fault tolerance for both tiers. Amazon MQ active/standby preserves the native protocols while adding cross-AZ failover, and only a multi-AZ Auto Scaling group makes the consumer tier survive the same event.",
    "trigger": "AZ-resilient ActiveMQ without rewriting OpenWire/AMQP clients",
    "intentGroup": "amazon-mq-active-standby",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Amazon MQ"
    ],
    "tags": [
      "Resilient Architectures",
      "Amazon MQ",
      "Hard",
      "PRO-022",
      "variant-1",
      "AZ-resilient ActiveMQ without rewriting OpenWire/AMQP clients",
      "amazon-mq-active-standby",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-023",
    "objectiveId": "PRO-023",
    "objectiveName": "S3 Transfer Acceleration: Global resumable multi-GB uploads to one bucket",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "S3 Transfer Acceleration",
    "difficulty": "Medium",
    "type": "single",
    "question": "A media production company has field crews on five continents that upload 5-20 GB raw video files to a single S3 bucket in us-east-1. The crews often work over unstable cellular and satellite links, and interrupted uploads currently restart from the beginning. The company wants to keep the single-bucket ingest workflow, improve long-distance upload throughput, and allow interrupted transfers to resume where they left off. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Enable S3 Transfer Acceleration on the bucket and update the upload tool to use multipart uploads against the accelerated endpoint.",
        "correct": true,
        "explanation": "Transfer Acceleration routes uploads over the AWS edge network to shorten the long-haul path, and multipart uploads let a dropped connection retry only the failed parts instead of restarting the whole file."
      },
      {
        "id": "b",
        "text": "Create a CloudFront distribution with the bucket as the origin, allow PUT requests, and direct the crews to upload through the distribution.",
        "correct": false,
        "explanation": "CloudFront can forward PUT requests, but it is built for content delivery and provides no managed resume capability for multi-GB uploads, so interrupted transfers would still restart."
      },
      {
        "id": "c",
        "text": "Create a regional S3 bucket on each continent for local uploads and configure Cross-Region Replication to the us-east-1 bucket.",
        "correct": false,
        "explanation": "Per-continent buckets would shorten the first hop, but this abandons the required single-bucket workflow and adds replication lag, storage cost, and ongoing operational overhead for six buckets."
      },
      {
        "id": "d",
        "text": "Deploy AWS Global Accelerator and route the upload traffic through its static anycast IP addresses to the S3 regional endpoint.",
        "correct": false,
        "explanation": "Global Accelerator fronts ALB, NLB, EC2, and Elastic IP endpoints; it cannot be used to accelerate requests to the S3 API, so this design is not viable for bucket uploads."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "S3 Transfer Acceleration on the bucket combined with multipart uploads.",
    "explanation": "The solution must satisfy two constraints at once: faster long-distance throughput to a single us-east-1 bucket and resumability over flaky links. Transfer Acceleration addresses the distance problem over the edge network while multipart upload addresses resume-after-interruption, and no distractor delivers both without breaking the single-bucket requirement.",
    "trigger": "Global resumable multi-GB uploads to one bucket",
    "intentGroup": "s3-transfer-acceleration-global-upload",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3 Transfer Acceleration"
    ],
    "tags": [
      "High-Performing Architectures",
      "S3 Transfer Acceleration",
      "Medium",
      "PRO-023",
      "variant-1",
      "Global resumable multi-GB uploads to one bucket",
      "s3-transfer-acceleration-global-upload",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-024",
    "objectiveId": "PRO-024",
    "objectiveName": "RDS: Cut RDS fleet cost 30% without touching prod performance, availability, or backups",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "RDS",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A company runs 40 Amazon RDS instances across production and non-production environments in a single account. Finance has mandated a 30% reduction in database spend within one quarter. The production databases run steady-state workloads 24/7 and must keep their current performance, Multi-AZ availability, and backup posture. The non-production databases are used only during business hours on weekdays. Which combination of actions will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Purchase Reserved Instances for the production databases that run steady-state workloads.",
        "correct": true,
        "explanation": "The production fleet runs 24/7 at a predictable size, which is exactly the usage profile where Reserved Instances cut cost significantly without touching performance or availability."
      },
      {
        "id": "b",
        "text": "Convert the production Multi-AZ deployments to Single-AZ deployments.",
        "correct": false,
        "explanation": "Dropping the standby roughly halves instance cost but removes automatic failover, directly violating the requirement to preserve production availability."
      },
      {
        "id": "c",
        "text": "Stop the non-production instances outside business hours by using a scheduler.",
        "correct": true,
        "explanation": "Non-production databases are idle nights and weekends, so scheduled stop/start eliminates roughly two-thirds of their instance hours with no impact on production."
      },
      {
        "id": "d",
        "text": "Migrate all database storage from gp3 volumes to magnetic storage.",
        "correct": false,
        "explanation": "Magnetic storage is a previous-generation option with far lower IOPS, so applying it fleet-wide would degrade production performance in exchange for modest savings."
      },
      {
        "id": "e",
        "text": "Reduce the automated backup retention period on all instances to zero.",
        "correct": false,
        "explanation": "Setting retention to zero disables automated backups and point-in-time recovery, which breaks the requirement to keep the current backup posture on production."
      },
      {
        "id": "f",
        "text": "Review CloudWatch metrics and remove or downsize read replicas that show little or no read traffic.",
        "correct": true,
        "explanation": "Idle read replicas bill as full instances while serving no meaningful traffic, so retiring or shrinking them based on metrics reduces spend without affecting production workloads."
      }
    ],
    "answers": [
      "a",
      "c",
      "f"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "f"
    ],
    "answerSummary": "Buy RIs for steady-state production databases, schedule non-production instances to stop outside business hours, and remove or downsize idle read replicas identified from metrics.",
    "explanation": "The constraint pair is aggressive cost reduction versus untouchable production performance, availability, and backups. RIs, non-production scheduling, and pruning idle replicas all cut spend without touching those guarantees, while the Single-AZ, magnetic-storage, and zero-retention options each save money only by violating one stated constraint.",
    "trigger": "Cut RDS fleet cost 30% without touching prod performance, availability, or backups",
    "intentGroup": "rds-fleet-cost-reduction",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "RDS"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "RDS",
      "Hard",
      "PRO-024",
      "variant-1",
      "Cut RDS fleet cost 30% without touching prod performance, availability, or backups",
      "rds-fleet-cost-reduction",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-025",
    "objectiveId": "PRO-025",
    "objectiveName": "VPC: Private path to exactly one S3 bucket at the lowest cost",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "VPC",
    "difficulty": "Hard",
    "type": "single",
    "question": "A company processes regulated documents on EC2 instances that run in private subnets of a VPC. The instances must read and write objects in one specific S3 bucket, and the traffic must not traverse the public internet. As an exfiltration control, the security team must also guarantee that the workloads cannot send data to any other S3 bucket, including buckets in external AWS accounts. Which solution will meet these requirements MOST cost-effectively?",
    "options": [
      {
        "id": "a",
        "text": "Route the S3 traffic through a NAT gateway and add a bucket policy on the approved bucket that allows requests only from the NAT gateway's Elastic IP address.",
        "correct": false,
        "explanation": "A NAT gateway sends traffic to the public S3 endpoint over the internet path and adds hourly plus per-GB charges, and a policy on the approved bucket cannot stop uploads to other buckets."
      },
      {
        "id": "b",
        "text": "Add an outbound security group rule on the instances that permits HTTPS traffic only to the AWS-managed S3 prefix list for the Region.",
        "correct": false,
        "explanation": "The managed prefix list covers every S3 bucket reachable in the Region, including buckets in other accounts, so this rule cannot restrict access to one specific bucket."
      },
      {
        "id": "c",
        "text": "Create an interface VPC endpoint for S3 with private DNS enabled and keep the default endpoint policy that allows full access.",
        "correct": false,
        "explanation": "An interface endpoint keeps traffic private, but the default full-access policy still permits requests to any bucket, and its hourly and data-processing charges make it costlier than a gateway endpoint."
      },
      {
        "id": "d",
        "text": "Create a gateway VPC endpoint for S3 and attach an endpoint policy that limits actions to the ARNs of the approved bucket and its objects.",
        "correct": true,
        "explanation": "A gateway endpoint keeps S3 traffic on the AWS network at no charge, and its endpoint policy blocks requests to every bucket except the approved one, satisfying the exfiltration control."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "A gateway VPC endpoint for S3 with an endpoint policy scoped to the approved bucket's ARNs.",
    "explanation": "Three constraints interact here: private network path, a deny-by-default scope of exactly one bucket, and lowest cost. Only the gateway endpoint with a scoped endpoint policy meets all three, because the prefix-list and default-policy options fail the single-bucket scope and the NAT and interface-endpoint options add avoidable charges.",
    "trigger": "Private path to exactly one S3 bucket at the lowest cost",
    "intentGroup": "s3-gateway-endpoint-policy-scope",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "VPC"
    ],
    "tags": [
      "Secure Architectures",
      "VPC",
      "Hard",
      "PRO-025",
      "variant-1",
      "Private path to exactly one S3 bucket at the lowest cost",
      "s3-gateway-endpoint-policy-scope",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-026",
    "objectiveId": "PRO-026",
    "objectiveName": "Route 53: Automatic DNS failover to a serverless read-only fallback site",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Route 53",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An e-commerce company serves its storefront from an Application Load Balancer in front of an Auto Scaling group in us-east-1, with Route 53 hosting the public DNS record. During a recent outage of the primary environment, customers saw connection errors for 45 minutes. The company wants customers to be switched automatically to a functional read-only version of the product catalog whenever the primary site fails health checks, and it wants the failover mechanism to add the LEAST operational overhead. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Create a Route 53 failover routing policy with the ALB as the primary record and associate a health check that monitors the primary endpoint.",
        "correct": true,
        "explanation": "Failover routing with a health check is the mechanism that detects the primary outage and automatically shifts DNS resolution to the secondary record with no manual action."
      },
      {
        "id": "b",
        "text": "Create a Route 53 latency-based routing policy with two records that point to the ALB and to a second target group in the same Region.",
        "correct": false,
        "explanation": "Latency-based routing chooses the lowest-latency endpoint rather than a healthy-versus-failed one, and two targets in the same Region share the same failure domain as the outage being mitigated."
      },
      {
        "id": "c",
        "text": "Enable cross-zone load balancing on the ALB so that traffic shifts to healthy Availability Zones during a disruption.",
        "correct": false,
        "explanation": "Cross-zone load balancing only redistributes traffic among targets behind the same ALB, so it provides nothing when the ALB or its environment is the component that has failed."
      },
      {
        "id": "d",
        "text": "Host a read-only static copy of the product catalog in an S3 bucket behind CloudFront and configure it as the secondary failover record.",
        "correct": true,
        "explanation": "A static S3 and CloudFront site delivers the required read-only catalog with no servers to manage, making it the lowest-overhead secondary target for the failover record."
      },
      {
        "id": "e",
        "text": "Reduce the TTL of the storefront's DNS record to 30 seconds so that clients re-resolve promptly during an outage.",
        "correct": false,
        "explanation": "A short TTL speeds up propagation of a DNS change but provides no fallback destination and no automatic detection, so on its own customers would still resolve to the failed ALB."
      }
    ],
    "answers": [
      "a",
      "d"
    ],
    "correctOptionIds": [
      "a",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d"
    ],
    "answerSummary": "Route 53 failover routing with a health check on the primary ALB, plus an S3/CloudFront static read-only catalog as the secondary record.",
    "explanation": "The requirements combine automatic failure detection with a functional read-only destination at minimal operational cost. The health-checked failover policy supplies the automatic switch, and the serverless static site supplies the fallback experience; the same-region, cross-zone, and TTL options each address only part of the problem or stay inside the failed environment.",
    "trigger": "Automatic DNS failover to a serverless read-only fallback site",
    "intentGroup": "route53-failover-static-fallback",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Route 53"
    ],
    "tags": [
      "Resilient Architectures",
      "Route 53",
      "Hard",
      "PRO-026",
      "variant-1",
      "Automatic DNS failover to a serverless read-only fallback site",
      "route53-failover-static-fallback",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-027",
    "objectiveId": "PRO-027",
    "objectiveName": "ElastiCache: Shared session store needing sorted sets plus Multi-AZ automatic failover",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "ElastiCache",
    "difficulty": "Medium",
    "type": "single",
    "question": "A gaming company runs a web farm on EC2 instances behind an Application Load Balancer. Player session state and a real-time leaderboard that relies on sorted-set operations are currently kept in memory on each instance and are lost whenever the Auto Scaling group scales in. The company needs a shared store that delivers sub-millisecond reads, supports the sorted-set data structure natively, replicates data across Availability Zones, and fails over automatically if a node or an AZ fails. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Deploy an ElastiCache for Memcached cluster with nodes distributed across multiple Availability Zones.",
        "correct": false,
        "explanation": "Memcached partitions data but does not replicate it or fail over automatically, and it offers no sorted-set data structure, so a node or AZ loss still destroys sessions and the leaderboard."
      },
      {
        "id": "b",
        "text": "Deploy an ElastiCache for Redis replication group with Multi-AZ enabled and automatic failover turned on.",
        "correct": true,
        "explanation": "Redis natively supports sorted sets for the leaderboard, and a Multi-AZ replication group provides cross-AZ replicas with automatic failover at sub-millisecond read latency."
      },
      {
        "id": "c",
        "text": "Enable sticky sessions on the ALB and keep the session state and leaderboard in memory on each instance.",
        "correct": false,
        "explanation": "Stickiness only pins a player to one instance; the state is still instance-local, so it is lost on scale-in or instance failure, which is the exact problem being solved."
      },
      {
        "id": "d",
        "text": "Store the session state and leaderboard in a DynamoDB table and use strongly consistent reads for lookups.",
        "correct": false,
        "explanation": "DynamoDB is durable and multi-AZ, but strongly consistent reads are single-digit-millisecond at best and cost double, and sorted-set-style ranking must be reimplemented in the application."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "ElastiCache for Redis Multi-AZ replication group with automatic failover.",
    "explanation": "The deciding constraints are native sorted-set support plus cross-AZ replication with automatic failover at sub-millisecond latency. Only Redis satisfies the data-structure requirement, and only a Multi-AZ replication group satisfies the availability requirement; Memcached, sticky sessions, and DynamoDB each fail at least one of the stated constraints.",
    "trigger": "Shared session store needing sorted sets plus Multi-AZ automatic failover",
    "intentGroup": "elasticache-redis-vs-memcached",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ElastiCache"
    ],
    "tags": [
      "High-Performing Architectures",
      "ElastiCache",
      "Medium",
      "PRO-027",
      "variant-1",
      "Shared session store needing sorted sets plus Multi-AZ automatic failover",
      "elasticache-redis-vs-memcached",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-028",
    "objectiveId": "PRO-028",
    "objectiveName": "Lambda: Reduce Lambda spend via right-sizing, Graviton, and removing billed idle waits",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Lambda",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A company's serverless platform runs about 200 Lambda functions on the x86_64 architecture. All functions were deployed with 3 GB of memory that was never validated against actual usage, and several functions call downstream HTTP APIs and then poll in a loop until the downstream work finishes. Traffic is spiky and unpredictable. Finance requires a 25% reduction in Lambda spend without increasing end-to-end latency for users. Which combination of actions will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Enable provisioned concurrency on all functions to lock in a lower per-millisecond compute rate.",
        "correct": false,
        "explanation": "Provisioned concurrency bills for the configured capacity around the clock, so applying it fleet-wide to spiky, unpredictable traffic raises the bill instead of lowering it."
      },
      {
        "id": "b",
        "text": "Profile the functions with AWS Lambda Power Tuning and CloudWatch metrics, then right-size the memory setting of each function.",
        "correct": true,
        "explanation": "The uniform 3 GB setting was never measured, so data-driven right-sizing directly cuts the GB-second charge for over-provisioned functions while keeping duration acceptable."
      },
      {
        "id": "c",
        "text": "Configure reserved concurrency on the most expensive functions to cap what they can spend.",
        "correct": false,
        "explanation": "Reserved concurrency is a throttling limit, not a pricing tier; capping it rejects or delays invocations under load, which adds user-facing latency and errors rather than savings."
      },
      {
        "id": "d",
        "text": "Migrate the functions whose runtimes and dependencies are compatible to the arm64 (Graviton2) architecture.",
        "correct": true,
        "explanation": "arm64 duration pricing is about 20% lower than x86_64 with comparable or better performance, so compatible functions save money with no latency penalty."
      },
      {
        "id": "e",
        "text": "Redesign the polling functions to be event-driven so that downstream completion triggers an invocation instead of an in-function wait.",
        "correct": true,
        "explanation": "Functions that poll synchronously are billed for the entire wait; converting them to callback- or queue-triggered invocations eliminates paying for idle time."
      },
      {
        "id": "f",
        "text": "Lower each function's timeout setting so that normal invocations are billed for less execution time.",
        "correct": false,
        "explanation": "Billed duration is the actual run time, not the timeout value, so shortening the timeout saves nothing on normal invocations and only kills legitimate long runs."
      }
    ],
    "answers": [
      "b",
      "d",
      "e"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "e"
    ],
    "answerSummary": "Right-size memory using power tuning and metrics, migrate compatible functions to arm64 (Graviton2), and replace synchronous polling with event-driven invocation.",
    "explanation": "The constraints are a 25% cost cut with no added user latency under spiky traffic. Right-sizing, arm64 pricing, and eliminating billed idle-wait all reduce genuine GB-second spend, whereas provisioned concurrency charges for idle capacity, reserved concurrency throttles users, and timeout changes do not alter billed duration.",
    "trigger": "Reduce Lambda spend via right-sizing, Graviton, and removing billed idle waits",
    "intentGroup": "lambda-cost-tuning",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Lambda"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Lambda",
      "Hard",
      "PRO-028",
      "variant-1",
      "Reduce Lambda spend via right-sizing, Graviton, and removing billed idle waits",
      "lambda-cost-tuning",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-029",
    "objectiveId": "PRO-029",
    "objectiveName": "Macie: Continuous PII discovery plus on-retrieval redaction without duplicate datasets",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "Macie",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A financial-services company ingests partner-submitted CSV files into a data lake S3 bucket every hour. Some files may contain PII such as national identification numbers. The security team requires continuous, automated discovery of sensitive data in the bucket with alerts whenever PII is found. Internal analysts must be able to read the rows, but they may only see redacted values, and the data platform team refuses to build and maintain duplicate scrubbed copies of the datasets. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Enable GuardDuty S3 Protection for the account and route its findings to the security team through EventBridge.",
        "correct": false,
        "explanation": "GuardDuty S3 Protection detects suspicious access patterns and threats against buckets; it does not inspect object contents for PII, so it cannot satisfy the discovery requirement."
      },
      {
        "id": "b",
        "text": "Run an AWS Glue job with PII detection once against the bucket and write cleansed output to a second bucket for analysts.",
        "correct": false,
        "explanation": "A one-time job misses the hourly partner files that arrive afterward, and the cleansed second bucket is exactly the duplicate dataset the platform team refuses to maintain."
      },
      {
        "id": "c",
        "text": "Enable Amazon Macie automated sensitive data discovery on the bucket and forward findings to the security team through EventBridge.",
        "correct": true,
        "explanation": "Macie's automated sensitive data discovery continuously samples and classifies new objects for PII and emits findings that EventBridge can turn into alerts, meeting the continuous-discovery requirement."
      },
      {
        "id": "d",
        "text": "Schedule nightly Amazon Comprehend PII batch jobs that write scrubbed copies of new files to an analyst-facing bucket.",
        "correct": false,
        "explanation": "Comprehend can detect and mask PII, but the nightly scrubbed copy creates a second dataset to keep in sync, violating the no-duplicate-datasets constraint."
      },
      {
        "id": "e",
        "text": "Create an S3 Object Lambda Access Point that redacts PII from objects as analysts retrieve them, and grant analysts access only through it.",
        "correct": true,
        "explanation": "Object Lambda transforms data in-line on GET requests, so analysts receive redacted rows from the single source bucket without any duplicate scrubbed copy existing."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Enable Macie automated sensitive data discovery with EventBridge alerting, and serve analysts through an S3 Object Lambda Access Point that redacts PII on retrieval.",
    "explanation": "Two constraints must be satisfied together: continuous PII discovery with alerting, and redacted analyst access without maintaining a second dataset. Macie automated discovery covers the first, and Object Lambda's on-retrieval transformation covers the second; the Glue and Comprehend options both create duplicate copies, and GuardDuty addresses threats rather than data classification.",
    "trigger": "Continuous PII discovery plus on-retrieval redaction without duplicate datasets",
    "intentGroup": "macie-object-lambda-pii",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Macie"
    ],
    "tags": [
      "Secure Architectures",
      "Macie",
      "Hard",
      "PRO-029",
      "variant-1",
      "Continuous PII discovery plus on-retrieval redaction without duplicate datasets",
      "macie-object-lambda-pii",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-030",
    "objectiveId": "PRO-030",
    "objectiveName": "SQS: Per-key ordering with parallel groups and isolated poison-message impact",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "SQS",
    "difficulty": "Hard",
    "type": "single",
    "question": "A logistics company collects telematics events from 50,000 vehicles. Events for a given vehicle must be processed in the exact order in which they were produced, but events from different vehicles can be processed in parallel to keep up with peak load. Occasionally a malformed event fails processing; when that happens, the pipeline must continue processing events for all other vehicles while only the affected vehicle's subsequent events are held back. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Publish the events to an SQS standard queue, embed a per-vehicle sequence number in each payload, and reorder events in the consumer.",
        "correct": false,
        "explanation": "A standard queue delivers out of order and at least once, so every consumer must buffer and reorder application-side, adding fragile logic without any built-in per-vehicle failure isolation."
      },
      {
        "id": "b",
        "text": "Publish the events to a Kinesis data stream with a single shard so that all records are read in the order they were written.",
        "correct": false,
        "explanation": "One shard imposes a global order that serializes all 50,000 vehicles through a 1 MB/s pipe, and a poison record halts the entire shard rather than just the affected vehicle."
      },
      {
        "id": "c",
        "text": "Publish the events to an SNS FIFO topic and subscribe the processing Lambda function directly to the topic.",
        "correct": false,
        "explanation": "SNS FIFO topics deliver only to Amazon SQS queue subscriptions, not directly to Lambda, so this design still requires a queue and does not itself provide ordered, isolated processing."
      },
      {
        "id": "d",
        "text": "Publish the events to an SQS FIFO queue and set each message's message group ID to the vehicle ID.",
        "correct": true,
        "explanation": "FIFO message groups guarantee strict ordering within each vehicle's group while different groups process in parallel, and a failed message blocks only its own group's subsequent messages."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "An SQS FIFO queue with the vehicle ID as the message group ID.",
    "explanation": "Three constraints must hold simultaneously: strict per-vehicle ordering, parallelism across vehicles, and failure isolation to a single vehicle. SQS FIFO message groups deliver exactly this combination, while a single Kinesis shard sacrifices parallelism and isolation, and standard-queue or direct SNS FIFO designs cannot guarantee ordered, isolated consumption.",
    "trigger": "Per-key ordering with parallel groups and isolated poison-message impact",
    "intentGroup": "sqs-fifo-per-device-ordering",
    "practiceSet": 3,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "SQS"
    ],
    "tags": [
      "Resilient Architectures",
      "SQS",
      "Hard",
      "PRO-030",
      "variant-1",
      "Per-key ordering with parallel groups and isolated poison-message impact",
      "sqs-fifo-per-device-ordering",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-031",
    "objectiveId": "PRO-031",
    "objectiveName": "IAM: Delegate IAM role creation safely with an enforced permissions boundary condition.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "IAM",
    "difficulty": "Hard",
    "type": "single",
    "question": "A platform engineering team at a financial services company manages 40 development teams across a multi-account AWS organization. To speed up delivery, the company wants each development team to create and manage IAM roles for its own applications without waiting on the platform team. The security organization requires that no developer-created role can ever hold permissions beyond a defined ceiling, even if a developer attaches an administrator policy to it, and the control must be enforced at role-creation time rather than detected afterward. Which solution will meet these requirements while preserving developer self-service?",
    "options": [
      {
        "id": "a",
        "text": "Remove iam:CreateRole and iam:PutRolePolicy from developer principals and route all role creation through a pipeline operated by the platform team.",
        "correct": false,
        "explanation": "Centralizing role creation enforces the ceiling but eliminates the developer self-service that the company explicitly requires, reintroducing the platform team as a bottleneck."
      },
      {
        "id": "b",
        "text": "Allow developers iam:CreateRole and iam:PutRolePolicy only when iam:PermissionsBoundary equals the ARN of a platform-managed boundary policy.",
        "correct": true,
        "explanation": "Correct. The condition forces every developer-created role to carry the permissions boundary, so a role's effective permissions can never exceed the boundary's ceiling regardless of what identity policies are attached, and it is enforced preventively at creation time."
      },
      {
        "id": "c",
        "text": "Attach a service control policy to each development account that limits every principal in the account to the AWS services and actions the security organization has approved.",
        "correct": false,
        "explanation": "An SCP caps every principal in the account uniformly; it cannot express a distinct ceiling for developer-created application roles versus other principals, and broad account-level restrictions would also constrain the platform team's own roles."
      },
      {
        "id": "d",
        "text": "Enable IAM Access Analyzer in every account and flag newly created roles whose attached policies grant permissions beyond the approved ceiling.",
        "correct": false,
        "explanation": "Access Analyzer is a detective control that reports after the role exists; the requirement states the ceiling must be enforced at creation time, not detected afterward."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Grant iam:CreateRole/iam:PutRolePolicy only when the iam:PermissionsBoundary condition references the platform-managed boundary policy.",
    "explanation": "The discriminating constraints are self-service plus a preventive, per-role permission ceiling. Only a permissions boundary enforced through the iam:PermissionsBoundary condition key satisfies both: developers keep creating roles themselves, and IAM refuses any creation that omits the boundary. Centralized creation kills self-service, SCPs cap the whole account rather than created roles specifically, and Access Analyzer is detective rather than preventive.",
    "trigger": "Delegate IAM role creation safely with an enforced permissions boundary condition.",
    "intentGroup": "iam-permissions-boundary-delegation",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "IAM"
    ],
    "tags": [
      "Secure Architectures",
      "IAM",
      "Hard",
      "PRO-031",
      "variant-1",
      "Delegate IAM role creation safely with an enforced permissions boundary condition.",
      "iam-permissions-boundary-delegation",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-032",
    "objectiveId": "PRO-032",
    "objectiveName": "EFS: Fix stateful Auto Scaling instances with shared EFS storage and externalized session state.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "EFS",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A media company runs a PHP-based content management system on an Auto Scaling group of EC2 instances spread across three Availability Zones behind an Application Load Balancer. Editors upload images and video thumbnails that are written to each instance's local EBS volume, and user sessions are held in instance memory. During scale-in events, recently uploaded media disappears, and when an instance fails, logged-in editors are forced to re-authenticate. The company needs uploads to be durable and visible to every instance immediately, and sessions must survive the loss of any single instance or Availability Zone. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Create an Amazon EFS file system with mount targets in all three Availability Zones and mount it on every instance for the uploaded media directory.",
        "correct": true,
        "explanation": "Correct. EFS provides a shared, Multi-AZ POSIX file system that every instance mounts, so uploads are immediately visible fleet-wide and survive scale-in or AZ loss."
      },
      {
        "id": "b",
        "text": "Attach an io2 volume with Multi-Attach enabled to all instances in the group and mount it as the shared media directory.",
        "correct": false,
        "explanation": "Multi-Attach works only within a single Availability Zone and requires a cluster-aware file system; it cannot serve an Auto Scaling group spanning three AZs."
      },
      {
        "id": "c",
        "text": "Replace the fleet with larger instance types that include NVMe instance store volumes and replicate the uploads directory between instances.",
        "correct": false,
        "explanation": "Instance store is ephemeral, so data is lost on stop or failure; peer-to-peer replication adds fragility rather than the durability the scenario demands."
      },
      {
        "id": "d",
        "text": "Move session state into ElastiCache for Redis and application data into an RDS Multi-AZ deployment instead of keeping state on the instances.",
        "correct": true,
        "explanation": "Correct. Externalizing sessions and database state into managed Multi-AZ services makes instances stateless, so an instance or AZ failure no longer logs editors out."
      },
      {
        "id": "e",
        "text": "Schedule a cron job on each instance that syncs the local uploads directory to Amazon S3 and pulls new objects from the other instances.",
        "correct": false,
        "explanation": "Periodic sync leaves a window where uploads exist on only one instance, so scale-in still loses data and the immediate-visibility requirement is not met."
      }
    ],
    "answers": [
      "a",
      "d"
    ],
    "correctOptionIds": [
      "a",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d"
    ],
    "answerSummary": "Mount a Multi-AZ EFS file system for uploads and externalize sessions/data to ElastiCache and RDS Multi-AZ.",
    "explanation": "Two constraints must be solved together: shared durable file storage across three AZs and stateless instances for session survival. EFS with per-AZ mount targets addresses the media requirement, while ElastiCache plus RDS Multi-AZ removes session and data state from the fleet. Multi-Attach EBS is single-AZ, instance store is ephemeral, and cron-based sync violates immediate consistency.",
    "trigger": "Fix stateful Auto Scaling instances with shared EFS storage and externalized session state.",
    "intentGroup": "efs-shared-state-multi-az",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EFS"
    ],
    "tags": [
      "Resilient Architectures",
      "EFS",
      "Hard",
      "PRO-032",
      "variant-1",
      "Fix stateful Auto Scaling instances with shared EFS storage and externalized session state.",
      "efs-shared-state-multi-az",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-033",
    "objectiveId": "PRO-033",
    "objectiveName": "CloudFront: Accelerate mixed static and personalized traffic with per-behavior CloudFront caching.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "CloudFront",
    "difficulty": "Hard",
    "type": "single",
    "question": "An e-commerce company serves its entire site from www.example.com through an Application Load Balancer in us-east-1. Roughly 70% of requests are for versioned static assets under /assets/*, while the rest are personalized pages that vary by a session cookie and an Accept-Language header. Customers in Europe and Asia report page loads exceeding 3 seconds. The company must reduce global latency for both content types, keep the single hostname, and must not serve one customer's personalized page to another. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Deploy AWS Global Accelerator in front of the Application Load Balancer and route all traffic through its anycast endpoints.",
        "correct": false,
        "explanation": "Global Accelerator optimizes the network path but performs no caching, so the 70% of requests for static assets still travel to us-east-1 on every hit, leaving most of the latency win on the table."
      },
      {
        "id": "b",
        "text": "Create a CloudFront distribution for a new static.example.com hostname and continue serving dynamic pages directly from the load balancer.",
        "correct": false,
        "explanation": "Splitting hostnames violates the single-domain requirement and leaves personalized pages without any edge acceleration for European and Asian users."
      },
      {
        "id": "c",
        "text": "Create a CloudFront distribution with the ALB as origin, a long-TTL /assets/* behavior, and a default cache policy keyed on the session cookie and Accept-Language header.",
        "correct": true,
        "explanation": "Correct. Separate cache behaviors let static assets cache aggressively at the edge while dynamic requests ride CloudFront's optimized connections to the origin, and keying the cache on the cookie and header prevents cross-customer page leakage."
      },
      {
        "id": "d",
        "text": "Replicate the full application stack, including its data stores, to eu-west-1 and ap-southeast-1 and use Route 53 latency-based routing to send customers to the nearest Region.",
        "correct": false,
        "explanation": "Multi-region replication reduces latency but introduces data replication, deployment, and consistency work far beyond what the requirement calls for when edge caching solves the problem."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "One CloudFront distribution with a long-TTL /assets/* behavior and a default behavior keyed on the session cookie and Accept-Language header.",
    "explanation": "The constraints are global latency for two traffic classes, a single hostname, and personalization correctness. Only per-path cache behaviors on one CloudFront distribution satisfy all three: aggressive caching for /assets/* and a dynamic behavior that includes the cookie and header in the cache key. Global Accelerator skips caching, split hostnames break the domain constraint, and multi-region replication is disproportionate.",
    "trigger": "Accelerate mixed static and personalized traffic with per-behavior CloudFront caching.",
    "intentGroup": "cloudfront-mixed-content-behaviors",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "CloudFront"
    ],
    "tags": [
      "High-Performing Architectures",
      "CloudFront",
      "Hard",
      "PRO-033",
      "variant-1",
      "Accelerate mixed static and personalized traffic with per-behavior CloudFront caching.",
      "cloudfront-mixed-content-behaviors",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-034",
    "objectiveId": "PRO-034",
    "objectiveName": "Snowball: Combine offline bulk transfer, online delta sync, and immediate archive-class transition.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Snowball",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A broadcaster must migrate a 500 TB on-premises cold media archive to Amazon S3 within 8 weeks before its data center lease expires. The site has a single 1 Gbps internet link that is already 60% consumed by production traffic, and the archive continues to receive roughly 50 GB of small daily changes until cutover. After migration, the archive will be retrieved at most once or twice a year, so the data must reside in an archive storage class rather than accumulating S3 Standard charges. Which combination of steps will meet these requirements MOST cost-effectively? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Enable S3 Transfer Acceleration on the destination bucket and upload the 500 TB archive over the existing internet link.",
        "correct": false,
        "explanation": "Transfer Acceleration optimizes the path to AWS but cannot exceed the roughly 400 Mbps of spare local bandwidth, which would take well over three months for 500 TB."
      },
      {
        "id": "b",
        "text": "Order multiple AWS Snowball Edge Storage Optimized devices and ship the 500 TB bulk archive to AWS on them.",
        "correct": true,
        "explanation": "Correct. Offline transfer with Snowball Edge devices moves the bulk data within weeks without touching the saturated link, fitting the 8-week deadline."
      },
      {
        "id": "c",
        "text": "Provision a 10 Gbps AWS Direct Connect connection and transfer the archive once the circuit is delivered.",
        "correct": false,
        "explanation": "Direct Connect circuits routinely take weeks to months to provision and carry ongoing port costs, making them a poor fit for a one-time migration with an 8-week deadline."
      },
      {
        "id": "d",
        "text": "Run an AWS DataSync task over the existing link to replicate the small daily changes to S3 until cutover.",
        "correct": true,
        "explanation": "Correct. The roughly 50 GB daily delta fits comfortably in the spare bandwidth, and DataSync handles scheduled incremental transfers with verification until the final switchover."
      },
      {
        "id": "e",
        "text": "Deploy an AWS Storage Gateway volume gateway on premises and let it upload the archive to AWS in the background.",
        "correct": false,
        "explanation": "A volume gateway targets ongoing hybrid block storage, still pushes all 500 TB through the constrained link, and stores data as EBS-style volumes rather than S3 objects in an archive class."
      },
      {
        "id": "f",
        "text": "Add an S3 lifecycle rule that transitions objects in the destination prefix to S3 Glacier Deep Archive 0 days after creation.",
        "correct": true,
        "explanation": "Correct. Snowball imports always land in S3 Standard, so a zero-day lifecycle transition ensures both bulk and delta objects move to Deep Archive without accruing Standard charges."
      }
    ],
    "answers": [
      "b",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "f"
    ],
    "answerSummary": "Snowball Edge devices for the 500 TB bulk, DataSync for daily deltas over the existing link, and a zero-day lifecycle transition to Glacier Deep Archive.",
    "explanation": "Three constraints interact: a saturated 1 Gbps link versus 500 TB in 8 weeks, ongoing daily changes, and an archive-class landing requirement. Snowball Edge solves the bulk-versus-bandwidth conflict, DataSync covers the small deltas the link can absorb, and a zero-day lifecycle rule keeps the rarely accessed data out of S3 Standard pricing. Transfer Acceleration and Direct Connect both fail the bandwidth-or-lead-time math.",
    "trigger": "Combine offline bulk transfer, online delta sync, and immediate archive-class transition.",
    "intentGroup": "snowball-bulk-plus-deltas",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Snowball"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Snowball",
      "Hard",
      "PRO-034",
      "variant-1",
      "Combine offline bulk transfer, online delta sync, and immediate archive-class transition.",
      "snowball-bulk-plus-deltas",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-035",
    "objectiveId": "PRO-035",
    "objectiveName": "RDS: Eliminate static database passwords with IAM database authentication tokens.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "RDS",
    "difficulty": "Medium",
    "type": "single",
    "question": "A payments startup runs a containerized API on Amazon ECS that connects to an Aurora MySQL cluster using a connection pool with long-lived connections. After an audit, the security team mandates that no static database password may exist anywhere in application configuration, environment variables, or a secrets store. The team also wants credentials for each new connection to be short-lived and tied to the workload's identity. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Enable IAM database authentication on the cluster and generate a short-lived token from the task's IAM role for each new connection.",
        "correct": true,
        "explanation": "Correct. IAM database authentication replaces the password with a 15-minute signed token derived from the task role, so no static credential exists anywhere and each new connection authenticates with workload identity."
      },
      {
        "id": "b",
        "text": "Store the database credentials in AWS Secrets Manager, enable automatic rotation every 30 days with a rotation Lambda function, and fetch them at container startup.",
        "correct": false,
        "explanation": "Rotation improves hygiene, but a password still exists in a secrets store for up to 30 days at a time, which violates the mandate as stated."
      },
      {
        "id": "c",
        "text": "Save the database password as a SecureString parameter in Systems Manager Parameter Store encrypted with a customer managed KMS key.",
        "correct": false,
        "explanation": "Encryption at rest does not change the fact that a static password persists in configuration storage, which is exactly what the audit prohibits."
      },
      {
        "id": "d",
        "text": "Issue client certificates from AWS Private CA and require mutual TLS verification on every database connection from the API.",
        "correct": false,
        "explanation": "TLS with certificate verification secures the transport channel, but Aurora MySQL still authenticates the database user separately, so this does not replace the banned password."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Enable IAM database authentication and generate short-lived tokens from the ECS task role.",
    "explanation": "The two constraints are the total ban on stored static passwords and per-connection short-lived credentials bound to workload identity. IAM database authentication is the only option that eliminates the password entirely, issuing 15-minute tokens signed by the task role; long-lived pooled connections remain open after authenticating. Secrets Manager and Parameter Store still store a password, and mutual TLS addresses transport rather than database authentication.",
    "trigger": "Eliminate static database passwords with IAM database authentication tokens.",
    "intentGroup": "rds-iam-database-auth",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "RDS"
    ],
    "tags": [
      "Secure Architectures",
      "RDS",
      "Medium",
      "PRO-035",
      "variant-1",
      "Eliminate static database passwords with IAM database authentication tokens.",
      "rds-iam-database-auth",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-036",
    "objectiveId": "PRO-036",
    "objectiveName": "DMS: Pair SCT conversion with DMS full load plus CDC for near-zero-downtime heterogeneous migration.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "DMS",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A logistics company runs a 4 TB on-premises Oracle database with hundreds of PL/SQL stored procedures backing a shipment-tracking application that operates 24/7. To cut licensing costs, the company will migrate to Aurora PostgreSQL, but the business tolerates no more than 15 minutes of downtime at cutover. The team needs the schema and procedural code translated to PostgreSQL and the data kept continuously synchronized until the application is repointed. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Export the Oracle database with Data Pump and import the dump into Aurora PostgreSQL during a weekend maintenance window.",
        "correct": false,
        "explanation": "A dump-and-load of 4 TB requires many hours of application downtime and Data Pump output is Oracle-format, so this fails both the 15-minute window and the engine conversion."
      },
      {
        "id": "b",
        "text": "Take a snapshot of the Oracle database and restore it directly as an Aurora PostgreSQL cluster in the target account.",
        "correct": false,
        "explanation": "Snapshot restore only works between compatible engines and managed sources; it cannot convert an on-premises Oracle database into PostgreSQL."
      },
      {
        "id": "c",
        "text": "Use the AWS Schema Conversion Tool to convert the Oracle schema and PL/SQL procedures into PostgreSQL-compatible objects.",
        "correct": true,
        "explanation": "Correct. SCT automates the heterogeneous schema and procedural code conversion and produces an assessment of the objects that need manual rework, which DMS alone does not do."
      },
      {
        "id": "d",
        "text": "Use AWS DataSync to replicate the Oracle data files from the on-premises servers to the Aurora cluster's storage volumes.",
        "correct": false,
        "explanation": "DataSync moves files and objects between storage systems; Aurora storage is not a mountable target and copying Oracle data files cannot produce a PostgreSQL database."
      },
      {
        "id": "e",
        "text": "Create an AWS DMS task that performs a full load followed by change data capture replication until the application is repointed.",
        "correct": true,
        "explanation": "Correct. Full load plus CDC keeps Aurora synchronized with ongoing Oracle changes, shrinking cutover to the minutes needed to drain replication lag and repoint connections."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Convert schema and PL/SQL with AWS SCT, then run a DMS full-load-plus-CDC task until cutover.",
    "explanation": "The constraints are heterogeneous engine conversion and a 15-minute downtime ceiling on a 24/7 workload. SCT handles the Oracle-to-PostgreSQL schema and PL/SQL translation, while a DMS full-load-plus-CDC task keeps data continuously synchronized so cutover is nearly instantaneous. Dump-based migration imposes hours of downtime, snapshot restore is homogeneous-only, and DataSync is a file-transfer service.",
    "trigger": "Pair SCT conversion with DMS full load plus CDC for near-zero-downtime heterogeneous migration.",
    "intentGroup": "sct-dms-heterogeneous-migration",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "DMS"
    ],
    "tags": [
      "Resilient Architectures",
      "DMS",
      "Hard",
      "PRO-036",
      "variant-1",
      "Pair SCT conversion with DMS full load plus CDC for near-zero-downtime heterogeneous migration.",
      "sct-dms-heterogeneous-migration",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-037",
    "objectiveId": "PRO-037",
    "objectiveName": "EBS: Meet extreme single-volume IOPS plus durability with io2 Block Express.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "EBS",
    "difficulty": "Medium",
    "type": "single",
    "question": "A trading firm runs a single-instance, licensed financial database on EC2 that cannot be clustered. Peak workloads require about 200,000 IOPS with sub-millisecond storage latency, and the firm's compliance policy requires the storage volume itself to be durable and to persist independently of the instance lifecycle. The current gp3 volume is saturating during market open. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Provision the existing gp3 volume to its maximum IOPS and throughput settings.",
        "correct": false,
        "explanation": "gp3 tops out at 16,000 IOPS per volume, more than an order of magnitude short of the 200,000 IOPS requirement."
      },
      {
        "id": "b",
        "text": "Stripe multiple gp3 volumes together in a RAID 0 array to aggregate their provisioned IOPS across the set.",
        "correct": false,
        "explanation": "RAID 0 can aggregate IOPS but multiplies failure exposure, since one volume failure destroys the array, and adds operational burden a single provisioned volume avoids."
      },
      {
        "id": "c",
        "text": "Move the database files to local NVMe instance store volumes on a storage-optimized instance.",
        "correct": false,
        "explanation": "Instance store delivers the IOPS and latency but is ephemeral, so data is lost when the instance stops or fails, violating the durability and persistence requirement."
      },
      {
        "id": "d",
        "text": "Attach an io2 Block Express volume sized for the workload to a supported Nitro-based instance.",
        "correct": true,
        "explanation": "Correct. io2 Block Express supports up to 256,000 IOPS per volume with sub-millisecond latency and 99.999% durability, and it persists independently of the instance."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Attach an io2 Block Express volume on a supported Nitro instance.",
    "explanation": "The discriminators are the combination of roughly 200,000 IOPS at sub-millisecond latency and durable, instance-independent storage. Only io2 Block Express meets both on a single volume; gp3 caps at 16,000 IOPS, RAID 0 trades away the failure domain, and instance store sacrifices durability for speed.",
    "trigger": "Meet extreme single-volume IOPS plus durability with io2 Block Express.",
    "intentGroup": "io2-block-express-high-iops",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EBS"
    ],
    "tags": [
      "High-Performing Architectures",
      "EBS",
      "Medium",
      "PRO-037",
      "variant-1",
      "Meet extreme single-volume IOPS plus durability with io2 Block Express.",
      "io2-block-express-high-iops",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-038",
    "objectiveId": "PRO-038",
    "objectiveName": "Compute Optimizer: Attack non-production waste via scheduling, rightsizing, and Spot for CI.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Compute Optimizer",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A SaaS company's monthly bill shows that 45% of EC2 spend comes from non-production accounts. Dev and test environments run 24/7 even though engineers work roughly 50 hours a week, CloudWatch shows most non-production instances averaging under 10% CPU on instance types two sizes larger than needed, and a fleet of always-on m5.2xlarge CI/CD build runners sits idle between builds. Builds are containerized, stateless, and can safely be retried if interrupted. The company wants to cut non-production EC2 spend without affecting engineers during working hours or reducing the reliability of completed builds. Which combination of steps will meet these requirements MOST cost-effectively? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Deploy Instance Scheduler on AWS to stop dev and test instances outside working hours and on weekends.",
        "correct": true,
        "explanation": "Correct. Cutting runtime from 168 hours to roughly 50 hours a week eliminates around 70% of on-demand cost for environments nobody uses overnight."
      },
      {
        "id": "b",
        "text": "Purchase three-year Standard Reserved Instances covering the current dev and test instance families.",
        "correct": false,
        "explanation": "Committing for three years to oversized instances that should be stopped most of the week locks in the waste instead of removing it."
      },
      {
        "id": "c",
        "text": "Apply AWS Compute Optimizer rightsizing recommendations to downsize the underutilized non-production instances.",
        "correct": true,
        "explanation": "Correct. Sub-10% CPU on instances two sizes too large is exactly the over-provisioning Compute Optimizer identifies, and each size step down roughly halves the instance cost."
      },
      {
        "id": "d",
        "text": "Migrate the non-production workloads onto Dedicated Hosts to consolidate them on fewer physical servers.",
        "correct": false,
        "explanation": "Dedicated Hosts carry a premium justified by BYOL or placement requirements the scenario never mentions, and they would raise non-production cost rather than lower it."
      },
      {
        "id": "e",
        "text": "Run the CI/CD build runners on Spot Instances with interruption handling and automatic retry of affected builds.",
        "correct": true,
        "explanation": "Correct. Stateless, retryable containerized builds are the canonical Spot workload, cutting runner compute cost by up to 90% versus always-on On-Demand instances."
      },
      {
        "id": "f",
        "text": "Double the Auto Scaling group cooldown periods in non-production to reduce how often instances are launched.",
        "correct": false,
        "explanation": "Longer cooldowns mainly delay scale-in as well as scale-out and do nothing about oversized, always-on instances, so the cost impact is negligible or negative."
      }
    ],
    "answers": [
      "a",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "e"
    ],
    "answerSummary": "Schedule dev/test stop-start windows, rightsize per Compute Optimizer, and move CI runners to Spot.",
    "explanation": "Three independent waste sources demand three matched remedies: idle overnight hours (scheduling), oversized instance types (Compute Optimizer rightsizing), and interruptible stateless builds (Spot). Reserved Instances and Dedicated Hosts commit money to the waste, and cooldown tuning does not address any of the three cost drivers.",
    "trigger": "Attack non-production waste via scheduling, rightsizing, and Spot for CI.",
    "intentGroup": "nonprod-scheduling-rightsizing",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Compute Optimizer"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Compute Optimizer",
      "Hard",
      "PRO-038",
      "variant-1",
      "Attack non-production waste via scheduling, rightsizing, and Spot for CI.",
      "nonprod-scheduling-rightsizing",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-039",
    "objectiveId": "PRO-039",
    "objectiveName": "Network Firewall: Centralize FQDN egress allowlisting with Network Firewall behind Transit Gateway routing.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "Network Firewall",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A healthcare company operates 12 VPCs across an AWS organization, all connected through an AWS Transit Gateway. A new compliance mandate requires that workloads in private subnets may initiate outbound connections only to an approved list of about 200 external SaaS domains, that all egress traffic be inspected, and that the allowlist be managed in one place rather than per VPC. The domains resolve to IP addresses that change frequently. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Add outbound security group rules on each workload that permit traffic only to the approved external domain names.",
        "correct": false,
        "explanation": "Security groups filter by IP, CIDR, prefix list, or referenced group; they cannot evaluate FQDNs, so frequently changing SaaS IP addresses would break this immediately."
      },
      {
        "id": "b",
        "text": "Deploy AWS Network Firewall in a central inspection VPC with stateful rule groups that allowlist the approved domains.",
        "correct": true,
        "explanation": "Correct. Network Firewall's stateful rules match on TLS SNI and HTTP host names, giving a single managed FQDN allowlist with inspection that keeps working as the underlying IPs change."
      },
      {
        "id": "c",
        "text": "Maintain network ACL deny entries in every subnet for the IP ranges associated with unapproved destinations.",
        "correct": false,
        "explanation": "Stateless NACLs cannot express a default-deny domain allowlist, and enumerating deny entries for the entire unapproved internet across 12 VPCs is unmanageable and decentralized."
      },
      {
        "id": "d",
        "text": "Update spoke VPC and Transit Gateway route tables so all outbound traffic flows through the firewall endpoints before reaching the internet.",
        "correct": true,
        "explanation": "Correct. Routing every spoke's egress through the inspection VPC's firewall endpoints via the Transit Gateway is what makes the centralized allowlist authoritative for all 12 VPCs."
      },
      {
        "id": "e",
        "text": "Run a Squid forward proxy on an EC2 instance in a shared services VPC and configure all workloads to send traffic through it.",
        "correct": false,
        "explanation": "A single self-managed proxy instance is a bandwidth bottleneck and a single point of failure, and patching, scaling, and rule distribution all become undifferentiated operational burden."
      }
    ],
    "answers": [
      "b",
      "d"
    ],
    "correctOptionIds": [
      "b",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d"
    ],
    "answerSummary": "Centralized AWS Network Firewall with FQDN allowlist rules, with spoke egress routed through its endpoints via Transit Gateway.",
    "explanation": "The joint constraints are domain-based (not IP-based) allowlisting, inspection, and single-point management across 12 VPCs. AWS Network Firewall provides managed FQDN filtering via SNI/host matching, but only becomes effective when Transit Gateway and spoke routes force all egress through its endpoints. Security groups and NACLs operate on IPs, and a lone proxy instance fails availability and operational-scale expectations.",
    "trigger": "Centralize FQDN egress allowlisting with Network Firewall behind Transit Gateway routing.",
    "intentGroup": "network-firewall-egress-filtering",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Network Firewall"
    ],
    "tags": [
      "Secure Architectures",
      "Network Firewall",
      "Hard",
      "PRO-039",
      "variant-1",
      "Centralize FQDN egress allowlisting with Network Firewall behind Transit Gateway routing.",
      "network-firewall-egress-filtering",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-040",
    "objectiveId": "PRO-040",
    "objectiveName": "SNS: Fan out order events with SNS to per-consumer SQS queues for isolation.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "SNS",
    "difficulty": "Medium",
    "type": "single",
    "question": "A retailer's order service must deliver every order event to three downstream systems: an ERP integration that processes in nightly batches, a warehouse service that consumes in near real time, and a notification service that sends customer emails. Each system must receive every event, consume at its own pace, and an extended outage of any one system must neither block the others nor lose events destined for the failed system. The team wants managed services with minimal custom code. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Publish events to a single SQS queue that the ERP, warehouse, and notification services all poll for messages.",
        "correct": false,
        "explanation": "Consumers of one queue compete for messages, so each event is delivered to only one system rather than all three."
      },
      {
        "id": "b",
        "text": "Create EventBridge rules that invoke a dedicated Lambda function for each downstream system directly.",
        "correct": false,
        "explanation": "Direct Lambda invocation gives each target only EventBridge's bounded retry window; a multi-day ERP outage would exhaust retries and drop events without a durable per-consumer buffer in front."
      },
      {
        "id": "c",
        "text": "Publish events to an SNS topic with a dedicated SQS queue subscribed for each downstream system.",
        "correct": true,
        "explanation": "Correct. SNS fanout copies every event into three independent durable queues, so each system drains its own backlog at its own pace and one system's outage never affects the others."
      },
      {
        "id": "d",
        "text": "Write events to a Kinesis data stream and have each downstream system read with its own shard iterator.",
        "correct": false,
        "explanation": "Kinesis supports multiple readers, but each consumer must manage checkpoints and shard iteration, and the retention window bounds how long a failed consumer can lag, adding overhead the scenario does not need."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "SNS topic fanned out to one dedicated SQS queue per downstream consumer.",
    "explanation": "The constraints to weigh are delivery of every event to all three systems, independent consumption rates, and durable isolation during a consumer outage. SNS-to-SQS fanout gives each consumer its own persistent buffer with no cross-consumer coupling and no custom code. A shared queue splits events among competitors, direct invocation lacks a durable per-consumer buffer, and Kinesis adds checkpointing and retention management the workload does not require.",
    "trigger": "Fan out order events with SNS to per-consumer SQS queues for isolation.",
    "intentGroup": "sns-sqs-fanout-independent-consumers",
    "practiceSet": 4,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "SNS"
    ],
    "tags": [
      "Resilient Architectures",
      "SNS",
      "Medium",
      "PRO-040",
      "variant-1",
      "Fan out order events with SNS to per-consumer SQS queues for isolation.",
      "sns-sqs-fanout-independent-consumers",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-041",
    "objectiveId": "PRO-041",
    "objectiveName": "ALB: Enforce OIDC SSO for an unmodifiable app at the ALB listener",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "ALB",
    "difficulty": "Hard",
    "type": "single",
    "question": "A company runs a third-party HR application on EC2 instances behind an internal Application Load Balancer in two Availability Zones. The security team mandates that all internal web applications enforce single sign-on through the company's OpenID Connect (OIDC) identity provider before any request reaches the application. The vendor does not provide source code, so the application itself cannot be modified, and the team wants to avoid introducing new infrastructure tiers. Which solution will meet these requirements with the LEAST operational overhead?",
    "options": [
      {
        "id": "a",
        "text": "Integrate the Amazon Cognito hosted UI into the application's login flow and federate Cognito with the corporate identity provider.",
        "correct": false,
        "explanation": "Wiring the Cognito hosted UI into the login flow requires changing application code, which is impossible because the vendor does not provide source code."
      },
      {
        "id": "b",
        "text": "Place an Amazon API Gateway HTTP API with a JWT authorizer in front of the application and validate tokens issued by the corporate identity provider.",
        "correct": false,
        "explanation": "Inserting API Gateway in front of a stateful web application adds a new tier and rearchitecting effort, and clients would still need code to obtain and attach JWTs."
      },
      {
        "id": "c",
        "text": "Add an authenticate-oidc action to the HTTPS listener rule on the Application Load Balancer that points to the corporate identity provider.",
        "correct": true,
        "explanation": "ALB listener authentication redirects unauthenticated users to the OIDC IdP and only forwards authenticated requests, enforcing SSO with zero application changes and no new tiers."
      },
      {
        "id": "d",
        "text": "Deploy AWS WAF on the load balancer with a rule that blocks requests lacking a custom header issued by the identity provider after login.",
        "correct": false,
        "explanation": "WAF header matching is not authentication; headers can be forged, and nothing performs the OIDC redirect or token validation, so SSO is not actually enforced."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Configure the ALB HTTPS listener with an authenticate-oidc action against the corporate IdP.",
    "explanation": "The discriminating constraints are no application code changes and no new infrastructure tiers. Only ALB native OIDC listener authentication satisfies both, because the load balancer performs the entire authentication handshake before traffic reaches the unmodified application. Cognito hosted UI and API Gateway both require code or architecture changes, and WAF cannot perform authentication.",
    "trigger": "Enforce OIDC SSO for an unmodifiable app at the ALB listener",
    "intentGroup": "alb-oidc-authentication",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ALB"
    ],
    "tags": [
      "Secure Architectures",
      "ALB",
      "Hard",
      "PRO-041",
      "variant-1",
      "Enforce OIDC SSO for an unmodifiable app at the ALB listener",
      "alb-oidc-authentication",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-042",
    "objectiveId": "PRO-042",
    "objectiveName": "RDS: Cross-region RDS MySQL DR with tight RPO at minimum cost",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "RDS",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A payments company runs a 4 TB Amazon RDS for MySQL database in us-east-1 that backs its settlement platform. Regulators now require a disaster recovery plan in eu-west-1 with an RTO of 30 minutes and an RPO of approximately 5 minutes. The company must stay on RDS for MySQL because of engine-specific stored procedures, and finance has asked for the lowest possible steady-state cost that still meets the objectives. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Create a cross-region read replica of the database in eu-west-1 using asynchronous replication.",
        "correct": true,
        "explanation": "A cross-region read replica keeps replication lag in the seconds-to-minutes range, satisfying the ~5 minute RPO while running a single low-cost replica instance in steady state."
      },
      {
        "id": "b",
        "text": "Convert the primary database to a Multi-AZ DB instance deployment with a standby in a second Availability Zone.",
        "correct": false,
        "explanation": "Multi-AZ standbys live in the same Region, so this improves availability in us-east-1 but provides no recovery capability in eu-west-1."
      },
      {
        "id": "c",
        "text": "Schedule nightly automated snapshot copies from us-east-1 to eu-west-1 and restore the latest copy during a disaster.",
        "correct": false,
        "explanation": "Nightly snapshot copies produce an RPO of up to 24 hours, far outside the 5 minute objective, and a 4 TB restore would also strain the 30 minute RTO."
      },
      {
        "id": "d",
        "text": "Build an automated runbook that promotes the eu-west-1 replica and fails over a Route 53 record to the promoted endpoint.",
        "correct": true,
        "explanation": "Scripted promotion plus DNS cutover completes well within the 30 minute RTO and adds almost no steady-state cost beyond the replica itself."
      },
      {
        "id": "e",
        "text": "Migrate the database to Amazon Aurora MySQL and configure an Aurora Global Database with a secondary cluster in eu-west-1.",
        "correct": false,
        "explanation": "Aurora Global Database would meet the RTO and RPO, but it forces an engine migration off RDS for MySQL and carries a higher steady-state cost than a single cross-region replica."
      }
    ],
    "answers": [
      "a",
      "d"
    ],
    "correctOptionIds": [
      "a",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d"
    ],
    "answerSummary": "Create a cross-region read replica in eu-west-1 and automate its promotion with a Route 53 failover cutover.",
    "explanation": "The constraints that discriminate are the second-Region requirement, the 5 minute RPO, the 30 minute RTO, staying on RDS for MySQL, and lowest steady-state cost. Only the cross-region read replica plus an automated promotion and DNS cutover meets all five together; Multi-AZ is same-Region, snapshots miss the RPO, and Aurora Global Database violates the engine and cost constraints.",
    "trigger": "Cross-region RDS MySQL DR with tight RPO at minimum cost",
    "intentGroup": "rds-cross-region-replica-dr",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "RDS"
    ],
    "tags": [
      "Resilient Architectures",
      "RDS",
      "Hard",
      "PRO-042",
      "variant-1",
      "Cross-region RDS MySQL DR with tight RPO at minimum cost",
      "rds-cross-region-replica-dr",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-043",
    "objectiveId": "PRO-043",
    "objectiveName": "FSx for Lustre: Ephemeral high-throughput POSIX layer over S3 for ML training",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "FSx for Lustre",
    "difficulty": "Hard",
    "type": "single",
    "question": "A research company trains computer vision models on a cluster of 200 GPU instances that runs for 8 to 12 hours per job and is then terminated. The 400 TB training corpus lives in an S3 bucket and grows weekly. During training, every node must read shards through a shared POSIX file system with consistent metadata and file locking, and the cluster requires hundreds of GB/s of aggregate read throughput. The storage layer is needed only while a job is running. Which solution will meet these requirements MOST cost-effectively?",
    "options": [
      {
        "id": "a",
        "text": "Create an Amazon EFS file system in Max I/O mode with provisioned throughput, load the corpus into it, and mount it on every node.",
        "correct": false,
        "explanation": "EFS cannot approach hundreds of GB/s of aggregate throughput for this workload profile, and paying for a persistent copy of 400 TB plus provisioned throughput between jobs is wasteful."
      },
      {
        "id": "b",
        "text": "Create an Amazon FSx for Lustre scratch file system linked to the S3 bucket for each job and mount it across the cluster.",
        "correct": true,
        "explanation": "A scratch FSx for Lustre file system with an S3 data repository association lazy-loads objects, delivers full POSIX semantics at hundreds of GB/s, and exists only for the life of the job."
      },
      {
        "id": "c",
        "text": "Copy the required shards to local NVMe instance store volumes on each node at job start using a parallel transfer script.",
        "correct": false,
        "explanation": "Staging 400 TB onto per-node NVMe duplicates data across 200 instances, delays job start, and provides no shared namespace or cross-node locking."
      },
      {
        "id": "d",
        "text": "Mount the S3 bucket on every node with Mountpoint for Amazon S3 and read the shards directly through the file interface.",
        "correct": false,
        "explanation": "Mountpoint for S3 exposes only a subset of file operations and does not provide the consistent shared metadata and file locking the training framework requires."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Use an FSx for Lustre scratch file system linked to the S3 bucket for the duration of each job.",
    "explanation": "The workload couples three constraints: full POSIX semantics with locking, hundreds of GB/s of parallel throughput, and storage that should only exist during jobs. FSx for Lustre scratch deployments linked to S3 are the only option satisfying all three, since EFS misses the throughput profile, local NVMe breaks the shared namespace, and Mountpoint lacks POSIX locking.",
    "trigger": "Ephemeral high-throughput POSIX layer over S3 for ML training",
    "intentGroup": "fsx-lustre-s3-training",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "FSx for Lustre"
    ],
    "tags": [
      "High-Performing Architectures",
      "FSx for Lustre",
      "Hard",
      "PRO-043",
      "variant-1",
      "Ephemeral high-throughput POSIX layer over S3 for ML training",
      "fsx-lustre-s3-training",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-044",
    "objectiveId": "PRO-044",
    "objectiveName": "DynamoDB: Match DynamoDB billing levers to spiky, stale, and cold access patterns",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "DynamoDB",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An ad-tech company reviews its DynamoDB spending. A campaign-events table receives unpredictable traffic that spikes 40x during product launches and is nearly idle between them. Items in that table are only useful for 30 days but are never removed, so the table has grown to 9 TB. Separately, a dozen tables from retired campaigns must be kept for auditors but are read only a few times each month. Which combination of actions will reduce costs while meeting these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Switch the campaign-events table to provisioned capacity with RCU and WCU set to cover the launch-day peak.",
        "correct": false,
        "explanation": "Provisioning for a 40x peak means paying for that capacity around the clock while the table sits nearly idle, which is the opposite of cost optimization for spiky traffic."
      },
      {
        "id": "b",
        "text": "Run the campaign-events table in on-demand capacity mode so charges track the actual spikes and idle periods.",
        "correct": true,
        "explanation": "On-demand mode absorbs the unpredictable 40x spikes without pre-provisioning and bills nothing for throughput during the long idle stretches."
      },
      {
        "id": "c",
        "text": "Deploy a DAX cluster in front of the campaign-events table to serve repeated reads from cache.",
        "correct": false,
        "explanation": "DAX adds always-on cluster nodes to the bill and targets read latency; nothing in the scenario indicates a hot repeated-read pattern that would offset that cost."
      },
      {
        "id": "d",
        "text": "Enable TTL on the campaign-events table with an expiry attribute set 30 days after each item is written.",
        "correct": true,
        "explanation": "TTL deletes stale items at no charge, shrinking the 9 TB table and its ongoing storage cost since items have no value after 30 days."
      },
      {
        "id": "e",
        "text": "Convert the retired-campaign tables to global tables so audit reads can be served from the nearest Region.",
        "correct": false,
        "explanation": "Global tables multiply storage and add replicated write costs across Regions, which increases spend for tables that are read only a few times a month."
      },
      {
        "id": "f",
        "text": "Change the retired-campaign tables to the DynamoDB Standard-IA table class.",
        "correct": true,
        "explanation": "Standard-IA cuts storage cost by roughly 60 percent in exchange for higher per-request pricing, which is a clear win for large tables read only a few times monthly."
      }
    ],
    "answers": [
      "b",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "f"
    ],
    "answerSummary": "Use on-demand mode for the spiky table, TTL for 30-day item expiry, and Standard-IA table class for the rarely read tables.",
    "explanation": "Each sub-problem has a distinct cost lever: unpredictable spikes map to on-demand capacity, stale-but-never-deleted items map to TTL, and storage-dominated audit tables map to the Standard-IA table class. Peak-sized provisioning, DAX, and global tables all add cost rather than remove it under these access patterns.",
    "trigger": "Match DynamoDB billing levers to spiky, stale, and cold access patterns",
    "intentGroup": "dynamodb-cost-optimization",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "DynamoDB"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "DynamoDB",
      "Hard",
      "PRO-044",
      "variant-1",
      "Match DynamoDB billing levers to spiky, stale, and cold access patterns",
      "dynamodb-cost-optimization",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-045",
    "objectiveId": "PRO-045",
    "objectiveName": "Systems Manager: Replace bastion and SSH keys with audited Session Manager access",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "Systems Manager",
    "difficulty": "Medium",
    "type": "single",
    "question": "A fintech company gives engineers shell access to EC2 instances in private subnets through an internet-facing bastion host, using shared SSH key pairs distributed by email. After an audit, security requires that the bastion and all long-lived SSH keys be eliminated, that no instance be reachable from the internet, and that every interactive session be recorded for compliance review. Access must be governed by existing IAM identities. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Harden the bastion host, move it to a dedicated subnet, and rotate its SSH keys automatically with AWS Secrets Manager.",
        "correct": false,
        "explanation": "Rotation reduces key exposure but keeps both the internet-facing bastion and long-lived SSH keys, which the audit explicitly requires eliminating."
      },
      {
        "id": "b",
        "text": "Use EC2 Instance Connect to push short-lived SSH keys to the instances and grant access through IAM policies.",
        "correct": false,
        "explanation": "Instance Connect ties key pushes to IAM, but connections still ride SSH to a reachable endpoint and it produces no recording of what happened inside each session."
      },
      {
        "id": "c",
        "text": "Deploy AWS Client VPN into the VPC and require engineers to SSH to instances with keys held in a centralized vault.",
        "correct": false,
        "explanation": "Client VPN removes internet exposure but preserves SSH key distribution from a vault and captures no session transcripts, failing two stated requirements."
      },
      {
        "id": "d",
        "text": "Grant access through AWS Systems Manager Session Manager with session logging delivered to S3 and CloudWatch Logs.",
        "correct": true,
        "explanation": "Session Manager authenticates via IAM, needs no bastion, open inbound ports, or SSH keys, and its logging feature records full session transcripts to S3 and CloudWatch Logs."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Use SSM Session Manager with session transcripts logged to S3 and CloudWatch Logs.",
    "explanation": "Four constraints must hold simultaneously: no bastion, no long-lived SSH keys, no internet reachability, and recorded sessions under IAM control. Session Manager is the only option that removes the SSH pathway entirely while natively producing auditable session logs; each distractor preserves either the key-distribution problem or the missing session recording.",
    "trigger": "Replace bastion and SSH keys with audited Session Manager access",
    "intentGroup": "ssm-session-manager-no-bastion",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Systems Manager"
    ],
    "tags": [
      "Secure Architectures",
      "Systems Manager",
      "Medium",
      "PRO-045",
      "variant-1",
      "Replace bastion and SSH keys with audited Session Manager access",
      "ssm-session-manager-no-bastion",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-046",
    "objectiveId": "PRO-046",
    "objectiveName": "ElastiCache: Treat Redis as a system of record: HA replication plus backups",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "ElastiCache",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A gaming company runs a single-node ElastiCache for Redis cluster that originally cached session data. Over time, teams began storing player inventory state in it that would take days to rebuild from source systems. The architecture team must ensure the data survives a node failure or the loss of an Availability Zone with automatic recovery, and must also be able to restore the dataset after a regional incident. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Resize the cluster to a larger memory-optimized node type to reduce the likelihood of failure under load.",
        "correct": false,
        "explanation": "A bigger node is still a single point of failure; vertical scaling does nothing for AZ loss or post-incident recovery."
      },
      {
        "id": "b",
        "text": "Migrate to ElastiCache for Memcached and spread additional nodes across three Availability Zones.",
        "correct": false,
        "explanation": "Memcached has no replication or persistence, so a lost node still loses its partition of the data and there is no snapshot capability for recovery."
      },
      {
        "id": "c",
        "text": "Create a Redis replication group with replicas in other Availability Zones and enable Multi-AZ with automatic failover.",
        "correct": true,
        "explanation": "Replicas in separate AZs with Multi-AZ automatic failover keep the dataset available through node and AZ failures without manual intervention."
      },
      {
        "id": "d",
        "text": "Update the application to write every key to two cache nodes and read from the surviving node during failures.",
        "correct": false,
        "explanation": "Client-side dual writes push consistency and failover logic into every application, are error-prone under partial failures, and still provide no recovery path after a regional incident."
      },
      {
        "id": "e",
        "text": "Schedule automatic snapshots of the replication group and copy the backups to a second Region.",
        "correct": true,
        "explanation": "Scheduled snapshots copied out of the Region provide a restore point for the hard-to-rebuild dataset if the primary Region is impaired."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Enable a Multi-AZ Redis replication group with automatic failover and schedule snapshots copied to another Region.",
    "explanation": "Two distinct constraints must be covered: continuous availability through node/AZ failure, and recoverability after a regional incident. The replication group with Multi-AZ failover handles the first, and snapshots copied cross-Region handle the second; no single distractor addresses either constraint correctly because vertical scaling, Memcached, and client-side dual writes all leave the data unprotected.",
    "trigger": "Treat Redis as a system of record: HA replication plus backups",
    "intentGroup": "elasticache-redis-ha-durability",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ElastiCache"
    ],
    "tags": [
      "Resilient Architectures",
      "ElastiCache",
      "Hard",
      "PRO-046",
      "variant-1",
      "Treat Redis as a system of record: HA replication plus backups",
      "elasticache-redis-ha-durability",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-047",
    "objectiveId": "PRO-047",
    "objectiveName": "API Gateway: Cache hourly-changing reference data at the API Gateway stage",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "API Gateway",
    "difficulty": "Medium",
    "type": "single",
    "question": "A logistics company exposes postal-rate reference data through an Amazon API Gateway REST API backed by a Lambda function that queries an RDS for PostgreSQL database. The rate tables are refreshed once per hour, yet the API receives millions of GET requests per day that are largely identical, driving RDS CPU above 85 percent and inflating Lambda invocation costs. The company wants to reduce load on the backend without changing clients or the data model. Which solution will meet these requirements MOST cost-effectively?",
    "options": [
      {
        "id": "a",
        "text": "Enable stage caching on the REST API with a TTL aligned to the hourly refresh and parameter-based cache keys.",
        "correct": true,
        "explanation": "A stage cache serves the repeated identical GETs from API Gateway itself, cutting both Lambda invocations and RDS queries, and an hourly-aligned TTL matches the data's change rate."
      },
      {
        "id": "b",
        "text": "Configure provisioned concurrency on the Lambda function sized for the observed request peak.",
        "correct": false,
        "explanation": "Provisioned concurrency reduces cold-start latency but every request still executes and still hits RDS, so backend load and cost both remain."
      },
      {
        "id": "c",
        "text": "Add an Amazon DynamoDB Accelerator (DAX) cluster in front of the data store and point the Lambda function's read queries at the cache.",
        "correct": false,
        "explanation": "DAX only accelerates DynamoDB; the rate tables live in RDS for PostgreSQL, so DAX cannot sit in this read path at all."
      },
      {
        "id": "d",
        "text": "Scale the RDS for PostgreSQL instance to the next larger instance class and add a read replica dedicated to serving the rate-lookup queries.",
        "correct": false,
        "explanation": "Larger instances and replicas absorb the redundant reads at a permanently higher cost instead of eliminating them, and Lambda invocation spend is untouched."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Enable API Gateway stage caching with an hourly TTL and parameter-based cache keys.",
    "explanation": "The discriminators are hourly-changing data, millions of identical reads, and a cost qualifier. Caching at the API edge removes redundant work from both Lambda and RDS for a small fixed cache fee, whereas provisioned concurrency and database scaling pay to serve the redundancy and DAX is incompatible with an RDS backend.",
    "trigger": "Cache hourly-changing reference data at the API Gateway stage",
    "intentGroup": "api-gateway-stage-caching",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "API Gateway"
    ],
    "tags": [
      "High-Performing Architectures",
      "API Gateway",
      "Medium",
      "PRO-047",
      "variant-1",
      "Cache hourly-changing reference data at the API Gateway stage",
      "api-gateway-stage-caching",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-048",
    "objectiveId": "PRO-048",
    "objectiveName": "CloudWatch Logs: Map each CloudWatch Logs cost driver to retention, IA class, or S3 archive",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "CloudWatch Logs",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A SaaS provider's CloudWatch Logs bill has tripled in a year. Analysis shows three drivers: microservices ingest terabytes of verbose debug output that engineers query only during incidents, every log group retains data indefinitely, and seven years of transaction logs required for compliance are queried at most twice a year. The observability team must cut costs while keeping debug logs queryable and preserving the compliance archive. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Apply retention policies to every log group so operational data expires after its useful lifetime.",
        "correct": true,
        "explanation": "Indefinite retention on every group is a pure storage leak; expiring operational logs after their useful window directly removes accumulated storage cost."
      },
      {
        "id": "b",
        "text": "Create metric filters on the debug log groups so high-volume events are summarized instead of billed as ingestion.",
        "correct": false,
        "explanation": "Metric filters evaluate events after they are ingested, so full ingestion charges still apply; filters add metrics, they do not reduce the ingest bill."
      },
      {
        "id": "c",
        "text": "Send the high-volume debug streams to log groups that use the Infrequent Access log class.",
        "correct": true,
        "explanation": "The Infrequent Access class halves ingestion pricing while keeping logs queryable through Logs Insights, matching debug data that is only read during incidents."
      },
      {
        "id": "d",
        "text": "Enable Contributor Insights rules on the busiest log groups to identify the top sources of log volume.",
        "correct": false,
        "explanation": "Contributor Insights is an analysis feature with its own rule charges; it reports on volume but does not reduce ingestion, storage, or retention costs."
      },
      {
        "id": "e",
        "text": "Deliver the compliance transaction logs through Data Firehose to S3 with a lifecycle policy into Glacier Deep Archive.",
        "correct": true,
        "explanation": "Rarely queried seven-year logs belong in S3 archive tiers, where storage costs a small fraction of CloudWatch Logs retention and lifecycle transitions run automatically."
      },
      {
        "id": "f",
        "text": "Stream all log groups into an Amazon OpenSearch Service domain and query them there instead of Logs Insights.",
        "correct": false,
        "explanation": "An always-on OpenSearch domain adds cluster and storage costs on top of ingestion, increasing total spend for data that is queried rarely."
      }
    ],
    "answers": [
      "a",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "e"
    ],
    "answerSummary": "Set per-group retention, move debug streams to the Infrequent Access log class, and archive compliance logs to S3 with lifecycle to Glacier Deep Archive.",
    "explanation": "The bill has three independent drivers, and each correct step targets one: retention policies stop indefinite storage growth, the Infrequent Access class cuts ingestion pricing for rarely queried debug data while keeping Logs Insights access, and Firehose-to-S3 with archive lifecycle fits twice-a-year compliance reads. Metric filters, Contributor Insights, and OpenSearch either leave ingestion billing untouched or add net-new cost.",
    "trigger": "Map each CloudWatch Logs cost driver to retention, IA class, or S3 archive",
    "intentGroup": "cloudwatch-logs-cost",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "CloudWatch Logs"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "CloudWatch Logs",
      "Hard",
      "PRO-048",
      "variant-1",
      "Map each CloudWatch Logs cost driver to retention, IA class, or S3 archive",
      "cloudwatch-logs-cost",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-049",
    "objectiveId": "PRO-049",
    "objectiveName": "GuardDuty: Org-wide GuardDuty detection funneled into aggregated Security Hub",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "GuardDuty",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A media conglomerate manages 60 AWS accounts in AWS Organizations across four Regions. After a phishing incident, the CISO requires continuously monitored threat detection for anomalous API activity, compromised credentials, and malicious network traffic in every account, with automatic coverage for newly created accounts. The security operations team also needs a single pane in one account and one Region to triage findings from the entire estate. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Enable Amazon Inspector across the organization with a delegated administrator to scan all workloads continuously.",
        "correct": false,
        "explanation": "Inspector finds software vulnerabilities and unintended network exposure on workloads; it does not detect compromised credentials, anomalous API calls, or active malicious traffic."
      },
      {
        "id": "b",
        "text": "Enable GuardDuty for the organization with a delegated administrator account and auto-enable for new member accounts.",
        "correct": true,
        "explanation": "Organization-wide GuardDuty with auto-enable delivers managed threat detection across CloudTrail, VPC Flow Logs, and DNS telemetry in every current and future account."
      },
      {
        "id": "c",
        "text": "Deploy Amazon Detective in each account as the primary detection service for credential compromise and network threats.",
        "correct": false,
        "explanation": "Detective investigates and visualizes findings that other services generate; it is not itself a threat detector and cannot replace GuardDuty in this design."
      },
      {
        "id": "d",
        "text": "Designate a Security Hub delegated administrator and configure cross-Region aggregation into a single home Region.",
        "correct": true,
        "explanation": "Security Hub with a delegated administrator and cross-Region aggregation consolidates findings from all 60 accounts and four Regions into the single triage pane the SOC needs."
      },
      {
        "id": "e",
        "text": "Configure EventBridge rules in each account to forward security findings to an SNS topic that emails the operations team.",
        "correct": false,
        "explanation": "Sixty per-account email pipelines create unmanaged notification sprawl rather than a queryable aggregated console, and offer no cross-Region consolidation or triage workflow."
      }
    ],
    "answers": [
      "b",
      "d"
    ],
    "correctOptionIds": [
      "b",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d"
    ],
    "answerSummary": "Enable organization-wide GuardDuty via a delegated administrator and aggregate findings in Security Hub with cross-Region aggregation.",
    "explanation": "Two constraints must be solved by different services: managed threat detection everywhere including future accounts, and centralized cross-account, cross-Region triage. GuardDuty with organization auto-enable covers detection; Security Hub with a delegated administrator and cross-Region aggregation covers the single pane. Inspector and Detective are sibling services that address vulnerabilities and investigation, not detection at scale.",
    "trigger": "Org-wide GuardDuty detection funneled into aggregated Security Hub",
    "intentGroup": "guardduty-securityhub-org",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "GuardDuty"
    ],
    "tags": [
      "Secure Architectures",
      "GuardDuty",
      "Hard",
      "PRO-049",
      "variant-1",
      "Org-wide GuardDuty detection funneled into aggregated Security Hub",
      "guardduty-securityhub-org",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-050",
    "objectiveId": "PRO-050",
    "objectiveName": "Lambda: Prefer Lambda on-failure destinations over DLQ when error context matters",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Lambda",
    "difficulty": "Hard",
    "type": "single",
    "question": "An order-notification Lambda function is invoked asynchronously by Amazon S3 events and calls a partner REST endpoint. During partner outages lasting longer than the function's two automatic retries, events are dropped with no trace. The operations team must capture every failed event together with the function's error response and request context so failures can be analyzed and replayed later, and they want the SMALLEST possible change to the existing architecture. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Configure an on-failure destination for the function that sends the invocation record to an SQS queue.",
        "correct": true,
        "explanation": "On-failure destinations emit a full invocation record containing the original event, the request context, and the function's error response, and require only a configuration change."
      },
      {
        "id": "b",
        "text": "Attach a dead-letter queue to the function so events that exhaust retries are delivered to SQS.",
        "correct": false,
        "explanation": "A DLQ stores only the event payload with minimal error attributes, omitting the structured request context and response detail the team needs for analysis."
      },
      {
        "id": "c",
        "text": "Raise the function's asynchronous retry attempts and maximum event age to the highest allowed values.",
        "correct": false,
        "explanation": "Asynchronous retries are capped at two attempts, and extending event age only delays the drop during a long partner outage; nothing is captured for replay."
      },
      {
        "id": "d",
        "text": "Orchestrate the call in a Step Functions state machine with a retry policy and a catch state that persists failures.",
        "correct": false,
        "explanation": "A state machine could capture failures, but it replaces the direct S3-to-Lambda invocation path and is a significant rearchitecture rather than a minimal change."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Add an on-failure destination that sends the full invocation record to an SQS queue.",
    "explanation": "The two discriminating constraints are the need for error context alongside the original event and the smallest-change qualifier. Destinations send a complete invocation record including the error response and request context via configuration alone, which a DLQ's bare event payload cannot match, while retries have a hard cap and Step Functions rearchitects the flow.",
    "trigger": "Prefer Lambda on-failure destinations over DLQ when error context matters",
    "intentGroup": "lambda-async-failure-destination",
    "practiceSet": 5,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Lambda"
    ],
    "tags": [
      "Resilient Architectures",
      "Lambda",
      "Hard",
      "PRO-050",
      "variant-1",
      "Prefer Lambda on-failure destinations over DLQ when error context matters",
      "lambda-async-failure-destination",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-051",
    "objectiveId": "PRO-051",
    "objectiveName": "S3: Restrict S3 access to one VPC even against valid external credentials",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "S3",
    "difficulty": "Hard",
    "type": "single",
    "question": "A genomics company stores regulated sequencing results in an Amazon S3 bucket in us-east-1. Analysis jobs run on EC2 instances in a single VPC and reach the bucket through a gateway VPC endpoint. During a security review, auditors demonstrated that an IAM access key copied from an instance could still read the bucket from a laptop outside the company network. The security team requires that the bucket be readable only from workloads inside that specific VPC, so that even valid IAM credentials are denied when used from anywhere else. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Attach an endpoint policy to the gateway VPC endpoint that allows s3:GetObject only on the regulated bucket's ARN.",
        "correct": false,
        "explanation": "An endpoint policy constrains requests that traverse the endpoint, but it does nothing to requests made from outside the VPC, so the stolen-credential path the auditors demonstrated remains open."
      },
      {
        "id": "b",
        "text": "Add a bucket policy statement that allows access only when aws:SourceIp matches the Elastic IP address of the VPC's NAT gateway.",
        "correct": false,
        "explanation": "Traffic through the gateway endpoint never carries the NAT gateway's public IP, so this breaks the intended access path, and pinning policy to a rotatable EIP is fragile."
      },
      {
        "id": "c",
        "text": "Add a bucket policy statement that denies all S3 actions unless the aws:SourceVpce condition key matches the VPC endpoint ID.",
        "correct": true,
        "explanation": "An explicit Deny with a StringNotEquals condition on aws:SourceVpce is evaluated for every request, so credentials used from outside the VPC endpoint are rejected regardless of their IAM permissions."
      },
      {
        "id": "d",
        "text": "Enable S3 Block Public Access at the account level and remove any public ACLs or public policy statements from the bucket.",
        "correct": false,
        "explanation": "Block Public Access stops anonymous and public-policy access, but the auditors used authenticated IAM credentials, which Block Public Access does not restrict."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Bucket policy with an explicit Deny unless aws:SourceVpce equals the VPC endpoint ID.",
    "explanation": "The discriminating constraint is that enforcement must apply to authenticated requests originating anywhere, which only a resource-side explicit Deny can achieve. A bucket policy keyed on aws:SourceVpce denies any request that did not arrive through the approved endpoint, closing the stolen-credential path that endpoint policies, IP allow-lists, and Block Public Access all leave open.",
    "trigger": "Restrict S3 access to one VPC even against valid external credentials",
    "intentGroup": "s3-vpce-condition-policy",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3"
    ],
    "tags": [
      "Secure Architectures",
      "S3",
      "Hard",
      "PRO-051",
      "variant-1",
      "Restrict S3 access to one VPC even against valid external credentials",
      "s3-vpce-condition-policy",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-052",
    "objectiveId": "PRO-052",
    "objectiveName": "Direct Connect: Low-cost automatic backup path for a single Direct Connect circuit",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Direct Connect",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A logistics company connects its data center to a VPC over a single 1 Gbps AWS Direct Connect connection that carries ERP and warehouse-scanning traffic. Last month a construction crew severed the fiber at the provider's local loop, and hybrid connectivity was down for an entire business day. Management will not fund a second Direct Connect connection but requires an always-ready backup path that fails over automatically, and the network team must be able to prove failover works before the next audit. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Create an AWS Site-to-Site VPN over the internet to the same VPC and configure BGP so the Direct Connect path is preferred while the VPN advertises the same prefixes as a standby route.",
        "correct": true,
        "explanation": "A VPN backup costs a fraction of a second circuit, and dynamic BGP routing lets AWS and the customer gateway shift traffic automatically when Direct Connect routes are withdrawn."
      },
      {
        "id": "b",
        "text": "Order a second 1 Gbps Direct Connect connection terminating at the same Direct Connect location and place both connections in a link aggregation group.",
        "correct": false,
        "explanation": "This exceeds the approved budget and, because both circuits share the same facility and local loop, another construction incident could still sever both paths at once."
      },
      {
        "id": "c",
        "text": "Associate the existing connection with a Direct Connect gateway so that the private virtual interface can reach virtual private gateways in additional Regions.",
        "correct": false,
        "explanation": "A Direct Connect gateway extends the reach of the single physical circuit but adds no second path, so a fiber cut still isolates the data center."
      },
      {
        "id": "d",
        "text": "Validate the design before the audit by shutting down the BGP peering on the Direct Connect virtual interface during a maintenance window and confirming traffic shifts to the standby path.",
        "correct": true,
        "explanation": "Disabling the Direct Connect BGP session simulates a real circuit failure end to end, giving the team documented evidence that automatic failover works."
      },
      {
        "id": "e",
        "text": "Make the Site-to-Site VPN the primary path for hybrid traffic and retain Direct Connect as the standby route by lowering its BGP preference.",
        "correct": false,
        "explanation": "Inverting the preference pushes latency-sensitive ERP and scanning traffic onto the internet path during normal operation, degrading the workload for no resilience gain."
      }
    ],
    "answers": [
      "a",
      "d"
    ],
    "correctOptionIds": [
      "a",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d"
    ],
    "answerSummary": "Add a Site-to-Site VPN as a BGP-preferred-standby backup to Direct Connect, and test failover by shutting down the Direct Connect BGP session.",
    "explanation": "The constraints are modest cost, automatic failover, and provable failover behavior. A Site-to-Site VPN with BGP route preference satisfies the first two, while deliberately downing the Direct Connect BGP peering is the standard way to demonstrate the failover actually occurs; a second circuit at the same location fails both the budget and the shared-facility risk.",
    "trigger": "Low-cost automatic backup path for a single Direct Connect circuit",
    "intentGroup": "direct-connect-backup-path",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Direct Connect"
    ],
    "tags": [
      "Resilient Architectures",
      "Direct Connect",
      "Hard",
      "PRO-052",
      "variant-1",
      "Low-cost automatic backup path for a single Direct Connect circuit",
      "direct-connect-backup-path",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-053",
    "objectiveId": "PRO-053",
    "objectiveName": "CloudWatch Logs: Near-real-time CloudWatch Logs search in OpenSearch with least ops",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "CloudWatch Logs",
    "difficulty": "Medium",
    "type": "single",
    "question": "A media company runs a containerized API whose application logs are delivered to Amazon CloudWatch Logs log groups. The operations team already runs an Amazon OpenSearch Service domain with dashboards used during incident response, and responders need new log events searchable in that domain within about one minute. The team is small and wants to avoid building or operating custom pipeline code. Which solution will meet these requirements with the LEAST operational overhead?",
    "options": [
      {
        "id": "a",
        "text": "Schedule an Amazon EventBridge rule that invokes a Lambda function every hour to export new log events and bulk-index them into the OpenSearch domain.",
        "correct": false,
        "explanation": "An hourly batch misses the one-minute freshness requirement by design, and the team must maintain custom export and indexing code."
      },
      {
        "id": "b",
        "text": "Create a subscription filter on each log group that streams matching log events to the existing Amazon OpenSearch Service domain.",
        "correct": true,
        "explanation": "Subscription filters deliver events to OpenSearch in near real time through a managed integration, so responders search fresh data without the team writing or operating pipeline code."
      },
      {
        "id": "c",
        "text": "Create an export task that delivers the log groups to Amazon S3 and point responders at Amazon Athena queries over the exported objects.",
        "correct": false,
        "explanation": "S3 export tasks are batch-oriented and land data outside the OpenSearch dashboards the team already uses, so both the latency and tooling requirements are missed."
      },
      {
        "id": "d",
        "text": "Install the Kinesis Agent on the container hosts to ship application log files to a Kinesis data stream that a consumer writes into the OpenSearch domain.",
        "correct": false,
        "explanation": "Adding host agents and a custom stream consumer duplicates a delivery path CloudWatch Logs already provides and increases the operational surface the small team must maintain."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "CloudWatch Logs subscription filter streaming the log groups to the existing OpenSearch Service domain.",
    "explanation": "The two constraints are roughly one-minute searchability in the existing OpenSearch domain and minimal pipeline ownership. Only the subscription filter integration meets both, because it is a managed near-real-time stream; the batch options miss the latency target and the agent option adds infrastructure the team must run.",
    "trigger": "Near-real-time CloudWatch Logs search in OpenSearch with least ops",
    "intentGroup": "cw-logs-subscription-opensearch",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "CloudWatch Logs"
    ],
    "tags": [
      "High-Performing Architectures",
      "CloudWatch Logs",
      "Medium",
      "PRO-053",
      "variant-1",
      "Near-real-time CloudWatch Logs search in OpenSearch with least ops",
      "cw-logs-subscription-opensearch",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-054",
    "objectiveId": "PRO-054",
    "objectiveName": "S3 Glacier: 25-year archive tiering with small-object aggregation",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "S3 Glacier",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An insurance company must retain claim documents in Amazon S3 for 25 years to satisfy regulators. During the first 2 years after a claim closes, auditors request documents roughly weekly and expect them within minutes; after year 2, retrieval within 24 hours is acceptable and requests become rare. The archive will grow to billions of files, and most files are under 100 KB. The architecture team must minimize storage and request costs across the full retention period. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Transition objects to S3 Glacier Deep Archive immediately after the claim closes to capture the lowest storage price from day one.",
        "correct": false,
        "explanation": "Deep Archive retrievals take hours, so weekly audit requests during the first 2 years would miss the minutes-level expectation and incur repeated restore costs."
      },
      {
        "id": "b",
        "text": "Store objects in S3 Standard-IA or S3 Glacier Instant Retrieval for the first 2 years so audit requests return in milliseconds.",
        "correct": true,
        "explanation": "Both classes offer immediate access at a lower storage price than S3 Standard, matching the weekly, minutes-level audit pattern during the active window."
      },
      {
        "id": "c",
        "text": "Store objects in S3 One Zone-IA for the first 2 years to cut storage cost during the period of frequent audit access.",
        "correct": false,
        "explanation": "One Zone-IA stores regulated records in a single Availability Zone, an availability and durability posture that is a poor fit for compliance documents despite the modest price advantage."
      },
      {
        "id": "d",
        "text": "Add a lifecycle rule that transitions objects to S3 Glacier Deep Archive after 2 years for the remainder of the retention period.",
        "correct": true,
        "explanation": "After year 2 the stated tolerance is 24-hour retrieval, which Deep Archive satisfies at the lowest per-GB storage price for the remaining 23 years."
      },
      {
        "id": "e",
        "text": "Use S3 Intelligent-Tiering with the archive access tiers enabled so objects move between tiers automatically as access changes.",
        "correct": false,
        "explanation": "Intelligent-Tiering does not monitor or auto-tier objects smaller than 128 KB, so these sub-100 KB files would never reach the archive tiers, and the known two-phase access pattern needs no automatic discovery anyway."
      },
      {
        "id": "f",
        "text": "Aggregate the small files into larger archive objects, such as compressed batches per claim, before transitioning them to archival storage.",
        "correct": true,
        "explanation": "Glacier classes add per-object metadata overhead and lifecycle transitions bill per request, so batching billions of sub-100 KB files into larger objects materially reduces both."
      }
    ],
    "answers": [
      "b",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "f"
    ],
    "answerSummary": "Keep years 0-2 in Standard-IA or Glacier Instant Retrieval, transition to Deep Archive after year 2, and aggregate small files into larger objects before archiving.",
    "explanation": "The discriminators are the two-phase access pattern and the object-count economics. Minutes-level weekly access rules out Deep Archive for the first 2 years, the 24-hour tolerance afterwards makes Deep Archive the cheapest compliant tier, and billions of sub-100 KB objects make aggregation essential because per-object overhead and per-request transition charges would otherwise dominate the bill.",
    "trigger": "25-year archive tiering with small-object aggregation",
    "intentGroup": "compliance-archive-25y",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3 Glacier"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "S3 Glacier",
      "Hard",
      "PRO-054",
      "variant-1",
      "25-year archive tiering with small-object aggregation",
      "compliance-archive-25y",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-055",
    "objectiveId": "PRO-055",
    "objectiveName": "KMS: Single-tenant Level 3 HSM while keeping KMS service integrations",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "KMS",
    "difficulty": "Hard",
    "type": "single",
    "question": "A payments processor is entering a market whose regulator requires that encryption keys reside in single-tenant hardware security modules validated to FIPS 140-2 Level 3 and remain under the company's exclusive administrative control. The company's applications currently rely on AWS KMS integrations for Amazon S3 server-side encryption and Amazon EBS volume encryption, and the security team refuses to modify application code or re-platform those integrations. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create KMS customer managed keys in the account and restrict administrative and usage permissions to the security team through key policies.",
        "correct": false,
        "explanation": "Standard KMS keys live in HSMs that AWS operates as a multi-tenant fleet, so the single-tenant and exclusive-control conditions the regulator imposes are not satisfied."
      },
      {
        "id": "b",
        "text": "Generate key material in an on-premises HSM and import it into KMS customer managed keys with an expiration and rotation schedule.",
        "correct": false,
        "explanation": "Imported key material gives the company control over the material's origin, but once imported it is used inside AWS-managed multi-tenant HSMs, which fails the tenancy requirement."
      },
      {
        "id": "c",
        "text": "Provision an AWS CloudHSM cluster and update the applications to call the cluster directly through the PKCS #11 and JCE client libraries.",
        "correct": false,
        "explanation": "Direct CloudHSM use meets the hardware requirement but abandons the KMS integrations that S3 and EBS encryption depend on, violating the no-code-change constraint."
      },
      {
        "id": "d",
        "text": "Provision an AWS CloudHSM cluster and configure a KMS custom key store backed by the cluster, then create the keys in that key store.",
        "correct": true,
        "explanation": "A CloudHSM-backed custom key store keeps key material in single-tenant FIPS 140-2 Level 3 hardware the company administers, while S3 and EBS continue to use KMS APIs unchanged."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "KMS custom key store backed by an AWS CloudHSM cluster.",
    "explanation": "The two constraints in tension are HSM tenancy and unchanged KMS service integrations. Only a CloudHSM-backed custom key store satisfies both, because keys are generated and stored in the company's own single-tenant Level 3 cluster while remaining addressable through standard KMS APIs; plain customer managed keys and BYOK fail on tenancy, and direct CloudHSM use fails on integration.",
    "trigger": "Single-tenant Level 3 HSM while keeping KMS service integrations",
    "intentGroup": "cloudhsm-custom-key-store",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "KMS"
    ],
    "tags": [
      "Secure Architectures",
      "KMS",
      "Hard",
      "PRO-055",
      "variant-1",
      "Single-tenant Level 3 HSM while keeping KMS service integrations",
      "cloudhsm-custom-key-store",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-056",
    "objectiveId": "PRO-056",
    "objectiveName": "ECS: Fargate service needs safe deployments and multi-AZ placement",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "ECS",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An online ticketing platform runs an Amazon ECS service on AWS Fargate behind an Application Load Balancer. During recent rolling deployments, customers received HTTP 5xx errors for several minutes, and one failed deployment kept serving a broken task revision until an engineer manually redeployed. A review also found that the service's tasks were all placed in a single Availability Zone, so an AZ disruption would take the service offline. The team wants deployments to stop and recover automatically when a new revision is unhealthy, and the service must survive the loss of an Availability Zone. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Increase the service's desired task count so that more tasks are running during each rolling deployment.",
        "correct": false,
        "explanation": "More copies of a broken revision still fail, and extra tasks launched into the same single-AZ subnet do nothing for zonal survivability."
      },
      {
        "id": "b",
        "text": "Change the service scheduler strategy to DAEMON so that ECS maintains one task on each available piece of infrastructure.",
        "correct": false,
        "explanation": "The DAEMON strategy applies to EC2 container instances and is not supported on Fargate, so it cannot address either requirement here."
      },
      {
        "id": "c",
        "text": "Update the service's network configuration to include subnets in at least two Availability Zones so ECS spreads tasks across zones.",
        "correct": true,
        "explanation": "Fargate task placement is bounded by the subnets in the service's network configuration, so adding subnets in additional AZs lets ECS distribute tasks and survive a zonal outage."
      },
      {
        "id": "d",
        "text": "Create a Route 53 health check against the ALB DNS name and configure failover routing to a static maintenance page in Amazon S3.",
        "correct": false,
        "explanation": "A DNS failover to a maintenance page acknowledges the outage rather than preventing it, and it neither stops a bad deployment nor changes task placement."
      },
      {
        "id": "e",
        "text": "Enable the ECS deployment circuit breaker on the service with the rollback option so failed deployments revert to the last healthy revision.",
        "correct": true,
        "explanation": "The circuit breaker detects tasks that fail to reach a healthy state during a deployment and automatically rolls the service back, removing the manual-redeploy step that prolonged the incident."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Add multi-AZ subnets to the service's network configuration and enable the deployment circuit breaker with automatic rollback.",
    "explanation": "The two independent failure modes are unhealthy revisions persisting during deployments and single-AZ task placement. The deployment circuit breaker with rollback addresses the first natively in ECS, and multi-AZ subnets in the service network configuration address the second; scaling out, DAEMON scheduling, and DNS failover each fix neither root cause.",
    "trigger": "Fargate service needs safe deployments and multi-AZ placement",
    "intentGroup": "ecs-fargate-deploy-resilience",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ECS"
    ],
    "tags": [
      "Resilient Architectures",
      "ECS",
      "Hard",
      "PRO-056",
      "variant-1",
      "Fargate service needs safe deployments and multi-AZ placement",
      "ecs-fargate-deploy-resilience",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-057",
    "objectiveId": "PRO-057",
    "objectiveName": "RDS: Cross-Region read replica to fix EU read latency",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "RDS",
    "difficulty": "Hard",
    "type": "single",
    "question": "A subscription analytics product runs its application tier in us-east-1 and eu-west-1 behind latency-based routing, but both tiers query a single Amazon RDS for PostgreSQL Multi-AZ instance in us-east-1. European customers report page loads of 150 ms or more, and tracing shows the time is spent in read queries crossing the Atlantic on every request. The workload is about 90 percent reads, writes can continue to be served from us-east-1, and the team wants the EU experience fixed without rearchitecting the application's data access patterns. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create a cross-Region read replica in eu-west-1 and configure the EU application tier to send read queries to the replica's endpoint.",
        "correct": true,
        "explanation": "A local replica serves the 90 percent read workload within the Region, eliminating the transatlantic round trip while writes continue flowing to the us-east-1 primary as required."
      },
      {
        "id": "b",
        "text": "Route the EU application tier's database connections through AWS Global Accelerator so queries traverse the AWS backbone to us-east-1.",
        "correct": false,
        "explanation": "The accelerator improves transport consistency, but every read still crosses the ocean to us-east-1, so the physics-bound round trip that dominates the 150 ms remains."
      },
      {
        "id": "c",
        "text": "Deploy an Amazon ElastiCache for Redis cluster in eu-west-1 and update the EU application tier to cache query results locally.",
        "correct": false,
        "explanation": "Cold and invalidated entries still require transatlantic queries, and adding cache population and invalidation logic conflicts with the goal of not reworking data access patterns."
      },
      {
        "id": "d",
        "text": "Convert the database to a Multi-AZ DB cluster with two readable standby instances and direct EU read traffic to the cluster reader endpoint.",
        "correct": false,
        "explanation": "Readable standbys in a Multi-AZ cluster live in the same us-east-1 Region as the writer, so EU reads still cross the Atlantic and the latency complaint persists."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Cross-Region RDS read replica in eu-west-1 with the EU application tier reading from it locally.",
    "explanation": "The constraints are geographic read locality for a 90 percent read workload and minimal application change with writes remaining in us-east-1. Only a cross-Region read replica moves the data next to the EU users; backbone acceleration and same-Region readable standbys never shorten the transatlantic distance, and a cache introduces exactly the data-access rework the team ruled out.",
    "trigger": "Cross-Region read replica to fix EU read latency",
    "intentGroup": "rds-cross-region-read-locality",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "RDS"
    ],
    "tags": [
      "High-Performing Architectures",
      "RDS",
      "Hard",
      "PRO-057",
      "variant-1",
      "Cross-Region read replica to fix EU read latency",
      "rds-cross-region-read-locality",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-058",
    "objectiveId": "PRO-058",
    "objectiveName": "EBS: EBS cost hygiene: gp3, DLM retention, orphan cleanup",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "EBS",
    "difficulty": "Medium",
    "type": "multiple",
    "question": "A SaaS company's cloud cost review flags Amazon EBS as its fastest-growing line item. The fleet of several hundred EC2 instances still uses gp2 volumes sized for peak IOPS, engineers have created snapshots for years with no retention policy, and hundreds of unattached volumes remain from terminated experiment instances. Finance wants a durable reduction in EBS spend within one quarter, and the platform team must keep the ability to restore any volume that is deleted during cleanup. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Migrate the fleet's gp2 volumes to gp3 and provision IOPS and throughput independently of volume size.",
        "correct": true,
        "explanation": "gp3 has a lower per-GB price than gp2 and decouples performance from capacity, ending the practice of oversizing volumes just to reach an IOPS target."
      },
      {
        "id": "b",
        "text": "Migrate the instances' boot volumes to st1 throughput optimized volumes to take advantage of the lower per-GB price.",
        "correct": false,
        "explanation": "st1 volumes cannot serve as boot volumes and their throughput-oriented profile is wrong for general-purpose root workloads, so the price advantage is unusable here."
      },
      {
        "id": "c",
        "text": "Create Amazon Data Lifecycle Manager policies that schedule snapshot creation and automatically expire snapshots past the retention window.",
        "correct": true,
        "explanation": "DLM replaces the ad hoc snapshot habit with policy-driven creation and deletion, so the years-long accumulation stops recurring instead of needing repeated manual purges."
      },
      {
        "id": "d",
        "text": "Standardize the fleet on io2 volumes so that every workload receives provisioned IOPS with a durability guarantee.",
        "correct": false,
        "explanation": "io2 targets latency-critical databases and costs substantially more than general-purpose storage, so fleet-wide adoption would raise the EBS bill finance wants reduced."
      },
      {
        "id": "e",
        "text": "Identify unattached volumes and obsolete snapshots, take a final snapshot of any volume that lacks one, and delete the originals.",
        "correct": true,
        "explanation": "Removing orphaned volumes and redundant snapshots eliminates pure waste immediately, and the final snapshot preserves the restore path the platform team requires."
      },
      {
        "id": "f",
        "text": "Copy the snapshot inventory to a second Region and delete the source snapshots once the copies complete to lower the primary Region's bill.",
        "correct": false,
        "explanation": "Cross-Region copies incur transfer charges and continue accruing snapshot storage in the destination, so total spend rises rather than falls."
      }
    ],
    "answers": [
      "a",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "e"
    ],
    "answerSummary": "Migrate gp2 to gp3, adopt Data Lifecycle Manager policies for snapshot creation and retention, and delete unattached volumes and obsolete snapshots after taking final snapshots.",
    "explanation": "The constraints are a durable cost reduction and a preserved restore path. gp3 migration cuts the per-GB rate structurally, DLM prevents the snapshot pile from regrowing, and cleanup with final snapshots removes existing waste safely; st1 boot volumes are unsupported, io2 raises cost, and cross-Region copies add spend instead of removing it.",
    "trigger": "EBS cost hygiene: gp3, DLM retention, orphan cleanup",
    "intentGroup": "ebs-cost-hygiene",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EBS"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "EBS",
      "Medium",
      "PRO-058",
      "variant-1",
      "EBS cost hygiene: gp3, DLM retention, orphan cleanup",
      "ebs-cost-hygiene",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-059",
    "objectiveId": "PRO-059",
    "objectiveName": "API Gateway: Separate JWT authentication from API-key usage plans",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "API Gateway",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A fintech startup exposes a public Amazon API Gateway REST API consumed by its mobile app and by integration partners who pay for tiered access. End users must authenticate with JWTs issued at sign-in, and each partner's tier must be enforced as a specific request rate and monthly quota so that overage triggers throttling rather than surprise invoices. The team wants both controls implemented natively in API Gateway. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Distribute API keys to end users and require the key in the x-api-key header as the mechanism that authenticates each user's requests.",
        "correct": false,
        "explanation": "API keys identify a calling application for metering but carry no verified identity claims, so treating them as end-user authentication leaves the API effectively unauthenticated."
      },
      {
        "id": "b",
        "text": "Configure an Amazon Cognito user pool authorizer on the API's methods so that requests must present a valid JWT from the sign-in flow.",
        "correct": true,
        "explanation": "A Cognito user pool authorizer validates the JWT's signature and claims natively in API Gateway, satisfying the end-user authentication requirement without custom code."
      },
      {
        "id": "c",
        "text": "Create AWS WAF rate-based rules on the API's web ACL with a different request threshold for each partner tier.",
        "correct": false,
        "explanation": "Rate-based rules block flooding from source IPs over a rolling window; they have no concept of a monthly quota or a per-partner identity, so they cannot express billing tiers."
      },
      {
        "id": "d",
        "text": "Create a usage plan per partner tier with throttle and quota limits, and associate each partner's API key with the matching plan.",
        "correct": true,
        "explanation": "Usage plans are API Gateway's native construct for per-key rate limits and monthly quotas, so each partner's tier is enforced by throttling exactly as required."
      },
      {
        "id": "e",
        "text": "Require partners to sign requests with IAM credentials using SigV4 and enforce tiers through IAM policies attached to each partner's role.",
        "correct": false,
        "explanation": "SigV4 authenticates callers but IAM policies authorize actions; they contain no rate or quota semantics, and issuing IAM principals to external partners adds burden without meeting the tiering requirement."
      }
    ],
    "answers": [
      "b",
      "d"
    ],
    "correctOptionIds": [
      "b",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d"
    ],
    "answerSummary": "Cognito user pool authorizer for end-user JWT authentication plus per-tier usage plans with associated API keys for partner rate limits and quotas.",
    "explanation": "The scenario requires two orthogonal controls: verified end-user identity and metered partner tiers. The Cognito authorizer handles JWT validation and usage plans with API keys handle throttling and quotas; the classic trap is conflating the two, since API keys meter but never authenticate, and WAF or IAM constructs cannot express monthly quotas per partner.",
    "trigger": "Separate JWT authentication from API-key usage plans",
    "intentGroup": "api-gateway-jwt-usage-plans",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "API Gateway"
    ],
    "tags": [
      "Secure Architectures",
      "API Gateway",
      "Hard",
      "PRO-059",
      "variant-1",
      "Separate JWT authentication from API-key usage plans",
      "api-gateway-jwt-usage-plans",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-060",
    "objectiveId": "PRO-060",
    "objectiveName": "Storage Gateway: File Gateway for hybrid SMB protection with local cache",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Storage Gateway",
    "difficulty": "Hard",
    "type": "single",
    "question": "An architecture firm stores 40 TB of project files on an aging on-premises Windows file server that staff access over SMB. Leadership has rejected purchasing a replacement NAS and wants the failing server retired. Every project file must be stored durably in AWS, staff must keep opening recently used files over SMB at LAN speed without waiting on WAN transfers, and older projects should age into cheaper storage automatically. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Run nightly AWS DataSync task executions that copy the file shares to Amazon S3, and have staff retrieve files from S3 over the network when they need them.",
        "correct": false,
        "explanation": "DataSync copies the data into S3 but provides no ongoing SMB share, so the firm would still depend on the failing file server, and every retrieval from S3 crosses the WAN instead of being served at LAN speed."
      },
      {
        "id": "b",
        "text": "Deploy an AWS Backup gateway on premises and schedule backup plans that store the file server's data in a backup vault.",
        "correct": false,
        "explanation": "Backup gateway protects VMware virtual machines rather than presenting an SMB share, so it cannot replace the retiring file server, and restores pull from the vault across the WAN rather than from a local cache."
      },
      {
        "id": "c",
        "text": "Deploy an Amazon S3 File Gateway on the existing hosts, expose SMB shares backed by S3, and use lifecycle rules to age older objects into archival classes.",
        "correct": true,
        "explanation": "File Gateway keeps recently used files in its local cache for LAN-speed SMB reads while every file is durably stored as S3 objects that lifecycle rules can tier down over time."
      },
      {
        "id": "d",
        "text": "Create an Amazon EFS file system with lifecycle management enabled, connect the office over a Site-to-Site VPN, and mount the file system from the on-premises clients.",
        "correct": false,
        "explanation": "EFS is NFS rather than SMB, and every read would traverse the VPN with WAN latency, so neither the protocol nor the local-speed recovery requirement is met."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Amazon S3 File Gateway with a local cache exposing SMB shares backed by S3, plus lifecycle rules for aging data.",
    "explanation": "The intersecting constraints are retiring the server without new NAS hardware, SMB continuity with LAN-speed access to recently used files, a durable copy of everything in AWS, and automatic tiering of old projects. Only S3 File Gateway satisfies all of them, because its local cache serves hot files at LAN speed while S3 provides the durable copy and lifecycle transitions; DataSync and Backup gateway provide no SMB access path, and EFS fails on protocol and latency.",
    "trigger": "File Gateway for hybrid SMB protection with local cache",
    "intentGroup": "file-gateway-hybrid-backup",
    "practiceSet": 6,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Storage Gateway"
    ],
    "tags": [
      "Resilient Architectures",
      "Storage Gateway",
      "Hard",
      "PRO-060",
      "variant-1",
      "File Gateway for hybrid SMB protection with local cache",
      "file-gateway-hybrid-backup",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-061",
    "objectiveId": "PRO-061",
    "objectiveName": "IAM Identity Center: Org-wide attribute-based workforce access with minimal per-account administration.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "IAM Identity Center",
    "difficulty": "Hard",
    "type": "single",
    "question": "A financial services company runs a 40-account organization in AWS Organizations. Workforce users authenticate through a corporate identity provider that already maintains team and cost-center attributes for every employee. Security requires that a user's access in any member account be scoped to resources tagged with that user's own team and cost center, and the identity team refuses to maintain per-account role mappings as teams reorganize monthly. New accounts are added every quarter and must inherit the access model automatically. Which solution will meet these requirements with the LEAST operational overhead?",
    "options": [
      {
        "id": "a",
        "text": "Deploy per-team cross-account IAM roles into every member account with CloudFormation StackSets and map each team in the IdP to its role ARNs.",
        "correct": false,
        "explanation": "StackSets automate deployment, but the role-per-team-per-account matrix still grows with 40 accounts and monthly reorganizations, so mappings must be edited constantly, violating the minimal-administration requirement."
      },
      {
        "id": "b",
        "text": "Configure SAML 2.0 federation with the corporate IdP separately in each member account, create team-scoped IAM roles for federated users to assume, and update the mappings as teams reorganize.",
        "correct": false,
        "explanation": "Account-by-account SAML federation requires configuring the IdP trust and maintaining roles in all 40 accounts, and new accounts do not inherit anything automatically."
      },
      {
        "id": "c",
        "text": "Enable IAM Identity Center with the corporate IdP as its identity source, pass team and cost-center attributes for access control, and reference them in shared permission set conditions.",
        "correct": true,
        "explanation": "Identity Center with ABAC pushes the IdP's team and cost-center attributes into session tags, so one set of permission sets scales across all 40 accounts and reorganizations require no policy changes."
      },
      {
        "id": "d",
        "text": "Create IAM users tagged with team and cost-center values in each member account, enforce MFA, and write policies that compare each resource's tags to the requesting user's principal tags.",
        "correct": false,
        "explanation": "Tag-based conditions are the right ABAC idea, but per-account IAM users abandon the corporate IdP as the source of truth and multiply user administration across 40 accounts."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Use IAM Identity Center with the corporate IdP passing team and cost-center attributes, enforced through ABAC condition keys in shared permission sets.",
    "explanation": "The discriminating constraints are attribute-driven authorization sourced from the IdP and near-zero per-account administration across 40 accounts. Only organization-wide IAM Identity Center with ABAC lets a handful of permission sets scale automatically to new accounts while team changes flow from the IdP without policy edits. Every distractor keeps the ABAC or federation idea but reintroduces per-account maintenance.",
    "trigger": "Org-wide attribute-based workforce access with minimal per-account administration.",
    "intentGroup": "identity-center-abac",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "IAM Identity Center"
    ],
    "tags": [
      "Secure Architectures",
      "IAM Identity Center",
      "Hard",
      "PRO-061",
      "variant-1",
      "Org-wide attribute-based workforce access with minimal per-account administration.",
      "identity-center-abac",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-062",
    "objectiveId": "PRO-062",
    "objectiveName": "DynamoDB: Separate Regional failover from logical-corruption recovery for DynamoDB.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "DynamoDB",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A social media company stores 2 TB of user profiles in a DynamoDB table in us-east-1, serving 50,000 reads and 8,000 writes per second. A resilience review sets two requirements: the application must continue serving both reads and writes from a second Region with single-digit-millisecond latency if us-east-1 becomes unavailable, and the team must be able to recover the table to a state minutes before a faulty deployment that silently corrupts profile records. Last quarter such a deployment overwrote 40 million items before detection. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Configure the table as a DynamoDB global table with a replica in us-west-2 and fail application traffic over to the replica during a Regional outage.",
        "correct": true,
        "explanation": "Global tables provide active-active multi-Region replication, so the second Region keeps accepting both reads and writes locally when us-east-1 fails."
      },
      {
        "id": "b",
        "text": "Configure the table as a DynamoDB global table and use the us-west-2 replica as the clean data source when a deployment corrupts records.",
        "correct": false,
        "explanation": "Global tables replicate writes within seconds, so corrupted items propagate to every replica; replication is availability protection, not corruption protection."
      },
      {
        "id": "c",
        "text": "Use AWS Backup to copy table backups to us-west-2 every 4 hours and restore the latest copy there during a Regional outage.",
        "correct": false,
        "explanation": "Restoring a periodic backup in another Region takes hours for 2 TB and cannot serve writes during the outage, and a 4-hour copy cadence loses far more than minutes of data."
      },
      {
        "id": "d",
        "text": "Enable point-in-time recovery on the table and restore to a timestamp immediately before the faulty deployment when corruption is detected.",
        "correct": true,
        "explanation": "PITR provides per-second restore granularity over the past 35 days, which is exactly what recovering to minutes before a bad deploy requires."
      },
      {
        "id": "e",
        "text": "Deploy DynamoDB Accelerator (DAX) clusters in us-east-1 and us-west-2 so cached reads remain available during a Regional failure.",
        "correct": false,
        "explanation": "DAX is a read-through cache in front of a Regional table; it accelerates reads but cannot accept writes or serve current data once the underlying Region is down."
      }
    ],
    "answers": [
      "a",
      "d"
    ],
    "correctOptionIds": [
      "a",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d"
    ],
    "answerSummary": "Enable DynamoDB global tables for active-active multi-Region reads and writes, and enable point-in-time recovery to roll back table-wide corruption.",
    "explanation": "Two independent failure modes are in play: Regional unavailability and logical corruption. Global tables solve only the first, and because replication faithfully copies bad writes, PITR is required for the second. The trap is treating a replica as a backup; the correct pair combines multi-Region active-active with point-in-time restore.",
    "trigger": "Separate Regional failover from logical-corruption recovery for DynamoDB.",
    "intentGroup": "dynamodb-global-tables-plus-pitr",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "DynamoDB"
    ],
    "tags": [
      "Resilient Architectures",
      "DynamoDB",
      "Hard",
      "PRO-062",
      "variant-1",
      "Separate Regional failover from logical-corruption recovery for DynamoDB.",
      "dynamodb-global-tables-plus-pitr",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-063",
    "objectiveId": "PRO-063",
    "objectiveName": "Network Load Balancer: Static per-AZ IPs for a low-latency raw TCP feed point to NLB with EIPs.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "Network Load Balancer",
    "difficulty": "Hard",
    "type": "single",
    "question": "A capital markets firm distributes a real-time market data feed over a proprietary raw TCP protocol from EC2 instances in three Availability Zones. The platform sustains millions of concurrent long-lived connections, and added latency is measured in microseconds against competitors. Institutional clients connect over the internet and their firewalls require exactly one unchanging IP address per Availability Zone to allowlist. The firm needs a load balancing layer that satisfies the protocol, scale, latency, and allowlisting requirements. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Deploy an Application Load Balancer across the three Availability Zones and publish its DNS name so clients resolve and allowlist the current IP addresses.",
        "correct": false,
        "explanation": "An ALB operates at layer 7 for HTTP/HTTPS/gRPC only, so it cannot carry a proprietary raw TCP protocol, and its IP addresses change over time, breaking the allowlist requirement."
      },
      {
        "id": "b",
        "text": "Deploy a Network Load Balancer across the three Availability Zones and assign one Elastic IP address to the load balancer in each zone.",
        "correct": true,
        "explanation": "An NLB terminates layer 4 TCP at extreme scale with ultra-low latency, and it uniquely supports attaching one Elastic IP per AZ, giving clients a permanent address per zone to allowlist."
      },
      {
        "id": "c",
        "text": "Place AWS Global Accelerator in front of an Application Load Balancer and give clients the accelerator's two static anycast IP addresses to allowlist.",
        "correct": false,
        "explanation": "Global Accelerator does provide static IPs, but they are two global anycast addresses rather than one per AZ, the ALB behind it still cannot serve raw TCP, and the extra hop works against a microsecond latency budget."
      },
      {
        "id": "d",
        "text": "Deploy a Classic Load Balancer with TCP listeners across the three Availability Zones and enable cross-zone load balancing for the client connections.",
        "correct": false,
        "explanation": "A CLB supports TCP listeners but cannot attach Elastic IPs, is not designed for millions of concurrent connections, and is a legacy option AWS steers away from for new designs."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Use a Network Load Balancer with one Elastic IP address attached per Availability Zone.",
    "explanation": "Three constraints must hold simultaneously: layer 4 support for a proprietary TCP protocol, millions of connections at microsecond-class latency, and a fixed allowlistable IP per AZ. Only the NLB satisfies all three, because it alone allows an Elastic IP per zonal node. Global Accelerator's static IPs are global anycast, not per-AZ, which is the senior-level distinction being tested.",
    "trigger": "Static per-AZ IPs for a low-latency raw TCP feed point to NLB with EIPs.",
    "intentGroup": "nlb-static-ip-tcp",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Network Load Balancer"
    ],
    "tags": [
      "High-Performing Architectures",
      "Network Load Balancer",
      "Hard",
      "PRO-063",
      "variant-1",
      "Static per-AZ IPs for a low-latency raw TCP feed point to NLB with EIPs.",
      "nlb-static-ip-tcp",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-064",
    "objectiveId": "PRO-064",
    "objectiveName": "Athena: Cut Athena cost by scanning less: partition, columnar-compress, and compact.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Athena",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An adtech company stores clickstream events in an S3 data lake that grows by 1 TB per day, ingested as thousands of small uncompressed JSON files written throughout each day. Analysts query the lake with Amazon Athena, and although nearly every query filters on a single event date, each query scans multiple terabytes and the monthly Athena bill has tripled in two quarters. Query latency is also degrading as the file count grows. The company wants to reduce the per-query scan volume and cost without changing the analysts' SQL workflow. Which combination of steps will meet these requirements MOST cost-effectively? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Partition the table by event date and configure partition projection so date-filtered queries prune to the matching S3 prefixes.",
        "correct": true,
        "explanation": "Date partitioning aligned with the dominant filter lets Athena read only one day's prefix instead of the whole lake, and projection avoids metastore maintenance as partitions accumulate."
      },
      {
        "id": "b",
        "text": "Purchase Athena provisioned capacity for the analyst workgroup to run queries on dedicated processing capacity.",
        "correct": false,
        "explanation": "Provisioned capacity changes the pricing model to capacity-hours and can help concurrency, but it does nothing to shrink the terabytes each query reads, which is the stated cost driver."
      },
      {
        "id": "c",
        "text": "Convert incoming data to Snappy-compressed Apache Parquet in the ingestion pipeline instead of writing uncompressed JSON.",
        "correct": true,
        "explanation": "Columnar Parquet with compression lets Athena read only referenced columns and far fewer bytes, typically cutting scan volume by an order of magnitude versus raw JSON."
      },
      {
        "id": "d",
        "text": "Migrate the clickstream data into an Amazon Redshift cluster and repoint all analyst queries to Redshift.",
        "correct": false,
        "explanation": "A continuously running Redshift cluster adds significant fixed cost and forces a workflow migration, contradicting both the cost goal and the requirement to leave the analysts' Athena workflow unchanged."
      },
      {
        "id": "e",
        "text": "Run CTAS statements to rewrite the existing small JSON files into date-partitioned, compacted Parquet objects.",
        "correct": true,
        "explanation": "CTAS restructures the historical data so the scan and small-file benefits apply to existing terabytes, not just new ingestion, and compaction reduces per-file request overhead."
      },
      {
        "id": "f",
        "text": "Set a lower per-query data-scanned limit on the Athena workgroup to control runaway query costs.",
        "correct": false,
        "explanation": "A workgroup scan limit only cancels queries that exceed the cap; it does not reduce how much data a legitimate query must read, so the analysts' queries would simply fail."
      }
    ],
    "answers": [
      "a",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "e"
    ],
    "answerSummary": "Partition by event date with partition projection, convert ingestion to compressed Parquet, and use CTAS to rewrite existing JSON into partitioned, compacted Parquet.",
    "explanation": "Athena bills per byte scanned, so the discriminating constraint is reducing scan volume for both new and historical data while keeping the SQL workflow intact. Partitioning matches the date filter, columnar compression shrinks the bytes per partition, and CTAS retrofits both fixes onto existing data. Capacity purchases and scan caps alter billing or enforcement without reducing what queries actually read.",
    "trigger": "Cut Athena cost by scanning less: partition, columnar-compress, and compact.",
    "intentGroup": "athena-scan-cost",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Athena"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Athena",
      "Hard",
      "PRO-064",
      "variant-1",
      "Cut Athena cost by scanning less: partition, columnar-compress, and compact.",
      "athena-scan-cost",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-065",
    "objectiveId": "PRO-065",
    "objectiveName": "AWS WAF: Throttle rotating-IP credential stuffing with WAF rate-based rules, not static blocks.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "AWS WAF",
    "difficulty": "Hard",
    "type": "single",
    "question": "A retail company's web application runs behind an Application Load Balancer and authenticates users against its own identity store at a /login endpoint. Over the past week the endpoint has received millions of credential-stuffing attempts from tens of thousands of source IPs that rotate every few minutes across residential proxy networks. Legitimate customers sign in from every geography, so the security team cannot block by country or maintain static deny lists. The team must throttle abusive sources automatically while keeping the login flow available worldwide. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Maintain network ACL deny rules for the attacking IP ranges on the public subnets, updated automatically from commercial threat intelligence feeds.",
        "correct": false,
        "explanation": "NACL entries are static, capped in number, and evaluated per subnet; sources that rotate every few minutes across residential ranges outrun any deny-list update process."
      },
      {
        "id": "b",
        "text": "Subscribe to AWS Shield Advanced and rely on its automatic mitigations and the Shield Response Team to stop the login attacks.",
        "correct": false,
        "explanation": "Shield Advanced targets volumetric and protocol DDoS; low-and-slow credential stuffing that looks like valid HTTPS logins requires layer 7 request-rate inspection it does not provide on its own."
      },
      {
        "id": "c",
        "text": "Migrate authentication to Amazon Cognito user pools and enable advanced security features so adaptive authentication blocks sign-in attempts from risky sources.",
        "correct": false,
        "explanation": "Cognito's adaptive authentication is effective, but the application authenticates against its own identity store, so this forces a full authentication-stack migration far beyond the stated requirement."
      },
      {
        "id": "d",
        "text": "Attach an AWS WAF web ACL to the ALB with a rate-based rule scoped to /login plus the Account Takeover Prevention managed rule group.",
        "correct": true,
        "explanation": "A rate-based rule throttles each source that exceeds the login-request threshold without touching normal global traffic, and the ATP managed rules add stolen-credential and anomaly detection for the same endpoint."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Attach an AWS WAF web ACL to the ALB with a rate-based rule on /login plus the Account Takeover Prevention managed rule group.",
    "explanation": "The paired constraints are automatic per-source throttling against rapidly rotating IPs and zero collateral blocking of legitimate worldwide users. Only WAF evaluates layer 7 request rates per source dynamically at the endpoint level, and ATP adds credential-stuffing intelligence. IP deny lists cannot keep pace, Shield addresses a different attack class, and Cognito assumes an authentication stack the company does not use.",
    "trigger": "Throttle rotating-IP credential stuffing with WAF rate-based rules, not static blocks.",
    "intentGroup": "waf-rate-based-credential-stuffing",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "AWS WAF"
    ],
    "tags": [
      "Secure Architectures",
      "AWS WAF",
      "Hard",
      "PRO-065",
      "variant-1",
      "Throttle rotating-IP credential stuffing with WAF rate-based rules, not static blocks.",
      "waf-rate-based-credential-stuffing",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-066",
    "objectiveId": "PRO-066",
    "objectiveName": "AWS Backup: Ransomware-proof backups need org-level AWS Backup policies plus compliance-mode Vault Lock.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "AWS Backup",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "Following a ransomware tabletop exercise, an insurance company must protect backups of RDS databases, EBS volumes, and EFS file systems across the 25 accounts in its organization. Auditors set two requirements: backup schedules and retention must be defined once and enforced centrally rather than configured team by team, and stored backups must remain immutable for their entire retention period even if an attacker obtains administrator credentials in any account, including the management account. The current approach of team-managed snapshots failed the exercise when simulated attackers deleted them. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Create Amazon Data Lifecycle Manager policies in each member account to schedule EBS snapshots and set retention periods.",
        "correct": false,
        "explanation": "DLM is configured per account and covers only EBS snapshots, so it neither centralizes enforcement for RDS and EFS nor prevents an in-account administrator from deleting the policies and snapshots."
      },
      {
        "id": "b",
        "text": "Enable AWS Backup for the organization and deploy an organization-wide backup policy that copies resources from all accounts into a vault in a dedicated backup account.",
        "correct": true,
        "explanation": "Organization backup policies define schedules and retention once at the org level and enforce them across all 25 accounts, with copies landing in a centrally controlled vault."
      },
      {
        "id": "c",
        "text": "Build a Lambda-based pipeline that shares each account's snapshots to a central security account on a fixed schedule.",
        "correct": false,
        "explanation": "Custom snapshot-sharing scripts are undifferentiated operational burden, and shared snapshots in the security account remain deletable by anyone who compromises that account's credentials."
      },
      {
        "id": "d",
        "text": "Store database exports and file-system archives in an S3 bucket with versioning and MFA delete enabled in a central account.",
        "correct": false,
        "explanation": "Versioning with MFA delete raises the bar but a compromised root or sufficiently privileged principal can still remove versions or the bucket, and exports are not managed, restorable backups of RDS, EBS, and EFS."
      },
      {
        "id": "e",
        "text": "Apply AWS Backup Vault Lock in compliance mode to the central vault with a minimum retention period matching the audit requirement.",
        "correct": true,
        "explanation": "Compliance-mode Vault Lock makes recovery points WORM-immutable after the grace period; no identity, including account root and AWS itself, can delete them early, which defeats the compromised-admin scenario."
      }
    ],
    "answers": [
      "b",
      "e"
    ],
    "correctOptionIds": [
      "b",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "e"
    ],
    "answerSummary": "Use AWS Backup organization-wide backup policies into a central vault in a dedicated account, and lock that vault with Backup Vault Lock in compliance mode.",
    "explanation": "The two constraints are central enforcement across all accounts and immutability that survives compromised administrator credentials. Organization backup policies deliver the first for RDS, EBS, and EFS together, and only compliance-mode Vault Lock delivers the second, because governance controls like MFA delete or account separation can still be overridden by sufficiently privileged access. Per-account tooling and custom scripts fail one or both constraints.",
    "trigger": "Ransomware-proof backups need org-level AWS Backup policies plus compliance-mode Vault Lock.",
    "intentGroup": "aws-backup-org-vault-lock",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "AWS Backup"
    ],
    "tags": [
      "Resilient Architectures",
      "AWS Backup",
      "Hard",
      "PRO-066",
      "variant-1",
      "Ransomware-proof backups need org-level AWS Backup policies plus compliance-mode Vault Lock.",
      "aws-backup-org-vault-lock",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-067",
    "objectiveId": "PRO-067",
    "objectiveName": "EC2 Placement Groups: Tightly coupled MPI wants cluster placement plus EFA, not failure-isolation placement.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "EC2 Placement Groups",
    "difficulty": "Hard",
    "type": "single",
    "question": "An aerospace company runs computational fluid dynamics simulations using a tightly coupled MPI code across 64 EC2 compute-optimized instances. Profiling shows each simulation step exchanges hundreds of megabytes between all node pairs, and total runtime is dominated by inter-node communication rather than computation. The team wants the lowest possible node-to-node latency and the highest bisection bandwidth, and the batch scheduler can tolerate launching the whole job in a single Availability Zone. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Launch the 64 instances in a cluster placement group using instance types with Elastic Fabric Adapter enabled.",
        "correct": true,
        "explanation": "A cluster placement group packs instances onto the same high-bisection-bandwidth network segment in one AZ, and EFA's OS-bypass transport gives MPI the microsecond-scale latencies the communication-bound job needs."
      },
      {
        "id": "b",
        "text": "Launch the 64 instances in a partition placement group spread across seven partitions with Elastic Fabric Adapter enabled.",
        "correct": false,
        "explanation": "Partition groups deliberately separate instances onto distinct racks to isolate hardware failures, which lengthens network paths between partitions and works against all-pairs MPI traffic."
      },
      {
        "id": "c",
        "text": "Launch the 64 instances in a spread placement group so each instance runs on distinct underlying hardware with enhanced networking.",
        "correct": false,
        "explanation": "Spread groups maximize physical separation for availability, the opposite of the dense co-location this latency-bound workload requires, and they cap at seven instances per AZ per group."
      },
      {
        "id": "d",
        "text": "Launch the 64 instances in an Auto Scaling group balanced across three Availability Zones with ENA-based enhanced networking.",
        "correct": false,
        "explanation": "Cross-AZ links add roughly a millisecond of latency between subsets of ranks, which dwarfs intra-rack latencies; multi-AZ balancing helps resilience but ruins tightly coupled MPI performance."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Run the job in a cluster placement group on EFA-enabled instances within a single Availability Zone.",
    "explanation": "The constraints are all-pairs communication dominance and tolerance for single-AZ placement, which together point to maximizing network locality rather than failure isolation. Cluster placement groups provide the co-located, high-bisection-bandwidth fabric, and EFA provides the OS-bypass path MPI needs. Spread, partition, and multi-AZ options all trade locality for availability the scenario explicitly does not require.",
    "trigger": "Tightly coupled MPI wants cluster placement plus EFA, not failure-isolation placement.",
    "intentGroup": "cluster-placement-group-efa",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EC2 Placement Groups"
    ],
    "tags": [
      "High-Performing Architectures",
      "EC2 Placement Groups",
      "Hard",
      "PRO-067",
      "variant-1",
      "Tightly coupled MPI wants cluster placement plus EFA, not failure-isolation placement.",
      "cluster-placement-group-efa",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-068",
    "objectiveId": "PRO-068",
    "objectiveName": "ECS: Match ECS cost levers to workload traits: Savings Plan, Spot, and right-sizing.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "ECS",
    "difficulty": "Medium",
    "type": "multiple",
    "question": "A logistics company runs its platform on Amazon ECS with Fargate. The estate includes customer-facing API services that run at a steady baseline 24/7, fleets of queue-processing workers that can be safely interrupted and retried, and task definitions that request 4 vCPU while Container Insights shows average utilization near 15%. Finance has asked for a substantial reduction in the monthly compute bill without reducing API availability. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Move all API services and queue workers onto the Fargate Spot capacity provider to maximize the discount across the estate.",
        "correct": false,
        "explanation": "Fargate Spot tasks can be reclaimed with a two-minute warning, so running the customer-facing API baseline on Spot violates the requirement not to reduce API availability."
      },
      {
        "id": "b",
        "text": "Purchase a Compute Savings Plan sized to the steady 24/7 baseline of the API services.",
        "correct": true,
        "explanation": "The always-on API baseline is predictable committed usage, and a Compute Savings Plan discounts Fargate compute for exactly that steady-state portion without any availability trade-off."
      },
      {
        "id": "c",
        "text": "Migrate the cluster onto EC2 Dedicated Hosts to consolidate tasks and capture bring-your-own-license savings.",
        "correct": false,
        "explanation": "Dedicated Hosts carry a premium justified by BYOL or host-level compliance needs, neither of which exists here, so this raises rather than lowers the compute bill."
      },
      {
        "id": "d",
        "text": "Run the queue-processing workers on the Fargate Spot capacity provider with retry logic for reclaimed tasks.",
        "correct": true,
        "explanation": "The workers are explicitly interruption-tolerant, so Fargate Spot's discount of up to about 70% applies to them with no impact on the APIs."
      },
      {
        "id": "e",
        "text": "Raise the services' target-tracking CPU threshold so autoscaling keeps fewer tasks running at peak load.",
        "correct": false,
        "explanation": "Pushing the scaling target higher trims task count at the margin but risks API performance during spikes and ignores the real waste: each task reserves roughly six times the CPU it uses."
      },
      {
        "id": "f",
        "text": "Reduce the task-level vCPU and memory reservations to match the utilization observed in Container Insights.",
        "correct": true,
        "explanation": "Fargate bills on requested vCPU and memory, so right-sizing tasks running at 15% utilization on 4 vCPU cuts cost directly across every service and worker."
      }
    ],
    "answers": [
      "b",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "f"
    ],
    "answerSummary": "Buy a Compute Savings Plan for the steady API baseline, run interruption-tolerant workers on Fargate Spot, and right-size task vCPU/memory using Container Insights data.",
    "explanation": "The scenario contains three distinct cost levers that map to three workload traits: committed-use discounting for the steady baseline, Spot pricing for interruption-tolerant work, and right-sizing for overprovisioned tasks. The trap options apply the right mechanisms to the wrong workloads, such as Spot for the availability-sensitive APIs. Fargate's pricing on requested capacity makes right-sizing a first-order saving, not an afterthought.",
    "trigger": "Match ECS cost levers to workload traits: Savings Plan, Spot, and right-sizing.",
    "intentGroup": "ecs-cost-mix",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ECS"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "ECS",
      "Medium",
      "PRO-068",
      "variant-1",
      "Match ECS cost levers to workload traits: Savings Plan, Spot, and right-sizing.",
      "ecs-cost-mix",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-069",
    "objectiveId": "PRO-069",
    "objectiveName": "VPC: Broad connection metadata via Flow Logs, targeted packet capture via Traffic Mirroring.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "VPC",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A healthcare company's security team suspects data exfiltration from an application subnet containing about 200 EC2 instances. For the forensic case they need a continuous record of every connection's source, destination, ports, and byte counts for all ENIs in the subnet retained for 90 days. For five suspect instances they additionally need full packet payloads delivered to a third-party IDS appliance for deep inspection, and capturing full packets for the entire subnet has been ruled out as cost-prohibitive. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Enable Amazon GuardDuty for the account and review its exfiltration-related findings for the subnet's instances.",
        "correct": false,
        "explanation": "GuardDuty analyzes flow logs, DNS logs, and CloudTrail internally and emits findings, but it exposes neither queryable per-connection records for the case file nor packet payloads for the IDS."
      },
      {
        "id": "b",
        "text": "Deploy AWS Network Firewall in front of the subnet with logging enabled to inspect and record the traffic.",
        "correct": false,
        "explanation": "Network Firewall is an inline filtering control that requires re-architecting routing; it does not deliver raw packet copies to a third-party IDS, and inserting it risks tipping off an active exfiltration attempt."
      },
      {
        "id": "c",
        "text": "Enable VPC Flow Logs at the subnet level with delivery to an S3 bucket governed by a 90-day retention lifecycle policy.",
        "correct": true,
        "explanation": "Subnet-scoped flow logs capture connection-level metadata for every ENI automatically, including ones attached later, and S3 lifecycle rules satisfy the 90-day retention cheaply."
      },
      {
        "id": "d",
        "text": "Enable AWS CloudTrail data events for the resources the suspect instances access and analyze the event history.",
        "correct": false,
        "explanation": "CloudTrail data events record API-level object access such as S3 GetObject; they contain no network connection records and no payloads, so they answer neither requirement."
      },
      {
        "id": "e",
        "text": "Configure VPC Traffic Mirroring sessions on the five suspect instances' ENIs with the IDS appliance's load balancer as the mirror target.",
        "correct": true,
        "explanation": "Traffic Mirroring copies full packets from exactly the chosen ENIs to the IDS out-of-band, delivering payload inspection for the suspects while avoiding the prohibitive cost of mirroring all 200 instances."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Enable subnet-level VPC Flow Logs to S3 with 90-day retention, and mirror the five suspect ENIs to the IDS with VPC Traffic Mirroring.",
    "explanation": "The two requirements demand different telemetry depths at different scopes: cheap connection metadata for everything, and expensive full packets for a narrow target set. Flow Logs carry no payload, so they can never satisfy the IDS requirement alone, and mirroring the whole subnet breaks the stated cost constraint. Pairing broad Flow Logs with narrowly scoped Traffic Mirroring is the only combination that satisfies both.",
    "trigger": "Broad connection metadata via Flow Logs, targeted packet capture via Traffic Mirroring.",
    "intentGroup": "flow-logs-plus-traffic-mirroring",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "VPC"
    ],
    "tags": [
      "Secure Architectures",
      "VPC",
      "Hard",
      "PRO-069",
      "variant-1",
      "Broad connection metadata via Flow Logs, targeted packet capture via Traffic Mirroring.",
      "flow-logs-plus-traffic-mirroring",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-070",
    "objectiveId": "PRO-070",
    "objectiveName": "ElastiCache: Sessions lost on scale-in mean externalize state, not sticky sessions.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "ElastiCache",
    "difficulty": "Medium",
    "type": "single",
    "question": "An e-commerce company runs its web tier on EC2 instances in an Auto Scaling group behind an Application Load Balancer across three Availability Zones. Shopping-cart and login session data is held in each instance's local memory. Customers are logged out and lose carts whenever scale-in terminates an instance, a deployment replaces instances, or an AZ is drained during maintenance, and abandonment spikes follow each event. The fix must let the Auto Scaling group continue scaling in and out freely. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Enable duration-based sticky sessions on the ALB target group so each customer's requests return to the same instance.",
        "correct": false,
        "explanation": "Stickiness only pins routing while the instance is alive; the session data still lives in local memory and is lost the moment scale-in, deployment, or AZ drain removes that instance."
      },
      {
        "id": "b",
        "text": "Increase the target group's deregistration delay so in-flight requests complete before instances are terminated.",
        "correct": false,
        "explanation": "Deregistration delay gracefully finishes open requests during removal, but it does nothing to preserve the session state stored in the memory of the instance being terminated."
      },
      {
        "id": "c",
        "text": "Add a warm pool to the Auto Scaling group so replacement instances launch pre-initialized during scale events.",
        "correct": false,
        "explanation": "Warm pools shorten launch time for new capacity; they cannot transfer another instance's in-memory sessions, so customers on terminated instances are still logged out."
      },
      {
        "id": "d",
        "text": "Store session data in an ElastiCache for Redis replication group and have the web tier read and write sessions there.",
        "correct": true,
        "explanation": "Externalizing sessions to a Multi-AZ Redis store makes every web instance stateless, so any instance can serve any customer and scale-in, deployments, and AZ drains no longer destroy carts."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Externalize session state to ElastiCache for Redis so the web tier becomes stateless.",
    "explanation": "The root cause is state coupled to instance lifetime, and the constraint is that elasticity must remain unrestricted. Sticky sessions, deregistration delay, and warm pools all manage routing or launch mechanics while leaving sessions trapped in local memory. Only moving session state to an external Multi-AZ store decouples customer sessions from any individual instance.",
    "trigger": "Sessions lost on scale-in mean externalize state, not sticky sessions.",
    "intentGroup": "externalize-session-state",
    "practiceSet": 7,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ElastiCache"
    ],
    "tags": [
      "Resilient Architectures",
      "ElastiCache",
      "Medium",
      "PRO-070",
      "variant-1",
      "Sessions lost on scale-in mean externalize state, not sticky sessions.",
      "externalize-session-state",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-071",
    "objectiveId": "PRO-071",
    "objectiveName": "ALB: End-to-end TLS through an ALB without losing L7 routing and WAF",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "ALB",
    "difficulty": "Hard",
    "type": "single",
    "question": "A healthcare company runs a patient-portal application on EC2 instances behind an Application Load Balancer across three Availability Zones. The application relies on ALB path-based routing to split traffic between a web tier and an API tier, and AWS WAF is attached to the load balancer to satisfy the company's security baseline. A new compliance audit requires that traffic be encrypted in transit on every network hop, including between the load balancer and the EC2 instances. The routing and WAF protections must remain in place. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Attach an AWS Certificate Manager certificate to the ALB HTTPS listener, place the EC2 instances in private subnets, and forward traffic to the targets over HTTP port 80.",
        "correct": false,
        "explanation": "Terminating TLS at the ALB leaves the hop between the load balancer and the instances unencrypted, which violates the every-hop encryption requirement even though the subnets are private."
      },
      {
        "id": "b",
        "text": "Replace the ALB with a Network Load Balancer that uses a TCP listener on port 443 to pass encrypted traffic through to the EC2 instances unmodified.",
        "correct": false,
        "explanation": "TCP passthrough does preserve end-to-end TLS, but an NLB operates at layer 4, so the company would lose the required path-based routing and the AWS WAF association."
      },
      {
        "id": "c",
        "text": "Attach an AWS Certificate Manager certificate to the ALB HTTPS listener and configure the target group to use HTTPS, installing certificates on the EC2 instances.",
        "correct": true,
        "explanation": "An HTTPS listener plus an HTTPS target group re-encrypts traffic from the ALB to the targets, and the ALB accepts self-signed or private certificates on instances, so every hop is encrypted while layer-7 routing and WAF are retained."
      },
      {
        "id": "d",
        "text": "Create a CloudFront distribution in front of the ALB and enable field-level encryption profiles for the sensitive form fields that patients submit.",
        "correct": false,
        "explanation": "Field-level encryption protects specific payload fields, not the transport hop between the ALB and the instances, so the ALB-to-target connection would still be unencrypted."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Use an ACM certificate on the ALB HTTPS listener and an HTTPS target group with certificates installed on the instances.",
    "explanation": "The discriminating constraints are encryption on every hop and retention of layer-7 features. Only an HTTPS listener combined with an HTTPS target group satisfies both: TLS is terminated and re-established at the ALB, so WAF and path routing keep working. NLB passthrough achieves end-to-end TLS but sacrifices the layer-7 requirement, which is the trap for readers weighing only one constraint.",
    "trigger": "End-to-end TLS through an ALB without losing L7 routing and WAF",
    "intentGroup": "end-to-end-tls-alb-targets",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ALB"
    ],
    "tags": [
      "Secure Architectures",
      "ALB",
      "Hard",
      "PRO-071",
      "variant-1",
      "End-to-end TLS through an ALB without losing L7 routing and WAF",
      "end-to-end-tls-alb-targets",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-072",
    "objectiveId": "PRO-072",
    "objectiveName": "S3: Pairing versioning with CRR to cover both Region loss and accidental overwrites",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "S3",
    "difficulty": "Medium",
    "type": "multiple",
    "question": "A financial services firm stores 40 TB of regulatory records in a single Amazon S3 bucket in us-east-1. An internal resilience review found two gaps: the records would be unavailable during a Region-wide event, and a recent application bug overwrote several hundred objects with corrupted data that could not be recovered. The firm requires that the data survive the loss of a Region and that objects be recoverable after accidental overwrites or deletions caused by application defects. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Enable S3 Versioning on the bucket so that overwritten and deleted objects are retained as prior versions.",
        "correct": true,
        "explanation": "Versioning preserves every prior object version, which is what allows recovery after an application bug overwrites or deletes data; it is also a prerequisite for replication."
      },
      {
        "id": "b",
        "text": "Enable MFA delete on the bucket so that object deletions require multi-factor authentication from the root user.",
        "correct": false,
        "explanation": "MFA delete guards against deletion of versions but does nothing for a Region-wide event, and it does not stop an application from overwriting object contents with corrupted data."
      },
      {
        "id": "c",
        "text": "Configure S3 Same-Region Replication to a second bucket in a different account in us-east-1.",
        "correct": false,
        "explanation": "A replica in the same Region shares the Region's fate, so this fails the requirement to survive a Region-wide event even though the second account adds some isolation."
      },
      {
        "id": "d",
        "text": "Configure S3 Cross-Region Replication to a bucket in a second AWS Region.",
        "correct": true,
        "explanation": "Cross-Region Replication maintains a copy in a second Region, satisfying the Region-loss requirement; note that replication propagates bad writes, which is why versioning is the piece that handles overwrites."
      },
      {
        "id": "e",
        "text": "Create a lifecycle rule that transitions objects to S3 Glacier Deep Archive to serve as the disaster recovery copy.",
        "correct": false,
        "explanation": "A lifecycle transition moves the same objects to a colder tier in the same Region rather than creating an independent copy, so it protects against neither Region loss nor overwrites."
      }
    ],
    "answers": [
      "a",
      "d"
    ],
    "correctOptionIds": [
      "a",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "d"
    ],
    "answerSummary": "Enable S3 Versioning and configure Cross-Region Replication to a bucket in a second Region.",
    "explanation": "Two independent failure modes must be covered: Region loss and application-caused overwrites. CRR addresses the Region event but faithfully replicates bad writes, so versioning is what makes overwritten data recoverable. Candidates who treat replication as a backup mechanism miss that only the versioning half protects against the corruption scenario.",
    "trigger": "Pairing versioning with CRR to cover both Region loss and accidental overwrites",
    "intentGroup": "s3-versioning-plus-crr",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3"
    ],
    "tags": [
      "Resilient Architectures",
      "S3",
      "Medium",
      "PRO-072",
      "variant-1",
      "Pairing versioning with CRR to cover both Region loss and accidental overwrites",
      "s3-versioning-plus-crr",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-073",
    "objectiveId": "PRO-073",
    "objectiveName": "Kinesis: Dedicated per-consumer throughput via Kinesis enhanced fan-out",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "Kinesis",
    "difficulty": "Hard",
    "type": "single",
    "question": "An adtech platform ingests clickstream events into an Amazon Kinesis data stream with 12 shards. Five independent applications consume the same stream in real time: fraud scoring, bid optimization, personalization, billing, and a compliance archiver. As consumers were added, all five began throttling on the shared 2 MB per second per shard read limit, and end-to-end processing latency has grown from tens of milliseconds to several seconds. The platform requires that each consumer receive records with less than 100 ms of propagation delay and that ordering per partition key and replay capability be preserved. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Use the UpdateShardCount API to double the stream to 24 shards so that the aggregate read capacity available to the consumers increases.",
        "correct": false,
        "explanation": "Resharding raises aggregate throughput but each shard's 2 MB/s read limit is still shared by all five consumers, so contention and polling latency persist while shard costs double."
      },
      {
        "id": "b",
        "text": "Register each of the five consuming applications as an enhanced fan-out consumer of the stream.",
        "correct": true,
        "explanation": "Enhanced fan-out gives every registered consumer its own dedicated 2 MB/s per shard and pushes records over HTTP/2 with typical ~70 ms propagation delay, eliminating the shared-limit contention while keeping ordering and replay."
      },
      {
        "id": "c",
        "text": "Publish the events to an Amazon SNS topic that fans out to five Amazon SQS standard queues, one per consuming application.",
        "correct": false,
        "explanation": "SNS-to-SQS fan-out removes read contention but standard queues do not preserve per-key ordering or provide stream replay, both of which are stated requirements."
      },
      {
        "id": "d",
        "text": "Replace the data stream with an Amazon Data Firehose delivery stream that delivers the events to each application's endpoint.",
        "correct": false,
        "explanation": "Firehose is a delivery service with buffering measured in seconds and a limited set of destinations, so it cannot serve five independent sub-100 ms real-time consumers."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Register the five applications as Kinesis enhanced fan-out consumers.",
    "explanation": "The constraints to weigh together are per-consumer read contention, sub-100 ms latency, and retained ordering/replay semantics. Enhanced fan-out is the only option that removes the shared 2 MB/s per-shard limit by dedicating throughput per consumer while staying on Kinesis. Resharding is the senior trap: it scales the stream, not the per-shard fan-out to multiple consumers.",
    "trigger": "Dedicated per-consumer throughput via Kinesis enhanced fan-out",
    "intentGroup": "kinesis-enhanced-fan-out",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Kinesis"
    ],
    "tags": [
      "High-Performing Architectures",
      "Kinesis",
      "Hard",
      "PRO-073",
      "variant-1",
      "Dedicated per-consumer throughput via Kinesis enhanced fan-out",
      "kinesis-enhanced-fan-out",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-074",
    "objectiveId": "PRO-074",
    "objectiveName": "Redshift: Layered Redshift savings: pause/resume, RA3, and Spectrum offload",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Redshift",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A retail analytics company runs two Amazon Redshift clusters. A development cluster is used by analysts only on weekdays from 08:00 to 18:00 and sits idle on nights and weekends. The production cluster holds 400 TB of data on dense storage nodes, but usage analysis shows about 300 TB is historical data queried only a few times per quarter, while dashboards hit the recent 100 TB constantly. The company wants to cut Redshift spend significantly without losing the ability to query any of the data with SQL. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Upgrade the production cluster to larger DC2 nodes so the full 400 TB fits on fewer nodes with local SSD storage.",
        "correct": false,
        "explanation": "DC2 couples storage to compute, so holding 400 TB forces the company to buy compute sized for storage; this scales cost with the cold data instead of separating the two."
      },
      {
        "id": "b",
        "text": "Create a schedule that pauses the development cluster outside weekday business hours and resumes it each morning.",
        "correct": true,
        "explanation": "Pause and resume stops on-demand compute billing during the roughly 70 percent of hours the development cluster is idle while preserving the cluster's data and configuration."
      },
      {
        "id": "c",
        "text": "Enable concurrency scaling on the development cluster so that extra capacity is billed only when queries are running.",
        "correct": false,
        "explanation": "Concurrency scaling adds transient capacity for queue bursts on an active cluster; it does not reduce the base cost of a cluster that sits idle on nights and weekends."
      },
      {
        "id": "d",
        "text": "Migrate the production cluster to RA3 nodes so compute is sized for the query workload and Redshift Managed Storage holds the data.",
        "correct": true,
        "explanation": "RA3 decouples compute from storage, letting the company size compute for the hot 100 TB working set while managed storage absorbs the rest at storage rates."
      },
      {
        "id": "e",
        "text": "Take a final snapshot of the development cluster each evening, delete the cluster, and restore it from the snapshot each morning.",
        "correct": false,
        "explanation": "Daily delete-and-restore achieves a similar billing outcome to pausing but adds restore delays, endpoint churn, and scripting overhead that the managed pause/resume schedule avoids."
      },
      {
        "id": "f",
        "text": "Unload the rarely queried historical data to Amazon S3 and query it through Redshift Spectrum when needed.",
        "correct": true,
        "explanation": "Moving the 300 TB of cold history to S3 cuts it to object-storage pricing while Spectrum keeps it queryable with SQL from the same cluster, satisfying the no-lost-queryability constraint."
      }
    ],
    "answers": [
      "b",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "f"
    ],
    "answerSummary": "Schedule pause/resume for the development cluster, migrate production to RA3 with managed storage, and offload cold history to S3 queried via Redshift Spectrum.",
    "explanation": "The scenario forces three separate cost levers: idle-time compute (pause/resume), storage-compute coupling (RA3 managed storage), and cold data that must stay SQL-queryable (S3 plus Spectrum). Each distractor optimizes the wrong axis, such as concurrency scaling for an idle cluster or DC2 local storage that grows compute cost with data volume.",
    "trigger": "Layered Redshift savings: pause/resume, RA3, and Spectrum offload",
    "intentGroup": "redshift-cost-optimization",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Redshift"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Redshift",
      "Hard",
      "PRO-074",
      "variant-1",
      "Layered Redshift savings: pause/resume, RA3, and Spectrum offload",
      "redshift-cost-optimization",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-075",
    "objectiveId": "PRO-075",
    "objectiveName": "EC2: IMDSv2 token requirement and hop limit as SSRF mitigation",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "EC2",
    "difficulty": "Hard",
    "type": "single",
    "question": "A media company hosts a legacy web application on a fleet of 200 EC2 instances that use instance profile roles to access S3 and DynamoDB. A penetration test demonstrated that a server-side request forgery (SSRF) flaw in the application could be used to retrieve the role's temporary credentials from the instance metadata service. The security team must prevent credential theft through this SSRF vector across the fleet. The application team cannot redesign or patch the application in the near term, and the instances must keep using their IAM roles. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Remove the instance profiles, create IAM user access keys for the application, and distribute them to the instances from AWS Secrets Manager.",
        "correct": false,
        "explanation": "Swapping auto-rotated role credentials for long-lived access keys weakens the security posture, and the keys would still be readable by the compromised application process."
      },
      {
        "id": "b",
        "text": "Add host firewall rules on every instance that block all outbound traffic to 169.254.169.254.",
        "correct": false,
        "explanation": "Blocking the metadata endpoint entirely breaks the AWS SDK's legitimate credential retrieval, so the application would lose the IAM role access it must keep."
      },
      {
        "id": "c",
        "text": "Create a Lambda function that rotates the credentials of the instance role every 24 hours.",
        "correct": false,
        "explanation": "Instance role credentials are already short-lived and rotated automatically by AWS, and rotation does not stop an attacker from fetching a fresh set through the same SSRF flaw."
      },
      {
        "id": "d",
        "text": "Require IMDSv2 on all instances by enforcing session tokens and setting the metadata response hop limit to 1.",
        "correct": true,
        "explanation": "IMDSv2 requires a session token obtained via a PUT request, which typical SSRF vectors cannot forge, and the hop limit of 1 keeps token responses from leaving the instance; the SDK continues to work unchanged."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Enforce IMDSv2 with required session tokens and a metadata hop limit of 1 across the fleet.",
    "explanation": "The constraints in tension are stopping the SSRF credential-theft path while making no application changes and preserving IAM role access. IMDSv2 enforcement is the only option that closes the vector without breaking SDK credential retrieval; blocking the metadata IP or moving to static keys each violates one of the stated requirements.",
    "trigger": "IMDSv2 token requirement and hop limit as SSRF mitigation",
    "intentGroup": "imdsv2-ssrf-mitigation",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EC2"
    ],
    "tags": [
      "Secure Architectures",
      "EC2",
      "Hard",
      "PRO-075",
      "variant-1",
      "IMDSv2 token requirement and hop limit as SSRF mitigation",
      "imdsv2-ssrf-mitigation",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-076",
    "objectiveId": "PRO-076",
    "objectiveName": "Route 53: Second-Region serverless stack with global tables plus Route 53 failover",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Route 53",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A logistics company runs a serverless order-tracking API built on Amazon API Gateway regional endpoints, AWS Lambda, and an Amazon DynamoDB table, all in eu-west-1. After a Regional service disruption caused a four-hour outage, leadership mandated that the API continue serving reads and writes if its primary Region becomes unavailable. An RTO of a few minutes using DNS-based failover is acceptable, and the team wants to stay on managed services rather than build custom replication. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Convert the API to an edge-optimized endpoint so that requests enter through CloudFront edge locations worldwide.",
        "correct": false,
        "explanation": "An edge-optimized endpoint accelerates ingress through CloudFront, but the API's Lambda functions and table still run only in eu-west-1, so a Regional failure still takes the API down."
      },
      {
        "id": "b",
        "text": "Create a CloudFront distribution with a Lambda@Edge function that retries failed requests against the origin.",
        "correct": false,
        "explanation": "Lambda@Edge can manipulate requests at the edge, but retrying against a single-Region origin does not create standby capacity in another Region and adds custom code to maintain."
      },
      {
        "id": "c",
        "text": "Deploy the API Gateway and Lambda stack to a second Region and convert the DynamoDB table to a global table with a replica there.",
        "correct": true,
        "explanation": "A full stack in a second Region with a global table replica provides active read/write capacity and managed multi-Region data replication, which is the foundation the failover routing needs."
      },
      {
        "id": "d",
        "text": "Enable DynamoDB Streams and write a Lambda function that copies each item change to a table in a second Region.",
        "correct": false,
        "explanation": "Streams-driven copying rebuilds what global tables already provide as a managed feature, adding custom replication code the team explicitly wants to avoid and no compute failover."
      },
      {
        "id": "e",
        "text": "Create Route 53 failover records with health checks that route traffic to the Regional API endpoint in each Region.",
        "correct": true,
        "explanation": "Health-checked failover records shift DNS to the secondary Region's API endpoint within minutes of the primary failing, which meets the stated DNS-based RTO."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Deploy the stack to a second Region with a DynamoDB global table, and use Route 53 health-checked failover records across the Regional API endpoints.",
    "explanation": "Surviving a Region failure needs both standby capacity with replicated data and a routing mechanism to reach it; each correct option supplies one half. The edge-optimized and Lambda@Edge options only change how traffic reaches a single-Region backend, and Streams-based copying violates the managed-services constraint that global tables satisfy.",
    "trigger": "Second-Region serverless stack with global tables plus Route 53 failover",
    "intentGroup": "serverless-multi-region-failover",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Route 53"
    ],
    "tags": [
      "Resilient Architectures",
      "Route 53",
      "Hard",
      "PRO-076",
      "variant-1",
      "Second-Region serverless stack with global tables plus Route 53 failover",
      "serverless-multi-region-failover",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-077",
    "objectiveId": "PRO-077",
    "objectiveName": "EFS: EFS Elastic Throughput for spiky workloads without paying for peak",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "EFS",
    "difficulty": "Medium",
    "type": "single",
    "question": "A genomics startup stores shared analysis data on an Amazon EFS file system that uses Bursting Throughput mode. Every afternoon, batch pipelines drive sustained reads that exhaust the file system's burst credits, and throughput collapses to the baseline rate, stretching job runtimes from 1 hour to more than 4 hours. The traffic pattern is spiky and varies unpredictably from day to day, and the team does not want to pay around the clock for capacity sized to the afternoon peak. Which solution will meet these requirements MOST cost-effectively?",
    "options": [
      {
        "id": "a",
        "text": "Switch the file system to Elastic Throughput mode so throughput scales automatically with the workload.",
        "correct": true,
        "explanation": "Elastic Throughput removes the burst-credit model, scales performance up and down with demand automatically, and bills for the throughput actually used, which fits a spiky, unpredictable pattern."
      },
      {
        "id": "b",
        "text": "Switch the file system to Provisioned Throughput mode set at the highest observed afternoon peak rate.",
        "correct": false,
        "explanation": "Provisioning for peak eliminates the slowdowns but bills for that peak rate 24/7, which directly conflicts with the requirement not to pay constantly for peak capacity."
      },
      {
        "id": "c",
        "text": "Copy several terabytes of placeholder data into the file system so the larger size earns a higher baseline and more burst credits.",
        "correct": false,
        "explanation": "Padding the file system does raise baseline throughput in bursting mode, but it adds standing storage cost and operational clutter, and unpredictable spikes can still drain the larger credit balance."
      },
      {
        "id": "d",
        "text": "Recreate the file system with the Max I/O performance mode and migrate the analysis data to it.",
        "correct": false,
        "explanation": "Max I/O raises aggregate IOPS parallelism at the cost of higher per-operation latency; it does not change throughput modes or credits, so the afternoon collapse would continue."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Move the file system to EFS Elastic Throughput mode.",
    "explanation": "The two constraints are unpredictable spiky demand and refusal to pay for constant peak capacity. Elastic Throughput is purpose-built for exactly that trade-off, while Provisioned mode fails the cost constraint and the dummy-data trick is the legacy workaround that Elastic mode replaced. Max I/O addresses a different dimension entirely.",
    "trigger": "EFS Elastic Throughput for spiky workloads without paying for peak",
    "intentGroup": "efs-elastic-throughput",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EFS"
    ],
    "tags": [
      "High-Performing Architectures",
      "EFS",
      "Medium",
      "PRO-077",
      "variant-1",
      "EFS Elastic Throughput for spiky workloads without paying for peak",
      "efs-elastic-throughput",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-078",
    "objectiveId": "PRO-078",
    "objectiveName": "EC2 Spot: Spot interruption resilience via diversification, allocation strategy, and checkpointing",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "EC2 Spot",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A climate-modeling company runs a nightly batch job on an EC2 Auto Scaling group of Spot Instances that all use one instance type in a single Availability Zone. Several nights per week, Spot reclamation interrupts instances mid-run, and because the job restarts from the beginning, the team loses hours of compute and reruns inflate the bill. The jobs can be divided into independent chunks and are restartable in principle, and the company must stay within its current compute budget, which rules out shifting the fleet to On-Demand. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Configure the fleet to request capacity across many instance types, sizes, and Availability Zones.",
        "correct": true,
        "explanation": "Diversification across pools makes it far less likely that all capacity is reclaimed at once, since interruptions are pool-specific, and it widens the set of Spot capacity the fleet can draw from."
      },
      {
        "id": "b",
        "text": "Set the maximum Spot price well above the On-Demand price so that the instances are never outbid.",
        "correct": false,
        "explanation": "Under the current Spot model, interruptions are driven by EC2 reclaiming capacity rather than by bid competition, so a high maximum price does not prevent reclamation and risks paying above On-Demand."
      },
      {
        "id": "c",
        "text": "Select the price-capacity-optimized allocation strategy so the fleet launches into deep, lower-cost capacity pools.",
        "correct": true,
        "explanation": "Price-capacity-optimized steers launches toward pools with the most spare capacity at good prices, which measurably lowers interruption rates compared with lowest-price selection."
      },
      {
        "id": "d",
        "text": "Standardize the fleet on the single instance type that currently shows the deepest Spot discount.",
        "correct": false,
        "explanation": "Concentrating on one heavily discounted pool is the opposite of diversification; a discount that deep often signals a pool where reclamation is likely, recreating the current failure mode."
      },
      {
        "id": "e",
        "text": "Checkpoint chunk progress to Amazon S3 or DynamoDB so interrupted work resumes from the last completed chunk.",
        "correct": true,
        "explanation": "Because the jobs are divisible and restartable, checkpointing converts an interruption from a full rerun into a short resume, directly eliminating the wasted compute driving the overruns."
      },
      {
        "id": "f",
        "text": "Move the nightly batch fleet to On-Demand Instances so that capacity is never reclaimed mid-run.",
        "correct": false,
        "explanation": "On-Demand does remove interruptions, but the scenario states the compute budget rules this out, so it fails the explicit cost constraint."
      }
    ],
    "answers": [
      "a",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "e"
    ],
    "answerSummary": "Diversify instance types, sizes, and AZs; use the price-capacity-optimized allocation strategy; and checkpoint progress so jobs resume after interruption.",
    "explanation": "Spot resilience requires reducing interruption probability (diversified pools plus price-capacity-optimized allocation) and tolerating the interruptions that still happen (checkpointing). The max-price option tests whether candidates know reclamation is capacity-driven in the current Spot model, and the On-Demand option violates the stated budget constraint.",
    "trigger": "Spot interruption resilience via diversification, allocation strategy, and checkpointing",
    "intentGroup": "spot-interruption-resilience",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EC2 Spot"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "EC2 Spot",
      "Hard",
      "PRO-078",
      "variant-1",
      "Spot interruption resilience via diversification, allocation strategy, and checkpointing",
      "spot-interruption-resilience",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-079",
    "objectiveId": "PRO-079",
    "objectiveName": "AWS Config: Org-wide Config rules with SSM Automation auto-remediation",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "AWS Config",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A fintech organization manages 60 AWS accounts with AWS Organizations. A recent audit found S3 buckets that had been made publicly accessible and EBS volumes created without encryption in several member accounts, some of which went unnoticed for weeks. The security team must continuously detect these two conditions across every account in the organization and automatically correct violating resources within minutes of detection, without requiring engineers in each account to take manual action. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Enable AWS Trusted Advisor security checks in every account and have the security team review the consolidated dashboard weekly.",
        "correct": false,
        "explanation": "Trusted Advisor surfaces a limited set of checks on its own refresh cycle and offers no automatic correction, so it satisfies neither continuous detection nor minutes-scale remediation."
      },
      {
        "id": "b",
        "text": "Deploy an organization-wide AWS Config conformance pack containing managed rules for public S3 buckets and unencrypted EBS volumes.",
        "correct": true,
        "explanation": "Organization conformance packs push the Config rules into every member account automatically, giving continuous, resource-level compliance evaluation across all 60 accounts from one deployment."
      },
      {
        "id": "c",
        "text": "Enable AWS Security Hub with the CIS Foundations standard across the organization and triage the generated findings.",
        "correct": false,
        "explanation": "Security Hub aggregates and scores findings across accounts, but standards alone only report; without a separate remediation wire-up, violating buckets and volumes are not fixed automatically."
      },
      {
        "id": "d",
        "text": "Attach automatic remediation actions to the Config rules that invoke AWS Systems Manager Automation runbooks on noncompliant resources.",
        "correct": true,
        "explanation": "Config remediation actions trigger SSM Automation documents as soon as a resource is flagged noncompliant, blocking public access or handling the unencrypted volume within minutes with no manual step."
      },
      {
        "id": "e",
        "text": "Attach a service control policy to the organization root that denies making buckets public and creating unencrypted volumes, bringing existing resources back into compliance.",
        "correct": false,
        "explanation": "SCPs are preventive guardrails on future API calls; they never evaluate or modify resources that already exist, so drift that has already occurred is not detected or corrected."
      }
    ],
    "answers": [
      "b",
      "d"
    ],
    "correctOptionIds": [
      "b",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d"
    ],
    "answerSummary": "Deploy organization-wide AWS Config rules via a conformance pack and attach automatic remediation using SSM Automation runbooks.",
    "explanation": "The requirements pair continuous org-wide detection with automatic correction in minutes, which maps to Config organization rules for the detect half and Config remediation actions backed by SSM Automation for the fix half. Security Hub and Trusted Advisor only report, and an SCP is preventive rather than corrective for existing resources.",
    "trigger": "Org-wide Config rules with SSM Automation auto-remediation",
    "intentGroup": "config-rules-auto-remediation",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "AWS Config"
    ],
    "tags": [
      "Secure Architectures",
      "AWS Config",
      "Hard",
      "PRO-079",
      "variant-1",
      "Org-wide Config rules with SSM Automation auto-remediation",
      "config-rules-auto-remediation",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-080",
    "objectiveId": "PRO-080",
    "objectiveName": "Aurora: Aurora promotion priority tiers to control failover target selection",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Aurora",
    "difficulty": "Hard",
    "type": "single",
    "question": "An e-commerce company runs an Amazon Aurora MySQL cluster with a db.r6g.8xlarge writer, one db.r6g.8xlarge replica reserved for failover, and two db.r6g.xlarge replicas that serve reporting queries. During a recent failover, Aurora promoted one of the small reporting replicas to writer, and the undersized instance could not absorb the write workload, causing a 40-minute brownout during peak trading. The company must ensure that any future automatic failover promotes the same-size replica first, must keep the reporting replicas in the cluster, and must not increase instance costs. Which solution will meet these requirements with the LEAST operational overhead?",
    "options": [
      {
        "id": "a",
        "text": "Deploy Amazon RDS Proxy in front of the cluster so that application connections are pooled and re-routed during failover events.",
        "correct": false,
        "explanation": "RDS Proxy shortens client reconnection time during failover, but it has no influence on which replica Aurora chooses to promote, so a small replica could still become the writer."
      },
      {
        "id": "b",
        "text": "Resize the two reporting replicas to db.r6g.8xlarge so that any replica Aurora promotes can absorb the write workload.",
        "correct": false,
        "explanation": "Upsizing makes every promotion safe but roughly quadruples the reporting replicas' instance cost, violating the stated requirement not to increase instance costs for what is a promotion-ordering problem."
      },
      {
        "id": "c",
        "text": "Assign failover priority tier 0 to the db.r6g.8xlarge replica and the lowest priority tier to the two reporting replicas.",
        "correct": true,
        "explanation": "Aurora promotes the healthy replica in the lowest-numbered priority tier and prefers the largest instance within a tier, so tiering guarantees the same-size replica is promoted first with a one-time configuration change."
      },
      {
        "id": "d",
        "text": "Create a CloudWatch alarm on writer failure that invokes a Lambda function to fail over to the db.r6g.8xlarge replica.",
        "correct": false,
        "explanation": "A custom alarm-and-Lambda path duplicates what Aurora's managed failover already does, reacts more slowly than the built-in mechanism, and adds code the team must maintain and test."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Set Aurora promotion priority tiers so the same-size replica is tier 0 and the reporting replicas are the lowest priority.",
    "explanation": "The constraints are deterministic promotion of the correctly sized replica, retention of the reporting replicas, and minimal operational overhead. Promotion priority tiers are the native Aurora control for failover ordering and require only configuration, whereas upsizing violates cost sense, RDS Proxy addresses connections rather than promotion choice, and custom Lambda failover adds slower, hand-rolled machinery.",
    "trigger": "Aurora promotion priority tiers to control failover target selection",
    "intentGroup": "aurora-failover-priority-tiers",
    "practiceSet": 8,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Aurora"
    ],
    "tags": [
      "Resilient Architectures",
      "Aurora",
      "Hard",
      "PRO-080",
      "variant-1",
      "Aurora promotion priority tiers to control failover target selection",
      "aurora-failover-priority-tiers",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-081",
    "objectiveId": "PRO-081",
    "objectiveName": "EventBridge: Org-wide event ingestion to a central EventBridge bus without per-account policy churn.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "EventBridge",
    "difficulty": "Hard",
    "type": "single",
    "question": "A financial services company runs 60 AWS accounts in an organization in AWS Organizations and adds several new accounts each quarter through an automated vending pipeline. The security team operates a dedicated security account with a custom Amazon EventBridge event bus that aggregates GuardDuty findings and CloudTrail-based security events from every member account. Currently, engineers manually update permissions whenever an account is added, and audits have flagged the process as error-prone. The company requires that all current and future member accounts can send events to the central bus, that no principal outside the organization can publish to it, and that no per-account changes are needed when accounts join. Which solution will meet these requirements with the LEAST operational overhead?",
    "options": [
      {
        "id": "a",
        "text": "Attach a resource-based policy to the central event bus that lists the account ID of each member account as an allowed principal for events:PutEvents, and update the list from the vending pipeline.",
        "correct": false,
        "explanation": "Enumerating account IDs works today but reintroduces per-account maintenance every time the vending pipeline creates an account, which is exactly the overhead the company wants to eliminate."
      },
      {
        "id": "b",
        "text": "Attach a resource-based policy to the central event bus that allows events:PutEvents from any AWS principal, and use EventBridge rules on the bus to discard events that did not originate from member accounts.",
        "correct": false,
        "explanation": "An open bus policy lets any AWS account publish to the bus, violating the requirement that no principal outside the organization can publish; filtering after ingestion is not least privilege."
      },
      {
        "id": "c",
        "text": "Attach a resource-based policy to the central event bus that allows events:PutEvents with a condition requiring the aws:PrincipalOrgID key to match the organization's ID.",
        "correct": true,
        "explanation": "A single bus policy conditioned on aws:PrincipalOrgID grants least-privilege PutEvents access to every current and future member account automatically, with no changes as accounts join."
      },
      {
        "id": "d",
        "text": "Create an IAM user in the security account for event forwarding, distribute scoped access keys to each member account, and configure member-account rules to publish using those credentials.",
        "correct": false,
        "explanation": "Long-lived cross-account IAM user credentials are an anti-pattern for this use case and require distributing and rotating keys per account, adding both risk and ongoing maintenance."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Add a resource-based policy on the central custom event bus that allows events:PutEvents conditioned on aws:PrincipalOrgID.",
    "explanation": "The discriminating constraints are least privilege plus zero per-account maintenance as the organization grows. Only an event bus resource policy scoped with the aws:PrincipalOrgID condition satisfies both: it admits every current and future member account while excluding all external principals. Account-ID lists require pipeline updates, and an open policy with downstream filtering fails least privilege.",
    "trigger": "Org-wide event ingestion to a central EventBridge bus without per-account policy churn.",
    "intentGroup": "eventbridge-org-bus-policy",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EventBridge"
    ],
    "tags": [
      "Secure Architectures",
      "EventBridge",
      "Hard",
      "PRO-081",
      "variant-1",
      "Org-wide event ingestion to a central EventBridge bus without per-account policy churn.",
      "eventbridge-org-bus-policy",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-082",
    "objectiveId": "PRO-082",
    "objectiveName": "Route 53: DR strategy selection when RTO/RPO numbers and budget rule out everything except warm standby plus continuous replication.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Route 53",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An ecommerce company runs a revenue-critical three-tier application in us-east-1 across three Availability Zones: an Application Load Balancer, an Auto Scaling group of EC2 instances, and an Amazon Aurora MySQL cluster holding 4 TB of order data. A new business continuity mandate requires a disaster recovery site in us-west-2 with an RTO of 15 minutes and an RPO of 5 minutes. During a regional failover, the DR site must begin serving customer traffic immediately at reduced capacity while it scales out to full size. Finance has rejected running full production capacity in both Regions. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Provision the database replication in us-west-2 but keep the application and web tiers defined only as stopped templates that are launched when a failover is declared.",
        "correct": false,
        "explanation": "This is a pilot light design; because no compute is running, the DR Region cannot absorb traffic immediately at failover and must first launch and warm the application tiers."
      },
      {
        "id": "b",
        "text": "Run a scaled-down but fully functional copy of the ALB, Auto Scaling group, and application stack in us-west-2, and fail over with Route 53 health-check-based routing.",
        "correct": true,
        "explanation": "A warm standby keeps a reduced-capacity copy of every tier running, so it can take traffic the moment Route 53 fails over and then scale out, satisfying the 15-minute RTO within budget."
      },
      {
        "id": "c",
        "text": "Run the full production stack at 100 percent capacity in both Regions and distribute live traffic between them with Route 53 latency-based routing.",
        "correct": false,
        "explanation": "Multi-site active-active would meet the RTO and RPO easily, but running full capacity in both Regions is exactly what finance has ruled out."
      },
      {
        "id": "d",
        "text": "Extend the Aurora cluster with Aurora Global Database so the us-west-2 secondary cluster receives continuous asynchronous replication and can be promoted at failover.",
        "correct": true,
        "explanation": "Aurora Global Database replicates with typical sub-second lag and supports fast promotion, which is required to meet a 5-minute RPO; periodic copies cannot."
      },
      {
        "id": "e",
        "text": "Copy automated Aurora snapshots to us-west-2 every 6 hours and restore the most recent snapshot into a new cluster when a failover is declared.",
        "correct": false,
        "explanation": "A 6-hour snapshot cadence means up to 6 hours of lost orders, far exceeding the 5-minute RPO, and a 4 TB restore alone would likely blow the 15-minute RTO."
      }
    ],
    "answers": [
      "b",
      "d"
    ],
    "correctOptionIds": [
      "b",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d"
    ],
    "answerSummary": "Run a scaled-down full stack in us-west-2 (warm standby) with Route 53 failover, and use Aurora Global Database for continuous cross-Region replication.",
    "explanation": "The constraints to weigh together are RTO 15 minutes, RPO 5 minutes, immediate traffic absorption at reduced capacity, and a budget that excludes active-active. Warm standby is the only strategy that keeps every tier running yet scaled down, and only continuous replication such as Aurora Global Database achieves a 5-minute RPO. Pilot light fails the immediate-traffic requirement and snapshot copies fail the RPO.",
    "trigger": "DR strategy selection when RTO/RPO numbers and budget rule out everything except warm standby plus continuous replication.",
    "intentGroup": "warm-standby-dr-strategy",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Route 53"
    ],
    "tags": [
      "Resilient Architectures",
      "Route 53",
      "Hard",
      "PRO-082",
      "variant-1",
      "DR strategy selection when RTO/RPO numbers and budget rule out everything except warm standby plus continuous replication.",
      "warm-standby-dr-strategy",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-083",
    "objectiveId": "PRO-083",
    "objectiveName": "S3: Large same-Region S3 upload that needs multipart parallelism, not Transfer Acceleration.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "S3",
    "difficulty": "Hard",
    "type": "single",
    "question": "A game studio's build farm runs on EC2 instances in us-east-2 and produces a 40 GB release artifact every night. A shell script uploads the artifact to an S3 bucket in the same Region; because a single PUT supports objects up to only 5 GB, the script splits the file into chunks, uploads them as separate objects, and a downstream job reassembles them. Transient network errors force the script to restart entire chunk uploads, and the nightly job frequently overruns its window. The team wants faster, resumable uploads with the LEAST change to the existing AWS CLI-based script. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Switch the script to the AWS CLI high-level s3 commands, which perform multipart uploads with parallel parts and per-part retries.",
        "correct": true,
        "explanation": "Multipart upload is the designed mechanism for objects over 5 GB; parallel parts increase throughput and only failed parts are retried, all through the CLI the script already uses."
      },
      {
        "id": "b",
        "text": "Enable S3 Transfer Acceleration on the bucket and point the script at the bucket's accelerate endpoint for the nightly upload.",
        "correct": false,
        "explanation": "Transfer Acceleration optimizes long-distance transfers over edge locations; for an upload from EC2 to a bucket in the same Region it adds cost with negligible benefit and does not make uploads resumable."
      },
      {
        "id": "c",
        "text": "Deploy an AWS DataSync agent on the build instances and schedule a nightly DataSync task that transfers the artifact from the instance file system into the S3 bucket.",
        "correct": false,
        "explanation": "DataSync can move the file reliably, but installing and operating an agent plus task scheduling is a much larger footprint than the requested minimal change to an existing CLI script."
      },
      {
        "id": "d",
        "text": "Order an AWS Snowcone device for the build site and transfer each nightly artifact by shipping the device back to AWS on a recurring cycle.",
        "correct": false,
        "explanation": "Snow family devices target offline bulk migration from bandwidth-constrained sites; round-trip shipping cannot meet a nightly cadence for a workload already inside AWS."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Switch the script to CLI-driven multipart uploads with parallel parts and per-part retry.",
    "explanation": "The constraints are the 5 GB single-PUT ceiling, resumability after transient errors, and minimal change to a CLI script. Multipart upload solves all three natively: parts stream in parallel and only failed parts retry. Transfer Acceleration is the trap for candidates who pattern-match 'faster uploads' without noticing the source is in the same Region.",
    "trigger": "Large same-Region S3 upload that needs multipart parallelism, not Transfer Acceleration.",
    "intentGroup": "s3-multipart-parallel-upload",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3"
    ],
    "tags": [
      "High-Performing Architectures",
      "S3",
      "Hard",
      "PRO-083",
      "variant-1",
      "Large same-Region S3 upload that needs multipart parallelism, not Transfer Acceleration.",
      "s3-multipart-parallel-upload",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-084",
    "objectiveId": "PRO-084",
    "objectiveName": "Cost Explorer: Mapping showback, forecast alerts, and threshold-free anomaly detection to the correct native billing tools.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Cost Explorer",
    "difficulty": "Medium",
    "type": "multiple",
    "question": "A media company runs 200 AWS accounts under a single management account, with workloads owned by 12 product teams. The finance department has three requirements: monthly showback reports that attribute spend to each product team, proactive alerts when any team's spend is forecast to exceed its monthly target before the month ends, and automatic detection of unusual spend spikes without finance having to define thresholds for every service. The company wants to use native AWS billing tools. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Activate user-defined cost allocation tags for team ownership and group spend by those tags in Cost Explorer and the Cost and Usage Report.",
        "correct": true,
        "explanation": "Activated cost allocation tags are what make per-team grouping possible in Cost Explorer and the CUR, directly enabling the showback requirement."
      },
      {
        "id": "b",
        "text": "Enable AWS Trusted Advisor cost optimization checks and distribute the check results to each team as its monthly showback statement.",
        "correct": false,
        "explanation": "Trusted Advisor surfaces savings opportunities such as idle resources; it does not attribute historical spend to teams and cannot serve as a showback report."
      },
      {
        "id": "c",
        "text": "Create AWS Budgets for each team with alerts that trigger when forecasted spend is projected to exceed the team's monthly amount.",
        "correct": true,
        "explanation": "AWS Budgets supports forecast-based alert thresholds, which fire before month end when a team is trending over target, meeting the proactive-alert requirement."
      },
      {
        "id": "d",
        "text": "Enable AWS Compute Optimizer across the organization and use its recommendations to alert teams that are trending over their monthly targets.",
        "correct": false,
        "explanation": "Compute Optimizer recommends rightsizing based on utilization metrics; it has no view of spend forecasts and cannot alert on budget trajectories."
      },
      {
        "id": "e",
        "text": "Configure AWS Cost Anomaly Detection monitors so machine learning models flag unusual spend patterns and notify finance.",
        "correct": true,
        "explanation": "Cost Anomaly Detection learns each monitor's normal spend pattern and flags deviations automatically, satisfying spike detection without manually defined thresholds."
      },
      {
        "id": "f",
        "text": "Rely on consolidated billing in the management account and divide the single monthly invoice across teams in proportion to head count.",
        "correct": false,
        "explanation": "Consolidated billing aggregates charges for payment but provides no per-team usage attribution; allocating by head count is not showback of actual spend."
      }
    ],
    "answers": [
      "a",
      "c",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "e"
    ],
    "answerSummary": "Activate cost allocation tags with Cost Explorer/CUR grouping, create forecast-alerting AWS Budgets per team, and enable Cost Anomaly Detection monitors.",
    "explanation": "Each requirement maps to a distinct native tool: cost allocation tags plus Cost Explorer/CUR deliver per-team showback, AWS Budgets forecast alerts warn before targets are breached, and Cost Anomaly Detection provides ML-based spike detection with no manual thresholds. Trusted Advisor and Compute Optimizer are optimization tools, not spend-attribution or forecasting tools.",
    "trigger": "Mapping showback, forecast alerts, and threshold-free anomaly detection to the correct native billing tools.",
    "intentGroup": "cost-governance-tooling",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Cost Explorer"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Cost Explorer",
      "Medium",
      "PRO-084",
      "variant-1",
      "Mapping showback, forecast alerts, and threshold-free anomaly detection to the correct native billing tools.",
      "cost-governance-tooling",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-085",
    "objectiveId": "PRO-085",
    "objectiveName": "RDS: Cross-account encrypted RDS snapshot sharing requires both the snapshot share and CMK key-policy access.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "RDS",
    "difficulty": "Medium",
    "type": "single",
    "question": "A healthcare analytics company stores clinical trial data in an Amazon RDS for PostgreSQL instance encrypted with a customer managed AWS KMS key. A research partner that operates its own AWS account needs a copy of the database, and the compliance team requires that the data remain encrypted end to end and never be exposed outside the two AWS accounts. The company plans to hand off a manual snapshot. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Copy the snapshot so it is encrypted with the default aws/rds AWS managed key, and share that copy with the partner account.",
        "correct": false,
        "explanation": "Snapshots encrypted with the default aws/rds AWS managed key cannot be shared with other accounts, because access to AWS managed keys cannot be granted cross-account."
      },
      {
        "id": "b",
        "text": "Export the snapshot data to an S3 bucket and send the partner a presigned URL that expires after the transfer completes.",
        "correct": false,
        "explanation": "Snapshot export produces Parquet data usable for analytics, not a restorable RDS snapshot, and a presigned URL grants bearer access outside account-scoped IAM controls."
      },
      {
        "id": "c",
        "text": "Create a copy of the snapshot with identifiable fields removed, and change the snapshot's visibility so the partner can locate and copy it without account-level sharing.",
        "correct": false,
        "explanation": "Making the snapshot findable beyond an explicit account grant exposes it outside the two accounts, violating the compliance requirement, and encrypted snapshots cannot be made public at all."
      },
      {
        "id": "d",
        "text": "Share the manual snapshot with the partner's account ID, and update the customer managed key's policy to allow the partner account to use the key for decryption.",
        "correct": true,
        "explanation": "Cross-account sharing of an encrypted snapshot requires both the snapshot share and KMS key access; with both grants the partner can copy the snapshot in its own account while data stays encrypted."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Share the snapshot with the partner account and grant that account access to the customer managed KMS key in the key policy.",
    "explanation": "Two grants must be weighed together: the snapshot share alone is useless if the partner cannot use the KMS key, and key access alone does not expose the snapshot. Because the snapshot is already encrypted with a customer managed key, sharing plus a key policy update is sufficient; a default aws/rds key would have blocked sharing entirely.",
    "trigger": "Cross-account encrypted RDS snapshot sharing requires both the snapshot share and CMK key-policy access.",
    "intentGroup": "share-encrypted-snapshot-cross-account",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "RDS"
    ],
    "tags": [
      "Secure Architectures",
      "RDS",
      "Medium",
      "PRO-085",
      "variant-1",
      "Cross-account encrypted RDS snapshot sharing requires both the snapshot share and CMK key-policy access.",
      "share-encrypted-snapshot-cross-account",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-086",
    "objectiveId": "PRO-086",
    "objectiveName": "ECS: Combining ECS circuit breaker rollback with deployment percentage settings to keep capacity during safe rollouts.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "ECS",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A logistics company runs its shipment-tracking API as an Amazon ECS service on Fargate behind an Application Load Balancer, with 12 tasks across three Availability Zones. The service uses rolling updates, and twice in the past quarter a defective container image was rolled out to 100 percent of tasks before health check failures surfaced, causing a full outage until engineers manually redeployed the previous image. The company requires that failing deployments stop and revert without human intervention and that the service always retains full healthy serving capacity while an update is in progress. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Enable the ECS deployment circuit breaker on the service with the automatic rollback option turned on.",
        "correct": true,
        "explanation": "The deployment circuit breaker detects a deployment that cannot reach a steady state and, with rollback enabled, reverts to the last working task set with no human intervention."
      },
      {
        "id": "b",
        "text": "Change the service's scheduling strategy to DAEMON so that exactly one task runs on each container instance during updates.",
        "correct": false,
        "explanation": "DAEMON scheduling controls task placement density and does not apply to Fargate services; it provides no protection against a bad image reaching all tasks."
      },
      {
        "id": "c",
        "text": "Add a second Application Load Balancer, deploy new task versions behind it, and shift traffic across after engineers verify the release.",
        "correct": false,
        "explanation": "A parallel ALB with manual traffic shifting can gate releases, but it depends on engineer verification, which violates the requirement to stop and revert bad deployments automatically."
      },
      {
        "id": "d",
        "text": "Use ECS Exec to run health probes inside each new task after every deployment and roll back if the probes report failures.",
        "correct": false,
        "explanation": "ECS Exec probes are a manual, post-deployment inspection step; they neither halt an in-progress rollout nor guarantee capacity is preserved while tasks are replaced."
      },
      {
        "id": "e",
        "text": "Set the service's minimumHealthyPercent to 100 and maximumPercent to 200 so replacement tasks must be healthy before old tasks are drained.",
        "correct": true,
        "explanation": "With minimumHealthyPercent at 100 and headroom from maximumPercent 200, ECS keeps the full healthy task count serving traffic while new tasks start, preserving capacity during every rollout."
      }
    ],
    "answers": [
      "a",
      "e"
    ],
    "correctOptionIds": [
      "a",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "e"
    ],
    "answerSummary": "Enable the deployment circuit breaker with automatic rollback, and set minimumHealthyPercent 100 with maximumPercent 200.",
    "explanation": "Two independent constraints must both be satisfied: automatic detection-and-revert of bad deployments, and uninterrupted healthy capacity during rollouts. The circuit breaker with rollback handles the first, and the minimumHealthyPercent/maximumPercent pair handles the second. Manual gates such as ECS Exec probes or a second ALB fail the no-human-intervention requirement.",
    "trigger": "Combining ECS circuit breaker rollback with deployment percentage settings to keep capacity during safe rollouts.",
    "intentGroup": "ecs-deployment-safety",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "ECS"
    ],
    "tags": [
      "Resilient Architectures",
      "ECS",
      "Hard",
      "PRO-086",
      "variant-1",
      "Combining ECS circuit breaker rollback with deployment percentage settings to keep capacity during safe rollouts.",
      "ecs-deployment-safety",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-087",
    "objectiveId": "PRO-087",
    "objectiveName": "DynamoDB: Hot partition key throttling that capacity-mode or WCU changes cannot fix; only write sharding can.",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "DynamoDB",
    "difficulty": "Hard",
    "type": "single",
    "question": "An industrial IoT platform writes sensor readings to a DynamoDB table with device_id as the partition key and a timestamp as the sort key. The fleet has 40,000 devices, but 5 high-volume gateway devices aggregate readings from entire factories and generate about 80 percent of all writes. The application receives ProvisionedThroughputExceededException errors on writes for those gateways even though CloudWatch shows table-level consumed capacity well below the provisioned amount. The team has already confirmed that adaptive capacity is active. Which solution will resolve the throttling MOST effectively?",
    "options": [
      {
        "id": "a",
        "text": "Switch the table to on-demand capacity mode so DynamoDB scales throughput automatically with the write traffic.",
        "correct": false,
        "explanation": "On-demand mode removes table-level provisioning decisions, but each partition key value is still bounded by the per-partition limit of 1,000 WCU, so the five hot gateways keep throttling."
      },
      {
        "id": "b",
        "text": "Append a calculated shard suffix to the gateway devices' partition key values, and merge the shards at read time.",
        "correct": true,
        "explanation": "Write sharding spreads each hot gateway's items across many partition key values and therefore many partitions, which is the only way to exceed the fixed per-key throughput ceiling."
      },
      {
        "id": "c",
        "text": "Create a global secondary index with the timestamp attribute as its partition key to spread the write load across index partitions.",
        "correct": false,
        "explanation": "A GSI adds a second, differently keyed copy of the data but does not change how base-table writes are distributed; the base table's hot device_id partitions still throttle."
      },
      {
        "id": "d",
        "text": "Increase the provisioned write capacity units on the table until the throttling errors for the gateway devices stop.",
        "correct": false,
        "explanation": "Table-level metrics already show unused capacity; adding more spreads extra WCU across partitions but cannot lift the 1,000 WCU cap that a single partition key value can consume."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Add high-cardinality write sharding to the partition key for the hot gateway devices and aggregate the shards on read.",
    "explanation": "The signature to recognize is throttling with underutilized table capacity: a per-partition-key limit, not a provisioning problem. Neither on-demand mode, more WCU, nor adaptive capacity can push a single key past roughly 1,000 WCU, so only a key redesign that shards writes across suffixed key values resolves it. The cost is aggregation logic at read time, which the scenario can tolerate.",
    "trigger": "Hot partition key throttling that capacity-mode or WCU changes cannot fix; only write sharding can.",
    "intentGroup": "dynamodb-hot-partition-key-design",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "DynamoDB"
    ],
    "tags": [
      "High-Performing Architectures",
      "DynamoDB",
      "Hard",
      "PRO-087",
      "variant-1",
      "Hot partition key throttling that capacity-mode or WCU changes cannot fix; only write sharding can.",
      "dynamodb-hot-partition-key-design",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-088",
    "objectiveId": "PRO-088",
    "objectiveName": "S3 Glacier: Small-object archives need aggregation before Deep Archive; overhead and request fees dominate at billions of objects.",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "S3 Glacier",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A genomics company keeps 2 billion sequencing result files, averaging 40 KB each, in S3 Standard, plus millions of small index files that pipelines list and read daily. To cut storage costs, the team added a lifecycle rule transitioning everything to S3 Glacier Deep Archive. The next bill was higher than projected: each archived object carries about 32 KB of Glacier metadata overhead plus 8 KB billed at Standard rates, and the lifecycle transition requests for billions of objects added a large one-time charge. The retention policy requires the raw files to be kept for 10 years and retrieved only for rare audits. Which combination of steps should a solutions architect take to reduce costs? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Move the entire data set, including the index files, to S3 One Zone-Infrequent Access to avoid Glacier metadata overhead.",
        "correct": false,
        "explanation": "One Zone-IA removes the archive overhead but stores 10-year compliance data in a single AZ at a much higher per-GB rate than Deep Archive, failing both durability posture and cost goals."
      },
      {
        "id": "b",
        "text": "Aggregate the small result files into large bundles, such as tar or Parquet archives, before any transition to Glacier Deep Archive.",
        "correct": true,
        "explanation": "Bundling turns billions of 40 KB objects into far fewer multi-GB objects, so the fixed roughly 40 KB per-object overhead becomes negligible relative to object size."
      },
      {
        "id": "c",
        "text": "Enable S3 Intelligent-Tiering on the bucket so objects smaller than 128 KB are moved to its archive tiers automatically.",
        "correct": false,
        "explanation": "Intelligent-Tiering does not monitor or auto-tier objects smaller than 128 KB; they simply remain in the Frequent Access tier, so this does nothing for 40 KB files."
      },
      {
        "id": "d",
        "text": "Transition only the aggregated bundle objects, driving the archival with lifecycle rules or S3 Batch Operations over the much smaller object count.",
        "correct": true,
        "explanation": "Because transition charges are per request, archiving thousands of bundles instead of 2 billion individual objects reduces the one-time transition cost by orders of magnitude."
      },
      {
        "id": "e",
        "text": "Enable Requester Pays on the bucket so audit teams retrieving files absorb the retrieval and request charges.",
        "correct": false,
        "explanation": "Requester Pays shifts request and transfer charges for cross-account access; it does not reduce the company's own storage overhead or transition costs at all."
      },
      {
        "id": "f",
        "text": "Keep the small, frequently listed index files in S3 Standard or Standard-IA instead of transitioning them to Glacier Deep Archive.",
        "correct": true,
        "explanation": "The index files are read daily; archiving them would add per-object overhead plus retrieval latency and fees, so a hot tier is cheaper and operationally correct for them."
      }
    ],
    "answers": [
      "b",
      "d",
      "f"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "f"
    ],
    "answerSummary": "Bundle the small files into large archives before transition, archive only the aggregated objects to cut request charges, and keep the hot index files out of Deep Archive.",
    "explanation": "The cost drivers to weigh are fixed per-object metadata overhead (about 40 KB per archived object), per-request transition fees at billion-object scale, and access frequency. Aggregation attacks the overhead, transitioning fewer large objects attacks the request fees, and keeping daily-accessed indexes in a hot tier respects the access pattern. Intelligent-Tiering is the trap because sub-128 KB objects are never auto-tiered.",
    "trigger": "Small-object archives need aggregation before Deep Archive; overhead and request fees dominate at billions of objects.",
    "intentGroup": "glacier-small-object-overhead",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "S3 Glacier"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "S3 Glacier",
      "Hard",
      "PRO-088",
      "variant-1",
      "Small-object archives need aggregation before Deep Archive; overhead and request fees dominate at billions of objects.",
      "glacier-small-object-overhead",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-089",
    "objectiveId": "PRO-089",
    "objectiveName": "PrivateLink: Exposing one service to many customer VPCs with overlapping CIDRs points to PrivateLink with principal allowlisting.",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "PrivateLink",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A SaaS provider hosts a REST API for supply chain analytics on EC2 instances in private subnets across three Availability Zones. Several hundred enterprise customers, each with their own AWS accounts and VPCs, must call the API over private connectivity. Many customer VPCs use CIDR ranges that overlap with the provider's 10.0.0.0/16 network, customers must never gain routed access to any of the provider's other resources, and the provider must approve exactly which customers can connect. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Establish a VPC peering connection from the provider's VPC to each customer VPC and restrict traffic with security group references.",
        "correct": false,
        "explanation": "Peering is non-transitive point-to-point network routing: it cannot be established between VPCs with overlapping CIDRs and exposes the provider's address space rather than a single service."
      },
      {
        "id": "b",
        "text": "Attach the provider VPC to a transit gateway and use AWS Resource Access Manager to share the transit gateway with each customer account.",
        "correct": false,
        "explanation": "A shared transit gateway routes between whole networks, so overlapping customer CIDRs collide in the route tables and customers gain broader network reachability than the single API."
      },
      {
        "id": "c",
        "text": "Create an AWS PrivateLink endpoint service in the provider account, fronted by a Network Load Balancer that targets the API instances.",
        "correct": true,
        "explanation": "PrivateLink exposes only the NLB-fronted service as an interface endpoint in each customer VPC, with no route table integration, so overlapping CIDRs are irrelevant and nothing else is reachable."
      },
      {
        "id": "d",
        "text": "Publish the API through a public endpoint protected by a resource policy that allows only each customer's registered IP address ranges.",
        "correct": false,
        "explanation": "An IP-allowlisted public endpoint still traverses the public internet, which fails the private connectivity requirement, and hundreds of customer IP ranges are brittle to maintain."
      },
      {
        "id": "e",
        "text": "Configure the endpoint service to require acceptance and add each approved customer's account or role ARNs to its allowed principals list.",
        "correct": true,
        "explanation": "Allowed principals plus manual acceptance give the provider explicit, per-customer control over who can create endpoints to the service, meeting the approval requirement."
      }
    ],
    "answers": [
      "c",
      "e"
    ],
    "correctOptionIds": [
      "c",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "e"
    ],
    "answerSummary": "Create a PrivateLink endpoint service fronted by an NLB, and control access with allowed principals plus connection acceptance.",
    "explanation": "Three constraints interlock: overlapping CIDRs eliminate any routed solution (peering, transit gateway), least exposure demands a single-service surface rather than network reachability, and per-customer approval requires the endpoint service's allowed-principals and acceptance controls. PrivateLink is the only option that satisfies all three at hundreds-of-customers scale.",
    "trigger": "Exposing one service to many customer VPCs with overlapping CIDRs points to PrivateLink with principal allowlisting.",
    "intentGroup": "privatelink-service-exposure",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "PrivateLink"
    ],
    "tags": [
      "Secure Architectures",
      "PrivateLink",
      "Hard",
      "PRO-089",
      "variant-1",
      "Exposing one service to many customer VPCs with overlapping CIDRs points to PrivateLink with principal allowlisting.",
      "privatelink-service-exposure",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-090",
    "objectiveId": "PRO-090",
    "objectiveName": "Amazon MQ: Lift a self-managed AMQP broker to managed multi-AZ with Amazon MQ cluster mode, not a protocol rewrite.",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Amazon MQ",
    "difficulty": "Medium",
    "type": "single",
    "question": "A retail company processes orders through a RabbitMQ broker that runs on a single EC2 instance in one Availability Zone. Several internal applications publish and consume with the AMQP 0-9-1 protocol, and a recent AZ disruption halted order processing for four hours. The company requires the messaging layer to be highly available across multiple Availability Zones, wants to avoid rewriting the applications' messaging code, and wants to stop patching and maintaining broker software. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Run RabbitMQ on EC2 instances in an Auto Scaling group that spans three Availability Zones behind a Network Load Balancer.",
        "correct": false,
        "explanation": "An ASG replaces failed instances but leaves quorum configuration, queue mirroring, state recovery, and broker patching entirely on the team, missing the no-maintenance requirement."
      },
      {
        "id": "b",
        "text": "Migrate the queues to an Amazon MQ for RabbitMQ single-instance broker so AWS manages the broker software and patching.",
        "correct": false,
        "explanation": "A single-instance Amazon MQ broker removes the patching burden but runs in one AZ, so it fails the multi-AZ high availability requirement that triggered the migration."
      },
      {
        "id": "c",
        "text": "Replace the RabbitMQ broker with Amazon SQS queues and Amazon SNS topics for the publish and consume paths.",
        "correct": false,
        "explanation": "SQS and SNS are highly available and fully managed, but they do not speak AMQP 0-9-1, forcing a messaging-code rewrite across every application, which violates the minimal-change constraint."
      },
      {
        "id": "d",
        "text": "Migrate the queues to an Amazon MQ for RabbitMQ cluster deployment that spans multiple Availability Zones.",
        "correct": true,
        "explanation": "An Amazon MQ RabbitMQ cluster deployment runs broker nodes across multiple AZs, keeps native AMQP compatibility so applications largely reconnect via a new endpoint, and AWS handles patching."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Migrate to an Amazon MQ for RabbitMQ cluster (multi-AZ) deployment.",
    "explanation": "Three constraints must hold at once: multi-AZ availability, protocol compatibility so application code barely changes, and no broker maintenance. Only the Amazon MQ for RabbitMQ cluster deployment satisfies all three; the single-instance broker fails availability, self-managed EC2 fails the maintenance goal, and SQS/SNS fails protocol compatibility.",
    "trigger": "Lift a self-managed AMQP broker to managed multi-AZ with Amazon MQ cluster mode, not a protocol rewrite.",
    "intentGroup": "amazon-mq-rabbitmq-cluster",
    "practiceSet": 9,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Amazon MQ"
    ],
    "tags": [
      "Resilient Architectures",
      "Amazon MQ",
      "Medium",
      "PRO-090",
      "variant-1",
      "Lift a self-managed AMQP broker to managed multi-AZ with Amazon MQ cluster mode, not a protocol rewrite.",
      "amazon-mq-rabbitmq-cluster",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-091",
    "objectiveId": "PRO-091",
    "objectiveName": "CloudTrail: Org-wide tamper-proof API audit trail owned by a delegated-admin security account",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "CloudTrail",
    "difficulty": "Hard",
    "type": "single",
    "question": "A financial services company runs an AWS Organizations organization with 60 member accounts and adds roughly 5 new accounts each quarter. The security team operates from its own dedicated account and must maintain a complete record of all API activity across every existing and future account for a 7-year compliance retention period. Member-account administrators have broad IAM permissions in their own accounts, and the compliance policy states that no member-account administrator may be able to stop, modify, or delete the logging configuration. The security team wants to manage the solution without involving the organization's management account for day-to-day operations. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create a trail in each member account with an SCP that mandates its creation, and use S3 replication rules to copy each account's log objects into a bucket in the security account.",
        "correct": false,
        "explanation": "Per-account trails are owned by the member accounts, so local administrators with broad IAM permissions can still stop or reconfigure their own trail before replication ever occurs, and every new account requires provisioning work."
      },
      {
        "id": "b",
        "text": "Configure each member account to stream CloudTrail management events to CloudWatch Logs, and create cross-account subscription filters that forward the log groups to a Kinesis stream in the security account.",
        "correct": false,
        "explanation": "Cross-account subscriptions centralize copies of events, but the source trails and log groups remain under member-account control, so local administrators can disable the pipeline, and new accounts need manual onboarding."
      },
      {
        "id": "c",
        "text": "Register the security account as the delegated administrator for CloudTrail, and create an organization trail from that account that delivers logs to a central S3 bucket with a restrictive bucket policy.",
        "correct": true,
        "explanation": "An organization trail automatically covers all current and future accounts, member-account administrators cannot stop or alter it, and delegated administration lets the security team manage it without using the management account."
      },
      {
        "id": "d",
        "text": "Deploy an AWS Config aggregator in the security account with the organization as the source, and authorize aggregation from all member accounts to collect activity into the security account.",
        "correct": false,
        "explanation": "A Config aggregator centralizes resource configuration and compliance state, not a record of API calls, so it cannot satisfy the requirement for a complete API activity trail."
      }
    ],
    "answers": [
      "c"
    ],
    "correctOptionIds": [
      "c"
    ],
    "sourceCorrectOptionIds": [
      "c"
    ],
    "answerSummary": "Create an organization trail managed from the security account registered as the CloudTrail delegated administrator, logging to a central restricted S3 bucket.",
    "explanation": "The discriminating constraints are automatic coverage of future accounts, immunity from member-account administrators, and keeping day-to-day management out of the management account. Only an organization trail owned at the organization level satisfies the first two, and CloudTrail delegated administration satisfies the third. Replication and subscription designs leave the source logging under member control, and Config records configuration state rather than API activity.",
    "trigger": "Org-wide tamper-proof API audit trail owned by a delegated-admin security account",
    "intentGroup": "org-trail-delegated-admin",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "CloudTrail"
    ],
    "tags": [
      "Secure Architectures",
      "CloudTrail",
      "Hard",
      "PRO-091",
      "variant-1",
      "Org-wide tamper-proof API audit trail owned by a delegated-admin security account",
      "org-trail-delegated-admin",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-092",
    "objectiveId": "PRO-092",
    "objectiveName": "EC2 Auto Scaling: Diagnose ASG ignoring ELB health checks plus a suspended-AZRebalance zone imbalance",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "EC2 Auto Scaling",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A company serves a web application from an Auto Scaling group of EC2 instances behind an Application Load Balancer across three Availability Zones. During a recent incident, the application process on several instances hung: the ALB target group marked the targets unhealthy and users received HTTP 502 errors, yet the Auto Scaling group never terminated or replaced the affected instances because the operating systems were still running. Separately, after a scale-in event the group was left with 4 instances in one Availability Zone and 1 in another for several hours. A solutions architect must ensure that application-level failures trigger instance replacement and that capacity stays evenly spread across Availability Zones. Which combination of changes will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Reduce the ALB health check interval to 5 seconds and lower the unhealthy threshold to 2 so that failing targets are detected faster.",
        "correct": false,
        "explanation": "The ALB already detected the failures and marked the targets unhealthy; faster detection changes nothing because the Auto Scaling group is still evaluating only EC2 status checks and never acts on the ALB result."
      },
      {
        "id": "b",
        "text": "Change the Auto Scaling group health check type to ELB and set a health check grace period that covers application startup time.",
        "correct": true,
        "explanation": "With the ELB health check type, the group treats targets that fail ALB health checks as unhealthy and replaces them, and the grace period prevents new instances from being cycled before the application finishes booting."
      },
      {
        "id": "c",
        "text": "Enable Capacity Rebalancing on the Auto Scaling group so that it proactively launches replacement instances when capacity becomes imbalanced.",
        "correct": false,
        "explanation": "Capacity Rebalancing responds to Spot Instance rebalance recommendations and interruption notices; it does not replace instances that fail load balancer health checks and does not equalize instance counts across Availability Zones."
      },
      {
        "id": "d",
        "text": "Verify that the AZRebalance process is not suspended on the group, and resume it if it is, so instances are redistributed evenly across the Availability Zones.",
        "correct": true,
        "explanation": "Availability Zone rebalancing is the mechanism that launches and terminates instances to even out a 4-to-1 skew; if the AZRebalance process has been suspended, the group will remain unbalanced indefinitely."
      },
      {
        "id": "e",
        "text": "Suspend the Terminate process on the Auto Scaling group so that healthy instances are never removed from Availability Zones during scale-in events.",
        "correct": false,
        "explanation": "Suspending Terminate prevents the group from ever removing instances, which blocks both scale-in and the replacement of unhealthy instances, making both reported problems worse rather than fixing them."
      }
    ],
    "answers": [
      "b",
      "d"
    ],
    "correctOptionIds": [
      "b",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d"
    ],
    "answerSummary": "Switch the ASG health check type to ELB with an appropriate grace period, and ensure the AZRebalance process is active so the group redistributes instances across AZs.",
    "explanation": "Two independent behaviors must be diagnosed together: the group ignored ALB health results because its health check type was EC2, and the lingering 4-to-1 zone skew indicates Availability Zone rebalancing is not operating. The ELB health check type fixes replacement of application-level failures, and an active AZRebalance process fixes the distribution. Faster ALB probing, Capacity Rebalancing (a Spot feature), and suspending Terminate each address a different problem than the ones described.",
    "trigger": "Diagnose ASG ignoring ELB health checks plus a suspended-AZRebalance zone imbalance",
    "intentGroup": "asg-health-check-diagnosis",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EC2 Auto Scaling"
    ],
    "tags": [
      "Resilient Architectures",
      "EC2 Auto Scaling",
      "Hard",
      "PRO-092",
      "variant-1",
      "Diagnose ASG ignoring ELB health checks plus a suspended-AZRebalance zone imbalance",
      "asg-health-check-diagnosis",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-093",
    "objectiveId": "PRO-093",
    "objectiveName": "CloudFront: Pick CloudFront Functions over Lambda@Edge for cheap sub-ms viewer-request cache-key normalization",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "CloudFront",
    "difficulty": "Hard",
    "type": "single",
    "question": "A media company serves a content site through Amazon CloudFront that receives more than 400 million viewer requests per day. Client applications send inconsistent query string ordering, mixed-case header values, and legacy URL paths, which fragments the cache key and drives the cache hit ratio below 60 percent. The team needs to normalize headers and rewrite URLs on every incoming request before the cache lookup occurs, the logic requires no network calls or access to the request body, and per-request latency must stay well under one millisecond. The company wants the lowest possible cost for this processing volume. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Deploy a CloudFront function on the viewer request event to normalize the headers and rewrite the URLs.",
        "correct": true,
        "explanation": "CloudFront Functions execute in sub-millisecond time at every edge location, run before the cache lookup on viewer request, and cost roughly one-sixth of Lambda@Edge, making them the right fit for lightweight, high-volume rewrites."
      },
      {
        "id": "b",
        "text": "Deploy a Lambda@Edge function on the viewer request event to normalize the headers and rewrite the URLs.",
        "correct": false,
        "explanation": "Lambda@Edge on viewer request would run at the correct point in the flow, but it carries millisecond-scale execution overhead and significantly higher per-request pricing, which violates the latency and lowest-cost constraints at this volume."
      },
      {
        "id": "c",
        "text": "Deploy a Lambda@Edge function on the origin request event to normalize the headers and rewrite the URLs.",
        "correct": false,
        "explanation": "Origin request triggers fire only on cache misses, after the cache key has already been computed from the un-normalized request, so the cache fragmentation problem would remain unsolved."
      },
      {
        "id": "d",
        "text": "Configure listener rules on the Application Load Balancer origin to normalize the headers and redirect the legacy URL paths.",
        "correct": false,
        "explanation": "The ALB sits behind CloudFront and only sees requests that miss the cache, so rewriting there cannot influence the CloudFront cache key or improve the hit ratio."
      }
    ],
    "answers": [
      "a"
    ],
    "correctOptionIds": [
      "a"
    ],
    "sourceCorrectOptionIds": [
      "a"
    ],
    "answerSummary": "Use a CloudFront function on the viewer request event.",
    "explanation": "The discriminators are where the logic runs relative to the cache lookup and the cost profile at hundreds of millions of requests. Only viewer-request processing can fix cache-key fragmentation, which eliminates the origin-request and ALB options, and between the two viewer-request choices, CloudFront Functions win on both sub-millisecond latency and price for simple, network-free transformations.",
    "trigger": "Pick CloudFront Functions over Lambda@Edge for cheap sub-ms viewer-request cache-key normalization",
    "intentGroup": "cloudfront-functions-vs-lambda-edge",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "CloudFront"
    ],
    "tags": [
      "High-Performing Architectures",
      "CloudFront",
      "Hard",
      "PRO-093",
      "variant-1",
      "Pick CloudFront Functions over Lambda@Edge for cheap sub-ms viewer-request cache-key normalization",
      "cloudfront-functions-vs-lambda-edge",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-094",
    "objectiveId": "PRO-094",
    "objectiveName": "Storage Gateway: Retire physical tape vaulting with Tape Gateway VTL plus Deep Archive pool while keeping backup software",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Storage Gateway",
    "difficulty": "Medium",
    "type": "multiple",
    "question": "A healthcare company backs up 30 TB per week from an on-premises data center using commercial backup software that writes to a physical tape library over iSCSI. Completed tapes are couriered to a third-party vault under a contract costing 180,000 dollars per year, and regulations require the backups to be retained for 10 years but restored only rarely. The company wants to eliminate physical tape handling and the vaulting contract without replacing its backup software or retraining operators, and it wants the lowest possible storage cost for the long-term copies. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Deploy an AWS Storage Gateway Tape Gateway on premises and present its virtual tape library to the existing backup software over iSCSI.",
        "correct": true,
        "explanation": "Tape Gateway emulates an iSCSI tape library, so the existing backup software continues to write tapes exactly as it does today, satisfying the no-workflow-change constraint."
      },
      {
        "id": "b",
        "text": "Deploy AWS DataSync agents on premises and schedule weekly transfers of the backup files to an Amazon EFS file system.",
        "correct": false,
        "explanation": "DataSync moves files rather than emulating a tape library, which forces a change to the backup workflow, and EFS is one of the most expensive targets for cold 10-year retention data."
      },
      {
        "id": "c",
        "text": "Configure the gateway so that virtual tapes ejected by the backup software are archived to the S3 Glacier Deep Archive storage pool.",
        "correct": true,
        "explanation": "Archiving ejected tapes to the Deep Archive pool places the rarely restored 10-year copies in the lowest-cost AWS storage class, directly meeting the cost requirement."
      },
      {
        "id": "d",
        "text": "Migrate the backup jobs to AWS Backup with a 10-year retention vault and decommission the commercial backup software.",
        "correct": false,
        "explanation": "AWS Backup could enforce the retention period, but replacing the commercial backup software violates the explicit requirement to keep the existing tooling and operator workflow."
      },
      {
        "id": "e",
        "text": "Order an AWS Snowball Edge device each month, copy the completed tapes' contents to it, and ship it to AWS for import into Amazon S3.",
        "correct": false,
        "explanation": "Monthly Snowball shipments recreate the physical logistics the company is trying to eliminate and add recurring device fees, so this fails both the no-tape-handling goal and cost efficiency."
      },
      {
        "id": "f",
        "text": "Define tape retention and ejection policies in the backup software that replace the off-site vaulting process, and terminate the courier and vaulting contract.",
        "correct": true,
        "explanation": "Using the software's existing eject workflow to trigger archival replaces the courier-and-vault process operationally, which is what allows the 180,000-dollar annual contract to be retired."
      }
    ],
    "answers": [
      "a",
      "c",
      "f"
    ],
    "correctOptionIds": [
      "a",
      "c",
      "f"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c",
      "f"
    ],
    "answerSummary": "Deploy a Tape Gateway VTL for the existing backup software, archive ejected virtual tapes to S3 Glacier Deep Archive, and replace the vaulting contract with tape retention/ejection policies.",
    "explanation": "The binding constraints are keeping the iSCSI tape workflow intact, achieving the lowest storage cost for rarely restored 10-year data, and eliminating physical logistics. Tape Gateway preserves the workflow, the Deep Archive pool minimizes storage cost, and policy-driven ejection is what operationally replaces the vaulting contract. DataSync-to-EFS and AWS Backup both break the workflow constraint, and monthly Snowballs reintroduce shipping.",
    "trigger": "Retire physical tape vaulting with Tape Gateway VTL plus Deep Archive pool while keeping backup software",
    "intentGroup": "tape-gateway-vtl",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Storage Gateway"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Storage Gateway",
      "Medium",
      "PRO-094",
      "variant-1",
      "Retire physical tape vaulting with Tape Gateway VTL plus Deep Archive pool while keeping backup software",
      "tape-gateway-vtl",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-095",
    "objectiveId": "PRO-095",
    "objectiveName": "AWS RAM: Centrally owned subnets consumed by app accounts via AWS RAM VPC sharing",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "AWS RAM",
    "difficulty": "Medium",
    "type": "single",
    "question": "An enterprise is restructuring its AWS Organizations environment so that a central networking account owns all VPCs, subnets, route tables, NAT gateways, and interface endpoints, while 25 application accounts deploy their own EC2 instances and RDS databases. The networking team must retain exclusive control over IP address management and routing changes, and application teams must not be able to create or modify any network infrastructure. At the same time, application workloads must launch directly into the centrally managed subnets rather than into networks the application teams administer. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create a VPC in each application account and establish VPC peering connections to the central networking account's VPC.",
        "correct": false,
        "explanation": "Peering provides connectivity between separately owned VPCs, but each application team would still own and administer its own VPC, routing, and IP space, violating the central-ownership requirement."
      },
      {
        "id": "b",
        "text": "Deploy a transit gateway in the networking account and share it so each application account attaches its own VPC to the transit gateway.",
        "correct": false,
        "explanation": "A shared transit gateway centralizes inter-VPC routing, but application accounts still create and manage their own VPCs and subnets, so workloads never launch into networks the central team owns."
      },
      {
        "id": "c",
        "text": "Use CloudFormation StackSets from the networking account to provision an identical VPC and subnet layout into every application account.",
        "correct": false,
        "explanation": "StackSets replicate a template, but the deployed VPCs become resources inside each application account where local administrators can drift or modify them, so exclusive central control is not achieved."
      },
      {
        "id": "d",
        "text": "Share the subnets from the networking account's VPCs to the application accounts by using AWS Resource Access Manager.",
        "correct": true,
        "explanation": "VPC sharing through AWS RAM lets participant accounts launch EC2 and RDS resources directly into subnets that the networking account owns, while route tables, IP management, and network configuration remain exclusively with the owner account."
      }
    ],
    "answers": [
      "d"
    ],
    "correctOptionIds": [
      "d"
    ],
    "sourceCorrectOptionIds": [
      "d"
    ],
    "answerSummary": "Share the centrally owned subnets to the application accounts with AWS RAM (VPC sharing).",
    "explanation": "The requirement pairs central ownership of all network constructs with application workloads landing inside those exact subnets, which is precisely the VPC sharing model via AWS RAM. Peering and transit gateway designs only connect separately owned networks, and StackSets copy infrastructure into accounts where it can be modified locally.",
    "trigger": "Centrally owned subnets consumed by app accounts via AWS RAM VPC sharing",
    "intentGroup": "ram-shared-subnets",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "AWS RAM"
    ],
    "tags": [
      "Secure Architectures",
      "AWS RAM",
      "Medium",
      "PRO-095",
      "variant-1",
      "Centrally owned subnets consumed by app accounts via AWS RAM VPC sharing",
      "ram-shared-subnets",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-096",
    "objectiveId": "PRO-096",
    "objectiveName": "Kinesis Data Streams: Replay a corrupted 24h window via Kinesis extended retention plus a timestamp-reset consumer",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "Kinesis Data Streams",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An ad-tech company ingests clickstream events into an Amazon Kinesis data stream that currently uses the default 24-hour retention period. Four independent consumer applications read the stream: three feed live dashboards and alerting, and one writes enriched records to a data warehouse. A deployment bug in the warehouse consumer corrupted the last 24 hours of its output, and the team must reprocess that window while the three live consumers continue reading without interruption. Going forward, the company requires the ability to replay up to 7 days of events after any future incident. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Migrate the pipeline to an Amazon SQS standard queue and subscribe each consumer application to poll messages from the queue.",
        "correct": false,
        "explanation": "SQS deletes messages once a consumer processes them, so a single queue cannot serve four independent readers, and there is no way to replay data that has already been consumed."
      },
      {
        "id": "b",
        "text": "Replace the stream with an Amazon Data Firehose delivery stream that batches all events into Amazon S3 for the consumers to read.",
        "correct": false,
        "explanation": "Firehose is a batch delivery service with buffering measured in seconds to minutes and no consumer checkpointing model, so it cannot support the three low-latency live consumers reading in parallel."
      },
      {
        "id": "c",
        "text": "Increase the stream's retention period to 168 hours so events remain available for replay after future incidents.",
        "correct": true,
        "explanation": "Raising retention to 7 days keeps records in the stream well beyond the default 24 hours, which is exactly what enables the required replay window after any future corruption event."
      },
      {
        "id": "d",
        "text": "Reset the warehouse consumer to read from the stream starting at the timestamp when the corruption began, leaving the other consumers' checkpoints untouched.",
        "correct": true,
        "explanation": "Kinesis lets each consumer maintain an independent iterator position, so restarting the warehouse application with an AT_TIMESTAMP position replays the corrupted window without disturbing the three live consumers."
      },
      {
        "id": "e",
        "text": "Publish the events to an Amazon SNS topic and fan them out to a separate SQS queue for each of the four consumer applications.",
        "correct": false,
        "explanation": "SNS fanout gives each consumer its own copy going forward, but SNS retains nothing after delivery, so neither the current 24-hour reprocessing nor future 7-day replays are possible."
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "correctOptionIds": [
      "c",
      "d"
    ],
    "sourceCorrectOptionIds": [
      "c",
      "d"
    ],
    "answerSummary": "Raise the Kinesis stream retention to 7 days, and reset the warehouse consumer to read from the corruption-window timestamp while other consumers keep their own checkpoints.",
    "explanation": "The scenario demands two properties at once: multiple independent consumers with per-consumer read positions, and the ability to re-read a historical window. Kinesis provides both through extended retention and timestamp-based iterators, while SQS, Firehose, and SNS each lose either the replay capability or the independent live consumers.",
    "trigger": "Replay a corrupted 24h window via Kinesis extended retention plus a timestamp-reset consumer",
    "intentGroup": "kinesis-replay-multi-consumer",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Kinesis Data Streams"
    ],
    "tags": [
      "Resilient Architectures",
      "Kinesis Data Streams",
      "Hard",
      "PRO-096",
      "variant-1",
      "Replay a corrupted 24h window via Kinesis extended retention plus a timestamp-reset consumer",
      "kinesis-replay-multi-consumer",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-097",
    "objectiveId": "PRO-097",
    "objectiveName": "EBS: Hit gp2's 250 MB/s ceiling and fix it with gp3 provisioned throughput",
    "variant": 1,
    "domain": "High-Performing Architectures",
    "sourceDomain": "High-Performing Architectures",
    "service": "EBS",
    "difficulty": "Hard",
    "type": "single",
    "question": "An analytics team runs a nightly ETL job on a memory-optimized EC2 instance that scans multi-gigabyte columnar files with large sequential reads from an 800 GB gp2 volume, which also serves as the boot volume and holds an index database that receives small random reads during the job. CloudWatch shows VolumeReadBytes plateauing at about 250 MB/s while consumed IOPS stay far below the volume's baseline, and the instance's EBS-optimized bandwidth is confirmed not to be the bottleneck. The job now overruns its batch window, and the team must roughly triple read throughput at the lowest cost without changing the instance or re-architecting storage onto multiple volumes. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Increase the gp2 volume size to 3,000 GB so the volume's higher baseline performance raises its maximum throughput.",
        "correct": false,
        "explanation": "Growing a gp2 volume raises its IOPS baseline, but gp2 throughput is capped at 250 MB/s per volume regardless of size, so the workload would stay pinned at the same plateau while storage costs nearly quadruple."
      },
      {
        "id": "b",
        "text": "Migrate the volume to gp3 and provision additional throughput on it, keeping the current volume size.",
        "correct": true,
        "explanation": "gp3 decouples throughput from capacity, allowing up to 1,000 MB/s to be provisioned on the same 800 GB volume at a lower per-GB price than gp2, which triples throughput without resizing or re-architecting."
      },
      {
        "id": "c",
        "text": "Migrate the volume to io2 and provision a high IOPS level to increase the volume's available bandwidth.",
        "correct": false,
        "explanation": "io2 pricing scales with provisioned IOPS, and the metrics show IOPS is not the constraint, so paying for tens of thousands of IOPS to obtain throughput is far more expensive than provisioning gp3 throughput directly."
      },
      {
        "id": "d",
        "text": "Migrate the data to an st1 Throughput Optimized HDD volume, which is designed for large sequential read workloads.",
        "correct": false,
        "explanation": "st1 suits pure sequential scans, but it cannot be used as a boot volume and its performance degrades on the small random reads the index database issues, so it fails the stated single-volume constraints."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Migrate the volume to gp3 and provision additional throughput independent of volume size.",
    "explanation": "The metrics isolate throughput, not IOPS, as the constraint, and gp2's hard 250 MB/s per-volume ceiling means resizing cannot help. gp3 is the only option that sells throughput as an independent, cheap dial up to 1,000 MB/s on the existing volume, while io2 prices the wrong dimension and st1 conflicts with the boot-volume and random-read requirements.",
    "trigger": "Hit gp2's 250 MB/s ceiling and fix it with gp3 provisioned throughput",
    "intentGroup": "gp3-provisioned-throughput",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EBS"
    ],
    "tags": [
      "High-Performing Architectures",
      "EBS",
      "Hard",
      "PRO-097",
      "variant-1",
      "Hit gp2's 250 MB/s ceiling and fix it with gp3 provisioned throughput",
      "gp3-provisioned-throughput",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-098",
    "objectiveId": "PRO-098",
    "objectiveName": "Billing and Cost Management: Fix fragmented commitments with payer-level sharing and surface org-wide storage waste",
    "variant": 1,
    "domain": "Cost-Optimized Architectures",
    "sourceDomain": "Cost-Optimized Architectures",
    "service": "Billing and Cost Management",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A company's AWS Organizations organization contains 45 accounts under a single management account with consolidated billing. Individual teams have been buying their own Reserved Instances and Savings Plans, several commitments sit unused because workloads moved between accounts, and a review found that discount benefits are not flowing to the accounts that need them. Leadership also has no organization-wide view of storage waste, such as incomplete multipart uploads and buckets full of noncurrent versions scattered across accounts. The FinOps team must maximize commitment utilization across the organization and gain visibility into cross-account storage waste. Which combination of steps will meet these requirements? (Choose three.)",
    "options": [
      {
        "id": "a",
        "text": "Direct each team to purchase zonal Reserved Instances in its own account sized to that account's steady-state usage.",
        "correct": false,
        "explanation": "Zonal RIs are capacity reservations pinned to one Availability Zone and account-scoped in practice, so this repeats the fragmentation problem instead of pooling commitments where the whole organization can consume them."
      },
      {
        "id": "b",
        "text": "Manage commitments centrally from the management account and confirm that RI and Savings Plans discount sharing is turned on for all linked accounts.",
        "correct": true,
        "explanation": "Central purchasing with discount sharing enabled lets unused commitment benefit float to whichever linked account has matching usage, which directly fixes the stranded-commitment problem."
      },
      {
        "id": "c",
        "text": "Create a separate payer account for each business unit and move its member accounts under it to give every unit its own consolidated bill.",
        "correct": false,
        "explanation": "Splitting into multiple payer organizations fragments the usage pool, shrinking the base each commitment can apply to and making organization-wide discount sharing impossible."
      },
      {
        "id": "d",
        "text": "Purchase a Compute Savings Plan from the payer account sized from Cost Explorer's organization-wide aggregated usage baseline.",
        "correct": true,
        "explanation": "A Compute Savings Plan bought at the payer applies flexibly across instance families, Regions, and all linked accounts, and sizing it on the aggregated baseline maximizes utilization as workloads shift between accounts."
      },
      {
        "id": "e",
        "text": "Enable an organization-level S3 Storage Lens dashboard with advanced metrics and review Trusted Advisor checks to surface idle resources and storage waste across accounts.",
        "correct": true,
        "explanation": "Organization-scoped Storage Lens exposes incomplete multipart uploads and noncurrent version bytes across every account in one dashboard, and Trusted Advisor adds idle-resource findings, providing the missing visibility."
      },
      {
        "id": "f",
        "text": "Define AWS Cost Categories with cost allocation tags to group each team's spending for chargeback reporting.",
        "correct": false,
        "explanation": "Cost Categories organize and attribute spend for reporting, but they neither move discount benefits between accounts nor detect storage waste, so they do not satisfy either stated requirement on their own."
      }
    ],
    "answers": [
      "b",
      "d",
      "e"
    ],
    "correctOptionIds": [
      "b",
      "d",
      "e"
    ],
    "sourceCorrectOptionIds": [
      "b",
      "d",
      "e"
    ],
    "answerSummary": "Centralize commitments at the payer with RI/SP discount sharing on, buy a Compute Savings Plan sized on the org-wide baseline, and use org-level S3 Storage Lens plus Trusted Advisor for waste visibility.",
    "explanation": "The two requirements are commitment utilization across account boundaries and organization-wide waste visibility. Discount sharing plus payer-level Compute Savings Plans solve the first by pooling usage, and organization-scoped Storage Lens with Trusted Advisor solves the second. Zonal RIs and per-BU payers deepen the fragmentation, and Cost Categories only relabel spend.",
    "trigger": "Fix fragmented commitments with payer-level sharing and surface org-wide storage waste",
    "intentGroup": "multi-account-billing-optimization",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Billing and Cost Management"
    ],
    "tags": [
      "Cost-Optimized Architectures",
      "Billing and Cost Management",
      "Hard",
      "PRO-098",
      "variant-1",
      "Fix fragmented commitments with payer-level sharing and surface org-wide storage waste",
      "multi-account-billing-optimization",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-099",
    "objectiveId": "PRO-099",
    "objectiveName": "Secrets Manager: Pair Secrets Manager managed rotation with per-service ARN-scoped policies and client-side caching",
    "variant": 1,
    "domain": "Secure Architectures",
    "sourceDomain": "Secure Architectures",
    "service": "Secrets Manager",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A payments platform runs 12 microservices on Amazon ECS, each connecting to its own Amazon RDS for PostgreSQL database inside private subnets. A new security standard requires that every database credential rotate automatically every 30 days, that services pick up new credentials without container restarts or deployments, and that each microservice can read only its own credential and no other service's. An audit found that all services currently share one task role that can read every secret in the account. Which combination of steps will meet these requirements? (Choose two.)",
    "options": [
      {
        "id": "a",
        "text": "Store each database credential in AWS Secrets Manager and enable managed rotation on a 30-day schedule with a rotation function that runs in the databases' VPC.",
        "correct": true,
        "explanation": "Secrets Manager managed rotation updates both the secret and the database password on schedule, and running the rotation Lambda inside the VPC lets it reach the private RDS instances to complete the rotation."
      },
      {
        "id": "b",
        "text": "Store each database credential as a SecureString parameter in AWS Systems Manager Parameter Store and encrypt it with a customer managed KMS key.",
        "correct": false,
        "explanation": "Parameter Store encrypts secrets at rest, but it has no native rotation capability, so meeting the 30-day rotation requirement would require building and operating custom rotation machinery."
      },
      {
        "id": "c",
        "text": "Attach a task role to each service whose policy allows GetSecretValue only on that service's secret ARN, and use the Secrets Manager client-side caching library to refresh credentials in the application.",
        "correct": true,
        "explanation": "Per-service policies scoped to specific secret ARNs enforce the read-only-your-own-secret requirement, and the caching library re-fetches the secret after rotation so connections use new credentials without restarting containers."
      },
      {
        "id": "d",
        "text": "Keep a single shared task role with read access to all secrets and implement naming-convention checks in each service so it retrieves only its own secret.",
        "correct": false,
        "explanation": "Application-level filtering leaves the IAM permission boundary unchanged, so any compromised service can still read every other service's credential, failing the least-privilege requirement the audit flagged."
      },
      {
        "id": "e",
        "text": "Enable automatic annual rotation on the KMS key that encrypts the secrets so the credential material is re-encrypted on a regular schedule.",
        "correct": false,
        "explanation": "KMS key rotation replaces the key's backing cryptographic material, not the database passwords stored in the secrets, so the credentials themselves would never rotate."
      }
    ],
    "answers": [
      "a",
      "c"
    ],
    "correctOptionIds": [
      "a",
      "c"
    ],
    "sourceCorrectOptionIds": [
      "a",
      "c"
    ],
    "answerSummary": "Enable Secrets Manager managed 30-day rotation with a rotation Lambda in the DB VPC, and give each service a task role scoped to its own secret ARN with client-side caching for restart-free refresh.",
    "explanation": "Three constraints must hold simultaneously: automatic 30-day rotation of the actual database password, credential refresh without redeployment, and per-service isolation. Managed rotation in the VPC handles the first, and ARN-scoped policies combined with the caching library handle the second and third. Parameter Store lacks native rotation, shared roles fail least privilege, and KMS key rotation never touches the password.",
    "trigger": "Pair Secrets Manager managed rotation with per-service ARN-scoped policies and client-side caching",
    "intentGroup": "secrets-manager-rotation-least-priv",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "Secrets Manager"
    ],
    "tags": [
      "Secure Architectures",
      "Secrets Manager",
      "Hard",
      "PRO-099",
      "variant-1",
      "Pair Secrets Manager managed rotation with per-service ARN-scoped policies and client-side caching",
      "secrets-manager-rotation-least-priv",
      "pro hand-authored"
    ]
  },
  {
    "id": "PRO-100",
    "objectiveId": "PRO-100",
    "objectiveName": "EFS: Meet a minutes-level cross-Region RPO for EFS with native replication",
    "variant": 1,
    "domain": "Resilient Architectures",
    "sourceDomain": "Resilient Architectures",
    "service": "EFS",
    "difficulty": "Medium",
    "type": "single",
    "question": "A logistics company runs a critical order-processing application on a fleet of Linux EC2 instances that mount a 6 TB Amazon EFS file system over NFS in us-east-1. A revised disaster recovery policy requires that the file system be recoverable in us-west-2 with a recovery point objective measured in minutes, and the two-person operations team has stated that the DR data path must require almost no ongoing administration. The application's compute tier will be rebuilt in the DR Region from existing templates during a failover. Which solution will meet these requirements?",
    "options": [
      {
        "id": "a",
        "text": "Create an AWS Backup plan for the file system with cross-Region copy jobs that send each backup to a vault in us-west-2.",
        "correct": false,
        "explanation": "Backup plans run on a schedule, so the recovery point is measured in hours between backup windows plus copy time, which cannot satisfy an RPO of minutes."
      },
      {
        "id": "b",
        "text": "Enable EFS replication on the file system with a replica file system in us-west-2.",
        "correct": true,
        "explanation": "EFS replication continuously copies changes to a read-only replica in the second Region with an RPO designed to be minutes, and it is fully managed with no infrastructure or schedules to maintain, matching the small team's constraint."
      },
      {
        "id": "c",
        "text": "Create an AWS DataSync task between the file system and a new EFS file system in us-west-2, scheduled to run every hour.",
        "correct": false,
        "explanation": "Hourly DataSync runs bound the recovery point at up to an hour of loss, and the team must maintain task schedules, monitor transfer failures, and tune scan performance on a 6 TB tree, conflicting with both stated constraints."
      },
      {
        "id": "d",
        "text": "Run a cron-driven rsync job from an EC2 instance in us-east-1 that mirrors the NFS mount to a target file system in us-west-2.",
        "correct": false,
        "explanation": "A self-managed rsync fleet requires patching, monitoring, and full-tree scans that grow with the 6 TB dataset, producing both a weak recovery point and the highest operational burden of any option."
      }
    ],
    "answers": [
      "b"
    ],
    "correctOptionIds": [
      "b"
    ],
    "sourceCorrectOptionIds": [
      "b"
    ],
    "answerSummary": "Enable EFS replication to a replica file system in us-west-2.",
    "explanation": "The two constraints that discriminate are an RPO of minutes and near-zero administration. Native EFS replication is continuous and fully managed, while AWS Backup and scheduled DataSync are interval-based mechanisms whose recovery points are bounded by their schedules, and rsync adds the most operational overhead with the weakest RPO.",
    "trigger": "Meet a minutes-level cross-Region RPO for EFS with native replication",
    "intentGroup": "efs-cross-region-replication",
    "practiceSet": 10,
    "adaptive": {
      "repeatOnMiss": true,
      "minimumCorrectVariantsForMastery": 1,
      "masteryWeightOnMiss": 2,
      "masteryWeightOnCorrect": 0.65
    },
    "services": [
      "EFS"
    ],
    "tags": [
      "Resilient Architectures",
      "EFS",
      "Medium",
      "PRO-100",
      "variant-1",
      "Meet a minutes-level cross-Region RPO for EFS with native replication",
      "efs-cross-region-replication",
      "pro hand-authored"
    ]
  }
]
