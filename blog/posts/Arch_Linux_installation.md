---
date: "2025-06-15"
title: "Arch Linux Installation"
excerpt: "A practical, step-by-step guide to install Arch Linux from a blank drive to a clean, bootable system."
tags:
  - linux
  - arch-linux
  - installation
---

# Arch Linux installation

For those who have contemplated installing the reputedly “dreaded” Arch Linux but have been discouraged by its perceived difficulty, the present guide offers a practical, step-by-step path from a blank drive to a clean, bootable system.

> Reading the entire document before executing commands is strongly encouraged.

> WARNING: The information herein should be verified whenever possible, as certain steps may evolve over time. Every effort will be made to keep the guide current.

## Preinstallation considerations

### Real time clock alignment for dual boot systems

Linux stores the hardware clock in UTC, whereas Windows records local time. To avoid clock drift, on Windows:

1. Create `RealTimeIsUniversal` as a `DWORD` of $32$ bits with value $1$ under `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation`.

### SSH setup (remote installation)

Configuring OpenSSH in the live environment permits the entire installation to be driven from another computer via a secure shell.

1. `systemctl status sshd`.

	> If the process is not running, run it with `systemctl start sshd`.

2. `passwd`: set the root's password.

3. `ip addr show`: identify the installer's IP address.

4. Run `ssh root@<installer IP>` from the other device.

### Console legibility

Setting a larger console font with `setfont ter-132n` improves readability on Full-HD displays; select a smaller size on lower-resolution panels.

### UEFI verification

Presence of entries in `/sys/firmware/efi/efivars/` confirms a UEFI boot.

### Keyboard layout

1. List available layouts: `localectl list-keymaps`.

2. Filter with `grep`, e.g. `localectl list-keymaps | grep la-latin1`.

3. Load the layout: `loadkeys <layout>`.

## Networking

### Detecting interfaces

`ip addr show` lists active interfaces.

### Wi-Fi connection (`iwd`)

1. Launch the "iwd" shell: `iwctl`.

2. Confirm the adapter appears with `device list`; troubleshoot via the [Arch Wiki](https://wiki.archlinux.org/title/iwd) if absent.

3. Scan and enumerate networks.

	```
	station <device> scan
	station <device> get-networks
	station <device> connect "<SSID>"
	```

	> Alternatively, using `iwctl`: `iwctl --passphrase <passphrase> station <device> connect <SSID>`

A wired connection simplifies installation.

## Disk partitioning

### Target layout

| partition |  suggested size  |   filesystem  | purpose                        |
|:---------:|:--------------------:|:---------------:| ------------------------------------------------------ |
|  `/efi`   |     500 MiB    |    FAT32    | holds bootloaders and NVRAM entries for UEFI firmware. |
|  `root`   | $\geq 40 \text{GiB}$ |    ext4     | operating system files.                |
|  `/home`  |   remaining space  | ext4 (optional) | user data.                       |

### Creating partitions with `fdisk`

1. `fdisk -l`: list all disk.

2. `fdisk /dev/<device>`.

3. `g`: initialize a GPT table.

4. Create the `EFI`.

	```
	n     # New partition
	1     # Partition number
	<ENTER> # Accept default first sector
	+500M
	t 1   # Change type
	```

5. Create the `/`.

	```
	n
	2
	   # Accept default first sector
	+50G # Or preferred size
	```

6. Create `/home`.

	```
	n
	3
	  # Accept defaults to use remaining space
	```

	> No special type change is required; the default Linux filesystem code is correct.

7. `w`: write changes and quit.

### Formatting partitions

1. `mkfs.fat -F32 /dev/<EFI>`.

2. `mkfs.ext4 /dev/<root`.

3. `mkfs.ext4 /dev/<home>`.

### Mounting for installation

1. `mount /dev/<root> /mnt`.

2. `mkdir -p /mnt/boot/EFI`.

3. `mount /dev/<EFI> /mnt/boot/EFI`.

4. `mkdir /mnt/home`.

5. `mount /dev/<home> /mnt/home`.

## Optimizing mirrors

1. `cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak`.

2. `reflector --verbose --latest 10 --protocol https --sort rate --save /etc/pacman.d/mirrorlist`.

## Filesystem table

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

### Bonus (filesystem table)

When a separate NTFS disk is used for general data storage, it can be incorporated as follows:

1. `mkdir /mnt/files`.

2. `pacman -S ntfs-3g`.

3. `mount /dev/<disk partition> /mnt/files`.

> After mounting, the filesystem table must be regenerated.

The following entry illustrates a typical NTFS partition configuration in `/etc/fstab`:

```
UUID=64A6257CA625503A /home/braz/files ntfs-3g auto,exec,users,uid=1000,gid=1000,noatime 0 2
```

## Base system installation

1. `pacstrap -i /mnt base base-devel linux linux-headers linux-firmware git sudo networkmanager`.

2. `arch-chroot /mnt`.

3. Enable `networkmanager`: `systemctl enable NetworkManager`.

## Locales and console

1. Uncomment `en_US.UTF-8` in `/etc/locale.gen`, then run `locale-gen`.

2. Create `/etc/locale.conf` containing `LANG=en_US.UTF-8`.

3. Add `KEYMAP=us` in `/etc/vconsole.conf`.

## User accounts

8. `passwd`: set the root password.

9. `useradd -m -g users -G wheel <username>`.

	> In certain administrative scenarios, an account may be created without assignment to any supplementary groups (`useradd -m <username>`); however, separate configuration within `/etc/sudoers.d` is required to grant the necessary privileges.

10. `passwd <username>`.

11. `EDITOR=nvim visudo` and uncomment "%wheel ALL=(ALL) ALL".

	> When only the user account has been created, the required privileges must be granted by adding `<username> ALL=(ALL) ALL` to `sudoers.d`.

## GRUB

1. `pacman -S grub efibootmgr`.

	> When the installation is performed alongside Windows, the package `os-prober` is installed as well.

2. The file `/etc/default/grub` is opened, and the line with "GRUB_DISABLE_OS_PROBER" is uncommented.

	> If the installation is **not** performed alongside Windows, this step may be omitted.

3. `grub-install --target=x86_64-efi --bootloader-id=grub_uefi --recheck`.

4. `grub-mkconfig -o /boot/grub/grub.cfg`.

After completing these steps, the chroot environment is exited, all filesystems are unmounted (`umount -a` or `umount -lR /mnt`), and the system is rebooted with `reboot`.

> The installation medium should be removed before the system restarts.

## Minimal post installation

### Time zone

1. `timedatectl list-timezones`: list available time-zone identifiers.

> 	> A specific entry may be located with grep, for example: `timedatectl list-timezones | grep Bogota`.

2. `timedatectl set-timezone <time zone>`: the desired time zone is applied (e.g., `America/Bogota`).

3. `timedatectl set-ntp true`.

### Hostname

`hostnamectl set-hostname <hostname>`.

### Microcode and GPU drivers

1. `pacman -S amd-ucode` for AMD processors or `intel-ucode` for Intel processors.

2. For the GPU drivers use `pacman -S nvidia nvidia-utils nvidia-settings` for Nvidia, `mesa libva-mesa-driver` for AMD or Intel of GMA 4500 up to Coffee Lake architectures, `intel-media-driver` for Intel of Broadwell and newer architectures.

	> `pacman -S virtualbox-guest-utils` for VirtualBox.

### Audio stack

```bash
pacman -S wireplumber pipewire pipewire-pulse pipewire-alsa pipewire-jack
```

### AUR helper (yay)

1. `git clone https://aur.archlinux.org/yay-bin.git`.

2. `cd yay-bin`.

3. `makepkg -si`.

### Display manager

`pacman -S ly && systemctl enable ly.service`.

> The config file is `/etc/ly`.

A minimal Arch installation has now been completed. The subsequent task involves selecting either a desktop environment or a window manager. Installing any desktop environment should present no difficulties, because the corresponding packages include all components required for a complete user experience.
