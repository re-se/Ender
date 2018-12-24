# config

```js
{
  "main": "01.end",
  "text": {
    "speed": 1000,
    "waitPeriod": false
  }
  "auto": true,
  "autoSpeed": 1000,
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

## auto: bool

自動再生設定。true で自動再生される。

## autoSpeed: number

自動再生時の wait で止まる ms 数。

## audio

音声を鳴らす時の設定

### path: string

音声ディレクトリのパス。basePath からの相対パス指定。スクリプトから音声ファイルが呼び出されるとき、このパスからの相対パスで指定される。

### bus: BusConfig[]

音声 Bus の設定。

鳴らす音声をグルーピングすることでグループごとの音量パラメータの調整やエフェクトの一括適用などが可能になります。
このグループを bus (音声 Bus )と言います。

スクリプトから音声を鳴らす時はここで定義した音声 Bus のどれかに属した音声として再生されます。(属する音声 Bus はスクリプトから指定できます。)

また、音声にエフェクトをかけたい場合は鳴らしている音声か音声 Bus をエフェクト対象として選択することができます。

#### BusConfig

```js
{
  "name": "bgm",
  "out": "master",
  "gain": 1,
}
```

##### name: string

音声 Bus の名前です。

スクリプトから音声 Bus を指定するときや、音声 Bus の接続の関係を定義するときに使います。

#### out: string

音声 Bus の出力先設定。他の音声 Bus を指定して接続の関係を定義することができます。

空文字または未定義の場合は標準出力。

#### gain: number

音声 Bus の出力音量。0.0 <= gain <= 1.0
