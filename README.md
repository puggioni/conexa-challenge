## Pasos para correr el proyecto

```bash
#.env (DEBEN SETEAR EL .ENV IDENTICO AL QUE ESTA AQUI)
$PORT=3000
$JWT_SECRET=secret
$DB_URI=mongodb+srv://user:t3VZlod7xE74HFkH@conexa-challenge.6boss.mongodb.net/conexa-challenge

# levantar imagen de docker (CORRER ESTE COMANDO EN LA CARPETA RAIZ DEL PROYECTO)
$ docker build -t conexa-challenge .

# levantar el contenedor que correra la aplicacion (CORRER ESTE COMANDO EN LA CARPETA RAIZ DEL PROYECTO)
$ docker-compose up
```

## Run tests

```bash
# e2e tests
$ npm run test:e2e

```

## Documentacion

Para ir a la documentacion (hecha con swagger) deben dirigirse a http://localhost:3001/api

Sin embargo, para ejecutar los endpoints, utilicen [POSTMAN](https://lunar-water-909224.postman.co/workspace/New-Team-Workspace~ef537e71-00a0-4d34-b702-e3c1e9b86640/collection/26019180-70ba785c-099e-4bb0-a8c4-a7efedef1866?action=share&creator=26019180) con el metodo de autenticacion bearer token en los endpoints que sean requeridos (todos los endpoints de movies).
