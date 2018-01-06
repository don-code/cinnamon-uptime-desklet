Cinnamon uptime desklet
=======================

This is a Cinnamon desklet which displays the system uptime, updating once per second.

## Installation
### Single-user
Copy the directory `uptime@don-code` to `~/.local/share/cinnamon/desklets/` and add a desklet using the Desklets configuration widget.

### System-wide
Copy the directory `uptime@don-code` to `/usr/share/cinnamon/desklets`, then run `chown -R root:root /usr/share/cinnamon/desklets/uptime@don-code && chmod -R 755 /usr/share/cinnamon/desklets/uptime@don-code`. Users can add the desklet to their own environment using the Desklets configuration widget.
