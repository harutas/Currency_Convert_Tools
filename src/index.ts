type Validator = {
  isValid: boolean;
  errorMessage: string;
};

interface currencyList {
  India: {
    domination: string[];
  };
  USA: {
    domination: string[];
  };
  Europe: {
    domination: string[];
  };
  UAE: {
    domination: string[];
  };
  Japan: {
    domination: string[];
  };
}

interface denominationRate {
  Rupee: number;
  Paisa: number;
  Dollar: number;
  USCent: number;
  Euro: number;
  EuroCent: number;
  Dirham: number;
  Fils: number;
  Yen: number;
}

const currencyList = {
  India: ["Rupee", "Paisa"],
  USA: ["Dollar", "USCent"],
  Europe: ["Euro", "EuroCent"],
  UAE: ["Dirham", "Fils"],
  Japan: ["Yen"],
};

const denominationRate = {
  Rupee: 1.4442,
  Paisa: 0.014442,
  Dollar: 106.1,
  USCent: 1.061,
  Euro: 125.56,
  EuroCent: 1.2556,
  Dirham: 28.89,
  Fils: 0.2889,
  Yen: 1,
};

const commandInput: HTMLInputElement | null = document.getElementById("command-input") as HTMLInputElement;
const tarminal: HTMLElement | null = document.getElementById("tarminal");

commandInput?.addEventListener("keyup", (e: KeyboardEvent) => serachSubmit(e));

function serachSubmit(e: KeyboardEvent) {
  if (commandInput != null) {
    if (e.code == "Enter") {
      // [package, command, params(showDenominations [locale], convert[sourceDenomination][sourceAmount][destinationDenomination])]
      const parsedCLIArray = CCTools.commandLineParser(commandInput.value);
      CCTools.appendEchoParagraph(tarminal);
      commandInput.value = "";

      // 入力の検証
      let validatorResponse = CCTools.parsedArrayValidator(parsedCLIArray) as Validator;

      // 結果の出力
      if (validatorResponse.isValid == false) {
        CCTools.appendResultParagraph(tarminal, false, validatorResponse.errorMessage);
      } else
        CCTools.appendResultParagraph(
          tarminal,
          true,
          CCTools.evaluatedResultsStringFromParsedCLIArray(parsedCLIArray) as string
        );

      // 出力divを常に下方向にスクロール
      if (tarminal != null) {
        tarminal.scrollTop = tarminal.scrollHeight;
      }
    }
  }
}

class CCTools {
  // 要素に出力を追加する
  static appendEchoParagraph(parentDiv: HTMLElement | null) {
    if (parentDiv != null) {
      parentDiv.innerHTML += `
      <p class="m-0">
      <span class="text-lightgreen">user</span>
      <span class="text-magenta"> @ </span>
      <span class="text-info">recursion</span>: ${commandInput?.value}
      </p>
      `;
    }
    return;
  }

  // 結果を出力する
  static appendResultParagraph(parentDiv: HTMLElement | null, isValid: boolean, message: string) {
    if (parentDiv != null) {
      let promptName = "";
      let promptColor = "";

      if (isValid) {
        promptName = "CCTools";
        promptColor = "turquoise";
      } else {
        promptName = "CCToolsError";
        promptColor = "red";
      }

      parentDiv.innerHTML += `
      <p class="m-0">
      <span style="color: ${promptColor};">${promptName}</span>: ${message}
      </p>
      `;
    }
    return;
  }

  // 入力された文字列をトークンに分割する
  static commandLineParser(cliInputString: string) {
    const parsedStringInputArray = cliInputString.trim().split(" ");
    return parsedStringInputArray;
  }

  static parsedArrayValidator(parsedStringInputArray: string[]) {
    // 全体の検証
    let validatorResponse = CCTools.universalValidator(parsedStringInputArray);
    if (!validatorResponse.isValid) return validatorResponse;

    // コマンドごとの検証
    validatorResponse = CCTools.commandValidator(parsedStringInputArray.slice(1)) as Validator;
    if (!validatorResponse.isValid) return validatorResponse;
    return { isValid: true, errorMessage: "" };
  }

  // 全体の検証
  // {isValid: <boolean>, errorMessage: <String>}
  static universalValidator(parsedStringInputArray: string[]) {
    const validCommandList = ["showAvailableLocales", "showDenominations", "convert"];
    // 最初のトークンはCCTools
    if (parsedStringInputArray[0] != "CCTools") {
      return {
        isValid: false,
        errorMessage: "only CurrencyConvert package supported by this app. input must start with 'CCTools'.",
      };
    }
    // トークンの上限は5つ
    if (parsedStringInputArray.length > 5) {
      return {
        isValid: false,
        errorMessage: "command line input maximum contain exactly 5 elements.",
      };
    }
    // コマンドが適切でない
    if (validCommandList.indexOf(parsedStringInputArray[1]) == -1) {
      return {
        isValid: false,
        errorMessage: `CCTools only supports the following commands: ${validCommandList.join(",")}.`,
      };
    }
    return { isValid: true, errorMessage: "" };
  }

  // commandごとの検証
  static commandValidator(commandArray: string[]) {
    if (commandArray[0] === "showAvailableLocales") {
      return CCTools.showAvailableLocalesValidator(commandArray[0], commandArray.slice(1));
    }
    if (commandArray[0] === "showDenominations") {
      return CCTools.showDenominationsValidator(commandArray[0], commandArray.slice(1));
    }
    if (commandArray[0] === "convert") {
      return CCTools.convertValidator(commandArray[0], commandArray.slice(1));
    }
  }

  // showAvailableLocales:
  // commandArgsArray []
  static showAvailableLocalesValidator(commandName: string, commandArgsArray: string[]) {
    // 引数は0個
    if (commandArgsArray.length != 0) {
      return {
        isValid: false,
        errorMessage: `command ${commandName} requires exactly 0 argument.`,
      };
    }
    return { isValid: true, errorMessage: "" };
  }

  // showDenominations [locale]:
  // commandArgsArray [local]
  static showDenominationsValidator(commandName: string, commandArgsArray: string[]) {
    // 引数は1個
    if (commandArgsArray.length != 1) {
      return {
        isValid: false,
        errorMessage: `command ${commandName} requires exactly 1 argument.`,
      };
    }
    // サポートされている国
    if (Object.keys(currencyList).indexOf(commandArgsArray[0]) == -1) {
      return {
        isValid: false,
        errorMessage: `this locale is not supported.`,
      };
    }
    return { isValid: true, errorMessage: "" };
  }

  // convert [sourceDenomination][sourceAmount][destinationDenomination]:
  // commandArgsArray [denomination, amount, denomination]
  static convertValidator(commandName: string, commandArgsArray: string[]) {
    // 引数は3個
    if (commandArgsArray.length != 3) {
      return {
        isValid: false,
        errorMessage: `command ${commandName} requires exactly 3 argument.`,
      };
    }
    // 1つ目の引数が返還前の通貨単位
    if (Object.keys(denominationRate).indexOf(commandArgsArray[0]) === -1) {
      return {
        isValid: false,
        errorMessage: `this 1st denomination is not supported.`,
      };
    }
    // 2つめの引数がNumber
    if (!CCTools.isContainsNumber(commandArgsArray[1])) {
      return {
        isValid: false,
        errorMessage: `2nd arg is NaN.`,
      };
    }
    // 3つ目の引数が返還後の通貨単位
    if (Object.keys(denominationRate).indexOf(commandArgsArray[2]) === -1) {
      return {
        isValid: false,
        errorMessage: `this 2nd denomination is not supported.`,
      };
    }
    return { isValid: true, errorMessage: "" };
  }

  // 値がnumberであることの確認
  static isContainsNumber(num: string) {
    let parsedNumber = Number(num);
    return typeof parsedNumber === "number" && !isNaN(parsedNumber);
  }

  // 表示させるコンテンツの生成
  static evaluatedResultsStringFromParsedCLIArray(parsedCLIArray: string[]) {
    let result = "";
    if (parsedCLIArray[1] === "showAvailableLocales") {
      result = `<br> ${Object.keys(currencyList).join("<br>")}`;
    }
    if (parsedCLIArray[1] === "showDenominations") {
      const locale = parsedCLIArray[2];
      const denominations: string[] = currencyList[locale as keyof currencyList];
      result = `${locale}<br>${denominations.join("<br>")}`;
    }
    if (parsedCLIArray[1] === "convert") {
      const rate1 = denominationRate[parsedCLIArray[2] as keyof denominationRate];
      const rate2 = denominationRate[parsedCLIArray[4] as keyof denominationRate];
      result = `${(Number(parsedCLIArray[3]) * rate1) / rate2} ${parsedCLIArray[4]}`;
    }
    return "your result is: " + result;
  }
}

// 時間があれば・・・up キーと down キーを押した時に、過去のコマンドライン入力に順番にアクセスできるように機能を実装してください。
