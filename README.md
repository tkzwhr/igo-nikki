囲碁日記
===

## 必要なソフトウェア

- Docker
- mkcert
- ngrok
- hasura cli

## 導入

ローカルでAuth0をを使用するためには下記の要件を満たす必要がある。

- サーバーをhttpsで起動する
- `localhost` 以外のドメインを使用できるようにする
  - `localhost.local` を用意する

### WSL2での設定例

Windows側で下記のファイルを修正する。

- `\Windows\System32\drivers\etc\hosts` に追記

```text
::1     localhost.local
```

WSL側で下記のファイルを修正する。

- `/etc/wsl.conf` に追記

```text
[network]
generateHosts = false
```

- `/etc/hosts` に追記

```text
::1     localhost.local
```

WSL側で、CA証明書をインストールし、Windowsの形式にエクスポートする。

```shell
mkcert -install
cd $(mkcert -CAROOT)
openssl pkcs12 -export -inkey rootCA-key.pem -in rootCA.pem -out rootCA.pfx
explorer.exe .
```

エクスプローラーが起動したら、 `rootCA.pfx` をダブルクリックする。

途中、証明書ストアのところで、 *証明書をすべて次のストアに配置する* ＞ *信頼されたルート証明機関に指定* と選択する。

Firefoxの場合は、更にWindowsの証明書を使用する設定を追加する。

`about:config` を開き、 `security.enterprise_roots.enabled` を `true` にする。

ここまで行ったら **Windowsを再起動** する。

### サーバーの起動

PostgresとHasuraを起動する。

```shell
cd infra
docker compose up -d
cd ../web

# auth0バイパス用
yarn run dev:bypass

# 通常用
yarn run dev
```

### Auth0の設定

Auth0からのHasuraにアクセスできるようにするために、ngrokでHasuraのエンドポイントを公開する。

```shell
ngrok http 20180
```

エンドポイントのURLが表示されたらAuth0側に設定する。

Auth Pipeline > Rules を開き、 `sign-in` のruleの `const domain = "xxx";` を書き換える。

#### バイパス用

Auth0をバイパスする場合は、下記の通りAPIデバッガーを利用する。

https://hasura.io/learn/ja/graphql/hasura/authentication/5-test-with-headers/

`access_token` が取得できたら、ルートディレクトリに `.env.development.local` を作成する。

```
VITE_BYPASS_AUTH0=1
VITE_HASURA_TOKEN=<上記で取得したaccess_token>
```

また、hasuraコンソール上でユーザーを作成する。

### Webの起動

```shell
cd web
yarn run dev
```

### Hasura Metadataの更新

```shell
cd infra/hasura
rm -rf metadata
hasura metadata export --admin-secret hasura
```
