FROM messense/rust-musl-cross:x86_64-musl AS analyzer-builder

WORKDIR /app

RUN rustup target add x86_64-unknown-linux-musl

COPY analyzer/Cargo.toml analyzer/Cargo.toml
COPY analyzer/Cargo.lock analyzer/Cargo.lock
COPY analyzer/src analyzer/src
COPY graphql graphql

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cd analyzer && cargo build --release --target x86_64-unknown-linux-musl
RUN strip /app/analyzer/target/x86_64-unknown-linux-musl/release/analyzer

FROM infra-katago

COPY --from=analyzer-builder /app/analyzer/target/x86_64-unknown-linux-musl/release/analyzer analyzer

COPY infra/analyzer/schedule.txt /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab

# install
RUN apt update && apt install -y cron

# crontab
RUN crontab /etc/cron.d/crontab

CMD ["cron", "-f"]
