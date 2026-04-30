/* =========================================================================
   Japan Take-home Plus — state hook, setup UI, result rendering
   ========================================================================= */

const JP_PAYROLL_DEFAULTS = {
  monthlyGross: 260000,
  previousAnnualGross: 3000000,
  age: 30,
  workStyle: 'haken',
  insuranceMode: 'shakai',
  prefecture: 'tokyo',
  standardMode: 'auto',
  manualStandardMonthly: 260000,
  customHealthRateEnabled: false,
  customHealthRate: '',
  employmentCategory: 'general',
  withholdingType: 'ko',
  domesticDependents: 0,
  overseasDependents: 0,
  overseasQualified: false,
  residentTaxMode: 'hybrid',
  residentTaxManualMonthly: 0,
  includeNationalPension: true,
  nationalHealthInsuranceMonthly: 0,
  manualSocialInsuranceMonthly: 0,
  disclaimerAccepted: false
};

const JP_PAYROLL_COPY = {
  vi: {
    title: 'Japan Take-home Plus',
    subtitle: 'Ước tính Nenkin / Shakai hoken / thuế Nhật',
    statusLocked: 'Chưa mở khoá Pro',
    statusPreview: 'Xem thử local',
    pro: 'Pro',
    setup: 'Thiết lập',
    result: 'Kết quả ước tính',
    save: 'Lưu thiết lập',
    useMonth: 'Dùng thu nhập tháng này',
    paywallTitle: 'Mở khoá Japan Take-home Plus',
    paywallBody: 'Mở khoá toàn bộ tính toán take-home, Nenkin, Shakai hoken và phân tích thuế chi tiết theo quy tắc 2026.',
    monthly: '$0.99 / tháng',
    lifetime: '$9.99 vĩnh viễn',
    restore: 'Khôi phục mua hàng',
    disclaimer: 'Kết quả là ước tính, không thay thế phiếu lương chính thức, công ty trả lương, 税務署 hoặc tư vấn chuyên nghiệp.',
    open: 'Japan Take-home Plus',
    openSub: 'Pro estimate cho Nhật',
    net: 'Thực nhận',
    gross: 'Tổng thu nhập',
    deducted: 'Khấu trừ',
    explain: 'Giải thích',
    warnings: 'Cảnh báo',
    ok: 'Không có cảnh báo lớn',
    acceptDisclaimer: 'Vui lòng đồng ý disclaimer trước khi lưu.',
    purchaseUnavailable: 'Cửa hàng tạm thời chưa sẵn sàng. Vui lòng thử lại sau ít phút.',
    restoreUnavailable: 'Khôi phục tạm thời chưa sẵn sàng. Vui lòng thử lại sau.',
    labels: {
      workStyle: 'Kiểu làm việc', monthlyGross: 'Tổng thu nhập tháng', previousAnnualGross: 'Thu nhập năm trước',
      age: 'Tuổi', insurance: 'Bảo hiểm', employment: 'Bảo hiểm thất nghiệp', withholding: 'Thuế khấu trừ',
      residentTax: 'Thuế cư trú', prefecture: 'Tỉnh / Kyokai Kenpo', standardMode: 'Lương tiêu chuẩn (標準報酬月額)',
      manualStandard: 'Nhập lương tiêu chuẩn', customHealthRate: 'Tỷ lệ bảo hiểm riêng %',
      customHealthEnabled: 'Dùng tỷ lệ bảo hiểm riêng', includeNationalPension: 'Tính quốc dân niên kim',
      nhiMonthly: 'Quốc dân bảo hiểm y tế / tháng', manualSocial: 'Bảo hiểm xã hội nhập tay / tháng',
      domesticDependents: 'Người phụ thuộc tại Nhật', overseasDependents: 'Người phụ thuộc ngoài Nhật',
      residentManualMonthly: '住民税 theo thông báo / tháng', overseasQualified: 'Đủ giấy tờ/chuyển tiền cho người phụ thuộc ngoài Nhật'
    },
    options: {
      workBaito: 'Baito / Arubaito / Part-time', workHaken: 'Haken / phái cử', workEmployee: 'Nhân viên công ty', workFreelancer: 'Freelancer / cá nhân',
      shakai: 'Bảo hiểm xã hội (社会保険)', kokumin: 'Quốc dân bảo hiểm / niên kim', manual: 'Nhập tay', employmentGeneral: 'Ngành thường 0.5%',
      employmentSpecial: 'Nông/lâm/thủy sản/sake/xây dựng 0.6%', none: 'Không tham gia', ko: 'Ước tính bảng 甲欄',
      otsu: 'Ước tính nhanh bảng 乙欄', off: 'Tắt', residentManual: 'Nhập theo thông báo', residentAuto: 'Ước tính tự động',
      residentHybrid: 'Kết hợp', standardAuto: 'Ước tính tự động', standardManual: 'Nhập từ phiếu lương'
    },
    details: {
      health: 'Bảo hiểm y tế (健康保険)', child: 'Khoản hỗ trợ trẻ em', pension: 'Nenkin công ty (厚生年金)', nationalPension: 'Quốc dân niên kim',
      nhi: 'Quốc dân bảo hiểm y tế', manualSocial: 'Bảo hiểm xã hội nhập tay', employment: 'Bảo hiểm thất nghiệp (雇用保険)',
      incomeTax: 'Thuế thu nhập khấu trừ', residentTax: 'Thuế cư trú'
    },
    trace: {
      rules: 'Bảng dữ liệu', dependents: 'Người phụ thuộc được tính', resident: 'Thuế cư trú',
      kyokai: 'Tỷ lệ Kyokai Kenpo', healthGrade: 'Bậc bảo hiểm y tế', pensionGrade: 'Bậc nenkin công ty',
      nationalPension: 'Quốc dân niên kim FY2026', nhiManual: '国保 nhập tay',
      manualSocial: 'Bảo hiểm xã hội nhập tay', incomeKo: 'Thuế thu nhập đang dùng ước tính theo năm; bản production sẽ thay bằng bảng NTA theo tháng.',
      incomeOtsu: '乙欄 ước tính nhanh: 3.063% sau bảo hiểm xã hội.', incomeNone: 'Không tính khấu trừ thuế thu nhập.'
    },
    warn: {
      overseas: 'Người phụ thuộc ngoài Nhật chưa được tính nếu chưa đánh dấu đủ điều kiện giấy tờ/chuyển tiền NTA.',
      residentAuto: 'Thuế cư trú tự động chỉ là ước tính; nhập theo thông báo của địa phương sẽ chính xác hơn.',
      incomeKo: 'Thuế thu nhập hiện là ước tính theo năm, chưa phải bảng NTA chính thức theo tháng.',
      freelancer: 'Freelancer mode không thay thế khai thuế/kakutei shinkoku.',
      healthAge: 'Từ 75 tuổi thường chuyển sang hệ bảo hiểm y tế khác.',
      pensionAge: 'Từ 70 tuổi thường không đóng厚生年金.'
    }
  },
  en: {
    title: 'Japan Take-home Plus',
    subtitle: 'Estimate pension, social insurance, and Japan tax',
    statusLocked: 'Pro not unlocked',
    statusPreview: 'Local preview',
    pro: 'Pro',
    setup: 'Setup',
    result: 'Estimate result',
    save: 'Save setup',
    useMonth: 'Use this month income',
    paywallTitle: 'Unlock Japan Take-home Plus',
    paywallBody: 'Unlock the full take-home calculation with Nenkin, Shakai hoken, and detailed tax breakdowns based on 2026 rules.',
    monthly: '$0.99 / month',
    lifetime: '$9.99 lifetime',
    restore: 'Restore purchases',
    disclaimer: 'Results are estimates and do not replace official payslips, employer payroll, tax office guidance, or professional advice.',
    open: 'Japan Take-home Plus',
    openSub: 'Pro Japan estimate',
    net: 'Take-home',
    gross: 'Gross',
    deducted: 'Deductions',
    explain: 'Explanation',
    warnings: 'Warnings',
    ok: 'No major warnings',
    acceptDisclaimer: 'Please accept the estimate disclaimer first.',
    purchaseUnavailable: 'The store is not ready yet. Please try again in a moment.',
    restoreUnavailable: 'Restore is not ready yet. Please try again in a moment.',
    labels: {
      workStyle: 'Work style', monthlyGross: 'Monthly gross', previousAnnualGross: 'Previous annual gross',
      age: 'Age', insurance: 'Insurance', employment: 'Employment insurance', withholding: 'Withholding tax',
      residentTax: 'Resident tax', prefecture: 'Prefecture / Kyokai Kenpo', standardMode: 'Standard remuneration',
      manualStandard: 'Manual standard monthly', customHealthRate: 'Custom health rate %',
      customHealthEnabled: 'Use custom health insurance rate', includeNationalPension: 'Include national pension',
      nhiMonthly: 'National Health Insurance monthly', manualSocial: 'Manual social insurance monthly',
      domesticDependents: 'Domestic dependents', overseasDependents: 'Overseas dependents',
      residentManualMonthly: 'Resident tax notice monthly', overseasQualified: 'Overseas dependent documents/remittance ready'
    },
    options: {
      workBaito: 'Baito / Arubaito / Part-time', workHaken: 'Haken / dispatch', workEmployee: 'Employee', workFreelancer: 'Freelancer',
      shakai: 'Shakai hoken', kokumin: 'Kokumin', manual: 'Manual', employmentGeneral: 'General 0.5%',
      employmentSpecial: 'Agriculture/sake/construction 0.6%', none: 'Not enrolled', ko: 'Ko table estimate',
      otsu: 'Otsu rough', off: 'Off', residentManual: 'Manual notice', residentAuto: 'Auto estimate',
      residentHybrid: 'Hybrid', standardAuto: 'Auto estimate', standardManual: 'Manual from payslip'
    },
    details: {
      health: 'Health insurance', child: 'Child support levy', pension: 'Employee pension', nationalPension: 'National pension',
      nhi: 'National Health Insurance', manualSocial: 'Manual social insurance', employment: 'Employment insurance',
      incomeTax: 'Income tax estimate', residentTax: 'Resident tax'
    },
    trace: {
      rules: 'Rules', dependents: 'Dependents counted', resident: 'Resident tax',
      kyokai: 'Kyokai Kenpo rate', healthGrade: 'Health grade', pensionGrade: 'Pension grade',
      nationalPension: 'National pension FY2026', nhiManual: 'Manual NHI amount',
      manualSocial: 'Manual social insurance', incomeKo: 'Income tax uses an annualized estimate; production should use the official NTA monthly table.',
      incomeOtsu: 'Otsu rough estimate: 3.063% after social insurance.', incomeNone: 'Income tax withholding is disabled.'
    },
    warn: {
      overseas: 'Overseas dependents are not counted unless NTA document/remittance conditions are marked ready.',
      residentAuto: 'Resident tax auto mode is only an estimate; municipal notice/manual mode is more reliable.',
      incomeKo: 'Income tax currently uses annualized estimate, not the final NTA monthly table.',
      freelancer: 'Freelancer mode is not a final tax return calculator.',
      healthAge: 'Age 75+ normally uses a different medical insurance system.',
      pensionAge: 'Age 70+ normally does not pay employee pension premiums.'
    }
  },
  ja: {
    title: 'Japan Take-home Plus',
    subtitle: '年金・社会保険・税金の見込み計算',
    statusLocked: 'Pro未解除',
    statusPreview: 'ローカルプレビュー',
    pro: 'Pro',
    setup: '設定',
    result: '見込み結果',
    save: '設定を保存',
    useMonth: '今月の収入を使う',
    paywallTitle: 'Japan Take-home Plus を解除',
    paywallBody: '2026年ルールに基づく手取り計算と、年金、社会保険、税金の詳細な内訳をすべて利用できます。',
    monthly: '$0.99 / 月',
    lifetime: '$9.99 買い切り',
    restore: '購入を復元',
    disclaimer: '計算結果は見込みであり、正式な給与明細、勤務先の給与計算、税務署、専門家の助言に代わるものではありません。',
    open: 'Japan Take-home Plus',
    openSub: '日本の手取り見込み',
    net: '手取り',
    gross: '総支給',
    deducted: '控除',
    explain: '説明',
    warnings: '注意',
    ok: '大きな注意はありません',
    acceptDisclaimer: '見込み計算の注意事項に同意してください。',
    purchaseUnavailable: 'ストアの準備ができていません。しばらくしてからお試しください。',
    restoreUnavailable: '復元の準備ができていません。しばらくしてからお試しください。',
    labels: {
      workStyle: '働き方', monthlyGross: '月の総支給', previousAnnualGross: '前年の年収',
      age: '年齢', insurance: '保険区分', employment: '雇用保険', withholding: '源泉所得税',
      residentTax: '住民税', prefecture: '都道府県 / 協会けんぽ', standardMode: '標準報酬月額',
      manualStandard: '標準報酬月額を入力', customHealthRate: '任意の健康保険料率 %',
      customHealthEnabled: '任意の健康保険料率を使う', includeNationalPension: '国民年金を含める',
      nhiMonthly: '国民健康保険 / 月', manualSocial: '社会保険料を手入力 / 月',
      domesticDependents: '国内扶養親族', overseasDependents: '国外扶養親族',
      residentManualMonthly: '住民税通知額 / 月', overseasQualified: '国外扶養親族の書類・送金条件を満たす'
    },
    options: {
      workBaito: 'バイト / アルバイト / パート', workHaken: '派遣', workEmployee: '会社員', workFreelancer: 'フリーランス',
      shakai: '社会保険', kokumin: '国保・国民年金', manual: '手入力', employmentGeneral: '一般 0.5%',
      employmentSpecial: '農林水産・酒造・建設 0.6%', none: '未加入', ko: '甲欄 見込み',
      otsu: '乙欄 簡易', off: 'オフ', residentManual: '通知書を手入力', residentAuto: '自動見込み',
      residentHybrid: 'ハイブリッド', standardAuto: '自動見込み', standardManual: '給与明細から入力'
    },
    details: {
      health: '健康保険', child: '子ども・子育て支援金', pension: '厚生年金', nationalPension: '国民年金',
      nhi: '国民健康保険', manualSocial: '社会保険料（手入力）', employment: '雇用保険',
      incomeTax: '源泉所得税 見込み', residentTax: '住民税'
    },
    trace: {
      rules: '使用データ', dependents: '扶養人数', resident: '住民税',
      kyokai: '協会けんぽ料率', healthGrade: '健康保険等級', pensionGrade: '厚生年金等級',
      nationalPension: '国民年金 令和8年度', nhiManual: '国保手入力額',
      manualSocial: '社会保険料手入力', incomeKo: '所得税は年額ベースの見込みです。正式版では国税庁の月額表を使う予定です。',
      incomeOtsu: '乙欄簡易: 社会保険控除後の3.063%で見込み。', incomeNone: '源泉所得税は計算していません。'
    },
    warn: {
      overseas: '国外扶養親族は、国税庁の書類・送金条件を満たす場合のみ人数に含めます。',
      residentAuto: '住民税の自動計算は見込みです。通知書の金額を入力する方が正確です。',
      incomeKo: '所得税は現在、年額ベースの見込みであり、正式な月額表ではありません。',
      freelancer: 'フリーランスモードは確定申告の計算に代わるものではありません。',
      healthAge: '75歳以上は通常、別の医療保険制度になります。',
      pensionAge: '70歳以上は通常、厚生年金保険料を支払いません。'
    }
  },
  zh: {
    title: 'Japan Take-home Plus', subtitle: '估算日本年金、社会保险和税金', statusLocked: '尚未解锁 Pro', statusPreview: '本地预览', pro: 'Pro',
    setup: '设置', result: '估算结果', save: '保存设置', useMonth: '使用本月收入',
    paywallTitle: '解锁 Japan Take-home Plus', paywallBody: '解锁基于 2026 年规则的完整到手收入计算，包含 Nenkin、Shakai hoken 和详细税费明细。',
    monthly: '$0.99 / 月', lifetime: '$9.99 永久', restore: '恢复购买',
    disclaimer: '结果仅为估算，不能替代正式工资单、公司薪资计算、税务署或专业建议。',
    open: 'Japan Take-home Plus', openSub: '日本到手工资估算', net: '到手', gross: '总收入', deducted: '扣除', explain: '说明', warnings: '注意',
    ok: '没有重要警告', acceptDisclaimer: '请先同意估算免责声明。', purchaseUnavailable: '商店尚未就绪，请稍后再试。', restoreUnavailable: '恢复尚未就绪，请稍后再试。',
    labels: { workStyle:'工作类型', monthlyGross:'月总收入', previousAnnualGross:'上一年年收入', age:'年龄', insurance:'保险', employment:'雇用保险', withholding:'源泉所得税', residentTax:'住民税', prefecture:'都道府县 / 协会健保', standardMode:'标准报酬月额', manualStandard:'手动标准报酬月额', customHealthRate:'自定义健康保险率 %', customHealthEnabled:'使用自定义健康保险率', includeNationalPension:'包含国民年金', nhiMonthly:'国民健康保险/月', manualSocial:'手动社会保险/月', domesticDependents:'日本国内扶养亲属', overseasDependents:'海外扶养亲属', residentManualMonthly:'住民税通知额/月', overseasQualified:'海外扶养文件/汇款条件已满足' },
    options: { workBaito:'Baito / 打工 / 兼职', workHaken:'派遣', workEmployee:'公司员工', workFreelancer:'自由职业', shakai:'社会保险', kokumin:'国保/国民年金', manual:'手动', employmentGeneral:'一般 0.5%', employmentSpecial:'农业/酒造/建设 0.6%', none:'未加入', ko:'甲栏估算', otsu:'乙栏简易', off:'关闭', residentManual:'按通知书手动', residentAuto:'自动估算', residentHybrid:'混合', standardAuto:'自动估算', standardManual:'从工资单输入' },
    details: { health:'健康保险', child:'儿童育儿支援金', pension:'厚生年金', nationalPension:'国民年金', nhi:'国民健康保险', manualSocial:'手动社会保险', employment:'雇用保险', incomeTax:'源泉所得税估算', residentTax:'住民税' },
    trace: { rules:'数据版本', dependents:'计入扶养人数', resident:'住民税', kyokai:'协会健保费率', healthGrade:'健康保险等级', pensionGrade:'厚生年金等级', nationalPension:'国民年金 FY2026', nhiManual:'手动国保金额', manualSocial:'手动社会保险', incomeKo:'所得税使用年度化估算；正式版应使用国税厅月额表。', incomeOtsu:'乙栏简易：社会保险后3.063%。', incomeNone:'未计算源泉所得税。' },
    warn: { overseas:'海外扶养亲属只有在满足国税厅文件/汇款条件时才计入。', residentAuto:'住民税自动模式仅为估算，通知书手动输入更可靠。', incomeKo:'所得税目前是年度化估算，不是最终国税厅月额表。', freelancer:'自由职业模式不能替代最终报税。', healthAge:'75岁以上通常使用其他医疗保险制度。', pensionAge:'70岁以上通常不缴纳厚生年金。' }
  },
  th: {
    title:'Japan Take-home Plus', subtitle:'ประมาณการเงินบำนาญ ประกันสังคม และภาษีญี่ปุ่น', statusLocked:'ยังไม่ได้ปลดล็อก Pro', statusPreview:'พรีวิวในเครื่อง', pro:'Pro',
    setup:'ตั้งค่า', result:'ผลประมาณการ', save:'บันทึก', useMonth:'ใช้รายได้เดือนนี้',
    paywallTitle:'ปลดล็อก Japan Take-home Plus', paywallBody:'ปลดล็อกการคำนวณรายได้สุทธิแบบครบถ้วน พร้อม Nenkin, Shakai hoken และรายละเอียดภาษีตามกฎปี 2026',
    monthly:'$0.99 / เดือน', lifetime:'$9.99 ตลอดชีพ', restore:'กู้คืนการซื้อ',
    disclaimer:'ผลลัพธ์เป็นการประมาณการ ไม่แทนสลิปเงินเดือนจริง บริษัท สำนักงานภาษี หรือคำปรึกษามืออาชีพ',
    open:'Japan Take-home Plus', openSub:'ประมาณการรายได้สุทธิญี่ปุ่น', net:'รับสุทธิ', gross:'รายได้รวม', deducted:'หักทั้งหมด', explain:'คำอธิบาย', warnings:'คำเตือน',
    ok:'ไม่มีคำเตือนสำคัญ', acceptDisclaimer:'โปรดยอมรับข้อความปฏิเสธความรับผิดก่อนบันทึก', purchaseUnavailable:'ร้านค้ายังไม่พร้อม โปรดลองอีกครั้งในอีกสักครู่', restoreUnavailable:'การกู้คืนยังไม่พร้อม โปรดลองอีกครั้งในอีกสักครู่',
    labels:{ workStyle:'รูปแบบงาน', monthlyGross:'รายได้รวมต่อเดือน', previousAnnualGross:'รายได้ปีก่อน', age:'อายุ', insurance:'ประกัน', employment:'ประกันการจ้างงาน', withholding:'ภาษีหัก ณ ที่จ่าย', residentTax:'ภาษีถิ่นที่อยู่', prefecture:'จังหวัด / Kyokai Kenpo', standardMode:'ค่าตอบแทนมาตรฐาน', manualStandard:'กรอกค่าตอบแทนมาตรฐาน', customHealthRate:'อัตราประกันสุขภาพเอง %', customHealthEnabled:'ใช้อัตราประกันสุขภาพเอง', includeNationalPension:'รวมบำนาญแห่งชาติ', nhiMonthly:'ประกันสุขภาพแห่งชาติ/เดือน', manualSocial:'ประกันสังคมกรอกเอง/เดือน', domesticDependents:'ผู้พึ่งพาในญี่ปุ่น', overseasDependents:'ผู้พึ่งพาต่างประเทศ', residentManualMonthly:'ภาษีถิ่นที่อยู่ตามใบแจ้ง/เดือน', overseasQualified:'เอกสาร/โอนเงินผู้พึ่งพาต่างประเทศพร้อม' },
    options:{ workBaito:'Baito / Part-time', workHaken:'派遣 / Haken', workEmployee:'พนักงานบริษัท', workFreelancer:'ฟรีแลนซ์', shakai:'Shakai hoken', kokumin:'Kokumin', manual:'กรอกเอง', employmentGeneral:'ทั่วไป 0.5%', employmentSpecial:'เกษตร/สาเก/ก่อสร้าง 0.6%', none:'ไม่เข้าร่วม', ko:'甲欄 estimate', otsu:'乙欄 rough', off:'ปิด', residentManual:'กรอกตามใบแจ้ง', residentAuto:'ประมาณอัตโนมัติ', residentHybrid:'Hybrid', standardAuto:'ประมาณอัตโนมัติ', standardManual:'กรอกจากสลิป' },
    details:{ health:'ประกันสุขภาพ', child:'เงินสนับสนุนเด็ก', pension:'บำนาญพนักงาน', nationalPension:'บำนาญแห่งชาติ', nhi:'ประกันสุขภาพแห่งชาติ', manualSocial:'ประกันสังคมกรอกเอง', employment:'ประกันการจ้างงาน', incomeTax:'ประมาณภาษีรายได้', residentTax:'ภาษีถิ่นที่อยู่' },
    trace:{ rules:'ข้อมูลกฎ', dependents:'จำนวนผู้พึ่งพาที่นับ', resident:'ภาษีถิ่นที่อยู่', kyokai:'อัตรา Kyokai Kenpo', healthGrade:'ระดับประกันสุขภาพ', pensionGrade:'ระดับบำนาญ', nationalPension:'บำนาญแห่งชาติ FY2026', nhiManual:'国保 กรอกเอง', manualSocial:'ประกันสังคมกรอกเอง', incomeKo:'ภาษีรายได้ใช้การประมาณแบบรายปี รุ่นจริงควรใช้ตารางรายเดือนของ NTA', incomeOtsu:'乙欄 rough: 3.063% หลังหักประกันสังคม', incomeNone:'ไม่คำนวณภาษีหัก ณ ที่จ่าย' },
    warn:{ overseas:'ผู้พึ่งพาต่างประเทศจะไม่นับถ้ายังไม่ทำเครื่องหมายว่าเอกสาร/เงื่อนไขโอนเงินครบ', residentAuto:'ภาษีถิ่นที่อยู่อัตโนมัติเป็นเพียงประมาณการ กรอกตามใบแจ้งจะแม่นกว่า', incomeKo:'ภาษีรายได้ขณะนี้เป็นประมาณรายปี ไม่ใช่ตารางรายเดือน NTA สุดท้าย', freelancer:'โหมดฟรีแลนซ์ไม่แทนการยื่นภาษีจริง', healthAge:'อายุ 75+ มักใช้ระบบประกันสุขภาพอื่น', pensionAge:'อายุ 70+ มักไม่จ่าย厚生年金' }
  },
  pt: {
    title:'Japan Take-home Plus', subtitle:'Estimativa de pensão, seguro social e impostos no Japão', statusLocked:'Pro não desbloqueado', statusPreview:'Prévia local', pro:'Pro',
    setup:'Configuração', result:'Resultado estimado', save:'Salvar', useMonth:'Usar renda deste mês',
    paywallTitle:'Desbloquear Japan Take-home Plus', paywallBody:'Desbloqueie o cálculo completo de salário líquido com Nenkin, Shakai hoken e detalhamento fiscal pelas regras de 2026.',
    monthly:'$0.99 / mês', lifetime:'$9.99 vitalício', restore:'Restaurar compras',
    disclaimer:'Os resultados são estimativas e não substituem holerite oficial, folha da empresa, orientação fiscal ou aconselhamento profissional.',
    open:'Japan Take-home Plus', openSub:'Estimativa líquida no Japão', net:'Líquido', gross:'Bruto', deducted:'Descontos', explain:'Explicação', warnings:'Avisos',
    ok:'Sem avisos importantes', acceptDisclaimer:'Aceite o aviso de estimativa antes de salvar.', purchaseUnavailable:'A loja ainda não está pronta. Tente novamente em instantes.', restoreUnavailable:'A restauração ainda não está pronta. Tente novamente em instantes.',
    labels:{ workStyle:'Tipo de trabalho', monthlyGross:'Renda bruta mensal', previousAnnualGross:'Renda anual anterior', age:'Idade', insurance:'Seguro', employment:'Seguro-desemprego', withholding:'Imposto retido', residentTax:'Imposto residencial', prefecture:'Província / Kyokai Kenpo', standardMode:'Remuneração padrão', manualStandard:'Remuneração padrão manual', customHealthRate:'Taxa de saúde custom %', customHealthEnabled:'Usar taxa de saúde custom', includeNationalPension:'Incluir pensão nacional', nhiMonthly:'Seguro nacional de saúde/mês', manualSocial:'Seguro social manual/mês', domesticDependents:'Dependentes no Japão', overseasDependents:'Dependentes no exterior', residentManualMonthly:'Aviso de imposto residencial/mês', overseasQualified:'Documentos/remessa do dependente no exterior prontos' },
    options:{ workBaito:'Baito / Arubaito / Part-time', workHaken:'Haken / temporário', workEmployee:'Funcionário', workFreelancer:'Freelancer', shakai:'Shakai hoken', kokumin:'Kokumin', manual:'Manual', employmentGeneral:'Geral 0.5%', employmentSpecial:'Agricultura/saquê/construção 0.6%', none:'Não inscrito', ko:'Tabela ko estimada', otsu:'Otsu simples', off:'Desligado', residentManual:'Aviso manual', residentAuto:'Estimativa auto', residentHybrid:'Híbrido', standardAuto:'Estimativa auto', standardManual:'Manual do holerite' },
    details:{ health:'Seguro saúde', child:'Apoio à criança', pension:'Pensão de empregado', nationalPension:'Pensão nacional', nhi:'Seguro nacional de saúde', manualSocial:'Seguro social manual', employment:'Seguro emprego', incomeTax:'Imposto de renda estimado', residentTax:'Imposto residencial' },
    trace:{ rules:'Regras', dependents:'Dependentes contados', resident:'Imposto residencial', kyokai:'Taxa Kyokai Kenpo', healthGrade:'Grau saúde', pensionGrade:'Grau pensão', nationalPension:'Pensão nacional FY2026', nhiManual:'NHI manual', manualSocial:'Seguro social manual', incomeKo:'Imposto usa estimativa anual; produção deve usar tabela mensal oficial da NTA.', incomeOtsu:'Otsu simples: 3.063% após seguro social.', incomeNone:'Retenção de imposto desativada.' },
    warn:{ overseas:'Dependentes no exterior só contam se documentos/remessas NTA estiverem prontos.', residentAuto:'Imposto residencial automático é estimativa; aviso municipal manual é mais confiável.', incomeKo:'Imposto de renda atual é estimativa anual, não tabela mensal final da NTA.', freelancer:'Modo freelancer não é calculadora final de declaração.', healthAge:'75+ normalmente usa outro sistema médico.', pensionAge:'70+ normalmente não paga pensão de empregado.' }
  },
  ru: {
    title:'Japan Take-home Plus', subtitle:'Оценка пенсии, соцстраха и налогов Японии', statusLocked:'Pro не разблокирован', statusPreview:'Локальный просмотр', pro:'Pro',
    setup:'Настройка', result:'Оценка результата', save:'Сохранить', useMonth:'Использовать доход месяца',
    paywallTitle:'Разблокировать Japan Take-home Plus', paywallBody:'Разблокируйте полный расчёт зарплаты на руки с Nenkin, Shakai hoken и детальной разбивкой налогов по правилам 2026 года.',
    monthly:'$0.99 / мес', lifetime:'$9.99 навсегда', restore:'Восстановить покупки',
    disclaimer:'Результаты являются оценкой и не заменяют официальный расчетный лист, расчет работодателя, налоговую службу или профессиональную консультацию.',
    open:'Japan Take-home Plus', openSub:'Оценка чистого дохода в Японии', net:'На руки', gross:'Брутто', deducted:'Удержания', explain:'Пояснение', warnings:'Предупреждения',
    ok:'Серьезных предупреждений нет', acceptDisclaimer:'Сначала примите отказ от ответственности.', purchaseUnavailable:'Магазин пока не готов. Попробуйте ещё раз через минуту.', restoreUnavailable:'Восстановление пока не готово. Попробуйте ещё раз через минуту.',
    labels:{ workStyle:'Тип работы', monthlyGross:'Месячный доход брутто', previousAnnualGross:'Доход прошлого года', age:'Возраст', insurance:'Страхование', employment:'Страхование занятости', withholding:'Удерживаемый налог', residentTax:'Местный налог', prefecture:'Префектура / Kyokai Kenpo', standardMode:'Стандартное вознаграждение', manualStandard:'Стандарт вручную', customHealthRate:'Своя ставка здоровья %', customHealthEnabled:'Использовать свою ставку здоровья', includeNationalPension:'Включить национальную пенсию', nhiMonthly:'Нац. медстрах/мес', manualSocial:'Соцстрах вручную/мес', domesticDependents:'Иждивенцы в Японии', overseasDependents:'Иждивенцы за рубежом', residentManualMonthly:'Местный налог по уведомлению/мес', overseasQualified:'Документы/переводы по зарубежным иждивенцам готовы' },
    options:{ workBaito:'Baito / Arubaito / Part-time', workHaken:'Haken / временная работа', workEmployee:'Сотрудник', workFreelancer:'Фрилансер', shakai:'Shakai hoken', kokumin:'Kokumin', manual:'Вручную', employmentGeneral:'Обычная 0.5%', employmentSpecial:'С/х/сакэ/строительство 0.6%', none:'Не участвует', ko:'Оценка 甲欄', otsu:'Грубая 乙欄', off:'Выкл', residentManual:'Уведомление вручную', residentAuto:'Автооценка', residentHybrid:'Гибрид', standardAuto:'Автооценка', standardManual:'Из расчетного листа' },
    details:{ health:'Медстрах', child:'Детский сбор', pension:'Пенсия работника', nationalPension:'Национальная пенсия', nhi:'Нац. медстрах', manualSocial:'Соцстрах вручную', employment:'Страхование занятости', incomeTax:'Оценка подоходного налога', residentTax:'Местный налог' },
    trace:{ rules:'Правила', dependents:'Учтено иждивенцев', resident:'Местный налог', kyokai:'Ставка Kyokai Kenpo', healthGrade:'Класс медстраха', pensionGrade:'Класс пенсии', nationalPension:'Нац. пенсия FY2026', nhiManual:'NHI вручную', manualSocial:'Соцстрах вручную', incomeKo:'Налог рассчитан годовой оценкой; production должен использовать месячную таблицу NTA.', incomeOtsu:'乙欄 грубо: 3.063% после соцстраха.', incomeNone:'Удержание налога отключено.' },
    warn:{ overseas:'Зарубежные иждивенцы не учитываются без отметки документов/переводов NTA.', residentAuto:'Авто местный налог только оценка; уведомление муниципалитета надежнее.', incomeKo:'Подоходный налог сейчас годовая оценка, не финальная месячная таблица NTA.', freelancer:'Фриланс-режим не заменяет налоговую декларацию.', healthAge:'75+ обычно использует другую медстраховку.', pensionAge:'70+ обычно не платит пенсию работника.' }
  },
  ko: {
    title:'Japan Take-home Plus', subtitle:'일본 연금, 사회보험, 세금 예상', statusLocked:'Pro 잠금 해제 안 됨', statusPreview:'로컬 미리보기', pro:'Pro',
    setup:'설정', result:'예상 결과', save:'설정 저장', useMonth:'이번 달 수입 사용',
    paywallTitle:'Japan Take-home Plus 잠금 해제', paywallBody:'2026년 규칙 기반 실수령액 전체 계산과 Nenkin, Shakai hoken, 상세 세금 분석을 모두 사용하세요.',
    monthly:'월 $0.99', lifetime:'평생 $9.99', restore:'구매 복원',
    disclaimer:'결과는 예상치이며 공식 급여명세서, 회사 급여계산, 세무서 안내, 전문가 조언을 대체하지 않습니다.',
    open:'Japan Take-home Plus', openSub:'일본 실수령 예상', net:'실수령', gross:'총지급', deducted:'공제', explain:'설명', warnings:'주의',
    ok:'큰 경고 없음', acceptDisclaimer:'저장 전에 예상 계산 고지에 동의하세요.', purchaseUnavailable:'스토어가 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.', restoreUnavailable:'복원이 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.',
    labels:{ workStyle:'근무 형태', monthlyGross:'월 총수입', previousAnnualGross:'전년도 연수입', age:'나이', insurance:'보험', employment:'고용보험', withholding:'원천소득세', residentTax:'주민세', prefecture:'도도부현 / Kyokai Kenpo', standardMode:'표준보수월액', manualStandard:'표준보수월액 직접 입력', customHealthRate:'건강보험 사용자율 %', customHealthEnabled:'건강보험 사용자율 사용', includeNationalPension:'국민연금 포함', nhiMonthly:'국민건강보험/월', manualSocial:'사회보험 직접 입력/월', domesticDependents:'일본 내 부양가족', overseasDependents:'해외 부양가족', residentManualMonthly:'주민세 통지액/월', overseasQualified:'해외 부양가족 서류/송금 조건 충족' },
    options:{ workBaito:'바이토 / 아르바이트 / 파트타임', workHaken:'파견', workEmployee:'회사원', workFreelancer:'프리랜서', shakai:'사회보험', kokumin:'국민보험/국민연금', manual:'직접 입력', employmentGeneral:'일반 0.5%', employmentSpecial:'농림수산/주조/건설 0.6%', none:'미가입', ko:'甲欄 예상', otsu:'乙欄 간이', off:'끔', residentManual:'통지서 입력', residentAuto:'자동 예상', residentHybrid:'하이브리드', standardAuto:'자동 예상', standardManual:'급여명세서 입력' },
    details:{ health:'건강보험', child:'아동·육아지원금', pension:'후생연금', nationalPension:'국민연금', nhi:'국민건강보험', manualSocial:'사회보험 직접 입력', employment:'고용보험', incomeTax:'원천소득세 예상', residentTax:'주민세' },
    trace:{ rules:'규칙 데이터', dependents:'계산된 부양가족', resident:'주민세', kyokai:'Kyokai Kenpo 요율', healthGrade:'건강보험 등급', pensionGrade:'연금 등급', nationalPension:'국민연금 FY2026', nhiManual:'국민건강보험 직접 입력', manualSocial:'사회보험 직접 입력', incomeKo:'소득세는 연간화 예상치입니다. production에서는 NTA 월액표를 사용해야 합니다.', incomeOtsu:'乙欄 간이: 사회보험 후 3.063%.', incomeNone:'원천소득세 계산 안 함.' },
    warn:{ overseas:'해외 부양가족은 NTA 서류/송금 조건을 충족해야 계산됩니다.', residentAuto:'주민세 자동 모드는 예상치이며 통지서 직접 입력이 더 정확합니다.', incomeKo:'소득세는 현재 연간화 예상치이며 최종 NTA 월액표가 아닙니다.', freelancer:'프리랜서 모드는 최종 세금신고 계산기가 아닙니다.', healthAge:'75세 이상은 보통 다른 의료보험 제도입니다.', pensionAge:'70세 이상은 보통 후생연금을 내지 않습니다.' }
  },
  hi: {
    title:'Japan Take-home Plus', subtitle:'जापान पेंशन, सामाजिक बीमा और टैक्स अनुमान', statusLocked:'Pro अनलॉक नहीं', statusPreview:'लोकल प्रीव्यू', pro:'Pro',
    setup:'सेटअप', result:'अनुमान परिणाम', save:'सेटअप सेव करें', useMonth:'इस महीने की आय उपयोग करें',
    paywallTitle:'Japan Take-home Plus अनलॉक करें', paywallBody:'2026 नियमों पर आधारित पूर्ण टेक-होम गणना, Nenkin, Shakai hoken और विस्तृत कर विश्लेषण अनलॉक करें।',
    monthly:'$0.99 / माह', lifetime:'$9.99 आजीवन', restore:'खरीद बहाल करें',
    disclaimer:'परिणाम केवल अनुमान हैं और आधिकारिक वेतन पर्ची, कंपनी की वेतन गणना, टैक्स ऑफिस मार्गदर्शन या पेशेवर सलाह की जगह नहीं लेते।',
    open:'Japan Take-home Plus', openSub:'जापान नेट आय अनुमान', net:'नेट आय', gross:'कुल आय', deducted:'कटौती', explain:'व्याख्या', warnings:'चेतावनी',
    ok:'कोई बड़ी चेतावनी नहीं', acceptDisclaimer:'सेव करने से पहले अनुमान disclaimer स्वीकार करें।', purchaseUnavailable:'स्टोर अभी तैयार नहीं है। कुछ क्षण बाद पुनः प्रयास करें।', restoreUnavailable:'रिस्टोर अभी तैयार नहीं है। कुछ क्षण बाद पुनः प्रयास करें।',
    labels:{ workStyle:'काम का प्रकार', monthlyGross:'मासिक कुल आय', previousAnnualGross:'पिछले साल की वार्षिक आय', age:'उम्र', insurance:'बीमा', employment:'रोजगार बीमा', withholding:'स्रोत पर आयकर कटौती', residentTax:'निवास कर', prefecture:'प्रांत / Kyokai Kenpo', standardMode:'मानक मासिक वेतन', manualStandard:'मानक मासिक वेतन दर्ज करें', customHealthRate:'कस्टम स्वास्थ्य बीमा दर %', customHealthEnabled:'कस्टम स्वास्थ्य बीमा दर उपयोग करें', includeNationalPension:'राष्ट्रीय पेंशन शामिल करें', nhiMonthly:'राष्ट्रीय स्वास्थ्य बीमा / माह', manualSocial:'सामाजिक बीमा मैनुअल / माह', domesticDependents:'जापान में आश्रित', overseasDependents:'विदेश में आश्रित', residentManualMonthly:'निवास कर नोटिस / माह', overseasQualified:'विदेशी आश्रित के दस्तावेज/रेमिटेंस तैयार हैं' },
    options:{ workBaito:'बाइटो / अंशकालिक', workHaken:'हाकेन / डिस्पैच', workEmployee:'कर्मचारी', workFreelancer:'फ्रीलांसर', shakai:'शाकाई होकेन', kokumin:'कोकुमिन बीमा / पेंशन', manual:'मैनुअल', employmentGeneral:'सामान्य 0.5%', employmentSpecial:'कृषि/साके/निर्माण 0.6%', none:'शामिल नहीं', ko:'甲欄 अनुमान', otsu:'乙欄 त्वरित अनुमान', off:'बंद', residentManual:'नोटिस से मैनुअल', residentAuto:'स्वचालित अनुमान', residentHybrid:'हाइब्रिड', standardAuto:'स्वचालित अनुमान', standardManual:'वेतन पर्ची से दर्ज करें' },
    details:{ health:'स्वास्थ्य बीमा', child:'बाल सहायता शुल्क', pension:'कर्मचारी पेंशन', nationalPension:'राष्ट्रीय पेंशन', nhi:'राष्ट्रीय स्वास्थ्य बीमा', manualSocial:'सामाजिक बीमा मैनुअल', employment:'रोजगार बीमा', incomeTax:'आयकर अनुमान', residentTax:'निवास कर' },
    trace:{ rules:'नियम डेटा', dependents:'गिने गए आश्रित', resident:'निवास कर', kyokai:'Kyokai Kenpo दर', healthGrade:'स्वास्थ्य बीमा ग्रेड', pensionGrade:'पेंशन ग्रेड', nationalPension:'राष्ट्रीय पेंशन FY2026', nhiManual:'मैनुअल राष्ट्रीय स्वास्थ्य बीमा', manualSocial:'मैनुअल सामाजिक बीमा', incomeKo:'आयकर अभी वार्षिक अनुमान से निकाला गया है; अंतिम संस्करण में आधिकारिक NTA मासिक तालिका चाहिए।', incomeOtsu:'乙欄 त्वरित: सामाजिक बीमा के बाद 3.063%।', incomeNone:'स्रोत पर आयकर कटौती बंद है।' },
    warn:{ overseas:'विदेशी आश्रित तभी गिने जाएंगे जब NTA दस्तावेज/रेमिटेंस शर्तें पूरी हों।', residentAuto:'निवास कर का स्वचालित मोड केवल अनुमान है; नगरपालिका नोटिस से मैनुअल入力 अधिक भरोसेमंद है।', incomeKo:'आयकर अभी वार्षिक अनुमान है, अंतिम NTA मासिक तालिका नहीं।', freelancer:'फ्रीलांसर मोड अंतिम टैक्स रिटर्न गणना नहीं है।', healthAge:'75+ में आम तौर पर अलग स्वास्थ्य बीमा प्रणाली होती है।', pensionAge:'70+ में आम तौर पर कर्मचारी पेंशन प्रीमियम नहीं लगता।' }
  }
};

function jpCopy() {
  return JP_PAYROLL_COPY[curLang] || JP_PAYROLL_COPY.en;
}

function getJpPayrollProfile() {
  return { ...JP_PAYROLL_DEFAULTS, ...(jpPayrollProfile || {}) };
}

function saveJpPayrollProfile(profile) {
  jpPayrollProfile = { ...JP_PAYROLL_DEFAULTS, ...(profile || {}) };
  save();
  updateJpPayrollSettingsSummary();
}

function jpSetField(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.type === 'checkbox') el.checked = !!value;
  else el.value = value == null ? '' : value;
}

function jpReadField(id, fallback) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  return el.type === 'checkbox' ? el.checked : el.value;
}

function populateJpPayrollPrefectures() {
  const sel = document.getElementById('jp_prefecture');
  if (!sel || sel.dataset.ready) return;
  sel.innerHTML = JP_PAYROLL_RULES_2026.prefectures.map(pref =>
    `<option value="${pref.id}">${pref.name} / ${pref.en} - ${(pref.healthRate * 100).toFixed(2)}%</option>`
  ).join('');
  sel.dataset.ready = '1';
}

function readJpPayrollForm() {
  return {
    monthlyGross: jpReadField('jp_monthlyGross', 0),
    previousAnnualGross: jpReadField('jp_previousAnnualGross', 0),
    age: jpReadField('jp_age', 30),
    workStyle: jpReadField('jp_workStyle', 'haken'),
    insuranceMode: jpReadField('jp_insuranceMode', 'shakai'),
    prefecture: jpReadField('jp_prefecture', 'tokyo'),
    standardMode: jpReadField('jp_standardMode', 'auto'),
    manualStandardMonthly: jpReadField('jp_manualStandardMonthly', 0),
    customHealthRateEnabled: jpReadField('jp_customHealthRateEnabled', false),
    customHealthRate: jpReadField('jp_customHealthRate', ''),
    employmentCategory: jpReadField('jp_employmentCategory', 'general'),
    withholdingType: jpReadField('jp_withholdingType', 'ko'),
    domesticDependents: jpReadField('jp_domesticDependents', 0),
    overseasDependents: jpReadField('jp_overseasDependents', 0),
    overseasQualified: jpReadField('jp_overseasQualified', false),
    residentTaxMode: jpReadField('jp_residentTaxMode', 'hybrid'),
    residentTaxManualMonthly: jpReadField('jp_residentTaxManualMonthly', 0),
    includeNationalPension: jpReadField('jp_includeNationalPension', true),
    nationalHealthInsuranceMonthly: jpReadField('jp_nationalHealthInsuranceMonthly', 0),
    manualSocialInsuranceMonthly: jpReadField('jp_manualSocialInsuranceMonthly', 0),
    disclaimerAccepted: jpReadField('jp_disclaimerAccepted', false)
  };
}

function writeJpPayrollForm(profile) {
  const p = { ...JP_PAYROLL_DEFAULTS, ...(profile || {}) };
  Object.keys(p).forEach(key => jpSetField('jp_' + key, p[key]));
}

function syncJpPayrollVisibility() {
  const insuranceMode = jpReadField('jp_insuranceMode', 'shakai');
  const residentMode = jpReadField('jp_residentTaxMode', 'hybrid');
  const shakai = document.getElementById('jp_shakaiFields');
  const kokumin = document.getElementById('jp_kokuminFields');
  const manual = document.getElementById('jp_manualFields');
  const residentManual = document.getElementById('jp_residentManualWrap');
  if (shakai) shakai.style.display = insuranceMode === 'shakai' ? 'block' : 'none';
  if (kokumin) kokumin.style.display = insuranceMode === 'kokumin' ? 'block' : 'none';
  if (manual) manual.style.display = insuranceMode === 'manual' ? 'block' : 'none';
  if (residentManual) residentManual.style.display = (residentMode === 'manual' || residentMode === 'hybrid') ? 'block' : 'none';

  const paywallBlock = document.getElementById('jpPaywallBlock');
  if (paywallBlock) {
    paywallBlock.style.display = isJpTakehomeProActive() ? 'none' : '';
  }
}

function getCurrentMonthGrossForJpPayroll() {
  const now = new Date();
  const ym = localYm(now);
  const start = ym + '-01';
  const end = ym + '-' + pad2(daysInMonth(now.getFullYear(), now.getMonth() + 1));
  const shiftGross = shifts.filter(s => s.date >= start && s.date <= end).reduce((sum, s) => sum + getShiftPay(s), 0);
  return shiftGross + getMonthlyAllowanceForRange(start, end, null);
}

function fillJpPayrollGrossFromMonth() {
  jpSetField('jp_monthlyGross', getCurrentMonthGrossForJpPayroll());
  renderJpPayrollResult();
}

function jpResultRow(label, value, kind) {
  return `<div class="jp-result-row${kind ? ' ' + kind : ''}"><span>${label}</span><strong>${value}</strong></div>`;
}

function getJpLocalizedTrace(result, profile, t) {
  const rows = [];
  if (result.shakai && result.shakai.prefecture) {
    const pref = result.shakai.prefecture;
    const rate = profile.customHealthRateEnabled
      ? Number(profile.customHealthRate || 0) / 100
      : (result.shakai.isCareAge ? pref.healthCareRate : pref.healthRate);
    rows.push(`${t.trace.kyokai}: ${pref.name} ${(rate * 100).toFixed(2)}%`);
    if (result.shakai.healthStandard) rows.push(`${t.trace.healthGrade}: ${result.shakai.healthStandard.grade} (${jpFmtYen(result.shakai.healthStandard.amount)})`);
    if (result.shakai.pensionStandard) rows.push(`${t.trace.pensionGrade}: ${result.shakai.pensionStandard.grade} (${jpFmtYen(result.shakai.pensionStandard.amount)})`);
  }
  if (result.kokumin && result.kokumin.nationalPension) rows.push(`${t.trace.nationalPension}: ${jpFmtYen(result.kokumin.nationalPension)}`);
  if (result.kokumin && result.kokumin.nationalHealthInsurance) rows.push(`${t.trace.nhiManual}: ${jpFmtYen(result.kokumin.nationalHealthInsurance)}`);
  if (result.deductions && result.deductions.manualSocialInsurance) rows.push(`${t.trace.manualSocial}: ${jpFmtYen(result.deductions.manualSocialInsurance)}`);
  if (result.incomeTax.mode === 'ko') rows.push(t.trace.incomeKo);
  if (result.incomeTax.mode === 'otsu') rows.push(t.trace.incomeOtsu);
  if (result.incomeTax.mode === 'none') rows.push(t.trace.incomeNone);
  return rows;
}

function getJpLocalizedWarnings(result, profile, t) {
  const rows = [];
  if (result.dependents.overseasTotal > 0 && !profile.overseasQualified) rows.push(t.warn.overseas);
  if (result.residentTax.mode === 'auto' || result.residentTax.mode === 'hybrid-auto') rows.push(t.warn.residentAuto);
  if (result.incomeTax.mode === 'ko') rows.push(t.warn.incomeKo);
  if (profile.workStyle === 'freelancer') rows.push(t.warn.freelancer);
  if (Number(profile.age) >= 75) rows.push(t.warn.healthAge);
  if (Number(profile.age) >= 70) rows.push(t.warn.pensionAge);
  return rows;
}

function renderJpPayrollResult() {
  syncJpPayrollVisibility();
  const t = jpCopy();
  const profile = readJpPayrollForm();
  const result = calculateJpTakehome(profile);
  const summary = document.getElementById('jp_resultSummary');
  const details = document.getElementById('jp_resultDetails');
  const explain = document.getElementById('jp_resultExplain');
  const warnings = document.getElementById('jp_resultWarnings');
  if (!summary || !details || !explain || !warnings) return;

  summary.innerHTML = `
    <div><span>${t.net}</span><strong>${jpFmtYen(result.net)}</strong></div>
    <div><span>${t.gross}</span><strong>${jpFmtYen(result.gross)}</strong></div>
    <div><span>${t.deducted}</span><strong>${jpFmtYen(result.totalDeductions)}</strong></div>
  `;
  details.innerHTML = [
    jpResultRow(t.details.health, '-' + jpFmtYen(result.deductions.healthInsurance)),
    jpResultRow(t.details.child, '-' + jpFmtYen(result.deductions.childSupport)),
    jpResultRow(t.details.pension, '-' + jpFmtYen(result.deductions.employeePension)),
    jpResultRow(t.details.nationalPension, '-' + jpFmtYen(result.deductions.nationalPension)),
    jpResultRow(t.details.nhi, '-' + jpFmtYen(result.deductions.nationalHealthInsurance)),
    jpResultRow(t.details.manualSocial, '-' + jpFmtYen(result.deductions.manualSocialInsurance)),
    jpResultRow(t.details.employment, '-' + jpFmtYen(result.deductions.employmentInsurance)),
    jpResultRow(t.details.incomeTax, '-' + jpFmtYen(result.deductions.incomeTax)),
    jpResultRow(t.details.residentTax, '-' + jpFmtYen(result.deductions.residentTax)),
    jpResultRow(t.net, jpFmtYen(result.net), 'total')
  ].join('');
  const traceRows = getJpLocalizedTrace(result, profile, t);
  const warningRows = getJpLocalizedWarnings(result, profile, t);
  explain.innerHTML = `
    <div class="jp-pill-row">
      <span>${esc(t.trace.rules)} ${esc(result.version)}</span>
      <span>${esc(t.trace.dependents)}: ${result.dependents.taxCount}</span>
      <span>${esc(t.trace.resident)}: ${esc(result.residentTax.mode)}</span>
    </div>
    <ul>${traceRows.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
  `;
  warnings.innerHTML = warningRows.length
    ? `<ul>${warningRows.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`
    : `<div class="jp-ok">${esc(t.ok)}</div>`;
}

function bindJpPayrollModalOnce() {
  const modal = document.getElementById('moJpPayroll');
  if (!modal || modal.dataset.bound) return;
  modal.dataset.bound = '1';
  modal.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', renderJpPayrollResult);
    el.addEventListener('change', renderJpPayrollResult);
  });
}

function openJpPayrollModal() {
  populateJpPayrollPrefectures();
  bindJpPayrollModalOnce();
  applyJpPayrollCopy();
  writeJpPayrollForm(getJpPayrollProfile());
  renderJpPayrollResult();
  const mo = document.getElementById('moJpPayroll');
  if (mo) mo.classList.add('show');
}

function closeJpPayrollModal() {
  const mo = document.getElementById('moJpPayroll');
  if (mo) mo.classList.remove('show');
}

function saveJpPayrollFromModal() {
  const profile = readJpPayrollForm();
  if (!profile.disclaimerAccepted) {
    toast(jpCopy().acceptDisclaimer);
    return;
  }
  saveJpPayrollProfile(profile);
  renderJpPayrollResult();
  toast('💾');
}

async function buyJpPayrollMonthly() {
  const ok = await purchaseJpTakehomePackage(JP_IAP_CONFIG.monthlyProductId);
  await refreshJpProStatus();
  applyJpPayrollCopy();
  if (ok) toast('Pro');
}

async function buyJpPayrollLifetime() {
  const ok = await purchaseJpTakehomePackage(JP_IAP_CONFIG.lifetimeProductId);
  await refreshJpProStatus();
  applyJpPayrollCopy();
  if (ok) toast('Pro');
}

async function restoreJpPayrollPurchase() {
  const ok = await restoreJpTakehomePurchases();
  applyJpPayrollCopy();
  toast(ok ? 'Pro' : '—');
}

function applyJpPayrollCopy() {
  const t = jpCopy();
  const l = t.labels;
  const o = t.options;
  set('jpModalTitle', t.title);
  set('jpModalSub', t.subtitle);
  set('jpSetupTitle', t.setup);
  set('jpResultTitle', t.result);
  set('jpPaywallTitle', t.paywallTitle);
  set('jpPaywallBody', t.paywallBody);
  // Use real prices from RevenueCat offerings if available; fall back to the
  // localized hardcoded "$0.99 / month" style copy otherwise.
  const monthlyPrice = (typeof getJpProductPriceString === 'function')
    ? getJpProductPriceString(JP_IAP_CONFIG.monthlyProductId) : null;
  const lifetimePrice = (typeof getJpProductPriceString === 'function')
    ? getJpProductPriceString(JP_IAP_CONFIG.lifetimeProductId) : null;
  set('jpMonthlyBtn', monthlyPrice ? monthlyPrice + ' / ' + (t.perMonthShort || (t.monthly || '').split('/').pop().trim() || 'month') : t.monthly);
  set('jpLifetimeBtn', lifetimePrice ? lifetimePrice + ' · ' + (t.lifetimeShort || (t.lifetime || '').split(' ').slice(1).join(' ') || 'lifetime') : t.lifetime);
  set('jpRestoreBtn', t.restore);
  set('jpSaveBtn', t.save);
  set('jpUseMonthBtn', t.useMonth);
  set('jpDisclaimerText', t.disclaimer);
  set('jpStatusText', isJpTakehomeProActive() ? t.pro : (jpIapReady ? t.statusLocked : t.statusPreview));
  set('sJpPayroll', t.open);
  set('sJpPayrollV', t.openSub);
  set('jpExplainLabel', t.explain);
  set('jpWarningLabel', t.warnings);

  set('jpLblWorkStyle', l.workStyle);
  set('jpLblMonthlyGross', l.monthlyGross);
  set('jpLblPreviousAnnualGross', l.previousAnnualGross);
  set('jpLblAge', l.age);
  set('jpLblInsurance', l.insurance);
  set('jpLblEmployment', l.employment);
  set('jpLblWithholding', l.withholding);
  set('jpLblResidentTax', l.residentTax);
  set('jpLblPrefecture', l.prefecture);
  set('jpLblStandardMode', l.standardMode);
  set('jpLblManualStandard', l.manualStandard);
  set('jpLblCustomHealthRate', l.customHealthRate);
  set('jpLblCustomHealthEnabled', l.customHealthEnabled);
  set('jpLblIncludeNationalPension', l.includeNationalPension);
  set('jpLblNhiMonthly', l.nhiMonthly);
  set('jpLblManualSocial', l.manualSocial);
  set('jpLblDomesticDependents', l.domesticDependents);
  set('jpLblOverseasDependents', l.overseasDependents);
  set('jpLblResidentManualMonthly', l.residentManualMonthly);
  set('jpLblOverseasQualified', l.overseasQualified);

  set('jpOptWorkBaito', o.workBaito);
  set('jpOptWorkHaken', o.workHaken);
  set('jpOptWorkEmployee', o.workEmployee);
  set('jpOptWorkFreelancer', o.workFreelancer);
  set('jpOptInsuranceShakai', o.shakai);
  set('jpOptInsuranceKokumin', o.kokumin);
  set('jpOptInsuranceManual', o.manual);
  set('jpOptEmploymentGeneral', o.employmentGeneral);
  set('jpOptEmploymentSpecial', o.employmentSpecial);
  set('jpOptEmploymentNone', o.none);
  set('jpOptWithholdingKo', o.ko);
  set('jpOptWithholdingOtsu', o.otsu);
  set('jpOptWithholdingNone', o.none);
  set('jpOptResidentOff', o.off);
  set('jpOptResidentManual', o.residentManual);
  set('jpOptResidentAuto', o.residentAuto);
  set('jpOptResidentHybrid', o.residentHybrid);
  set('jpOptStandardAuto', o.standardAuto);
  set('jpOptStandardManual', o.standardManual);

  const mo = document.getElementById('moJpPayroll');
  if (mo && mo.classList.contains('show')) renderJpPayrollResult();
}

function updateJpPayrollSettingsSummary() {
  const t = jpCopy();
  set('sJpPayroll', t.open);
  set('sJpPayrollV', jpPayrollProfile ? t.openSub : t.statusLocked);
}
