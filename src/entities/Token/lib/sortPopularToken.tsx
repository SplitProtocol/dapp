import { TokenListItem } from "../model/types";

export const sortPopularToken = (
  objectArray: TokenListItem[],
  symbols: string[]
) => {
  //   const tokensToMove: Token[] = [];
  //   const remainingTokens: Token[] = [];

  //   objectArray.forEach(obj => {
  //       if (symbols.includes(obj.symbol)) {
  //           tokensToMove.push(obj);
  //       } else {
  //           remainingTokens.push(obj);
  //       }
  //   });

  //   return tokensToMove.concat(remainingTokens);
  return objectArray.sort((a, b) => {
    const symbolIndexA = symbols.indexOf(a.symbol);
    const symbolIndexB = symbols.indexOf(b.symbol);

    if (symbolIndexA === -1 && symbolIndexB === -1) {
      return 0;
    } else if (symbolIndexA === -1) {
      return 1;
    } else if (symbolIndexB === -1) {
      return -1;
    } else {
      return symbolIndexA - symbolIndexB;
    }
  });
};
