provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  alias  = "acm"
  region = "us-east-1"
}

locals {
  domain = "web3-tools.wilhelmvdwalt.com"
}


data "aws_route53_zone" "wilhelmvdwalt" {
  name = "wilhelmvdwalt.com"
}

resource "aws_route53_record" "web3_tools" {
  zone_id = data.aws_route53_zone.wilhelmvdwalt.zone_id
  name    = local.domain
  type    = "A"
  alias {
    name                   = aws_s3_bucket.website_bucket.website_domain
    zone_id                = aws_s3_bucket.website_bucket.hosted_zone_id
    evaluate_target_health = false
  }
}


resource "aws_acm_certificate" "web3_tools" {
  provider                  = aws.acm
  domain_name               = local.domain
  subject_alternative_names = ["*.${local.domain}"]
  validation_method         = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "validation" {
  zone_id = data.aws_route53_zone.wilhelmvdwalt.zone_id
  name    = tolist(aws_acm_certificate.web3_tools.domain_validation_options)[0].resource_record_name
  type    = tolist(aws_acm_certificate.web3_tools.domain_validation_options)[0].resource_record_type
  records = [tolist(aws_acm_certificate.web3_tools.domain_validation_options)[0].resource_record_value]
  ttl     = "300"
}

resource "aws_acm_certificate_validation" "default" {
  provider        = "aws.acm"
  certificate_arn = aws_acm_certificate.web3_tools.arn
  validation_record_fqdns = [
    "${aws_route53_record.validation.fqdn}",
  ]
}

# resource "aws_cloudfront_distribution" "cdn" {
#   viewer_certificate {
#     acm_certificate_arn = "${aws_acm_certificate.default.0.arn}"
#     ...
#   }
#   ...
# }

data "aws_iam_policy_document" "website_policy" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = ["*"]
      type        = "AWS"
    }
    resources = [
      "arn:aws:s3:::${local.domain}/*"
    ]
  }
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = local.domain
  acl    = "public-read"
  policy = data.aws_iam_policy_document.website_policy.json
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}
