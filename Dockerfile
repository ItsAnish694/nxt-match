# --- Stage 1: Build React Assets ---
FROM node:20 AS frontend-builder
WORKDIR /app

# Copy only package files for caching
COPY package*.json ./
RUN npm install

# Copy only the frontend source
COPY . .

RUN npm run build

# --- Stage 2: Production PHP Image ---
FROM php:8.2-fpm

# Install system dependencies
RUN apk add --no-cache \
    libpng-dev libjpeg-turbo-dev freetype-dev zip unzip git curl bash \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel source code
COPY . .

# Copy built React assets
COPY --from=frontend-builder /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]