---
date: "2025-06-17"
title: "Windows manager setup"
excerpt: "Instructions to set up a minimal desktop, window manager (BSPWM), and useful tools for a lightweight Linux workflow."
tags:
  - window-manager
  - bspwm
  - linux
  - desktop
---

# Windows manager setup

## Minimal desktop environment

A minimal KDE Plasma environment may be installed together with the X server and accompanying applications by executing:

```bash
pacman -S xorg plasma-desktop sddm konsole dolphin packagekit-qt5 --needed
```

- `plasma-desktop`: supplies the shell, window manager, and fundamental Plasma libraries 

- `sddm` is the preferred display manager for Plasma sessions.

- `konsole` and `dolphin` furnish a terminal emulator and file manager, providing a usable baseline without the entire KDE Applications suite.

- `packagekit-qt5` enables Plasma Discover for optional graphical package management.

## Window manager

When a lightweight tiling workflow is preferred, BSPWM together with its supporting utilities can be installed:

```bash
pacman -S xorg picom rofi kitty arandr bspwm sxhkd
```

- `bspwm`: a tiling window manager that represents windows as the leaves of a full binary tree.

- `sxhkd`: is an X daemon that reacts to input events by executing commands.

- `picom`: is a compositor for X.

- `rofi`: a window switcher, Application launcher and dmenu replacement.

- `kitty`: the fast, feature-rich, GPU based terminal emulator.

- `arandr`: provide a simple visual front end for XRandR. Relative monitor positions are shown graphically and can be changed in a drag-and-drop way.

### Directory preparation

```bash
mkdir -p ~/.config/{bspwm,sxhkd}
```

### Seeding default configuration

```bash
cp /usr/share/doc/bspwm/examples/bspwmrc ~/.config/bspwm/
cp /usr/share/doc/bspwm/examples/sxhkdrc ~/.config/sxhkd/
```

The sample `bspwmrc` and `sxhkdrc` distributed with the package are copied and may serve as an initial template.

### Adjusting keybindings

`sxhkdrc` is edited to tailor frequently used shortcuts. For example, the terminal and application-launcher bindings can be defined as:

```
# Open Terminal
super + Return
	kitty

# Aplication launcher
super + @space
	rofi -modi drun -show drun
```

The hot-key daemon parses the file on the fly, so changes take effect after reloading the configuration (e.g. by sending `pkill -USR1 -x sxhkd`).

### Autostart helpers

Appending the following lines at the end of `~/.config/bspwm/bspwmrc` ensures that compositor, cursor, and other helpers start with the window manager:

```
picom -f &
xsetroot -cursor_name left_ptr
```

### System reboot

```bash
reboot now
```

After reboot, the selected display manager should present a session entry labelled BSPWM, as `.desktop` files for installed window managers are placed automatically in `/usr/share/xsessions/`.

### Display resolution configuration

1. `arandr` is launched from the terminal or launcher.

2. Appropriate resolutions and display layouts are selected under "Outputs".

3. The configuration is saved, e.g. as `display.sh`, in `~/.screenlayout/`.

4. Source the script near the top of `~/.config/bspwm/bspwmrc` (before compositor or panel calls) to ensure the X-randr commands run as soon as the session starts.

	```
	~/.screenlayout/display.sh &
	...
	```

ARandR emits a plain xrandr script; marking it executable and invoking it early guarantees that subsequent helpers (e.g., compositors) receive correct geometry information.

### Activating numlock on bootup

1. Install the helper: `sudo pacman -S numlockx`.

2. Append the command to `bspwmrc`, directly after the display script so it inherits the same X session.

	```
	numlockx on
	```

allows you to start X with NumLock turned on.

### File manager

```bash
sudo pacman -S thunar gvfs gvfs-mtp tumbler thunar-volman
```

Thunar is a modern file manager for the Xfce Desktop Environment.

### Compressed file manager

```bash
sudo pacman -S p7zip unrar-free zip unzip xarchiver
```

Xarchiver is the ultimate solution for handling archives on Linux and FreeBSD.
It is a Desktop Environment independent archiver front end.

### Text editor

```bash
sudo pacman -S mousepad
```

Mousepad aims to be an easy-to-use and fast editor. Our target is an editor for quickly editing text files, not a development environment or an editor with a huge bunch of plugins.

### Image viewer

```bash
sudo pacman -S nsxiv
```

nsxiv is a fork of the now-unmaintained sxiv with the purpose of being a (mostly) drop-in replacement for sxiv, maintaining its interface and adding simple, sensible features.

### Video player

```bash
sudo pacman -S mpv
```

mpv is a free (as in freedom) media player for the command line. It supports a wide variety of media file formats, audio and video codecs, and subtitle types.

### Volume control

```bash
sudo pacman -S pavucontrol
```

A simple GTK based volume control tool ("mixer") for the PulseAudio sound server.

### Document viewer

```bash
sudo pacman -S zathura
```

zathura is a highly customizable and functional document viewer. It provides a minimalistic and space saving interface as well as an easy usage that mainly focuses on keyboard interaction.

### Screenshooter

```bash
sudo pacman -S xfce4-screenshooter
```

`xfce4-screenshooter` is an application that can be used to take snapshots of your desktop screen.

### Notification

```bash
sudo pacman -S dunst
```

dunst is a lightweight replacement for the notification daemons provided by most desktop environments.

### Installing a font

1. Download the preferred [Nerd Font release](https://github.com/ryanoasis/nerd-fonts/releases) (e.g., CascadiaCode).

2. Extract the files to `~/.local/share/fonts/`.

3. Refresh the cache: `fc-cache`.

---

The procedures above install BSPWM and its auxiliaries on a minimal Arch Linux base, create the requisite configuration hierarchy, seed default scripts, and automate common helpers. Upon completion, a functional tiling environment is provided, ready for further personalization through additional rules, theming, and status-bar integration.
