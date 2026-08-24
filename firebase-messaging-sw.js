importScripts(
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAVXjifBL3sFF6n4CYy39ur4Al6L7J_KeQ",
  authDomain: "muslim-kids-azkar.firebaseapp.com",
  projectId: "muslim-kids-azkar",
  storageBucket: "muslim-kids-azkar.firebasestorage.app",
  messagingSenderId: "204235175360",
  appId: "1:204235175360:web:cd6f4aac2d8f9e1d4f0425"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "أذكار الطفل المسلم";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "حان وقت الأذكار 🌷",
    icon: "/icon-192.png"
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
