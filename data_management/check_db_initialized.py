import os
import psycopg2

def table_exists():
    conn = psycopg2.connect(
        dbname=os.environ["POSTGRES_DB"],
        user=os.environ["POSTGRES_USER"],
        password=os.environ.get("POSTGRES_PASSWORD", ""),
        host=os.environ.get("POSTGRES_HOST", "postgres"),
        port=os.environ.get("POSTGRES_PORT", 5432),
    )
    cur = conn.cursor()
    cur.execute("SELECT to_regclass('public.valihuudot') IS NOT NULL;")
    exists = cur.fetchone()[0]
    cur.close()
    conn.close()
    return exists

if __name__ == "__main__":
    print("1" if table_exists() else "0")