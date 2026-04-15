# --- Stage 1: Build React Assets ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Final Production Image ---
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip libzip-dev unzip git curl \
    && docker-php-ext-install gd pdo pdo_mysql zip bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Copy the built React assets from the first stage
COPY --from=frontend-builder /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000