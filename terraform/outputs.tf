output "app_url" {
  description = "Amplify app URL"
  value       = "https://main.${aws_amplify_app.scamguard.id}.amplifyapp.com"
}

output "app_id" {
  description = "Amplify app ID"
  value       = aws_amplify_app.scamguard.id
}
