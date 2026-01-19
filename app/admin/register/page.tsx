import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; // さっき作った共通設定ファイルを読み込む

export default function RegisterPage() {
  // 💾 データベースへ保存する処理 (Server Action)
  async function addMenu(formData: FormData) {
    'use server';

    const nameJa = formData.get('nameJa') as string;
    const category = formData.get('category') as string;
    const price = Number(formData.get('price'));
    const isVegan = formData.get('isVegan') === 'on';

    // データベースの「Menu」テーブルに新しいデータを追加
    await prisma.menu.create({
      data: {
        nameJa,
        category,
        price
      },
    });

    // 登録が終わったらトップページに戻る
    redirect('/');
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '20px' }}>🍜 新メニュー登録 (DB)</h1>
      
      <form action={addMenu} style={formStyle}>
        <div>
          <label style={labelStyle}>メニュー名 (日本語):</label>
          <input name="nameJa" type="text" required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>価格 (円):</label>
          <input name="price" type="number" required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>ジャンル:</label>
          <select name="category" style={inputStyle}>
            <option value="Ramen">ラーメン</option>
            <option value="SideDish">サイドディッシュ</option>
            <option value="Drink">ドリンク</option>
            <option value="Topping">トッピング</option>
          </select>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input name="isVegan" type="checkbox" style={{ width: '20px', height: '20px' }} /> 
          <span>ヴィーガン対応</span>
        </label>

        <button type="submit" style={buttonStyle}>データベースへ登録する</button>
      </form>
    </div>
  );
}

// 🎨 簡単なスタイル
const containerStyle = { padding: '40px', color: 'white', backgroundColor: '#111', minHeight: '100vh' };
const formStyle = { display: 'flex', flexDirection: 'column' as const, gap: '20px', maxWidth: '400px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' };
const inputStyle = { color: 'black', padding: '10px', width: '100%', borderRadius: '4px' };
const buttonStyle = { padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' as const };