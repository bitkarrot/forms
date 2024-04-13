from datetime import datetime
from http import HTTPStatus

from fastapi import Depends, HTTPException, Request
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse

from lnbits.core.models import User
from lnbits.decorators import check_user_exists

from . import forms_ext, forms_renderer
from .crud import (
    get_invoice,
    get_invoice_items,
    get_invoice_payments,
    get_invoice_total,
    get_payments_total,
)

templates = Jinja2Templates(directory="templates")


@forms_ext.get("/", response_class=HTMLResponse)
async def index(request: Request, user: User = Depends(check_user_exists)):
    return forms_renderer().TemplateResponse(
        "forms/index.html", {"request": request, "user": user.dict()}
    )


@forms_ext.get("/pay/{invoice_id}", response_class=HTMLResponse)
async def pay(request: Request, invoice_id: str):
    invoice = await get_invoice(invoice_id)

    if not invoice:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail="Invoice does not exist."
        )

    invoice_items = await get_invoice_items(invoice_id)
    invoice_total = await get_invoice_total(invoice_items)

    invoice_payments = await get_invoice_payments(invoice_id)
    payments_total = await get_payments_total(invoice_payments)

    return forms_renderer().TemplateResponse(
        "forms/pay.html",
        {
            "request": request,
            "invoice_id": invoice_id,
            "invoice": invoice.dict(),
            "invoice_items": invoice_items,
            "invoice_total": invoice_total,
            "invoice_payments": invoice_payments,
            "payments_total": payments_total,
            "datetime": datetime,
        },
    )
