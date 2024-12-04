# Memo for test issue

 Error: Failed to launch the browser process!
       
       (chrome:105289): GLib-GIO-ERROR **: 13:37:21.976: Settings schema 'org.gnome.settings-daemon.plugins.xsettings' does not contain a key named 'antialiasing'
       [1204/133722.021157:ERROR:process_memory_range.cc(75)] read out of range
       [1204/133722.032362:ERROR:process_memory_range.cc(75)] read out of range
       [1204/133722.032416:ERROR:process_memory_range.cc(75)] read out of range
       
       
       TROUBLESHOOTING: https://pptr.dev/troubleshooting
       
           at ChildProcess.onClose (file:///home/alice/projets/AV/voisinapp/frontend/node_modules/@puppeteer/browsers/lib/esm/launch.js:303:24)
           at ChildProcess.emit (node:events:531:35)
           at ChildProcess._handle.onexit (node:internal/child_process:294:12)
           at Process.callbackTrampoline (node:internal/async_hooks:130:17)

**solution** : 
1. Bidouille sudo nano org.gnome.settings-daemon.plugins.xsettings.gschema.xml : Solution choisi. Fix trouvé ici : https://github.com/espanso/espanso/issues/1122
2. Configurer Puppeteer pour désactiver les options GPU mais rend impossible l'execution en navigateur
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
    ],
  });

