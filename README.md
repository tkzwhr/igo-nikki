囲碁日記
===

## 必要なソフトウェア

- cargo make
- Docker
- hasura cli
- ngrok

## 導入

ローカルでAuth0をを使用するためには下記の要件を満たす必要がある。

- サーバーをhttpsで起動する
- `localhost` 以外のドメインを使用できるようにする

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

DB、Hasura、KataGoを起動する。

```shell
cargo make up
```

### サーバーの終了

```shell
cargo make down
```

### フロントエンド開発

```shell
cargo make front
```

ngrokのエンドポイントのURLが表示されたらAuth0側に設定する。

Actions > Library > Custom を開き、 `sign-in` のactionのSecretsにある `entrypoint` を書き換える。

#### Auth0のバイパス

Auth0をバイパスしたい場合は、下記の通りAPIデバッガーを利用する。

https://hasura.io/learn/ja/graphql/hasura/authentication/5-test-with-headers/

`access_token` が取得できたら、 `web/.env.development.local` を作成する。

```
VITE_BYPASS_AUTH0=1
VITE_HASURA_TOKEN=<上記で取得したaccess_token>
```

DBにユーザーを作成してバイパス用のコマンドで起動する。

```shell
cargo make create_user <ユーザーID>
cargo make front_bypass
```

### 解析器開発

`analyzer/.env` を作成する。

```
GRAPHQL_HOST=http://localhost:20180/v1/graphql
GRAPHQL_ADMIN_SECRET=hasura
ANALYZER_COMMAND=docker
ANALYZER_OPTIONS="exec -i katago ./katago analysis -model default_model.bin.gz -config analysis.cfg"
MOVE_PER_TURNS=3
```

起動する。

```shell
cargo make analyze
```

### 解析器のビルド

```shell
cargo make build_analyzer
```

### Hasura Metadataの更新

```shell
cargo make update_hasura_metadata
```

### GraphQL Schemaの更新

```shell
cargo make update_graphql_schema
```
