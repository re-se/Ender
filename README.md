# Ender

Ender は、 Electron + React + GSAP で作られたノベルゲームエンジンです。

現在、開発を行うためには [node](https://nodejs.org/ja/) が必要です。が、いずれノベルゲームを作りたい人にはもう少し簡単な方法を用意したいと思います。



## 導入手順 （ノベルゲーム開発者向け）
右上の方にある Clone or Download から Download ZIP を選択します。

ダウンロードが終わったら、ターミナルでそのフォルダを開いて、

```
npm install
```

```
gulp
```

でとりあえずサンプルプログラムが起動する、はずです。

サンプルプログラムのリソースは全て```dist/resource```下にあります。

```01.end```というファイルがスクリプトです。テキストエディタで開いてみてください。

スクリプトの詳細については Wiki にいずれまとめますが、

* \ではじまるもの(関数)は'''src/coffee/renderer/func.coffee'''の FuncMap を
* "fadeIn" "shake" のようなもの(エフェクト)は'''src/coffee/renderer/effets.coffee'''を

見てください。

不親切で申し訳ないです。将来的には（自分のためにも）もう少しまとめます。
