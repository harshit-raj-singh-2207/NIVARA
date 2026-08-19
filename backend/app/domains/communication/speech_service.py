"""Provider-neutral text preparation for browser SpeechSynthesis."""


def prepare_speech_text(text: str) -> str:
    return " ".join(text.strip().split())
