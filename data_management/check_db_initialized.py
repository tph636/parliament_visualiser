import os
import psycopg2

def table_exists():
    conn = psycopg2.connect(
        dbname=os.environ.get("POSTGRES_DB") or os.environ["DB_NAME"],
        user=os.environ.get("POSTGRES_USER") or os.environ["DB_USER"],
        password=(os.environ.get("POSTGRES_PASSWORD") or os.environ.get("DB_PASSWORD", "")),
        host=(os.environ.get("POSTGRES_HOST") or os.environ.get("DB_HOST", "postgres")),
        port=(os.environ.get("POSTGRES_PORT") or os.environ.get("DB_PORT", 5432)),
    )
    cur = conn.cursor()
    cur.execute("SELECT to_regclass('public.valihuudot') IS NOT NULL;")
    exists = cur.fetchone()[0]
    cur.close()
    conn.close()
    return exists

if __name__ == "__main__":
    print("1" if table_exists() else "0")