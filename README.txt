ADCB CHEQUE WRITER — REAL-TIME SYNC SETUP
===========================================

This lets both your PCs share the same cheque archive automatically,
as long as they're on the same Wi-Fi/network and the hosting PC's
server is running.

WHAT YOU NEED
-------------
- Node.js installed on ONE of the two PCs (this one will "host" the
  shared data). Download the free installer from https://nodejs.org
  — pick the LTS version, click through the installer with defaults.
- Both PCs connected to the same Wi-Fi or network.

FILES
-----
Keep these three files together in one folder on the hosting PC:
  - server.js
  - index.html
  - README.txt (this file)

SETUP — ON THE HOSTING PC
--------------------------
1. Install Node.js if you haven't already (nodejs.org, LTS version).
2. Put server.js and index.html in the same folder, e.g.
   C:\ADCB-Cheque\
3. Open Command Prompt (Windows) or Terminal (Mac).
4. Navigate to that folder, for example:
     cd C:\ADCB-Cheque
5. Run:
     node server.js
6. You'll see output like:

     ADCB Cheque Writer sync server is running.

     On THIS PC, open:
       http://localhost:4890

     On the OTHER PC (same Wi-Fi / network), open:
       http://192.168.1.23:4890

   That 192.168.x.x number is specific to your network — use whatever
   the terminal prints for you.

7. If Windows asks "Allow this app through the firewall?" — click
   Allow (choose "Private networks" if given the option).

8. Leave this Command Prompt window open. Closing it stops the
   server, and sync will stop until you run it again.

SETUP — ON THE HOSTING PC'S BROWSER
------------------------------------
Open http://localhost:4890 — bookmark it. Use this page instead of
opening index.html directly from now on.

SETUP — ON THE SECOND PC
--------------------------
Open http://<the-IP-address-from-step-6>:4890 in a browser — bookmark
it. You do NOT need Node.js installed on this PC — it just connects
to the hosting PC over the network.

HOW YOU'LL KNOW IT'S WORKING
------------------------------
On the page, above the "Print cheque" button, you'll see a status line:
  🟢 Synced with the sync server — changes appear on other devices
     within a few seconds.

If it instead says "⚪ Not connected to a sync server", the page was
opened without going through the server (e.g. double-clicking the
file directly), or the server isn't running. Go back and open it via
the http://... address from step 6/8 above.

WHAT SYNCS AND WHAT DOESN'T
------------------------------
- Synced automatically: the cheque archive (date, cheque number,
  payee, amount) and the payee name suggestions.
- NOT synced (stays per-PC): the field position calibration (mm
  offsets), since your two printers/setups may need different
  alignment.

NOTES
-----
- This only works while both PCs are on the same local network and
  the hosting PC's server.js is running. It does not work over the
  internet or if the hosting PC is off/asleep.
- Data is stored in a file called data.json that server.js creates
  automatically in the same folder — back this up occasionally (or
  keep using the Export backup (.json) button in the app) in case
  something happens to that PC.
- If you'd rather have sync that works from anywhere (not just your
  office network), that needs a small cloud/Firebase setup instead —
  ask if you'd like that version built.
