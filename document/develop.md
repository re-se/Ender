# 開発環境

## Scripts

### `develop ${configPath}`

live reload で configPath を起点に Ender を起動する。

### `test [-u]`

jest を用いて tests/ 直下のディレクトリ全ての実行テスト(& スナップショットテスト)を行う。
Ender スクリプト内で`\wait('snapshot')`を呼ぶと、その時点における DOM のスナップショットを取得し、記録する。
2 回目以降は差分を検出すると落ちるので、それが意図した差分である場合には`test -u`でスナップショットのアップデートを行う。詳細は [jest - スナップショットテスト](https://facebook.github.io/jest/docs/ja/snapshot-testing.html) を参照。

### `parsergen`

ender のパーサを再生成する。

## Atom

### atom-ide-ui

### ide-flowtype

ide。

### prettier-atom

フォーマッタ。

* Format Files On Save
* Only format if Prettier is found in your project's dependencies
* Only format if a Prettier config is found
  をオンにする。
