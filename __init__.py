import asyncio

from fastapi import APIRouter

from lnbits.db import Database
from lnbits.helpers import template_renderer
from lnbits.tasks import catch_everything_and_restart

db = Database("ext_lnforms")

lnforms_ext: APIRouter = APIRouter(prefix="/lnforms", tags=["lnforms"])

lnforms_static_files = [
    {
        "path": "/lnforms/static",
        "name": "lnforms_static",
    }
]


def lnforms_renderer():
    return template_renderer(["lnforms/templates"])


from .tasks import wait_for_paid_invoices
from .views import *  # noqa: F401,F403
from .views_api import *  # noqa: F401,F403


def lnforms_start():
    loop = asyncio.get_event_loop()
    loop.create_task(catch_everything_and_restart(wait_for_paid_invoices))
