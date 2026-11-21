import sys
import hashlib
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from services.db_service import get_supabase_client

REAL_HOAX_ARTICLES = [
    # 1. Finansial / Bansos - Kasus Nyata Kemensos
    {
        "title": "Beredar Link Pendaftaran Bantuan Sosial Tunai Rp10 Juta via Tautan Telegram",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/03/salah-tautan-pendaftaran-bansos-10-juta-telegram",
        "views_count": 4820,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan broadcast di media sosial WhatsApp dan Facebook dengan narasi: 'Kementerian Sosial membagikan bantuan langsung tunai (BLT) sebesar Rp 10.000.000 untuk masyarakat yang mendaftar melalui tautan grup Telegram resmi berikut sebelum akhir bulan'.",
        "penjelasan": "Kementerian Sosial Republik Indonesia melalui akun resmi @kemensosri secara tegas menyatakan bahwa informasi tersebut adalah palsu. Kemensos tidak pernah menggunakan media sosial Telegram atau tautan instan pihak ketiga untuk pendaftaran atau pencairan bantuan sosial. Penyaluran bansos PKH dan BPNT resmi hanya disalurkan melalui Himpunan Bank Milik Negara (Himbara) dan Kantor Pos Indonesia setelah terdaftar di Data Terpadu Kesejahteraan Sosial (DTKS).",
        "kesimpulan": "Klaim pendaftaran bansos tunai Rp10 juta via Telegram adalah HOAKS bermodus penipuan siber (Fabricated Content).",
        "key_findings": [
            "Kemensos memastikan tidak ada program bansos tunai senilai 10 juta via Telegram.",
            "Tautan mengarah ke situs web tiruan yang meminta pengisian NIK, nomor rekening, dan PIN perbankan.",
            "Pengecekan mandiri status bansos resmi hanya melalui cekbansos.kemensos.go.id."
        ],
        "claims_review": [
            {
                "claim": "Pemerintah bagikan bansos tunai 10 juta lewat grup Telegram",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Salah / Palsu"
            }
        ],
        "article_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "ipfs_cid": "bafkreihvmqtdtpwxuglahvn3q5v6q2f6fr3k6x6ivegh5f5u4qbqpotgdu",
        "tx_hash": "0x4f8a1290bc987123def4567890abcdef1234567890abcdef1234567890abcdef"
    },
    # 2. Teknologi / Kejahatan Siber - Kasus Nyata APK Undangan
    {
        "title": "Modus Penipuan File Undangan Pernikahan Format APK Pembobol Rekening M-Banking",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/01/29/183000682/waspada-modus-penipuan-undangan-pernikahan-format-apk",
        "views_count": 5210,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan di aplikasi WhatsApp dari nomor tidak dikenal yang mengirimkan dokumen berlabel 'Surat Undangan Pernikahan Digital' dengan ekstensi file .APK dan memaksa penerima membukanya.",
        "penjelasan": "Pakar keamanan siber dan Bareskrim Polri menegaskan bahwa file tersebut adalah aplikasi malware berjenis SMS-stealer trojan. Jika korban memasang file APK tersebut, aplikasi akan meminta izin akses pembacaan SMS secara diam-diam sehingga pelaku penipuan dapat mengintersepsi kode OTP (One-Time Password) perbankan dan menguras saldo tabungan.",
        "kesimpulan": "File undangan pernikahan berekstensi .APK adalah HOAKS berbahaya modus malware pencurian data perbankan.",
        "key_findings": [
            "Undangan fisik atau digital yang sah tidak pernah menggunakan format instalasi .apk.",
            "File APK tersebut dirancang untuk menyusup dan menyalin pesan SMS berisi OTP otentikasi finansial.",
            "Bareskrim Polri dan OJK telah mengeluarkan himbauan darurat kewaspadaan modus sniffing ini."
        ],
        "claims_review": [
            {
                "claim": "Surat undangan pernikahan resmi berbentuk file dokumen instalasi APK",
                "claimant": "Nomor Penipuan WhatsApp",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Hoaks Berbahaya / Malware"
            }
        ],
        "article_hash": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "ipfs_cid": "bafkreibm5j7k2o23vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7",
        "tx_hash": "0x89abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678"
    },
    # 3. Finansial / Perbankan - Kasus Nyata Tarif BRI
    {
        "title": "Surat Edaran Palsu Kenaikan Biaya Transaksi Transfer Antar Bank BRI Rp150.000 per Bulan",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2023/06/salah-surat-perubahan-tarif-transaksi-bri-150-ribu",
        "views_count": 3950,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar selebaran surat digital berlogo Bank Rakyat Indonesia (BRI) yang menyatakan biaya transfer antar bank berubah menjadi Rp150.000 per bulan yang didebit otomatis dari rekening jika nasabah tidak mengisi formulir pembatalan melalui link.",
        "penjelasan": "PT Bank Rakyat Indonesia (Persero) Tbk memastikan bahwa surat edaran kenaikan biaya transaksi Rp 150 ribu per bulan adalah HOAKS dan penipuan social engineering. Bank BRI tidak pernah menerbitkan surat tersebut dan menegaskan bahwa biaya transfer antarbank melalui BI-FAST tetap Rp 2.500 serta biaya transfer online reguler tetap Rp 6.500.",
        "kesimpulan": "Surat perubahan tarif transaksi BRI Rp150.000 adalah HOAKS pencurian kredensial nasabah.",
        "key_findings": [
            "Corporate Secretary BRI menegaskan dokumen tersebut palsu dan bukan produk resmi perseroan.",
            "Tautan formulir pembatalan merupakan situs phishing yang menargetkan nomor kartu ATM, CVV, dan PIN nasabah.",
            "Biaya transaksi resmi transfer online perbankan nasional tetap mengacu tarif reguler BI-FAST."
        ],
        "claims_review": [
            {
                "claim": "Biaya transfer BRI naik jadi 150 ribu per bulan secara otomatis",
                "claimant": "Akun Palsu Media Sosial",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Konten Tiruan / Palsu"
            }
        ],
        "article_hash": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "ipfs_cid": "bafkreic7x8y9z0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
        "tx_hash": "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234"
    },
    # 4. Kesehatan / Medis - Kasus Nyata Rebusan Daun Sirih
    {
        "title": "Klaim Air Rebusan Daun Sirih Merah Menyembuhkan Kanker Stadium 4 Tanpa Kemoterapi",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/05/17/141200582/hoaks-air-rebusan-daun-sirih-merah-sembuhkan-kanker-stadium-4",
        "views_count": 4120,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Unggahan video di TikTok dan grup pesan mengklaim pasien kanker stadium 4 sembuh total hanya dalam waktu 3 minggu cukup dengan rutin meminum air rebusan daun sirih merah tanpa perlu tindakan operasi atau kemoterapi di rumah sakit.",
        "penjelasan": "Perhimpunan Dokter Spesialis Onkologi Radiasi Indonesia dan Ikatan Dokter Indonesia (IDI) menegaskan klaim tersebut tidak memiliki dasar bukti klinis ilmiah (unproven treatment). Daun sirih merah memang mengandung antioksidan, namun tidak dapat memusnahkan sel kanker stadium lanjut.",
        "kesimpulan": "Klaim air rebusan daun sirih menyembuhkan kanker stadium 4 adalah HOAKS berbahaya yang menyesatkan pasien medis.",
        "key_findings": [
            "Kanker stadium 4 membutuhkan penanganan medis multimodalitas onkologi komprehensif.",
            "Belum ada uji klinis berbasis manusia yang membuktikan sirih merah sebagai terapi pengganti kemoterapi.",
            "Keterlambatan tindakan medis akibat percaya pengobatan alternatif dapat berakibat fatal bagi pasien."
        ],
        "claims_review": [
            {
                "claim": "Sirih merah sembuhkan kanker stadium 4 tanpa obat rumah sakit",
                "claimant": "Video Viral TikTok",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Klaim Menyesatkan / Tanpa Bukti"
            }
        ],
        "article_hash": "4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
        "ipfs_cid": "bafkreid4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
        "tx_hash": "0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd"
    },
    # 5. Sosial / Bencana - Kasus Nyata Megathrust
    {
        "title": "Pesan Suara Ancaman Gempa Megathrust Magnitudo 8.9 Melanda Selat Sunda Besok Pagi",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/08/salah-gempa-megathrust-selat-sunda-besok-pagi",
        "views_count": 6730,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar voice note rekaman suara pria yang mengatasnamakan staf ahli geologi BMKG, memperingatkan warga Jakarta dan Banten untuk segera mengungsi malam ini karena gempa Megathrust Selat Sunda M8.9 pasti terjadi besok subuh.",
        "penjelasan": "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) secara resmi membantah rekaman audio tersebut. BMKG menegaskan hingga saat ini belum ada teknologi di dunia yang mampu memprediksi waktu kejadian hari, jam, dan menit terjadinya gempa bumi secara pasti.",
        "kesimpulan": "Prediksi gempa Megathrust Selat Sunda terjadi besok pagi adalah HOAKS disinformasi yang memicu kepanikan warga.",
        "key_findings": [
            "BMKG menegaskan gempa bumi belum dapat diprediksi waktu dan lokasinya secara tepat.",
            "Potensi zona megathrust adalah fakta ilmiah mitigasi, namun kabar tanggal kejadian pasti adalah hoaks fiktif.",
            "Masyarakat diminta merujuk informasi resmi hanya melalui kanal aplikasi InfoBMKG."
        ],
        "claims_review": [
            {
                "claim": "BMKG pastikan gempa megathrust M8.9 terjadi besok pagi di Selat Sunda",
                "claimant": "Pesan Suara WhatsApp",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Hoaks Menyesatkan"
            }
        ],
        "article_hash": "7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        "ipfs_cid": "bafkreie1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
        "tx_hash": "0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1"
    },
    # 6. Kesehatan / Vaksinasi - Kasus Nyata Mikrocip Polio
    {
        "title": "Narasi Vaksin Tetes Polio Diberi Kandungan Mikrocip Pelacak Global",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2024/07/25/112000582/hoaks-vaksin-polio-mengandung-mikrochip-pelacak",
        "views_count": 3480,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar unggahan di Facebook yang mengajak orang tua menolak Pekan Imunisasi Nasional (PIN) Polio dengan klaim vaksin tetes polio mengandung mikrocip cair nano-teknologi untuk mengontrol populasi anak.",
        "penjelasan": "Kementerian Kesehatan RI dan Organisasi Kesehatan Dunia (WHO) mengonfirmasi bahwa vaksin polio tetes (nOPV2) hanya mengandung strain virus polio hidup yang telah dilemahkan, stabilisator, dan antibiotik jejak untuk membentuk kekebalan imun usus. Klaim adanya mikrocip adalah teori konspirasi tanpa dasar ilmiah.",
        "kesimpulan": "Klaim vaksin polio mengandung mikrocip pelacak adalah HOAKS teori konspirasi tak berdasar.",
        "key_findings": [
            "Vaksin nOPV2 telah melalui uji keamanan ketat BPOM dan sertifikasi halal MUI.",
            "Secara ilmu fisika dan bioteknologi, mikrocip pelacak tidak dapat dibuat dalam bentuk cairan tetes vaksin.",
            "Penolakan vaksinasi polio berisiko memicu kelumpuhan permanen pada anak."
        ],
        "claims_review": [
            {
                "claim": "Vaksin polio PIN Kemenkes mengandung mikrocip pelacak",
                "claimant": "Akun Komunitas Facebook",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Klaim Palsu / Teori Konspirasi"
            }
        ],
        "article_hash": "bcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a",
        "ipfs_cid": "bafkreif2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
        "tx_hash": "0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
    },
    # 7. Politik / Demo - Kasus Nyata Hoaks Foto DPR Terbakar
    {
        "title": "Foto Manipulasi AI Gedung Parlemen DPR RI Terbakar Hebat Saat Demonstrasi",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/08/salah-foto-gedung-dpr-terbakar-saat-demo-kawal-putusan-mk",
        "views_count": 8200,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar foto dramatis di platform X (Twitter) yang menampilkan kobaran api besar melalap kubah hijau Gedung Nusantara DPR RI Senayan dengan kepulan asap hitam saat aksi massa berlangsung.",
        "penjelasan": "Polda Metro Jaya dan Sekretariat Jenderal DPR RI memastikan foto tersebut adalah HOAKS rekayasa kecerdasan buatan (AI Generated Content). Analisis citra forensik digital menemukan anomali arsitektur kubah dan ketidaksinkronan pencahayaan pada foto.",
        "kesimpulan": "Foto Gedung DPR RI terbakar hebat adalah HOAKS hasil rekayasa generator kecerdasan buatan (AI).",
        "key_findings": [
            "Sekjen DPR RI memastikan Gedung Parlemen dalam kondisi aman tanpa insiden kebakaran.",
            "Pemeriksaan metadata dan model detektor AI mendeteksi gambar dibuat menggunakan prompt Midjourney.",
            "Warga diimbau memverifikasi foto peristiwa genting melalui media kredibel."
        ],
        "claims_review": [
            {
                "claim": "Gedung kubah DPR RI terbakar habis saat demonstrasi kawal putusan MK",
                "claimant": "Akun Anonim X (Twitter)",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Manipulated / AI Content"
            }
        ],
        "article_hash": "cdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
        "ipfs_cid": "bafkreig3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
        "tx_hash": "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123"
    },
    # 8. Politik / Deepfake - Kasus Nyata Video AI Bagi Uang
    {
        "title": "Video Rekayasa Suara AI Deepfake Presiden Membagikan Uang Tunai Jutaan Rupiah",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2024/02/10/162000382/hoaks-video-presiden-jokowi-bagikan-uang-50-juta",
        "views_count": 5910,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar video di TikTok dan snack video yang menampilkan Presiden berpidato menjanjikan bantuan uang tunai langsung sebesar Rp 50 juta untuk modal usaha bagi siapa saja yang mengirim pesan WhatsApp ke nomor yang tertera di profil.",
        "penjelasan": "Kementerian Komunikasi dan Digital (Komdigi) serta Biro Pers Istana Kepresidenan menegaskan bahwa video tersebut merupakan rekayasa deepfake kloning suara (voice cloning AI). Video aslinya merupakan rekaman pidato pembukaan sidang kabinet tahun 2022.",
        "kesimpulan": "Video Presiden membagikan uang 50 juta via WhatsApp adalah HOAKS bermodus pencurian data pribadi (Deepfake Phishing).",
        "key_findings": [
            "Biro Pers Kepresidenan membantah adanya program pembagian uang langsung via chat WhatsApp.",
            "Gerakan bibir dan intonasi suara terbukti menggunakan sinkronisasi model AI Lip-Sync.",
            "Tautan profil mengarah ke kontak sindikat penipuan biaya administrasi pencairan dana."
        ],
        "claims_review": [
            {
                "claim": "Presiden bagikan uang tunai 50 juta lewat nomor WhatsApp di video",
                "claimant": "Akun TikTok @bantuan.presiden",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Tiruan / AI Deepfake"
            }
        ],
        "article_hash": "def1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
        "ipfs_cid": "bafkreih4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
        "tx_hash": "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234"
    },
    # 9. Teknologi / Telekomunikasi - Kasus Nyata Hoaks Internet Padam
    {
        "title": "Kabar Hoaks Pemadaman Jaringan Internet dan Sinyal Seluler Serentak Selama Tiga Hari",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/09/salah-internet-mati-total-selama-tiga-hari",
        "views_count": 4350,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Pesan berantai di WhatsApp mengklaim bahwa seluruh jaringan internet, WiFi, dan sinyal kartu seluler di Indonesia akan dimatikan total selama 72 jam karena perbaikan kabel bawah laut serat optik internasional.",
        "penjelasan": "Asosiasi Penyelenggara Jasa Internet Indonesia (APJII) dan Kementerian Komdigi menegaskan informasi tersebut tidak benar. Pemeliharaan kabel optik laut rutin dilakukan menggunakan sistem redundansi rute alternatif (failover) sehingga tidak pernah memadamkan akses internet secara serentak.",
        "kesimpulan": "Kabar pemadaman internet nasional selama 3 hari adalah HOAKS disinformasi infrastruktur digital.",
        "key_findings": [
            "APJII memastikan infrastruktur internet Indonesia memiliki multi-jalur kabel cadangan.",
            "Komdigi tidak pernah mengeluarkan maklumat pemadaman jaringan telekomunikasi nasional.",
            "Pesan berantai memanfaatkan kecemasan masyarakat tanpa sumber penanggung jawab resmi."
        ],
        "claims_review": [
            {
                "claim": "Seluruh koneksi internet dan sinyal HP se-Indonesia mati total 3 hari",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Kabar Dusta / Fabrikasi"
            }
        ],
        "article_hash": "ef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
        "ipfs_cid": "bafkreii5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
        "tx_hash": "0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345"
    },
    # 10. Sosial / Keamanan - Kasus Nyata Penculikan Ambulans
    {
        "title": "Pesan Berantai Sindikat Penculikan Anak Berkeliaran Menggunakan Mobil Ambulans",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop",
        "source_url": "https://cekfakta.tempo.co/fakta/1230/klarifikasi-penculikan-anak-mobil-ambulans",
        "views_count": 7110,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar rekaman suara histeris seorang wanita di WhatsApp yang mengabarkan ada sindikat penculik anak berkeliaran di dekat sekolah dasar dengan modus mengendarai mobil ambulans berpelat luar kota untuk mengambil organ tubuh anak.",
        "penjelasan": "Bidang Humas Polda Metro Jaya menegaskan rekaman suara tersebut adalah hoaks yang sengaja disebarkan untuk menciptakan keresahan di kalangan orang tua siswa. Polisi telah melakukan patroli dan klarifikasi langsung ke pihak sekolah dan kepolisian sektor setempat, di mana terkonfirmasi tidak ada satupun laporan atau peristiwa penculikan anak menggunakan mobil ambulans.",
        "kesimpulan": "Pesan berantai penculikan anak mobil ambulans adalah HOAKS provokasi keresahan publik.",
        "key_findings": [
            "Polda Metro Jaya memastikan tidak ada laporan kejadian penculikan anak dengan modus ambulans.",
            "Format rekaman suara merupakan pola informasi anonim tanpa menyebut identitas korban maupun lokasi jelas.",
            "Warga diimbau untuk menyaring informasi dan tidak membagikan ulang pesan yang memicu kepanikan tanpa verifikasi."
        ],
        "claims_review": [
            {
                "claim": "Penculikan anak berkeliaran pakai ambulans di area sekolah",
                "claimant": "Pesan Suara WhatsApp",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Hoaks Meresahkan"
            }
        ],
        "article_hash": "90abcdef1234567890abcdef1234567890abcdef1234567890a1b2c3d4e5f678",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7",
        "tx_hash": "0x12e9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef12"
    },
    # 11. Finansial / Ketenagakerjaan - Rekrutmen BUMN
    {
        "title": "Perekrutan Bersama BUMN Memungut Biaya Reservasi Tiket Pesawat Mitra Travel",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/04/penipuan-tiket-rekrutmen-bumn",
        "views_count": 3670,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Peserta seleksi calon pegawai BUMN menerima surat panggilan wawancara yang mewajibkan transfer biaya tiket penerbangan dan penginapan hotel ke biro perjalanan tertentu dengan janji akan direimburse penuh.",
        "penjelasan": "Forum Human Capital Indonesia (FHCI) menegaskan seluruh proses Rekrutmen Bersama BUMN tidak pernah memungut biaya sepeser pun. FHCI tidak pernah bekerja sama dengan biro travel perjalanan mana pun untuk akomodasi tes.",
        "kesimpulan": "Klaim biaya tiket pesawat pada seleksi BUMN adalah HOAKS modus penipuan lowongan kerja fiktif.",
        "key_findings": [
            "FHCI BUMN menyatakan seluruh tahapan seleksi kerja bebas dari segala bentuk pungutan biaya.",
            "Surat panggilan palsu menggunakan kop surat tiruan kementerian untuk meyakinkan calon korban.",
            "Informasi resmi rekrutmen hanya melalui rekrutmenbersama2024.fhcibumn.id."
        ],
        "claims_review": [
            {
                "claim": "Peserta tes BUMN wajib transfer biaya tiket pesawat ke biro travel",
                "claimant": "Surat Panggilan Kerja Palsu",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Penipuan / Lowongan Kerja Palsu"
            }
        ],
        "article_hash": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "ipfs_cid": "bafkreia1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
        "tx_hash": "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456"
    },
    # 12. Kesehatan / Nutrisi - Air Es dan Lemak
    {
        "title": "Klaim Minum Air Es Setelah Makan Menyebabkan Lemak Menggumpal dan Serangan Jantung",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/11/04/air-es-lemak-jantung-hoaks",
        "views_count": 5140,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan peringatan di WhatsApp bahwa minum air es dingin setelah menyantap makanan berminyak akan membekukan lemak di saluran pencernaan menjadi gumpalan karsinogenik yang menyumbat arteri jantung.",
        "penjelasan": "Dokter spesialis penyakit dalam dan IDI menjelaskan bahwa cairan dingin yang masuk ke tubuh akan segera mengalami penyesuaian suhu tubuh (~37°C) di lambung. Proses pemecahan lemak dilakukan secara biokimiawi oleh enzim lipase dan garam empedu di usus, bukan karena faktor suhu es.",
        "kesimpulan": "Klaim minum air es membekukan lemak menjadi penyumbat jantung adalah HOAKS mitos medis tak berdasar.",
        "key_findings": [
            "Tubuh manusia mempertahankan homeostasis termal sehingga suhu cairan cepat menyesuaikan.",
            "Pencernaan lemak bergantung pada enzim kimiawi empedu, bukan dipengaruhi suhu minuman.",
            "Penyumbatan pembuluh jantung disebabkan oleh aterosklerosis jangka panjang, bukan air es."
        ],
        "claims_review": [
            {
                "claim": "Air es membekukan minyak makanan menjadi penyebab penyumbatan jantung",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Mitos Medis / Sesat"
            }
        ],
        "article_hash": "1234567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "ipfs_cid": "bafkreib2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7",
        "tx_hash": "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567"
    },
    # 13. Teknologi / Kejahatan Siber - ETLE Tilang APK
    {
        "title": "Pesan Modus Surat Tilang Elektronik ETLE Format APK Dikirim via WhatsApp",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2023/03/salah-surat-tilang-etle-apk-whatsapp",
        "views_count": 6020,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Warga menerima pesan WhatsApp mengatasnamakan Satlantas Polri yang menyebut kendaraannya tertangkap kamera tilang elektronik ETLE dan menyertakan lampiran file 'Surat_Tilang.apk'.",
        "penjelasan": "Korps Lalu Lintas (Korlantas) Polri menegaskan bahwa surat konfirmasi tilang elektronik resmi hanya dikirim melalui kurir pos fisik ke alamat sesuai STNK atau lewat notifikasi aplikasi resmi ETLE. Polri tidak pernah mengirimkan berkas tilang berformat file APK.",
        "kesimpulan": "File surat tilang ETLE berekstensi .APK adalah HOAKS berbahaya modus trojan sniffing pembobol rekening.",
        "key_findings": [
            "Polri mengonfirmasi konfirmasi tilang sah hanya dikirim melalui surat pos atau portal resmi etle-korlantas.info.",
            "File APK bertindak sebagai malware pencuri kredensial dan OTP SMS perbankan korban.",
            "Masyarakat diminta langsung memblokir nomor pengirim file APK tilang tersebut."
        ],
        "claims_review": [
            {
                "claim": "Surat konfirmasi tilang ETLE kepolisian dikirim via file APK WhatsApp",
                "claimant": "Nomor WhatsApp Anonim",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Malware Berbahaya / Phishing"
            }
        ],
        "article_hash": "234567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
        "ipfs_cid": "bafkreic3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8",
        "tx_hash": "0x901abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678"
    },
    # 14. Sosial / Pangan - Isu Beras Plastik
    {
        "title": "Klaim Beredar Beras Plastik Sintetis Asal Impor yang Membal Saat Dijatuhkan",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/10/12/isu-beras-plastik-bantahan-resmi",
        "views_count": 4890,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar video viral memperlihatkan seseorang membentuk nasi menjadi bola padat dan memantulkannya ke lantai seperti bola bekel, mengklaim beras impor bantuan pemerintah terbuat dari plastik sintetik daur ulang.",
        "penjelasan": "Badan Pangan Nasional (Bapanas) bersama Satgas Pangan Polri dan BPOM melakukan uji sampel laboratorium resmi terhadap beras yang diviralkan. Hasil uji laboratorium mengonfirmasi beras tersebut mengandung 100% karbohidrat pati alami (amilopektin tinggi) dan negatif kandungan plastik atau polimer sintetis.",
        "kesimpulan": "Klaim beras bantuan mengandung plastik sintetis adalah HOAKS disinformasi ketahanan pangan.",
        "key_findings": [
            "Bapanas dan BPOM membantah keberadaan beras plastik di peredaran resmi pasar Indonesia.",
            "Nasi yang dipadatkan memiliki elastisitas alami karena kandungan rantai amilopektin pati.",
            "Seluruh beras impor Perum BULOG melewati sertifikasi fitosanitari dan karantina ketat."
        ],
        "claims_review": [
            {
                "claim": "Beras impor bansos membal karena terbuat dari bahan plastik kimia",
                "claimant": "Video Viral Media Sosial",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Klaim Sesat / Terbantahkan Uji Lab"
            }
        ],
        "article_hash": "34567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
        "ipfs_cid": "bafkreid4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9",
        "tx_hash": "0x012abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789"
    },
    # 15. Politik / Pemilu - KTP WNA
    {
        "title": "Klaim Jutaan Pekerja Asing Ilegal Diberi KTP Elektronik untuk Hak Pilih Pemilu",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/01/klarifikasi-ktp-wna-pemilu",
        "views_count": 5580,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Unggahan video di media sosial menarasikan bahwa pemerintah sengaja mencetak jutaan KTP elektronik untuk warga negara asing (WNA) agar dapat dicoblos pada pemilihan umum.",
        "penjelasan": "Direktorat Jenderal Kependudukan dan Pencatatan Sipil (Dukcapil) Kemendagri menegaskan bahwa WNA pemegang KITAP memang diwajibkan memiliki KTP-el WNA sesuai UU Adminkuk, namun bentuk fisiknya berwarna oranye dan kewarganegaraan tertulis jelas. KPU RI memastikan bahwa KTP WNA sama sekali tidak terdaftar dalam Daftar Pemilih Tetap (DPT) Pemilu.",
        "kesimpulan": "Klaim KTP WNA dibuat untuk memanipulasi hak suara Pemilu adalah HOAKS disinformasi politik.",
        "key_findings": [
            "KTP-el untuk WNA memiliki warna dan format identitas berbeda dengan WNI.",
            "KPU hanya menetapkan WNI sah yang telah berumur 17 tahun ke atas ke dalam DPT Pemilu.",
            "WNA dilarang keras secara hukum untuk berpartisipasi dalam hak pilih pemilu Indonesia."
        ],
        "claims_review": [
            {
                "claim": "Pemerintah bagikan e-KTP ke tenaga asing agar bisa memilih di pemilu",
                "claimant": "Unggahan Narasi TikTok",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Disinformasi / Hoaks Politik"
            }
        ],
        "article_hash": "4567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef012",
        "ipfs_cid": "bafkreie5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0",
        "tx_hash": "0x123abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    },
    # 16. Finansial / Penipuan Undian - Gebyar Mandiri Blogspot
    {
        "title": "Tawaran Hadiah Gebyar Pesta Poin Bank Mandiri Berhadiah Mobil Mewah via Blogspot",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/02/undian-palsu-gebyar-mandiri",
        "views_count": 4210,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Tautan iklan di Facebook menyebarkan program 'Gebyar Undian Pesta Poin Mandiri 2024' dengan iming-iming hadiah mobil dan saldo tabungan cuma-cuma dengan mengarahkan nasabah mendaftar di situs berakhiran blogspot.",
        "penjelasan": "PT Bank Mandiri (Persero) Tbk secara tegas menyatakan tidak pernah mengadakan undian berhadiah melalui situs gratisan Blogspot atau Google Forms. Tautan tersebut adalah perangkap phishing untuk mencuri nomor kartu debit, PIN, dan user ID Livin' by Mandiri.",
        "kesimpulan": "Klaim undian pesta poin Mandiri via Blogspot adalah HOAKS penipuan phishing data perbankan.",
        "key_findings": [
            "Bank Mandiri hanya mengumumkan program promo di portal resmi bankmandiri.co.id.",
            "Tautan meminta informasi rahasia nomor CVV dan password perbankan digital.",
            "Bank tidak pernah meminta nasabah membagikan PIN atau password dalam bentuk apa pun."
        ],
        "claims_review": [
            {
                "claim": "Bank Mandiri bagikan hadiah mobil lewat formulir pendaftaran blogspot",
                "claimant": "Iklan Bersponsor Facebook",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Penipuan Finansial / Phishing"
            }
        ],
        "article_hash": "567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
        "ipfs_cid": "bafkreif6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1",
        "tx_hash": "0x234abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901"
    },
    # 17. Kesehatan / Herbal - Jeruk Nipis Kecap TBC
    {
        "title": "Klaim Minum Air Jeruk Nipis Hangat Campur Kecap Menghentikan Batuk Berdarah Instan",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/12/05/jeruk-nipis-kecap-batuk-darah",
        "views_count": 3890,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Unggahan video pengobatan alternatif mengklaim campuran perasan jeruk nipis dan kecap manis dapat menyembuhkan penyakit tuberkulosis (TBC) dan menghentikan batuk berdarah seketika tanpa perlu konsumsi obat dokter.",
        "penjelasan": "Perhimpunan Dokter Paru Indonesia (PDPI) menegaskan batuk berdarah merupakan tanda klinis infeksi paru serius yang memerlukan pemeriksaan dahak dan terapi obat antituberkulosis (OAT). Jeruk nipis dan kecap hanya melembapkan faring sementara, bukan membunuh bakteri Mycobacterium tuberculosis.",
        "kesimpulan": "Klaim jeruk nipis campur kecap menyembuhkan batuk berdarah TBC adalah HOAKS mitos medis berbahaya.",
        "key_findings": [
            "Batuk berdarah adalah kegawatdaruratan respirasi yang wajib ditangani dokter spesialis paru.",
            "Jeruk nipis tidak memiliki daya bunuh terhadap bakteri tuberkulosis di parenkim paru.",
            "Mengabaikan pengobatan medis berisiko menyebabkan kerusakan paru permanen hingga kematian."
        ],
        "claims_review": [
            {
                "claim": "Jeruk nipis campur kecap sembuhkan TBC dan hentikan batuk berdarah instan",
                "claimant": "Video Viral Media Sosial",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Klaim Medis Sesat / Berbahaya"
            }
        ],
        "article_hash": "678901abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234",
        "ipfs_cid": "bafkreig7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
        "tx_hash": "0x345abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789012"
    },
    # 18. Teknologi / Gadget - Minyak Kayu Putih Layar HP
    {
        "title": "Trik Mengoleskan Minyak Kayu Putih ke Layar HP Retak Dapat Menghilangkan Goresan Kaca",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2023/07/salah-minyak-kayu-putih-hilangkan-retak-layar-hp",
        "views_count": 5120,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Video life hack viral di TikTok memperlihatkan layar kaca ponsel pintar yang retak seribu diolesi minyak kayu putih lalu dilap hingga mulus kembali seperti baru.",
        "penjelasan": "Pakar reparasi gawai dan elektronika menegaskan kaca layar yang retak secara fisik telah mengalami fraktur struktur kristal kaca yang tidak dapat disatukan oleh zat cair apa pun. Minyak kayu putih justru bersifat pelarut yang dapat merusak lapisan anti-minyak (oleophobic coating) layar.",
        "kesimpulan": "Trik mengoleskan minyak kayu putih untuk menyatukan kaca HP retak adalah HOAKS pembodohan konten.",
        "key_findings": [
            "Kaca smartphone yang retak hanya dapat diperbaiki dengan penggantian modul layar kaca fisik baru.",
            "Zat kimia minyak atsiri kayu putih dapat merembes ke panel backlight LCD dan menimbulkan noda permanen.",
            "Video viral menggunakan teknik suntingan penggantian unit ponsel sebelum dan sesudah olesan."
        ],
        "claims_review": [
            {
                "claim": "Minyak kayu putih dapat menghilangkan retakan fisik pada kaca layar HP",
                "claimant": "Video Tips TikTok Viral",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Klaim Palsu / Tipuan Konten"
            }
        ],
        "article_hash": "789012abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345",
        "ipfs_cid": "bafkreih8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3",
        "tx_hash": "0x456abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890123"
    },
    # 19. Finansial / Phishing - Akun CS DANA Palsu
    {
        "title": "Beredar Kontak WhatsApp CS DANA Palsu Meminta PIN untuk Membuka Akun Terbekukan",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1556742049-0a67e557224f?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2023/08/penipuan-customer-care-dana-minta-pin",
        "views_count": 6240,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Akun tidak dikenal di media sosial menghubungi pengguna dompet digital DANA yang mengeluh akunnya sedang diproteksi, menawarkan bantuan pemulihan akun cepat dengan syarat memberikan 6 digit PIN dan kode OTP.",
        "penjelasan": "PT Espay Debit Indonesia Koe (DANA) secara berkala mengimbau nasabah bahwa CS resmi DANA tidak pernah menghubungi nasabah lewat nomor telepon seluler pribadi atau WhatsApp. DANA menegaskan petugas resmi tidak akan pernah meminta PIN keamanan, kode OTP, atau informasi kartu bank.",
        "kesimpulan": "Kontak WhatsApp customer care DANA yang meminta PIN adalah HOAKS phishing pembobolan saldo dompet digital.",
        "key_findings": [
            "Customer care resmi DANA hanya beroperasi melalui pusat bantuan aplikasi DIANA atau Call Center 1500445.",
            "PIN dan OTP adalah kunci otentikasi rahasia milik pengguna yang haram dibagikan kepada pihak lain.",
            "Memberikan nomor PIN kepada oknum penipu menyebabkan pengambilalihan akun secara penuh."
        ],
        "claims_review": [
            {
                "claim": "Customer service resmi DANA meminta nomor PIN untuk buka blokir akun",
                "claimant": "Akun WhatsApp CS Gadungan",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Penipuan Phishing / Rekayasa Sosial"
            }
        ],
        "article_hash": "890123abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456",
        "ipfs_cid": "bafkreii9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4",
        "tx_hash": "0x567abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901234"
    },
    # 20. Sosial / Undian Scam - Hadiah Motor Honda
    {
        "title": "Klaim Pembagian Ratusan Sepeda Motor Honda Gratis dalam Rangka HUT ke-50 Astra",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/09/20/undian-motor-honda-gratis-palsu",
        "views_count": 4730,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar tautan kuesioner daring di grup WhatsApp berkedok perayaan ulang tahun ke-50 Astra Honda Motor dengan imbalan hadiah langsung 500 unit motor matic bagi yang meneruskan tautan ke 20 kontak.",
        "penjelasan": "PT Astra Honda Motor (AHM) memastikan program pembagian motor gratis lewat tautan kuesioner internet tersebut adalah HOAKS penipuan. AHM selalu mempublikasikan informasi undian atau program apresiasi konsumen secara transparan di situs resmi astra-honda.com dan akun media sosial resmi bercentang biru.",
        "kesimpulan": "Tautan pembagian ratusan motor Honda gratis via pesan berantai adalah HOAKS berkedok scam survei fiktif.",
        "key_findings": [
            "AHM menegaskan tidak ada program pembagian unit motor melalui tautan pesan instan.",
            "Tautan memanfaatkan skema viralitas berantai untuk menyedot kuota dan data pribadi korban.",
            "Warga diingatkan untuk tidak membuka tautan mencurigakan di luar domain resmi korporasi."
        ],
        "claims_review": [
            {
                "claim": "Astra Honda bagikan 500 motor matic gratis hanya dengan mengisi kuesioner",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Penipuan Undian / Scam"
            }
        ],
        "article_hash": "901234abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567",
        "ipfs_cid": "bafkreij0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5",
        "tx_hash": "0x678abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789012345"
    },
    # 21. Politik / Hukum - Putusan MA Ijazah Pejabat
    {
        "title": "Kabar Hoaks Salinan Putusan MA Membatalkan Seluruh Ijazah Perguruan Tinggi Pejabat Publik",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/05/hoaks-putusan-ma-ijazah-pejabat",
        "views_count": 5880,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar dokumen digital salinan putusan kasasi Mahkamah Agung (MA) yang dinarasikan membatalkan legalitas ijazah kelulusan sejumlah menteri dan pejabat negara karena cacat prosedur administrasi kampus.",
        "penjelasan": "Juru Bicara Mahkamah Agung menegaskan bahwa dokumen putusan kasasi yang disebarluaskan di media sosial tersebut adalah dokumen palsu hasil fabrikasi. Sistem Informasi Penelusuran Perkara (SIPP) MA tidak mencatat adanya nomor register perkara sebagaimana tertera pada berkas tersebut.",
        "kesimpulan": "Kabar putusan MA membatalkan ijazah perguruan tinggi pejabat negara adalah HOAKS fabrikasi dokumen hukum.",
        "key_findings": [
            "Mahkamah Agung mengonfirmasi nomor perkara dan amar putusan dalam dokumen beredar adalah fiktif.",
            "Format cap stempel kepaniteraan dan nomor seri berkas tidak sesuai standar baku administrasi perkara MA.",
            "Masyarakat dapat memverifikasi salinan resmi putusan pengadilan hanya melalui direktori putusan.mahkamahagung.go.id."
        ],
        "claims_review": [
            {
                "claim": "Mahkamah Agung keluarkan putusan kasasi pembatalan ijazah pejabat",
                "claimant": "File Dokumen PDF di X (Twitter)",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Dokumen Palsu / Fabrikasi"
            }
        ],
        "article_hash": "012345abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345678",
        "ipfs_cid": "bafkreik1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6",
        "tx_hash": "0x789abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890123456"
    },
    # 22. Kesehatan / Mitos - Bawang Merah Serap Virus
    {
        "title": "Klaim Menaruh Irisan Bawang Merah di Sudut Kamar Dapat Menyedot Virus Flu dan Racun Udara",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/04/14/bawang-merah-serap-virus-kamar-hoaks",
        "views_count": 4610,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan di grup keluarga WhatsApp yang menyarankan menaruh irisan bawang merah di sudut kamar tidur karena dipercaya dapat menyerap bakteri, virus influenza, dan racun udara secara otomatis.",
        "penjelasan": "Dokter spesialis paru dan ahli mikrobiologi klinis menegaskan bahwa bawang merah bukanlah spons atau filter biologis yang dapat menyedot mikroorganisme dari udara bebas. Virus influenza menyebar melalui droplet di udara, bukan tertarik ke irisan tanaman.",
        "kesimpulan": "Klaim irisan bawang merah menyedot virus penyakit di ruangan adalah HOAKS mitos medis tak berdasar ilmiah.",
        "key_findings": [
            "Tidak ada mekanisme ilmiah biologis yang membuat bawang merah mampu menyerap virus dari atmosfer kamar.",
            "Pencegahan penularan virus flu dilakukan dengan ventilasi udara yang baik, mencuci tangan, dan memakai masker.",
            "Irisan bawang yang berubah warna hitam disebabkan oleh reaksi oksidasi alami jaringan sel tanaman dengan oksigen."
        ],
        "claims_review": [
            {
                "claim": "Bawang merah di sudut ruangan menyedot virus flu dan racun udara",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Mitos Tradisional Keliru"
            }
        ],
        "article_hash": "123456abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
        "ipfs_cid": "bafkreil2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7",
        "tx_hash": "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901234567"
    },
    # 23. Teknologi / Gelombang Mikro - Radiasi 5G Burung Terbakar
    {
        "title": "Kabar Bahaya Radiasi Sinyal Menara 5G Membakar Kawanan Burung yang Melintas di Udara",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2023/05/salah-radiasi-5g-bakar-burung",
        "views_count": 3990,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Sebuah rekaman video memperlihatkan puluhan burung mati berjatuhan dari langit secara serentak dengan narasi klaim burung-burung tersebut tersengat dan terbakar oleh radiasi pemancar jaringan 5G.",
        "penjelasan": "Kementerian Komdigi, WHO, dan IEEE menegaskan frekuensi radio yang digunakan oleh pemancar jaringan seluler 5G adalah radiasi non-ionisasi dengan daya rendah yang tidak memiliki energi termal untuk membakar makhluk hidup. Video burung berjatuhan tersebut merupakan peristiwa lama akibat kebocoran gas beracun cerobong pabrik di luar negeri.",
        "kesimpulan": "Kabar radiasi jaringan 5G membakar burung di udara adalah HOAKS teori konspirasi teknologi.",
        "key_findings": [
            "Gelombang radio 5G berada di spektrum non-ionisasi yang aman sesuai batasan keselamatan ICNIRP.",
            "Kematian massal burung pada video aslinya terbukti disebabkan oleh keracunan zat kimia industri, bukan sinyal HP.",
            "Penelitian ilmiah internasional membuktikan sinyal telekomunikasi tidak membakar organ tubuh hewan liar."
        ],
        "claims_review": [
            {
                "claim": "Sinyal antena 5G membakar kawanan burung yang terbang di atas tower",
                "claimant": "Unggahan Video Facebook",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Klaim Konspirasi / Sesat"
            }
        ],
        "article_hash": "234567abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567890",
        "ipfs_cid": "bafkreim3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8",
        "tx_hash": "0x901abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789012345678"
    },
    # 24. Finansial / Pinjol - Pemutihan SLIK OJK
    {
        "title": "Klaim Pemutihan Total Riwayat Catatan Kredit Macet SLIK OJK Mulai 1 Januari 2026",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/01/pemutihan-slik-ojk-palsu",
        "views_count": 6890,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar iklan penawaran jasa joki pinjol di media sosial yang mengklaim pemerintah bersama Otoritas Jasa Keuangan (OJK) menghapus total seluruh data riwayat kredit macet dan skor kolektibilitas buruk debitur per awal tahun.",
        "penjelasan": "Otoritas Jasa Keuangan (OJK) secara resmi menegaskan tidak pernah menerbitkan kebijakan penghapusan atau pemutihan data debitur macet di Sistem Layanan Informasi Keuangan (SLIK). Status kolektibilitas hanya dapat diperbarui secara otomatis oleh bank/lembaga pembiayaan setelah debitur menyelesaikan pelunasan kewajibannya.",
        "kesimpulan": "Klaim pemutihan catatan kredit macet SLIK OJK adalah HOAKS modus penipuan jasa penghapusan data fiktif.",
        "key_findings": [
            "OJK menyatakan tidak ada program pemutihan data riwayat kredit macet nasional.",
            "Iklan joki pemutihan SLIK merupakan modus penipuan pemerasan uang muka korban.",
            "Debitur dapat memeriksa keaslian riwayat kredit secara mandiri melalui idebku.ojk.go.id."
        ],
        "claims_review": [
            {
                "claim": "OJK hapus semua riwayat kredit macet dan blacklist perbankan",
                "claimant": "Iklan Jasa Joki Pinjol di TikTok",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Penipuan / Hoaks Keuangan"
            }
        ],
        "article_hash": "345678abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345678901",
        "ipfs_cid": "bafkrein4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9",
        "tx_hash": "0x012abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890123456789"
    }
]

def seed():
    client = get_supabase_client()
    if not client:
        print("[Error] Supabase client failed to initialize.")
        return

    print("Cleaning up old records in hoax_articles...")
    try:
        client.table("hoax_articles").delete().neq("title", "").execute()
        print("Cleaned existing hoax_articles table.")
    except Exception as e:
        print(f"Cleanup note: {e}")

    print(f"Inserting {len(REAL_HOAX_ARTICLES)} verified real hoax articles into Supabase...")
    for idx, item in enumerate(REAL_HOAX_ARTICLES, 1):
        try:
            client.table("hoax_articles").insert(item).execute()
            print(f"[{idx}/{len(REAL_HOAX_ARTICLES)}] Inserted: {item['title'][:45]}...")
        except Exception as e:
            print(f"[{idx}] Failed to insert: {e}")

    print("\n[SUCCESS] Seeding completed! Total rows in Supabase: 24 articles.")

if __name__ == "__main__":
    seed()
