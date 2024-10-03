<h1 align="center"> Scylla Studio </h1>

<img src="./.github/assets/logo.png" width=90 align="left" />

**Scylla Studio** is a front-end application designed for the ScyllaDB ecosystem, inspired by tools like Drizzle and Prisma Studio. It provides an intuitive interface for managing your ScyllaDB keyspaces and tables, integrating essential performance metrics, and offering a unified solution to interact with both local and cloud-based ScyllaDB clusters.

## Key Features

- **Visual Management of Keyspaces and Tables:**
  Create, edit, and visualize keyspaces and tables directly from the interface.

- **Integrated Metrics Monitoring:**
  Leverages ScyllaDB's Prometheus and Grafana integrations to display important metrics within the app.

- **Cluster Connectivity:**
  Easily connect to your local cluster using `https://local.scylladb.studio` or manage cloud-based clusters.

- **NextJS 14 Frontend:**
  Built using NextJS 14 for optimal performance, scalability, and a seamless developer experience.

- **Third-Party ScyllaDB JavaScript Driver:**
  Powered by the [daniel-boll/scylla-javascript-driver](https://github.com/daniel-boll/scylla-javascript-driver), a Rust-wrapped library for high-performance ScyllaDB interactions.

## Technologies Used

- **NextJS 14** - The latest version of NextJS for front-end development.
- **ScyllaDB** - Distributed database system for high-throughput workloads.
- **Prometheus & Grafana** - For monitoring ScyllaDB metrics.
- **Rust & JavaScript Driver** - A community-driven driver for ScyllaDB, wrapped in Rust for performance.

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/basementdevs/scylla-studio.git
   cd scylla-studio
   ```

2. **Install Dependencies:**

   ```bash
   pnpm i
   ```

3. **Start Development Server:**

   ```bash
   pnpm dev
   ```

4. **Create a Docker Network:**

    ```bash
    docker network create ws-scylla
    ```

5. **Run a ScyllaDB Instance:**

    ```bash
     docker run --name scylla --network ws-scylla -p "9042:9042" -d scylladb/scylla:6.1.2 \
      --overprovisioned 1 \
      --smp 1
    ```

6. **Check your ScyllaDB Instance:**

    ```bash
    # Check for UN status
    docker exec -it scylla nodetool status

    # Check if the Shell works
    docker exec -it scylla cqlsh
    ```

7. **Access the Studio:**
   Once the server is up, visit [https://localhost:3000](https://localhost:3000) to start interacting with your ScyllaDB clusters.

## Roadmap

- **Support for Indexes and Materialized Views:**
  Future versions will include advanced schema management for indexes and materialized views.

- **User Authentication & Roles:**
  Role-based access control for managing permissions across team members.

- **Enhanced Metrics Dashboard:**
  Deeper integration with Grafana for real-time monitoring and custom alerts.

## Contributing

Scylla Studio is an open-source project in collaboration with the **Basement Devs**, a community focused on helping people access better opportunities in Europe and the USA.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
