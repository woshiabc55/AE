# AE（Adaptive Engine）白皮书 — 附录

---

## 附录A：完整配置参考

本附录列出 AE 引擎的全部配置项，按模块分组。每个配置项包含配置键名、默认值、可选值范围、描述、影响范围、是否支持热加载以及示例。

### A.1 核心引擎配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.engine.mode` | `cluster` | `cluster`, `local`, `mini-cluster` | 引擎运行模式。cluster 为分布式集群模式，local 为单机调试模式，mini-cluster 为嵌入式测试集群 | 全局 | 否 | `ae.engine.mode=cluster` |
| `ae.engine.name` | `ae-engine` | 任意合法字符串 | 引擎实例名称，用于集群内唯一标识 | 全局 | 否 | `ae.engine.name=prod-cluster-01` |
| `ae.engine.version` | 当前版本 | 不可修改 | 引擎版本号，只读 | 全局 | 否 | — |
| `ae.engine.start-timeout` | `300s` | `10s` ~ `3600s` | 引擎启动超时时间 | 全局 | 否 | `ae.engine.start-timeout=600s` |
| `ae.engine.shutdown-timeout` | `60s` | `5s` ~ `600s` | 引擎优雅关闭超时时间 | 全局 | 否 | `ae.engine.shutdown-timeout=120s` |
| `ae.engine.parallelism.default` | `1` | `1` ~ `32768` | 默认算子并行度 | 全局 | 是 | `ae.engine.parallelism.default=16` |
| `ae.engine.parallelism.max` | `4096` | `1` ~ `65536` | 最大允许并行度上限 | 全局 | 是 | `ae.engine.parallelism.max=8192` |
| `ae.engine.slot.num` | `1` | `1` ~ `1024` | 每个 TaskManager 的 Slot 数量 | TaskManager | 否 | `ae.engine.slot.num=8` |
| `ae.engine.slot.timeout` | `30s` | `1s` ~ `600s` | Slot 申请超时时间 | TaskManager | 是 | `ae.engine.slot.timeout=60s` |
| `ae.engine.heartbeat.interval` | `10s` | `1s` ~ `300s` | 心跳发送间隔 | 全局 | 是 | `ae.engine.heartbeat.interval=15s` |
| `ae.engine.heartbeat.timeout` | `60s` | `5s` ~ `600s` | 心跳超时判定时间 | 全局 | 是 | `ae.engine.heartbeat.timeout=120s` |
| `ae.engine.max-parallelism` | `32768` | `1` ~ `2147483647` | KeyGroup 最大并行度 | 全局 | 否 | `ae.engine.max-parallelism=65536` |
| `ae.engine.adaptive.enabled` | `true` | `true`, `false` | 是否启用自适应优化 | 全局 | 是 | `ae.engine.adaptive.enabled=true` |
| `ae.engine.adaptive.interval` | `30s` | `5s` ~ `600s` | 自适应优化检测间隔 | 全局 | 是 | `ae.engine.adaptive.interval=60s` |
| `ae.engine.failover.strategy` | `region` | `region`, `full`, `pipelined` | 故障恢复策略 | 全局 | 否 | `ae.engine.failover.strategy=region` |
| `ae.engine.restart-strategy` | `fixed-delay` | `fixed-delay`, `failure-rate`, `exponential-delay`, `none` | 重启策略类型 | 全局 | 是 | `ae.engine.restart-strategy=failure-rate` |
| `ae.engine.restart-strategy.fixed-delay.attempts` | `3` | `1` ~ `2147483647` | 固定延迟重启最大尝试次数 | 全局 | 是 | `ae.engine.restart-strategy.fixed-delay.attempts=5` |
| `ae.engine.restart-strategy.fixed-delay.delay` | `10s` | `1s` ~ `3600s` | 固定延迟重启间隔 | 全局 | 是 | `ae.engine.restart-strategy.fixed-delay.delay=30s` |
| `ae.engine.restart-strategy.failure-rate.max-failures-per-interval` | `3` | `1` ~ `2147483647` | 失败率重启：间隔内最大失败次数 | 全局 | 是 | `ae.engine.restart-strategy.failure-rate.max-failures-per-interval=5` |
| `ae.engine.restart-strategy.failure-rate.failure-rate-interval` | `5min` | `1s` ~ `86400s` | 失败率重启：统计间隔 | 全局 | 是 | `ae.engine.restart-strategy.failure-rate.failure-rate-interval=10min` |
| `ae.engine.restart-strategy.failure-rate.delay` | `10s` | `1s` ~ `3600s` | 失败率重启：重启延迟 | 全局 | 是 | `ae.engine.restart-strategy.failure-rate.delay=20s` |
| `ae.engine.restart-strategy.exponential-delay.initial-backoff` | `1s` | `1s` ~ `3600s` | 指数退避重启：初始延迟 | 全局 | 是 | `ae.engine.restart-strategy.exponential-delay.initial-backoff=2s` |
| `ae.engine.restart-strategy.exponential-delay.max-backoff` | `300s` | `1s` ~ `86400s` | 指数退避重启：最大延迟 | 全局 | 是 | `ae.engine.restart-strategy.exponential-delay.max-backoff=600s` |
| `ae.engine.classloader.resolve-order` | `child-first` | `child-first`, `parent-first` | 类加载器解析顺序 | 全局 | 否 | `ae.engine.classloader.resolve-order=child-first` |
| `ae.engine.classloader.parent-first-patterns` | `java.;scala.;org.apache.` | 逗号分隔的包名前缀 | parent-first 模式下优先从父加载器加载的包 | 全局 | 否 | `ae.engine.classloader.parent-first-patterns=java.;javax.;scala.` |

配置示例文件：

```yaml
# ae-engine-conf.yaml — 核心引擎配置示例
ae:
  engine:
    mode: cluster
    name: prod-cluster-01
    start-timeout: 600s
    shutdown-timeout: 120s
    parallelism:
      default: 16
      max: 8192
    slot:
      num: 8
      timeout: 60s
    heartbeat:
      interval: 15s
      timeout: 120s
    adaptive:
      enabled: true
      interval: 60s
    failover:
      strategy: region
    restart-strategy: failure-rate
    restart-strategy:
      failure-rate:
        max-failures-per-interval: 5
        failure-rate-interval: 10min
        delay: 20s
    classloader:
      resolve-order: child-first
      parent-first-patterns: "java.;javax.;scala."
```

### A.2 调度器配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.scheduler.type` | `adaptive` | `adaptive`, `eager`, `lazy-from-sources`, `pipelined-region` | 调度器类型 | 全局 | 否 | `ae.scheduler.type=adaptive` |
| `ae.scheduler.max-pending-requests` | `1024` | `1` ~ `65536` | 最大待调度请求数 | 全局 | 是 | `ae.scheduler.max-pending-requests=2048` |
| `ae.scheduler.schedule-interval` | `100ms` | `10ms` ~ `10000ms` | 调度循环间隔 | 全局 | 是 | `ae.scheduler.schedule-interval=200ms` |
| `ae.scheduler.queue-type` | `weighted-fair` | `fifo`, `priority`, `weighted-fair`, `deadline` | 调度队列类型 | 全局 | 是 | `ae.scheduler.queue-type=weighted-fair` |
| `ae.scheduler.weight.default` | `1.0` | `0.01` ~ `100.0` | 默认作业权重 | 全局 | 是 | `ae.scheduler.weight.default=2.0` |
| `ae.scheduler.weight.high-priority` | `10.0` | `0.01` ~ `100.0` | 高优先级作业权重 | 全局 | 是 | `ae.scheduler.weight.high-priority=20.0` |
| `ae.scheduler.preemption.enabled` | `false` | `true`, `false` | 是否启用抢占式调度 | 全局 | 是 | `ae.scheduler.preemption.enabled=true` |
| `ae.scheduler.preemption.timeout` | `30s` | `5s` ~ `300s` | 抢占操作超时 | 全局 | 是 | `ae.scheduler.preemption.timeout=60s` |
| `ae.scheduler.speculative.enabled` | `false` | `true`, `false` | 是否启用推测执行 | 全局 | 是 | `ae.scheduler.speculative.enabled=true` |
| `ae.scheduler.speculative.multiplier` | `1.5` | `1.1` ~ `5.0` | 推测执行触发倍率（慢任务与中位数的比值） | 全局 | 是 | `ae.scheduler.speculative.multiplier=2.0` |
| `ae.scheduler.speculative.max-concurrent` | `2` | `1` ~ `16` | 每个任务最大推测副本数 | 全局 | 是 | `ae.scheduler.speculative.max-concurrent=3` |
| `ae.scheduler.speculative.min-completed` | `0.5` | `0.0` ~ `1.0` | 推测执行最低完成比例 | 全局 | 是 | `ae.scheduler.speculative.min-completed=0.75` |
| `ae.scheduler.resource-score.cpu-weight` | `0.4` | `0.0` ~ `1.0` | 资源评分 CPU 权重 | 全局 | 是 | `ae.scheduler.resource-score.cpu-weight=0.5` |
| `ae.scheduler.resource-score.memory-weight` | `0.3` | `0.0` ~ `1.0` | 资源评分内存权重 | 全局 | 是 | `ae.scheduler.resource-score.memory-weight=0.3` |
| `ae.scheduler.resource-score.io-weight` | `0.3` | `0.0` ~ `1.0` | 资源评分 I/O 权重 | 全局 | 是 | `ae.scheduler.resource-score.io-weight=0.2` |
| `ae.scheduler.prediction.enabled` | `true` | `true`, `false` | 是否启用预测调度 | 全局 | 是 | `ae.scheduler.prediction.enabled=false` |
| `ae.scheduler.prediction.model` | `linear-regression` | `linear-regression`, `ewma`, `arima`, `mlp` | 预测调度模型类型 | 全局 | 是 | `ae.scheduler.prediction.model=ewma` |
| `ae.scheduler.prediction.window` | `60` | `10` ~ `1000` | 预测窗口大小（历史数据点数） | 全局 | 是 | `ae.scheduler.prediction.window=120` |
| `ae.scheduler.prediction.ewma.alpha` | `0.3` | `0.01` ~ `1.0` | EWMA 平滑系数 | 全局 | 是 | `ae.scheduler.prediction.ewma.alpha=0.2` |
| `ae.scheduler.queue.fair.quantum` | `100ms` | `10ms` ~ `10000ms` | 加权公平排队时间片 | 全局 | 是 | `ae.scheduler.queue.fair.quantum=200ms` |
| `ae.scheduler.backpressure.enabled` | `true` | `true`, `false` | 是否启用背压感知调度 | 全局 | 是 | `ae.scheduler.backpressure.enabled=true` |
| `ae.scheduler.backpressure.threshold` | `0.7` | `0.0` ~ `1.0` | 背压阈值（超过则降低调度速率） | 全局 | 是 | `ae.scheduler.backpressure.threshold=0.8` |

```yaml
# 调度器配置示例
ae:
  scheduler:
    type: adaptive
    max-pending-requests: 2048
    schedule-interval: 200ms
    queue-type: weighted-fair
    weight:
      default: 2.0
      high-priority: 20.0
    preemption:
      enabled: true
      timeout: 60s
    speculative:
      enabled: true
      multiplier: 2.0
      max-concurrent: 3
      min-completed: 0.75
    resource-score:
      cpu-weight: 0.5
      memory-weight: 0.3
      io-weight: 0.2
    prediction:
      enabled: true
      model: ewma
      window: 120
      ewma:
        alpha: 0.2
    queue:
      fair:
        quantum: 200ms
    backpressure:
      enabled: true
      threshold: 0.8
```

### A.3 执行器配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.executor.type` | `stream` | `stream`, `batch`, `auto` | 执行器类型 | 全局 | 否 | `ae.executor.type=auto` |
| `ae.executor.buffer-timeout` | `100ms` | `0ms` ~ `1000ms` | 输出缓冲区超时（0 为无缓冲） | 算子 | 是 | `ae.executor.buffer-timeout=50ms` |
| `ae.executor.buffer.max-size` | `1024` | `1` ~ `65536` | 输出缓冲区最大记录数 | 算子 | 是 | `ae.executor.buffer.max-size=2048` |
| `ae.executor.operator-chaining.enabled` | `true` | `true`, `false` | 是否启用算子链优化 | 全局 | 否 | `ae.executor.operator-chaining.enabled=true` |
| `ae.executor.object-reuse.enabled` | `false` | `true`, `false` | 是否启用对象复用（减少 GC） | 全局 | 是 | `ae.executor.object-reuse.enabled=true` |
| `ae.executor.latency-tracking.enabled` | `false` | `true`, `false` | 是否启用延迟追踪 | 全局 | 是 | `ae.executor.latency-tracking.enabled=true` |
| `ae.executor.latency-tracking.interval` | `1000ms` | `100ms` ~ `60000ms` | 延迟追踪采样间隔 | 全局 | 是 | `ae.executor.latency-tracking.interval=500ms` |
| `ae.executor.latency-tracking.history-size` | `128` | `10` ~ `10000` | 延迟追踪历史样本数 | 全局 | 是 | `ae.executor.latency-tracking.history-size=256` |
| `ae.executor.watermark-interval` | `200ms` | `1ms` ~ `60000ms` | Watermark 发射间隔 | 全局 | 是 | `ae.executor.watermark-interval=500ms` |
| `ae.executor.idle-timeout` | `0ms` | `0ms` ~ `3600000ms` | 空闲 Source 超时（0 为不超时） | Source | 是 | `ae.executor.idle-timeout=30000ms` |
| `ae.executor.max-record-size` | `1048576` | `1024` ~ `1073741824` | 单条记录最大字节数 | 全局 | 是 | `ae.executor.max-record-size=2097152` |
| `ae.executor.batch-shuffle.mode` | `hash` | `hash`, `sort`, `auto` | Batch Shuffle 模式 | 全局 | 否 | `ae.executor.batch-shuffle.mode=sort` |
| `ae.executor.async-lookup.buffer-capacity` | `1000` | `1` ~ `100000` | 异步 Lookup 缓冲容量 | 算子 | 是 | `ae.executor.async-lookup.buffer-capacity=2000` |
| `ae.executor.async-lookup.timeout` | `30s` | `1s` ~ `600s` | 异步 Lookup 超时 | 算子 | 是 | `ae.executor.async-lookup.timeout=60s` |

```yaml
# 执行器配置示例
ae:
  executor:
    type: auto
    buffer-timeout: 50ms
    buffer:
      max-size: 2048
    operator-chaining:
      enabled: true
    object-reuse:
      enabled: true
    latency-tracking:
      enabled: true
      interval: 500ms
      history-size: 256
    watermark-interval: 500ms
    idle-timeout: 30000ms
    max-record-size: 2097152
    batch-shuffle:
      mode: sort
    async-lookup:
      buffer-capacity: 2000
      timeout: 60s
```

### A.4 内存管理配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.memory.process.size` | — | `128mb` ~ `64gb` | 进程总内存大小 | TaskManager | 否 | `ae.memory.process.size=4096mb` |
| `ae.memory.framework.heap` | `128mb` | `64mb` ~ `1024mb` | 框架堆内存 | TaskManager | 否 | `ae.memory.framework.heap=256mb` |
| `ae.memory.framework.offheap` | `128mb` | `64mb` ~ `1024mb` | 框架堆外内存 | TaskManager | 否 | `ae.memory.framework.offheap=256mb` |
| `ae.memory.task.heap` | `—` | 自动计算或手动指定 | 任务堆内存 | TaskManager | 否 | `ae.memory.task.heap=2048mb` |
| `ae.memory.task.offheap` | `0mb` | `0mb` ~ `8192mb` | 任务堆外内存 | TaskManager | 否 | `ae.memory.task.offheap=512mb` |
| `ae.memory.managed.size` | `—` | 自动计算或手动指定 | 托管内存（排序、缓存等） | TaskManager | 否 | `ae.memory.managed.size=1024mb` |
| `ae.memory.managed.fraction` | `0.4` | `0.0` ~ `1.0` | 托管内存占剩余内存比例 | TaskManager | 否 | `ae.memory.managed.fraction=0.3` |
| `ae.memory.network.min` | `64mb` | `16mb` ~ `4096mb` | 网络缓冲区最小内存 | TaskManager | 否 | `ae.memory.network.min=128mb` |
| `ae.memory.network.max` | `1024mb` | `64mb` ~ `8192mb` | 网络缓冲区最大内存 | TaskManager | 否 | `ae.memory.network.max=2048mb` |
| `ae.memory.network.buffers-per-channel` | `2` | `1` ~ `64` | 每个通道的网络缓冲区数 | TaskManager | 否 | `ae.memory.network.buffers-per-channel=4` |
| `ae.memory.network.floating-buffers-per-gate` | `8` | `1` ~ `256` | 每个 Gate 的浮动缓冲区数 | TaskManager | 否 | `ae.memory.network.floating-buffers-per-gate=16` |
| `ae.memory.network.request-segments-timeout` | `300s` | `1s` ~ `3600s` | 网络缓冲区申请超时 | TaskManager | 是 | `ae.memory.network.request-segments-timeout=600s` |
| `ae.memory.jvm-overhead.min` | `192mb` | `64mb` ~ `4096mb` | JVM 开销最小值 | TaskManager | 否 | `ae.memory.jvm-overhead.min=256mb` |
| `ae.memory.jvm-overhead.max` | `1024mb` | `64mb` ~ `8192mb` | JVM 开销最大值 | TaskManager | 否 | `ae.memory.jvm-overhead.max=2048mb` |
| `ae.memory.jvm-overhead.fraction` | `0.1` | `0.01` ~ `0.5` | JVM 开销占进程内存比例 | TaskManager | 否 | `ae.memory.jvm-overhead.fraction=0.15` |
| `ae.memory.spill.enabled` | `true` | `true`, `false` | 是否启用内存溢写 | TaskManager | 是 | `ae.memory.spill.enabled=true` |
| `ae.memory.spill.threshold` | `0.8` | `0.5` ~ `0.99` | 溢写触发阈值（托管内存使用率） | TaskManager | 是 | `ae.memory.spill.threshold=0.75` |
| `ae.memory.spill.dir` | `/tmp/ae-spill` | 合法目录路径 | 溢写目录 | TaskManager | 是 | `ae.memory.spill.dir=/data/ae-spill` |
| `ae.memory.spill.compression` | `snappy` | `none`, `snappy`, `lz4`, `zstd` | 溢写压缩算法 | TaskManager | 是 | `ae.memory.spill.compression=lz4` |
| `ae.memory.gc-friendly.enabled` | `true` | `true`, `false` | 是否启用 GC 友好数据结构 | TaskManager | 否 | `ae.memory.gc-friendly.enabled=true` |

```yaml
# 内存管理配置示例
ae:
  memory:
    process:
      size: 8192mb
    framework:
      heap: 256mb
      offheap: 256mb
    task:
      heap: 4096mb
      offheap: 512mb
    managed:
      fraction: 0.3
    network:
      min: 256mb
      max: 2048mb
      buffers-per-channel: 4
      floating-buffers-per-gate: 16
      request-segments-timeout: 600s
    jvm-overhead:
      fraction: 0.15
    spill:
      enabled: true
      threshold: 0.75
      dir: /data/ae-spill
      compression: lz4
    gc-friendly:
      enabled: true
```

### A.5 网络与Shuffle配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.shuffle.mode` | `auto` | `auto`, `hash`, `sort`, `pipelined` | Shuffle 模式 | 全局 | 否 | `ae.shuffle.mode=sort` |
| `ae.shuffle.service.enabled` | `false` | `true`, `false` | 是否启用远程 Shuffle Service | 全局 | 否 | `ae.shuffle.service.enabled=true` |
| `ae.shuffle.service.host` | `localhost` | 合法主机名或 IP | Shuffle Service 地址 | 全局 | 否 | `ae.shuffle.service.host=shuffle-svc.internal` |
| `ae.shuffle.service.port` | `6123` | `1` ~ `65535` | Shuffle Service 端口 | 全局 | 否 | `ae.shuffle.service.port=7123` |
| `ae.shuffle.compression.codec` | `snappy` | `none`, `snappy`, `lz4`, `zstd`, `lzma` | Shuffle 数据压缩编解码器 | 全局 | 是 | `ae.shuffle.compression.codec=lz4` |
| `ae.shuffle.compression.level` | `6` | `1` ~ `22`（zstd） | 压缩级别 | 全局 | 是 | `ae.shuffle.compression.level=3` |
| `ae.shuffle.sort.buffers-per-partition` | `4` | `1` ~ `64` | Sort Shuffle 每个分区的缓冲区数 | 全局 | 否 | `ae.shuffle.sort.buffers-per-partition=8` |
| `ae.shuffle.sort.max-threads` | `2` | `1` ~ `64` | Sort Shuffle 排序线程数 | TaskManager | 否 | `ae.shuffle.sort.max-threads=4` |
| `ae.shuffle.batch.bounded-block-size` | `64kb` | `4kb` ~ `4096kb` | Batch Shuffle 块大小 | 全局 | 否 | `ae.shuffle.batch.bounded-block-size=128kb` |
| `ae.shuffle.batch.unbounded-block-size` | `4mb` | `256kb` ~ `64mb` | Batch Shuffle 无界块大小 | 全局 | 否 | `ae.shuffle.batch.unbounded-block-size=8mb` |
| `ae.shuffle.join-buffer-size` | `32mb` | `1mb` ~ `1024mb` | Sort Merge Join 缓冲区大小 | 算子 | 是 | `ae.shuffle.join-buffer-size=64mb` |
| `ae.shuffle.io.max-retries` | `3` | `0` ~ `100` | Shuffle IO 最大重试次数 | 全局 | 是 | `ae.shuffle.io.max-retries=5` |
| `ae.shuffle.io.retry-backoff` | `100ms` | `10ms` ~ `10000ms` | Shuffle IO 重试退避时间 | 全局 | 是 | `ae.shuffle.io.retry-backoff=200ms` |
| `ae.shuffle.io.timeout` | `60s` | `1s` ~ `600s` | Shuffle IO 超时 | 全局 | 是 | `ae.shuffle.io.timeout=120s` |
| `ae.shuffle.data-transport.max-chunk-size` | `64kb` | `4kb` ~ `4096kb` | 数据传输最大块大小 | 全局 | 否 | `ae.shuffle.data-transport.max-chunk-size=128kb` |
| `ae.shuffle.data-transport.num-threads` | `4` | `1` ~ `64` | 数据传输线程数 | TaskManager | 否 | `ae.shuffle.data-transport.num-threads=8` |
| `ae.network.tcp.keep-alive` | `true` | `true`, `false` | 是否启用 TCP Keep-Alive | 全局 | 否 | `ae.network.tcp.keep-alive=true` |
| `ae.network.tcp.send-buffer-size` | `0` | `0` ~ `16777216` | TCP 发送缓冲区大小（0 为系统默认） | 全局 | 否 | `ae.network.tcp.send-buffer-size=1048576` |
| `ae.network.tcp.receive-buffer-size` | `0` | `0` ~ `16777216` | TCP 接收缓冲区大小 | 全局 | 否 | `ae.network.tcp.receive-buffer-size=1048576` |
| `ae.network.backpressure.enabled` | `true` | `true`, `false` | 是否启用网络背压 | 全局 | 否 | `ae.network.backpressure.enabled=true` |
| `ae.network.backpressure.credit-based` | `true` | `true`, `false` | 是否使用基于信用的背压 | 全局 | 否 | `ae.network.backpressure.credit-based=true` |

```yaml
# 网络与Shuffle配置示例
ae:
  shuffle:
    mode: sort
    service:
      enabled: true
      host: shuffle-svc.internal
      port: 7123
    compression:
      codec: lz4
      level: 3
    sort:
      buffers-per-partition: 8
      max-threads: 4
    batch:
      bounded-block-size: 128kb
      unbounded-block-size: 8mb
    join-buffer-size: 64mb
    io:
      max-retries: 5
      retry-backoff: 200ms
      timeout: 120s
    data-transport:
      max-chunk-size: 128kb
      num-threads: 8
  network:
    tcp:
      keep-alive: true
      send-buffer-size: 1048576
      receive-buffer-size: 1048576
    backpressure:
      enabled: true
      credit-based: true
```

### A.6 Checkpoint与状态配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.checkpoint.interval` | `—` | `100ms` ~ `86400000ms` | Checkpoint 间隔（不设置则不启用） | 全局 | 是 | `ae.checkpoint.interval=30000ms` |
| `ae.checkpoint.mode` | `exactly-once` | `exactly-once`, `at-least-once` | Checkpoint 语义 | 全局 | 是 | `ae.checkpoint.mode=exactly-once` |
| `ae.checkpoint.timeout` | `600000ms` | `1000ms` ~ `86400000ms` | Checkpoint 超时时间 | 全局 | 是 | `ae.checkpoint.timeout=1200000ms` |
| `ae.checkpoint.max-concurrent` | `1` | `1` ~ `10` | 最大并发 Checkpoint 数 | 全局 | 是 | `ae.checkpoint.max-concurrent=3` |
| `ae.checkpoint.min-pause` | `0ms` | `0ms` ~ `3600000ms` | 两次 Checkpoint 最小间隔 | 全局 | 是 | `ae.checkpoint.min-pause=5000ms` |
| `ae.checkpoint.unaligned.enabled` | `false` | `true`, `false` | 是否启用非对齐 Checkpoint | 全局 | 是 | `ae.checkpoint.unaligned.enabled=true` |
| `ae.checkpoint.unaligned.forced` | `false` | `true`, `false` | 是否强制非对齐 Checkpoint | 全局 | 是 | `ae.checkpoint.unaligned.forced=false` |
| `ae.checkpoint.alignment-timeout` | `0ms` | `0ms` ~ `60000ms` | 对齐超时后切换为非对齐（0 为不切换） | 全局 | 是 | `ae.checkpoint.alignment-timeout=30000ms` |
| `ae.checkpoint.tolerable-failures` | `0` | `0` ~ `2147483647` | 可容忍的连续 Checkpoint 失败次数 | 全局 | 是 | `ae.checkpoint.tolerable-failures=3` |
| `ae.checkpoint.incremental.enabled` | `false` | `true`, `false` | 是否启用增量 Checkpoint | 全局 | 是 | `ae.checkpoint.incremental.enabled=true` |
| `ae.checkpoint.incremental.rocksdb.compaction.enabled` | `true` | `true`, `false` | 增量 Checkpoint 时是否允许 RocksDB Compaction | 全局 | 是 | `ae.checkpoint.incremental.rocksdb.compaction.enabled=false` |
| `ae.state.backend` | `hashmap` | `hashmap`, `rocksdb`, `embedded` | 状态后端类型 | 全局 | 是 | `ae.state.backend=rocksdb` |
| `ae.state.rocksdb.local-dir` | `—` | 合法目录路径 | RocksDB 本地数据目录 | TaskManager | 否 | `ae.state.rocksdb.local-dir=/data/rocksdb` |
| `ae.state.rocksdb.predefined-options` | `SPINNING_DISK_OPTIMIZED` | `SPINNING_DISK_OPTIMIZED`, `SPINNING_DISK_OPTIMIZED_HIGH_MEM`, `FLASH_SSD_OPTIMIZED`, `DEFAULT` | RocksDB 预定义选项 | TaskManager | 否 | `ae.state.rocksdb.predefined-options=FLASH_SSD_OPTIMIZED` |
| `ae.state.rocksdb.write-batch-size` | `2mb` | `256kb` ~ `64mb` | RocksDB Write Batch 大小 | TaskManager | 是 | `ae.state.rocksdb.write-batch-size=4mb` |
| `ae.state.rocksdb.write-buffer-size` | `64mb` | `4mb` ~ `512mb` | RocksDB Write Buffer 大小 | TaskManager | 否 | `ae.state.rocksdb.write-buffer-size=128mb` |
| `ae.state.rocksdb.max-write-buffer-count` | `3` | `1` ~ `16` | RocksDB 最大 Write Buffer 数 | TaskManager | 否 | `ae.state.rocksdb.max-write-buffer-count=4` |
| `ae.state.rocksdb.block-cache-size` | `—` | 自动或手动指定 | RocksDB Block Cache 大小 | TaskManager | 否 | `ae.state.rocksdb.block-cache-size=512mb` |
| `ae.state.rocksdb.block-size` | `4kb` | `1kb` ~ `64kb` | RocksDB Block 大小 | TaskManager | 否 | `ae.state.rocksdb.block-size=8kb` |
| `ae.state.rocksdb.compaction.style` | `LEVEL` | `LEVEL`, `UNIVERSAL`, `FIFO` | RocksDB Compaction 样式 | TaskManager | 否 | `ae.state.rocksdb.compaction.style=UNIVERSAL` |
| `ae.state.rocksdb.use-bloom-filter` | `true` | `true`, `false` | 是否启用 Bloom Filter | TaskManager | 否 | `ae.state.rocksdb.use-bloom-filter=true` |
| `ae.state.rocksdb.bloom-filter-bits-per-key` | `10` | `1` ~ `64` | Bloom Filter 每键比特数 | TaskManager | 否 | `ae.state.rocksdb.bloom-filter-bits-per-key=12` |
| `ae.state.rocksdb.timer-service.write-batch-size` | `1mb` | `256kb` ~ `16mb` | Timer Service Write Batch 大小 | TaskManager | 是 | `ae.state.rocksdb.timer-service.write-batch-size=2mb` |
| `ae.state.ttl.enabled` | `false` | `true`, `false` | 是否启用状态 TTL | 全局 | 是 | `ae.state.ttl.enabled=true` |
| `ae.state.ttl.time` | `—` | `1s` ~ `9223372036854775807ns` | 状态 TTL 时长 | 全局 | 是 | `ae.state.ttl.time=86400000ms` |
| `ae.state.ttl.cleanup-strategy` | `full` | `full`, `incremental`, `lazy` | TTL 清理策略 | 全局 | 是 | `ae.state.ttl.cleanup-strategy=incremental` |
| `ae.state.savepoint.dir` | `—` | 合法目录路径 | Savepoint 存储目录 | 全局 | 否 | `ae.state.savepoint.dir=hdfs:///ae/savepoints` |
| `ae.state.checkpoint.dir` | `—` | 合法目录路径 | Checkpoint 存储目录 | 全局 | 否 | `ae.state.checkpoint.dir=hdfs:///ae/checkpoints` |
| `ae.state.local-recovery.enabled` | `false` | `true`, `false` | 是否启用本地恢复 | TaskManager | 否 | `ae.state.local-recovery.enabled=true` |

```yaml
# Checkpoint与状态配置示例
ae:
  checkpoint:
    interval: 30000ms
    mode: exactly-once
    timeout: 1200000ms
    max-concurrent: 3
    min-pause: 5000ms
    unaligned:
      enabled: true
      forced: false
    alignment-timeout: 30000ms
    tolerable-failures: 3
    incremental:
      enabled: true
      rocksdb:
        compaction:
          enabled: false
  state:
    backend: rocksdb
    rocksdb:
      local-dir: /data/rocksdb
      predefined-options: FLASH_SSD_OPTIMIZED
      write-batch-size: 4mb
      write-buffer-size: 128mb
      max-write-buffer-count: 4
      block-cache-size: 512mb
      block-size: 8kb
      compaction:
        style: UNIVERSAL
      use-bloom-filter: true
      bloom-filter-bits-per-key: 12
    ttl:
      enabled: true
      time: 86400000ms
      cleanup-strategy: incremental
    savepoint:
      dir: hdfs:///ae/savepoints
    checkpoint:
      dir: hdfs:///ae/checkpoints
    local-recovery:
      enabled: true
```

### A.7 SQL引擎配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.sql.optimizer.mode` | `cost-based` | `cost-based`, `rule-based`, `heuristic` | SQL 优化器模式 | 全局 | 是 | `ae.sql.optimizer.mode=cost-based` |
| `ae.sql.optimizer.cbo.enabled` | `true` | `true`, `false` | 是否启用 CBO 优化 | 全局 | 是 | `ae.sql.optimizer.cbo.enabled=true` |
| `ae.sql.optimizer.cbo.join-reorder.enabled` | `true` | `true`, `false` | 是否启用 Join 重排序 | 全局 | 是 | `ae.sql.optimizer.cbo.join-reorder.enabled=true` |
| `ae.sql.optimizer.cbo.join-reorder.algorithm` | `dp` | `dp`, `greedy`, `multi-join`, `genetic` | Join 重排序算法 | 全局 | 是 | `ae.sql.optimizer.cbo.join-reorder.algorithm=dp` |
| `ae.sql.optimizer.cbo.join-reorder.dp.threshold` | `12` | `2` ~ `30` | DP Join 重排序最大表数 | 全局 | 是 | `ae.sql.optimizer.cbo.join-reorder.dp.threshold=10` |
| `ae.sql.optimizer.cbo.statistics.enabled` | `true` | `true`, `false` | 是否启用统计信息 | 全局 | 是 | `ae.sql.optimizer.cbo.statistics.enabled=true` |
| `ae.sql.optimizer.cbo.statistics.auto-gather` | `true` | `true`, `false` | 是否自动收集统计信息 | 全局 | 是 | `ae.sql.optimizer.cbo.statistics.auto-gather=true` |
| `ae.sql.optimizer.cbo.statistics.sample-rate` | `0.1` | `0.001` ~ `1.0` | 统计信息采样率 | 全局 | 是 | `ae.sql.optimizer.cbo.statistics.sample-rate=0.2` |
| `ae.sql.optimizer.cbo.ndv-estimator` | `hll` | `hll`, `fm`, `adaptive` | NDV（不同值数量）估计器 | 全局 | 是 | `ae.sql.optimizer.cbo.ndv-estimator=adaptive` |
| `ae.sql.optimizer.cbo.hll.precision` | `14` | `4` ~ `18` | HyperLogLog 精度参数 | 全局 | 是 | `ae.sql.optimizer.cbo.hll.precision=15` |
| `ae.sql.optimizer.predicate-pushdown.enabled` | `true` | `true`, `false` | 是否启用谓词下推 | 全局 | 是 | `ae.sql.optimizer.predicate-pushdown.enabled=true` |
| `ae.sql.optimizer.projection-pushdown.enabled` | `true` | `true`, `false` | 是否启用投影下推 | 全局 | 是 | `ae.sql.optimizer.projection-pushdown.enabled=true` |
| `ae.sql.optimizer.subquery-rewrite.enabled` | `true` | `true`, `false` | 是否启用子查询重写 | 全局 | 是 | `ae.sql.optimizer.subquery-rewrite.enabled=true` |
| `ae.sql.optimizer.join-to-aggregate.enabled` | `true` | `true`, `false` | 是否启用 Join 转聚合优化 | 全局 | 是 | `ae.sql.optimizer.join-to-aggregate.enabled=true` |
| `ae.sql.optimizer.skew-join.enabled` | `true` | `true`, `false` | 是否启用倾斜 Join 优化 | 全局 | 是 | `ae.sql.optimizer.skew-join.enabled=true` |
| `ae.sql.optimizer.skew-join.threshold` | `0.1` | `0.01` ~ `0.5` | 倾斜 Join 检测阈值 | 全局 | 是 | `ae.sql.optimizer.skew-join.threshold=0.15` |
| `ae.sql.optimizer.adaptive-join.enabled` | `true` | `true`, `false` | 是否启用自适应 Join 选择 | 全局 | 是 | `ae.sql.optimizer.adaptive-join.enabled=true` |
| `ae.sql.optimizer.adaptive-join.switch-threshold` | `0.3` | `0.01` ~ `1.0` | 自适应 Join 切换阈值 | 全局 | 是 | `ae.sql.optimizer.adaptive-join.switch-threshold=0.2` |
| `ae.sql.dialect` | `default` | `default`, `mysql`, `postgres`, `oracle`, `hive` | SQL 方言 | 会话 | 是 | `ae.sql.dialect=mysql` |
| `ae.sql.max-length` | `65536` | `1024` ~ `2147483647` | 最大 SQL 语句长度 | 全局 | 是 | `ae.sql.max-length=131072` |
| `ae.sql.identifier.case` | `preserve` | `preserve`, `upper`, `lower` | 标识符大小写处理 | 全局 | 是 | `ae.sql.identifier.case=lower` |
| `ae.sql.null-semantics` | `sql` | `sql`, `hive` | NULL 语义兼容模式 | 全局 | 是 | `ae.sql.null-semantics=sql` |
| `ae.sql.window.buffer-size` | `1024` | `1` ~ `65536` | 窗口算子缓冲区大小 | 算子 | 是 | `ae.sql.window.buffer-size=2048` |
| `ae.sql.topn.cache-size` | `10000` | `1` ~ `1000000` | TopN 缓存大小 | 算子 | 是 | `ae.sql.topn.cache-size=50000` |
| `ae.sql.deduplicate.mini-batch.size` | `1000` | `1` ~ `100000` | 去重 Mini-Batch 大小 | 算子 | 是 | `ae.sql.deduplicate.mini-batch.size=2000` |
| `ae.sql.deduplicate.mini-batch.interval` | `1s` | `1ms` ~ `600s` | 去重 Mini-Batch 间隔 | 算子 | 是 | `ae.sql.deduplicate.mini-batch.interval=5s` |

```sql
-- SQL 会话级别配置示例
SET ae.sql.optimizer.cbo.join-reorder.enabled = true;
SET ae.sql.optimizer.skew-join.enabled = true;
SET ae.sql.optimizer.skew-join.threshold = 0.15;
SET ae.sql.dialect = mysql;
SET ae.sql.identifier.case = lower;
SET ae.sql.deduplicate.mini-batch.size = 2000;
SET ae.sql.deduplicate.mini-batch.interval = '5s';
```

### A.8 Catalog配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.catalog.default` | `default_catalog` | 任意合法字符串 | 默认 Catalog 名称 | 全局 | 是 | `ae.catalog.default=prod_catalog` |
| `ae.catalog.type` | `generic` | `generic`, `hive`, `glue`, `jdbc`, `paimon`, `iceberg` | Catalog 类型 | Catalog | 否 | `ae.catalog.type=hive` |
| `ae.catalog.hive.metastore.uris` | `—` | 合法 Thrift URI | Hive Metastore URI | Catalog | 否 | `ae.catalog.hive.metastore.uris=thrift://hive:9083` |
| `ae.catalog.hive.metastore.authentication` | `none` | `none`, `kerberos`, `ldap` | Hive Metastore 认证方式 | Catalog | 否 | `ae.catalog.hive.metastore.authentication=kerberos` |
| `ae.catalog.hive.hdfs-site.path` | `—` | 合法文件路径 | hdfs-site.xml 路径 | Catalog | 否 | `ae.catalog.hive.hdfs-site.path=/etc/hadoop/conf/hdfs-site.xml` |
| `ae.catalog.hive.core-site.path` | `—` | 合法文件路径 | core-site.xml 路径 | Catalog | 否 | `ae.catalog.hive.core-site.path=/etc/hadoop/conf/core-site.xml` |
| `ae.catalog.hive.warehouse` | `/user/hive/warehouse` | 合法 HDFS 路径 | Hive 数据仓库路径 | Catalog | 否 | `ae.catalog.hive.warehouse=/data/warehouse` |
| `ae.catalog.hive.version` | `3.1.2` | `2.x`, `3.x` | Hive 版本 | Catalog | 否 | `ae.catalog.hive.version=2.3.9` |
| `ae.catalog.jdbc.url` | `—` | 合法 JDBC URL | JDBC Catalog 连接 URL | Catalog | 否 | `ae.catalog.jdbc.url=jdbc:postgresql://pg:5432/catalog` |
| `ae.catalog.jdbc.username` | `—` | 合法用户名 | JDBC 用户名 | Catalog | 否 | `ae.catalog.jdbc.username=admin` |
| `ae.catalog.jdbc.password` | `—` | 合法密码 | JDBC 密码 | Catalog | 否 | `ae.catalog.jdbc.password=***` |
| `ae.catalog.jdbc.base-path` | `—` | 合法路径 | JDBC Catalog 基础路径 | Catalog | 否 | `ae.catalog.jdbc.base-path=/data/jdbc-catalog` |
| `ae.catalog.paimon.warehouse` | `—` | 合法路径 | Paimon Catalog 仓库路径 | Catalog | 否 | `ae.catalog.paimon.warehouse=hdfs:///paimon/warehouse` |
| `ae.catalog.iceberg.catalog-impl` | `—` | 合法类名 | Iceberg Catalog 实现类 | Catalog | 否 | `ae.catalog.iceberg.catalog-impl=org.apache.iceberg.hive.HiveCatalog` |
| `ae.catalog.iceberg.warehouse` | `—` | 合法路径 | Iceberg 仓库路径 | Catalog | 否 | `ae.catalog.iceberg.warehouse=hdfs:///iceberg/warehouse` |
| `ae.catalog.cache.enabled` | `true` | `true`, `false` | 是否启用 Catalog 缓存 | 全局 | 是 | `ae.catalog.cache.enabled=true` |
| `ae.catalog.cache.ttl` | `60s` | `1s` ~ `86400s` | Catalog 缓存 TTL | 全局 | 是 | `ae.catalog.cache.ttl=300s` |
| `ae.catalog.cache.max-size` | `10000` | `1` ~ `1000000` | Catalog 缓存最大条目数 | 全局 | 是 | `ae.catalog.cache.max-size=50000` |

```sql
-- Catalog DDL 配置示例
CREATE CATALOG hive_catalog WITH (
  'type' = 'hive',
  'hive.metastore.uris' = 'thrift://hive-metastore:9083',
  'hive.version' = '3.1.2',
  'hive.warehouse' = '/data/warehouse',
  'hive.metastore.authentication' = 'kerberos'
);

CREATE CATALOG paimon_catalog WITH (
  'type' = 'paimon',
  'warehouse' = 'hdfs:///paimon/warehouse'
);

CREATE CATALOG iceberg_catalog WITH (
  'type' = 'iceberg',
  'catalog-impl' = 'org.apache.iceberg.hive.HiveCatalog',
  'warehouse' = 'hdfs:///iceberg/warehouse',
  'uri' = 'thrift://hive-metastore:9083'
);

USE CATALOG hive_catalog;
```

### A.9 安全配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.security.enabled` | `false` | `true`, `false` | 是否启用安全认证 | 全局 | 否 | `ae.security.enabled=true` |
| `ae.security.authentication` | `none` | `none`, `kerberos`, `token`, `ldap`, `oauth2` | 认证方式 | 全局 | 否 | `ae.security.authentication=kerberos` |
| `ae.security.authorization.enabled` | `false` | `true`, `false` | 是否启用授权 | 全局 | 否 | `ae.security.authorization.enabled=true` |
| `ae.security.authorization.plugin` | `default` | `default`, `ranger`, `sentry` | 授权插件 | 全局 | 否 | `ae.security.authorization.plugin=ranger` |
| `ae.security.kerberos.principal` | `—` | 合法 Kerberos 主体 | Kerberos 主体名称 | 全局 | 否 | `ae.security.kerberos.principal=ae/_HOST@REALM.COM` |
| `ae.security.kerberos.keytab` | `—` | 合法文件路径 | Kerberos Keytab 文件路径 | 全局 | 否 | `ae.security.kerberos.keytab=/etc/security/keytabs/ae.service.keytab` |
| `ae.security.kerberos.relogin.interval` | `60s` | `10s` ~ `600s` | Kerberos 重新登录间隔 | 全局 | 是 | `ae.security.kerberos.relogin.interval=120s` |
| `ae.security.token.kind` | `—` | 合法 Token 类型 | Token 认证类型 | 全局 | 否 | `ae.security.token.kind=AE_DELEGATION_TOKEN` |
| `ae.security.token.service` | `—` | 合法服务名 | Token 服务名称 | 全局 | 否 | `ae.security.token.service=ae-cluster` |
| `ae.security.token.renewal.interval` | `86400s` | `60s` ~ `604800s` | Token 续期间隔 | 全局 | 是 | `ae.security.token.renewal.interval=43200s` |
| `ae.security.ssl.enabled` | `false` | `true`, `false` | 是否启用 SSL/TLS | 全局 | 否 | `ae.security.ssl.enabled=true` |
| `ae.security.ssl.protocol` | `TLSv1.2` | `TLSv1.2`, `TLSv1.3` | SSL 协议版本 | 全局 | 否 | `ae.security.ssl.protocol=TLSv1.3` |
| `ae.security.ssl.keystore.path` | `—` | 合法文件路径 | SSL Keystore 路径 | 全局 | 否 | `ae.security.ssl.keystore.path=/etc/ssl/keystore.jks` |
| `ae.security.ssl.keystore.password` | `—` | 合法密码 | SSL Keystore 密码 | 全局 | 否 | `ae.security.ssl.keystore.password=***` |
| `ae.security.ssl.truststore.path` | `—` | 合法文件路径 | SSL Truststore 路径 | 全局 | 否 | `ae.security.ssl.truststore.path=/etc/ssl/truststore.jks` |
| `ae.security.ssl.truststore.password` | `—` | 合法密码 | SSL Truststore 密码 | 全局 | 否 | `ae.security.ssl.truststore.password=***` |
| `ae.security.ssl.hostname-verification` | `true` | `true`, `false` | 是否启用主机名验证 | 全局 | 否 | `ae.security.ssl.hostname-verification=true` |
| `ae.security.encryption.data-transfer` | `false` | `true`, `false` | 是否加密数据传输 | 全局 | 否 | `ae.security.encryption.data-transfer=true` |
| `ae.security.encryption.algorithm` | `AES256` | `AES128`, `AES256`, `ChaCha20` | 数据传输加密算法 | 全局 | 否 | `ae.security.encryption.algorithm=ChaCha20` |
| `ae.security.audit.enabled` | `false` | `true`, `false` | 是否启用安全审计 | 全局 | 否 | `ae.security.audit.enabled=true` |
| `ae.security.audit.log-dir` | `/var/log/ae/audit` | 合法目录路径 | 审计日志目录 | 全局 | 否 | `ae.security.audit.log-dir=/data/audit` |
| `ae.security.masking.enabled` | `true` | `true`, `false` | 是否启用敏感数据脱敏 | 全局 | 是 | `ae.security.masking.enabled=true` |
| `ae.security.masking.fields` | `password,secret,token` | 逗号分隔的字段名 | 需要脱敏的字段列表 | 全局 | 是 | `ae.security.masking.fields=password,secret,token,api_key` |

```yaml
# 安全配置示例
ae:
  security:
    enabled: true
    authentication: kerberos
    authorization:
      enabled: true
      plugin: ranger
    kerberos:
      principal: "ae/_HOST@REALM.COM"
      keytab: /etc/security/keytabs/ae.service.keytab
      relogin-interval: 120s
    ssl:
      enabled: true
      protocol: TLSv1.3
      keystore:
        path: /etc/ssl/keystore.jks
        password: "***"
      truststore:
        path: /etc/ssl/truststore.jks
        password: "***"
      hostname-verification: true
    encryption:
      data-transfer: true
      algorithm: ChaCha20
    audit:
      enabled: true
      log-dir: /data/audit
    masking:
      enabled: true
      fields: "password,secret,token,api_key"
```

### A.10 监控与日志配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.monitor.metrics.enabled` | `true` | `true`, `false` | 是否启用指标收集 | 全局 | 是 | `ae.monitor.metrics.enabled=true` |
| `ae.monitor.metrics.reporter` | `prometheus` | `prometheus`, `slf4j`, `jmx`, `statsd`, `datadog`, `opentelemetry`, `composite` | 指标报告器类型 | 全局 | 是 | `ae.monitor.metrics.reporter=prometheus` |
| `ae.monitor.metrics.port` | `9250` | `1` ~ `65535` | Prometheus 指标端口 | 全局 | 否 | `ae.monitor.metrics.port=9250` |
| `ae.monitor.metrics.interval` | `30s` | `5s` ~ `600s` | 指标报告间隔 | 全局 | 是 | `ae.monitor.metrics.interval=15s` |
| `ae.monitor.metrics.scope.delimiter` | `.` | 任意单字符 | 指标作用域分隔符 | 全局 | 否 | `ae.monitor.metrics.scope.delimiter=_` |
| `ae.monitor.metrics.scope.variables` | `—` | 逗号分隔的变量映射 | 指标作用域变量 | 全局 | 否 | `ae.monitor.metrics.scope.variables=tm_id:<taskmanager_id>` |
| `ae.monitor.metrics.latency.histogram.sample-size` | `1000` | `10` ~ `100000` | 延迟直方图样本大小 | 全局 | 是 | `ae.monitor.metrics.latency.histogram.sample-size=5000` |
| `ae.monitor.metrics.latency.histogram.percentiles` | `0.5,0.9,0.95,0.99` | 逗号分隔的分位数值 | 延迟直方图报告分位数 | 全局 | 是 | `ae.monitor.metrics.latency.histogram.percentiles=0.5,0.95,0.99` |
| `ae.monitor.tracing.enabled` | `false` | `true`, `false` | 是否启用分布式追踪 | 全局 | 是 | `ae.monitor.tracing.enabled=true` |
| `ae.monitor.tracing.reporter` | `opentelemetry` | `opentelemetry`, `jaeger`, `zipkin` | 追踪报告器 | 全局 | 是 | `ae.monitor.tracing.reporter=jaeger` |
| `ae.monitor.tracing.sampling-rate` | `0.01` | `0.0` ~ `1.0` | 追踪采样率 | 全局 | 是 | `ae.monitor.tracing.sampling-rate=0.1` |
| `ae.monitor.tracing.endpoint` | `—` | 合法 URL | 追踪报告端点 | 全局 | 是 | `ae.monitor.tracing.endpoint=http://jaeger:14268/api/traces` |
| `ae.monitor.logging.level` | `INFO` | `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR` | 全局日志级别 | 全局 | 是 | `ae.monitor.logging.level=DEBUG` |
| `ae.monitor.logging.max-file-size` | `100mb` | `1mb` ~ `10240mb` | 单个日志文件最大大小 | 全局 | 是 | `ae.monitor.logging.max-file-size=500mb` |
| `ae.monitor.logging.max-history` | `30` | `1` ~ `365` | 日志文件保留天数 | 全局 | 是 | `ae.monitor.logging.max-history=60` |
| `ae.monitor.logging.total-capacity` | `1gb` | `100mb` ~ `100gb` | 日志总容量 | 全局 | 是 | `ae.monitor.logging.total-capacity=5gb` |
| `ae.monitor.logging.format` | `text` | `text`, `json` | 日志格式 | 全局 | 是 | `ae.monitor.logging.format=json` |
| `ae.monitor.webui.enabled` | `true` | `true`, `false` | 是否启用 Web UI | 全局 | 否 | `ae.monitor.webui.enabled=true` |
| `ae.monitor.webui.port` | `8081` | `1` ~ `65535` | Web UI 端口 | 全局 | 否 | `ae.monitor.webui.port=8081` |
| `ae.monitor.webui.refresh-interval` | `5s` | `1s` ~ `60s` | Web UI 刷新间隔 | 全局 | 是 | `ae.monitor.webui.refresh-interval=3s` |
| `ae.monitor.alert.enabled` | `false` | `true`, `false` | 是否启用告警 | 全局 | 是 | `ae.monitor.alert.enabled=true` |
| `ae.monitor.alert.webhook.url` | `—` | 合法 URL | 告警 Webhook URL | 全局 | 是 | `ae.monitor.alert.webhook.url=https://hooks.slack.com/xxx` |
| `ae.monitor.alert.check-interval` | `30s` | `5s` ~ `600s` | 告警检查间隔 | 全局 | 是 | `ae.monitor.alert.check-interval=15s` |

```yaml
# 监控与日志配置示例
ae:
  monitor:
    metrics:
      enabled: true
      reporter: prometheus
      port: 9250
      interval: 15s
      scope:
        delimiter: "."
      latency:
        histogram:
          sample-size: 5000
          percentiles: "0.5,0.95,0.99"
    tracing:
      enabled: true
      reporter: jaeger
      sampling-rate: 0.1
      endpoint: "http://jaeger:14268/api/traces"
    logging:
      level: INFO
      max-file-size: 500mb
      max-history: 60
      total-capacity: 5gb
      format: json
    webui:
      enabled: true
      port: 8081
      refresh-interval: 3s
    alert:
      enabled: true
      webhook:
        url: "https://hooks.slack.com/xxx"
      check-interval: 15s
```

### A.11 连接器配置

| 配置键名 | 默认值 | 可选值范围 | 描述 | 影响范围 | 支持热加载 | 示例 |
|---|---|---|---|---|---|---|
| `ae.connector.kafka.bootstrap-servers` | `—` | 合法 Kafka Broker 列表 | Kafka Bootstrap Servers | 连接器 | 否 | `ae.connector.kafka.bootstrap-servers=kafka:9092` |
| `ae.connector.kafka.group-id` | `—` | 合法 Group ID | Kafka 消费者组 ID | 连接器 | 否 | `ae.connector.kafka.group-id=ae-consumer` |
| `ae.connector.kafka.auto-offset-reset` | `latest` | `earliest`, `latest`, `none` | Kafka 初始偏移策略 | 连接器 | 否 | `ae.connector.kafka.auto-offset-reset=earliest` |
| `ae.connector.kafka.fetch-max-bytes` | `52428800` | `1048576` ~ `1073741824` | Kafka 单次拉取最大字节数 | 连接器 | 是 | `ae.connector.kafka.fetch-max-bytes=104857600` |
| `ae.connector.kafka.max-poll-records` | `500` | `1` ~ `10000` | Kafka 单次 Poll 最大记录数 | 连接器 | 是 | `ae.connector.kafka.max-poll-records=1000` |
| `ae.connector.kafka.commit-offsets-on-checkpoint` | `true` | `true`, `false` | 是否在 Checkpoint 时提交偏移 | 连接器 | 是 | `ae.connector.kafka.commit-offsets-on-checkpoint=true` |
| `ae.connector.kafka.scan.startup.mode` | `group-offsets` | `group-offsets`, `earliest`, `latest`, `timestamp`, `specific-offsets` | Kafka 启动扫描模式 | 连接器 | 否 | `ae.connector.kafka.scan.startup.mode=timestamp` |
| `ae.connector.kafka.scan.startup.timestamp` | `—` | 合法 Unix 时间戳 | Kafka 时间戳启动偏移 | 连接器 | 否 | `ae.connector.kafka.scan.startup.timestamp=1700000000000` |
| `ae.connector.kafka.properties.*` | `—` | Kafka 原生配置 | Kafka 原生属性透传 | 连接器 | 否 | `ae.connector.kafka.properties.security.protocol=SASL_SSL` |
| `ae.connector.kafka.exactly-once.semantic` | `none` | `none`, `at-least-once`, `exactly-once` | Kafka 精确一次语义 | 连接器 | 否 | `ae.connector.kafka.exactly-once.semantic=exactly-once` |
| `ae.connector.kafka.transaction.timeout` | `900000ms` | `60000ms` ~ `3600000ms` | Kafka 事务超时 | 连接器 | 是 | `ae.connector.kafka.transaction.timeout=1800000ms` |
| `ae.connector.jdbc.url` | `—` | 合法 JDBC URL | JDBC 连接 URL | 连接器 | 否 | `ae.connector.jdbc.url=jdbc:mysql://mysql:3306/db` |
| `ae.connector.jdbc.table` | `—` | 合法表名 | JDBC 表名 | 连接器 | 否 | `ae.connector.jdbc.table=users` |
| `ae.connector.jdbc.username` | `—` | 合法用户名 | JDBC 用户名 | 连接器 | 否 | `ae.connector.jdbc.username=root` |
| `ae.connector.jdbc.password` | `—` | 合法密码 | JDBC 密码 | 连接器 | 否 | `ae.connector.jdbc.password=***` |
| `ae.connector.jdbc.scan.fetch-size` | `0` | `0` ~ `2147483647` | JDBC 查询 Fetch Size | 连接器 | 是 | `ae.connector.jdbc.scan.fetch-size=5000` |
| `ae.connector.jdbc.scan.auto-commit` | `false` | `true`, `false` | JDBC 查询自动提交 | 连接器 | 否 | `ae.connector.jdbc.scan.auto-commit=false` |
| `ae.connector.jdbc.lookup.cache.max-rows` | `—` | `1` ~ `2147483647` | JDBC Lookup 缓存最大行数 | 连接器 | 是 | `ae.connector.jdbc.lookup.cache.max-rows=10000` |
| `ae.connector.jdbc.lookup.cache.ttl` | `—` | `1s` ~ `86400s` | JDBC Lookup 缓存 TTL | 连接器 | 是 | `ae.connector.jdbc.lookup.cache.ttl=60s` |
| `ae.connector.jdbc.lookup.max-retries` | `3` | `0` ~ `100` | JDBC Lookup 最大重试次数 | 连接器 | 是 | `ae.connector.jdbc.lookup.max-retries=5` |
| `ae.connector.jdbc.sink.buffer-flush.max-rows` | `1000` | `1` ~ `2147483647` | JDBC Sink 缓冲刷新最大行数 | 连接器 | 是 | `ae.connector.jdbc.sink.buffer-flush.max-rows=5000` |
| `ae.connector.jdbc.sink.buffer-flush.interval` | `1s` | `0ms` ~ `3600s` | JDBC Sink 缓冲刷新间隔 | 连接器 | 是 | `ae.connector.jdbc.sink.buffer-flush.interval=5s` |
| `ae.connector.jdbc.sink.max-retries` | `3` | `0` ~ `100` | JDBC Sink 最大重试次数 | 连接器 | 是 | `ae.connector.jdbc.sink.max-retries=5` |
| `ae.connector.hdfs.path` | `—` | 合法 HDFS 路径 | HDFS 文件路径 | 连接器 | 否 | `ae.connector.hdfs.path=hdfs:///data/events` |
| `ae.connector.hdfs.format` | `parquet` | `csv`, `json`, `parquet`, `orc`, `avro` | HDFS 文件格式 | 连接器 | 否 | `ae.connector.hdfs.format=orc` |
| `ae.connector.hdfs.compression` | `snappy` | `none`, `snappy`, `gzip`, `lz4`, `zstd` | HDFS 压缩格式 | 连接器 | 否 | `ae.connector.hdfs.compression=zstd` |
| `ae.connector.hdfs.partition.time-extractor` | `default` | `default`, `custom` | HDFS 分区时间提取器 | 连接器 | 否 | `ae.connector.hdfs.partition.time-extractor=default` |
| `ae.connector.hdfs.sink.rolling-policy.size` | `128mb` | `1mb` ~ `4096mb` | HDFS Sink 文件滚动大小 | 连接器 | 是 | `ae.connector.hdfs.sink.rolling-policy.size=256mb` |
| `ae.connector.hdfs.sink.rolling-policy.interval` | `60s` | `1s` ~ `86400s` | HDFS Sink 文件滚动间隔 | 连接器 | 是 | `ae.connector.hdfs.sink.rolling-policy.interval=300s` |
| `ae.connector.hdfs.sink.rolling-policy.inactivity` | `60s` | `1s` ~ `86400s` | HDFS Sink 不活跃滚动间隔 | 连接器 | 是 | `ae.connector.hdfs.sink.rolling-policy.inactivity=120s` |
| `ae.connector.elasticsearch.hosts` | `—` | 合法主机列表 | Elasticsearch 主机列表 | 连接器 | 否 | `ae.connector.elasticsearch.hosts=http://es:9200` |
| `ae.connector.elasticsearch.index` | `—` | 合法索引名 | Elasticsearch 索引名 | 连接器 | 否 | `ae.connector.elasticsearch.index=events` |
| `ae.connector.elasticsearch.document-type` | `—` | 合法文档类型 | Elasticsearch 文档类型 | 连接器 | 否 | `ae.connector.elasticsearch.document-type=_doc` |
| `ae.connector.elasticsearch.bulk-flush.max-actions` | `1000` | `1` ~ `100000` | ES Bulk 刷新最大操作数 | 连接器 | 是 | `ae.connector.elasticsearch.bulk-flush.max-actions=5000` |
| `ae.connector.elasticsearch.bulk-flush.interval` | `1s` | `0ms` ~ `3600s` | ES Bulk 刷新间隔 | 连接器 | 是 | `ae.connector.elasticsearch.bulk-flush.interval=5s` |
| `ae.connector.elasticsearch.bulk-flush.max-size` | `5mb` | `1mb` ~ `1024mb` | ES Bulk 刷新最大大小 | 连接器 | 是 | `ae.connector.elasticsearch.bulk-flush.max-size=10mb` |
| `ae.connector.redis.mode` | `standalone` | `standalone`, `cluster`, `sentinel` | Redis 部署模式 | 连接器 | 否 | `ae.connector.redis.mode=cluster` |
| `ae.connector.redis.host` | `localhost` | 合法主机名或 IP | Redis 主机地址 | 连接器 | 否 | `ae.connector.redis.host=redis.internal` |
| `ae.connector.redis.port` | `6379` | `1` ~ `65535` | Redis 端口 | 连接器 | 否 | `ae.connector.redis.port=6379` |
| `ae.connector.redis.database` | `0` | `0` ~ `15` | Redis 数据库编号 | 连接器 | 否 | `ae.connector.redis.database=1` |
| `ae.connector.redis.password` | `—` | 合法密码 | Redis 密码 | 连接器 | 否 | `ae.connector.redis.password=***` |
| `ae.connector.redis.cluster.nodes` | `—` | 逗号分隔的 host:port | Redis Cluster 节点列表 | 连接器 | 否 | `ae.connector.redis.cluster.nodes=redis1:6379,redis2:6379,redis3:6379` |
| `ae.connector.redis.lookup.cache.max-rows` | `—` | `1` ~ `2147483647` | Redis Lookup 缓存最大行数 | 连接器 | 是 | `ae.connector.redis.lookup.cache.max-rows=50000` |
| `ae.connector.redis.lookup.cache.ttl` | `—` | `1s` ~ `86400s` | Redis Lookup 缓存 TTL | 连接器 | 是 | `ae.connector.redis.lookup.cache.ttl=30s` |
| `ae.connector.paimon.path` | `—` | 合法路径 | Paimon 表路径 | 连接器 | 否 | `ae.connector.paimon.path=hdfs:///paimon/db.tbl` |
| `ae.connector.paimon.read.changelog` | `false` | `true`, `false` | Paimon 是否读取 Changelog | 连接器 | 否 | `ae.connector.paimon.read.changelog=true` |
| `ae.connector.paimon.write.only` | `false` | `true`, `false` | Paimon 是否仅写入 | 连接器 | 否 | `ae.connector.paimon.write.only=false` |
| `ae.connector.paimon.compaction.min.file-num` | `4` | `1` ~ `100` | Paimon Compaction 最小文件数 | 连接器 | 是 | `ae.connector.paimon.compaction.min.file-num=5` |
| `ae.connector.paimon.compaction.max.file-num` | `50` | `1` ~ `1000` | Paimon Compaction 最大文件数 | 连接器 | 是 | `ae.connector.paimon.compaction.max.file-num=100` |
| `ae.connector.paimon.write.buffer-size` | `64mb` | `1mb` ~ `1024mb` | Paimon 写缓冲区大小 | 连接器 | 是 | `ae.connector.paimon.write.buffer-size=128mb` |

```sql
-- Kafka 连接器 DDL 示例
CREATE TABLE kafka_events (
  event_id STRING,
  event_type STRING,
  payload STRING,
  ts TIMESTAMP(3) METADATA FROM 'timestamp',
  WATERMARK FOR ts AS ts - INTERVAL '5' SECOND
) WITH (
  'connector' = 'kafka',
  'topic' = 'events',
  'properties.bootstrap.servers' = 'kafka:9092',
  'properties.group.id' = 'ae-consumer',
  'scan.startup.mode' = 'timestamp',
  'scan.startup.timestamp' = '1700000000000',
  'format' = 'json',
  'json.fail-on-missing-field' = 'false',
  'json.ignore-parse-errors' = 'true'
);

-- JDBC 连接器 DDL 示例
CREATE TABLE jdbc_users (
  id BIGINT,
  name STRING,
  email STRING,
  created_at TIMESTAMP(3),
  PRIMARY KEY (id) NOT ENFORCED
) WITH (
  'connector' = 'jdbc',
  'url' = 'jdbc:mysql://mysql:3306/mydb',
  'table-name' = 'users',
  'username' = 'root',
  'password' = '***',
  'scan.fetch-size' = '5000',
  'lookup.cache.max-rows' = '10000',
  'lookup.cache.ttl' = '60s',
  'sink.buffer-flush.max-rows' = '5000',
  'sink.buffer-flush.interval' = '5s'
);

-- HDFS 连接器 DDL 示例
CREATE TABLE hdfs_events (
  event_id STRING,
  event_type STRING,
  dt STRING,
  hr STRING
) PARTITIONED BY (dt, hr) WITH (
  'connector' = 'hdfs',
  'path' = 'hdfs:///data/events',
  'format' = 'parquet',
  'compression' = 'zstd',
  'sink.rolling-policy.size' = '256mb',
  'sink.rolling-policy.interval' = '300s'
);
```

---

## 附录B：错误码完整参考

本附录列出 AE 引擎的全部错误码，按模块分组。每个错误码包含错误码、错误名称、描述、常见原因、处理建议和相关配置项。

### B.1 核心引擎错误码（AE-1xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-1001 | ENGINE_START_FAILED | 引擎启动失败 | 端口冲突、内存不足、配置错误 | 检查端口占用、内存配置和日志 | `ae.engine.start-timeout` |
| AE-1002 | ENGINE_SHUTDOWN_TIMEOUT | 引擎关闭超时 | 有未完成的作业或资源未释放 | 等待作业完成或强制终止 | `ae.engine.shutdown-timeout` |
| AE-1003 | ENGINE_CONFIG_INVALID | 配置项无效 | 配置值超出范围或格式错误 | 检查配置文件格式和值范围 | — |
| AE-1004 | ENGINE_CLASSLOADER_CONFLICT | 类加载器冲突 | 用户 JAR 与引擎 JAR 类冲突 | 调整类加载器解析顺序或排除冲突包 | `ae.engine.classloader.resolve-order` |
| AE-1005 | ENGINE_CLASS_NOT_FOUND | 类未找到 | 缺少依赖 JAR 或类名错误 | 检查依赖 JAR 是否已上传 | `ae.engine.classloader.parent-first-patterns` |
| AE-1006 | ENGINE_OUT_OF_MEMORY | 引擎内存不足 | 堆内存或堆外内存耗尽 | 增加内存配置或优化作业 | `ae.memory.process.size` |
| AE-1007 | ENGINE_HEARTBEAT_TIMEOUT | 心跳超时 | 网络故障或节点负载过高 | 检查网络连通性和节点负载 | `ae.engine.heartbeat.interval`, `ae.engine.heartbeat.timeout` |
| AE-1008 | ENGINE_LICENSE_EXPIRED | 许可证过期 | 商业许可证到期 | 联系供应商续期 | — |
| AE-1009 | ENGINE_VERSION_MISMATCH | 版本不匹配 | 客户端与服务端版本不一致 | 统一客户端和服务端版本 | — |
| AE-1010 | ENGINE_RESOURCE_INSUFFICIENT | 资源不足 | 集群可用 Slot 不足 | 扩容集群或降低作业并行度 | `ae.engine.slot.num` |

### B.2 调度器错误码（AE-2xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-2001 | SCHEDULER_QUEUE_FULL | 调度队列已满 | 待调度作业数超过上限 | 增大队列容量或减少并发作业 | `ae.scheduler.max-pending-requests` |
| AE-2002 | SCHEDULER_SLOT_REQUEST_TIMEOUT | Slot 申请超时 | 集群资源不足或 Slot 泄漏 | 扩容集群或检查 Slot 泄漏 | `ae.engine.slot.timeout` |
| AE-2003 | SCHEDULER_PREEMPTION_FAILED | 抢占失败 | 低优先级作业无法被安全抢占 | 检查抢占配置和作业状态 | `ae.scheduler.preemption.enabled`, `ae.scheduler.preemption.timeout` |
| AE-2004 | SCHEDULER_SPECULATIVE_EXECUTION_FAILED | 推测执行失败 | 推测副本启动失败 | 检查集群资源和推测执行配置 | `ae.scheduler.speculative.enabled` |
| AE-2005 | SCHEDULER_PREDICTION_MODEL_ERROR | 预测模型错误 | 历史数据不足或模型参数异常 | 增加历史数据或调整模型参数 | `ae.scheduler.prediction.model`, `ae.scheduler.prediction.window` |
| AE-2006 | SCHEDULER_WEIGHT_INVALID | 作业权重无效 | 权重值超出范围 | 检查权重配置范围 | `ae.scheduler.weight.default` |
| AE-2007 | SCHEDULER_DEADLINE_EXCEEDED | 调度截止时间超限 | 作业等待调度时间过长 | 提高作业优先级或增加集群资源 | `ae.scheduler.queue-type` |
| AE-2008 | SCHEDULER_BACKPRESSURE_OVERLOAD | 调度器背压过载 | 下游处理能力不足导致调度器积压 | 降低数据摄入速率或增加并行度 | `ae.scheduler.backpressure.threshold` |

### B.3 执行器错误码（AE-3xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-3001 | EXECUTOR_TASK_FAILED | 任务执行失败 | 用户代码异常或运行时错误 | 检查任务日志和异常堆栈 | — |
| AE-3002 | EXECUTOR_RECORD_TOO_LARGE | 记录过大 | 单条记录超过最大限制 | 减小记录大小或增大限制 | `ae.executor.max-record-size` |
| AE-3003 | EXECUTOR_WATERMARK_ERROR | Watermark 错误 | Watermark 回退或格式错误 | 检查 Watermark 生成逻辑 | `ae.executor.watermark-interval` |
| AE-3004 | EXECUTOR_OPERATOR_CHAIN_BREAK | 算子链断裂 | 算子链中某个算子异常 | 检查算子实现和异常日志 | `ae.executor.operator-chaining.enabled` |
| AE-3005 | EXECUTOR_ASYNC_LOOKUP_TIMEOUT | 异步 Lookup 超时 | 外部系统响应慢 | 增加超时时间或优化外部系统 | `ae.executor.async-lookup.timeout` |
| AE-3006 | EXECUTOR_ASYNC_LOOKUP_QUEUE_FULL | 异步 Lookup 队列满 | 并发 Lookup 请求数超过缓冲区容量 | 增大缓冲区容量 | `ae.executor.async-lookup.buffer-capacity` |
| AE-3007 | EXECUTOR_BUFFER_OVERFLOW | 输出缓冲区溢出 | 下游消费速度慢导致缓冲区满 | 增大缓冲区或增加下游并行度 | `ae.executor.buffer.max-size` |
| AE-3008 | EXECUTOR_OBJECT_REUSE_VIOLATION | 对象复用违规 | 用户代码修改了复用对象 | 禁用对象复用或修复代码 | `ae.executor.object-reuse.enabled` |
| AE-3009 | EXECUTOR_LATENCY_TRACKING_ERROR | 延迟追踪错误 | 延迟追踪采样异常 | 检查追踪配置 | `ae.executor.latency-tracking.enabled` |
| AE-3010 | EXECUTOR_BATCH_SHUFFLE_ERROR | Batch Shuffle 错误 | Shuffle 数据读写异常 | 检查磁盘空间和 Shuffle 配置 | `ae.executor.batch-shuffle.mode` |

### B.4 内存管理错误码（AE-4xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-4001 | MEMORY_ALLOCATION_FAILED | 内存分配失败 | 托管内存不足 | 增大托管内存或优化作业 | `ae.memory.managed.size`, `ae.memory.managed.fraction` |
| AE-4002 | MEMORY_NETWORK_BUFFER_EXHAUSTED | 网络缓冲区耗尽 | 网络缓冲区配置过小 | 增大网络缓冲区配置 | `ae.memory.network.min`, `ae.memory.network.max` |
| AE-4003 | MEMORY_NETWORK_BUFFER_TIMEOUT | 网络缓冲区申请超时 | 缓冲区长期被占用 | 增大超时或减少网络负载 | `ae.memory.network.request-segments-timeout` |
| AE-4004 | MEMORY_SPILL_FAILED | 内存溢写失败 | 溢写目录磁盘满或权限不足 | 检查磁盘空间和目录权限 | `ae.memory.spill.dir` |
| AE-4005 | MEMORY_SPILL_READ_FAILED | 溢写读取失败 | 溢写文件被删除或损坏 | 检查溢写目录稳定性 | `ae.memory.spill.dir` |
| AE-4006 | MEMORY_SEGMENT_POOL_CLOSED | 内存段池已关闭 | TaskManager 关闭后仍访问内存 | 检查作业关闭逻辑 | — |
| AE-4007 | MEMORY_HEAP_OOM | 堆内存溢出 | 任务堆内存不足 | 增大任务堆内存 | `ae.memory.task.heap` |
| AE-4008 | MEMORY_DIRECT_OOM | 堆外内存溢出 | 直接内存使用超限 | 增大堆外内存 | `ae.memory.task.offheap` |
| AE-4009 | MEMORY_METASPACE_OOM | 元空间溢出 | 加载类过多 | 增大元空间或减少类加载 | — |
| AE-4010 | MEMORY_GC_OVERHEAD_EXCEEDED | GC 开销超限 | GC 时间占比过高 | 优化数据结构或增大内存 | `ae.memory.gc-friendly.enabled` |

### B.5 网络与Shuffle错误码（AE-5xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-5001 | SHUFFLE_CONNECTION_FAILED | Shuffle 连接失败 | 远程节点不可达 | 检查网络连通性和防火墙 | `ae.shuffle.service.host`, `ae.shuffle.service.port` |
| AE-5002 | SHUFFLE_IO_TIMEOUT | Shuffle IO 超时 | 网络延迟高或节点负载高 | 增大超时或优化网络 | `ae.shuffle.io.timeout` |
| AE-5003 | SHUFFLE_PARTITION_NOT_FOUND | Shuffle 分区未找到 | 分区数据已被清理或丢失 | 重新执行上游阶段 | — |
| AE-5004 | SHUFFLE_DATA_CORRUPTED | Shuffle 数据损坏 | 磁盘故障或网络传输错误 | 检查磁盘健康和网络 | `ae.shuffle.compression.codec` |
| AE-5005 | SHUFFLE_SERVICE_UNAVAILABLE | Shuffle Service 不可用 | Shuffle Service 未启动或崩溃 | 启动或重启 Shuffle Service | `ae.shuffle.service.enabled` |
| AE-5006 | SHUFFLE_DISK_FULL | Shuffle 磁盘满 | 本地磁盘空间不足 | 清理磁盘或增加磁盘 | `ae.shuffle.sort.buffers-per-partition` |
| AE-5007 | SHUFFLE_RETRY_EXHAUSTED | Shuffle 重试耗尽 | 网络不稳定导致重试次数用尽 | 增大重试次数或修复网络 | `ae.shuffle.io.max-retries` |
| AE-5008 | NETWORK_BACKPRESSURE_STALLED | 网络背压停滞 | 下游长时间无法消费 | 检查下游算子状态 | `ae.network.backpressure.enabled` |
| AE-5009 | NETWORK_CONNECTION_RESET | 网络连接重置 | 对端重启或网络中断 | 检查节点稳定性和网络 | `ae.network.tcp.keep-alive` |
| AE-5010 | NETWORK_PARTITION | 网络分区 | 集群节点间网络隔离 | 检查网络设备和路由 | — |

### B.6 Checkpoint与状态错误码（AE-6xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-6001 | CHECKPOINT_TIMEOUT | Checkpoint 超时 | Barrier 对齐慢或状态过大 | 增大超时或启用非对齐 Checkpoint | `ae.checkpoint.timeout`, `ae.checkpoint.unaligned.enabled` |
| AE-6002 | CHECKPOINT_FAILED | Checkpoint 失败 | 存储不可用或状态序列化错误 | 检查存储和序列化逻辑 | `ae.state.checkpoint.dir` |
| AE-6003 | CHECKPOINT_EXPIRED | Checkpoint 过期 | Checkpoint 完成时已被丢弃 | 增大保留时间 | — |
| AE-6004 | CHECKPOINT_ALIGNMENT_TIMEOUT | Checkpoint 对齐超时 | 反压导致 Barrier 对齐延迟 | 启用非对齐 Checkpoint | `ae.checkpoint.alignment-timeout` |
| AE-6005 | CHECKPOINT_CONCURRENT_LIMIT | 并发 Checkpoint 超限 | 同时进行的 Checkpoint 过多 | 增大并发限制 | `ae.checkpoint.max-concurrent` |
| AE-6006 | STATE_BACKEND_INIT_FAILED | 状态后端初始化失败 | 配置错误或存储不可达 | 检查状态后端配置 | `ae.state.backend` |
| AE-6007 | STATE_ROCKSDB_ERROR | RocksDB 操作错误 | 本地磁盘故障或配置不当 | 检查磁盘和 RocksDB 配置 | `ae.state.rocksdb.local-dir` |
| AE-6008 | STATE_ROCKSDB_WRITE_FAILED | RocksDB 写入失败 | 磁盘满或 Write Buffer 耗尽 | 增大 Write Buffer 或清理磁盘 | `ae.state.rocksdb.write-buffer-size` |
| AE-6009 | STATE_ROCKSDB_READ_FAILED | RocksDB 读取失败 | SST 文件损坏或 Block Cache 不足 | 重建状态或增大 Block Cache | `ae.state.rocksdb.block-cache-size` |
| AE-6010 | STATE_ROCKSDB_COMPACTION_ERROR | RocksDB Compaction 错误 | 磁盘空间不足或 I/O 错误 | 增加磁盘空间 | `ae.state.rocksdb.compaction.style` |
| AE-6011 | STATE_RESTORE_FAILED | 状态恢复失败 | Savepoint 损坏或版本不兼容 | 检查 Savepoint 完整性 | `ae.state.savepoint.dir` |
| AE-6012 | STATE_SERIALIZATION_ERROR | 状态序列化错误 | 序列化器不兼容或数据格式变更 | 检查序列化器兼容性 | — |
| AE-6013 | STATE_TTL_EXPIRED | 状态 TTL 过期 | 状态数据超过 TTL 时长被清理 | 调整 TTL 配置 | `ae.state.ttl.time` |
| AE-6014 | SAVEPOINT_TRIGGER_FAILED | Savepoint 触发失败 | 作业未运行或存储不可达 | 确认作业状态和存储 | `ae.state.savepoint.dir` |
| AE-6015 | SAVEPOINT_PATH_INVALID | Savepoint 路径无效 | 路径不存在或权限不足 | 检查路径和权限 | `ae.state.savepoint.dir` |
| AE-6016 | INCREMENTAL_CHECKPOINT_REF_NOT_FOUND | 增量 Checkpoint 引用未找到 | 前置 Checkpoint 数据被清理 | 增大 Checkpoint 保留数 | `ae.checkpoint.incremental.enabled` |

### B.7 SQL引擎错误码（AE-7xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-7001 | SQL_PARSE_ERROR | SQL 解析错误 | SQL 语法错误 | 检查 SQL 语法 | `ae.sql.dialect` |
| AE-7002 | SQL_VALIDATION_ERROR | SQL 校验错误 | 表或列不存在、类型不匹配 | 检查表结构和数据类型 | — |
| AE-7003 | SQL_OPTIMIZER_ERROR | SQL 优化器错误 | 优化规则异常或代价计算溢出 | 简化查询或检查优化器配置 | `ae.sql.optimizer.mode` |
| AE-7004 | SQL_CBO_STATISTICS_MISSING | CBO 统计信息缺失 | 表未收集统计信息 | 执行 ANALYZE TABLE 收集统计信息 | `ae.sql.optimizer.cbo.statistics.auto-gather` |
| AE-7005 | SQL_CBO_JOIN_REORDER_FAILED | Join 重排序失败 | 表数超过 DP 阈值 | 增大阈值或使用贪婪算法 | `ae.sql.optimizer.cbo.join-reorder.dp.threshold` |
| AE-7006 | SQL_SKEW_JOIN_DETECTED | 倾斜 Join 检测 | 某个 Join Key 数据量过大 | 启用倾斜 Join 优化 | `ae.sql.optimizer.skew-join.enabled` |
| AE-7007 | SQL_ADAPTIVE_JOIN_SWITCH_FAILED | 自适应 Join 切换失败 | 运行时切换 Join 策略失败 | 检查切换阈值和资源 | `ae.sql.optimizer.adaptive-join.switch-threshold` |
| AE-7008 | SQL_WINDOW_OVERFLOW | 窗口算子溢出 | 窗口缓冲区不足 | 增大窗口缓冲区 | `ae.sql.window.buffer-size` |
| AE-7009 | SQL_TOPN_OVERFLOW | TopN 溢出 | TopN 缓存不足 | 增大 TopN 缓存 | `ae.sql.topn.cache-size` |
| AE-7010 | SQL_SUBQUERY_UNSUPPORTED | 子查询不支持 | 不支持的子查询模式 | 重写查询避免不支持的子查询 | `ae.sql.optimizer.subquery-rewrite.enabled` |
| AE-7011 | SQL_DIALECT_INCOMPATIBLE | SQL 方言不兼容 | 使用了目标方言不支持的语法 | 切换方言或修改 SQL | `ae.sql.dialect` |
| AE-7012 | SQL_IDENTIFIER_TOO_LONG | 标识符过长 | 标识符超过最大长度限制 | 缩短标识符 | `ae.sql.max-length` |
| AE-7013 | SQL_NULL_SEMANTICS_CONFLICT | NULL 语义冲突 | Hive 与标准 SQL 的 NULL 处理差异 | 设置正确的 NULL 语义模式 | `ae.sql.null-semantics` |
| AE-7014 | SQL_DEDUPLICATE_MINI_BATCH_OVERFLOW | 去重 Mini-Batch 溢出 | Mini-Batch 大小不足 | 增大 Mini-Batch 大小 | `ae.sql.deduplicate.mini-batch.size` |
| AE-7015 | SQL_UDF_EXECUTION_ERROR | UDF 执行错误 | 用户自定义函数运行时异常 | 检查 UDF 代码和输入数据 | — |

### B.8 Catalog错误码（AE-8xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-8001 | CATALOG_NOT_FOUND | Catalog 未找到 | Catalog 名称错误或未注册 | 检查 Catalog 名称 | `ae.catalog.default` |
| AE-8002 | CATALOG_CONNECTION_FAILED | Catalog 连接失败 | Metastore 不可达 | 检查 Metastore 连接 | `ae.catalog.hive.metastore.uris` |
| AE-8003 | CATALOG_AUTHENTICATION_FAILED | Catalog 认证失败 | Kerberos 凭据过期或错误 | 更新 Kerberos 凭据 | `ae.catalog.hive.metastore.authentication` |
| AE-8004 | CATALOG_DATABASE_NOT_FOUND | 数据库未找到 | 数据库名称错误 | 检查数据库名称 | — |
| AE-8005 | CATALOG_TABLE_NOT_FOUND | 表未找到 | 表名称错误或未创建 | 检查表名称 | — |
| AE-8006 | CATALOG_TABLE_ALREADY_EXISTS | 表已存在 | 重复创建同名表 | 使用 IF NOT EXISTS | — |
| AE-8007 | CATALOG_PARTITION_NOT_FOUND | 分区未找到 | 分区值错误或分区不存在 | 检查分区值 | — |
| AE-8008 | CATALOG_CACHE_EXPIRED | Catalog 缓存过期 | 缓存 TTL 过短 | 增大缓存 TTL | `ae.catalog.cache.ttl` |
| AE-8009 | CATALOG_JDBC_ERROR | Catalog JDBC 错误 | 数据库连接或查询异常 | 检查 JDBC 配置和数据库状态 | `ae.catalog.jdbc.url` |
| AE-8010 | CATALOG_SCHEMA_INCOMPATIBLE | Schema 不兼容 | 表结构变更导致不兼容 | 检查 Schema 演化策略 | — |

### B.9 安全错误码（AE-9xxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-9001 | SECURITY_AUTHENTICATION_FAILED | 认证失败 | 凭据无效或过期 | 检查认证凭据 | `ae.security.authentication` |
| AE-9002 | SECURITY_AUTHORIZATION_DENIED | 授权被拒 | 用户无操作权限 | 联系管理员授予权限 | `ae.security.authorization.enabled` |
| AE-9003 | SECURITY_KERBEROS_LOGIN_FAILED | Kerberos 登录失败 | Keytab 文件无效或主体错误 | 检查 Keytab 和主体配置 | `ae.security.kerberos.principal`, `ae.security.kerberos.keytab` |
| AE-9004 | SECURITY_KERBEROS_TICKET_EXPIRED | Kerberos 票据过期 | 票据未及时续期 | 检查自动续期配置 | `ae.security.kerberos.relogin.interval` |
| AE-9005 | SECURITY_TOKEN_INVALID | Token 无效 | Token 格式错误或签名验证失败 | 检查 Token 生成和验证逻辑 | `ae.security.token.kind` |
| AE-9006 | SECURITY_TOKEN_EXPIRED | Token 过期 | Token 超过有效期 | 续期或重新获取 Token | `ae.security.token.renewal.interval` |
| AE-9007 | SECURITY_SSL_HANDSHAKE_FAILED | SSL 握手失败 | 证书无效或协议不匹配 | 检查证书和协议配置 | `ae.security.ssl.protocol` |
| AE-9008 | SECURITY_SSL_CERTIFICATE_INVALID | SSL 证书无效 | 证书过期或未受信任 | 更新证书或 Truststore | `ae.security.ssl.truststore.path` |
| AE-9009 | SECURITY_ENCRYPTION_ERROR | 加密错误 | 加密算法不支持或密钥错误 | 检查加密配置 | `ae.security.encryption.algorithm` |
| AE-9010 | SECURITY_AUDIT_LOG_WRITE_FAILED | 审计日志写入失败 | 审计日志目录不可写 | 检查目录权限 | `ae.security.audit.log-dir` |

### B.10 连接器错误码（AE-Axxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-A001 | CONNECTOR_KAFKA_CONNECTION_FAILED | Kafka 连接失败 | Broker 不可达 | 检查 Bootstrap Servers 配置 | `ae.connector.kafka.bootstrap-servers` |
| AE-A002 | CONNECTOR_KAFKA_TOPIC_NOT_FOUND | Kafka Topic 未找到 | Topic 不存在 | 创建 Topic 或检查名称 | — |
| AE-A003 | CONNECTOR_KAFKA_DESERIALIZATION_ERROR | Kafka 反序列化错误 | 消息格式与 Schema 不匹配 | 检查消息格式和 Schema | — |
| AE-A004 | CONNECTOR_KAFKA_OFFSET_OUT_OF_RANGE | Kafka 偏移越界 | 请求的偏移量超出范围 | 重置偏移或调整启动模式 | `ae.connector.kafka.scan.startup.mode` |
| AE-A005 | CONNECTOR_KAFKA_TRANSACTION_FAILED | Kafka 事务失败 | 事务超时或协调器不可用 | 增大事务超时 | `ae.connector.kafka.transaction.timeout` |
| AE-A006 | CONNECTOR_JDBC_CONNECTION_FAILED | JDBC 连接失败 | 数据库不可达或认证失败 | 检查 URL、用户名和密码 | `ae.connector.jdbc.url` |
| AE-A007 | CONNECTOR_JDBC_QUERY_TIMEOUT | JDBC 查询超时 | 查询执行时间过长 | 优化查询或增大超时 | `ae.connector.jdbc.scan.fetch-size` |
| AE-A008 | CONNECTOR_JDBC_WRITE_FAILED | JDBC 写入失败 | 约束冲突或连接断开 | 检查约束和连接状态 | `ae.connector.jdbc.sink.buffer-flush.max-rows` |
| AE-A009 | CONNECTOR_JDBC_BATCH_FLUSH_FAILED | JDBC 批量刷新失败 | 批量写入异常 | 检查数据类型和约束 | `ae.connector.jdbc.sink.buffer-flush.interval` |
| AE-A010 | CONNECTOR_HDFS_PERMISSION_DENIED | HDFS 权限被拒 | 用户无 HDFS 访问权限 | 检查 HDFS 权限和认证 | `ae.connector.hdfs.path` |
| AE-A011 | CONNECTOR_HDFS_FILE_NOT_FOUND | HDFS 文件未找到 | 路径不存在 | 检查文件路径 | `ae.connector.hdfs.path` |
| AE-A012 | CONNECTOR_HDFS_WRITE_FAILED | HDFS 写入失败 | 磁盘满或 NameNode 不可用 | 检查 HDFS 集群状态 | `ae.connector.hdfs.sink.rolling-policy.size` |
| AE-A013 | CONNECTOR_ELASTICSEARCH_BULK_FAILED | ES Bulk 写入失败 | ES 集群不可用或映射冲突 | 检查 ES 集群和索引映射 | `ae.connector.elasticsearch.bulk-flush.max-actions` |
| AE-A014 | CONNECTOR_ELASTICSEARCH_CONNECTION_FAILED | ES 连接失败 | ES 节点不可达 | 检查 ES 主机和端口 | `ae.connector.elasticsearch.hosts` |
| AE-A015 | CONNECTOR_REDIS_CONNECTION_FAILED | Redis 连接失败 | Redis 节点不可达或认证失败 | 检查 Redis 配置 | `ae.connector.redis.host`, `ae.connector.redis.port` |
| AE-A016 | CONNECTOR_REDIS_COMMAND_FAILED | Redis 命令失败 | 命令参数错误或集群异常 | 检查 Redis 命令和集群状态 | `ae.connector.redis.mode` |
| AE-A017 | CONNECTOR_PAIMON_WRITE_FAILED | Paimon 写入失败 | 文件系统不可用或 Schema 不匹配 | 检查文件系统和 Schema | `ae.connector.paimon.path` |
| AE-A018 | CONNECTOR_PAIMON_COMPACTION_FAILED | Paimon Compaction 失败 | 文件数过多或磁盘不足 | 调整 Compaction 配置 | `ae.connector.paimon.compaction.max.file-num` |
| AE-A019 | CONNECTOR_FORMAT_ERROR | 格式解析错误 | 数据格式与声明的格式不匹配 | 检查数据格式配置 | — |
| AE-A020 | CONNECTOR_SCHEMA_INCOMPATIBLE | Schema 不兼容 | 外部系统 Schema 变更 | 更新表定义或处理 Schema 演化 | — |

### B.11 监控与日志错误码（AE-Bxxx）

| 错误码 | 错误名称 | 描述 | 常见原因 | 处理建议 | 相关配置项 |
|---|---|---|---|---|---|
| AE-B001 | METRICS_REPORTER_ERROR | 指标报告器错误 | 报告器初始化或发送失败 | 检查报告器配置 | `ae.monitor.metrics.reporter` |
| AE-B002 | METRICS_PORT_CONFLICT | 指标端口冲突 | 端口被其他进程占用 | 更换端口 | `ae.monitor.metrics.port` |
| AE-B003 | TRACING_EXPORT_FAILED | 追踪导出失败 | 追踪端点不可达 | 检查追踪端点 | `ae.monitor.tracing.endpoint` |
| AE-B004 | LOGGING_DISK_FULL | 日志磁盘满 | 日志目录磁盘空间不足 | 清理磁盘或增大容量 | `ae.monitor.logging.total-capacity` |
| AE-B005 | WEBUI_UNAVAILABLE | Web UI 不可用 | Web UI 端口冲突或服务异常 | 检查端口和服务状态 | `ae.monitor.webui.port` |
| AE-B006 | ALERT_WEBHOOK_FAILED | 告警 Webhook 失败 | Webhook URL 不可达 | 检查 Webhook URL | `ae.monitor.alert.webhook.url` |

---

## 附录C：核心算法详解

### C.1 自适应调度算法

#### C.1.1 加权公平排队（Weighted Fair Queuing）

AE 调度器采用加权公平排队算法确保不同权重作业间的公平资源分配。算法核心思想是为每个作业维护一个虚拟开始时间（Virtual Start Time, VST）和虚拟结束时间（Virtual Finish Time, VFT），调度时优先选择 VFT 最小的作业。

**虚拟时间计算公式：**

```
V(t) = V(t') + (t - t') / Σ(w_i · active_i)
```

其中：
- `V(t)` 为时刻 `t` 的虚拟时间
- `w_i` 为作业 `i` 的权重
- `active_i` 为作业 `i` 是否活跃（0 或 1）

**虚拟结束时间计算：**

```
VFT_i = VST_i + L_i / w_i
```

其中 `L_i` 为作业 `i` 的资源需求量。

**算法伪代码：**

```python
class WeightedFairQueue:
    def __init__(self):
        self.virtual_time = 0.0
        self.last_update_time = 0.0
        self.active_jobs = {}  # job_id -> JobInfo

    def update_virtual_time(self, current_time):
        active_weights = sum(j.weight for j in self.active_jobs.values() if j.is_active)
        if active_weights > 0:
            elapsed = current_time - self.last_update_time
            self.virtual_time += elapsed / active_weights
        self.last_update_time = current_time

    def enqueue(self, job):
        self.update_virtual_time(time.now())
        job.virtual_start_time = max(self.virtual_time, job.min_start_time)
        job.virtual_finish_time = job.virtual_start_time + job.resource_demand / job.weight
        self.active_jobs[job.id] = job

    def dequeue(self):
        self.update_virtual_time(time.now())
        if not self.active_jobs:
            return None
        selected = min(self.active_jobs.values(), key=lambda j: j.virtual_finish_time)
        del self.active_jobs[selected.id]
        return selected
```

**时间片分配（Quantum-based Scheduling）：**

每个作业获得的时间片与其权重成正比：

```
quantum_i = base_quantum × w_i / Σ(w_j)
```

**配置示例：**

```yaml
ae:
  scheduler:
    queue-type: weighted-fair
    queue:
      fair:
        quantum: 200ms
    weight:
      default: 1.0
      high-priority: 10.0
```

#### C.1.2 资源评分函数

资源评分函数用于评估 TaskManager 节点的资源适配度，决定任务分配的目标节点。评分函数综合考虑 CPU、内存和 I/O 三个维度。

**评分函数公式：**

```
Score(TM, Task) = α × CPU_Score(TM, Task) + β × Mem_Score(TM, Task) + γ × IO_Score(TM, Task)
```

其中 `α + β + γ = 1`，分别对应 `cpu-weight`、`memory-weight`、`io-weight` 配置项。

**CPU 评分：**

```
CPU_Score = (1 - cpu_usage) × cpu_cores_available / cpu_cores_required
```

**内存评分：**

```
Mem_Score = (available_memory - required_memory) / total_memory
```

**I/O 评分：**

```
IO_Score = (1 - disk_usage) × (1 - network_utilization)
```

**实现代码：**

```java
public class ResourceScorer {
    private final double cpuWeight;
    private final double memoryWeight;
    private final double ioWeight;

    public ResourceScorer(double cpuWeight, double memoryWeight, double ioWeight) {
        this.cpuWeight = cpuWeight;
        this.memoryWeight = memoryWeight;
        this.ioWeight = ioWeight;
    }

    public double score(TaskManagerProfile tm, ResourceProfile request) {
        double cpuScore = (1.0 - tm.getCpuUsage())
            * tm.getAvailableCores() / Math.max(request.getCpuCores(), 0.01);
        double memScore = (tm.getAvailableMemory() - request.getMemory())
            / (double) tm.getTotalMemory();
        double ioScore = (1.0 - tm.getDiskUsage())
            * (1.0 - tm.getNetworkUtilization());
        return cpuWeight * cpuScore + memoryWeight * memScore + ioWeight * ioScore;
    }
}
```

#### C.1.3 预测调度模型

AE 支持多种预测调度模型，用于预测作业的资源需求和执行时间，从而提前做出调度决策。

**EWMA（指数加权移动平均）模型：**

```
S_t = α × X_t + (1 - α) × S_{t-1}
```

其中 `α` 为平滑系数，`X_t` 为当前观测值，`S_t` 为预测值。

```python
class EWMAPredictor:
    def __init__(self, alpha=0.3, window=60):
        self.alpha = alpha
        self.window = window
        self.current_estimate = None
        self.history = []

    def update(self, observed_value):
        self.history.append(observed_value)
        if len(self.history) > self.window:
            self.history.pop(0)
        if self.current_estimate is None:
            self.current_estimate = observed_value
        else:
            self.current_estimate = (
                self.alpha * observed_value
                + (1 - self.alpha) * self.current_estimate
            )
        return self.current_estimate

    def predict(self, steps=1):
        return self.current_estimate
```

**ARIMA 模型：**

对于具有趋势和季节性的负载模式，AE 支持 ARIMA(p,d,q) 模型：

```
ARIMA(p,d,q): φ(B)(1-B)^d X_t = θ(B)ε_t
```

```python
class ARIMAPredictor:
    def __init__(self, p=2, d=1, q=1):
        self.p = p
        self.d = d
        self.q = q
        self.model = None

    def fit(self, history):
        differenced = self._difference(history, self.d)
        self.model = self._fit_arma(differenced)
        return self

    def predict(self, steps=1):
        return self._forecast(self.model, steps)

    def _difference(self, series, d):
        for _ in range(d):
            series = [series[i] - series[i-1] for i in range(1, len(series))]
        return series
```

**MLP 神经网络模型：**

```python
import numpy as np

class MLPPredictor:
    def __init__(self, input_size=10, hidden_sizes=[64, 32], learning_rate=0.001):
        self.input_size = input_size
        self.hidden_sizes = hidden_sizes
        self.lr = learning_rate
        self.weights = self._init_weights()

    def _init_weights(self):
        sizes = [self.input_size] + self.hidden_sizes + [1]
        return [
            np.random.randn(sizes[i], sizes[i+1]) * np.sqrt(2.0 / sizes[i])
            for i in range(len(sizes) - 1)
        ]

    def predict(self, x):
        h = x
        for w in self.weights[:-1]:
            h = np.maximum(0, h @ w)
        return (h @ self.weights[-1])[0]

    def update(self, x, target):
        pred = self.predict(x)
        loss = 0.5 * (pred - target) ** 2
        self._backpropagate(x, target)
        return pred
```

### C.2 查询优化算法

#### C.2.1 CBO 代价模型

AE 的 CBO（Cost-Based Optimizer）使用代价模型评估查询计划的执行代价，选择代价最小的计划。

**代价计算公式：**

```
Cost = CPU_Cost + IO_Cost + Network_Cost + Memory_Cost
```

**CPU 代价：**

```
CPU_Cost = rows × cpu_cost_per_row
```

**IO 代价：**

```
IO_Cost = (rows × row_size) / disk_bandwidth + seek_time × num_seeks
```

**网络代价：**

```
Network_Cost = data_size / network_bandwidth + latency × num_rounds
```

**内存代价：**

```
Memory_Cost = max(memory_required - available_memory, 0) × spill_cost_per_byte
```

**算子代价常量表：**

| 算子 | CPU 代价/行 | IO 代价/行 | 网络代价/行 | 内存需求 |
|---|---|---|---|---|
| TableScan | 0.01 | 1.0 | 0.0 | 0 |
| Filter | 0.05 | 0.0 | 0.0 | 0 |
| Project | 0.02 | 0.0 | 0.0 | 0 |
| HashJoin(Build) | 0.1 | 0.0 | 0.0 | build_side_rows × row_size |
| HashJoin(Probe) | 0.1 | 0.0 | 0.0 | 0 |
| SortMergeJoin | 0.15 | 1.0 | 0.5 | sort_buffer_size |
| NestedLoopJoin | 0.01 | 0.0 | 0.0 | 0 |
| HashAggregate | 0.2 | 0.0 | 0.0 | group_count × row_size |
| SortAggregate | 0.15 | 1.0 | 0.0 | sort_buffer_size |
| Sort | 0.1 | 1.0 | 0.0 | rows × row_size |
| Exchange | 0.01 | 0.0 | 1.0 | 0 |

**代价估算代码：**

```java
public class CostEstimator {
    private final CostConstants constants;
    private final StatisticsProvider stats;

    public Cost estimate(PhysicalRelNode node) {
        switch (node.getRelType()) {
            case HASH_JOIN:
                return estimateHashJoin((HashJoinNode) node);
            case SORT_MERGE_JOIN:
                return estimateSortMergeJoin((SortMergeJoinNode) node);
            case HASH_AGGREGATE:
                return estimateHashAggregate((HashAggregateNode) node);
            default:
                return estimateGeneric(node);
        }
    }

    private Cost estimateHashJoin(HashJoinNode node) {
        Statistics leftStats = stats.getStatistics(node.getLeft());
        Statistics rightStats = stats.getStatistics(node.getRight());
        long buildRows = leftStats.getRowCount();
        long probeRows = rightStats.getRowCount();
        long buildRowSize = leftStats.getAvgRowSize();
        double selectivity = estimateJoinSelectivity(node, leftStats, rightStats);
        long outputRows = (long) (buildRows * probeRows * selectivity);

        double cpuCost = (buildRows + probeRows) * constants.getHashJoinCpuPerRow();
        double memCost = buildRows * buildRowSize;
        double ioCost = memCost > constants.getAvailableMemory()
            ? (memCost - constants.getAvailableMemory()) * constants.getSpillCostPerByte()
            : 0;

        return new Cost(cpuCost, ioCost, 0, memCost, outputRows);
    }
}
```

#### C.2.2 Join 重排序

AE 支持多种 Join 重排序算法，用于确定多表 Join 的最优顺序。

**动态规划算法（DP）：**

适用于表数较少（≤12）的场景，通过枚举所有可能的 Join 顺序选择最优解。

```python
class DPJoinReorder:
    def __init__(self, tables, predicates, cost_estimator):
        self.tables = tables
        self.predicates = predicates
        self.cost_estimator = cost_estimator
        self.memo = {}

    def reorder(self):
        n = len(self.tables)
        for i in range(n):
            subset = frozenset([i])
            self.memo[subset] = PlanNode(table=self.tables[i], cost=0)

        for size in range(2, n + 1):
            for subset in self._subsets_of_size(n, size):
                best_plan = None
                best_cost = float('inf')
                for left, right in self._binary_splits(subset):
                    if left in self.memo and right in self.memo:
                        left_plan = self.memo[left]
                        right_plan = self.memo[right]
                        join_pred = self._applicable_predicates(left, right)
                        cost = self.cost_estimator.estimate_join_cost(
                            left_plan, right_plan, join_pred
                        )
                        total_cost = left_plan.cost + right_plan.cost + cost
                        if total_cost < best_cost:
                            best_cost = total_cost
                            best_plan = PlanNode(
                                left=left_plan, right=right_plan,
                                predicates=join_pred, cost=total_cost
                            )
                if best_plan:
                    self.memo[subset] = best_plan

        return self.memo[frozenset(range(n))]

    def _subsets_of_size(self, n, size):
        from itertools import combinations
        return [frozenset(c) for c in combinations(range(n), size)]

    def _binary_splits(self, subset):
        items = list(subset)
        for i in range(1, len(items)):
            for left_indices in combinations(items, i):
                left = frozenset(left_indices)
                right = subset - left
                if right:
                    yield left, right
```

**贪婪算法：**

适用于表数较多（>12）的场景，每次选择代价最小的 Join 操作。

```python
class GreedyJoinReorder:
    def __init__(self, tables, predicates, cost_estimator):
        self.tables = tables
        self.predicates = predicates
        self.cost_estimator = cost_estimator

    def reorder(self):
        available = [PlanNode(table=t, cost=0) for t in self.tables]
        while len(available) > 1:
            best_pair = None
            best_cost = float('inf')
            for i in range(len(available)):
                for j in range(i + 1, len(available)):
                    pred = self._applicable_predicates(available[i], available[j])
                    cost = self.cost_estimator.estimate_join_cost(
                        available[i], available[j], pred
                    )
                    if cost < best_cost:
                        best_cost = cost
                        best_pair = (i, j, pred)
            i, j, pred = best_pair
            new_plan = PlanNode(
                left=available[i], right=available[j],
                predicates=pred,
                cost=available[i].cost + available[j].cost + best_cost
            )
            available = [p for k, p in enumerate(available) if k != i and k != j]
            available.append(new_plan)
        return available[0]
```

#### C.2.3 算子选择

AE 根据数据特征和资源状况动态选择算子实现。

**Join 算子选择决策树：**

```
IF one_side_fits_memory AND equi_join:
    SELECT HashJoin
ELIF both_sorted AND equi_join:
    SELECT SortMergeJoin
ELIF one_side_very_small (< 1000 rows):
    SELECT BroadcastNestedLoopJoin
ELIF non_equi_join:
    SELECT NestedLoopJoin
ELSE:
    SELECT SortMergeJoin
```

**聚合算子选择决策树：**

```
IF group_count × row_size < available_memory:
    SELECT HashAggregate
ELIF input_sorted:
    SELECT SortAggregate
ELSE:
    SELECT HashAggregate WITH Spill
```

**代码实现：**

```java
public class OperatorSelector {
    public PhysicalOperator selectJoin(JoinContext ctx) {
        long buildSize = ctx.getBuildSideStats().getRowCount()
            * ctx.getBuildSideStats().getAvgRowSize();
        long availableMem = ctx.getMemoryManager().getAvailableManagedMemory();

        if (ctx.isEquiJoin()) {
            if (buildSize < availableMem * 0.8) {
                return new HashJoinOperator(ctx);
            } else {
                return new SortMergeJoinOperator(ctx);
            }
        } else {
            if (ctx.getBuildSideStats().getRowCount() < 1000) {
                return new BroadcastNestedLoopJoinOperator(ctx);
            } else {
                return new NestedLoopJoinOperator(ctx);
            }
        }
    }

    public PhysicalOperator selectAggregate(AggregateContext ctx) {
        long groupCount = ctx.getStatistics().getGroupCount();
        long rowSize = ctx.getStatistics().getAvgRowSize();
        long requiredMem = groupCount * rowSize;
        long availableMem = ctx.getMemoryManager().getAvailableManagedMemory();

        if (requiredMem < availableMem * 0.8) {
            return new HashAggregateOperator(ctx);
        } else if (ctx.isInputSorted()) {
            return new SortAggregateOperator(ctx);
        } else {
            return new HashAggregateWithSpillOperator(ctx);
        }
    }
}
```

#### C.2.4 统计信息估计

**行数估计：**

- **Filter 选择率：**

```
selectivity = 1 / max(ndv, 1)    -- 等值条件
selectivity = (high - value) / (high - low)    -- 范围条件 (value < high)
selectivity = 1/3    -- 无法估计时默认值
```

- **Join 选择率：**

```
selectivity = 1 / max(max(ndv_left, ndv_right), 1)    -- 等值 Join
```

- **NDV 估计（HyperLogLog）：**

```
NDV = α_m² × m² × Z
```

其中 `m = 2^p`（p 为精度参数），`Z = (Σ 2^(-M[i]))^(-1)`，`α_m` 为修正常数。

```java
public class HyperLogLog {
    private final int precision;
    private final int m;
    private final byte[] registers;
    private final double alphaMM;

    public HyperLogLog(int precision) {
        this.precision = precision;
        this.m = 1 << precision;
        this.registers = new byte[m];
        this.alphaMM = getAlphaMM(m);
    }

    public void add(long hash) {
        int idx = (int) (hash >>> (64 - precision));
        int leadingZeros = Long.numberOfLeadingZeros((hash << precision) | (1 << (precision - 1))) + 1;
        registers[idx] = (byte) Math.max(registers[idx], leadingZeros);
    }

    public long estimate() {
        double z = 0.0;
        for (byte r : registers) {
            z += 1.0 / (1 << r);
        }
        double estimate = alphaMM / z;
        return applyCorrections(estimate);
    }

    private double getAlphaMM(int m) {
        double alpha;
        if (m == 16) alpha = 0.673;
        else if (m == 32) alpha = 0.697;
        else if (m == 64) alpha = 0.709;
        else alpha = 0.7213 / (1 + 1.079 / m);
        return alpha * m * m;
    }
}
```

### C.3 Checkpoint 算法

#### C.3.1 两阶段异步 Barrier

AE 的 Checkpoint 机制基于两阶段异步 Barrier 算法，分为 Barrier 注入阶段和 Barrier 对齐阶段。

**阶段一：Barrier 注入**

1. Checkpoint Coordinator 向所有 Source 算子注入 Barrier
2. Barrier 沿数据流向下传播
3. 算子收到 Barrier 后触发状态快照

**阶段二：Barrier 对齐**

1. 算子等待所有输入通道的 Barrier 到达
2. 所有 Barrier 到达后，对齐完成
3. 异步上传状态快照到持久化存储

```
时间线：
Source-1: ----[数据]----[B]----[数据]----[B]----
Source-2: ----[数据]----[数据]----[B]----[数据]----
                                    ↑
Operator:  ----[数据]----[B]----[等待对齐]----[B]----[异步上传]----
```

**Barrier 对齐代码：**

```java
public class CheckpointBarrierHandler {
    private final int numChannels;
    private final BitSet receivedBarriers;
    private long currentCheckpointId = -1;
    private final CheckpointBarrierAligner aligner;

    public void processBarrier(CheckpointBarrier barrier, int channelIndex) {
        if (barrier.getId() > currentCheckpointId) {
            currentCheckpointId = barrier.getId();
            receivedBarriers.clear();
        }
        receivedBarriers.set(channelIndex);

        if (receivedBarriers.cardinality() == numChannels) {
            aligner.onBarrierAligned(currentCheckpointId);
            triggerCheckpointAsync(currentCheckpointId);
            receivedBarriers.clear();
        }
    }

    private void triggerCheckpointAsync(long checkpointId) {
        CompletableFuture<Void> future = snapshotState(checkpointId);
        future.thenAccept(v -> {
            checkpointCoordinator.acknowledgeCheckpoint(
                taskManagerId, checkpointId, stateHandle
            );
        });
    }
}
```

#### C.3.2 增量 Checkpoint

增量 Checkpoint 仅保存自上次 Checkpoint 以来发生变化的状态数据，大幅减少 Checkpoint 数据量。

**RocksDB 增量 Checkpoint 原理：**

1. 记录上次 Checkpoint 时的 SST 文件列表
2. 新 Checkpoint 时，比较当前 SST 文件列表与上次列表
3. 仅上传新增或修改的 SST 文件
4. 引用未变化的 SST 文件（通过文件引用而非复制）

```java
public class RocksDBIncrementalCheckpoint {
    private Set<String> lastSstFiles = Collections.emptySet();

    public IncrementalStateHandle takeIncrementalCheckpoint(
        RocksDB db, long checkpointId) {
        Set<String> currentSstFiles = db.getLiveFiles();

        Set<String> newFiles = new HashSet<>(currentSstFiles);
        newFiles.removeAll(lastSstFiles);

        Map<String, StateHandle> uploadedFiles = new HashMap<>();
        for (String newFile : newFiles) {
            StateHandle handle = uploadToDfs(newFile);
            uploadedFiles.put(newFile, handle);
        }

        Set<String> referencedFiles = new HashSet<>(currentSstFiles);
        referencedFiles.retainAll(lastSstFiles);

        IncrementalStateHandle handle = new IncrementalStateHandle(
            checkpointId, uploadedFiles, referencedFiles, lastCheckpointId
        );

        lastSstFiles = currentSstFiles;
        return handle;
    }
}
```

#### C.3.3 RocksDB SST 文件管理

**SST 文件生命周期：**

```
Write Buffer → Immutable Write Buffer → Flush → L0 SST → Compaction → L1 SST → ... → Ln SST
```

**Compaction 策略：**

- **Leveled Compaction：** L0 → L1 → L2 → ... → Ln，每层大小递增因子为 10
- **Universal Compaction：** 基于大小比例触发，适合写密集场景
- **FIFO Compaction：** 仅保留最新数据，适合 TTL 场景

**SST 文件引用计数：**

```java
public class SSTFileManager {
    private final Map<String, AtomicInteger> refCounts = new ConcurrentHashMap<>();

    public void registerReference(String sstFile) {
        refCounts.computeIfAbsent(sstFile, k -> new AtomicInteger(0)).incrementAndGet();
    }

    public void releaseReference(String sstFile) {
        AtomicInteger count = refCounts.get(sstFile);
        if (count != null && count.decrementAndGet() == 0) {
            deleteFile(sstFile);
            refCounts.remove(sstFile);
        }
    }

    public Set<String> getReferencedFiles() {
        return refCounts.entrySet().stream()
            .filter(e -> e.getValue().get() > 0)
            .map(Map.Entry::getKey)
            .collect(Collectors.toSet());
    }
}
```

### C.4 背压传播算法

#### C.4.1 信用分配

AE 使用基于信用的流控机制（Credit-based Flow Control）实现精确的背压传播。

**信用分配机制：**

1. 接收端向发送端声明可用缓冲区数量（Credit）
2. 发送端仅在 Credit > 0 时发送数据
3. 每发送一个 Buffer，Credit 减 1
4. 接收端处理完 Buffer 后，向发送端补充 Credit

```java
public class CreditBasedSequenceAssigner {
    private int availableCredits;
    private final int initialCredits;
    private final Queue<Buffer> pendingBuffers = new ArrayDeque<>();

    public CreditBasedSequenceAssigner(int initialCredits) {
        this.initialCredits = initialCredits;
        this.availableCredits = initialCredits;
    }

    public boolean canSend() {
        return availableCredits > 0 && !pendingBuffers.isEmpty();
    }

    public Buffer send() {
        if (!canSend()) {
            throw new IllegalStateException("No credit available");
        }
        availableCredits--;
        return pendingBuffers.poll();
    }

    public void onBufferReceived(Buffer buffer) {
        processBuffer(buffer);
    }

    public void onCredit(int credits) {
        availableCredits += credits;
    }

    public int getAvailableCredits() {
        return availableCredits;
    }
}
```

#### C.4.2 缓冲区水位计算

**水位定义：**

- **高水位（High Watermark）：** 当缓冲区使用率超过此值时，触发背压信号
- **低水位（Low Watermark）：** 当缓冲区使用率低于此值时，解除背压信号

**水位计算：**

```
usage = used_buffers / total_buffers
backpressured = usage >= high_watermark
relieved = usage <= low_watermark
```

```java
public class BufferWatermarkTracker {
    private final int totalBuffers;
    private final double highWatermark;
    private final double lowWatermark;
    private boolean isBackpressured = false;

    public BufferWatermarkTracker(int totalBuffers, double highWatermark, double lowWatermark) {
        this.totalBuffers = totalBuffers;
        this.highWatermark = highWatermark;
        this.lowWatermark = lowWatermark;
    }

    public BackpressureStatus update(int usedBuffers) {
        double usage = (double) usedBuffers / totalBuffers;
        if (!isBackpressured && usage >= highWatermark) {
            isBackpressured = true;
            return BackpressureStatus.BACKPRESSURED;
        } else if (isBackpressured && usage <= lowWatermark) {
            isBackpressured = false;
            return BackpressureStatus.RELIEVED;
        }
        return isBackpressured ? BackpressureStatus.BACKPRESSURED : BackpressureStatus.NORMAL;
    }
}
```

**背压传播路径：**

```
Source → [Normal] → Operator-A → [Backpressured] → Operator-B → [Normal] → Sink
                                    ↑
                          背压信号向上游传播
                          Operator-A 降低发送速率
                          Source 降低读取速率
```

### C.5 数据倾斜检测与处理算法

#### C.5.1 倾斜检测阈值计算

AE 使用统计方法检测数据倾斜，基于 Partition 数据量的分布特征。

**倾斜检测算法：**

1. 采样各 Partition 的数据量
2. 计算均值（μ）和标准差（σ）
3. 检测是否存在 Partition 数据量显著偏离均值

```
skew_ratio = max(partition_size) / avg(partition_size)
is_skewed = skew_ratio > skew_threshold
```

**更精确的检测方法（基于四分位距）：**

```
Q1 = 25th_percentile(partition_sizes)
Q3 = 75th_percentile(partition_sizes)
IQR = Q3 - Q1
upper_fence = Q3 + 1.5 × IQR
is_skewed = any(partition_size > upper_fence)
```

```python
import numpy as np

class SkewDetector:
    def __init__(self, skew_threshold=0.1, min_partitions=10):
        self.skew_threshold = skew_threshold
        self.min_partitions = min_partitions

    def detect(self, partition_sizes):
        if len(partition_sizes) < self.min_partitions:
            return SkewResult(skewed=False)

        sizes = np.array(partition_sizes)
        max_size = np.max(sizes)
        avg_size = np.mean(sizes)
        total_size = np.sum(sizes)

        skew_ratio = max_size / avg_size if avg_size > 0 else 0
        concentration = max_size / total_size if total_size > 0 else 0

        q1 = np.percentile(sizes, 25)
        q3 = np.percentile(sizes, 75)
        iqr = q3 - q1
        upper_fence = q3 + 1.5 * iqr

        is_skewed = (
            concentration > self.skew_threshold
            or max_size > upper_fence
        )

        skewed_keys = []
        if is_skewed:
            for i, size in enumerate(partition_sizes):
                if size > upper_fence or size > avg_size * 3:
                    skewed_keys.append(i)

        return SkewResult(
            skewed=is_skewed,
            skew_ratio=skew_ratio,
            concentration=concentration,
            skewed_partitions=skewed_keys
        )
```

#### C.5.2 Salting Key 生成

为解决数据倾斜，AE 使用 Salting 技术将热点 Key 分散到多个子 Partition。

**Salting Key 生成算法：**

```
salted_key = original_key + "_" + random_salt(range: 0..N-1)
```

其中 `N` 为盐值范围，通常为热点 Key 的倾斜倍数。

```java
public class SaltingKeyGenerator {
    private final int saltRange;
    private final ThreadLocal<Random> random;

    public SaltingKeyGenerator(int saltRange) {
        this.saltRange = saltRange;
        this.random = ThreadLocal.withInitial(Random::new);
    }

    public String generateSaltedKey(String originalKey) {
        int salt = random.get().nextInt(saltRange);
        return originalKey + "_" + salt;
    }

    public String extractOriginalKey(String saltedKey) {
        int lastUnderscore = saltedKey.lastIndexOf('_');
        if (lastUnderscore > 0) {
            return saltedKey.substring(0, lastUnderscore);
        }
        return saltedKey;
    }

    public int extractSalt(String saltedKey) {
        int lastUnderscore = saltedKey.lastIndexOf('_');
        if (lastUnderscore > 0) {
            return Integer.parseInt(saltedKey.substring(lastUnderscore + 1));
        }
        return 0;
    }
}
```

#### C.5.3 两阶段聚合

两阶段聚合（Two-Phase Aggregation）用于解决聚合算子的数据倾斜问题。

**阶段一：局部聚合（Local Aggregate with Salting）**

1. 对热点 Key 添加随机盐值前缀
2. 在每个子任务内进行局部聚合
3. 输出带有盐值前缀的中间结果

**阶段二：全局聚合（Global Aggregate）**

1. 移除盐值前缀，恢复原始 Key
2. 对局部聚合结果进行全局聚合
3. 输出最终结果

```sql
-- 原始查询（可能倾斜）
SELECT city, COUNT(*) AS cnt
FROM orders
GROUP BY city;

-- 两阶段聚合优化
-- 阶段一：局部聚合（加盐）
SELECT CONCAT(city, '_', FLOOR(RAND() * 10)) AS salted_city,
       COUNT(*) AS partial_cnt
FROM orders
GROUP BY CONCAT(city, '_', FLOOR(RAND() * 10));

-- 阶段二：全局聚合（去盐）
SELECT SUBSTRING(salted_city, 1, POSITION('_' IN salted_city) - 1) AS city,
       SUM(partial_cnt) AS cnt
FROM partial_result
GROUP BY SUBSTRING(salted_city, 1, POSITION('_' IN salted_city) - 1);
```

**代码实现：**

```java
public class TwoPhaseAggregateFunction {
    private final int saltRange;

    public TwoPhaseAggregateFunction(int saltRange) {
        this.saltRange = saltRange;
    }

    public static class LocalAggregate extends KeyedProcessFunction<String, Row, Row> {
        private final int saltRange;
        private MapState<String, Long> localCounts;

        public LocalAggregate(int saltRange) {
            this.saltRange = saltRange;
        }

        @Override
        public void open(Configuration params) {
            localCounts = getRuntimeContext().getMapState(
                new MapStateDescriptor<>("localCounts", String.class, Long.class)
            );
        }

        @Override
        public void processElement(Row row, Context ctx, Collector<Row> out) throws Exception {
            String key = (String) row.getField(0);
            String saltedKey = key + "_" + (Math.abs(key.hashCode()) % saltRange);
            Long count = localCounts.get(saltedKey);
            localCounts.put(saltedKey, count == null ? 1L : count + 1);
        }

        @Override
        public void onTimer(long timestamp, OnTimerContext ctx, Collector<Row> out) throws Exception {
            for (Map.Entry<String, Long> entry : localCounts.entries()) {
                out.collect(Row.of(entry.getKey(), entry.getValue()));
            }
            localCounts.clear();
        }
    }

    public static class GlobalAggregate extends KeyedProcessFunction<String, Row, Row> {
        private ValueState<Long> globalCount;

        @Override
        public void open(Configuration params) {
            globalCount = getRuntimeContext().getState(
                new ValueStateDescriptor<>("globalCount", Long.class)
            );
        }

        @Override
        public void processElement(Row row, Context ctx, Collector<Row> out) throws Exception {
            String saltedKey = (String) row.getField(0);
            String originalKey = saltedKey.substring(0, saltedKey.lastIndexOf('_'));
            Long partialCount = (Long) row.getField(1);
            Long current = globalCount.value();
            globalCount.update(current == null ? partialCount : current + partialCount);
        }
    }
}
```

### C.6 内存管理算法

#### C.6.1 内存池分配

AE 使用分层内存池管理机制，将内存按用途划分为多个池，每个池独立管理。

**内存池层次结构：**

```
Process Memory
├── JVM Heap
│   ├── Framework Heap
│   └── Task Heap
├── Off-Heap
│   ├── Framework Off-Heap
│   ├── Task Off-Heap
│   ├── Network Buffers
│   └── Managed Memory
│       ├── Sort Buffer Pool
│       ├── Hash Table Pool
│       ├── RocksDB Block Cache
│       └── Spill Buffer Pool
└── JVM Overhead
```

**内存池分配算法：**

```java
public class MemoryPoolManager {
    private final long totalMemory;
    private final Map<MemoryPoolType, MemoryPool> pools;

    public MemoryPoolManager(long totalMemory, MemoryConfiguration config) {
        this.totalMemory = totalMemory;
        this.pools = new EnumMap<>(MemoryPoolType.class);
        initializePools(config);
    }

    private void initializePools(MemoryConfiguration config) {
        long remaining = totalMemory;

        long frameworkHeap = config.getFrameworkHeapSize();
        pools.put(MemoryPoolType.FRAMEWORK_HEAP, new MemoryPool(frameworkHeap));
        remaining -= frameworkHeap;

        long frameworkOffHeap = config.getFrameworkOffHeapSize();
        pools.put(MemoryPoolType.FRAMEWORK_OFFHEAP, new MemoryPool(frameworkOffHeap));
        remaining -= frameworkOffHeap;

        long networkMemory = calculateNetworkMemory(remaining, config);
        pools.put(MemoryPoolType.NETWORK, new MemoryPool(networkMemory));
        remaining -= networkMemory;

        long managedMemory = (long) (remaining * config.getManagedFraction());
        pools.put(MemoryPoolType.MANAGED, new MemoryPool(managedMemory));
        remaining -= managedMemory;

        long taskOffHeap = config.getTaskOffHeapSize();
        pools.put(MemoryPoolType.TASK_OFFHEAP, new MemoryPool(taskOffHeap));
        remaining -= taskOffHeap;

        pools.put(MemoryPoolType.TASK_HEAP, new MemoryPool(remaining));
    }

    public MemorySegment allocate(MemoryPoolType type, int size) {
        MemoryPool pool = pools.get(type);
        if (pool == null || !pool.tryReserve(size)) {
            throw new MemoryAllocationException(
                "Failed to allocate " + size + " bytes from " + type
            );
        }
        return new MemorySegment(new byte[size], type);
    }

    public void release(MemorySegment segment) {
        MemoryPool pool = pools.get(segment.getPoolType());
        pool.release(segment.size());
    }
}
```

#### C.6.2 溢写策略

当托管内存使用率超过阈值时，AE 触发溢写（Spill）操作，将部分数据写入磁盘。

**溢写策略决策：**

```
IF memory_usage >= spill_threshold:
    SELECT victim = select_victim_by_lru()
    spill_to_disk(victim)
    release_memory(victim.size)
```

**LRU 溢写选择：**

```java
public class SpillManager {
    private final LinkedHashMap<String, SpillableBuffer> lruCache;
    private final double spillThreshold;
    private final long managedMemorySize;
    private final SpillWriter spillWriter;

    public synchronized void checkAndSpill() {
        long usedMemory = calculateUsedMemory();
        double usage = (double) usedMemory / managedMemorySize;

        while (usage >= spillThreshold && !lruCache.isEmpty()) {
            Map.Entry<String, SpillableBuffer> eldest = lruCache.entrySet().iterator().next();
            SpillableBuffer victim = eldest.getValue();

            SpillHandle handle = spillWriter.spill(victim);
            victim.setSpillHandle(handle);
            victim.releaseMemory();

            usedMemory = calculateUsedMemory();
            usage = (double) usedMemory / managedMemorySize;
        }
    }

    public SpillableBuffer getBuffer(String key) {
        SpillableBuffer buffer = lruCache.get(key);
        if (buffer == null) return null;

        if (buffer.isSpilled()) {
            buffer = spillWriter.readBack(buffer.getSpillHandle());
            lruCache.put(key, buffer);
            checkAndSpill();
        }
        return buffer;
    }
}
```

#### C.6.3 GC 友好数据结构

AE 提供一组 GC 友好的数据结构，减少对象分配和 GC 压力。

**基于内存段的排序缓冲区：**

```java
public class GCFreeSortBuffer {
    private final MemorySegment[] segments;
    private final int segmentSize;
    private final int recordLength;
    private int currentSegmentIndex = 0;
    private int currentOffset = 0;
    private long totalRecords = 0;

    public GCFreeSortBuffer(int numSegments, int segmentSize, int recordLength) {
        this.segments = new MemorySegment[numSegments];
        this.segmentSize = segmentSize;
        this.recordLength = recordLength;
        for (int i = 0; i < numSegments; i++) {
            segments[i] = MemorySegment.allocateUnpooled(segmentSize);
        }
    }

    public void writeRecord(byte[] record) {
        if (currentOffset + recordLength > segmentSize) {
            currentSegmentIndex++;
            currentOffset = 0;
        }
        if (currentSegmentIndex >= segments.length) {
            throw new BufferOverflowException();
        }
        segments[currentSegmentIndex].put(currentOffset, record, 0, recordLength);
        currentOffset += recordLength;
        totalRecords++;
    }

    public byte[] readRecord(long index) {
        int segIdx = (int) (index * recordLength / segmentSize);
        int offset = (int) ((index * recordLength) % segmentSize);
        byte[] record = new byte[recordLength];
        segments[segIdx].get(offset, record, 0, recordLength);
        return record;
    }

    public long size() {
        return totalRecords;
    }
}
```

**基于内存段的哈希表：**

```java
public class GCFreeHashTable {
    private final MemorySegment dataSegment;
    private final MemorySegment metadataSegment;
    private final int bucketSize;
    private final int numBuckets;
    private final int keyLength;
    private final int valueLength;
    private long size = 0;

    private static final int METADATA_ENTRY_SIZE = 8;

    public GCFreeHashTable(int numBuckets, int keyLength, int valueLength) {
        this.numBuckets = numBuckets;
        this.keyLength = keyLength;
        this.valueLength = valueLength;
        this.bucketSize = keyLength + valueLength;
        this.dataSegment = MemorySegment.allocateUnpooled(numBuckets * bucketSize);
        this.metadataSegment = MemorySegment.allocateUnpooled(numBuckets * METADATA_ENTRY_SIZE);
        initializeMetadata();
    }

    private void initializeMetadata() {
        for (int i = 0; i < numBuckets; i++) {
            metadataSegment.putLong(i * METADATA_ENTRY_SIZE, -1L);
        }
    }

    public boolean put(byte[] key, byte[] value) {
        int bucket = hash(key) % numBuckets;
        int offset = bucket * METADATA_ENTRY_SIZE;
        long existing = metadataSegment.getLong(offset);

        if (existing == -1L) {
            int dataOffset = bucket * bucketSize;
            dataSegment.put(dataOffset, key, 0, keyLength);
            dataSegment.put(dataOffset + keyLength, value, 0, valueLength);
            metadataSegment.putLong(offset, bucket);
            size++;
            return true;
        }
        return false;
    }

    private int hash(byte[] key) {
        int h = 0;
        for (byte b : key) {
            h = 31 * h + b;
        }
        return Math.abs(h);
    }
}
```

---

## 附录D：Prometheus 指标完整列表

本附录列出 AE 引擎暴露的全部 Prometheus 指标，按模块分组。

### D.1 核心引擎指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_engine_uptime_seconds` | Gauge | `instance` | 引擎运行时长 | 监控引擎可用性 |
| `ae_engine_jobs_running` | Gauge | `instance` | 正在运行的作业数 | 监控作业负载 |
| `ae_engine_jobs_finished` | Counter | `instance`, `status` | 已完成的作业数 | 统计作业完成率 |
| `ae_engine_jobs_failed` | Counter | `instance` | 失败的作业数 | 监控作业失败率 |
| `ae_engine_jobs_cancelled` | Counter | `instance` | 取消的作业数 | 统计作业取消率 |
| `ae_engine_taskmanagers_registered` | Gauge | `instance` | 已注册的 TaskManager 数 | 监控集群规模 |
| `ae_engine_taskmanagers_lost` | Counter | `instance` | 丢失的 TaskManager 数 | 监控节点稳定性 |
| `ae_engine_slots_available` | Gauge | `instance`, `tm_id` | 可用 Slot 数 | 监控资源可用性 |
| `ae_engine_slots_total` | Gauge | `instance`, `tm_id` | 总 Slot 数 | 监控资源总量 |
| `ae_engine_heartbeat_time_ms` | Histogram | `instance`, `tm_id` | 心跳延迟 | 监控网络和节点健康 |

### D.2 调度器指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_scheduler_pending_requests` | Gauge | `instance` | 待调度请求数 | 监控调度压力 |
| `ae_scheduler_scheduling_duration_ms` | Histogram | `instance` | 调度决策耗时 | 监控调度性能 |
| `ae_scheduler_queue_size` | Gauge | `instance`, `queue` | 调度队列大小 | 监控队列积压 |
| `ae_scheduler_preemption_count` | Counter | `instance` | 抢占次数 | 监控抢占频率 |
| `ae_scheduler_speculative_task_count` | Counter | `instance`, `job_id` | 推测执行任务数 | 监控推测执行 |
| `ae_scheduler_prediction_error` | Histogram | `instance`, `model` | 预测误差 | 评估预测模型精度 |
| `ae_scheduler_backpressure_ratio` | Gauge | `instance`, `job_id` | 背压比率 | 监控背压程度 |
| `ae_scheduler_resource_score` | Gauge | `instance`, `tm_id` | 节点资源评分 | 评估节点负载 |

### D.3 执行器指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_executor_records_in` | Counter | `instance`, `task_id`, `operator` | 输入记录数 | 监控算子吞吐 |
| `ae_executor_records_out` | Counter | `instance`, `task_id`, `operator` | 输出记录数 | 监控算子产出 |
| `ae_executor_records_late` | Counter | `instance`, `task_id`, `operator` | 迟到记录数 | 监控数据质量 |
| `ae_executor_latency_ms` | Histogram | `instance`, `task_id`, `operator` | 算子处理延迟 | 监控处理性能 |
| `ae_executor_watermark_current` | Gauge | `instance`, `task_id`, `operator` | 当前 Watermark | 监控事件时间进度 |
| `ae_executor_buffer_usage_ratio` | Gauge | `instance`, `task_id`, `operator` | 缓冲区使用率 | 监控缓冲区压力 |
| `ae_executor_async_lookup_pending` | Gauge | `instance`, `task_id`, `operator` | 异步 Lookup 待处理数 | 监控 Lookup 负载 |
| `ae_executor_async_lookup_duration_ms` | Histogram | `instance`, `task_id`, `operator` | 异步 Lookup 耗时 | 监控 Lookup 性能 |
| `ae_executor_operator_chain_length` | Gauge | `instance`, `task_id` | 算子链长度 | 评估链优化效果 |
| `ae_executor_checkpoint_alignment_time_ms` | Histogram | `instance`, `task_id` | Checkpoint 对齐时间 | 监控对齐延迟 |

### D.4 内存管理指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_memory_heap_used_bytes` | Gauge | `instance`, `tm_id` | 堆内存使用量 | 监控堆内存 |
| `ae_memory_heap_max_bytes` | Gauge | `instance`, `tm_id` | 堆内存最大值 | 监控堆内存上限 |
| `ae_memory_heap_usage_ratio` | Gauge | `instance`, `tm_id` | 堆内存使用率 | 告警堆内存过高 |
| `ae_memory_managed_used_bytes` | Gauge | `instance`, `tm_id` | 托管内存使用量 | 监控托管内存 |
| `ae_memory_managed_total_bytes` | Gauge | `instance`, `tm_id` | 托管内存总量 | 监控托管内存上限 |
| `ae_memory_network_used_bytes` | Gauge | `instance`, `tm_id` | 网络缓冲区使用量 | 监控网络内存 |
| `ae_memory_network_total_bytes` | Gauge | `instance`, `tm_id` | 网络缓冲区总量 | 监控网络内存上限 |
| `ae_memory_spill_count` | Counter | `instance`, `tm_id` | 溢写次数 | 监控溢写频率 |
| `ae_memory_spill_bytes` | Counter | `instance`, `tm_id` | 溢写数据量 | 监控溢写数据量 |
| `ae_memory_gc_count` | Counter | `instance`, `tm_id`, `gc_type` | GC 次数 | 监控 GC 频率 |
| `ae_memory_gc_time_ms` | Counter | `instance`, `tm_id`, `gc_type` | GC 总耗时 | 监控 GC 开销 |
| `ae_memory_direct_used_bytes` | Gauge | `instance`, `tm_id` | 直接内存使用量 | 监控堆外内存 |

### D.5 网络与Shuffle指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_network_bytes_sent` | Counter | `instance`, `tm_id` | 网络发送字节数 | 监控网络发送量 |
| `ae_network_bytes_received` | Counter | `instance`, `tm_id` | 网络接收字节数 | 监控网络接收量 |
| `ae_network_buffers_available` | Gauge | `instance`, `tm_id` | 可用网络缓冲区数 | 监控网络缓冲区 |
| `ae_network_backpressure_ratio` | Gauge | `instance`, `task_id`, `operator` | 背压比率 | 监控背压程度 |
| `ae_shuffle_bytes_read` | Counter | `instance`, `tm_id` | Shuffle 读取字节数 | 监控 Shuffle 读 |
| `ae_shuffle_bytes_written` | Counter | `instance`, `tm_id` | Shuffle 写入字节数 | 监控 Shuffle 写 |
| `ae_shuffle_read_time_ms` | Histogram | `instance`, `tm_id` | Shuffle 读取耗时 | 监控 Shuffle 读性能 |
| `ae_shuffle_write_time_ms` | Histogram | `instance`, `tm_id` | Shuffle 写入耗时 | 监控 Shuffle 写性能 |
| `ae_shuffle_compression_ratio` | Gauge | `instance`, `tm_id`, `codec` | Shuffle 压缩率 | 评估压缩效果 |
| `ae_shuffle_io_retries` | Counter | `instance`, `tm_id` | Shuffle IO 重试次数 | 监控网络稳定性 |

### D.6 Checkpoint与状态指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_checkpoint_count` | Counter | `instance`, `job_id`, `status` | Checkpoint 总数 | 监控 Checkpoint 频率 |
| `ae_checkpoint_duration_ms` | Histogram | `instance`, `job_id` | Checkpoint 耗时 | 监控 Checkpoint 性能 |
| `ae_checkpoint_size_bytes` | Histogram | `instance`, `job_id` | Checkpoint 数据大小 | 监控状态增长 |
| `ae_checkpoint_alignment_time_ms` | Histogram | `instance`, `job_id`, `task_id` | Checkpoint 对齐耗时 | 监控对齐延迟 |
| `ae_checkpoint_start_delay_ms` | Histogram | `instance`, `job_id` | Checkpoint 启动延迟 | 监控触发延迟 |
| `ae_state_size_bytes` | Gauge | `instance`, `job_id`, `task_id` | 状态大小 | 监控状态增长趋势 |
| `ae_state_rocksdb_compaction_count` | Counter | `instance`, `tm_id` | RocksDB Compaction 次数 | 监控 Compaction 频率 |
| `ae_state_rocksdb_compaction_time_ms` | Histogram | `instance`, `tm_id` | RocksDB Compaction 耗时 | 监控 Compaction 开销 |
| `ae_state_rocksdb_block_cache_hit_ratio` | Gauge | `instance`, `tm_id` | Block Cache 命中率 | 评估缓存效率 |
| `ae_state_rocksdb_write_stall_count` | Counter | `instance`, `tm_id` | 写入停顿次数 | 监控写入性能 |
| `ae_state_rocksdb_sst_files` | Gauge | `instance`, `tm_id`, `level` | SST 文件数 | 监控文件增长 |
| `ae_state_rocksdb_write_buffer_count` | Gauge | `instance`, `tm_id` | 活跃 Write Buffer 数 | 监控写入缓冲 |

### D.7 SQL引擎指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_sql_query_count` | Counter | `instance`, `status` | SQL 查询总数 | 监控查询频率 |
| `ae_sql_query_duration_ms` | Histogram | `instance`, `query_type` | SQL 查询耗时 | 监控查询性能 |
| `ae_sql_optimization_duration_ms` | Histogram | `instance` | SQL 优化耗时 | 监控优化器性能 |
| `ae_sql_parsing_duration_ms` | Histogram | `instance` | SQL 解析耗时 | 监控解析性能 |
| `ae_sql_join_reorder_count` | Counter | `instance`, `algorithm` | Join 重排序次数 | 统计优化频率 |
| `ae_sql_skew_join_detected_count` | Counter | `instance`, `job_id` | 倾斜 Join 检测次数 | 监控数据倾斜 |
| `ae_sql_adaptive_join_switch_count` | Counter | `instance`, `from`, `to` | 自适应 Join 切换次数 | 监控 Join 策略切换 |
| `ae_sql_statistics_gather_count` | Counter | `instance` | 统计信息收集次数 | 监控统计信息收集 |
| `ae_sql_statistics_gather_duration_ms` | Histogram | `instance` | 统计信息收集耗时 | 监控收集性能 |

### D.8 连接器指标

| 指标名称 | 类型 | 标签 | 描述 | 用途 |
|---|---|---|---|---|
| `ae_connector_kafka_records_consumed` | Counter | `instance`, `task_id`, `topic` | Kafka 消费记录数 | 监控消费吞吐 |
| `ae_connector_kafka_records_produced` | Counter | `instance`, `task_id`, `topic` | Kafka 生产记录数 | 监控生产吞吐 |
| `ae_connector_kafka_consumer_lag` | Gauge | `instance`, `task_id`, `topic`, `partition` | Kafka 消费延迟 | 监控消费进度 |
| `ae_connector_kafka_commit_duration_ms` | Histogram | `instance`, `task_id` | Kafka 偏移提交耗时 | 监控提交性能 |
| `ae_connector_jdbc_query_duration_ms` | Histogram | `instance`, `task_id`, `table` | JDBC 查询耗时 | 监控 JDBC 性能 |
| `ae_connector_jdbc_connection_count` | Gauge | `instance`, `task_id` | JDBC 活跃连接数 | 监控连接池 |
| `ae_connector_jdbc_write_count` | Counter | `instance`, `task_id`, `table` | JDBC 写入记录数 | 监控写入量 |
| `ae_connector_hdfs_bytes_written` | Counter | `instance`, `task_id`, `format` | HDFS 写入字节数 | 监控 HDFS 写入 |
| `ae_connector_hdfs_bytes_read` | Counter | `instance`, `task_id`, `format` | HDFS 读取字节数 | 监控 HDFS 读取 |
| `ae_connector_es_bulk_duration_ms` | Histogram | `instance`, `task_id`, `index` | ES Bulk 写入耗时 | 监控 ES 写入性能 |
| `ae_connector_es_bulk_success_count` | Counter | `instance`, `task_id`, `index` | ES Bulk 成功次数 | 监控 ES 写入成功 |
| `ae_connector_es_bulk_failure_count` | Counter | `instance`, `task_id`, `index` | ES Bulk 失败次数 | 监控 ES 写入失败 |
| `ae_connector_redis_command_duration_ms` | Histogram | `instance`, `task_id`, `command` | Redis 命令耗时 | 监控 Redis 性能 |
| `ae_connector_redis_connection_count` | Gauge | `instance`, `task_id` | Redis 活跃连接数 | 监控连接池 |
| `ae_connector_paimon_write_bytes` | Counter | `instance`, `task_id`, `table` | Paimon 写入字节数 | 监控 Paimon 写入 |
| `ae_connector_paimon_compaction_duration_ms` | Histogram | `instance`, `task_id`, `table` | Paimon Compaction 耗时 | 监控 Compaction |

**PromQL 查询示例：**

```promql
# 作业失败率
rate(ae_engine_jobs_failed[5m]) / rate(ae_engine_jobs_finished[5m])

# 平均 Checkpoint 耗时
histogram_quantile(0.95, rate(ae_checkpoint_duration_ms_bucket[5m]))

# 内存使用率
ae_memory_heap_used_bytes / ae_memory_heap_max_bytes

# Kafka 消费延迟
ae_connector_kafka_consumer_lag

# 背压比率
ae_network_backpressure_ratio

# GC 开销占比
rate(ae_memory_gc_time_ms{gc_type="FullGC"}[5m]) / 60000

# Shuffle 压缩率
ae_shuffle_compression_ratio

# RocksDB Block Cache 命中率
ae_state_rocksdb_block_cache_hit_ratio
```

---

## 附录E：术语表

| 中文术语 | 英文术语 | 缩写 | 详细定义 | 相关术语 |
|---|---|---|---|---|
| 自适应引擎 | Adaptive Engine | AE | 根据运行时数据特征和资源状况自动调整执行策略的计算引擎 | 自适应调度, 自适应 Join |
| 自适应调度 | Adaptive Scheduling | — | 根据作业运行时状态动态调整调度策略的机制 | 调度器, 抢占式调度 |
| 自适应 Join | Adaptive Join | — | 运行时根据数据量动态选择 Join 策略（Hash/SortMerge）的优化 | Hash Join, SortMerge Join |
| 背压 | Backpressure | — | 下游算子处理速度慢于上游时，压力向上游传播的机制 | 信用流控, 缓冲区水位 |
| 屏障 | Barrier | — | Checkpoint 机制中用于分隔数据流并触发状态快照的特殊标记 | Checkpoint, 对齐 |
| 批处理 | Batch Processing | — | 处理有界数据集的执行模式 | 流处理, 微批处理 |
| 广播变量 | Broadcast Variable | — | 在所有并行实例间共享的只读变量 | 分布式缓存 |
| 目录 | Catalog | — | 元数据管理组件，提供数据库、表、分区的统一视图 | Hive Catalog, JDBC Catalog |
| 检查点 | Checkpoint | CP | 引擎自动触发的增量状态快照，用于故障恢复 | Savepoint, 增量 Checkpoint |
| 基于信用的流控 | Credit-based Flow Control | — | 接收端声明可用缓冲区数量，发送端据此控制发送速率的流控机制 | 背压, 缓冲区 |
| 基于代价的优化 | Cost-Based Optimization | CBO | 基于统计信息和代价模型选择最优执行计划的优化方式 | RBO, 代价模型 |
| 数据倾斜 | Data Skew | — | 某些分区或键的数据量远大于其他分区或键的现象 | Salting, 两阶段聚合 |
| 动态规划 | Dynamic Programming | DP | Join 重排序中使用的穷举最优解算法 | 贪婪算法, Join 重排序 |
| 精确一次 | Exactly-once | EO | 保证每条记录对状态和输出仅产生一次影响的语义 | 至少一次, Checkpoint |
| 执行图 | Execution Graph | EG | 作业的并行化执行计划，包含具体的执行顶点和边 | 作业图, StreamGraph |
| 执行顶点 | Execution Vertex | EV | 执行图中的单个并行子任务 | 执行边, 任务 |
| 故障恢复 | Failover | — | 作业发生故障后自动恢复执行的机制 | Region Failover, 全局恢复 |
| 过滤器下推 | Filter Pushdown | — | 将过滤条件尽可能下推到数据源端执行的优化策略 | 投影下推, 谓词下推 |
| 门 | Gate | — | 网络栈中输入通道的集合，用于管理缓冲区分配 | 通道, 信用 |
| 全局聚合 | Global Aggregate | — | 两阶段聚合的第二阶段，对局部聚合结果进行最终聚合 | 局部聚合, 两阶段聚合 |
| 哈希连接 | Hash Join | HJ | 使用哈希表进行连接的算法，适合等值连接和大表连接 | 排序归并连接, 嵌套循环连接 |
| 超对数对数 | HyperLogLog | HLL | 用于基数估计的概率数据结构 | NDV, 统计信息 |
| 增量检查点 | Incremental Checkpoint | — | 仅保存自上次检查点以来状态变化的检查点机制 | 检查点, RocksDB |
| 作业图 | Job Graph | JG | 优化后的逻辑执行图，包含作业顶点和作业边 | 执行图, StreamGraph |
| 作业顶点 | Job Vertex | JV | 作业图中的算子节点 | 作业边, 算子链 |
| 连接 | Join | — | 将两个数据集按连接条件合并的操作 | Hash Join, SortMerge Join |
| 连接重排序 | Join Reorder | — | 优化多表连接顺序以降低执行代价的策略 | CBO, 动态规划 |
| 键组 | Key Group | KG | 键的分区单元，用于状态分配和重新分配 | 最大并行度, 键 |
| 键控状态 | Keyed State | — | 与特定键关联的状态，随键在并行实例间迁移 | 算子状态, 状态后端 |
| 延迟追踪 | Latency Tracking | — | 跟踪记录从源到汇的端到端延迟的机制 | Watermark, 延迟标记 |
| 局部聚合 | Local Aggregate | — | 两阶段聚合的第一阶段，在子任务内对加盐键进行聚合 | 全局聚合, 两阶段聚合 |
| 托管内存 | Managed Memory | — | 由引擎统一管理的堆外内存，用于排序、缓存等操作 | 内存池, 溢写 |
| 内存段 | Memory Segment | — | 引擎内存管理的基本单位，固定大小的连续内存块 | 托管内存, 内存池 |
| 微批处理 | Mini-batch | — | 将流数据按小批次处理以减少状态访问的优化策略 | 去重, 聚合 |
| 嵌套循环连接 | Nested Loop Join | NLJ | 对两表进行嵌套遍历的连接算法，适合非等值连接 | Hash Join, SortMerge Join |
| 非对齐检查点 | Unaligned Checkpoint | — | 不等待屏障对齐直接快照的检查点模式，减少对齐延迟 | 对齐检查点, 屏障 |
| 算子 | Operator | Op | 数据流图中的处理节点，执行特定的数据转换操作 | 算子链, 算子状态 |
| 算子链 | Operator Chain | — | 将多个算子合并到同一个任务中执行以减少序列化和网络开销的优化 | 算子, 任务 |
| 算子状态 | Operator State | — | 与算子实例关联的状态，不随键迁移 | 键控状态, 状态后端 |
| 分区 | Partition | — | 数据按特定规则划分的子集 | 数据倾斜, Shuffle |
| 管道 | Pipeline | — | 数据在算子间直接传输不落盘的执行模式 | Shuffle, 阻塞 |
| 预测调度 | Predictive Scheduling | — | 基于历史数据预测资源需求并提前做出调度决策的机制 | EWMA, ARIMA |
| 投影下推 | Projection Pushdown | — | 将列裁剪下推到数据源端执行的优化策略 | 过滤器下推, 列裁剪 |
| 抢占式调度 | Preemptive Scheduling | — | 高优先级作业抢占低优先级作业资源的调度策略 | 调度器, 权重 |
| 谓词下推 | Predicate Pushdown | — | 将过滤条件下推到数据源或存储层执行的优化策略 | 过滤器下推, 投影下推 |
| 排序归并连接 | SortMerge Join | SMJ | 先排序再归并的连接算法，适合大数据量等值连接 | Hash Join, 嵌套循环连接 |
| 保存点 | Savepoint | SP | 用户手动触发的完整状态快照，用于版本升级和迁移 | 检查点, 状态恢复 |
| 调度器 | Scheduler | — | 负责将作业的任务分配到可用资源上执行的组件 | 自适应调度, 抢占式调度 |
| 槽位 | Slot | — | TaskManager 中的资源单位，每个槽位可运行一个任务链 | TaskManager, 资源 |
| 盐化 | Salting | — | 为热点键添加随机前缀以分散数据的倾斜处理技术 | 数据倾斜, 两阶段聚合 |
| Shuffle | Shuffle | — | 数据在阶段间按分区规则重新分布的过程 | 排序 Shuffle, 哈希 Shuffle |
| 排序 Shuffle | Sort Shuffle | — | 先排序再分区的 Shuffle 策略，支持数据压缩和合并 | 哈希 Shuffle, Shuffle Service |
| 溢写 | Spill | — | 内存不足时将部分数据写入磁盘的机制 | 托管内存, 内存池 |
| 状态后端 | State Backend | SB | 负责状态存储和访问的组件（如 HashMap、RocksDB） | 检查点, 键控状态 |
| 状态存活时间 | State Time-to-Live | State TTL | 状态数据的自动过期清理机制 | 状态后端, 清理策略 |
| 流处理 | Stream Processing | — | 处理无界数据流的执行模式 | 批处理, 微批处理 |
| 任务 | Task | — | 执行图中的单个并行子任务，对应一个槽位 | 算子链, 槽位 |
| 任务管理器 | TaskManager | TM | 负责执行具体计算任务的工作节点 | 作业管理器, 槽位 |
| 作业管理器 | JobManager | JM | 负责协调调度、检查点和元数据管理的中心节点 | 任务管理器, 调度器 |
| 两阶段聚合 | Two-Phase Aggregation | 2PA | 先局部聚合再全局聚合的倾斜处理策略 | 数据倾斜, 盐化 |
| 水位线 | Watermark | WM | 表示事件时间进度的标记，用于触发窗口计算 | 窗口, 事件时间 |
| 窗口 | Window | — | 将无界流划分为有界批次进行计算的机制 | 水位线, 滚动窗口 |
| 加权公平排队 | Weighted Fair Queuing | WFQ | 按权重比例分配资源的调度队列算法 | 调度器, 权重 |
| 区域故障恢复 | Region Failover | — | 仅重启受故障影响的区域而非整个作业的恢复策略 | 全局恢复, 故障恢复 |
| 远程 Shuffle 服务 | Remote Shuffle Service | RSS | 独立于 TaskManager 的 Shuffle 数据管理服务 | Shuffle, 排序 Shuffle |
| 资源配置 | Resource Profile | RP | 描述任务所需 CPU、内存等资源的规格 | 槽位, 调度器 |
| 推测执行 | Speculative Execution | — | 为慢任务启动备份副本以减少作业完成时间的机制 | 调度器, 慢任务 |
| 统计信息 | Statistics | — | 表的行数、列的 NDV、数据分布等元信息，用于 CBO | CBO, HyperLogLog |
| 不同值数量 | Number of Distinct Values | NDV | 列中不同值的数量估计 | HyperLogLog, 统计信息 |
| 序列化 | Serialization | — | 将对象转换为字节流以便存储或传输的过程 | 反序列化, 状态后端 |
| 反序列化 | Deserialization | — | 将字节流还原为对象的过程 | 序列化, Schema |
| Schema | Schema | — | 数据的结构定义，包含列名、类型等信息 | Catalog, 表 |
| 事件时间 | Event Time | — | 数据本身携带的时间戳，而非处理时间 | 处理时间, 水位线 |
| 处理时间 | Processing Time | — | 算子处理数据时的系统时间 | 事件时间, 水位线 |
| 摄入时间 | Ingestion Time | — | 数据进入引擎时的时间戳 | 事件时间, 处理时间 |
| 滚动窗口 | Tumbling Window | — | 固定大小且不重叠的窗口类型 | 滑动窗口, 会话窗口 |
| 滑动窗口 | Sliding Window | — | 固定大小但可重叠的窗口类型 | 滚动窗口, 会话窗口 |
| 会话窗口 | Session Window | — | 按活动会话划分的动态大小窗口 | 滚动窗口, 滑动窗口 |
| 连接器 | Connector | — | 与外部系统交互的插件组件 | Kafka 连接器, JDBC 连接器 |
| 格式 | Format | — | 数据的序列化格式（如 JSON、Avro、Parquet） | 连接器, Schema |
| 压缩 | Compression | — | 减少数据存储和传输量的编码技术 | Shuffle, 溢写 |
| 快照 | Snapshot | — | 状态在某一时刻的完整或增量视图 | 检查点, 保存点 |
| 逻辑计划 | Logical Plan | LP | SQL 查询经过解析和校验后的逻辑表示 | 物理计划, 优化器 |
| 物理计划 | Physical Plan | PP | 经过优化和转换后可执行的计划 | 逻辑计划, CBO |
| 规则优化 | Rule-based Optimization | RBO | 基于预定义规则进行计划转换的优化方式 | CBO, 优化器 |
| 优化器 | Optimizer | — | 将逻辑计划转换为最优物理计划的组件 | CBO, RBO |
| 代价模型 | Cost Model | — | 评估执行计划代价的数学模型 | CBO, 统计信息 |
| 选择率 | Selectivity | — | 满足过滤条件的行占总行数的比例 | CBO, 统计信息 |
| 并行度 | Parallelism | — | 算子的并行实例数 | 槽位, 资源配置 |
| 最大并行度 | Max Parallelism | — | 键组的数量上限，影响状态重新分配 | 键组, 并行度 |
| 算子状态 | Operator State | — | 与算子绑定的状态（非键控） | 键控状态, 状态后端 |
| 广播状态 | Broadcast State | — | 在所有并行实例间同步的只读状态 | 算子状态, 广播流 |
| 广播流 | Broadcast Stream | — | 向所有下游实例广播数据的流 | 广播状态, 连接 |
| 异步快照 | Async Snapshot | — | 不阻塞数据处理的状态快照机制 | 检查点, 屏障 |
| 同步快照 | Sync Snapshot | — | 阻塞数据处理的状态快照机制 | 异步快照, 检查点 |

---

## 附录F：版本兼容性矩阵

### F.1 API版本兼容性

| API | AE 1.x | AE 2.0 | AE 2.1 | AE 2.2 | AE 3.0 | 兼容性说明 |
|---|---|---|---|---|---|---|
| DataStream API v1 | ✅ | ✅ | ✅ | ✅ | ⚠️ | 3.0 标记为废弃 |
| DataStream API v2 | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| SQL API v1 | ✅ | ✅ | ✅ | ✅ | ✅ | 完全向后兼容 |
| SQL API v2 | — | — | ✅ | ✅ | ✅ | 2.1 引入，增加窗口 TVF |
| Table API v1 | ✅ | ✅ | ✅ | ✅ | ✅ | 完全向后兼容 |
| Table API v2 | — | — | ✅ | ✅ | ✅ | 2.1 引入 |
| REST API v1 | ✅ | ✅ | ✅ | ✅ | ⚠️ | 3.0 标记为废弃 |
| REST API v2 | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Metrics API v1 | ✅ | ✅ | ✅ | ✅ | ✅ | 完全向后兼容 |
| Python API v1 | ✅ | ✅ | ✅ | ✅ | ✅ | 完全向后兼容 |
| Scala API | ✅ | ✅ 2.12 | ✅ 2.12/2.13 | ✅ 2.12/2.13 | ✅ 2.13 | 3.0 移除 2.12 |
| Java API | ✅ 8+ | ✅ 8+ | ✅ 8+ | ✅ 8+/11+ | ✅ 11+ | 3.0 移除 Java 8 |

✅ = 完全兼容 | ⚠️ = 废弃但可用 | ❌ = 不兼容 | — = 不适用

### F.2 数据格式兼容性

| 数据格式 | AE 1.x 读取 | AE 1.x 写入 | AE 2.x 读取 | AE 2.x 写入 | AE 3.x 读取 | AE 3.x 写入 | 说明 |
|---|---|---|---|---|---|---|---|
| Avro 1.8 | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | 3.0 写入废弃 |
| Avro 1.10+ | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Parquet 1.10 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| Parquet 1.12+ | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| ORC 1.5 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| ORC 1.7+ | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| JSON (raw) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| JSON (canal) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| JSON (debezium) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| CSV | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| Protobuf | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Arrow | — | — | — | ✅ | ✅ | ✅ | 2.1 引入 |
| Paimon 0.4 | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Paimon 0.6+ | — | — | ✅ | ✅ | ✅ | ✅ | 2.1 引入 |
| Iceberg 0.13 | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Iceberg 1.0+ | — | — | ✅ | ✅ | ✅ | ✅ | 2.1 引入 |
| Hudi 0.10 | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Hudi 0.12+ | — | — | — | ✅ | ✅ | ✅ | 2.2 引入 |
| Checkpoint v2 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| Checkpoint v3 | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入，优先使用 |
| Savepoint v2 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| Savepoint v3 | — | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |

### F.3 Connector兼容性

| Connector | AE 1.x | AE 2.0 | AE 2.1 | AE 2.2 | AE 3.0 | 最低版本 | 最高测试版本 |
|---|---|---|---|---|---|---|---|
| Kafka | ✅ | ✅ | ✅ | ✅ | ✅ | 0.10 | 3.6 |
| Kafka (exactly-once) | ✅ | ✅ | ✅ | ✅ | ✅ | 0.11 | 3.6 |
| Kafka (transactional) | ✅ | ✅ | ✅ | ✅ | ✅ | 0.11 | 3.6 |
| MySQL (CDC) | ✅ | ✅ | ✅ | ✅ | ✅ | 5.6 | 8.0 |
| PostgreSQL (CDC) | ✅ | ✅ | ✅ | ✅ | ✅ | 9.6 | 15 |
| Oracle (CDC) | — | ✅ | ✅ | ✅ | ✅ | 11g | 19c |
| SQL Server (CDC) | — | ✅ | ✅ | ✅ | ✅ | 2016 | 2022 |
| MongoDB (CDC) | — | ✅ | ✅ | ✅ | ✅ | 4.0 | 7.0 |
| JDBC (Generic) | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| HDFS | ✅ | ✅ | ✅ | ✅ | ✅ | 2.7 | 3.3 |
| HBase | ✅ | ✅ | ✅ | ✅ | ✅ | 1.4 | 2.5 |
| Hive | ✅ | ✅ | ✅ | ✅ | ✅ | 2.3 | 3.1 |
| Elasticsearch | ✅ | ✅ | ✅ | ✅ | ✅ | 6.x | 8.x |
| Redis | ✅ | ✅ | ✅ | ✅ | ✅ | 5.0 | 7.2 |
| Paimon | — | ✅ | ✅ | ✅ | ✅ | 0.4 | 0.8 |
| Iceberg | — | ✅ | ✅ | ✅ | ✅ | 0.13 | 1.4 |
| Hudi | — | ✅ | ✅ | ✅ | ✅ | 0.10 | 0.14 |
| DynamoDB | — | — | ✅ | ✅ | ✅ | — | — |
| Kinesis | — | ✅ | ✅ | ✅ | ✅ | — | — |
| Pulsar | — | ✅ | ✅ | ✅ | ✅ | 2.8 | 3.0 |
| RabbitMQ | ✅ | ✅ | ✅ | ✅ | ✅ | 3.8 | 3.12 |
| Cassandra | ✅ | ✅ | ✅ | ✅ | ✅ | 3.x | 4.1 |
| ClickHouse | — | — | ✅ | ✅ | ✅ | 20.x | 23.x |
| StarRocks | — | — | — | ✅ | ✅ | 2.5 | 3.2 |
| Doris | — | — | — | ✅ | ✅ | 1.2 | 2.0 |

### F.4 SDK版本兼容性

| SDK | AE 1.x | AE 2.0 | AE 2.1 | AE 2.2 | AE 3.0 | 说明 |
|---|---|---|---|---|---|---|
| Java SDK 1.0 | ✅ | ✅ | ✅ | ✅ | ⚠️ | 3.0 废弃 |
| Java SDK 2.0 | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Python SDK 1.0 | ✅ | ✅ | ✅ | ✅ | ⚠️ | 3.0 废弃 |
| Python SDK 2.0 | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| Go SDK | — | — | ✅ | ✅ | ✅ | 2.1 引入 |
| Rust SDK | — | — | — | ✅ | ✅ | 2.2 引入 |
| REST Client v1 | ✅ | ✅ | ✅ | ✅ | ⚠️ | 3.0 废弃 |
| REST Client v2 | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |
| CLI v1 | ✅ | ✅ | ✅ | ✅ | ✅ | 完全兼容 |
| CLI v2 | — | ✅ | ✅ | ✅ | ✅ | 2.0 引入 |

**SDK 依赖版本矩阵：**

| 依赖 | Java SDK 1.0 | Java SDK 2.0 | Python SDK 1.0 | Python SDK 2.0 |
|---|---|---|---|---|
| 最低 Java 版本 | 8 | 8 | — | — |
| 最高 Java 版本 | 17 | 21 | — | — |
| 最低 Python 版本 | — | — | 3.6 | 3.8 |
| 最高 Python 版本 | — | — | 3.10 | 3.12 |
| Netty 版本 | 4.1.x | 4.1.x | — | — |
| Jackson 版本 | 2.12.x | 2.15.x | — | — |
| Protobuf 版本 | 3.19.x | 3.24.x | 3.19.x | 3.24.x |

### F.5 配置迁移指南

从 AE 1.x 迁移到 AE 2.x 的配置变更：

| AE 1.x 配置 | AE 2.x 配置 | 变更类型 | 说明 |
|---|---|---|---|
| `engine.mode` | `ae.engine.mode` | 前缀变更 | 所有配置增加 `ae.` 前缀 |
| `taskmanager.memory.process.size` | `ae.memory.process.size` | 前缀变更 | 统一前缀 |
| `state.backend` | `ae.state.backend` | 前缀变更 | 统一前缀 |
| `state.checkpoints.dir` | `ae.state.checkpoint.dir` | 名称变更 | `checkpoints` → `checkpoint` |
| `state.savepoints.dir` | `ae.state.savepoint.dir` | 名称变更 | `savepoints` → `savepoint` |
| `parallelism.default` | `ae.engine.parallelism.default` | 前缀变更 | 统一前缀 |
| `restart-strategy` | `ae.engine.restart-strategy` | 前缀变更 | 统一前缀 |
| `execution.checkpointing.interval` | `ae.checkpoint.interval` | 路径重构 | 简化路径 |
| `execution.checkpointing.mode` | `ae.checkpoint.mode` | 路径重构 | 简化路径 |
| `execution.checkpointing.timeout` | `ae.checkpoint.timeout` | 路径重构 | 简化路径 |
| `table.optimizer.join-reorder-enabled` | `ae.sql.optimizer.cbo.join-reorder.enabled` | 路径重构 | 统一 SQL 前缀 |
| `table.optimizer.skew-join.enabled` | `ae.sql.optimizer.skew-join.enabled` | 路径重构 | 统一 SQL 前缀 |
| `pipeline.object-reuse` | `ae.executor.object-reuse.enabled` | 路径重构 | 统一 executor 前缀 |
| `pipeline.auto-watermark-interval` | `ae.executor.watermark-interval` | 路径重构 | 统一 executor 前缀 |
| `taskmanager.network.request-backoff-max` | `ae.memory.network.request-segments-timeout` | 名称变更 | 语义更清晰 |
| `scheduler.mode` | `ae.scheduler.type` | 名称变更 | `mode` → `type` |
| `jobmanager.scheduler` | `ae.scheduler.type` | 名称变更 | 路径重构 |
| `blob.server.port` | `ae.engine.blob.port` | 前缀变更 | 统一前缀 |
| `taskmanager.data.port` | `ae.engine.data.port` | 前缀变更 | 统一前缀 |
| `resourcemanager.taskmanager-timeout` | `ae.engine.heartbeat.timeout` | 合并 | 统一到心跳超时 |

**迁移脚本示例：**

```bash
#!/bin/bash
# AE 1.x → 2.x 配置迁移脚本

OLD_CONF="$1"
NEW_CONF="$2"

if [ -z "$OLD_CONF" ] || [ -z "$NEW_CONF" ]; then
    echo "Usage: $0 <old-conf.yaml> <new-conf.yaml>"
    exit 1
fi

cp "$OLD_CONF" "$NEW_CONF"

# 前缀迁移
sed -i 's/^engine\./ae.engine./g' "$NEW_CONF"
sed -i 's/^taskmanager\.memory\./ae.memory./g' "$NEW_CONF"
sed -i 's/^state\./ae.state./g' "$NEW_CONF"
sed -i 's/^execution\.checkpointing\./ae.checkpoint./g' "$NEW_CONF"
sed -i 's/^table\.optimizer\./ae.sql.optimizer./g' "$NEW_CONF"
sed -i 's/^pipeline\./ae.executor./g' "$NEW_CONF"
sed -i 's/^scheduler\./ae.scheduler./g' "$NEW_CONF"

# 名称迁移
sed -i 's/ae\.state\.checkpoints\.dir/ae.state.checkpoint.dir/g' "$NEW_CONF"
sed -i 's/ae\.state\.savepoints\.dir/ae.state.savepoint.dir/g' "$NEW_CONF"
sed -i 's/ae\.scheduler\.mode/ae.scheduler.type/g' "$NEW_CONF"
sed -i 's/ae\.memory\.network\.request-backoff-max/ae.memory.network.request-segments-timeout/g' "$NEW_CONF"

# 新增默认值
grep -q "^ae.engine.adaptive.enabled" "$NEW_CONF" || \
    echo "ae.engine.adaptive.enabled: true" >> "$NEW_CONF"
grep -q "^ae.scheduler.type" "$NEW_CONF" || \
    echo "ae.scheduler.type: adaptive" >> "$NEW_CONF"
grep -q "^ae.sql.optimizer.cbo.enabled" "$NEW_CONF" || \
    echo "ae.sql.optimizer.cbo.enabled: true" >> "$NEW_CONF"

echo "Migration complete: $OLD_CONF -> $NEW_CONF"
```

**从 AE 2.x 迁移到 AE 3.x 的配置变更：**

| AE 2.x 配置 | AE 3.x 配置 | 变更类型 | 说明 |
|---|---|---|---|
| `ae.engine.classloader.resolve-order` | `ae.engine.classloader.resolve-order` | 默认值变更 | 默认从 `parent-first` 改为 `child-first` |
| `ae.state.rocksdb.predefined-options` | `ae.state.rocksdb.predefined-options` | 默认值变更 | 默认改为 `FLASH_SSD_OPTIMIZED` |
| `ae.checkpoint.unaligned.enabled` | `ae.checkpoint.unaligned.enabled` | 默认值变更 | 默认改为 `true` |
| `ae.executor.object-reuse.enabled` | `ae.executor.object-reuse.enabled` | 默认值变更 | 默认改为 `true` |
| `ae.memory.gc-friendly.enabled` | `ae.memory.gc-friendly.enabled` | 新增 | 3.0 新增 GC 友好数据结构 |
| `ae.scheduler.prediction.model` | `ae.scheduler.prediction.model` | 新增值 | 新增 `mlp` 选项 |
| `ae.sql.optimizer.cbo.join-reorder.algorithm` | `ae.sql.optimizer.cbo.join-reorder.algorithm` | 新增值 | 新增 `genetic` 选项 |
| `ae.security.authentication` | `ae.security.authentication` | 新增值 | 新增 `oauth2` 选项 |
| `ae.connector.clickhouse.*` | `ae.connector.clickhouse.*` | 新增 | 3.0 新增 ClickHouse 连接器 |
| `ae.connector.starrocks.*` | `ae.connector.starrocks.*` | 新增 | 3.0 新增 StarRocks 连接器 |

**版本升级检查清单：**

```markdown
## AE 版本升级检查清单

### 升级前
- [ ] 备份当前配置文件
- [ ] 备份所有 Savepoint
- [ ] 记录当前作业状态和并行度
- [ ] 确认所有 Connector 版本兼容性
- [ ] 在测试环境验证升级

### 升级中
- [ ] 停止所有运行中的作业（触发 Savepoint）
- [ ] 升级 JobManager
- [ ] 升级 TaskManager
- [ ] 运行配置迁移脚本
- [ ] 验证新版本启动成功

### 升级后
- [ ] 从 Savepoint 恢复作业
- [ ] 验证数据正确性
- [ ] 检查指标和监控正常
- [ ] 运行回归测试
- [ ] 更新文档和运维手册
```