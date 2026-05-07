# Etapa 1: Construcción (Build)
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y generamos el build
COPY . .
RUN npm run build

# Etapa 2: Servidor de producción (Nginx)
FROM nginx:stable-alpine

# IMPORTANTE: En Vite la carpeta de salida es 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: Copiar una configuración personalizada de Nginx si usas React Router
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
