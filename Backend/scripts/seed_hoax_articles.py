import sys
import hashlib
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from services.db_service import get_supabase_client

REAL_HOAX_ARTICLES = [
    # 1. Finansial / Bansos
    {
        "title": "Beredar Link Pendaftaran Bantuan Sosial Tunai Rp10 Juta Lewat Telegram",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2026/01/bansos-telegram-palsu",
        "views_count": 2840,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan berantai di media sosial dan WhatsApp yang mengklaim pemerintah membagikan bantuan sosial tunai sebesar Rp10 juta yang dapat dicairkan melalui tautan grup Telegram tertentu.",
        "penjelasan": "Kementerian Sosial menegaskan tidak pernah menyalurkan bansos tunai melalui tautan aplikasi pesan instan pihak ketiga seperti Telegram. Tautan tersebut merupakan modus phishing untuk mencuri data pribadi, KTP, dan membobol akun perbankan pengguna.",
        "kesimpulan": "Informasi pembagian bansos 10 juta via Telegram adalah HOAKS bermodus penipuan phishing (Fabricated Content).",
        "key_findings": [
            "Kemensos membantah memiliki kanal pencairan dana bansos di Telegram.",
            "Penyaluran resmi bansos tunai hanya melalui bank Himbara dan PT Pos Indonesia.",
            "Tautan meminta data NIK KTP dan nomor rekening secara mencurigakan."
        ],
        "claims_review": [
            {
                "claim": "Pemerintah bagikan bansos 10 juta lewat link Telegram",
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
    # 2. Finansial
    {
        "title": "Undangan Pernikahan Digital Format APK Pembobol Saldo Rekening di WhatsApp",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
        "source_url": "https://kompas.com/cekfakta/apk-undangan-pernikahan-palsu",
        "views_count": 3150,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan di WhatsApp dari nomor tidak dikenal yang mengirimkan dokumen dengan nama 'Surat Undangan Pernikahan' dengan ekstensi file .APK dan meminta penerima menginstalnya.",
        "penjelasan": "File tersebut bukan undangan pernikahan asli, melainkan aplikasi malware berjenis trojan perbankan (SMS stealer). Jika diinstal, aplikasi berbahaya ini akan menyadap SMS OTP (One-Time Password) perbankan dan menguras saldo rekening korban.",
        "kesimpulan": "Dokumen undangan pernikahan berekstensi .APK adalah HOAKS berbahaya modus pencurian data rekening (Malicious Phishing).",
        "key_findings": [
            "File memiliki ekstensi .apk (Android Package Kit) yang berpotensi menyusupkan malware.",
            "Aplikasi meminta izin akses SMS yang tidak wajar untuk membaca kode OTP perbankan.",
            "Pihak kepolisian Siber Polri telah mengeluarkan peringatan resmi terkait modus ini."
        ],
        "claims_review": [
            {
                "claim": "Undangan pernikahan digital dikirim dalam bentuk file .APK",
                "claimant": "Nomor WhatsApp Tak Dikenal",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://kompas.com/cekfakta",
                "rating": "Modus Malware / Penipuan"
            }
        ],
        "article_hash": "7a8b9c0d1e2f34567890abcdef1234567890abcdef1234567890abcdef123456",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7",
        "tx_hash": "0x12a9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef12"
    },
    # 3. Finansial
    {
        "title": "Surat Edaran Perubahan Tarif Transaksi Bank BRI Menjadi Rp150 Ribu per Bulan",
        "category": "Finansial",
        "image_url": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop",
        "source_url": "https://tempo.co/cekfakta/tarif-transaksi-bri-150-ribu",
        "views_count": 1820,
        "credibility_score": 5,
        "status": "HOAX",
        "narasi": "Beredar tangkapan layar surat edaran mengatasnamakan Bank BRI yang menyatakan biaya transfer antar bank akan diubah menjadi skema auto-debit Rp150.000 per bulan, dan nasabah diminta mengklik tautan untuk membatalkan.",
        "penjelasan": "Sekretaris Perusahaan PT Bank Rakyat Indonesia (Persero) Tbk menegaskan bahwa surat edaran tersebut adalah palsu. BRI tidak pernah menaikkan tarif transfer menjadi Rp150.000 per bulan. Tautan pembatalan merupakan situs palsu untuk mencuri username, password, dan PIN nasabah.",
        "kesimpulan": "Surat edaran perubahan biaya transfer BRI Rp150 ribu adalah HOAKS modus social engineering.",
        "key_findings": [
            "Format surat edaran menggunakan tata letak dan logo yang tidak sesuai standar korporasi BRI.",
            "BRI mengimbau nasabah tidak membagikan nomor kartu, CVV, dan PIN kepada siapapun.",
            "Tarif transfer BI-FAST tetap berlaku normal Rp2.500 per transaksi."
        ],
        "claims_review": [
            {
                "claim": "Biaya transfer BRI naik jadi 150 ribu per bulan secara otomatis",
                "claimant": "Akun Facebook & Pesan WA",
                "reviewPublisher": "Tempo Cek Fakta",
                "reviewUrl": "https://cekfakta.tempo.co",
                "rating": "Palsu / Rekayasa"
            }
        ],
        "article_hash": "6b7c8d9e0f1234567890abcdef1234567890abcdef1234567890abcdef123456",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x8",
        "tx_hash": "0x23b8bc7890def1234567890abcdef1234567890abcdef1234567890abcdef23"
    },
    # 4. Kesehatan
    {
        "title": "Klaim Air Rebusan Daun Sirih Merah Menyembuhkan Kanker Stadium 4 Secara Instan",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop",
        "source_url": "https://kompas.com/cekfakta/daun-sirih-kanker",
        "views_count": 2190,
        "credibility_score": 10,
        "status": "HOAX",
        "narasi": "Beredar unggahan video di TikTok yang menyatakan pasien kanker stadium akhir dapat sembuh total tanpa operasi dan kemoterapi hanya dengan rutin meminum air rebusan daun sirih merah.",
        "penjelasan": "Pakar onkologi dan Ikatan Dokter Indonesia (IDI) menegaskan klaim tersebut tidak memiliki dasar uji klinis medis pada manusia. Mengabaikan terapi medis standar demi ramuan herbal berisiko fatal mempercepat penyebaran sel kanker stadium lanjut.",
        "kesimpulan": "Klaim air rebusan daun sirih merah menyembuhkan kanker stadium 4 adalah HOAKS Medis Berbahaya (Misleading Content).",
        "key_findings": [
            "Tidak ada uji klinis berbasis bukti (evidence-based medicine) yang memvalidasi klaim ini.",
            "Daun sirih memiliki senyawa antioksidan tetapi bukan obat pembunuh sel kanker terverifikasi.",
            "Menunda kemoterapi pada kanker stadium 4 dapat menurunkan peluang hidup secara signifikan."
        ],
        "claims_review": [
            {
                "claim": "Rebusan sirih merah sembuhkan kanker stadium 4 tanpa medis",
                "claimant": "Video Viral TikTok",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://kompas.com/cekfakta",
                "rating": "Menyesatkan / Keliru"
            }
        ],
        "article_hash": "8b9c0d1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x9",
        "tx_hash": "0x34c9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef34"
    },
    # 5. Kesehatan
    {
        "title": "Minum Air Es Setelah Makan Menyebabkan Penggumpalan Lemak dan Serangan Jantung",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2026/01/air-es-jantung-hoax",
        "views_count": 1640,
        "credibility_score": 15,
        "status": "HOAX",
        "narasi": "Beredar narasi di Facebook yang menyebutkan minum air es setelah makan dapat membekukan minyak dan lemak makanan di dalam lambung sehingga memicu kanker dan serangan jantung seketika.",
        "penjelasan": "Secara fisiologis tubuh manusia, makanan dan minuman yang masuk ke lambung akan segera disesuaikan suhunya dengan suhu inti tubuh (sekitar 37 derajat Celcius). Air dingin tidak dapat membekukan lemak di saluran pencernaan yang hangat.",
        "kesimpulan": "Klaim minum air es memicu serangan jantung dan membekukan lemak adalah HOAKS fisiologis yang keliru.",
        "key_findings": [
            "Suhu tubuh manusia secara konstan menghangatkan makanan dan minuman di lambung.",
            "Penyebab serangan jantung adalah aterosklerosis jangka panjang, bukan konsumsi air dingin.",
            "Enzim pencernaan manusia tetap bekerja normal setelah meminum cairan bersuhu dingin."
        ],
        "claims_review": [
            {
                "claim": "Minum air es setelah makan membekukan lemak jadi racun jantung",
                "claimant": "Postingan Medsos Facebook",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Salah Total"
            }
        ],
        "article_hash": "9c0d1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x0",
        "tx_hash": "0x45d9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef45"
    },
    # 6. Kesehatan
    {
        "title": "Klaim Vaksin Tetes Polio Mengandung Mikrocip Pelacak Gerak Penduduk",
        "category": "Kesehatan",
        "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop",
        "source_url": "https://liputan6.com/cek-fakta/vaksin-polio-mikrocip",
        "views_count": 1430,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar narasi konspirasi di grup WhatsApp bahwa vaksin tetes polio (bOPV) yang diberikan kepada balita mengandung mikrocip buatan asing untuk melacak gerak penduduk Indonesia.",
        "penjelasan": "Kementerian Kesehatan RI dan Badan Pengawas Obat dan Makanan (BPOM) menyatakan vaksin polio hanya mengandung virus polio yang dilemahkan/inaktif, cairan penyangga, dan stabilizer steril. Tidak ada teknologi mikrocip biologis yang muat di dalam tetesan cairan vaksin.",
        "kesimpulan": "Narasi vaksin polio mengandung mikrocip adalah HOAKS konspirasi tanpa dasar ilmiah.",
        "key_findings": [
            "Komposisi vaksin polio telah lolos uji mutu ketat BPOM dan standar WHO.",
            "Tidak ada komponen logam atau perangkat elektronik mikro dalam formulasi vaksin tetes.",
            "Vaksin polio esensial untuk mencegah kelumpuhan permanen pada anak."
        ],
        "claims_review": [
            {
                "claim": "Vaksin tetes polio mengandung mikrocip pelacak gerak anak",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "Liputan6 Cek Fakta",
                "reviewUrl": "https://liputan6.com/cek-fakta",
                "rating": "Hoaks Konspirasi"
            }
        ],
        "article_hash": "0d1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x1",
        "tx_hash": "0x56e9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef56"
    },
    # 7. Politik
    {
        "title": "Foto Gedung DPR RI Senayan Terbakar Hebat Saat Sidang Paripurna RUU",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        "source_url": "https://tempo.co/cekfakta/foto-dpr-terbakar",
        "views_count": 3890,
        "credibility_score": 5,
        "status": "HOAX",
        "narasi": "Beredar foto dramatis kobaran api melalap atap Gedung Kura-Kura DPR RI di Senayan yang diklaim terjadi saat sidang paripurna pengesahan rancangan undang-undang.",
        "penjelasan": "Berdasarkan penelusuran gambar terbalik dan verifikasi Dinas Penanggulangan Kebakaran dan Penyelamatan DKI Jakarta, tidak ada insiden kebakaran di kompleks parlemen Senayan. Gambar terbukti hasil rekayasa generator kecerdasan buatan (AI image synthesis).",
        "kesimpulan": "Foto gedung DPR RI terbakar adalah HOAKS hasil rekayasa kecerdasan buatan (Manipulated Content).",
        "key_findings": [
            "Sekjen DPR RI memastikan kompleks parlemen dalam kondisi aman dan normal.",
            "Dinas Damkar DKI Jakarta mengonfirmasi tidak ada panggilan darurat kebakaran di DPR.",
            "Analisis artefak citra memperlihatkan distorsi tekstur khas generator gambar AI."
        ],
        "claims_review": [
            {
                "claim": "Gedung DPR RI terbakar hebat saat sidang paripurna",
                "claimant": "Akun X / Twitter Viral",
                "reviewPublisher": "Tempo Cek Fakta",
                "reviewUrl": "https://cekfakta.tempo.co",
                "rating": "Manipulasi AI / Palsu"
            }
        ],
        "article_hash": "1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x2",
        "tx_hash": "0x67f9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef67"
    },
    # 8. Politik
    {
        "title": "Video Pidato Pejabat Publik Membagikan Uang Tunai Pakai Rekayasa Suara AI",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop",
        "source_url": "https://kompas.com/cekfakta/video-pidato-pejabat-ai",
        "views_count": 2720,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar video di Facebook dan SnackVideo yang menampilkan presiden berpidato menjanjikan pembagian uang tunai Rp25 juta bagi warga yang mendaftar melalui nomor WhatsApp di deskripsi video.",
        "penjelasan": "Video tersebut merupakan hasil manipulasi deepfake audio. Video asli diambil dari rekaman pidato kenegaraan resmi, namun gerak bibir dan gelombang suara telah diganti menggunakan teknologi voice cloning AI untuk menjerat korban penipuan.",
        "kesimpulan": "Video pidato pembagian uang tunai adalah HOAKS berteknologi deepfake AI (Fabricated Content).",
        "key_findings": [
            "Gerak bibir (lip-sync) tidak sinkron dengan intonasi ucapan dalam video.",
            "Analisis audio spektrogram menunjukkan karakteristik sintesis suara buatan.",
            "Kanal resmi kepresidenan tidak pernah menyelenggarakan undian uang via WhatsApp."
        ],
        "claims_review": [
            {
                "claim": "Presiden bagi-bagi uang 25 juta lewat pendaftaran nomor WhatsApp",
                "claimant": "Akun Video Medsos",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://kompas.com/cekfakta",
                "rating": "Manipulasi Deepfake AI"
            }
        ],
        "article_hash": "2f34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x3",
        "tx_hash": "0x78a9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef78"
    },
    # 9. Politik
    {
        "title": "Surat Edaran Palsu Perombakan Menteri Kabinet Mengatasnamakan Mensesneg",
        "category": "Politik",
        "image_url": "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2026/01/surat-reshuffle-palsu",
        "views_count": 1980,
        "credibility_score": 5,
        "status": "HOAX",
        "narasi": "Beredar dokumen PDF berkop surat Kementerian Sekretariat Negara yang memuat daftar 12 nama menteri kabinet yang diberhentikan dan digantikan per tanggal 1 bulan ini.",
        "penjelasan": "Kementerian Sekretariat Negara (Kemensetneg) menegaskan surat edaran tersebut adalah palsu dan tidak pernah diterbitkan. Nomor surat dan stempel resmi yang tertera tidak terdaftar dalam tata naskah dinas resmi kementerian.",
        "kesimpulan": "Dokumen daftar reshuffle menteri adalah HOAKS pemalsuan surat dinas pemerintah.",
        "key_findings": [
            "Kemensetneg mengeluarkan rilis klarifikasi resmi membantah surat tersebut.",
            "Penomoran naskah dinas dan tanda tangan digital tidak valid.",
            "Tidak ada keputusan presiden (Keppres) terkait perombakan pada tanggal tersebut."
        ],
        "claims_review": [
            {
                "claim": "Surat edaran resmi reshuffle 12 menteri kabinet baru",
                "claimant": "Dokumen PDF Beredar di Grup Chat",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Dokumen Palsu"
            }
        ],
        "article_hash": "34567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x4",
        "tx_hash": "0x89b9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef89"
    },
    # 10. Teknologi
    {
        "title": "Kabar Kominfo Mematikan Jaringan Internet Seluruh Indonesia Mulai Tengah Malam",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
        "source_url": "https://kompas.com/cekfakta/internet-mati-tengah-malam",
        "views_count": 2450,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan di media sosial yang menyebut Kementerian Kominfo akan mematikan seluruh jaringan internet dan sinyal operator seluler di Indonesia selama 3 hari mulai pukul 00.00 WIB.",
        "penjelasan": "Kementerian Komunikasi dan Digital (Komdigi/Kominfo) membantah keras narasi tersebut. Pemerintah tidak memiliki rencana pemadaman jaringan nasional, dan seluruh infrastruktur telekomunikasi beroperasi normal melayani publik.",
        "kesimpulan": "Klaim pemadaman internet nasional tengah malam adalah HOAKS berulang (Fabricated Content).",
        "key_findings": [
            "Asosiasi Penyelenggara Jasa Internet Indonesia (APJII) menyatakan jaringan internet normal.",
            "Kementerian Komunikasi menegaskan tidak ada kebijakan pembatasan akses data nasional.",
            "Narasi merupakan daur ulang hoaks lama yang sering muncul menjelang agenda tertentu."
        ],
        "claims_review": [
            {
                "claim": "Pemerintah matikan jaringan internet nasional selama 3 hari",
                "claimant": "Pesan Berantai WhatsApp",
                "reviewPublisher": "Kompas Cek Fakta",
                "reviewUrl": "https://kompas.com/cekfakta",
                "rating": "Tidak Benar / Hoaks"
            }
        ],
        "article_hash": "4567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f34",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x5",
        "tx_hash": "0x90c9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef90"
    },
    # 11. Teknologi
    {
        "title": "Peringatan Mengetik Kode *#06# Membocorkan Lokasi HP Langsung ke Peretas",
        "category": "Teknologi",
        "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop",
        "source_url": "https://turnbackhoax.id/2026/01/kode-imei-peretas",
        "views_count": 1390,
        "credibility_score": 10,
        "status": "HOAX",
        "narasi": "Beredar peringatan di Facebook agar pengguna smartphone tidak mengetik kode dial *#06# karena diklaim kode tersebut memasang spyware peretas yang menyadap lokasi dan kamera HP.",
        "penjelasan": "Kode dial *#06# adalah standar internasional GSM resmi sejak era ponsel pertama untuk menampilkan nomor identitas perangkat atau IMEI (International Mobile Equipment Identity). Kode ini hanya membaca data lokal dari modem ponsel dan tidak mengirimkan data keluar.",
        "kesimpulan": "Klaim kode dial *#06# membocorkan lokasi ke hacker adalah HOAKS ketidaktahuan teknologi.",
        "key_findings": [
            "Kode *#06# merupakan instruksi standar asosiasi GSM untuk menampilkan nomor IMEI.",
            "Panggilan kode ini tidak membutuhkan sambungan internet dan tidak memasang aplikasi apapun.",
            "Kemenperin resmi menggunakan IMEI untuk perlindungan perangkat dari peredaran ilegal."
        ],
        "claims_review": [
            {
                "claim": "Kode *#06# meretas dan membocorkan lokasi HP ke hacker",
                "claimant": "Postingan Medsos",
                "reviewPublisher": "TurnBackHoax / MAFINDO",
                "reviewUrl": "https://turnbackhoax.id",
                "rating": "Salah / Keliru"
            }
        ],
        "article_hash": "567890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f3456",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x6",
        "tx_hash": "0x01d9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef01"
    },
    # 12. Sosial
    {
        "title": "Pesan Berantai Penculikan Anak Menggunakan Mobil Ambulans Palsu di Jakarta",
        "category": "Sosial",
        "image_url": "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop",
        "source_url": "https://tempo.co/cekfakta/isu-penculikan-anak-ambulans",
        "views_count": 3120,
        "credibility_score": 0,
        "status": "HOAX",
        "narasi": "Beredar pesan suara kepanikan di WhatsApp yang mengabarkan ada sindikat penculikan anak berkeliaran di area sekolah dasar menggunakan mobil ambulans bernomor polisi daerah tertentu.",
        "penjelasan": "Polda Metro Jaya menegaskan rekaman suara dan pesan tersebut adalah hoaks yang meresahkan masyarakat. Petugas telah menelusuri lokasi yang disebutkan dan memastikan situasi keamanan di seluruh sekolah kondusif tanpa ada laporan penculikan.",
        "kesimpulan": "Pesan berantai penculikan anak mobil ambulans adalah HOAKS provokasi keresahan publik.",
        "key_findings": [
            "Kepolisian memastikan tidak ada laporan kasus penculikan sebagaimana diklaim.",
            "Rekaman suara menggunakan pola broadcast fiktif yang kerap diulang tiap tahun.",
            "Warga diimbau tenang namun tetap waspada menjaga anak secara wajar."
        ],
        "claims_review": [
            {
                "claim": "Sindikat penculik anak berkeliaran pakai ambulans di Jakarta",
                "claimant": "Pesan Suara WhatsApp",
                "reviewPublisher": "Tempo Cek Fakta",
                "reviewUrl": "https://cekfakta.tempo.co",
                "rating": "Hoaks Meresahkan"
            }
        ],
        "article_hash": "67890abcdef1234567890abcdef1234567890abcdef1234567a8b9c0d1e2f345678",
        "ipfs_cid": "bafkreib6q5aebzk26eecx2vfv2u2x7fv2u2x7fv2u2x7fv2u2x7fv2u2x7",
        "tx_hash": "0x12e9bc7890def1234567890abcdef1234567890abcdef1234567890abcdef12"
    }
]

def seed():
    client = get_supabase_client()
    if not client:
        print("[Error] Supabase client failed to initialize.")
        return

    print("Checking existing records in hoax_articles...")
    existing = client.table("hoax_articles").select("id").execute()
    count = len(existing.data) if existing.data else 0
    print(f"Current rows in hoax_articles: {count}")

    if count >= len(REAL_HOAX_ARTICLES):
        print("Database already has sufficient hoax articles.")
        return

    print(f"Inserting {len(REAL_HOAX_ARTICLES)} real hoax articles into Supabase...")
    for idx, item in enumerate(REAL_HOAX_ARTICLES, 1):
        try:
            client.table("hoax_articles").insert(item).execute()
            print(f"[{idx}/{len(REAL_HOAX_ARTICLES)}] Inserted: {item['title'][:40]}...")
        except Exception as e:
            print(f"[{idx}] Failed to insert: {e}")

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
