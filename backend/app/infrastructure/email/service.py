from typing import Optional
from app.core.config import settings

class EmailProvider:
    async def send(self, to_email: str, subject: str, body: str) -> bool:
        raise NotImplementedError

class MockEmailProvider(EmailProvider):
    async def send(self, to_email: str, subject: str, body: str) -> bool:
        print("==================================================")
        print(f"[MockEmailProvider] Email dispatch to: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body:\n{body}")
        print("==================================================")
        return True

class SmtpEmailProvider(EmailProvider):
    async def send(self, to_email: str, subject: str, body: str) -> bool:
        # SMTP Email sending integration plug
        if not settings.SMTP_HOST or not settings.SMTP_USERNAME:
            print("[SmtpEmailProvider Warning]: Missing SMTP credentials. Falling back to Mock.")
            return await MockEmailProvider().send(to_email, subject, body)

        try:
            import aiosmtplib
            from email.message import EmailMessage

            msg = EmailMessage()
            msg["From"] = settings.EMAIL_FROM
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.set_content(body)

            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USERNAME,
                password=settings.SMTP_PASSWORD,
                use_tls=True
            )
            return True
        except Exception as e:
            print(f"[SmtpEmailProvider Error]: {e}")
            return False

class EmailService:
    def __init__(self):
        if settings.SMTP_HOST:
            self.provider = SmtpEmailProvider()
        else:
            self.provider = MockEmailProvider()

    async def send_email(self, to_email: str, subject: str, body: str) -> bool:
        return await self.provider.send(to_email=to_email, subject=subject, body=body)

    async def send_verification_email(self, to_email: str, code: str) -> bool:
        subject = "CareMate AI — Caregiver Verification Code"
        body = f"Your 6-digit caregiver verification code is: {code}\n\nThis code will expire in 15 minutes."
        return await self.send_email(to_email=to_email, subject=subject, body=body)

    async def send_password_reset_email(self, to_email: str, code: str) -> bool:
        subject = "CareMate AI — Password Reset Request"
        body = f"Your 6-digit password reset code is: {code}\n\nIf you did not request this, please ignore."
        return await self.send_email(to_email=to_email, subject=subject, body=body)

email_service = EmailService()
