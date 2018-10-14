import { enc, MD5, SHA256, AES } from "crypto-js";
import LZString from "./utils/LZString";
import LZW from "./utils/lzw";

export default class app {
  secretKey = "psykoStudio";

  datasSets = [
    { ticket: { win: true } },
    {
      ticket: {
        line: ["B", "A", "C", "C", "B", "C"],
        win: true,
        winAmount: 200
      }
    },
    {
      ticket: {
        rows: [
          { cells: ["B", "A", "C", "C", "B", "C"], win: 1 },
          { cells: ["C", "C", "B", "A", "Q", "C"], win: 0 },
          { cells: ["B", "B", "A", "C", "C", "C"], win: 0 },
          { cells: ["W", "Z", "C", "B", "C", "C"], win: 0 },
          { cells: ["B", "C", "A", "X", "D", "C"], win: 0 },
          { cells: ["B", "F", "B", "C", "B", "C"], win: 0 }
        ],
        win: true,
        winAmount: 200
      }
    }
  ];

  constructor() {
    this.datasSets.forEach(datas => {
      this.testSuite(datas);
    });
  }

  testSuite(datas: any) {
    console.log("------------------------------------------");
    const rawString = JSON.stringify(datas);

    const rawResults = this.test( rawString, (a) => {return a}, (b) => {return b});

    const LZStringResults = this.test(rawString, LZString.compress, LZString.decompress );
    const LZStringSafeResults = this.test(rawString, LZString.compressLocalStorageSafe, LZString.decompressLocalStorageSafe );

    const LZWResults = this.test(rawString, LZW.compress, LZW.decompress );

    const AESResults = this.test(rawString, (raw) => {
      return AES.encrypt(raw, this.secretKey).toString();
    }, (compressed) => {
      return AES.decrypt(compressed, this.secretKey).toString(enc.Utf8);
    }); 

    const AESLZStringResults = this.test(rawString, (raw) => {
      return LZString.compress(AES.encrypt(rawString, this.secretKey).toString());
    }, (compressed) => {
      return  AES.decrypt(LZString.decompress(compressed), this.secretKey).toString(enc.Utf8);;
    });

    const result = {
      "raw": rawResults,
      "LZString":LZStringResults, 
      "LZStringSafe":LZStringSafeResults,
      "LZW": LZWResults,
      "AES": AESResults,
      "AES + LZString": AESLZStringResults
    };

    console.log(result);
  }

  test(rawString, compressMethod: (raw: string) => string, decompressMethod: (encodedraw: string) => string){
    const compressedDatas = compressMethod(rawString);
    const output = decompressMethod(compressedDatas);
    const compressed = this.getStats(rawString, compressedDatas);
    const difference = this.compareString(rawString, output);
    return { compressed, decompressed: { difference, output } };
  }

  compareString(s1: string, s2: string) {
    const splitChar = "";
    var string1 = new Array();
    var string2 = new Array();

    string1 = s1.split(splitChar);
    string2 = s2.split(splitChar);
    var diff = new Array();

    if (s1.length > s2.length) {
      var long = string1;
    } else {
      var long = string2;
    }

    let charCount = 0;
    for (let x = 0; x < long.length; x++) {
      if (string1[x] != string2[x]) {
        diff.push(string2[x]);
      }
      charCount++;
    }
    const diffRatio = diff.length / charCount;
    return `${(diffRatio * 100).toFixed(2)} %`;
  }

  getStats(source: string, datas: string) {
    const sourceSize = source.length;
    const size = datas.length;
    const compressionRatio = ((size / sourceSize) * 100);
    const compression = `${compressionRatio.toFixed(2)} %`;
    const difference = this.compareString(source, datas);
    return { difference, compression, size, datas };
  }
}
