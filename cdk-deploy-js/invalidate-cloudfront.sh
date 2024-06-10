#!/bin/bash

# Replace with your CloudFront distribution ID
DISTRIBUTION_ID=E14XEZ70Z0RQ6Z

# Create CloudFront invalidation
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"