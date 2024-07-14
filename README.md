囲碁日記
===

# Requirement

- cargo make
- Docker
- hasura cli

# Usage

### バックエンドシステム開始

DB、Hasura、KataGoを起動する。

```shell
cargo make up
```

### フロントエンド開発

`web/.env` を作成する。

```text
VITE_HASURA_URI=http://localhost:20180/v1/graphql
VITE_AUTH0_DOMAIN=your auth0 domain
VITE_AUTH0_CLIENT_ID=your auth0 client id
VITE_AUTH0_AUDIENCE=your auth0 audience
```

起動する。

```shell
cargo make front-dev
```

### 解析器開発

`analyzer/.env` を作成する。

```
cat > analyzer/.env << "EOM"
GRAPHQL_HOST=http://localhost:20180/v1/graphql
GRAPHQL_ADMIN_SECRET=hasura
ANALYZER_COMMAND=docker
ANALYZER_OPTIONS="exec -i katago ./katago analysis -model default_model.bin.gz -config analysis.cfg"
MOVE_PER_TURNS=3
EOM
```

起動する。

```shell
cargo make analyze
```

### 解析器のビルド

```shell
cargo make analyzer-build
```

### Hasura Metadataの更新

```shell
cargo make hasura_metadata-update
```

### GraphQL Schemaの更新

```shell
cargo make graphql_schema-update
```

### バックエンドシステム終了

```shell
cargo make down
```

# Note

- なし

# License

- [MIT](https://en.wikipedia.org/wiki/MIT_License)