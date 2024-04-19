from typing import List, Optional, Union

from lnbits.helpers import urlsafe_short_hash

from . import db
from .models import (
    CreateInvoiceData,
    CreateInvoiceItemData,
    Invoice,
    InvoiceItem,
    Payment,
    UpdateInvoiceData,
    UpdateInvoiceItemData,
)

async def get_invoice(invoice_id: str) -> Optional[Invoice]:
    row = await db.fetchone(
        "SELECT * FROM forms.invoices WHERE id = ?", (invoice_id,)
    )
    return Invoice.from_row(row) if row else None


async def get_invoice_items(invoice_id: str) -> List[InvoiceItem]:
    rows = await db.fetchall(
        "SELECT * FROM forms.invoice_items WHERE invoice_id = ?", (invoice_id,)
    )
    return [InvoiceItem.from_row(row) for row in rows]


async def get_invoice_item(item_id: str) -> Optional[InvoiceItem]:
    row = await db.fetchone(
        "SELECT * FROM forms.invoice_items WHERE id = ?", (item_id,)
    )
    return InvoiceItem.from_row(row) if row else None


async def get_invoice_total(items: List[InvoiceItem]) -> int:
    return sum(item.amount for item in items)


async def get_invoices(wallet_ids: Union[str, List[str]]) -> List[Invoice]:
    if isinstance(wallet_ids, str):
        wallet_ids = [wallet_ids]

    q = ",".join(["?"] * len(wallet_ids))
    rows = await db.fetchall(
        f"SELECT * FROM forms.invoices WHERE wallet IN ({q})", (*wallet_ids,)
    )
    return [Invoice.from_row(row) for row in rows]


async def get_invoice_payments(invoice_id: str) -> List[Payment]:
    rows = await db.fetchall(
        "SELECT * FROM forms.payments WHERE invoice_id = ?", (invoice_id,)
    )
    return [Payment.from_row(row) for row in rows]


async def get_invoice_payment(payment_id: str) -> Optional[Payment]:
    row = await db.fetchone(
        "SELECT * FROM forms.payments WHERE id = ?", (payment_id,)
    )
    return Payment.from_row(row) if row else None


async def get_payments_total(payments: List[Payment]) -> int:
    return sum(item.amount for item in payments)


async def create_invoice_internal(wallet_id: str, data: CreateInvoiceData) -> Invoice:
    invoice_id = urlsafe_short_hash()
    await db.execute(
        """
        INSERT INTO forms.invoices (id, wallet, status, currency, form_name, custom_css)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            invoice_id,
            wallet_id,
            data.status,
            data.currency,
            data.form_name,
            data.custom_css
        ),
    )

    invoice = await get_invoice(invoice_id)
    assert invoice, "Newly created invoice couldn't be retrieved"
    return invoice


async def create_invoice_items(
    invoice_id: str, data: List[CreateInvoiceItemData]
) -> List[InvoiceItem]:
    for item in data:
        item_id = urlsafe_short_hash()
        await db.execute(
            """
            INSERT INTO forms.invoice_items (id, invoice_id, description, amount)
            VALUES (?, ?, ?, ?)
            """,
            (
                item_id,
                invoice_id,
                item.description,
                int(item.amount * 100),
            ),
        )

    invoice_items = await get_invoice_items(invoice_id)
    return invoice_items


async def update_invoice_internal(
    wallet_id: str, data: Union[UpdateInvoiceData, Invoice]
) -> Invoice:
    await db.execute(
        """
        UPDATE forms.invoices
        SET wallet = ?, currency = ?, status = ?, form_name = ?, custom_css = ?
        WHERE id = ?
        """,
        (
            wallet_id,
            data.currency,
            data.status,
            data.form_name,
            data.custom_css,
            data.id,
        ),
    )

    invoice = await get_invoice(data.id)
    assert invoice, "Newly updated invoice couldn't be retrieved"
    return invoice

async def delete_invoice(
        invoice_id: str,
) -> bool:
    await db.execute(
        f"""
        DELETE FROM forms.payments
        WHERE invoice_id = ?
        """,
        (
            invoice_id,
        ),
    )
    await db.execute(
        f"""
        DELETE FROM forms.invoice_items
        WHERE invoice_id = ?
        """,
        (
            invoice_id,
        ),
    )
    await db.execute(
        f"""
        DELETE FROM forms.invoices
        WHERE id = ?
        """,
        (
            invoice_id,
        ),
    )
    return True


async def update_invoice_items(
    invoice_id: str, data: List[UpdateInvoiceItemData]
) -> List[InvoiceItem]:
    updated_items = []
    for item in data:
        if item.id:
            updated_items.append(item.id)
            await db.execute(
                """
                UPDATE forms.invoice_items
                SET description = ?, amount = ?
                WHERE id = ?
                """,
                (item.description, int(item.amount * 100), item.id),
            )

    placeholders = ",".join("?" for _ in range(len(updated_items)))
    if not placeholders:
        placeholders = "?"
        updated_items = ["skip"]

    await db.execute(
        f"""
        DELETE FROM forms.invoice_items
        WHERE invoice_id = ?
        AND id NOT IN ({placeholders})
        """,
        (
            invoice_id,
            *tuple(updated_items),
        ),
    )

    for item in data:
        if not item:
            await create_invoice_items(
                invoice_id=invoice_id,
                data=[CreateInvoiceItemData(description=item.description)],
            )

    invoice_items = await get_invoice_items(invoice_id)
    return invoice_items


async def create_invoice_payment(invoice_id: str, amount: int) -> Payment:
    payment_id = urlsafe_short_hash()
    await db.execute(
        """
        INSERT INTO forms.payments (id, invoice_id, amount)
        VALUES (?, ?, ?)
        """,
        (
            payment_id,
            invoice_id,
            amount,
        ),
    )

    payment = await get_invoice_payment(payment_id)
    assert payment, "Newly created payment couldn't be retrieved"
    return payment
