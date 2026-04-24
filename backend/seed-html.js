import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/video.model.js';
import { Quiz } from './models/quiz.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const videos = [
  {
    title: 'HTML Kirish — Asosiy tushunchalar',
    description: 'HTML nima, brauzer qanday ishlaydi, birinchi sahifangizni yarating.',
    url: 'https://www.youtube.com/embed/qz0aGYrrlhU',
    section: 'HTML',
    order: 1,
    duration: 720
  },
  {
    title: 'HTML Teglar va Atributlar',
    description: '<div>, <span>, <p>, <a>, <img> va boshqa asosiy teglar.',
    url: 'https://www.youtube.com/embed/PlxWf493en4',
    section: 'HTML',
    order: 2,
    duration: 840
  },
  {
    title: 'HTML Formalar',
    description: '<form>, <input>, <select>, <textarea> — foydalanuvchidan ma\'lumot olish.',
    url: 'https://www.youtube.com/embed/fNcJuPIZ2WE',
    section: 'HTML',
    order: 3,
    duration: 900
  },
  {
    title: 'HTML Jadvallar',
    description: '<table>, <tr>, <td>, <th> — ma\'lumotlarni jadvalda ko\'rsatish.',
    url: 'https://www.youtube.com/embed/iDA0kF5lrVk',
    section: 'HTML',
    order: 4,
    duration: 660
  },
  {
    title: 'HTML Semantik Teglar',
    description: '<header>, <footer>, <nav>, <section>, <article> — zamonaviy HTML5 semantikasi.',
    url: 'https://www.youtube.com/embed/kX3TfdUqpuU',
    section: 'HTML',
    order: 5,
    duration: 780
  }
];

const quizzesByOrder = [
  {
    title: 'HTML Kirish testi',
    section: 'HTML',
    questions: [
      { question: 'HTML qisqartmasi nima?', options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyper Tool Making Language', 'High Text Machine Language'], correctIndex: 0 },
      { question: 'HTML fayli qanday kengaytmaga ega?', options: ['.css', '.html', '.js', '.xml'], correctIndex: 1 },
      { question: 'Birinchi HTML tegi qaysi?', options: ['<body>', '<head>', '<!DOCTYPE html>', '<html>'], correctIndex: 2 },
      { question: 'Sarlavha uchun qaysi teg ishlatiladi?', options: ['<title>', '<head>', '<h1>', '<heading>'], correctIndex: 2 },
      { question: '<html> tegining vazifasi nima?', options: ['Sahifa sarlavhasini belgilaydi', 'Butun HTML hujjatini o\'raydi', 'Uslub qo\'shadi', 'Skript qo\'shadi'], correctIndex: 1 },
      { question: 'Paragraf uchun qaysi teg ishlatiladi?', options: ['<paragraph>', '<p>', '<pg>', '<para>'], correctIndex: 1 },
      { question: 'HTML da izoh qanday yoziladi?', options: ['// izoh', '/* izoh */', '<!-- izoh -->', '** izoh **'], correctIndex: 2 },
      { question: '<head> ichida nima joylashadi?', options: ['Ko\'rinadigan kontent', 'Meta ma\'lumotlar va title', 'Faqat rasmlar', 'Faqat skriptlar'], correctIndex: 1 },
      { question: 'HTML katta-kichik harfga sezgirmi?', options: ['Ha, doim', 'Yo\'q, sezgir emas', 'Faqat atributlar uchun', 'Faqat teg nomlari uchun'], correctIndex: 1 },
      { question: 'HTML da bo\'sh joy (whitespace) qanday ko\'rsatiladi?', options: ['&space;', '&nbsp;', '&#32;', '<space>'], correctIndex: 1 }
    ]
  },
  {
    title: 'HTML Teglar testi',
    section: 'HTML',
    questions: [
      { question: 'Havola (link) uchun qaysi teg ishlatiladi?', options: ['<link>', '<a>', '<href>', '<url>'], correctIndex: 1 },
      { question: '<a> tegida href atributi nimani bildiradi?', options: ['Havola rangi', 'Havola manzili', 'Havola o\'lchami', 'Havola nomi'], correctIndex: 1 },
      { question: 'Rasm kiritish uchun qaysi teg ishlatiladi?', options: ['<picture>', '<photo>', '<img>', '<image>'], correctIndex: 2 },
      { question: '<img> tegida alt atributi nimani bildiradi?', options: ['Rasm o\'lchami', 'Muqobil matn', 'Rasm formati', 'Rasm URL'], correctIndex: 1 },
      { question: '<div> tegi qanday element?', options: ['Inline element', 'Block element', 'Inline-block element', 'Flex element'], correctIndex: 1 },
      { question: '<span> tegi qanday element?', options: ['Block element', 'Inline element', 'Table element', 'Form element'], correctIndex: 1 },
      { question: 'Qalin (bold) matn uchun qaysi teg ishlatiladi?', options: ['<bold>', '<b>', '<strong>', '<b> yoki <strong>'], correctIndex: 3 },
      { question: 'Kursiv (italic) matn uchun qaysi teg ishlatiladi?', options: ['<italic>', '<i> yoki <em>', '<slant>', '<it>'], correctIndex: 1 },
      { question: 'Yangi qator uchun qaysi teg ishlatiladi?', options: ['<newline>', '<ln>', '<br>', '<nl>'], correctIndex: 2 },
      { question: '<ul> tegi nima uchun ishlatiladi?', options: ['Tartibli ro\'yxat', 'Tartiblangan ro\'yxat', 'Tartibsiz ro\'yxat', 'Jadval'], correctIndex: 2 }
    ]
  },
  {
    title: 'HTML Formalar testi',
    section: 'HTML',
    questions: [
      { question: 'Forma yaratish uchun qaysi teg ishlatiladi?', options: ['<input>', '<form>', '<field>', '<data>'], correctIndex: 1 },
      { question: '<input type="text"> nimani bildiradi?', options: ['Parol maydoni', 'Matn kiritish maydoni', 'Raqam maydoni', 'Sana maydoni'], correctIndex: 1 },
      { question: 'Parol maydoni uchun qaysi teg ishlatiladi?', options: ['<input type="secret">', '<input type="password">', '<password>', '<input type="hidden">'], correctIndex: 1 },
      { question: 'Forma ma\'lumotlari qaysi metod bilan yuboriladi?', options: ['Faqat GET', 'Faqat POST', 'GET yoki POST', 'PUT yoki DELETE'], correctIndex: 2 },
      { question: '<label> tegining vazifasi nima?', options: ['Input ni bezatish', 'Input uchun nom/tavsif', 'Input ni bloklash', 'Input ni tozalash'], correctIndex: 1 },
      { question: '<select> tegi nima uchun?', options: ['Rasm tanlash', 'Ochiladigan ro\'yxat', 'Ko\'p tanlov', 'Fayl yuklash'], correctIndex: 1 },
      { question: '<textarea> nima uchun ishlatiladi?', options: ['Bitta qatorli matn', 'Ko\'p qatorli matn', 'Raqam kiritish', 'Sana tanlash'], correctIndex: 1 },
      { question: 'Checkbox uchun qaysi input type ishlatiladi?', options: ['<input type="check">', '<input type="box">', '<input type="checkbox">', '<input type="tick">'], correctIndex: 2 },
      { question: 'Radio tugma uchun qaysi input type?', options: ['<input type="circle">', '<input type="radio">', '<input type="button">', '<input type="select">'], correctIndex: 1 },
      { question: 'Forma yuborish tugmasi uchun qaysi teg?', options: ['<input type="submit">', '<send>', '<button type="post">', '<form-submit>'], correctIndex: 0 }
    ]
  },
  {
    title: 'HTML Jadvallar testi',
    section: 'HTML',
    questions: [
      { question: 'Jadval yaratish uchun qaysi teg?', options: ['<grid>', '<table>', '<matrix>', '<tbl>'], correctIndex: 1 },
      { question: 'Jadval qatori uchun qaysi teg?', options: ['<row>', '<tr>', '<td>', '<th>'], correctIndex: 1 },
      { question: 'Jadval katakchasi uchun qaysi teg?', options: ['<cell>', '<td>', '<tr>', '<tdata>'], correctIndex: 1 },
      { question: 'Jadval sarlavhasi uchun qaysi teg?', options: ['<thead>', '<th>', '<header>', '<title>'], correctIndex: 1 },
      { question: '<th> va <td> farqi nima?', options: ['Rangi farqli', '<th> qalin va markazda, <td> oddiy', 'Hech qanday farq yo\'q', '<td> kattaroq'], correctIndex: 1 },
      { question: 'Jadval chegarasi uchun qaysi atribut?', options: ['line', 'border', 'frame', 'outline'], correctIndex: 1 },
      { question: '<caption> tegi nimani bildiradi?', options: ['Jadval sarlavhasi/izohi', 'Jadval katakchasi', 'Jadval qatori', 'Jadval ustuni'], correctIndex: 0 },
      { question: 'colspan atributi nimani qiladi?', options: ['Ustunlar balandligini oshiradi', 'Bir necha ustunni birlashtiradi', 'Qatorlarni birlashtiradi', 'Jadval chegarasini qo\'shadi'], correctIndex: 1 },
      { question: 'rowspan atributi nimani qiladi?', options: ['Ustunlarni birlashtiradi', 'Bir necha qatorni birlashtiradi', 'Qator balandligini o\'zgartiradi', 'Jadval rangini o\'zgartiradi'], correctIndex: 1 },
      { question: '<tbody> tegi nimaga kerak?', options: ['Jadval boshligini belgilash', 'Jadval asosiy qismini belgilash', 'Jadval pastki qismini belgilash', 'Jadval uslubini belgilash'], correctIndex: 1 }
    ]
  },
  {
    title: 'HTML Semantik Teglar testi',
    section: 'HTML',
    questions: [
      { question: 'Semantik HTML nima?', options: ['Bezatilgan HTML', 'Ma\'noli teglar ishlatilgan HTML', 'Tezkor HTML', 'Kichik hajmli HTML'], correctIndex: 1 },
      { question: '<header> tegi nima uchun?', options: ['Sahifa yoki bo\'lim boshi', 'Sarlavha matn', 'Navigatsiya', 'Asosiy kontent'], correctIndex: 0 },
      { question: '<nav> tegi nima uchun?', options: ['Yangiliklar', 'Navigatsiya havola bloklari', 'Asosiy kontent', 'Yon panel'], correctIndex: 1 },
      { question: '<main> tegi qayerda ishlatiladi?', options: ['Har bir bo\'lim uchun', 'Sahifaning asosiy yagona kontenti uchun', 'Sarlavha uchun', 'Havola uchun'], correctIndex: 1 },
      { question: '<section> va <div> farqi nima?', options: ['Hech farq yo\'q', '<section> ma\'noli (tematik), <div> umumiy wrapper', '<div> kattaroq', '<section> faqat yon panelda'], correctIndex: 1 },
      { question: '<article> tegi nima uchun?', options: ['Jadval uchun', 'Mustaqil tuproq kontent (yangilik, post)', 'Izoh uchun', 'Menyu uchun'], correctIndex: 1 },
      { question: '<aside> tegi nima?', options: ['Asosiy kontentdan ajratilgan yon kontent', 'Havola', 'Sarlavha', 'Jadval'], correctIndex: 0 },
      { question: '<footer> tegi qayerda joylashadi?', options: ['Sahifa boshida', 'Sahifa oxiri/pastida', 'O\'rtada', 'Yon panelda'], correctIndex: 1 },
      { question: 'Qaysi teg SEO uchun muhim?', options: ['<div>', '<span>', '<section>, <article>, <h1>', '<br>'], correctIndex: 2 },
      { question: '<figure> va <figcaption> nimaga kerak?', options: ['Forma yaratish', 'Rasm va uning izohi', 'Jadval va uning sarlavhasi', 'Video va uning izohi'], correctIndex: 1 }
    ]
  }
];

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB ga ulandi');

  // Avvalgi HTML videolaini o'chirish
  await Video.deleteMany({ section: 'HTML' });
  console.log('Eski HTML videolar o\'chirildi');

  // HTML bo'limi uchun quizlarni o'chirish (video bog'langan va section=HTML)
  await Quiz.deleteMany({ section: 'HTML' });
  console.log('Eski HTML quizlar o\'chirildi');

  for (let i = 0; i < videos.length; i++) {
    const video = await Video.create(videos[i]);
    console.log(`Video yaratildi: ${video.title} (${video._id})`);

    const quizData = quizzesByOrder[i];
    const quiz = await Quiz.create({
      ...quizData,
      video: video._id
    });
    console.log(`Quiz yaratildi: ${quiz.title} → video: ${video._id}`);
  }

  console.log('\nBarcha HTML video va quizlar muvaffaqiyatli yaratildi!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Xato:', err.message);
  process.exit(1);
});
