variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "github_repository" {
  description = "GitHub repository URL (https://github.com/user/repo)"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token for Amplify to access the repo"
  type        = string
  sensitive   = true
}
