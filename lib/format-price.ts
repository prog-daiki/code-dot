/**
 * 金額を指定された通貨でフォーマットする
 * @param amount フォーマットする金額（数値）
 * @returns フォーマットされた金額（文字列）
 * @throws {Error} 無効な入力の場合
 */
export const formatPrice = (amount: number): string => {
  if (!Number.isFinite(amount)) {
    throw new Error("無効な金額です");
  }

  try {
    const formatter = new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    });

    return formatter.format(amount);
  } catch (error) {
    console.error("金額のフォーマット中にエラーが発生しました:", error);
    throw new Error("金額のフォーマットに失敗しました");
  }
};
