### `\img()`
### `\layout(...components)`
Component を画面に生成します。
#### 引数
* components: Component[]

### `\import(path)`
path で指定したファイルを現在の画面に対してインポートします。
ender ファイルの場合は、スクリプトファイルを展開します。
css ファイルの場合は、記述されたスタイルを適用します。
#### 引数
* path: string

### `\set(path, value)`
基本的には構文:変数定義を使用します。
```ender
\set('a', 1) # a = 1
\set('a.b[0].c', {}) # a.b[0].c = {}
```
#### 引数
* path: string
* value: any

#### 返り値
