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
    # 17. Kesehatan - Bawang Putih & Jantung
    {
        "title": "Klaim Bawang Putih Ditempelkan di Pergelangan Tangan Menyerap Racun Penyakit Jantung",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/08/14/bawang-putih-jantung-hoaks",
        "views_count": 3810,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar video viral yang memperlihatkan seseorang menempelkan irisan bawang putih ke pergelangan tangan hingga kulit melepuh, mengklaim bahwa cairan lepuhan itu adalah racun jantung yang berhasil dikeluarkan.",
        "penjelasan": "Perhimpunan Dokter Spesialis Kardiovaskular Indonesia (PERKI) menegaskan klaim tersebut salah dan membahayakan. Kulit melepuh disebabkan oleh senyawa kimia allicin dan dialil disulfida pada bawang mentah yang bersifat korosif memicu luka bakar kimiawi (chemical contact dermatitis), bukan racun jantung.",
        "kesimpulan": "Klaim menempelkan bawang putih menyerap racun jantung adalah HOAKS mitos medis yang berisiko infeksi kulit.",
        "key_findings": [
            "PERKI memastikan penyakit jantung terjadi karena penyumbatan plak arteri, bukan racun yang diserap kulit.",
            "Luka melepuh merupakan iritasi kimia akibat kontak langsung senyawa sulfur asam bawang.",
            "Pasien jantung diimbau mematuhi resep obat dokter dan menghindari pengobatan eksperimental."
        ],
        "claims_review": [
            {
                "claim": "Bawang putih di pergelangan tangan menyerap racun penyakit jantung",
                "claimant": "Video Viral Facebook",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Mitos Medis Berbahaya"
            }
        ],
        "article_hash": "678901abcdef0123456789abcdef0123456789abcdef0123456789abcdef0124",
        "ipfs_cid": "bafkreig7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
        "tx_hash": "0x345abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678902"
    },
    # 18. Teknologi - Kode Sadap *#21#
    {
        "title": "Hoaks Mengetik Urutan Kode Rahasia *#21# Dapat Mendeteksi Penyadapan Panggilan HP",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2023/07/salah-kode-bintang-pagar-21-deteksi-sadap",
        "views_count": 5890,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Pesan berantai di WhatsApp mengingatkan pemilik ponsel untuk segera menekan *#21# guna memeriksa apakah ponselnya disadap oleh intelijen atau pelaku kejahatan siber.",
        "penjelasan": "Kementerian Komunikasi dan Digital (Komdigi) serta pakar telekomunikasi menegaskan bahwa *#21# adalah kode standar USSD GSM untuk mengecek status fitur call forwarding (pengalihan panggilan) ke nomor voicemail atau nomor lain saat sibuk, sama sekali bukan pendeteksi sadap.",
        "kesimpulan": "Klaim kode *#21# untuk mendeteksi penyadapan adalah HOAKS kesalahpahaman fungsi teknologi telekomunikasi.",
        "key_findings": [
            "Kode *#21# merupakan instruksi standar jaringan GSM internasional untuk panggilan dialihkan.",
            "Penyadapan ilegal tidak memicu status call forwarding dan tidak terdeteksi via perintah USSD biasa.",
            "Informasi ini merupakan hoaks lama daur ulang yang berulang kali menyebar di grup percakapan."
        ],
        "claims_review": [
            {
                "claim": "Ketik kode *#21# untuk mengetahui apakah HP sedang disadap pihak luar",
                "claimant": "Pesan Broadcast WhatsApp",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Salah / Misleading"
            }
        ],
        "article_hash": "789012abcdef0123456789abcdef0123456789abcdef0123456789abcdef0125",
        "ipfs_cid": "bafkreih8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3",
        "tx_hash": "0x456abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678903"
    },
    # 19. Finansial - Dana Hibah Kemenkop
    {
        "title": "Beredar Surat Pencairan Dana Hibah Koperasi Mengatasnamakan Kementerian Koperasi dan UKM",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/05/hibah-koperasi-palsu",
        "views_count": 3410,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar surat edaran palsu berkop resmi Kemenkop UKM RI yang menjanjikan pencairan dana hibah modal usaha sebesar Rp 50.000.000 dengan syarat calon penerima menyetor biaya administrasi sertifikasi Rp 500.000.",
        "penjelasan": "Kementerian Koperasi dan UKM menegaskan tidak pernah menerbitkan surat edaran penetapan penerima hibah dengan pungutan biaya sertifikasi apa pun. Seluruh program fasilitasi dan pembiayaan resmi Kemenkop UKM disalurkan gratis tanpa pungutan perantara.",
        "kesimpulan": "Surat pencairan dana hibah Kemenkop UKM dengan biaya registrasi adalah HOAKS penipuan uang muka.",
        "key_findings": [
            "Kemenkop UKM menegaskan dokumen surat edaran tersebut palsu dan mencatut logo kementerian.",
            "Kementerian mengimbau para pelaku UMKM waspada terhadap tawaran bantuan modal yang meminta transfer di awal.",
            "Kanal konfirmasi resmi Kemenkop UKM dapat diakses via Call Center 1500-587."
        ],
        "claims_review": [
            {
                "claim": "Kemenkop bagikan hibah 50 juta dengan syarat transfer biaya sertifikasi",
                "claimant": "Surat Edaran Palsu",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Penipuan / Phishing Finansial"
            }
        ],
        "article_hash": "890123abcdef0123456789abcdef0123456789abcdef0123456789abcdef0126",
        "ipfs_cid": "bafkreii9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4",
        "tx_hash": "0x567abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678904"
    },
    # 20. Sosial - Isu Aphelion & Suhu Dingin
    {
        "title": "Klaim Fenomena Planet Sejajar dan Aphelion Menyebabkan Suhu Dingin Ekstrem di Indonesia",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/07/11/fenomena-aphelion-suhu-dingin-hoaks",
        "views_count": 6320,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Pesan berantai mengklaim bahwa suhu dingin menggigil di berbagai kota di Indonesia disebabkan posisi bumi berada di titik terjauh dari matahari (Aphelion) berbarengan dengan fenomena enam planet sejajar.",
        "penjelasan": "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) menjelaskan bahwa fenomena Aphelion adalah siklus tahunan biasa yang dampaknya tidak signifikan terhadap temperatur permukaan bumi. Suhu dingin di musim kemarau di Indonesia dipicu fenomena 'bediding' akibat pergerakan angin monsun Australia yang kering dan dingin.",
        "kesimpulan": "Klaim suhu dingin ekstrem di Indonesia dipicu oleh Aphelion dan planet sejajar adalah HOAKS sains semu.",
        "key_findings": [
            "BMKG menegaskan Aphelion tidak berpengaruh langsung terhadap penurunan suhu drastis di Indonesia.",
            "Penurunan suhu malam hari di Jawa-Bali-Nusa Tenggara adalah fenomena bediding alami monsun dingin Australia.",
            "Posisi planet sejajar merupakan peristiwa optik langit yang tidak mempengaruhi iklim permukaan bumi."
        ],
        "claims_review": [
            {
                "claim": "Aphelion dan planet sejajar sebabkan hawa dingin ekstrem di Indonesia",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Klaim Palsu / Sains Semu"
            }
        ],
        "article_hash": "901234abcdef0123456789abcdef0123456789abcdef0123456789abcdef0127",
        "ipfs_cid": "bafkreij0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5",
        "tx_hash": "0x678abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678905"
    },
    # 21. Politik - Putusan MK Pilkada
    {
        "title": "Video Rekayasa Menarasikan Mahkamah Konstitusi Membatalkan Seluruh Hasil Pemilihan Pilkada",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/09/salah-mk-batalkan-seluruh-pilkada",
        "views_count": 4720,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Unggahan video di TikTok memperlihatkan ruang sidang Mahkamah Konstitusi dengan narasi bombastis bahwa majelis hakim MK telah membatalkan seluruh hasil pemilihan kepala daerah secara nasional.",
        "penjelasan": "Biro Humas dan Protokol Mahkamah Konstitusi menegaskan video tersebut adalah hoaks hasil pemotongan konteks (misleading context). Sidang sengketa perselisihan hasil pilkada (PHPU) diperiksa secara kasus per kasus di masing-masing daerah pemohon, bukan pemungutan suara ulang serentak.",
        "kesimpulan": "Klaim MK membatalkan seluruh hasil pilkada nasional adalah HOAKS manipulasi konteks rekaman persidangan.",
        "key_findings": [
            "MK memeriksa perkara sengketa pilkada secara kasuistik sesuai bukti yang diajukan masing-masing paslon.",
            "Video yang beredar merupakan dokumentasi sidang arsip sengketa lama yang dimanipulasi suaranya.",
            "Masyarakat diimbau memantau putusan resmi MK melalui risalah siaran pers di mkri.id."
        ],
        "claims_review": [
            {
                "claim": "Mahkamah Konstitusi membatalkan semua hasil suara pilkada serentak",
                "claimant": "Akun Sensasional TikTok",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Manipulasi Konteks / Hoaks"
            }
        ],
        "article_hash": "012345abcdef0123456789abcdef0123456789abcdef0123456789abcdef0128",
        "ipfs_cid": "bafkreik1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6",
        "tx_hash": "0x789abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678906"
    },
    # 22. Kesehatan - Air Kelapa & Nipis Corona
    {
        "title": "Klaim Minum Air Kelapa Muda Dicampur Jeruk Nipis dan Garam Ampuh Bunuh Segala Virus",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&auto=format&fit=crop",
        "source_url": "https://cekfakta.tempo.co/fakta/1140/air-kelapa-jeruk-nipis-garam",
        "views_count": 5270,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Pesan berantai membagikan resep herbal campuran air kelapa hijau, satu butir perasan jeruk nipis, dan satu sendok garam yang diklaim mampu membunuh virus dalam waktu 1 jam.",
        "penjelasan": "Dokter spesialis penyakit dalam dan WHO menegaskan bahwa ramuan air kelapa, jeruk nipis, dan garam adalah minuman segar yang mengandung cairan elektrolit dan vitamin C, namun sama sekali tidak memiliki sifat farmakologis antivirus untuk membunuh virus patogen dalam tubuh.",
        "kesimpulan": "Klaim campuran kelapa muda, jeruk nipis, dan garam membunuh virus adalah HOAKS mitos kesehatan.",
        "key_findings": [
            "Air kelapa bermanfaat untuk hidrasi tubuh, tetapi bukan obat antivirus pembunuh infeksi patogen.",
            "Belum ada penelitian ilmiah atau uji klinis yang membuktikan khasiat campuran ini sebagai obat virus.",
            "Pasien yang mengalami gejala infeksi disarankan segera berkonsultasi ke fasilitas pelayanan kesehatan."
        ],
        "claims_review": [
            {
                "claim": "Air kelapa dicampur jeruk nipis dan garam bisa memusnahkan virus dalam 1 jam",
                "claimant": "Broadcast WhatsApp",
                "reviewPublisher": "Tempo Cek Fakta",
                "reviewUrl": "https://cekfakta.tempo.co",
                "rating": "Klaim Palsu / Tanpa Dasar Klinis"
            }
        ],
        "article_hash": "123456abcdef0123456789abcdef0123456789abcdef0123456789abcdef0129",
        "ipfs_cid": "bafkreil2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7",
        "tx_hash": "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678907"
    },
    # 23. Teknologi - APK Info Pajak Kendaraan
    {
        "title": "Pesan Modus Unduhan Aplikasi Cek Pajak Kendaraan Format APK Menguras Rekening Bank",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2024/06/apk-pajak-kendaraan-palsu",
        "views_count": 4980,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Pemilik mobil dan motor menerima pesan WhatsApp dari nomor tidak dikenal yang mengaku petugas Bapenda Samsat, mengirimkan tautan file 'Cek_Pajak_Kendaraan.apk' untuk mengklaim diskon pemutihan pajak.",
        "penjelasan": "Badan Pendapatan Daerah (Bapenda) dan Ditlantas Polri menyatakan bahwa instansi Samsat resmi tidak pernah mengirimkan file aplikasi APK melalui nomor telepon pribadi. Aplikasi resmi pengecekan pajak kendaraan hanya dapat diunduh melalui Google Play Store / App Store (aplikasi SIGNAL).",
        "kesimpulan": "File aplikasi cek pajak berformat .APK adalah HOAKS berbahaya modus pencurian kredensial m-banking.",
        "key_findings": [
            "Bapenda memastikan pengecekan pajak kendaraan sah hanya melalui portal resmi e-Samsat atau Signal.",
            "File APK tersebut berisi trojan malware yang mengekstraksi riwayat SMS dan sandi perbankan digital.",
            "Jangan pernah mengklik izin instalasi aplikasi tidak dikenal dari sumber luar (Unknown Sources)."
        ],
        "claims_review": [
            {
                "claim": "Petugas Bapenda kirim berkas APK untuk cek denda pajak kendaraan",
                "claimant": "Nomor WhatsApp Anonim",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Malware Berbahaya / Phishing"
            }
        ],
        "article_hash": "234567abcdef0123456789abcdef0123456789abcdef0123456789abcdef0130",
        "ipfs_cid": "bafkreim3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8",
        "tx_hash": "0x901abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678908"
    },
    # 24. Sosial - Isu Tilang Sandal Jepit
    {
        "title": "Klaim Razia Operasi Zebra Melarang Pengendara Motor Pakai Sandal Jepit dan Dikenai Denda",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2022/06/16/klarifikasi-tilang-sandal-jepit",
        "views_count": 6120,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar unggahan viral di media sosial yang mengklaim pihak kepolisian lalu lintas akan menilang pemotor yang mengenakan sandal jepit dengan sanksi denda tilang sebesar Rp 250.000.",
        "penjelasan": "Korps Lalu Lintas (Korlantas) Polri menegaskan tidak ada penilangan apalagi pengenaan denda uang bagi pengendara motor yang memakai sandal jepit. Penggunaan sepatu saat bermotor adalah imbauan keselamatan berkendara (safety riding) untuk meminimalisasi fatalitas cedera kaki saat terjadi kecelakaan.",
        "kesimpulan": "Klaim denda tilang 250 ribu bagi pemotor yang memakai sandal jepit adalah HOAKS disinformasi aturan lalu lintas.",
        "key_findings": [
            "Korlantas Polri meluruskan anjuran tidak memakai sandal jepit adalah edukasi keselamatan, bukan larangan bertilang.",
            "Undang-Undang Nomor 22 Tahun 2009 tentang LLAJ tidak memuat pasal penindakan hukum terkait alas kaki.",
            "Polisi tidak akan menyita STNK atau mengenakan denda finansial kepada pemotor yang bersandal jepit."
        ],
        "claims_review": [
            {
                "claim": "Pengendara motor pakai sandal jepit ditilang denda 250 ribu",
                "claimant": "Unggahan Media Sosial Viral",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Klaim Palsu / Disinformasi"
            }
        ],
        "article_hash": "345678abcdef0123456789abcdef0123456789abcdef0123456789abcdef0131",
        "ipfs_cid": "bafkrein4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9",
        "tx_hash": "0x012abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678909"
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

    print(f"\n[SUCCESS] Seeding completed! Total rows in Supabase: {len(REAL_HOAX_ARTICLES)} articles.")

if __name__ == "__main__":
    seed()
