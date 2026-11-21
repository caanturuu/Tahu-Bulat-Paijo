-- ========================================================
-- VeritasChain: Supabase 2-Table Complete Schema & Seed Data
-- ========================================================

-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- TABEL 1: HOAX_ARTICLES (Katalog Berita Hoaks & Detail Halaman)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.hoax_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Umum',
    image_url TEXT,
    source_url TEXT,
    views_count INT DEFAULT 0,
    narasi TEXT NOT NULL,
    penjelasan TEXT NOT NULL,
    kesimpulan TEXT NOT NULL,
    credibility_score INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'HOAX',
    key_findings JSONB DEFAULT '[]'::jsonb,
    claims_review JSONB DEFAULT '[]'::jsonb,
    article_hash TEXT NOT NULL,
    ipfs_cid TEXT,
    tx_hash TEXT,
    published_date TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hoax_category ON public.hoax_articles(category);
CREATE INDEX IF NOT EXISTS idx_hoax_created_at ON public.hoax_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hoax_views_count ON public.hoax_articles(views_count DESC);

-- ========================================================
-- TABEL 2: USER_AUDIT_HISTORY (Riwayat Pengecekan User)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.user_audit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT DEFAULT '0x0000000000000000000000000000000000000000',
    article_title TEXT NOT NULL DEFAULT 'Untitled Article',
    query_input TEXT,
    article_hash TEXT NOT NULL,
    credibility_score INT NOT NULL CHECK (credibility_score BETWEEN 0 AND 100),
    status TEXT NOT NULL,
    is_news BOOLEAN DEFAULT TRUE,
    not_news_reason TEXT,
    tx_hash TEXT,
    ipfs_cid TEXT,
    network TEXT DEFAULT 'Ethereum Sepolia',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_address ON public.user_audit_history(user_address);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.user_audit_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_article_hash ON public.user_audit_history(article_hash);

-- ========================================================
-- TABEL 3: ARTICLE_REVISIONS (Pelacakan Perubahan / Diff Viewer)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.article_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_hash TEXT NOT NULL,
    current_hash TEXT NOT NULL,
    added_words INT DEFAULT 0,
    removed_words INT DEFAULT 0,
    diff_html TEXT,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) & GRANTS
-- ========================================================
ALTER TABLE public.hoax_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_audit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on hoax_articles') THEN
        CREATE POLICY "Allow public read on hoax_articles" ON public.hoax_articles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on user_audit_history') THEN
        CREATE POLICY "Allow public read on user_audit_history" ON public.user_audit_history FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on article_revisions') THEN
        CREATE POLICY "Allow public read on article_revisions" ON public.article_revisions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on user_audit_history') THEN
        CREATE POLICY "Allow insert on user_audit_history" ON public.user_audit_history FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on hoax_articles') THEN
        CREATE POLICY "Allow insert on hoax_articles" ON public.hoax_articles FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role full on hoax_articles') THEN
        CREATE POLICY "Allow service role full on hoax_articles" ON public.hoax_articles FOR ALL USING (auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role full on user_audit_history') THEN
        CREATE POLICY "Allow service role full on user_audit_history" ON public.user_audit_history FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

GRANT ALL ON TABLE public.hoax_articles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_audit_history TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.article_revisions TO anon, authenticated, service_role;

-- ========================================================
-- 12 REAL HOAX ARTICLES SEED DATA
-- ========================================================
INSERT INTO public.hoax_articles (
    title, category, image_url, source_url, views_count, credibility_score, status,
    narasi, penjelasan, kesimpulan, key_findings, claims_review, article_hash, ipfs_cid, tx_hash
) VALUES
(
    'Beredar Link Pendaftaran Bantuan Sosial Tunai Rp10 Juta Lewat Telegram',
    'Finansial',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop',
    'https://turnbackhoax.id/2026/01/bansos-telegram-palsu',
    2840, 0, 'HOAX',
    'Beredar pesan berantai di media sosial dan WhatsApp yang mengklaim pemerintah membagikan bantuan sosial tunai sebesar Rp10 juta yang dapat dicairkan melalui tautan grup Telegram tertentu.',
    'Kementerian Sosial menegaskan tidak pernah menyalurkan bansos tunai melalui tautan aplikasi pesan instan pihak ketiga seperti Telegram. Tautan tersebut merupakan modus phishing untuk mencuri data pribadi, KTP, dan membobol akun perbankan pengguna.',
    'Informasi pembagian bansos 10 juta via Telegram adalah HOAKS bermodus penipuan phishing (Fabricated Content).',
    '["Kemensos membantah memiliki kanal pencairan dana bansos di Telegram.", "Penyaluran resmi bansos tunai hanya melalui bank Himbara dan PT Pos Indonesia.", "Tautan meminta data NIK KTP dan nomor rekening secara mencurigakan."]'::jsonb,
    '[{"claim": "Pemerintah bagikan bansos 10 juta lewat link Telegram", "claimant": "Pesan Berantai WhatsApp", "reviewPublisher": "TurnBackHoax / MAFINDO", "reviewUrl": "https://turnbackhoax.id", "rating": "Salah / Palsu"}]'::jsonb,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'bafkreihvmqtdtpwxuglahvn3q5v6q2f6fr3k6x6ivegh5f5u4qbqpotgdu',
    '0x4f8a1290bc987123def4567890abcdef1234567890abcdef1234567890abcdef'
),
(
    'Undangan Pernikahan Digital Format APK Pembobol Saldo Rekening di WhatsApp',
    'Finansial',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop',
    'https://kompas.com/cekfakta/apk-undangan-pernikahan-palsu',
    3150, 0, 'HOAX',
    'Beredar pesan di WhatsApp dari nomor tidak dikenal yang mengirimkan dokumen dengan nama ''Surat Undangan Pernikahan'' dengan ekstensi file .APK dan meminta penerima menginstalnya.',
    'File tersebut bukan undangan pernikahan asli, melainkan aplikasi malware berjenis trojan perbankan (SMS stealer). Jika diinstal, aplikasi berbahaya ini akan menyadap SMS OTP (One-Time Password) perbankan dan menguras saldo rekening korban.',
    'Dokumen undangan pernikahan berekstensi .APK adalah HOAKS berbahaya modus pencurian data rekening (Malicious Phishing).',
    '["File memiliki ekstensi .apk (Android Package Kit) yang berpotensi menyusupkan malware.", "Aplikasi meminta izin akses SMS yang tidak wajar untuk membaca kode OTP perbankan.", "Pihak kepolisian Siber Polri telah mengeluarkan peringatan resmi terkait modus ini."]'::jsonb,
    '[{"claim": "Undangan pernikahan digital dikirim dalam bentuk file .APK", "claimant": "Nomor WhatsApp Tak Dikenal", "reviewPublisher": "Kompas Cek Fakta", "reviewUrl": "https://kompas.com/cekfakta", "rating": "Modus Malware / Penipuan"}]'::jsonb,
    '7a8b9c0d1e2f34567890abcdef1234567890abcdef1234567890abcdef123456',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7',
    '0x12a9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef12'
),
(
    'Surat Edaran Perubahan Tarif Transaksi Bank BRI Menjadi Rp150 Ribu per Bulan',
    'Finansial',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop',
    'https://tempo.co/cekfakta/tarif-transaksi-bri-150-ribu',
    1820, 5, 'HOAX',
    'Beredar tangkapan layar surat edaran mengatasnamakan Bank BRI yang menyatakan biaya transfer antar bank akan diubah menjadi skema auto-debit Rp150.000 per bulan, dan nasabah diminta mengklik tautan untuk membatalkan.',
    'Sekretaris Perusahaan PT Bank Rakyat Indonesia (Persero) Tbk menegaskan bahwa surat edaran tersebut adalah palsu. BRI tidak pernah menaikkan tarif transfer menjadi Rp150.000 per bulan. Tautan pembatalan merupakan situs palsu untuk mencuri username, password, dan PIN nasabah.',
    'Surat edaran perubahan biaya transfer BRI Rp150 ribu adalah HOAKS modus social engineering.',
    '["Format surat edaran menggunakan tata letak dan logo yang tidak sesuai standar korporasi BRI.", "BRI mengimbau nasabah tidak membagikan nomor kartu, CVV, dan PIN kepada siapapun.", "Tarif transfer BI-FAST tetap berlaku normal Rp2.500 per transaksi."]'::jsonb,
    '[{"claim": "Biaya transfer BRI naik jadi 150 ribu per bulan secara otomatis", "claimant": "Akun Facebook & Pesan WA", "reviewPublisher": "Tempo Cek Fakta", "reviewUrl": "https://cekfakta.tempo.co", "rating": "Palsu / Rekayasa"}]'::jsonb,
    '6b7c8d9e0f1234567890abcdef1234567890abcdef1234567890abcdef123456',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x8',
    '0x23b8bc7890def1234567890abcdef1234567890abcdef1234567890abcdef23'
),
(
    'Klaim Air Rebusan Daun Sirih Merah Menyembuhkan Kanker Stadium 4 Secara Instan',
    'Kesehatan',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
    'https://kompas.com/cekfakta/daun-sirih-kanker',
    2190, 10, 'HOAX',
    'Beredar unggahan video di TikTok yang menyatakan pasien kanker stadium akhir dapat sembuh total tanpa operasi dan kemoterapi hanya dengan rutin meminum air rebusan daun sirih merah.',
    'Pakar onkologi dan Ikatan Dokter Indonesia (IDI) menegaskan klaim tersebut tidak memiliki dasar uji klinis medis pada manusia. Mengabaikan terapi medis standar demi ramuan herbal berisiko fatal mempercepat penyebaran sel kanker stadium lanjut.',
    'Klaim air rebusan daun sirih merah menyembuhkan kanker stadium 4 adalah HOAKS Medis Berbahaya (Misleading Content).',
    '["Tidak ada uji klinis berbasis bukti (evidence-based medicine) yang memvalidasi klaim ini.", "Daun sirih memiliki senyawa antioksidan tetapi bukan obat pembunuh sel kanker terverifikasi.", "Menunda kemoterapi pada kanker stadium 4 dapat menurunkan peluang hidup secara signifikan."]'::jsonb,
    '[{"claim": "Rebusan sirih merah sembuhkan kanker stadium 4 tanpa medis", "claimant": "Video Viral TikTok", "reviewPublisher": "Kompas Cek Fakta", "reviewUrl": "https://kompas.com/cekfakta", "rating": "Menyesatkan / Keliru"}]'::jsonb,
    '8b9c0d1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x9',
    '0x34c9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef34'
),
(
    'Minum Air Es Setelah Makan Menyebabkan Penggumpalan Lemak dan Serangan Jantung',
    'Kesehatan',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
    'https://turnbackhoax.id/2026/01/air-es-jantung-hoax',
    1640, 15, 'HOAX',
    'Beredar narasi di Facebook yang menyebutkan minum air es setelah makan dapat membekukan minyak dan lemak makanan di dalam lambung sehingga memicu kanker dan serangan jantung seketika.',
    'Secara fisiologis tubuh manusia, makanan dan minuman yang masuk ke lambung akan segera disesuaikan suhunya dengan suhu inti tubuh (sekitar 37 derajat Celcius). Air dingin tidak dapat membekukan lemak di saluran pencernaan yang hangat.',
    'Klaim minum air es memicu serangan jantung dan membekukan lemak adalah HOAKS fisiologis yang keliru.',
    '["Suhu tubuh manusia secara konstan menghangatkan makanan dan minuman di lambung.", "Penyebab serangan jantung adalah aterosklerosis jangka panjang, bukan konsumsi air dingin.", "Enzim pencernaan manusia tetap bekerja normal setelah meminum cairan bersuhu dingin."]'::jsonb,
    '[{"claim": "Minum air es setelah makan membekukan lemak jadi racun jantung", "claimant": "Postingan Medsos Facebook", "reviewPublisher": "TurnBackHoax / MAFINDO", "reviewUrl": "https://turnbackhoax.id", "rating": "Salah Total"}]'::jsonb,
    '9c0d1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x0',
    '0x45d9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef45'
),
(
    'Klaim Vaksin Tetes Polio Mengandung Mikrocip Pelacak Gerak Penduduk',
    'Kesehatan',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop',
    'https://liputan6.com/cek-fakta/vaksin-polio-mikrocip',
    1430, 0, 'HOAX',
    'Beredar narasi konspirasi di grup WhatsApp bahwa vaksin tetes polio (bOPV) yang diberikan kepada balita mengandung mikrocip buatan asing untuk melacak gerak penduduk Indonesia.',
    'Kementerian Kesehatan RI dan Badan Pengawas Obat dan Makanan (BPOM) menyatakan vaksin polio hanya mengandung virus polio yang dilemahkan/inaktif, cairan penyangga, dan stabilizer steril. Tidak ada teknologi mikrocip biologis yang muat di dalam tetesan cairan vaksin.',
    'Narasi vaksin polio mengandung mikrocip adalah HOAKS konspirasi tanpa dasar ilmiah.',
    '["Komposisi vaksin polio telah lolos uji mutu ketat BPOM dan standar WHO.", "Tidak ada komponen logam atau perangkat elektronik mikro dalam formulasi vaksin tetes.", "Vaksin polio esensial untuk mencegah kelumpuhan permanen pada anak."]'::jsonb,
    '[{"claim": "Vaksin tetes polio mengandung mikrocip pelacak gerak anak", "claimant": "Pesan Berantai WhatsApp", "reviewPublisher": "Liputan6 Cek Fakta", "reviewUrl": "https://liputan6.com/cek-fakta", "rating": "Hoaks Konspirasi"}]'::jsonb,
    '0d1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x1',
    '0x56e9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef56'
),
(
    'Foto Gedung DPR RI Senayan Terbakar Hebat Saat Sidang Paripurna RUU',
    'Politik',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop',
    'https://tempo.co/cekfakta/foto-dpr-terbakar',
    3890, 5, 'HOAX',
    'Beredar foto dramatis kobaran api melalap atap Gedung Kura-Kura DPR RI di Senayan yang diklaim terjadi saat sidang paripurna pengesahan rancangan undang-undang.',
    'Berdasarkan penelusuran gambar terbalik dan verifikasi Dinas Penanggulangan Kebakaran dan Penyelamatan DKI Jakarta, tidak ada insiden kebakaran di kompleks parlemen Senayan. Gambar terbukti hasil rekayasa generator kecerdasan buatan (AI image synthesis).',
    'Foto gedung DPR RI terbakar adalah HOAKS hasil rekayasa kecerdasan buatan (Manipulated Content).',
    '["Sekjen DPR RI memastikan kompleks parlemen dalam kondisi aman dan normal.", "Dinas Damkar DKI Jakarta mengonfirmasi tidak ada panggilan darurat kebakaran di DPR.", "Analisis artefak citra memperlihatkan distorsi tekstur khas generator gambar AI."]'::jsonb,
    '[{"claim": "Gedung DPR RI terbakar hebat saat sidang paripurna", "claimant": "Akun X / Twitter Viral", "reviewPublisher": "Tempo Cek Fakta", "reviewUrl": "https://cekfakta.tempo.co", "rating": "Manipulasi AI / Palsu"}]'::jsonb,
    '1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x2',
    '0x67f9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef67'
),
(
    'Video Pidato Pejabat Publik Membagikan Uang Tunai Pakai Rekayasa Suara AI',
    'Politik',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop',
    'https://kompas.com/cekfakta/video-pidato-pejabat-ai',
    2720, 0, 'HOAX',
    'Beredar video di Facebook dan SnackVideo yang menampilkan presiden berpidato menjanjikan pembagian uang tunai Rp25 juta bagi warga yang mendaftar melalui nomor WhatsApp di deskripsi video.',
    'Video tersebut merupakan hasil manipulasi deepfake audio. Video asli diambil dari rekaman pidato kenegaraan resmi, namun gerak bibir dan gelombang suara telah diganti menggunakan teknologi voice cloning AI untuk menjerat korban penipuan.',
    'Video pidato pembagian uang tunai adalah HOAKS berteknologi deepfake AI (Fabricated Content).',
    '["Gerak bibir (lip-sync) tidak sinkron dengan intonasi ucapan dalam video.", "Analisis audio spektrogram menunjukkan karakteristik sintesis suara buatan.", "Kanal resmi kepresidenan tidak pernah menyelenggarakan undian uang via WhatsApp."]'::jsonb,
    '[{"claim": "Presiden bagi-bagi uang 25 juta lewat pendaftaran nomor WhatsApp", "claimant": "Akun Video Medsos", "reviewPublisher": "Kompas Cek Fakta", "reviewUrl": "https://kompas.com/cekfakta", "rating": "Manipulasi Deepfake AI"}]'::jsonb,
    '2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x3',
    '0x78a9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef78'
),
(
    'Surat Edaran Palsu Perombakan Menteri Kabinet Mengatasnamakan Mensesneg',
    'Politik',
    'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=600&auto=format&fit=crop',
    'https://turnbackhoax.id/2026/01/surat-reshuffle-palsu',
    1980, 5, 'HOAX',
    'Beredar dokumen PDF berkop surat Kementerian Sekretariat Negara yang memuat daftar 12 nama menteri kabinet yang diberhentikan dan digantikan per tanggal 1 bulan ini.',
    'Kementerian Sekretariat Negara (Kemensetneg) menegaskan surat edaran tersebut adalah palsu dan tidak pernah diterbitkan. Nomor surat dan stempel resmi yang tertera tidak terdaftar dalam tata naskah dinas resmi kementerian.',
    'Dokumen daftar reshuffle menteri adalah HOAKS pemalsuan surat dinas pemerintah.',
    '["Kemensetneg mengeluarkan rilis klarifikasi resmi membantah surat tersebut.", "Penomoran naskah dinas dan tanda tangan digital tidak valid.", "Tidak ada keputusan presiden (Keppres) terkait perombakan pada tanggal tersebut."]'::jsonb,
    '[{"claim": "Surat edaran resmi reshuffle 12 menteri kabinet baru", "claimant": "Dokumen PDF Beredar di Grup Chat", "reviewPublisher": "TurnBackHoax / MAFINDO", "reviewUrl": "https://turnbackhoax.id", "rating": "Dokumen Palsu"}]'::jsonb,
    '34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x4',
    '0x89b9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef89'
),
(
    'Kabar Kominfo Mematikan Jaringan Internet Seluruh Indonesia Mulai Tengah Malam',
    'Teknologi',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop',
    'https://kompas.com/cekfakta/internet-mati-tengah-malam',
    2450, 0, 'HOAX',
    'Beredar pesan di media sosial yang menyebut Kementerian Kominfo akan mematikan seluruh jaringan internet dan sinyal operator seluler di Indonesia selama 3 hari mulai pukul 00.00 WIB.',
    'Kementerian Komunikasi dan Digital (Komdigi/Kominfo) membantah keras narasi tersebut. Pemerintah tidak memiliki rencana pemadaman jaringan nasional, dan seluruh infrastruktur telekomunikasi beroperasi normal melayani publik.',
    'Klaim pemadaman internet nasional tengah malam adalah HOAKS berulang (Fabricated Content).',
    '["Asosiasi Penyelenggara Jasa Internet Indonesia (APJII) menyatakan jaringan internet normal.", "Kementerian Komunikasi menegaskan tidak ada kebijakan pembatasan akses data nasional.", "Narasi merupakan daur ulang hoaks lama yang sering muncul menjelang agenda tertentu."]'::jsonb,
    '[{"claim": "Pemerintah matikan jaringan internet nasional selama 3 hari", "claimant": "Pesan Berantai WhatsApp", "reviewPublisher": "Kompas Cek Fakta", "reviewUrl": "https://kompas.com/cekfakta", "rating": "Tidak Benar / Hoaks"}]'::jsonb,
    '4567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f34',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x5',
    '0x90c9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef90'
),
(
    'Peringatan Mengetik Kode *#06# Membocorkan Lokasi HP Langsung ke Peretas',
    'Teknologi',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop',
    'https://turnbackhoax.id/2026/01/kode-imei-peretas',
    1390, 10, 'HOAX',
    'Beredar peringatan di Facebook agar pengguna smartphone tidak mengetik kode dial *#06# karena diklaim kode tersebut memasang spyware peretas yang menyadap lokasi dan kamera HP.',
    'Kode dial *#06# adalah standar internasional GSM resmi sejak era ponsel pertama untuk menampilkan nomor identitas perangkat atau IMEI (International Mobile Equipment Identity). Kode ini hanya membaca data lokal dari modem ponsel dan tidak mengirimkan data keluar.',
    'Klaim kode dial *#06# membocorkan lokasi ke hacker adalah HOAKS ketidaktahuan teknologi.',
    '["Kode *#06# merupakan instruksi standar asosiasi GSM untuk menampilkan nomor IMEI.", "Panggilan kode ini tidak membutuhkan sambungan internet dan tidak memasang aplikasi apapun.", "Kemenperin resmi menggunakan IMEI untuk perlindungan perangkat dari peredaran ilegal."]'::jsonb,
    '[{"claim": "Kode *#06# meretas dan membocorkan lokasi HP ke hacker", "claimant": "Postingan Medsos", "reviewPublisher": "TurnBackHoax / MAFINDO", "reviewUrl": "https://turnbackhoax.id", "rating": "Salah / Keliru"}]'::jsonb,
    '567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f3456',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x6',
    '0x01d9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef01'
),
(
    'Pesan Berantai Penculikan Anak Menggunakan Mobil Ambulans Palsu di Jakarta',
    'Sosial',
    'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop',
    'https://tempo.co/cekfakta/isu-penculikan-anak-ambulans',
    3120, 0, 'HOAX',
    'Beredar pesan suara kepanikan di WhatsApp yang mengabarkan ada sindikat penculikan anak berkeliaran di area sekolah dasar menggunakan mobil ambulans bernomor polisi daerah tertentu.',
    'Polda Metro Jaya menegaskan rekaman suara dan pesan tersebut adalah hoaks yang meresahkan masyarakat. Petugas telah menelusuri lokasi yang disebutkan dan memastikan situasi keamanan di seluruh sekolah kondusif tanpa ada laporan penculikan.',
    'Pesan berantai penculikan anak mobil ambulans adalah HOAKS provokasi keresahan publik.',
    '["Kepolisian memastikan tidak ada laporan kasus penculikan sebagaimana diklaim.", "Rekaman suara menggunakan pola broadcast fiktif yang kerap diulang tiap tahun.", "Warga diimbau tenang namun tetap waspada menjaga anak secara wajar."]'::jsonb,
    '[{"claim": "Sindikat penculik anak berkeliaran pakai ambulans di Jakarta", "claimant": "Pesan Suara WhatsApp", "reviewPublisher": "Tempo Cek Fakta", "reviewUrl": "https://cekfakta.tempo.co", "rating": "Hoaks Meresahkan"}]'::jsonb,
    '67890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f345678',
    'bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7',
    '0x12e9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef12'
);
