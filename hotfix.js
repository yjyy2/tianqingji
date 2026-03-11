(function(){
  function onReady(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function(){

    // A. 搜索栏上移（固定在顶部）
    var st = document.createElement('style');
    st.textContent = `
      .msg-search-wrap{
        position: sticky !important;
        top: 0 !important;
        z-index: 20 !important;
        background: var(--bg-pri) !important;
      }
      body.dark-mode .msg-search-wrap{ background:#1a1a1a !important; }
    `;
    document.head.appendChild(st);

    // B. 壁纸显示修复
    function applyHomeWallpaper(){
      var src = null;
      try { src = JSON.parse(localStorage.getItem('tq_wallpaper_home') || 'null'); } catch(e){}
      var wp = document.getElementById('wallpaper');
      if(!wp) return;
      if(src){
        wp.style.backgroundImage = 'url("' + src + '")';
        wp.style.backgroundSize = 'cover';
        wp.style.backgroundPosition = 'center';
        wp.style.backgroundRepeat = 'no-repeat';
      }else{
        wp.style.backgroundImage = 'none';
      }
    }
    applyHomeWallpaper();

    var oldApply = window.applyWallpaper;
    if(typeof oldApply === 'function'){
      window.applyWallpaper = function(){
        oldApply.apply(this, arguments);
        setTimeout(applyHomeWallpaper, 50);
      };
    }

    var oldClear = window.clearWallpaper;
    if(typeof oldClear === 'function'){
      window.clearWallpaper = function(){
        oldClear.apply(this, arguments);
        setTimeout(applyHomeWallpaper, 50);
      };
    }

    // C. 聊天头像显示兜底（图片失效时给占位）
    function bindAvatarFallback(){
      var sels = '.cd-msg-avatar img,.contact-item-avatar img,.msg-item-avatar img,.me-avatar img,.me-ue-avatar img';
      document.querySelectorAll(sels).forEach(function(img){
        if(img.dataset.errBind) return;
        img.dataset.errBind = '1';
        img.onerror = function(){
          var p = this.parentNode;
          if(p && !p.querySelector('span')){
            var s = document.createElement('span');
            s.className = 'ma-ph';
            s.textContent = '𖥦';
            p.appendChild(s);
          }
          this.remove();
        };
      });
    }

    ['renderMsgList','renderContactList','renderChatMessages','refreshMeTab'].forEach(function(fn){
      var old = window[fn];
      if(typeof old === 'function'){
        window[fn] = function(){
          var r = old.apply(this, arguments);
          setTimeout(bindAvatarFallback, 0);
          return r;
        };
      }
    });

    bindAvatarFallback();
    setInterval(bindAvatarFallback, 1500);
  });
})();
