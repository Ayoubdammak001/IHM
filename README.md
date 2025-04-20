# IHM – Interface Homme-Machine

Ce projet est une interface web développée dans le cadre du module d'IHM. Il utilise le template **CoreUI Angular Admin** comme base de développement.

## 📁 Template Utilisé

Le projet est basé sur le template open source :  
🔗 [CoreUI Free Angular Admin Template](https://github.com/coreui/coreui-free-angular-admin-template.git)

## 💻 Dépôt du Projet

🔗 [Mon projet GitHub](https://github.com/Ayoubdammak001/IHM.git)

## 🛠️ Installation

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/Ayoubdammak001/IHM.git
   cd IHM
   ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

## ▶️ Lancement du Projet

Lancer l'application en mode développement :

```bash
ng serve
```

Accéder à l'application sur :  
📍 `http://localhost:4200`

## 📦 Technologies utilisées

- Angular 19+
- CoreUI
- TypeScript
- Bootstrap

---

## 🗂️ Structure du dossier `src/app`

```
├── app-routing.module.ts
├── app.component.html
├── app.component.spec.ts
├── app.component.ts
├── app.config.ts
├── app.module.ts
├── app.routes.ts
├── components
│   ├── about
│   ├── admin
│   ├── client
│   ├── footer
│   ├── home
│   ├── login
│   ├── navbar
│   ├── provider
│   ├── register
│   ├── service-details
│   ├── services
│   ├── shared
│   └── usersServices
├── data
├── guards
├── icons
├── layout
├── models
├── services
└── views
```

> Chaque dossier contient les composants Angular avec leurs fichiers `.ts`, `.html`, `.scss` et parfois `routes.ts` ou `module.ts`, organisés par rôle (admin, client, provider, etc.).

Projet réalisé dans le cadre de l’enseignement d’IHM par monsieur Mohammed MAZOUZI.
