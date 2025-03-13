# Dwengo-2

## Configuration and Deployement

This project is configured to have 2 modules, each forming a subproject:

```
.
├── backend
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

If you want to develop inside one of the containers,
you can attach your running VSCode session to this container using ``CTRL + SHIFT + P``,
then selecting ``Attach to running container``.

### Debugging during development

The project's setup allows for simplified debugging during development.
When you work on a feature,
we expect you to do so by running the containers and attaching to the container for development.
Encountering issues with the toolchain can then be solved by the following checklist:

#### Latest containers

- **stop all running instances** of the Dwengo-containers by performing the following command from the root of the project's directory structure

```bash
docker compose down
```

- **clean all images and containers**, if you don't have any other Docker images on your system, you can do this very quickly by using the command below. *Pro tip: if you don't have any other Docker Containers you actively have running, you can set this as a(n) (ana)cron job on Linux systems. If you then always pull the latest updates before spinning up the containers, you will always have the latest versions*.

```bash
docker system prune -f -a
```

- **rebuild the containers from their latest image** by pulling the latest commits to your local repository and using

```bash
docker compose up
```

#### Develop inside the container

Make sure you are developing inside the container, if you haven't installed all it's requirements and dependencies locally.

#### Install dependencies

If you do choose to work on your local system, just run the command below from the backend's root folder (`/backend`):

```bash
npm install
```

#### Post an issue

If you still encounter issues, feel free to post an issue on our issues page.
You may always assign our Tech Lead (Bram Comyn).
Make sure to specify the following:

- current branch
- your OS/whether you're working inside the container
- screenshot or stack trace of any errors you are facing
