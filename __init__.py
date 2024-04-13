import asyncio

from fastapi import APIRouter
from typing import List

from lnbits.db import Database
from lnbits.helpers import template_renderer
from lnbits.tasks import catch_everything_and_restart

db = Database("ext_forms")


forms_static_files = [
    {
        "path": "/forms/static",
        "name": "forms_static",
    }
]

forms_ext: APIRouter = APIRouter(prefix="/forms", tags=["forms"])


def forms_renderer():
    return template_renderer(["forms/templates"])


from .tasks import wait_for_paid_invoices

scheduled_tasks: List[asyncio.Task] = []

def forms_start():
    loop = asyncio.get_event_loop()
    task = loop.create_task(catch_everything_and_restart(wait_for_paid_invoices))
    scheduled_tasks.append(task)


from .views import *  # noqa: F401,F403
from .views_api import *  # noqa: F401,F403
