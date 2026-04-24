import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/video.model.js';
import { Quiz } from './models/quiz.model.js';

dotenv.config();

const videos = [
  {
    title: 'CSS Kirish — Uslublar asosi',
    description: 'CSS nima, qanday ulash, selector, property va value tushunchalari.',
    url: 'https://www.youtube.com/embed/yfoY53QXEnI',
    section: 'CSS',
    order: 1,
    duration: 780
  },
  {
    title: 'CSS Box Model',
    description: 'margin, padding, border, content — blok modeli batafsil.',
    url: 'https://www.youtube.com/embed/rIO5326FgPE',
    section: 'CSS',
    order: 2,
    duration: 720
  },
  {
    title: 'CSS Flexbox',
    description: 'display:flex, flex-direction, justify-content, align-items.',
    url: 'https://www.youtube.com/embed/fYq5PXgSsbE',
    section: 'CSS',
    order: 3,
    duration: 900
  },
  {
    title: 'CSS Grid',
    description: 'display:grid, grid-template-columns, grid-gap va boshqalar.',
    url: 'https://www.youtube.com/embed/jV8B24rSN5o',
    section: 'CSS',
    order: 4,
    duration: 840
  },
  {
    title: "CSS Animatsiyalar va Transition",
    description: 'transition, @keyframes, animation — zamonaviy CSS effektlari.',
    url: 'https://www.youtube.com/embed/SgmNxE9lWcY',
    section: 'CSS',
    order: 5,
    duration: 820
  }
];

const quizzesByOrder = [
  {
    title: 'CSS Kirish testi',
    section: 'CSS',
    questions: [
      { question: 'CSS qisqartmasi nima?', options: ['Colorful Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets'], correctIndex: 1 },
      { question: 'CSS ni HTML ga ulashning to\'g\'ri usuli qaysi?', options: ['<style src="style.css">', '<link rel="stylesheet" href="style.css">', '<css href="style.css">', '<script src="style.css">'], correctIndex: 1 },
      { question: 'CSS selectorida rang berish uchun qaysi property?', options: ['text-color', 'font-color', 'color', 'foreground-color'], correctIndex: 2 },
      { question: 'Fon rangi uchun qaysi CSS property?', options: ['bgcolor', 'background-color', 'bg-color', 'color-background'], correctIndex: 1 },
      { question: 'CSS da comment (izoh) qanday yoziladi?', options: ['// izoh', '/* izoh */', '<!-- izoh -->', '# izoh'], correctIndex: 1 },
      { question: 'Shrift o\'lchamini belgilash uchun qaysi property?', options: ['font-weight', 'font-size', 'text-size', 'size'], correctIndex: 1 },
      { question: 'CSS da selector nima?', options: ['Uslub qiymati', 'Element tanlovchisi', 'Rang kodi', 'Fayl nomi'], correctIndex: 1 },
      { question: 'Matn qalin qilish uchun qaysi property?', options: ['font-style: bold', 'text-decoration: bold', 'font-weight: bold', 'text-weight: bold'], correctIndex: 2 },
      { question: 'CSS class selectori qanday belgilanadi?', options: ['.classname', '#classname', '*classname', '@classname'], correctIndex: 0 },
      { question: 'CSS ID selectori qanday belgilanadi?', options: ['.idname', '#idname', '*idname', '@idname'], correctIndex: 1 }
    ]
  },
  {
    title: 'CSS Box Model testi',
    section: 'CSS',
    questions: [
      { question: 'Box model ichidagi to\'rt qismdan qaysi biri to\'g\'ri?', options: ['content, border, shadow, outline', 'content, padding, border, margin', 'text, space, frame, outer', 'inner, middle, outer, edge'], correctIndex: 1 },
      { question: 'padding nima?', options: ['Element tashqi bo\'shliqi', 'Element ichki bo\'shliqi', 'Chegaraning kengligi', 'Matn masofa'], correctIndex: 1 },
      { question: 'margin nima?', options: ['Element ichki bo\'shliqi', 'Element tashqi bo\'shliqi', 'Chegaraning uslubi', 'Fon rangi'], correctIndex: 1 },
      { question: 'border: 1px solid red — bu nima?', options: ['1px ichki bo\'shliq, qizil fon', '1px qalinlik, yaxlit chiziq, qizil chegara', '1px matn, qizil rang', 'Xato sintaksis'], correctIndex: 1 },
      { question: 'box-sizing: border-box qanday ishlaydi?', options: ['padding va border o\'lchamga qo\'shiladi', 'padding va border o\'lcham ichida hisoblanadi', 'faqat border hisoblanadi', 'hech qanday ta\'sir yo\'q'], correctIndex: 1 },
      { question: 'width: 100% nima bildiradi?', options: ["Ekran to'liq kengligi", 'Ota elementning 100% kengligi', '100 piksel', 'Mutlaq 100 sm'], correctIndex: 1 },
      { question: 'margin: auto nima uchun ishlatiladi?', options: ['Elementni vertkal markazga', 'Elementni gorizontal markazga', 'Elementni yashirish', 'Elementni o\'chirish'], correctIndex: 1 },
      { question: 'max-width qanday ishlaydi?', options: ["Minimal kenglik belgilaydi", 'Maksimal kenglik chegarasini qo\'yadi', 'Aniq kenglik belgilaydi', 'Kenglikni nolga qo\'yadi'], correctIndex: 1 },
      { question: 'overflow: hidden nima qiladi?', options: ['Elementni yashiradi', 'Elementdan chiqib ketgan kontentni yashiradi', 'Elementni o\'chiradi', 'Scrollbar qo\'shadi'], correctIndex: 1 },
      { question: 'display: none va visibility: hidden farqi?', options: ['Hech farq yo\'q', 'display:none joy olmaydi, visibility:hidden joy oladi', 'visibility:hidden tezroq ishlaydi', 'Faqat rangi farqli'], correctIndex: 1 }
    ]
  },
  {
    title: 'CSS Flexbox testi',
    section: 'CSS',
    questions: [
      { question: 'Flexbox yoqish uchun qaysi CSS qo\'llaniladi?', options: ['display: flex-box', 'display: flex', 'position: flex', 'layout: flex'], correctIndex: 1 },
      { question: 'justify-content nimani boshqaradi?', options: ['Vertikal tekislash', 'Gorizontal tekislash (asosiy o\'q)', 'Elementlar orasidagi masofa', 'Elementlar o\'lchami'], correctIndex: 1 },
      { question: 'align-items nimani boshqaradi?', options: ['Gorizontal tekislash', 'Vertikal tekislash (qarama-qarshi o\'q)', 'Elementlar soni', 'Fon rangi'], correctIndex: 1 },
      { question: 'flex-direction: column nima qiladi?', options: ['Elementlarni chapdan o\'ngga joylaydi', 'Elementlarni yuqoridan pastga joylaydi', 'Elementlarni o\'ngdan chapga joylaydi', 'Elementlarni markazga joylaydi'], correctIndex: 1 },
      { question: 'justify-content: space-between nimani bajaradi?', options: ['Barcha elementlarni markazga', 'Birinchi va oxirgi elementni cheklarga, qolganlarni teng taqsimlaydi', 'Barcha elementlarni teng masofada', 'Elementlarni ustma-ust qo\'yadi'], correctIndex: 1 },
      { question: 'flex-wrap: wrap nima uchun?', options: ['Elementlarni kichraytiradi', 'Elementlar sig\'masa, keyingi qatorga o\'tkazadi', 'Elementlarni berkitadi', 'Flexbox o\'chiradi'], correctIndex: 1 },
      { question: 'flex: 1 nimani bildiradi?', options: ['1 piksel kenglik', 'Mavjud joy bo\'yicha teng ulash', 'Birinchi element', '1 element ko\'rsatish'], correctIndex: 1 },
      { question: 'align-self nima uchun?', options: ["Barcha elementlarni tekislash", 'Bitta elementni vertikal tekislash', 'Elementni yashirish', 'O\'lchamni o\'zgartirish'], correctIndex: 1 },
      { question: 'flex-grow nima qiladi?', options: ["Elementni kichraytiradi", 'Elementning o\'sish koeffitsiyentini belgilaydi', 'Elementni o\'chiradi', 'Rang qo\'shadi'], correctIndex: 1 },
      { question: 'order: -1 nima qiladi?', options: ['Elementni yashiradi', 'Elementni boshqa elementlardan oldinga chiqaradi', 'Elementni oxiriga qo\'yadi', 'Elementni o\'chiradi'], correctIndex: 1 }
    ]
  },
  {
    title: 'CSS Grid testi',
    section: 'CSS',
    questions: [
      { question: 'CSS Grid yoqish uchun qaysi property?', options: ['display: grid-layout', 'display: grid', 'position: grid', 'layout: grid'], correctIndex: 1 },
      { question: 'grid-template-columns: 1fr 1fr 1fr nima beradi?', options: ['3 ta teng ustun', '1 ta katta ustun', '3 ta satr', 'Avtomatik ustunlar'], correctIndex: 0 },
      { question: 'fr birlik nima?', options: ['Pixel', 'Foiz', 'Mavjud joyning ulushi', 'Santimetr'], correctIndex: 2 },
      { question: 'grid-gap nima uchun?', options: ['Elementni yashirish', 'Grid katakchalari orasidagi masofa', 'Chegara kengligi', 'Fon rangi'], correctIndex: 1 },
      { question: 'grid-column: 1 / 3 nima bildiradi?', options: ['1-ustundan 3-ustungacha uzatish', '1 va 3-ustunni tanlash', '3 ta ustun kenglik', '1 ta satr'], correctIndex: 0 },
      { question: 'repeat(3, 1fr) nima qiladi?', options: ['3 ta 1fr ustun yaratadi', '3 ta 1px ustun yaratadi', 'Elementni 3 marta takrorlaydi', '3 satr yaratadi'], correctIndex: 0 },
      { question: 'grid-template-areas nima uchun?', options: ['Rangli hududlar yaratish', 'Nomlangan grid hududlarini belgilash', 'Grid o\'lchamini o\'zgartirish', 'Elementlarni yashirish'], correctIndex: 1 },
      { question: 'auto-fill va auto-fit farqi nima?', options: ['Hech farq yo\'q', 'auto-fill bo\'sh joylarni to\'ldiradi, auto-fit elementlarni kengaytiradi', 'auto-fit tezroq', 'auto-fill faqat mobile uchun'], correctIndex: 1 },
      { question: 'grid-row: span 2 nima qiladi?', options: ['2 ta satrni birlashtiradi', 'Element 2 ta satr balandligini egallaydi', '2-satrga o\'tkazadi', 'Elementni 2 marta ko\'rsatadi'], correctIndex: 1 },
      { question: 'place-items: center nima qiladi?', options: ['Elementlarni chapga joylashtiradi', 'Elementlarni justify-content va align-items: center qiladi', 'Grid markazini o\'zgartiradi', 'Faqat gorizontal markazlaydi'], correctIndex: 1 }
    ]
  },
  {
    title: 'CSS Animatsiyalar testi',
    section: 'CSS',
    questions: [
      { question: 'CSS transition nima uchun?', options: ['Elementni yashirish', 'CSS qiymatlari o\'zgarishida silliq o\'tish', 'Elementni aylantirish', 'Rang o\'zgartirish'], correctIndex: 1 },
      { question: 'transition: all 0.3s ease sintaksis nima bildiradi?', options: ['Barcha property, 0.3 soniya, silliq', 'Barcha element, 3 soniya', 'Faqat rang, 0.3ms', 'Hech nima'], correctIndex: 0 },
      { question: '@keyframes nima uchun?', options: ['Font qo\'shish', 'Animatsiya kadrlarini belgilash', 'Grid yaratish', 'Mediya so\'rovlari'], correctIndex: 1 },
      { question: 'animation-duration nima?', options: ['Animatsiya kechikishi', 'Animatsiya davomiyligi', 'Animatsiya takrorlanishi', 'Animatsiya yo\'nalishi'], correctIndex: 1 },
      { question: 'animation-iteration-count: infinite nima qiladi?', options: ['Animatsiyani bir marta ijro etadi', 'Animatsiyani cheksiz takrorlaydi', 'Animatsiyani to\'xtatadi', 'Animatsiya tezligini oshiradi'], correctIndex: 1 },
      { question: 'transform: rotate(45deg) nima qiladi?', options: ['Elementni 45 piksel yuqoriga siljitadi', 'Elementni 45 darajaga aylantiradi', 'Elementni 45% kattalashtiradi', 'Elementni 45px chapga siljitadi'], correctIndex: 1 },
      { question: 'transform: scale(2) nima qiladi?', options: ['Elementni 2 marta kichraytiradi', 'Elementni 2 marta kattalashtiradi', 'Elementni 2px siljitadi', 'Elementni 2 marta aylantiradi'], correctIndex: 1 },
      { question: 'animation-fill-mode: forwards nima qiladi?', options: ['Animatsiya oldinga qараб boradi', 'Animatsiya tugagandan keyin oxirgi kadr holatini saqlaydi', 'Animatsiyani oldinga tezlashtiradi', 'Animatsiyani boshlang\'ich holatda qoldiradi'], correctIndex: 1 },
      { question: 'CSS transition va animation farqi nima?', options: ['Hech farq yo\'q', 'transition faqat hover uchun, animation mustaqil ishlaydi', 'animation tezroq', 'transition ko\'proq property qo\'llab-quvvatlaydi'], correctIndex: 1 },
      { question: 'will-change: transform nima uchun ishlatiladi?', options: ['Transformni o\'chirish', 'Animatsiyadan oldin brauzerga optimallashtirish uchun signal berish', 'Transformni qayta boshlash', 'Faqat 3D transformlar uchun'], correctIndex: 1 }
    ]
  }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB ga ulandi');

  await Video.deleteMany({ section: 'CSS' });
  await Quiz.deleteMany({ section: 'CSS' });
  console.log('Eski CSS video va quizlar o\'chirildi');

  for (let i = 0; i < videos.length; i++) {
    const video = await Video.create(videos[i]);
    const quiz = await Quiz.create({ ...quizzesByOrder[i], video: video._id });
    console.log(`Video: ${video.title} | Quiz: ${quiz.title}`);
  }

  console.log('\nCSS video va quizlar muvaffaqiyatli yaratildi!');
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err.message); process.exit(1); });
