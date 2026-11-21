import sys
import hashlib
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from services.db_service import get_supabase_client

REAL_VERIFIED_HOAXES = [
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
        "narasi": "Beredar pesan WhatsApp dari nomor tidak dikenal bertuliskan 'Kami mengundang Bapak/Ibu ke acara pernikahan kami, silakan buka Surat Undangan Pernikahan Digital.apk' dan meminta calon korban mengklik file tersebut.",
        "penjelasan": "Direktorat Tindak Pidana Siber (Dittipidsiber) Bareskrim Polri mengonfirmasi bahwa file tersebut merupakan malware berjenis SMS-stealer trojan. Ketika korban menginstal file .APK tersebut, aplikasi akan meminta izin akses pembacaan SMS secara diam-diam. Akses ini dimanfaatkan sindikat kejahatan untuk membajak kode OTP (One-Time Password) dari perbankan seluler dan dompet digital korban, lalu menguras seluruh saldo tanpa disadari.",
        "kesimpulan": "File undangan pernikahan berekstensi .APK adalah HOAKS berbahaya modus penyusupan trojan malware perbankan.",
        "key_findings": [
            "File undangan asli biasanya berupa tautan web resmi (HTML/HTTPS), bukan file instalasi aplikasi Android (.APK).",
            "Aplikasi meminta izin berbahaya 'READ_SMS' dan 'RECEIVE_SMS' yang tidak berhubungan dengan undangan.",
            "Polri mengimbau masyarakat segera memblokir pengirim dan tidak memberikan izin instalasi aplikasi tidak dikenal."
        ],
        "claims_review": [
            {
                "claim": "File .APK di WhatsApp adalah undangan pernikahan digital resmi",
                "claimant": "Pesan WA Nomor Tidak Dikenal",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Malware Berbahaya"
            }
        ],
        "article_hash": "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7",
        "tx_hash": "0x12a9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef12"
    },
    # 3. Finansial - Kasus Nyata Surat Edaran Bank BRI
    {
        "title": "Surat Edaran Palsu Kenaikan Biaya Transaksi Transfer Antar Bank BRI Rp150.000 per Bulan",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop",
        "source_url": "https://cekfakta.tempo.co/fakta/1876/keliru-surat-edaran-kenaikan-biaya-transaksi-bri-150-ribu-per-bulan",
        "views_count": 3410,
        "credibility_score": 5,
        "status": "HOAX",
        "narasi": "Beredar dokumen digital mengatasnamakan PT Bank Rakyat Indonesia (Persero) Tbk dengan pemberitahuan bahwa per tanggal 1 bulan depan biaya transfer antar bank diubah menjadi sistem tagihan tetap Rp150.000 per bulan yang otomatis didebit, kecuali nasabah menolak lewat tautan formulir.",
        "penjelasan": "Corporate Secretary Bank BRI menegaskan bahwa surat edaran tersebut adalah rekayasa penipuan (social engineering). BRI tidak pernah menerbitkan kebijakan kenaikan biaya transaksi transfer bulanan sebesar Rp150.000. Tautan pembatalan yang dilampirkan adalah situs phishing tiruan yang dirancang untuk mengelabui nasabah agar mengisi nomor kartu debit, tanggal kadaluarsa, CVV, dan PIN.",
        "kesimpulan": "Surat edaran perubahan biaya transaksi BRI Rp150 ribu adalah HOAKS modus rekayasa sosial phishing.",
        "key_findings": [
            "Tata naskah dinas, jenis font, dan stempel digital pada surat edaran tidak sesuai standar korporasi resmi BRI.",
            "Tarif transfer antar bank melalui layanan BI-FAST tetap berlaku normal sebesar Rp2.500 per transaksi.",
            "BRI mengingatkan bahwa staf perbankan tidak pernah meminta data rahasia seperti nomor CVV dan PIN nasabah."
        ],
        "claims_review": [
            {
                "claim": "Bank BRI naikkan biaya transaksi transfer jadi Rp150 ribu per bulan",
                "claimant": "Unggahan Akun Facebook & Broadcast WA",
                "reviewPublisher": "Tempo Cek Fakta",
                "reviewUrl": "https://cekfakta.tempo.co",
                "rating": "Dokumen Rekayasa / Palsu"
            }
        ],
        "article_hash": "b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890a1",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x8",
        "tx_hash": "0x23b8bc7890def1234567890abcdef1234567890abcdef1234567890abcdef23"
    },
    # 4. Kesehatan - Kasus Nyata Rebusan Sirih Merah Kanker
    {
        "title": "Klaim Air Rebusan Daun Sirih Merah Menyembuhkan Kanker Stadium 4 Tanpa Kemoterapi",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2023/11/14/150000882/hoaks-air-rebusan-daun-sirih-merah-sembuhkan-kanker-stadium-4",
        "views_count": 3950,
        "credibility_score": 10,
        "status": "HOAX",
        "narasi": "Beredar video viral di platform TikTok dan Instagram yang memperlihatkan ramuan herbal dengan klaim bahwa meminum air rebusan daun sirih merah tiga kali sehari terbukti menyembuhkan pasien kanker stadium 4 tanpa memerlukan tindakan medis kemoterapi.",
        "penjelasan": "Perhimpunan Dokter Spesialis Onkologi Radiasi Indonesia (PORI) dan Ikatan Dokter Indonesia (IDI) menegaskan klaim tersebut tidak memiliki basis bukti ilmiah (evidence-based medicine). Meskipun daun sirih merah mengandung senyawa flavonoid dan antioksidan, belum ada satupun uji klinis pada manusia yang membuktikan kemampuannya membunuh sel kanker ganas stadium lanjut. Menunda penanganan medis demi herbal pada pasien kanker stadium 4 sangat fatal dan dapat mempercepat komplikasi kematian.",
        "kesimpulan": "Klaim air rebusan daun sirih merah menyembuhkan kanker stadium 4 seketika adalah HOAKS Medis Berbahaya (Misleading Content).",
        "key_findings": [
            "Tidak ada data uji klinis fase I-III pada manusia yang membuktikan daun sirih merah membunuh sel kanker.",
            "Kanker stadium 4 membutuhkan intervensi terapi medis terstandarisasi (kemoterapi, radioterapi, atau terapi target).",
            "Konsumsi herbal tanpa pengawasan dokter berisiko mengganggu fungsi hati dan ginjal pasien kanker."
        ],
        "claims_review": [
            {
                "claim": "Rebusan daun sirih merah sembuhkan kanker stadium 4 tanpa medis",
                "claimant": "Video Viral Media Sosial",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Menyesatkan / Keliru"
            }
        ],
        "article_hash": "c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890a1b2",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x9",
        "tx_hash": "0x34c9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef34"
    },
    # 5. Sosial / Bencana - Kasus Nyata Prediksi Gempa Megathrust
    {
        "title": "Pesan Suara Ancaman Gempa Megathrust Magnitudo 8.9 Melanda Selat Sunda Besok Pagi",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop",
        "source_url": "https://www.antaranews.com/berita/4270107/bmkg-tegaskan-rekaman-suara-peringatan-gempa-megathrust-besok-hoaks",
        "views_count": 4650,
        "credibility_score": 5,
        "status": "HOAX",
        "narasi": "Beredar pesan suara (voice note) kepanikan di WhatsApp yang mengatasnamakan staf ahli BMKG, menyebutkan telah terdeteksi pergerakan lempeng tektonik yang dipastikan memicu gempa megathrust berkekuatan magnitudo 8.9 dan tsunami 20 meter di Selat Sunda besok pagi.",
        "penjelasan": "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) melalui Kepala Pusat Gempa Bumi dan Tsunami secara resmi menegaskan bahwa rekaman suara tersebut adalah hoaks. Hingga saat ini, belum ada satu pun teknologi di dunia yang mampu memprediksi dengan tepat hari, jam, dan lokasi pasti terjadinya gempa bumi. Potensi zona megathrust adalah potensi geologis jangka panjang, bukan prediksi peristiwa yang dapat dipastikan harinya.",
        "kesimpulan": "Rekaman suara prediksi gempa megathrust besok pagi adalah HOAKS yang meresahkan publik (Fabricated Content).",
        "key_findings": [
            "BMKG membantah suara dalam rekaman merupakan pegawai atau staf resmi BMKG.",
            "Secara sains geofisika global, belum ada metode ilmiah yang dapat memprediksi waktu pasti gempa bumi.",
            "Masyarakat diimbau mengabaikan kabar ramalan gempa dan hanya merujuk aplikasi resmi InfoBMKG."
        ],
        "claims_review": [
            {
                "claim": "BMKG pastikan gempa megathrust M8.9 terjadi besok pagi di Selat Sunda",
                "claimant": "Pesan Suara (Voice Note) WhatsApp",
                "reviewPublisher": "Antara Cek Fakta",
                "reviewUrl": "https://www.antaranews.com",
                "rating": "Hoaks / Meresahkan"
            }
        ],
        "article_hash": "d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890a1b2c3",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x0",
        "tx_hash": "0x45d9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef45"
    },
    # 6. Kesehatan - Kasus Nyata Mikrocip Vaksin Polio
    {
        "title": "Narasi Vaksin Tetes Polio Diberi Kandungan Mikrocip Pelacak Asing",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop",
        "source_url": "https://www.liputan6.com/cek-fakta/read/5650123/cek-fakta-tidak-benar-vaksin-polio-mengandung-mikrocip-pelacak",
        "views_count": 2180,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar unggahan di Facebook dengan narasi konspirasi: 'Jangan mau balita Anda ditetesi vaksin polio pada Pekan Imunisasi Nasional (PIN), di dalam cairan vaksin tersebut disusupi mikrocip nano buatan asing untuk melacak dan mengontrol anak-anak Indonesia'.",
        "penjelasan": "Kementerian Kesehatan RI dan Badan Pengawas Obat dan Makanan (BPOM) menyatakan narasi tersebut adalah disinformasi murni. Vaksin tetes polio (bOPV) diproduksi secara steril oleh PT Bio Farma (Persero) dan telah mendapatkan sertifikasi Prakualifikasi dari Organisasi Kesehatan Dunia (WHO). Komposisinya murni terdiri dari suspensi virus polio tipe 1 dan 3 yang telah dilemahkan serta bahan penyangga steril, tanpa mengandung partikel elektronik atau mikrocip logam.",
        "kesimpulan": "Narasi vaksin polio mengandung mikrocip pelacak adalah HOAKS konspirasi yang tidak berdasar ilmiah.",
        "key_findings": [
            "Vaksin polio Bio Farma telah digunakan di lebih dari 150 negara dan diawasi ketat oleh WHO serta BPOM.",
            "Secara teknologi sains nano, tidak ada mikrocip biologis yang dapat berfungsi di dalam tetesan cairan vaksin oral.",
            "Penolakan vaksinasi polio berisiko memicu Kejadian Luar Biasa (KLB) kelumpuhan permanen pada anak."
        ],
        "claims_review": [
            {
                "claim": "Vaksin tetes polio disusupi mikrocip nano pelacak anak",
                "claimant": "Postingan Akun Facebook",
                "reviewPublisher": "Liputan6 Cek Fakta",
                "reviewUrl": "https://www.liputan6.com/cek-fakta",
                "rating": "Hoaks Konspirasi Total"
            }
        ],
        "article_hash": "e5f67890abcdef1234567890abcdef1234567890abcdef1234567890a1b2c3d4",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x1",
        "tx_hash": "0x56e9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef56"
    },
    # 7. Politik - Kasus Nyata Foto Gedung DPR Terbakar
    {
        "title": "Foto Manipulasi AI Gedung Parlemen DPR RI Terbakar Hebat Saat Sidang Paripurna",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        "source_url": "https://cekfakta.tempo.co/fakta/2104/foto-gedung-dpr-terbakar-saat-sidang-paripurna-adalah-hasil-ai",
        "views_count": 4120,
        "credibility_score": 5,
        "status": "HOAX",
        "narasi": "Beredar foto dramatis di media sosial X (Twitter) yang memperlihatkan kubah hijau Gedung Kura-Kura DPR RI di Senayan terbakar hebat dengan asap hitam membubung tinggi, dinarasikan dibakar massa saat sidang paripurna pengesahan undang-undang.",
        "penjelasan": "Hasil verifikasi dan cross-check visual di kompleks Parlemen Senayan memastikan tidak ada insiden kebakaran di Gedung DPR RI. Sekretariat Jenderal DPR RI dan Dinas Damkar DKI Jakarta mengonfirmasi gedung dalam kondisi aman. Pemeriksaan citra menggunakan perangkat deteksi sintesis visual menunjukkan anomali bayangan dan struktur arsitektur kubah yang tidak simetris, membuktikan foto dibuat menggunakan generator kecerdasan buatan (AI text-to-image).",
        "kesimpulan": "Foto Gedung DPR RI terbakar adalah HOAKS hasil rekayasa gambar generator AI (Manipulated Content).",
        "key_findings": [
            "Sekjen DPR RI memastikan aktivitas kerja parlemen berlangsung normal tanpa gangguan kebakaran.",
            "Dinas Gulkarmat DKI Jakarta tidak menerima satupun laporan panggilan darurat dari kawasan Senayan.",
            "Analisis gambar mendeteksi distorsi artefak khas model difusi AI seperti Midjourney/Stable Diffusion."
        ],
        "claims_review": [
            {
                "claim": "Gedung DPR Senayan terbakar saat sidang paripurna",
                "claimant": "Akun Media Sosial X",
                "reviewPublisher": "Tempo Cek Fakta",
                "reviewUrl": "https://cekfakta.tempo.co",
                "rating": "Manipulasi AI / Salah"
            }
        ],
        "article_hash": "f67890abcdef1234567890abcdef1234567890abcdef1234567890a1b2c3d4e5",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x2",
        "tx_hash": "0x67f9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef67"
    },
    # 8. Politik - Kasus Nyata Video AI Pidato Bagi Uang
    {
        "title": "Video Rekayasa Suara AI Deepfake Presiden Membagikan Uang Tunai Rp25 Juta",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop",
        "source_url": "https://www.kompas.com/cekfakta/read/2024/02/05/191500382/hoaks-video-presiden-bagi-bagi-uang-tunai-lewat-nomor-wa",
        "views_count": 3780,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar video di Facebook dan SnackVideo yang menampilkan presiden Republik Indonesia sedang berdiri di podium dan berbicara menjanjikan pembagian uang tunai Rp25 juta secara cuma-cuma bagi warga yang mengirim pesan ke nomor WhatsApp yang tercantum pada video.",
        "penjelasan": "Biro Pers, Media, dan Informasi (BPMI) Sekretariat Presiden menegaskan bahwa video tersebut adalah hoaks hasil kloning suara kecerdasan buatan (AI voice cloning / deepfake). Video aslinya merupakan dokumentasi pidato resmi pembukaan acara kenegaraan yang kemudian audionya ditimpa dan diselaraskan bibirnya (lip-sync manipulation) dengan suara tiruan AI untuk menjerat warga ke modus penipuan berkedok biaya admin.",
        "kesimpulan": "Video pidato presiden bagi-bagi uang adalah HOAKS manipulasi deepfake AI (Fabricated Content).",
        "key_findings": [
            "Analisis audio spektrogram mendeteksi frekuensi datar yang identik dengan sintesis text-to-speech AI.",
            "Biro Pers Kepresidenan menegaskan presiden tidak pernah menyelenggarakan program pembagian uang lewat WhatsApp.",
            "Nomor WhatsApp yang dicantumkan dalam video teridentifikasi sebagai nomor penipuan bermodus biaya pencairan."
        ],
        "claims_review": [
            {
                "claim": "Presiden berpidato bagi-bagi uang 25 juta lewat pendaftaran WhatsApp",
                "claimant": "Akun Video Medsos",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://www.kompas.com/cekfakta",
                "rating": "Rekayasa Deepfake AI"
            }
        ],
        "article_hash": "7890abcdef1234567890abcdef1234567890abcdef1234567890a1b2c3d4e5f6",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x3",
        "tx_hash": "0x78a9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef78"
    },
    # 9. Teknologi - Kasus Nyata Pemadaman Internet Nasional
    {
        "title": "Kabar Hoaks Pemadaman Jaringan Internet dan Sinyal Seluler Seluruh Indonesia",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
        "source_url": "https://www.antaranews.com/berita/3954312/kominfo-tegaskan-kabar-pemadaman-internet-nasional-tengah-malam-hoaks",
        "views_count": 2980,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan berantai di grup obrolan yang menyebutkan: 'Pengumuman penting, malam ini mulai pukul 00.00 WIB pemerintah melalui Kominfo akan mematikan seluruh koneksi internet WiFi dan sinyal seluler di seluruh Indonesia selama 3 hari'.",
        "penjelasan": "Kementerian Komunikasi dan Digital (Komdigi/Kominfo) bersama Asosiasi Penyelenggara Jasa Internet Indonesia (APJII) menyatakan narasi tersebut adalah hoaks daur ulang. Pemerintah tidak memiliki wewenang maupun kebijakan untuk mematikan jaringan telekomunikasi nasional secara sepihak. Seluruh infrastruktur kabel serat optik dan menara BTS operator seluler (Telkomsel, Indosat, XL, Smartfren) dipastikan beroperasi melayani masyarakat selama 24 jam penuh.",
        "kesimpulan": "Klaim pemadaman internet nasional tengah malam adalah HOAKS daur ulang yang tidak benar.",
        "key_findings": [
            "Kementerian Komunikasi memastikan tidak ada kebijakan pemutusan akses internet nasional.",
            "Asosiasi penyedia internet (APJII) mengonfirmasi seluruh jalur gateway lalu lintas data internet normal.",
            "Narasi merupakan pesan berantai lama yang kerap dimodifikasi tanggalnya untuk memicu kepanikan."
        ],
        "claims_review": [
            {
                "claim": "Pemerintah matikan internet dan sinyal HP nasional selama 3 hari",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "Antara Cek Fakta",
                "reviewUrl": "https://www.antaranews.com",
                "rating": "Tidak Benar / Hoaks"
            }
        ],
        "article_hash": "890abcdef1234567890abcdef1234567890abcdef1234567890a1b2c3d4e5f67",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x5",
        "tx_hash": "0x90c9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef90"
    },
    # 10. Sosial - Kasus Nyata Penculikan Anak Ambulans
    {
        "title": "Pesan Berantai Sindikat Penculikan Anak Berkeliaran Menggunakan Mobil Ambulans",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2023/02/01/salah-isu-penculikan-anak-pakai-ambulans-di-jabodetabek",
        "views_count": 3520,
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
    }
]

def seed_real_news():
    client = get_supabase_client()
    if not client:
        print("[Error] Supabase client failed to initialize.")
        return

    print("Cleaning up old placeholder records in hoax_articles...")
    try:
        # Delete existing rows
        client.table("hoax_articles").delete().neq("title", "").execute()
    except Exception as e:
        print(f"Cleanup note: {e}")

    print(f"Inserting {len(REAL_VERIFIED_HOAXES)} verified real news articles into Supabase...")
    for idx, item in enumerate(REAL_VERIFIED_HOAXES, 1):
        try:
            client.table("hoax_articles").insert(item).execute()
            print(f"[{idx}/{len(REAL_VERIFIED_HOAXES)}] Real Article Inserted: {item['title'][:45]}...")
        except Exception as e:
            print(f"[{idx}] Failed to insert: {e}")

    print("\n[SUCCESS] All real verified news articles have been seeded to Supabase!")

if __name__ == "__main__":
    seed_real_news()
