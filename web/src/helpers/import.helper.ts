export async function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const sgf = reader.result;
      if (typeof sgf !== "string") {
        return;
      }
      resolve(sgf);
    };

    reader.readAsText(file);
  });
}

export function isValidCosumiUrl(url: string): boolean {
  return url.match(/^https:\/\/www.cosumi.net\/replay\//) !== null;
}

export function parseCosumiUrl(url: string): {
  sgfText: string;
  playerIsBlack: boolean;
} {
  const parsed = new URL(url);
  const SZ = parsed.searchParams.get("bs") ?? "9";
  const PB = parsed.searchParams.get("b") ?? "black";
  const PW = parsed.searchParams.get("w") ?? "white";
  const KM = parsed.searchParams.get("k") ?? "6.5";
  const RE =
    parsed.searchParams
      .get("r")
      ?.replace("b", "b+")
      .replace("w", "w+")
      .toUpperCase() ?? "0";
  const pointsStr =
    parsed.searchParams
      .get("gr")
      ?.match(/.2/g)
      ?.map((coord, index) => {
        const c = index % 2 === 0 ? "B" : "W";
        const p = coord !== "tt" ? coord : "";
        return `;${c}[${p}]`;
      })
      .join("") ?? "";

  const sgfText = `(;GM[1]FF[4]GN[COSUMIでの対局]PB[${PB}]PW[${PW}]SZ[${SZ}]KM[${KM}]RE[${RE}]${pointsStr})`;
  const playerIsBlack = PB === "You";

  return {
    sgfText,
    playerIsBlack,
  };
}
