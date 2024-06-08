import type { Property } from "@sabaki/sgf";
import { parse as parseSgf, stringify as stringifySgf } from "@sabaki/sgf";
import { format, parse as parseDate } from "date-fns";

export type PlayerColor = "BLACK" | "WHITE";
export type GameResult =
  | { type: "draw" }
  | { type: "resign"; color: PlayerColor }
  | { type: "winsByPoints"; color: PlayerColor; points: number };

export default class GameData {
  constructor(
    public readonly sgfText: string,
    public gameName?: string,
    public gameComment?: string,
    public playerColor?: PlayerColor,
    public blackPlayer?: string,
    public whitePlayer?: string,
    public playedAt?: Date,
    public handicap?: string,
    public komi?: string,
    public result?: GameResult,
  ) {}

  public update(data: {
    gameName?: string;
    gameComment?: string;
    playerColor?: PlayerColor;
    blackPlayer?: string;
    whitePlayer?: string;
    playedAt?: Date;
    handicap?: string;
    komi?: string;
    result?: GameResult;
  }): GameData {
    return new GameData(
      this.sgfText,
      data.gameName ?? this.gameName,
      data.gameComment ?? this.gameComment,
      data.playerColor ?? this.playerColor,
      data.blackPlayer ?? this.blackPlayer,
      data.whitePlayer ?? this.whitePlayer,
      data.playedAt ?? this.playedAt,
      data.handicap ?? this.handicap,
      data.komi ?? this.komi,
      data.result ?? this.result,
    );
  }

  public stringify(): string {
    const node = parseSgf(this.sgfText)[0];

    const updateProp = (value: string | undefined, propName: Property) => {
      if (value) {
        node.data[propName] = [value];
      } else {
        delete node.data[propName];
      }
    };

    updateProp(this.gameName, "GN");
    updateProp(this.gameComment, "GC");
    updateProp(this.blackPlayer, "PB");
    updateProp(this.whitePlayer, "PW");
    updateProp(
      this.playedAt ? format(this.playedAt, "yyyy-MM-dd") : undefined,
      "DT",
    );
    updateProp(
      this.handicap?.startsWith("no") ? undefined : this.handicap,
      "HA",
    );
    updateProp(this.komi, "KM");
    updateProp(serializeGameResult(this.result), "RE");

    return trim(stringifySgf([node]));
  }

  static parse(sgfText: string, playerColor?: PlayerColor): GameData | null {
    const parsed = parseSgf(sgfText);

    if (parsed.length !== 1) {
      return null;
    }

    if (!parsed[0].data.SZ?.[0]) {
      return null;
    }

    return new GameData(
      sgfText,
      parsed[0].data.GN?.[0],
      parsed[0].data.GC?.[0],
      playerColor ?? "BLACK",
      parsed[0].data.PB?.[0],
      parsed[0].data.PW?.[0],
      deserializeDate(parsed[0].data.DT?.[0]),
      parsed[0].data.HA?.[0],
      parsed[0].data.KM?.[0],
      deserializeGameResult(parsed[0].data.RE?.[0]),
    );
  }
}

function deserializeDate(text: string | undefined): Date | undefined {
  if (text === undefined) {
    return undefined;
  }

  return parseDate(text, "yyyy-MM-dd", new Date());
}

function serializeGameResult(
  gameResult: GameResult | undefined,
): string | undefined {
  if (!gameResult) {
    return undefined;
  }

  switch (gameResult.type) {
    case "draw":
      return "0";
    case "resign":
      return `${gameResult.color.toUpperCase().charAt(0)}+R`;
    case "winsByPoints":
      return `${gameResult.color.toUpperCase().charAt(0)}+${gameResult.points}`;
  }
}

function deserializeGameResult(
  gameResultText: string | undefined,
): GameResult | undefined {
  if (gameResultText === undefined) {
    return undefined;
  }

  let result: GameResult;

  if (gameResultText === "0") {
    result = { type: "draw" };
  } else {
    const [color, points] = gameResultText.split("+");

    if (points.toUpperCase() === "R") {
      result = {
        type: "resign",
        color: color.toUpperCase() === "B" ? "BLACK" : "WHITE",
      };
    } else {
      result = {
        type: "winsByPoints",
        color: color.toUpperCase() === "B" ? "BLACK" : "WHITE",
        points: Number.parseFloat(points),
      };
    }
  }

  return result;
}

function trim(text: string): string {
  return text
    .split(/\n/)
    .map((v) => v.trim())
    .join("");
}
