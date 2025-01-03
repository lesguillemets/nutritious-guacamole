/** 要素の2次元配列を，基本的には Array.join() を使って
 * 表示しやすい表形式にするクラス
 * 実際の representation は Array<Array<T>> 側が
 * 面倒を見る構造の，ごく薄い層
 * @type TableLike<T,U> T:データの型 U: ヘッダの型*/

export class TableLike<T, U> {
	dat: Array<Array<T>>;
	header: Array<U> | null;

	constructor(dat: Array<Array<T>>, header: Array<U> | null = null) {
		this.dat = dat;
		this.header = header;
	}

	/** Dat をフォーマットする関数を受け取ってそのようにしたものを返す */
	formatDat(fmt: (d: T) => string): TableLike<string, U> {
		const d: Array<Array<string>> = [];
		for (const row of this.dat) {
			d.push(row.map(fmt));
		}
		return new TableLike(d, this.header);
	}

	/** Head をフォーマットする関数を受け取ってそのようにしたものを返す */
	formatHead(fmt: (d: U) => string): TableLike<T, string> {
		const newHeader = this.header === null ? null : this.header.map(fmt);
		return new TableLike(this.dat, newHeader);
	}

	toTsv(): string {
		const rows = [];
		if (this.header !== null) {
			rows.push(this.header.join("\t"));
		}
		for (const r of this.dat) {
			// if (isTableRowLike(r)) {
			// 	// それ用のメソッドがあるときは使う
			// 	rows.push(r.toTableRow().join('\t'));
			// } else {
			rows.push(r.join("\t"));
			// }
		}
		return rows.join("\n");
	}

	/** 仮．
	 * table の方には class とかつけたくなる気がするので内側だけ．
	 * これも単に string で作る形になってる */
	toHtmlTable(): string {
		const rows = [];
		if (this.header !== null) {
			rows.push("<thead><tr>");
			rows.push(
				this.header.map((headerItem) => `\t<th>${headerItem}</th>`).join("\n")
			);
			rows.push("</tr></thead>");
		}
		rows.push("<tbody>");
		for (const r of this.dat) {
			rows.push("<tr>");
			rows.push(r.map((i) => `\t<td>${i}</td>`).join("\n"));
			rows.push("</tr>");
		}
		rows.push("</tbody>");
		return rows.join("\n");
	}
}

/** Table として扱う時に，その行になりうるもの．
 * toTableRow が，各アイテムを含む配列を返す
 * …と思ったけど，複数の表現の仕方が文脈依存で存在するので，
 * あんまりデータ側にこういうメソッドを生やす意味は薄いかも
 * */
export interface TableRowLike {
	toTableRow(): Array<string>;
}

export function isTableRowLike(obj: any): obj is TableRowLike {
	return "toTableRow" in obj;
}
