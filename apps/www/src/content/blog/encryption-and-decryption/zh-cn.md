---
title: Synch 的端到端加密是如何工作的？
description: 用通俗方式解释 Synch 如何让你在多台设备上解锁 vault，同时服务器无法读取你的笔记内容。
pubDate: 2026-05-01
---

端到端加密意味着，数据在离开你的设备之前就已经被锁住，并且只能在你的某台设备上再次解锁。

Synch 的服务器会帮助保存和同步数据，但它不会得到读取数据所需的秘密。

基本思路如下：

```txt
你的设备：可读笔记 -> 加密数据
服务器：保存加密数据
另一台设备：加密数据 -> 可读笔记
```

加密前，笔记可能像这样：

```txt
Hello, this is my private note.
```

加密后，它看起来像随机数据：

```txt
K9sV1xQ4...unreadable bytes...
```

要把这些看似随机的数据变回原始笔记，设备需要正确的密钥。

## 最核心的问题

大多数加密问题最终都落到一个问题上：

> 谁拥有密钥？

在 Synch 中，你的设备拥有密钥。服务器保存加密数据，但不会收到解密这些数据所需的明文密钥。

Synch 会在上传前，在你的设备上加密文件内容和文件路径等元数据。另一台设备可以从服务器下载加密数据，但只有在本地解锁同一个 vault key 后，才能读取这些数据。

下面解释这个过程如何工作。

## 两个秘密，而不是一个

在 Synch 中创建 remote vault 时，你会选择一个 vault password。

![Create vault screen](./create-vault.png)

很自然会以为，这个密码直接加密了你的所有文件。

但事实不是这样。

Synch 使用两个不同的秘密：

```txt
vault password：你记住并输入的密码
vault key：Synch 生成的随机密钥
```

vault key 才是真正用于加密和解密同步 vault 数据的密钥。

vault password 有不同的任务：它保护 vault key，让 vault key 可以被安全保存，并在你的其他设备上解锁。

可以这样理解：

```txt
vault key = 数据的钥匙
vault password = 解锁 vault key 的钥匙
```

多这一步很重要，因为人类密码通常没有足够随机性，不能直接当作强加密密钥。即使一个密码在人看来很强，如果攻击者有机会大量猜测，计算机仍可能猜中。

所以 Synch 会为实际数据加密生成随机的 32 字节 vault key。

```txt
password = "my-strong-password"
vaultKey = "random-32-byte-key"
```

然后，Synch 用你的密码保护这个 vault key。

## 保护 Vault Key

Synch 不能把可读形式的 vault key 存在服务器上。如果这样做，服务器就能读取你的加密数据。

因此，Synch 保存的是 vault key 的加密副本。

为此，Synch 首先把你的密码转换成一个更强的密钥，叫做 `wrapKey`。

```txt
password + salt + Argon2id settings
=> wrapKey
```

`wrapKey` 不用于加密文件。它只用于加密，也就是“包裹” vault key。

Synch 使用 Argon2id 从你的密码创建 `wrapKey`：

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

Argon2id 是基于密码的密钥派生函数。通俗地说，它是一种故意比较昂贵的方式，把密码转换成加密密钥。这会让攻击者猜密码变慢。

salt 是随机数据，会和加密后的 vault key 一起保存。它不是秘密。它的作用是确保同一个密码在不同 vault 中不会总是产生相同结果。

如果你输入相同密码，并使用相同 salt 和设置，Synch 会再次得到相同的 `wrapKey`。如果密码错误，Synch 得到的就是另一个 `wrapKey`。

接着，Synch 用 `wrapKey` 加密 vault key：

```txt
AES-GCM encrypt (
  key = wrapKey,
  nonce = random 12 bytes,
  plaintext = vaultKey
)
=> encrypted vaultKey
```

这里使用的加密方法是 AES-GCM。nonce 是加密所需的随机样数据。它必须唯一，但不需要保密。

此时，服务器可以保存加密后的 vault key 包。

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

这个包告诉 Synch 客户端之后如何尝试解锁 vault key。它不会把密码或 vault key 交给服务器。

服务器拥有：

```txt
salt
Argon2id settings
nonce
encrypted vaultKey
```

服务器没有：

```txt
password
wrapKey
vaultKey
```

这个差异就是 Synch 端到端加密设计的核心。

## 服务器能看到什么，不能看到什么

因为服务器没有 vault key，所以它无法读取你的文件内容或解密后的文件路径。

服务器保存的是加密数据，以及你的设备在输入正确 vault password 后解锁它所需的信息。

不过，端到端加密并不会隐藏所有信息。服务器仍可能看到运行同步服务所需的信息，例如你的账户、vault 标识符、加密对象大小、更新时间和同步活动。

关键边界是：服务器不应该能靠自己把你的加密 vault 数据还原成可读笔记。

## 加密文件和元数据

你的设备解锁 vault key 后，Synch 会把这个 vault key 作为同步数据的根秘密。

文件内容会在上传前加密。文件路径等元数据也会在上传前加密。每个加密项目都有自己的 nonce，nonce 会和加密数据一起保存，并在解密时使用。

服务器只保存加密数据。它不保存明文文件内容、明文文件路径或 vault key。

## 在另一台设备上解锁 Vault

![Connect vault screen](./connect-vault.png)

当另一台设备连接到同一个 remote vault 时，它会从服务器下载加密后的 vault key 包。

然后，你在那台设备上输入 vault password。

Synch 使用已保存的 salt 和 Argon2id 设置派生出相同的 `wrapKey`：

```txt
Argon2id(password, same salt, same settings)
=> same wrapKey
```

如果密码正确，设备会用这个 `wrapKey` 解密加密后的 vault key：

```txt
AES-GCM decrypt(
  key = wrapKey,
  nonce = stored nonce,
  ciphertext = encrypted vaultKey
)
=> vaultKey
```

设备拿到 vault key 后，就可以在本地解密同步文件和元数据。

如果密码错误，设备会派生出不同的 `wrapKey`，解密 vault key 会失败。

## 为什么 Vault Password 仍然重要

你的 vault password 并不直接加密 vault 中的每个文件。它解锁 vault key，而 vault key 加密实际同步的数据。

但这仍然让密码非常重要。

如果有人拿到了加密 vault key 包的副本，就可以离线尝试猜密码。Argon2id 会让每次猜测更昂贵，但它无法保护一个容易猜到的密码。

如果你忘记 vault password，Synch 无法为你恢复 vault。派生 `wrapKey` 需要密码，解锁 vault key 需要 `wrapKey`。没有其中任何一个，加密 vault 数据就无法读取。

如果你丢失密码，服务器也无法恢复它。`wrapKey` 的派生从你的密码开始，而你的密码本身从不会发送给 Synch。

简而言之，服务器的角色是保存和同步加密 vault 数据；把它变回可读笔记的过程完全发生在你的设备上。读取数据所需的秘密从不驻留在服务器上。
