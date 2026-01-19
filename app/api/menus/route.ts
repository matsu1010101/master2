import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// メニュー一覧取得 (GET)
export async function GET() {
  try {
    const menus = await prisma.menu.findMany();
    
    // 文字化け対策: ヘッダーに charset=utf-8 を指定
    return new NextResponse(JSON.stringify(menus), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "取得失敗" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

// 新規メニュー登録 (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // データの保存
    const newMenu = await prisma.menu.create({
      data: {
        name: body.name,       // DBのカラム名に合わせてください (例: nameJa ではなく name かも)
        price: body.price,
        category: body.category || 'Other',
        // imageUrl: body.imageUrl, // 画像URL用（後で追加する場合）
      },
    });

    return new NextResponse(JSON.stringify(newMenu), {
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "登録失敗" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}