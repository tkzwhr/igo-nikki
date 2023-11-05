use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    analyzer::analyze().await;
}
