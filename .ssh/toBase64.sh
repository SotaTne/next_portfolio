#!/bin/bash

# JSONファイルのパス
json_file="input-your-firebase-json-file-path"

# JSONファイルを読み込んでBase64エンコード
base64_data=$(cat "$json_file" | base64)

# Base64エンコードされたデータを出力
echo "$base64_data"