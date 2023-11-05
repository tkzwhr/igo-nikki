use std::process::Stdio;

use serde::de::DeserializeOwned;
use serde::Serialize;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::{ChildStdin, Command};
use tokio::sync::mpsc;
use tokio::sync::mpsc::Receiver;

pub struct InteractiveJsonProcess<T> {
    stdin: ChildStdin,
    rx: Option<Receiver<T>>,
}

#[derive(Debug)]
pub enum Error {
    FailedLaunch(std::io::Error),
    StdinNotAvailable,
    StdoutNotAvailable,
}

#[derive(Debug)]
pub enum SendError {
    FailedDeserialize(serde_json::Error),
    FailedSend(std::io::Error),
}

impl<T> InteractiveJsonProcess<T> where T: DeserializeOwned + Send + 'static {
    pub fn new(command: &str, args: Vec<&str>) -> Result<InteractiveJsonProcess<T>, Error> {
        let (tx, rx) = mpsc::channel(255);

        let process = Command::new(command)
            .args(args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .spawn()
            .map_err(|err| Error::FailedLaunch(err))?;

        let stdin = process.stdin.ok_or(Error::StdinNotAvailable)?;

        let stdout = process.stdout.ok_or(Error::StdoutNotAvailable)?;
        let mut lines = BufReader::new(stdout).lines();

        tokio::spawn(async move {
            while let Ok(Some(data)) = lines.next_line().await {
                if let Ok(obj) = serde_json::from_reader::<_, T>(data.clone().as_bytes()) {
                    let _ = tx.send(obj).await;
                } else {
                    break;
                }
            }
        });

        Ok(InteractiveJsonProcess { stdin, rx: Some(rx) })
    }

    pub async fn send<U>(&mut self, data: U) -> Result<(), SendError> where U: Serialize {
        let json = serde_json::to_string(&data).map_err(|err| SendError::FailedDeserialize(err))?;
        let json = format!("{}\n", json);

        self.stdin.write_all(json.as_bytes()).await.map_err(|err| SendError::FailedSend(err))
    }

    pub fn receive(&mut self) -> Option<Receiver<T>> {
        self.rx.take()
    }
}
