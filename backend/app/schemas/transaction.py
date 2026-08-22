from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any

class TransactionInput(BaseModel):
    model_config = ConfigDict(extra="allow", json_schema_extra={
        "example": {
            "TransactionAmt": 150.0,
            "ProductCD": "W",
            "card1": 13926,
            "card4": "visa",
            "card6": "credit",
            "P_emaildomain": "gmail.com"
        }
    })

    TransactionAmt: float = Field(..., description="Transaction amount in USD")
    ProductCD: Optional[str] = Field("W", description="Product code (W, C, R, H, S)")
    card1: Optional[int] = Field(None, description="Card entity identifier 1")
    card2: Optional[float] = Field(None, description="Card entity identifier 2")
    card3: Optional[float] = Field(None, description="Card entity identifier 3")
    card4: Optional[str] = Field("visa", description="Card network (visa, mastercard, discover, etc.)")
    card5: Optional[float] = Field(None, description="Card entity identifier 5")
    card6: Optional[str] = Field("credit", description="Card type (credit, debit, etc.)")
    addr1: Optional[float] = Field(None, description="Billing zip/region code")
    addr2: Optional[float] = Field(None, description="Billing country/area code")
    dist1: Optional[float] = Field(None, description="Distance metric 1")
    dist2: Optional[float] = Field(None, description="Distance metric 2")
    P_emaildomain: Optional[str] = Field("gmail.com", description="Purchaser email domain")
    R_emaildomain: Optional[str] = Field(None, description="Recipient email domain")
    DeviceType: Optional[str] = Field("desktop", description="Device category (desktop, mobile)")
    DeviceInfo: Optional[str] = Field(None, description="Device string info")
    
    additional_features: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary raw IEEE-CIS features")
