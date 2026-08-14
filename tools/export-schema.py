import sqlite3

db = sqlite3.connect('listings.staging.db')

# Get all table schemas
schemas = db.execute(
    "SELECT sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL ORDER BY name"
).fetchall()

with open('tools/schema-d1.sql', 'w', encoding='utf-8') as f:
    for (sql,) in schemas:
        # D1 uses standard SQLite SQL — no changes needed
        f.write(sql.strip() + ';\n\n')

print('Tables:')
for (name,) in db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").fetchall():
    count = db.execute(f"SELECT COUNT(*) FROM [{name}]").fetchone()[0]
    print(f"  {name}: {count} rows")
