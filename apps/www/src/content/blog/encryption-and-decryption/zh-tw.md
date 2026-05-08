---
title: Synch 的端對端加密是如何運作的？
description: 用通俗方式說明 Synch 如何讓你在多台裝置上解鎖 vault，同時伺服器無法讀取你的筆記內容。
pubDate: 2026-05-01
---

端對端加密代表，資料在離開你的裝置之前就已經被鎖住，而且只能在你的某台裝置上再次解鎖。

Synch 的伺服器會協助保存和同步資料，但它不會取得讀取資料所需的秘密。

基本概念如下：

```txt
你的裝置：可讀筆記 -> 加密資料
伺服器：保存加密資料
另一台裝置：加密資料 -> 可讀筆記
```

加密前，筆記可能像這樣：

```txt
Hello, this is my private note.
```

加密後，它看起來像隨機資料：

```txt
K9sV1xQ4...unreadable bytes...
```

要把這些看似隨機的資料變回原始筆記，裝置需要正確的金鑰。

## 最核心的問題

多數加密問題最後都回到一個問題：

> 誰擁有金鑰？

在 Synch 中，你的裝置擁有金鑰。伺服器保存加密資料，但不會收到解密這些資料所需的明文金鑰。

Synch 會在上傳前，在你的裝置上加密檔案內容和檔案路徑等中繼資料。另一台裝置可以從伺服器下載加密資料，但只有在本機解鎖同一個 vault key 後，才能讀取這些資料。

下面說明這個流程如何運作。

## 兩個秘密，而不是一個

在 Synch 中建立 remote vault 時，你會選擇一個 vault password。

![Create vault screen](./create-vault.png)

很自然會以為，這個密碼直接加密了你的所有檔案。

但事實不是這樣。

Synch 使用兩個不同的秘密：

```txt
vault password：你記住並輸入的密碼
vault key：Synch 產生的隨機金鑰
```

vault key 才是真正用於加密和解密同步 vault 資料的金鑰。

vault password 有不同的任務：它保護 vault key，讓 vault key 可以被安全保存，並在你的其他裝置上解鎖。

可以這樣理解：

```txt
vault key = 資料的鑰匙
vault password = 解鎖 vault key 的鑰匙
```

多這一步很重要，因為人類密碼通常沒有足夠隨機性，不能直接當作強加密金鑰。即使一個密碼在人看來很強，如果攻擊者有機會大量猜測，電腦仍可能猜中。

所以 Synch 會為實際資料加密產生隨機的 32 位元組 vault key。

```txt
password = "my-strong-password"
vaultKey = "random-32-byte-key"
```

然後，Synch 用你的密碼保護這個 vault key。

## 保護 Vault Key

Synch 不能把可讀形式的 vault key 存在伺服器上。如果這樣做，伺服器就能讀取你的加密資料。

因此，Synch 保存的是 vault key 的加密副本。

為此，Synch 先把你的密碼轉換成一個更強的金鑰，稱為 `wrapKey`。

```txt
password + salt + Argon2id settings
=> wrapKey
```

`wrapKey` 不用於加密檔案。它只用於加密，也就是「包裹」 vault key。

Synch 使用 Argon2id 從你的密碼建立 `wrapKey`：

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

Argon2id 是基於密碼的金鑰衍生函數。通俗地說，它是一種故意比較昂貴的方式，把密碼轉換成加密金鑰。這會讓攻擊者猜密碼變慢。

salt 是隨機資料，會和加密後的 vault key 一起保存。它不是秘密。它的作用是確保同一個密碼在不同 vault 中不會總是產生相同結果。

如果你輸入相同密碼，並使用相同 salt 和設定，Synch 會再次得到相同的 `wrapKey`。如果密碼錯誤，Synch 得到的就是另一個 `wrapKey`。

接著，Synch 用 `wrapKey` 加密 vault key：

```txt
AES-GCM encrypt (
  key = wrapKey,
  nonce = random 12 bytes,
  plaintext = vaultKey
)
=> encrypted vaultKey
```

這裡使用的加密方法是 AES-GCM。nonce 是加密所需的隨機樣資料。它必須唯一，但不需要保密。

此時，伺服器可以保存加密後的 vault key 包。

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

這個包告訴 Synch 客戶端之後如何嘗試解鎖 vault key。它不會把密碼或 vault key 交給伺服器。

伺服器擁有：

```txt
salt
Argon2id settings
nonce
encrypted vaultKey
```

伺服器沒有：

```txt
password
wrapKey
vaultKey
```

這個差異就是 Synch 端對端加密設計的核心。

## 伺服器能看到什麼，不能看到什麼

因為伺服器沒有 vault key，所以它無法讀取你的檔案內容或解密後的檔案路徑。

伺服器保存的是加密資料，以及你的裝置在輸入正確 vault password 後解鎖它所需的資訊。

不過，端對端加密並不會隱藏所有資訊。伺服器仍可能看到運行同步服務所需的資訊，例如你的帳戶、vault 識別碼、加密物件大小、更新時間和同步活動。

關鍵界線是：伺服器不應該能靠自己把你的加密 vault 資料還原成可讀筆記。

## 加密檔案和中繼資料

你的裝置解鎖 vault key 後，Synch 會把這個 vault key 作為同步資料的根秘密。

檔案內容會在上傳前加密。檔案路徑等中繼資料也會在上傳前加密。每個加密項目都有自己的 nonce，nonce 會和加密資料一起保存，並在解密時使用。

伺服器只保存加密資料。它不保存明文檔案內容、明文檔案路徑或 vault key。

## 在另一台裝置上解鎖 Vault

![Connect vault screen](./connect-vault.png)

當另一台裝置連接到同一個 remote vault 時，它會從伺服器下載加密後的 vault key 包。

然後，你在那台裝置上輸入 vault password。

Synch 使用已保存的 salt 和 Argon2id 設定衍生出相同的 `wrapKey`：

```txt
Argon2id(password, same salt, same settings)
=> same wrapKey
```

如果密碼正確，裝置會用這個 `wrapKey` 解密加密後的 vault key：

```txt
AES-GCM decrypt(
  key = wrapKey,
  nonce = stored nonce,
  ciphertext = encrypted vaultKey
)
=> vaultKey
```

裝置拿到 vault key 後，就可以在本機解密同步檔案和中繼資料。

如果密碼錯誤，裝置會衍生出不同的 `wrapKey`，解密 vault key 會失敗。

## 為什麼 Vault Password 仍然重要

你的 vault password 並不直接加密 vault 中的每個檔案。它解鎖 vault key，而 vault key 加密實際同步的資料。

但這仍然讓密碼非常重要。

如果有人拿到了加密 vault key 包的副本，就可以離線嘗試猜密碼。Argon2id 會讓每次猜測更昂貴，但它無法保護一個容易猜到的密碼。

如果你忘記 vault password，Synch 無法為你復原 vault。衍生 `wrapKey` 需要密碼，解鎖 vault key 需要 `wrapKey`。沒有其中任何一個，加密 vault 資料就無法讀取。

如果你遺失密碼，伺服器也無法復原它。`wrapKey` 的衍生從你的密碼開始，而你的密碼本身從不會傳送給 Synch。

簡而言之，伺服器的角色是保存和同步加密 vault 資料；把它變回可讀筆記的過程完全發生在你的裝置上。讀取資料所需的秘密從不駐留在伺服器上。
