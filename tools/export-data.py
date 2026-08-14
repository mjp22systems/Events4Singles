import sqlite3
import json

db = sqlite3.connect('listings.staging.db')
db.row_factory = sqlite3.Row

TABLES = [
    'cities', 'categories', 'advertisers', 'businesses',
    'listings', 'listing_images', 'listing_placements',
    'banners', 'admin_activity_log', 'admin_sessions',
    'analytics_events', 'redirects', 'listing_transfer_requests',
]

def quote_value(v):
    if v is None:
        return 'NULL'
    if isinstance(v, (int, float)):
        return str(v)
    s = str(v).replace("'", "''")
    return f"'{s}'"

with open('tools/data-d1.sql', 'w', encoding='utf-8') as f:
    for table in TABLES:
        rows = db.execute(f'SELECT * FROM [{table}]').fetchall()
        if not rows:
            continue
        cols = list(rows[0].keys())
        col_list = ', '.join(f'[{c}]' for c in cols)
        f.write(f'-- {table}: {len(rows)} rows\n')
        for row in rows:
            vals = ', '.join(quote_value(row[c]) for c in cols)
            f.write(f'INSERT OR IGNORE INTO [{table}] ({col_list}) VALUES ({vals});\n')
        f.write('\n')
        print(f'  {table}: {len(rows)} rows exported')

print('Done. Output: tools/data-d1.sql')
