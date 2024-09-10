"use strict";
(self["webpackChunksaypi_userscript"] = self["webpackChunksaypi_userscript"] || []).push([[388],{

/***/ 4388:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"activityCheckButton":{"description":"Teks butang untuk menunjukkan bahawa pengguna masih hadir.","message":"Ya, saya masih di sini!"},"activityCheckMessage":{"description":"Mesej untuk dipaparkan apabila perbualan berlangsung lama secara tidak biasa.","message":"Wow, ini adalah perbualan yang panjang. Adakah anda masih di sana, atau kita sedang bercakap dengan diri sendiri?"},"allowInterruptions":{"description":"Label untuk kotak semak untuk membolehkan/melarang pengguna mengganggu respons Pi dengan berbicara.","message":"Boleh diganggu"},"appDescription":{"description":"Penerangan tentang aplikasi.","message":"Teman Bantuan Suara Anda untuk Pi AI"},"appName":{"description":"Nama aplikasi.","message":"Katakan, Pi"},"applicationStatusIssue":{"description":"Mesej untuk dipaparkan apabila aplikasi mengalami masalah.","message":"Amaran Isu Sistem"},"applicationStatusUnknown":{"description":"Mesej untuk dipaparkan apabila status aplikasi tidak dapat ditentukan. Contohnya, apabila pelanggan berada di luar talian.","message":"Status permohonan tidak diketahui"},"assistantIsListening":{"description":"Mesej dipaparkan apabila pembantu sedang mendengar ucapan.","message":"$chatbot$ sedang mendengar...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"assistantIsSpeaking":{"description":"Mesej dipaparkan apabila pembantu sedang memberikan responsnya.","message":"$chatbot$ sedang bercakap...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"assistantIsThinking":{"description":"Mesej dipaparkan apabila pembantu sedang menyediakan responsnya.","message":"$chatbot$ sedang berfikir...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"audioConnected":{"description":"Mesej dipaparkan apabila mikrofon disambungkan","message":"$microphone$ disambungkan","placeholders":{"microphone":{"content":"$1","example":"Default - MacBook Pro Microphone"}}},"audioInputError":{"description":"Mesej yang dipaparkan apabila audio menghasilkan transkripsi kosong - biasanya hasil daripada penapisan.","message":"Oops, $chatbot$ tidak menangkap itu. Bolehkah anda cuba mengatakannya lagi?","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"audioReconnecting":{"description":"Mesej dipaparkan apabila menyambung ke mikrofon baru","message":"Menukar ke $microphone$...","placeholders":{"microphone":{"content":"$1","example":"Default - AirPods Pro"}}},"autoSubmit":{"description":"Label untuk kotak semak untuk mengaktifkan/mematikan penghantaran petunjuk automatik.","message":"Hantar secara automatik"},"callError":{"description":"Tooltip untuk dipaparkan pada butang panggilan apabila ralat tidak membahayakan berlaku.","message":"Ralat tidak membawa maut dijumpai. Jangan panik, kami masih mendengar."},"callInProgress":{"description":"Tooltip untuk dipaparkan pada butang panggilan apabila panggilan sedang berlangsung.","message":"Akhiri perbualan tanpa tangan"},"callNotStarted":{"description":"Tooltip untuk dipaparkan pada butang panggilan sebelum panggilan dimulakan.","message":"Mulakan perbualan tanpa menggunakan tangan dengan $chatbot$","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"callStarting":{"description":"Teks untuk dipaparkan pada tooltip butang panggilan dan di kawasan petunjuk apabila panggilan bermula.","message":"Menyambung..."},"checkingApplicationStatus":{"description":"Mesej untuk dipaparkan semasa status sistem sedang ditentukan, contohnya semasa proses memuat.","message":"Memeriksa status aplikasi..."},"consentAskParticipate":{"message":"Adakah anda ingin menyertai?"},"consentBetterTogether":{"message":"Jom kita perbaiki Say, Pi bersama-sama"},"consentDataDeidentified":{"message":"Analitik tidak dikaitkan dengan individu. Sebarang data yang digunakan adalah dinyahidentifikasi."},"consentNoPii":{"message":"Kami tidak akan mengumpul atau melihat data peribadi, seperti mesej atau nama."},"consentNoSale":{"message":"Kami tidak akan menjual data anda kepada pihak ketiga, atau menggunakannya untuk pengiklanan."},"consentOptIn":{"message":"Saya masuk!"},"consentOptOut":{"message":"Tidak, terima kasih"},"consentPrivacyParamount":{"message":"Privasi anda adalah yang utama. Apa sahaja yang anda katakan kekal di antara anda dan Pi."},"consentRightToRevoke":{"message":"Anda boleh menukar fikiran anda pada bila-bila masa."},"consentSharingPurpose":{"message":"Menyampaikan data penggunaan anda akan membantu kami memahami bagaimana orang menggunakan Say, Pi supaya kami dapat memperbaikinya untuk semua orang."},"consetPrivacyPolicy":{"message":"Baca Dasar Privasi kami"},"continueUnlocking":{"description":"Arahan memberitahu pengguna bagaimana untuk meneruskan setelah mereka telah mula menekan butang buka kunci.","message":"Teruskan mengekalkan untuk membuka..."},"currencyUSDAbbreviation":{"description":"Singkatan untuk Dolar Amerika Syarikat.","message":"USD"},"currentCharges":{"description":"Istilah yang digunakan untuk menggambarkan caj semasa (jumlah berjalan) yang dikumpulkan oleh pengguna.","message":"Caj semasa"},"dismissAlert":{"description":"Label untuk butang untuk menolak amaran isu sistem.","message":"Buang"},"enableTTS":{"description":"Label untuk kotak semak untuk mengaktifkan/mematikan teks-ke-ucapan.","message":"Suara pelbagai bahasa"},"enhancedVoice":{"description":"Tajuk (tooltip) untuk Suara Ditingkatkan Say, Pi.","message":"Suara dipertingkatkan oleh $product$","placeholders":{"product":{"content":"$1","example":"Say, Pi"}}},"enterImmersiveModeLong":{"description":"Aria-label dan tajuk butang untuk memasuki mod celupan pada peranti mudah alih.","message":"Masuk Mod Celupan"},"enterImmersiveModeShort":{"description":"Teks butang untuk memasuki mod celupan pada desktop.","message":"Menyeluruh"},"exitImmersiveModeLong":{"description":"Aria-label dan tajuk butang untuk keluar dari mod meresap pada peranti mudah alih, kembali ke mod desktop berasaskan teks.","message":"Keluar Mod Imersif"},"extensionPopupTitle":{"description":"Tajuk dialog popup sambungan.","message":"Katakan, Tetapan Pi"},"lockButton":{"description":"Tajuk (tooltip) butang untuk mengunci skrin daripada sentuhan tidak sengaja.","message":"Tekan untuk mengunci skrin"},"lockedScreen":{"description":"Sebuah mesej untuk dipaparkan dengan jelas apabila skrin dikunci.","message":"Skrin telah dikunci."},"mode_accuracy":{"description":"Mod kejituan tertinggi.","message":"ketepatan"},"mode_balanced":{"description":"Mod transkripsi lalai.","message":"seimbang"},"mode_speed":{"description":"Mod transkripsi terpantas.","message":"kelajuan"},"preferedLanguage":{"description":"Label untuk kawalan memilih bahasa transkripsi yang disukai.","message":"Bahasa"},"preferedModeControl":{"description":"Tajuk (tooltip) kawalan untuk memilih mod transkripsi yang disukai.","message":"Pilih mod transkripsi yang anda prefer."},"previewProgress":{"description":"Mesej untuk dipaparkan apabila pengguna sedang melihat pratinjau ciri yang mempunyai had karakter.","message":"$count$ aksara digunakan daripada $limit$","placeholders":{"count":{"content":"$1","example":"123"},"limit":{"content":"$2","example":"500"}}},"previewStatusActive":{"message":"Aktif Beta"},"previewStatusCompleted":{"message":"Beta Selesai"},"previewStatusPaused":{"description":"Mesej untuk dipaparkan apabila pengguna sedang melihat pratinjau ciri yang telah dihentikan sementara.","message":"Beta Ditangguhkan sehingga $resetDate$","placeholders":{"resetDate":{"content":"$1","example":"2021-12-31"}}},"previewStatusUnknown":{"message":"Tidak dapat menyambung..."},"readAloudButtonTitle":{"description":"Tajuk butang untuk membaca teks mesej dengan kuat.","message":"Bacakan"},"recommendedActions":{"description":"Mesej yang mendahului senarai tindakan yang disyorkan yang boleh diambil oleh pengguna untuk membetulkan masalah yang diketahui.","message":"Sementara itu, kami cadangkan:"},"shareAnalytics":{"description":"Label untuk kotak semak untuk mengaktifkan/mematikan perkongsian analitik.","message":"Kongsi analitik"},"soundEffects":{"description":"Label untuk kotak semak untuk mengaktifkan/mematikan kesan bunyi.","message":"Kesan bunyi"},"toggleThemeToDarkMode":{"description":"Label untuk butang untuk beralih ke mod gelap.","message":"Beralih ke mod gelap"},"toggleThemeToLightMode":{"description":"Label untuk butang untuk beralih ke mod cahaya.","message":"Beralih ke mod cahaya"},"ttsCostExplanation":{"description":"Tooltip untuk dipaparkan apabila enjin teks-ke-ucapan digunakan untuk membaca pesanan secara kuat, dengan kos pesanan tersebut.","message":"$product$ akan mengenakan bayaran $cost$ $currency$ untuk mendengar mesej ini","placeholders":{"cost":{"content":"$1","example":"0.01"},"currency":{"content":"$2","example":"credits"},"product":{"content":"$3","example":"Say, Pi"}}},"ttsCostExplanationFree":{"description":"Tooltip untuk dipaparkan apabila enjin teks-ke-ucapan digunakan untuk membaca pesanan secara lantang, dan pesanan itu adalah percuma. Mungkin mengandungi nama penyedia.","message":"Audio ini dijana secara percuma oleh Inflection AI","placeholders":{"provider":{"content":"$1","example":"Inflection AI"}}},"ttsPoweredBy":{"description":"Mesej untuk dipaparkan apabila enjin teks-ke-ucapan digunakan untuk membaca mesej dengan kuat.","message":"Teks-ke-pertuturan dikuasakan oleh $ttsEngine$","placeholders":{"ttsEngine":{"content":"$1","example":"ElevenLabs"}}},"unlockButton":{"description":"Tajuk (tooltip) butang untuk membuka kunci skrin.","message":"Tekan untuk membuka skrin"},"unlockInstruction":{"description":"Arahan memberitahu pengguna bagaimana untuk membuka skrin apabila dikunci.","message":"Tahan untuk membuka kunci."},"userStartedInterrupting":{"description":"Mesej dipaparkan apabila pengguna mula bercakap semasa pembantu sedang bercakap.","message":"Teruskan, $chatbot$ sedang mendengar...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"copiedButtonTitle":{"message":"Disalin!","description":"Tajuk butang untuk menunjukkan bahawa teks mesej telah disalin ke papan keratan."},"copyButtonTitle":{"message":"Salin","description":"Tajuk butang untuk menyalin teks mesej ke papan keratan."},"voiceIntroduction_joey":{"message":"Hola! \\nПривет! \\n你好! \\nSaya Pi, pembantu AI poliglot anda. \\nDengan 32 bahasa di bawah arahan saya, kami boleh meneroka idea dan budaya dari seluruh dunia. \\nApa pendapat anda tentang suara ini?","description":"Pengenalan untuk suara Joey."},"voiceIntroduction_paola":{"message":"Ciao! \\nBonjour! \\nhelo! \\nSaya Pi, dan saya boleh bercakap dengan fasih dalam 32 bahasa. \\nDari bahasa Arab ke Bahasa Ukraine, saya di sini untuk memecahkan halangan bahasa. \\nBagaimanakah suara ini terdengar kepada anda?","description":"Pengenalan untuk suara Paola."},"regenerateButtonTitle":{"message":"Hasilkan Audio untuk $cost$ $currency$","description":"Tajuk butang untuk menjana semula audio mesej. Mungkin menimbulkan kos anggaran.","placeholders":{"cost":{"content":"$1","example":"0.01"},"currency":{"content":"$2","example":"credits"}}},"regenerateButtonTitleFree":{"message":"Hasilkan Audio","description":"Tajuk butang untuk menjana semula audio mesej. Mungkin menimbulkan kos yang tidak ditentukan."},"assistantIsWriting":{"description":"Mesej dipaparkan semasa pembantu menaip responsnya.","message":"$chatbot$ sedang menulis...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"ttsCostExplanationSayPi":{"description":"Petua alat untuk dipaparkan apabila pengguna menuding pada pautan penjelasan kos.","placeholders":{"product":{"content":"$1","example":"Say, Pi"}},"message":"Ketahui cara $product$ mengenakan bayaran untuk audio"}}');

/***/ })

}]);