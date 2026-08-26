const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const token = process.env.FCM_TOKEN;

if (!token) {
  throw new Error("FCM_TOKEN غير موجود");
}

admin.messaging().send({
  token: token,
  notification: {
    title: "أذكار الطفل المسلم 🌷",
    body: "🔔 حان وقت أذكارك ❤️"
  },
  webpush: {
    notification: {
      icon: "/azkar-little-muslim/icon-192.png",
      badge: "/azkar-little-muslim/icon-192.png"
    }
  }
}).then(() => {
  console.log("تم إرسال الإشعار بنجاح ✅");
}).catch((error) => {
  console.error("فشل إرسال الإشعار:", error);
  process.exit(1);
});
