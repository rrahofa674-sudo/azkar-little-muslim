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

    // معرفة نوع تشغيل GitHub Actions
    const eventName = process.env.GITHUB_EVENT_NAME;

    console.log("🚀 نوع التشغيل:", eventName);

    // إذا تم تشغيل Workflow يدويًا
    // نرسل الإشعار فورًا للاختبار
    const isManualRun = eventName === "workflow_dispatch";

    // الوقت الحالي بتوقيت الجزائر
    const now = new Date();

    const algeriaTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Algiers",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    console.log("🇩🇿 الوقت الحالي في الجزائر:", algeriaTime);

    // أوقات الإشعارات التلقائية
    const notificationTimes = [
      "06:05",
      "17:05"
    ];

    // في التشغيل اليدوي: نرسل مباشرة
    let shouldSend = isManualRun;

    // في التشغيل التلقائي: نرسل فقط قرب موعد الإشعار
    if (!isManualRun) {
      shouldSend = notificationTimes.some(time => {
        const [h, m] = time.split(":").map(Number);

        const [currentH, currentM] = algeriaTime
          .split(":")
          .map(Number);

        const targetMinutes = h * 60 + m;
        const currentMinutes = currentH * 60 + currentM;

        return Math.abs(currentMinutes - targetMinutes) <= 2;
      });
    }

    // إذا لم يكن وقت الإرسال
    if (!shouldSend) {
      console.log(
        "⏰ ليس وقت إرسال الإشعار التلقائي. لن يتم إرسال شيء."
      );

      return;
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
