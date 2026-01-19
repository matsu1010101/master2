'use client'; 

import { useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { menuData, type Language } from '../../data';

// --- ★追加: 画像に基づいた関連商品マッピング（日本語名定義） ---
const relatedMap: Record<string, string[]> = {
  '醤油ラーメン': ['味玉', '餃子', 'チャーハン', 'ウーロン茶'],
  '塩ラーメン': ['味玉', '餃子', 'チャーシュー丼', 'ウーロン茶'],
  '味噌ラーメン': ['味玉', '餃子', 'チャーハン', 'ウーロン茶'],
  '餃子': ['チャーハン'],
  'チャーハン': ['餃子'],
  'チャーシュー丼': ['ウーロン茶'],
  'もやしラーメン': ['ウーロン茶', 'オレンジジュース'],
  '野菜味噌ラーメン': ['味玉', '餃子', 'チャーシュー丼', 'ウーロン茶'],
};

  // --- UIテキスト定義 (エラー箇所を修正済み) ---
  const uiTexts = {
    ja: { relatedTitle: 'こちらもおすすめ', notFound: '商品が見つかりません', back: '一覧に戻る', price: '価格', allergy: 'アレルギー物質', category: 'カテゴリー', info: '商品詳細', review: 'レビュー', noReview: 'レビューはまだありません。' },
    en: { relatedTitle: 'You may also like', notFound: 'Item not found', back: 'Back', price: 'Price', allergy: 'Allergens', category: 'Category', info: 'Details', review: 'Reviews', noReview: 'No reviews yet.' },
    zh: { relatedTitle: '您可能还喜欢', notFound: '商品未找到', back: '返回', price: '价格', allergy: '过敏原', category: '类别', info: '商品详情', review: '评论', noReview: '暂无评论。' },
    hi: { relatedTitle:'आपको यह भी पसंद आ सकता है' , notFound:'आइटम नहीं मिला' , back:'वापस' , price:'कीमत' , allergy:'एलर्जी' , category:'श्रेणी' , info:'विवरण' , review:'समीक्षा' , noReview:'अभी तक कोई समीक्षा नहीं।' },
    es: { relatedTitle:'También te puede interesar' , notFound:'Producto no encontrado' , back:'Volver' , price:'Precio' , allergy:'Alérgenos' , category:'Categoría' , info:'Detalles' , review:'Reseñas' , noReview:'Aún no hay reseñas.' },
    fr:{ relatedTitle:"Vous aimerez aussi", notFound:"Produit introuvable" , back:"Retour" , price:"Prix" , allergy:"Allergènes" , category:"Catégorie" , info:"Détails" , review:"Avis" , noReview:"Pas encore d\'avis." },
  };

  const allergyTexts = {
  ja: {
    cate:{Ramen:'ラーメン',SideDish:'サイドディッシュ',Drink:'ドリンク',Topping:'トッピング'},
    items: { wheat: '小麦', egg: '卵', soy: '大豆' }
  },

  en: {
    cate:{Ramen:'Ramen',SideDish:'Side Dish',Drink:'Drink',Topping:'Topping'},
    items: { wheat: 'Wheat', egg: 'Egg', soy: 'Soy' }
  },

  zh: {
    cate:{Ramen:'拉面',SideDish:'配菜',Drink:'饮料',Topping:'配料'},
    items: { wheat: '小麦', egg: '鸡蛋', soy: '大豆' },
  },

  hi: {
    cate:{Ramen:'रामेन',SideDish:'साइड डिश',Drink:'पेय',Topping:'टॉपिंग'},
    items: { wheat: 'गेहूं', egg: 'अंडा', soy: 'सोया' },
  },

  fr: {
    cate:{Ramen:'Ramen',SideDish:'Accompagnement',Drink:'Boisson',Topping:'Garniture'},
    items: { wheat: 'Blé', egg: 'Œuf', soy: 'Soja' },
  },

  es: {
    cate:{Ramen:'Ramen',SideDish:'Acompañamiento',Drink:'Bebida',Topping:'Aderezo'},
    items: { wheat: 'Trigo', egg: 'Huevo', soy: 'Soja' },
  },
  };


export default function MenuDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // タブの状態管理 ('info' = 詳細情報, 'review' = レビュー)
  const [activeTab, setActiveTab] = useState<'info' | 'review'>('info');

  const id = params.id as string;
  const lang = searchParams.get('lang');
  
   // 言語を判定（デフォルトは日本語）
  const currentLang = (lang === 'en' || lang === 'zh' || lang === 'hi' || lang === 'es' || lang === 'fr' ? lang : 'ja') as Language;
  
  // 該当する言語のデータリストを取得
  const dataList = menuData[currentLang];
  // 該当する言語のテキストを取得
  const texts = uiTexts[currentLang];

  if (!dataList) {
      return <div style={styles.errorText}>Data Error</div>;
  }

  // 商品を検索
  const member = dataList.find(m => m.id === id);

  if (!member) {
    return (
      <div style={styles.notFoundContainer}>
        <h1 style={styles.notFoundTitle}>{texts.notFound}</h1>
        <div style={{ marginTop: '20px' }}>
          <Link href={`/?lang=${currentLang}`} style={styles.backLinkSimple}>
            {texts.back}
          </Link>
        </div>
      </div>
    );
  }

  // --- ★変更ロジック: 画像指定に基づいた関連商品取得 ---
  // 1. まず日本語データリストを取得（マッピングのキーが日本語名のため）
  const jaList = menuData['ja'];
  
  // 2. 現在の商品の「日本語版」を見つける（IDで照合）
  const jaMember = jaList.find(m => m.id === id);
  
  let relatedMembers: typeof dataList = [];

  if (jaMember) {
    // 3. マッピングから関連する日本語名のリストを取得
    const targetNames = relatedMap[jaMember.name] || [];

    // 4. 日本語名からIDのリストを抽出
    const targetIds = jaList
      .filter(m => targetNames.includes(m.name))
      .map(m => m.id);

    // 5. 現在の言語のリストから、そのIDを持つ商品をフィルタリング
    // (順番をマッピング通りにするため、targetIds順にfindする)
    relatedMembers = targetIds
      .map(tid => dataList.find(item => item.id === tid))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
  }
  // --- 変更ロジック終了 ---


  const t = uiTexts[currentLang];
  const alle = allergyTexts[currentLang];


  
  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        
        {/* 戻るボタンエリア（追尾ヘッダー） */}
        <div style={styles.navBar}>
          <Link href={`/?lang=${currentLang}`} style={styles.backButton}>
              ← {texts.back}
          </Link>
        </div>
    <main style={styles.container}>
      <div style={styles.card}>


        {/* 基本情報エリア */}
        <div style={styles.headerSection}>
          <img src={member.image} alt={member.name} style={styles.mainImage} />
          <div style={styles.titleBox}>
            <span style={styles.idLabel}>No.{member.id}</span>
            <h1 style={styles.title}>{member.name}</h1>
            <p style={styles.priceTag}>¥{member.price.toLocaleString()}</p>
          </div>
        </div>

        {/* タブ切り替えボタン */}
        <div style={styles.tabBar}>
          <button 
            onClick={() => setActiveTab('info')} 
            style={activeTab === 'info' ? styles.activeTab : styles.tab}
          >
            {t.info}
          </button>
          <button 
            onClick={() => setActiveTab('review')} 
            style={activeTab === 'review' ? styles.activeTab : styles.tab}
          >
            {t.review}
          </button>
        </div>

        {/* コンテンツ表示エリア */}
        <div style={styles.contentBody}>
          {activeTab === 'info' ? (
            <div style={styles.infoContent}>
              <p style={styles.description}>{member.description}</p>
              <div style={styles.specGrid}>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>{t.category}</span>
                  <span style={styles.specValue}>{alle.cate[member.category]}</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>{t.allergy}</span>
                  {member.allergy.map((item) => (
                    <span key={item} style={styles.specValue}>
                      {alle.items[item]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.reviewContent}>
              {member.reviews && member.reviews.length > 0 ? (
                member.reviews.map((rev, i) => (
                  <div key={i} style={styles.reviewCard}>
                    <span style={styles.quoteMark}>“</span>
                    {rev}
                  </div>
                ))
              ) : (
                <p style={styles.emptyText}>{t.noReview}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
    {/* 関連商品セクション */}
    {relatedMembers.length > 0 && (
      <div style={styles.relatedSection}>
        <div style={styles.divider}></div>
        <h3 style={styles.relatedTitle}>{texts.relatedTitle}</h3>
        
        <div style={styles.relatedGrid}>
          {relatedMembers.map((related) => (
            <Link 
              key={related.id} 
              href={`/menu/${related.id}?lang=${currentLang}`}
              style={styles.relatedCardLink}
            >
              <div style={styles.relatedCard}>
                <img src={related.image} alt={related.name} style={styles.relatedImage} />
                <div style={styles.relatedInfo}>
                  <span style={styles.relatedName}>{related.name}</span>
                  <span style={styles.relatedPrice}>¥{related.price.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}
          </div>
    </div>

  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f0c0c', color: '#e0dcd0', padding: '20px', display: 'flex', justifyContent: 'center' },
  card: { width: '100%', maxWidth: '900px', backgroundColor: '#1a0505', border: '1px solid #3e1010', padding: '30px', borderRadius: '4px' },
  navHeader: { marginBottom: '25px' },
  backButton: { color: '#d4af37', textDecoration: 'none', border: '1px solid #d4af37', padding: '6px 15px', borderRadius: '2px', fontSize: '0.85rem' },
  headerSection: { flexDirection: 'column'as const, display: 'flex', gap: '25px', alignItems: 'center', marginBottom: '35px' },
  mainImage: { width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #d4af37', objectFit: 'cover' as const },
  titleBox: { flex: 1 },
  idLabel: { color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' },
  title: { fontSize: '2rem', margin: '5px 0', color: '#fff' },
  priceTag: { fontSize: '1.4rem', color: '#d4af37', fontWeight: 'bold' },
  divider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(90deg, #d4af37 0%, transparent 100%)', 
    marginBottom: '30px',
  },

  // ページ全体（背景：グラデーション）
  pageContainer: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top right, #2b0a0a 0%, #000000 100%)',
    color: '#e0dcd0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: 'var(--font-noto-serif), serif',
  },
  // コンテンツ幅制限のラッパー
  contentWrapper: {
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: 'rgba(20, 20, 20, 0.8)', // 半透明の黒背景
    border: '1px solid #3e1010',
    borderRadius: '8px',
    padding: '40px', 
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
    position: 'relative' as const,
  },
  // ナビゲーション（追尾ヘッダー）
  navBar: {
    position: 'sticky' as const, 
    top: '0',                    
    zIndex: 100,                 
    backgroundColor: 'rgba(20, 20, 20, 0.95)', 
    borderBottom: '1px solid #3e1010', 
    margin: '-40px -40px 40px -40px', 
    padding: '20px 40px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
   // --- 関連商品エリア ---
  relatedSection: {
    marginTop: '60px',
    paddingTop: '20px',
  },
  relatedTitle: {
    fontSize: '1.5rem',
    color: '#d4af37',
    marginBottom: '24px',
    textAlign: 'center' as const,
    letterSpacing: '0.1em',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
    gap: '20px',
  },
  relatedCardLink: {
    textDecoration: 'none',
    display: 'block',
  },
  relatedCard: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: '1px solid #555',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
  },
  relatedImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '2px solid #d4af37',
    marginBottom: '12px',
  },
  relatedInfo: {
    textAlign: 'center' as const,
  },
  relatedName: {
    display: 'block',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  relatedPrice: {
    display: 'block',
    color: '#d4af37',
    fontSize: '0.9rem',
    fontFamily: 'serif',
  },

  errorText: {
    color: 'red', 
    textAlign: 'center' as const, 
    padding: '50px',
  },
  notFoundContainer: {
    textAlign: 'center' as const,
    padding: '100px 20px',
    color: '#fff',
    background: '#000',
    minHeight: '100vh',
  },
  notFoundTitle: {
    fontSize: '2rem', 
    marginBottom: '20px',
  },
  backLinkSimple: {
    color: '#3b82f6',
    textDecoration: 'underline',
  },
  // タブスタイル
  tabBar: { display: 'flex', borderBottom: '1px solid #333', marginBottom: '25px' },
  tab: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    // 全体の border: 'none' をやめ、個別に指定
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid transparent', // 透明な線を引いておく
    color: '#666',
    cursor: 'pointer',
    transition: '0.3s'
  },
  activeTab: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    // ここでも全体の border: 'none' を使わず、特定方向のみ指定
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid #d4af37', // ここだけ色をつける
    color: '#d4af37',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s' // tab と transition を合わせておくとスムーズです
  },
  contentBody: { minHeight: '200px' },
  infoContent: { padding: '0 5px' }, // ← エラー解消のため明示的に追加
  description: { lineHeight: '1.8', fontSize: '1.05rem', color: '#ccc', marginBottom: '25px' },
  specGrid: { backgroundColor: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '4px' },
  specItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' },
  specLabel: { color: '#888' },
  specValue: { color: '#d4af37' },

  reviewContent: { display: 'flex', flexDirection: 'column' as const, gap: '10px' }, // ← エラー解消のため明示的に追加
  reviewCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: '15px', marginBottom: '12px', borderLeft: '3px solid #8b0000', fontStyle: 'italic', position: 'relative' as const },
  quoteMark: { color: '#d4af37', fontSize: '1.2rem', marginRight: '8px' },
  emptyText: { textAlign: 'center' as const, color: '#555', marginTop: '40px' }
};