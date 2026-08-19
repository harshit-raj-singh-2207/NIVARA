"""
SMTP email service for transactional emails.
"""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(
    to: str,
    subject: str,
    html_body: str,
    text_body: Optional[str] = None,
    cc: Optional[List[str]] = None,
) -> bool:
    """
    Sends a transactional email via SMTP.

    Args:
        to: Recipient email address.
        subject: Email subject line.
        html_body: HTML email body.
        text_body: Plain-text fallback body.
        cc: Optional list of CC recipients.

    Returns:
        True if sent successfully, False otherwise.
    """
    if not settings.SMTP_HOST:
        logger.warning(f"[EMAIL MOCK] To: {to} | Subject: {subject}")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to
        if cc:
            msg["Cc"] = ", ".join(cc)

        if text_body:
            msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            recipients = [to] + (cc or [])
            server.sendmail(settings.EMAIL_FROM, recipients, msg.as_string())

        logger.info(f"Email sent to {to}: {subject}")
        return True
    except Exception as exc:
        logger.error(f"Email send failed to {to}: {exc}")
        return False


async def send_otp_email(to: str, otp: str, purpose: str = "verification") -> bool:
    """Sends a formatted OTP email."""
    subject = f"Your NIVARA {purpose.title()} Code: {otp}"
    html = f"""
    <html><body>
    <h2>NIVARA – {purpose.title()} Code</h2>
    <p>Your one-time code is: <strong style="font-size:24px;">{otp}</strong></p>
    <p>This code expires in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    </body></html>
    """
    return await send_email(to, subject, html, text_body=f"Your NIVARA code: {otp}")


async def send_welcome_email(to: str, name: str) -> bool:
    """Sends a welcome email to a newly registered user."""
    subject = "Welcome to NIVARA 🎉"
    html = f"""
    <html><body>
    <h2>Welcome, {name}!</h2>
    <p>We're glad you're here. NIVARA is your trusted safety and support companion.</p>
    <p>Get started by setting up your safe zones and connecting your Smart Band.</p>
    </body></html>
    """
    return await send_email(to, subject, html, text_body=f"Welcome to NIVARA, {name}!")
