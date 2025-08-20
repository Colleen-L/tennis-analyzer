import resend 
import os

# send verification email functionality
# sends code for password reset

resend.api_key = os.getenv("RESEND_API_KEY")

def send_verif_email(to_email: str, code: str):
  try:
      params: resend.Emails.SendParams = {
          "from": "RAQA <onboarding@resend.dev>",
          #to_email can only be my acct
          #using resend API; would need to buy a domain to send emails to any address
          "to": [to_email],
          "subject": "Password Reset: Verification Code",
          "html": f"<p>Your verification code is: <strong>{code}</strong></p>"
      }
      
      email = resend.Emails.send(params)
      print(email)
      return email
  except Exception as e:
      print("Failed to send email:", e)