---
title: Synchのエンドツーエンド暗号化はどのように動きますか?
description: サーバーがノート内容を読めないまま、複数端末でvaultを開けるようにするSynchの暗号化方式を平易に説明します。
pubDate: 2026-05-01
---

エンドツーエンド暗号化とは、データが端末を離れる前にロックされ、もう一度ロックを外せるのも自分の端末だけである、という意味です。

Synchのサーバーはデータの保存と同期を手伝いますが、その内容を読むための秘密は受け取りません。

基本的な考え方はこうです。

```txt
自分の端末: 読めるノート -> 暗号化データ
サーバー: 暗号化データを保存
別の端末: 暗号化データ -> 読めるノート
```

暗号化前のノートは、たとえば次のように見えます。

```txt
Hello, this is my private note.
```

暗号化後はランダムなデータのように見えます。

```txt
K9sV1xQ4...unreadable bytes...
```

このランダムに見えるデータを元のノートに戻すには、端末が正しい鍵を持っている必要があります。

## いちばん大事な問い

暗号化の多くは、ひとつの問いに集約されます。

> 誰が鍵を持っていますか?

Synchでは、自分の端末が鍵を持ちます。サーバーは暗号化されたデータを保存しますが、そのデータを復号するための平文の鍵は受け取りません。

Synchはアップロード前に、ファイル内容とファイルパスなどのメタデータを端末上で暗号化します。別の端末はサーバーから暗号化データをダウンロードできますが、同じvault keyをローカルで解除した後でなければ読めません。

以降では、その仕組みを説明します。

## 秘密はひとつではなく、ふたつ

Synchでremote vaultを作成するとき、vault passwordを選びます。

![Create vault screen](./create-vault.png)

このパスワードがすべてのファイルを直接暗号化している、と考えるのは自然です。

しかし実際には違います。

Synchは2つの異なる秘密を使います。

```txt
vault password: 自分が覚えて入力するパスワード
vault key: Synchが生成するランダムな鍵
```

vault keyが、同期されるvaultデータを実際に暗号化・復号する鍵です。

vault passwordの役割は別です。vault keyを保護し、そのvault keyを安全に保存して他の端末で解除できるようにします。

簡単に言えば、こうです。

```txt
vault key = データを読むための鍵
vault password = vault keyを解除するための鍵
```

この一段階が重要なのは、人間が覚えるパスワードは通常、強い暗号鍵として直接使えるほどランダムではないからです。人間には強そうに見えるパスワードでも、攻撃者が大量に推測を試せる状況ではコンピューターに破られる可能性があります。

そのため、Synchは実際のデータ暗号化用にランダムな32バイトのvault keyを生成します。

```txt
password = "my-strong-password"
vaultKey = "random-32-byte-key"
```

そして、そのvault keyをパスワードで保護します。

## Vault Keyを保護する

Synchはvault keyを読める文字列のままサーバーに保存できません。そうすると、サーバーが暗号化データを読めてしまいます。

そのため、Synchはvault keyの暗号化済みコピーを保存します。

まず、パスワードから`wrapKey`というより強い鍵を作ります。

```txt
password + salt + Argon2id settings
=> wrapKey
```

`wrapKey`はファイルの暗号化には使いません。vault keyを暗号化、つまり「包む」ためだけに使います。

SynchはArgon2idを使って、パスワードから`wrapKey`を作ります。

```txt
Argon2id(
  password = "my-strong-password",
  salt = random 16 bytes,
  memory = 64 MiB,
  iterations = 3,
  parallelism = 1
)
=> wrapKey
```

Argon2idはパスワードベースの鍵導出関数です。平たく言えば、パスワードを暗号鍵に変換する処理を意図的に重くする仕組みです。これにより、攻撃者のパスワード推測を遅くできます。

saltは、暗号化されたvault keyと一緒に保存されるランダムデータです。秘密ではありません。同じパスワードでも、異なるvaultで同じ結果にならないようにするのが役割です。

同じパスワード、同じsalt、同じ設定を入力すれば、Synchは同じ`wrapKey`を再び得ます。パスワードが間違っていれば、別の`wrapKey`になります。

次に、Synchは`wrapKey`でvault keyを暗号化します。

```txt
AES-GCM encrypt (
  key = wrapKey,
  nonce = random 12 bytes,
  plaintext = vaultKey
)
=> encrypted vaultKey
```

ここで使う暗号方式はAES-GCMです。nonceは暗号化に必要なランダムに見えるデータで、一意である必要がありますが、秘密である必要はありません。

この時点で、サーバーは暗号化されたvault keyパッケージを保存できます。

```json
{
  "kdf": {
    "name": "argon2id",
    "memoryKiB": 65536,
    "iterations": 3,
    "parallelism": 1,
    "salt": "b64_salt"
  },
  "wrap": {
    "algorithm": "aes-256-gcm",
    "nonce": "b64_nonce",
    "ciphertext": "b64_encrypted_vaultKey"
  }
}
```

このパッケージは、後でSynchクライアントがvault keyの解除を試すための情報です。サーバーにパスワードやvault keyを渡すものではありません。

サーバーが持つもの:

```txt
salt
Argon2id settings
nonce
encrypted vaultKey
```

サーバーが持たないもの:

```txt
password
wrapKey
vaultKey
```

この違いが、Synchのエンドツーエンド暗号化設計の中心です。

## サーバーに見えるもの、見えないもの

サーバーはvault keyを持たないため、ファイル内容や復号済みのファイルパスを読むことはできません。

サーバーは暗号化データと、自分の端末が正しいvault passwordを入力した後にそれを解除するための情報を保存します。

ただし、エンドツーエンド暗号化はすべてを隠すわけではありません。同期サービスを運用するために必要な情報、たとえばアカウント、vault識別子、暗号化オブジェクトのサイズ、更新時刻、同期アクティビティなどはサーバーに見える場合があります。

重要な境界は、サーバーだけでは暗号化されたvaultデータを読めるノートに戻せないことです。

## ファイルとメタデータの暗号化

端末がvault keyを解除すると、Synchはそのvault keyを同期データのルート秘密として使います。

ファイル内容はアップロード前に暗号化されます。ファイルパスなどのメタデータもアップロード前に暗号化されます。暗号化された各項目はそれぞれnonceを持ち、そのnonceは暗号化データと一緒に保存され、復号時に使われます。

サーバーが保存するのは暗号化データだけです。平文のファイル内容、平文のファイルパス、vault keyは保存しません。

## 別の端末でVaultを開く

![Connect vault screen](./connect-vault.png)

別の端末が同じremote vaultに接続すると、サーバーから暗号化されたvault keyパッケージをダウンロードします。

次に、その端末でvault passwordを入力します。

Synchは保存されていたsaltとArgon2id設定を使って、同じ`wrapKey`を導出します。

```txt
Argon2id(password, same salt, same settings)
=> same wrapKey
```

パスワードが正しければ、端末はその`wrapKey`で暗号化されたvault keyを復号します。

```txt
AES-GCM decrypt(
  key = wrapKey,
  nonce = stored nonce,
  ciphertext = encrypted vaultKey
)
=> vaultKey
```

端末がvault keyを得ると、同期されたファイルとメタデータをローカルで復号できます。

パスワードが間違っていれば、端末は別の`wrapKey`を導出し、vault keyの復号は失敗します。

## Vault Passwordが重要な理由

vault passwordはvault内のすべてのファイルを直接暗号化するわけではありません。vault keyを解除し、そのvault keyが実際の同期データを暗号化します。

それでも、パスワードは非常に重要です。

誰かが暗号化されたvault keyパッケージのコピーを入手すると、それに対してオフラインでパスワード推測を試せます。Argon2idは各推測を重くしますが、推測しやすいパスワードを完全に守ることはできません。

vault passwordを忘れた場合、Synchはvaultを復旧できません。`wrapKey`を導出するにはパスワードが必要で、vault keyを解除するには`wrapKey`が必要です。どちらかがなければ、暗号化されたvaultデータは読めません。

パスワードを失っても、サーバーはそれを復旧できません。`wrapKey`の導出は自分のパスワードから始まり、そのパスワード自体はSynchに送信されないからです。

要するに、サーバーの役割は暗号化されたvaultデータを保存して同期することです。それを読めるノートに戻す処理は、完全に自分の端末上で行われます。データを読むために必要な秘密は、サーバーには存在しません。
