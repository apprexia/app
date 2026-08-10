# Apprexia

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Mise en prod 

Depuis le projet en local, ouvrir un terminal et exécuter ces commandes :
```bash
ng build --configuration production
scp -i ~/.ssh/id_ed25519_apprexia_vps -r dist/apprexia/browser/* ubuntu@164.132.243.10:/tmp/apprexia/
```
Une fois fini, il faut d'abord se connecter au VPS :
```bash
ssh -i ~/.ssh/id_ed25519_apprexia_vps ubuntu@164.132.243.10
```
Et exécuter ces commandes pour mettre à jour le front :
```bash
sudo rm -rf /var/www/apprexia/*
sudo cp -r /tmp/apprexia/* /var/www/apprexia/
sudo chown -R www-data:www-data /var/www/apprexia
```
Contrôle à faire depuis le VPS une les commandes ci-dessus exécuter :
```bash
ls -lah /var/www/apprexia
```
puis
```bash
ls -lah /var/www/apprexia
```
On doit obtenir :
```bash 
syntax is ok
test is successful
```
Si ok, on recharge Nginx :
```bash 
sudo systemctl reload nginx
```
