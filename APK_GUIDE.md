# 📱 ការរៀបចំ និងបង្កើត APK File (Android App Guide)

គម្រោងនេះត្រូវបានរៀបចំឡើងយ៉ាងពេញលេញជាមួយ **Capacitor Android** និង **Progressive Web App (PWA)** ដែលអនុញ្ញាតឲ្យលោកអ្នកបង្កើត និងដំឡើងលើទូរស័ព្ទ Android បានយ៉ាងងាយស្រួលតាមវិធីចំនួន ៣៖

## 🚀 APK File ដែលបានបង្កើតរួចរាល់ (Ready-to-Use APK)

File APK ត្រូវបានបង្កើត និង compile ជោគជ័យ ១០០% រួចរាល់ហើយ៖
- **ទីតាំងក្នុងកុំព្យូទ័ររបស់អ្នក (Local File):**  
  👉 [`MathGames-debug.apk`](file:///d:/Softwares/Antigravity/Math-Games/MathGames-debug.apk) (ទំហំ ~4.2 MB)
- **នៅលើ GitHub Actions Artifact:**  
  👉 [GitHub Actions Build Artifacts](https://github.com/hsptmoe-oss/Math-Games/actions/runs/36834623648) ➜ ចុចទាញយក **`MathGames-APK`**

---


## វិធីទី ១៖ បង្កើត APK តាមរយៈ Android Studio (ងាយស្រួល និងពេញនិយមបំផុត)

1. បើកកម្មវិធី **Android Studio** លើកុំព្យូទ័ររបស់អ្នក
2. ចុច **Open** ហើយជ្រើសរើស Folder៖  
   `d:\Softwares\Antigravity\Math-Games\android`
3. រង់ចាំ Android Studio ដំណើរការ Sync Gradle រួចរាល់
4. នៅ Menu ខាងលើ ចុច៖  
   👉 **Build** ➜ **Build Bundle(s) / APK(s)** ➜ **Build APK(s)**
5. ពេល Build ចប់ ចុចលើពាក្យ **locate** នោះអ្នកនឹងទទួលបាន File៖  
   `app-debug.apk` សម្រាប់ដំឡើងលើទូរស័ព្ទ Android ណាមួយបានភ្លាមៗ!

---

## វិធីទី ២៖ បង្កើត APK លើ Cloud តាមរយៈ GitHub Actions (ស្វ័យប្រវត្តិ)

យើងបានរៀបចំ File Workflow រួចរាល់នៅ៖  
`.github/workflows/build-apk.yml`

1. គ្រាន់តែ Push គម្រោងនេះទៅកាន់ **GitHub**
2. ចូលទៅកាន់ផ្ទាំង **Actions** លើ GitHub Repository របស់អ្នក
3. ប្រព័ន្ធនឹងដំណើរការ Compile និងបង្កើត `MathGames-Debug-APK` ដោយស្វ័យប្រវត្តិ
4. អ្នកអាចទាញយក (Download) File `.apk` មកប្រើប្រាស់បានភ្លាមៗដោយមិនបាច់ដំឡើង Android Studio លើកុំព្យូទ័រឡើយ!

---

## វិធីទី ៣៖ ដំឡើងជា Native App លើទូរស័ព្ទ Android ភ្លាមៗ (PWA)

យើងបានរៀបចំ **Web App Manifest (`manifest.json`)**, **Service Worker (`sw.js`)** និង **Icon កម្មវិធី** រួចជាស្រេច៖

1. បើកដំណើរការ Web Server (ឧទាហរណ៍ `npm start`)
2. បើកកម្មវិធី Google Chrome លើទូរស័ព្ទ Android ហើយចូលទៅកាន់ Link របស់ហ្គេម
3. ចុចលើ Menu សញ្ញាចុច ៣ (Menu) នៅជ្រុងខាងស្តាំលើ ➜ ជ្រើសរើស **«Install App» (ដំឡើងកម្មវិធី)** ឬ **«Add to Home screen»**
4. កម្មវិធីនឹងត្រូវដំឡើងទៅលើអេក្រង់ដើមនៃទូរស័ព្ទដូច App APK ធម្មតា មានរូប Icon ស្រស់ស្អាត បើកពេញអេក្រង់ (Full Screen) និងដំណើរការបានទោះគ្មានអ៊ីនធឺណិត (Offline)!
