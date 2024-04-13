async def m001_initial_forms(db):

    # STATUS COLUMN OPTIONS: 'draft', 'open', 'paid', 'canceled'

    await db.execute(
        f"""
       CREATE TABLE forms.forms (
           id TEXT PRIMARY KEY,
           wallet TEXT NOT NULL,

           status TEXT NOT NULL DEFAULT 'draft',

           currency TEXT NOT NULL,

           form_name TEXT DEFAULT NULL,
           custom_css TEXT DEFAULT NULL,


           time TIMESTAMP NOT NULL DEFAULT {db.timestamp_now}
       );
   """
    )

    await db.execute(
        f"""
       CREATE TABLE forms.forms_items (
           id TEXT PRIMARY KEY,
           forms_id TEXT NOT NULL,

           description TEXT NOT NULL,
           field_type TEXT NOT NULL,

           FOREIGN KEY(forms_id) REFERENCES {db.references_schema}forms(id)
        );
   """
    )

    await db.execute(
        f"""
       CREATE TABLE forms.payments (
           id TEXT PRIMARY KEY,
           forms_id TEXT NOT NULL,

           amount {db.big_int} NOT NULL,

           time TIMESTAMP NOT NULL DEFAULT {db.timestamp_now},

           FOREIGN KEY(forms_id) REFERENCES {db.references_schema}forms(id)
       );
   """
    )
