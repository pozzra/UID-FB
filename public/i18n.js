// Multi-language Translation Engine (Default: Khmer 'km', with 'en' and 'vi')
// Uses localStorage ('fb_uid_lang') to persist user language preference across reloads

const translations = {
  km: {
    app_title: "ស្វែងរក UID ហ្វេសប៊ុក PRO",
    hero_badge: "ប្រព័ន្ធទាញយក GRAPH & CRAWLER ដោយស្វ័យប្រវត្តិ",
    hero_title_1: "ស្វែងរក UID ហ្វេសប៊ុក",
    hero_title_2: "ពីគ្រប់ទម្រង់តំណភ្ជាប់",
    hero_subtitle: "ទាញយកលេខសម្គាល់គណនី (UID) ភ្លាមៗពីគណនីផ្ទាល់ខ្លួន, ផេក, ក្រុម, ការបង្ហោះ, Reels ឬ Vanity URL ដោយមានចលនាបែបអន្តរកម្ម។",
    tab_single: "ស្វែងរកតែមួយ",
    tab_batch: "ស្វែងរកជាក្រុម",
    tab_history: "ប្រវត្តិ",
    tab_faq: "ការណែនាំ",
    input_placeholder: "បិទភ្ជាប់តំណ Facebook (ឧ. https://facebook.com/zuck, profile.php?id=...)",
    btn_paste: "បិទភ្ជាប់",
    try_now: "សាកល្បង:",
    btn_scan: "ទាញយក UID ឥឡូវនេះ • SCAN UID",
    scanner_title: "កំពុងស្កេន និងឌិកូដ Facebook Graph...",
    scanner_desc: "ប្រព័ន្ធកំពុងទាញយកទិន្នន័យ OpenGraph ដើម្បីស្រង់យក UID ពិតប្រាកដ",
    step_1: "1. វិភាគទម្រង់ URL",
    step_2: "2. ស្កេន Meta Crawlers",
    step_3: "3. ស្រង់យក Numeric UID",
    res_method_label: "វិធីសាស្ត្រ:",
    uid_label: "FACEBOOK USER ID (UID)",
    btn_copy_uid: "ចម្លង UID",
    copied: "បានចម្លង!",
    btn_open_web: "បើកលើ Web",
    btn_open_app: "បើកក្នុង FB App",
    btn_send_msg: "ផ្ញើសារ (m.me)",
    btn_download_hd: "ទាញយក Avatar HD",
    qr_title: "កូដ QR គណនីផ្ទាល់",
    qr_desc: "ស្កេនកូដដើម្បីបើកគណនី Facebook លើទូរស័ព្ទភ្លាមៗ។",
    btn_download_qr: "ទាញយកកូដ QR",
    batch_title: "ស្វែងរក UID ជាក្រុម (Batch Mode)",
    batch_desc: "បញ្ចូលបញ្ជីតំណភ្ជាប់ Facebook (អតិបរមា 25 តំណភ្ជាប់ក្នុងមួយលើក) មួយបន្ទាត់មួយតំណភ្ជាប់:",
    batch_placeholder: "https://www.facebook.com/zuck\nhttps://www.facebook.com/Meta\nhttps://www.facebook.com/profile.php?id=100089765432109",
    batch_paste: "បិទភ្ជាប់បញ្ជី",
    batch_clear: "សម្អាត",
    batch_submit: "ចាប់ផ្តើមស្កេនជាក្រុម",
    progress_label: "ដំណើរការ",
    th_input: "តំណភ្ជាប់បញ្ចូល",
    th_name: "ឈ្មោះគណនី",
    th_uid: "UID Facebook",
    th_status: "ស្ថានភាព",
    th_actions: "សកម្មភាព",
    status_success: "ជោគជ័យ",
    status_failed: "រកមិនឃើញ",
    status_error: "កំហុស",
    export_txt: "ទាញយក TXT (UID)",
    export_csv: "នាំចេញ CSV (Excel)",
    export_json: "នាំចេញ JSON",
    history_title: "ប្រវត្តិស្វែងរកថ្មីៗ",
    history_desc: "ទិន្នន័យត្រូវបានរក្សាទុកដោយសុវត្ថិភាពលើកម្មវិធីរុករករបស់អ្នក (Local Storage)",
    btn_clear_history: "សម្អាតប្រវត្តិ",
    history_empty: "មិនទាន់មានប្រវត្តិស្វែងរកនៅឡើយទេ។ សូមចាប់ផ្តើមស្វែងរក UID ដំបូងរបស់អ្នក!",
    btn_copy: "ចម្លង",
    btn_view: "មើល",
    faq_title: "ការណែនាំ និងទម្រង់តំណភ្ជាប់ដែលគាំទ្រ",
    faq_q1: "1. តើ UID Facebook ជាអ្វី? ប្រើសម្រាប់អ្វី?",
    faq_a1: "UID (User ID) គឺជាលេខសម្គាល់តែមួយគត់សម្រាប់គណនីនីមួយៗនៅលើ Facebook (អ្នកប្រើប្រាស់, ផេក, ក្រុម, ការបង្ហោះ)។ UID មិនដែលផ្លាស់ប្តូរទេ បើទោះបីជាប្តូរឈ្មោះ ឬ Vanity Username ក៏ដោយ។",
    faq_q2: "2. តើតំណភ្ជាប់ Facebook ប្រភេទណាខ្លះដែលគាំទ្រ?",
    faq_a2_intro: "ប្រព័ន្ធគាំទ្រ 100% គ្រប់ទម្រង់តំណភ្ជាប់ Facebook សព្វថ្ងៃ៖",
    faq_q3: "3. តើឧបករណ៍នេះមានសុវត្ថិភាពដែរឬទេ?",
    faq_a3: "សុវត្ថិភាព 100%។ អ្នកមិនចាំបាច់ចូលគណនី Facebook របស់អ្នកឡើយ មិនទាមទារ Cookie ឬ Access Token ទេ។",
    toast_enter_url: "សូមបញ្ចូល Link Facebook ឬ Username!",
    toast_copied: "បានចម្លង UID: ",
    toast_pasted: "បានបិទភ្ជាប់ពី clipboard!",
    toast_clipboard_perm: "សូមអនុញ្ញាតសិទ្ធិ Clipboard!",
    toast_download_qr: "បានទាញយកកូដ QR!",
    toast_batch_empty: "សូមបញ្ចូលយ៉ាងហោចណាស់ 1 តំណភ្ជាប់ Facebook!",
    toast_batch_done: "បានបញ្ចប់ការស្កេនទាំងអស់!",
    toast_history_cleared: "បានសម្អាតប្រវត្តិទាំងស្រុង!",
    sound_on: "សំឡេង៖ បានបើក",
    sound_off: "សំឡេង៖ បានបិទ",
    btn_copy_name: "ចម្លងឈ្មោះ",
    toast_copied_name: "បានចម្លងឈ្មោះ: ",
    gender_male: "♂ ប្រុស (Male)",
    gender_female: "♀ ស្រី (Female)",
    gender_unknown: "👤 មិនដឹង",
    status_live: "✅ Live / សកម្ម",
    status_dead: "❌ Dead / បាត់",
    status_disabled: "🚫 Disabled / បិទ",
    status_checkpoint: "⚠️ Checkpoint",
    status_memorialized: "🕊️ Memorialized",
    status_redirect: "↩️ Redirected"
  },
  en: {
    app_title: "FACEBOOK UID FINDER PRO",
    hero_badge: "AUTO GRAPH DECODER & METADATA CRAWLER",
    hero_title_1: "Find Facebook UID",
    hero_title_2: "From Any Facebook Link",
    hero_subtitle: "Extract precise numeric User IDs instantly from personal profiles, fanpages, groups, posts, reels, or vanity URLs with interactive animations.",
    tab_single: "Single Lookup",
    tab_batch: "Batch Mode",
    tab_history: "History",
    tab_faq: "Guide & FAQ",
    input_placeholder: "Paste Facebook link or username (e.g. https://facebook.com/zuck, profile.php?id=...)",
    btn_paste: "Paste",
    try_now: "Try now:",
    btn_scan: "FIND UID NOW • SCAN UID",
    scanner_title: "Scanning and decoding Facebook Graph...",
    scanner_desc: "System is retrieving OpenGraph metadata to extract authentic numeric UID",
    step_1: "1. Parse URL Syntax",
    step_2: "2. Crawl Meta Graph",
    step_3: "3. Extract Numeric UID",
    res_method_label: "Method:",
    uid_label: "FACEBOOK USER ID (UID)",
    btn_copy_uid: "Copy UID",
    copied: "Copied!",
    btn_open_web: "Open Web Profile",
    btn_open_app: "Open in FB App",
    btn_send_msg: "Send Message (m.me)",
    btn_download_hd: "Download HD Avatar",
    qr_title: "Direct Profile QR Code",
    qr_desc: "Scan with your mobile phone camera to open Facebook profile directly in app.",
    btn_download_qr: "Download QR Code",
    batch_title: "Batch Facebook UID Lookup",
    batch_desc: "Enter a list of Facebook links (up to 25 links per request), one per line:",
    batch_placeholder: "https://www.facebook.com/zuck\nhttps://www.facebook.com/Meta\nhttps://www.facebook.com/profile.php?id=100089765432109",
    batch_paste: "Paste List",
    batch_clear: "Clear",
    batch_submit: "Start Batch Scan",
    progress_label: "Processing Progress",
    th_input: "Input Link",
    th_name: "Account Name",
    th_uid: "Facebook UID",
    th_status: "Status",
    th_actions: "Actions",
    status_success: "Success",
    status_failed: "Not Found",
    status_error: "Error",
    export_txt: "Export TXT (UID Only)",
    export_csv: "Export CSV (Excel)",
    export_json: "Export JSON",
    history_title: "Recent Lookup History",
    history_desc: "Data is saved locally in your browser storage (Local Storage)",
    btn_clear_history: "Clear History",
    history_empty: "No lookup history yet. Perform your first Facebook UID lookup!",
    btn_copy: "Copy",
    btn_view: "View",
    faq_title: "User Guide & Supported Link Formats",
    faq_q1: "1. What is a Facebook UID? What is it used for?",
    faq_a1: "A Facebook UID (User ID) is a permanent, unique numerical identifier assigned to every entity on Facebook (profiles, pages, groups, posts). It never changes even if the username or display name changes.",
    faq_q2: "2. Which Facebook URL formats are supported?",
    faq_a2_intro: "The system natively supports all modern Facebook formats:",
    faq_q3: "3. Is this tool safe and secure?",
    faq_a3: "100% safe. You do not need to log into Facebook, and no personal credentials, cookies, or access tokens are ever requested.",
    toast_enter_url: "Please enter a Facebook URL or Username!",
    toast_copied: "Copied UID: ",
    toast_pasted: "Pasted link from clipboard!",
    toast_clipboard_perm: "Please allow clipboard permissions.",
    toast_download_qr: "QR Code downloaded!",
    toast_batch_empty: "Please enter at least 1 Facebook link!",
    toast_batch_done: "Batch scanning finished!",
    toast_history_cleared: "History cleared successfully!",
    sound_on: "Sound FX: Enabled",
    sound_off: "Sound FX: Muted",
    btn_copy_name: "Copy Name",
    toast_copied_name: "Copied name: ",
    gender_male: "♂ Male",
    gender_female: "♀ Female",
    gender_unknown: "👤 Unknown",
    status_live: "✅ Live / Active",
    status_dead: "❌ Dead / Not Found",
    status_disabled: "🚫 Disabled",
    status_checkpoint: "⚠️ Checkpoint",
    status_memorialized: "🕊️ Memorialized",
    status_redirect: "↩️ Redirected"
  },
  vi: {
    app_title: "TÌM UID FACEBOOK PRO",
    hero_badge: "AUTO GRAPH DECODER & METADATA CRAWLER",
    hero_title_1: "Tìm UID Facebook",
    hero_title_2: "Từ Mọi Định Dạng Liên Kết",
    hero_subtitle: "Trích xuất mã định danh số (User ID) chuẩn xác tức thì từ Profile cá nhân, Fanpage, Nhóm, Bài viết, Reels hoặc Vanity URL với hiệu ứng đồ họa động tương tác.",
    tab_single: "Tìm Kiếm Đơn",
    tab_batch: "Tìm Hàng Loạt",
    tab_history: "Lịch Sử",
    tab_faq: "Hướng Dẫn",
    input_placeholder: "Dán link Facebook (vd: https://facebook.com/zuck, profile.php?id=...)",
    btn_paste: "Dán",
    try_now: "Thử ngay:",
    btn_scan: "LẤY UID NGAY • SCAN UID",
    scanner_title: "Đang quét và giải mã Facebook Graph...",
    scanner_desc: "Hệ thống đang truy xuất OpenGraph metadata để trích xuất UID chính xác",
    step_1: "1. Phân tích cú pháp URL",
    step_2: "2. Quét Meta Tag Crawlers",
    step_3: "3. Khôi phục Numeric UID",
    res_method_label: "Phương thức:",
    uid_label: "FACEBOOK USER ID (UID)",
    btn_copy_uid: "Sao chép UID",
    copied: "Đã sao chép!",
    btn_open_web: "Mở Trên Web",
    btn_open_app: "Mở FB App",
    btn_send_msg: "Gửi Tin Nhắn (m.me)",
    btn_download_hd: "Tải Avatar HD",
    qr_title: "Mã QR Hồ Sơ Trực Tiếp",
    qr_desc: "Quét mã bằng camera điện thoại để mở thẳng tài khoản Facebook trong ứng dụng.",
    btn_download_qr: "Tải ảnh QR Code",
    batch_title: "Tìm Kiếm UID Hàng Loạt (Batch Mode)",
    batch_desc: "Nhập danh sách link Facebook (tối đa 25 link mỗi lần), mỗi dòng là một liên kết:",
    batch_placeholder: "https://www.facebook.com/zuck\nhttps://www.facebook.com/Meta\nhttps://www.facebook.com/profile.php?id=100089765432109",
    batch_paste: "Dán danh sách",
    batch_clear: "Xóa",
    batch_submit: "Bắt Đầu Quét Hàng Loạt",
    progress_label: "Tiến độ xử lý",
    th_input: "Liên kết đầu vào",
    th_name: "Tên tài khoản",
    th_uid: "UID Facebook",
    th_status: "Trạng thái",
    th_actions: "Hành động",
    status_success: "Thành công",
    status_failed: "Không tìm thấy",
    status_error: "Lỗi",
    export_txt: "Tải file TXT (Chỉ UID)",
    export_csv: "Xuất CSV (Excel)",
    export_json: "Xuất JSON",
    history_title: "Lịch Sử Tra Cứu Gần Đây",
    history_desc: "Dữ liệu được lưu an toàn trong trình duyệt của bạn (Local Storage)",
    btn_clear_history: "Xóa Lịch Sử",
    history_empty: "Chưa có lịch sử tra cứu nào. Hãy tìm kiếm UID đầu tiên!",
    btn_copy: "Copy",
    btn_view: "Xem",
    faq_title: "Hướng Dẫn Tra Cứu & Các Định Dạng Hỗ Trợ",
    faq_q1: "1. UID Facebook là gì? Dùng để làm gì?",
    faq_a1: "UID (User ID) là dãy số định danh duy nhất của mỗi thực thể trên Facebook (người dùng, trang fanpage, nhóm cộng đồng, bài viết, sự kiện). UID không bao giờ thay đổi ngay cả khi chủ sở hữu đổi tên hiển thị hoặc URL tùy chỉnh (vanity username).",
    faq_q2: "2. Các dạng liên kết Facebook nào được hỗ trợ?",
    faq_a2_intro: "Hệ thống hỗ trợ 100% các định dạng Facebook phổ biến hiện nay:",
    faq_q3: "3. Công cụ có bảo đảm an toàn và bảo mật không?",
    faq_a3: "Hoàn toàn an toàn 100%. Bạn không cần đăng nhập tài khoản Facebook của mình, không yêu cầu cung cấp Cookie hay Access Token cá nhân.",
    toast_enter_url: "Vui lòng nhập Link Facebook hoặc Username!",
    toast_copied: "Đã sao chép UID: ",
    toast_pasted: "Đã dán liên kết từ clipboard!",
    toast_clipboard_perm: "Vui lòng cho phép quyền truy cập Clipboard.",
    toast_download_qr: "Đã tải xuống mã QR!",
    toast_batch_empty: "Vui lòng nhập ít nhất 1 liên kết Facebook!",
    toast_batch_done: "Đã hoàn tất tìm kiếm tất cả liên kết!",
    toast_history_cleared: "Đã xóa toàn bộ lịch sử!",
    sound_on: "Âm thanh hiệu ứng: Đã bật",
    sound_off: "Âm thanh hiệu ứng: Đã tắt",
    btn_copy_name: "Sao chép tên",
    toast_copied_name: "Đã sao chép tên: ",
    gender_male: "♂ Nam (Male)",
    gender_female: "♀ Nữ (Female)",
    gender_unknown: "👤 Không rõ",
    status_live: "✅ Live / Hoạt động",
    status_dead: "❌ Dead / Không tìm thấy",
    status_disabled: "🚫 Đã bị vô hiệu hóa",
    status_checkpoint: "⚠️ Checkpoint",
    status_memorialized: "🕊️ Tưởng niệm",
    status_redirect: "↩️ Chuyển hướng"
  }
};

class I18nManager {
  constructor() {
    // Default language is 'km' (Khmer) if not explicitly set in localStorage
    this.currentLang = localStorage.getItem('fb_uid_lang') || 'km';
  }

  init() {
    this.setLanguage(this.currentLang);
  }

  setLanguage(lang) {
    if (!translations[lang]) lang = 'km';
    this.currentLang = lang;
    localStorage.setItem('fb_uid_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Apply translations to all DOM elements with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Apply translations to placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Update select element value if present
    const select = document.getElementById('lang-select');
    if (select && select.value !== lang) {
      select.value = lang;
    }
  }

  t(key) {
    return translations[this.currentLang]?.[key] || translations['km']?.[key] || key;
  }
}

window.i18n = new I18nManager();


