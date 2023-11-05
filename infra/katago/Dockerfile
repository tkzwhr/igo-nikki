FROM nvidia/cuda:12.2.2-cudnn8-devel-ubuntu22.04 AS katago-builder

RUN mkdir /work
WORKDIR /work

# install
RUN apt update && apt install -y \
    git \
    build-essential \
    cmake \
    libzip-dev

# download
RUN git clone https://github.com/lightvector/KataGo.git

# build
RUN cd KataGo/cpp && cmake . -DUSE_BACKEND=CUDA && make -j 16

FROM nvidia/cuda:12.2.2-cudnn8-runtime-ubuntu22.04

RUN mkdir /app
WORKDIR /app

COPY --from=katago-builder /work/KataGo/cpp/katago .
COPY --from=katago-builder /work/KataGo/cpp/configs/gtp_example.cfg ./gtp.cfg
COPY --from=katago-builder /work/KataGo/cpp/configs/analysis_example.cfg ./analysis.cfg

COPY tz-jst /etc/localtime

# install
RUN apt update && apt install -y wget libzip4

# get model
RUN wget https://media.katagotraining.org/uploaded/networks/models/kata1/kata1-b18c384nbt-s7709731328-d3715293823.bin.gz -O default_model.bin.gz

CMD ["/bin/bash"]
