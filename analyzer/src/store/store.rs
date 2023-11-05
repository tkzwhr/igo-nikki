use std::env;

use reqwest::Client;
use reqwest::header::{HeaderMap, HeaderValue};

pub fn get_client() -> (Client, String) {
    let host = env::var("GRAPHQL_HOST").expect("GRAPHQL_HOST");
    let admin_secret = env::var("GRAPHQL_ADMIN_SECRET").expect("GRAPHQL_ADMIN_SECRET");

    let mut headers = HeaderMap::new();
    headers.append("x-hasura-admin-secret", HeaderValue::from_str(admin_secret.as_str()).unwrap());

    let client = Client::builder()
        .default_headers(headers)
        .build()
        .unwrap();

    (client, host)
}
