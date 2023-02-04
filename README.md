# WigglePaw

## Dependency

- [pnpm](https://pnpm.js.org/) -- a fast, disk space efficient package manager.
- [docker](https://www.docker.com/) -- a platform for developers and sysadmins to develop, ship, and run applications.
- [docker-compose](https://docs.docker.com/compose/) -- a tool for defining and running multi-container Docker applications.

## Setting up a Development Environment

1. Clone the repository
2. Run `cp .env.example .env`: Copy the example environment file to a new file called `.env`
3. Change the values in `.env` as needed
4. Run `docker-compose up`: Start and run services defined in the docker-compose.yml file.
   - Alternatively, you can use the [vscode devcontainer](https://code.visualstudio.com/docs/remote/containers)
   - For now, it will start a PostgreSQL database
5. Run `pnpm install`: Install project dependencies.
6. Run `pnpm prisma db push`: Push the Prisma schema to the database.
7. Run `pnpm dev`: Run project in development mode with local web server and live reloading.
8. Open [localhost:3000](http://localhost:3000) in your browser.

## Useful Commands

- `pnpm install`: Install project dependencies, will also run `pnpm prisma db push` and `pnpm prisma studio` after installation. Try this first if you are having weird trouble with the project.
- `pnpm dev`: Run project in development mode with local web server and live reloading.
- `pnpm test`: Run tests.
- `pnpm build`: Build project for production.
- `pnpm prisma db push`: Push the Prisma schema to the database.
- `pnpm prisma studio`: Open Prisma Studio, a GUI for viewing and editing data in your database.

## Additional Dependencies

In addition to the default T3 Stack dependencies, this project also uses the following:

- [react-hook-form](https://react-hook-form.com/) -- Performant, flexible and extensible forms with easy-to-use validation.

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
