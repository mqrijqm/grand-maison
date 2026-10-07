# Slanje upita

Forma na početnoj i stranici za izvođače koristi /api/quote.

Za direktno slanje postaviti lokalno ili u hostingu:

- RESEND_API_KEY — server ključ Resenda.
- GRAND_QUOTE_FROM — adresa pošiljaoca na verifikovanom domenu.
- GRAND_QUOTE_TO — opciona adresa prodaje; podrazumijevano kontakt iz kataloga.

Nakon izmjene lokalnih varijabli ponovo pokrenuti dev server.
Ključevi se nikad ne izlažu kroz NEXT_PUBLIC_ varijable.

API: https://resend.com/docs/api-reference/emails/send-email

Bez mail konfiguracije forma ne prijavljuje uspješno slanje. Korisnik može
otvoriti e-poštu ili preuzeti nacrt poruke sa svim prilozima i poslati ga iz
svog programa za e-poštu. Nacrt nije poslana poruka.

Prilozi: do 3 fajla, ukupno do 3 MB; PDF, XLS/XLSX, JPG/PNG/WebP.
Tehnička dokumentacija se traži po upitu dok stvarni PDF-ovi proizvoda ne budu dostupni.
