(function(){
  if(window.__FINAL_FIX__)return;
  window.__FINAL_FIX__=true;

  function q(s){return document.querySelector(s);}

  function boot(){

    // ===== A. 搜索栏置顶 =====
    var st=document.createElement('style');
    st.textContent=[
      '#tab-messages{display:flex !important;flex-direction:column !important;overflow-y:auto !important;}',
      '#tab-messages .msg-search-wrap{position:sticky !important;top:0 !important;z-index:50 !important;background:var(--bg-pri) !important;flex-shrink:0 !important;}',
      'body.dark-mode #tab-messages .msg-search-wrap{background:#1a1a1a !important;}',
      '#tab-messages #msg-list{flex:1 !important;overflow-y:auto !important;}'
    ].join('\n');
    document.head.appendChild(st);

    // 确保搜索栏在最前面
    var panel=q('#tab-messages');
    if(panel){
      var wrap=panel.querySelector('.msg-search-wrap');
      if(wrap && panel.firstElementChild!==wrap){
        panel.insertBefore(wrap,panel.firstElementChild);
      }
    }

    // ===== B. 壁纸恢复（用你代码里的 showWP） =====
    if(typeof showWP==='function'){
      try{
        var raw=localStorage.getItem('tq_wallpaper_home');
        var src=null;
        if(raw){
          try{src=JSON.parse(raw);}catch(e){src=raw;}
        }
        if(src) showWP(src);
      }catch(e){}
    }

    // ===== C. 头像兜底 =====
    function fixAvatars(root){
      var imgs=(root||document).querySelectorAll('.msg-item-avatar img,.cd-msg-avatar img,.contact-item-avatar img');
      for(var i=0;i<imgs.length;i++){
        (function(img){
          if(img.__fx__)return;
          img.__fx__=1;
          if(!img.getAttribute('src')||img.getAttribute('src')===''){
            var p=img.parentNode;
            if(p){
              var cls=p.classList.contains('cd-msg-avatar')?'ma-ph':'mi-ph';
              var ch=p.classList.contains('cd-msg-avatar')?'𖥦':(p.closest&&p.closest('.contact-item')?'✧':'𖥦');
              if(!p.querySelector('.'+cls)){
                var s=document.createElement('span');
                s.className=cls;
                s.textContent=ch;
                p.appendChild(s);
              }
              img.remove();
            }
            return;
          }
          img.addEventListener('error',function(){
            var p=img.parentNode;
            if(!p)return;
            var cls=p.classList.contains('cd-msg-avatar')?'ma-ph':'mi-ph';
            if(!p.querySelector('.'+cls)){
              var s=document.createElement('span');
              s.className=cls;
              s.textContent='𖥦';
              p.appendChild(s);
            }
            img.remove();
          });
        })(imgs[i]);
      }
    }

    fixAvatars(document);

    // 监听新增节点
    var mo=new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var nodes=muts[i].addedNodes||[];
        for(var j=0;j<nodes.length;j++){
          if(nodes[j]&&nodes[j].nodeType===1) fixAvatars(nodes[j]);
        }
      }
    });
    mo.observe(document.body,{childList:true,subtree:true});

    // 定期补刀搜索栏位置
    var n=0;
    var t=setInterval(function(){
      n++;
      var p2=q('#tab-messages');
      if(p2){
        var w2=p2.querySelector('.msg-search-wrap');
        if(w2&&p2.firstElementChild!==w2) p2.insertBefore(w2,p2.firstElementChild);
      }
      fixAvatars(document);
      if(n>10) clearInterval(t);
    },1000);

    console.log('[final-fix] loaded ok');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot);
  }else{
    // script.js 是动态加载的，等它执行完
    setTimeout(boot,800);
    setTimeout(boot,2000);
  }
})();
