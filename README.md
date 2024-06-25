# TikTokMinecraftJs

TikTokMinecraftJs adalah proyek integrasi antara TikTok dan Minecraft menggunakan JavaScript. Proyek ini memungkinkan Anda untuk mengontrol server Minecraft melalui interaksi di TikTok

## Fitur

- Menghubungkan server Minecraft dengan TikTok
- Implementasi RCON untuk mengirim perintah ke server Minecraft
- Handler Chat : Menampilkan Chat ke dalam game
- Handler Follow : Deteksi Follow Akun TikTok
- Handler Share : Deteksi Share Live TikTok
- Handler Like : Deteksi Like Live TikTok
- Handler Gift : Deteksi Gift TikTok

## Persyaratan

- Node.js
- Server Minecraft dengan RCON diaktifkan
- Akun TikTok

## Instalasi

1. Clone repository ini:

   ```bash
   git clone https://github.com/zufarrizal/TikTokMinecraftJs.git
   cd TikTokMinecraftJs
   ```

2. Instal dependensi:

   ```bash
   npm install
   ```

3. Konfigurasikan `tiktok-rcon.js` dengan informasi server Minecraft dan TikTok Anda.

## Penggunaan

Jalankan skrip dengan perintah berikut:

```bash
node tiktok-rcon.js
```

## Kontribusi

Jika Anda ingin berkontribusi, silakan fork repository ini, buat branch fitur baru, dan kirimkan pull request.

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
