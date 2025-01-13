#!/bin/bash

# 入力ファイルと出力ディレクトリの定義
DIR_BASE=${1:-./data/}
INPUT_FILE=${DIR_BASE}${2:-app.js}

INPUT_FILE_BASENAME=$(basename $INPUT_FILE)
DIR_NAME=${INPUT_FILE_BASENAME/\.js/}
OUTPUT_DIR=${DIR_BASE}${DIR_NAME}/

echo "output dir: $OUTPUT_DIR"

# 入力ファイルがなければエラー
if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Error: $INPUT_FILE not found."
  exit 1
fi

# 出力ディレクトリがあればエラー
if [[  -d "$OUTPUT_DIR" ]]; then
  echo "Error: $OUTPUT_DIR already exists."
  exit 1
fi

# 出力ディレクトリを作成
mkdir -p "$OUTPUT_DIR"

# 関数ごとの分割とimport文の生成
IMPORT_STATEMENTS=()

# 正規表現で関数を抽出して処理
while IFS= read -r line; do
  if [[ $line =~ ^const[[:space:]]+([a-zA-Z_][a-zA-Z0-9_]*)[[:space:]]*=[[:space:]]*(async)*[[:space:]]*\([^\)]*\)[[:space:]]*=\>[[:space:]]*\{ ]]; then
    FUNC_NAME="${BASH_REMATCH[1]}"
    OUTPUT_FILE="$OUTPUT_DIR/$FUNC_NAME.js"

    # 関数定義の終わりまでを抽出
    FUNCTION_CONTENT=()
    FUNCTION_CONTENT+=("${line/const/export const}")
    BRACE_COUNT=1
    while IFS= read -r subline; do
      FUNCTION_CONTENT+=("$subline")

      # '{' の数を数え、ブロックの深さを追跡
      if [[ $subline == *'{'* ]]; then
        ((BRACE_COUNT++))
      fi
      if [[ $subline == *'}'* ]]; then
        ((BRACE_COUNT--))
        # ブロックスコープが終了したら停止
        if [[ $BRACE_COUNT -eq 0 ]]; then
          break
        fi
      fi
    done

    # export const に変換して出力
    # bug: split('\n')などが改行されてしまう
    cat <<'EOF' > "$OUTPUT_FILE"
import { mod, store } from './init.js'
export default {}

EOF

    for statement in "${FUNCTION_CONTENT[@]}"; do
      echo "$statement" >> "$OUTPUT_FILE"
    done
    echo >> "$OUTPUT_FILE"

    # import文を保存
    IMPORT_STATEMENTS+=("import { $FUNC_NAME } from './${DIR_NAME}/$FUNC_NAME.js'")
  fi

done < "$INPUT_FILE"

# 結果を表示
if [[ ${#IMPORT_STATEMENTS[@]} -gt 0 ]]; then
  echo -e "\n以下のimport文をapp.jsに追加してください:\n"
  for statement in "${IMPORT_STATEMENTS[@]}"; do
    echo "$statement"
  done
  echo -e "\n関数を分割して $OUTPUT_DIR に保存しました"
else
  echo "Error: No functions found in $INPUT_FILE."
fi

