/* =========================================================================
   Guide — in-app multilingual usage guide with screenshots
   ========================================================================= */

const GUIDE_VISUAL_KEYS = ['home', 'add', 'report', 'settings'];

function getGuideVisualPath(key) {
  const lang = GUIDE_COPY[curLang] ? curLang : 'en';
  if (GUIDE_VISUAL_KEYS.includes(key)) {
    return `img/guide/${lang}/${key}.webp`;
  }
  return null;
}

const GUIDE_COPY = {
  vi: {
    title: 'Hướng dẫn sử dụng Salary Tracker',
    intro: 'Bắt đầu bằng cách tạo nơi làm việc đầu tiên, sau đó thêm ca, xem danh sách theo tháng và theo dõi báo cáo ngay trong app.',
    tipsTitle: 'Mẹo nhanh',
    tips: [
      'Dữ liệu được lưu trên chính thiết bị của bạn.',
      'Tạo ít nhất 1 nơi làm việc trước khi thêm ca làm.',
      'Ở chế độ danh sách, vuốt ngang để lùi hoặc tiến tháng.'
    ],
    steps: [
      {
        visual: 'home',
        title: 'Làm quen với màn hình chính',
        body: 'Trang chủ hiển thị thu nhập hôm nay, tổng tuần, tổng tháng và các ca gần đây. Khi mới cài app, các chỉ số sẽ để trống cho đến khi bạn tạo nơi làm việc và lưu ca đầu tiên.'
      },
      {
        visual: 'settings',
        title: 'Tạo nơi làm việc đầu tiên',
        body: 'Vào Cài đặt, chọn Thêm công việc mới. Nhập tên nơi làm, chọn kiểu lương theo giờ, ngày hoặc tháng, sau đó cấu hình mức lương, OT, phụ cấp, biểu tượng và màu.'
      },
      {
        visual: 'add',
        title: 'Thêm ca làm',
        body: 'Mở tab Thêm công việc rồi chạm vào một ngày trên lịch hoặc nút thêm ở cuối danh sách. Với ca theo giờ, bạn nhập ngày, giờ bắt đầu, giờ kết thúc và thời gian nghỉ. App sẽ tự tính tiền trước khi lưu.'
      },
      {
        visual: 'timeline',
        title: 'Dùng chế độ danh sách theo tháng',
        body: 'Ở chế độ danh sách, mỗi ngày hiện thành một timeline dọc. Chạm vào cột ngày để thêm ca cho ngày đó, chạm vào một ca để sửa, và vuốt ngang trái hoặc phải để đổi sang tháng trước hoặc tháng sau.'
      },
      {
        visual: 'report',
        title: 'Xem báo cáo và quản lý dữ liệu',
        body: 'Tab Báo cáo cho phép xem theo tuần, tháng, quý và năm, đồng thời lọc theo nơi làm việc. Trong Cài đặt bạn cũng có thể xuất CSV hoặc PDF, quản lý nhiều người dùng, mở hỗ trợ và chính sách bảo mật.'
      }
    ]
  },
  en: {
    title: 'How to use Salary Tracker',
    intro: 'Start by creating your first workplace, then add shifts, review the monthly list, and track reports directly inside the app.',
    tipsTitle: 'Quick tips',
    tips: [
      'Your data is stored locally on your device.',
      'Create at least one workplace before adding shifts.',
      'In list mode, swipe left or right to change months.'
    ],
    steps: [
      {
        visual: 'home',
        title: 'Get familiar with the home screen',
        body: 'Home shows today’s income, this week, this month, and your recent shifts. On a fresh install these sections stay empty until you create a workplace and save your first shift.'
      },
      {
        visual: 'settings',
        title: 'Create your first workplace',
        body: 'Open Settings and tap Add New Job. Enter the workplace name, choose hourly, daily, or monthly pay, then configure wage rate, overtime rules, allowances, icon, and color.'
      },
      {
        visual: 'add',
        title: 'Add a shift',
        body: 'Open the Add Work tab and tap a day in the calendar or the add button at the end of the list. For hourly shifts, enter date, start time, end time, and break minutes. The app calculates the estimated pay before saving.'
      },
      {
        visual: 'timeline',
        title: 'Use the monthly list view',
        body: 'In list view, each day is shown as a vertical timeline. Tap the date rail to add a shift for that day, tap an existing shift to edit it, and swipe left or right to move to the previous or next month.'
      },
      {
        visual: 'report',
        title: 'Read reports and manage data',
        body: 'The Report tab shows week, month, quarter, and year summaries, with filters for each workplace. In Settings you can also export CSV or PDF, manage users, open support, and review the privacy policy.'
      }
    ]
  },
  ja: {
    title: 'Salary Tracker の使い方',
    intro: 'まず勤務先を作成し、その後でシフト追加、月別リスト確認、レポート確認をアプリ内で行えます。',
    tipsTitle: 'クイックヒント',
    tips: [
      'データは端末内に保存されます。',
      'シフトを追加する前に勤務先を1件以上作成してください。',
      'リスト表示では左右スワイプで月を切り替えます。'
    ],
    steps: [
      {
        visual: 'home',
        title: 'ホーム画面を確認する',
        body: 'ホームでは本日の収入、今週、今月、最近の勤務を確認できます。初回インストール直後は、勤務先と最初のシフトを登録するまで表示は空のままです。'
      },
      {
        visual: 'settings',
        title: '最初の勤務先を作成する',
        body: '設定から「勤務先を追加」を開きます。勤務先名を入力し、時給・日給・月給を選んで、給与額、残業設定、手当、アイコン、色を登録します。'
      },
      {
        visual: 'add',
        title: 'シフトを追加する',
        body: '「勤務追加」タブを開き、カレンダーの日付またはリスト下部の追加ボタンをタップします。時給勤務では日付、開始、終了、休憩を入力すると保存前に見込み収入が自動計算されます。'
      },
      {
        visual: 'timeline',
        title: '月別リスト表示を使う',
        body: 'リスト表示では1日ごとに縦のタイムラインでシフトを確認できます。日付列をタップするとその日にシフト追加、既存シフトをタップすると編集、左右スワイプで前月・翌月へ移動します。'
      },
      {
        visual: 'report',
        title: 'レポートとデータ管理',
        body: 'レポート画面では週・月・四半期・年ごとの集計を勤務先ごとに確認できます。設定では CSV/PDF 出力、ユーザー管理、サポート、プライバシーポリシーの確認も可能です。'
      }
    ]
  },
  zh: {
    title: 'Salary Tracker 使用指南',
    intro: '先创建第一份工作，然后再添加班次、查看月度列表，并在应用内追踪报表。',
    tipsTitle: '快速提示',
    tips: [
      '数据仅保存在你的设备本地。',
      '添加班次前请先创建至少一个工作。',
      '列表模式下左右滑动即可切换月份。'
    ],
    steps: [
      {
        visual: 'home',
        title: '先了解首页',
        body: '首页会显示今日收入、本周、本月和最近班次。首次安装时，这些区域会保持为空，直到你创建工作并保存第一条班次记录。'
      },
      {
        visual: 'settings',
        title: '创建第一份工作',
        body: '进入设置，点击添加工作。输入工作名称，选择时薪、日薪或月薪，然后设置工资、加班规则、补贴、图标和颜色。'
      },
      {
        visual: 'add',
        title: '添加班次',
        body: '打开添加工作页面，点击日历中的某一天，或列表底部的添加按钮。对于时薪班次，输入日期、开始时间、结束时间和休息分钟，应用会在保存前自动计算预计收入。'
      },
      {
        visual: 'timeline',
        title: '使用按月列表模式',
        body: '列表模式会把每天显示为纵向时间线。点击日期栏可为当天添加班次，点击已有班次可编辑，左右滑动可切换到上个月或下个月。'
      },
      {
        visual: 'report',
        title: '查看报表与管理数据',
        body: '报表页支持按周、月、季度、年查看，并可按工作筛选。设置页还可以导出 CSV/PDF、管理用户、打开支持页面以及查看隐私政策。'
      }
    ]
  },
  th: {
    title: 'วิธีใช้ Salary Tracker',
    intro: 'เริ่มจากสร้างที่ทำงานแรกของคุณ แล้วค่อยเพิ่มกะ ดูรายการรายเดือน และติดตามรายงานได้ในแอปเดียว',
    tipsTitle: 'เคล็ดลับด่วน',
    tips: [
      'ข้อมูลถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น',
      'ควรสร้างที่ทำงานอย่างน้อย 1 แห่งก่อนเพิ่มกะ',
      'ในโหมดรายการ ให้ปัดซ้ายหรือขวาเพื่อเปลี่ยนเดือน'
    ],
    steps: [
      {
        visual: 'home',
        title: 'ทำความรู้จักหน้าหลัก',
        body: 'หน้าหลักจะแสดงรายได้วันนี้ สัปดาห์นี้ เดือนนี้ และกะล่าสุดของคุณ เมื่อติดตั้งใหม่ หน้านี้จะยังว่างจนกว่าคุณจะสร้างที่ทำงานและบันทึกกะแรก'
      },
      {
        visual: 'settings',
        title: 'สร้างที่ทำงานแรก',
        body: 'ไปที่การตั้งค่าแล้วกดเพิ่มงานใหม่ ใส่ชื่อที่ทำงาน เลือกค่าจ้างรายชั่วโมง รายวัน หรือรายเดือน จากนั้นตั้งค่าอัตราค่าจ้าง OT เบี้ยเลี้ยง ไอคอน และสี'
      },
      {
        visual: 'add',
        title: 'เพิ่มกะทำงาน',
        body: 'เปิดแท็บเพิ่มงาน แล้วแตะวันที่ในปฏิทินหรือปุ่มเพิ่มด้านล่างของรายการ สำหรับกะแบบรายชั่วโมง ให้กรอกวันที่ เวลาเริ่ม เวลาสิ้นสุด และเวลาพัก แอปจะคำนวณรายได้ให้ก่อนบันทึก'
      },
      {
        visual: 'timeline',
        title: 'ใช้โหมดรายการรายเดือน',
        body: 'ในโหมดรายการ แต่ละวันจะแสดงเป็นไทม์ไลน์แนวตั้ง แตะคอลัมน์วันที่เพื่อเพิ่มกะของวันนั้น แตะกะเดิมเพื่อแก้ไข และปัดซ้ายหรือขวาเพื่อเปลี่ยนเดือนไปก่อนหน้าหรือถัดไป'
      },
      {
        visual: 'report',
        title: 'ดูรายงานและจัดการข้อมูล',
        body: 'แท็บรายงานจะแสดงข้อมูลตามสัปดาห์ เดือน ไตรมาส และปี พร้อมตัวกรองตามที่ทำงาน ในการตั้งค่าคุณยังส่งออก CSV/PDF จัดการผู้ใช้ เปิดหน้าช่วยเหลือ และดูนโยบายความเป็นส่วนตัวได้'
      }
    ]
  },
  pt: {
    title: 'Como usar o Salary Tracker',
    intro: 'Comece criando seu primeiro local de trabalho, depois adicione turnos, veja a lista mensal e acompanhe os relatórios dentro do app.',
    tipsTitle: 'Dicas rápidas',
    tips: [
      'Os dados ficam salvos localmente no seu aparelho.',
      'Crie pelo menos um emprego antes de adicionar turnos.',
      'No modo lista, deslize para a esquerda ou direita para trocar o mês.'
    ],
    steps: [
      {
        visual: 'home',
        title: 'Entenda a tela inicial',
        body: 'A página inicial mostra renda de hoje, da semana, do mês e os turnos recentes. Em uma instalação nova, essas áreas ficam vazias até você criar um emprego e salvar o primeiro turno.'
      },
      {
        visual: 'settings',
        title: 'Crie o primeiro emprego',
        body: 'Abra Configurações e toque em adicionar emprego. Informe o nome do local, escolha pagamento por hora, por dia ou por mês e configure salário, regras de hora extra, benefícios, ícone e cor.'
      },
      {
        visual: 'add',
        title: 'Adicione um turno',
        body: 'Abra a aba de adicionar trabalho e toque em um dia no calendário ou no botão de adicionar no fim da lista. Para turnos por hora, informe data, início, fim e pausa. O app calcula o valor estimado antes de salvar.'
      },
      {
        visual: 'timeline',
        title: 'Use a lista mensal',
        body: 'No modo lista, cada dia aparece como uma linha do tempo vertical. Toque na coluna da data para adicionar turno naquele dia, toque em um turno existente para editar e deslize para os lados para mudar de mês.'
      },
      {
        visual: 'report',
        title: 'Veja relatórios e cuide dos dados',
        body: 'A aba Relatório mostra resumos por semana, mês, trimestre e ano, com filtro por emprego. Em Configurações você também pode exportar CSV/PDF, gerenciar usuários, abrir o suporte e revisar a política de privacidade.'
      }
    ]
  },
  ru: {
    title: 'Как пользоваться Salary Tracker',
    intro: 'Сначала создайте первое место работы, затем добавляйте смены, просматривайте список за месяц и следите за отчётами прямо в приложении.',
    tipsTitle: 'Быстрые советы',
    tips: [
      'Данные хранятся локально на вашем устройстве.',
      'Перед добавлением смен создайте хотя бы одну работу.',
      'В режиме списка листайте влево или вправо для смены месяца.'
    ],
    steps: [
      {
        visual: 'home',
        title: 'Освойте главный экран',
        body: 'На главной странице показываются доход за сегодня, за неделю, за месяц и последние смены. После новой установки эти блоки будут пустыми, пока вы не создадите работу и не сохраните первую смену.'
      },
      {
        visual: 'settings',
        title: 'Создайте первую работу',
        body: 'Откройте настройки и нажмите добавить работу. Укажите название, выберите почасовую, дневную или месячную оплату, затем настройте ставку, сверхурочные, надбавки, иконку и цвет.'
      },
      {
        visual: 'add',
        title: 'Добавьте смену',
        body: 'Откройте вкладку добавления работы и нажмите день в календаре или кнопку добавления внизу списка. Для почасовой смены введите дату, время начала, окончания и перерыв. Приложение заранее посчитает ожидаемый доход.'
      },
      {
        visual: 'timeline',
        title: 'Используйте список по месяцам',
        body: 'В режиме списка каждый день показан как вертикальная линия времени. Нажмите колонку даты, чтобы добавить смену на этот день, нажмите смену для редактирования и листайте влево или вправо для перехода между месяцами.'
      },
      {
        visual: 'report',
        title: 'Смотрите отчёты и управляйте данными',
        body: 'Во вкладке отчётов доступны сводки за неделю, месяц, квартал и год, а также фильтр по месту работы. В настройках можно экспортировать CSV/PDF, управлять пользователями, открыть поддержку и политику конфиденциальности.'
      }
    ]
  },
  ko: {
    title: 'Salary Tracker 사용 가이드',
    intro: '먼저 첫 직장을 만든 뒤 근무를 추가하고, 월별 리스트를 보며, 리포트를 앱 안에서 바로 확인할 수 있습니다.',
    tipsTitle: '빠른 팁',
    tips: [
      '데이터는 기기 안에만 저장됩니다.',
      '근무를 추가하기 전에 직장을 최소 1개 만들어 주세요.',
      '리스트 모드에서는 좌우로 밀어 월을 변경할 수 있습니다.'
    ],
    steps: [
      {
        visual: 'home',
        title: '홈 화면 익히기',
        body: '홈에서는 오늘 수입, 이번 주, 이번 달, 최근 근무를 볼 수 있습니다. 새로 설치한 직후에는 직장을 만들고 첫 근무를 저장하기 전까지 이 영역이 비어 있습니다.'
      },
      {
        visual: 'settings',
        title: '첫 직장 만들기',
        body: '설정에서 직장 추가를 누르세요. 직장 이름을 입력하고 시급, 일급, 월급 중 하나를 고른 뒤 급여, OT 규칙, 수당, 아이콘, 색상을 설정합니다.'
      },
      {
        visual: 'add',
        title: '근무 추가하기',
        body: '근무 추가 탭에서 달력의 날짜나 리스트 아래 추가 버튼을 누르세요. 시급 근무는 날짜, 시작, 종료, 휴식 시간을 입력하면 저장 전에 예상 급여가 자동 계산됩니다.'
      },
      {
        visual: 'timeline',
        title: '월별 리스트 보기 사용하기',
        body: '리스트 모드에서는 각 날짜가 세로 타임라인으로 표시됩니다. 날짜 칸을 누르면 그날 근무를 추가할 수 있고, 기존 근무를 누르면 수정할 수 있으며, 좌우 스와이프로 이전 달과 다음 달로 이동합니다.'
      },
      {
        visual: 'report',
        title: '리포트와 데이터 관리',
        body: '리포트 탭에서는 주간, 월간, 분기, 연간 요약과 직장별 필터를 확인할 수 있습니다. 설정에서는 CSV/PDF 내보내기, 사용자 관리, 지원 페이지, 개인정보 처리방침도 열 수 있습니다.'
      }
    ]
  },
  hi: {
    title: 'Salary Tracker उपयोग गाइड',
    intro: 'पहले अपना पहला कार्यस्थल बनाइए, फिर शिफ्ट जोड़िए, मासिक सूची देखिए और रिपोर्ट सीधे ऐप के अंदर ट्रैक कीजिए।',
    tipsTitle: 'त्वरित सुझाव',
    tips: [
      'आपका डेटा आपके डिवाइस पर ही सुरक्षित रहता है।',
      'शिफ्ट जोड़ने से पहले कम से कम एक कार्यस्थल बनाइए।',
      'सूची मोड में महीना बदलने के लिए बाएँ या दाएँ स्वाइप करें।'
    ],
    steps: [
      {
        visual: 'home',
        title: 'होम स्क्रीन समझें',
        body: 'होम स्क्रीन आज की आय, इस सप्ताह, इस महीने और हाल की शिफ्ट दिखाती है। नई इंस्टॉल पर ये हिस्से तब तक खाली रहते हैं जब तक आप कार्यस्थल बनाकर पहली शिफ्ट सेव नहीं करते।'
      },
      {
        visual: 'settings',
        title: 'पहला कार्यस्थल बनाएं',
        body: 'सेटिंग में जाएँ और नया कार्यस्थल जोड़ें। नाम दर्ज करें, प्रति घंटा, प्रतिदिन या मासिक वेतन चुनें, फिर वेतन, OT नियम, भत्ते, आइकन और रंग सेट करें।'
      },
      {
        visual: 'add',
        title: 'शिफ्ट जोड़ें',
        body: 'काम जोड़ें टैब खोलें और कैलेंडर में किसी तारीख या सूची के नीचे दिए गए जोड़ें बटन पर टैप करें। घंटे वाले काम के लिए तारीख, शुरू, समाप्ति और ब्रेक भरें। ऐप सेव करने से पहले अनुमानित आय दिखाता है।'
      },
      {
        visual: 'timeline',
        title: 'मासिक सूची मोड का उपयोग करें',
        body: 'सूची मोड में हर दिन एक vertical timeline के रूप में दिखता है। तारीख कॉलम पर टैप करके उस दिन की शिफ्ट जोड़ें, किसी मौजूदा शिफ्ट पर टैप करके उसे संपादित करें, और महीना बदलने के लिए बाएँ या दाएँ स्वाइप करें।'
      },
      {
        visual: 'report',
        title: 'रिपोर्ट और डेटा प्रबंधन',
        body: 'रिपोर्ट टैब में सप्ताह, महीना, तिमाही और साल के सारांश मिलते हैं, साथ ही कार्यस्थल के अनुसार फ़िल्टर भी। सेटिंग में CSV/PDF एक्सपोर्ट, उपयोगकर्ता प्रबंधन, सहायता और privacy policy भी उपलब्ध है।'
      }
    ]
  }
};

function getGuideCopy() {
  return GUIDE_COPY[curLang] || GUIDE_COPY.en;
}

function renderGuideVisual(step) {
  const t = L[curLang] || L.en;
  if (step.visual === 'timeline') {
    return `<div class="guide-timeline-preview" aria-hidden="true">
      <div class="guide-timeline-preview-date">
        <div class="dd">18</div>
        <div class="dw">${(t.days && t.days[5]) || 'Fri'}</div>
        <div class="dot"></div>
      </div>
      <div class="guide-timeline-preview-track">
        <div class="guide-timeline-preview-row">
          <div class="guide-timeline-preview-time">09:00<span>18:00</span></div>
          <div class="guide-timeline-preview-bar"></div>
          <div class="guide-timeline-preview-main">
            <strong>🍜 ${t.lbl_job || 'Job'}</strong>
            <span>8h · ${t.tabM || 'Month'}</span>
          </div>
        </div>
        <div class="guide-timeline-preview-row is-light">
          <div class="guide-timeline-preview-time">${t.edit || 'Edit'}</div>
          <div class="guide-timeline-preview-bar"></div>
          <div class="guide-timeline-preview-main">
            <strong>${t.cal_newShift || 'Add shift'}</strong>
            <span>${t.cal_editShift || 'Edit shift'}</span>
          </div>
        </div>
      </div>
    </div>`;
  }

  const src = getGuideVisualPath(step.visual);
  return `<img class="guide-shot" src="${src}" alt="${step.title}" loading="lazy" onerror="this.onerror=null;this.src='img/guide/en/${step.visual}.webp';">`;
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
