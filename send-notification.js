const admin = require("firebase-admin");

async function sendNotification() {
  try {
    // قراءة بيانات Firebase
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT
    );

    // تهيئة Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    // قراءة التوكن
    const token = process.env.FCM_TOKEN;

    if (!token) {
      throw new Error(
        "FCM_TOKEN غير موجود في GitHub Secrets"
      );
    }

    console.log("📤 جاري إرسال الإشعار...");

    // إرسال الإشعار
    const response = await admin.messaging().send({
      token: token,

      notification: {
        title: "أذكار الطفل المسلم 🌷",
        body: "🔔 حان وقت أذكارك ❤️"
      },

      webpush: {
        notification: {
          icon:
            "https://rrahofa674-sudo.github.io/azkar-little-muslim/icon-192.png",

          badge:
            "https://rrahofa674-sudo.github.io/azkar-little-muslim/icon-192.png"
        }
      }
    });

    console.log("✅ تم إرسال الإشعار بنجاح!");
    console.log("📨 Message ID:", response);

  } catch (error) {
    console.error("❌ فشل إرسال الإشعار:");
    console.error(error);

    process.exit(1);
  }
}

sendNotification();
