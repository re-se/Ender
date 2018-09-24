# config

```js
{
  "main": "01.end",
  "text": {
    "speed": 1000,
    "waitPeriod": false
  }
}
```

## main: string

一番最初に読み込む Ender スクリプト。

## text

文章関連の設定

### speed: number

文字の表示間隔。この値 ms に一文字の間隔で文字が表示される。

### waitPeriod: bool

文中の"。"で wait するかどうか。
true に設定した場合、以下のように記述することで wait をエスケープすることができる。

```
config.text.waitPeriod = true
あいう。えおか # 「う。」で停止
あいう。\えおか # 「か」まで自動で進む
```

## audio

### path: string

音声ディレクトリのパス。basePath からの相対パス指定。スクリプトから音声ファイルが呼び出されるとき、このパスからの相対パスで指定される。

### bus: BusConfig[]

音声のルーティング設定。

#### BusConfig

```js
{
  "name": "bgm",
  "loop": {
    "offsetTime": "1"
  },
  "out": "master"
}
```

##### name: string

音声バスの識別子

#### out: string

音声バスの出力先設定。空文字または未定義の場合は標準出力。

#### gain: number

音声バスの出力音量。0.0 <= gain <= 1.0
