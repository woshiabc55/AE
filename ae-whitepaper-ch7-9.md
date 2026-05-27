# 第7章：部署与运维方案（扩展版）

## 7.1 部署架构全景

### 7.1.1 架构概述

AE（Adaptive Engine）支持三种核心部署模式，分别面向不同规模和场景的需求。本节将深入解析每种部署模式的架构细节、适用场景、优劣势以及选型决策框架。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AE 部署架构全景图                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │  Standalone   │  │ Kubernetes   │  │  云托管模式   │                  │
│  │   单机模式    │  │  集群模式     │  │  Cloud Hosted │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                 │                  │                           │
│         ▼                 ▼                  ▼                           │
│  ┌──────────────────────────────────────────────────┐                  │
│  │              AE 核心引擎层                         │                  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐            │                  │
│  │  │SQL 解析  │ │优化器    │ │执行引擎  │            │                  │
│  │  └─────────┘ └─────────┘ └─────────┘            │                  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐            │                  │
│  │  │元数据    │ │调度器    │ │存储引擎  │            │                  │
│  │  └─────────┘ └─────────┘ └─────────┘            │                  │
│  └──────────────────────────────────────────────────┘                  │
│                                                                         │
│  ┌──────────────────────────────────────────────────┐                  │
│  │              基础设施适配层                         │                  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │                  │
│  │  │本地FS   │ │HDFS    │ │S3/OSS  │ │ADLS    │    │                  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘    │                  │
│  └──────────────────────────────────────────────────┘                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.1.2 Standalone 单机模式

#### 7.1.2.1 架构图

```
┌─────────────────────────────────────────────────────┐
│               Standalone 单机部署架构                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              单节点 JVM 进程                   │   │
│  │                                              │   │
│  │  ┌───────────────────────────────────────┐   │   │
│  │  │         AE Server (Main Process)       │   │   │
│  │  │                                       │   │   │
│  │  │  ┌─────────┐  ┌──────────────────┐   │   │   │
│  │  │  │ REST API │  │  JDBC/ODBC 端口   │   │   │   │
│  │  │  │ :8080    │  │  :9030           │   │   │   │
│  │  │  └─────────┘  └──────────────────┘   │   │   │
│  │  │                                       │   │   │
│  │  │  ┌─────────────────────────────────┐ │   │   │
│  │  │  │        SQL Engine               │ │   │   │
│  │  │  │  Parser → Optimizer → Executor  │ │   │   │
│  │  │  └─────────────────────────────────┘ │   │   │
│  │  │                                       │   │   │
│  │  │  ┌──────────┐  ┌──────────────────┐  │   │   │
│  │  │  │ Catalog  │  │  Local Storage   │  │   │   │
│  │  │  │ Manager  │  │  Engine          │  │   │   │
│  │  │  └──────────┘  └──────────────────┘  │   │   │
│  │  │                                       │   │   │
│  │  │  ┌──────────────────────────────────┐│   │   │
│  │  │  │  Embedded Metastore (Derby/H2)   ││   │   │
│  │  │  └──────────────────────────────────┘│   │   │
│  │  └───────────────────────────────────────┘   │   │
│  │                                              │   │
│  │  ┌───────────────────────────────────────┐   │   │
│  │  │       Worker Threads (可配置)          │   │   │
│  │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │   │   │
│  │  │  │ T1  │ │ T2  │ │ T3  │ │ T4  │    │   │   │
│  │  │  └─────┘ └─────┘ └─────┘ └─────┘    │   │   │
│  │  └───────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ 本地文件系统   │  │  外部数据源    │                │
│  │ /data/ae     │  │  (S3/HDFS)  │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 7.1.2.2 适用场景

| 场景 | 说明 | 推荐配置 |
|------|------|----------|
| 开发测试 | 本地开发和功能测试 | 4C8G 以上 |
| 数据探索 | 单人数据分析 | 8C16G 以上 |
| CI/CD 流水线 | 自动化测试 | 2C4G 以上 |
| 嵌入式部署 | 集成到应用内部 | 按应用分配 |
| 演示与培训 | 产品演示和培训 | 4C8G 以上 |

#### 7.1.2.3 快速启动

```bash
#!/bin/bash
# standalone-quickstart.sh
# AE Standalone 模式快速启动脚本

set -euo pipefail

AE_VERSION="2.0.0"
AE_HOME="/opt/ae"
AE_DATA_DIR="${AE_HOME}/data"
AE_LOG_DIR="${AE_HOME}/logs"
AE_CONF_DIR="${AE_HOME}/conf"

echo "========================================="
echo " AE Standalone 快速部署脚本 v${AE_VERSION}"
echo "========================================="

check_java() {
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
        if [ "$JAVA_VERSION" -ge 17 ]; then
            echo "✓ Java ${JAVA_VERSION} 已安装"
            return 0
        else
            echo "✗ 需要 Java 17+，当前版本: ${JAVA_VERSION}"
            return 1
        fi
    else
        echo "✗ 未检测到 Java 环境"
        return 1
    fi
}

check_resources() {
    local total_mem=$(free -g | awk '/^Mem:/{print $2}')
    local total_cpu=$(nproc)
    local total_disk=$(df -BG / | awk 'NR==2{print $4}' | tr -d 'G')

    echo "系统资源检查:"
    echo "  CPU: ${total_cpu} 核"
    echo "  内存: ${total_mem} GB"
    echo "  磁盘: ${total_disk} GB 可用"

    if [ "$total_mem" -lt 4 ]; then
        echo "⚠ 内存不足 4GB，可能影响性能"
    fi
    if [ "$total_cpu" -lt 2 ]; then
        echo "⚠ CPU 不足 2 核，可能影响性能"
    fi
}

install_ae() {
    if [ -d "${AE_HOME}" ]; then
        echo "AE 已安装在 ${AE_HOME}"
        return 0
    fi

    echo "正在下载 AE ${AE_VERSION}..."
    local download_url="https://releases.ae-project.org/${AE_VERSION}/ae-${AE_VERSION}-bin.tar.gz"
    local tmp_dir=$(mktemp -d)

    curl -fSL -o "${tmp_dir}/ae.tar.gz" "${download_url}" || {
        echo "下载失败，请检查网络连接"
        exit 1
    }

    echo "正在解压安装..."
    mkdir -p "${AE_HOME}"
    tar -xzf "${tmp_dir}/ae.tar.gz" -C "${AE_HOME}" --strip-components=1
    rm -rf "${tmp_dir}"

    mkdir -p "${AE_DATA_DIR}" "${AE_LOG_DIR}" "${AE_CONF_DIR}"
    echo "✓ AE 安装完成: ${AE_HOME}"
}

generate_config() {
    local total_mem=$(free -m | awk '/^Mem:/{print $2}')
    local heap_size=$((total_mem * 70 / 100))

    cat > "${AE_CONF_DIR}/ae-server.yaml" << EOF
server:
  bind_address: 0.0.0.0
  http_port: 8080
  jdbc_port: 9030
  admin_port: 8081

engine:
  worker_threads: $(nproc)
  query_timeout: 300s
  max_concurrent_queries: 50

memory:
  heap_size: ${heap_size}m
  off_heap_ratio: 0.3
  spill_enabled: true
  spill_dir: ${AE_DATA_DIR}/spill

storage:
  data_dir: ${AE_DATA_DIR}
  cache_size: $((total_mem * 20 / 100))m
  cache_dir: ${AE_DATA_DIR}/cache

metastore:
  type: embedded
  db_path: ${AE_DATA_DIR}/metastore

log:
  level: INFO
  dir: ${AE_LOG_DIR}
  max_file_size: 256MB
  max_files: 10
EOF

    echo "✓ 配置文件已生成: ${AE_CONF_DIR}/ae-server.yaml"
}

start_ae() {
    echo "正在启动 AE Server..."
    ${AE_HOME}/bin/ae-server start \
        --config "${AE_CONF_DIR}/ae-server.yaml" \
        --daemon

    echo "等待服务就绪..."
    local retry=0
    while [ $retry -lt 30 ]; do
        if curl -s http://localhost:8080/api/v1/health | grep -q "healthy"; then
            echo "✓ AE Server 已启动"
            echo "  REST API: http://localhost:8080"
            echo "  JDBC:     jdbc:ae://localhost:9030"
            echo "  Admin:    http://localhost:8081"
            return 0
        fi
        retry=$((retry + 1))
        sleep 1
    done

    echo "✗ 服务启动超时，请检查日志: ${AE_LOG_DIR}/ae-server.log"
    return 1
}

main() {
    check_java
    check_resources
    install_ae
    generate_config
    start_ae
}

main "$@"
```

#### 7.1.2.4 进程管理

```bash
# 使用 systemd 管理 AE Standalone
cat > /etc/systemd/system/ae-server.service << 'EOF'
[Unit]
Description=AE Adaptive Engine Server
Documentation=https://docs.ae-project.org
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
User=ae
Group=ae
Environment="JAVA_HOME=/usr/lib/jvm/java-17"
Environment="AE_HOME=/opt/ae"
Environment="AE_CONF_DIR=/opt/ae/conf"
Environment="AE_LOG_DIR=/var/log/ae"
Environment="AE_PID_DIR=/var/run/ae"

ExecStart=/opt/ae/bin/ae-server start --config /opt/ae/conf/ae-server.yaml --daemon
ExecStop=/opt/ae/bin/ae-server stop
ExecReload=/bin/kill -HUP $MAINPID

PIDFile=/var/run/ae/ae-server.pid
LimitNOFILE=65536
LimitNPROC=4096
LimitCORE=infinity

Restart=on-failure
RestartSec=10
StartLimitIntervalSec=60
StartLimitBurst=3

TimeoutStartSec=120
TimeoutStopSec=60

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ae-server
systemctl start ae-server
```

#### 7.1.2.5 嵌入式模式

```java
package com.ae.embedded;

import com.ae.server.AEServer;
import com.ae.server.AEServerConfig;
import com.ae.client.AEClient;
import com.ae.client.ConnectionConfig;

public class AEEmbeddedExample {

    public static void main(String[] args) throws Exception {
        AEServerConfig config = AEServerConfig.builder()
            .httpPort(0)
            .jdbcPort(0)
            .workerThreads(4)
            .heapSizeMb(512)
            .dataDir("/tmp/ae-embedded")
            .metastoreType("embedded")
            .logLevel("WARN")
            .build();

        try (AEServer server = AEServer.create(config)) {
            server.start();

            int httpPort = server.getHttpPort();
            int jdbcPort = server.getJdbcPort();

            ConnectionConfig connConfig = ConnectionConfig.builder()
                .host("localhost")
                .port(jdbcPort)
                .build();

            try (AEClient client = AEClient.connect(connConfig)) {
                client.execute("CREATE SCHEMA IF NOT EXISTS demo");
                client.execute("CREATE TABLE demo.orders (id INT, amount DECIMAL(10,2), ts TIMESTAMP)");
                client.execute("INSERT INTO demo.orders VALUES (1, 99.99, CURRENT_TIMESTAMP)");

                var result = client.query("SELECT COUNT(*) FROM demo.orders");
                System.out.println("Row count: " + result.getLong(0));
            }
        }
    }
}
```

```xml
<dependency>
    <groupId>com.ae</groupId>
    <artifactId>ae-embedded</artifactId>
    <version>2.0.0</version>
    <scope>runtime</scope>
</dependency>
```

### 7.1.3 Kubernetes 集群模式

#### 7.1.3.1 架构图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Kubernetes 集群部署架构                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         Ingress / LoadBalancer                          │   │
│  │                    (Nginx Ingress / AWS ALB / GCP LB)                  │   │
│  └──────────────────────────────┬──────────────────────────────────────────┘   │
│                                 │                                              │
│  ┌──────────────────────────────▼──────────────────────────────────────────┐   │
│  │                      AE Coordinator Service                             │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │  StatefulSet: ae-coordinator                                     │  │   │
│  │  │  Replicas: 3 (HA)                                               │  │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │  │   │
│  │  │  │coord-0   │ │coord-1   │ │coord-2   │                        │  │   │
│  │  │  │(Leader)  │ │(Standby) │ │(Standby) │                        │  │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘                        │  │   │
│  │  │  Service: ae-coordinator (ClusterIP)                            │  │   │
│  │  │  PVC: coordinator-data (50Gi SSD)                               │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                 │                                              │
│  ┌──────────────────────────────▼──────────────────────────────────────────┐   │
│  │                        AE Worker Service                                │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │  Deployment: ae-worker (或使用 AEOperator 自动伸缩)               │  │   │
│  │  │  Replicas: 5-50 (HPA)                                          │  │   │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │  │   │
│  │  │  │worker│ │worker│ │worker│ │worker│ │worker│ ...               │  │   │
│  │  │  │  -0  │ │  -1  │ │  -2  │ │  -3  │ │  -4  │                 │  │   │
│  │  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                 │  │   │
│  │  │  Service: ae-worker (Headless)                                 │  │   │
│  │  │  PVC: worker-cache (100Gi NVMe)                                │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                 │                                              │
│  ┌──────────────────────────────▼──────────────────────────────────────────┐   │
│  │                       支撑服务层                                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │PostgreSQL│ │  MinIO   │ │ Redis    │ │Prometheus│ │ Grafana  │   │   │
│  │  │(元数据)   │ │(对象存储) │ │(缓存)    │ │(监控)    │ │(看板)    │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 7.1.3.2 组件交互图

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Client     │────────▶│  Coordinator │────────▶│   Worker     │
│  (JDBC/REST) │  SQL    │  (Leader)    │  Plan   │  (Executor)  │
└──────────────┘         └──────┬───────┘         └──────┬───────┘
                                │                        │
                    ┌───────────┼───────────┐           │
                    ▼           ▼           ▼           ▼
             ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
             │PostgreSQL│ │  Redis   │ │  MinIO   │ │  HDFS    │
             │(元数据)   │ │(会话缓存) │ │(数据存储) │ │(数据源)   │
             └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

#### 7.1.3.3 组件职责表

| 组件 | 职责 | 副本数 | 资源请求 | 资源限制 |
|------|------|--------|----------|----------|
| Coordinator | SQL解析、优化、调度、元数据管理 | 3 (HA) | 4C/8G | 8C/16G |
| Worker | 任务执行、数据扫描、Shuffle | 5-50 (HPA) | 4C/16G | 8C/32G |
| PostgreSQL | 持久化元数据存储 | 2 (主从) | 2C/4G | 4C/8G |
| Redis | 会话管理、查询缓存 | 3 (哨兵) | 1C/2G | 2C/4G |
| MinIO | 内部对象存储 | 4 (分布式) | 2C/8G | 4C/16G |

### 7.1.4 云托管模式

#### 7.1.4.1 架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        云托管部署架构                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     云厂商托管服务层                               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │
│  │  │  AWS     │ │  GCP     │ │  Azure   │ │  阿里云   │          │   │
│  │  │  EKS     │ │  GKE     │ │  AKS     │ │  ACK     │          │   │
│  │  │  RDS     │ │  CloudSQL│ │  SQL DB  │ │  RDS     │          │   │
│  │  │  S3      │ │  GCS     │ │  Blob    │ │  OSS     │          │   │
│  │  │  ElastiC.│ │  Memoryst│ │  Redis   │ │  Redis   │          │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     AE 托管控制平面                                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │
│  │  │ 集群管理  │ │ 自动伸缩  │ │ 监控告警  │ │ 备份恢复  │          │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │
│  │  │ 配置管理  │ │ 版本升级  │ │ 安全管理  │ │ 计量计费  │          │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     AE 数据平面                                   │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Coordinator Pool    │    Worker Pool (Auto-Scaling)     │  │   │
│  │  │  ┌─────┐ ┌─────┐    │    ┌─────┐ ┌─────┐ ┌─────┐      │  │   │
│  │  │  │ C1  │ │ C2  │    │    │ W1  │ │ W2  │ │ W3  │ ...  │  │   │
│  │  │  └─────┘ └─────┘    │    └─────┘ └─────┘ └─────┘      │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 7.1.4.2 云托管模式对比

| 特性 | AWS | GCP | Azure | 阿里云 | 华为云 |
|------|-----|-----|-------|--------|--------|
| 容器服务 | EKS | GKE | AKS | ACK | CCE |
| 关系数据库 | RDS PostgreSQL | Cloud SQL | Database for PostgreSQL | RDS PostgreSQL | RDS PostgreSQL |
| 对象存储 | S3 | GCS | Blob Storage | OSS | OBS |
| 缓存服务 | ElastiCache | Memorystore | Azure Cache for Redis | Redis | DCS |
| 负载均衡 | ALB/NLB | Cloud Load Balancing | Application Gateway | SLB | ELB |
| 密钥管理 | KMS | Cloud KMS | Key Vault | KMS | DEW |
| 监控服务 | CloudWatch | Cloud Monitoring | Azure Monitor | ARMS | AOM |
| IAM | IAM | IAM | Azure AD | RAM | IAM |
| VPC | VPC | VPC | VNet | VPC | VPC |
| 可用区 | 3+ AZ | 3+ Zone | 3+ AZ | 3+ Zone | 3+ AZ |

### 7.1.5 部署模式选型决策树

```
                    开始选型
                       │
                       ▼
              ┌─── 生产环境? ───┐
              │                 │
             否                 是
              │                 │
              ▼                 ▼
        ┌─ 开发/测试 ─┐   ┌─ 数据量级? ─┐
        │             │    │             │
     单人使用      团队使用  < 1TB      > 1TB
        │             │      │           │
        ▼             ▼      ▼           ▼
    Standalone    K8s单集群 Standalone  ┌─ 并发用户? ─┐
                                       │             │
                                    < 100         > 100
                                       │             │
                                       ▼             ▼
                                   K8s单集群    ┌─ 运维团队? ─┐
                                                │             │
                                             自有团队      无专职团队
                                                │             │
                                                ▼             ▼
                                          K8s多集群      云托管模式
```

## 7.2 系统要求与容量规划

### 7.2.1 硬件规格要求

#### 7.2.1.1 最低系统要求

| 组件 | CPU | 内存 | 磁盘 | 网络 |
|------|-----|------|------|------|
| Coordinator | 4 核 | 8 GB | 50 GB SSD | 1 Gbps |
| Worker | 4 核 | 16 GB | 100 GB SSD | 1 Gbps |
| PostgreSQL | 2 核 | 4 GB | 50 GB SSD | 1 Gbps |
| Redis | 1 核 | 2 GB | 10 GB SSD | 1 Gbps |

#### 7.2.1.2 推荐系统配置

| 组件 | CPU | 内存 | 磁盘 | 网络 |
|------|-----|------|------|------|
| Coordinator | 8 核 | 32 GB | 200 GB NVMe | 10 Gbps |
| Worker | 16 核 | 64 GB | 500 GB NVMe | 10 Gbps |
| PostgreSQL | 8 核 | 32 GB | 500 GB SSD | 10 Gbps |
| Redis | 4 核 | 16 GB | 50 GB SSD | 10 Gbps |

#### 7.2.1.3 CPU 架构支持

| 架构 | 状态 | 说明 |
|------|------|------|
| x86_64 (AMD64) | ✅ 完全支持 | 主要开发和测试平台 |
| ARM64 (AArch64) | ✅ 完全支持 | AWS Graviton / Apple Silicon |
| RISC-V | 🔧 实验性 | 社区支持，未经全面测试 |

### 7.2.2 软件环境要求

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| 操作系统 | CentOS 7 / Ubuntu 18.04 | Ubuntu 22.04 / Rocky 9 | Linux 内核 4.14+ |
| Java | 17 | 21 | 推荐 Eclipse Temurin |
| Docker | 20.10 | 24.0 | 容器运行时 |
| Kubernetes | 1.24 | 1.28 | 集群编排 |
| Helm | 3.8 | 3.13 | 包管理 |
| OpenSSL | 1.1.1 | 3.0 | TLS 支持 |

### 7.2.3 容量规划模型

#### 7.2.3.1 数据容量计算

```
总存储需求 = 原始数据量 × (1 + 压缩比倒数) × (1 + 副本数) × (1 + 临时空间比) × (1 + 增长率 × 保留月数)

其中:
- 压缩比: 列式存储通常 3:1 到 10:1，取决于数据类型和压缩算法
- 副本数: 生产环境建议 3 副本
- 临时空间比: Shuffle 和排序临时数据，通常 0.3-0.5
- 增长率: 月度数据增长率
- 保留月数: 数据保留周期
```

#### 7.2.3.2 计算资源计算

```
Worker 数量 = CEIL(峰值并发查询数 × 单查询平均CPU时间(s) / (目标响应时间(s) × 单Worker核数 × 并行度 × 利用率))

其中:
- 单查询平均CPU时间: 基准测试获得
- 目标响应时间: SLA 定义的 P99 响应时间
- 并行度: 单查询在单 Worker 上的并行线程数
- 利用率: 目标 CPU 利用率，通常 0.7-0.8
```

#### 7.2.3.3 内存需求计算

```
总内存需求 = (查询内存 + 缓存内存 + 系统内存) × 安全系数

查询内存 = 峰值并发查询数 × 单查询平均内存
缓存内存 = 热数据量 × 缓存命中率目标 / 压缩比
系统内存 = 总内存 × 0.2 (OS + JVM 开销)
安全系数 = 1.3
```

#### 7.2.3.4 各规模集群配置推荐

**小型集群（< 1TB 数据，< 20 并发）**

| 组件 | 数量 | 规格 | 存储 |
|------|------|------|------|
| Coordinator | 1 | 4C/16G | 100GB SSD |
| Worker | 3 | 8C/32G | 500GB SSD |
| PostgreSQL | 1 | 2C/8G | 100GB SSD |
| Redis | 1 | 1C/4G | 20GB SSD |

**中型集群（1-10TB 数据，20-100 并发）**

| 组件 | 数量 | 规格 | 存储 |
|------|------|------|------|
| Coordinator | 3 | 8C/32G | 200GB NVMe |
| Worker | 10 | 16C/64G | 1TB NVMe |
| PostgreSQL | 2 (主从) | 4C/16G | 500GB SSD |
| Redis | 3 (哨兵) | 2C/8G | 50GB SSD |

**大型集群（10-100TB 数据，100-500 并发）**

| 组件 | 数量 | 规格 | 存储 |
|------|------|------|------|
| Coordinator | 3 | 16C/64G | 500GB NVMe |
| Worker | 30 | 32C/128G | 2TB NVMe |
| PostgreSQL | 3 (MGR) | 8C/32G | 1TB SSD |
| Redis | 5 (集群) | 4C/16G | 100GB SSD |

**超大型集群（> 100TB 数据，> 500 并发）**

| 组件 | 数量 | 规格 | 存储 |
|------|------|------|------|
| Coordinator | 5 | 32C/128G | 1TB NVMe |
| Worker | 100+ | 64C/256G | 4TB NVMe |
| PostgreSQL | 5 (MGR) | 16C/64G | 2TB SSD |
| Redis | 9 (集群) | 8C/32G | 200GB SSD |

### 7.2.4 网络要求

| 场景 | 带宽要求 | 延迟要求 | 说明 |
|------|----------|----------|------|
| Coordinator ↔ Worker | 10 Gbps | < 1ms | 同可用区部署 |
| Worker ↔ Worker (Shuffle) | 25 Gbps | < 1ms | 同可用区部署 |
| Worker ↔ 存储 | 10 Gbps | < 5ms | 存储网络分离 |
| Client ↔ Coordinator | 1 Gbps | < 50ms | 公网或VPN |
| 跨可用区 | 10 Gbps | < 5ms | 同区域不同AZ |

## 7.3 Docker 容器化部署

### 7.3.1 Dockerfile 详解

#### 7.3.1.1 多阶段构建 Dockerfile

```dockerfile
# ============================================================
# Stage 1: 构建阶段
# ============================================================
FROM eclipse-temurin:21-jdk AS builder

ARG AE_VERSION=2.0.0
ARG BUILD_DATE
ARG GIT_SHA

WORKDIR /build

COPY gradle/ gradle/
COPY gradlew build.gradle settings.gradle ./
RUN ./gradlew dependencies --no-daemon || true

COPY src/ src/
RUN ./gradlew distTar --no-daemon -Pversion=${AE_VERSION} \
    && tar -xzf build/distributions/ae-${AE_VERSION}.tar.gz \
    && mv ae-${AE_VERSION} /opt/ae

# ============================================================
# Stage 2: 运行时阶段
# ============================================================
FROM eclipse-temurin:21-jre AS runtime

ARG AE_VERSION=2.0.0
ARG BUILD_DATE
ARG GIT_SHA

LABEL maintainer="AE Team <team@ae-project.org>" \
      org.opencontainers.image.title="AE Adaptive Engine" \
      org.opencontainers.image.version="${AE_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.description="Adaptive Engine - High-Performance Data Analytics Platform"

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        tini \
        libsnappy1v5 \
        libzstd1 \
        liblz4-1 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r ae \
    && useradd -r -g ae -d /opt/ae -s /sbin/nologin ae

COPY --from=builder /opt/ae /opt/ae

RUN mkdir -p /opt/ae/data /opt/ae/logs /opt/ae/conf \
    && chown -R ae:ae /opt/ae

ENV AE_HOME=/opt/ae \
    AE_CONF_DIR=/opt/ae/conf \
    AE_DATA_DIR=/opt/ae/data \
    AE_LOG_DIR=/opt/ae/logs \
    JAVA_HOME=/opt/java/openjdk \
    PATH="/opt/ae/bin:${PATH}"

USER ae

EXPOSE 8080 9030 8081

VOLUME ["/opt/ae/data", "/opt/ae/logs", "/opt/ae/conf"]

ENTRYPOINT ["tini", "--", "/opt/ae/bin/ae-server"]

CMD ["run", "--config", "/opt/ae/conf/ae-server.yaml"]
```

#### 7.3.1.2 镜像优化技巧

```dockerfile
# 优化1: 使用 JLink 创建精简 JRE
FROM eclipse-temurin:21-jdk AS jre-builder
RUN jlink \
    --add-modules java.base,java.compiler,java.desktop,java.instrument,java.management,java.naming,java.net.http,java.security.jgss,java.security.sasl,java.sql,java.sql.rowset,java.transaction.xa,jdk.crypto.ec,jdk.management,jdk.unsupported \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /opt/jre

# 优化2: 使用 Distroless 基础镜像
FROM gcr.io/distroless/java21-debian12 AS distroless-runtime
COPY --from=builder /opt/ae /opt/ae
COPY --from=jre-builder /opt/jre /opt/jre
ENTRYPOINT ["/opt/jre/bin/java", "-jar", "/opt/ae/lib/ae-server.jar"]

# 优化3: 使用 GraalVM Native Image (实验性)
FROM ghcr.io/graalvm/native-image-community:21 AS native-builder
COPY --from=builder /opt/ae /opt/ae
WORKDIR /opt/ae
RUN native-image \
    --no-fallback \
    --initialize-at-build-time \
    -H:+ReportExceptionStackTraces \
    -jar lib/ae-server.jar \
    -o bin/ae-server-native

FROM debian:bookworm-slim AS native-runtime
COPY --from=native-builder /opt/ae/bin/ae-server-native /opt/ae/bin/ae-server
ENTRYPOINT ["/opt/ae/bin/ae-server"]
```

### 7.3.2 Docker Compose 完整配置

```yaml
# docker-compose.yml - AE 完整开发/测试环境
version: '3.8'

x-common-env: &common-env
  AE_COORDINATOR_HOSTS: coordinator-1,coordinator-2,coordinator-3
  AE_METASTORE_URI: jdbc:postgresql://metastore:5432/ae_metastore
  AE_METASTORE_USER: ae
  AE_METASTORE_PASSWORD: ${METASTORE_PASSWORD:-ae_password}
  AE_REDIS_URI: redis://redis:6379/0
  AE_STORAGE_TYPE: minio
  AE_STORAGE_ENDPOINT: http://minio:9000
  AE_STORAGE_ACCESS_KEY: ${MINIO_ACCESS_KEY:-minioadmin}
  AE_STORAGE_SECRET_KEY: ${MINIO_SECRET_KEY:-minioadmin}
  AE_STORAGE_BUCKET: ae-data
  JAVA_OPTS: >-
    -XX:+UseG1GC
    -XX:MaxGCPauseMillis=200
    -XX:+HeapDumpOnOutOfMemoryError
    -XX:HeapDumpPath=/opt/ae/logs/

services:
  coordinator-1:
    image: ae-project/ae-server:${AE_VERSION:-2.0.0}
    hostname: coordinator-1
    environment:
      <<: *common-env
      AE_NODE_ROLE: coordinator
      AE_NODE_ID: coordinator-1
      AE_HTTP_PORT: 8080
      AE_JDBC_PORT: 9030
      AE_ADMIN_PORT: 8081
      JAVA_OPTS: >-
        -Xms4g -Xmx4g
        -XX:+UseG1GC
        -XX:MaxGCPauseMillis=200
    ports:
      - "8080:8080"
      - "9030:9030"
      - "8081:8081"
    volumes:
      - coordinator-1-data:/opt/ae/data
      - coordinator-1-logs:/opt/ae/logs
      - ./conf/coordinator.yaml:/opt/ae/conf/ae-server.yaml:ro
    depends_on:
      metastore:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G
    networks:
      - ae-network

  coordinator-2:
    image: ae-project/ae-server:${AE_VERSION:-2.0.0}
    hostname: coordinator-2
    environment:
      <<: *common-env
      AE_NODE_ROLE: coordinator
      AE_NODE_ID: coordinator-2
      JAVA_OPTS: >-
        -Xms4g -Xmx4g
        -XX:+UseG1GC
        -XX:MaxGCPauseMillis=200
    volumes:
      - coordinator-2-data:/opt/ae/data
      - coordinator-2-logs:/opt/ae/logs
      - ./conf/coordinator.yaml:/opt/ae/conf/ae-server.yaml:ro
    depends_on:
      metastore:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G
    networks:
      - ae-network

  coordinator-3:
    image: ae-project/ae-server:${AE_VERSION:-2.0.0}
    hostname: coordinator-3
    environment:
      <<: *common-env
      AE_NODE_ROLE: coordinator
      AE_NODE_ID: coordinator-3
      JAVA_OPTS: >-
        -Xms4g -Xmx4g
        -XX:+UseG1GC
        -XX:MaxGCPauseMillis=200
    volumes:
      - coordinator-3-data:/opt/ae/data
      - coordinator-3-logs:/opt/ae/logs
      - ./conf/coordinator.yaml:/opt/ae/conf/ae-server.yaml:ro
    depends_on:
      metastore:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G
    networks:
      - ae-network

  worker:
    image: ae-project/ae-server:${AE_VERSION:-2.0.0}
    environment:
      <<: *common-env
      AE_NODE_ROLE: worker
      AE_WORKER_CORES: 4
      AE_WORKER_MEMORY: 12g
      AE_SPILL_DIR: /opt/ae/data/spill
      JAVA_OPTS: >-
        -Xms8g -Xmx8g
        -XX:+UseG1GC
        -XX:MaxGCPauseMillis=100
    volumes:
      - worker-data:/opt/ae/data
      - worker-logs:/opt/ae/logs
      - ./conf/worker.yaml:/opt/ae/conf/ae-server.yaml:ro
    depends_on:
      coordinator-1:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    deploy:
      mode: replicated
      replicas: 3
      resources:
        limits:
          cpus: '4'
          memory: 16G
        reservations:
          cpus: '2'
          memory: 8G
    networks:
      - ae-network

  metastore:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ae_metastore
      POSTGRES_USER: ae
      POSTGRES_PASSWORD: ${METASTORE_PASSWORD:-ae_password}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - metastore-data:/var/lib/postgresql/data
      - ./sql/init-metastore.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ae -d ae_metastore"]
      interval: 5s
      timeout: 3s
      retries: 10
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
    networks:
      - ae-network

  redis:
    image: redis:7-alpine
    command: >
      redis-server
      --maxmemory 1gb
      --maxmemory-policy allkeys-lru
      --appendonly yes
      --appendfsync everysec
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 2G
    networks:
      - ae-network

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
    volumes:
      - minio-data:/data
    ports:
      - "9001:9001"
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
    networks:
      - ae-network

  prometheus:
    image: prom/prometheus:v2.48.0
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - ae-network

  grafana:
    image: grafana/grafana:10.2.0
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin}
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources:ro
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - ae-network

volumes:
  coordinator-1-data:
  coordinator-2-data:
  coordinator-3-data:
  coordinator-1-logs:
  coordinator-2-logs:
  coordinator-3-logs:
  worker-data:
  worker-logs:
  metastore-data:
  redis-data:
  minio-data:
  prometheus-data:
  grafana-data:

networks:
  ae-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### 7.3.3 镜像安全与扫描

```yaml
# .github/workflows/container-scan.yml
name: Container Security Scan

on:
  push:
    paths:
      - 'Dockerfile'
      - 'docker-compose.yml'

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Image
        run: docker build -t ae-server:scan .

      - name: Trivy Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'ae-server:scan'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

      - name: Dockle Lint
        uses: erzz/dockle-action@v1
        with:
          image: ae-server:scan
          exit-code: 1
          failure-threshold: WARN
```

## 7.4 Kubernetes 生产部署

### 7.4.1 Namespace 与基础资源

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ae-system
  labels:
    app.kubernetes.io/name: ae
    app.kubernetes.io/part-of: adaptive-engine
    app.kubernetes.io/managed-by: helm
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ae-coordinator
  namespace: ae-system
  labels:
    app.kubernetes.io/name: ae-coordinator
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ae-worker
  namespace: ae-system
  labels:
    app.kubernetes.io/name: ae-worker
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: ae-coordinator-role
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "endpoints", "configmaps", "secrets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "statefulsets", "replicasets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["ae.ae-project.org"]
    resources: ["aeclusters", "aeworkers"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: ae-coordinator-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: ae-coordinator-role
subjects:
  - kind: ServiceAccount
    name: ae-coordinator
    namespace: ae-system
```

### 7.4.2 Coordinator StatefulSet

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ae-coordinator
  namespace: ae-system
  labels:
    app.kubernetes.io/name: ae-coordinator
    app.kubernetes.io/component: coordinator
    app.kubernetes.io/part-of: adaptive-engine
spec:
  serviceName: ae-coordinator-headless
  replicas: 3
  podManagementPolicy: Parallel
  selector:
    matchLabels:
      app.kubernetes.io/name: ae-coordinator
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 0
  template:
    metadata:
      labels:
        app.kubernetes.io/name: ae-coordinator
        app.kubernetes.io/component: coordinator
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: ae-coordinator
      terminationGracePeriodSeconds: 120
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app.kubernetes.io/name: ae-coordinator
                topologyKey: topology.kubernetes.io/zone
            - weight: 50
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app.kubernetes.io/name: ae-coordinator
                topologyKey: kubernetes.io/hostname
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: ae-coordinator
      initContainers:
        - name: wait-for-metastore
          image: busybox:1.36
          command: ['sh', '-c', 'until nc -z ${AE_METASTORE_HOST} 5432; do echo waiting for metastore; sleep 2; done']
          env:
            - name: AE_METASTORE_HOST
              valueFrom:
                configMapKeyRef:
                  name: ae-config
                  key: METASTORE_HOST
        - name: wait-for-redis
          image: busybox:1.36
          command: ['sh', '-c', 'until nc -z ${AE_REDIS_HOST} 6379; do echo waiting for redis; sleep 2; done']
          env:
            - name: AE_REDIS_HOST
              valueFrom:
                configMapKeyRef:
                  name: ae-config
                  key: REDIS_HOST
      containers:
        - name: ae-coordinator
          image: ae-project/ae-server:2.0.0
          imagePullPolicy: IfNotPresent
          command:
            - /opt/ae/bin/ae-server
            - run
            - --config
            - /opt/ae/conf/ae-server.yaml
          env:
            - name: AE_NODE_ROLE
              value: "coordinator"
            - name: AE_NODE_ID
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: AE_POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: AE_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: JAVA_OPTS
              value: >-
                -Xms4g -Xmx4g
                -XX:+UseG1GC
                -XX:MaxGCPauseMillis=200
                -XX:+HeapDumpOnOutOfMemoryError
                -XX:HeapDumpPath=/opt/ae/logs/
                -XX:+PrintGCDetails
                -XX:+PrintGCDateStamps
                -Xlog:gc*:file=/opt/ae/logs/gc.log:time,uptime,level,tags
          envFrom:
            - configMapRef:
                name: ae-config
            - secretRef:
                name: ae-secrets
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
            - name: jdbc
              containerPort: 9030
              protocol: TCP
            - name: admin
              containerPort: 8081
              protocol: TCP
            - name: metrics
              containerPort: 9090
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: http
            initialDelaySeconds: 60
            periodSeconds: 15
            timeoutSeconds: 5
            failureThreshold: 5
          readinessProbe:
            httpGet:
              path: /api/v1/health/ready
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /api/v1/health/started
              port: http
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 30
          resources:
            requests:
              cpu: "2"
              memory: "8Gi"
            limits:
              cpu: "4"
              memory: "8Gi"
          volumeMounts:
            - name: config
              mountPath: /opt/ae/conf
              readOnly: true
            - name: data
              mountPath: /opt/ae/data
            - name: logs
              mountPath: /opt/ae/logs
            - name: tls
              mountPath: /opt/ae/tls
              readOnly: true
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "curl -X POST http://localhost:8080/api/v1/shutdown/graceful"]
      volumes:
        - name: config
          configMap:
            name: ae-coordinator-config
        - name: logs
          emptyDir: {}
        - name: tls
          secret:
            secretName: ae-tls
            optional: true
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: ssd-storage
        resources:
          requests:
            storage: 50Gi
```

### 7.4.3 Worker Deployment with HPA

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ae-worker
  namespace: ae-system
  labels:
    app.kubernetes.io/name: ae-worker
    app.kubernetes.io/component: worker
spec:
  replicas: 5
  selector:
    matchLabels:
      app.kubernetes.io/name: ae-worker
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 3
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app.kubernetes.io/name: ae-worker
        app.kubernetes.io/component: worker
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: ae-worker
      terminationGracePeriodSeconds: 180
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: ae-worker
      containers:
        - name: ae-worker
          image: ae-project/ae-server:2.0.0
          command:
            - /opt/ae/bin/ae-server
            - run
            - --config
            - /opt/ae/conf/ae-server.yaml
          env:
            - name: AE_NODE_ROLE
              value: "worker"
            - name: AE_NODE_ID
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: AE_WORKER_CORES
              valueFrom:
                resourceFieldRef:
                  resource: limits.cpu
            - name: AE_WORKER_MEMORY
              valueFrom:
                resourceFieldRef:
                  resource: limits.memory
            - name: JAVA_OPTS
              value: >-
                -Xms8g -Xmx8g
                -XX:+UseG1GC
                -XX:MaxGCPauseMillis=100
                -XX:G1HeapRegionSize=16m
                -XX:+HeapDumpOnOutOfMemoryError
                -XX:HeapDumpPath=/opt/ae/logs/
          envFrom:
            - configMapRef:
                name: ae-config
            - secretRef:
                name: ae-secrets
          ports:
            - name: http
              containerPort: 8080
            - name: metrics
              containerPort: 9090
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: http
            initialDelaySeconds: 60
            periodSeconds: 15
            timeoutSeconds: 5
            failureThreshold: 5
          readinessProbe:
            httpGet:
              path: /api/v1/health/ready
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          resources:
            requests:
              cpu: "4"
              memory: "16Gi"
            limits:
              cpu: "8"
              memory: "16Gi"
          volumeMounts:
            - name: config
              mountPath: /opt/ae/conf
              readOnly: true
            - name: cache
              mountPath: /opt/ae/data/cache
            - name: spill
              mountPath: /opt/ae/data/spill
            - name: logs
              mountPath: /opt/ae/logs
      volumes:
        - name: config
          configMap:
            name: ae-worker-config
        - name: logs
          emptyDir: {}
        - name: spill
          emptyDir:
            medium: ""
            sizeLimit: 50Gi
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ae-worker-hpa
  namespace: ae-system
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ae-worker
  minReplicas: 5
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
    - type: Pods
      pods:
        metric:
          name: ae_active_queries
        target:
          type: AverageValue
          averageValue: "10"
    - type: External
      external:
        metric:
          name: ae_query_queue_size
          selector:
            matchLabels:
              app: ae-worker
        target:
          type: AverageValue
          averageValue: "5"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Pods
          value: 3
          periodSeconds: 60
        - type: Percent
          value: 50
          periodSeconds: 60
      selectPolicy: Max
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 120
        - type: Percent
          value: 10
          periodSeconds: 120
      selectPolicy: Min
```

### 7.4.4 ConfigMap 与 Secret

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ae-config
  namespace: ae-system
data:
  AE_CLUSTER_NAME: "production"
  AE_COORDINATOR_HOSTS: "ae-coordinator-0.ae-coordinator-headless:9030,ae-coordinator-1.ae-coordinator-headless:9030,ae-coordinator-2.ae-coordinator-headless:9030"
  METASTORE_HOST: "ae-metastore"
  METASTORE_PORT: "5432"
  METASTORE_DB: "ae_metastore"
  REDIS_HOST: "ae-redis"
  REDIS_PORT: "6379"
  STORAGE_TYPE: "s3"
  STORAGE_ENDPOINT: "https://s3.amazonaws.com"
  STORAGE_BUCKET: "ae-production-data"
  STORAGE_REGION: "us-east-1"
  LOG_LEVEL: "INFO"
  LOG_FORMAT: "json"
---
apiVersion: v1
kind: Secret
metadata:
  name: ae-secrets
  namespace: ae-system
type: Opaque
stringData:
  METASTORE_USER: "ae"
  METASTORE_PASSWORD: "CHANGE_ME_IN_PRODUCTION"
  REDIS_PASSWORD: "CHANGE_ME_IN_PRODUCTION"
  STORAGE_ACCESS_KEY: "CHANGE_ME_IN_PRODUCTION"
  STORAGE_SECRET_KEY: "CHANGE_ME_IN_PRODUCTION"
  TLS_KEYSTORE_PASSWORD: "CHANGE_ME_IN_PRODUCTION"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ae-coordinator-config
  namespace: ae-system
data:
  ae-server.yaml: |
    server:
      bind_address: "0.0.0.0"
      http_port: 8080
      jdbc_port: 9030
      admin_port: 8081
      tls:
        enabled: false

    coordinator:
      ha:
        enabled: true
        raft_port: 9230
        election_timeout: 5s
        heartbeat_interval: 1s
      scheduling:
        strategy: adaptive
        locality_aware: true
        speculative_execution: true

    metastore:
      type: postgresql
      uri: "jdbc:postgresql://${METASTORE_HOST}:${METASTORE_PORT}/${METASTORE_DB}"
      user: "${METASTORE_USER}"
      password: "${METASTORE_PASSWORD}"
      pool_size: 20
      connection_timeout: 30s

    cache:
      type: redis
      uri: "redis://${REDIS_HOST}:${REDIS_PORT}"
      password: "${REDIS_PASSWORD}"
      ttl: 3600s

    storage:
      type: ${STORAGE_TYPE}
      endpoint: "${STORAGE_ENDPOINT}"
      bucket: "${STORAGE_BUCKET}"
      region: "${STORAGE_REGION}"
      access_key: "${STORAGE_ACCESS_KEY}"
      secret_key: "${STORAGE_SECRET_KEY}"

    log:
      level: ${LOG_LEVEL}
      format: ${LOG_FORMAT}
      dir: /opt/ae/logs
```

### 7.4.5 Service 与 Ingress

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ae-coordinator-headless
  namespace: ae-system
  labels:
    app.kubernetes.io/name: ae-coordinator
spec:
  type: ClusterIP
  clusterIP: None
  selector:
    app.kubernetes.io/name: ae-coordinator
  ports:
    - name: http
      port: 8080
      targetPort: http
    - name: jdbc
      port: 9030
      targetPort: jdbc
    - name: raft
      port: 9230
      targetPort: 9230
---
apiVersion: v1
kind: Service
metadata:
  name: ae-coordinator
  namespace: ae-system
  labels:
    app.kubernetes.io/name: ae-coordinator
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: ae-coordinator
  ports:
    - name: http
      port: 8080
      targetPort: http
    - name: jdbc
      port: 9030
      targetPort: jdbc
    - name: admin
      port: 8081
      targetPort: admin
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ae-ingress
  namespace: ae-system
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - ae.example.com
      secretName: ae-tls-cert
  rules:
    - host: ae.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: ae-coordinator
                port:
                  number: 8080
          - path: /ui
            pathType: Prefix
            backend:
              service:
                name: ae-coordinator
                port:
                  number: 8080
```

### 7.4.6 Helm Chart

#### 7.4.6.1 Chart.yaml

```yaml
apiVersion: v2
name: ae
description: AE Adaptive Engine - High-Performance Data Analytics Platform
type: application
version: 2.0.0
appVersion: "2.0.0"
kubeVersion: ">=1.24.0-0"
home: https://ae-project.org
icon: https://ae-project.org/logo.svg
keywords:
  - analytics
  - sql
  - data-engine
  - adaptive
maintainers:
  - name: AE Team
    email: team@ae-project.org
    url: https://ae-project.org
sources:
  - https://github.com/ae-project/ae
dependencies:
  - name: postgresql
    version: "15.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
  - name: redis
    version: "18.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled
  - name: minio
    version: "14.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: minio.enabled
```

#### 7.4.6.2 values.yaml

```yaml
global:
  imageRegistry: ""
  imagePullSecrets: []
  storageClass: ""

image:
  registry: docker.io
  repository: ae-project/ae-server
  tag: "2.0.0"
  pullPolicy: IfNotPresent
  digest: ""

nameOverride: ""
fullnameOverride: ""

cluster:
  name: ae-cluster

coordinator:
  replicas: 3
  resources:
    requests:
      cpu: "2"
      memory: "8Gi"
    limits:
      cpu: "4"
      memory: "8Gi"
  heapSize: "4g"
  persistence:
    enabled: true
    storageClass: "ssd-storage"
    size: 50Gi
  service:
    type: ClusterIP
    httpPort: 8080
    jdbcPort: 9030
    adminPort: 8081
  ingress:
    enabled: true
    className: nginx
    hostname: ae.example.com
    tls: true
    tlsSecret: ae-tls-cert
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
  affinity:
    podAntiAffinity: hard
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: topology.kubernetes.io/zone
  nodeSelector: {}
  tolerations: []
  extraEnv: []
  extraVolumes: []
  extraVolumeMounts: []

worker:
  replicas: 5
  autoscaling:
    enabled: true
    minReplicas: 5
    maxReplicas: 50
    targetCPUUtilization: 70
    targetMemoryUtilization: 80
  resources:
    requests:
      cpu: "4"
      memory: "16Gi"
    limits:
      cpu: "8"
      memory: "16Gi"
  heapSize: "8g"
  spill:
    enabled: true
    sizeLimit: 50Gi
  cache:
    enabled: true
    sizeLimit: 10Gi
  persistence:
    enabled: false
  service:
    type: ClusterIP
  affinity:
    podAntiAffinity: soft
  nodeSelector: {}
  tolerations: []
  extraEnv: []

metastore:
  type: postgresql
  external:
    enabled: false
    host: ""
    port: 5432
    database: ae_metastore
    user: ""
    password: ""
    existingSecret: ""
  poolSize: 20

redis:
  enabled: true
  auth:
    enabled: true
    password: ""
  master:
    persistence:
      enabled: true
      size: 5Gi
  replica:
    replicaCount: 2
    persistence:
      enabled: true
      size: 5Gi

postgresql:
  enabled: true
  auth:
    postgresPassword: ""
    username: ae
    password: ""
    database: ae_metastore
  primary:
    persistence:
      enabled: true
      size: 50Gi
      storageClass: "ssd-storage"
  readReplicas:
    replicaCount: 1

minio:
  enabled: true
  mode: distributed
  auth:
    rootUser: ""
    rootPassword: ""
  persistence:
    enabled: true
    size: 200Gi

storage:
  type: s3
  s3:
    endpoint: ""
    bucket: ""
    region: ""
    accessKey: ""
    secretKey: ""
    existingSecret: ""

monitoring:
  enabled: true
  prometheus:
    enabled: true
  grafana:
    enabled: true
    adminPassword: "admin"
  serviceMonitor:
    enabled: true
    interval: 15s
  alertmanager:
    enabled: true

log:
  level: INFO
  format: json

security:
  tls:
    enabled: false
    certSecret: ""
  authentication:
    enabled: false
    type: password
  authorization:
    enabled: false
```

### 7.4.7 AE Operator 与 CRD

#### 7.4.7.1 CRD 定义

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: aeclusters.ae.ae-project.org
spec:
  group: ae.ae-project.org
  scope: Namespaced
  names:
    kind: AECluster
    listKind: AEClusterList
    plural: aeclusters
    singular: aecluster
    shortNames:
      - aec
  versions:
    - name: v1alpha1
      served: true
      storage: true
      subresources:
        status: {}
        scale:
          specReplicasPath: .spec.worker.replicas
          statusReplicasPath: .status.workerReplicas
      additionalPrinterColumns:
        - name: Coordinators
          type: integer
          jsonPath: .spec.coordinator.replicas
        - name: Workers
          type: integer
          jsonPath: .spec.worker.replicas
        - name: Status
          type: string
          jsonPath: .status.phase
        - name: Version
          type: string
          jsonPath: .spec.version
        - name: Age
          type: date
          jsonPath: .metadata.creationTimestamp
      schema:
        openAPIV3Schema:
          type: object
          required:
            - spec
          properties:
            spec:
              type: object
              required:
                - version
              properties:
                version:
                  type: string
                  description: "AE version to deploy"
                coordinator:
                  type: object
                  properties:
                    replicas:
                      type: integer
                      minimum: 1
                      maximum: 9
                      default: 3
                    resources:
                      type: object
                      properties:
                        requests:
                          type: object
                          properties:
                            cpu:
                              type: string
                            memory:
                              type: string
                        limits:
                          type: object
                          properties:
                            cpu:
                              type: string
                            memory:
                              type: string
                    storage:
                      type: object
                      properties:
                        size:
                          type: string
                        storageClass:
                          type: string
                    config:
                      type: object
                      x-kubernetes-preserve-unknown-fields: true
                worker:
                  type: object
                  properties:
                    replicas:
                      type: integer
                      minimum: 1
                      maximum: 1000
                      default: 5
                    autoscaling:
                      type: object
                      properties:
                        enabled:
                          type: boolean
                          default: false
                        minReplicas:
                          type: integer
                          default: 1
                        maxReplicas:
                          type: integer
                          default: 100
                        targetCPUUtilization:
                          type: integer
                          default: 70
                    resources:
                      type: object
                      properties:
                        requests:
                          type: object
                          properties:
                            cpu:
                              type: string
                            memory:
                              type: string
                        limits:
                          type: object
                          properties:
                            cpu:
                              type: string
                            memory:
                              type: string
                    storage:
                      type: object
                      properties:
                        cacheSize:
                          type: string
                        spillSize:
                          type: string
                metastore:
                  type: object
                  properties:
                    type:
                      type: string
                      enum: [postgresql, mysql]
                      default: postgresql
                    external:
                      type: object
                      properties:
                        enabled:
                          type: boolean
                          default: false
                        host:
                          type: string
                        port:
                          type: integer
                        database:
                          type: string
                        credentialsSecret:
                          type: string
                storage:
                  type: object
                  properties:
                    type:
                      type: string
                      enum: [s3, gcs, azure, oss, minio]
                      default: s3
                    config:
                      type: object
                      x-kubernetes-preserve-unknown-fields: true
                monitoring:
                  type: object
                  properties:
                    enabled:
                      type: boolean
                      default: true
            status:
              type: object
              properties:
                phase:
                  type: string
                  enum: [Pending, Creating, Running, Updating, Degraded, Failed]
                version:
                  type: string
                coordinatorReplicas:
                  type: integer
                workerReplicas:
                  type: integer
                readyReplicas:
                  type: integer
                conditions:
                  type: array
                  items:
                    type: object
                    properties:
                      type:
                        type: string
                      status:
                        type: string
                      lastTransitionTime:
                        type: string
                        format: date-time
                      reason:
                        type: string
                      message:
                        type: string
```

#### 7.4.7.2 AECluster 示例

```yaml
apiVersion: ae.ae-project.org/v1alpha1
kind: AECluster
metadata:
  name: ae-production
  namespace: ae-system
spec:
  version: "2.0.0"
  coordinator:
    replicas: 3
    resources:
      requests:
        cpu: "4"
        memory: "16Gi"
      limits:
        cpu: "8"
        memory: "16Gi"
    storage:
      size: 100Gi
      storageClass: ssd-storage
    config:
      scheduling:
        strategy: adaptive
        locality_aware: true
      query:
        timeout: 600s
        maxConcurrent: 200
  worker:
    replicas: 10
    autoscaling:
      enabled: true
      minReplicas: 5
      maxReplicas: 50
      targetCPUUtilization: 70
    resources:
      requests:
        cpu: "8"
        memory: "32Gi"
      limits:
        cpu: "16"
        memory: "32Gi"
    storage:
      cacheSize: 20Gi
      spillSize: 100Gi
  metastore:
    type: postgresql
    external:
      enabled: true
      host: prod-pg.example.com
      port: 5432
      database: ae_metastore
      credentialsSecret: ae-metastore-creds
  storage:
    type: s3
    config:
      bucket: ae-production-data
      region: us-east-1
      credentialsSecret: ae-s3-creds
  monitoring:
    enabled: true
```

### 7.4.8 多集群联邦

```yaml
apiVersion: ae.ae-project.org/v1alpha1
kind: AEFederation
metadata:
  name: global-federation
  namespace: ae-system
spec:
  clusters:
    - name: us-east-cluster
      region: us-east-1
      endpoint: https://ae-us-east.example.com
      credentialsSecret: ae-us-east-creds
      weight: 50
    - name: eu-west-cluster
      region: eu-west-1
      endpoint: https://ae-eu-west.example.com
      credentialsSecret: ae-eu-west-creds
      weight: 30
    - name: ap-southeast-cluster
      region: ap-southeast-1
      endpoint: https://ae-ap-southeast.example.com
      credentialsSecret: ae-ap-southeast-creds
      weight: 20
  routing:
    strategy: locality-preferred
    fallback: any-available
  replication:
    enabled: true
    mode: async
    consistency: eventual
  globalCatalog:
    syncInterval: 60s
    conflictResolution: last-write-wins
```

## 7.5 云平台部署指南

### 7.5.1 AWS 部署方案

#### 7.5.1.1 基础设施架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AWS 部署架构                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                         Route 53 (DNS)                                │ │
│  │                    ae.example.com → ALB                               │ │
│  └───────────────────────────────┬───────────────────────────────────────┘ │
│                                  │                                          │
│  ┌───────────────────────────────▼───────────────────────────────────────┐ │
│  │                    Application Load Balancer                          │ │
│  │                    (WAF + SSL Termination)                            │ │
│  └───────────┬───────────────────────────────────────────┬───────────────┘ │
│              │                                           │                  │
│  ┌───────────▼──────────┐                    ┌───────────▼──────────────┐  │
│  │   VPC: 10.0.0.0/16   │                    │   VPC: 10.1.0.0/16      │  │
│  │   Region: us-east-1   │                    │   Region: eu-west-1      │  │
│  │                       │                    │                          │  │
│  │  ┌─────────────────┐  │                    │  ┌─────────────────┐    │  │
│  │  │ AZ: us-east-1a  │  │                    │  │ AZ: eu-west-1a  │    │  │
│  │  │ ┌─────┐┌─────┐  │  │                    │  │ ┌─────┐┌─────┐  │    │  │
│  │  │ │Coord││Work │  │  │                    │  │ │Coord││Work │  │    │  │
│  │  │ └─────┘└─────┘  │  │                    │  │ └─────┘└─────┘  │    │  │
│  │  └─────────────────┘  │                    │  └─────────────────┘    │  │
│  │  ┌─────────────────┐  │                    │  ┌─────────────────┐    │  │
│  │  │ AZ: us-east-1b  │  │                    │  │ AZ: eu-west-1b  │    │  │
│  │  │ ┌─────┐┌─────┐  │  │                    │  │ ┌─────┐┌─────┐  │    │  │
│  │  │ │Coord││Work │  │  │                    │  │ │Coord││Work │  │    │  │
│  │  │ └─────┘└─────┘  │  │                    │  │ └─────┘└─────┘  │    │  │
│  │  └─────────────────┘  │                    │  └─────────────────┘    │  │
│  │  ┌─────────────────┐  │                    │  ┌─────────────────┐    │  │
│  │  │ AZ: us-east-1c  │  │                    │  │ AZ: eu-west-1c  │    │  │
│  │  │ ┌─────┐┌─────┐  │  │                    │  │ ┌─────┐┌─────┐  │    │  │
│  │  │ │Coord││Work │  │  │                    │  │ │Coord││Work │  │    │  │
│  │  │ └─────┘└─────┘  │  │                    │  │ └─────┘└─────┘  │    │  │
│  │  └─────────────────┘  │                    │  └─────────────────┘    │  │
│  │                       │                    │                          │  │
│  │  ┌─────────────────┐  │                    │  ┌─────────────────┐    │  │
│  │  │ RDS PostgreSQL   │  │                    │  │ RDS PostgreSQL   │    │  │
│  │  │ (Multi-AZ)       │  │                    │  │ (Read Replica)   │    │  │
│  │  └─────────────────┘  │                    │  └─────────────────┘    │  │
│  │  ┌─────────────────┐  │                    │                          │  │
│  │  │ ElastiCache      │  │                    │                          │  │
│  │  │ Redis Cluster    │  │                    │                          │  │
│  │  └─────────────────┘  │                    │                          │  │
│  │  ┌─────────────────┐  │                    │                          │  │
│  │  │ S3 Bucket        │  │                    │                          │  │
│  │  │ (Cross-Region    │◀─┼────────────────────┤                          │  │
│  │  │  Replication)    │  │                    │                          │  │
│  │  └─────────────────┘  │                    │                          │  │
│  └───────────────────────┘                    └──────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 7.5.1.2 Terraform 基础设施代码

```hcl
# main.tf - AWS 基础设施

provider "aws" {
  region = var.aws_region
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "ae_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-vpc"
  })
}

resource "aws_subnet" "private" {
  count             = var.az_count
  vpc_id            = aws_vpc.ae_vpc.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-private-${count.index}"
    "kubernetes.io/role/internal-elb" = "1"
  })
}

resource "aws_subnet" "public" {
  count                   = var.az_count
  vpc_id                  = aws_vpc.ae_vpc.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index + var.az_count)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-public-${count.index}"
    "kubernetes.io/role/elb" = "1"
  })
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = var.k8s_version

  vpc_id     = aws_vpc.ae_vpc.id
  subnet_ids = aws_subnet.private[*].id

  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    coordinator = {
      name           = "${var.cluster_name}-coordinator"
      instance_types = ["r6i.xlarge"]
      min_size       = 3
      max_size       = 5
      desired_size   = 3

      labels = {
        role = "coordinator"
      }

      taints = [{
        key    = "ae-project.org/coordinator"
        effect = "NO_SCHEDULE"
      }]
    }

    worker = {
      name           = "${var.cluster_name}-worker"
      instance_types = ["r6i.2xlarge", "r6i.4xlarge"]
      min_size       = var.worker_min_size
      max_size       = var.worker_max_size
      desired_size   = var.worker_desired_size

      labels = {
        role = "worker"
      }
    }
  }
}

resource "aws_db_instance" "ae_metastore" {
  identifier     = "${var.cluster_name}-metastore"
  engine         = "postgres"
  engine_version = "16.1"

  instance_class         = var.metastore_instance_class
  allocated_storage      = var.metastore_storage
  max_allocated_storage  = var.metastore_max_storage
  storage_type           = "gp3"
  storage_encrypted      = true

  db_name  = "ae_metastore"
  username = "ae_admin"
  password = var.metastore_password

  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.ae_metastore.name
  vpc_security_group_ids = [aws_security_group.metastore.id]

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  performance_insights_enabled = true

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-metastore"
  })
}

resource "aws_elasticache_replication_group" "ae_redis" {
  replication_group_id          = "${var.cluster_name}-redis"
  replication_group_description = "AE Redis Cluster"
  engine                        = "redis"
  engine_version                = "7.2"
  node_type                     = var.redis_node_type
  number_cache_clusters         = 3
  multi_az_enabled              = true
  automatic_failover_enabled    = true

  subnet_group_name  = aws_elasticache_subnet_group.ae_redis.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = var.redis_auth_token

  snapshot_retention_limit = 7
  snapshot_window          = "03:00-04:00"
}

resource "aws_s3_bucket" "ae_data" {
  bucket = "${var.cluster_name}-data-${var.aws_account_id}"

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-data"
  })
}

resource "aws_s3_bucket_versioning" "ae_data" {
  bucket = aws_s3_bucket.ae_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "ae_data" {
  bucket = aws_s3_bucket.ae_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.ae.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "ae_data" {
  bucket = aws_s3_bucket.ae_data.id

  rule {
    id     = "checkpoint-cleanup"
    status = "Enabled"

    filter {
      prefix = "checkpoints/"
    }

    expiration {
      days = 30
    }
  }

  rule {
    id     = "spill-cleanup"
    status = "Enabled"

    filter {
      prefix = "spill/"
    }

    expiration {
      days = 1
    }
  }

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    filter {
      prefix = "archive/"
    }

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "GLACIER"
    }
  }
}
```

### 7.5.2 GCP 部署方案

```hcl
# gcp-main.tf
provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

resource "google_container_cluster" "ae_gke" {
  name     = var.cluster_name
  location = var.gcp_region

  network    = google_compute_network.ae_vpc.id
  subnetwork = google_compute_subnetwork.ae_subnet.id

  initial_node_count = 1

  networking_mode = "VPC_NATIVE"
  ip_allocation_policy {
    cluster_secondary_range_name  = google_compute_subnetwork.ae_subnet.secondary_ip_range[0].range_name
    services_secondary_range_name = google_compute_subnetwork.ae_subnet.secondary_ip_range[1].range_name
  }

  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  node_pool {
    name = "coordinator-pool"
    node_config {
      machine_type = "n2-highmem-4"
      labels = {
        role = "coordinator"
      }
      taint {
        key    = "ae-project.org/coordinator"
        value  = "true"
        effect = "NO_SCHEDULE"
      }
      service_account = google_service_account.ae_gke.email
      oauth_scopes = [
        "https://www.googleapis.com/auth/cloud-platform"
      ]
    }
    initial_node_count = 3
    autoscaling {
      min_node_count = 3
      max_node_count = 5
    }
  }

  node_pool {
    name = "worker-pool"
    node_config {
      machine_type = "n2-highmem-8"
      labels = {
        role = "worker"
      }
      service_account = google_service_account.ae_gke.email
      oauth_scopes = [
        "https://www.googleapis.com/auth/cloud-platform"
      ]
    }
    initial_node_count = 5
    autoscaling {
      min_node_count = var.worker_min_size
      max_node_count = var.worker_max_size
    }
  }
}

resource "google_sql_database_instance" "ae_metastore" {
  name             = "${var.cluster_name}-metastore"
  database_version = "POSTGRES_16"
  region           = var.gcp_region

  settings {
    tier              = var.metastore_tier
    disk_size         = var.metastore_disk_size
    disk_type         = "PD_SSD"
    availability_type = "REGIONAL"

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.ae_vpc.id
    }
  }
}

resource "google_storage_bucket" "ae_data" {
  name          = "${var.cluster_name}-data-${var.gcp_project}"
  location      = var.gcp_region
  force_destroy = false

  uniform_bucket_level_access = true

  encryption {
    default_kms_key_name = google_kms_crypto_key.ae_bucket.id
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}
```

### 7.5.3 阿里云部署方案

```hcl
# alicloud-main.tf
provider "alicloud" {
  region = var.alicloud_region
}

resource "alicloud_cs_managed_kubernetes" "ae_ack" {
  name                 = var.cluster_name
  worker_vswitch_ids   = [alicloud_vswitch.ae_vswitch.id]
  worker_number        = 5
  worker_instance_types = [var.worker_instance_type]
  cluster_spec         = "ack.pro"

  addons {
    name = "csi-plugin"
  }
  addons {
    name = "csi-provisioner"
  }
  addons {
    name = "logtail-ds"
    config = jsonencode({
      IngressDashboardEnabled = "true"
    })
  }
}

resource "alicloud_db_instance" "ae_metastore" {
  engine               = "PostgreSQL"
  engine_version       = "16.0"
  instance_type        = var.metastore_instance_type
  instance_storage     = var.metastore_storage
  instance_charge_type = "Postpaid"

  vswitch_id  = alicloud_vswitch.ae_vswitch.id
  security_ips = [alicloud_vswitch.ae_vswitch.cidr_block]

  tags = {
    Name = "${var.cluster_name}-metastore"
  }
}

resource "alicloud_oss_bucket" "ae_data" {
  bucket = "${var.cluster_name}-data"
  acl    = "private"

  server_side_encryption_rule {
    sse_algorithm = "KMS"
  }

  lifecycle_rule {
    id      = "checkpoint-cleanup"
    enabled = true
    prefix  = "checkpoints/"

    expiration {
      days = 30
    }
  }
}
```

### 7.5.4 Azure 部署方案

```hcl
# azure-main.tf
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "ae_rg" {
  name     = "${var.cluster_name}-rg"
  location = var.azure_location
}

resource "azurerm_kubernetes_cluster" "ae_aks" {
  name                = var.cluster_name
  location            = azurerm_resource_group.ae_rg.location
  resource_group_name = azurerm_resource_group.ae_rg.name
  dns_prefix          = "ae"

  default_node_pool {
    name                = "worker"
    node_count          = 5
    vm_size             = "Standard_E8s_v5"
    os_disk_size_gb     = 100
    os_disk_type        = "Managed"
    vnet_subnet_id      = azurerm_subnet.ae_subnet.id
    enable_auto_scaling = true
    min_count           = var.worker_min_size
    max_count           = var.worker_max_size
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    network_policy    = "calico"
    service_cidr      = "10.0.0.0/16"
    dns_service_ip    = "10.0.0.10"
    load_balancer_sku = "standard"
  }
}

resource "azurerm_postgresql_flexible_server" "ae_metastore" {
  name                   = "${var.cluster_name}-metastore"
  resource_group_name    = azurerm_resource_group.ae_rg.name
  location               = azurerm_resource_group.ae_rg.location
  version                = "16"
  delegated_subnet_id    = azurerm_subnet.ae_pg_subnet.id
  private_dns_zone_id    = azurerm_private_dns_zone.ae_pg.id
  administrator_login    = "ae_admin"
  administrator_password = var.metastore_password
  sku_name               = "GP_Standard_D4s_v3"
  storage_mb             = var.metastore_storage_mb
  backup_retention_days  = 7

  high_availability {
    mode = "ZoneRedundant"
  }
}

resource "azurerm_storage_account" "ae_data" {
  name                     = "${var.cluster_name}data"
  resource_group_name      = azurerm_resource_group.ae_rg.name
  location                 = azurerm_resource_group.ae_rg.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    versioning_enabled = true

    delete_retention_policy {
      days = 30
    }

    container_delete_retention_policy {
      days = 30
    }
  }

  lifecycle_rule {
    name = "archive-rule"
    enabled = true

    filters {
      prefix_match = ["archive/"]
      blob_types   = ["blockBlob"]
    }

    actions {
      base_blob {
        tier_to_cool_after_days_since_modification_greater_than    = 30
        tier_to_archive_after_days_since_modification_greater_than = 90
      }
    }
  }
}
```

### 7.5.5 华为云部署方案

```hcl
# huaweicloud-main.tf
provider "huaweicloud" {
  region = var.huawei_region
}

resource "huaweicloud_cce_cluster" "ae_cce" {
  name                   = var.cluster_name
  flavor_id              = "cce.s2.medium"
  vpc_id                 = huaweicloud_vpc.ae_vpc.id
  subnet_id              = huaweicloud_vpc_subnet.ae_subnet.id
  container_network_type = "vpc-router"
  cluster_version        = var.k8s_version
  service_network_cidr   = "10.247.0.0/16"

  authentication {
    mode = "rbac"
  }
}

resource "huaweicloud_cce_node_pool" "ae_worker" {
  cluster_id         = huaweicloud_cce_cluster.ae_cce.id
  name               = "worker-pool"
  os                 = "EulerOS 2.9"
  flavor_id          = "c6.xlarge.4"
  initial_node_count = 5
  scale_enable       = true
  min_node_count     = var.worker_min_size
  max_node_count     = var.worker_max_size

  root_volume {
    size       = 100
    volumetype = "SSD"
  }

  labels = {
    role = "worker"
  }
}

resource "huaweicloud_rds_instance" "ae_metastore" {
  name              = "${var.cluster_name}-metastore"
  flavor            = "rds.pg.c6.large.4"
  vpc_id            = huaweicloud_vpc.ae_vpc.id
  subnet_id         = huaweicloud_vpc_subnet.ae_subnet.id
  security_group_id = huaweicloud_networking_secgroup.ae_sg.id

  db {
    type     = "PostgreSQL"
    version  = "16"
    password = var.metastore_password
  }

  volume {
    type = "ULTRAHIGH"
    size = var.metastore_storage
  }

  backup_strategy {
    start_time = "03:00"
    keep_days  = 7
  }

  ha_replication_mode = "async"
}

resource "huaweicloud_obs_bucket" "ae_data" {
  bucket        = "${var.cluster_name}-data"
  storage_class = "STANDARD"
  acl           = "private"

  lifecycle_rule {
    id      = "checkpoint-cleanup"
    enabled = true
    prefix  = "checkpoints/"

    expiration {
      days = 30
    }
  }

  server_side_encryption {
    algorithm = "kms"
    kms_key_id = huaweicloud_kms_key.ae_key.id
  }
}
```

## 7.6 配置管理详解

### 7.6.1 配置文件结构

```
/opt/ae/conf/
├── ae-server.yaml          # 主配置文件
├── log4j2.xml              # 日志配置
├── security.yaml           # 安全配置
├── catalog/                # 数据目录配置
│   ├── system.yaml
│   ├── hive.yaml
│   ├── iceberg.yaml
│   └── delta.yaml
├── access-control.yaml     # 访问控制
└── resource-groups.yaml    # 资源组配置
```

### 7.6.2 主配置文件完整参考

```yaml
# ae-server.yaml - AE 主配置文件完整参考

server:
  bind_address: "0.0.0.0"
  http_port: 8080
  jdbc_port: 9030
  admin_port: 8081
  grpc_port: 9230

  thread_pool:
    core_size: 4
    max_size: 200
    keep_alive: 60s
    queue_capacity: 1000

  tls:
    enabled: false
    cert_file: /opt/ae/tls/server.crt
    key_file: /opt/ae/tls/server.key
    ca_file: /opt/ae/tls/ca.crt
    min_version: "1.2"
    cipher_suites:
      - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
      - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
      - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
      - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305

  cors:
    enabled: true
    allowed_origins: ["*"]
    allowed_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_headers: ["*"]
    max_age: 3600

node:
  role: coordinator
  id: "${AE_NODE_ID:auto-1}"
  cluster_name: "ae-cluster"
  labels: {}

coordinator:
  ha:
    enabled: true
    raft_port: 9230
    election_timeout: 5s
    heartbeat_interval: 1s
    snapshot_interval: 300s
    log_retention: 10000

  scheduling:
    strategy: adaptive
    locality_aware: true
    speculative_execution: true
    max_speculative_attempts: 3
    speculative_delay: 30s
    task_timeout: 300s
    max_retry_attempts: 4
    retry_delay: 1s

  query:
    timeout: 300s
    max_concurrent: 100
    max_queued: 1000
    queue_timeout: 60s
    max_memory_per_query: "4GB"
    max_output_rows: 1000000

  session:
    max_idle_time: 30m
    max_lifetime: 4h
    cleanup_interval: 5m

worker:
  cores: 8
  memory: "16GB"

  task:
    max_concurrent: 16
    heartbeat_interval: 5s
    heartbeat_timeout: 30s

  spill:
    enabled: true
    dir: /opt/ae/data/spill
    max_size: 50Gi
    compression: zstd

  cache:
    enabled: true
    dir: /opt/ae/data/cache
    max_size: 10Gi
    ttl: 3600s
    eviction_policy: lru

metastore:
  type: postgresql

  postgresql:
    uri: "jdbc:postgresql://localhost:5432/ae_metastore"
    user: "ae"
    password: "${METASTORE_PASSWORD}"
    pool_size: 20
    connection_timeout: 30s
    idle_timeout: 600s
    max_lifetime: 1800s
    ssl:
      enabled: false
      mode: verify-full

  embedded:
    db_path: /opt/ae/data/metastore
    pool_size: 5

storage:
  type: s3

  s3:
    endpoint: "https://s3.amazonaws.com"
    region: "us-east-1"
    bucket: "ae-data"
    access_key: "${AWS_ACCESS_KEY_ID}"
    secret_key: "${AWS_SECRET_ACCESS_KEY}"
    path_style_access: false
    upload_part_size: "64MB"
    upload_concurrency: 4
    connection_timeout: 30s
    read_timeout: 120s
    max_connections: 100
    retry_mode: standard
    max_retries: 3

  gcs:
    bucket: "ae-data"
    project_id: "my-project"
    service_account_key: ""

  azure:
    container: "ae-data"
    storage_account: ""
    access_key: ""

  oss:
    endpoint: "https://oss-cn-hangzhou.aliyuncs.com"
    bucket: "ae-data"
    access_key: "${ALIBABA_CLOUD_ACCESS_KEY_ID}"
    secret_key: "${ALIBABA_CLOUD_ACCESS_KEY_SECRET}"

  hdfs:
    uri: "hdfs://namenode:8020"
    user: "ae"
    kerberos:
      enabled: false
      principal: ""
      keytab: ""

  local:
    data_dir: /opt/ae/data

cache:
  type: redis

  redis:
    uri: "redis://localhost:6379/0"
    password: "${REDIS_PASSWORD}"
    pool_size: 10
    connection_timeout: 5s
    read_timeout: 3s
    ttl: 3600s
    max_memory_policy: "allkeys-lru"

  caffeine:
    max_size: 10000
    ttl: 300s

  query_result:
    enabled: true
    max_size: 1000
    ttl: 300s

  metadata:
    enabled: true
    max_size: 5000
    ttl: 60s

engine:
  sql:
    default_schema: "default"
    case_sensitive: false
    strict_mode: false
    max_identifier_length: 256

  optimizer:
    type: cbo
    max_iterations: 1000
    join_reordering: true
    join_reordering_strategy: automatic
    filter_pushdown: true
    projection_pushdown: true
    aggregate_pushdown: true
    limit_pushdown: true
    predicate_simplification: true
    constant_folding: true
    subquery_unnesting: true
    statistics_enabled: true
    statistics_sample_ratio: 0.1

  executor:
    type: pipelined
    max_parallelism: 16
    exchange_buffer_size: "64MB"
    sort_buffer_size: "256MB"
    join_spill_enabled: true
    sort_spill_enabled: true
    aggregation_spill_enabled: true

log:
  level: INFO
  format: text
  dir: /opt/ae/logs
  max_file_size: 256MB
  max_files: 10
  compress_rotated: true
  audit_enabled: true
  slow_query_threshold: 10s
  query_log_enabled: true

monitoring:
  enabled: true
  metrics_port: 9090
  metrics_path: /metrics

  prometheus:
    enabled: true
    push_gateway: ""
    push_interval: 15s

  jmx:
    enabled: true

  tracing:
    enabled: false
    exporter: jaeger
    endpoint: "http://jaeger:14268/api/traces"
    sample_rate: 0.1

security:
  authentication:
    enabled: false
    type: password
    password:
      credentials_file: /opt/ae/conf/password.db
    ldap:
      url: "ldap://ldap.example.com:389"
      bind_dn: "cn=admin,dc=example,dc=com"
      bind_password: "${LDAP_BIND_PASSWORD}"
      user_base_dn: "ou=users,dc=example,dc=com"
      user_filter: "(uid={0})"
      group_base_dn: "ou=groups,dc=example,dc=com"
    jwt:
      issuer: "ae-auth"
      audience: "ae-api"
      jwks_url: "https://auth.example.com/.well-known/jwks.json"

  authorization:
    enabled: false
    type: file
    file:
      rules_file: /opt/ae/conf/access-control.yaml
    ranger:
      url: "http://ranger:6080"
      service_name: "ae"

  encryption:
    at_rest:
      enabled: false
      key_management: local
    in_transit:
      enabled: false
```

### 7.6.3 配置优先级

```
优先级从高到低:
1. 命令行参数 (--config key=value)
2. 环境变量 (AE_SERVER_HTTP_PORT=8080)
3. Java 系统属性 (-Dae.server.http_port=8080)
4. 外部配置中心 (Consul/Etcd/Apollo)
5. 配置文件 (ae-server.yaml)
6. 默认值
```

### 7.6.4 环境变量映射

| 配置路径 | 环境变量 | 默认值 |
|----------|----------|--------|
| server.http_port | AE_SERVER_HTTP_PORT | 8080 |
| server.jdbc_port | AE_SERVER_JDBC_PORT | 9030 |
| node.role | AE_NODE_ROLE | coordinator |
| node.id | AE_NODE_ID | auto-1 |
| metastore.type | AE_METASTORE_TYPE | embedded |
| metastore.postgresql.uri | AE_METASTORE_URI | - |
| metastore.postgresql.user | AE_METASTORE_USER | ae |
| metastore.postgresql.password | AE_METASTORE_PASSWORD | - |
| storage.type | AE_STORAGE_TYPE | local |
| storage.s3.bucket | AE_STORAGE_BUCKET | - |
| cache.type | AE_CACHE_TYPE | caffeine |
| log.level | AE_LOG_LEVEL | INFO |
| log.format | AE_LOG_FORMAT | text |

### 7.6.5 热加载配置

```yaml
hot_reload:
  enabled: true
  watch_interval: 5s
  watch_paths:
    - /opt/ae/conf/ae-server.yaml
    - /opt/ae/conf/catalog/
    - /opt/ae/conf/access-control.yaml
    - /opt/ae/conf/resource-groups.yaml
  reloadable_configs:
    - log.level
    - coordinator.query.timeout
    - coordinator.query.max_concurrent
    - optimizer.*
    - cache.ttl
  non_reloadable_configs:
    - server.bind_address
    - server.http_port
    - server.jdbc_port
    - node.role
    - metastore.*
    - storage.*
```

```bash
# 通过 API 触发热加载
curl -X POST http://localhost:8080/api/v1/config/reload

# 查看当前生效配置
curl http://localhost:8080/api/v1/config/effective

# 动态修改配置
curl -X PUT http://localhost:8080/api/v1/config \
  -H "Content-Type: application/json" \
  -d '{
    "log.level": "DEBUG",
    "coordinator.query.max_concurrent": 200
  }'
```

## 7.7 监控体系

### 7.7.1 Prometheus 指标完整列表

#### 7.7.1.1 服务器指标

| 指标名称 | 类型 | 标签 | 说明 |
|----------|------|------|------|
| ae_server_uptime_seconds | Gauge | - | 服务运行时间 |
| ae_server_info | Gauge | version, java_version | 服务信息 |
| ae_server_threads_current | Gauge | pool | 当前线程数 |
| ae_server_threads_active | Gauge | pool | 活跃线程数 |
| ae_server_threads_idle | Gauge | pool | 空闲线程数 |
| ae_server_connections_current | Gauge | protocol | 当前连接数 |
| ae_server_connections_total | Counter | protocol | 总连接数 |

#### 7.7.1.2 查询指标

| 指标名称 | 类型 | 标签 | 说明 |
|----------|------|------|------|
| ae_query_total | Counter | status, schema, query_type | 查询总数 |
| ae_query_duration_seconds | Histogram | status, schema, query_type | 查询耗时 |
| ae_query_active | Gauge | schema | 活跃查询数 |
| ae_query_queued | Gauge | schema | 排队查询数 |
| ae_query_input_rows | Histogram | schema, query_type | 输入行数 |
| ae_query_output_rows | Histogram | schema, query_type | 输出行数 |
| ae_query_input_bytes | Histogram | schema, query_type | 输入字节数 |
| ae_query_output_bytes | Histogram | schema, query_type | 输出字节数 |
| ae_query_cpu_time_seconds | Histogram | schema, query_type | CPU 时间 |
| ae_query_memory_bytes | Histogram | schema, query_type | 查询内存 |
| ae_query_spilled_bytes | Counter | schema, query_type | 溢写字节数 |
| ae_query_failed_total | Counter | error_type, schema | 失败查询数 |

#### 7.7.1.3 执行引擎指标

| 指标名称 | 类型 | 标签 | 说明 |
|----------|------|------|------|
| ae_executor_tasks_total | Counter | status, operator | 任务总数 |
| ae_executor_task_duration_seconds | Histogram | operator | 任务耗时 |
| ae_executor_active_tasks | Gauge | worker | 活跃任务数 |
| ae_executor_blocked_tasks | Gauge | worker, reason | 阻塞任务数 |
| ae_executor_memory_bytes | Gauge | worker, pool | 执行器内存 |
| ae_executor_spill_bytes | Counter | worker, operator | 溢写字节数 |
| ae_executor_peak_memory_bytes | Gauge | worker | 峰值内存 |

#### 7.7.1.4 存储指标

| 指标名称 | 类型 | 标签 | 说明 |
|----------|------|------|------|
| ae_storage_read_operations_total | Counter | type, bucket | 读操作数 |
| ae_storage_write_operations_total | Counter | type, bucket | 写操作数 |
| ae_storage_read_bytes | Counter | type, bucket | 读取字节数 |
| ae_storage_write_bytes | Counter | type, bucket | 写入字节数 |
| ae_storage_read_duration_seconds | Histogram | type, bucket | 读延迟 |
| ae_storage_write_duration_seconds | Histogram | type, bucket | 写延迟 |
| ae_storage_operation_errors_total | Counter | type, error | 操作错误数 |
| ae_cache_hit_total | Counter | cache_type | 缓存命中数 |
| ae_cache_miss_total | Counter | cache_type | 缓存未命中数 |
| ae_cache_eviction_total | Counter | cache_type | 缓存驱逐数 |
| ae_cache_size_bytes | Gauge | cache_type | 缓存大小 |

#### 7.7.1.5 调度指标

| 指标名称 | 类型 | 标签 | 说明 |
|----------|------|------|------|
| ae_schedule_tasks_total | Counter | status, worker | 调度任务数 |
| ae_schedule_latency_seconds | Histogram | worker | 调度延迟 |
| ae_schedule_speculative_tasks_total | Counter | worker | 推测执行任务数 |
| ae_schedule_locality_ratio | Gauge | worker | 本地性比率 |
| ae_worker_heartbeat_seconds | Gauge | worker | Worker 心跳 |

### 7.7.2 Prometheus 配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'ae-production'
    env: 'production'

rule_files:
  - 'ae_alerts.yml'

scrape_configs:
  - job_name: 'ae-coordinator'
    metrics_path: '/metrics'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - ae-system
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
        regex: ae-coordinator
        action: keep
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod

  - job_name: 'ae-worker'
    metrics_path: '/metrics'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - ae-system
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
        regex: ae-worker
        action: keep
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
```

### 7.7.3 告警规则

```yaml
# ae_alerts.yml
groups:
  - name: ae_server_alerts
    rules:
      - alert: AEServerDown
        expr: up{job=~"ae-coordinator|ae-worker"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "AE Server {{ $labels.instance }} is down"
          description: "AE Server {{ $labels.instance }} has been down for more than 1 minute."

      - alert: AEHighQueryFailureRate
        expr: |
          rate(ae_query_failed_total[5m]) / rate(ae_query_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High query failure rate on {{ $labels.schema }}"
          description: "Query failure rate is {{ $value | humanizePercentage }} on schema {{ $labels.schema }}."

      - alert: AESlowQuery
        expr: |
          histogram_quantile(0.99, rate(ae_query_duration_seconds_bucket[5m])) > 300
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P99 query latency is high"
          description: "P99 query latency is {{ $value }}s."

      - alert: AEHighMemoryUsage
        expr: |
          ae_executor_memory_bytes / (1024^3) > 0.85 * on(instance) node_memory_MemTotal_bytes / (1024^3)
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is {{ $value | humanizePercentage }}."

      - alert: AEWorkerUnreachable
        expr: |
          time() - ae_worker_heartbeat_seconds > 60
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Worker {{ $labels.worker }} is unreachable"
          description: "Worker {{ $labels.worker }} has not sent heartbeat for {{ $value }}s."

      - alert: AEQueryQueueBacklog
        expr: ae_query_queued > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Query queue backlog is high"
          description: "{{ $value }} queries are queued."

      - alert: AEHighSpillRate
        expr: |
          rate(ae_executor_spill_bytes[5m]) > 100 * 1024 * 1024
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High spill rate detected"
          description: "Spill rate is {{ $value | humanize }}B/s."

      - alert: AEMetastoreConnectionFailed
        expr: |
          increase(ae_metastore_connection_errors_total[5m]) > 10
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Metastore connection failures"
          description: "{{ $value }} metastore connection errors in the last 5 minutes."

      - alert: AEStorageOperationErrors
        expr: |
          increase(ae_storage_operation_errors_total[5m]) > 50
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Storage operation errors"
          description: "{{ $value }} storage operation errors."

      - alert: AECacheHitRateLow
        expr: |
          rate(ae_cache_hit_total[10m]) / (rate(ae_cache_hit_total[10m]) + rate(ae_cache_miss_total[10m])) < 0.5
        for: 15m
        labels:
          severity: info
        annotations:
          summary: "Cache hit rate is low"
          description: "Cache hit rate for {{ $labels.cache_type }} is {{ $value | humanizePercentage }}."

      - alert: AECoordinatorLeaderElection
        expr: |
          changes(ae_coordinator_leader_changes_total[10m]) > 2
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Frequent leader elections"
          description: "{{ $value }} leader elections in the last 10 minutes."

      - alert: AEJVMGCPauseHigh
        expr: |
          rate(jvm_gc_pause_seconds_sum[5m]) / rate(jvm_gc_pause_seconds_count[5m]) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High GC pause time"
          description: "Average GC pause is {{ $value }}s."

      - alert: AEJVMHeapUsageHigh
        expr: |
          jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "JVM heap usage is high"
          description: "JVM heap usage is {{ $value | humanizePercentage }}."

      - alert: AEDiskSpaceLow
        expr: |
          node_filesystem_avail_bytes{mountpoint="/opt/ae/data"} / node_filesystem_size_bytes{mountpoint="/opt/ae/data"} < 0.15
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low disk space"
          description: "Only {{ $value | humanizePercentage }} disk space remaining."

      - alert: AEHighConnectionCount
        expr: ae_server_connections_current > 500
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High connection count"
          description: "{{ $value }} active connections."
```

### 7.7.4 SLI/SLO 定义

| SLI | SLO | 测量方法 | 告警阈值 |
|-----|-----|----------|----------|
| 查询可用性 | 99.9% | 成功查询数 / 总查询数 | < 99.5% |
| 查询延迟 P50 | < 1s | ae_query_duration_seconds 的 P50 | > 2s |
| 查询延迟 P99 | < 30s | ae_query_duration_seconds 的 P99 | > 60s |
| 查询延迟 P99.9 | < 120s | ae_query_duration_seconds 的 P99.9 | > 300s |
| 系统可用性 | 99.95% | 服务可用时间 / 总时间 | < 99.9% |
| 数据可用性 | 99.999% | 成功读取数 / 总读取数 | < 99.99% |
| 元数据可用性 | 99.99% | 元数据操作成功数 / 总操作数 | < 99.9% |
| 调度延迟 P99 | < 500ms | ae_schedule_latency_seconds 的 P99 | > 1s |

### 7.7.5 Grafana 看板配置

```json
{
  "dashboard": {
    "title": "AE Adaptive Engine - Overview",
    "tags": ["ae", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Query Rate",
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "sum(rate(ae_query_total[5m])) by (status)",
            "legendFormat": "{{status}}"
          }
        ]
      },
      {
        "title": "Query Duration (P50/P95/P99)",
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "histogram_quantile(0.50, sum(rate(ae_query_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "P50"
          },
          {
            "expr": "histogram_quantile(0.95, sum(rate(ae_query_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "P95"
          },
          {
            "expr": "histogram_quantile(0.99, sum(rate(ae_query_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "P99"
          }
        ]
      },
      {
        "title": "Active Queries",
        "type": "stat",
        "gridPos": {"h": 4, "w": 6, "x": 0, "y": 8},
        "targets": [
          {
            "expr": "sum(ae_query_active)",
            "legendFormat": "Active"
          }
        ]
      },
      {
        "title": "Queued Queries",
        "type": "stat",
        "gridPos": {"h": 4, "w": 6, "x": 6, "y": 8},
        "targets": [
          {
            "expr": "sum(ae_query_queued)",
            "legendFormat": "Queued"
          }
        ]
      },
      {
        "title": "Query Failure Rate",
        "type": "gauge",
        "gridPos": {"h": 4, "w": 6, "x": 12, "y": 8},
        "targets": [
          {
            "expr": "sum(rate(ae_query_failed_total[5m])) / sum(rate(ae_query_total[5m]))",
            "legendFormat": "Failure Rate"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "steps": [
                {"value": 0, "color": "green"},
                {"value": 0.01, "color": "yellow"},
                {"value": 0.05, "color": "red"}
              ]
            },
            "unit": "percentunit"
          }
        }
      },
      {
        "title": "Worker Memory Usage",
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 12},
        "targets": [
          {
            "expr": "ae_executor_memory_bytes / (1024^3)",
            "legendFormat": "{{worker}}"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 12},
        "targets": [
          {
            "expr": "sum(rate(ae_cache_hit_total[5m])) by (cache_type) / (sum(rate(ae_cache_hit_total[5m])) by (cache_type) + sum(rate(ae_cache_miss_total[5m])) by (cache_type))",
            "legendFormat": "{{cache_type}}"
          }
        ]
      }
    ]
  }
}
```

## 7.8 日志管理

### 7.8.1 日志级别与使用场景

| 级别 | 使用场景 | 示例 |
|------|----------|------|
| TRACE | 详细的调试信息，仅开发环境 | 算子内部数据流转 |
| DEBUG | 调试信息，排查问题时开启 | 查询计划生成过程 |
| INFO | 关键业务事件 | 查询开始/结束、节点加入/退出 |
| WARN | 潜在问题，不影响服务 | 慢查询、接近资源限制 |
| ERROR | 错误，影响单个请求 | 查询执行失败、连接超时 |
| FATAL | 致命错误，影响整个服务 | 元数据损坏、磁盘满 |

### 7.8.2 结构化日志格式

```json
{
  "timestamp": "2024-01-15T10:30:00.123Z",
  "level": "INFO",
  "logger": "com.ae.engine.QueryExecutor",
  "thread": "query-worker-3",
  "message": "Query completed",
  "context": {
    "query_id": "20240115_103000_00001",
    "session_id": "sess_abc123",
    "user": "analyst",
    "schema": "sales_db",
    "query_type": "SELECT",
    "duration_ms": 1234,
    "input_rows": 1000000,
    "output_rows": 100,
    "peak_memory_bytes": 536870912,
    "cpu_time_ms": 890,
    "spilled_bytes": 0,
    "workers_used": 5
  },
  "host": "ae-worker-3",
  "service": "ae-server",
  "version": "2.0.0"
}
```

### 7.8.3 Log4j2 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" monitorInterval="30">
  <Properties>
    <Property name="LOG_DIR">${sys:AE_LOG_DIR:-/opt/ae/logs}</Property>
    <Property name="LOG_LEVEL">${sys:AE_LOG_LEVEL:-INFO}</Property>
    <Property name="PATTERN">%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ} [%t] %-5level %logger{36} - %msg%n</Property>
  </Properties>

  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="${PATTERN}"/>
    </Console>

    <RollingFile name="MainLog" fileName="${LOG_DIR}/ae-server.log"
                 filePattern="${LOG_DIR}/ae-server-%d{yyyy-MM-dd}-%i.log.gz">
      <PatternLayout pattern="${PATTERN}"/>
      <Policies>
        <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
        <SizeBasedTriggeringPolicy size="256MB"/>
      </Policies>
      <DefaultRolloverStrategy max="10">
        <Delete basePath="${LOG_DIR}" maxDepth="1">
          <IfFileName glob="ae-server-*.log.gz"/>
          <IfLastModified age="7d"/>
        </Delete>
      </DefaultRolloverStrategy>
    </RollingFile>

    <RollingFile name="JsonLog" fileName="${LOG_DIR}/ae-server.json"
                 filePattern="${LOG_DIR}/ae-server-%d{yyyy-MM-dd}-%i.json.gz">
      <JsonLayout compact="true" eventEol="true" properties="true"/>
      <Policies>
        <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
        <SizeBasedTriggeringPolicy size="256MB"/>
      </Policies>
      <DefaultRolloverStrategy max="10"/>
    </RollingFile>

    <RollingFile name="QueryLog" fileName="${LOG_DIR}/ae-query.log"
                 filePattern="${LOG_DIR}/ae-query-%d{yyyy-MM-dd}-%i.log.gz">
      <JsonLayout compact="true" eventEol="true"/>
      <Policies>
        <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
        <SizeBasedTriggeringPolicy size="512MB"/>
      </Policies>
      <DefaultRolloverStrategy max="30"/>
    </RollingFile>

    <RollingFile name="AuditLog" fileName="${LOG_DIR}/ae-audit.log"
                 filePattern="${LOG_DIR}/ae-audit-%d{yyyy-MM-dd}-%i.log.gz">
      <JsonLayout compact="true" eventEol="true"/>
      <Policies>
        <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
        <SizeBasedTriggeringPolicy size="256MB"/>
      </Policies>
      <DefaultRolloverStrategy max="90"/>
    </RollingFile>

    <RollingFile name="SlowQueryLog" fileName="${LOG_DIR}/ae-slow-query.log"
                 filePattern="${LOG_DIR}/ae-slow-query-%d{yyyy-MM-dd}-%i.log.gz">
      <JsonLayout compact="true" eventEol="true"/>
      <Policies>
        <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
        <SizeBasedTriggeringPolicy size="256MB"/>
      </Policies>
      <DefaultRolloverStrategy max="30"/>
    </RollingFile>
  </Appenders>

  <Loggers>
    <Logger name="com.ae.engine.query" level="DEBUG" additivity="false">
      <AppenderRef ref="QueryLog"/>
      <AppenderRef ref="JsonLog"/>
    </Logger>

    <Logger name="com.ae.engine.audit" level="INFO" additivity="false">
      <AppenderRef ref="AuditLog"/>
    </Logger>

    <Logger name="com.ae.engine.slowquery" level="INFO" additivity="false">
      <AppenderRef ref="SlowQueryLog"/>
    </Logger>

    <Logger name="org.apache.calcite" level="WARN"/>
    <Logger name="io.netty" level="WARN"/>
    <Logger name="org.apache.arrow" level="WARN"/>

    <Root level="${LOG_LEVEL}">
      <AppenderRef ref="MainLog"/>
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>
```

### 7.8.4 ELK 集成

```yaml
# filebeat.yaml - Kubernetes Filebeat 配置
apiVersion: v1
kind: ConfigMap
metadata:
  name: filebeat-config
  namespace: ae-system
data:
  filebeat.yml: |-
    filebeat.autodiscover:
      providers:
        - type: kubernetes
          namespace: ae-system
          hints.enabled: true
          templates:
            - condition:
                contains:
                  kubernetes.labels.app_kubernetes_io/name: ae-coordinator
              config:
                - type: container
                  paths:
                    - /var/log/containers/*-${data.kubernetes.container.id}.log
                  json.keys_under_root: true
                  json.add_error_key: true
                  json.message_key: message
                  processors:
                    - add_kubernetes_metadata:
                        host: ${NODE_NAME}
                        matchers:
                          - logs_path:
                              logs_path: "/var/log/containers/"
                    - add_fields:
                        target: ae
                        fields:
                          component: coordinator
                          cluster: ${AE_CLUSTER_NAME}

            - condition:
                contains:
                  kubernetes.labels.app_kubernetes_io/name: ae-worker
              config:
                - type: container
                  paths:
                    - /var/log/containers/*-${data.kubernetes.container.id}.log
                  json.keys_under_root: true
                  json.add_error_key: true
                  json.message_key: message
                  processors:
                    - add_kubernetes_metadata:
                        host: ${NODE_NAME}
                    - add_fields:
                        target: ae
                        fields:
                          component: worker
                          cluster: ${AE_CLUSTER_NAME}

    output.elasticsearch:
      hosts: ["${ELASTICSEARCH_HOSTS}"]
      indices:
        - index: "ae-logs-%{[ae.component]}-%{+yyyy.MM.dd}"
      username: "${ELASTICSEARCH_USERNAME}"
      password: "${ELASTICSEARCH_PASSWORD}"
      ssl.verification_mode: none

    logging.level: info
    logging.to_files: false
```

### 7.8.5 Loki 集成

```yaml
# promtail.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: promtail-config
  namespace: ae-system
data:
  promtail.yaml: |-
    server:
      http_listen_port: 3101
      grpc_listen_port: 0

    positions:
      filename: /tmp/positions.yaml

    clients:
      - url: http://loki:3100/loki/api/v1/push
        tenant_id: ae-production

    scrape_configs:
      - job_name: ae-logs
        kubernetes_sd_configs:
          - role: pod
            namespaces:
              names:
                - ae-system
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
            target_label: app
          - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_component]
            target_label: component
          - source_labels: [__meta_kubernetes_pod_name]
            target_label: pod
          - source_labels: [__meta_kubernetes_namespace]
            target_label: namespace
          - source_labels: [__meta_kubernetes_pod_node_name]
            target_label: node
        pipeline_stages:
          - match:
              selector: '{app=~"ae-coordinator|ae-worker"}'
              stages:
                - json:
                    expressions:
                      level: level
                      logger: logger
                      query_id: context.query_id
                      duration_ms: context.duration_ms
                - labels:
                    level:
                    logger:
                - timestamp:
                    source: timestamp
                    format: RFC3339
                - metrics:
                    query_duration_seconds:
                      type: histogram
                      description: "Query duration"
                      config:
                        buckets: [0.1, 0.5, 1, 5, 10, 30, 60, 120, 300]
                        source: duration_ms
                        action: convert_duration
```

### 7.8.6 日志采样策略

```yaml
log_sampling:
  enabled: true
  rules:
    - pattern: "Query completed"
      level: INFO
      sample_rate: 1.0
      condition: "duration_ms > 1000"

    - pattern: "Query completed"
      level: INFO
      sample_rate: 0.1
      condition: "duration_ms <= 1000"

    - pattern: "Task scheduled"
      level: DEBUG
      sample_rate: 0.01

    - pattern: "Heartbeat received"
      level: TRACE
      sample_rate: 0.001

    - pattern: ".*"
      level: ERROR
      sample_rate: 1.0

    - pattern: ".*"
      level: WARN
      sample_rate: 1.0
```

## 7.9 备份与恢复

### 7.9.1 元数据备份

#### 7.9.1.1 自动备份脚本

```bash
#!/bin/bash
# backup-metastore.sh - AE 元数据自动备份脚本

set -euo pipefail

BACKUP_DIR="/backup/ae-metastore"
RETENTION_DAYS=30
METASTORE_HOST="${AE_METASTORE_HOST:-localhost}"
METASTORE_PORT="${AE_METASTORE_PORT:-5432}"
METASTORE_DB="${AE_METASTORE_DB:-ae_metastore}"
METASTORE_USER="${AE_METASTORE_USER:-ae}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/ae-metastore-${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting metastore backup..."

PGPASSWORD="${AE_METASTORE_PASSWORD}" pg_dump \
    -h "${METASTORE_HOST}" \
    -p "${METASTORE_PORT}" \
    -U "${METASTORE_USER}" \
    -d "${METASTORE_DB}" \
    --format=plain \
    --no-owner \
    --no-privileges \
    --serializable-deferrable \
    | gzip > "${BACKUP_FILE}"

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "[$(date)] Backup completed: ${BACKUP_FILE} (${BACKUP_SIZE})"

echo "[$(date)] Calculating checksum..."
sha256sum "${BACKUP_FILE}" > "${BACKUP_FILE}.sha256"

echo "[$(date)] Uploading to remote storage..."
aws s3 cp "${BACKUP_FILE}" "s3://${AE_BACKUP_BUCKET}/metastore/$(basename ${BACKUP_FILE})" \
    --storage-class STANDARD_IA
aws s3 cp "${BACKUP_FILE}.sha256" "s3://${AE_BACKUP_BUCKET}/metastore/$(basename ${BACKUP_FILE}).sha256"

echo "[$(date)] Cleaning up old backups..."
find "${BACKUP_DIR}" -name "ae-metastore-*.sql.gz" -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "ae-metastore-*.sha256" -mtime +${RETENTION_DAYS} -delete

echo "[$(date)] Backup process completed successfully."
```

#### 7.9.1.2 元数据恢复

```bash
#!/bin/bash
# restore-metastore.sh - AE 元数据恢复脚本

set -euo pipefail

BACKUP_FILE="${1:?Usage: $0 <backup_file>}"
METASTORE_HOST="${AE_METASTORE_HOST:-localhost}"
METASTORE_PORT="${AE_METASTORE_PORT:-5432}"
METASTORE_DB="${AE_METASTORE_DB:-ae_metastore}"
METASTORE_USER="${AE_METASTORE_USER:-ae}"

echo "⚠️  WARNING: This will replace ALL metadata in the metastore!"
echo "   Backup file: ${BACKUP_FILE}"
echo "   Target: ${METASTORE_HOST}:${METASTORE_PORT}/${METASTORE_DB}"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo "[$(date)] Verifying backup integrity..."
if [ -f "${BACKUP_FILE}.sha256" ]; then
    sha256sum -c "${BACKUP_FILE}.sha256"
    if [ $? -ne 0 ]; then
        echo "✗ Checksum verification failed!"
        exit 1
    fi
    echo "✓ Checksum verified"
fi

echo "[$(date)] Creating pre-restore snapshot..."
PGPASSWORD="${AE_METASTORE_PASSWORD}" pg_dump \
    -h "${METASTORE_HOST}" -p "${METASTORE_PORT}" \
    -U "${METASTORE_USER}" -d "${METASTORE_DB}" \
    | gzip > "/tmp/pre-restore-$(date +%Y%m%d_%H%M%S).sql.gz"

echo "[$(date)] Dropping existing schema..."
PGPASSWORD="${AE_METASTORE_PASSWORD}" psql \
    -h "${METASTORE_HOST}" -p "${METASTORE_PORT}" \
    -U "${METASTORE_USER}" -d "${METASTORE_DB}" \
    -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "[$(date)] Restoring from backup..."
gunzip -c "${BACKUP_FILE}" | PGPASSWORD="${AE_METASTORE_PASSWORD}" psql \
    -h "${METASTORE_HOST}" -p "${METASTORE_PORT}" \
    -U "${METASTORE_USER}" -d "${METASTORE_DB}"

echo "[$(date)] Verifying restoration..."
TABLE_COUNT=$(PGPASSWORD="${AE_METASTORE_PASSWORD}" psql \
    -h "${METASTORE_HOST}" -p "${METASTORE_PORT}" \
    -U "${METASTORE_USER}" -d "${METASTORE_DB}" \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")

echo "✓ Restoration completed. Tables restored: ${TABLE_COUNT}"
```

### 7.9.2 Checkpoint 管理

```bash
# Checkpoint 管理命令
# 列出所有 checkpoint
ae-cli checkpoint list

# 列出特定表的 checkpoint
ae-cli checkpoint list --schema sales_db --table orders

# 删除过期 checkpoint
ae-cli checkpoint cleanup --retention 7d

# 手动创建 checkpoint
ae-cli checkpoint create --schema sales_db --table orders --name manual_cp_20240115

# 从 checkpoint 恢复
ae-cli checkpoint restore --schema sales_db --table orders --name manual_cp_20240115

# 导出 checkpoint 到外部存储
ae-cli checkpoint export --schema sales_db --table orders --name manual_cp_20240115 \
    --target s3://ae-backup/checkpoints/
```

### 7.9.3 灾难恢复

#### 7.9.3.1 RTO/RPO 目标

| 灾难级别 | 场景 | RTO | RPO | 恢复策略 |
|----------|------|-----|-----|----------|
| L1 | 单 Worker 故障 | < 30s | 0 | 自动重试/推测执行 |
| L2 | 单 Coordinator 故障 | < 10s | 0 | Raft 自动故障转移 |
| L3 | 存储节点故障 | < 5min | 0 | 多副本自动恢复 |
| L4 | 可用区故障 | < 15min | < 1min | 跨 AZ 故障转移 |
| L5 | 区域故障 | < 1h | < 5min | 跨区域恢复 |
| L6 | 元数据损坏 | < 2h | < 1h | 从备份恢复元数据 |
| L7 | 全部丢失 | < 4h | < 1h | 完整灾难恢复 |

#### 7.9.3.2 跨区域复制配置

```yaml
replication:
  enabled: true
  mode: async
  source_region: us-east-1
  target_regions:
    - region: eu-west-1
      bucket: ae-data-eu
      sync_interval: 30s
      consistency: eventual
    - region: ap-southeast-1
      bucket: ae-data-ap
      sync_interval: 60s
      consistency: eventual

  metadata_replication:
    enabled: true
    mode: sync
    lag_threshold: 10s

  failover:
    automatic: false
    health_check_interval: 10s
    failure_threshold: 3
    recovery_threshold: 5
```

#### 7.9.3.3 灾难恢复演练脚本

```bash
#!/bin/bash
# dr-drill.sh - 灾难恢复演练脚本

set -euo pipefail

DRILL_ID="dr-$(date +%Y%m%d-%H%M%S)"
PRIMARY_REGION="us-east-1"
DR_REGION="eu-west-1"
LOG_FILE="/var/log/ae/dr-drill-${DRILL_ID}.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [${DRILL_ID}] $1" | tee -a "${LOG_FILE}"
}

log "=== 灾难恢复演练开始 ==="

log "Step 1: 验证备份可用性"
LATEST_BACKUP=$(aws s3 ls s3://ae-backup/metastore/ --region ${DR_REGION} | tail -1 | awk '{print $4}')
if [ -z "$LATEST_BACKUP" ]; then
    log "✗ 未找到备份文件"
    exit 1
fi
log "✓ 最新备份: ${LATEST_BACKUP}"

log "Step 2: 验证跨区域数据同步"
PRIMARY_COUNT=$(aws s3 ls s3://ae-production-data/data/ --region ${PRIMARY_REGION} | wc -l)
DR_COUNT=$(aws s3 ls s3://ae-data-eu/data/ --region ${DR_REGION} | wc -l)
DIFF=$((PRIMARY_COUNT - DR_COUNT))
log "  主区域对象数: ${PRIMARY_COUNT}, DR区域对象数: ${DR_COUNT}, 差异: ${DIFF}"

log "Step 3: 模拟故障转移"
log "  切换 DNS 到 DR 区域..."
# aws route53 change-resource-record-sets ...

log "Step 4: 验证 DR 集群就绪"
RETRY=0
while [ $RETRY -lt 30 ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://ae-dr.example.com/api/v1/health)
    if [ "$HTTP_CODE" == "200" ]; then
        log "✓ DR 集群健康"
        break
    fi
    log "  等待 DR 集群就绪... (HTTP ${HTTP_CODE})"
    RETRY=$((RETRY + 1))
    sleep 10
done

log "Step 5: 验证查询功能"
QUERY_RESULT=$(curl -s https://ae-dr.example.com/api/v1/query \
    -H "Content-Type: application/json" \
    -d '{"query": "SELECT COUNT(*) FROM system.nodes"}')
log "  查询结果: ${QUERY_RESULT}"

log "Step 6: 恢复主区域"
log "  切换 DNS 回主区域..."
# aws route53 change-resource-record-sets ...

log "=== 灾难恢复演练完成 ==="
```

## 7.10 故障处理 SOP

### 7.10.1 故障分级

| 级别 | 定义 | 响应时间 | 升级时间 | 示例 |
|------|------|----------|----------|------|
| P0 | 服务完全不可用 | 5 分钟 | 15 分钟 | 集群宕机、数据丢失 |
| P1 | 核心功能严重受损 | 15 分钟 | 30 分钟 | 查询大面积失败、写入阻塞 |
| P2 | 部分功能受影响 | 30 分钟 | 2 小时 | 单 Worker 故障、慢查询 |
| P3 | 轻微影响 | 4 小时 | 24 小时 | 监控告警、日志异常 |
| P4 | 无影响 | 24 小时 | 无 | 优化建议、文档问题 |

### 7.10.2 常见故障场景处理

#### 场景 1：Coordinator Leader 切换频繁

```
症状：ae_coordinator_leader_changes_total 短时间内多次变化
影响：查询短暂中断，调度延迟增加
诊断步骤：
  1. 检查 Coordinator 节点资源使用：kubectl top pods -n ae-system -l app.kubernetes.io/name=ae-coordinator
  2. 检查网络延迟：ping 各 Coordinator 节点
  3. 检查 Raft 日志：grep "raft" /opt/ae/logs/ae-server.log
  4. 检查 GC 日志：grep "Full GC" /opt/ae/logs/gc.log
处理方案：
  - 如果是 GC 导致：增大堆内存或优化 GC 参数
  - 如果是网络问题：检查网络配置，确保同 AZ 部署
  - 如果是资源不足：增加 Coordinator 资源或减少负载
  - 临时措施：调整 Raft 选举超时时间
```

#### 场景 2：Worker 节点失联

```
症状：ae_worker_heartbeat_seconds 超时，Worker 状态变为 UNAVAILABLE
影响：正在执行的任务失败，需要重调度
诊断步骤：
  1. 检查 Worker Pod 状态：kubectl describe pod <worker-pod> -n ae-system
  2. 检查 Worker 日志：kubectl logs <worker-pod> -n ae-system --tail=200
  3. 检查节点资源：kubectl describe node <node>
  4. 检查 OOM 事件：dmesg | grep -i oom
处理方案：
  - OOM Kill：增加内存限制或优化查询内存使用
  - 网络分区：检查 CNI 配置和网络策略
  - 磁盘满：清理 spill 文件和日志
  - 进程崩溃：分析 heap dump，修复根本原因
```

#### 场景 3：查询大面积超时

```
症状：ae_query_failed_total 急剧上升，超时错误占主导
影响：用户体验严重下降
诊断步骤：
  1. 检查活跃查询：curl http://coordinator:8080/api/v1/query/active
  2. 检查资源使用：Worker CPU/内存/磁盘
  3. 检查队列深度：ae_query_queued
  4. 检查是否有大查询阻塞：按内存排序活跃查询
处理方案：
  - Kill 阻塞大查询：curl -X DELETE http://coordinator:8080/api/v1/query/<query_id>
  - 临时降低并发限制：调整 coordinator.query.max_concurrent
  - 扩容 Worker：kubectl scale deployment ae-worker --replicas=20
  - 启用查询队列：确保 queue_timeout 合理
```

#### 场景 4：内存溢出（OOM）

```
症状：Worker 进程被 OOM Kill，日志中出现 java.lang.OutOfMemoryError
影响：正在执行的查询失败，Worker 不可用
诊断步骤：
  1. 检查 OOM 事件：kubectl describe pod <worker-pod> | grep -A5 OOMKilled
  2. 分析 Heap Dump：如果配置了 HeapDumpOnOutOfMemoryError
  3. 检查内存趋势：ae_executor_memory_bytes 指标
  4. 检查是否有内存泄漏：对比多次 GC 后的内存使用
处理方案：
  - 增加堆内存：调整 -Xmx 参数
  - 启用 Spill：确保 worker.spill.enabled=true
  - 限制单查询内存：调整 coordinator.query.max_memory_per_query
  - 优化查询：避免笛卡尔积、大表全表扫描
```

#### 场景 5：元数据存储不可用

```
症状：ae_metastore_connection_errors_total 增加，DDL 操作失败
影响：无法创建/修改表，查询可能失败
诊断步骤：
  1. 检查 PostgreSQL 状态：kubectl get pods -l app=postgresql
  2. 检查连接池：curl http://coordinator:8080/api/v1/admin/pool/metastore
  3. 检查数据库负载：pg_stat_activity
  4. 检查网络连通性：nc -zv <pg-host> 5432
处理方案：
  - 连接池耗尽：增加 metastore.pool_size
  - 数据库过载：优化慢查询，增加数据库资源
  - 主从切换：等待自动故障转移完成
  - 紧急降级：启用元数据缓存，减少数据库访问
```

#### 场景 6：存储操作超时

```
症状：ae_storage_operation_errors_total 增加，S3/OSS 操作超时
影响：数据读写失败
诊断步骤：
  1. 检查存储服务状态：AWS S3 Service Health Dashboard
  2. 检查网络带宽：iftop / nload
  3. 检查请求速率：是否超过 S3 限额
  4. 检查 VPC Endpoint：如果是 PrivateLink
处理方案：
  - S3 限流：申请提高限额，或使用多 bucket 分流
  - 网络问题：检查 VPC Endpoint 配置
  - 临时措施：增加重试次数和超时时间
```

#### 场景 7：数据倾斜导致任务卡住

```
症状：部分 Worker CPU 100%，其他 Worker 空闲，查询长时间不返回
影响：查询性能严重下降
诊断步骤：
  1. 检查任务分布：curl http://coordinator:8080/api/v1/admin/tasks/distribution
  2. 检查数据分布：ANALYZE TABLE <table> COMPUTE STATISTICS
  3. 识别倾斜键：SELECT key, COUNT(*) FROM table GROUP BY key ORDER BY 2 DESC LIMIT 10
处理方案：
  - 启用自适应重分区：SET SESSION ae.adaptive_partitioning=true
  - 使用 Salting 打散热点：添加随机前缀
  - 手动指定分区数：SET SESSION ae.shuffle_partitions=200
  - 使用 Broadcast Join：对小表使用广播
```

#### 场景 8：GC 停顿过长

```
症状：ae_jvm_gc_pause_seconds 增加，查询延迟毛刺
影响：查询偶尔超时
诊断步骤：
  1. 分析 GC 日志：GCViewer 或 GCEasy
  2. 检查内存分配速率：JFR (Java Flight Recorder)
  3. 识别大对象分配：JFR 事件分析
处理方案：
  - 切换 GC 算法：从 G1 切换到 ZGC (-XX:+UseZGC)
  - 调整 G1 参数：-XX:MaxGCPauseMillis=100 -XX:G1HeapRegionSize=16m
  - 减少对象分配：优化代码，使用对象池
  - 增大堆内存：-Xmx 调整
```

#### 场景 9：磁盘空间不足

```
症状：AEDiskSpaceLow 告警触发
影响：Spill 失败，写入失败
诊断步骤：
  1. 检查磁盘使用：df -h /opt/ae/data
  2. 检查大文件：du -sh /opt/ae/data/* | sort -rh
  3. 检查 Spill 文件：ls -lh /opt/ae/data/spill/
  4. 检查日志文件：ls -lh /opt/ae/logs/
处理方案：
  - 清理 Spill 文件：ae-cli cleanup spill --force
  - 清理旧日志：find /opt/ae/logs -name "*.log.gz" -mtime +7 -delete
  - 清理缓存：ae-cli cleanup cache --force
  - 扩展存储：修改 PVC 大小或添加新磁盘
```

#### 场景 10：网络分区

```
症状：部分节点间通信超时，Raft 选主失败
影响：集群分裂，数据不一致
诊断步骤：
  1. 检查节点间连通性：从各节点 ping 其他节点
  2. 检查网络策略：kubectl get networkpolicy -n ae-system
  3. 检查 DNS 解析：nslookup ae-coordinator-headless
  4. 检查 CNI 状态：kubectl get pods -n kube-system -l k8s-app=calico
处理方案：
  - 少数派分区：等待网络恢复，自动重新加入
  - 多数派分区：集群可继续服务，修复网络
  - 持续分区：手动干预，重启少数派节点
```

## 7.11 升级与迁移

### 7.11.1 版本升级策略

| 策略 | 说明 | 停机时间 | 风险 | 适用场景 |
|------|------|----------|------|----------|
| 原地升级 | 直接替换二进制 | 中 | 高 | 开发/测试环境 |
| 滚动升级 | 逐个替换节点 | 低 | 中 | 生产环境 |
| 蓝绿部署 | 新旧集群并行 | 无 | 低 | 关键业务 |
| 金丝雀发布 | 小流量验证 | 无 | 最低 | 大规模集群 |

### 7.11.2 滚动升级流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        滚动升级流程                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. 预检查                                                              │
│     ├── 集群健康检查                                                    │
│     ├── 备份元数据                                                      │
│     ├── 检查兼容性矩阵                                                  │
│     └── 通知用户                                                        │
│                                                                         │
│  2. 升级 Coordinator (逐个)                                             │
│     ├── 升级 coord-0 → 等待就绪 → 验证                                  │
│     ├── 升级 coord-1 → 等待就绪 → 验证                                  │
│     └── 升级 coord-2 → 等待就绪 → 验证                                  │
│                                                                         │
│  3. 升级 Worker (分批)                                                  │
│     ├── 批次1: 20% Worker → 验证                                       │
│     ├── 批次2: 40% Worker → 验证                                       │
│     ├── 批次3: 60% Worker → 验证                                       │
│     ├── 批次4: 80% Worker → 验证                                       │
│     └── 批次5: 100% Worker → 验证                                      │
│                                                                         │
│  4. 升级后验证                                                          │
│     ├── 运行冒烟测试                                                    │
│     ├── 运行性能基准测试                                                │
│     ├── 检查监控指标                                                    │
│     └── 确认无异常后完成                                                │
│                                                                         │
│  5. 回滚 (如果需要)                                                     │
│     ├── 停止升级流程                                                    │
│     ├── 回滚已升级节点                                                  │
│     └── 验证回滚后集群状态                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.11.3 升级命令

```bash
# 使用 Helm 升级
helm upgrade ae ae-chart/ \
    --namespace ae-system \
    --set image.tag=2.1.0 \
    --set coordinator.replicas=3 \
    --wait \
    --timeout 30m

# 使用 kubectl 滚动升级
kubectl set image statefulset/ae-coordinator \
    ae-coordinator=ae-project/ae-server:2.1.0 \
    -n ae-system

kubectl rollout status statefulset/ae-coordinator -n ae-system

kubectl set image deployment/ae-worker \
    ae-worker=ae-project/ae-server:2.1.0 \
    -n ae-system

kubectl rollout status deployment/ae-worker -n ae-system

# 回滚
kubectl rollout undo statefulset/ae-coordinator -n ae-system
kubectl rollout undo deployment/ae-worker -n ae-system
```

### 7.11.4 兼容性矩阵

| 从版本 | 到版本 | 元数据兼容 | 协议兼容 | 滚动升级 | 说明 |
|--------|--------|------------|----------|----------|------|
| 2.0.x | 2.1.x | ✅ | ✅ | ✅ | 小版本完全兼容 |
| 2.1.x | 2.2.x | ✅ | ✅ | ✅ | 小版本完全兼容 |
| 2.x | 3.0 | ⚠️ | ✅ | ⚠️ | 需要元数据迁移 |
| 3.0 | 3.1 | ✅ | ✅ | ✅ | 小版本完全兼容 |
| 3.x | 4.0 | ❌ | ⚠️ | ❌ | 需要蓝绿部署 |

## 7.12 日常运维操作手册

### 7.12.1 健康检查

```bash
# 快速健康检查
ae-cli health check

# 详细健康检查
ae-cli health check --verbose

# 检查各组件状态
ae-cli status coordinator
ae-cli status workers
ae-cli status metastore
ae-cli status storage

# API 方式检查
curl http://localhost:8080/api/v1/health
curl http://localhost:8080/api/v1/health/ready
curl http://localhost:8080/api/v1/health/started
curl http://localhost:8080/api/v1/health/detail
```

### 7.12.2 资源清理

```bash
# 清理过期数据
ae-cli cleanup expired-data --retention 30d

# 清理 spill 文件
ae-cli cleanup spill

# 清理缓存
ae-cli cleanup cache

# 清理孤立元数据
ae-cli cleanup orphan-metadata

# 清理旧日志
ae-cli cleanup logs --retention 7d

# 全面清理
ae-cli cleanup all --dry-run
ae-cli cleanup all
```

### 7.12.3 证书轮换

```bash
# 检查证书过期时间
ae-cli cert check-expiry

# 轮换 TLS 证书
ae-cli cert rotate --type tls

# 轮换客户端证书
ae-cli cert rotate --type client

# 轮换内部通信证书
ae-cli cert rotate --type internal

# 强制轮换所有证书
ae-cli cert rotate --all --force
```

### 7.12.4 密钥更新

```bash
# 更新元数据存储密码
ae-cli secret update metastore-password \
    --secret-name ae-secrets \
    --key METASTORE_PASSWORD

# 更新存储密钥
ae-cli secret update storage-credentials \
    --secret-name ae-secrets \
    --key STORAGE_ACCESS_KEY \
    --key STORAGE_SECRET_KEY

# 更新 Redis 密码
ae-cli secret update redis-password \
    --secret-name ae-secrets \
    --key REDIS_PASSWORD

# 滚动重启使新密钥生效
kubectl rollout restart statefulset/ae-coordinator -n ae-system
kubectl rollout restart deployment/ae-worker -n ae-system
```

# 第8章：性能优化策略（扩展版）

## 8.1 性能优化方法论

### 8.1.1 系统化优化流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AE 性能优化系统化流程                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │ 1.建立    │───▶│ 2.定位    │───▶│ 3.优化    │───▶│ 4.验证    │         │
│  │   基线    │    │   瓶颈    │    │   实施    │    │   效果    │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│       │               │               │               │                │
│       ▼               ▼               ▼               ▼                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │基准测试   │    │监控分析   │    │参数调优   │    │A/B测试   │         │
│  │指标定义   │    │火焰图     │    │代码优化   │    │回归测试   │         │
│  │目标设定   │    │Trace追踪  │    │架构改进   │    │持续监控   │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.1.2 基准测试方法论

| 方法 | 说明 | 适用场景 | 工具 |
|------|------|----------|------|
| 微基准测试 | 单个算子/函数性能 | 算子优化验证 | JMH |
| 宏基准测试 | 端到端查询性能 | 整体性能评估 | TPC-DS/H |
| 压力测试 | 极限负载下表现 | 容量规划 | ae-bench |
| 稳定性测试 | 长时间运行稳定性 | 内存泄漏检测 | ae-stability |
| 对比测试 | 版本间性能对比 | 回归检测 | ae-compare |

### 8.1.3 性能建模

```
查询响应时间 = CPU时间 + I/O等待 + 网络传输 + 调度延迟 + 排队等待

CPU时间 = Σ(算子CPU时间) = Σ(输入行数 × 单行处理时间)
I/O等待 = Σ(扫描数据量 / I/O带宽) + Σ(随机I/O次数 × 平均I/O延迟)
网络传输 = Σ(Shuffle数据量 / 网络带宽)
调度延迟 = 任务排队时间 + 任务启动时间
排队等待 = 查询在队列中的等待时间
```

## 8.2 计算优化

### 8.2.1 算子融合算法详解

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        算子融合优化                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  融合前 (5 个算子，4 次物化):                                            │
│                                                                         │
│  Scan ──▶ Filter ──▶ Project ──▶ Aggregate ──▶ Sort                    │
│    │        │          │           │            │                        │
│    ▼        ▼          ▼           ▼            ▼                        │
│  [物化1]  [物化2]   [物化3]    [物化4]      [结果]                       │
│                                                                         │
│  融合后 (2 个算子，1 次物化):                                            │
│                                                                         │
│  Scan+Filter+Project ──▶ Aggregate+Sort                                │
│           │                      │                                      │
│           ▼                      ▼                                      │
│       [流水线1]              [流水线2]                                   │
│                                                                         │
│  节省: 3次物化 → 减少内存分配和拷贝                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 8.2.1.1 融合规则表

| 规则 | 模式 | 条件 | 收益 |
|------|------|------|------|
| Filter-Project融合 | Filter → Project | 无副作用 | 消除中间物化 |
| Scan-Filter融合 | Scan → Filter | 支持下推 | 减少扫描行数 |
| Project-Project融合 | Project → Project | 列无重叠 | 减少计算列 |
| Filter-Filter融合 | Filter → Filter | 无依赖 | 合并谓词 |
| Aggregate-Project融合 | Aggregate → Project | 列包含关系 | 消除中间物化 |
| Join-Filter融合 | Join → Filter | 过滤比率高 | 减少Join输出 |
| Multi-Aggregate融合 | Aggregate → Aggregate | 分组键相同 | 单次扫描完成 |

### 8.2.2 向量化执行原理

```java
public class VectorizedFilterOperator extends AbstractOperator {

    private final Predicate predicate;
    private static final int BATCH_SIZE = 1024;

    @Override
    public VectorBatch process(VectorBatch input) {
        int[] selected = new int[BATCH_SIZE];
        int selectedCount = 0;

        for (int i = 0; i < input.getRowCount(); i++) {
            if (predicate.test(input, i)) {
                selected[selectedCount++] = i;
            }
        }

        return input.select(selected, selectedCount);
    }
}

public class VectorizedAddOperator extends AbstractOperator {

    private final int leftColumn;
    private final int rightColumn;

    @Override
    public VectorBatch process(VectorBatch input) {
        IntVector left = input.getIntVector(leftColumn);
        IntVector right = input.getIntVector(rightColumn);
        IntVector result = new IntVector(input.getRowCount());

        for (int i = 0; i < input.getRowCount(); i++) {
            result.set(i, left.get(i) + right.get(i));
        }

        VectorBatch output = input.clone();
        output.replaceColumn(resultColumn, result);
        return output;
    }
}
```

### 8.2.3 CodeGen 代码生成

```java
public class ExpressionCodeGenerator {

    public static CompiledExpression compile(Expression expr) {
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        MethodVisitor mv;

        cw.visit(V1_8, ACC_PUBLIC, "GeneratedExpression", null, "java/lang/Object", null);

        {
            mv = cw.visitMethod(ACC_PUBLIC, "evaluate",
                "(Lcom/ae/vector/VectorBatch;)Lcom/ae/vector/ColumnVector;", null, null);
            mv.visitCode();

            expr.accept(new CodeGenVisitor(mv));

            mv.visitInsn(ARETURN);
            mv.visitMaxs(0, 0);
            mv.visitEnd();
        }

        cw.visitEnd();
        byte[] bytecode = cw.toByteArray();

        return BytecodeLoader.load("GeneratedExpression", bytecode);
    }
}
```

### 8.2.4 JIT 优化

| 优化技术 | 说明 | 示例 |
|----------|------|------|
| 内联 | 消除方法调用开销 | 小方法直接嵌入调用处 |
| 逃逸分析 | 栈上分配对象 | 算子内部临时对象 |
| 循环展开 | 减少循环开销 | 向量化循环展开 |
| 分支预测 | 优化条件分支 | 热路径优化 |
| 去虚化 | 消除虚方法调用 | 算子接口单实现 |

## 8.3 内存优化

### 8.3.1 分层内存管理

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AE 分层内存管理架构                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     L1: On-Heap Memory                          │   │
│  │  JVM 堆内存，受 GC 管理                                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │元数据缓存 │ │查询上下文  │ │会话信息   │ │计划缓存   │         │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │   │
│  │  大小: 堆内存的 30-40%                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     L2: Off-Heap Memory                         │   │
│  │  堆外内存，不受 GC 管理，手动释放                                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │Arrow向量  │ │Shuffle   │ │排序缓冲   │ │网络缓冲   │         │   │
│  │  │          │ │Buffer    │ │          │ │          │         │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │   │
│  │  大小: 堆内存的 50-60%                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     L3: Disk (Spill)                            │   │
│  │  磁盘溢写，当内存不足时使用                                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │   │
│  │  │Sort Spill│ │Join Spill│ │Agg Spill │                        │   │
│  │  └──────────┘ └──────────┘ └──────────┘                        │   │
│  │  大小: 无限制（受磁盘空间约束）                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.3.2 内存池实现

```java
public class MemoryPoolManager {

    private final ConcurrentHashMap<String, MemoryPool> pools = new ConcurrentHashMap<>();
    private final long totalMemoryBytes;
    private final AtomicLong usedMemoryBytes = new AtomicLong(0);

    public MemoryPool createPool(String name, long maxBytes) {
        MemoryPool pool = new MemoryPool(name, maxBytes, this);
        pools.put(name, pool);
        return pool;
    }

    public boolean tryReserve(String poolName, long bytes) {
        long currentUsed = usedMemoryBytes.get();
        if (currentUsed + bytes > totalMemoryBytes) {
            return false;
        }
        return usedMemoryBytes.compareAndSet(currentUsed, currentUsed + bytes);
    }

    public void release(String poolName, long bytes) {
        usedMemoryBytes.addAndGet(-bytes);
    }

    public MemoryStats getStats() {
        return new MemoryStats(
            totalMemoryBytes,
            usedMemoryBytes.get(),
            pools.entrySet().stream()
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    e -> e.getValue().getStats()
                ))
        );
    }
}

public class MemoryPool implements AutoCloseable {

    private final String name;
    private final long maxBytes;
    private final MemoryPoolManager manager;
    private final AtomicLong reservedBytes = new AtomicLong(0);
    private final AtomicLong allocatedBytes = new AtomicLong(0);

    public MemoryReservation reserve(long bytes) {
        if (reservedBytes.get() + bytes > maxBytes) {
            throw new MemoryLimitExceededException(
                String.format("Pool %s: cannot reserve %d bytes (reserved=%d, max=%d)",
                    name, bytes, reservedBytes.get(), maxBytes));
        }
        if (!manager.tryReserve(name, bytes)) {
            throw new MemoryLimitExceededException("Global memory limit exceeded");
        }
        reservedBytes.addAndGet(bytes);
        return new MemoryReservation(this, bytes);
    }

    public void release(long bytes) {
        reservedBytes.addAndGet(-bytes);
        manager.release(name, bytes);
    }

    @Override
    public void close() {
        release(reservedBytes.get());
    }
}
```

### 8.3.3 GC 调优参数

| 参数 | 默认值 | 推荐值 | 说明 |
|------|--------|--------|------|
| -XX:+UseG1GC | - | ✅ | 使用 G1 垃圾收集器 |
| -XX:MaxGCPauseMillis | 200 | 100 | 目标最大 GC 停顿 |
| -XX:G1HeapRegionSize | 自动 | 16m | G1 Region 大小 |
| -XX:InitiatingHeapOccupancyPercent | 45 | 35 | 触发并发标记的堆占用比 |
| -XX:G1MixedGCCountTarget | 8 | 16 | 混合 GC 目标次数 |
| -XX:G1ReservePercent | 10 | 20 | 保留空间防止晋升失败 |
| -XX:+ParallelRefProcEnabled | false | true | 并行处理引用 |
| -XX:+UseLargePages | false | true | 使用大页内存 |

### 8.3.4 堆外内存管理

```java
public class OffHeapMemoryAllocator {

    private final Unsafe unsafe;
    private final ConcurrentHashMap<Long, Long> allocations = new ConcurrentHashMap<>();
    private final AtomicLong totalAllocated = new AtomicLong(0);
    private final long maxTotalBytes;

    public long allocate(long size) {
        if (totalAllocated.get() + size > maxTotalBytes) {
            throw new OutOfMemoryError("Off-heap memory limit exceeded");
        }
        long address = unsafe.allocateMemory(size);
        unsafe.setMemory(address, size, (byte) 0);
        allocations.put(address, size);
        totalAllocated.addAndGet(size);
        return address;
    }

    public void free(long address) {
        Long size = allocations.remove(address);
        if (size != null) {
            unsafe.freeMemory(address);
            totalAllocated.addAndGet(-size);
        }
    }
}
```

### 8.3.5 内存泄漏检测

```bash
# 启用内存泄漏检测
JAVA_OPTS="-javaagent:/opt/ae/lib/leak-detector.jar \
  -Dae.leak.detector.sampleRate=0.01 \
  -Dae.leak.detector.threshold=60s"

# 使用 JFR 检测
jcmd <pid> JFR.start \
  settings=profile \
  filename=/tmp/ae-memory.jfr \
  duration=60s

# 分析 Heap Dump
jmap -dump:format=b,file=/tmp/ae-heap.hprof <pid>
jhat -J-Xmx4g /tmp/ae-heap.hprof

# 使用 Eclipse MAT 分析
# 1. 打开 heap dump
# 2. 运行 Leak Suspects Report
# 3. 检查 Dominator Tree
# 4. 分析 GC Roots 引用链
```

## 8.4 I/O 优化

### 8.4.1 存储格式对比

| 格式 | 类型 | 压缩 | 列裁剪 | 谓词下推 | ACID | 生态 |
|------|------|------|--------|----------|------|------|
| Parquet | 列式 | ✅ | ✅ | ✅ | ❌ | 最广 |
| ORC | 列式 | ✅ | ✅ | ✅ | ❌ | Hive |
| Avro | 行式 | ✅ | ❌ | ❌ | ❌ | Kafka |
| Arrow IPC | 列式 | ❌ | ✅ | ❌ | ❌ | 内存 |
| Iceberg | 表格式 | ✅ | ✅ | ✅ | ✅ | 新兴 |
| Delta | 表格式 | ✅ | ✅ | ✅ | ✅ | Spark |

### 8.4.2 列式存储原理

```
行式存储:                          列式存储:
┌───────────────────────┐         ┌───────────────────────┐
│ Row 1: A, 1, X        │         │ Col A: A, B, C, D     │
│ Row 2: B, 2, Y        │         │ Col 1: 1, 2, 3, 4     │
│ Row 3: C, 3, Z        │         │ Col X: X, Y, Z, W     │
│ Row 4: D, 4, W        │         │                       │
└───────────────────────┘         └───────────────────────┘

查询: SELECT Col 1 WHERE Col A = 'B'

行式: 读取所有列 → 过滤 → 投影     列式: 读取 Col A → 过滤 → 读取 Col 1
I/O: 4行 × 3列 = 12 单位           I/O: 1列 + 部分列 = 2 单位
```

### 8.4.3 压缩算法对比

| 算法 | 压缩比 | 压缩速度 | 解压速度 | CPU 开销 | 推荐场景 |
|------|--------|----------|----------|----------|----------|
| Snappy | 2-3x | 250 MB/s | 500 MB/s | 低 | 热数据、低延迟 |
| LZ4 | 2-3x | 400 MB/s | 1000 MB/s | 低 | 热数据、低延迟 |
| Zstd-1 | 3-4x | 300 MB/s | 600 MB/s | 中 | 温数据、通用 |
| Zstd-3 | 4-5x | 150 MB/s | 600 MB/s | 中 | 温数据、存储优化 |
| Zstd-9 | 5-7x | 30 MB/s | 600 MB/s | 高 | 冷数据、归档 |
| Gzip | 4-6x | 50 MB/s | 150 MB/s | 高 | 冷数据、归档 |

### 8.4.4 缓存策略

```yaml
cache:
  metadata:
    enabled: true
    max_size: 5000
    ttl: 60s
    eviction: lru

  data:
    enabled: true
    max_size: 10Gi
    ttl: 3600s
    eviction: lru
    tiers:
      - name: memory
        max_size: 4Gi
        eviction: lru
      - name: ssd
        max_size: 10Gi
        eviction: lru
      - name: remote
        max_size: unlimited
        eviction: ttl

  query_result:
    enabled: true
    max_size: 1000
    ttl: 300s
    eviction: lru
    cache_key: "query_hash + schema_version"
```

### 8.4.5 预读优化

```java
public class PredictiveReadAhead {

    private final StorageEngine storage;
    private final ExecutorService readAheadExecutor;
    private final Cache<String, CompletableFuture<Buffer>> readAheadCache;

    public CompletableFuture<Buffer> readWithReadAhead(
            String filePath, long offset, int length) {
        String key = filePath + ":" + offset;
        CompletableFuture<Buffer> cached = readAheadCache.getIfPresent(key);
        if (cached != null) {
            return cached;
        }

        CompletableFuture<Buffer> result = storage.readAsync(filePath, offset, length);

        if (shouldReadAhead(filePath, offset, length)) {
            long nextOffset = offset + length;
            int nextLength = calculateReadAheadLength(length);
            readAheadExecutor.submit(() -> {
                CompletableFuture<Buffer> ra = storage.readAsync(filePath, nextOffset, nextLength);
                readAheadCache.put(filePath + ":" + nextOffset, ra);
            });
        }

        return result;
    }
}
```

## 8.5 网络优化

### 8.5.1 Shuffle 优化全解

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Shuffle 优化技术全景                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Shuffle 数据压缩                                                    │
│     ├── 发送端压缩 (LZ4/Snappy/Zstd)                                   │
│     └── 接收端解压                                                      │
│                                                                         │
│  2. Shuffle 分区优化                                                    │
│     ├── 自适应分区数                                                    │
│     ├── 合并小分区                                                      │
│     └── 倾斜分区拆分                                                    │
│                                                                         │
│  3. Shuffle Buffer 管理                                                 │
│     ├── 内存缓冲区                                                      │
│     ├── 溢写到磁盘                                                      │
│     └── 合并读取                                                        │
│                                                                         │
│  4. 网络传输优化                                                        │
│     ├── 批量发送                                                        │
│     ├── 零拷贝                                                          │
│     └── 连接复用                                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.5.2 零拷贝技术

```java
public class ZeroCopyTransfer {

    public long transferTo(FileChannel source, SocketChannel target,
                           long position, long count) throws IOException {
        return source.transferTo(position, count, target);
    }

    public long transferFrom(FileChannel target, FileChannel source,
                             long position, long count) throws IOException {
        return target.transferFrom(source, position, count);
    }

    public MappedByteBuffer memoryMap(FileChannel channel, long position,
                                      long size) throws IOException {
        return channel.map(FileChannel.MapMode.READ_ONLY, position, size);
    }
}
```

### 8.5.3 连接池管理

```yaml
network:
  connection_pool:
    max_connections: 1000
    max_connections_per_host: 100
    idle_timeout: 300s
    connect_timeout: 10s
    read_timeout: 120s
    write_timeout: 30s
    keep_alive: true
    tcp_no_delay: true
    send_buffer_size: 256KB
    receive_buffer_size: 256KB
```

## 8.6 数据倾斜处理

### 8.6.1 倾斜检测算法

```sql
-- 检测分区数据量倾斜
SELECT
    partition_id,
    row_count,
    AVG(row_count) OVER () AS avg_rows,
    row_count / AVG(row_count) OVER () AS skew_ratio
FROM system.partition_stats
WHERE schema_name = 'sales_db' AND table_name = 'orders'
ORDER BY skew_ratio DESC
LIMIT 20;

-- 检测 Join 键倾斜
SELECT
    customer_id,
    COUNT(*) AS cnt,
    COUNT(*) * 1.0 / SUM(COUNT(*)) OVER () AS ratio
FROM sales_db.orders
GROUP BY customer_id
ORDER BY cnt DESC
LIMIT 20;
```

### 8.6.2 五种处理策略

| 策略 | 原理 | 适用场景 | 开销 |
|------|------|----------|------|
| Salting | 添加随机前缀打散热点 | Group By 倾斜 | 低 |
| 两阶段聚合 | 局部聚合+全局聚合 | Aggregate 倾斜 | 中 |
| Broadcast Join | 小表广播到所有节点 | Join 倾斜(小表) | 低 |
| Skew Join | 热点键单独处理 | Join 倾斜(大表) | 中 |
| 自适应重分区 | 运行时动态调整分区 | 未知倾斜模式 | 中 |

### 8.6.3 自适应重分区

```java
public class AdaptivePartitioner {

    private final int initialPartitions;
    private final long skewThreshold;
    private final int maxPartitions;

    public int[] computePartitions(VectorBatch batch, int keyColumn) {
        long[] partitionCounts = new long[initialPartitions];

        for (int i = 0; i < batch.getRowCount(); i++) {
            int hash = batch.hashCode(keyColumn, i);
            int partition = Math.abs(hash % initialPartitions);
            partitionCounts[partition]++;
        }

        List<Integer> skewedPartitions = new ArrayList<>();
        double avgCount = Arrays.stream(partitionCounts).average().orElse(0);

        for (int i = 0; i < initialPartitions; i++) {
            if (partitionCounts[i] > avgCount * skewThreshold) {
                skewedPartitions.add(i);
            }
        }

        if (skewedPartitions.isEmpty()) {
            return new int[initialPartitions];
        }

        int[] partitionMap = new int[initialPartitions];
        int nextPartition = initialPartitions;
        for (int skewed : skewedPartitions) {
            partitionMap[skewed] = nextPartition++;
        }

        return partitionMap;
    }
}
```

## 8.7 调度优化

### 8.7.1 Locality 感知调度

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Locality 感知调度策略                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  优先级:                                                                │
│  NODE_LOCAL > RACK_LOCAL > ANY                                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │  Worker-1 (Node A)                                          │       │
│  │  ├── 数据文件: file-001, file-002, file-003                 │       │
│  │  └── 任务: Scan(file-001) ← NODE_LOCAL ✅                   │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │  Worker-2 (Node B, 同Rack)                                  │       │
│  │  ├── 数据文件: file-004, file-005                           │       │
│  │  └── 任务: Scan(file-001) ← RACK_LOCAL ⚠️                   │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │  Worker-3 (Node C, 不同Rack)                                │       │
│  │  ├── 数据文件: file-006, file-007                           │       │
│  │  └── 任务: Scan(file-001) ← ANY ❌                          │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  延迟调度: 等待 3s 寻找 NODE_LOCAL，否则降级到 RACK_LOCAL              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.7.2 推测执行

```yaml
scheduling:
  speculative_execution:
    enabled: true
    delay: 30s
    max_attempts: 3
    multiplier: 1.5
    conditions:
      - task_progress_below: 0.5
      - task_duration_above_median: 2.0
      - no_fetch_failure: true
```

### 8.7.3 资源碎片整理

```java
public class ResourceDefragmenter {

    public void defragment(ScheduleContext context) {
        List<WorkerInfo> workers = context.getWorkers();

        workers.sort(Comparator.comparingDouble(w ->
            (double) w.getUsedCores() / w.getTotalCores()));

        List<TaskInfo> pendingTasks = context.getPendingTasks();
        pendingTasks.sort(Comparator.comparingInt(TaskInfo::getRequiredCores).reversed());

        for (TaskInfo task : pendingTasks) {
            WorkerInfo bestWorker = null;
            int bestScore = Integer.MIN_VALUE;

            for (WorkerInfo worker : workers) {
                if (worker.getAvailableCores() >= task.getRequiredCores()) {
                    int score = computeScore(worker, task);
                    if (score > bestScore) {
                        bestScore = score;
                        bestWorker = worker;
                    }
                }
            }

            if (bestWorker != null) {
                context.assign(task, bestWorker);
            }
        }
    }

    private int computeScore(WorkerInfo worker, TaskInfo task) {
        int localityScore = worker.hasLocalData(task) ? 100 : 0;
        int fragmentationScore = 100 - (worker.getAvailableCores() * 100 / worker.getTotalCores());
        return localityScore * 3 + fragmentationScore;
    }
}
```

## 8.8 SQL 优化

### 8.8.1 CBO 优化器原理

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CBO 优化器工作流程                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SQL 文本                                                               │
│     │                                                                   │
│     ▼                                                                   │
│  ┌──────────┐                                                          │
│  │  Parser   │  →  AST (抽象语法树)                                     │
│  └──────────┘                                                          │
│     │                                                                   │
│     ▼                                                                   │
│  ┌──────────┐                                                          │
│  │ Analyzer  │  →  逻辑计划 (未优化)                                    │
│  └──────────┘                                                          │
│     │                                                                   │
│     ▼                                                                   │
│  ┌──────────┐                                                          │
│  │  RBO     │  →  逻辑计划 (规则优化后)                                 │
│  │ 规则优化  │     - 谓词下推                                            │
│  │          │     - 投影下推                                            │
│  │          │     - 常量折叠                                            │
│  │          │     - 子查询展开                                          │
│  └──────────┘                                                          │
│     │                                                                   │
│     ▼                                                                   │
│  ┌──────────┐                                                          │
│  │  CBO     │  →  逻辑计划 (代价优化后)                                 │
│  │ 代价优化  │     - Join 重排序                                        │
│  │          │     - Join 算法选择                                       │
│  │          │     - 聚合策略选择                                        │
│  │          │     - 扫描策略选择                                        │
│  └──────────┘                                                          │
│     │                                                                   │
│     ▼                                                                   │
│  ┌──────────┐                                                          │
│  │ 物理计划  │  →  分布式执行计划                                       │
│  │ 生成器    │     - 算子分布策略                                       │
│  │          │     - Shuffle 方式                                       │
│  │          │     - 并行度                                             │
│  └──────────┘                                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.8.2 代价模型

```
代价(Cost) = CPU代价 + I/O代价 + 网络代价 + 内存代价

CPU代价 = 行数 × 单行CPU成本
I/O代价 = 扫描字节数 / I/O带宽 + 随机I/O次数 × 平均延迟
网络代价 = 传输字节数 / 网络带宽
内存代价 = 所需内存 × 内存权重

Join代价估算:
- Hash Join: 构建侧行数 × 构建成本 + 探测侧行数 × 探测成本
- Sort-Merge Join: 排序成本(构建侧) + 排序成本(探测侧) + 合并成本
- Nested Loop: 构建侧行数 × 探测侧行数 × 单次比较成本

选择策略: 选择总代价最小的执行计划
```

### 8.8.3 统计信息收集

```sql
-- 收集表统计信息
ANALYZE TABLE sales_db.orders COMPUTE STATISTICS;

-- 收集列统计信息
ANALYZE TABLE sales_db.orders COMPUTE STATISTICS FOR COLUMNS order_id, customer_id, amount;

-- 收集直方图统计
ANALYZE TABLE sales_db.orders COMPUTE STATISTICS FOR COLUMNS amount WITH HISTOGRAM 100 BUCKETS;

-- 查看统计信息
SHOW STATS FOR sales_db.orders;

-- 自动统计信息收集配置
SET SESSION ae.auto_stats_enabled = true;
SET SESSION ae.auto_stats_threshold = 0.1;
SET SESSION ae.auto_stats_sample_ratio = 0.1;
```

### 8.8.4 执行计划解读

```sql
EXPLAIN ANALYZE
SELECT o.order_id, c.name, SUM(o.amount)
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= DATE '2024-01-01'
GROUP BY o.order_id, c.name
ORDER BY SUM(o.amount) DESC
LIMIT 10;
```

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Fragment 1 [SINGLE]                                                    │
│   TopN[10 by SUM(amount) DESC]                                         │
│     └── Exchange[GATHER]                                               │
│         Cost: cpu 0.00, memory 0.00, network 1.23KB                   │
│                                                                         │
│ Fragment 2 [HASH distributed on order_id]                              │
│   Aggregate[SUM(amount)] BY [order_id, name]                           │
│     └── Exchange[REPARTITION on order_id]                              │
│         Cost: cpu 12.50, memory 256.00MB, network 2.50GB              │
│                                                                         │
│ Fragment 3 [SOURCE]                                                    │
│   InnerJoin[customer_id = id] (HashJoin, Build: customers)             │
│     ├── ScanFilterProject[order_date >= 2024-01-01]                    │
│     │     table: orders, filter: 65.2% passed                          │
│     │     Cost: cpu 50.00, memory 0, network 0, I/O 12.5GB            │
│     └── Exchange[BROADCAST]                                            │
│         ├── ScanProject[id, name]                                      │
│         │     table: customers                                         │
│         │     Cost: cpu 2.00, memory 0, network 0, I/O 50MB           │
│                                                                         │
│ Statistics:                                                             │
│   Estimated rows: 6,520,000 → 4,245,000 (after filter)                │
│   Actual rows: 4,312,567                                               │
│   Peak memory: 312MB                                                    │
│   Total CPU time: 45.2s                                                 │
│   Total wall time: 8.3s                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## 8.9 性能基准测试

### 8.9.1 TPC-DS 结果

| 数据规模 | 查询数 | AE 2.0 | Spark 3.5 | Trino 440 | Dremio 24 |
|----------|--------|--------|-----------|-----------|-----------|
| 1TB | 99 | 287s | 412s | 856s | 395s |
| 10TB | 99 | 2,150s | 3,280s | 7,120s | 3,100s |
| 100TB | 99 | 18,500s | 28,900s | N/A | 27,200s |

### 8.9.2 TPC-H 结果

| 数据规模 | AE 2.0 | Spark 3.5 | Trino 440 |
|----------|--------|-----------|-----------|
| 100GB | 45s | 68s | 125s |
| 1TB | 380s | 560s | 1,050s |
| 10TB | 3,200s | 4,800s | 9,500s |

## 8.10 调优参数完整参考

### 8.10.1 计算参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| ae.executor.max_parallelism | 16 | 1-256 | 单查询最大并行度 |
| ae.executor.pipeline_enabled | true | boolean | 启用流水线执行 |
| ae.executor.codegen_enabled | true | boolean | 启用代码生成 |
| ae.executor.vectorized_enabled | true | boolean | 启用向量化执行 |
| ae.executor.batch_size | 1024 | 256-65536 | 向量化批处理大小 |

### 8.10.2 内存参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| ae.memory.heap_size | 自动 | 256m-256g | 堆内存大小 |
| ae.memory.off_heap_ratio | 0.5 | 0.1-0.8 | 堆外内存比例 |
| ae.memory.spill_enabled | true | boolean | 启用溢写 |
| ae.memory.query_max | 4GB | 256m-64g | 单查询最大内存 |
| ae.memory.pool_reserved | 0.2 | 0.1-0.4 | 保留内存比例 |

### 8.10.3 I/O 参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| ae.io.compression | zstd | snappy/lz4/zstd/gzip | 默认压缩算法 |
| ae.io.max_buffer_size | 64MB | 1m-512m | I/O 缓冲区大小 |
| ae.io.prefetch_enabled | true | boolean | 启用预读 |
| ae.io.prefetch_size | 1MB | 64k-64m | 预读大小 |
| ae.io.cache_enabled | true | boolean | 启用数据缓存 |

### 8.10.4 网络参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| ae.network.shuffle_compression | lz4 | snappy/lz4/zstd/none | Shuffle 压缩 |
| ae.network.shuffle_partitions | 200 | 1-10000 | Shuffle 分区数 |
| ae.network.buffer_size | 64KB | 4k-16m | 网络缓冲区大小 |
| ae.network.max_connections | 1000 | 10-10000 | 最大连接数 |
| ae.network.connection_timeout | 10s | 1s-60s | 连接超时 |

### 8.10.5 调度参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| ae.schedule.strategy | adaptive | round-robin/least-loaded/adaptive | 调度策略 |
| ae.schedule.locality_wait | 3s | 0s-30s | 本地性等待时间 |
| ae.schedule.speculative_enabled | true | boolean | 启用推测执行 |
| ae.schedule.speculative_delay | 30s | 10s-120s | 推测执行延迟 |
| ae.schedule.task_timeout | 300s | 30s-3600s | 任务超时 |

### 8.10.6 优化器参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| ae.optimizer.type | cbo | rbo/cbo/adaptive | 优化器类型 |
| ae.optimizer.join_reordering | true | boolean | 启用 Join 重排序 |
| ae.optimizer.filter_pushdown | true | boolean | 启用谓词下推 |
| ae.optimizer.statistics_enabled | true | boolean | 启用统计信息 |
| ae.optimizer.max_plans | 1000 | 10-100000 | 最大计划搜索数 |

## 8.11 性能问题诊断指南

### 8.11.1 诊断工具箱

| 工具 | 用途 | 命令 |
|------|------|------|
| EXPLAIN ANALYZE | 查看执行计划 | EXPLAIN ANALYZE SELECT ... |
| ae-profile | 查询Profile | ae-cli profile show <query_id> |
| JFR | Java Flight Recorder | jcmd <pid> JFR.start |
| jstack | 线程转储 | jstack <pid> |
| jmap | 堆转储 | jmap -heap <pid> |
| arthas | 在线诊断 | java -jar arthas-boot.jar |
| flamegraph | 火焰图 | perf record / async-profiler |

### 8.11.2 常见性能问题与解决方案

| 问题 | 症状 | 诊断 | 解决方案 |
|------|------|------|----------|
| 全表扫描 | 扫描行数远大于输出行数 | EXPLAIN ANALYZE | 添加分区、添加索引、谓词下推 |
| Join 爆炸 | 输出行数远超预期 | 检查 Join 条件 | 添加过滤条件、使用 Broadcast |
| 数据倾斜 | 部分任务极慢 | 检查分区统计 | Salting、两阶段聚合 |
| 内存不足 | 频繁 Spill | 检查内存指标 | 增加内存、优化查询 |
| Shuffle 过大 | 网络瓶颈 | 检查 Shuffle 数据量 | 减少 Shuffle、压缩传输 |
| GC 停顿 | 延迟毛刺 | GC 日志分析 | 调整 GC 参数、减少分配 |
| 锁竞争 | CPU 利用率低 | 线程转储 | 减少锁粒度、使用无锁结构 |

# 第9章：演进路线图（扩展版）

## 9.1 版本规划全景

### 9.1.1 四阶段演进总览

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AE 版本演进全景图                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Phase 1: 核心稳定版        Phase 2: AI-Native                          │
│  v1.0 - v1.5               v2.0 - v2.5                                 │
│  ┌─────────────────┐       ┌─────────────────┐                         │
│  │• SQL 标准兼容    │       │• NL2SQL          │                         │
│  │• 分布式执行     │       │• AI 优化器        │                         │
│  │• 基础 HA        │       │• 异常检测         │                         │
│  │• 多数据源       │       │• Copilot 交互     │                         │
│  │• 安全认证       │       │• 智能索引推荐     │                         │
│  │ 2024 Q1-Q4      │       │ 2025 Q1-Q4        │                         │
│  └─────────────────┘       └─────────────────┘                         │
│           │                        │                                    │
│           ▼                        ▼                                    │
│  Phase 3: 云原生增强        Phase 4: 全自主平台                         │
│  v3.0 - v3.5               v4.0+                                      │
│  ┌─────────────────┐       ┌─────────────────┐                         │
│  │• Serverless      │       │• 自治调优         │                         │
│  │• 联邦查询        │       │• 自愈机制         │                         │
│  │• 边缘计算        │       │• 意图接口         │                         │
│  │• 多云管理        │       │• 碳感知调度       │                         │
│  │• 弹性调度        │       │• 全自主运维       │                         │
│  │ 2026 Q1-Q4      │       │ 2027+             │                         │
│  └─────────────────┘       └─────────────────┘                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.1.2 版本发布节奏

| 版本 | 时间 | 类型 | 主要特性 | 兼容性 |
|------|------|------|----------|--------|
| v1.0 | 2024 Q1 | GA | SQL引擎、分布式执行 | - |
| v1.1 | 2024 Q2 | 功能 | 性能优化、更多数据源 | 向后兼容 |
| v1.2 | 2024 Q3 | 功能 | 安全增强、资源管理 | 向后兼容 |
| v1.5 | 2024 Q4 | LTS | 稳定性增强、Bug修复 | 向后兼容 |
| v2.0 | 2025 Q1 | Major | AI-Native特性 | 需迁移 |
| v2.1 | 2025 Q2 | 功能 | NL2SQL增强 | 向后兼容 |
| v2.5 | 2025 Q4 | LTS | AI特性稳定版 | 向后兼容 |
| v3.0 | 2026 Q1 | Major | Serverless | 需迁移 |
| v3.5 | 2026 Q4 | LTS | 云原生稳定版 | 向后兼容 |
| v4.0 | 2027 H1 | Major | 自治平台 | 需迁移 |

## 9.2 Phase 1 核心稳定版详细规格

### 9.2.1 功能清单与验收标准

#### 9.2.1.1 SQL 引擎

| 功能 | 优先级 | 验收标准 | 目标版本 |
|------|--------|----------|----------|
| SELECT 基础查询 | P0 | TPC-DS 99查询全部通过 | v1.0 |
| JOIN (Inner/Left/Right/Full) | P0 | 所有JOIN类型正确性验证 | v1.0 |
| 子查询 | P0 | 相关/非相关子查询支持 | v1.0 |
| 窗口函数 | P0 | 支持所有标准窗口函数 | v1.0 |
| CTE (WITH) | P0 | 递归CTE支持 | v1.0 |
| DDL (CREATE/ALTER/DROP) | P0 | 完整DDL支持 | v1.0 |
| DML (INSERT/UPDATE/DELETE) | P1 | ACID事务支持 | v1.1 |
| 存储过程 | P2 | PL/SQL兼容 | v1.2 |
| 自定义函数(UDF) | P1 | Java/Python UDF | v1.1 |

#### 9.2.1.2 分布式执行

| 功能 | 优先级 | 验收标准 | 目标版本 |
|------|--------|----------|----------|
| MPP 分布式执行 | P0 | 10+节点线性扩展 | v1.0 |
| 流水线执行引擎 | P0 | 算子融合率>80% | v1.0 |
| 动态分区裁剪 | P0 | 分区查询性能提升10x | v1.0 |
| 自适应执行 | P1 | 运行时调整并行度 | v1.1 |
| 推测执行 | P1 | 慢任务自动重试 | v1.1 |
| 多租户资源隔离 | P1 | 资源组隔离验证 | v1.2 |

#### 9.2.1.3 高可用

| 功能 | 优先级 | 验收标准 | 目标版本 |
|------|--------|----------|----------|
| Coordinator HA | P0 | Raft选主<10s | v1.0 |
| 自动故障转移 | P0 | Worker故障自动恢复 | v1.0 |
| 元数据备份恢复 | P0 | RPO<1h | v1.0 |
| 滚动升级 | P1 | 零停机升级 | v1.1 |
| 跨区域容灾 | P2 | RPO<5min | v1.2 |

### 9.2.2 时间线

```
2024 Q1 (v1.0 GA)
├── 1月: SQL引擎核心完成
├── 2月: 分布式执行框架完成
├── 3月: HA + 安全 + 发布

2024 Q2 (v1.1)
├── 4月: DML + UDF
├── 5月: 自适应执行
├── 6月: 性能优化 + 发布

2024 Q3 (v1.2)
├── 7月: 资源管理 + 多租户
├── 8月: 存储过程
├── 9月: 跨区域容灾 + 发布

2024 Q4 (v1.5 LTS)
├── 10月: 稳定性测试
├── 11月: Bug修复 + 性能调优
├── 12月: LTS发布
```

## 9.3 Phase 2 AI-Native 特性详细规格

### 9.3.1 NL2SQL 架构设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     NL2SQL 架构设计                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  用户自然语言输入                                                        │
│  "查询上个月销售额最高的前10个客户"                                       │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    意图理解层                                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │  │
│  │  │ 实体识别  │  │ 意图分类  │  │ 上下文   │                      │  │
│  │  │ (NER)    │  │          │  │ 管理     │                      │  │
│  │  └──────────┘  └──────────┘  └──────────┘                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Schema 感知层                                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │  │
│  │  │ 表匹配   │  │ 列映射   │  │ 关系推理  │                      │  │
│  │  └──────────┘  └──────────┘  └──────────┘                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    SQL 生成层                                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │  │
│  │  │ 模板匹配  │  │ LLM 生成  │  │ 校验修正  │                      │  │
│  │  └──────────┘  └──────────┘  └──────────┘                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│       │                                                                 │
│       ▼                                                                 │
│  SELECT customer_name, SUM(amount) AS total_sales                      │
│  FROM orders o JOIN customers c ON o.customer_id = c.id                │
│  WHERE o.order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1' MONTH) │
│  GROUP BY customer_name                                                │
│  ORDER BY total_sales DESC                                              │
│  LIMIT 10                                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.3.2 AI 优化器设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AI 优化器架构                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    传统 CBO 优化器                                 │  │
│  │  基于规则的优化 + 代价模型                                        │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │                                          │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    AI 增强层                                      │  │
│  │                                                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │ 学习型代价    │  │ 执行计划     │  │ 自适应执行   │          │  │
│  │  │ 模型         │  │ 推荐         │  │ 调整         │          │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │  │
│  │                                                                  │  │
│  │  输入: 查询特征 + 历史执行数据 + 集群状态                        │  │
│  │  输出: 最优执行计划 + 置信度                                     │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  特性:                                                                  │
│  1. 基于历史查询学习代价模型                                            │
│  2. 考虑集群实时负载状态                                                │
│  3. 执行中动态调整计划                                                  │
│  4. 自动学习数据分布特征                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.3.3 异常检测算法

| 算法 | 检测类型 | 延迟 | 准确率 | 适用场景 |
|------|----------|------|--------|----------|
| Z-Score | 查询延迟异常 | < 1s | 85% | 单指标异常 |
| IQR | 资源使用异常 | < 1s | 80% | 单指标异常 |
| Isolation Forest | 多维异常 | < 5s | 92% | 复合异常 |
| LSTM Autoencoder | 时序异常 | < 10s | 95% | 趋势异常 |
| Statistical Process Control | 性能退化 | < 1s | 88% | 渐进退化 |

### 9.3.4 Copilot 交互设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AE Copilot 交互界面                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  AE Copilot                                        [设置] [帮助] │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  👤 帮我分析一下最近7天的销售趋势                                │   │
│  │                                                                 │   │
│  │  🤖 我为您生成了以下SQL查询：                                    │   │
│  │                                                                 │   │
│  │  ```sql                                                         │   │
│  │  SELECT DATE(order_date) AS day,                                │   │
│  │         SUM(amount) AS daily_sales,                             │   │
│  │         AVG(amount) AS avg_order_value                          │   │
│  │  FROM sales_db.orders                                           │   │
│  │  WHERE order_date >= CURRENT_DATE - INTERVAL '7' DAY            │   │
│  │  GROUP BY DATE(order_date)                                      │   │
│  │  ORDER BY day;                                                  │   │
│  │  ```                                                            │   │
│  │                                                                 │   │
│  │  📊 执行结果：                                                  │   │
│  │  ┌────────────┬─────────────┬────────────────┐                  │   │
│  │  │ day        │ daily_sales │ avg_order_value │                  │   │
│  │  ├────────────┼─────────────┼────────────────┤                  │   │
│  │  │ 2024-01-09 │    125,430  │       89.50    │                  │   │
│  │  │ 2024-01-10 │    138,920  │       92.30    │                  │   │
│  │  │ ...        │    ...      │       ...      │                  │   │
│  │  └────────────┴─────────────┴────────────────┘                  │   │
│  │                                                                 │   │
│  │  💡 分析：过去7天销售额整体呈上升趋势，                          │   │
│  │     其中1月12日达到峰值 ¥156,780。                              │   │
│  │     建议进一步分析该日促销活动效果。                             │   │
│  │                                                                 │   │
│  │  [执行] [修改SQL] [可视化] [导出] [继续分析]                    │   │
│  │                                                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  输入问题或SQL...                                    [发送] 🎤  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 9.4 Phase 3 云原生增强详细规格

### 9.4.1 Serverless 执行模型设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Serverless 执行模型                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │  Client   │                                                          │
│  └─────┬────┘                                                          │
│        │ SQL                                                            │
│        ▼                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Gateway / Router                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │ 认证     │  │ 限流     │  │ 路由     │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │                                          │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    Coordinator (常驻)                             │  │
│  │  解析 → 优化 → 生成执行计划                                      │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │                                          │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    Worker Pool (按需启动)                         │  │
│  │                                                                  │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │  │
│  │  │ W1  │ │ W2  │ │ W3  │ │ W4  │ │ W5  │ ← 按查询需求动态创建  │  │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                      │  │
│  │                                                                  │  │
│  │  冷启动: < 2s (Warm Pool) / < 10s (Cold Start)                  │  │
│  │  缩容: 空闲 60s 后自动回收                                       │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  计费模型: 按查询扫描数据量 + 计算时间计费                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.4.2 联邦查询架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     联邦查询架构                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    AE Federation Layer                            │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │              全局优化器                                   │    │  │
│  │  │  跨源代价估算 + 最优下推决策 + 数据移动最小化            │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │                                                                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │
│  │  │Connector │ │Connector │ │Connector │ │Connector │          │  │
│  │  │ MySQL    │ │PostgreSQL│ │ MongoDB  │ │  Redis   │          │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │
│  │  │Connector │ │Connector │ │Connector │ │Connector │          │  │
│  │  │ Iceberg  │ │  Delta   │ │  Hudi    │ │  ES     │          │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │  │
│  │  │Connector │ │Connector │ │Connector │                        │  │
│  │  │  Kafka   │ │  API     │ │  File    │                        │  │
│  │  └──────────┘ └──────────┘ └──────────┘                        │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  示例:                                                                  │
│  SELECT o.*, c.name, p.category                                       │
│  FROM mysql.orders o                                                   │
│  JOIN postgres.customers c ON o.customer_id = c.id                     │
│  JOIN iceberg.products p ON o.product_id = p.id                        │
│  WHERE o.order_date = CURRENT_DATE                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.4.3 边缘计算架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     边缘计算架构                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    云端 (Cloud)                                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │全局协调器 │  │全局元数据 │  │冷数据存储 │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │ WAN                                      │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    边缘层 (Edge)                                  │  │
│  │                                                                  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐                       │  │
│  │  │ Edge Node 1     │  │ Edge Node 2     │                       │  │
│  │  │ ┌─────────────┐ │  │ ┌─────────────┐ │                       │  │
│  │  │ │ AE Lite     │ │  │ │ AE Lite     │ │                       │  │
│  │  │ │ (轻量引擎)   │ │  │ │ (轻量引擎)   │ │                       │  │
│  │  │ ├─────────────┤ │  │ ├─────────────┤ │                       │  │
│  │  │ │本地热数据    │ │  │ │本地热数据    │ │                       │  │
│  │  │ │缓存         │ │  │ │缓存         │ │                       │  │
│  │  │ └─────────────┘ │  │ └─────────────┘ │                       │  │
│  │  └─────────────────┘  └─────────────────┘                       │  │
│  │                                                                  │  │
│  │  特性:                                                           │  │
│  │  - 断网可用: 本地数据可独立查询                                  │  │
│  │  - 数据同步: 云端→边缘增量同步                                   │  │
│  │  - 查询下推: 边缘可处理的查询不下发云端                          │  │
│  │  - 资源占用: < 2C4G                                              │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 9.5 Phase 4 全自主平台详细规格

### 9.5.1 自治调优算法

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     自治调优系统架构                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    监控数据采集                                    │  │
│  │  查询指标 + 系统指标 + 资源指标 + 业务指标                       │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │                                          │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    异常检测引擎                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │性能退化   │  │资源瓶颈   │  │配置不当   │                       │  │
│  │  │检测       │  │检测       │  │检测       │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │                                          │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    调优决策引擎                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │参数调优   │  │索引推荐   │  │SQL重写   │                       │  │
│  │  │建议       │  │           │  │建议       │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │                                          │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    执行与验证                                      │  │
│  │  自动应用 → A/B测试 → 效果验证 → 永久生效/回滚                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.5.2 自愈机制

| 故障类型 | 检测方式 | 自愈动作 | 恢复时间 |
|----------|----------|----------|----------|
| Worker OOM | 进程退出 | 自动重启 + 降低内存限制 | < 30s |
| 慢查询 | 超时检测 | 自动Kill + 降级执行 | < 60s |
| 磁盘满 | 监控告警 | 自动清理Spill/日志 | < 5min |
| 元数据不一致 | 校验检测 | 自动修复 + 告警 | < 10min |
| 查询计划劣化 | 性能回归检测 | 自动切换到历史最优计划 | < 1s |
| 网络抖动 | 心跳检测 | 自动重试 + 路由切换 | < 10s |
| 资源争抢 | 队列深度检测 | 自动扩容 + 调整优先级 | < 3min |

### 9.5.3 意图接口设计

```sql
-- 意图接口示例

-- 传统SQL
INTENT '分析销售趋势'
→ 自动生成: SELECT DATE_TRUNC('month', order_date), SUM(amount) ...

-- 数据探索
INTENT '找出异常订单'
→ 自动生成: SELECT * FROM orders WHERE amount > (SELECT AVG(amount) + 3*STDDEV(amount) FROM orders)

-- 数据质量
INTENT '检查customers表数据质量'
→ 自动生成:
-- 1. 空值检查
-- 2. 唯一性检查
-- 3. 格式检查
-- 4. 引用完整性检查

-- 优化建议
INTENT '优化这个查询' USING 'SELECT ...'
→ 返回优化建议和重写后的SQL

-- 数据治理
INTENT '标记PII字段'
→ 自动识别并标记包含个人信息的字段
```

### 9.5.4 碳感知调度

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     碳感知调度架构                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    碳排放数据源                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │电网碳强度 │  │区域PUE    │  │服务器功耗 │                       │  │
│  │  │实时数据   │  │数据       │  │模型       │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────┬───────────────────────────────────────┘  │
│                              │                                          │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    碳感知调度器                                    │  │
│  │                                                                  │  │
│  │  调度策略:                                                        │  │
│  │  1. 优先调度到低碳强度区域                                        │  │
│  │  2. 可延迟查询调度到低碳时段                                      │  │
│  │  3. 高碳时段降低非关键查询优先级                                  │  │
│  │  4. 碳预算超限时拒绝低优先级查询                                  │  │
│  │                                                                  │  │
│  │  碳排放计算:                                                      │  │
│  │  碳排放(gCO2) = 功耗(kWh) × PUE × 电网碳强度(gCO2/kWh)          │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 9.6 技术债务跟踪与偿还计划

### 9.6.1 技术债务清单

| ID | 类别 | 描述 | 影响 | 优先级 | 计划偿还版本 |
|----|------|------|------|--------|-------------|
| TD-001 | 架构 | 元数据存储耦合PostgreSQL | 限制扩展性 | 高 | v2.0 |
| TD-002 | 代码 | 优化器规则硬编码 | 难以扩展 | 中 | v2.0 |
| TD-003 | 测试 | 集成测试覆盖率不足 | 质量风险 | 高 | v1.5 |
| TD-004 | 文档 | API文档不完整 | 用户困难 | 中 | v1.5 |
| TD-005 | 性能 | 小文件读取效率低 | 性能瓶颈 | 高 | v2.0 |
| TD-006 | 安全 | 部分通信未加密 | 安全风险 | 高 | v1.2 |
| TD-007 | 运维 | 缺乏自动诊断工具 | 运维效率低 | 中 | v2.0 |
| TD-008 | 代码 | 错误处理不统一 | 用户体验差 | 中 | v1.5 |

### 9.6.2 偿还节奏

```
每个版本分配 20% 开发资源用于技术债务偿还

v1.5: TD-003, TD-004, TD-008
v2.0: TD-001, TD-002, TD-005, TD-007
v2.5: TD-006 (完善)
v3.0: 架构级技术债务集中偿还
```

## 9.7 社区与生态建设路线图

### 9.7.1 社区建设计划

| 阶段 | 时间 | 目标 | 关键活动 |
|------|------|------|----------|
| 孵化期 | 2024 Q1-Q2 | 初始社区 | 开源核心代码、建立治理结构 |
| 成长期 | 2024 Q3-Q4 | 100+ 贡献者 | Hackathon、Meetup、文档完善 |
| 壮大期 | 2025 全年 | 500+ 贡献者 | 插件生态、认证计划、企业社区 |
| 成熟期 | 2026+ | 1000+ 贡献者 | 基金会托管、国际社区 |

### 9.7.2 生态建设

| 生态方向 | 计划 | 时间 |
|----------|------|------|
| BI 工具集成 | Tableau/PowerBI/Superset 插件 | v1.0+ |
| 数据集成 | Airflow/dbt/Flink 连接器 | v1.1+ |
| 数据格式 | Iceberg/Delta/Hudi 原生支持 | v1.0+ |
| 编程接口 | Python/Go/Rust SDK | v1.2+ |
| 可视化 | 内置可视化组件 | v2.0+ |
| AI 集成 | LangChain/LlamaIndex 插件 | v2.0+ |

## 9.8 兼容性承诺与废弃策略

### 9.8.1 兼容性承诺

| 类型 | 承诺 | 说明 |
|------|------|------|
| SQL 语法 | 向后兼容 | 新版本不破坏已有SQL |
| JDBC/ODBC | 向后兼容 | 驱动接口不删除 |
| REST API | 至少2个版本 | 废弃API保留2个大版本 |
| 配置文件 | 向后兼容 | 旧配置自动迁移 |
| 元数据 | 迁移工具 | 提供自动迁移脚本 |
| 客户端协议 | 至少2个版本 | 旧客户端可连接新服务端 |

### 9.8.2 废弃流程

```
1. 标记废弃 (Deprecated)
   ├── 在文档中标注
   ├── 在日志中输出警告
   └── 至少保留1个大版本

2. 计划移除 (Planned Removal)
   ├── 在 Release Notes 中公告
   ├── 提供替代方案
   └── 至少提前2个大版本通知

3. 正式移除 (Removed)
   ├── 代码删除
   └── 迁移指南永久保留
```

## 9.9 安全演进计划

| 版本 | 安全特性 | 说明 |
|------|----------|------|
| v1.0 | 基础认证 | 密码认证、TLS |
| v1.1 | 增强认证 | LDAP、Kerberos |
| v1.2 | 细粒度授权 | RBAC、行级权限 |
| v2.0 | 数据加密 | 列级加密、TDE |
| v2.1 | 审计增强 | 完整审计日志、合规报告 |
| v2.5 | 零信任 | mTLS、动态令牌 |
| v3.0 | 数据脱敏 | 动态脱敏、静态脱敏 |
| v3.5 | 安全自动化 | 漏洞扫描、自动修复 |
| v4.0 | AI安全 | 异常行为检测、智能防护 |

## 9.10 性能演进目标

### 9.10.1 逐年性能目标

| 指标 | v1.0 (2024) | v2.0 (2025) | v3.0 (2026) | v4.0 (2027) |
|------|-------------|-------------|-------------|-------------|
| TPC-DS 1TB | 287s | 200s | 150s | 100s |
| TPC-DS 10TB | 2,150s | 1,500s | 1,000s | 700s |
| 并发查询 | 100 | 500 | 2,000 | 10,000 |
| P99 延迟 | 30s | 15s | 8s | 3s |
| 冷启动 | N/A | 10s | 2s | < 1s |
| 扩展性 | 10节点 | 50节点 | 200节点 | 1000节点 |

### 9.10.2 基准测试演进

| 版本 | 基准 | 说明 |
|------|------|------|
| v1.x | TPC-DS + TPC-H | 标准基准 |
| v2.x | + ClickBench + TPCx-BB | 扩展基准 |
| v3.x | + 自定义云原生基准 | Serverless场景 |
| v4.x | + AI工作负载基准 | AI-Native场景 |

## 9.11 人才与组织演进

### 9.11.1 团队规模规划

| 阶段 | 时间 | 核心团队 | 社区贡献者 | 关键岗位 |
|------|------|----------|-----------|----------|
| Phase 1 | 2024 | 15-20人 | 10-30人 | SQL引擎、执行引擎、存储 |
| Phase 2 | 2025 | 30-40人 | 50-100人 | + AI/ML工程师、产品经理 |
| Phase 3 | 2026 | 50-70人 | 200-500人 | + 云原生工程师、SRE |
| Phase 4 | 2027+ | 80-100人 | 500-1000人 | + 算法工程师、安全专家 |

### 9.11.2 关键能力建设

| 能力 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|
| SQL引擎 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 分布式系统 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| AI/ML | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 云原生 | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 安全 | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 产品设计 | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 开发者关系 | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

### 9.11.3 知识管理体系

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     知识管理体系架构                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    知识创建                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │技术文档   │  │设计决策   │  │故障复盘   │                       │  │
│  │  │(RFC)     │  │记录(ADR) │  │报告       │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    知识存储                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │内部Wiki  │  │代码注释   │  │培训材料   │                       │  │
│  │  │          │  │+ README  │  │          │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    知识传播                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │  │
│  │  │技术分享   │  │Mentorship│  │Onboarding│                       │  │
│  │  │(每周)    │  │(1对1)    │  │(新成员)   │                       │  │
│  │  └──────────┘  └──────────┘  └──────────┘                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```