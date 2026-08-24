import { GoogleGenAI } from '@google/genai';
import { db } from './db.js';
import { Book } from './types.js';

// Lazy GenAI initialization
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Database Tool Helpers for AI
export const aiDbTools = {
  searchBooks(query: string) {
    const { books } = db.getBooks({ search: query, limit: 6 });
    return books.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      author: b.author,
      price: b.discountPrice || b.price,
      originalPrice: b.price,
      stock: b.stock,
      inStock: b.stock > 0,
      category: b.category,
      language: b.language,
      coverImage: b.coverImage,
      description: b.description.slice(0, 140) + '...'
    }));
  },

  getBookDetails(idOrTitle: string) {
    const book = db.books.find(
      (b) =>
        b.id === idOrTitle ||
        b.slug === idOrTitle ||
        b.title.toLowerCase().includes(idOrTitle.toLowerCase())
    );
    if (!book) return null;
    return {
      id: book.id,
      title: book.title,
      slug: book.slug,
      author: book.author,
      publisher: book.publisher,
      price: book.discountPrice || book.price,
      originalPrice: book.price,
      stock: book.stock,
      inStock: book.stock > 0,
      category: book.category,
      language: book.language,
      pages: book.pages,
      isbn: book.isbn,
      coverImage: book.coverImage,
      description: book.description
    };
  },

  searchByCategory(categoryName: string) {
    const { books } = db.getBooks({ category: categoryName, limit: 6 });
    return books.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      author: b.author,
      price: b.discountPrice || b.price,
      stock: b.stock,
      coverImage: b.coverImage
    }));
  },

  getStoreInfo() {
    const s = db.settings;
    return {
      storeName: s.storeName,
      tagline: s.tagline,
      address: `${s.address}, ${s.city}, ${s.province}, Pakistan`,
      phone: s.phone,
      whatsapp: s.whatsapp,
      email: s.email,
      openingHours: s.openingHours,
      deliveryCharges: `Standard: Rs. ${s.deliveryChargesStandard} (Free over Rs. ${s.freeDeliveryThreshold}), Express: Rs. ${s.deliveryChargesExpress}`,
      paymentMethods: 'Cash on Delivery (COD) across Pakistan, Online Visa/Mastercard, JazzCash/EasyPaisa bank transfer.'
    };
  },

  getCustomerOrders(emailOrPhone: string) {
    const orders = db.orders.filter(
      (o) =>
        o.customerEmail.toLowerCase() === emailOrPhone.toLowerCase().trim() ||
        o.customerPhone.replace(/[\s-]/g, '').includes(emailOrPhone.replace(/[\s-]/g, ''))
    );
    return orders.map((o) => ({
      orderNumber: o.orderNumber,
      date: o.createdAt.split('T')[0],
      total: `Rs. ${o.total.toLocaleString()}`,
      status: o.orderStatus,
      courier: o.courier || 'Assigned soon',
      trackingNumber: o.trackingNumber || 'Pending dispatch',
      itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0)
    }));
  }
};

// Fallback rule-based smart book assistant when Gemini key is not provided
function smartFallbackAssistant(prompt: string, userEmail?: string): { text: string; recommendedBooks?: Book[] } {
  const p = prompt.toLowerCase();
  const store = aiDbTools.getStoreInfo();

  // Store information questions
  if (p.includes('where') || p.includes('location') || p.includes('address') || p.includes('urdu bazaar') || p.includes('store')) {
    return {
      text: `Maktaba Haqanya is located at **${store.address}**.\n\n🕒 **Opening Hours:** ${store.openingHours}\n📞 **Phone:** ${store.phone} | **WhatsApp:** ${store.whatsapp}\n\nWe also provide fast nationwide delivery across Pakistan with Cash on Delivery!`
    };
  }

  // Delivery & payment questions
  if (p.includes('delivery') || p.includes('shipping') || p.includes('cod') || p.includes('charges') || p.includes('payment')) {
    return {
      text: `📦 **Delivery Information:**\n- **Standard Delivery:** Rs. ${db.settings.deliveryChargesStandard} across Pakistan (2-4 business days).\n- **Free Delivery:** On all orders above **Rs. ${db.settings.freeDeliveryThreshold.toLocaleString()}**!\n- **Payment Methods:** Cash on Delivery (COD), Online Cards, and JazzCash/EasyPaisa.`
    };
  }

  // Order status inquiry
  if (p.includes('order') || p.includes('track') || p.includes('my parcel')) {
    if (userEmail) {
      const orders = aiDbTools.getCustomerOrders(userEmail);
      if (orders.length > 0) {
        const list = orders
          .map(
            (o) =>
              `- **Order ${o.orderNumber}**: Status **${o.status}** (${o.total}). ${o.trackingNumber ? `Courier: ${o.courier} (Tracking: ${o.trackingNumber})` : 'Being prepared in warehouse'}`
          )
          .join('\n');
        return {
          text: `Here are the latest orders associated with your account (${userEmail}):\n\n${list}\n\nYou can also visit the **My Orders** page for the live real-time timeline.`
        };
      }
    }
    return {
      text: `To track your order, please log into your account or provide your Order Number / registered email. Our recent orders ship via TCS and Leopard courier with live SMS & tracking updates.`
    };
  }

  // Price inquiry for specific book
  if (p.includes('price') || p.includes('how much') || p.includes('cost')) {
    const searchTerms = p.replace(/(price|how much|cost|of|the|book|is|in|pkr|rs|\?)/gi, '').trim();
    if (searchTerms.length > 2) {
      const { books } = db.getBooks({ search: searchTerms, limit: 3 });
      if (books.length > 0) {
        const top = books[0];
        return {
          text: `The book **"${top.title}"** by ${top.author} is priced at **Rs. ${(top.discountPrice || top.price).toLocaleString()}** ${top.discountPrice ? `(Discounted from Rs. ${top.price.toLocaleString()})` : ''}. Current stock status: **${top.stock > 0 ? `${top.stock} copies in stock` : 'Out of stock'}**.`,
          recommendedBooks: books
        };
      }
    }
  }

  // Category or keyword book recommendations
  let searchCat = '';
  if (p.includes('quran') || p.includes('tafseer')) searchCat = 'Quran & Tafseer';
  else if (p.includes('hadith') || p.includes('bukhari') || p.includes('sunnah')) searchCat = 'Hadith & Sunnah';
  else if (p.includes('seerah') || p.includes('prophet') || p.includes('islamic')) searchCat = 'Islamic Studies & Seerah';
  else if (p.includes('iqbal') || p.includes('urdu') || p.includes('novel') || p.includes('literature') || p.includes('umera') || p.includes('bano')) searchCat = 'Urdu Literature & Novels';
  else if (p.includes('computer') || p.includes('programming') || p.includes('javascript') || p.includes('tech') || p.includes('coding')) searchCat = 'Computer & Technology';
  else if (p.includes('css') || p.includes('pms') || p.includes('exam')) searchCat = 'Competitive Exam Books (CSS/PMS)';
  else if (p.includes('habit') || p.includes('money') || p.includes('business') || p.includes('self')) searchCat = 'Self Development & Business';
  else if (p.includes('kid') || p.includes('child')) searchCat = 'Children’s Islamic & Moral Books';

  const queryParams = searchCat ? { category: searchCat, limit: 4 } : { search: p.replace(/[?.,!]/g, ''), limit: 4 };
  const { books } = db.getBooks(queryParams);

  if (books.length > 0) {
    return {
      text: `We have several excellent books matching your request in **Maktaba Haqanya**:`,
      recommendedBooks: books
    };
  }

  // Default helpful response
  const featured = db.books.filter((b) => b.featured).slice(0, 4);
  return {
    text: `Assalamu Alaikum! Welcome to **Maktaba Haqanya**. I am your AI Bookstore Assistant.\n\nI can help you search our catalog of Islamic literature, Urdu poetry, academic books, check live stock, view prices in PKR, and answer questions regarding store delivery. Here are some of our top recommended titles:`,
    recommendedBooks: featured
  };
}

export async function processAIChat(prompt: string, userEmail?: string): Promise<{ text: string; recommendedBooks: Book[] }> {
  const genAI = getGenAI();

  // If no Gemini key is provided, use our intelligent bookstore solver
  if (!genAI) {
    const fallback = smartFallbackAssistant(prompt, userEmail);
    return {
      text: fallback.text,
      recommendedBooks: fallback.recommendedBooks || []
    };
  }

  try {
    const store = aiDbTools.getStoreInfo();
    const booksCatalogSummary = db.books
      .map(
        (b) =>
          `[ID: ${b.id}, Title: "${b.title}", Author: ${b.author}, Category: ${b.category}, Price: Rs. ${b.discountPrice || b.price}, Stock: ${b.stock}]`
      )
      .join('\n');

    let userOrderContext = 'No customer email provided';
    if (userEmail) {
      const orders = aiDbTools.getCustomerOrders(userEmail);
      userOrderContext = JSON.stringify(orders);
    }

    const systemPrompt = `You are the official Haqanya AI Assistant for "Maktaba Haqanya" (a premier online Pakistani Islamic & Urdu bookstore based in Urdu Bazaar Lahore).
Your goal is to warmly, accurately, and politely assist customers.
Key Guidelines:
1. Always use authentic PKR prices and current stock from the database catalog below.
2. NEVER invent book titles, prices, orders, or fake delivery policies.
3. Delivery policy: Standard Rs. ${db.settings.deliveryChargesStandard}, Free delivery over Rs. ${db.settings.freeDeliveryThreshold.toLocaleString()}, Express Rs. ${db.settings.deliveryChargesExpress}.
4. Store address: ${store.address}, Phone: ${store.phone}, WhatsApp: ${store.whatsapp}.
5. If the user asks for book suggestions, recommend specific matching books from the catalog and include their book IDs in a JSON block at the very end formatted as:
\`\`\`json
{"recommendedBookIds": ["book-1", "book-2"]}
\`\`\`

Current Bookstore Catalog:
${booksCatalogSummary}

Authenticated Customer Orders Context (${userEmail || 'Guest'}):
${userOrderContext}
`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    const rawText = response.text || '';
    let cleanText = rawText;
    let recommendedIds: string[] = [];

    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed.recommendedBookIds)) {
          recommendedIds = parsed.recommendedBookIds;
        }
        cleanText = rawText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch {
        // ignore parse error
      }
    }

    // Lookup books
    let recommendedBooks: Book[] = [];
    if (recommendedIds.length > 0) {
      recommendedBooks = db.books.filter((b) => recommendedIds.includes(b.id));
    }

    // If text mentions specific book titles, extract them
    if (recommendedBooks.length === 0) {
      for (const b of db.books) {
        if (cleanText.toLowerCase().includes(b.title.toLowerCase().slice(0, 15))) {
          recommendedBooks.push(b);
          if (recommendedBooks.length >= 4) break;
        }
      }
    }

    return {
      text: cleanText,
      recommendedBooks
    };
  } catch (error) {
    console.error('Gemini API call failed, falling back to smart solver:', error);
    const fallback = smartFallbackAssistant(prompt, userEmail);
    return {
      text: fallback.text,
      recommendedBooks: fallback.recommendedBooks || []
    };
  }
}
