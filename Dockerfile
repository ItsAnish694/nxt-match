# Stage 1
FROM node:22-alpine AS frontend-builder

# Keep the basic PHP 8.4 install (for running the artisan command)
RUN apk add --no-cache php84 php84-phar php84-mbstring php84-openssl php84-tokenizer php84-xml php84-ctype php84-dom php84-fileinfo php84-simplexml php84-xmlwriter php84-curl php84-session

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY package*.json composer.* ./

RUN npm install

RUN composer install --no-dev --no-scripts --no-autoloader --ignore-platform-reqs

COPY . .

RUN composer dump-autoload --ignore-platform-reqs

RUN npm run build

# Stage 2
FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    libpng-dev libjpeg-turbo-dev freetype-dev zip unzip git curl bash \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

COPY --from=frontend-builder /app/public/build ./public/build

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]