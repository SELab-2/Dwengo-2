# Dwengo-2

## Configuration and Deployement

This project is configured to have 3 modules, each forming a subproject:

```
.
├── backend
├── database
├── frontend
├── LICENSE
└── README.md
```

These names are also used to name the specific services of this application.
The project is currently still **under development**,
we will update the configuration and test it in the future to prepare for deployment to production environments.

To deploy this project,
make sure you have [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed and configured on your system.
The [Dockerfile](./Dockerfile) under the project's root configures 3 containers,
one for each module.

### Build the application containers

```
docker compose up --build
```

### Start the services

```
docker compose up
```

### Stop the services

```
docker compose down
```

### Other Docker Compose commands

We link to the [Docker Compose documentation](https://docs.docker.com/compose/intro/compose-application-model/) for more information.

### Dev Containers

The team makes use of [VSCode Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) to streamline development.
Each of the subprojects can be opened in a container,
where the developer can then make use of the running (containerized) services.

### Caveats and Debug tips:

- It is important to **pay attention to what ports you bind the containers**.
The [compose.yaml](./compose.yaml) file uses a **static binding to the default ports**,
so it is important to note that you can **only start one instance of each service** in this way **at the same time**.
