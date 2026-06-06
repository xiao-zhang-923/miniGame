/**
 * 安全计算数学表达式（替代 eval）
 * 支持运算符: + - * / ( )
 */
export const safeEval = (expr: string): number => {
  // 移除空格
  expr = expr.replace(/\s+/g, "");

  // 使用递归下降解析器
  let pos = 0;

  const parseNumber = (): number => {
    let numStr = "";
    while (pos < expr.length && /[0-9.]/.test(expr[pos])) {
      numStr += expr[pos];
      pos++;
    }
    return parseFloat(numStr);
  };

  const parseFactor = (): number => {
    if (expr[pos] === "(") {
      pos++; // 跳过 (
      const result = parseExpr();
      pos++; // 跳过 )
      return result;
    }
    // 处理负数
    if (expr[pos] === "-") {
      pos++;
      return -parseFactor();
    }
    return parseNumber();
  };

  const parseTerm = (): number => {
    let left = parseFactor();
    while (pos < expr.length && (expr[pos] === "*" || expr[pos] === "/")) {
      const op = expr[pos];
      pos++;
      const right = parseFactor();
      left = op === "*" ? left * right : left / right;
    }
    return left;
  };

  const parseExpr = (): number => {
    let left = parseTerm();
    while (pos < expr.length && (expr[pos] === "+" || expr[pos] === "-")) {
      const op = expr[pos];
      pos++;
      const right = parseTerm();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  };

  return parseExpr();
};

/**
 * 递归计算24点
 * @param nums - 数字数组
 * @param exprs - 对应的字符串表达式数组
 * @returns 能得到24的完整表达式，否则返回null
 */
export const findFullAnswer = (nums: number[], exprs: string[]): string | null => {
  if (nums.length === 1) {
    // 最终结果等于24，返回对应的完整表达式
    return Math.abs(nums[0] - 24) < 1e-6 ? exprs[0] : null;
  }

  const ops = ["+", "-", "*", "/"];
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (i === j) continue;

      const a = nums[i];
      const b = nums[j];
      const exprA = exprs[i];
      const exprB = exprs[j];

      // 剩下的数字和表达式
      const restNums = nums.filter((_: number, idx: number) => idx !== i && idx !== j);
      const restExprs = exprs.filter((_: string, idx: number) => idx !== i && idx !== j);

      // 尝试所有运算符
      for (const op of ops) {
        let val: number;
        let newExpr: string;

        if (op === "+") {
          val = a + b;
          newExpr = `(${exprA}+${exprB})`;
        } else if (op === "-") {
          val = a - b;
          newExpr = `(${exprA}-${exprB})`;
        } else if (op === "*") {
          val = a * b;
          newExpr = `(${exprA}*${exprB})`;
        } else {
          // 除法：除数不能为0
          if (Math.abs(b) < 1e-9) continue;
          val = a / b;
          newExpr = `(${exprA}/${exprB})`;
        }

        // 递归计算剩下的数字
        const res = findFullAnswer([...restNums, val], [...restExprs, newExpr]);
        if (res) {
          return res;
        }
      }
    }
  }
  return null;
};

/**
 * 判断是否有解（必须用完4个数字）
 * @param nums - 4个数字的数组
 * @returns 是否有解
 */
export const hasFullSolution = (nums: number[]): boolean => {
  // 初始化：数字和对应的字符串表达式（就是数字本身）
  const initialExprs: string[] = nums.map((n: number) => n.toString());
  return findFullAnswer(nums, initialExprs) !== null;
};

/**
 * 生成4个随机数字（0-9）
 * @returns 4个数字的数组
 */
export const generateFourNumbers = (): number[] => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
};

/**
 * 生成【必须用完4个数字】的有解题目 + 打印完整解法
 * @returns 有解的4个数字数组
 */
export const generateValidPuzzle = (): number[] => {
  let arr: number[];
  let answer: string | null;

  do {
    arr = generateFourNumbers();
    const initialExprs: string[] = arr.map((n: number) => n.toString());
    answer = findFullAnswer(arr, initialExprs);
  } while (!answer); // 直到找到有完整解的题目
  return arr;
};