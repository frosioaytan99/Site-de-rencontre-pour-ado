# MatchWatch — scaffold (Next.js + Supabase)

But : MVP open-source pour site de rencontre/chat ciblant 13–25 (séparation d'âge appliquée côté serveur). Auth email only, pas de reconnaissance faciale.

Contenu :
- Next.js frontend (TypeScript)
- Supabase backend (Auth, Postgres, Realtime)
- Chat en temps réel via Supabase Realtime
- Images via liens externes (image_url) — pas d'upload d'images sur le plan gratuit

IMPORTANT : ce scaffold ne contient aucune implémentation de reconnaissance faciale. Aucun package d'AI/face n'est inclus.

Déploiement rapide (Vercel + Supabase free tiers) :
1. Créer un projet Supabase et exécuter le SQL du README pour créer les tables (ou utiliser l'éditeur SQL fourni).
2. Configurer SMTP dans Supabase (SendGrid free tier) pour que les emails de vérif/magic link soient envoyés.
3. Déployer ce repo sur Vercel ; ajouter les variables d'environnement (cf .env.example).
4. Lancer `npm install` puis `npm run dev` localement pour tester.
5. Sur Supabase, activez Realtime pour les tables messages si nécessaire.

Variables d'environnement requises

Le projet attend les variables suivantes (à ajouter dans Vercel > Settings > Environment Variables ou dans un fichier .env.local pour le développement local) :

- NEXT_PUBLIC_SUPABASE_URL — l'URL de votre instance Supabase (ex: https://xxxxx.supabase.co)
- NEXT_PUBLIC_SUPABASE_ANON_KEY — la clé anonyme publique Supabase (NE PAS exposer la clé `service_role` côté client)

Optionnel (uniquement pour les fonctions server-side) :
- SUPABASE_SERVICE_ROLE_KEY — clé service_role (ne pas mettre côté client)

Exemple local (.env.local) — NE PAS committer les valeurs :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Notes :
- Si vous déployez sur GitHub Pages via `next export`, les fonctionnalités realtime et auth risquent de ne pas fonctionner correctement. Pour une application dynamique (auth + realtime) utilisez Vercel ou une plateforme capable d'héberger une app Next.js non statique.

Notes sécurité / modération :
- Bloquer emails jetables (lib au niveau du backend).
- Pas de scan d'images payant — utiliser workflow de signalement et suppression manuelle.
- Respecter la séparation d'âge côté serveur (13–17 vs 18–25).

Licence : MIT (modifiable)
