import csv
import re
import shutil
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OLD_DB = ROOT / "backups" / "listings-staging-before-v32-clean-import-20260826-212745.db"
SOURCE_DB = ROOT / "listings.staging.db"
OUT_DB = ROOT / "tools" / "v35-image-banner-reconcile.db"
REPORT_CSV = ROOT / "tools" / "v35-image-banner-reconcile.csv"
SQL_OUT = ROOT / "tools" / "v35-image-banner-reconcile.sql"


CATEGORY_IMAGES = {
    "adventure_for_singles": "/images/categories/optimized/adventure-for-singles.webp",
    "beauty_for_singles": "/images/categories/optimized/beauty-for-singles.webp",
    "comedians": "/images/categories/optimized/comedians.webp",
    "cruises4singles": "/images/categories/optimized/cruises4singles.webp",
    "dance_ballroom_style": "/images/categories/optimized/dance-ballroom-style.webp",
    "dance_bachata": "/images/categories/optimized/dance-bachata.webp",
    "dance_ceroc": "/images/categories/optimized/dance-ceroc.webp",
    "dance_classes": "/images/categories/optimized/dance-classes.webp",
    "dance_fitness_and_health": "/images/categories/optimized/dance-fitness-and-health.webp",
    "dance_latin_style": "/images/categories/optimized/dance-latin-style.webp",
    "dance_line_dancing": "/images/categories/optimized/dance-line-dancing.webp",
    "dance_modern_style": "/images/categories/optimized/dance-modern-style.webp",
    "dance_party_clubs": "/images/categories/optimized/dance-party-clubs.webp",
    "dance_salsa": "/images/categories/optimized/dance-salsa.webp",
    "dance_styles": "/images/categories/optimized/dance-styles.webp",
    "dance_swing": "/images/categories/optimized/dance-swing.webp",
    "dance_tango": "/images/categories/optimized/dance-tango.webp",
    "dance_teachers": "/images/categories/optimized/dance-teachers.webp",
    "dinner_for_six": "/images/categories/optimized/dinner-for-six.webp",
    "dinner_parties": "/images/categories/optimized/dinner-parties.webp",
    "events": "/images/optimized/home-cat-activities.webp",
    "finance_mortgage": "/images/categories/optimized/finance-mortgage.webp",
    "fitness4singles": "/images/categories/optimized/fitness4singles.webp",
    "function_centres": "/images/categories/optimized/function-centres.webp",
    "golf": "/images/categories/optimized/golf.webp",
    "healing_and_happiness": "/images/categories/optimized/healing-and-happiness.webp",
    "houseparties": "/images/categories/optimized/houseparties.webp",
    "image_and_photography": "/images/categories/optimized/image-and-photography.webp",
    "intro_agencies": "/images/categories/optimized/intro-agencies.webp",
    "jazz": "/images/categories/optimized/jazz.webp",
    "life_coaches": "/images/categories/optimized/life-coaches.webp",
    "lotto4singles": "/images/categories/optimized/lotto4singles.webp",
    "mature_dating_events": "/images/categories/optimized/mature-dating-events.webp",
    "nightclubs": "/images/categories/optimized/nightclubs.webp",
    "online_dating": "/images/categories/optimized/online-dating.webp",
    "psychics4singles": "/images/categories/optimized/psychics4singles.webp",
    "psychology": "/images/categories/optimized/psychology.webp",
    "restaurants_cafes": "/images/categories/optimized/restaurants-cafes.webp",
    "retreats_for_singles": "/images/categories/optimized/retreats-for-singles.webp",
    "seminars": "/images/categories/optimized/seminars.webp",
    "singles_health": "/images/categories/optimized/singles-health.webp",
    "singles_products": "/images/categories/optimized/singles-products.webp",
    "social_clubs": "/images/categories/optimized/social-clubs.webp",
    "speed_dating": "/images/categories/optimized/speed-dating.webp",
    "sport_adventure": "/images/categories/optimized/sport-adventure.webp",
    "tours4singles": "/images/categories/optimized/tours4singles.webp",
    "travel_for_singles": "/images/categories/optimized/travel-for-singles.webp",
    "walks4singles": "/images/categories/optimized/walks4singles.webp",
    "wineries4singles": "/images/categories/optimized/wineries4singles.webp",
    "yoga_classes": "/images/categories/optimized/yoga-classes.webp",
}

CATEGORY_ALIASES = {
    "sms-phone-dating": "online_dating",
    "sms_phone_dating": "online_dating",
    "dating_coaches": "life_coaches",
    "dating_profile_photography": "image_and_photography",
    "christian_singles": "online_dating",
    "lgbtqia_singles_events": "speed_dating",
    "singles_mixers": "speed_dating",
    "solo_travel": "travel_for_singles",
    "social_walks": "walks4singles",
    "jazz4singles": "jazz",
    "jazz_in_australia": "jazz",
    "standard": "events",
    "self_love_retreats": "retreats_for_singles",
}

CITY_ALIASES = {
    "adel": "adelaide",
    "bris": "brisbane",
    "centralcoast": "central_coast",
    "goldcoast": "gold_coast",
    "melb": "melbourne",
    "melbourne2": "melbourne",
    "syd": "sydney",
    "syd1": "sydney",
    "syd_(2)": "sydney",
    "sydney_": "sydney",
    "sunshinecoast": "sunshine_coast",
    "int": "international",
    "intenational": "international",
}

IMAGE_REJECT = ("e4s_logo", "logo_dis", "spacer", "pixel", "clear", "1x1", "icon_")


def norm_text(value):
    value = (value or "").lower().strip()
    value = value.replace("�", " ")
    value = re.sub(r"https?://", "", value)
    value = re.sub(r"^www\.", "", value)
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def domain(value):
    value = (value or "").strip().lower()
    value = re.sub(r"^https?://", "", value)
    value = re.sub(r"^www\.", "", value)
    return value.split("/")[0]


def image_exists(url):
    if not url:
        return False
    if url.startswith("http://") or url.startswith("https://"):
        return True
    if "://" in url:
        return False
    path = PUBLIC / url.lstrip("/").replace("/", "\\")
    return path.exists()


def image_path_ok(url):
    if not image_exists(url):
        return False
    name = Path(url.split("?", 1)[0]).name.lower()
    return not any(part in name for part in IMAGE_REJECT)


def tokens(value):
    return {t for t in norm_text(value).split() if len(t) >= 4}


def image_matches_record(image, title, web):
    if not image_path_ok(image):
        return False
    hay = norm_text(Path(image.split("?", 1)[0]).stem)
    wanted = tokens(title) | tokens(domain(web))
    return bool(wanted and any(t in hay for t in wanted))


def category_fallback(cats):
    preferred = [c for c in cats if c not in {"intro_agencies"}]
    for cat in preferred + cats:
        img = CATEGORY_IMAGES.get(cat)
        if img and image_exists(img):
            return img
    return "/images/categories/optimized/social-clubs.webp"


def sql_quote(value):
    if value is None:
        return "NULL"
    return "'" + str(value).replace("'", "''") + "'"


def main():
    shutil.copy2(SOURCE_DB, OUT_DB)
    old = sqlite3.connect(OLD_DB)
    new = sqlite3.connect(OUT_DB)
    old.row_factory = sqlite3.Row
    new.row_factory = sqlite3.Row

    category_cols = {row["name"] for row in new.execute("PRAGMA table_info(categories)")}
    insert_cols = ["slug", "label", "parent_slug", "sort_order", "description", "seo_intro"]
    insert_vals = ["finance_mortgage", "Finance & Mortgage", None, 0, None, None]
    for col, val in [
        ("banner_row_count", 1),
        ("seo_title", None),
        ("seo_description", None),
        ("hero_image_url", "/images/categories/optimized/finance-mortgage.webp"),
        ("status", "active"),
    ]:
        if col in category_cols:
            insert_cols.append(col)
            insert_vals.append(val)
    placeholders = ", ".join("?" for _ in insert_cols)
    new.execute(
        f"INSERT OR IGNORE INTO categories ({', '.join(insert_cols)}) VALUES ({placeholders})",
        insert_vals,
    )
    for slug, image in CATEGORY_IMAGES.items():
        new.execute("UPDATE categories SET hero_image_url = ? WHERE slug = ?", (image, slug))

    # Fix finance pages that were accidentally folded into unrelated service buckets.
    finance_ids = [
        r["id"]
        for r in new.execute(
            """
            SELECT id FROM listings
            WHERE lower(source_file) LIKE '%finance_mortgage%'
               OR lower(title) LIKE '%mortgage%'
               OR lower(title) LIKE '%home loan%'
            """
        )
    ]
    for listing_id in finance_ids:
        new.execute("DELETE FROM listing_placements WHERE listing_id = ? AND category_slug IN ('intro_agencies', 'life_coaches')", (listing_id,))
        new.execute(
            """
            INSERT INTO listing_placements
            (listing_id, category_slug, city_slug, sort_order, position_type, is_active)
            SELECT ?, 'finance_mortgage', NULL, 0, 'organic', 1
            WHERE NOT EXISTS (
              SELECT 1 FROM listing_placements
              WHERE listing_id = ? AND category_slug = 'finance_mortgage' AND city_slug IS NULL
            )
            """,
            (listing_id, listing_id),
        )

    old_rows = list(old.execute("SELECT id, title, web, image_url FROM listings WHERE image_url IS NOT NULL AND TRIM(image_url) <> ''"))
    old_by_title = {}
    old_by_domain = {}
    for row in old_rows:
        old_by_title.setdefault(norm_text(row["title"]), []).append(row)
        d = domain(row["web"])
        if d:
            old_by_domain.setdefault(d, []).append(row)

    updates = []
    missing_rows = []
    for row in new.execute(
        """
        SELECT l.id, l.business_id, l.title, l.web, l.image_url,
               GROUP_CONCAT(DISTINCT lp.category_slug) AS cats
        FROM listings l
        LEFT JOIN listing_placements lp ON lp.listing_id = l.id
        GROUP BY l.id
        ORDER BY l.id
        """
    ):
        if not image_path_ok(row["image_url"]):
            missing_rows.append(row)
    missing_before = len(
        list(
        new.execute(
            """
            SELECT 1
            FROM listings
            WHERE image_url IS NULL OR TRIM(image_url) = ''
            """
        )
        )
    )
    for row in missing_rows:
        cats = [c for c in (row["cats"] or "").split(",") if c]
        title_key = norm_text(row["title"])
        dom = domain(row["web"])
        source = None
        image = None
        candidates = []
        if dom:
            candidates.extend(old_by_domain.get(dom, []))
        candidates.extend(old_by_title.get(title_key, []))
        seen_old = set()
        for old_row in candidates:
            if old_row["id"] in seen_old:
                continue
            seen_old.add(old_row["id"])
            if image_matches_record(old_row["image_url"], row["title"], row["web"]):
                image = old_row["image_url"]
                source = f"old_db_logo:{old_row['id']}"
                break
        if not image:
            image = category_fallback(cats)
            source = "category_fallback"
        new.execute("UPDATE listings SET image_url = ? WHERE id = ?", (image, row["id"]))
        if row["business_id"]:
            new.execute("UPDATE businesses SET logo_url = ? WHERE id = ?", (image, row["business_id"]))
        updates.append(
            {
                "type": "listing_image",
                "id": row["id"],
                "title": row["title"],
                "image_url": image,
                "source": source,
                "categories": ",".join(cats),
            }
        )

    new.execute("DELETE FROM listing_images")
    for row in new.execute("SELECT id, title, image_url FROM listings WHERE image_url IS NOT NULL AND TRIM(image_url) <> '' ORDER BY id"):
        new.execute(
            "INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, 0, 1)",
            (row["id"], row["image_url"], f"{row['title']} image"),
        )

    listings = list(new.execute("SELECT id, business_id, title, web FROM listings"))
    listing_by_domain = {}
    listing_by_title = {}
    for row in listings:
        d = domain(row["web"])
        if d:
            listing_by_domain.setdefault(d, row)
        listing_by_title.setdefault(norm_text(row["title"]), row)

    valid_categories = {r["slug"] for r in new.execute("SELECT slug FROM categories")}
    valid_cities = {r["slug"] for r in new.execute("SELECT slug FROM cities")}
    old_banners = list(old.execute("SELECT * FROM banners ORDER BY id"))
    new.execute("DELETE FROM banners")
    restored = 0
    linked = 0
    skipped = 0
    for row in old_banners:
        cat = CATEGORY_ALIASES.get(row["category_slug"], row["category_slug"])
        city = CITY_ALIASES.get(row["city_slug"], row["city_slug"])
        if cat and cat not in valid_categories:
            skipped += 1
            continue
        if city and city not in valid_cities:
            skipped += 1
            continue
        if not image_path_ok(row["image_url"]):
            skipped += 1
            continue
        match = listing_by_domain.get(domain(row["click_url"])) or listing_by_title.get(norm_text(row["alt_text"]))
        business_id = match["business_id"] if match else None
        if business_id:
            linked += 1
        new.execute(
            """
            INSERT INTO banners
            (business_id, image_url, click_url, alt_text, page_scope, category_slug, city_slug, slot_position, is_active, starts_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                business_id,
                row["image_url"],
                row["click_url"],
                row["alt_text"],
                row["page_scope"],
                cat,
                city,
                row["slot_position"],
                row["is_active"],
                row["starts_at"],
                row["expires_at"],
            ),
        )
        restored += 1

    new.commit()

    counts = dict(
        new.execute(
            """
            SELECT
              (SELECT COUNT(*) FROM listings) listings,
              (SELECT COUNT(*) FROM listings WHERE image_url IS NULL OR TRIM(image_url) = '') missing_listing_images,
              (SELECT COUNT(*) FROM listing_images) listing_images,
              (SELECT COUNT(*) FROM banners) banners,
              (SELECT COUNT(*) FROM banners WHERE business_id IS NOT NULL) linked_banners,
              (SELECT COUNT(*) FROM categories) categories,
              (SELECT COUNT(*) FROM cities) cities,
              (SELECT COUNT(*) FROM listing_placements) placements
            """
        ).fetchone()
    )
    counts["banner_rows_restored"] = restored
    counts["banner_rows_linked"] = linked
    counts["banner_rows_skipped"] = skipped
    counts["blank_image_rows_before"] = missing_before
    counts["blank_or_invalid_image_rows_repaired"] = len(updates)
    counts["specific_old_images_recovered"] = sum(1 for u in updates if u["source"].startswith("old_db_logo"))
    counts["fallback_images_assigned"] = sum(1 for u in updates if u["source"] == "category_fallback")

    with REPORT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["type", "id", "title", "image_url", "source", "categories"])
        writer.writeheader()
        writer.writerows(updates)

    sql_lines = [
        "-- v35 image, banner and taxonomy reconciliation",
        "UPDATE categories SET hero_image_url = '/images/categories/optimized/finance-mortgage.webp' WHERE slug = 'finance_mortgage';",
        "INSERT OR IGNORE INTO categories (slug,label,parent_slug,sort_order,description,seo_intro,banner_row_count,seo_title,seo_description,hero_image_url,status) VALUES ('finance_mortgage','Finance & Mortgage',NULL,0,NULL,NULL,1,NULL,NULL,'/images/categories/optimized/finance-mortgage.webp','active');",
    ]
    for slug, image in CATEGORY_IMAGES.items():
        sql_lines.append(f"UPDATE categories SET hero_image_url = {sql_quote(image)} WHERE slug = {sql_quote(slug)};")
    sql_lines.append("DELETE FROM listing_placements WHERE listing_id IN (SELECT id FROM listings WHERE lower(source_file) LIKE '%finance_mortgage%' OR lower(title) LIKE '%mortgage%' OR lower(title) LIKE '%home loan%') AND category_slug IN ('intro_agencies','life_coaches');")
    sql_lines.append("INSERT INTO listing_placements (listing_id, category_slug, city_slug, sort_order, position_type, is_active) SELECT id, 'finance_mortgage', NULL, 0, 'organic', 1 FROM listings WHERE (lower(source_file) LIKE '%finance_mortgage%' OR lower(title) LIKE '%mortgage%' OR lower(title) LIKE '%home loan%') AND NOT EXISTS (SELECT 1 FROM listing_placements lp WHERE lp.listing_id = listings.id AND lp.category_slug = 'finance_mortgage' AND lp.city_slug IS NULL);")
    for row in new.execute("SELECT id,business_id,image_url FROM listings ORDER BY id"):
        sql_lines.append(f"UPDATE listings SET image_url = {sql_quote(row['image_url'])} WHERE id = {row['id']};")
        if row["business_id"]:
            sql_lines.append(f"UPDATE businesses SET logo_url = {sql_quote(row['image_url'])} WHERE id = {row['business_id']};")
    sql_lines.append("DELETE FROM listing_images;")
    for row in new.execute("SELECT listing_id,url,alt_text,sort_order,is_primary FROM listing_images ORDER BY listing_id"):
        sql_lines.append(
            "INSERT INTO listing_images (listing_id,url,alt_text,sort_order,is_primary) VALUES "
            f"({row['listing_id']},{sql_quote(row['url'])},{sql_quote(row['alt_text'])},{row['sort_order']},{row['is_primary']});"
        )
    sql_lines.append("DELETE FROM banners;")
    for row in new.execute("SELECT business_id,image_url,click_url,alt_text,page_scope,category_slug,city_slug,slot_position,is_active,starts_at,expires_at FROM banners ORDER BY id"):
        sql_lines.append(
            "INSERT INTO banners (business_id,image_url,click_url,alt_text,page_scope,category_slug,city_slug,slot_position,is_active,starts_at,expires_at) VALUES "
            f"({sql_quote(row['business_id'])},{sql_quote(row['image_url'])},{sql_quote(row['click_url'])},{sql_quote(row['alt_text'])},{sql_quote(row['page_scope'])},{sql_quote(row['category_slug'])},{sql_quote(row['city_slug'])},{sql_quote(row['slot_position'])},{sql_quote(row['is_active'])},{sql_quote(row['starts_at'])},{sql_quote(row['expires_at'])});"
        )
    SQL_OUT.write_text("\n".join(sql_lines) + "\n", encoding="utf-8")

    print(counts)
    print(f"candidate={OUT_DB}")
    print(f"report={REPORT_CSV}")
    print(f"sql={SQL_OUT}")


if __name__ == "__main__":
    main()
