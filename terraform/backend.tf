terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket         = "wilhelm-web3-tools-infra-terraform-state"
    dynamodb_table = "wilhelm-web3-tools-infra-lock-table"
    encrypt        = true
    key            = "./web3-tools/terraform.tfstate"
    region         = "eu-west-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.31.0"
    }
  }
}
