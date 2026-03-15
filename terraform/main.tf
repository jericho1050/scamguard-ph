terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

# IAM Role for Amplify
resource "aws_iam_role" "amplify_role" {
  name = "scamguard-ph-amplify-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "amplify.amazonaws.com"
        }
      }
    ]
  })
}

# Amplify needs basic permissions to build
resource "aws_iam_role_policy_attachment" "amplify_basic" {
  role       = aws_iam_role.amplify_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
}

# Bedrock access policy for the SSR compute functions
resource "aws_iam_role_policy" "bedrock_access" {
  name = "bedrock-access"
  role = aws_iam_role.amplify_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = [
          "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-opus-4-6-v1",
          "arn:aws:bedrock:us-east-1:${data.aws_caller_identity.current.account_id}:inference-profile/us.anthropic.claude-opus-4-6-v1"
        ]
      }
    ]
  })
}

# Amplify App (connected to GitHub)
resource "aws_amplify_app" "scamguard" {
  name                 = "scamguard-ph"
  repository           = var.github_repository
  iam_service_role_arn = aws_iam_role.amplify_role.arn
  access_token         = var.github_token

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - curl -fsSL https://bun.sh/install | bash
            - export PATH=$HOME/.bun/bin:$PATH
            - bun install
        build:
          commands:
            - export PATH=$HOME/.bun/bin:$PATH
            - bun run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
  EOT

  environment_variables = {
    BEDROCK_REGION = var.aws_region
  }

  platform = "WEB_COMPUTE"
}

# Main branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.scamguard.id
  branch_name = "main"
  stage       = "PRODUCTION"
}

# WAF Web ACL for DDoS + rate limiting at the edge
resource "aws_wafv2_web_acl" "scamguard" {
  name  = "scamguard-ph-waf"
  scope = "CLOUDFRONT"

  # WAF for CloudFront must be in us-east-1
  provider = aws

  default_action {
    allow {}
  }

  # Rate limit: 100 requests per 5 minutes per IP
  rule {
    name     = "rate-limit"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 100
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "scamguard-rate-limit"
    }
  }

  # Block known bad bots
  rule {
    name     = "aws-managed-common"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "scamguard-common-rules"
    }
  }

  visibility_config {
    sampled_requests_enabled   = true
    cloudwatch_metrics_enabled = true
    metric_name                = "scamguard-waf"
  }
}
