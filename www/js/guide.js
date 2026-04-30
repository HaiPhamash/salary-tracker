/* =========================================================================
   Guide — in-app multilingual usage guide with screenshots
   ========================================================================= */

const GUIDE_VISUAL_KEYS = [
  'home-dashboard', 'home-recent', 'home-empty',
  'add-shift-form', 'add-list', 'add-calendar', 'add-from-history',
  'expense-form', 'expense-day',
  'report-month', 'report-week', 'report-quarter', 'report-year', 'report-export',
  'settings-root', 'settings-jobs-list', 'settings-job-edit', 'settings-job-icon',
  'settings-categories', 'settings-category-edit',
  'settings-recurring', 'settings-recurring-edit',
  'settings-language', 'settings-currency', 'settings-users', 'settings-export',
  'jp-input', 'jp-result'
];
const GUIDE_FALLBACK_VISUAL = 'home-dashboard';

function getGuideVisualPath(key) {
  const lang = GUIDE_FULL_COPY[curLang] ? curLang : 'en';
  const visual = GUIDE_VISUAL_KEYS.includes(key) ? key : GUIDE_FALLBACK_VISUAL;
  return `img/guide/${lang}/${visual}.webp`;
}

const GUIDE_FULL_COPY = {
  vi: {
    title: 'Hướng dẫn đầy đủ Salary Tracker',
    intro: 'Hướng dẫn này đi qua từng khu vực trong app: tổng quan, dashboard, ca làm, cấu hình công việc, chi tiêu, báo cáo, các phân mục cài đặt, chuyển đổi ngôn ngữ và Japan Take-home Plus.',
    tipsTitle: 'Lưu ý chung',
    tips: [
      'Luồng khuyến nghị: tạo nơi làm việc → thêm ca làm → ghi chi tiêu → xem báo cáo.',
      'Thu nhập là trọng tâm; chi tiêu giúp bạn biết số còn lại thực tế.',
      'Toàn bộ dữ liệu chỉ được lưu trên thiết bị của bạn, không gửi lên máy chủ.',
      'Hãy xuất CSV/PDF trước khi xóa dữ liệu hoặc xóa hồ sơ người dùng.',
      'Japan Take-home Plus chỉ là ước tính, không thay thế phiếu lương chính thức hoặc tư vấn thuế.'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: 'Tổng quan ứng dụng',
        body: 'Salary Tracker giúp bạn theo dõi thu nhập từ nhiều nơi làm việc và bổ sung phần chi tiêu nhẹ để biết số tiền còn lại theo ngày, tuần, tháng, quý và năm.',
        details: [
          'Mục đích chính: tổng hợp thu nhập theo giờ, theo ngày hoặc theo tháng từ nhiều công việc khác nhau.',
          'Thu nhập là chính, chi tiêu là phụ — app không thay thế công cụ kế toán đầy đủ.',
          'Mọi dữ liệu được lưu trực tiếp trên thiết bị; không có tài khoản đám mây hay đồng bộ trực tuyến.',
          'Bốn tab chính: Trang chủ, Thêm công việc, Báo cáo và Cài đặt.',
          'Luồng dùng đề xuất: thiết lập nơi làm việc trước, thêm ca làm, ghi chi tiêu, rồi mở báo cáo để đối chiếu.'
        ]
      },
      {
        visual: 'home-recent',
        title: 'Trang chủ và dashboard',
        body: 'Dashboard ưu tiên thu nhập trước, sau đó hiển thị chi tiêu và phần còn lại như thông tin bổ trợ.',
        details: [
          'Thu nhập hôm nay, tuần này, tháng này và năm nay giúp bạn nắm tiến độ ngay khi mở app.',
          'Chi hôm nay là tổng các khoản chi đã ghi trong ngày hiện tại.',
          'Còn lại = thu nhập sau khấu trừ trừ đi chi tiêu của cùng kỳ; số liệu này chỉ là tham chiếu nhanh.',
          'Khu công việc gần đây liệt kê các ca đã thêm gần nhất để bạn kiểm tra hoặc sửa nhanh.',
          'Thống kê nhanh hiển thị số ca, số giờ và xu hướng để bạn đánh giá khối lượng làm việc.',
          'Mục tiêu tháng cho biết thu nhập hiện tại đang đạt bao nhiêu phần trăm so với mức bạn đặt cho công việc.'
        ]
      },
      {
        visual: 'add-shift-form',
        title: 'Thêm, sửa và xóa ca làm',
        body: 'Tab Thêm công việc là nơi bạn ghi lại lịch làm hằng ngày; app sẽ tự tính thu nhập dự kiến dựa trên quy tắc của công việc.',
        details: [
          'Chọn ngày trên lịch hoặc nút thêm ở danh sách để mở form ca mới.',
          'Nhập nơi làm, ngày, giờ bắt đầu, giờ kết thúc, thời gian nghỉ và ghi chú nếu cần.',
          'Thời gian nghỉ được trừ khỏi tổng giờ làm; OT được tính theo quy tắc của công việc đã chọn.',
          'Chạm vào ca đã lưu để mở lại form và sửa hoặc xóa.',
          'Thêm từ lịch sử cho phép sao chép nhanh một ca cũ làm mẫu, rất hữu ích khi lịch lặp lại.'
        ]
      },
      {
        visual: 'add-list',
        title: 'Lịch và danh sách theo tháng',
        body: 'Bạn có thể xem ca làm dưới dạng lịch ô vuông hoặc danh sách timeline theo tháng để thuận tiện đối chiếu.',
        details: [
          'Ở lịch tháng, dấu màu cho biết ngày đó có ca làm hoặc khoản chi tiêu.',
          'Ở chế độ danh sách, mỗi ngày là một timeline dọc — chạm cột ngày để thêm ca cho ngày đó.',
          'Vuốt ngang trái hoặc phải để chuyển sang tháng trước hoặc tháng sau.',
          'Khi một ngày có chi tiêu, khoản chi xuất hiện cùng ca làm để bạn dễ đối chiếu trong cùng một dòng thời gian.'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: 'Cấu hình nơi làm việc',
        body: 'Mỗi nơi làm việc có thể chọn loại lương theo giờ, theo ngày hoặc theo tháng, kèm các quy tắc cộng thêm và trừ đi.',
        details: [
          'Lương theo giờ: dùng giờ bắt đầu, giờ kết thúc và nghỉ để tính số giờ — phù hợp với baito, part-time hoặc ca theo giờ.',
          'Lương theo ngày: dùng cho công việc có mức cố định mỗi ngày, không cần ghi giờ chi tiết.',
          'Lương theo tháng: dùng lương tháng và số ngày công chuẩn; thu nhập được phân bổ vào báo cáo theo kỳ.',
          'OT có thể đặt theo ngưỡng giờ vượt mức, hệ số nhân hoặc nhập số tiền thủ công cho ngày đặc biệt.',
          'Phụ cấp có thể là theo ngày, theo tháng hoặc theo năm — ví dụ phụ cấp đi lại, ăn trưa, thưởng cuối năm.',
          'Khấu trừ có thể là số tiền cố định hoặc phần trăm và có giới hạn thời gian, dùng cho thuế, bảo hiểm, các loại phí.',
          'Biểu tượng và màu giúp phân biệt các nơi làm khác nhau trong lịch, danh sách và báo cáo.'
        ]
      },
      {
        visual: 'expense-form',
        title: 'Ghi chi tiêu hằng ngày',
        body: 'Chi tiêu được thiết kế nhẹ với bốn trường: ngày, số tiền, danh mục và ghi chú; mục tiêu là theo dõi dòng tiền chứ không thay thế phần mềm kế toán.',
        details: [
          'Mở khoản chi mới từ tab Thêm công việc, dashboard hoặc các nút thêm chi tiêu trong app.',
          'Ngày quyết định khoản chi thuộc ngày, tuần, tháng, quý hoặc năm nào trong báo cáo.',
          'Số tiền cộng vào tổng chi tiêu và làm giảm phần còn lại tương ứng.',
          'Danh mục giúp báo cáo phân tách chi tiêu theo nhóm để dễ đánh giá.',
          'Khoản chi xuất hiện đồng thời ở lịch của ngày, dashboard "Chi hôm nay" và phần Chi tiêu trong báo cáo.'
        ]
      },
      {
        visual: 'settings-categories',
        title: 'Cài đặt > Danh mục chi tiêu',
        body: 'Danh mục chi tiêu giúp phân loại khoản chi và làm báo cáo dễ đọc hơn.',
        details: [
          'App có sẵn 9 danh mục mặc định: Ăn uống, Đi lại, Nhà cửa, Mua sắm, Sức khỏe, Học tập, Giải trí, Gia đình, Khác.',
          'Mỗi danh mục mặc định có biểu tượng và màu riêng để dễ nhận diện trong báo cáo.',
          'Bạn có thể thêm danh mục mới với tên, biểu tượng, màu của riêng mình.',
          'Khi sửa tên một danh mục mặc định, tên đó sẽ giữ nguyên ngay cả khi bạn đổi ngôn ngữ.',
          'Khi xóa danh mục, app yêu cầu chuyển các khoản chi liên quan sang danh mục khác để không mất lịch sử.'
        ]
      },
      {
        visual: 'settings-recurring',
        title: 'Cài đặt > Chi tiêu định kỳ',
        body: 'Chi tiêu định kỳ dùng cho các khoản lặp lại hằng tháng như tiền nhà, điện thoại, bảo hiểm, học phí hoặc subscription.',
        details: [
          'Nhập số tiền, danh mục, ngày hàng tháng, ngày bắt đầu và ghi chú khi tạo định kỳ.',
          'Khi đến kỳ, app tự sinh một khoản chi thật trong lịch sử — bạn không cần ghi tay.',
          'Các khoản đã sinh vẫn được giữ lại trong lịch sử ngay cả khi bạn xóa cấu hình định kỳ.',
          'Nếu ngày hàng tháng lớn hơn số ngày của tháng đó, app dùng ngày hợp lệ gần nhất trong tháng.',
          'Định kỳ thích hợp với các khoản gần như cố định; chi tiêu biến động vẫn nên ghi tay để chính xác.'
        ]
      },
      {
        visual: 'report-month',
        title: 'Báo cáo tuần, tháng, quý và năm',
        body: 'Tab Báo cáo trình bày Thu nhập, Chi tiêu và Còn lại tách biệt theo tuần, tháng, quý hoặc năm.',
        details: [
          'Tuần phù hợp để theo dõi dòng tiền ngắn hạn; tháng phù hợp để đối chiếu lương, phụ cấp và khấu trừ.',
          'Quý và năm phù hợp với việc nhìn xu hướng dài và đối chiếu kế hoạch.',
          'Còn lại = thu nhập sau khấu trừ trong kỳ trừ đi chi tiêu của cùng kỳ.',
          'Báo cáo liệt kê chi tiết từng ca làm trong kỳ — nơi làm, giờ làm, OT, thu nhập gross/net.',
          'Phần Chi tiêu theo danh mục giúp bạn nhận diện nhóm tiêu nhiều nhất.',
          'Bạn có thể xuất CSV (mở bằng Excel/Numbers/Google Sheets) hoặc PDF (in hoặc gửi) cho từng kỳ báo cáo.'
        ]
      },
      {
        visual: 'settings-root',
        title: 'Toàn bộ phân mục trong Cài đặt',
        body: 'Cài đặt được chia thành các nhóm rõ ràng; mỗi nhóm quản lý một khía cạnh dữ liệu hoặc trải nghiệm khác nhau.',
        details: [
          'Quản lý công việc: thêm, sửa, xóa nơi làm việc và toàn bộ quy tắc lương kèm theo.',
          'Chi tiêu: gồm danh mục chi tiêu và chi tiêu định kỳ — đã mô tả ở các bước trước.',
          'Japan Take-home Plus: mở công cụ ước tính lương thực nhận cho người làm việc tại Nhật.',
          'Ngôn ngữ: đổi ngôn ngữ hiển thị toàn app, hỗ trợ 9 ngôn ngữ.',
          'Tiền tệ: đổi ký hiệu và cách hiển thị tiền tệ trong toàn bộ app.',
          'Hướng dẫn sử dụng: mở lại tài liệu này bất cứ lúc nào.',
          'Thông báo: trạng thái cho phép app gửi nhắc nhở (như nhắc thêm ca, tóm tắt cuối kỳ); bạn có thể bật hoặc tắt từ phần Cài đặt của thiết bị.',
          'Người dùng: tạo, chuyển đổi hoặc đổi tên hồ sơ; mỗi hồ sơ giữ dữ liệu riêng.',
          'Xuất dữ liệu: tạo file CSV hoặc PDF cho hồ sơ hiện tại.',
          'Chính sách bảo mật: mở trang chính sách bảo mật của app.',
          'Hỗ trợ: mở trang FAQ, hướng dẫn liên hệ hoặc gửi feedback.',
          'Xóa dữ liệu / Xóa người dùng: xóa lịch sử hồ sơ hiện tại hoặc xóa cả hồ sơ — đây là thao tác không hoàn tác, hãy xuất dữ liệu trước khi dùng.'
        ]
      },
      {
        visual: 'settings-language',
        title: 'Chuyển đổi ngôn ngữ',
        body: 'App hỗ trợ 9 ngôn ngữ; thay đổi áp dụng tức thì cho toàn bộ giao diện và hướng dẫn này.',
        details: [
          'Mở Cài đặt > Ngôn ngữ và chọn ngôn ngữ bạn muốn dùng.',
          'Toàn bộ giao diện, nhãn nút, thông báo trong app và hướng dẫn này sẽ chuyển sang ngôn ngữ mới ngay.',
          'Tên 9 danh mục chi tiêu mặc định cũng đổi theo ngôn ngữ — ví dụ "Food" thành "Ăn uống".',
          'Danh mục mà bạn đã sửa tên sẽ giữ nguyên tên do bạn nhập, không tự dịch lại.',
          'Một số nhãn chuyên ngành như "Nenkin", "Shakai hoken", "Gross" trong Japan Take-home Plus được giữ nguyên để khớp thuật ngữ chính thức.'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: 'Mục riêng dành cho người làm việc tại Nhật, ước tính phần thực nhận sau bảo hiểm xã hội và thuế dựa trên quy tắc 2026.',
        details: [
          'Work style: chọn baito, haken, employee thường hoặc freelancer — quy tắc tính sẽ thay đổi theo lựa chọn này.',
          'Monthly gross: lương gross của tháng; có thể bấm nút lấy thu nhập tháng này từ app làm đầu vào nhanh.',
          'Tuổi và bảo hiểm ảnh hưởng đến mức Nenkin và Shakai hoken (kenkō hoken, kaigo hoken khi đủ tuổi).',
          'Tỉnh (prefecture) ảnh hưởng đến tỉ lệ bảo hiểm sức khỏe vì mỗi tỉnh có mức khác nhau.',
          'Người phụ thuộc giảm thu nhập chịu thuế khi đáp ứng điều kiện; người phụ thuộc ở nước ngoài cần điều kiện riêng.',
          'Resident tax có thể để app tự ước tính, nhập tay theo phiếu thuế hoặc tắt nếu chưa cần.',
          'Kết quả chỉ là ước tính tham khảo; phiếu lương và tờ khai chính thức mới là số liệu cuối cùng.'
        ]
      }
    ]
  },
  en: {
    title: 'Complete Salary Tracker Guide',
    intro: 'This guide walks through every area of the app: overview, dashboard, shifts, workplace setup, expenses, reports, settings sections, language switching, and Japan Take-home Plus.',
    tipsTitle: 'General notes',
    tips: [
      'Recommended flow: create a workplace → add shifts → record expenses → review reports.',
      'Income is the main focus; expenses help you see what is realistically left.',
      'All data stays on your device — nothing is uploaded to a server.',
      'Export CSV/PDF before clearing data or deleting a user profile.',
      'Japan Take-home Plus is an estimate, not an official payslip or tax advice.'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: 'App overview',
        body: 'Salary Tracker tracks income across multiple workplaces and adds lightweight expense tracking so you can see what is left by day, week, month, quarter, and year.',
        details: [
          'Main goal: combine hourly, daily, or monthly income from several jobs in one place.',
          'Income comes first, expenses are secondary — the app is not a full accounting tool.',
          'All data is saved directly on the device; there is no cloud account or online sync.',
          'Four main tabs: Home, Add Work, Report, and Settings.',
          'Suggested flow: configure a workplace first, add shifts, record expenses, then open reports to review.'
        ]
      },
      {
        visual: 'home-recent',
        title: 'Home and dashboard',
        body: 'The dashboard puts income first, then shows expenses and remaining cash as supporting context.',
        details: [
          'Today, this week, this month, and this year income show your progress as soon as the app opens.',
          'Spent today is the total of expenses recorded for the current day.',
          'Remaining = income after deductions minus expenses in the same period; treat it as a quick reference.',
          'Recent work lists your latest shifts so you can review or fix them quickly.',
          'Quick stats show shift counts, hours, and trends so you can gauge workload.',
          'Monthly goal indicates how close current income is to the target you set per job.'
        ]
      },
      {
        visual: 'add-shift-form',
        title: 'Add, edit, and delete shifts',
        body: 'The Add Work tab is where you record daily shifts; the app calculates estimated income from the rules of the selected job.',
        details: [
          'Tap a date on the calendar or the add button on the list to open the new-shift form.',
          'Enter workplace, date, start time, end time, break, and an optional note.',
          'Break time is subtracted from total working hours; overtime follows the rules of the chosen job.',
          'Tap a saved shift to reopen the form and edit or delete it.',
          'Add from history copies a previous shift as a template, useful for repeating schedules.'
        ]
      },
      {
        visual: 'add-list',
        title: 'Calendar and monthly list',
        body: 'You can review shifts as a grid calendar or as a monthly timeline list, whichever is easier to compare.',
        details: [
          'On the month calendar, colored marks indicate days with shifts or expenses.',
          'In list mode, each day is a vertical timeline — tap the date rail to add a shift for that day.',
          'Swipe horizontally to move to the previous or next month.',
          'When a day has expenses, they appear next to the shifts so you can compare them on the same time strip.'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: 'Workplace setup',
        body: 'Each workplace can use hourly, daily, or monthly pay, with extra earning rules and deductions on top.',
        details: [
          'Hourly: uses start time, end time, and break to calculate hours — fits baito, part-time, or shift work.',
          'Daily: use this when one workday has a fixed amount, no detailed time tracking needed.',
          'Monthly: uses monthly salary and standard workdays; income is allocated into period reports.',
          'Overtime can be set with an hour threshold, a multiplier, or a manual amount for special days.',
          'Allowances can be daily, monthly, or yearly — for example commute, lunch, or year-end bonus.',
          'Deductions can be a fixed amount or a percentage and may have a validity range, useful for taxes, insurance, and fees.',
          'Icon and color help distinguish workplaces in the calendar, list, and reports.'
        ]
      },
      {
        visual: 'expense-form',
        title: 'Record daily expenses',
        body: 'Expenses are intentionally light, with four fields: date, amount, category, and note. The goal is cash-flow awareness, not full bookkeeping.',
        details: [
          'Open a new expense from the Add Work tab, dashboard, or any expense button in the app.',
          'Date decides which day, week, month, quarter, or year the expense belongs to in reports.',
          'Amount adds to total expenses and reduces remaining cash accordingly.',
          'Category powers the expense breakdown in reports for easier review.',
          'Each expense appears on the day calendar, the dashboard "Spent today", and the Expenses block in reports.'
        ]
      },
      {
        visual: 'settings-categories',
        title: 'Settings > Expense categories',
        body: 'Expense categories organize spending and make reports easier to read.',
        details: [
          'The app ships with 9 default categories: Food, Transport, Home, Shopping, Health, Education, Entertainment, Family, Other.',
          'Each default category has its own icon and color for fast recognition in reports.',
          'You can add new categories with your own name, icon, and color.',
          'When you edit a default category name, your custom name stays even after switching languages.',
          'When deleting a category, the app asks you to move related expenses to another category so history is preserved.'
        ]
      },
      {
        visual: 'settings-recurring',
        title: 'Settings > Recurring expenses',
        body: 'Recurring expenses cover monthly items such as rent, phone, insurance, tuition, or subscriptions.',
        details: [
          'Enter amount, category, monthly day, start date, and an optional note when creating the rule.',
          'When the date arrives, the app generates a real expense in your history automatically.',
          'Generated expenses stay in history even if you later delete the recurring rule.',
          'If the chosen monthly day is beyond the month length, the app uses the closest valid date in that month.',
          'Recurring expenses fit near-fixed amounts; variable spending is still better recorded by hand for accuracy.'
        ]
      },
      {
        visual: 'report-month',
        title: 'Week, month, quarter, and year reports',
        body: 'The Report tab presents Income, Expenses, and Remaining as separate values across week, month, quarter, or year.',
        details: [
          'Week is best for short-term cash flow; month is best for matching pay, allowances, and deductions.',
          'Quarter and year fit longer trends and plan reviews.',
          'Remaining = income after deductions in the period minus expenses in the same period.',
          'Reports list every shift in the period — workplace, hours, overtime, gross/net pay.',
          'Expense by category shows which group consumes the most money.',
          'You can export CSV (Excel/Numbers/Google Sheets) or PDF (print or share) for each report period.'
        ]
      },
      {
        visual: 'settings-root',
        title: 'All Settings sections',
        body: 'Settings is split into clear groups; each group manages a different aspect of data or experience.',
        details: [
          'Job management: add, edit, or delete workplaces along with their pay rules.',
          'Expenses: covers expense categories and recurring expenses, described in earlier steps.',
          'Japan Take-home Plus: opens the take-home estimator for people working in Japan.',
          'Language: switches the entire interface; 9 languages are supported.',
          'Currency: changes money symbols and number formatting throughout the app.',
          'How to use: reopens this guide at any time.',
          'Notifications: indicates whether the app may send reminders (like missing-shift or end-of-period summaries); enable or disable from your device Settings.',
          'Users: create, switch, or rename profiles; each profile keeps its own data.',
          'Export Data: builds CSV or PDF files for the current profile.',
          'Privacy Policy: opens the privacy policy page.',
          'Support: opens the FAQ, contact, and feedback page.',
          'Clear Data / Delete User: removes the current profile history or the entire profile — irreversible, so export first.'
        ]
      },
      {
        visual: 'settings-language',
        title: 'Switching languages',
        body: 'The app supports 9 languages; the change applies instantly to the whole interface and this guide.',
        details: [
          'Open Settings > Language and pick the language you want to use.',
          'The full interface, button labels, in-app messages, and this guide switch immediately.',
          'The 9 default expense category names follow the language too — for example "Food" becomes "Ăn uống" in Vietnamese.',
          'Categories you have renamed keep your custom name and are not auto-translated.',
          'Some specialized labels in Japan Take-home Plus such as "Nenkin", "Shakai hoken", and "Gross" stay in their original form to match official terms.'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: 'A dedicated section for people working in Japan that estimates take-home pay after social insurance and taxes using 2026 rules.',
        details: [
          'Work style: choose baito, haken, regular employee, or freelancer — calculation rules change accordingly.',
          'Monthly gross: gross pay for the month; you can use the button to pull this month income from the app as a quick input.',
          'Age and insurance affect Nenkin and Shakai hoken levels (kenkō hoken plus kaigo hoken when eligible by age).',
          'Prefecture changes the health insurance rate because each prefecture publishes its own rate.',
          'Dependents reduce taxable income when they meet the conditions; overseas dependents have stricter rules.',
          'Resident tax can be auto-estimated, entered manually from your tax slip, or turned off if not needed yet.',
          'Results are reference estimates only; the official payslip and tax filing remain the final source of truth.'
        ]
      }
    ]
  },
  ja: {
    title: 'Salary Tracker 完全ガイド',
    intro: 'このガイドではアプリの全エリアを順に説明します：概要、ダッシュボード、シフト、勤務先設定、支出、レポート、設定の各セクション、言語切替、そして Japan Take-home Plus。',
    tipsTitle: '全体的な注意点',
    tips: [
      'おすすめの流れ：勤務先を作成 → シフトを追加 → 支出を記録 → レポートを確認。',
      '中心は収入管理で、支出は実際の残額を把握するための補助です。',
      'すべてのデータは端末内にのみ保存され、サーバーへ送信されません。',
      'データ削除やユーザー削除の前に CSV/PDF を出力してください。',
      'Japan Take-home Plus は概算であり、正式な給与明細や税務アドバイスではありません。'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: 'アプリ全体',
        body: 'Salary Tracker は複数の勤務先からの収入を記録し、軽い支出記録を加えて、日・週・月・四半期・年ごとの残りを把握できるようにします。',
        details: [
          '主目的：複数の仕事の時給・日給・月給を一箇所にまとめて把握できます。',
          '中心は収入で、支出は補助的な機能です。完全な会計アプリではありません。',
          'データは端末内に保存され、クラウドアカウントやオンライン同期はありません。',
          'メインタブは4つ：ホーム、勤務追加、レポート、設定。',
          'おすすめの利用順は、勤務先を設定し、シフトを追加し、支出を記録し、最後にレポートで確認することです。'
        ]
      },
      {
        visual: 'home-recent',
        title: 'ホームとダッシュボード',
        body: 'ダッシュボードは収入を最優先し、支出と残りは補助情報として表示します。',
        details: [
          '本日、今週、今月、今年の収入で進捗を素早く確認できます。',
          '本日の支出は、今日記録された支出の合計です。',
          '残り＝対象期間の控除後収入から同期間の支出を引いた金額（簡易参照値）。',
          '最近の勤務には直近のシフトが並び、確認や修正がすぐにできます。',
          'クイック統計はシフト数、時間、傾向を表示し、業務量の把握に役立ちます。',
          '月間目標は、現在の収入が設定済みの目標額に対してどれくらい達成しているかを示します。'
        ]
      },
      {
        visual: 'add-shift-form',
        title: 'シフトの追加・編集・削除',
        body: '勤務追加タブでは日々のシフトを記録します。アプリは選択した勤務先のルールから見込み収入を自動計算します。',
        details: [
          'カレンダーの日付やリストの追加ボタンで新規シフトのフォームを開きます。',
          '勤務先、日付、開始、終了、休憩、必要に応じてメモを入力します。',
          '休憩は総勤務時間から差し引かれ、残業は選択した勤務先のルールに従います。',
          '保存済みシフトをタップするとフォームが再表示され、編集や削除ができます。',
          '履歴から追加で過去のシフトをテンプレートとして再利用でき、繰り返しの予定に便利です。'
        ]
      },
      {
        visual: 'add-list',
        title: 'カレンダーと月別リスト',
        body: 'カレンダーまたは月別タイムラインで、各日のシフトと支出を比較しながら確認できます。',
        details: [
          '月カレンダーでは、色付きマークがシフトや支出のある日を示します。',
          'リスト表示では1日が縦のタイムラインになり、日付列をタップしてその日のシフトを追加できます。',
          '左右スワイプで前月や翌月へ切り替えます。',
          'その日に支出がある場合、シフトと並んで同じ時間帯に表示され、比較しやすくなります。'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: '勤務先の設定',
        body: '各勤務先には時給、日給、月給を設定でき、追加収入や控除のルールも上乗せできます。',
        details: [
          '時給：開始、終了、休憩から労働時間を算出します。バイトやパート、シフト勤務に向きます。',
          '日給：1日あたり固定額の場合に使い、細かい時間入力は不要です。',
          '月給：月給と標準勤務日数を使って期間レポートに収入を割り当てます。',
          '残業は、時間しきい値、倍率、特別日の手入力金額のいずれかで設定できます。',
          '手当は日・月・年単位で設定可能です。例：通勤、昼食、年末手当。',
          '控除は固定額または割合で、有効期間も設定可能。税金、保険、各種費用に使えます。',
          'アイコンと色は、カレンダー、リスト、レポートで勤務先を区別するのに役立ちます。'
        ]
      },
      {
        visual: 'expense-form',
        title: '日々の支出を記録する',
        body: '支出は意図的に軽量で、日付・金額・カテゴリ・メモの4項目だけです。本格的な記帳ではなく、現金の流れを見える化することが目的です。',
        details: [
          '勤務追加タブ、ダッシュボード、アプリ内の支出ボタンから新しい支出を作成できます。',
          '日付によって、その支出が日・週・月・四半期・年のどこに属するかが決まります。',
          '金額は支出合計に加算され、残りの金額からその分が引かれます。',
          'カテゴリはレポートの支出内訳に使われ、傾向把握に役立ちます。',
          '記録した支出は、日別カレンダー、ダッシュボードの「本日の支出」、レポートの支出ブロックの3か所に表示されます。'
        ]
      },
      {
        visual: 'settings-categories',
        title: '設定 > 支出カテゴリ',
        body: '支出カテゴリは支出を分類し、レポートを読みやすくします。',
        details: [
          '初期カテゴリは9つ：食費、交通、住居、買い物、健康、学習、娯楽、家族、その他。',
          '初期カテゴリにはそれぞれ専用のアイコンと色が設定されています。',
          '名前、アイコン、色を選んで独自カテゴリを追加できます。',
          '初期カテゴリ名を編集すると、言語を切り替えてもカスタム名が保持されます。',
          'カテゴリを削除する際は、関連する支出を別カテゴリへ移動するよう促され、履歴が失われません。'
        ]
      },
      {
        visual: 'settings-recurring',
        title: '設定 > 定期支出',
        body: '定期支出は家賃、携帯代、保険料、学費、サブスクなど毎月発生する項目に使います。',
        details: [
          '作成時に金額、カテゴリ、毎月の日付、開始日、メモを入力します。',
          '指定日になるとアプリが自動的に履歴へ実際の支出を作成します。',
          '生成された支出は、定期ルールを後から削除しても履歴に残ります。',
          '指定日がその月に存在しない場合、アプリはその月の最も近い有効日を使用します。',
          '定期支出は金額がほぼ一定の項目に向きます。変動する支出は手入力の方が正確です。'
        ]
      },
      {
        visual: 'report-month',
        title: '週・月・四半期・年レポート',
        body: 'レポートは収入、支出、残りを別項目として、週・月・四半期・年単位で表示します。',
        details: [
          '週は短期キャッシュフロー、月は給与・手当・控除との照合に向いています。',
          '四半期と年は長期傾向や計画の見直しに向きます。',
          '残り＝期間内の控除後収入 − 同じ期間の支出。',
          '期間内の各シフトを一覧表示します（勤務先、時間、残業、額面/手取り）。',
          'カテゴリ別支出により、最も支出の多いグループが分かります。',
          '各期間ごとに CSV（Excel/Numbers/Google Sheets 用）または PDF（印刷・送信用）を出力できます。'
        ]
      },
      {
        visual: 'settings-root',
        title: '設定の全セクション',
        body: '設定は明確なグループに分かれており、それぞれ異なる側面のデータや使い心地を管理します。',
        details: [
          '勤務先管理：勤務先と給与ルールの追加・編集・削除。',
          '支出：支出カテゴリと定期支出を含み、前のステップで説明済みです。',
          'Japan Take-home Plus：日本で働く方向けの手取り概算ツールを開きます。',
          '言語：アプリ全体の表示言語を切り替えます。9言語に対応。',
          '通貨：金額の記号や表示形式をアプリ全体で変更します。',
          '使い方ガイド：このガイドをいつでも再表示します。',
          '通知：アプリがリマインド（シフト未入力、期間サマリーなど）を送れる状態かを示します。端末の設定からオン/オフを切り替えてください。',
          'ユーザー：プロファイルの作成、切替、名前変更。各プロファイルは個別のデータを保持します。',
          'データ出力：現在のプロファイルの CSV/PDF を作成します。',
          'プライバシーポリシー：プライバシーポリシーページを開きます。',
          'サポート：FAQ、連絡先、フィードバック送信ページを開きます。',
          'データ削除 / ユーザー削除：現在のプロファイル履歴やプロファイル自体を削除します。元に戻せないため、事前に出力しておきましょう。'
        ]
      },
      {
        visual: 'settings-language',
        title: '言語の切替',
        body: 'アプリは9言語に対応し、変更は画面全体とこのガイドに即時反映されます。',
        details: [
          '設定 > 言語を開き、使用したい言語を選択します。',
          '画面、ボタンラベル、アプリ内メッセージ、そしてこのガイドが直ちに新しい言語へ切り替わります。',
          '9つの初期支出カテゴリの名前も言語に合わせて変わります（例：Food → 食費）。',
          '名前を変更したカテゴリは入力した名前のまま保持され、自動翻訳されません。',
          'Japan Take-home Plus 内の Nenkin、Shakai hoken、Gross などの専門ラベルは、正式用語と一致させるため原文のまま表示します。'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: '日本で働く方向けの専用セクションで、2026年ルールに基づき社会保険と税引き後の手取りを概算します。',
        details: [
          'Work style：baito、haken、正社員、freelancer から選択し、計算ルールが切り替わります。',
          'Monthly gross：その月の額面。アプリの「今月の収入」を取り込んで素早く入力できます。',
          '年齢と保険は年金・社会保険（健康保険、対象年齢では介護保険）の金額に影響します。',
          '都道府県は健康保険料率に影響します。都道府県ごとに料率が異なるためです。',
          '扶養人数は条件を満たすと課税所得を減らせます。海外扶養はより厳格な条件が必要です。',
          '住民税は自動概算、給与明細からの手入力、不要の場合はオフを選べます。',
          '結果は参考の概算であり、最終値は正式な給与明細や確定申告の数字となります。'
        ]
      }
    ]
  },
  zh: {
    title: 'Salary Tracker 完整指南',
    intro: '本指南依次介绍应用的所有区域：概览、仪表盘、班次、工作设置、支出、报表、设置中的各分项、语言切换以及 Japan Take-home Plus。',
    tipsTitle: '通用提示',
    tips: [
      '建议流程：创建工作 → 添加班次 → 记录支出 → 查看报表。',
      '收入是核心，支出帮助你了解实际剩余金额。',
      '所有数据仅保存在你的设备本地，不会上传到服务器。',
      '清除数据或删除用户前请先导出 CSV/PDF。',
      'Japan Take-home Plus 仅为估算，不能替代正式工资单或税务建议。'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: '应用概览',
        body: 'Salary Tracker 帮助你管理来自多个工作的收入，并加入轻量支出记录，让你按日、周、月、季度、年查看剩余金额。',
        details: [
          '主要目标：把多份工作的时薪、日薪或月薪统一汇总。',
          '收入为核心，支出为辅；本应用并非完整的会计工具。',
          '所有数据保存在设备本地，没有云账号或在线同步。',
          '四个主标签：首页、添加工作、报表、设置。',
          '建议的使用顺序：先设置工作，再添加班次，记录支出，最后通过报表回顾。'
        ]
      },
      {
        visual: 'home-recent',
        title: '首页与仪表盘',
        body: '仪表盘以收入为先，再把支出和剩余金额作为辅助信息呈现。',
        details: [
          '今日、本周、本月与今年收入让你打开应用即可看到进度。',
          '今日支出是当天已记录支出的总和。',
          '剩余 = 期间内扣除后收入 − 同期支出，作为快速参考。',
          '最近工作列出最新的班次，便于查看或快速修改。',
          '快速统计显示班次数、工作时长和趋势，便于评估工作量。',
          '月目标显示当前收入已达到该工作所设目标的百分比。'
        ]
      },
      {
        visual: 'add-shift-form',
        title: '添加、编辑与删除班次',
        body: '添加工作标签用于记录每日班次，应用会按所选工作的规则自动计算预计收入。',
        details: [
          '在日历点击日期，或在列表底部按下添加按钮，打开新班次表单。',
          '填写工作、日期、开始时间、结束时间、休息时间，并可备注。',
          '休息时间会从总工时中扣除，加班按所选工作的规则计算。',
          '点击已保存的班次可重新打开表单进行编辑或删除。',
          '从历史添加可快速复用以前的班次模板，适合重复班表。'
        ]
      },
      {
        visual: 'add-list',
        title: '日历与月度列表',
        body: '可以用日历方格或月度时间线列表查看班次与支出，方便对照。',
        details: [
          '月历中的彩色标记表示当天有班次或支出。',
          '列表模式下每天显示为纵向时间线，点击日期栏即可为该日添加班次。',
          '左右滑动可切换上一月或下一月。',
          '若当天有支出，会与班次一起出现在同一时间条上，便于比较。'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: '工作设置',
        body: '每份工作可选择时薪、日薪或月薪，并可叠加额外的收入与扣除规则。',
        details: [
          '时薪：通过开始、结束和休息时间计算工作时长，适合 baito、兼职或排班工作。',
          '日薪：每个工作日金额固定时使用，无需填写详细时间。',
          '月薪：使用月薪和标准工作天数把收入分摊到各期报表。',
          '加班可按小时阈值、倍率或在特殊日子手动填入金额。',
          '补贴可按日、月或年设置，例如通勤、午餐、年终奖等。',
          '扣除可设为固定金额或百分比，并可设置有效期限，用于税费、保险等。',
          '图标与颜色帮助你在日历、列表与报表中区分不同工作。'
        ]
      },
      {
        visual: 'expense-form',
        title: '记录日常支出',
        body: '支出有意保持轻量，仅有四个字段：日期、金额、分类、备注。目标是了解现金流，而非全面记账。',
        details: [
          '可以从添加工作页、仪表盘或应用内的支出按钮新建一条支出。',
          '日期决定该支出归属于报表中的哪一天、周、月、季或年。',
          '金额会计入总支出并相应减少剩余金额。',
          '分类用于报表中的支出拆分，便于分析。',
          '每笔支出会同时显示在当日日历、仪表盘的“今日支出”以及报表的支出板块。'
        ]
      },
      {
        visual: 'settings-categories',
        title: '设置 > 支出分类',
        body: '支出分类用于整理支出，让报表更易读。',
        details: [
          '应用预置 9 个默认分类：餐饮、交通、住房、购物、健康、学习、娱乐、家庭、其他。',
          '每个默认分类都有自己的图标和颜色，方便在报表中辨识。',
          '可以使用自定义名称、图标与颜色添加新分类。',
          '当你修改默认分类的名称后，即使切换语言也会保留你的自定义名称。',
          '删除分类时，应用会要求把相关支出移动到其他分类，避免丢失历史。'
        ]
      },
      {
        visual: 'settings-recurring',
        title: '设置 > 固定支出',
        body: '固定支出适用于每月重复的项目，例如房租、手机费、保险、学费或订阅。',
        details: [
          '创建规则时填写金额、分类、每月日期、开始日期与备注。',
          '到期时应用会自动在历史中生成一条真实支出，无需手动添加。',
          '即使删除规则，已生成的支出仍保留在历史中。',
          '若所选日期超出当月天数，应用会使用该月最接近的有效日期。',
          '固定支出适合金额相对稳定的项目；金额变化大的支出仍建议手动记录。'
        ]
      },
      {
        visual: 'report-month',
        title: '周、月、季度与年度报表',
        body: '报表标签按周、月、季度或年度分别展示收入、支出与剩余金额。',
        details: [
          '周报适合短期现金流，月报适合核对工资、补贴与扣除。',
          '季度与年度报表适合查看长期趋势和计划复盘。',
          '剩余 = 期间内扣除后收入 − 同期支出。',
          '报表会列出该期间内每一个班次（工作、工时、加班、税前/税后金额）。',
          '按分类支出能让你清楚哪一类花费最多。',
          '每个报表期间都可以导出 CSV（用于 Excel/Numbers/Google Sheets）或 PDF（用于打印或分享）。'
        ]
      },
      {
        visual: 'settings-root',
        title: '设置中的全部分项',
        body: '设置被划分为多个明确的分组，每个分组管理不同方面的数据或使用体验。',
        details: [
          '工作管理：添加、编辑或删除工作及其工资规则。',
          '支出：包含支出分类与固定支出，前面已说明。',
          'Japan Take-home Plus：打开面向在日工作者的到手收入估算工具。',
          '语言：切换整个应用的界面语言，支持 9 种语言。',
          '货币：更改应用中的金额符号与显示格式。',
          '使用指南：随时再次打开此指南。',
          '通知：表示应用是否可以发送提醒（如班次未填、期间总结）。可在设备的“设置”中开启或关闭。',
          '用户：创建、切换或重命名资料；每个资料保存独立数据。',
          '导出数据：为当前资料生成 CSV 或 PDF 文件。',
          '隐私政策：打开隐私政策页面。',
          '支持：打开 FAQ、联系方式或反馈页面。',
          '清除数据 / 删除用户：清除当前资料的历史，或删除整个资料。该操作无法撤销，建议先导出。'
        ]
      },
      {
        visual: 'settings-language',
        title: '切换语言',
        body: '应用支持 9 种语言，更改会立即应用到整个界面与本指南。',
        details: [
          '打开 设置 > 语言，选择想使用的语言。',
          '整个界面、按钮文字、应用内消息和本指南都会立刻切换到新语言。',
          '9 个默认支出分类的名称也会跟随语言变化（例如 “Food” 变为 “餐饮”）。',
          '已被你修改名称的分类会保留自定义名称，不会自动翻译。',
          'Japan Take-home Plus 中的 “Nenkin”、“Shakai hoken”、“Gross” 等专业术语会保留原词，与正式用语一致。'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: '为在日本工作的用户提供的独立模块，按 2026 年规则估算社会保险与税后到手金额。',
        details: [
          'Work style：选择 baito、haken、正式员工或 freelancer，计算规则会随之变化。',
          'Monthly gross：当月税前金额；可使用按钮把应用中本月收入作为输入。',
          '年龄和保险会影响 Nenkin 与 Shakai hoken 金额（达到一定年龄时还包括介护保险）。',
          '都道府县会影响健康保险费率，因为各都道府县的费率不同。',
          '扶养人数符合条件时可以减少应税收入，海外扶养有更严格的条件。',
          'Resident tax 可以让应用自动估算、根据税单手动输入，或暂时关闭。',
          '结果仅供参考；最终金额以正式工资单和申报为准。'
        ]
      }
    ]
  },
  th: {
    title: 'คู่มือ Salary Tracker แบบครบถ้วน',
    intro: 'คู่มือนี้พาคุณดูทุกส่วนของแอป: ภาพรวม แดชบอร์ด กะ ตั้งค่าที่ทำงาน รายจ่าย รายงาน หัวข้อในการตั้งค่า การสลับภาษา และ Japan Take-home Plus',
    tipsTitle: 'ข้อสังเกตทั่วไป',
    tips: [
      'ลำดับที่แนะนำ: สร้างที่ทำงาน → เพิ่มกะ → บันทึกรายจ่าย → ดูรายงาน',
      'รายได้คือจุดศูนย์กลาง รายจ่ายช่วยให้เห็นเงินที่เหลือจริง',
      'ข้อมูลทั้งหมดถูกเก็บในเครื่องของคุณเท่านั้น ไม่ส่งขึ้นเซิร์ฟเวอร์',
      'ส่งออก CSV/PDF ก่อนล้างข้อมูลหรือลบโปรไฟล์ผู้ใช้',
      'Japan Take-home Plus เป็นเพียงค่าประมาณ ไม่ใช่สลิปเงินเดือนหรือคำแนะนำภาษีอย่างเป็นทางการ'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: 'ภาพรวมแอป',
        body: 'Salary Tracker ช่วยติดตามรายได้จากหลายที่ทำงาน พร้อมการบันทึกรายจ่ายแบบเบา ๆ เพื่อดูเงินคงเหลือตามวัน สัปดาห์ เดือน ไตรมาส และปี',
        details: [
          'เป้าหมายหลัก: รวมรายได้จากงานที่จ่ายรายชั่วโมง รายวัน หรือรายเดือนไว้ที่เดียว',
          'รายได้เป็นหลัก รายจ่ายเป็นรอง แอปไม่ได้ทดแทนเครื่องมือบัญชีเต็มรูปแบบ',
          'ข้อมูลทั้งหมดถูกเก็บในเครื่อง ไม่มีบัญชีคลาวด์หรือการซิงก์ออนไลน์',
          'แท็บหลักมี 4 อัน: หน้าหลัก เพิ่มงาน รายงาน และตั้งค่า',
          'ลำดับที่แนะนำคือ: ตั้งค่าที่ทำงาน เพิ่มกะ บันทึกรายจ่าย แล้วเปิดรายงานเพื่อตรวจสอบ'
        ]
      },
      {
        visual: 'home-recent',
        title: 'หน้าหลักและแดชบอร์ด',
        body: 'แดชบอร์ดเน้นรายได้เป็นหลัก ส่วนรายจ่ายและคงเหลือถูกแสดงเป็นข้อมูลเสริม',
        details: [
          'รายได้วันนี้ สัปดาห์นี้ เดือนนี้ และปีนี้ ทำให้เห็นความคืบหน้าทันทีเมื่อเปิดแอป',
          'จ่ายวันนี้คือยอดรวมรายจ่ายที่บันทึกในวันปัจจุบัน',
          'คงเหลือ = รายได้หลังหักของช่วงนั้นลบรายจ่ายในช่วงเดียวกัน เป็นค่าอ้างอิงคร่าว ๆ',
          'งานล่าสุดแสดงกะที่บันทึกไว้ล่าสุด เพื่อดูหรือแก้ไขได้รวดเร็ว',
          'สถิติด่วนแสดงจำนวนกะ ชั่วโมงทำงาน และแนวโน้ม ช่วยประเมินภาระงาน',
          'เป้าหมายเดือนบอกว่ารายได้ปัจจุบันใกล้ถึงเป้าที่ตั้งสำหรับงานนั้น ๆ มากแค่ไหน'
        ]
      },
      {
        visual: 'add-shift-form',
        title: 'เพิ่ม แก้ไข และลบกะ',
        body: 'แท็บเพิ่มงานใช้สำหรับบันทึกกะรายวัน แอปจะคำนวณรายได้โดยประมาณตามกฎของงานที่เลือก',
        details: [
          'แตะวันที่ในปฏิทินหรือปุ่มเพิ่มในรายการเพื่อเปิดฟอร์มกะใหม่',
          'กรอกที่ทำงาน วันที่ เวลาเริ่ม เวลาสิ้นสุด เวลาพัก และหมายเหตุหากต้องการ',
          'เวลาพักจะถูกหักออกจากชั่วโมงทำงานทั้งหมด และ OT จะคำนวณตามกฎของงานนั้น',
          'แตะกะที่บันทึกไว้เพื่อเปิดฟอร์มและทำการแก้ไขหรือลบ',
          'เพิ่มจากประวัติช่วยคัดลอกรูปแบบกะเก่ามาใช้ใหม่ เหมาะกับตารางงานที่เกิดซ้ำ'
        ]
      },
      {
        visual: 'add-list',
        title: 'ปฏิทินและรายการรายเดือน',
        body: 'คุณสามารถดูกะแบบปฏิทินช่องสี่เหลี่ยม หรือแบบไทม์ไลน์รายเดือน เพื่อเปรียบเทียบได้สะดวก',
        details: [
          'ในปฏิทินรายเดือน จุดสีบ่งบอกว่ามีกะหรือรายจ่ายในวันนั้น',
          'ในโหมดรายการ แต่ละวันเป็นไทม์ไลน์แนวตั้ง แตะคอลัมน์วันที่เพื่อเพิ่มกะของวันนั้น',
          'ปัดซ้ายหรือขวาเพื่อสลับเดือนก่อนหน้าและถัดไป',
          'หากวันใดมีรายจ่าย รายจ่ายจะถูกแสดงร่วมกับกะในแถบเวลาเดียวกันเพื่อง่ายต่อการเทียบ'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: 'การตั้งค่าที่ทำงาน',
        body: 'แต่ละที่ทำงานเลือกแบบรายชั่วโมง รายวัน หรือรายเดือน พร้อมเพิ่มกฎรายได้พิเศษและรายการหักได้',
        details: [
          'รายชั่วโมง: ใช้เวลาเริ่ม สิ้นสุด และพัก เพื่อคำนวณชั่วโมง เหมาะกับ baito พาร์ทไทม์ หรือกะที่ทำงาน',
          'รายวัน: ใช้เมื่อค่าจ้างต่อวันเป็นจำนวนคงที่และไม่ต้องบันทึกเวลา',
          'รายเดือน: ใช้เงินเดือนและจำนวนวันทำงานมาตรฐานในการกระจายรายได้ลงรายงานแต่ละช่วง',
          'OT ตั้งได้ด้วยเกณฑ์ชั่วโมง ตัวคูณ หรือจำนวนเงินที่กรอกเองสำหรับวันพิเศษ',
          'เบี้ยเลี้ยงตั้งได้รายวัน รายเดือน หรือรายปี เช่น ค่าเดินทาง ค่าอาหาร โบนัสปลายปี',
          'รายการหักเป็นจำนวนคงที่หรือเปอร์เซ็นต์ก็ได้ และตั้งช่วงวันที่ใช้งานได้ เหมาะกับภาษี ประกัน ค่าธรรมเนียม',
          'ไอคอนและสีช่วยแยกที่ทำงานในปฏิทิน รายการ และรายงาน'
        ]
      },
      {
        visual: 'expense-form',
        title: 'บันทึกรายจ่ายรายวัน',
        body: 'รายจ่ายถูกออกแบบให้เบา ใช้เพียง 4 ช่อง: วันที่ จำนวน หมวด และหมายเหตุ เพื่อมองเห็นกระแสเงินสดโดยไม่ซับซ้อน',
        details: [
          'เปิดรายจ่ายใหม่จากแท็บเพิ่มงาน หน้าหลัก หรือปุ่มรายจ่ายอื่น ๆ ในแอป',
          'วันที่จะกำหนดว่ารายจ่ายอยู่ในวัน สัปดาห์ เดือน ไตรมาส หรือปีใดในรายงาน',
          'จำนวนเงินจะรวมในยอดรายจ่ายและลดเงินคงเหลือลง',
          'หมวดช่วยให้รายงานแยกประเภทรายจ่ายและประเมินได้ง่าย',
          'รายจ่ายปรากฏในปฏิทินของวัน ช่อง “จ่ายวันนี้” ของแดชบอร์ด และส่วนรายจ่ายในรายงาน'
        ]
      },
      {
        visual: 'settings-categories',
        title: 'ตั้งค่า > หมวดรายจ่าย',
        body: 'หมวดรายจ่ายช่วยจัดกลุ่มค่าใช้จ่ายและทำให้รายงานอ่านง่ายขึ้น',
        details: [
          'แอปมีหมวดเริ่มต้น 9 หมวด: อาหาร เดินทาง บ้าน ช้อปปิ้ง สุขภาพ การเรียน บันเทิง ครอบครัว และอื่น ๆ',
          'แต่ละหมวดเริ่มต้นมีไอคอนและสีของตนเองเพื่อให้สังเกตง่ายในรายงาน',
          'เพิ่มหมวดใหม่ได้พร้อมตั้งชื่อ ไอคอน และสีของคุณเอง',
          'เมื่อแก้ชื่อหมวดเริ่มต้น ชื่อนั้นจะอยู่คงที่แม้คุณเปลี่ยนภาษา',
          'เมื่อลบหมวด แอปจะให้คุณย้ายรายจ่ายที่เกี่ยวข้องไปหมวดอื่น ประวัติจึงไม่หาย'
        ]
      },
      {
        visual: 'settings-recurring',
        title: 'ตั้งค่า > รายจ่ายประจำ',
        body: 'รายจ่ายประจำใช้กับรายการที่เกิดทุกเดือน เช่น ค่าเช่า ค่าโทรศัพท์ ประกัน ค่าเรียน หรือ subscription',
        details: [
          'กรอกจำนวนเงิน หมวด วันที่ของทุกเดือน วันเริ่ม และหมายเหตุเมื่อสร้างกฎ',
          'เมื่อถึงกำหนด แอปจะสร้างรายการรายจ่ายจริงในประวัติให้อัตโนมัติ',
          'รายจ่ายที่สร้างแล้วยังคงอยู่ในประวัติแม้คุณจะลบกฎภายหลัง',
          'หากวันที่ที่เลือกเกินจำนวนวันของเดือน แอปจะใช้วันใกล้ที่สุดที่ถูกต้องในเดือนนั้น',
          'รายจ่ายประจำเหมาะกับยอดที่เกือบคงที่ หากมีค่าผันแปรควรกรอกมือเพื่อความถูกต้อง'
        ]
      },
      {
        visual: 'report-month',
        title: 'รายงานสัปดาห์ เดือน ไตรมาส และปี',
        body: 'แท็บรายงานแสดงรายได้ รายจ่าย และคงเหลือเป็นรายการแยกตามสัปดาห์ เดือน ไตรมาส หรือปี',
        details: [
          'รายสัปดาห์เหมาะกับเงินสดระยะสั้น รายเดือนเหมาะกับการเทียบกับเงินเดือน เบี้ยเลี้ยง และรายการหัก',
          'รายไตรมาสและรายปีเหมาะกับแนวโน้มยาวและการทบทวนแผน',
          'คงเหลือ = รายได้หลังหักในช่วงนั้น − รายจ่ายของช่วงเดียวกัน',
          'รายงานแสดงรายละเอียดทุกกะในช่วงนั้น (ที่ทำงาน ชั่วโมง OT รายได้ก่อน/หลังหัก)',
          'รายจ่ายตามหมวดช่วยระบุกลุ่มที่ใช้เงินมากที่สุด',
          'แต่ละช่วงสามารถส่งออกเป็น CSV (สำหรับ Excel/Numbers/Google Sheets) หรือ PDF (สำหรับพิมพ์/แชร์)'
        ]
      },
      {
        visual: 'settings-root',
        title: 'หัวข้อทั้งหมดในตั้งค่า',
        body: 'ตั้งค่าถูกแบ่งเป็นกลุ่มชัดเจน แต่ละกลุ่มดูแลด้านที่แตกต่างกันของข้อมูลหรือการใช้งาน',
        details: [
          'จัดการงาน: เพิ่ม แก้ไข ลบที่ทำงานและกฎเงินเดือน',
          'รายจ่าย: รวมหมวดรายจ่ายและรายจ่ายประจำ ซึ่งอธิบายไว้ในขั้นตอนก่อนหน้า',
          'Japan Take-home Plus: เปิดเครื่องมือประมาณรายได้สุทธิสำหรับคนทำงานในญี่ปุ่น',
          'ภาษา: เปลี่ยนภาษาทั้งแอป รองรับ 9 ภาษา',
          'สกุลเงิน: เปลี่ยนสัญลักษณ์และรูปแบบเงินทั้งแอป',
          'วิธีใช้: เปิดคู่มือนี้ใหม่ได้เสมอ',
          'แจ้งเตือน: บอกสถานะว่าแอปสามารถส่งการแจ้งเตือน (เช่น เตือนกะที่ยังไม่ได้กรอก สรุปสิ้นช่วง) ได้หรือไม่ เปิด/ปิดได้จากการตั้งค่าของอุปกรณ์',
          'ผู้ใช้: สร้าง สลับ หรือเปลี่ยนชื่อโปรไฟล์ แต่ละโปรไฟล์เก็บข้อมูลแยกกัน',
          'ส่งออกข้อมูล: สร้างไฟล์ CSV หรือ PDF ของโปรไฟล์ปัจจุบัน',
          'นโยบายความเป็นส่วนตัว: เปิดหน้านโยบายความเป็นส่วนตัว',
          'ช่วยเหลือ: เปิด FAQ ช่องทางติดต่อ หรือส่งความคิดเห็น',
          'ล้างข้อมูล / ลบผู้ใช้: ลบประวัติของโปรไฟล์ปัจจุบัน หรือลบโปรไฟล์ทั้งหมด — ย้อนกลับไม่ได้ ควรส่งออกก่อน'
        ]
      },
      {
        visual: 'settings-language',
        title: 'การสลับภาษา',
        body: 'แอปรองรับ 9 ภาษา การเปลี่ยนจะมีผลต่อทั้งหน้าจอและคู่มือนี้ทันที',
        details: [
          'เปิด ตั้งค่า > ภาษา แล้วเลือกภาษาที่ต้องการ',
          'หน้าจอทั้งหมด ปุ่ม ข้อความในแอป และคู่มือนี้จะเปลี่ยนเป็นภาษาใหม่ทันที',
          'ชื่อหมวดรายจ่ายเริ่มต้น 9 หมวดจะเปลี่ยนตามภาษา (เช่น Food → อาหาร)',
          'หมวดที่คุณแก้ชื่อเองจะคงชื่อนั้นไว้และไม่ถูกแปลอัตโนมัติ',
          'ป้ายเฉพาะของ Japan Take-home Plus เช่น Nenkin, Shakai hoken, Gross จะคงรูปเดิมเพื่อให้ตรงกับศัพท์ทางการ'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: 'ส่วนเฉพาะสำหรับคนทำงานในญี่ปุ่น คำนวณรายได้รับจริงโดยประมาณหลังประกันสังคมและภาษีตามกฎปี 2026',
        details: [
          'Work style: เลือก baito, haken, พนักงานทั่วไป หรือ freelancer ซึ่งจะเปลี่ยนสูตรคำนวณ',
          'Monthly gross: รายได้ก่อนหักของเดือนนั้น ใช้ปุ่มดึงรายได้เดือนนี้จากแอปเป็นข้อมูลเข้าได้',
          'อายุและประกันมีผลต่อยอด Nenkin และ Shakai hoken (รวมถึง kaigo hoken เมื่อถึงเกณฑ์อายุ)',
          'จังหวัดมีผลต่ออัตราประกันสุขภาพ เพราะแต่ละจังหวัดมีอัตราของตนเอง',
          'ผู้พึ่งพิงช่วยลดเงินได้ที่ต้องเสียภาษีหากเข้าเงื่อนไข ผู้พึ่งพิงต่างประเทศมีเงื่อนไขเพิ่มเติม',
          'Resident tax สามารถให้แอปประมาณอัตโนมัติ กรอกมือจากใบภาษี หรือปิดไว้หากยังไม่จำเป็น',
          'ผลลัพธ์เป็นเพียงค่าประมาณอ้างอิง สลิปเงินเดือนและการยื่นภาษีจริงคือตัวเลขสุดท้าย'
        ]
      }
    ]
  },
  pt: {
    title: 'Guia completo do Salary Tracker',
    intro: 'Este guia percorre cada área do app: visão geral, painel, turnos, configuração de empregos, despesas, relatórios, seções de configurações, troca de idioma e Japan Take-home Plus.',
    tipsTitle: 'Observações gerais',
    tips: [
      'Fluxo recomendado: criar emprego → adicionar turnos → registrar despesas → revisar relatórios.',
      'A renda é o foco principal; as despesas mostram o que realmente sobra.',
      'Todos os dados ficam no seu aparelho — nada é enviado para um servidor.',
      'Exporte CSV/PDF antes de limpar dados ou excluir um usuário.',
      'O Japan Take-home Plus é uma estimativa, não substitui holerite oficial nem orientação fiscal.'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: 'Visão geral do app',
        body: 'O Salary Tracker acompanha a renda de vários empregos e adiciona um controle leve de despesas para mostrar o que sobra por dia, semana, mês, trimestre e ano.',
        details: [
          'Objetivo principal: reunir renda por hora, por dia ou por mês de vários empregos em um só lugar.',
          'A renda vem em primeiro lugar; as despesas são complementares — o app não substitui um sistema contábil completo.',
          'Os dados ficam salvos diretamente no aparelho; não há conta em nuvem nem sincronização online.',
          'Quatro abas principais: Início, Adicionar trabalho, Relatório e Configurações.',
          'Fluxo sugerido: configure um emprego, adicione turnos, registre despesas e abra relatórios para revisar.'
        ]
      },
      {
        visual: 'home-recent',
        title: 'Início e painel',
        body: 'O painel coloca a renda em primeiro lugar e exibe despesas e restante como informação de apoio.',
        details: [
          'Hoje, esta semana, este mês e este ano mostram o progresso assim que o app abre.',
          'Gasto hoje é o total de despesas registradas no dia atual.',
          'Restante = renda após descontos no período menos despesas do mesmo período; use como referência rápida.',
          'Trabalhos recentes lista os turnos mais novos para você revisar ou ajustar rapidamente.',
          'Estatísticas rápidas mostram número de turnos, horas e tendências para avaliar a carga de trabalho.',
          'Meta mensal indica quanto da renda já foi atingida em relação ao alvo definido para o emprego.'
        ]
      },
      {
        visual: 'add-shift-form',
        title: 'Adicionar, editar e excluir turnos',
        body: 'A aba Adicionar trabalho serve para registrar turnos diários; o app calcula a renda estimada com base nas regras do emprego selecionado.',
        details: [
          'Toque em uma data no calendário ou no botão de adicionar na lista para abrir o formulário de novo turno.',
          'Informe emprego, data, início, fim, pausa e uma nota opcional.',
          'A pausa é descontada do total de horas; a hora extra segue as regras do emprego escolhido.',
          'Toque em um turno salvo para reabrir o formulário e editar ou excluir.',
          'Adicionar do histórico copia um turno anterior como modelo, útil para escalas que se repetem.'
        ]
      },
      {
        visual: 'add-list',
        title: 'Calendário e lista mensal',
        body: 'É possível ver os turnos como calendário em grade ou como lista em linha do tempo mensal, conforme for melhor para comparar.',
        details: [
          'No calendário do mês, marcas coloridas indicam dias com turnos ou despesas.',
          'No modo lista, cada dia é uma linha do tempo vertical — toque na coluna da data para adicionar um turno.',
          'Deslize horizontalmente para ir ao mês anterior ou seguinte.',
          'Quando o dia tem despesas, elas aparecem ao lado dos turnos na mesma faixa de tempo, facilitando a comparação.'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: 'Configuração de empregos',
        body: 'Cada emprego pode usar pagamento por hora, por dia ou por mês, com regras adicionais de ganho e descontos.',
        details: [
          'Por hora: usa início, fim e pausa para calcular as horas — bom para baito, meio período ou trabalhos por turno.',
          'Por dia: use quando cada dia de trabalho tem valor fixo, sem precisar de detalhamento de horário.',
          'Por mês: usa salário mensal e dias-padrão; a renda é distribuída pelos relatórios do período.',
          'A hora extra pode usar limite de horas, multiplicador ou um valor manual em dias especiais.',
          'Os benefícios podem ser diários, mensais ou anuais — por exemplo, transporte, almoço ou bônus de fim de ano.',
          'Os descontos podem ser valor fixo ou percentual e ter validade por período, úteis para impostos, seguros e taxas.',
          'Ícone e cor ajudam a distinguir empregos no calendário, na lista e nos relatórios.'
        ]
      },
      {
        visual: 'expense-form',
        title: 'Registrar despesas diárias',
        body: 'As despesas são leves de propósito, com quatro campos: data, valor, categoria e nota. O foco é ver o fluxo de caixa, não fazer contabilidade completa.',
        details: [
          'Crie uma despesa pela aba Adicionar trabalho, pelo painel ou pelos botões de despesa do app.',
          'A data define a qual dia, semana, mês, trimestre ou ano a despesa pertence nos relatórios.',
          'O valor entra no total de despesas e reduz o restante de forma proporcional.',
          'A categoria alimenta a divisão de despesas nos relatórios para análise.',
          'Cada despesa aparece no calendário do dia, em "Gasto hoje" no painel e na seção de Despesas dos relatórios.'
        ]
      },
      {
        visual: 'settings-categories',
        title: 'Configurações > Categorias de despesa',
        body: 'As categorias organizam os gastos e tornam os relatórios mais fáceis de ler.',
        details: [
          'O app traz 9 categorias padrão: Alimentação, Transporte, Casa, Compras, Saúde, Educação, Lazer, Família e Outros.',
          'Cada categoria padrão tem ícone e cor próprios para facilitar a leitura nos relatórios.',
          'Você pode criar novas categorias com nome, ícone e cor próprios.',
          'Quando você renomeia uma categoria padrão, o nome personalizado se mantém mesmo após trocar de idioma.',
          'Ao excluir uma categoria, o app pede para mover as despesas relacionadas para outra categoria, preservando o histórico.'
        ]
      },
      {
        visual: 'settings-recurring',
        title: 'Configurações > Despesas recorrentes',
        body: 'As despesas recorrentes servem para itens mensais como aluguel, telefone, seguro, mensalidades ou assinaturas.',
        details: [
          'Informe valor, categoria, dia do mês, data inicial e nota ao criar a regra.',
          'Quando o vencimento chega, o app gera uma despesa real no histórico automaticamente.',
          'As despesas geradas continuam no histórico mesmo se você excluir a regra recorrente depois.',
          'Se o dia escolhido for maior que o número de dias do mês, o app usa a data válida mais próxima daquele mês.',
          'As recorrentes funcionam bem para valores quase fixos; gastos variáveis ficam mais precisos quando registrados manualmente.'
        ]
      },
      {
        visual: 'report-month',
        title: 'Relatórios por semana, mês, trimestre e ano',
        body: 'A aba Relatório apresenta Renda, Despesas e Restante separadamente por semana, mês, trimestre ou ano.',
        details: [
          'A semana é boa para fluxo de caixa de curto prazo; o mês é bom para conferir salário, benefícios e descontos.',
          'O trimestre e o ano servem para tendências longas e revisão de planos.',
          'Restante = renda após descontos no período − despesas do mesmo período.',
          'Os relatórios listam cada turno do período (emprego, horas, hora extra, valor bruto/líquido).',
          'A despesa por categoria mostra qual grupo consome mais dinheiro.',
          'Cada período pode ser exportado em CSV (para Excel/Numbers/Google Sheets) ou PDF (para imprimir ou compartilhar).'
        ]
      },
      {
        visual: 'settings-root',
        title: 'Todas as seções de Configurações',
        body: 'As configurações são divididas em grupos claros; cada grupo gerencia um aspecto diferente dos dados ou da experiência.',
        details: [
          'Empregos: adicionar, editar ou excluir locais de trabalho com suas regras de pagamento.',
          'Despesas: inclui categorias e despesas recorrentes, descritas nos passos anteriores.',
          'Japan Take-home Plus: abre o estimador de salário líquido para quem trabalha no Japão.',
          'Idioma: troca toda a interface; 9 idiomas são suportados.',
          'Moeda: muda os símbolos e o formato de valor em todo o app.',
          'Como usar: reabre este guia a qualquer momento.',
          'Notificações: indica se o app pode enviar lembretes (como turno faltando ou resumo do período); ative ou desative pelas Configurações do dispositivo.',
          'Usuários: criar, trocar ou renomear perfis; cada perfil mantém dados separados.',
          'Exportar Dados: gera arquivos CSV ou PDF do perfil atual.',
          'Política de Privacidade: abre a página da política de privacidade.',
          'Suporte: abre a página de FAQ, contato e feedback.',
          'Limpar Dados / Excluir Usuário: remove o histórico do perfil atual ou o perfil inteiro — irreversível, exporte antes.'
        ]
      },
      {
        visual: 'settings-language',
        title: 'Trocar de idioma',
        body: 'O app suporta 9 idiomas; a troca é aplicada imediatamente em toda a interface e neste guia.',
        details: [
          'Abra Configurações > Idioma e escolha o idioma desejado.',
          'Toda a interface, rótulos de botões, mensagens e este guia mudam de idioma na hora.',
          'Os 9 nomes de categoria padrão acompanham o idioma — por exemplo, "Food" vira "Alimentação".',
          'Categorias que você renomeou mantêm seu nome personalizado e não são traduzidas automaticamente.',
          'Termos especializados do Japan Take-home Plus, como "Nenkin", "Shakai hoken" e "Gross", permanecem no original para manter o vocabulário oficial.'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: 'Seção dedicada a quem trabalha no Japão que estima o valor líquido após seguro social e impostos com base nas regras de 2026.',
        details: [
          'Work style: escolha baito, haken, funcionário regular ou freelancer — as regras de cálculo mudam conforme a opção.',
          'Monthly gross: salário bruto do mês; use o botão para puxar a renda deste mês do app como entrada rápida.',
          'Idade e seguro afetam Nenkin e Shakai hoken (incluindo kaigo hoken quando a idade exigir).',
          'A província muda a alíquota do seguro de saúde, pois cada uma publica a sua própria.',
          'Dependentes reduzem a renda tributável quando atendem aos critérios; dependentes no exterior têm regras mais rigorosas.',
          'O imposto residencial pode ser estimado pelo app, lançado manualmente do aviso oficial ou desligado se ainda não for necessário.',
          'O resultado é apenas referência; o holerite oficial e a declaração de imposto continuam sendo a fonte final.'
        ]
      }
    ]
  },
  ru: {
    title: 'Полное руководство Salary Tracker',
    intro: 'Это руководство охватывает все разделы приложения: обзор, дашборд, смены, настройка работы, расходы, отчёты, разделы настроек, переключение языка и Japan Take-home Plus.',
    tipsTitle: 'Общие замечания',
    tips: [
      'Рекомендуемый порядок: создайте работу → добавьте смены → запишите расходы → откройте отчёты.',
      'Главный фокус — доход; расходы помогают увидеть, сколько реально остаётся.',
      'Все данные хранятся только на вашем устройстве и не отправляются на сервер.',
      'Экспортируйте CSV/PDF перед очисткой данных или удалением пользователя.',
      'Japan Take-home Plus — это оценка, а не официальный расчётный лист или налоговая консультация.'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: 'Обзор приложения',
        body: 'Salary Tracker отслеживает доход с нескольких работ и добавляет лёгкий учёт расходов, чтобы видеть остаток по дням, неделям, месяцам, кварталам и годам.',
        details: [
          'Главная цель: собрать почасовой, дневной или месячный доход с разных работ в одном месте.',
          'Доход — главное, расходы вторичны: приложение не заменяет полноценную бухгалтерию.',
          'Все данные сохраняются на устройстве; нет облачной учётной записи и онлайн-синхронизации.',
          'Четыре основные вкладки: Главная, Добавить работу, Отчёт, Настройки.',
          'Рекомендованный сценарий: настройте работу, добавьте смены, запишите расходы, затем откройте отчёты для проверки.'
        ]
      },
      {
        visual: 'home-recent',
        title: 'Главная и дашборд',
        body: 'Дашборд сначала показывает доход, а расходы и остаток выводит как дополнительный контекст.',
        details: [
          'Доход за сегодня, неделю, месяц и год сразу показывает прогресс при открытии приложения.',
          'Расходы сегодня — сумма расходов, записанных на текущую дату.',
          'Остаток = доход после удержаний за период минус расходы того же периода; используется как быстрый ориентир.',
          'Последние работы выводят свежие смены, чтобы их можно было быстро проверить или поправить.',
          'Быстрая статистика показывает число смен, часы и тренды для оценки нагрузки.',
          'Месячная цель показывает, какой процент от заданной цели уже достигнут текущим доходом.'
        ]
      },
      {
        visual: 'add-shift-form',
        title: 'Добавление, изменение и удаление смен',
        body: 'Вкладка добавления работы предназначена для записи смен; приложение считает ожидаемый доход по правилам выбранной работы.',
        details: [
          'Нажмите дату в календаре или кнопку добавления в списке, чтобы открыть форму смены.',
          'Введите работу, дату, начало, окончание, перерыв и при необходимости заметку.',
          'Перерыв вычитается из общего времени, а сверхурочные считаются по правилам выбранной работы.',
          'Нажмите сохранённую смену, чтобы снова открыть форму для редактирования или удаления.',
          'Добавление из истории копирует прежнюю смену как шаблон — удобно для повторяющихся графиков.'
        ]
      },
      {
        visual: 'add-list',
        title: 'Календарь и месячный список',
        body: 'Смены можно смотреть в виде сетки календаря или месячного списка-ленты — в зависимости от того, как удобнее сравнивать.',
        details: [
          'В календаре месяца цветные отметки указывают дни со сменами или расходами.',
          'В режиме списка каждый день — это вертикальная лента; нажмите колонку даты, чтобы добавить смену в этот день.',
          'Листайте в стороны, чтобы перейти к предыдущему или следующему месяцу.',
          'Если в этот день есть расходы, они отображаются рядом со сменой на одной временной полосе для удобного сравнения.'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: 'Настройка работы',
        body: 'Каждая работа может использовать почасовую, дневную или месячную оплату, дополненную правилами доплат и удержаний.',
        details: [
          'Почасовая: использует начало, окончание и перерыв — подходит для baito, частичной занятости и сменной работы.',
          'Дневная: используйте, если за рабочий день платят фиксированную сумму, без подробного учёта времени.',
          'Месячная: использует месячную ставку и стандартные рабочие дни; доход распределяется по периодическим отчётам.',
          'Сверхурочные настраиваются по порогу часов, множителю или ручной сумме для особых дней.',
          'Надбавки бывают дневными, месячными или годовыми — например, проезд, обед или годовая премия.',
          'Удержания могут быть фиксированной суммой или процентом и иметь срок действия — для налогов, страхования и сборов.',
          'Иконка и цвет помогают отличать работы в календаре, списке и отчётах.'
        ]
      },
      {
        visual: 'expense-form',
        title: 'Запись ежедневных расходов',
        body: 'Расходы намеренно простые: дата, сумма, категория и заметка. Цель — видеть денежный поток, а не вести полноценный учёт.',
        details: [
          'Создайте новый расход из вкладки добавления работы, дашборда или любой кнопки расходов в приложении.',
          'Дата определяет, к какому дню, неделе, месяцу, кварталу или году относится расход в отчётах.',
          'Сумма входит в общий расход и уменьшает остаток.',
          'Категория используется для разбивки расходов в отчётах и анализа.',
          'Каждый расход появляется в календаре дня, в блоке "Расходы сегодня" дашборда и в разделе расходов отчёта.'
        ]
      },
      {
        visual: 'settings-categories',
        title: 'Настройки > Категории расходов',
        body: 'Категории расходов организуют траты и делают отчёты понятнее.',
        details: [
          'В приложении 9 стандартных категорий: Еда, Транспорт, Дом, Покупки, Здоровье, Учёба, Развлечения, Семья, Другое.',
          'У каждой стандартной категории есть свой значок и цвет для быстрой узнаваемости в отчётах.',
          'Можно добавлять собственные категории с именем, иконкой и цветом по вашему вкусу.',
          'Если изменить имя стандартной категории, ваше имя сохраняется даже после смены языка.',
          'При удалении категории приложение предлагает перенести связанные расходы в другую категорию, чтобы история не пропала.'
        ]
      },
      {
        visual: 'settings-recurring',
        title: 'Настройки > Регулярные расходы',
        body: 'Регулярные расходы предназначены для ежемесячных платежей: аренда, телефон, страховка, обучение, подписки.',
        details: [
          'При создании правила укажите сумму, категорию, день месяца, дату начала и заметку.',
          'Когда наступает день, приложение автоматически создаёт настоящий расход в истории.',
          'Уже созданные расходы остаются в истории даже после удаления регулярного правила.',
          'Если выбранный день не существует в данном месяце, приложение использует ближайший корректный день этого месяца.',
          'Регулярные расходы хороши для почти фиксированных сумм; переменные расходы лучше вводить вручную для точности.'
        ]
      },
      {
        visual: 'report-month',
        title: 'Отчёты за неделю, месяц, квартал и год',
        body: 'Вкладка отчётов отдельно показывает Доход, Расходы и Остаток по неделе, месяцу, кварталу или году.',
        details: [
          'Неделя удобна для коротких потоков, месяц — для сверки зарплаты, надбавок и удержаний.',
          'Квартал и год полезны для долгих трендов и пересмотра планов.',
          'Остаток = доход после удержаний за период − расходы того же периода.',
          'Отчёты перечисляют все смены периода: работа, часы, сверхурочные, gross/net.',
          'Расходы по категориям показывают, какая группа потребляет больше всего денег.',
          'Каждый период можно экспортировать в CSV (для Excel/Numbers/Google Sheets) или PDF (для печати и отправки).'
        ]
      },
      {
        visual: 'settings-root',
        title: 'Все разделы настроек',
        body: 'Настройки разделены на чёткие группы; каждая управляет своим аспектом данных или поведением.',
        details: [
          'Управление работой: добавление, изменение и удаление работ и их правил оплаты.',
          'Расходы: содержат категории и регулярные расходы — описаны в предыдущих шагах.',
          'Japan Take-home Plus: открывает оценщик чистой зарплаты для работающих в Японии.',
          'Язык: меняет интерфейс целиком, поддерживается 9 языков.',
          'Валюта: меняет символы и формат отображения денег во всём приложении.',
          'Как пользоваться: открывает это руководство в любое время.',
          'Уведомления: показывает, может ли приложение присылать напоминания (например, о пропущенной смене или итогах периода); включить и выключить можно в настройках устройства.',
          'Пользователи: создавайте, переключайте и переименовывайте профили; у каждого профиля свои данные.',
          'Экспорт данных: создаёт CSV или PDF для текущего профиля.',
          'Политика конфиденциальности: открывает страницу политики.',
          'Поддержка: открывает страницу FAQ, контактов и обратной связи.',
          'Очистить данные / Удалить пользователя: удаляет историю текущего профиля или сам профиль; действие необратимо, экспортируйте данные заранее.'
        ]
      },
      {
        visual: 'settings-language',
        title: 'Переключение языка',
        body: 'Приложение поддерживает 9 языков; смена применяется мгновенно ко всему интерфейсу и этому руководству.',
        details: [
          'Откройте Настройки > Язык и выберите нужный язык.',
          'Весь интерфейс, надписи кнопок, сообщения и это руководство сразу переключаются на новый язык.',
          'Названия 9 стандартных категорий расходов следуют за языком — например, "Food" становится "Еда".',
          'Категории, которые вы переименовали, сохраняют ваше имя и не переводятся автоматически.',
          'Специализированные термины Japan Take-home Plus — "Nenkin", "Shakai hoken", "Gross" — остаются в исходной форме, чтобы соответствовать официальной терминологии.'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: 'Отдельный раздел для тех, кто работает в Японии: оценивает сумму на руки после социальных страховок и налогов по правилам 2026 года.',
        details: [
          'Work style: выберите baito, haken, обычного сотрудника или freelancer — правила расчёта меняются.',
          'Monthly gross: gross-зарплата за месяц; кнопкой можно подставить доход этого месяца из приложения.',
          'Возраст и страховка влияют на размеры Nenkin и Shakai hoken (включая kaigo hoken по достижении возраста).',
          'Префектура меняет ставку медицинской страховки — у каждой свой тариф.',
          'Иждивенцы уменьшают облагаемый доход при выполнении условий; для иждивенцев за рубежом действуют более строгие правила.',
          'Resident tax можно оценить автоматически, ввести вручную из уведомления или выключить, если он пока не нужен.',
          'Результат — только справочная оценка; окончательные цифры дают официальный расчётный лист и налоговая декларация.'
        ]
      }
    ]
  },
  ko: {
    title: 'Salary Tracker 전체 가이드',
    intro: '이 가이드는 앱의 모든 영역을 차례로 설명합니다: 개요, 대시보드, 근무, 직장 설정, 지출, 리포트, 설정 항목, 언어 전환, Japan Take-home Plus.',
    tipsTitle: '전반적인 안내',
    tips: [
      '추천 흐름: 직장 만들기 → 근무 추가 → 지출 기록 → 리포트 확인.',
      '수입이 중심이며 지출은 실제 남는 금액을 보기 위한 보조 기능입니다.',
      '모든 데이터는 사용자의 기기 안에만 저장되며 서버로 전송되지 않습니다.',
      '데이터 초기화나 사용자 삭제 전에 CSV/PDF로 내보내 두세요.',
      'Japan Take-home Plus는 추정값이며 공식 급여명세서나 세무 조언이 아닙니다.'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: '앱 개요',
        body: 'Salary Tracker는 여러 직장의 수입을 관리하고 가벼운 지출 기록을 추가해 일·주·월·분기·연도별 남은 금액을 알려 줍니다.',
        details: [
          '주 목표: 시급, 일급, 월급 형태의 다양한 직장을 한 곳에서 합산해 확인합니다.',
          '수입이 중심이며 지출은 보조 기능입니다. 본격적인 회계 도구를 대체하지는 않습니다.',
          '모든 데이터는 기기 안에만 저장되며 클라우드 계정이나 온라인 동기화는 없습니다.',
          '주요 탭은 네 개: 홈, 근무 추가, 리포트, 설정.',
          '권장 사용 순서는 직장을 먼저 설정한 뒤 근무를 추가하고 지출을 기록하고 마지막에 리포트로 확인하는 것입니다.'
        ]
      },
      {
        visual: 'home-recent',
        title: '홈과 대시보드',
        body: '대시보드는 수입을 우선으로 보여 주고 지출과 남은 금액은 보조 정보로 표시합니다.',
        details: [
          '오늘, 이번 주, 이번 달, 올해 수입은 앱을 열자마자 진행 상황을 알려 줍니다.',
          '오늘 지출은 현재 날짜에 기록된 지출의 합계입니다.',
          '남은 금액 = 해당 기간의 공제 후 수입 − 같은 기간 지출이며, 빠른 참고용 수치입니다.',
          '최근 근무는 가장 최근 추가된 근무를 나열해 빠른 확인과 수정을 도와줍니다.',
          '빠른 통계는 근무 횟수, 시간, 추세를 보여 업무량을 가늠하게 해 줍니다.',
          '월 목표는 현재 수입이 직장에 설정된 목표의 몇 퍼센트인지 알려 줍니다.'
        ]
      },
      {
        visual: 'add-shift-form',
        title: '근무 추가, 편집, 삭제',
        body: '근무 추가 탭은 매일의 근무를 기록하는 곳이며, 앱은 선택한 직장의 규칙으로 예상 수입을 자동 계산합니다.',
        details: [
          '달력의 날짜를 누르거나 리스트의 추가 버튼으로 새 근무 폼을 엽니다.',
          '직장, 날짜, 시작 시간, 종료 시간, 휴식 시간을 입력하고 필요하면 메모를 적습니다.',
          '휴식 시간은 총 근무 시간에서 차감되며 OT는 선택한 직장 규칙을 따릅니다.',
          '저장된 근무를 누르면 폼이 다시 열려 편집하거나 삭제할 수 있습니다.',
          '기록에서 추가는 이전 근무를 템플릿처럼 복사해 반복 일정을 빠르게 입력합니다.'
        ]
      },
      {
        visual: 'add-list',
        title: '달력과 월별 리스트',
        body: '근무는 격자 달력 또는 월별 타임라인 형태로 볼 수 있어 비교가 편합니다.',
        details: [
          '월 달력의 색상 표시는 그날 근무나 지출이 있음을 나타냅니다.',
          '리스트 모드에서는 각 날짜가 세로 타임라인이며, 날짜 칸을 누르면 그 날짜에 근무를 추가합니다.',
          '좌우로 밀어 이전 달이나 다음 달로 이동합니다.',
          '그날 지출이 있다면 같은 시간 띠에 근무와 함께 표시되어 비교가 쉽습니다.'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: '직장 설정',
        body: '각 직장은 시급, 일급, 월급 중 하나를 선택할 수 있고, 추가 수입과 공제 규칙도 함께 설정할 수 있습니다.',
        details: [
          '시급: 시작, 종료, 휴식 시간을 사용해 근무 시간을 계산하며 baito·아르바이트·시프트 근무에 어울립니다.',
          '일급: 하루에 고정 금액을 받는 근무에 사용하며 자세한 시간 입력이 필요 없습니다.',
          '월급: 월급과 표준 근무일 수를 사용해 기간 리포트에 수입을 분배합니다.',
          'OT는 시간 기준, 배율, 또는 특별일 수동 금액으로 설정할 수 있습니다.',
          '수당은 일·월·연 단위로 설정할 수 있습니다. 예: 교통, 점심, 연말 보너스.',
          '공제는 고정액 또는 비율로 정할 수 있고 적용 기간을 둘 수 있어 세금·보험·각종 수수료에 사용합니다.',
          '아이콘과 색상은 달력, 리스트, 리포트에서 직장을 구분하는 데 사용됩니다.'
        ]
      },
      {
        visual: 'expense-form',
        title: '일일 지출 기록',
        body: '지출은 의도적으로 가볍게 설계되었으며 날짜, 금액, 카테고리, 메모의 네 가지 항목만 사용합니다. 본격 회계가 아닌 현금 흐름 파악이 목적입니다.',
        details: [
          '근무 추가 탭, 대시보드, 또는 앱의 지출 버튼에서 새 지출을 만듭니다.',
          '날짜는 그 지출이 리포트의 어느 일·주·월·분기·연도에 속하는지 결정합니다.',
          '금액은 총 지출에 합산되며 남은 금액에서 그만큼 차감됩니다.',
          '카테고리는 리포트에서 지출을 분류해 분석에 활용됩니다.',
          '각 지출은 해당 날짜의 달력, 대시보드의 “오늘 지출”, 리포트의 지출 영역에 모두 표시됩니다.'
        ]
      },
      {
        visual: 'settings-categories',
        title: '설정 > 지출 카테고리',
        body: '지출 카테고리는 지출을 정리하고 리포트를 보기 좋게 만듭니다.',
        details: [
          '앱은 9개의 기본 카테고리를 제공합니다: 식비, 교통, 주거, 쇼핑, 건강, 학습, 엔터테인먼트, 가족, 기타.',
          '각 기본 카테고리는 고유한 아이콘과 색상을 가지고 있어 리포트에서 빠르게 식별됩니다.',
          '직접 이름·아이콘·색상을 정해 새 카테고리를 추가할 수 있습니다.',
          '기본 카테고리 이름을 수정하면 언어를 바꿔도 사용자가 입력한 이름이 유지됩니다.',
          '카테고리를 삭제할 때 앱은 관련 지출을 다른 카테고리로 옮기도록 안내해 기록을 보존합니다.'
        ]
      },
      {
        visual: 'settings-recurring',
        title: '설정 > 정기 지출',
        body: '정기 지출은 월세, 휴대폰, 보험, 학비, 구독 등 매달 반복되는 항목에 사용합니다.',
        details: [
          '규칙을 만들 때 금액, 카테고리, 매월 날짜, 시작일, 메모를 입력합니다.',
          '예정일이 되면 앱이 기록에 실제 지출을 자동으로 생성합니다.',
          '이미 생성된 지출은 정기 규칙을 나중에 삭제해도 기록에 남아 있습니다.',
          '설정한 날짜가 해당 월에 없으면 앱은 그 달에서 가장 가까운 유효 날짜를 사용합니다.',
          '정기 지출은 거의 고정된 금액에 적합합니다. 변동이 큰 지출은 직접 입력하는 편이 정확합니다.'
        ]
      },
      {
        visual: 'report-month',
        title: '주, 월, 분기, 연도 리포트',
        body: '리포트 탭은 주, 월, 분기, 연도 단위로 수입, 지출, 남은 금액을 분리해 보여 줍니다.',
        details: [
          '주는 단기 현금 흐름에, 월은 급여·수당·공제 확인에 적합합니다.',
          '분기와 연도는 장기 추세와 계획 점검에 좋습니다.',
          '남은 금액 = 기간 내 공제 후 수입 − 같은 기간 지출.',
          '리포트는 기간 내 모든 근무를 나열합니다(직장, 시간, OT, 총/실수령액).',
          '카테고리별 지출로 어떤 그룹에서 돈을 가장 많이 쓰는지 알 수 있습니다.',
          '각 기간을 CSV(Excel/Numbers/Google Sheets용) 또는 PDF(인쇄·공유용)로 내보낼 수 있습니다.'
        ]
      },
      {
        visual: 'settings-root',
        title: '설정의 모든 항목',
        body: '설정은 명확한 그룹으로 나뉘어 있으며, 각 그룹은 데이터나 사용 경험의 다른 측면을 관리합니다.',
        details: [
          '직장 관리: 직장과 급여 규칙을 추가, 편집, 삭제합니다.',
          '지출: 지출 카테고리와 정기 지출이 포함되며 앞 단계에서 설명했습니다.',
          'Japan Take-home Plus: 일본 근무자를 위한 실수령액 추정 도구를 엽니다.',
          '언어: 앱 전체의 인터페이스를 전환합니다. 9개 언어를 지원합니다.',
          '통화: 앱 전체의 화폐 기호와 표시 형식을 변경합니다.',
          '사용 가이드: 이 가이드를 언제든지 다시 엽니다.',
          '알림: 앱이 알림(근무 누락, 기간 요약 등)을 보낼 수 있는 상태인지 표시합니다. 기기 설정에서 켜고 끌 수 있습니다.',
          '사용자: 프로필을 만들고 전환하거나 이름을 변경합니다. 각 프로필은 별도의 데이터를 가집니다.',
          '데이터 내보내기: 현재 프로필의 CSV 또는 PDF 파일을 만듭니다.',
          '개인정보 처리방침: 개인정보 처리방침 페이지를 엽니다.',
          '지원: FAQ, 연락처, 피드백 페이지를 엽니다.',
          '데이터 초기화 / 사용자 삭제: 현재 프로필의 기록이나 프로필 자체를 삭제합니다. 되돌릴 수 없으므로 미리 내보내세요.'
        ]
      },
      {
        visual: 'settings-language',
        title: '언어 전환',
        body: '앱은 9개 언어를 지원하며, 변경은 즉시 전체 인터페이스와 이 가이드에 적용됩니다.',
        details: [
          '설정 > 언어를 열고 사용할 언어를 선택합니다.',
          '전체 인터페이스, 버튼 라벨, 앱 메시지, 그리고 이 가이드가 즉시 새 언어로 바뀝니다.',
          '9개 기본 지출 카테고리 이름도 언어를 따라 바뀝니다(예: Food → 식비).',
          '직접 이름을 바꾼 카테고리는 사용자가 입력한 이름을 유지하며 자동 번역되지 않습니다.',
          'Japan Take-home Plus의 “Nenkin”, “Shakai hoken”, “Gross” 같은 전문 용어는 공식 표현과 일치하도록 원어를 그대로 사용합니다.'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: '일본 근무자를 위한 별도 섹션으로 2026년 규칙에 따라 사회보험과 세금 후 실수령액을 추정합니다.',
        details: [
          'Work style: baito, haken, 정규직, freelancer 중에서 선택하며 계산 규칙이 달라집니다.',
          'Monthly gross: 해당 월의 gross 급여이며, 버튼으로 앱의 “이번 달 수입”을 입력값으로 가져올 수 있습니다.',
          '연령과 보험은 Nenkin과 Shakai hoken 금액에 영향을 줍니다(연령 조건에 따라 kaigo hoken 포함).',
          '도도부현은 건강보험 요율에 영향을 줍니다. 각 도도부현마다 요율이 다릅니다.',
          '부양가족은 조건을 만족하면 과세 소득을 줄여 줍니다. 해외 부양가족은 더 엄격한 조건을 따릅니다.',
          'Resident tax는 자동 추정, 세금 통지서 기반 수동 입력, 또는 비활성화를 선택할 수 있습니다.',
          '결과는 참고용 추정치이며 최종 수치는 공식 급여명세서와 세금 신고로 결정됩니다.'
        ]
      }
    ]
  },
  hi: {
    title: 'Salary Tracker पूरी गाइड',
    intro: 'यह गाइड ऐप के हर हिस्से को बारी-बारी से समझाती है: overview, dashboard, shifts, workplace setup, खर्च, रिपोर्ट, सेटिंग के अनुभाग, भाषा बदलना और Japan Take-home Plus।',
    tipsTitle: 'सामान्य सुझाव',
    tips: [
      'सुझाया गया flow: कार्यस्थल बनाएं → शिफ्ट जोड़ें → खर्च लिखें → रिपोर्ट देखें।',
      'मुख्य फोकस आय है; खर्च बताते हैं कि असल में कितना बचा है।',
      'सारा डेटा सिर्फ आपके डिवाइस पर रहता है, server पर नहीं भेजा जाता।',
      'डेटा साफ करने या उपयोगकर्ता हटाने से पहले CSV/PDF export करें।',
      'Japan Take-home Plus केवल अनुमान है, आधिकारिक payslip या tax advice नहीं।'
    ],
    steps: [
      {
        visual: 'home-dashboard',
        title: 'ऐप overview',
        body: 'Salary Tracker कई कार्यस्थलों की आय track करता है और हल्का खर्च tracking जोड़ता है, ताकि आप दिन, सप्ताह, महीने, तिमाही और साल के हिसाब से बची राशि देख सकें।',
        details: [
          'मुख्य उद्देश्य: कई jobs की hourly, daily या monthly आय एक जगह जोड़ना।',
          'आय मुख्य है, खर्च सहायक — यह ऐप पूर्ण accounting tool नहीं है।',
          'सारा डेटा डिवाइस पर ही save होता है; cloud account या online sync नहीं है।',
          'चार मुख्य tab: Home, Add Work, Report और Settings।',
          'सुझाया गया उपयोग क्रम: पहले कार्यस्थल set करें, फिर shifts जोड़ें, खर्च record करें, अंत में reports देखें।'
        ]
      },
      {
        visual: 'home-recent',
        title: 'Home और dashboard',
        body: 'Dashboard पहले आय दिखाता है, खर्च और बची राशि सहायक जानकारी के रूप में आते हैं।',
        details: [
          'आज, इस सप्ताह, इस महीने और इस साल की आय ऐप खोलते ही progress दिखाती है।',
          'आज का खर्च वर्तमान दिनांक पर दर्ज खर्चों का कुल योग है।',
          'बाकी = कटौती के बाद की अवधि-आय − उसी अवधि के खर्च; इसे त्वरित reference के रूप में लें।',
          'Recent work आपके नवीनतम shifts दिखाता है, ताकि आप जल्दी जांच या सुधार सकें।',
          'Quick stats shifts की संख्या, घंटे और trends दिखाते हैं, जिससे workload का अंदाजा होता है।',
          'Monthly goal बताता है कि वर्तमान आय निर्धारित लक्ष्य का कितने प्रतिशत तक पहुँची है।'
        ]
      },
      {
        visual: 'add-shift-form',
        title: 'Shift जोड़ना, संपादित करना और हटाना',
        body: 'Add Work tab पर आप daily shifts record करते हैं; ऐप चुनी गई job के नियमों से अनुमानित आय निकालता है।',
        details: [
          'Calendar पर तारीख चुनें या list में add button दबाकर नया shift form खोलें।',
          'कार्यस्थल, तारीख, start time, end time, break और चाहें तो note दर्ज करें।',
          'Break कुल working hours से घटाया जाता है; OT चुनी गई job के नियमों से तय होता है।',
          'Saved shift पर tap करने से form फिर खुलता है, जहाँ edit या delete कर सकते हैं।',
          'Add from history पुराने shift को template की तरह दोबारा प्रयोग करता है, जो repeating schedules में उपयोगी है।'
        ]
      },
      {
        visual: 'add-list',
        title: 'Calendar और monthly list',
        body: 'Shifts को grid calendar या monthly timeline list के रूप में देखा जा सकता है, जो आपको तुलना के लिए सुविधाजनक हो।',
        details: [
          'Month calendar में रंगीन dots उस दिन shift या खर्च होने का संकेत देते हैं।',
          'List mode में हर दिन एक vertical timeline है; date column पर tap करके उस दिन shift जोड़ें।',
          'Previous या next month जाने के लिए horizontal swipe करें।',
          'अगर किसी दिन खर्च है, तो वह उसी समय-पट्टी पर shift के साथ दिखता है, जिससे तुलना आसान होती है।'
        ]
      },
      {
        visual: 'settings-job-edit',
        title: 'कार्यस्थल setup',
        body: 'हर कार्यस्थल hourly, daily या monthly pay चुन सकता है, साथ ही अतिरिक्त आय व कटौती के नियम जोड़ सकते हैं।',
        details: [
          'Hourly: start, end और break से working hours निकाला जाता है — baito, part-time या shift work के लिए उपयुक्त।',
          'Daily: जब प्रत्येक workday का राशि निश्चित हो, बिना समय विवरण के।',
          'Monthly: monthly salary और standard workdays से period reports में आय वितरित होती है।',
          'OT को hour threshold, multiplier या विशेष दिन के लिए manual amount से सेट कर सकते हैं।',
          'भत्ते दैनिक, मासिक या वार्षिक हो सकते हैं — जैसे commute, lunch या साल के अंत का बोनस।',
          'कटौतियाँ निश्चित राशि या प्रतिशत हो सकती हैं और अवधि सीमा रख सकती हैं — taxes, insurance, fees आदि के लिए।',
          'Icon और रंग calendar, list और reports में workplaces पहचानने में मदद करते हैं।'
        ]
      },
      {
        visual: 'expense-form',
        title: 'दैनिक खर्च record करना',
        body: 'खर्च जानबूझकर हल्का रखा गया है — चार fields: date, amount, category और note। उद्देश्य cash flow देखना है, पूरा accounting नहीं।',
        details: [
          'Add Work tab, dashboard या ऐप के expense buttons से नया खर्च बनाएं।',
          'तारीख तय करती है कि खर्च report में किस दिन, सप्ताह, महीने, तिमाही या साल का हिस्सा है।',
          'राशि कुल खर्च में जुड़ती है और बची राशि से उतनी कम होती है।',
          'Category report में expense breakdown के लिए उपयोग होती है।',
          'हर खर्च day calendar, dashboard के “आज का खर्च” और reports के Expense भाग — तीनों जगह दिखता है।'
        ]
      },
      {
        visual: 'settings-categories',
        title: 'Settings > खर्च श्रेणियाँ',
        body: 'खर्च श्रेणियाँ खर्च को व्यवस्थित करती हैं और reports को पढ़ने में आसान बनाती हैं।',
        details: [
          'ऐप में 9 default श्रेणियाँ हैं: भोजन, यातायात, घर, खरीदारी, स्वास्थ्य, शिक्षा, मनोरंजन, परिवार और अन्य।',
          'हर default श्रेणी का अपना icon और रंग है ताकि reports में तुरंत पहचाना जा सके।',
          'अपने नाम, icon और रंग के साथ नई श्रेणी जोड़ी जा सकती है।',
          'जब आप किसी default श्रेणी का नाम बदलते हैं, तो भाषा बदलने पर भी आपका custom नाम बना रहता है।',
          'श्रेणी हटाते समय ऐप संबंधित खर्चों को किसी और श्रेणी में move करवाने के लिए कहता है ताकि history सुरक्षित रहे।'
        ]
      },
      {
        visual: 'settings-recurring',
        title: 'Settings > नियमित खर्च',
        body: 'नियमित खर्च मासिक items जैसे rent, phone, insurance, fees या subscriptions के लिए उपयोग होते हैं।',
        details: [
          'Rule बनाते समय राशि, श्रेणी, माह का दिन, start date और note भरें।',
          'Due date आने पर ऐप अपने आप history में असली expense बना देता है।',
          'जो खर्च बन गए, recurring rule बाद में हटाने पर भी history में बने रहते हैं।',
          'अगर चुना गया दिन उस महीने में नहीं है, ऐप उसी महीने की निकटतम valid date उपयोग करता है।',
          'नियमित खर्च लगभग-स्थिर राशियों के लिए ठीक है; जो खर्च बहुत बदलते हैं उन्हें मैन्युअल record करना ज़्यादा सटीक है।'
        ]
      },
      {
        visual: 'report-month',
        title: 'Week, month, quarter और year reports',
        body: 'Report tab आय, खर्च और बाकी को सप्ताह, महीने, तिमाही या साल अनुसार अलग-अलग दिखाता है।',
        details: [
          'Week short-term cash flow के लिए अच्छा है; month pay, allowances और deductions मिलाने के लिए।',
          'Quarter और year लंबी trends और plan review के लिए उपयोगी हैं।',
          'बाकी = अवधि की कटौती-बाद आय − उसी अवधि के खर्च।',
          'Reports उस अवधि के हर shift का विवरण देते हैं — कार्यस्थल, घंटे, OT, gross/net pay।',
          'Expense by category बताता है कि कौन-सा group सबसे ज़्यादा पैसा खा रहा है।',
          'हर report period को CSV (Excel/Numbers/Google Sheets) या PDF (print/share) के रूप में export किया जा सकता है।'
        ]
      },
      {
        visual: 'settings-root',
        title: 'Settings के सभी अनुभाग',
        body: 'Settings अलग-अलग समूहों में बंटी हैं; हर समूह डेटा या उपयोग के एक पहलू को संभालता है।',
        details: [
          'नौकरी प्रबंधन: कार्यस्थल और उनकी pay rules जोड़ना, संपादित करना, हटाना।',
          'खर्च: इसमें खर्च श्रेणियाँ और नियमित खर्च आते हैं — पिछले steps में बताया गया।',
          'Japan Take-home Plus: जापान में काम करने वालों के लिए take-home estimator खोलता है।',
          'भाषा: पूरे ऐप की interface बदलता है; 9 भाषाएँ समर्थित हैं।',
          'मुद्रा: ऐप में पैसे के symbols और format बदलता है।',
          'उपयोग गाइड: इस गाइड को कभी भी फिर से खोलता है।',
          'सूचनाएँ: बताती हैं कि ऐप reminders (जैसे missing-shift या period summary) भेज सकता है या नहीं; डिवाइस की Settings से इसे on/off करें।',
          'उपयोगकर्ता: profiles बनाएं, बदलें या rename करें; हर profile का अपना डेटा होता है।',
          'डेटा निर्यात: वर्तमान profile के लिए CSV/PDF files बनाता है।',
          'गोपनीयता नीति: privacy policy पेज खोलता है।',
          'सहायता: FAQ, contact और feedback पेज खोलता है।',
          'डेटा हटाएँ / उपयोगकर्ता हटाएँ: वर्तमान profile की history या पूरा profile हटाता है — undo नहीं हो सकता, पहले export कर लें।'
        ]
      },
      {
        visual: 'settings-language',
        title: 'भाषा बदलना',
        body: 'ऐप 9 भाषाएँ समर्थित करता है; बदलाव तुरंत पूरी interface और इस गाइड पर लागू होता है।',
        details: [
          'Settings > भाषा खोलें और इच्छित भाषा चुनें।',
          'सारी interface, button labels, in-app messages और यह गाइड तुरंत नई भाषा में बदल जाते हैं।',
          '9 default expense श्रेणियों के नाम भी भाषा के साथ बदलते हैं — जैसे “Food” बदलकर “भोजन” हो जाता है।',
          'जिन श्रेणियों का नाम आपने बदला है, वे आपका custom नाम बनाए रखती हैं और अपने आप translate नहीं होतीं।',
          'Japan Take-home Plus में “Nenkin”, “Shakai hoken”, “Gross” जैसे विशिष्ट शब्द आधिकारिक रूप से मूल भाषा में रखे जाते हैं।'
        ]
      },
      {
        visual: 'jp-result',
        title: 'Japan Take-home Plus',
        body: 'जापान में काम करने वालों के लिए विशेष भाग, जो 2026 नियमों के आधार पर social insurance और taxes के बाद take-home pay अनुमान देता है।',
        details: [
          'Work style: baito, haken, regular employee या freelancer चुनें; calculation rules उसी के अनुसार बदलते हैं।',
          'Monthly gross: उस माह की gross pay; ऐप के “इस महीने की आय” को input बनाने वाला button उपलब्ध है।',
          'उम्र और insurance Nenkin और Shakai hoken (और age के अनुसार kaigo hoken) के स्तर को प्रभावित करते हैं।',
          'Prefecture स्वास्थ्य insurance दर बदलता है क्योंकि हर prefecture की दर अलग है।',
          'Dependents शर्तें पूरी करने पर taxable income घटाते हैं; overseas dependents के लिए सख्त शर्तें हैं।',
          'Resident tax को auto-estimate, tax slip से manual input, या जरूरत न होने पर off रखा जा सकता है।',
          'परिणाम केवल reference है; अंतिम राशि official payslip और tax filing से तय होती है।'
        ]
      }
    ]
  }
};

function getGuideCopy() {
  return GUIDE_FULL_COPY[curLang] || GUIDE_FULL_COPY.en;
}

function renderGuideVisual(step) {
  const visual = GUIDE_VISUAL_KEYS.includes(step.visual) ? step.visual : GUIDE_FALLBACK_VISUAL;
  const src = getGuideVisualPath(visual);
  const fallback = `img/guide/en/${visual}.webp`;
  const finalFallback = `img/guide/en/${GUIDE_FALLBACK_VISUAL}.webp`;
  return `<img class="guide-shot" src="${src}" alt="${step.title}" loading="lazy" onerror="if(this.dataset.fb!=='1'){this.dataset.fb='1';this.src='${fallback}';}else{this.onerror=null;this.src='${finalFallback}';}">`;
}

function renderGuideModal() {
  const copy = getGuideCopy();
  const t = L[curLang] || L.en;
  const el = document.getElementById('guideContent');
  if (!el) return;

  set('guideMT', t.sGuide || copy.title);

  el.innerHTML = `
    <div class="guide-hero">
      <div class="guide-badge">💴 Salary Tracker</div>
      <h3>${copy.title}</h3>
      <p>${copy.intro}</p>
      <div class="guide-hero-actions">
        ${jobs.length
          ? `<button class="btn btn--small guide-secondary-btn" onclick="guideJumpToAdd()">${t.navA || 'Add Work'}</button>`
          : `<button class="btn btn--accent btn--small" onclick="guideStartSetup()">${t.noJobsAction || 'Add first job'}</button>`
        }
        <button class="btn btn--small guide-secondary-btn" onclick="guideJumpToPage('report')">${t.navR || 'Report'}</button>
      </div>
    </div>
    ${copy.steps.map((step, index) => `
      <section class="guide-step">
        <div class="guide-step-head">
          <div class="guide-step-no">${String(index + 1).padStart(2, '0')}</div>
          <div>
            <h4>${step.title}</h4>
            <p>${step.body}</p>
            ${Array.isArray(step.details) && step.details.length ? `
              <ul class="guide-detail-list">
                ${step.details.map(item => `<li>${item}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>
        <div class="guide-visual-wrap">
          ${renderGuideVisual(step)}
        </div>
      </section>
    `).join('')}
    <section class="guide-tips">
      <h4>${copy.tipsTitle}</h4>
      <div class="guide-tip-list">
        ${copy.tips.map(tip => `<div class="guide-tip-item">${tip}</div>`).join('')}
      </div>
    </section>
  `;
}

function openGuideModal() {
  renderGuideModal();
  document.getElementById('moGuide').classList.add('show');
}

function closeGuideModal() {
  document.getElementById('moGuide').classList.remove('show');
}

function guideStartSetup() {
  closeGuideModal();
  goPage('settings');
  openAddJob();
}

function guideJumpToAdd() {
  closeGuideModal();
  calViewMode = 'list';
  save();
  goPage('add');
}

function guideJumpToPage(page) {
  closeGuideModal();
  goPage(page);
}
