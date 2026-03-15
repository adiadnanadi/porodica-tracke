# 📡 Porodica Tracker — Uputstvo za postavljanje

## Struktura projekta
```
tracker/
├── public/
│   └── index.html      ← Stranica koju šalješ sinu
├── admin/
│   └── index.html      ← Tvoj admin panel
├── server.js           ← Express server
├── package.json
└── README.md
```

---

## 1. Firebase postavljanje

1. Idi na https://console.firebase.google.com
2. Kreiraj novi projekat (npr. "porodica-tracker")
3. Klikni ⚙️ → **Project settings** → **Your apps** → dodaj Web app
4. Kopiraj `firebaseConfig` objekt
5. Zamijeni `TVOJ_API_KEY` i ostale placeholdere u **OBA** HTML fajla:
   - `public/index.html`
   - `admin/index.html`

### Firestore pravila (Firebase Console → Firestore → Rules)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Svi mogu pisati (stranica upisuje posjete)
    match /visits/{doc} {
      allow write: true;
      allow read: false; // Čita samo server-side / tvoja admin app
    }
  }
}
```

---

## 2. Deploy na Render

1. Pushaj kod na GitHub repozitorij
2. Idi na https://render.com → **New → Web Service**
3. Poveži GitHub repo
4. Podesi:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Dodaj Environment Variables:
   - `ADMIN_USER` = (tvoje korisničko ime za admin panel)
   - `ADMIN_PASS` = (tvoja lozinka za admin panel)
6. Deploy!

---

## 3. Korištenje

| URL | Svrha |
|-----|-------|
| `https://tvoj-app.onrender.com/` | Stranica za sina |
| `https://tvoj-app.onrender.com/admin/` | Tvoj admin panel |

### Admin panel funkcije:
- 📍 **Mapa** — svaka posjeta prikazana kao marker (žuti = GPS, plavi = IP lokacija)
- 📋 **Lista posjeta** — IP, grad, država, ISP, datum/vrijeme
- ⚡ **Real-time** — nove posjete se pojavljuju automatski
- 🔐 **Zaštićen** lozinkom

---

## Napomena o preciznosti

| Metoda | Preciznost | Uvjet |
|--------|-----------|-------|
| GPS (browser) | ±10–50m | Sin mora odobriti dozvolu |
| IP geolokacija | Grad/ISP | Automatski, bez dozvole |

Ako sin ne odobri GPS dozvolu u browseru, dobićeš samo IP geolokaciju (grad nivo).
