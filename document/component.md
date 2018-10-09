# Component

## 定義済コンポーネント

### `Box(classNames, children)`

中にコンポーネントを複数所持することができるコンポーネントです。

#### 引数

* classNames: string|Array<String>
* children: Array<Component>

### `ExecButton(classNames)`

進むボタンの役割を持つコンポーネントです。このコンポーネントはクリックされることでスクリプトを次の命令へと進めます。

自動再生されている場合は自動再生を停止させます。

### `StopAutoButton(classNames)`

自動再生されている場合に自動再生を停止させるボタンのコンポーネントです。このコンポーネントはクリックされることで自動再生を停止させます。

## 新しいコンポーネントの追加方法
