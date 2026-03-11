(function(){
  if (window.__BUGFIX2_LOADED__) return;
  window.__BUGFIX2_LOADED__ = true;

  function onReady(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else fn();
  }

  function safe(name, fn){
    try { fn(); console.log('[bugfix2 ok]', name); }
    catch (e) { console.error('[bugfix2 err]', name, e); }
  }

  function readLS(key){
    try{
      var raw = localStorage.getItem(key);
      if (raw == null) return null;
      try { return JSON.parse(raw); } catch(_) { return raw; }
    }catch(e){ return null; }
  }

  onReady(function(){

    // A) 搜索栏上移（聊天页）
    safe('search-bar-top', function(){
      if (document.getElementById('bugfix2-search-style')) return;
      var st = document.createElement('style');
      st.id = 'bugfix2-search-style';
      st.textContent = `
        .msg-search-wrap{
          position: sticky !important;
          top: 0 !important;
          z-index: 30 !important;
          background: var(--bg-pri) !important;
          padding-top: 6px !important;
        }
        body.dark-mode .msg-search-wrap{
          background:#1a1a1a !important;
        }
      `;
      document.head.appendChild(st);
    });

    // B) 壁纸显示修复（主页）
    safe('wallpaper-restore', function(){
      function applyHomeWallpaper(){
        var src = readLS('tq_wallpaper_home');
        var wp = document.getElementById('wallpaper');
        if (!wp) return;

        if (src && typeof src === 'string'){
          wp.style.backgroundImage = 'url("' + src.replace(/"/g, '%22') + '")';
          wp.style.backgroundSize = 'cover';
          wp.style.backgroundPosition = 'center';
          wp.style.backgroundRepeat = 'no-repeat';
        } else {
          wp.style.backgroundImage = 'none';
        }
      }

      applyHomeWallpaper();
      setTimeout(applyHomeWallpaper, 400);
      setTimeout(applyHomeWallpaper, 1200);

      // 如果原函数存在，就在它们执行后再补一刀
      var oldApply = window.applyWallpaper;
      if (typeof oldApply === 'function') {
        window.applyWallpaper = function(){
          var r = oldApply.apply(this, arguments);
          setTimeout(applyHomeWallpaper, 60);
          return r;
        };
      }

      var oldClear = window.clearWallpaper;
      if (typeof oldClear === 'function') {
        window.clearWallpaper = function(){
          var r = oldClear.apply(this, arguments);
          setTimeout(applyHomeWallpaper, 60);
          return r;
        };
      }
    });

    // C) 聊天头像兜底（图片加载失败时显示占位）
    safe('avatar-fallback', function(){
      function bindFallback(root){
        var sel = [
          '.cd-msg-avatar img',
          '.contact-item-avatar img',
          '.msg-item-avatar img',
          '.me-avatar img',
          '.me-ue-avatar img'
        ].join(',');

        (root || document).querySelectorAll(sel).forEach(function(img){
          if (img.__bf2_bound__) return;
          img.__bf2_bound__ = true;

          img.addEventListener('error', function(){
            var p = img.parentNode;
            if (!p) return;
            if (!p.querySelector('.bf2-ph')){
              var s = document.createElement('span');
              s.className = 'bf2-ph';
              s.textContent = '𖥦';
              s.style.cssText = 'font-size:14px;color:var(--txt-light);';
              p.appendChild(s);
            }
            try { img.remove(); } catch(_){}
          });
        });
      }

      bindFallback(document);

      var mo = new MutationObserver(function(muts){
        muts.forEach(function(m){
          m.addedNodes && m.addedNodes.forEach(function(n){
            if (n && n.nodeType === 1) bindFallback(n);
          });
        });
      });
      mo.observe(document.body, { childList:true, subtree:true });
    });

  });
})();

