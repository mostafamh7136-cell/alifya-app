// Alifya — Arabic lesson content
// Core lesson library. Universal progression lives in lib/curriculum.ts.
export type VocabItem = {
  arabic: string;
  translit: string;
  meaning: string;
  example?: string;
  exampleTranslit?: string;
  exampleMeaning?: string;
};

export type PhraseItem = {
  arabic: string;
  translit: string;
  meaning: string;
  note?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

export type Lesson = {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  category: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  levelEn: "beginner" | "intermediate" | "advanced";
  icon: string;
  accent: "clay" | "sage" | "gold";
  duration: string; // e.g. "٨ دقائق"
  durationEn: number; // minutes
  vocabulary: VocabItem[];
  phrases: PhraseItem[];
  quiz: QuizQuestion[];
  tip?: string;
};

export const lessons: Lesson[] = [
  {
    id: "greetings",
    title: "Greetings & Introductions",
    arabicTitle: "التحيّات والتعارف",
    description:
      "Start speaking from day one — the essential greetings, introductions, and polite phrases used in everyday Arabic conversation.",
    category: "أساسيات",
    level: "مبتدئ",
    levelEn: "beginner",
    icon: "👋",
    accent: "clay",
    duration: "٨ دقائق",
    durationEn: 8,
    tip: "في اللهجات العربية المختلفة تُنطق التحية بأشكال متعددة، لكن «مرحباً» مفهومة في كل مكان.",
    vocabulary: [
      {
        arabic: "مرحباً",
        translit: "Marhaban",
        meaning: "Hello",
        example: "مرحباً، كيف حالك؟",
        exampleTranslit: "Marhaban, kayfa haluk?",
        exampleMeaning: "Hello, how are you?",
      },
      {
        arabic: "السلام عليكم",
        translit: "As-salāmu ʿalaykum",
        meaning: "Peace be upon you (formal greeting)",
        example: "السلام عليكم ورحمة الله",
        exampleTranslit: "As-salāmu ʿalaykum wa raḥmatu-llāh",
        exampleMeaning: "Peace be upon you and God's mercy",
      },
      {
        arabic: "وعليكم السلام",
        translit: "Wa ʿalaykumu s-salām",
        meaning: "And upon you be peace (the reply)",
      },
      {
        arabic: "صباح الخير",
        translit: "Ṣabāḥ al-khayr",
        meaning: "Good morning",
        example: "صباح الخير يا صديقي",
        exampleTranslit: "Ṣabāḥ al-khayr yā ṣadīqī",
        exampleMeaning: "Good morning, my friend",
      },
      {
        arabic: "مساء الخير",
        translit: "Masāʾ al-khayr",
        meaning: "Good evening",
      },
      {
        arabic: "كيف حالك؟",
        translit: "Kayfa ḥāluk?",
        meaning: "How are you?",
      },
      {
        arabic: "أنا بخير، شكراً",
        translit: "Anā bikhayr, shukran",
        meaning: "I'm fine, thank you",
      },
      {
        arabic: "ما اسمك؟",
        translit: "Mā smuk?",
        meaning: "What is your name?",
      },
      {
        arabic: "اسمي…",
        translit: "Ismī…",
        meaning: "My name is…",
      },
      {
        arabic: "تشرفنا",
        translit: "Tasharrafnā",
        meaning: "Nice to meet you",
      },
      {
        arabic: "إلى اللقاء",
        translit: "Ilā l-liqāʾ",
        meaning: "Goodbye (see you later)",
      },
      {
        arabic: "شكراً جزيلاً",
        translit: "Shukran jazīlan",
        meaning: "Thank you very much",
      },
      {
        arabic: "من فضلك",
        translit: "Min faḍlik",
        meaning: "Please",
      },
      {
        arabic: "عفواً",
        translit: "ʿAfwan",
        meaning: "You're welcome / Excuse me",
      },
      {
        arabic: "نعم / لا",
        translit: "Naʿam / Lā",
        meaning: "Yes / No",
      },
    ],
    phrases: [
      {
        arabic: "أهلاً وسهلاً!",
        translit: "Ahlan wa sahlan!",
        meaning: "Welcome!",
        note: "الترحيب الأكثر استخداماً عند استقبال الضيوف",
      },
      {
        arabic: "أنا سعيد برؤيتك",
        translit: "Anā saʿīd biruʾyatik",
        meaning: "I'm happy to see you",
      },
      {
        arabic: "هل تتحدث العربية؟",
        translit: "Hal tataḥaddathu l-ʿarabiyya?",
        meaning: "Do you speak Arabic?",
      },
      {
        arabic: "أنا أتعلم العربية",
        translit: "Anā ataʿallamu l-ʿarabiyya",
        meaning: "I'm learning Arabic",
        note: "عبارة سحرية ستكسبك تعاطف المتحدثين الأصليين",
      },
    ],
    quiz: [
      {
        question: "ما معنى «السلام عليكم»؟",
        options: ["Good morning", "Peace be upon you", "Thank you", "Goodbye"],
        answerIndex: 1,
        explanation: "«السلام عليكم» تحية إسلامية وعربية أصيلة تعني «السلام عليكم».",
      },
      {
        question: "How do you say «My name is…» in Arabic?",
        options: ["Ismī…", "Mā smuk?", "Min faḍlik", "Shukran"],
        answerIndex: 0,
      },
      {
        question: "What is the correct reply to «صباح الخير»?",
        options: ["مساء النور", "صباح النور", "إلى اللقاء", "عفواً"],
        answerIndex: 1,
        explanation: "الرد التقليدي هو «صباح النور».",
      },
      {
        question: "«شكراً جزيلاً» تعني:",
        options: ["You're welcome", "Please", "Thank you very much", "Hello"],
        answerIndex: 2,
      },
      {
        question: "كيف تسأل «How are you?» بالعربية؟",
        options: ["ما اسمك؟", "كيف حالك؟", "أين أنت؟", "متى تذهب؟"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "numbers",
    title: "Numbers & Counting",
    arabicTitle: "الأرقام والعدّ",
    description:
      "Master the Arabic number system from 0 to 100 — essential for shopping, prices, dates, and everyday life.",
    category: "أساسيات",
    level: "مبتدئ",
    levelEn: "beginner",
    icon: "🔢",
    accent: "gold",
    duration: "١٠ دقائق",
    durationEn: 10,
    tip: "انتبه: في المشرق العربي تُستخدم الأرقام الهندية (٠١٢٣)، بينما في المغرب العربي تُستخدم الأرقام اللاتينية (0123).",
    vocabulary: [
      { arabic: "صفر", translit: "Ṣifr", meaning: "Zero" },
      { arabic: "واحد", translit: "Wāḥid", meaning: "One" },
      { arabic: "اثنان", translit: "Ithnān", meaning: "Two" },
      { arabic: "ثلاثة", translit: "Thalātha", meaning: "Three" },
      { arabic: "أربعة", translit: "Arbaʿa", meaning: "Four" },
      { arabic: "خمسة", translit: "Khamsa", meaning: "Five" },
      { arabic: "ستة", translit: "Sitta", meaning: "Six" },
      { arabic: "سبعة", translit: "Sabʿa", meaning: "Seven" },
      { arabic: "ثمانية", translit: "Thamāniya", meaning: "Eight" },
      { arabic: "تسعة", translit: "Tisʿa", meaning: "Nine" },
      { arabic: "عشرة", translit: "ʿAshara", meaning: "Ten" },
      { arabic: "عشرون", translit: "ʿIshrūn", meaning: "Twenty" },
      { arabic: "ثلاثون", translit: "Thalāthūn", meaning: "Thirty" },
      { arabic: "مئة", translit: "Miʾa", meaning: "One hundred" },
      { arabic: "ألف", translit: "Alf", meaning: "One thousand" },
    ],
    phrases: [
      {
        arabic: "كم الثمن؟",
        translit: "Kam ath-thaman?",
        meaning: "How much is it?",
        note: "عبارة أساسية عند التسوق",
      },
      {
        arabic: "أريد اثنين، من فضلك",
        translit: "Urīdu ithnayn, min faḍlik",
        meaning: "I'd like two, please",
      },
      {
        arabic: "عندي ثلاثة أبناء",
        translit: "ʿIndī thalāthat abnāʾ",
        meaning: "I have three sons",
      },
    ],
    quiz: [
      {
        question: "ما هو الرقم «خمسة»؟",
        options: ["3", "5", "7", "9"],
        answerIndex: 1,
      },
      {
        question: "How do you say «twenty» in Arabic?",
        options: ["عشرة", "عشرون", "اثنان", "مئة"],
        answerIndex: 1,
      },
      {
        question: "«ألف» تعني:",
        options: ["One hundred", "One million", "One thousand", "Ten"],
        answerIndex: 2,
      },
      {
        question: "الرقم «صفر» بالإنجليزية:",
        options: ["One", "Seven", "Zero", "Nine"],
        answerIndex: 2,
      },
      {
        question: "كيف تقول «How much is it?»؟",
        options: ["كم الثمن؟", "كم الساعة؟", "كم عمرك؟", "كم عددكم؟"],
        answerIndex: 0,
      },
    ],
  },
  {
    id: "family",
    title: "Family & People",
    arabicTitle: "العائلة والأشخاص",
    description:
      "Learn to talk about your family and the people around you — one of the warmest topics in Arabic culture.",
    category: "المحادثة",
    level: "مبتدئ",
    levelEn: "beginner",
    icon: "👨‍👩‍👧‍👦",
    accent: "sage",
    duration: "٩ دقائق",
    durationEn: 9,
    tip: "العائلة في الثقافة العربية تمتد لتشمل الأعمام والعمات والأخوال — العائلة الممتدة جزء أساسي من الحياة اليومية.",
    vocabulary: [
      { arabic: "عائلة", translit: "ʿĀʾila", meaning: "Family" },
      { arabic: "أب", translit: "Ab", meaning: "Father" },
      { arabic: "أم", translit: "Umm", meaning: "Mother" },
      { arabic: "أخ", translit: "Akh", meaning: "Brother" },
      { arabic: "أخت", translit: "Ukht", meaning: "Sister" },
      { arabic: "ابن", translit: "Ibn", meaning: "Son" },
      { arabic: "ابنة", translit: "Ibna", meaning: "Daughter" },
      { arabic: "جد", translit: "Jadd", meaning: "Grandfather" },
      { arabic: "جدة", translit: "Jadda", meaning: "Grandmother" },
      { arabic: "عم", translit: "ʿAmm", meaning: "Paternal uncle" },
      { arabic: "خال", translit: "Khāl", meaning: "Maternal uncle" },
      { arabic: "صديق", translit: "Ṣadīq", meaning: "Friend" },
      { arabic: "زوج / زوجة", translit: "Zawj / Zawja", meaning: "Husband / Wife" },
      {
        arabic: "ولد / بنت",
        translit: "Walad / Bint",
        meaning: "Boy / Girl",
        example: "عندي ولد وبنت",
        exampleTranslit: "ʿIndī walad wa bint",
        exampleMeaning: "I have a boy and a girl",
      },
    ],
    phrases: [
      {
        arabic: "كم عدد أفراد عائلتك؟",
        translit: "Kam ʿadad afrād ʿāʾilatik?",
        meaning: "How many people are in your family?",
      },
      {
        arabic: "عائلتي كبيرة",
        translit: "ʿĀʾilatī kabīra",
        meaning: "My family is big",
      },
      {
        arabic: "هذا أخي",
        translit: "Hādhā akhī",
        meaning: "This is my brother",
      },
      {
        arabic: "أحب عائلتي كثيراً",
        translit: "Uḥibbu ʿāʾilatī kathīran",
        meaning: "I love my family very much",
      },
    ],
    quiz: [
      {
        question: "«أم» تعني:",
        options: ["Father", "Mother", "Sister", "Grandmother"],
        answerIndex: 1,
      },
      {
        question: "How do you say «brother» in Arabic?",
        options: ["أخت", "عم", "أخ", "ابن"],
        answerIndex: 2,
      },
      {
        question: "«جدة» هي:",
        options: ["Grandfather", "Grandmother", "Aunt", "Cousin"],
        answerIndex: 1,
      },
      {
        question: "الفرق بين «عم» و«خال»:",
        options: [
          "عم = أخو الأب، خال = أخو الأم",
          "عم = أخو الأم، خال = أخو الأب",
          "كلاهما بمعنى الجد",
          "لا يوجد فرق",
        ],
        answerIndex: 0,
        explanation: "«العم» هو أخو الأب، و«الخال» هو أخو الأم.",
      },
      {
        question: "«هذا أخي» تعني:",
        options: [
          "This is my father",
          "This is my brother",
          "This is my friend",
          "This is my son",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "food",
    title: "Food & Drink",
    arabicTitle: "الطعام والشراب",
    description:
      "From coffee to kabsa — the words you need to order food, describe flavors, and enjoy Arab hospitality.",
    category: "الحياة اليومية",
    level: "مبتدئ",
    levelEn: "beginner",
    icon: "🍽️",
    accent: "clay",
    duration: "١١ دقيقة",
    durationEn: 11,
    tip: "«القهوة العربية» أكثر من مشروب — إنها رمز للضيافة. رفضها قد يُعتبر غير مهذب في بعض المجالس!",
    vocabulary: [
      { arabic: "طعام", translit: "Ṭaʿām", meaning: "Food" },
      { arabic: "شراب", translit: "Sharāb", meaning: "Drink" },
      { arabic: "ماء", translit: "Māʾ", meaning: "Water" },
      { arabic: "قهوة", translit: "Qahwa", meaning: "Coffee" },
      { arabic: "شاي", translit: "Shāy", meaning: "Tea" },
      { arabic: "خبز", translit: "Khubz", meaning: "Bread" },
      { arabic: "أرز", translit: "Ruzz", meaning: "Rice" },
      { arabic: "لحم", translit: "Laḥm", meaning: "Meat" },
      { arabic: "دجاج", translit: "Dajāj", meaning: "Chicken" },
      { arabic: "سمك", translit: "Samak", meaning: "Fish" },
      { arabic: "فواكه", translit: "Fawākih", meaning: "Fruits" },
      { arabic: "خضار", translit: "Khuḍār", meaning: "Vegetables" },
      { arabic: "سكر", translit: "Sukkar", meaning: "Sugar" },
      { arabic: "ملح", translit: "Milḥ", meaning: "Salt" },
      {
        arabic: "لذيذ",
        translit: "Ladhīdh",
        meaning: "Delicious",
        example: "هذا الطعام لذيذ جداً!",
        exampleTranslit: "Hādhā ṭ-ṭaʿām ladhīdh jiddan!",
        exampleMeaning: "This food is very delicious!",
      },
    ],
    phrases: [
      {
        arabic: "أنا جائع / عطشان",
        translit: "Anā jāʾiʿ / ʿaṭshān",
        meaning: "I'm hungry / thirsty",
      },
      {
        arabic: "القائمة من فضلك",
        translit: "Al-qāʾima min faḍlik",
        meaning: "The menu, please",
      },
      {
        arabic: "بالصحة والهناء!",
        translit: "Bi-ṣ-ṣiḥḥa wa l-hanāʾ!",
        meaning: "Bon appétit! (To your health!)",
        note: "تقال عند بدء الأكل أو عند سماع شخص يأكل",
      },
      {
        arabic: "الحساب من فضلك",
        translit: "Al-ḥisāb min faḍlik",
        meaning: "The bill, please",
      },
    ],
    quiz: [
      {
        question: "«قهوة» بالإنجليزية:",
        options: ["Tea", "Coffee", "Milk", "Juice"],
        answerIndex: 1,
      },
      {
        question: "How do you say «bread» in Arabic?",
        options: ["أرز", "لحم", "خبز", "سمك"],
        answerIndex: 2,
      },
      {
        question: "«لذيذ» تعني:",
        options: ["Bitter", "Salty", "Delicious", "Cold"],
        answerIndex: 2,
      },
      {
        question: "ماذا تقول عندما تبدأ الأكل؟",
        options: ["إلى اللقاء", "بالصحة والهناء", "صباح الخير", "عفواً"],
        answerIndex: 1,
      },
      {
        question: "«الماء» بالإنجليزية:",
        options: ["Milk", "Juice", "Water", "Honey"],
        answerIndex: 2,
      },
    ],
  },
  {
    id: "time",
    title: "Time, Days & Dates",
    arabicTitle: "الوقت والأيام والتواريخ",
    description:
      "Tell the time, name the days, and make plans — the calendar vocabulary that structures every conversation.",
    category: "الحياة اليومية",
    level: "متوسط",
    levelEn: "intermediate",
    icon: "🕰️",
    accent: "sage",
    duration: "١٠ دقائق",
    durationEn: 10,
    tip: "في اللغة العربية يبدأ الأسبوع بيوم الأحد وليس الاثنين!",
    vocabulary: [
      { arabic: "وقت", translit: "Waqt", meaning: "Time" },
      { arabic: "ساعة", translit: "Sāʿa", meaning: "Hour / Clock" },
      { arabic: "يوم", translit: "Yawm", meaning: "Day" },
      { arabic: "أسبوع", translit: "Usbūʿ", meaning: "Week" },
      { arabic: "شهر", translit: "Shahr", meaning: "Month" },
      { arabic: "سنة", translit: "Sana", meaning: "Year" },
      { arabic: "اليوم", translit: "Al-yawm", meaning: "Today" },
      { arabic: "غداً", translit: "Ghadan", meaning: "Tomorrow" },
      { arabic: "أمس", translit: "Ams", meaning: "Yesterday" },
      { arabic: "الآن", translit: "Al-ʾān", meaning: "Now" },
      { arabic: "الأحد", translit: "Al-aḥad", meaning: "Sunday" },
      { arabic: "الاثنين", translit: "Al-ithnayn", meaning: "Monday" },
      { arabic: "الثلاثاء", translit: "Ath-thulāthāʾ", meaning: "Tuesday" },
      { arabic: "الأربعاء", translit: "Al-arbiʿāʾ", meaning: "Wednesday" },
      { arabic: "الخميس", translit: "Al-khamīs", meaning: "Thursday" },
      { arabic: "الجمعة", translit: "Al-jumʿa", meaning: "Friday" },
      { arabic: "السبت", translit: "As-sabt", meaning: "Saturday" },
    ],
    phrases: [
      {
        arabic: "كم الساعة؟",
        translit: "Kam as-sāʿa?",
        meaning: "What time is it?",
      },
      {
        arabic: "في أي يوم؟",
        translit: "Fī ayyi yawm?",
        meaning: "On which day?",
      },
      {
        arabic: "نلتقي غداً إن شاء الله",
        translit: "Naltaqī ghadan in shāʾ Allāh",
        meaning: "We'll meet tomorrow, God willing",
        note: "«إن شاء الله» جزء أصيل من الحديث العربي اليومي",
      },
      {
        arabic: "ما تاريخ اليوم؟",
        translit: "Mā tārīkh al-yawm?",
        meaning: "What is today's date?",
      },
    ],
    quiz: [
      {
        question: "أول أيام الأسبوع في التقويم العربي:",
        options: ["الاثنين", "الأحد", "السبت", "الجمعة"],
        answerIndex: 1,
      },
      {
        question: "«غداً» بالإنجليزية:",
        options: ["Yesterday", "Today", "Tomorrow", "Now"],
        answerIndex: 2,
      },
      {
        question: "«الجمعة» تعني:",
        options: ["Thursday", "Saturday", "Friday", "Sunday"],
        answerIndex: 2,
        explanation: "الجمعة يوم مقدس في الإسلام ويسمى يوم الجمعة.",
      },
      {
        question: "How do you ask «What time is it?»?",
        options: ["كم الثمن؟", "كم الساعة؟", "كم عمرك؟", "كم العدد؟"],
        answerIndex: 1,
      },
      {
        question: "«شهر» يعني:",
        options: ["Week", "Year", "Month", "Hour"],
        answerIndex: 2,
      },
    ],
  },
  {
    id: "verbs",
    title: "Essential Verbs",
    arabicTitle: "الأفعال الأساسية",
    description:
      "The most-used Arabic verbs with their conjugations — the engine of every sentence you'll ever say.",
    category: "القواعد",
    level: "متوسط",
    levelEn: "intermediate",
    icon: "⚡",
    accent: "gold",
    duration: "١٢ دقيقة",
    durationEn: 12,
    tip: "الفعل العربي مبني من جذر ثلاثي. «كتب – يكتب – كتاب» كلها من الجذر (ك ت ب). تعلم الجذور يضاعف مفرداتك!",
    vocabulary: [
      {
        arabic: "أكل — يأكل",
        translit: "Akala — yaʾkulu",
        meaning: "To eat",
        example: "أنا آكل التفاح",
        exampleTranslit: "Anā ākulu t-tuffāḥ",
        exampleMeaning: "I'm eating an apple",
      },
      { arabic: "شرب — يشرب", translit: "Shariba — yashrabu", meaning: "To drink" },
      { arabic: "ذهب — يذهب", translit: "Dhahaba — yadhhabu", meaning: "To go" },
      { arabic: "جاء — يأتي", translit: "Jāʾa — yaʾtī", meaning: "To come" },
      { arabic: "قال — يقول", translit: "Qāla — yaqūlu", meaning: "To say" },
      { arabic: "رأى — يرى", translit: "Raʾā — yarā", meaning: "To see" },
      { arabic: "سمع — يسمع", translit: "Samiʿa — yasmaʿu", meaning: "To hear" },
      { arabic: "كتب — يكتب", translit: "Kataba — yaktubu", meaning: "To write" },
      { arabic: "قرأ — يقرأ", translit: "Qaraʾa — yaqraʾu", meaning: "To read" },
      { arabic: "درس — يدرس", translit: "Darasa — yadrusu", meaning: "To study" },
      { arabic: "عمل — يعمل", translit: "ʿAmila — yaʿmalu", meaning: "To work" },
      { arabic: "لعب — يلعب", translit: "Laʿiba — yalʿabu", meaning: "To play" },
      { arabic: "نام — ينام", translit: "Nāma — yanāmu", meaning: "To sleep" },
      { arabic: "فهم — يفهم", translit: "Fahima — yafhamu", meaning: "To understand" },
      {
        arabic: "أحب — يحب",
        translit: "Aḥabba — yuḥibbu",
        meaning: "To love",
        example: "أحب اللغة العربية",
        exampleTranslit: "Uḥibbu l-lughata l-ʿarabiyya",
        exampleMeaning: "I love the Arabic language",
      },
    ],
    phrases: [
      {
        arabic: "أنا أفهم",
        translit: "Anā afham",
        meaning: "I understand",
      },
      {
        arabic: "أنا لا أفهم",
        translit: "Anā lā afham",
        meaning: "I don't understand",
        note: "أهم جملة لمتعلم مبتدئ!",
      },
      {
        arabic: "هل تفهمني؟",
        translit: "Hal tafhamnī?",
        meaning: "Do you understand me?",
      },
      {
        arabic: "أعد من فضلك",
        translit: "Aʿid min faḍlik",
        meaning: "Repeat, please",
      },
    ],
    quiz: [
      {
        question: "«يأكل» تعني:",
        options: ["To drink", "To eat", "To sleep", "To run"],
        answerIndex: 1,
      },
      {
        question: "الجذر الثلاثي لفعل «كتب»:",
        options: ["ك ت ب", "ك ب ر", "ك ر م", "ب ت ك"],
        answerIndex: 0,
        explanation: "كتب، يكتب، كتاب، مكتبة — كلها من الجذر (ك ت ب).",
      },
      {
        question: "«أنا لا أفهم» بالإنجليزية:",
        options: [
          "I understand",
          "I don't understand",
          "I'm learning",
          "Speak slowly",
        ],
        answerIndex: 1,
      },
      {
        question: "ما ضد «ذهب» (ذهب – يذهب)؟",
        options: ["جاء", "نام", "أكل", "كتب"],
        answerIndex: 0,
      },
      {
        question: "«يقرأ» تعني:",
        options: ["To write", "To read", "To study", "To listen"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "travel",
    title: "Travel & Directions",
    arabicTitle: "السفر والاتجاهات",
    description:
      "Navigate airports, cities, and taxis with confidence — practical phrases for the Arabic-speaking world.",
    category: "المحادثة",
    level: "متوسط",
    levelEn: "intermediate",
    icon: "✈️",
    accent: "clay",
    duration: "١١ دقيقة",
    durationEn: 11,
    tip: "في سيارات الأجرة، قل «على قدّام» (استمر) و«هون» (هنا) في الشام، أو «دغري» في العراق — نفس المعنى بلهجات مختلفة!",
    vocabulary: [
      { arabic: "مطار", translit: "Maṭār", meaning: "Airport" },
      { arabic: "طائرة", translit: "Ṭāʾira", meaning: "Airplane" },
      { arabic: "قطار", translit: "Qiṭār", meaning: "Train" },
      { arabic: "سيارة", translit: "Sayyāra", meaning: "Car" },
      { arabic: "حافلة", translit: "Ḥāfila", meaning: "Bus" },
      { arabic: "فندق", translit: "Funduq", meaning: "Hotel" },
      { arabic: "شارع", translit: "Shāriʿ", meaning: "Street" },
      { arabic: "يمين", translit: "Yamīn", meaning: "Right" },
      { arabic: "يسار", translit: "Yasār", meaning: "Left" },
      { arabic: "مستقيم", translit: "Mustaqīm", meaning: "Straight" },
      { arabic: "خريطة", translit: "Kharīṭa", meaning: "Map" },
      { arabic: "جواز سفر", translit: "Jawāz safar", meaning: "Passport" },
      { arabic: "تذكرة", translit: "Tadhkara", meaning: "Ticket" },
      { arabic: "حقيبة", translit: "Ḥaqība", meaning: "Suitcase / Bag" },
      {
        arabic: "بعيد / قريب",
        translit: "Baʿīd / Qarīb",
        meaning: "Far / Near",
        example: "هل الفندق قريب من المطار؟",
        exampleTranslit: "Hal l-funduq qarīb min al-maṭār?",
        exampleMeaning: "Is the hotel near the airport?",
      },
    ],
    phrases: [
      {
        arabic: "أين محطة القطار؟",
        translit: "Ayna maḥaṭṭatu l-qiṭār?",
        meaning: "Where is the train station?",
      },
      {
        arabic: "كم تبعد المسافة؟",
        translit: "Kam tabʿudu l-masāfa?",
        meaning: "How far is it?",
      },
      {
        arabic: "أريد تذكرة إلى القاهرة",
        translit: "Urīdu tadhkara ilā l-Qāhira",
        meaning: "I want a ticket to Cairo",
      },
      {
        arabic: "هل تستطيع مساعدتي؟",
        translit: "Hal tastatīʿu musāʿadatī?",
        meaning: "Can you help me?",
      },
    ],
    quiz: [
      {
        question: "«مطار» بالإنجليزية:",
        options: ["Station", "Airport", "Harbor", "Bus stop"],
        answerIndex: 1,
      },
      {
        question: "«يمين» تعني:",
        options: ["Left", "Right", "Straight", "Back"],
        answerIndex: 1,
      },
      {
        question: "«جواز سفر» هو:",
        options: ["Visa", "Passport", "Ticket", "ID card"],
        answerIndex: 1,
      },
      {
        question: "كيف تسأل «Where is the hotel?»؟",
        options: [
          "أين الفندق؟",
          "كم الفندق؟",
          "متى الفندق؟",
          "لماذا الفندق؟",
        ],
        answerIndex: 0,
      },
      {
        question: "ضد «بعيد»:",
        options: ["كبير", "قريب", "سريع", "بطيء"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "shopping",
    title: "Shopping & Bargaining",
    arabicTitle: "التسوق والمفاوضة",
    description:
      "Souk-ready vocabulary — from asking prices to bargaining like a local in traditional markets.",
    category: "الحياة اليومية",
    level: "متقدم",
    levelEn: "advanced",
    icon: "🛍️",
    accent: "sage",
    duration: "١٠ دقائق",
    durationEn: 10,
    tip: "المفاوضة (البازار) فن في الأسواق العربية! ابدأ بنصف السعر المقترح وابتسم — نصف المتعة في الحوار نفسه.",
    vocabulary: [
      { arabic: "متجر / دكان", translit: "Matjar / Dukkān", meaning: "Shop" },
      { arabic: "سوق", translit: "Sūq", meaning: "Market" },
      { arabic: "سعر", translit: "Siʿr", meaning: "Price" },
      { arabic: "رخص / غالي", translit: "Rakhīṣ / Ghālī", meaning: "Cheap / Expensive" },
      { arabic: "نقود", translit: "Nuqūd", meaning: "Money / Cash" },
      { arabic: "بطاقة ائتمان", translit: "Biṭāqat iʾtimān", meaning: "Credit card" },
      { arabic: "خصم", translit: "Khaṣm", meaning: "Discount" },
      { arabic: "مقاس", translit: "Miqyās", meaning: "Size" },
      { arabic: "لون", translit: "Lawn", meaning: "Color" },
      { arabic: "هدية", translit: "Hadiyya", meaning: "Gift" },
      { arabic: "فستان", translit: "Fustān", meaning: "Dress" },
      { arabic: "قميص", translit: "Qamīṣ", meaning: "Shirt" },
      { arabic: "حذاء", translit: "Ḥidhāʾ", meaning: "Shoes" },
      { arabic: "ذهب", translit: "Dhahab", meaning: "Gold" },
      {
        arabic: "مكلف جداً",
        translit: "Mukallif jiddan",
        meaning: "Very expensive",
        example: "هذا غالي جداً، أعطني خصماً!",
        exampleTranslit: "Hādhā ghālī jiddan, aʿṭinī khaṣman!",
        exampleMeaning: "This is very expensive, give me a discount!",
      },
    ],
    phrases: [
      {
        arabic: "بكم هذا؟",
        translit: "Bikam hādhā?",
        meaning: "How much is this?",
      },
      {
        arabic: "هل عندك مقاس أكبر؟",
        translit: "Hal ʿindaka miqyās akbar?",
        meaning: "Do you have a bigger size?",
      },
      {
        arabic: "هذا غالي، هل من تخفيض؟",
        translit: "Hādhā ghālī, hal min takhfīḍ?",
        meaning: "This is expensive, any reduction?",
        note: "البداية الكلاسيكية للمفاوضة",
      },
      {
        arabic: "سأفكر في الأمر",
        translit: "Saʾufakkiru fī l-amr",
        meaning: "I'll think about it",
        note: "استراتيجية ذكية لخفض السعر — غالباً سيناديك البائع بعرض أفضل!",
      },
    ],
    quiz: [
      {
        question: "«سوق» بالإنجليزية:",
        options: ["Shop", "Market", "Mall", "Store"],
        answerIndex: 1,
      },
      {
        question: "«غالي» تعني:",
        options: ["Cheap", "Expensive", "New", "Old"],
        answerIndex: 1,
      },
      {
        question: "ماذا تقول لتبدأ المفاوضة؟",
        options: [
          "هذا غالي، هل من تخفيض؟",
          "صباح الخير",
          "إلى اللقاء",
          "تشرفنا",
        ],
        answerIndex: 0,
      },
      {
        question: "«خصم» بالإنجليزية:",
        options: ["Price", "Discount", "Tax", "Payment"],
        answerIndex: 1,
      },
      {
        question: "«بكم هذا؟» تعني:",
        options: [
          "Where is this?",
          "How much is this?",
          "What is this?",
          "Who made this?",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "conversation",
    title: "Daily Conversation",
    arabicTitle: "المحادثة اليومية",
    description:
      "The glue phrases that make you sound natural — politeness, emotions, and small talk that locals actually use.",
    category: "المحادثة",
    level: "متقدم",
    levelEn: "advanced",
    icon: "💬",
    accent: "gold",
    duration: "١٣ دقيقة",
    durationEn: 13,
    tip: "العربية لغة غنية بالعبارات العاطفية: «ما شاء الله» للإعجاب، «الحمد لله» للشكر، «إن شاء الله» للمستقبل.",
    vocabulary: [
      {
        arabic: "ما شاء الله",
        translit: "Mā shāʾ Allāh",
        meaning: "What God has willed (expression of admiration)",
        example: "ما شاء الله، منزلك جميل!",
        exampleTranslit: "Mā shāʾ Allāh, manziluk jamīl!",
        exampleMeaning: "Mashallah, your house is beautiful!",
      },
      { arabic: "الحمد لله", translit: "Al-ḥamdu li-llāh", meaning: "Praise be to God (all is well)" },
      { arabic: "إن شاء الله", translit: "In shāʾ Allāh", meaning: "If God wills (God willing)" },
      { arabic: "مبارك", translit: "Mubārak", meaning: "Blessed / Congratulations" },
      { arabic: "مبروك", translit: "Mabrūk", meaning: "Congratulations!" },
      { arabic: "مع السلامة", translit: "Maʿa s-salāma", meaning: "Goodbye (go with peace)" },
      { arabic: "تفضل", translit: "Tafaḍḍal", meaning: "Go ahead / Here you go / Please (offering)" },
      { arabic: "حاضر", translit: "Ḥāḍir", meaning: "Present / At your service / Yes sir" },
      { arabic: "بالتوفيق", translit: "Bi-t-tawfīq", meaning: "Good luck" },
      { arabic: "ألف مبروك", translit: "Alf mabrūk", meaning: "A thousand congratulations" },
      { arabic: "على مهلك", translit: "ʿAlā mahlik", meaning: "Take your time" },
      { arabic: "لا بأس", translit: "Lā baʾs", meaning: "No problem / It's okay" },
      { arabic: "تمام", translit: "Tamām", meaning: "Perfect / All good" },
      { arabic: "بصراحة", translit: "Bi-ṣarāḥa", meaning: "Honestly / Frankly" },
      { arabic: "طيب", translit: "Ṭayyib", meaning: "Okay / Well" },
    ],
    phrases: [
      {
        arabic: "ماذا تفعل في وقت الفراغ؟",
        translit: "Mādhā tafʿalu fī waqti l-farāgh?",
        meaning: "What do you do in your free time?",
      },
      {
        arabic: "أنا أستمتع بالقراءة",
        translit: "Anā astamtiʿu bi-l-qirāʾa",
        meaning: "I enjoy reading",
      },
      {
        arabic: "أتفق معك تماماً",
        translit: "Uttafiqu maʿaka tamāman",
        meaning: "I completely agree with you",
      },
      {
        arabic: "أتمنى لك يوماً سعيداً",
        translit: "Atamannā laka yawman saʿīdan",
        meaning: "I wish you a happy day",
      },
    ],
    quiz: [
      {
        question: "«ما شاء الله» تُقال عند:",
        options: [
          "الوداع",
          "الإعجاب بشيء جميل",
          "طلب الطعام",
          "الاعتذار",
        ],
        answerIndex: 1,
      },
      {
        question: "«مبروك» تعني:",
        options: ["Good luck", "Congratulations", "Welcome", "Goodbye"],
        answerIndex: 1,
      },
      {
        question: "عندما يعطيك شخص شيئاً تقول له:",
        options: ["تفضل", "حاضر", "لا بأس", "تمام"],
        answerIndex: 0,
        explanation: "«تفضل» تُقال عند تقديم شيء لشخص أو السماح له بالدخول.",
      },
      {
        question: "«الحمد لله» تعني:",
        options: [
          "If God wills",
          "Praise be to God (all is well)",
          "God forgive me",
          "Good morning",
        ],
        answerIndex: 1,
      },
      {
        question: "«تمام» مرادفة لـ:",
        options: ["جيد / ممتاز", "سيئ", "بعيد", "صغير"],
        answerIndex: 0,
      },
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export const categories = Array.from(new Set(lessons.map((l) => l.category)));

export const totalVocab = lessons.reduce(
  (sum, l) => sum + l.vocabulary.length,
  0
);
