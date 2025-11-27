---
date: "2025-08-31"
title: "The pacman command"
excerpt: "A concise guide to using the `pacman` package manager on Arch Linux: refreshing the database, managing packages, and system maintenance"
tags:
  - linux
  - arch-linux
  - pacman
  - package-manager
sources:
  - author: Learn Linux TV
    url: https://www.youtube.com/watch?v=HD7jJEh4ZaM
    language: English
---

# The pacman command

## Refreshing the Package Database

```bash
pacman -Syy
```

- `S`: sync.

- `y`: refresh the packets database.

- `y`: force to refresh the local databases (even if it is up to date).

## The mirror list

When `pacman` performs an operation that requires synchronization (like installing a package), it uses the servers listed in `/etc/pacman.d/mirrorlist`, trying them from top to bottom.

> If your downloads are slow, it is a good idea to regenerate your mirror list.

## Managing packages

- `pacman -S <package_name>`: to install a package. `pacman` will automatically handle and install any necessary dependencies. You can install multiple packages at once by listing them with spaces in between.

- `pacman -R <package_name>`: to uninstall a package.

	- `R`: remove.

- `pacman -Ss <keyword>`: to search for a package if you do not know the exact name.

## System maintenance

- `pacman -Syu`: it synchronizes your package databases and then upgrades all out-of-date packages on the system.

	- `u`: update.

	> Two weeks between upgrades is a good amount of time.

- `pacman -Qdt`: to find orphan packages. These are packages that were installed as dependencies but are no longer required by any installed package.

	- `Q`: query.

	- `d`: skips dependency checks.

	- `t`: limit the results to orphan packages.
