import { formatPrice } from "../format-price";

describe("formatPrice", () => {
  // 正常系のテスト
  test("整数の金額を正しくフォーマットする", () => {
    expect(formatPrice(1000)).toBe("¥1,000");
  });

  test("小数点を含む金額を正しくフォーマットする", () => {
    expect(formatPrice(1000.5)).toBe("¥1,001");
  });

  test("0円を正しくフォーマットする", () => {
    expect(formatPrice(0)).toBe("¥0");
  });

  // 異常系のテスト
  test("無限大でエラーをスローする", () => {
    expect(() => formatPrice(Infinity)).toThrow("無効な金額です");
  });

  test("NaNでエラーをスローする", () => {
    expect(() => formatPrice(NaN)).toThrow("無効な金額です");
  });
});
