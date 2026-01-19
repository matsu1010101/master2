import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 削除機能 (DELETE)
export async function DELETE(
  request: Request,
 { params }: { params: Promise<{ id: string }> } // 1. 型を Promise にする
) {
  // 2. await で params を取得
  const { id } = await params;

  // 3. データベース（Prisma）に渡す前に数値に変換する
  const menuId = parseInt(id, 10);

  // 数値変換に失敗した場合のバリデーション（念のため）
  if (isNaN(menuId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.menu.delete({
      where: {
        id: menuId, // ここで数値として渡す
      },
    });

    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
        return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}