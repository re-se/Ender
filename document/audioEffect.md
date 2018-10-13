# Audio Effect

## 定義済 Audio Effect

### fadeIn

2 秒かけて音量が 0 から 1 に遷移します。

## 新しい Audio Effect の追加方法

renderer/util/audio/effect 以下にエフェクトスクリプトを作成します。  
エフェクトスクリプトのテンプレートは以下になります。

```js
export default {
  start: (
    audioCxt: AudioContext,
    audioNodes: { [string]: GainNode },
    onComplete: () => void
  ): void => {
    // スクリプトからエフェクトの再生が呼ばれたときに行う処理
  },

  end: (
    audioCxt: AudioContext,
    audioNodes: { [string]: GainNode },
    onComplete: () => void
  ): void => {
    // スクリプトからエフェクトの停止が呼ばれたときに行う処理
  },

  nodes: {
    // エフェクトで使用する AudioNode を定義します
  },
}
```

### nodes

nodes で指定した key は start, end で渡される audioNodes で key として使用され、  
nodes と audioNodes 間の対応をとります。

node の定義は以下の形式のオブジェクトで行います。

- type: AudioNode の種別が入ります。
- name: key と同じ文字列を入れます。
- params: type に応じた key, value が入ります。

```js
{
  type: string,
  name: string,
  params: Object,
}
```

### start, end

エフェクト終了時に onComplete を呼んでください。  
audioNodes に nodes で定義した node の AudioNode インスタンスが入ります。  
start, end で想定される記述は audioNode のパラメータ変更です。
