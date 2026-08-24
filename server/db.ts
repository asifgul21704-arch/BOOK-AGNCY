import { Book, Category, User, Order, Review, Coupon, InventoryLog, AuditLog, StoreSettings } from './types.js';

// Seed Initial Data
const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Quran & Tafseer',
    slug: 'quran-tafseer',
    description: 'Holy Quran copies, translations, word-by-word analysis, and authentic Tafseer commentaries.',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-2',
    name: 'Hadith & Sunnah',
    slug: 'hadith-sunnah',
    description: 'Sahih Al-Bukhari, Sahih Muslim, Sunan collections, Riyad us Saliheen, and Hadith commentaries.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-3',
    name: 'Islamic Studies & Seerah',
    slug: 'islamic-studies-seerah',
    description: 'Prophetic biography (Seerah), Islamic history, fiqh, spirituality, and contemporary Islamic thought.',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-4',
    name: 'Urdu Literature & Novels',
    slug: 'urdu-literature',
    description: 'Masterpieces by Allama Iqbal, Saadat Hasan Manto, Ashfaq Ahmed, Bano Qudsia, and modern Urdu fiction.',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-5',
    name: 'English Literature & Fiction',
    slug: 'english-literature',
    description: 'Classic and contemporary international bestsellers, philosophical literature, and drama.',
    image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-6',
    name: 'Computer & Technology',
    slug: 'computer-technology',
    description: 'Programming, Artificial Intelligence, Web Development, Cloud Computing, and Tech leadership.',
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-7',
    name: 'Self Development & Business',
    slug: 'self-development-business',
    description: 'Productivity, leadership, financial wisdom, habits, entrepreneurship, and personal growth.',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-8',
    name: 'Children’s Islamic & Moral Books',
    slug: 'childrens-books',
    description: 'Illustrated stories of the Prophets, morals, colorful Arabic/Urdu alphabet primers, and fun science.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  },
  {
    id: 'cat-9',
    name: 'Competitive Exam Books (CSS/PMS)',
    slug: 'competitive-exams',
    description: 'Pakistan Affairs, Current Affairs, International Relations, General Science, and past papers.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    status: 'active',
  }
];

const initialBooks: Book[] = [
  {
    id: 'book-1',
    title: 'Tafseer Ibn Kathir (Complete 5 Volumes)',
    slug: 'tafseer-ibn-kathir-complete',
    author: 'Imam Hafiz Ibn Kathir',
    publisher: 'Darussalam Publications',
    isbn: '978-9960-892-71-9',
    category: 'Quran & Tafseer',
    subcategory: 'Tafseer Commentary',
    description: 'The most renowned, authentic, and comprehensive explanation of the Holy Quran in history. Translated with extensive footnotes, cross-references from Sahih Hadith, and linguistic clarifications.',
    price: 6500,
    discountPrice: 5499,
    stock: 24,
    sku: 'DAR-TAF-001',
    images: [
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    language: 'Urdu',
    pages: 3200,
    edition: 'Deluxe Hardcover Edition',
    publicationYear: 2023,
    tags: ['Quran', 'Tafseer', 'Darussalam', 'Islamic Classic', 'Featured'],
    rating: 4.9,
    reviewCount: 42,
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'book-2',
    title: 'Ar-Raheeq Al-Makhtum (The Sealed Nectar)',
    slug: 'ar-raheeq-al-makhtum-sealed-nectar',
    author: 'Safi-ur-Rahman al-Mubarakpuri',
    publisher: 'Maktaba Dar-us-Salam Lahore',
    isbn: '978-9960-899-55-8',
    category: 'Islamic Studies & Seerah',
    subcategory: 'Prophetic Biography',
    description: 'Award-winning authoritative biography of Prophet Muhammad (PBUH) that won first prize in the worldwide Muslim World League competition. A moving, meticulously referenced masterwork.',
    price: 1250,
    discountPrice: 999,
    stock: 85,
    sku: 'MAK-SEER-002',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    language: 'Urdu',
    pages: 680,
    edition: 'Standard Golden Crest',
    publicationYear: 2024,
    tags: ['Seerah', 'Prophet Muhammad', 'History', 'Best Seller', 'Bestseller'],
    rating: 5.0,
    reviewCount: 78,
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-01-12T10:00:00.000Z',
    updatedAt: '2025-01-12T10:00:00.000Z'
  },
  {
    id: 'book-3',
    title: 'Kulliyat-e-Iqbal (Allama Muhammad Iqbal Complete Works)',
    slug: 'kulliyat-e-iqbal-complete-works',
    author: 'Dr. Allama Muhammad Iqbal',
    publisher: 'Iqbal Academy Pakistan',
    isbn: '978-969-416-012-4',
    category: 'Urdu Literature & Novels',
    subcategory: 'Urdu Poetry & Philosophy',
    description: 'Complete poetic works of the Poet of the East, including Bang-e-Dra, Bal-e-Jibril, Zarb-e-Kaleem, and Armughan-e-Hijaz with comprehensive glossary and introductory essays.',
    price: 1850,
    discountPrice: 1450,
    stock: 45,
    sku: 'IQB-KUL-003',
    images: [
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    language: 'Urdu',
    pages: 820,
    edition: 'Collector Gold Embossed',
    publicationYear: 2023,
    tags: ['Iqbal', 'Poetry', 'Urdu Classic', 'Khudi', 'Philosophy'],
    rating: 4.9,
    reviewCount: 39,
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z'
  },
  {
    id: 'book-4',
    title: 'Raja Gidh (Masterpiece Urdu Novel)',
    slug: 'raja-gidh-bano-qudsia',
    author: 'Bano Qudsia',
    publisher: 'Sang-e-Meel Publications',
    isbn: '978-969-35-0112-9',
    category: 'Urdu Literature & Novels',
    subcategory: 'Psychological & Social Fiction',
    description: 'An iconic Urdu novel exploring psychological themes, halal vs haram pursuits, societal desires, and the spiritual erosion of human consciousness.',
    price: 1100,
    discountPrice: 850,
    stock: 50,
    sku: 'SAN-NOVEL-004',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    language: 'Urdu',
    pages: 536,
    edition: '34th Edition',
    publicationYear: 2024,
    tags: ['Novel', 'Bano Qudsia', 'Pakistani Literature', 'Classics'],
    rating: 4.8,
    reviewCount: 31,
    featured: false,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-01-18T10:00:00.000Z',
    updatedAt: '2025-01-18T10:00:00.000Z'
  },
  {
    id: 'book-5',
    title: 'Sahih Al-Bukhari (Urdu Translation - 6 Volumes)',
    slug: 'sahih-al-bukhari-urdu-6-volumes',
    author: 'Imam Muhammad bin Ismail Al-Bukhari',
    publisher: 'Maktaba Quddusia Lahore',
    isbn: '978-969-588-219-0',
    category: 'Hadith & Sunnah',
    subcategory: 'Authentic Hadith',
    description: 'The most authentic book after the Holy Quran. Complete 6-volume set in Arabic text with accurate Urdu translation, chain of narrators analysis, and Hadith chapter summaries.',
    price: 8500,
    discountPrice: 7200,
    stock: 12,
    sku: 'HAD-BUKH-005',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    language: 'Urdu',
    pages: 4800,
    edition: 'Hardcover Gold Leaf',
    publicationYear: 2023,
    tags: ['Hadith', 'Bukhari', 'Islamic Knowledge', 'Sunnah'],
    rating: 5.0,
    reviewCount: 26,
    featured: true,
    bestSeller: false,
    newArrival: true,
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z'
  },
  {
    id: 'book-6',
    title: 'Atomic Habits (Urdu & English Edition)',
    slug: 'atomic-habits-james-clear',
    author: 'James Clear',
    publisher: 'Penguin Random House / Pak Reprints',
    isbn: '978-0735211292',
    category: 'Self Development & Business',
    subcategory: 'Productivity & Habits',
    description: 'An easy & proven way to build good habits and break bad ones. Transform tiny 1% daily changes into remarkable long-term compound results.',
    price: 1350,
    discountPrice: 950,
    stock: 110,
    sku: 'SEL-ATOM-006',
    images: [
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    language: 'English',
    pages: 320,
    edition: 'International Bestseller Edition',
    publicationYear: 2024,
    tags: ['Habits', 'Self Help', 'Productivity', 'Psychology', 'Bestseller'],
    rating: 4.9,
    reviewCount: 95,
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-01-22T10:00:00.000Z',
    updatedAt: '2025-01-22T10:00:00.000Z'
  },
  {
    id: 'book-7',
    title: 'Designing Data-Intensive Applications',
    slug: 'designing-data-intensive-applications',
    author: 'Martin Kleppmann',
    publisher: 'O’Reilly Media',
    isbn: '978-1449373320',
    category: 'Computer & Technology',
    subcategory: 'Software Architecture & Databases',
    description: 'The definitive guide to the software architecture, distributed systems, storage engines, stream processing, and consensus algorithms that power large-scale applications.',
    price: 3400,
    discountPrice: 2890,
    stock: 18,
    sku: 'TECH-DDIA-007',
    images: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&q=80&w=800',
    language: 'English',
    pages: 616,
    edition: '1st Edition (Reprint)',
    publicationYear: 2023,
    tags: ['Software Engineering', 'Databases', 'Cloud', 'System Design'],
    rating: 4.9,
    reviewCount: 19,
    featured: false,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-01-25T10:00:00.000Z',
    updatedAt: '2025-01-25T10:00:00.000Z'
  },
  {
    id: 'book-8',
    title: 'Zaviya (Complete Parts 1, 2 & 3)',
    slug: 'zaviya-ashfaq-ahmed',
    author: 'Ashfaq Ahmed',
    publisher: 'Sang-e-Meel Publications Lahore',
    isbn: '978-969-35-1234-7',
    category: 'Urdu Literature & Novels',
    subcategory: 'Spiritual Essays & Dialogues',
    description: 'The beloved intellectual conversations and spiritual reflections by Sufi intellectual Ashfaq Ahmed on life, compassion, morality, and Pakistani cultural soul.',
    price: 1950,
    discountPrice: 1650,
    stock: 35,
    sku: 'SAN-ZAV-008',
    images: [
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    language: 'Urdu',
    pages: 870,
    edition: 'Complete Tri-Volume Collection',
    publicationYear: 2024,
    tags: ['Ashfaq Ahmed', 'Urdu Literature', 'Sufism', 'Philosophy'],
    rating: 4.9,
    reviewCount: 48,
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-02-01T10:00:00.000Z'
  },
  {
    id: 'book-9',
    title: 'CSS Pakistan Affairs & Current Issues 2026',
    slug: 'css-pakistan-affairs-current-issues',
    author: 'Dr. Ikram ul Haq & Mian Shafiq',
    publisher: 'Jahangir World Times (JWT) Publications',
    isbn: '978-969-603-911-3',
    category: 'Competitive Exam Books (CSS/PMS)',
    subcategory: 'CSS Prep Series',
    description: 'Updated comprehensive syllabus guide covering constitutional developments, foreign policy, socio-economic crises, and strategic geography with analytical essay templates.',
    price: 1600,
    discountPrice: 1280,
    stock: 60,
    sku: 'JWT-CSS-009',
    images: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    language: 'English',
    pages: 640,
    edition: '2026 Revised Edition',
    publicationYear: 2025,
    tags: ['CSS', 'PMS', 'Pakistan Affairs', 'Competitive Exams', 'New Edition'],
    rating: 4.7,
    reviewCount: 22,
    featured: false,
    bestSeller: true,
    newArrival: true,
    createdAt: '2025-02-05T10:00:00.000Z',
    updatedAt: '2025-02-05T10:00:00.000Z'
  },
  {
    id: 'book-10',
    title: 'Stories of the Prophets (Qisas al-Anbiya for Kids)',
    slug: 'stories-of-the-prophets-kids-illustrated',
    author: 'Saniyasnain Khan',
    publisher: 'Goodword Books',
    isbn: '978-8178988573',
    category: 'Children’s Islamic & Moral Books',
    subcategory: 'Illustrated Stories',
    description: 'Beautifully illustrated Islamic stories of Adam, Nuh, Ibrahim, Musa, Isa, and Muhammad (Peace be upon them) with moral lessons and colorful maps.',
    price: 950,
    discountPrice: 750,
    stock: 70,
    sku: 'GWD-KID-010',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    language: 'English',
    pages: 180,
    edition: 'Full Color Glossy Edition',
    publicationYear: 2024,
    tags: ['Kids', 'Islamic Stories', 'Prophets', 'Illustrated', 'Children'],
    rating: 4.9,
    reviewCount: 35,
    featured: false,
    bestSeller: false,
    newArrival: true,
    createdAt: '2025-02-08T10:00:00.000Z',
    updatedAt: '2025-02-08T10:00:00.000Z'
  },
  {
    id: 'book-11',
    title: 'Peer-e-Kamil (The Perfect Mentor)',
    slug: 'peer-e-kamil-umera-ahmed',
    author: 'Umera Ahmed',
    publisher: 'Alif Kitab Publication Lahore',
    isbn: '978-969-938-100-2',
    category: 'Urdu Literature & Novels',
    subcategory: 'Modern Spiritual Romance & Drama',
    description: 'The monumental modern Urdu blockbuster tracing the spiritual quest and transformation of Imama and Salar. Loved by millions across South Asia.',
    price: 1300,
    discountPrice: 990,
    stock: 95,
    sku: 'ALF-NOVEL-011',
    images: [
      'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800',
    language: 'Urdu',
    pages: 620,
    edition: 'Gold Standard Edition',
    publicationYear: 2024,
    tags: ['Umera Ahmed', 'Urdu Novel', 'Bestseller', 'Peer e Kamil'],
    rating: 5.0,
    reviewCount: 110,
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-02-10T10:00:00.000Z',
    updatedAt: '2025-02-10T10:00:00.000Z'
  },
  {
    id: 'book-12',
    title: 'The Psychology of Money',
    slug: 'the-psychology-of-money-morgan-housel',
    author: 'Morgan Housel',
    publisher: 'Harriman House',
    isbn: '978-0857197689',
    category: 'Self Development & Business',
    subcategory: 'Wealth & Decision Making',
    description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn’t necessarily about what you know. It’s about how you behave.',
    price: 1200,
    discountPrice: 890,
    stock: 48,
    sku: 'BUS-PSY-012',
    images: [
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    language: 'English',
    pages: 256,
    edition: 'Paperback Edition',
    publicationYear: 2023,
    tags: ['Money', 'Finance', 'Investing', 'Psychology', 'Business'],
    rating: 4.8,
    reviewCount: 54,
    featured: false,
    bestSeller: true,
    newArrival: false,
    createdAt: '2025-02-12T10:00:00.000Z',
    updatedAt: '2025-02-12T10:00:00.000Z'
  }
];

const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Mawlana Asif Haqani (Director)',
    email: 'admin@maktabahaqanya.pk',
    phone: '+92 300 1234567',
    role: 'Super Admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-manager-1',
    name: 'Muhammad Tariq (Store Manager)',
    email: 'manager@maktabahaqanya.pk',
    phone: '+92 321 7654321',
    role: 'Manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: 'usr-cust-1',
    name: 'Zahid Hussain',
    email: 'customer@gmail.com',
    phone: '+92 333 4567890',
    role: 'Customer',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        fullName: 'Zahid Hussain',
        phone: '+92 333 4567890',
        province: 'Punjab',
        city: 'Lahore',
        area: 'Gulberg III',
        address: 'House # 42, Block L, Near Ghalib Market',
        postalCode: '54000',
        isDefault: true
      }
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

const initialCoupons: Coupon[] = [
  {
    id: 'cp-1',
    code: 'HAQANYA10',
    type: 'percentage',
    value: 10,
    minimumOrder: 1500,
    maximumDiscount: 500,
    expiryDate: '2027-12-31T23:59:59.000Z',
    usageLimit: 1000,
    usedCount: 84,
    active: true
  },
  {
    id: 'cp-2',
    code: 'BOOKWORM15',
    type: 'percentage',
    value: 15,
    minimumOrder: 3000,
    maximumDiscount: 1000,
    expiryDate: '2027-12-31T23:59:59.000Z',
    usageLimit: 500,
    usedCount: 42,
    active: true
  },
  {
    id: 'cp-3',
    code: 'WELCOME200',
    type: 'fixed',
    value: 200,
    minimumOrder: 1200,
    expiryDate: '2027-12-31T23:59:59.000Z',
    usageLimit: 2000,
    usedCount: 163,
    active: true
  }
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MH-2025-9812',
    userId: 'usr-cust-1',
    customerName: 'Zahid Hussain',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+92 333 4567890',
    items: [
      {
        bookId: 'book-2',
        title: 'Ar-Raheeq Al-Makhtum (The Sealed Nectar)',
        author: 'Safi-ur-Rahman al-Mubarakpuri',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
        price: 999,
        quantity: 1,
        totalPrice: 999
      },
      {
        bookId: 'book-6',
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
        price: 950,
        quantity: 1,
        totalPrice: 950
      }
    ],
    shippingAddress: {
      province: 'Punjab',
      city: 'Lahore',
      area: 'Gulberg III',
      address: 'House # 42, Block L, Near Ghalib Market',
      postalCode: '54000',
      instructions: 'Please call before delivery'
    },
    deliveryMethod: 'Standard Delivery',
    subtotal: 1949,
    discount: 195,
    couponCode: 'HAQANYA10',
    deliveryFee: 0, // Free over threshold
    total: 1754,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Shipped',
    trackingNumber: 'TCS-992182741',
    courier: 'TCS Express Pakistan',
    timeline: [
      { status: 'Pending', timestamp: '2025-02-14T09:30:00.000Z', note: 'Order placed by customer via Cash on Delivery' },
      { status: 'Confirmed', timestamp: '2025-02-14T10:15:00.000Z', note: 'Verified by Maktaba Haqanya Order Desk' },
      { status: 'Processing', timestamp: '2025-02-14T12:00:00.000Z', note: 'Book picking from Main Urdu Bazaar Warehouse' },
      { status: 'Packed', timestamp: '2025-02-14T15:30:00.000Z', note: 'Quality checked & water-sealed packed' },
      { status: 'Shipped', timestamp: '2025-02-15T09:00:00.000Z', note: 'Handed over to TCS Express (Tracking: TCS-992182741)' }
    ],
    createdAt: '2025-02-14T09:30:00.000Z',
    updatedAt: '2025-02-15T09:00:00.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'MH-2025-9813',
    userId: 'usr-cust-1',
    customerName: 'Zahid Hussain',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+92 333 4567890',
    items: [
      {
        bookId: 'book-1',
        title: 'Tafseer Ibn Kathir (Complete 5 Volumes)',
        author: 'Imam Hafiz Ibn Kathir',
        coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
        price: 5499,
        quantity: 1,
        totalPrice: 5499
      }
    ],
    shippingAddress: {
      province: 'Punjab',
      city: 'Lahore',
      area: 'Gulberg III',
      address: 'House # 42, Block L, Near Ghalib Market',
      postalCode: '54000'
    },
    deliveryMethod: 'Express Delivery',
    subtotal: 5499,
    discount: 500,
    couponCode: 'HAQANYA10',
    deliveryFee: 150,
    total: 5149,
    paymentMethod: 'Credit/Debit Card (Online)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    trackingNumber: 'LEO-441298102',
    courier: 'Leopard Courier',
    timeline: [
      { status: 'Pending', timestamp: '2025-01-28T14:20:00.000Z', note: 'Order placed with online payment' },
      { status: 'Confirmed', timestamp: '2025-01-28T14:25:00.000Z', note: 'Payment verified successfully via Secure Gateway' },
      { status: 'Shipped', timestamp: '2025-01-29T10:00:00.000Z', note: 'Dispatched via Leopard Express' },
      { status: 'Delivered', timestamp: '2025-01-30T16:45:00.000Z', note: 'Delivered and signed by Zahid Hussain' }
    ],
    createdAt: '2025-01-28T14:20:00.000Z',
    updatedAt: '2025-01-30T16:45:00.000Z'
  }
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    bookId: 'book-1',
    userId: 'usr-cust-1',
    userName: 'Zahid Hussain',
    rating: 5,
    comment: 'SubhanAllah! Excellent printing quality, strong hardcover binding, and crisp font. This Tafseer is a must-have for every Muslim household in Pakistan. Delivery by Maktaba Haqanya was swift.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2025-02-01T12:00:00.000Z'
  },
  {
    id: 'rev-2',
    bookId: 'book-2',
    userId: 'usr-cust-2',
    userName: 'Dr. Bilal Qureshi',
    rating: 5,
    comment: 'The Sealed Nectar is the finest Seerah book ever written. Clear Urdu translation and pristine packaging. Highly recommended bookstore!',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2025-02-04T15:20:00.000Z'
  },
  {
    id: 'rev-3',
    bookId: 'book-3',
    userId: 'usr-cust-3',
    userName: 'Maryam Noor',
    rating: 5,
    comment: 'Kulliyat e Iqbal collection is beautifully printed on premium cream paper. Truly inspiring poetry.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2025-02-07T18:40:00.000Z'
  }
];

const initialSettings: StoreSettings = {
  storeName: 'Maktaba Haqanya',
  tagline: 'Books That Inspire Knowledge',
  logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200',
  storeDescription: 'Premier Pakistani Online Bookstore & Publishing Agency delivering authentic Islamic literature, Urdu poetry, academic texts, international bestsellers, and children books across all cities of Pakistan.',
  phone: '+92 42 37234567',
  whatsapp: '+92 300 8492011',
  email: 'info@maktabahaqanya.pk',
  address: 'Shop # 14-16, Haqanya Book Plaza, Urdu Bazaar',
  city: 'Lahore',
  province: 'Punjab',
  googleMapsUrl: 'https://maps.google.com/maps?q=Urdu+Bazaar+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed',
  openingHours: 'Monday – Saturday: 9:00 AM – 9:30 PM (Friday break 1:00 PM – 2:30 PM)',
  deliveryChargesStandard: 199,
  deliveryChargesExpress: 350,
  freeDeliveryThreshold: 2000,
  currency: 'PKR',
  currencySymbol: 'Rs.',
  socialLinks: {
    facebook: 'https://facebook.com/maktabahaqanya',
    instagram: 'https://instagram.com/maktabahaqanya',
    twitter: 'https://twitter.com/maktabahaqanya',
    youtube: 'https://youtube.com/@maktabahaqanya'
  }
};

const initialInventoryLogs: InventoryLog[] = [
  {
    id: 'inv-1',
    bookId: 'book-1',
    bookTitle: 'Tafseer Ibn Kathir (Complete 5 Volumes)',
    previousStock: 4,
    newStock: 24,
    quantityChanged: 20,
    reason: 'New printing shipment received from Darussalam press',
    adminName: 'Mawlana Asif Haqani',
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'inv-2',
    bookId: 'book-6',
    bookTitle: 'Atomic Habits',
    previousStock: 60,
    newStock: 110,
    quantityChanged: 50,
    reason: 'Stock replenishment for academic seasonal rush',
    adminName: 'Muhammad Tariq',
    createdAt: '2025-01-22T10:00:00.000Z'
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    adminId: 'usr-admin-1',
    adminName: 'Mawlana Asif Haqani',
    action: 'System Initialized',
    details: 'Maktaba Haqanya Bookstore catalog and store rules configured.',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'aud-2',
    adminId: 'usr-admin-1',
    adminName: 'Mawlana Asif Haqani',
    action: 'Coupon Created',
    details: 'Created coupon HAQANYA10 for 10% discount on orders above Rs. 1500.',
    createdAt: '2025-01-05T12:00:00.000Z'
  }
];

// In-Memory Database Store Class
class Database {
  categories: Category[] = [...initialCategories];
  books: Book[] = [...initialBooks];
  users: User[] = [...initialUsers];
  coupons: Coupon[] = [...initialCoupons];
  orders: Order[] = [...initialOrders];
  reviews: Review[] = [...initialReviews];
  settings: StoreSettings = { ...initialSettings };
  inventoryLogs: InventoryLog[] = [...initialInventoryLogs];
  auditLogs: AuditLog[] = [...initialAuditLogs];
  userCarts: Map<string, Array<{ bookId: string; quantity: number }>> = new Map();
  userWishlists: Map<string, string[]> = new Map();

  constructor() {
    // Initial wishlist for demo customer
    this.userWishlists.set('usr-cust-1', ['book-3', 'book-11']);
  }

  // --- Books ---
  getBooks(params: {
    search?: string;
    category?: string;
    author?: string;
    publisher?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    let result = [...this.books];

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          b.publisher.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.category && params.category !== 'all') {
      const catSlug = params.category.toLowerCase().trim();
      const matchedCat = this.categories.find(c => c.slug === catSlug || c.name.toLowerCase() === catSlug);
      const catName = matchedCat ? matchedCat.name : params.category;
      result = result.filter((b) => b.category.toLowerCase() === catName.toLowerCase());
    }

    if (params.author) {
      const auth = params.author.toLowerCase();
      result = result.filter((b) => b.author.toLowerCase().includes(auth));
    }

    if (params.publisher) {
      const pub = params.publisher.toLowerCase();
      result = result.filter((b) => b.publisher.toLowerCase().includes(pub));
    }

    if (params.language) {
      result = result.filter((b) => b.language.toLowerCase() === params.language?.toLowerCase());
    }

    if (params.minPrice !== undefined) {
      result = result.filter((b) => (b.discountPrice || b.price) >= (params.minPrice || 0));
    }

    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      result = result.filter((b) => (b.discountPrice || b.price) <= (params.maxPrice || Infinity));
    }

    if (params.inStock) {
      result = result.filter((b) => b.stock > 0);
    }

    if (params.featured) {
      result = result.filter((b) => b.featured);
    }

    if (params.bestSeller) {
      result = result.filter((b) => b.bestSeller);
    }

    if (params.newArrival) {
      result = result.filter((b) => b.newArrival);
    }

    // Sorting
    switch (params.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'popular':
      case 'best-selling':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = result.length;
    const page = params.page || 1;
    const limit = params.limit || 24;
    const totalPages = Math.ceil(total / limit);
    const paginated = result.slice((page - 1) * limit, page * limit);

    return {
      books: paginated,
      total,
      page,
      totalPages
    };
  }

  getBookByIdOrSlug(idOrSlug: string): Book | undefined {
    return this.books.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
  }

  createBook(bookData: Omit<Book, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }): Book {
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: bookData.createdAt || new Date().toISOString(),
      updatedAt: bookData.updatedAt || new Date().toISOString()
    };
    this.books.unshift(newBook);
    return newBook;
  }

  updateBook(id: string, updates: Partial<Book>): Book | null {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) return null;
    this.books[index] = {
      ...this.books[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.books[index];
  }

  deleteBook(id: string): boolean {
    const lenBefore = this.books.length;
    this.books = this.books.filter((b) => b.id !== id);
    return this.books.length < lenBefore;
  }

  adjustStock(bookId: string, quantityChanged: number, reason: string, adminName: string): Book | null {
    const book = this.books.find((b) => b.id === bookId);
    if (!book) return null;
    const prev = book.stock;
    book.stock = Math.max(0, book.stock + quantityChanged);
    book.updatedAt = new Date().toISOString();

    this.inventoryLogs.unshift({
      id: `inv-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      previousStock: prev,
      newStock: book.stock,
      quantityChanged,
      reason,
      adminName,
      createdAt: new Date().toISOString()
    });

    return book;
  }

  // --- Categories ---
  getCategories(): Category[] {
    return this.categories.map((c) => ({
      ...c,
      bookCount: this.books.filter((b) => b.category.toLowerCase() === c.name.toLowerCase()).length
    }));
  }

  createCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`
    };
    this.categories.push(newCat);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    return this.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const lenBefore = this.categories.length;
    this.categories = this.categories.filter((c) => c.id !== id);
    return this.categories.length < lenBefore;
  }

  // --- Orders ---
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Order {
    const orderNumber = `MH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      orderStatus: 'Pending',
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : orderData.paymentStatus || 'Pending',
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Order registered via ${orderData.paymentMethod}.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct stock
    for (const item of orderData.items) {
      const b = this.books.find((book) => book.id === item.bookId);
      if (b) {
        b.stock = Math.max(0, b.stock - item.quantity);
      }
    }

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus'], note?: string, courier?: string, trackingNumber?: string): Order | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.orderStatus = status;
    if (courier) order.courier = courier;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status}`
    });
    order.updatedAt = new Date().toISOString();
    return order;
  }

  // --- Coupons ---
  validateCoupon(code: string, subtotal: number): { valid: boolean; message: string; discount: number; coupon?: Coupon } {
    const coupon = this.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.active);
    if (!coupon) {
      return { valid: false, message: 'Invalid or inactive promo coupon code', discount: 0 };
    }

    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
      return { valid: false, message: 'This coupon has expired', discount: 0 };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit has been reached', discount: 0 };
    }

    if (subtotal < coupon.minimumOrder) {
      return {
        valid: false,
        message: `Minimum order requirement for this coupon is Rs. ${coupon.minimumOrder.toLocaleString()}`,
        discount: 0
      };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return {
      valid: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      discount,
      coupon
    };
  }

  // --- Audit Log ---
  addAuditLog(adminId: string, adminName: string, action: string, details: string) {
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminId,
      adminName,
      action,
      details,
      createdAt: new Date().toISOString()
    });
  }
}

export const db = new Database();
