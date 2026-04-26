-- ============================================================
-- Baby Shower - Ros
-- Kör dessa kommandon i Neon SQL editor
-- ============================================================

-- RSVP-tabell
CREATE TABLE IF NOT EXISTS rsvp (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255),
  attending   BOOLEAN       NOT NULL DEFAULT true,
  dietary_notes TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Önskelista-tabell
CREATE TABLE IF NOT EXISTS wish_list_items (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  description TEXT,
  image_url   TEXT,
  price_range VARCHAR(100),
  store_name  VARCHAR(255),
  store_url   TEXT,
  claimed_by  VARCHAR(255),
  claimed_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Seed-data – Ros önskelista
-- ============================================================

INSERT INTO wish_list_items (name, description, store_name, store_url) VALUES
  (
    'Babysitter – Babybjörn Bliss',
    'Färg: Gråbeige, Mesh',
    'Babybjörn', NULL
  ),
  (
    'Leksak till Babysitter – Babybjörn Mjuka vänner',
    'Färg: Beige/Grå',
    'Babybjörn', NULL
  ),
  (
    'Parasoll/Paraply – Bugaboo',
    'Färg: Svart (brun i andra hand om svart ej finns)',
    'Bugaboo', NULL
  ),
  (
    'Gravidkudde – Najell',
    'Färg: Soft Grey',
    'Najell', NULL
  ),
  (
    'SleepCarrier vol. 5 – Najell',
    'Färg: Bouclé Espresso (Oat Beige i andra hand om Espresso är slut)',
    'Najell', NULL
  ),
  (
    'Reducer till SleepCarrier – Najell',
    'Reducer/insert för SleepCarrier vol. 5',
    'Najell', NULL
  ),
  (
    'Rise Bärsele – Najell',
    'Färg: Black, storlek M',
    'Najell', NULL
  ),
  (
    'Wrap Bärsjal – Najell',
    'Färg: Biscotti Cream eller Black, storlek S',
    'Najell', NULL
  ),
  (
    'OvaFoam Skötbädd – Beemoo CARE',
    'Färg: Grey',
    'Babyshop', NULL
  ),
  (
    'Elektrisk Nagelfil – Frida Baby',
    'Elektrisk nagelfil för baby',
    'Babyshop / Apoteket', NULL
  ),
  (
    'Babymocs Cosy Mocs – Tossor',
    'Färg: Grå eller Beige, storlek 6–12 månader. Köps på Åhléns.',
    'Åhléns', NULL
  ),
  (
    'Stokke Tripp Trapp + Newborn Set',
    'Stol: Oak, Warm Brown. Newborn Set: Dark Grey',
    'Stokke / Babyshop', NULL
  ),
  (
    'Skötunderlägg – Beemoo CARE',
    'Färg: Black',
    'Babyshop', NULL
  ),
  (
    'Baby Rocker 2.0 – Sleepytroll',
    'Färg: Black',
    'Babyshop', NULL
  ),
  (
    'Babyoverall – Najell',
    'Färg: Soft Beige',
    'Najell', NULL
  ),
  (
    'Blöjhink – Ubbi',
    'Blöjhink med lock och diskret design',
    'Babyshop / BHG', NULL
  ),
  (
    'Babymobil med musik – Sebra',
    'Modell: Woodland',
    'Sebra / Babyshop', NULL
  ),
  (
    'Babymonitor – TP-Link Tapo C200',
    'Övervakningskamera med WiFi. Köps via Kjell & Company.',
    'Kjell & Company',
    'https://www.kjell.com/se/produkter/sakerhet-overvakning/kameraovervakning/overvakningskameror/ip-kameror/tp-link-tapo-c200-overvakningskamera-med-wifi-p62284'
  ),
  (
    'Nattlampa Winston – Panda',
    'Modell: Creme de la Creme',
    'Babyshop / Kids concept', NULL
  ),
  (
    'Aktivitetsbok – Mjuk baby bok',
    '"Counting at the Farm" eller svartvit stimulusbok för nyfödda',
    'Bokhandel / Babyshop', NULL
  );
