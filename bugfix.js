/* =========================
   bugfix.js
   修复：
   1) QQ浏览器重进壁纸丢失
   2) 本地字体可保存为方案
   3) 第一页气泡/第二页长条字体颜色可更改
   // stable v1 - 图片加载修复完成
========================= */

// ===== 公共工具 =====
(function(){
  function bfGet(k,d){
    try{
      const v=localStorage.getItem(k);
      return v?JSON.parse(v):d;
    }catch(e){return d;}
  }
  function bfSet(k,v){
    try{
      localStorage.setItem(k,JSON.stringify(v));
      return true;
    }catch(e){return false;}
  }
  function bfDel(k){
    try{localStorage.removeItem(k);}catch(e){}
  }
  function bfToast(msg){
    if(typeof showToast==='function')showToast(msg);
    else console.log('[BUGFIX]',msg);
  }

  // IndexedDB（用于大资源：壁纸/本地字体）
  const DB_NAME='tq_bugfix_assets';
  const STORE_NAME='kv';
  let dbPromise=null;

  function idbOpen(){
    if(dbPromise)return dbPromise;
    dbPromise=new Promise(resolve=>{
      if(!('indexedDB' in window)){resolve(null);return;}
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=function(){
        const db=req.result;
        if(!db.objectStoreNames.contains(STORE_NAME)){
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess=function(){resolve(req.result);};
      req.onerror=function(){resolve(null);};
    });
    return dbPromise;
  }

  async function idbGet(key){
    const db=await idbOpen();
    if(!db)return null;
    return new Promise(resolve=>{
      const tx=db.transaction(STORE_NAME,'readonly');
      const rq=tx.objectStore(STORE_NAME).get(key);
      rq.onsuccess=()=>resolve(rq.result != null ? rq.result : null);
      rq.onerror=()=>resolve(null);
    });
  }

  async function idbSet(key,val){
    const db=await idbOpen();
    if(!db)return false;
    return new Promise(resolve=>{
      const tx=db.transaction(STORE_NAME,'readwrite');
      tx.objectStore(STORE_NAME).put(val,key);
      tx.oncomplete=()=>resolve(true);
      tx.onerror=()=>resolve(false);
    });
  }

  async function idbDel(key){
    const db=await idbOpen();
    if(!db)return false;
    return new Promise(resolve=>{
      const tx=db.transaction(STORE_NAME,'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete=()=>resolve(true);
      tx.onerror=()=>resolve(false);
    });
  }

  window.__TQ_BF={bfGet,bfSet,bfDel,bfToast,idbGet,idbSet,idbDel};
})();


// ===== [BUGFIX-001] 壁纸持久化修复（QQ浏览器） =====
(function(){
  const BF=window.__TQ_BF;
  if(!BF)return;

  function ensureWpLayer(){
    let layer=document.getElementById('tq-wp-layer');
    if(!layer){
      layer=document.createElement('div');
      layer.id='tq-wp-layer';
      layer.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;background-size:cover;background-position:center;background-repeat:no-repeat;';
      document.body.insertBefore(layer,document.body.firstChild);
    }
    return layer;
  }

  function applyWallpaperVisual(src){
    const layer=ensureWpLayer();
    const old=document.getElementById('wallpaper');

    if(src){
      const safe=String(src).replace(/"/g,'%22');
      layer.style.backgroundImage='url("'+safe+'")';
      document.body.classList.add('has-wp');
      if(old)old.style.display='none';
    }else{
      layer.style.backgroundImage='none';
      document.body.classList.remove('has-wp');
      if(old){
        old.style.display='';
        old.style.background='var(--bg-pri)';
      }
    }
  }

  function compressDataUrl(src,maxW,limitBytes){
    maxW=maxW||1400;
    limitBytes=limitBytes||450*1024;
    return new Promise(resolve=>{
      try{
        const img=new Image();
        img.onload=function(){
          let w=img.width,h=img.height;
          if(w>maxW){h=Math.round(h*maxW/w);w=maxW;}
          const cvs=document.createElement('canvas');
          cvs.width=w;cvs.height=h;
          const ctx=cvs.getContext('2d');
          ctx.drawImage(img,0,0,w,h);

          let q=0.86;
          let out=cvs.toDataURL('image/jpeg',q);
          while(out.length>limitBytes && q>0.45){
            q-=0.08;
            out=cvs.toDataURL('image/jpeg',q);
          }
          resolve(out);
        };
        img.onerror=function(){resolve(src);};
        img.src=src;
      }catch(e){
        resolve(src);
      }
    });
  }

  async function saveWallpaper(src){
    let out=src;
    if(/^data:image\//.test(out) && out.length>700000){
      out=await compressDataUrl(out,1400,450*1024);
    }

    const ok1=BF.bfSet('tq_wallpaper_home',out);
    BF.bfSet('tq_img_wallpaper_home',out);
    await BF.idbSet('wallpaper_home',out);

    return {src:out,okLS:ok1};
  }

  // 覆盖 pickWallpaper（保持原交互）
  window.pickWallpaper=function(){
    if(typeof openUploadModal!=='function'){BF.bfToast('上传模块未就绪');return;}
    openUploadModal('wallpaper_home',function(k,src){
      window._wpTemp=src;
      const prev=document.getElementById('set-wp-home');
      if(prev)prev.innerHTML='<img src="'+src+'" alt="">';
      BF.bfToast('预览已更新，点击"应用保存"生效');
    });
  };

  // 覆盖 applyWallpaper（保存到LS + IDB）
  window.applyWallpaper=async function(){
    const input=document.getElementById('set-wp-url');
    const urlVal=input?input.value.trim():'';
    if(urlVal){
      window._wpTemp=urlVal;
      const prev=document.getElementById('set-wp-home');
      if(prev)prev.innerHTML='<img src="'+urlVal+'" alt="">';
    }

    if(!window._wpTemp){
      BF.bfToast('请先选择图片或输入URL');
      return;
    }

    const ret=await saveWallpaper(window._wpTemp);
    window._wpTemp=ret.src;
    applyWallpaperVisual(ret.src);

    if(ret.okLS) BF.bfToast('壁纸已应用保存');
    else BF.bfToast('壁纸已应用（已走兼容存储）');
  };

  // 覆盖 clearWallpaper（同时清LS+IDB）
  window.clearWallpaper=function(){
    function doClear(){
      window._wpTemp=null;
      BF.bfDel('tq_wallpaper_home');
      BF.bfDel('tq_img_wallpaper_home');
      BF.idbDel('wallpaper_home');
      applyWallpaperVisual(null);

      const prev=document.getElementById('set-wp-home');
      if(prev)prev.innerHTML='<span style="font-size:12px;color:var(--txt-light);">点击下方按钮设置</span>';
      const input=document.getElementById('set-wp-url');
      if(input)input.value='';
      BF.bfToast('壁纸已清除');
    }

    if(typeof showModal==='function'){
      showModal('清除壁纸','确定清除主页壁纸？',[
        {text:'取消',type:'cancel'},
        {text:'确定',type:'confirm',cb:doClear}
      ]);
    }else{
      doClear();
    }
  };

  async function restoreWallpaper(){
    let src=BF.bfGet('tq_wallpaper_home',null) || BF.bfGet('tq_img_wallpaper_home',null);
    if(!src){
      src=await BF.idbGet('wallpaper_home');
      if(src){
        BF.bfSet('tq_wallpaper_home',src);
      }
    }
    if(src){
      window._wpTemp=src;
      applyWallpaperVisual(src);
      const prev=document.getElementById('set-wp-home');
      if(prev)prev.innerHTML='<img src="'+src+'" alt="">';
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',restoreWallpaper);
  }else{
    restoreWallpaper();
  }
  window.addEventListener('pageshow',restoreWallpaper);
})();


// ===== [BUGFIX-002] 本地字体保存方案修复 =====
(function(){
  const BF=window.__TQ_BF;
  if(!BF)return;

  function renderFontSchemeSelect(){
    const sel=document.getElementById('set-font-scheme');
    if(!sel)return;
    const schemes=BF.bfGet('tq_font_schemes',[]);
    sel.innerHTML='<option value="">选择已保存字体方案</option>';
    schemes.forEach(function(s,i){
      const opt=document.createElement('option');
      opt.value=i;
      opt.textContent=s.name||('方案'+(i+1));
      sel.appendChild(opt);
    });
  }

  async function applyLocalFontData(dataUrl,fontName){
    try{
      const ffName='TQPatchFont_'+Date.now();
      const ff=new FontFace(ffName,'url('+dataUrl+')');
      const loaded=await ff.load();
      document.fonts.add(loaded);

      let st=document.getElementById('tq-font-scheme-patch-style');
      if(!st){
        st=document.createElement('style');
        st.id='tq-font-scheme-patch-style';
        document.head.appendChild(st);
      }
      st.textContent=`
      body,.p1-clock .time,.p1-clock .date,.p1-editable .text-display,.p1-editable .edit-box input,.p2-bubble,#p2-bubble-show,#p2-bubble-input,.p2-long-edit .long-text,#p2-long-input,.p3-card-title,.p3-mood .mood-content,.p3-mood .mood-content .silver-text,.p3-note textarea,.p3-countdown .cd-target,.p3-countdown .cd-time,.p3-countdown input,.app-name,.dock-label,.set-body,.set-input,.set-select,.set-label,.set-group-header .sg-title,.set-switch-label,.modal-title,.modal-msg{
        font-family:"${ffName}", var(--font-body) !important;
      }`;

      BF.bfSet('tq_custom_font_url',dataUrl);
      BF.bfSet('tq_custom_font_name',fontName||'本地字体');
      const cur=document.getElementById('set-font-current');
      if(cur)cur.textContent=fontName||'本地字体';
      return true;
    }catch(e){
      BF.bfToast('字体加载失败');
      return false;
    }
  }

  // 把历史里 data: 的方案迁移到 IDB，避免 localStorage 爆掉
  (async function migrateOldDataSchemes(){
    const schemes=BF.bfGet('tq_font_schemes',[]);
    let changed=false;
    for(let i=0;i<schemes.length;i++){
      const s=schemes[i];
      if(s && typeof s.url==='string' && s.url.startsWith('data:')){
        const id='fa_'+Date.now()+'_'+i;
        await BF.idbSet('font_asset_'+id,s.url);
        s.url='__IDB__'+id;
        changed=true;
      }
    }
    if(changed)BF.bfSet('tq_font_schemes',schemes);
    renderFontSchemeSelect();
  })();

  // 覆盖：保存字体方案
  window.saveFontScheme=async function(){
    const currentUrl=BF.bfGet('tq_custom_font_url',null);
    const currentName=BF.bfGet('tq_custom_font_name','系统默认');
    if(!currentUrl){
      BF.bfToast('请先应用一个字体');
      return;
    }

    const name=prompt('请为此字体方案命名：');
    if(!name||!name.trim())return;

    const schemes=BF.bfGet('tq_font_schemes',[]);
    const nm=name.trim();

    if(typeof currentUrl==='string' && currentUrl.startsWith('data:')){
      const id='fa_'+Date.now()+'_'+Math.random().toString(36).slice(2,6);
      await BF.idbSet('font_asset_'+id,currentUrl);
      schemes.push({name:nm,url:'__IDB__'+id,fontName:currentName||'本地字体'});
    }else{
      schemes.push({name:nm,url:currentUrl,fontName:currentName||'URL字体'});
    }

    if(!BF.bfSet('tq_font_schemes',schemes)){
      BF.bfToast('保存失败：存储空间不足');
      return;
    }

    renderFontSchemeSelect();
    BF.bfToast('字体方案「'+nm+'」已保存');
  };

  // 覆盖：应用字体方案
  window.applyFontScheme=async function(){
    const sel=document.getElementById('set-font-scheme');
    if(!sel||sel.value===''){
      BF.bfToast('请先选择方案');
      return;
    }
    const schemes=BF.bfGet('tq_font_schemes',[]);
    const s=schemes[parseInt(sel.value,10)];
    if(!s){
      BF.bfToast('方案不存在');
      return;
    }

    if(typeof s.url==='string' && s.url.startsWith('__IDB__')){
      const id=s.url.slice('__IDB__'.length);
      const data=await BF.idbGet('font_asset_'+id);
      if(!data){
        BF.bfToast('本地字体资源丢失，请重新保存该方案');
        return;
      }
      const ok=await applyLocalFontData(data,s.fontName||'本地字体');
      if(ok)BF.bfToast('字体方案「'+s.name+'」已应用');
      return;
    }

    // 普通URL方案：走原来的 applyFont 流程
    const inp=document.getElementById('set-font-url');
    if(inp)inp.value=s.url||'';
    if(typeof window.applyFont==='function'){
      window.applyFont();
      BF.bfToast('字体方案「'+s.name+'」已应用');
    }else if(s.url){
      const ok=await applyLocalFontData(s.url,s.fontName||'字体');
      if(ok)BF.bfToast('字体方案「'+s.name+'」已应用');
    }
  };

  setTimeout(renderFontSchemeSelect,0);
})();


// ===== [BUGFIX-003] 字体颜色作用范围修复 =====
(function(){
  const BF=window.__TQ_BF;
  if(!BF)return;

  const COLOR_TARGETS=[
    '.p1-clock .time','.p1-clock .date',
    '.p1-editable .text-display',
    '.p2-bubble','#p2-bubble-show',
    '.p2-long-edit .long-text','#p2-long-show',
    '.p3-card-title','.p3-mood .mood-content',
    '.p3-mood .mood-content .silver-text',
    '.p3-note textarea',
    '.p3-countdown .cd-target','.p3-countdown .cd-time',
    '.p3-countdown input','#cd-user-name','#cd-user-date',
    '.p3-countdown .cd-col',
    '.app-name','.dock-label',
    '.circle-frame .placeholder',

    // 这两个是你说改不到颜色的重点
    '.p1-right-bubble',
    '.p2-long-inner .lt-item',
    '#p2-long-show .lt-item'
  ];

  function applyColor(color){
    COLOR_TARGETS.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        el.style.color=color;
      });
    });

    let ph=document.getElementById('tq-ph-color-bf');
    if(!ph){
      ph=document.createElement('style');
      ph.id='tq-ph-color-bf';
      document.head.appendChild(ph);
    }
    ph.textContent=`
      #cd-user-name::placeholder{color:${color}!important;opacity:.6;}
      .p3-note textarea::placeholder{color:${color}!important;opacity:.5;}
    `;
  }

  function clearColor(){
    COLOR_TARGETS.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        el.style.color='';
      });
    });
    const ph=document.getElementById('tq-ph-color-bf');
    if(ph)ph.textContent='';
  }

  window.applyFontColor=function(){
    const picker=document.getElementById('set-font-color');
    const color=picker?picker.value:'#2c2c2c';
    applyColor(color);
    BF.bfSet('tq_font_color',color);

    const pv=document.getElementById('set-color-preview');
    if(pv)pv.textContent='当前：'+color;

    BF.bfToast('字体颜色已应用');
  };

  window.resetFontColor=function(){
    clearColor();
    BF.bfDel('tq_font_color');

    const picker=document.getElementById('set-font-color');
    if(picker)picker.value='#2c2c2c';
    const pv=document.getElementById('set-color-preview');
    if(pv)pv.textContent='当前：#2c2c2c';

    BF.bfToast('字体颜色已恢复默认');
  };

  // 修复夜间模式切换后颜色状态
  const oldToggleDark=window.toggleDarkMode;
  if(typeof oldToggleDark==='function'){
    window.toggleDarkMode=function(){
      oldToggleDark();
      const isDark=BF.bfGet('tq_dark_mode',false);
      if(isDark){
        clearColor();
      }else{
        const c=BF.bfGet('tq_font_color',null);
        if(c)applyColor(c);
      }
    };
  }

  // 启动时恢复颜色（非夜间）
  setTimeout(function(){
    const isDark=BF.bfGet('tq_dark_mode',false);
    const c=BF.bfGet('tq_font_color',null);
    if(c && !isDark)applyColor(c);
  },400);
})();
/* =========================
   [BUGFIX-004] 图片慢加载/灰块下滑修复
========================= */
(function BF_IMG_RENDER_FIX(){
  function bfToast(msg){
    if(typeof showToast==='function') showToast(msg);
    else console.log('[BF]', msg);
  }

  // A. 图片未完成前隐藏，避免“灰块扫描感”
  const st=document.createElement('style');
  st.textContent=`
    img.bf-img-pending{
      opacity:0 !important;
      visibility:hidden !important;
    }
    img.bf-img-ready{
      opacity:1 !important;
      visibility:visible !important;
      transition:opacity .12s ease;
    }
  `;
  document.head.appendChild(st);

  function bindImg(img){
    if(!img || img.dataset.bfImgBound==='1') return;
    img.dataset.bfImgBound='1';
    img.decoding='sync';
    img.loading='eager';
    img.classList.add('bf-img-pending');

    const done=()=>{
      img.classList.remove('bf-img-pending');
      img.classList.add('bf-img-ready');
    };

    if(img.complete && img.naturalWidth>0){
      done();
    }else{
      img.addEventListener('load', done, {once:true});
      img.addEventListener('error', done, {once:true});
    }
  }

  function scanImgs(root){
    (root || document).querySelectorAll('img').forEach(bindImg);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', ()=>scanImgs(document));
  }else{
    scanImgs(document);
  }

  const mo=new MutationObserver(list=>{
    list.forEach(m=>{
      m.addedNodes.forEach(n=>{
        if(!n || n.nodeType!==1) return;
        if(n.tagName==='IMG') bindImg(n);
        else if(n.querySelectorAll) n.querySelectorAll('img').forEach(bindImg);
      });
    });
  });

  function startObserve(){
    if(document.body){
      mo.observe(document.body,{childList:true,subtree:true});
    }else{
      setTimeout(startObserve,80);
    }
  }
  startObserve();

  // B. 上传图片自动压缩转码（后续更快）
  function compactDataUrl(src){
    return new Promise(resolve=>{
      if(!src || typeof src!=='string' || !src.startsWith('data:image/')){
        resolve(src); return;
      }
      try{
        const im=new Image();
        im.onload=function(){
          let w=im.width, h=im.height;
          const MAX_W=1200;
          if(w>MAX_W){ h=Math.round(h*MAX_W/w); w=MAX_W; }

          const c=document.createElement('canvas');
          c.width=w; c.height=h;
          const ctx=c.getContext('2d');
          ctx.drawImage(im,0,0,w,h);

          // 优先 webp，不行再 jpeg
          let out=c.toDataURL('image/webp',0.82);
          if(!out || out.length>=src.length){
            out=c.toDataURL('image/jpeg',0.80);
          }
          if(out.length>650000){
            out=c.toDataURL('image/jpeg',0.72);
          }
          resolve(out || src);
        };
        im.onerror=function(){ resolve(src); };
        im.src=src;
      }catch(e){
        resolve(src);
      }
    });
  }

  if(typeof window.applyUploadedImage==='function' && !window.__bfApplyUploadedWrapped){
    window.__bfApplyUploadedWrapped=true;
    const oldApply=window.applyUploadedImage;
    window.applyUploadedImage=async function(src){
      const out=await compactDataUrl(src);
      return oldApply(out);
    };
  }

  // C. 旧图一次性迁移压缩（仅 data:image）
  function readMaybeJsonString(raw){
    if(raw==null) return {src:null,isJson:false};
    try{
      const p=JSON.parse(raw);
      if(typeof p==='string') return {src:p,isJson:true};
    }catch(e){}
    return {src:raw,isJson:false};
  }

  async function migrateOldImagesOnce(){
    const FLAG='tq_bf_img_migrated_v1';
    if(localStorage.getItem(FLAG)==='1') return;

    const keys=[];
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(!k) continue;
      if(
        k.startsWith('tq_img_') ||
        k==='tq_user_avatar' ||
        k==='tq_user_bg' ||
        k==='tq_user_frame' ||
        k==='tq_custom_icons'
      ){
        keys.push(k);
      }
    }

    // custom icons 是对象，单独处理
    for(const k of keys){
      if(k==='tq_custom_icons'){
        try{
          const obj=JSON.parse(localStorage.getItem(k)||'{}');
          let changed=false;
          for(const app in obj){
            const val=obj[app];
            if(typeof val==='string' && val.startsWith('data:image/') && val.length>150000){
              obj[app]=await compactDataUrl(val);
              changed=true;
            }
          }
          if(changed) localStorage.setItem(k,JSON.stringify(obj));
        }catch(e){}
        continue;
      }

      const raw=localStorage.getItem(k);
      const {src,isJson}=readMaybeJsonString(raw);
      if(typeof src!=='string') continue;
      if(!src.startsWith('data:image/')) continue;
      if(src.length<150000) continue; // 小图不动

      const out=await compactDataUrl(src);
      if(out && out!==src){
        try{
          localStorage.setItem(k, isJson?JSON.stringify(out):out);
        }catch(e){
          // 空间不足就跳过
        }
      }
    }

    localStorage.setItem(FLAG,'1');
    bfToast('图片资源已优化，重进后加载更快');
  }

  // 避免阻塞首屏：延后执行
  setTimeout(migrateOldImagesOnce, 1200);

  // 兼容从后台回来
  window.addEventListener('pageshow', ()=>scanImgs(document));
})();

      
