### `\img()`

### `\layout(...components)`

Component を画面に生成します。

#### 引数

- components: Component[]

### `\import(path)`

path で指定したファイルを現在の画面に対してインポートします。
ender ファイルの場合は、スクリプトファイルを展開します。
css ファイルの場合は、記述されたスタイルを適用します。

#### 引数

- path: string

### `\set(path, value)`

基本的には構文:変数定義を使用します。

```ender
\set('a', 1) # a = 1
\set('a.b[0].c', {}) # a.b[0].c = {}
```

#### 引数

- path: string
- value: any

#### 返り値

### `\save(name)`

セーブデータを作成します。  
name は拡張子を除いたセーブデータのファイル名が入ります。  
同名のセーブデータがある場合は上書きされます。

### `\deleteSave(name)`

セーブデータを削除します。  
name は拡張子を除いたセーブデータのファイル名が入ります。

### `\screenshot()`

ゲームウィンドウのスクリーンショットを一時的に保存します。  
この関数ではファイルへの書き出しは行われません。  
作成したスクリーンショットはゲーム起動中のみ有効な一時ファイルとなります。  
ゲームを終了すると失われます。  
また、screenshot 関数を再度呼び出すと以前に保存されたスクリーンショットは上書きされます。

セーブデータにスクリーンショットを入れたい場合はセーブ画面遷移前にこの関数を呼び出しましょう。

```
\screenshot()
\include("saveScene.end")
```

### `\playAudio(out, src, isLoop = false, loopOffset = 0, effect)`

音声を再生します。

#### 引数

- out: string
  - 鳴らす音声が所属する音声 Bus を指定します。
- src: string
  - 音声ファイルのパス
- isLoop: boolean
  - ループするか
- loopOffset: number
  - ループする際の開始位置。ms 指定。指定しない場合は 0。
- effect: string
  - 再生開始時の効果を指定することができます。
  - 例) "fadeIn"

### `\stopAudio(src, effect)`

音声を停止します。

#### 引数

- src: string
  - 音声ファイルのパス
- effect: string
  - 再生停止時の効果を指定することができます。
  - 例) "fadeOut"

### `\loadAudioBus(name, out, gain = 1.0)`

音声 Bus を定義します。

#### 引数

- name: string
  - 音声 Bus の名前。再生時の音声 Bus 指定で使用します。
- out: string
  - 音声 Bus の出力先。音声 Bus の名前を指定します。
- gain: number
  - 音声 Bus の音量。

### `\effectAudio(targetBus, effect)`

音声にエフェクトをかけます。エフェクトが終わるまでその他の処理が停止します。

#### 引数

- targetBus: string
  - エフェクトをかける対象となる音声 Bus の名前か音声ファイルのパスを指定します。
- effect: string
  - 効果名。

### `\effectAudio(targetBus, effect)`

音声にエフェクトをかけます。エフェクトの開始と同時に次の処理に進みます。

#### 引数

- targetBus: string
  - エフェクトをかける対象となる音声 Bus の名前か音声ファイルのパスを指定します。
- effect: string
  - 効果名。
