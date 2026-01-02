-- 1. Table for Team Members
CREATE TABLE "team_members" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" text,
    "title" text,
    "specialty" text,
    "bio" text,
    "experience" integer,
    "photo_url" text,
    "order" integer,
    "email" text,
    "linkedin_url" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for team_members" ON "team_members" FOR SELECT USING (true);
CREATE POLICY "Admin full access for team_members" ON "team_members" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 2. Table for Blog Posts
CREATE TABLE "blog_posts" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "title" text,
    "excerpt" text,
    "content" text,
    "category" text,
    "date" date,
    "image_url" text,
    "status" text,
    "author" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for blog_posts" ON "blog_posts" FOR SELECT USING (true);
CREATE POLICY "Admin full access for blog_posts" ON "blog_posts" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 3. Table for FAQ Items
CREATE TABLE "faq_items" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "question" text,
    "answer" text,
    "category" text,
    "order" integer,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "faq_items" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for faq_items" ON "faq_items" FOR SELECT USING (true);
CREATE POLICY "Admin full access for faq_items" ON "faq_items" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 4. Table for Testimonials
CREATE TABLE "testimonials" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "content" text,
    "author_name" text,
    "author_position" text,
    "author_photo_url" text,
    "rating" integer,
    "date" date,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for testimonials" ON "testimonials" FOR SELECT USING (true);
CREATE POLICY "Admin full access for testimonials" ON "testimonials" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 5. Table for Jurisdictions
CREATE TABLE "jurisdictions" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" text,
    "x_coord" float8,
    "y_coord" float8,
    "description" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "jurisdictions" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for jurisdictions" ON "jurisdictions" FOR SELECT USING (true);
CREATE POLICY "Admin full access for jurisdictions" ON "jurisdictions" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 6. Table for Case Studies
CREATE TABLE "case_studies" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "title" text,
    "description" text,
    "category" text,
    "result" text,
    "amount" text,
    "duration" text,
    "outcome" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "case_studies" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for case_studies" ON "case_studies" FOR SELECT USING (true);
CREATE POLICY "Admin full access for case_studies" ON "case_studies" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 7. Table for Glossary Terms
CREATE TABLE "glossary_terms" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "term" text,
    "definition" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "glossary_terms" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for glossary_terms" ON "glossary_terms" FOR SELECT USING (true);
CREATE POLICY "Admin full access for glossary_terms" ON "glossary_terms" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 8. Table for Deadlines
CREATE TABLE "deadlines" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "date" date,
    "description" text,
    "urgent" boolean,
    "type" text,
    "client" text,
    "notes" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "deadlines" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for deadlines" ON "deadlines" FOR SELECT USING (true);
CREATE POLICY "Admin full access for deadlines" ON "deadlines" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 9. Table for Partners
CREATE TABLE "partners" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" text,
    "logo_url" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "partners" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for partners" ON "partners" FOR SELECT USING (true);
CREATE POLICY "Admin full access for partners" ON "partners" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 10. Table for Appointments
CREATE TABLE "appointments" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "client_name" text,
    "client_email" text,
    "client_phone" text,
    "appointment_date" date,
    "appointment_time" text,
    "service_requested" text,
    "message" text,
    "status" text DEFAULT 'En attente',
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "appointments" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can create appointments" ON "appointments" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view and update appointments" ON "appointments" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 11. Table for Site Settings
CREATE TABLE "site_settings" (
    "id" int8 PRIMARY KEY,
    "site_name" text,
    "contact_email" text,
    "contact_phone" text,
    "address" text,
    "description" text,
    "clients_satisfied" integer,
    "success_rate" integer,
    "years_experience" integer,
    "cases_handled" integer,
    "updated_at" timestamp with time zone DEFAULT now()
);
-- Insert a single row for settings
INSERT INTO "site_settings" (id, site_name, contact_email, contact_phone, address, description, clients_satisfied, success_rate, years_experience, cases_handled)
VALUES (1, 'Juris Ark', 'contact@jurisark.bj', '+229 97 60 36 02', 'Cotonou, Bénin', 'Cabinet de conseil juridique offrant des services professionnels à Cotonou, Bénin.', 150, 95, 25, 420);

ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for site_settings" ON "site_settings" FOR SELECT USING (true);
CREATE POLICY "Admin full access for site_settings" ON "site_settings" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 12. Table for Activities
CREATE TABLE "activities" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "action" text,
    "user" text,
    "activity_type" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "activities" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read access for activities" ON "activities" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for activities" ON "activities" FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 13. Table for Formations
CREATE TABLE "formations" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "title" text,
    "description" text,
    "icon" text,
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "formations" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for formations" ON "formations" FOR SELECT USING (true);
CREATE POLICY "Admin full access for formations" ON "formations" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 14. Table for Formation Registrations
CREATE TABLE "formation_registrations" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "formation_id" uuid REFERENCES formations(id) ON DELETE SET NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text,
    "status" text DEFAULT 'En attente',
    "created_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "formation_registrations" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can create registrations" ON "formation_registrations" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage registrations" ON "formation_registrations" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
