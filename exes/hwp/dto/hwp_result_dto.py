from pydantic import BaseModel

class HwpResult(BaseModel):
    success: bool
    hwp_file: str