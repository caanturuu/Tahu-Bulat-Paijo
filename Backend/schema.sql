-- ========================================================
-- VeritasChain: Supabase / PostgreSQL Database Schema
-- Jalankan skrip ini langsung di SQL Editor Dashboard Supabase
-- ========================================================

-- 1. Aktifkan ekstensi UUID (bawaan Supabase)
create extension if not exists "uuid-ossp";

-- ========================================================
-- TABEL UTAMA: VERIFICATIONS
-- Menyimpan riwayat verifikasi artikel, skor kredibilitas AI,
-- referensi cek fakta, dan bukti snapshot on-chain / IPFS.
-- ========================================================
create table if not exists public.verifications (
    id uuid primary key default gen_random_uuid(),
    
    -- Identitas Pengguna & Sumber Berita
    user_address text not null,                                -- Alamat wallet Privy (0x...)
    article_url text,                                          -- URL artikel asli (opsional jika input teks langsung)
    article_title text not null default 'Untitled Article',    -- Judul artikel hasil ekstraksi
    article_hash text not null,                                -- Normalized SHA-256 teks berita (Digital Fingerprint)
    
    -- Hasil Analisis AI (Gemini 2.0 Flash)
    credibility_score int not null check (credibility_score between 0 and 100),
    status text not null check (status in ('VALID', 'QUESTIONABLE', 'HOAX')),
    summary text,                                              -- Ringkasan analisis kredibilitas berita (2-3 kalimat)
    key_findings jsonb default '[]'::jsonb,                    -- Array 3 poin temuan utama
    claims_review jsonb default '[]'::jsonb,                   -- Data rujukan ClaimReview (MAFINDO, Kompas, Tempo, AFP)
    
    -- Bukti Terdesentralisasi & Blockchain
    ipfs_cid text,                                             -- CID arsip snapshot permanen di IPFS Pinata
    tx_hash text,                                              -- Hash transaksi on-chain di Base Sepolia
    network text default 'Base Sepolia',                       -- Jaringan blockchain
    
    -- Metadata Waktu
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Index untuk performa query berkecepatan tinggi
create index if not exists idx_verifications_article_hash on public.verifications(article_hash);
create index if not exists idx_verifications_user_address on public.verifications(user_address);
create index if not exists idx_verifications_created_at on public.verifications(created_at desc);

-- ========================================================
-- TABEL PENDUKUNG: ARTICLE_REVISIONS (Pelacakan Perubahan)
-- Mencatat setiap deteksi revisi artikel live vs hash on-chain
-- ========================================================
create table if not exists public.article_revisions (
    id uuid primary key default gen_random_uuid(),
    verification_id uuid references public.verifications(id) on delete cascade,
    
    original_hash text not null,                               -- Hash awal saat artikel pertama diverifikasi
    current_hash text not null,                                -- Hash baru setelah redaksi melakukan edit
    added_words int default 0,                                 -- Jumlah kata yang ditambahkan
    removed_words int default 0,                               -- Jumlah kata yang dihapus/dimanipulasi
    diff_html text,                                            -- Teks visual perbandingan warna merah/hijau
    
    detected_at timestamptz not null default now()
);

create index if not exists idx_revisions_verification_id on public.article_revisions(verification_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
-- Aktifkan RLS
alter table public.verifications enable row level security;
alter table public.article_revisions enable row level security;

-- Policy 1: Siapapun (publik) boleh membaca data verifikasi (prinsip audit transparan)
create policy "Allow public read access on verifications"
    on public.verifications for select
    using (true);

create policy "Allow public read access on revisions"
    on public.article_revisions for select
    using (true);

-- Policy 2: Backend (Service Role Key) memiliki akses penuh untuk insert & update data
create policy "Allow service role full access on verifications"
    on public.verifications for all
    using (auth.role() = 'service_role');

create policy "Allow service role full access on revisions"
    on public.article_revisions for all
    using (auth.role() = 'service_role');
