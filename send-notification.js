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

    // الوقت الحالي بتوقيت الجزائر
    const now = new Date();

    const algeriaTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Algiers",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    console.log("🇩🇿 الوقت الحالي في الجزائر:", algeriaTime);

    // أوقات الإشعارات
    const notificationTimes = [
      "06:05",
      "17:05"
    ];

    // نرسل فقط إذا كان الوقت قريبًا من الموعد
    const shouldSend = notificationTimes.some(time => {
      const [h, m] = time.split(":").map(Number);
      const [currentH, currentM] = algeriaTime
        .split(":")
        .map(Number);

      const targetMinutes = h * 60 + m;
      const currentMinutes = currentH * 60 + currentM;

      return Math.abs(currentMinutes - targetMinutes) <= 2;
    });

    if (!shouldSend) {
      console.log(
        "⏰ ليس وقت إرسال الإشعار. لن يتم إرسال شيء."
      );

      return;
    }

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

    console.log("✅ تم إرسال الإشعار بنجاح");
    console.log("Message ID:", response);

  } catch (error) {
    console.error("❌ فشل إرسال الإشعار:");
    console.error(error);

    process.exit(1);
  }
}

sendNotification();
