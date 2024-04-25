async def m001_initial_invoices(db):

    # STATUS COLUMN OPTIONS: 'draft', 'open', 'paid', 'cancelled'

    await db.execute(
        f"""
       CREATE TABLE forms.invoices (
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
       CREATE TABLE forms.invoice_items (
           id TEXT PRIMARY KEY,
           invoice_id TEXT NOT NULL,

           description TEXT NOT NULL,
           amount INTEGER NOT NULL,

           field_type TEXT NOT NULL,
           field_values TEXT NOT NULL,
        
           FOREIGN KEY(invoice_id) REFERENCES {db.references_schema}invoices(id)
        );
   """
    )
    
    await db.execute(
        f"""
       CREATE TABLE forms.fields (
           id TEXT PRIMARY KEY,
           name TEXT NOT NULL,
           constant BOOL NOT NULL DEFAULT false,
           type TEXT NOT NULL,

           value TEXT NOT NULL,
           required BOOL NOT NULL DEFAULT false,

           label TEXT NOT NULL,
           helpText TEXT NOT NULL,

           options TEXT NOT NULL,
           options.text TEXT NOT NULL,
           options.value TEXT NOT NULL,
           type TEXT NOT NULL,
    
           fields TEXT NOT NULL,

           FOREIGN KEY(invoice_id) REFERENCES {db.references_schema}invoices(id)
       );
       """
    )

    await db.execute(
        f"""
       CREATE TABLE forms.payments (
           id TEXT PRIMARY KEY,
           invoice_id TEXT NOT NULL,

           amount {db.big_int} NOT NULL,

           time TIMESTAMP NOT NULL DEFAULT {db.timestamp_now},

           FOREIGN KEY(invoice_id) REFERENCES {db.references_schema}invoices(id)
       );
   """
    )
