# Dockerfile for Laravel API Kit PHP Application
#
# This Dockerfile creates a Docker image for running a Laravel API application
# with PHP 8.3-FPM (FastCGI Process Manager) backend, including all necessary dependencies and tools.
#
# BASE IMAGE:
#   - Uses php:8.3-fpm as the base image for PHP 8.3 with FastCGI Process Manager
#   - FPM allows the container to work with Nginx as a reverse proxy
#
# BUILD ARGUMENTS:
#   - user: Username for the non-root application user (default: laravel)
#   - uid: User ID for the application user (default: 1000)
#
# SYSTEM DEPENDENCIES:
#   - git: Version control system (needed for Composer dependencies)
#   - curl: Command-line tool for downloading files
#   - libpng-dev, libonig-dev, libxml2-dev, libzip-dev: Development libraries for PHP extensions
#   - zip, unzip: Compression utilities for package management
#
# PHP EXTENSIONS INSTALLED:
#   - pdo_mysql: Database abstraction layer for MySQL connections
#   - mbstring: Multibyte string handling for UTF-8 support
#   - exif: EXIF image metadata reading
#   - pcntl: Process control for background jobs
#   - bcmath: Arbitrary precision mathematics
#   - gd: Image manipulation support
#   - zip: Native zip file handling
#   - redis: Redis caching client (installed via PECL)
#
# COMPOSER:
#   - Installed from the official Composer image (latest version)
#   - Sets process timeout to 999 seconds to handle large dependency installations
#
# APPLICATION USER:
#   - Creates a non-root user 'laravel' for security best practices
#   - User is added to www-data and root groups for proper file permissions
#   - Sets up .composer directory with correct ownership
#
# WORKING DIRECTORY:
#   - /var/www is the application working directory
#   - All code will be mounted here in the Docker Compose configuration
#
# EXECUTION USER:
#   - Application runs as the 'laravel' user (non-root) for better security

FROM php:8.3-fpm

# Arguments
ARG user=laravel
ARG uid=1000

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

#! NEW Set Composer process timeout
ENV COMPOSER_PROCESS_TIMEOUT=999

# Create system user
RUN useradd -G www-data,root -u $uid -d /home/$user $user \
    && mkdir -p /home/$user/.composer \
    && chown -R $user:$user /home/$user

WORKDIR /var/www

USER $user
