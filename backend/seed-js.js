import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/video.model.js';
import { Quiz } from './models/quiz.model.js';

dotenv.config();

const videos = [
  {
    title: 'JavaScript Kirish — Asoslar',
    description: 'JS nima, brauzerda qanday ishlaydi, o\'zgaruvchilar: var, let, const.',
    url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
    section: 'JavaScript',
    order: 1,
    duration: 840
  },
  {
    title: 'JavaScript Funksiyalar',
    description: 'function declaration, arrow function, parametrlar, return.',
    url: 'https://www.youtube.com/embed/xUI5Tsl2JpY',
    section: 'JavaScript',
    order: 2,
    duration: 780
  },
  {
    title: 'JavaScript Massivlar va Obyektlar',
    description: 'Array metodlari: map, filter, reduce. Object va destructuring.',
    url: 'https://www.youtube.com/embed/oigfaZ5ApsM',
    section: 'JavaScript',
    order: 3,
    duration: 960
  },
  {
    title: 'JavaScript DOM Manipulyatsiya',
    description: 'getElementById, querySelector, event listener, innerHTML.',
    url: 'https://www.youtube.com/embed/5fb2aPlgoys',
    section: 'JavaScript',
    order: 4,
    duration: 900
  },
  {
    title: 'JavaScript Async/Await va Fetch',
    description: 'Promise, async/await, fetch API bilan HTTP so\'rovlar.',
    url: 'https://www.youtube.com/embed/PoRJizFvM7s',
    section: 'JavaScript',
    order: 5,
    duration: 1020
  }
];

const quizzesByOrder = [
  {
    title: 'JavaScript Kirish testi',
    section: 'JavaScript',
    questions: [
      { question: 'JavaScript qayerda ishlaydi?', options: ['Faqat serverda', 'Brauzerda va Node.js da', 'Faqat brauzerda', 'Faqat kompyuterda'], correctIndex: 1 },
      { question: 'O\'zgaruvchi e\'lon qilishning zamonaviy usuli qaysi?', options: ['var x = 5', 'let x = 5 yoki const x = 5', 'variable x = 5', 'int x = 5'], correctIndex: 1 },
      { question: 'const va let farqi nima?', options: ['Hech farq yo\'q', 'const qayta o\'zlashtiriб bo\'lmaydi, let bo\'ladi', 'let tezroq ishlaydi', 'const faqat raqamlar uchun'], correctIndex: 1 },
      { question: 'JS da matn birlashtirish uchun qaysi operator?', options: ['&', '+', '-', '*'], correctIndex: 1 },
      { question: '=== operatori nima tekshiradi?', options: ['Faqat qiymatni', 'Qiymat va turini', 'Faqat turini', 'Hech narsani'], correctIndex: 1 },
      { question: 'typeof "hello" nima qaytaradi?', options: ['"text"', '"string"', '"char"', '"word"'], correctIndex: 1 },
      { question: 'JS da boolean qiymatlari qaysilar?', options: ['true/false', '1/0', 'yes/no', 'on/off'], correctIndex: 0 },
      { question: 'console.log() nima uchun?', options: ['Xato berish', 'Konsolga chiqarish', 'O\'zgaruvchi yaratish', 'Funksiya chaqirish'], correctIndex: 1 },
      { question: 'JS da izoh qanday yoziladi?', options: ['<!-- izoh -->', '/* izoh */ yoki // izoh', '** izoh **', '## izoh'], correctIndex: 1 },
      { question: 'undefined va null farqi?', options: ['Hech farq yo\'q', 'undefined — qiymatsiz, null — ataylab bo\'sh qilingan', 'null — qiymatsiz, undefined — bo\'sh', 'Ikkalasi ham xato'], correctIndex: 1 }
    ]
  },
  {
    title: 'JavaScript Funksiyalar testi',
    section: 'JavaScript',
    questions: [
      { question: 'Funksiya qanday e\'lon qilinadi?', options: ['create greet() {}', 'function greet() {}', 'def greet() {}', 'void greet() {}'], correctIndex: 1 },
      { question: 'Arrow function sintaksisi?', options: ['function() =>', '() -> {}', '() => {}', 'func() {}'], correctIndex: 2 },
      { question: 'return nima qiladi?', options: ['Funksiyani to\'xtatadi', 'Qiymat qaytaradi va funksiyadan chiqadi', 'Yangi funksiya yaratadi', 'Parametr qabul qiladi'], correctIndex: 1 },
      { question: 'Default parametr nima?', options: ['Majburiy parametr', 'Qiymat berilmasa ishlaydigan standart qiymat', 'Ohirgi parametr', 'Raqam parametr'], correctIndex: 1 },
      { question: 'Callback funksiya nima?', options: ['O\'z-o\'zini chaqiradigan funksiya', 'Argument sifatida beriladigan funksiya', 'Async funksiya', 'Server funksiyasi'], correctIndex: 1 },
      { question: 'Closure nima?', options: ['Xato tanlash', 'Ichki funksiyaning tashqi scope ga kirish imkoni', 'Funksiyani yopish', 'Modul yaratish'], correctIndex: 1 },
      { question: 'IIFE nima?', options: ['Darhol chaqiriladigan funksiya ifodasi', 'Iteratsiya funksiyasi', 'Import funksiyasi', 'Ichki funksiya'], correctIndex: 0 },
      { question: 'arguments objekti nima?', options: ['Funksiya nomlari', 'Funksiyaga uzatilgan barcha argumentlar', 'Global o\'zgaruvchilar', 'Xato xabarlari'], correctIndex: 1 },
      { question: '...rest parametri nima qiladi?', options: ['Qolgan barcha argumentlarni massivga yig\'adi', 'Bitta parametr qabul qiladi', 'Funksiyani yoyadi', 'Default qiymat beradi'], correctIndex: 0 },
      { question: 'Higher-order function nima?', options: ['Murakkab funksiya', 'Funksiya qabul qiladigan yoki qaytaradigan funksiya', 'Tezkor funksiya', 'Global funksiya'], correctIndex: 1 }
    ]
  },
  {
    title: 'Massivlar va Obyektlar testi',
    section: 'JavaScript',
    questions: [
      { question: 'Array yaratish usuli?', options: ['array(1,2,3)', '[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)'], correctIndex: 1 },
      { question: 'map() metodi nima qiladi?', options: ['Massivni filtrlaydi', 'Har bir element bo\'yicha yangi massiv qaytaradi', 'Elementlarni qo\'shadi', 'Massivni saralaydi'], correctIndex: 1 },
      { question: 'filter() metodi nima qaytaradi?', options: ['Bitta element', 'Shartni qanoatlantirgan elementlar massivi', 'Elementlar soni', 'Birinchi element'], correctIndex: 1 },
      { question: 'reduce() metodi nima qiladi?', options: ['Massiv elementlarini o\'chiradi', 'Massivni bitta qiymatga qisqartiradi', 'Massivni kattalashtiradi', 'Massivni tartiblaydi'], correctIndex: 1 },
      { question: 'push() va pop() farqi?', options: ['Hech farq yo\'q', 'push() oxiriga qo\'shadi, pop() oxiridan olib tashlaydi', 'pop() qo\'shadi, push() olib tashlaydi', 'Ikkalasi ham qidiradi'], correctIndex: 1 },
      { question: 'Obyekt yaratish usuli?', options: ['object { key: value }', '{ key: value }', '(key: value)', '[key: value]'], correctIndex: 1 },
      { question: 'Destructuring nima?', options: ['Obyektni o\'chirish', 'Obyekt/massivdan o\'zgaruvchi ajratib olish', 'Yangi obyekt yaratish', 'Obyektni nusxalash'], correctIndex: 1 },
      { question: 'Spread operator (...) nima qiladi?', options: ['Massiv/obyektni yoyadi', 'Elementlarni yig\'adi', 'Elementlarni o\'chiradi', 'Tip tekshiradi'], correctIndex: 0 },
      { question: 'find() va findIndex() farqi?', options: ['Hech farq yo\'q', 'find() elementni, findIndex() indeksini qaytaradi', 'findIndex() elementni qaytaradi', 'Ikkalasi ham bir xil qaytaradi'], correctIndex: 1 },
      { question: 'Object.keys() nima qaytaradi?', options: ['Qiymatlar massivi', 'Kalitlar massivi', 'Juftliklar massivi', 'Boolean'], correctIndex: 1 }
    ]
  },
  {
    title: 'JavaScript DOM testi',
    section: 'JavaScript',
    questions: [
      { question: 'DOM nima?', options: ['Data Object Model', 'Document Object Model', 'Design Object Method', 'Dynamic Object Model'], correctIndex: 1 },
      { question: 'getElementById() nima qaytaradi?', options: ['Barcha elementlar', 'Bitta element', 'Elementlar massivi', 'Matn'], correctIndex: 1 },
      { question: 'querySelector() va getElementById() farqi?', options: ['Hech farq yo\'q', 'querySelector CSS selector qabul qiladi', 'getElementById tezroq', 'querySelector faqat class uchun'], correctIndex: 1 },
      { question: 'addEventListener() nima qiladi?', options: ['Elementni o\'chiradi', 'Voqeani tinglaydi', 'Yangi element yaratadi', 'CSS qo\'shadi'], correctIndex: 1 },
      { question: 'innerHTML va textContent farqi?', options: ['Hech farq yo\'q', 'innerHTML HTML teglarini qabul qiladi, textContent qilmaydi', 'textContent tezroq emas', 'innerHTML xavfsizroq'], correctIndex: 1 },
      { question: 'createElement() nima qiladi?', options: ['Mavjud elementni tanlaydi', 'Yangi HTML element yaratadi', 'Elementni o\'chiradi', 'Event qo\'shadi'], correctIndex: 1 },
      { question: 'appendChild() nima qiladi?', options: ['Bolalar elementini o\'chiradi', 'Ota elementga bola qo\'shadi', 'Elementni nusxalaydi', 'Elementni ko\'chiradi'], correctIndex: 1 },
      { question: 'event.preventDefault() nima qiladi?', options: ['Eventni o\'chiradi', 'Standart brauzer harakatini bloklaydi', 'Eventni qaytaradi', 'Yangi event yaratadi'], correctIndex: 1 },
      { question: 'classList.add() nima qiladi?', options: ['Klassni o\'chiradi', 'Elementga CSS klass qo\'shadi', 'Yangi element yaratadi', 'Klassni tekshiradi'], correctIndex: 1 },
      { question: 'event bubbling nima?', options: ['Event faqat bir elementda ishlaydi', 'Event bola elementdan ota elementga ko\'tariladi', 'Event yuqoridan pastga tushadi', 'Event hech qaerga tarqalmaydi'], correctIndex: 1 }
    ]
  },
  {
    title: 'Async/Await va Fetch testi',
    section: 'JavaScript',
    questions: [
      { question: 'Promise nima?', options: ['Sinxron operatsiya', 'Kelajakdagi qiymatni ifodalovchi obyekt', 'Xato ko\'rsatkichi', 'Funksiya turi'], correctIndex: 1 },
      { question: 'async funksiya nima qaytaradi?', options: ['Doim string', 'Doim Promise', 'Doim array', 'Doim undefined'], correctIndex: 1 },
      { question: 'await nima qiladi?', options: ['Funksiyani to\'xtatadi', 'Promise ni kutadi va natijasini oladi', 'Xatoni ushlaydi', 'Funksiya chaqiradi'], correctIndex: 1 },
      { question: 'try/catch nima uchun?', options: ['Kod tezlashtirish', 'Xatolarni ushlash va boshqarish', 'Async funksiya yaratish', 'Promise yaratish'], correctIndex: 1 },
      { question: 'fetch() nima qaytaradi?', options: ['To\'g\'ridan ma\'lumot', 'Promise<Response>', 'JSON', 'String'], correctIndex: 1 },
      { question: 'response.json() nima qiladi?', options: ['Response ni matn qiladi', 'Response body ni JSON ga parse qiladi', 'HTTP status tekshiradi', 'Xatoni chiqaradi'], correctIndex: 1 },
      { question: 'Promise.all() nima qiladi?', options: ['Birinchi promise ni kutadi', 'Barcha promise larni parallel kutadi', 'Eng tez promise ni qaytaradi', 'Xatoni ushlaydi'], correctIndex: 1 },
      { question: '.then() nima uchun?', options: ['Xatoni ushlash', 'Promise muvaffaqiyatli bo\'lganda ishlash', 'Promise yaratish', 'Kutish'], correctIndex: 1 },
      { question: '.catch() nima uchun?', options: ['Muvaffaqiyatli holat', 'Promise xato bo\'lganda ishlash', 'Kutish', 'Yangi Promise'], correctIndex: 1 },
      { question: 'fetch API da POST so\'rov qanday yuboriladi?', options: ['fetch(url)', 'fetch(url, { method: "POST", body: ... })', 'fetch.post(url, data)', 'post(url, data)'], correctIndex: 1 }
    ]
  }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB ga ulandi');

  await Video.deleteMany({ section: 'JavaScript' });
  await Quiz.deleteMany({ section: 'JavaScript' });
  console.log('Eski JavaScript video va quizlar o\'chirildi');

  for (let i = 0; i < videos.length; i++) {
    const video = await Video.create(videos[i]);
    const quiz = await Quiz.create({ ...quizzesByOrder[i], video: video._id });
    console.log(`Video: ${video.title} | Quiz: ${quiz.title}`);
  }

  console.log('\nJavaScript video va quizlar muvaffaqiyatli yaratildi!');
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err.message); process.exit(1); });
