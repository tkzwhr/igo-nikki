import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:20180/v1/graphql": {
        headers: {
          "x-hasura-admin-secret": "hasura",
        },
      },
    },
  ],
  documents: ["src/queries/*.ts"],
  generates: {
    "./src/generated/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
