export const questions = [
  {
    "id": 1,
    "domain": "Secure Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A company must allow an EC2 application to read objects from one S3 bucket without storing long-term credentials on the instance. What should a solutions architect recommend?",
    "options": [
      "Create an IAM user and place its access keys in user data",
      "Attach an IAM role with least-privilege S3 permissions to the EC2 instance",
      "Store access keys in an encrypted EBS volume",
      "Add the EC2 public IP to the S3 bucket policy"
    ],
    "answers": [
      1
    ],
    "explanation": "An EC2 instance profile supplies temporary credentials automatically. The role should grant only the required S3 actions and resources.",
    "services": [
      "IAM",
      "EC2",
      "S3"
    ]
  },
  {
    "id": 2,
    "domain": "Secure Architectures",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "An organization uses AWS Organizations. Security requires that member accounts cannot disable AWS CloudTrail or leave the organization. Which TWO controls best meet the requirement?",
    "options": [
      "Apply service control policies that deny CloudTrail deletion and organization departure",
      "Create IAM permission boundaries in every member account",
      "Enable an organization trail from the management account",
      "Place CloudTrail logs on instance store volumes",
      "Use security groups to block the AWS Organizations API"
    ],
    "answers": [
      0,
      2
    ],
    "explanation": "SCPs provide organization-level guardrails, while an organization trail centrally records activity across accounts.",
    "services": [
      "Organizations",
      "CloudTrail",
      "SCP"
    ]
  },
  {
    "id": 3,
    "domain": "Secure Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A public web application uses an Application Load Balancer. The company wants managed protection against common SQL injection and cross-site scripting patterns. Which service should be associated with the load balancer?",
    "options": [
      "AWS Shield Standard",
      "AWS WAF",
      "Amazon GuardDuty",
      "AWS Network Firewall"
    ],
    "answers": [
      1
    ],
    "explanation": "AWS WAF inspects HTTP(S) requests and can apply managed rule groups for common web exploits.",
    "services": [
      "WAF",
      "ALB"
    ]
  },
  {
    "id": 4,
    "domain": "Secure Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "An RDS database contains sensitive data. Administrators must authenticate with corporate identities and database passwords should not be stored in application configuration. Which approach is most appropriate?",
    "options": [
      "Use IAM database authentication where supported and an IAM role for the application",
      "Create one shared database user for all applications",
      "Store the master password in an AMI",
      "Open the database security group to the corporate CIDR"
    ],
    "answers": [
      0
    ],
    "explanation": "IAM database authentication replaces static passwords with short-lived authentication tokens for supported engines.",
    "services": [
      "RDS",
      "IAM"
    ]
  },
  {
    "id": 5,
    "domain": "Secure Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "A company must encrypt S3 objects with a customer-managed KMS key and ensure that only a specific application role can decrypt them. What is required?",
    "options": [
      "Only an S3 bucket policy",
      "Only an IAM policy on the role",
      "Permissions in both the IAM policy and the KMS key policy",
      "A security group attached to the KMS key"
    ],
    "answers": [
      2
    ],
    "explanation": "KMS authorization commonly requires the principal to be allowed by IAM and recognized by the key policy or a grant.",
    "services": [
      "S3",
      "KMS",
      "IAM"
    ]
  },
  {
    "id": 6,
    "domain": "Secure Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A workload in private subnets needs to call Amazon S3 without traversing a NAT gateway or the public internet. What should be added?",
    "options": [
      "An interface VPC endpoint for EC2",
      "A gateway VPC endpoint for S3",
      "An internet gateway attached to each subnet",
      "A VPC peering connection to an AWS-owned VPC"
    ],
    "answers": [
      1
    ],
    "explanation": "S3 supports gateway endpoints, which provide private routing from a VPC without NAT data processing charges.",
    "services": [
      "VPC",
      "S3"
    ]
  },
  {
    "id": 7,
    "domain": "Secure Architectures",
    "difficulty": "Medium",
    "type": "multiple",
    "question": "A company wants centralized workforce access to multiple AWS accounts with short-lived credentials. Which TWO capabilities are most appropriate?",
    "options": [
      "AWS IAM Identity Center",
      "IAM users duplicated in every account",
      "Permission sets assigned to users or groups",
      "Root-user access keys stored in a vault",
      "EC2 key pairs shared between accounts"
    ],
    "answers": [
      0,
      2
    ],
    "explanation": "IAM Identity Center and permission sets provide centralized federation and temporary account access.",
    "services": [
      "IAM Identity Center",
      "Organizations"
    ]
  },
  {
    "id": 8,
    "domain": "Secure Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "A security team must receive findings when an EC2 instance communicates with a known command-and-control endpoint. Which service provides this managed threat detection?",
    "options": [
      "Amazon Inspector",
      "Amazon Macie",
      "Amazon GuardDuty",
      "AWS Artifact"
    ],
    "answers": [
      2
    ],
    "explanation": "GuardDuty analyzes sources such as VPC Flow Logs, DNS logs, and CloudTrail events for suspicious activity.",
    "services": [
      "GuardDuty"
    ]
  },
  {
    "id": 9,
    "domain": "Secure Architectures",
    "difficulty": "Easy",
    "type": "single",
    "question": "Which design best protects an internet-facing three-tier application?",
    "options": [
      "Put web, application, and database tiers in public subnets",
      "Put the load balancer in public subnets and application/database tiers in private subnets",
      "Assign public IPs to every database instance",
      "Use one security group allowing all traffic between all tiers"
    ],
    "answers": [
      1
    ],
    "explanation": "Only the load balancer must be public. Internal tiers should remain private with narrowly scoped security-group references.",
    "services": [
      "VPC",
      "ALB",
      "Security Groups"
    ]
  },
  {
    "id": 10,
    "domain": "Secure Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A company needs to discover and classify sensitive data such as personally identifiable information in S3. Which service should be used?",
    "options": [
      "Amazon Macie",
      "Amazon Detective",
      "AWS Config",
      "AWS Trusted Advisor"
    ],
    "answers": [
      0
    ],
    "explanation": "Macie uses managed data identifiers and machine learning to discover sensitive data in S3.",
    "services": [
      "Macie",
      "S3"
    ]
  },
  {
    "id": 11,
    "domain": "Secure Architectures",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A private API Gateway API should be callable only from a specific VPC. Which TWO configurations are needed?",
    "options": [
      "Create an interface VPC endpoint for API Gateway",
      "Use a resource policy that restricts the source VPC endpoint",
      "Attach an internet gateway to the private subnets",
      "Put API Gateway in an Auto Scaling group",
      "Create a gateway endpoint for API Gateway"
    ],
    "answers": [
      0,
      1
    ],
    "explanation": "Private REST APIs are reached through an execute-api interface endpoint and can be restricted using an API resource policy.",
    "services": [
      "API Gateway",
      "PrivateLink",
      "VPC"
    ]
  },
  {
    "id": 12,
    "domain": "Secure Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "An auditor requires continuous recording of configuration changes and evaluation against approved rules. Which service is designed for this?",
    "options": [
      "AWS Config",
      "Amazon CloudWatch Logs Insights",
      "AWS X-Ray",
      "Amazon EventBridge Scheduler"
    ],
    "answers": [
      0
    ],
    "explanation": "AWS Config records resource configurations and evaluates them against managed or custom rules.",
    "services": [
      "AWS Config"
    ]
  },
  {
    "id": 13,
    "domain": "Resilient Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A stateless web application must continue operating if one Availability Zone fails. Which architecture is most appropriate?",
    "options": [
      "One large EC2 instance in one AZ",
      "An Auto Scaling group across multiple AZs behind an Application Load Balancer",
      "Two EC2 instances in one placement group",
      "A single EC2 instance with daily AMI backups"
    ],
    "answers": [
      1
    ],
    "explanation": "Multi-AZ Auto Scaling behind a load balancer removes the single-AZ dependency and replaces unhealthy instances.",
    "services": [
      "EC2 Auto Scaling",
      "ALB"
    ]
  },
  {
    "id": 14,
    "domain": "Resilient Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "An order-processing application must prevent message loss and let workers retry failed jobs independently. Which design is best?",
    "options": [
      "Send orders directly from the web server to workers over HTTP",
      "Place orders in an SQS queue and configure a dead-letter queue",
      "Write orders only to instance store",
      "Use an SNS topic without any subscriptions"
    ],
    "answers": [
      1
    ],
    "explanation": "SQS decouples producers and consumers, retains messages, supports visibility timeouts, and can isolate repeatedly failing messages in a DLQ.",
    "services": [
      "SQS"
    ]
  },
  {
    "id": 15,
    "domain": "Resilient Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A relational database requires automatic synchronous standby replication and failover within one AWS Region. Which option should be selected?",
    "options": [
      "RDS Multi-AZ deployment",
      "RDS read replica only",
      "DynamoDB global table",
      "Amazon Redshift snapshot copy"
    ],
    "answers": [
      0
    ],
    "explanation": "RDS Multi-AZ is designed for high availability with automatic failover, not primarily read scaling.",
    "services": [
      "RDS"
    ]
  },
  {
    "id": 16,
    "domain": "Resilient Architectures",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A global application needs low-latency reads and multi-Region active-active writes for key-value data. Which TWO features meet the requirement?",
    "options": [
      "DynamoDB global tables",
      "DynamoDB Streams replication managed by the customer",
      "Multi-Region, multi-active replication",
      "RDS Multi-AZ",
      "S3 One Zone-IA"
    ],
    "answers": [
      0,
      2
    ],
    "explanation": "DynamoDB global tables provide managed multi-Region, multi-active replication.",
    "services": [
      "DynamoDB"
    ]
  },
  {
    "id": 17,
    "domain": "Resilient Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A company wants DNS to route users to a healthy secondary Region only when the primary endpoint fails. Which Route 53 routing policy should be used?",
    "options": [
      "Weighted",
      "Latency",
      "Failover",
      "Geoproximity"
    ],
    "answers": [
      2
    ],
    "explanation": "Failover routing uses primary and secondary records with health checks to support active-passive recovery.",
    "services": [
      "Route 53"
    ]
  },
  {
    "id": 18,
    "domain": "Resilient Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "An application writes shared files from Linux instances across multiple Availability Zones. The storage must remain available if an instance fails. Which service is best?",
    "options": [
      "Amazon EBS Multi-Attach for all instance types",
      "Amazon EFS",
      "EC2 instance store",
      "A local NFS server on one EC2 instance"
    ],
    "answers": [
      1
    ],
    "explanation": "EFS provides regional, managed, multi-AZ shared file storage for Linux workloads.",
    "services": [
      "EFS"
    ]
  },
  {
    "id": 19,
    "domain": "Resilient Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A Lambda function processes S3 events. Occasionally, processing fails because a downstream service is unavailable. What is the simplest resilient approach?",
    "options": [
      "Disable retries",
      "Configure asynchronous retry behavior and an on-failure destination or DLQ",
      "Increase the Lambda memory to maximum",
      "Move the function to a public subnet"
    ],
    "answers": [
      1
    ],
    "explanation": "Asynchronous Lambda invocation supports retries and failure destinations or DLQs for later recovery.",
    "services": [
      "Lambda",
      "S3",
      "SQS"
    ]
  },
  {
    "id": 20,
    "domain": "Resilient Architectures",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A company needs a pilot-light disaster recovery strategy for a critical application. Which TWO characteristics match pilot light?",
    "options": [
      "A minimal core environment runs in the recovery Region",
      "The entire production stack runs at full capacity in both Regions",
      "Data is continuously replicated to the recovery Region",
      "No resources exist until a disaster occurs",
      "Users are always served equally from both Regions"
    ],
    "answers": [
      0,
      2
    ],
    "explanation": "Pilot light keeps core components and replicated data ready, while the full application tier is scaled up during recovery.",
    "services": [
      "Disaster Recovery"
    ]
  },
  {
    "id": 21,
    "domain": "Resilient Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A service publishes events that must be delivered to several independent systems, each with its own retry behavior. Which pattern is best?",
    "options": [
      "One SQS queue with all consumers sharing messages",
      "An SNS topic with a separate SQS queue for each subscriber",
      "Direct synchronous calls to all systems",
      "One EBS volume mounted by every system"
    ],
    "answers": [
      1
    ],
    "explanation": "SNS fanout to separate SQS queues gives each subscriber durable, independent consumption and retry semantics.",
    "services": [
      "SNS",
      "SQS"
    ]
  },
  {
    "id": 22,
    "domain": "Resilient Architectures",
    "difficulty": "Easy",
    "type": "single",
    "question": "Which feature helps an Auto Scaling group stop sending traffic to an unhealthy EC2 instance and replace it?",
    "options": [
      "Elastic Load Balancing health checks",
      "S3 lifecycle rules",
      "IAM access analyzer",
      "AWS Budgets"
    ],
    "answers": [
      0
    ],
    "explanation": "ELB health checks can inform Auto Scaling health status, leading to deregistration and replacement of unhealthy instances.",
    "services": [
      "EC2 Auto Scaling",
      "ELB"
    ]
  },
  {
    "id": 23,
    "domain": "High-Performing Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A read-heavy application uses Amazon RDS. CPU utilization on the primary is high because of reporting queries. What should be added?",
    "options": [
      "A read replica and route reporting queries to it",
      "A larger NAT gateway",
      "An SQS FIFO queue",
      "A second primary database with manual replication"
    ],
    "answers": [
      0
    ],
    "explanation": "Read replicas offload read traffic from the writer and are appropriate when the workload tolerates asynchronous replication.",
    "services": [
      "RDS"
    ]
  },
  {
    "id": 24,
    "domain": "High-Performing Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "An application requires microsecond read latency for frequently accessed key-value data and currently stores records in DynamoDB. Which option is designed for this use case?",
    "options": [
      "DynamoDB Accelerator (DAX)",
      "S3 Transfer Acceleration",
      "RDS Proxy",
      "AWS Storage Gateway"
    ],
    "answers": [
      0
    ],
    "explanation": "DAX is an in-memory cache purpose-built for DynamoDB and can provide microsecond response times for cached reads.",
    "services": [
      "DynamoDB",
      "DAX"
    ]
  },
  {
    "id": 25,
    "domain": "High-Performing Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "Users worldwide download static and dynamic content from an application hosted in one Region. Which service improves global performance by caching content at edge locations?",
    "options": [
      "Amazon CloudFront",
      "AWS CloudFormation",
      "Amazon Inspector",
      "AWS Backup"
    ],
    "answers": [
      0
    ],
    "explanation": "CloudFront is AWS's CDN and reduces latency by serving content from edge locations.",
    "services": [
      "CloudFront"
    ]
  },
  {
    "id": 26,
    "domain": "High-Performing Architectures",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A workload sends millions of streaming records per second and requires multiple consumers to process the same ordered records. Which TWO features make Kinesis Data Streams suitable?",
    "options": [
      "Records are organized into shards",
      "Multiple applications can consume the stream",
      "Every record is automatically stored forever",
      "It provides a relational SQL endpoint by default",
      "It requires one queue per consumer"
    ],
    "answers": [
      0,
      1
    ],
    "explanation": "Kinesis Data Streams partitions capacity into shards and supports multiple independent consumers of retained stream data.",
    "services": [
      "Kinesis Data Streams"
    ]
  },
  {
    "id": 27,
    "domain": "High-Performing Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A company transfers very large files over long geographic distances to a centralized S3 bucket. Which feature can improve upload performance using the AWS edge network?",
    "options": [
      "S3 Transfer Acceleration",
      "S3 Object Lock",
      "S3 Select",
      "S3 Inventory"
    ],
    "answers": [
      0
    ],
    "explanation": "S3 Transfer Acceleration uses nearby edge locations and optimized AWS network paths for long-distance transfers.",
    "services": [
      "S3",
      "CloudFront Edge Network"
    ]
  },
  {
    "id": 28,
    "domain": "High-Performing Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "A network appliance requires a load balancer that preserves source IP addresses and handles millions of TCP connections with very low latency. Which load balancer is best?",
    "options": [
      "Application Load Balancer",
      "Network Load Balancer",
      "Classic Load Balancer",
      "Gateway Load Balancer endpoint only"
    ],
    "answers": [
      1
    ],
    "explanation": "NLB operates at Layer 4, scales to very high connection volumes, offers low latency, and preserves source IP.",
    "services": [
      "NLB"
    ]
  },
  {
    "id": 29,
    "domain": "High-Performing Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "An application repeatedly retrieves the same database query results. The team wants sub-millisecond responses and reduced database load. Which service is most suitable?",
    "options": [
      "Amazon ElastiCache",
      "Amazon EFS",
      "AWS Batch",
      "AWS Direct Connect"
    ],
    "answers": [
      0
    ],
    "explanation": "ElastiCache provides managed Redis or Memcached for low-latency caching.",
    "services": [
      "ElastiCache"
    ]
  },
  {
    "id": 30,
    "domain": "High-Performing Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "A data lake stores compressed columnar files in S3. Analysts need serverless interactive SQL queries without loading the data into a database. Which service should they use?",
    "options": [
      "Amazon Athena",
      "Amazon RDS",
      "Amazon MQ",
      "Amazon AppFlow"
    ],
    "answers": [
      0
    ],
    "explanation": "Athena queries data directly in S3 using SQL and works efficiently with partitioned columnar formats such as Parquet.",
    "services": [
      "Athena",
      "S3"
    ]
  },
  {
    "id": 31,
    "domain": "High-Performing Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A company needs a dedicated private network connection from its data center to AWS with consistent throughput. Which service should be used?",
    "options": [
      "AWS Direct Connect",
      "AWS Client VPN",
      "Internet Gateway",
      "VPC peering"
    ],
    "answers": [
      0
    ],
    "explanation": "Direct Connect provides a dedicated network connection between an on-premises location and AWS.",
    "services": [
      "Direct Connect"
    ]
  },
  {
    "id": 32,
    "domain": "High-Performing Architectures",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A compute-intensive batch workload can be interrupted and has flexible completion time. Which TWO design choices improve scalability and price-performance?",
    "options": [
      "Use AWS Batch to schedule jobs",
      "Use EC2 Spot Instances where appropriate",
      "Run all jobs on one On-Demand instance",
      "Store temporary data only in a developer laptop",
      "Use a fixed-size instance fleet permanently"
    ],
    "answers": [
      0,
      1
    ],
    "explanation": "AWS Batch manages job scheduling and compute environments; Spot capacity is suitable for interruption-tolerant batch work.",
    "services": [
      "AWS Batch",
      "EC2 Spot"
    ]
  },
  {
    "id": 33,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "An S3 dataset is accessed frequently for 30 days, rarely for the next 60 days, and must then be retained for seven years. What is the most cost-effective automated solution?",
    "options": [
      "Keep all objects in S3 Standard forever",
      "Use lifecycle transitions to lower-cost storage classes and then archive storage",
      "Copy all objects to EBS snapshots",
      "Move data manually to EC2 instance store"
    ],
    "answers": [
      1
    ],
    "explanation": "S3 lifecycle policies automate transitions among storage classes based on predictable access and retention patterns.",
    "services": [
      "S3 Lifecycle"
    ]
  },
  {
    "id": 34,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "A steady-state application runs continuously on EC2, but the instance families and Regions may change over the next three years. Which pricing model offers broad flexibility with a commitment?",
    "options": [
      "Standard Reserved Instances only",
      "Compute Savings Plans",
      "Spot Instances only",
      "Dedicated Hosts with no commitment"
    ],
    "answers": [
      1
    ],
    "explanation": "Compute Savings Plans provide discounts in exchange for an hourly spend commitment and apply across EC2 families, sizes, Regions, and certain serverless compute.",
    "services": [
      "Savings Plans",
      "EC2"
    ]
  },
  {
    "id": 35,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A development environment is used only from 8 AM to 6 PM on weekdays. What is the simplest way to reduce EC2 cost?",
    "options": [
      "Increase instance size",
      "Schedule instances to stop outside working hours",
      "Purchase more Elastic IP addresses",
      "Enable detailed monitoring"
    ],
    "answers": [
      1
    ],
    "explanation": "Stopping nonproduction instances outside active hours avoids compute charges while retaining EBS-backed volumes.",
    "services": [
      "EC2",
      "EventBridge",
      "Systems Manager"
    ]
  },
  {
    "id": 36,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Hard",
    "type": "multiple",
    "question": "A company has unpredictable S3 object access patterns and does not want to manage lifecycle rules. Which TWO statements support choosing S3 Intelligent-Tiering?",
    "options": [
      "It automatically moves objects among access tiers based on usage",
      "It is designed for unknown or changing access patterns",
      "It requires every object to be manually restored before any read",
      "It stores only one copy in a single Availability Zone",
      "It replaces the need for all data-retention policies"
    ],
    "answers": [
      0,
      1
    ],
    "explanation": "S3 Intelligent-Tiering monitors access and automatically moves eligible objects between tiers without retrieval charges for its automatic access tiers.",
    "services": [
      "S3 Intelligent-Tiering"
    ]
  },
  {
    "id": 37,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A Lambda function connects to an RDS database and creates too many database connections during traffic spikes. Which service can pool and reuse those connections?",
    "options": [
      "RDS Proxy",
      "AWS Global Accelerator",
      "Amazon ECR",
      "AWS DataSync"
    ],
    "answers": [
      0
    ],
    "explanation": "RDS Proxy pools database connections, improving scalability and potentially avoiding costly database overprovisioning.",
    "services": [
      "RDS Proxy",
      "Lambda"
    ]
  },
  {
    "id": 38,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "Several VPCs send large volumes of traffic to S3 through NAT gateways. Which change can reduce recurring data processing cost while retaining private access?",
    "options": [
      "Create S3 gateway endpoints in the VPCs",
      "Add more NAT gateways",
      "Use public IPs on all instances",
      "Route S3 traffic through an Application Load Balancer"
    ],
    "answers": [
      0
    ],
    "explanation": "S3 gateway endpoints have no hourly or data-processing charge and prevent S3 traffic from traversing NAT gateways.",
    "services": [
      "VPC Endpoint",
      "S3",
      "NAT Gateway"
    ]
  },
  {
    "id": 39,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Medium",
    "type": "single",
    "question": "A small infrequently used API has highly variable traffic and should incur minimal idle compute cost. Which architecture is most appropriate?",
    "options": [
      "API Gateway with Lambda",
      "A permanently running EC2 cluster",
      "Dedicated Hosts",
      "A fixed-size ECS cluster on EC2"
    ],
    "answers": [
      0
    ],
    "explanation": "API Gateway and Lambda provide request-based/serverless pricing and scale to zero compute usage between requests.",
    "services": [
      "API Gateway",
      "Lambda"
    ]
  },
  {
    "id": 40,
    "domain": "Cost-Optimized Architectures",
    "difficulty": "Hard",
    "type": "single",
    "question": "A company needs to identify underutilized EC2 instances and receive recommendations for more appropriate instance sizes. Which service is specifically designed for this?",
    "options": [
      "AWS Compute Optimizer",
      "AWS Artifact",
      "Amazon Cognito",
      "AWS Shield Advanced"
    ],
    "answers": [
      0
    ],
    "explanation": "Compute Optimizer analyzes utilization metrics and produces rightsizing recommendations.",
    "services": [
      "Compute Optimizer"
    ]
  }
];
