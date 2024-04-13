from enum import Enum
from sqlite3 import Row
from typing import List, Optional

from fastapi import Query
from pydantic import BaseModel


class FormStatusEnum(str, Enum):
    draft = "draft"
    open = "open"
    paid = "paid"
    canceled = "canceled"


class CreateFormItemData(BaseModel):
    description: str
    amount: float = Query(..., ge=0.01)


class CreateFormData(BaseModel):
    status: FormStatusEnum = FormStatusEnum.draft
    currency: str
    form_name: Optional[str]
    custom_css: Optional[str]
    amount: float = Query(..., ge=0.01)
    items: List[CreateFormItemData]

    class Config:
        use_enum_values = True


class UpdateFormItemData(BaseModel):
    id: Optional[str]
    description: str
    field_type: str


class UpdateFormData(BaseModel):
    id: str
    wallet: str
    status: FormStatusEnum = FormStatusEnum.draft
    currency: str
    form_name: Optional[str]
    custom_css: Optional[str]
    amount: float = Query(..., ge=0.01)
    items: List[UpdateFormItemData]


class Form(BaseModel):
    id: str
    wallet: str
    status: FormStatusEnum = FormStatusEnum.draft
    currency: str
    form_name: Optional[str]
    custom_css: Optional[str]
    time: int

    class Config:
        use_enum_values = True

    @classmethod
    def from_row(cls, row: Row) -> "Form":
        return cls(**dict(row))


class FormItem(BaseModel):
    id: str
    Form_id: str
    description: str
    field_type: str # e.g. dropdown, textarea, checkbox
    field_values: str # values for dropdown
    class Config:
        orm_mode = True

    @classmethod
    def from_row(cls, row: Row) -> "FormItem":
        return cls(**dict(row))


class Payment(BaseModel):
    id: str
    Form_id: str
    amount: int
    time: int

    @classmethod
    def from_row(cls, row: Row) -> "Payment":
        return cls(**dict(row))


class CreatePaymentData(BaseModel):
    Form_id: str
    amount: int
