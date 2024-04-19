from enum import Enum
from sqlite3 import Row
from typing import List, Optional

from fastapi import Query
from pydantic import BaseModel


class InvoiceStatusEnum(str, Enum):
    draft = "draft"
    open = "open"
    paid = "paid"
    canceled = "canceled"


class CreateInvoiceItemData(BaseModel):
    description: str
    amount: float = Query(..., ge=0.01)
    field_type: str
    field_values: str

class CreateInvoiceData(BaseModel):
    status: InvoiceStatusEnum = InvoiceStatusEnum.draft
    currency: str
    form_name: Optional[str]
    custom_css: Optional[str]

    items: List[CreateInvoiceItemData]

    class Config:
        use_enum_values = True


class UpdateInvoiceItemData(BaseModel):
    id: Optional[str]
    description: str
    amount: float = Query(..., ge=0.01)
    field_type: str
    field_values: str

class UpdateInvoiceData(BaseModel):
    id: str
    wallet: str
    status: InvoiceStatusEnum = InvoiceStatusEnum.draft
    currency: str

    form_name: Optional[str]
    custom_css: Optional[str]

    items: List[UpdateInvoiceItemData]


class Invoice(BaseModel):
    id: str
    wallet: str
    status: InvoiceStatusEnum = InvoiceStatusEnum.draft
    currency: str

    form_name: Optional[str]
    custom_css: Optional[str]

    time: int

    class Config:
        use_enum_values = True

    @classmethod
    def from_row(cls, row: Row) -> "Invoice":
        return cls(**dict(row))


class InvoiceItem(BaseModel):
    id: str
    invoice_id: str
    description: str
    amount: int
    field_type: str
    field_values: str

    class Config:
        orm_mode = True

    @classmethod
    def from_row(cls, row: Row) -> "InvoiceItem":
        return cls(**dict(row))


class Payment(BaseModel):
    id: str
    invoice_id: str
    amount: int
    time: int

    @classmethod
    def from_row(cls, row: Row) -> "Payment":
        return cls(**dict(row))


class CreatePaymentData(BaseModel):
    invoice_id: str
    amount: int
