import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Register: "Register",
      Login: "Login",
      "Edit Profile": "Edit Profile",
      Posts: "Posts",
      Following: "Following",
      Followers: "Followers",
      "This user has not posted": "This user has not posted",
      Wall: "Wall",
      Profile: "Profile",
      Groups: "Groups",
      "Follow Requests": "Follow Requests",
      Close: "Close",
      "Log Out": "Log Out",
      Search: "Search",
      "Change Password": "",
      "About Me": "About Me",
      "My Bio": "My Bio",
      "Change Password": "Change Password",
      "My account": "My account",
      Save: "Save",
      "Profile Picture": "Profile Picture",
      Username: "Username",
      "Display Name": "Display Name",
      "Profile privacy settings": "Profile privacy settings",
      "Send email everytime you login": "Send email everytime you login",
      "Private profile": "Private profile",
      "Back to profile": "Back to profile",
      Save: "Save",
      "Old password": "Old password",
      "New Password": "New Password",
      "You aren't following any users": "You aren't following any users",
      "Follow accounts to see their posts":
        "Follow accounts to see their posts",
      "No new friend requests": "No new friend requests",
      "Friend Requests": "Friend Requests",
      Accept: "Accept",
      Reject: "Reject",
      Follow: "Follow",
      "Request Sent": "Request Sent",
      Message: "Message",
      "This Account is Private": "This Account is Private",
      "Follow this account to see their posts":
        "Follow this account to see their posts",
      "View profile": "View profile",
      "Say Hi": "Say Hi",
      Settings: "Settings",
      "Delete chat": "Delete chat",
      "Say hi to new friend": "Say hi to new friend",
      "Sign up with": "Sign up with",
      "Or sign up with credentials": "Or sign up with credentials",
      "Create account": "Create account",
      "Sign in with": "Sign in with",
      "Or sign in with credentials": "Or sign in with credentials",
      Password: "Password",
      Email: "Email",
      "Sign in": "Sign in",
      "Create new account": "Create new account",
      "Inbox":"Inbox",
      "No Recent Chats":      "No Recent Chats",

      // "Me":"Me",
    },
  },

  jap: {
    translation: {
      Register: "登録",
      Login: "ログインする",
      "Edit Profile": "プロファイル編集",
      Posts: "投稿",
      Following: "以下",
      Followers: "フォロワー",
      "This user has not posted": "このユーザーは投稿していません",
      Wall: "ホーム",
      Profile: "プロフィール",
      Groups: "団体",
      "Follow Requests": "リクエストに従う",
      Close: "閉じる",

      "Log Out": "ログアウト",

      Search: "探す",

      "Change Password": "パスワードを変更する",

      "About Me": "私について",

      "My Bio": "マイバイオ",

      "Change Password": "パスワードを変更する",

      "My account": "マイアカウント",

      Save: "保存する",

      "Profile Picture": "プロフィールの写真",

      Username: "ユーザー名",

      "Display Name": "表示名",

      "Profile privacy settings": "プロフィールのプライバシー設定",

      "Send email everytime you login": "ログインするたびにメールを送信する",

      "Private profile": "プライベートプロファイル",

      "Back to profile": "プロフィールに戻る",

      "Old password": "以前のパスワード",

      "New Password": "新しいパスワード",

      "You aren't following any users":
        "あなたはどのユーザーもフォローしていません",

      "Follow accounts to see their posts":
        "アカウントをフォローして投稿を確認する",

      "No new friend requests": "新しい友達リクエストはありません",

      "Friend Requests": "友達リクエスト",

      Accept: "承諾",

      Reject: "拒否",

      Follow: "フォロー",
      "Request Sent": "送信されたリクエスト",
      Message: "メッセージ",
      "This Account is Private": "このアカウントはプライベートです",
      "Follow this account to see their posts":
        "このアカウントをフォローして投稿を確認してください",
      "View profile": "プロフィールを見る",
      "Say Hi": "こんにちは",
      Settings: "設定",
      "Delete chat": "チャットを削除",
      "Say hi to new friend": "新しい友達に挨拶",
      "Sign up with": "に登録する",
      "Or sign up with credentials": "または資格情報でサインアップ",
      "Create account": "アカウントを作成する",
      "Sign in with": "でサインイン",
      "Or sign in with credentials": "または資格情報でサインイン",
      Password: "パスワード",
      Email: "エミアル",
      "Sign in": "サインイン",
      "Create new account": "Eメール",

      "Nothing to Show":"Nothing to Show",
      "Inbox":"Inbox",
      "Follow more accounts to see their posts":"Follow more accounts to see their posts",
      
    },
  },

  esp: {
    translation: {
      Register: "S'inscrire",
      Login: "S'identifier",

      "Edit Profile": "Editar perfil",
      Posts: "Publicaciones",
      Following: "Siguiendo",
      Followers: "Seguidores",
      "This user has not posted": "Este usuario no ha publicado",
      Wall: "Inicio",
      Profile: "Perfil",
      Groups: "Grupos",
      "Follow Requests": "Seguir solicitudes",
      Close: "Cerca",

      "Log Out": "Cerrar sesión",

      Search: "Chercher",

      "Change Password": "Cambia la contraseña",

      "About Me": "Sobre mí",

      "My Bio": "Mi biografía",

      "Change Password": "Cambia la contraseña",

      "My account": "Mi cuenta",

      Save: "Salvar",

      "Profile Picture": "Foto de perfil",

      Username: "Nombre de usuario",

      "Display Name": "Nombre para mostrar",

      "Profile privacy settings": "Configuración de privacidad del perfil",

      "Send email everytime you login":
        "Enviar correo electrónico cada vez que inicie sesión",

      "Private profile": "Perfil privado",

      "Back to profile": "Volver al perfil",

      Save: "Salvar",

      "Old password": "Contraseña anterior",

      "New Password": "Nueva contraseña",

      "You aren't following any users": "No estás siguiendo a ningún usuario",

      "Follow accounts to see their posts":
        "Seguir cuentas para ver sus publicaciones",

      "No new friend requests": "No hay nuevas solicitudes de amistad",

      "Friend Requests": "Peticiones de amistad",

      Accept: "Aceptar",

      Reject: "Rechazar",

      Follow: "Seguir",
      "Request Sent": "Solicitud enviada",
      Message: "Mensaje",
      "This Account is Private": "Esta cuenta es privada",
      "Follow this account to see their posts":
        "Siga esta cuenta para ver sus publicaciones",
      "View profile": "Ver perfil",
      "Say Hi": "Di hola",
      Settings: "Configuración",
      "Delete chat": "Eliminar chat",
      "Say hi to new friend": "Saluda a un nuevo amigo",
      "Sign up with": "Registrarte con",
      "Or sign up with credentials": "O regístrese con credenciales",
      "Create account": "Crear una cuenta",
      "Sign in with": "Inicia sesión con",
      "Or sign in with credentials": "O inicie sesión con credenciales",
      Password: "Contraseña",
      Email: "correo electrónico",
      "Sign in": "Registrarse",
      "Create new account": "Crear una nueva cuenta",
      "Inbox":"Inbox",
    },
  },

  ger: {
    translation: {
      Register: "Registrieren",
      Login: "Anmeldung",

      "Edit Profile": "Profil bearbeiten",
      Posts: "Beiträge",
      Following: "Folgen",
      Followers: "Anhänger",
      "This user has not posted": "Dieser Benutzer hat nicht gepostet",
      Wall: "Zuhause",
      Profile: "Profil",
      Groups: "Gruppen",
      "Follow Requests": "Befolgen Sie die Anfragen",
      Close: "Schließen",

      "Log Out": "Ausloggen",

      Search: "Suche",

      "Change Password": "Ändere das Passwort",

      "About Me": "Über mich",

      "My Bio": "Meine Biographie",

      "Change Password": "Ändere das Passwort",

      "My account": "Mein Konto",

      Save: "Sparen",

      "Profile Picture": "Profilbild",

      Username: "Nutzername",

      "Display Name": "Anzeigename",

      "Profile privacy settings": "Profil Datenschutzeinstellungen",

      "Send email everytime you login":
        "Senden Sie jedes Mal eine E-Mail, wenn Sie sich anmelden",

      "Private profile": "Privates Profil",

      "Back to profile": "Zurück zum Profil",

      Save: "Sparen",

      "Old password": "Altes Passwort",

      "New Password": "Neues Kennwort",

      "You aren't following any users": "Sie folgen keinem Benutzer",

      "Follow accounts to see their posts":
        "Folgen Sie Konten, um ihre Beiträge zu sehen",

      "No new friend requests": "Keine neuen Freundschaftsanfragen",

      "Friend Requests": "Freundschaftsanfragen",

      Accept: "Akzeptieren",

      Reject: "Ablehnen",

      Follow: "Folgen",
      "Request Sent": "Anfrage geschickt",
      Message: "Botschaft",
      "This Account is Private": "Dieses Konto ist privat",
      "Follow this account to see their posts":
        "Folgen Sie diesem Konto, um ihre Beiträge zu sehen",
      "View profile": "Profil anzeigen",
      "Say Hi": "Sag Hallo",
      Settings: "Die Einstellungen",
      "Delete chat": "Chat löschen",
      "Say hi to new friend": "Sag Hallo zu neuem Freund",
      "Sign up with": "Anmelden mit",
      "Or sign up with credentials":
        "Oder melden Sie sich mit Anmeldeinformationen an",
      "Create account": "Konto erstellen",
      "Sign in with": "Anmelden mit",
      "Or sign in with credentials":
        "Oder melden Sie sich mit Anmeldeinformationen an",
      Password: "Passwort",
      Email: "Email",
      "Sign in": "Einloggen",

      "Create new account": "Neuen Account erstellen",
      "Inbox":"Inbox",
    },
  },
  fre: {
    translation: {
      Register: "S'inscrire",
      Login: "S'identifier",

      "Edit Profile": "Editer le profil",
      Posts: "Publicaciones",
      Following: "Suivant",
      Followers: "Suiveurs",
      "This user has not posted": "Cet utilisateur n'a pas publié",
      Wall: "Accueil",
      Profile: "Profil",
      Groups: "Groupes",
      "Follow Requests": "Suivre les demandes",
      Close: "Fermer",

      "Log Out": "Se déconnecter",

      Search: "Chercher",

      "Change Password": "Changer le mot de passe",

      "About Me": "À propos de moi",

      "My Bio": "Ma bio",

      "Change Password": "Changer le mot de passe",

      "My account": "Mon compte",

      Save: "Sauver",

      "Profile Picture": "Image de profil",

      Username: "Nom d'utilisateur",

      "Display Name": "Afficher un nom",

      "Profile privacy settings": "Paramètres de confidentialité du profil",

      "Send email everytime you login":
        "Envoyez un e-mail à chaque fois que vous vous connectez",

      "Private profile": "Profil privé",

      "Back to profile": "Retour au profil",

      Save: "Sauver",

      "Old password": "Ancien mot de passe",

      "New Password": "Nouveau mot de passe",

      "You aren't following any users": "Vous ne suivez aucun utilisateur",

      "Follow accounts to see their posts":
        "Suivez les comptes pour voir leurs messages",

      "No new friend requests": "Pas de nouvelles demandes d'amis",

      "Friend Requests": "Demandes d'ami",

      Accept: "J'accepte",

      Reject: "Rejeter",

      Follow: "Follow",
      "Request Sent": "Request Sent",
      Message: "Message",
      "This Account is Private": "This Account is Private",
      "Follow this account to see their posts":
        "Follow this account to see their posts",
      "View profile": "View profile",
      "Say Hi": "Say Hi",
      Settings: "Settings",
      "Delete chat": "Delete chat",
      "Say hi to new friend": "Say hi to new friend",
      "Sign up with": "Sign up with",
      "Or sign up with credentials": "Or sign up with credentials",
      "Create account": "Create account",
      "Sign in with": "Sign in with",
      "Or sign in with credentials": "Or sign in with credentials",
      Password: "Password",
      Email: "Emial",
      "Sign in": "Sign in",
      "Create new account": "Create new account",

      Follow: "Suivre",
      "Request Sent": "Demande envoyée",
      Message: "Message",
      "This Account is Private": "Ce compte est privé",
      "Follow this account to see their posts":
        "Suivez ce compte pour voir ses messages",
      "View profile": "Voir le profil",
      "Say Hi": "Dis salut",
      Settings: "Paramètres",
      "Delete chat": "Supprimer le chat",
      "Say hi to new friend": "Dites bonjour à un nouvel ami",
      "Sign up with": "Se connecter avec",
      "Or sign up with credentials": "Ou inscrivez-vous avec vos identifiants",
      "Create account": "Créer un compte",
      "Sign in with": "Se connecter avec",
      "Or sign in with credentials": "Ou connectez-vous avec vos identifiants",
      Password: "Mot de passe",
      Email: "Email",
      "Sign in": "Se connecter",
      "Create new account": "Créer un nouveau compte",
      "Inbox":"Inbox",
    },
  },
};

i18n.use(initReactI18next).init({
  // we init with resources
  resources,
  fallbackLng: "en",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;

// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
// // not like to use this?
// // have a look at the Quick start guide
// // for passing in lng and translations on init

// i18n
//   // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
//   // learn more: https://github.com/i18next/i18next-http-backend
//   .use(Backend)
//   // detect user language
//   // learn more: https://github.com/i18next/i18next-browser-languageDetector
//   .use(LanguageDetector)
//   // pass the i18n instance to react-i18next.
//   .use(initReactI18next)
//   // init i18next
//   // for all options read: https://www.i18next.com/overview/configuration-options
//   .init({
//     fallbackLng: 'en',
//     debug: true,

//     interpolation: {
//       escapeValue: false, // not needed for react as it escapes by default
//     }
//   });

// export default i18n;
