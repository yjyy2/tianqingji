// ============================
// 全局工具
// ============================
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const LS=localStorage;
function lsGet(k,d=null){
  try{let v=LS.getItem(k);return v?JSON.parse(v):d;}
  catch(e){return d;}
}
function lsSet(k,v){
  try{LS.setItem(k,JSON.stringify(v));}catch(e){}
}

// Toast 提示
function showToast(msg,dur=1500){
  let t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:110px;left:50%;transform:translateX(-50%);padding:8px 20px;border-radius:20px;background:rgba(30,30,30,0.78);color:#fff;font-size:12px;letter-spacing:1px;z-index:8888;pointer-events:none;opacity:0;transition:opacity .3s;';
  t.textContent=msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity='1');
  setTimeout(()=>{
    t.style.opacity='0';
    setTimeout(()=>t.remove(),400);
  },dur);
}

// ============================
// 开屏动画
// ============================
(function initSplash(){
  const title=$('#splash-title');
  const fancy='𝒯𝒾𝒶𝓃 𝒬𝒾𝓃ℊ 𝒢𝒾';
  const fancyChars=[...fancy];
  let html='';
  let delay=0;
  for(let i=0;i<fancyChars.length;i++){
    const ch=fancyChars[i];
    if(ch===' '){
      html+='<span style="animation-delay:'+delay+'ms;width:8px;">&nbsp;</span>';
    }else{
      html+='<span style="animation-delay:'+delay+'ms;">'+ch+'</span>';
    }
    delay+=120;
  }
  title.innerHTML=html;
  const totalTime=delay+500;
  setTimeout(()=>{
    $('#splash-sub').classList.add('show');
  },totalTime);
  setTimeout(()=>{
    $('#splash').classList.add('out');
    $('#desktop').classList.add('show');
    setTimeout(()=>{
      $('#splash').style.display='none';
    },900);
  },totalTime+1600);
})();

// ============================
// 实时时钟
// ============================
function updateClock(){
  const now=new Date();
  const h=String(now.getHours()).padStart(2,'0');
  const m=String(now.getMinutes()).padStart(2,'0');
  $('#clock-time').textContent=h+':'+m;
  const wk=['日','一','二','三','四','五','六'];
  const y=now.getFullYear();
  const mon=now.getMonth()+1;
  const d=now.getDate();
  const w=wk[now.getDay()];
  $('#clock-date').textContent=y+'年'+mon+'月'+d+'日 星期'+w;
}
updateClock();
setInterval(updateClock,10000);

// ============================
// 桌面左右滑动
// ============================
let currentPage=0;
const totalPages=3;
const pagesWrap=$('#pages-wrap');
const dots=$$('#page-dots .dot');

function goToPage(idx){
  if(idx<0)idx=0;
  if(idx>=totalPages)idx=totalPages-1;
  currentPage=idx;
  pagesWrap.style.transform='translateX(-'+(currentPage*100/totalPages)+'%)';
  dots.forEach((d,i)=>{
    d.classList.toggle('active',i===currentPage);
  });
  lsSet('tq_currentPage',currentPage);
}

let touchStartX=0,touchStartY=0,touchMoved=false,isSwiping=false;
pagesWrap.addEventListener('touchstart',e=>{
  touchStartX=e.touches[0].clientX;
  touchStartY=e.touches[0].clientY;
  touchMoved=false;isSwiping=false;
},{passive:true});
pagesWrap.addEventListener('touchmove',e=>{
  const dx=e.touches[0].clientX-touchStartX;
  const dy=e.touches[0].clientY-touchStartY;
  if(!touchMoved){
    touchMoved=true;
    isSwiping=Math.abs(dx)>Math.abs(dy);
  }
},{passive:true});
pagesWrap.addEventListener('touchend',e=>{
  if(!isSwiping)return;
  const dx=e.changedTouches[0].clientX-touchStartX;
  if(Math.abs(dx)>50){
    if(dx<0)goToPage(currentPage+1);
    else goToPage(currentPage-1);
  }
},{passive:true});

dots.forEach(d=>{
  d.addEventListener('click',()=>{
    goToPage(parseInt(d.dataset.page));
  });
});
const savedPage=lsGet('tq_currentPage',0);
goToPage(savedPage);

// ============================
// 可编辑组件
// ============================
// 第一页字条
const p1Def='风替我吻你';
(function(){
  const saved=lsGet('tq_p1_text',p1Def);
  $('#p1-text-show').textContent=saved;
})();
$('#p1-text-show').addEventListener('click',()=>{
  $('#p1-text-show').classList.add('hidden');
  $('#p1-edit-box').classList.remove('hidden');
  $('#p1-edit-input').value=$('#p1-text-show').textContent;
  $('#p1-edit-input').focus();
});

function saveEditable(id){
  if(id==='p1'){
    const val=$('#p1-edit-input').value.trim()||p1Def;
    $('#p1-text-show').textContent=val;
    lsSet('tq_p1_text',val);
    $('#p1-edit-box').classList.add('hidden');
    $('#p1-text-show').classList.remove('hidden');
  }
  else if(id==='p2-bubble'){
    const val=$('#p2-bubble-input').value.trim()||'我等待着你，像寒冬的溪流，期望着重新奔流';
    $('#p2-bubble-show').textContent=val;
    lsSet('tq_p2_bubble',val);
    $('#p2-bubble-edit').classList.add('hidden');
    $('#p2-bubble-show').classList.remove('hidden');
  }
  else if(id==='p2-long'){
    const val=$('#p2-long-input').value.trim()||'记录此刻的心情…';
    $('#p2-long-show').textContent=val;
    lsSet('tq_p2_long',val);
    $('#p2-long-editbox').classList.add('hidden');
    $('#p2-long-show').classList.remove('hidden');
  }
}
function cancelEditable(id){
  if(id==='p1'){
    $('#p1-edit-box').classList.add('hidden');
    $('#p1-text-show').classList.remove('hidden');
  }
  else if(id==='p2-bubble'){
    $('#p2-bubble-edit').classList.add('hidden');
    $('#p2-bubble-show').classList.remove('hidden');
  }
  else if(id==='p2-long'){
    $('#p2-long-editbox').classList.add('hidden');
    $('#p2-long-show').classList.remove('hidden');
  }
}

// 第二页气泡
(function(){
  const saved=lsGet('tq_p2_bubble',null);
  if(saved)$('#p2-bubble-show').textContent=saved;
})();
$('#p2-bubble-show').addEventListener('click',()=>{
  $('#p2-bubble-show').classList.add('hidden');
  $('#p2-bubble-edit').classList.remove('hidden');
  $('#p2-bubble-input').value=$('#p2-bubble-show').textContent;
  $('#p2-bubble-input').focus();
});

// 第二页长条
(function(){
  const saved=lsGet('tq_p2_long',null);
  if(saved)$('#p2-long-show').textContent=saved;
})();
$('#p2-long-show').addEventListener('click',()=>{
  $('#p2-long-show').classList.add('hidden');
  $('#p2-long-editbox').classList.remove('hidden');
  $('#p2-long-input').value=$('#p2-long-show').textContent;
  $('#p2-long-input').focus();
});
// ============================
// 便签保存
// ============================
(function(){
  const saved=lsGet('tq_p3_note','');
  $('#p3-note-area').value=saved;
})();
$('#p3-note-save').addEventListener('click',()=>{
  lsSet('tq_p3_note',$('#p3-note-area').value);
  showToast('便签已保存');
});

// ============================
// 通用弹窗
// ============================
function showModal(title,msg,btns){
  $('#modal-title').textContent=title;
  $('#modal-msg').textContent=msg;
  const bc=$('#modal-btns');
  bc.innerHTML='';
  btns.forEach(b=>{
    const btn=document.createElement('button');
    btn.className='mbtn '+(b.type==='confirm'?'mbtn-confirm':'mbtn-cancel');
    btn.textContent=b.text;
    btn.onclick=()=>{
      closeModal();
      if(b.cb)b.cb();
    };
    bc.appendChild(btn);
  });
  $('#modal').classList.add('show');
}
function closeModal(){
  $('#modal').classList.remove('show');
}
$('#modal').addEventListener('click',e=>{
  if(e.target===$('#modal'))closeModal();
});

// ============================
// 图片上传系统
// ============================
let uploadTarget=null;
let uploadCallback=null;

function openUploadModal(targetKey,cb){
  uploadTarget=targetKey;
  uploadCallback=cb;
  $('#upload-url-input').classList.add('hidden');
  $('#upload-url-confirm').classList.add('hidden');
  $('#upload-url-input').value='';
  $('#upload-modal').classList.add('show');
}
function closeUploadModal(){
  $('#upload-modal').classList.remove('show');
  uploadTarget=null;
  uploadCallback=null;
}
$('#upload-modal').addEventListener('click',e=>{
  if(e.target===$('#upload-modal'))closeUploadModal();
});

$('#upload-local-btn').addEventListener('click',()=>{
  $('#file-picker').click();
});
$('#file-picker').addEventListener('change',e=>{
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    applyUploadedImage(ev.target.result);
  };
  reader.readAsDataURL(file);
  e.target.value='';
});
$('#upload-url-btn').addEventListener('click',()=>{
  $('#upload-url-input').classList.remove('hidden');
  $('#upload-url-confirm').classList.remove('hidden');
  $('#upload-url-input').focus();
});
function confirmUrlUpload(){
  const url=$('#upload-url-input').value.trim();
  if(!url){showToast('请输入链接');return;}
  applyUploadedImage(url);
}
function applyUploadedImage(src){
  if(uploadTarget&&uploadCallback){
    uploadCallback(uploadTarget,src);
  }
  lsSet('tq_img_'+uploadTarget,src);
  closeUploadModal();
  showToast('图片已设置');
}

// 圆形相框点击上传
function initFrameUpload(){
  $$('.circle-frame[data-key]').forEach(f=>{
    f.addEventListener('click',()=>{
      openUploadModal(f.dataset.key,(k,src)=>{
        f.innerHTML='<img src="'+src+'" alt="">';
      });
    });
    const saved=lsGet('tq_img_'+f.dataset.key,null);
    if(saved){
      f.innerHTML='<img src="'+saved+'" alt="">';
    }
  });
}
initFrameUpload();

// ============================
// 拍立得（两张重叠+左滑切换）
// ============================
let polIndex=0;
const polWrap=$('#polaroid-wrap');

function initPolaroids(){
  ['polaroid-0','polaroid-1'].forEach(key=>{
    const card=$('#'+key);
    const saved=lsGet('tq_img_'+key,null);
    if(saved){
      card.innerHTML='<img src="'+saved+'" alt="" style="width:100%;height:80px;object-fit:cover;border-radius:2px;">';
    }
    card.addEventListener('click',e=>{
      e.stopPropagation();
      openUploadModal(key,(k,src)=>{
        const c=$('#'+k);
        c.innerHTML='<img src="'+src+'" alt="" style="width:100%;height:80px;object-fit:cover;border-radius:2px;">';
      });
    });
  });
}
initPolaroids();

// 拍立得左滑切换
let polTouchX=0;
polWrap.addEventListener('touchstart',e=>{
  polTouchX=e.touches[0].clientX;
},{passive:true});
polWrap.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-polTouchX;
  if(Math.abs(dx)>30){
    if(dx<0){
      polWrap.classList.add('show-second');
      polIndex=1;
    }else{
      polWrap.classList.remove('show-second');
      polIndex=0;
    }
  }
},{passive:true});

// ============================
// 灵动岛通知
// ============================
let diTimer=null;
function showDynamicIsland(name,msg,avatar){
  const di=$('#dynamic-island');
  di.querySelector('.di-name').textContent=name;
  di.querySelector('.di-msg').textContent=msg;
  if(avatar){
    di.querySelector('.di-avatar img').src=avatar;
  }
  di.classList.add('show');
  clearTimeout(diTimer);
  diTimer=setTimeout(()=>{
    di.classList.remove('show');
  },4000);
}
$('#dynamic-island').addEventListener('click',()=>{
  $('#dynamic-island').classList.remove('show');
});

// ============================
// App 打开 / 关闭
// ============================
let currentApp=null;
const secondPhaseApps=['intimate','monitor'];

function openApp(name){
  if(secondPhaseApps.includes(name)){
    showToast('即将上线，敬请期待 ✧');
    return;
  }
  const page=$('#app-'+name);
  if(page){
    page.classList.add('open');
    currentApp=name;
    document.body.style.overflow='hidden';
  }else{
    showToast('正在开发中…');
  }
}
function closeApp(name){
  const page=$('#app-'+(name||currentApp));
  if(page){
    page.classList.remove('open');
    currentApp=null;
    document.body.style.overflow='';
  }
}

// ============================
// 倒计时
// ============================
let cdInterval=null;
function initCountdown(){
  const savedName=lsGet('tq_cd_user_name','');
  const savedDate=lsGet('tq_cd_user_date','');
  if(savedName)$('#cd-user-name').value=savedName;
  if(savedDate)$('#cd-user-date').value=savedDate;

  $('#cd-user-name').addEventListener('input',()=>{
    lsSet('tq_cd_user_name',$('#cd-user-name').value);
  });
  $('#cd-user-date').addEventListener('change',()=>{
    lsSet('tq_cd_user_date',$('#cd-user-date').value);
    updateCountdownDisplay();
  });
  $('#cd-user-btn').addEventListener('click',()=>{
    showToast('需要先配置API和角色');
  });
  $('#cd-char-btn').addEventListener('click',()=>{
    showToast('需要先配置API和角色');
  });
  $('#cd-char-share').addEventListener('click',()=>{
    showToast('需要先配置API和角色');
  });
  updateCountdownDisplay();
  cdInterval=setInterval(updateCountdownDisplay,60000);
}
function updateCountdownDisplay(){
  const dateStr=$('#cd-user-date').value;
  if(!dateStr){
    $('#cd-user-time').textContent='--';
    return;
  }
  const target=new Date(dateStr).getTime();
  const now=Date.now();
  const diff=target-now;
  if(diff<=0){
    $('#cd-user-time').textContent='已到期';
    return;
  }
  const days=Math.floor(diff/(1000*60*60*24));
  const hrs=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const mins=Math.floor((diff%(1000*60*60))/(1000*60));
  if(days>0){
    $('#cd-user-time').textContent=days+'天'+hrs+'时';
  }else if(hrs>0){
    $('#cd-user-time').textContent=hrs+'时'+mins+'分';
  }else{
    $('#cd-user-time').textContent=mins+'分钟';
  }
}
initCountdown();

// ============================
// 心情卡片占位
// ============================
$('#p3-mood-select').addEventListener('click',()=>{
  showToast('需要先创建角色');
});
$('#p3-mood-refresh').addEventListener('click',()=>{
  showToast('需要先选择角色');
});

// ============================
// 壁纸恢复
// ============================
(function(){
  const saved=lsGet('tq_wallpaper_home',null);
  if(saved){
    $('#wallpaper').style.backgroundImage='url('+saved+')';
  }
})();

// ============================
// Web Notification 权限
// ============================
function requestNotifPermission(){
  if('Notification' in window && Notification.permission==='default'){
    Notification.requestPermission();
  }
}
setTimeout(requestNotifPermission,5000);

function sendWebNotif(title,body,icon){
  if('Notification' in window && Notification.permission==='granted'){
    try{new Notification(title,{body:body,icon:icon||''});}catch(e){}
  }
}



// PWA Manifest
(function(){
  const manifest={
    name:'天晴机',
    short_name:'天晴机',
    description:'希望你的心情永远天晴',
    start_url:'.',
    display:'standalone',
    background_color:'#ffffff',
    theme_color:'#ffffff',
    icons:[{
      src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffffff" width="100" height="100" rx="20"/><text x="50" y="58" text-anchor="middle" font-size="36" fill="%239aabb8">晴</text></svg>',
      sizes:'192x192',
      type:'image/svg+xml'
    }]
  };
  const blob=new Blob([JSON.stringify(manifest)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('link');
  link.rel='manifest';
  link.href=url;
  document.head.appendChild(link);
})();

// ============================
// 初始化完毕
// ============================
console.log(' 天晴机 · 阶段A v2 加载完毕');

// ============================
// 补丁v4：全部修复
// ============================
(function patchV4(){
  const css=document.createElement('style');
  css.textContent=`
    :root{--bg-pri:#ffffff !important;--bg-sec:#f5f3f0 !important;}
    html,body{background:#ffffff !important;}
    #wallpaper{background:#ffffff !important;}
    .app-header{background:rgba(255,255,255,0.92) !important;}
    #dock{bottom:18px !important;}
    #page-dots{bottom:80px !important;}

    /* 第一页：头像框+字条再下移 */
    .p1-photo-top{
      margin-top:40px !important;
      margin-bottom:8px !important;
    }
    .p1-editable{
      margin-bottom:28px !important;
    }
    .p1-bottom{
      flex:1 !important;
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      gap:28px !important;
      padding-bottom:0 !important;
    }
    .p1-apps-grid{
      display:grid !important;
      grid-template-columns:repeat(2,1fr) !important;
      gap:36px 52px !important;
      justify-items:center !important;
    }
    .p1-apps-grid .app-icon{
      width:68px !important;height:68px !important;
      border-radius:18px !important;font-size:28px !important;
    }
    .p1-apps-grid .app-name{
      font-size:11px !important;margin-top:8px !important;
    }

    /* 第一页右侧：双圆框+气泡 */
    .p1-right-group{
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:10px;
      flex-shrink:0;
    }
    .p1-right-row{
      display:flex;
      align-items:center;
      gap:8px;
    }
    .p1-right-frame{
      width:58px !important;
      height:58px !important;
    }
    .p1-right-bubble{
      padding:6px 10px;
      border-radius:12px;
      font-size:11px;
      color:var(--txt-sec);
      max-width:90px;
      line-height:1.5;
      white-space:nowrap;
    }

    /* 第二页 */
    #page2{
      display:flex !important;
      flex-direction:column !important;
    }
    .p2-long-edit{
      display:block !important;
      visibility:visible !important;
      opacity:1 !important;
      margin:0 auto 14px !important;
      width:72% !important;
      min-height:120px !important;
      padding:14px 16px !important;
      border-radius:16px !important;
      position:relative !important;
      z-index:1 !important;
    }
    .p2-long-inner{
      position:relative;
      width:100%;
      height:100px;
    }
    .p2-long-inner .lt-item{
      position:absolute;
      font-size:12px;
      color:var(--txt-sec);
      white-space:nowrap;
      font-family:var(--font-cur);
      font-style:italic;
    }
    .p2-long-inner .lt-1{top:0;left:0;}
    .p2-long-inner .lt-2{top:24px;left:36px;}
    .p2-long-inner .lt-3{top:48px;left:50%;transform:translateX(-50%);}
    .p2-long-inner .lt-4{top:72px;right:14px;}
    .p2-long-inner .lt-5{bottom:0;right:0;}
    .p2-bottom{
      flex:1 !important;
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      gap:32px !important;
      padding-bottom:0 !important;
    }
    .p2-apps-grid{
      display:grid !important;
      grid-template-columns:repeat(2,1fr) !important;
      gap:36px 52px !important;
      justify-items:center !important;
    }
    .p2-apps-grid .app-icon{
      width:68px !important;height:68px !important;
      border-radius:18px !important;font-size:28px !important;
    }
    .p2-apps-grid .app-name{
      font-size:11px !important;margin-top:8px !important;
    }
    .polaroid-wrap{margin-bottom:0 !important;}
    .polaroid{transition:opacity .3s ease !important;}
    .polaroid-0{z-index:2!important;opacity:1!important;transform:rotate(-3deg)!important;}
    .polaroid-1{z-index:1!important;opacity:1!important;transform:rotate(4deg)!important;}
    .polaroid-wrap.show-second .polaroid-0{
      z-index:1!important;opacity:1!important;transform:rotate(4deg)!important;
    }
    .polaroid-wrap.show-second .polaroid-1{
      z-index:2!important;opacity:1!important;transform:rotate(-2deg)!important;
    }

    /* 第三页 */
    .p3-monitor{
      display:flex !important;
      justify-content:flex-start !important;
      padding-left:8px !important;
      margin-top:8px !important;
    }
    .p3-monitor .app-icon{
      width:68px!important;height:68px!important;
      border-radius:18px!important;font-size:28px!important;
    }
    .p3-monitor .app-name{
      font-size:11px!important;margin-top:8px!important;
    }
  `;
  document.head.appendChild(css);

  // ====== 替换右侧单圆框为双圆框+气泡 ======
  const oldRight=$('#p1-frame-right');
  if(oldRight){
    const group=document.createElement('div');
    group.className='p1-right-group';
    group.innerHTML=`
      <div class="p1-right-row">
        <div class="circle-frame glass p1-right-frame" id="p1-frame-right-top" data-key="p1-frame-right-top">
          <span class="placeholder">✧</span>
        </div>
        <div class="p1-right-bubble glass">你总是这样</div>
      </div>
      <div class="p1-right-row">
        <div class="p1-right-bubble glass">扰乱我心扉</div>
        <div class="circle-frame glass p1-right-frame" id="p1-frame-right-btm" data-key="p1-frame-right-btm">
          <span class="placeholder">✦</span>
        </div>
      </div>
    `;
    oldRight.replaceWith(group);

    // 绑定上传+恢复图片
    ['p1-frame-right-top','p1-frame-right-btm'].forEach(key=>{
      const f=$('#'+key);
      if(!f)return;
      const saved=lsGet('tq_img_'+key,null);
      if(saved){
        f.innerHTML='<img src="'+saved+'" alt="">';
      }
      f.addEventListener('click',()=>{
        openUploadModal(key,(k,src)=>{
          f.innerHTML='<img src="'+src+'" alt="">';
        });
      });
    });
  }

  // ====== 长条框内容 ======
  const longShow=$('#p2-long-show');
  const savedLong=lsGet('tq_p2_long',null);
  const longEdit=$('#p2-long-edit');
  longEdit.style.display='block';
  longEdit.style.visibility='visible';
  longEdit.style.opacity='1';

  if(!savedLong){
    longShow.innerHTML=`
      <div class="p2-long-inner">
        <span class="lt-item lt-1">♡(.◜ω◝.)♡</span>
        <span class="lt-item lt-2">在想着谁？</span>
        <span class="lt-item lt-3">♡</span>
        <span class="lt-item lt-4">在想着你</span>
        <span class="lt-item lt-5">(♡>𖥦<)/♡</span>
      </div>`;
    longShow.dataset.isDefault='1';
  }else{
    longShow.textContent=savedLong;
    longShow.style.whiteSpace='pre-line';
  }

  longShow.addEventListener('click',function(){
    longShow.classList.add('hidden');
    $('#p2-long-editbox').classList.remove('hidden');
    if(longShow.dataset.isDefault==='1'){
      $('#p2-long-input').value='♡(.◜ω◝.)♡\n在想着谁？\n♡\n在想着你\n(♡>𖥦<)/♥';
    }else{
      $('#p2-long-input').value=longShow.textContent;
    }
    $('#p2-long-input').focus();
  });

  // 覆盖保存函数
  const origSave=window.saveEditable;
  window.saveEditable=function(id){
    if(id==='p2-long'){
      const val=$('#p2-long-input').value.trim();
      if(!val){
        longShow.innerHTML=`
          <div class="p2-long-inner">
            <span class="lt-item lt-1">♡(.◜ω◝.)♡</span>
            <span class="lt-item lt-2">在想着谁？</span>
            <span class="lt-item lt-3">♡</span>
            <span class="lt-item lt-4">在想着你</span>
            <span class="lt-item lt-5">(♡>𖥦<)/♥</span>
          </div>`;
        longShow.dataset.isDefault='1';
        lsSet('tq_p2_long',null);
      }else{
        longShow.textContent=val;
        longShow.style.whiteSpace='pre-line';
        longShow.dataset.isDefault='0';
        lsSet('tq_p2_long',val);
      }
      $('#p2-long-editbox').classList.add('hidden');
      longShow.classList.remove('hidden');
    }else{
      origSave(id);
    }
  };

  // 拍立得双击切换
  let polLastTap=0;
  polWrap.addEventListener('click',function(e){
    const now=Date.now();
    if(now-polLastTap<350){
      e.stopPropagation();
      e.preventDefault();
      polWrap.classList.toggle('show-second');
      polLastTap=0;
    }else{
      polLastTap=now;
    }
  });
})();

// ============================
// 补丁：右侧气泡可编辑
// ============================
(function patchBubbleEdit(){
  const defTop='你总是这样';
  const defBtm='扰乱我心扉';

  function makeBubbleEditable(bubbleEl,lsKey,defText){
    const saved=lsGet(lsKey,null);
    if(saved)bubbleEl.textContent=saved;

    bubbleEl.addEventListener('click',function(e){
      e.stopPropagation();
      const old=bubbleEl.textContent;
      bubbleEl.innerHTML='';
      const inp=document.createElement('input');
      inp.type='text';
      inp.value=old;
      inp.maxLength=20;
      inp.style.cssText='width:70px;font-size:11px;background:transparent;border:none;border-bottom:1px solid var(--silver);color:var(--txt-pri);text-align:center;outline:none;';
      const btnWrap=document.createElement('div');
      btnWrap.style.cssText='display:flex;gap:4px;margin-top:4px;justify-content:center;';
      const saveBtn=document.createElement('button');
      saveBtn.textContent='✓';
      saveBtn.style.cssText='font-size:12px;color:var(--morandi-blue);padding:2px 6px;';
      const cancelBtn=document.createElement('button');
      cancelBtn.textContent='✕';
      cancelBtn.style.cssText='font-size:12px;color:var(--txt-sec);padding:2px 6px;';

      saveBtn.onclick=function(ev){
        ev.stopPropagation();
        const val=inp.value.trim()||defText;
        bubbleEl.textContent=val;
        lsSet(lsKey,val);
        showToast('已保存');
      };
      cancelBtn.onclick=function(ev){
        ev.stopPropagation();
        bubbleEl.textContent=old;
      };

      btnWrap.appendChild(saveBtn);
      btnWrap.appendChild(cancelBtn);
      bubbleEl.appendChild(inp);
      bubbleEl.appendChild(btnWrap);
      inp.focus();
    });
  }

  // 等DOM更新后绑定
  setTimeout(()=>{
    const bubbles=document.querySelectorAll('.p1-right-bubble');
    if(bubbles.length>=2){
      makeBubbleEditable(bubbles[0],'tq_p1_bubble_top',defTop);
      makeBubbleEditable(bubbles[1],'tq_p1_bubble_btm',defBtm);
    }
  },100);
})();

// ============================
// 补丁：第二页布局 + 第三页改版
// ============================
(function patchP2P3(){
  const css=document.createElement('style');
  css.textContent=`
    /* ===== 第二页：和第一页一致 ===== */
    #page2{
      display:flex !important;
      flex-direction:column !important;
    }
    .p2-top{
      flex-shrink:0 !important;
      margin-top:6vh !important;
      margin-bottom:0 !important;
    }
    .p2-long-edit{
      position:relative !important;
      top:auto !important;
      left:auto !important;
      transform:none !important;
      margin:0 auto !important;
    }
    .p2-bottom{
      flex:1 !important;
      position:relative !important;
      top:auto !important;
      bottom:auto !important;
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      gap:28px !important;
      padding:0 20px !important;
      padding-bottom:16px !important;
    }

    /* ===== 第三页改版 ===== */
    .p3-top-row{
      display:flex !important;
      gap:12px !important;
      margin-top:5vh !important;
      margin-bottom:14px !important;
      align-items:flex-start !important;
    }
    .p3-note{
      position:absolute !important;
      right:20px !important;
      top:52% !important;
      width:42% !important;
      min-height:120px !important;
    }
    .p3-spin-wrap{
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      min-height:120px;
    }
    .p3-spin-outer{
      width:90px;height:90px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:2px solid var(--morandi-blue);
      animation:spinRing 8s linear infinite;
      position:relative;
    }
    @keyframes spinRing{
      0%{transform:rotate(0deg);}
      100%{transform:rotate(360deg);}
    }
    .p3-spin-inner{
      width:66px;height:66px;
      border-radius:50%;
      overflow:hidden;
      border:1.5px solid var(--glass-border);
      box-shadow:0 3px 14px var(--glass-shadow);
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      background:var(--glass-bg);
      backdrop-filter:blur(12px);
      -webkit-backdrop-filter:blur(12px);
    }
    .p3-spin-inner img{
      width:100%;height:100%;
      object-fit:cover;
      pointer-events:none;
    }
    .p3-spin-inner .placeholder{
      font-size:18px;
      color:var(--txt-light);
    }
    .p3-spin-dots{
      position:absolute;
      width:100%;height:100%;
      top:0;left:0;
    }
    .p3-spin-dots span{
      position:absolute;
      width:5px;height:5px;
      border-radius:50%;
      background:var(--morandi-blue);
    }
    .p3-spin-dots span:nth-child(1){top:-3px;left:50%;transform:translateX(-50%);}
    .p3-spin-dots span:nth-child(2){bottom:-3px;left:50%;transform:translateX(-50%);}
    .p3-spin-dots span:nth-child(3){left:-3px;top:50%;transform:translateY(-50%);}
    .p3-spin-dots span:nth-child(4){right:-3px;top:50%;transform:translateY(-50%);}
  `;
  document.head.appendChild(css);

  // ===== 第三页：旋转圆框 =====
  const topRow=document.querySelector('.p3-top-row');
  const noteEl=document.querySelector('.p3-note');
  if(topRow&&noteEl){
    const spinWrap=document.createElement('div');
    spinWrap.className='p3-spin-wrap';
    spinWrap.innerHTML=`
      <div class="p3-spin-outer">
        <div class="p3-spin-dots">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="p3-spin-inner" id="p3-spin-frame" data-key="p3-spin-frame">
          <span class="placeholder">✧</span>
        </div>
      </div>
    `;
    topRow.insertBefore(spinWrap,noteEl);

    const page3=$('#page3');
    page3.style.position='relative';
    page3.appendChild(noteEl);

    const spinFrame=$('#p3-spin-frame');
    const savedSpin=lsGet('tq_img_p3-spin-frame',null);
    if(savedSpin){
      spinFrame.innerHTML='<img src="'+savedSpin+'" alt="">';
    }
    spinFrame.addEventListener('click',()=>{
      openUploadModal('p3-spin-frame',(k,src)=>{
        spinFrame.innerHTML='<img src="'+src+'" alt="">';
      });
    });
  }
})();

// ============================
// 补丁：第二页气泡缩小
// ============================
(function patchP2Bubble(){
  const css=document.createElement('style');
  css.textContent=`
    .p2-bubble{
      padding:8px 12px !important;
      font-size:clamp(10px,2.4vw,12px) !important;
      min-height:36px !important;
      border-radius:14px !important;
      line-height:1.5 !important;
    }
    .p2-top{
      gap:10px !important;
    }
    .p2-top .circle-frame{
      width:48px !important;
      height:48px !important;
    }
  `;
  document.head.appendChild(css);
})();

// ============================
// 补丁：长条下移
// ============================
(function patchLongDown(){
  const css=document.createElement('style');
  css.textContent=`
    .p2-long-edit{
      margin-top:50px !important;
    }
  `;
  document.head.appendChild(css);
})();


// ============================
// 阶段B 修复版：设置App
// ============================
(function initSettingsApp(){

// 注入CSS
const settingsCSS=document.createElement('style');
settingsCSS.textContent=`
/* ===== 便签位置修复 ===== */
.p3-note{
  position:relative !important;
  right:auto !important;
  top:auto !important;
  width:auto !important;
}
.p3-top-row{
  display:flex !important;
  gap:12px !important;
  margin-top:5vh !important;
  margin-bottom:14px !important;
  align-items:stretch !important;
}
.p3-mood,.p3-note{
  flex:1 !important;
  min-height:120px !important;
}

/* ===== 设置App ===== */
#app-settings{
  background:var(--bg-pri);
}
.set-body{
  padding:0 20px 60px;
}
.set-group{
  margin-bottom:18px;
  border-radius:16px;
  overflow:hidden;
}
.set-group-header{
  display:flex;align-items:center;
  justify-content:space-between;
  padding:14px 16px;cursor:pointer;
  background:var(--bg-sec);
  border:1px solid var(--glass-border);
  border-radius:16px;
  transition:border-radius .3s;
}
.set-group.open .set-group-header{
  border-radius:16px 16px 0 0;
}
.set-group-header .sg-title{
  font-size:14px;letter-spacing:1px;
  color:var(--txt-pri);font-weight:400;
}
.set-group-header .sg-arrow{
  font-size:12px;color:var(--txt-sec);
  transition:transform .3s;
}
.set-group.open .sg-arrow{
  transform:rotate(180deg);
}
.set-group-body{
  max-height:0;overflow:hidden;
  transition:max-height .4s ease;
  background:var(--bg-sec);
  border:1px solid var(--glass-border);
  border-top:none;
  border-radius:0 0 16px 16px;
}
.set-group.open .set-group-body{
  max-height:2000px;
}
.set-group-content{
  padding:14px 16px;
}
.set-row{
  margin-bottom:12px;position:relative;
}
.set-label{
  font-size:12px;color:var(--txt-sec);
  letter-spacing:1px;margin-bottom:5px;display:block;
}
.set-input{
  width:100%;padding:10px 14px;
  border-radius:12px;background:var(--bg-pri);
  font-size:13px;color:var(--txt-pri);
  border:1px solid var(--glass-border);
  transition:border-color .2s;
}
.set-input:focus{border-color:var(--morandi-blue);}
.set-select{
  width:100%;padding:10px 14px;
  border-radius:12px;background:var(--bg-pri);
  font-size:13px;color:var(--txt-pri);
  border:1px solid var(--glass-border);
  appearance:none;-webkit-appearance:none;cursor:pointer;
}
.set-btn{
  padding:9px 18px;border-radius:12px;font-size:12px;
  letter-spacing:1px;cursor:pointer;
  transition:transform .15s;border:none;
}
.set-btn:active{transform:scale(0.95);}
.set-btn-pri{background:var(--morandi-blue);color:#fff;}
.set-btn-sec{background:var(--bg-sec);color:var(--txt-sec);border:1px solid var(--glass-border);}
.set-btn-danger{background:#e07070;color:#fff;}
.set-btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
.set-scheme-row{display:flex;gap:8px;align-items:center;margin-bottom:10px;}
.set-scheme-row select{flex:1;}
.set-scheme-row .set-btn{flex-shrink:0;padding:9px 12px;}
.set-divider{height:1px;background:var(--glass-border);margin:14px 0;}
.set-switch-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;}
.set-switch-label{font-size:13px;color:var(--txt-pri);}
.set-switch{
  width:44px;height:24px;border-radius:12px;
  background:var(--bg-sec);position:relative;cursor:pointer;
  transition:background .3s;border:1px solid var(--glass-border);
}
.set-switch.on{background:var(--morandi-blue);border-color:var(--morandi-blue);}
.set-switch::after{
  content:'';position:absolute;top:2px;left:2px;
  width:18px;height:18px;border-radius:50%;
  background:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.1);
  transition:transform .3s;
}
.set-switch.on::after{transform:translateX(20px);}
.set-color-pick{
  width:40px;height:40px;border-radius:12px;
  border:2px solid var(--glass-border);
  cursor:pointer;padding:0;overflow:hidden;
}
.set-color-pick input[type="color"]{
  width:100%;height:100%;border:none;padding:0;
  cursor:pointer;background:transparent;
}
.set-wp-preview{
  width:100%;height:140px;border-radius:12px;
  background:var(--bg-sec);overflow:hidden;
  border:1.5px solid var(--glass-border);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:10px;
}
.set-wp-preview img{width:100%;height:100%;object-fit:cover;pointer-events:none;}
.key-toggle{
  position:absolute;right:12px;top:50%;transform:translateY(-50%);
  font-size:14px;color:var(--txt-sec);cursor:pointer;
  background:none;border:none;padding:4px;
}

/* ===== 深色模式全局 ===== */
body.dark-mode{background:#1a1a1a !important;}
body.dark-mode #wallpaper{background:#1a1a1a !important;}
body.dark-mode .page{color:#e0e0e0 !important;}
body.dark-mode .p1-clock .time{color:#e0e0e0 !important;}
body.dark-mode .p1-clock .date{color:#999 !important;}
body.dark-mode .p1-editable .text-display{color:#c0c0c0 !important;}
body.dark-mode .app-name{color:#999 !important;}
body.dark-mode .dock-label{color:#999 !important;}
body.dark-mode .circle-frame{background:rgba(40,40,40,0.52)!important;border-color:rgba(80,80,80,0.5)!important;}
body.dark-mode .glass,body.dark-mode .glass-strong{background:rgba(40,40,40,0.52)!important;border-color:rgba(80,80,80,0.5)!important;}
body.dark-mode .app-icon{background:rgba(40,40,40,0.52)!important;border-color:rgba(80,80,80,0.5)!important;}
body.dark-mode #dock{background:rgba(30,30,30,0.6)!important;border-color:rgba(80,80,80,0.4)!important;}
body.dark-mode .p2-bubble{color:#bbb !important;}
body.dark-mode .p2-long-edit .long-text{color:#bbb !important;}
body.dark-mode .p3-card-title{color:#999 !important;}
body.dark-mode .p3-mood .mood-content{color:#e0e0e0 !important;}
body.dark-mode .p3-mood .mood-content .silver-text{color:#999 !important;}
body.dark-mode .p3-note textarea{color:#e0e0e0 !important;}
body.dark-mode .p3-countdown .cd-target{color:#999 !important;}
body.dark-mode .p3-countdown .cd-time{color:#e0e0e0 !important;}
body.dark-mode .p3-countdown .cd-col{background:rgba(40,40,40,0.52)!important;border-color:rgba(80,80,80,0.5)!important;}
body.dark-mode .p3-countdown .cd-avatar{background:rgba(50,50,50,0.6)!important;}
body.dark-mode .p3-countdown input{color:#e0e0e0 !important;}
body.dark-mode .p3-mood .mood-actions button,body.dark-mode .p3-note .note-actions button{background:rgba(50,50,50,0.6)!important;color:#999 !important;}
body.dark-mode .polaroid{background:#2a2a2a !important;}
body.dark-mode .polaroid .pol-placeholder{background:#333 !important;color:#666 !important;}
body.dark-mode #page-dots .dot{background:#666 !important;}
body.dark-mode #page-dots .dot.active{background:var(--morandi-blue)!important;}
body.dark-mode #app-settings{background:#1a1a1a !important;}
body.dark-mode #app-settings .app-header{background:rgba(30,30,30,0.88)!important;}
body.dark-mode #app-settings .back-btn,body.dark-mode .sg-arrow{color:#999 !important;}
body.dark-mode #app-settings .header-title,body.dark-mode .sg-title{color:#e0e0e0 !important;}
body.dark-mode .set-group-header{background:rgba(40,40,40,0.6)!important;border-color:rgba(80,80,80,0.4)!important;}
body.dark-mode .set-group-body{background:rgba(35,35,35,0.6)!important;border-color:rgba(80,80,80,0.4)!important;}
body.dark-mode .set-input,body.dark-mode .set-select{background:#2a2a2a !important;color:#e0e0e0 !important;border-color:rgba(80,80,80,0.4)!important;}
body.dark-mode .set-btn-sec{background:#2a2a2a !important;color:#999 !important;}
body.dark-mode .set-label{color:#999 !important;}
body.dark-mode .set-switch-label{color:#e0e0e0 !important;}
body.dark-mode .modal-box{background:rgba(40,40,40,0.95)!important;border-color:rgba(80,80,80,0.5)!important;}
body.dark-mode .modal-title{color:#e0e0e0 !important;}
body.dark-mode .modal-msg{color:#999 !important;}
body.dark-mode .mbtn-cancel{background:#2a2a2a !important;color:#999 !important;}
body.dark-mode .set-wp-preview{background:#2a2a2a !important;}
body.dark-mode .set-color-pick{border-color:rgba(80,80,80,0.5) !important;}
`;
document.head.appendChild(settingsCSS);

// 注入设置App HTML
const settingsHTML=document.createElement('div');
settingsHTML.id='app-settings';
settingsHTML.className='app-page';
settingsHTML.innerHTML=`
<div class="app-header" style="position:relative;top:auto;background:var(--bg-pri);">
  <button class="back-btn" onclick="closeApp('settings')">‹</button>
  <div class="header-title">设置</div>
  <div class="header-right"></div>
</div>
<div class="set-body">

  <!-- ===== API配置 ===== -->
  <div class="set-group" id="sg-api">
    <div class="set-group-header" onclick="toggleSetGroup('sg-api')">
      <span class="sg-title">API 配置</span>
      <span class="sg-arrow">▾</span>
    </div>
    <div class="set-group-body">
      <div class="set-group-content">

        <div style="font-size:13px;color:var(--morandi-blue);margin-bottom:10px;letter-spacing:1px;">主 API</div>

        <div class="set-scheme-row">
          <select class="set-select" id="set-main-scheme">
            <option value="">选择已保存方案</option>
          </select>
          <button class="set-btn set-btn-pri" onclick="applyScheme('main')">应用</button>
        </div>

        <div class="set-row">
          <label class="set-label">API URL</label>
          <input class="set-input" id="set-main-url" type="text" placeholder="https://api.example.com">
        </div>
        <div class="set-row">
          <label class="set-label">API 密钥</label>
          <input class="set-input" id="set-main-key" type="password" placeholder="sk-xxxxx">
        </div>
        <div class="set-row">
          <label class="set-label">模型</label>
          <select class="set-select" id="set-main-model">
            <option value="">请先拉取模型</option>
          </select>
        </div>
        <div class="set-btn-row">
          <button class="set-btn set-btn-sec" onclick="fetchModels('main')">拉取模型</button>
          <button class="set-btn set-btn-pri" onclick="saveAPI('main')">保存</button>
          <button class="set-btn set-btn-sec" onclick="saveScheme('main')">保存为方案</button>
        </div>

        <div class="set-divider"></div>

        <div style="font-size:13px;color:var(--morandi-purple);margin-bottom:10px;letter-spacing:1px;">副 API（后台自动任务）</div>

        <div class="set-scheme-row">
          <select class="set-select" id="set-sub-scheme">
            <option value="">选择已保存方案</option>
          </select>
          <button class="set-btn set-btn-pri" onclick="applyScheme('sub')">应用</button>
        </div>

        <div class="set-row">
          <label class="set-label">API URL</label>
          <input class="set-input" id="set-sub-url" type="text" placeholder="https://api.example.com">
        </div>
        <div class="set-row">
          <label class="set-label">API 密钥</label>
          <input class="set-input" id="set-sub-key" type="password" placeholder="sk-xxxxx">
        </div>
        <div class="set-row">
          <label class="set-label">模型</label>
          <select class="set-select" id="set-sub-model">
            <option value="">请先拉取模型</option>
          </select>
        </div>
        <div class="set-btn-row">
          <button class="set-btn set-btn-sec" onclick="fetchModels('sub')">拉取模型</button>
          <button class="set-btn set-btn-pri" onclick="saveAPI('sub')">保存</button>
          <button class="set-btn set-btn-sec" onclick="saveScheme('sub')">保存为方案</button>
        </div>

      </div>
    </div>
  </div>
`;
document.body.appendChild(settingsHTML);

// 追加设置页面剩余内容
const setBody=settingsHTML.querySelector('.set-body');
setBody.insertAdjacentHTML('beforeend',`

  <!-- ===== 壁纸更换 ===== -->
  <div class="set-group" id="sg-wallpaper">
    <div class="set-group-header" onclick="toggleSetGroup('sg-wallpaper')">
      <span class="sg-title">壁纸更换</span>
      <span class="sg-arrow">▾</span>
    </div>
    <div class="set-group-body">
      <div class="set-group-content">
        <div class="set-label">主页壁纸</div>
        <div class="set-wp-preview" id="set-wp-home">
          <span style="font-size:12px;color:var(--txt-light);">点击下方按钮设置</span>
        </div>
        <div class="set-btn-row">
          <button class="set-btn set-btn-sec" onclick="pickWallpaper()">选择图片</button>
          <button class="set-btn set-btn-pri" onclick="applyWallpaper()">应用保存</button>
          <button class="set-btn set-btn-sec" onclick="clearWallpaper()">清除壁纸</button>
        </div>
        <div class="set-row" style="margin-top:10px;">
          <label class="set-label">或输入图片URL</label>
          <input class="set-input" id="set-wp-url" type="text" placeholder="https://example.com/image.jpg">
        </div>
      </div>
    </div>
  </div>

  <!-- ===== 图标更换 ===== -->
  <div class="set-group" id="sg-icons">
    <div class="set-group-header" onclick="toggleSetGroup('sg-icons')">
      <span class="sg-title">图标更换</span>
      <span class="sg-arrow">▾</span>
    </div>
    <div class="set-group-body">
      <div class="set-group-content">
        <div style="font-size:12px;color:var(--txt-sec);margin-bottom:10px;">点击图标更换（支持emoji/符号/图片链接/本地图片）</div>
        <div style="font-size:11px;color:var(--txt-sec);margin-bottom:14px;">桌面App</div>
        <div id="set-icons-desktop" style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px;"></div>
        <div class="set-divider"></div>
        <div style="font-size:11px;color:var(--txt-sec);margin-bottom:14px;">底部栏</div>
        <div id="set-icons-dock" style="display:flex;flex-wrap:wrap;gap:12px;"></div>
        <div class="set-btn-row" style="margin-top:14px;">
          <button class="set-btn set-btn-sec" onclick="resetAllIcons()">恢复默认</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== 字体设置 ===== -->
  <div class="set-group" id="sg-font">
    <div class="set-group-header" onclick="toggleSetGroup('sg-font')">
      <span class="sg-title">字体设置</span>
      <span class="sg-arrow">▾</span>
    </div>
    <div class="set-group-body">
      <div class="set-group-content">
        <div class="set-scheme-row">
          <select class="set-select" id="set-font-scheme">
            <option value="">选择已保存字体方案</option>
          </select>
          <button class="set-btn set-btn-pri" onclick="applyFontScheme()">应用</button>
        </div>
        <div class="set-row">
          <label class="set-label">字体URL（ttf / css）</label>
          <input class="set-input" id="set-font-url" type="text" placeholder="https://example.com/font.ttf">
        </div>
        <div class="set-row">
          <label class="set-label">本地字体文件</label>
          <button class="set-btn set-btn-sec" id="set-font-local-btn">选择文件</button>
          <span id="set-font-local-name" style="font-size:11px;color:var(--txt-sec);margin-left:8px;"></span>
        </div>
        <input type="file" id="set-font-file" accept=".ttf,.otf,.woff,.woff2" style="display:none;">
        <div class="set-row">
          <label class="set-label">当前字体</label>
          <div id="set-font-current" style="font-size:13px;color:var(--txt-pri);padding:6px 0;">系统默认</div>
        </div>
        <div class="set-btn-row">
          <button class="set-btn set-btn-pri" onclick="applyFont()">应用保存</button>
          <button class="set-btn set-btn-sec" onclick="saveFontScheme()">保存为方案</button>
          <button class="set-btn set-btn-sec" onclick="resetFont()">恢复默认</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== 字体颜色 ===== -->
  <div class="set-group" id="sg-color">
    <div class="set-group-header" onclick="toggleSetGroup('sg-color')">
      <span class="sg-title">字体颜色</span>
      <span class="sg-arrow">▾</span>
    </div>
    <div class="set-group-body">
      <div class="set-group-content">
        <div style="font-size:11px;color:var(--txt-sec);margin-bottom:10px;">仅改变文字颜色，图标颜色不受影响</div>
        <div style="display:flex;align-items:center;gap:14px;">
          <div class="set-color-pick">
            <input type="color" id="set-font-color" value="#2c2c2c">
          </div>
          <div>
            <div style="font-size:13px;color:var(--txt-pri);" id="set-color-preview">当前：#2c2c2c</div>
          </div>
        </div>
        <div class="set-btn-row" style="margin-top:12px;">
          <button class="set-btn set-btn-pri" onclick="applyFontColor()">应用保存</button>
          <button class="set-btn set-btn-sec" onclick="resetFontColor()">恢复默认</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== 日夜模式 ===== -->
  <div class="set-group" id="sg-mode">
    <div class="set-group-header" onclick="toggleSetGroup('sg-mode')">
      <span class="sg-title">日夜模式</span>
      <span class="sg-arrow">▾</span>
    </div>
    <div class="set-group-body">
      <div class="set-group-content">
        <div class="set-switch-row">
          <span class="set-switch-label">夜间模式</span>
          <div class="set-switch" id="set-dark-switch" onclick="toggleDarkMode()"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== 数据管理 ===== -->
  <div class="set-group" id="sg-data">
    <div class="set-group-header" onclick="toggleSetGroup('sg-data')">
      <span class="sg-title">数据管理</span>
      <span class="sg-arrow">▾</span>
    </div>
    <div class="set-group-body">
      <div class="set-group-content">
        <div class="set-btn-row">
          <button class="set-btn set-btn-pri" onclick="exportData()">导出数据</button>
          <button class="set-btn set-btn-sec" onclick="importDataClick()">导入数据</button>
        </div>
        <input type="file" id="set-import-file" accept=".json" style="display:none;">
        <div style="font-size:10px;color:var(--txt-sec);margin-top:10px;line-height:1.6;">
          导出：所有数据保存为JSON文件下载<br>
          导入：选取JSON文件 → 覆盖现有数据 → 自动刷新
        </div>
        <div class="set-divider"></div>
        <button class="set-btn set-btn-danger" onclick="clearAllData()">清除所有数据</button>
      </div>
    </div>
  </div>

</div>
`);

// ============================
// 分组展开收起
// ============================
window.toggleSetGroup=function(id){
  const g=document.getElementById(id);
  if(g)g.classList.toggle('open');
};

// ============================
// API 配置逻辑
// ============================
(function restoreAPI(){
  const main=lsGet('tq_api_main',null);
  if(main){
    $('#set-main-url').value=main.url||'';
    $('#set-main-key').value=main.key||'';
    if(main.model){
      const opt=document.createElement('option');
      opt.value=main.model;opt.textContent=main.model;opt.selected=true;
      $('#set-main-model').appendChild(opt);
    }
  }
  const sub=lsGet('tq_api_sub',null);
  if(sub){
    $('#set-sub-url').value=sub.url||'';
    $('#set-sub-key').value=sub.key||'';
    if(sub.model){
      const opt=document.createElement('option');
      opt.value=sub.model;opt.textContent=sub.model;opt.selected=true;
      $('#set-sub-model').appendChild(opt);
    }
  }
})();

// 密钥显隐
['main','sub'].forEach(type=>{
  const keyInput=$('#set-'+type+'-key');
  if(!keyInput)return;
  const row=keyInput.parentElement;
  const btn=document.createElement('button');
  btn.className='key-toggle';btn.textContent='╹ꇴ╹';
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    if(keyInput.type==='password'){keyInput.type='text';btn.textContent='-ꇴ-';}
    else{keyInput.type='password';btn.textContent='╹ꇴ╹';}
  });
  row.appendChild(btn);
});

window.fetchModels=async function(type){
  const url=$('#set-'+type+'-url').value.trim();
  const key=$('#set-'+type+'-key').value.trim();
  if(!url){showToast('请填写API URL');return;}
  if(!key){showToast('请填写API密钥');return;}
  let baseUrl=url.replace(/\/+$/,'');
  if(!baseUrl.includes('/v1'))baseUrl+='/v1';
  showToast('正在拉取模型…');
  try{
    const resp=await fetch(baseUrl+'/models',{
      method:'GET',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'}
    });
    if(!resp.ok){showToast('拉取失败：'+resp.status);return;}
    const data=await resp.json();
    let models=[];
    if(data.data&&Array.isArray(data.data)){
      models=data.data.map(m=>m.id||m.name||'').filter(Boolean);
    }else if(Array.isArray(data)){
      models=data.map(m=>(typeof m==='string'?m:m.id||m.name||'')).filter(Boolean);
    }
    if(models.length===0){showToast('未找到可用模型');return;}
    models.sort();
    const selEl=$('#set-'+type+'-model');
    const prevVal=selEl.value;
    selEl.innerHTML='<option value="">请选择模型（'+models.length+'个）</option>';
    models.forEach(m=>{
      const opt=document.createElement('option');
      opt.value=m;opt.textContent=m;
      if(m===prevVal)opt.selected=true;
      selEl.appendChild(opt);
    });
    showToast('拉取成功：'+models.length+'个模型');
  }catch(e){showToast('拉取出错：'+e.message);}
};

window.saveAPI=function(type){
  const url=$('#set-'+type+'-url').value.trim();
  const key=$('#set-'+type+'-key').value.trim();
  const model=$('#set-'+type+'-model').value;
  if(!url||!key){showToast('请填写URL和密钥');return;}
  lsSet('tq_api_'+type,{url,key,model});
  showToast((type==='main'?'主':'副')+'API 已保存');
};

// API方案
function refreshSchemeList(type){
  const sel=$('#set-'+type+'-scheme');
  const schemes=lsGet('tq_schemes_'+type,[]);
  sel.innerHTML='<option value="">选择已保存方案</option>';
  schemes.forEach((s,i)=>{
    const opt=document.createElement('option');
    opt.value=i;opt.textContent=s.name;sel.appendChild(opt);
  });
}
window.saveScheme=function(type){
  const url=$('#set-'+type+'-url').value.trim();
  const key=$('#set-'+type+'-key').value.trim();
  if(!url||!key){showToast('请先填写URL和密钥');return;}
  const name=prompt('请为此方案命名：');
  if(!name||!name.trim())return;
  const schemes=lsGet('tq_schemes_'+type,[]);
  schemes.push({name:name.trim(),url,key});
  lsSet('tq_schemes_'+type,schemes);
  refreshSchemeList(type);
  showToast('方案「'+name.trim()+'」已保存');
};
window.applyScheme=function(type){
  const sel=$('#set-'+type+'-scheme');
  if(sel.value===''){showToast('请先选择方案');return;}
  const schemes=lsGet('tq_schemes_'+type,[]);
  const s=schemes[parseInt(sel.value)];
  if(!s)return;
  $('#set-'+type+'-url').value=s.url;
  $('#set-'+type+'-key').value=s.key;
  $('#set-'+type+'-model').innerHTML='<option value="">请重新拉取模型</option>';
  showToast('方案「'+s.name+'」已应用，请重新拉取模型');
};
refreshSchemeList('main');
refreshSchemeList('sub');

// ============================
// 壁纸设置
// ============================
let wpTempSrc=null;

(function restoreWP(){
  const homeWP=lsGet('tq_wallpaper_home',null);
  if(homeWP){
    $('#set-wp-home').innerHTML='<img src="'+homeWP+'" alt="">';
    $('#wallpaper').style.backgroundImage='url('+homeWP+')';
  }
})();

window.pickWallpaper=function(){
  openUploadModal('wallpaper_home',(k,src)=>{
    wpTempSrc=src;
    $('#set-wp-home').innerHTML='<img src="'+src+'" alt="">';
    showToast('预览已更新，点击"应用保存"生效');
  });
};

window.applyWallpaper=function(){
  // 检查URL输入
  const urlVal=$('#set-wp-url').value.trim();
  if(urlVal){
    wpTempSrc=urlVal;
    $('#set-wp-home').innerHTML='<img src="'+urlVal+'" alt="">';
  }
  if(!wpTempSrc){
    showToast('请先选择图片或输入URL');
    return;
  }
  lsSet('tq_wallpaper_home',wpTempSrc);
  lsSet('tq_img_wallpaper_home',wpTempSrc);
  $('#wallpaper').style.backgroundImage='url('+wpTempSrc+')';
  showToast('壁纸已应用保存');
};

window.clearWallpaper=function(){
  showModal('清除壁纸','确定清除主页壁纸？',[
    {text:'取消',type:'cancel'},
    {text:'确定',type:'confirm',cb:()=>{
      wpTempSrc=null;
      LS.removeItem('tq_wallpaper_home');
      LS.removeItem('tq_img_wallpaper_home');
      $('#set-wp-home').innerHTML='<span style="font-size:12px;color:var(--txt-light);">点击下方按钮设置</span>';
      $('#wallpaper').style.backgroundImage='none';
      $('#set-wp-url').value='';
      showToast('壁纸已清除');
    }}
  ]);
};

// ============================
// 图标更换（支持emoji/符号/图片链接/本地图片）
// ============================
const defaultIcons={
  music:'♪',mail:'✉',diary:'❣',weather:'☾',
  playwhat:'ꕥ',calendar:'⌘',fanfic:'❈',intimate:'♡',
  monitor:'☍',chat:'❝',settings:'☼',worldbook:'◉'
};
const iconNames={
  music:'音乐',mail:'邮件',diary:'日记',weather:'天气',
  playwhat:'玩你所想',calendar:'日历',fanfic:'同人文',intimate:'亲密时刻',
  monitor:'监视',chat:'聊天',settings:'设置',worldbook:'世界书'
};
let customIcons=lsGet('tq_custom_icons',{});

// 隐藏的图标文件选择器
const iconFilePicker=document.createElement('input');
iconFilePicker.type='file';iconFilePicker.accept='image/*';
iconFilePicker.style.display='none';
document.body.appendChild(iconFilePicker);
let iconEditTarget=null;

function getIconHTML(app,size){
  const icon=customIcons[app]||defaultIcons[app];
  if(icon&&(icon.startsWith('http')||icon.startsWith('data:'))){
    return '<img src="'+icon+'" style="width:'+(size||24)+'px;height:'+(size||24)+'px;object-fit:cover;border-radius:6px;" alt="">';
  }
  return '<span style="font-size:'+(size||24)+'px;line-height:1;">'+icon+'</span>';
}

function applyIcons(){
  $$('.app-item[data-app]').forEach(el=>{
    const app=el.dataset.app;
    const iconEl=el.querySelector('.app-icon');
    if(iconEl)iconEl.innerHTML=getIconHTML(app,24);
  });
  const dockItems=$$('#dock .dock-item');
  const dockApps=['chat','settings','worldbook'];
  dockItems.forEach((el,i)=>{
    const app=dockApps[i];
    if(app){
      const iconEl=el.querySelector('.dock-icon');
      if(iconEl)iconEl.innerHTML=getIconHTML(app,18);
    }
  });
}

function renderIconEditor(){
  const deskDiv=$('#set-icons-desktop');
  const dockDiv=$('#set-icons-dock');
  if(!deskDiv||!dockDiv)return;

  const deskApps=['music','mail','diary','weather','playwhat','calendar','fanfic','intimate','monitor'];
  const dockApps=['chat','settings','worldbook'];

  deskDiv.innerHTML='';
  deskApps.forEach(app=>{
    const d=document.createElement('div');
    d.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;';
    d.innerHTML='<div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--bg-pri);border:1px solid var(--glass-border);overflow:hidden;">'+getIconHTML(app,22)+'</div><span style="font-size:9px;color:var(--txt-sec);">'+iconNames[app]+'</span>';
    d.onclick=()=>editIcon(app);
    deskDiv.appendChild(d);
  });

  dockDiv.innerHTML='';
  dockApps.forEach(app=>{
    const d=document.createElement('div');
    d.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;';
    d.innerHTML='<div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--bg-pri);border:1px solid var(--glass-border);overflow:hidden;">'+getIconHTML(app,22)+'</div><span style="font-size:9px;color:var(--txt-sec);">'+iconNames[app]+'</span>';
    d.onclick=()=>editIcon(app);
    dockDiv.appendChild(d);
  });
}

function editIcon(app){
  iconEditTarget=app;
  showModal('更换图标 · '+iconNames[app],'选择更换方式',[
    {text:'输入符号/链接',type:'cancel',cb:()=>{
      const val=prompt('输入emoji/符号 或 图片URL：',customIcons[app]||defaultIcons[app]);
      if(val===null)return;
      const trimmed=val.trim();
      if(!trimmed){showToast('不能为空');return;}
      customIcons[app]=trimmed;
      lsSet('tq_custom_icons',customIcons);
      applyIcons();renderIconEditor();
      showToast('图标已更换');
    }},
    {text:'选择本地图片',type:'confirm',cb:()=>{
      iconFilePicker.click();
    }}
  ]);
}

iconFilePicker.addEventListener('change',e=>{
  const file=e.target.files[0];
  if(!file||!iconEditTarget)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    customIcons[iconEditTarget]=ev.target.result;
    lsSet('tq_custom_icons',customIcons);
    applyIcons();renderIconEditor();
    showToast('图标已更换');
    iconEditTarget=null;
  };
  reader.readAsDataURL(file);
  e.target.value='';
});

window.resetAllIcons=function(){
  showModal('恢复默认','确定恢复所有图标为默认？',[
    {text:'取消',type:'cancel'},
    {text:'确定',type:'confirm',cb:()=>{
      customIcons={};
      lsSet('tq_custom_icons',{});
      applyIcons();renderIconEditor();
      showToast('图标已恢复默认');
    }}
  ]);
};

applyIcons();
renderIconEditor();

// ============================
// 字体设置（含方案）
// ============================
let customFontUrl=lsGet('tq_custom_font_url',null);
let customFontName=lsGet('tq_custom_font_name','系统默认');
let customFontBlob=null;

// 需要应用字体的选择器（不包含图标）
const fontTargets=[
  'body',
  '.p1-clock .time','.p1-clock .date',
  '.p1-editable .text-display','.p1-editable .edit-box input',
  '.p2-bubble','#p2-bubble-show','#p2-bubble-input',
  '.p2-long-edit .long-text','#p2-long-input',
  '.p3-card-title','.p3-mood .mood-content','.p3-mood .mood-content .silver-text',
  '.p3-note textarea',
  '.p3-countdown .cd-target','.p3-countdown .cd-time',
  '.p3-countdown input',
  '.app-name','.dock-label',
  '.set-body','.set-input','.set-select','.set-label',
  '.set-group-header .sg-title','.set-switch-label',
  '.modal-title','.modal-msg'
].join(',');

function applyFontToTargets(family){
  document.querySelectorAll(fontTargets).forEach(el=>{
    el.style.fontFamily=family;
  });
  // body也设置
  document.body.style.fontFamily=family;
}

function loadFontCore(url,name,save){
  try{
    const isCss=url.includes('.css')||url.includes('fonts.googleapis');
    if(isCss){
      let link=document.getElementById('custom-font-css');
      if(!link){
        link=document.createElement('link');
        link.id='custom-font-css';
        link.rel='stylesheet';
        document.head.appendChild(link);
      }
      link.href=url;
      setTimeout(()=>{
        const family='"CustomFont",'+getComputedStyle(document.documentElement).getPropertyValue('--font-body');
        applyFontToTargets(family);
      },800);
    }else{
      const fontFace=new FontFace('CustomFont','url('+url+')');
      fontFace.load().then(loaded=>{
        document.fonts.add(loaded);
        const family='"CustomFont",'+getComputedStyle(document.documentElement).getPropertyValue('--font-body');
        applyFontToTargets(family);
      }).catch(()=>showToast('字体加载失败'));
    }
    if(save){
      customFontUrl=url;
      customFontName=name||url.substring(0,30);
      lsSet('tq_custom_font_url',url);
      lsSet('tq_custom_font_name',customFontName);
      $('#set-font-current').textContent=customFontName;
    }
  }catch(e){showToast('字体加载出错');}
}

// 恢复已保存字体
(function restoreFont(){
  if(customFontUrl){
    loadFontCore(customFontUrl,customFontName,false);
    $('#set-font-current').textContent=customFontName;
  }
})();

$('#set-font-local-btn').addEventListener('click',()=>{
  $('#set-font-file').click();
});
$('#set-font-file').addEventListener('change',e=>{
  const file=e.target.files[0];
  if(!file)return;
  $('#set-font-local-name').textContent=file.name;
  const reader=new FileReader();
  reader.onload=ev=>{customFontBlob=ev.target.result;};
  reader.readAsDataURL(file);
  e.target.value='';
});

window.applyFont=function(){
  const url=$('#set-font-url').value.trim();
  if(url){
    const name=url.split('/').pop().split('?')[0]||'URL字体';
    loadFontCore(url,name,true);
    showToast('字体已应用保存');
    return;
  }
  if(customFontBlob){
    const fontFace=new FontFace('CustomFont','url('+customFontBlob+')');
    fontFace.load().then(loaded=>{
      document.fonts.add(loaded);
      const family='"CustomFont",'+getComputedStyle(document.documentElement).getPropertyValue('--font-body');
      applyFontToTargets(family);
      const name=$('#set-font-local-name').textContent||'本地字体';
      customFontUrl=customFontBlob;
      customFontName=name;
      lsSet('tq_custom_font_url',customFontBlob);
      lsSet('tq_custom_font_name',name);
      $('#set-font-current').textContent=name;
      showToast('字体已应用保存');
    }).catch(()=>showToast('字体加载失败'));
    return;
  }
  showToast('请输入字体URL或选择本地文件');
};

window.resetFont=function(){
  customFontUrl=null;customFontBlob=null;customFontName='系统默认';
  LS.removeItem('tq_custom_font_url');
  LS.removeItem('tq_custom_font_name');
  const defFamily=getComputedStyle(document.documentElement).getPropertyValue('--font-body');
  applyFontToTargets(defFamily);
  document.body.style.fontFamily='';
  const link=document.getElementById('custom-font-css');
  if(link)link.remove();
  $('#set-font-current').textContent='系统默认';
  $('#set-font-url').value='';
  $('#set-font-local-name').textContent='';
  showToast('字体已恢复默认');
};

// 字体方案
function refreshFontSchemes(){
  const sel=$('#set-font-scheme');
  const schemes=lsGet('tq_font_schemes',[]);
  sel.innerHTML='<option value="">选择已保存字体方案</option>';
  schemes.forEach((s,i)=>{
    const opt=document.createElement('option');
    opt.value=i;opt.textContent=s.name;sel.appendChild(opt);
  });
}

window.saveFontScheme=function(){
  if(!customFontUrl){showToast('请先应用一个字体');return;}
  const name=prompt('请为此字体方案命名：');
  if(!name||!name.trim())return;
  const schemes=lsGet('tq_font_schemes',[]);
  schemes.push({name:name.trim(),url:customFontUrl,fontName:customFontName});
  lsSet('tq_font_schemes',schemes);
  refreshFontSchemes();
  showToast('字体方案「'+name.trim()+'」已保存');
};

window.applyFontScheme=function(){
  const sel=$('#set-font-scheme');
  if(sel.value===''){showToast('请先选择方案');return;}
  const schemes=lsGet('tq_font_schemes',[]);
  const s=schemes[parseInt(sel.value)];
  if(!s)return;
  loadFontCore(s.url,s.fontName,true);
  showToast('字体方案「'+s.name+'」已应用');
};

refreshFontSchemes();

// ============================
// 字体颜色（只改文字，不改图标）
// ============================
const textColorTargets=[
  '.p1-clock .time','.p1-clock .date',
  '.p1-editable .text-display',
  '#p2-bubble-show','.p2-bubble',
  '.p2-long-edit .long-text','#p2-long-show',
  '.p3-card-title','.p3-mood .mood-content',
  '.p3-mood .mood-content .silver-text',
  '.p3-note textarea',
  '.p3-countdown .cd-target','.p3-countdown .cd-time',
  '.p3-countdown input','.p3-countdown .cd-col',
  '.app-name','.dock-label',
  '.polaroid'
];

function applyTextColor(color){
  textColorTargets.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.style.color=color;
    });
  });
}

(function restoreTextColor(){
  const saved=lsGet('tq_font_color',null);
  if(saved){
    applyTextColor(saved);
    if($('#set-font-color'))$('#set-font-color').value=saved;
    if($('#set-color-preview'))$('#set-color-preview').textContent='当前：'+saved;
  }
})();

$('#set-font-color').addEventListener('input',e=>{
  $('#set-color-preview').textContent='当前：'+e.target.value;
});

window.applyFontColor=function(){
  const color=$('#set-font-color').value;
  applyTextColor(color);
  lsSet('tq_font_color',color);
  showToast('字体颜色已应用');
};

window.resetFontColor=function(){
  const targets=textColorTargets;
  targets.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.style.color='';
    });
  });
  LS.removeItem('tq_font_color');
  $('#set-font-color').value='#2c2c2c';
  $('#set-color-preview').textContent='当前：#2c2c2c';
  showToast('字体颜色已恢复默认');
};

// ============================
// 日夜模式（全局深色）
// ============================
let darkMode=lsGet('tq_dark_mode',false);

function applyDarkMode(){
  const sw=$('#set-dark-switch');
  if(darkMode){
    document.body.classList.add('dark-mode');
    if(sw)sw.classList.add('on');
    // 覆盖壁纸
    const homeWP=lsGet('tq_wallpaper_home',null);
    if(!homeWP){
      $('#wallpaper').style.background='#1a1a1a';
      $('#wallpaper').style.backgroundImage='none';
    }
  }else{
    document.body.classList.remove('dark-mode');
    if(sw)sw.classList.remove('on');
    const homeWP=lsGet('tq_wallpaper_home',null);
    if(homeWP){
      $('#wallpaper').style.backgroundImage='url('+homeWP+')';
      $('#wallpaper').style.background='';
    }else{
      $('#wallpaper').style.background='#ffffff';
      $('#wallpaper').style.backgroundImage='none';
    }
  }
  // 恢复字体颜色（深色模式用CSS覆盖，浅色模式用用户选择）
  if(!darkMode){
    const savedColor=lsGet('tq_font_color',null);
    if(savedColor)applyTextColor(savedColor);
  }else{
    // 深色模式清除行内color让CSS接管
    textColorTargets.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        el.style.color='';
      });
    });
  }
}

applyDarkMode();

window.toggleDarkMode=function(){
  darkMode=!darkMode;
  lsSet('tq_dark_mode',darkMode);
  applyDarkMode();
  showToast(darkMode?'夜间模式已开启':'日间模式已开启');
};

// ============================
// 数据导入导出
// ============================
window.exportData=function(){
  const allData={};
  for(let i=0;i<LS.length;i++){
    const key=LS.key(i);
    if(key&&key.startsWith('tq_'))allData[key]=LS.getItem(key);
  }
  const json=JSON.stringify(allData,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  const now=new Date();
  const ts=now.getFullYear()+''+String(now.getMonth()+1).padStart(2,'0')
    +String(now.getDate()).padStart(2,'0')+'_'
    +String(now.getHours()).padStart(2,'0')
    +String(now.getMinutes()).padStart(2,'0');
  a.download='天晴机_备份_'+ts+'.json';
  document.body.appendChild(a);a.click();
  document.body.removeChild(a);URL.revokeObjectURL(url);
  showToast('数据已导出');
};

window.importDataClick=function(){
  $('#set-import-file').click();
};

$('#set-import-file').addEventListener('change',e=>{
  const file=e.target.files[0];
  if(!file)return;
  showModal('导入数据','导入将覆盖现有数据，确定继续？',[
    {text:'取消',type:'cancel'},
    {text:'确定导入',type:'confirm',cb:()=>{
      const reader=new FileReader();
      reader.onload=ev=>{
        try{
          const data=JSON.parse(ev.target.result);
          const keysToRemove=[];
          for(let i=0;i<LS.length;i++){
            const key=LS.key(i);
            if(key&&key.startsWith('tq_'))keysToRemove.push(key);
          }
          keysToRemove.forEach(k=>LS.removeItem(k));
          Object.keys(data).forEach(k=>LS.setItem(k,data[k]));
          showToast('导入成功，正在刷新…');
          setTimeout(()=>location.reload(),1000);
        }catch(err){showToast('文件格式错误');}
      };
      reader.readAsText(file);
    }}
  ]);
  e.target.value='';
});

window.clearAllData=function(){
  showModal('清除数据','⚠ 此操作不可恢复！确定清除所有数据？',[
    {text:'取消',type:'cancel'},
    {text:'确定清除',type:'confirm',cb:()=>{
      const keysToRemove=[];
      for(let i=0;i<LS.length;i++){
        const key=LS.key(i);
        if(key&&key.startsWith('tq_'))keysToRemove.push(key);
      }
      keysToRemove.forEach(k=>LS.removeItem(k));
      showToast('数据已清除，正在刷新…');
      setTimeout(()=>location.reload(),1000);
    }}
  ]);
};

// ============================
// 修复：拍立得图片持久化
// ============================
(function fixPolaroid(){
  ['polaroid-0','polaroid-1'].forEach(key=>{
    const card=$('#'+key);
    if(!card)return;
    const saved=lsGet('tq_img_'+key,null);
    if(saved){
      card.innerHTML='<img src="'+saved+'" alt="" style="width:100%;height:80px;object-fit:cover;border-radius:2px;">';
    }
    // 移除旧的事件监听（防止重复）
    const newCard=card.cloneNode(true);
    card.parentNode.replaceChild(newCard,card);
    newCard.addEventListener('click',e=>{
      e.stopPropagation();
      openUploadModal(key,(k,src)=>{
        const c=$('#'+k);
        if(c){
          c.innerHTML='<img src="'+src+'" alt="" style="width:100%;height:80px;object-fit:cover;border-radius:2px;">';
        }
      });
    });
  });

  // 重新绑定拍立得滑动
  const polWrap=$('#polaroid-wrap');
  if(polWrap){
    let polTX=0;
    polWrap.addEventListener('touchstart',e=>{
      polTX=e.touches[0].clientX;
    },{passive:true});
    polWrap.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-polTX;
      if(Math.abs(dx)>30){
        if(dx<0)polWrap.classList.add('show-second');
        else polWrap.classList.remove('show-second');
      }
    },{passive:true});
  }
})();

// ============================
// 修复：圆形相框图片持久化
// ============================
(function fixFrames(){
  $$('.circle-frame[data-key]').forEach(f=>{
    const saved=lsGet('tq_img_'+f.dataset.key,null);
    if(saved){
      f.innerHTML='<img src="'+saved+'" alt="">';
    }
  });
  // p3旋转相框
  const spinFrame=$('#p3-spin-frame');
  if(spinFrame){
    const saved=lsGet('tq_img_p3-spin-frame',null);
    if(saved){
      spinFrame.innerHTML='<img src="'+saved+'" alt="">';
    }
  }
})();

// ============================
// 全局API调用函数（供后续阶段使用）
// ============================
window.tqCallAPI=async function(type,messages,options={}){
  const api=lsGet('tq_api_'+type,null);
  if(!api||!api.url||!api.key||!api.model){
    showToast('请先配置'+(type==='main'?'主':'副')+'API');
    return null;
  }
  let baseUrl=api.url.replace(/\/+$/,'');
  if(!baseUrl.includes('/v1'))baseUrl+='/v1';
  try{
    const body={
      model:api.model,
      messages:messages,
      temperature:options.temperature||0.85,
      max_tokens:options.max_tokens||2048,
      stream:false
    };
    const resp=await fetch(baseUrl+'/chat/completions',{
      method:'POST',
      headers:{
        'Authorization':'Bearer '+api.key,
        'Content-Type':'application/json'
      },
      body:JSON.stringify(body)
    });
    if(!resp.ok){
      showToast('API错误：'+resp.status);
      return null;
    }
    const data=await resp.json();
    if(data.choices&&data.choices[0]&&data.choices[0].message){
      return data.choices[0].message.content;
    }
    return null;
  }catch(e){
    showToast('API请求失败：'+e.message);
    return null;
  }
};

console.log('☼ 设置App · 阶段B修复版 加载完毕');

})();

// ============================
// 真·真·最终补丁（壁纸必杀版）
// ============================
(function finalPatch(){

// 便签图标
const noteTitle=document.querySelector('.p3-note .p3-card-title');
if(noteTitle)noteTitle.innerHTML='⚴ 便签';

// ===== 壁纸：注入透明CSS =====
const wpCSS=document.createElement('style');
wpCSS.id='tq-wp-css';
wpCSS.textContent=`
  body.has-wp,
  body.has-wp #desktop,
  body.has-wp #pages-wrap,
  body.has-wp .page{
    background:transparent !important;
    background-color:transparent !important;
  }
  body.has-wp #app-settings{
    background:rgba(255,255,255,0.92) !important;
    backdrop-filter:blur(20px) !important;
    -webkit-backdrop-filter:blur(20px) !important;
  }
  body.has-wp.dark-mode #app-settings{
    background:rgba(20,20,20,0.92) !important;
  }
  #tq-wp-layer{
    position:fixed;
    top:0;left:0;
    width:100%;height:100%;
    z-index:0;
    pointer-events:none;
    background-size:cover !important;
    background-position:center !important;
    background-repeat:no-repeat !important;
  }
`;
document.head.appendChild(wpCSS);

// 创建全新的壁纸层（替代原来的#wallpaper）
let wpLayer=document.getElementById('tq-wp-layer');
if(!wpLayer){
  wpLayer=document.createElement('div');
  wpLayer.id='tq-wp-layer';
  document.body.insertBefore(wpLayer,document.body.firstChild);
}

function showWP(src){
  if(src){
    // 创建img测试图片是否能加载
    const img=new Image();
    img.onload=function(){
      wpLayer.style.backgroundImage='url("'+src+'")';
      document.body.classList.add('has-wp');
      // 隐藏旧壁纸层
      const old=$('#wallpaper');
      if(old)old.style.display='none';
    };
    img.onerror=function(){
      // 直接尝试设置（可能是data:url）
      wpLayer.style.backgroundImage='url("'+src+'")';
      document.body.classList.add('has-wp');
      const old=$('#wallpaper');
      if(old)old.style.display='none';
    };
    img.src=src;
  }else{
    wpLayer.style.backgroundImage='none';
    document.body.classList.remove('has-wp');
    const old=$('#wallpaper');
    if(old){
      old.style.display='';
      old.style.background='var(--bg-pri)';
    }
  }
}

window._wpTemp=null;

window.pickWallpaper=function(){
  openUploadModal('wallpaper_home',(k,src)=>{
    window._wpTemp=src;
    $('#set-wp-home').innerHTML='<img src="'+src+'" alt="">';
    showToast('预览已更新，点击"应用保存"生效');
  });
};

window.applyWallpaper=function(){
  const urlVal=$('#set-wp-url').value.trim();
  if(urlVal){
    window._wpTemp=urlVal;
    $('#set-wp-home').innerHTML='<img src="'+urlVal+'" alt="">';
  }
  if(!window._wpTemp){
    showToast('请先选择图片或输入URL');
    return;
  }
  lsSet('tq_wallpaper_home',window._wpTemp);
  showWP(window._wpTemp);
  showToast('壁纸已应用保存');
};

window.clearWallpaper=function(){
  showModal('清除壁纸','确定清除主页壁纸？',[
    {text:'取消',type:'cancel'},
    {text:'确定',type:'confirm',cb:()=>{
      window._wpTemp=null;
      LS.removeItem('tq_wallpaper_home');
      $('#set-wp-home').innerHTML='<span style="font-size:12px;color:var(--txt-light);">点击下方按钮设置</span>';
      showWP(null);
      $('#set-wp-url').value='';
      showToast('壁纸已清除');
    }}
  ]);
};

// 恢复壁纸
const hw=lsGet('tq_wallpaper_home',null);
if(hw){
  showWP(hw);
  window._wpTemp=hw;
  if($('#set-wp-home'))$('#set-wp-home').innerHTML='<img src="'+hw+'" alt="">';
}
// ===== 字体颜色 =====
const allColorSels=[
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
  '.circle-frame .placeholder'
];

function fullApplyColor(color){
  allColorSels.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.style.color=color;
    });
  });
  let ph=document.getElementById('tq-ph-color');
  if(!ph){
    ph=document.createElement('style');
    ph.id='tq-ph-color';
    document.head.appendChild(ph);
  }
  ph.textContent=`
    #cd-user-name::placeholder{color:${color}!important;opacity:.6;}
    .p3-note textarea::placeholder{color:${color}!important;opacity:.5;}
  `;
}

function fullClearColor(){
  allColorSels.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.style.color='';
    });
  });
  const ph=document.getElementById('tq-ph-color');
  if(ph)ph.textContent='';
}

window.applyFontColor=function(){
  const color=$('#set-font-color').value;
  fullApplyColor(color);
  lsSet('tq_font_color',color);
  showToast('字体颜色已应用');
};
window.resetFontColor=function(){
  fullClearColor();
  LS.removeItem('tq_font_color');
  $('#set-font-color').value='#2c2c2c';
  $('#set-color-preview').textContent='当前：#2c2c2c';
  showToast('字体颜色已恢复默认');
};

const sc=lsGet('tq_font_color',null);
if(sc&&!lsGet('tq_dark_mode',false)){
  fullApplyColor(sc);
  if($('#set-font-color'))$('#set-font-color').value=sc;
  if($('#set-color-preview'))$('#set-color-preview').textContent='当前：'+sc;
}

// ===== 深色模式 =====
window.toggleDarkMode=function(){
  const dm=!lsGet('tq_dark_mode',false);
  lsSet('tq_dark_mode',dm);
  const sw=$('#set-dark-switch');
  const hwp=lsGet('tq_wallpaper_home',null);
  if(dm){
    document.body.classList.add('dark-mode');
    if(sw)sw.classList.add('on');
    fullClearColor();
  }else{
    document.body.classList.remove('dark-mode');
    if(sw)sw.classList.remove('on');
    const fc=lsGet('tq_font_color',null);
    if(fc)fullApplyColor(fc);
  }
  showToast(dm?'夜间模式已开启':'日间模式已开启');
};

if(lsGet('tq_dark_mode',false)){
  document.body.classList.add('dark-mode');
  const sw=$('#set-dark-switch');
  if(sw)sw.classList.add('on');
}

console.log('🔧 壁纸必杀补丁已加载');
})();

// ============================
// 阶段C1：聊天App框架
// ============================
(function initChatApp(){

const chatCSS=document.createElement('style');
chatCSS.textContent=`
/* ===== 聊天App容器 ===== */
#app-chat{
  background:var(--bg-pri);
  display:flex;
  flex-direction:column;
}
body.dark-mode #app-chat{
  background:#1a1a1a;
}

/* 聊天顶栏 */
.chat-topbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:8px 16px 6px;
  flex-shrink:0;
}
.chat-topbar .ct-back{
  font-size:22px;
  color:var(--txt-sec);
  cursor:pointer;
  padding:4px 8px;
  transition:transform .2s;
}
.chat-topbar .ct-back:active{transform:scale(0.85);}
.chat-topbar .ct-title{
  font-size:16px;
  letter-spacing:2px;
  color:var(--txt-pri);
  font-weight:400;
}
.chat-topbar .ct-right{
  font-size:20px;
  color:var(--txt-sec);
  cursor:pointer;
  padding:4px 8px;
  transition:transform .2s;
}
.chat-topbar .ct-right:active{transform:scale(0.85);}
body.dark-mode .chat-topbar .ct-title{color:#e0e0e0;}
body.dark-mode .chat-topbar .ct-back,
body.dark-mode .chat-topbar .ct-right{color:#999;}

/* Tab栏 */
.chat-tabs{
  display:flex;
  border-bottom:1px solid var(--glass-border);
  flex-shrink:0;
  padding:0 10px;
}
.chat-tab{
  flex:1;
  text-align:center;
  padding:10px 0;
  font-size:13px;
  letter-spacing:1px;
  color:var(--txt-sec);
  cursor:pointer;
  position:relative;
  transition:color .3s;
}
.chat-tab.active{
  color:var(--txt-pri);
  font-weight:500;
}
.chat-tab.active::after{
  content:'';
  position:absolute;
  bottom:0;left:50%;
  transform:translateX(-50%);
  width:20px;height:2px;
  border-radius:1px;
  background:var(--morandi-blue);
}
body.dark-mode .chat-tab{color:#666;}
body.dark-mode .chat-tab.active{color:#e0e0e0;}
body.dark-mode .chat-tabs{border-color:rgba(80,80,80,0.4);}

/* Tab内容区 */
.chat-tab-content{
  flex:1;
  overflow-y:auto;
  overflow-x:hidden;
}
.chat-tab-panel{
  display:none;
  height:100%;
  overflow-y:auto;
  padding:0;
}
.chat-tab-panel.active{
  display:block;
}

/* 空状态 */
.chat-empty{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  height:100%;
  min-height:300px;
  color:var(--txt-light);
  font-size:13px;
  letter-spacing:1px;
}
.chat-empty .ce-icon{
  font-size:36px;
  margin-bottom:12px;
  opacity:.5;
}
body.dark-mode .chat-empty{color:#555;}

/* 新建菜单弹窗 */
.chat-new-menu{
  position:fixed;
  top:0;left:0;
  width:100%;height:100%;
  z-index:510;
  background:rgba(0,0,0,0.15);
  display:flex;
  justify-content:flex-end;
  padding-top:calc(var(--safe-t) + 50px);
  padding-right:16px;
  opacity:0;pointer-events:none;
  transition:opacity .2s;
}
.chat-new-menu.show{opacity:1;pointer-events:auto;}
.chat-new-menu-box{
  border-radius:14px;
  padding:6px 0;
  width:160px;
  height:fit-content;
  box-shadow:0 4px 20px rgba(0,0,0,0.08);
}
.chat-new-menu-item{
  padding:12px 18px;
  font-size:13px;
  color:var(--txt-pri);
  letter-spacing:1px;
  cursor:pointer;
  transition:background .2s;
}
.chat-new-menu-item:active{
  background:rgba(0,0,0,0.04);
}
body.dark-mode .chat-new-menu-box{
  background:rgba(40,40,40,0.95) !important;
  border-color:rgba(80,80,80,0.5) !important;
}
body.dark-mode .chat-new-menu-item{color:#e0e0e0;}
body.dark-mode .chat-new-menu-item:active{background:rgba(255,255,255,0.05);}
`;
document.head.appendChild(chatCSS);

// 注入聊天App HTML
const chatHTML=document.createElement('div');
chatHTML.id='app-chat';
chatHTML.className='app-page';
chatHTML.innerHTML=`
  <!-- 顶栏 -->
  <div class="chat-topbar">
    <span class="ct-back" onclick="closeApp('chat')">‹</span>
    <span class="ct-title">消息</span>
    <span class="ct-right" id="chat-new-btn">☌</span>
  </div>

  <!-- Tab栏 -->
  <div class="chat-tabs" id="chat-tabs">
    <div class="chat-tab active" data-tab="messages">聊天</div>
    <div class="chat-tab" data-tab="contacts">联系人</div>
    <div class="chat-tab" data-tab="moments">朋友圈</div>
    <div class="chat-tab" data-tab="profile">我</div>
  </div>

  <!-- Tab内容 -->
  <div class="chat-tab-content">
    <!-- 聊天列表 -->
    <div class="chat-tab-panel active" id="tab-messages">
      <div class="chat-empty" id="msg-empty">
        <div class="ce-icon">❝</div>
        <div>还没有聊天消息</div>
        <div style="font-size:11px;margin-top:6px;color:var(--txt-light);">点击右上角 ☌ 创建联系人开始聊天</div>
      </div>
      <div id="msg-list"></div>
    </div>

    <!-- 联系人列表 -->
    <div class="chat-tab-panel" id="tab-contacts">
      <div class="chat-empty" id="contact-empty">
        <div class="ce-icon">✧</div>
        <div>还没有联系人</div>
        <div style="font-size:11px;margin-top:6px;color:var(--txt-light);">点击右上角 ☌ 新建联系人</div>
      </div>
      <div id="contact-list"></div>
    </div>

    <!-- 朋友圈 -->
    <div class="chat-tab-panel" id="tab-moments">
      <div class="chat-empty" id="moments-empty">
        <div class="ce-icon">◐</div>
        <div>朋友圈</div>
        <div style="font-size:11px;margin-top:6px;color:var(--txt-light);">即将在后续阶段开放</div>
      </div>
    </div>

    <!-- 我 -->
    <div class="chat-tab-panel" id="tab-profile">
      <div class="chat-empty" id="profile-empty">
        <div class="ce-icon">𖥦</div>
        <div>个人设置</div>
        <div style="font-size:11px;margin-top:6px;color:var(--txt-light);">即将在后续阶段开放</div>
      </div>
    </div>
  </div>

  <!-- 新建菜单 -->
  <div class="chat-new-menu" id="chat-new-menu">
    <div class="chat-new-menu-box glass-strong">
      <div class="chat-new-menu-item" onclick="openNewContact()">✦ 新建联系人</div>
      <div class="chat-new-menu-item" onclick="openNewGroup()">✧ 新建群聊</div>
    </div>
  </div>
`;
document.body.appendChild(chatHTML);

// ============================
// Tab 切换
// ============================
const tabs=chatHTML.querySelectorAll('.chat-tab');
const panels=chatHTML.querySelectorAll('.chat-tab-panel');

tabs.forEach(tab=>{
  tab.addEventListener('click',()=>{
    const target=tab.dataset.tab;
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(p=>p.classList.remove('active'));
    const panel=chatHTML.querySelector('#tab-'+target);
    if(panel)panel.classList.add('active');

    // 切换顶栏标题
    const titleMap={
      messages:'消息',
      contacts:'联系人',
      moments:'朋友圈',
      profile:'我'
    };
    chatHTML.querySelector('.ct-title').textContent=titleMap[target]||'消息';
  });
});

// ============================
// 新建菜单
// ============================
const newMenu=$('#chat-new-menu');
const newBtn=$('#chat-new-btn');

newBtn.addEventListener('click',e=>{
  e.stopPropagation();
  newMenu.classList.toggle('show');
});

newMenu.addEventListener('click',e=>{
  if(e.target===newMenu){
    newMenu.classList.remove('show');
  }
});

window.openNewContact=function(){
  newMenu.classList.remove('show');
  // C2阶段实现
  if(window.showNewContactPage){
    window.showNewContactPage();
  }else{
    showToast('即将开放');
  }
};

window.openNewGroup=function(){
  newMenu.classList.remove('show');
  showToast('群聊功能将在后续开放');
};

console.log('❝ 聊天App框架 · C1 加载完毕');

})();
// ===== C1 结束 =====
// ============================
// 阶段C2：联系人创建
// ============================
(function initContactCreate(){

const contactCSS=document.createElement('style');
contactCSS.textContent=`
/* ===== 新建联系人页面 ===== */
#contact-create-page{
  position:fixed;top:0;left:0;
  width:100%;height:100%;
  z-index:220;
  background:var(--bg-pri);
  overflow-y:auto;
  padding:calc(var(--safe-t) + 12px) 0 calc(var(--safe-b) + 30px);
  transform:translateX(100%);
  transition:transform .35s cubic-bezier(.25,.46,.45,.94);
}
#contact-create-page.open{transform:translateX(0);}
body.dark-mode #contact-create-page{background:#1a1a1a;}

.cc-header{
  display:flex;align-items:center;
  justify-content:space-between;
  padding:8px 16px 14px;
}
.cc-header .cc-back{
  font-size:22px;color:var(--txt-sec);
  cursor:pointer;padding:4px 8px;
}
.cc-header .cc-back:active{transform:scale(0.85);}
.cc-header .cc-title{
  font-size:15px;letter-spacing:2px;
  color:var(--txt-pri);font-weight:400;
}
.cc-header .cc-save{
  font-size:13px;padding:6px 16px;
  border-radius:12px;
  background:var(--morandi-blue);
  color:#fff;letter-spacing:1px;
  cursor:pointer;transition:transform .15s;
}
.cc-header .cc-save:active{transform:scale(0.92);}
body.dark-mode .cc-header .cc-title{color:#e0e0e0;}
body.dark-mode .cc-header .cc-back{color:#999;}

.cc-body{padding:0 24px;}

/* 头像 */
.cc-avatar-wrap{
  display:flex;justify-content:center;
  margin-bottom:20px;
}
.cc-avatar{
  width:80px;height:80px;
  border-radius:50%;
  overflow:hidden;
  border:2px solid var(--glass-border);
  box-shadow:0 3px 14px var(--glass-shadow);
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  background:var(--bg-sec);
  position:relative;
  transition:transform .2s;
}
.cc-avatar:active{transform:scale(0.95);}
.cc-avatar img{
  width:100%;height:100%;object-fit:cover;
}
.cc-avatar .cc-avatar-ph{
  font-size:28px;color:var(--txt-light);
}
.cc-avatar .cc-avatar-plus{
  position:absolute;bottom:2px;right:2px;
  width:22px;height:22px;
  border-radius:50%;
  background:var(--morandi-blue);
  color:#fff;font-size:14px;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 1px 4px rgba(0,0,0,0.1);
}
body.dark-mode .cc-avatar{
  background:#2a2a2a;border-color:rgba(80,80,80,0.5);
}

/* 表单 */
.cc-field{margin-bottom:16px;}
.cc-field-label{
  font-size:12px;color:var(--txt-sec);
  letter-spacing:1px;margin-bottom:5px;
  display:flex;align-items:center;gap:4px;
}
.cc-field-label .required{color:#e07070;font-size:14px;}
.cc-field input,.cc-field textarea,.cc-field select{
  width:100%;padding:10px 14px;
  border-radius:12px;
  background:var(--bg-sec);
  font-size:13px;color:var(--txt-pri);
  border:1px solid var(--glass-border);
  transition:border-color .2s;
  font-family:inherit;
}
.cc-field input:focus,.cc-field textarea:focus{
  border-color:var(--morandi-blue);
}
.cc-field textarea{
  min-height:100px;resize:vertical;
  line-height:1.7;
}
body.dark-mode .cc-field input,
body.dark-mode .cc-field textarea,
body.dark-mode .cc-field select{
  background:#2a2a2a;color:#e0e0e0;
  border-color:rgba(80,80,80,0.4);
}
body.dark-mode .cc-field-label{color:#999;}

/* 性别选择 */
.cc-gender-row{
  display:flex;gap:10px;
}
.cc-gender-opt{
  flex:1;padding:10px 0;
  text-align:center;
  border-radius:12px;
  background:var(--bg-sec);
  font-size:13px;color:var(--txt-sec);
  cursor:pointer;
  border:1px solid var(--glass-border);
  transition:all .2s;
  letter-spacing:1px;
}
.cc-gender-opt.selected{
  background:var(--morandi-blue);
  color:#fff;
  border-color:var(--morandi-blue);
}
body.dark-mode .cc-gender-opt{
  background:#2a2a2a;color:#999;
  border-color:rgba(80,80,80,0.4);
}
body.dark-mode .cc-gender-opt.selected{
  background:var(--morandi-blue);color:#fff;
}

/* 世界书绑定 */
.cc-wb-list{
  display:flex;flex-wrap:wrap;gap:8px;
  margin-top:6px;
}
.cc-wb-tag{
  padding:6px 12px;
  border-radius:10px;
  background:var(--bg-sec);
  font-size:12px;color:var(--txt-sec);
  cursor:pointer;
  border:1px solid var(--glass-border);
  transition:all .2s;
  letter-spacing:1px;
}
.cc-wb-tag.selected{
  background:var(--morandi-blue);
  color:#fff;
  border-color:var(--morandi-blue);
}
body.dark-mode .cc-wb-tag{
  background:#2a2a2a;color:#999;
  border-color:rgba(80,80,80,0.4);
}
body.dark-mode .cc-wb-tag.selected{
  background:var(--morandi-blue);color:#fff;
}
.cc-wb-none{
  font-size:12px;color:var(--txt-light);
  padding:6px 0;
}

/* 联系人列表项 */
.contact-item{
  display:flex;align-items:center;
  padding:12px 16px;
  cursor:pointer;
  transition:background .2s;
}
.contact-item:active{background:rgba(0,0,0,0.03);}
.contact-item-avatar{
  width:44px;height:44px;
  border-radius:50%;overflow:hidden;
  background:var(--bg-sec);
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  border:1px solid var(--glass-border);
}
.contact-item-avatar img{width:100%;height:100%;object-fit:cover;}
.contact-item-avatar .ci-ph{font-size:18px;color:var(--txt-light);}
.contact-item-info{
  flex:1;margin-left:12px;
  min-width:0;
}
.contact-item-name{
  font-size:14px;color:var(--txt-pri);
  letter-spacing:1px;
}
.contact-item-desc{
  font-size:11px;color:var(--txt-sec);
  margin-top:2px;
  white-space:nowrap;overflow:hidden;
  text-overflow:ellipsis;
}
body.dark-mode .contact-item:active{background:rgba(255,255,255,0.03);}
body.dark-mode .contact-item-avatar{background:#2a2a2a;border-color:rgba(80,80,80,0.4);}
body.dark-mode .contact-item-name{color:#e0e0e0;}
body.dark-mode .contact-item-desc{color:#777;}
`;
document.head.appendChild(contactCSS);

// 注入新建联系人页面
const ccPage=document.createElement('div');
ccPage.id='contact-create-page';
ccPage.innerHTML=`
  <div class="cc-header">
    <span class="cc-back" onclick="closeContactCreate()">‹</span>
    <span class="cc-title">新建联系人</span>
    <button class="cc-save" onclick="saveContact()">保存</button>
  </div>
  <div class="cc-body">
    <!-- 头像 -->
    <div class="cc-avatar-wrap">
      <div class="cc-avatar" id="cc-avatar" onclick="pickContactAvatar()">
        <span class="cc-avatar-ph">𖥦</span>
        <span class="cc-avatar-plus">+</span>
      </div>
    </div>

    <!-- 名字 -->
    <div class="cc-field">
      <label class="cc-field-label"><span class="required">*</span> 名字</label>
      <input type="text" id="cc-name" placeholder="角色名字" maxlength="20">
    </div>

    <!-- 昵称 -->
    <div class="cc-field">
      <label class="cc-field-label">昵称</label>
      <input type="text" id="cc-nickname" placeholder="对你的称呼（选填）" maxlength="20">
    </div>

    <!-- 性别 -->
    <div class="cc-field">
      <label class="cc-field-label">性别</label>
      <div class="cc-gender-row" id="cc-gender-row">
        <div class="cc-gender-opt" data-g="男">男</div>
        <div class="cc-gender-opt" data-g="女">女</div>
        <div class="cc-gender-opt" data-g="其他">其他</div>
      </div>
    </div>

    <!-- 人设 -->
    <div class="cc-field">
      <label class="cc-field-label">人设</label>
      <textarea id="cc-persona" placeholder="角色的性格、背景、说话方式等…"></textarea>
    </div>

    <!-- 绑定世界书 -->
    <div class="cc-field">
      <label class="cc-field-label">绑定世界书</label>
      <div class="cc-wb-list" id="cc-wb-list">
        <span class="cc-wb-none">暂无世界书，请先在世界书App中创建</span>
      </div>
    </div>
  </div>
`;
document.body.appendChild(ccPage);

// 隐藏的头像文件选择器
const ccFilePicker=document.createElement('input');
ccFilePicker.type='file';ccFilePicker.accept='image/*';
ccFilePicker.style.display='none';
document.body.appendChild(ccFilePicker);

// ============================
// 联系人创建逻辑
// ============================
let ccAvatarSrc=null;
let ccGender='';
let ccSelectedWB=[];
let editingContactId=null;

// 打开新建页面
window.showNewContactPage=function(editId){
  editingContactId=editId||null;
  ccAvatarSrc=null;
  ccGender='';
  ccSelectedWB=[];

  // 重置表单
  $('#cc-avatar').innerHTML='<span class="cc-avatar-ph">𖥦</span><span class="cc-avatar-plus">+</span>';
  $('#cc-name').value='';
  $('#cc-nickname').value='';
  $('#cc-persona').value='';
  ccPage.querySelector('.cc-title').textContent='新建联系人';

  // 性别重置
  ccPage.querySelectorAll('.cc-gender-opt').forEach(o=>o.classList.remove('selected'));

  // 如果是编辑模式
  if(editId){
    const contacts=lsGet('tq_contacts',[]);
    const c=contacts.find(x=>x.id===editId);
    if(c){
      ccPage.querySelector('.cc-title').textContent='编辑联系人';
      $('#cc-name').value=c.name||'';
      $('#cc-nickname').value=c.nickname||'';
      $('#cc-persona').value=c.persona||'';
      ccGender=c.gender||'';
      ccAvatarSrc=c.avatar||null;
      ccSelectedWB=c.worldbooks||[];
      if(ccAvatarSrc){
        $('#cc-avatar').innerHTML='<img src="'+ccAvatarSrc+'" alt=""><span class="cc-avatar-plus">+</span>';
      }
      if(ccGender){
        ccPage.querySelectorAll('.cc-gender-opt').forEach(o=>{
          if(o.dataset.g===ccGender)o.classList.add('selected');
        });
      }
    }
  }

  // 加载世界书列表
  refreshWBList();

  ccPage.classList.add('open');
};

function closeContactCreate(){
  ccPage.classList.remove('open');
  editingContactId=null;
}
window.closeContactCreate=closeContactCreate;

// 性别选择
ccPage.querySelectorAll('.cc-gender-opt').forEach(opt=>{
  opt.addEventListener('click',()=>{
    ccPage.querySelectorAll('.cc-gender-opt').forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
    ccGender=opt.dataset.g;
  });
});

// 头像选择
window.pickContactAvatar=function(){
  openUploadModal('cc_avatar',(k,src)=>{
    ccAvatarSrc=src;
    $('#cc-avatar').innerHTML='<img src="'+src+'" alt=""><span class="cc-avatar-plus">+</span>';
  });
};

// 世界书列表
function refreshWBList(){
  const wbList=$('#cc-wb-list');
  const worldbooks=lsGet('tq_worldbooks',[]);
  if(worldbooks.length===0){
    wbList.innerHTML='<span class="cc-wb-none">暂无世界书，请先在世界书App中创建</span>';
    return;
  }
  wbList.innerHTML='';
  worldbooks.forEach(wb=>{
    const tag=document.createElement('div');
    tag.className='cc-wb-tag';
    if(ccSelectedWB.includes(wb.id))tag.classList.add('selected');
    tag.textContent=wb.name;
    tag.addEventListener('click',()=>{
      tag.classList.toggle('selected');
      if(tag.classList.contains('selected')){
        if(!ccSelectedWB.includes(wb.id))ccSelectedWB.push(wb.id);
      }else{
        ccSelectedWB=ccSelectedWB.filter(x=>x!==wb.id);
      }
    });
    wbList.appendChild(tag);
  });
}

// 保存联系人
window.saveContact=function(){
  const name=$('#cc-name').value.trim();
  if(!name){
    showToast('请填写角色名字');
    return;
  }

  const contacts=lsGet('tq_contacts',[]);
  const contactData={
    id:editingContactId||('c_'+Date.now()+'_'+Math.random().toString(36).substr(2,5)),
    name:name,
    nickname:$('#cc-nickname').value.trim(),
    gender:ccGender,
    persona:$('#cc-persona').value.trim(),
    avatar:ccAvatarSrc,
    worldbooks:ccSelectedWB,
    createdAt:Date.now()
  };

  if(editingContactId){
    const idx=contacts.findIndex(x=>x.id===editingContactId);
    if(idx>-1){
      contactData.createdAt=contacts[idx].createdAt;
      contacts[idx]=contactData;
    }
  }else{
    contacts.push(contactData);
  }

  lsSet('tq_contacts',contacts);
  renderContactList();
  closeContactCreate();
  showToast(editingContactId?'联系人已更新':'联系人已创建');

  // 切换到联系人Tab
  const contactTab=document.querySelector('.chat-tab[data-tab="contacts"]');
  if(contactTab)contactTab.click();
};

// ============================
// 联系人列表渲染
// ============================
function renderContactList(){
  const contacts=lsGet('tq_contacts',[]);
  const list=$('#contact-list');
  const empty=$('#contact-empty');

  if(contacts.length===0){
    empty.style.display='';
    list.innerHTML='';
    return;
  }

  empty.style.display='none';
  list.innerHTML='';

  contacts.forEach(c=>{
    const item=document.createElement('div');
    item.className='contact-item';
    const avatarHTML=c.avatar
      ?'<img src="'+c.avatar+'" alt="">'
      :'<span class="ci-ph">'+c.name.charAt(0)+'</span>';
    const genderText=c.gender?(' · '+c.gender):'';
    item.innerHTML=`
      <div class="contact-item-avatar">${avatarHTML}</div>
      <div class="contact-item-info">
        <div class="contact-item-name">${c.name}</div>
        <div class="contact-item-desc">${(c.nickname||'无昵称')+genderText}</div>
      </div>
    `;
    item.addEventListener('click',()=>{
      // C4阶段：打开聊天详情
      if(window.openChatDetail){
        window.openChatDetail(c.id);
      }else{
        showToast('聊天功能即将开放');
      }
    });
    // 长按编辑
    let pressTimer=null;
    item.addEventListener('touchstart',()=>{
      pressTimer=setTimeout(()=>{
        showModal('联系人操作',c.name,[
          {text:'编辑',type:'cancel',cb:()=>showNewContactPage(c.id)},
          {text:'删除',type:'confirm',cb:()=>{
            showModal('确认删除','确定删除联系人「'+c.name+'」？',[
              {text:'取消',type:'cancel'},
              {text:'删除',type:'confirm',cb:()=>{
                let cts=lsGet('tq_contacts',[]);
                cts=cts.filter(x=>x.id!==c.id);
                lsSet('tq_contacts',cts);
                renderContactList();
                showToast('已删除');
              }}
            ]);
          }}
        ]);
      },600);
    },{passive:true});
    item.addEventListener('touchend',()=>clearTimeout(pressTimer));
    item.addEventListener('touchmove',()=>clearTimeout(pressTimer));

    list.appendChild(item);
  });
}

// 初始渲染
renderContactList();

console.log('✦ 联系人创建 · C2 加载完毕');

})();
// ===== C2 结束 =====

// ============================
// C2补丁：加备注名字段
// ============================
(function patchC2(){
  const nicknameField=$('#cc-nickname').closest('.cc-field');
  const remarkField=document.createElement('div');
  remarkField.className='cc-field';
  remarkField.innerHTML=`
    <label class="cc-field-label">备注名</label>
    <input type="text" id="cc-remark" placeholder="你对角色的称呼（选填）" maxlength="20">
  `;
  nicknameField.parentNode.insertBefore(remarkField,nicknameField);

  // 修改原昵称的placeholder
  $('#cc-nickname').placeholder='角色对你的称呼（选填）';

  // 覆盖保存函数
  const origSave=window.saveContact;
  window.saveContact=function(){
    const name=$('#cc-name').value.trim();
    if(!name){showToast('请填写角色名字');return;}

    const contacts=lsGet('tq_contacts',[]);
    const contactData={
      id:editingContactId||('c_'+Date.now()+'_'+Math.random().toString(36).substr(2,5)),
      name:name,
      remark:$('#cc-remark').value.trim(),
      nickname:$('#cc-nickname').value.trim(),
      gender:ccGender,
      persona:$('#cc-persona').value.trim(),
      avatar:ccAvatarSrc,
      worldbooks:ccSelectedWB,
      createdAt:Date.now()
    };

    if(editingContactId){
      const idx=contacts.findIndex(x=>x.id===editingContactId);
      if(idx>-1){
        contactData.createdAt=contacts[idx].createdAt;
        contacts[idx]=contactData;
      }
    }else{
      contacts.push(contactData);
    }

    lsSet('tq_contacts',contacts);
    renderContactList();
    closeContactCreate();
    showToast(editingContactId?'联系人已更新':'联系人已创建');
    const contactTab=document.querySelector('.chat-tab[data-tab="contacts"]');
    if(contactTab)contactTab.click();
  };

  // 覆盖打开页面函数，恢复备注名
  const origOpen=window.showNewContactPage;
  window.showNewContactPage=function(editId){
    origOpen(editId);
    if(editId){
      const contacts=lsGet('tq_contacts',[]);
      const c=contacts.find(x=>x.id===editId);
      if(c)$('#cc-remark').value=c.remark||'';
    }else{
      $('#cc-remark').value='';
    }
  };
})();
// ============================
// C2补丁 + C3 聊天列表（修复版）
// ============================
(function initC2PatchAndC3(){

// ===== C2补丁：修复变量作用域 =====
// 把变量挂到window
window._ccGender='';
window._ccAvatarSrc=null;
window._ccSelectedWB=[];
window._ccEditingId=null;

// 加备注名字段
const nicknameField=$('#cc-nickname').closest('.cc-field');
if(!$('#cc-remark')){
  const remarkField=document.createElement('div');
  remarkField.className='cc-field';
  remarkField.innerHTML=`
    <label class="cc-field-label">备注名</label>
    <input type="text" id="cc-remark" placeholder="你对角色的称呼（选填）" maxlength="20">
  `;
  nicknameField.parentNode.insertBefore(remarkField,nicknameField);
}
$('#cc-nickname').placeholder='角色对你的称呼（选填）';

// 覆盖性别点击
document.querySelectorAll('.cc-gender-opt').forEach(opt=>{
  const newOpt=opt.cloneNode(true);
  opt.parentNode.replaceChild(newOpt,opt);
  newOpt.addEventListener('click',()=>{
    document.querySelectorAll('.cc-gender-opt').forEach(o=>o.classList.remove('selected'));
    newOpt.classList.add('selected');
    window._ccGender=newOpt.dataset.g;
  });
});

// 覆盖头像选择
window.pickContactAvatar=function(){
  openUploadModal('cc_avatar',(k,src)=>{
    window._ccAvatarSrc=src;
    $('#cc-avatar').innerHTML='<img src="'+src+'" alt=""><span class="cc-avatar-plus">+</span>';
  });
};

// 覆盖打开页面
window.showNewContactPage=function(editId){
  window._ccEditingId=editId||null;
  window._ccAvatarSrc=null;
  window._ccGender='';
  window._ccSelectedWB=[];

  $('#cc-avatar').innerHTML='<span class="cc-avatar-ph">𖥦</span><span class="cc-avatar-plus">+</span>';
  $('#cc-name').value='';
  $('#cc-nickname').value='';
  $('#cc-remark').value='';
  $('#cc-persona').value='';

  const titleEl=document.querySelector('#contact-create-page .cc-title');
  if(titleEl)titleEl.textContent='新建联系人';

  document.querySelectorAll('.cc-gender-opt').forEach(o=>o.classList.remove('selected'));

  if(editId){
    const contacts=lsGet('tq_contacts',[]);
    const c=contacts.find(x=>x.id===editId);
    if(c){
      if(titleEl)titleEl.textContent='编辑联系人';
      $('#cc-name').value=c.name||'';
      $('#cc-nickname').value=c.nickname||'';
      $('#cc-remark').value=c.remark||'';
      $('#cc-persona').value=c.persona||'';
      window._ccGender=c.gender||'';
      window._ccAvatarSrc=c.avatar||null;
      window._ccSelectedWB=c.worldbooks||[];
      if(window._ccAvatarSrc){
        $('#cc-avatar').innerHTML='<img src="'+window._ccAvatarSrc+'" alt=""><span class="cc-avatar-plus">+</span>';
      }
      if(window._ccGender){
        document.querySelectorAll('.cc-gender-opt').forEach(o=>{
          if(o.dataset.g===window._ccGender)o.classList.add('selected');
        });
      }
    }
  }

  // 世界书列表
  const wbList=$('#cc-wb-list');
  const worldbooks=lsGet('tq_worldbooks',[]);
  if(worldbooks.length===0){
    wbList.innerHTML='<span class="cc-wb-none">暂无世界书</span>';
  }else{
    wbList.innerHTML='';
    worldbooks.forEach(wb=>{
      const tag=document.createElement('div');
      tag.className='cc-wb-tag';
      if(window._ccSelectedWB.includes(wb.id))tag.classList.add('selected');
      tag.textContent=wb.name;
      tag.addEventListener('click',()=>{
        tag.classList.toggle('selected');
        if(tag.classList.contains('selected')){
          if(!window._ccSelectedWB.includes(wb.id))window._ccSelectedWB.push(wb.id);
        }else{
          window._ccSelectedWB=window._ccSelectedWB.filter(x=>x!==wb.id);
        }
      });
      wbList.appendChild(tag);
    });
  }

  document.getElementById('contact-create-page').classList.add('open');
};

// 覆盖保存
window.saveContact=function(){
  const name=$('#cc-name').value.trim();
  if(!name){showToast('请填写角色名字');return;}

  const contacts=lsGet('tq_contacts',[]);
  const contactData={
    id:window._ccEditingId||('c_'+Date.now()+'_'+Math.random().toString(36).substr(2,5)),
    name:name,
    remark:$('#cc-remark').value.trim(),
    nickname:$('#cc-nickname').value.trim(),
    gender:window._ccGender,
    persona:$('#cc-persona').value.trim(),
    avatar:window._ccAvatarSrc,
    worldbooks:window._ccSelectedWB,
    createdAt:Date.now()
  };

  if(window._ccEditingId){
    const idx=contacts.findIndex(x=>x.id===window._ccEditingId);
    if(idx>-1){
      contactData.createdAt=contacts[idx].createdAt;
      contacts[idx]=contactData;
    }
  }else{
    contacts.push(contactData);
  }

  lsSet('tq_contacts',contacts);
  window.renderContactList();
  window.renderMsgList();
  window.closeContactCreate();
  showToast(window._ccEditingId?'联系人已更新':'联系人已创建');

  const contactTab=document.querySelector('.chat-tab[data-tab="contacts"]');
  if(contactTab)contactTab.click();
};

// ===== C3 聊天列表 CSS =====
const listCSS=document.createElement('style');
listCSS.textContent=`
.msg-search-wrap{padding:6px 16px 8px;position:relative;}
.msg-search{
  width:100%;padding:9px 14px 9px 34px;
  border-radius:12px;background:var(--bg-sec);
  font-size:13px;color:var(--txt-pri);
  border:1px solid var(--glass-border);
}
.msg-search:focus{border-color:var(--morandi-blue);}
.msg-search-icon{
  position:absolute;left:28px;top:50%;
  transform:translateY(-50%);
  font-size:14px;color:var(--txt-light);pointer-events:none;
}
body.dark-mode .msg-search{background:#2a2a2a;color:#e0e0e0;border-color:rgba(80,80,80,0.4);}
.msg-item-wrap{position:relative;overflow:hidden;}
.msg-item{
  display:flex;align-items:center;padding:12px 16px;
  cursor:pointer;transition:transform .3s;
  background:var(--bg-pri);position:relative;z-index:2;
}
body.dark-mode .msg-item{background:#1a1a1a;}
.msg-item:active{background:rgba(0,0,0,0.03);}
body.dark-mode .msg-item:active{background:rgba(255,255,255,0.03);}
.msg-item-avatar{
  width:48px;height:48px;border-radius:50%;overflow:hidden;
  background:var(--bg-sec);flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  border:1px solid var(--glass-border);position:relative;
}
.msg-item-avatar img{width:100%;height:100%;object-fit:cover;}
.msg-item-avatar .mi-ph{font-size:18px;color:var(--txt-light);}
body.dark-mode .msg-item-avatar{background:#2a2a2a;border-color:rgba(80,80,80,0.4);}
.msg-badge{
  position:absolute;top:-2px;right:-2px;
  min-width:16px;height:16px;border-radius:8px;
  background:#e07070;color:#fff;font-size:10px;
  display:flex;align-items:center;justify-content:center;
  padding:0 4px;
}
.msg-item-body{flex:1;margin-left:12px;min-width:0;}
.msg-item-top{display:flex;justify-content:space-between;align-items:center;}
.msg-item-name{
  font-size:14px;color:var(--txt-pri);letter-spacing:1px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60%;
}
.msg-item-time{font-size:10px;color:var(--txt-light);flex-shrink:0;}
.msg-item-preview{
  font-size:12px;color:var(--txt-sec);margin-top:3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
body.dark-mode .msg-item-name{color:#e0e0e0;}
body.dark-mode .msg-item-time{color:#555;}
body.dark-mode .msg-item-preview{color:#777;}
.msg-item.pinned{background:rgba(154,171,184,0.06);}
body.dark-mode .msg-item.pinned{background:rgba(154,171,184,0.08);}
.msg-item-delete{
  position:absolute;right:0;top:0;height:100%;width:70px;
  background:#e07070;color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;z-index:1;cursor:pointer;
}
`;
document.head.appendChild(listCSS);

// 注入搜索栏
const msgPanel=$('#tab-messages');
const searchWrap=document.createElement('div');
searchWrap.className='msg-search-wrap';
searchWrap.innerHTML=`
  <span class="msg-search-icon">⌕</span>
  <input class="msg-search" id="msg-search" type="text" placeholder="搜索聊天记录…">
`;
msgPanel.insertBefore(searchWrap,msgPanel.firstChild);

// ===== 工具函数 =====
function getDisplayName(c){return c.remark||c.name;}

function getLastMsg(cid){
  const msgs=lsGet('tq_msgs_'+cid,[]);
  return msgs.length?msgs[msgs.length-1]:null;
}

function getUnreadCount(cid){
  const msgs=lsGet('tq_msgs_'+cid,[]);
  let n=0;
  for(let i=msgs.length-1;i>=0;i--){
    if(msgs[i].read===false&&msgs[i].role==='char')n++;
    else break;
  }
  return n;
}

function fmtTime(ts){
  if(!ts)return '';
  const d=new Date(ts);const now=new Date();
  const diff=now-d;
  if(diff<60000)return '刚刚';
  if(diff<3600000)return Math.floor(diff/60000)+'分钟前';
  if(d.toDateString()===now.toDateString())
    return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  const y=new Date(now);y.setDate(y.getDate()-1);
  if(d.toDateString()===y.toDateString())return '昨天';
  return (d.getMonth()+1)+'/'+d.getDate();
}

// ===== 聊天列表渲染 =====
window.renderMsgList=function(){
  const contacts=lsGet('tq_contacts',[]);
  const pinned=lsGet('tq_chat_pinned',[]);
  const container=$('#msg-list');
  const empty=$('#msg-empty');

  let list=[];
  contacts.forEach(c=>{
    const lm=getLastMsg(c.id);
    const ip=pinned.includes(c.id);
    if(lm||ip){
      list.push({c:c,lm:lm,ip:ip,unread:getUnreadCount(c.id),st:lm?lm.time:c.createdAt});
    }
  });
  list.sort((a,b)=>{
    if(a.ip&&!b.ip)return -1;
    if(!a.ip&&b.ip)return 1;
    return b.st-a.st;
  });

  if(list.length===0){
    empty.style.display='';container.innerHTML='';return;
  }
  empty.style.display='none';container.innerHTML='';

  list.forEach(item=>{
    const c=item.c;
    const wrap=document.createElement('div');
    wrap.className='msg-item-wrap';

    const delBtn=document.createElement('div');
    delBtn.className='msg-item-delete';delBtn.textContent='删除';
    delBtn.addEventListener('click',()=>{
      showModal('删除聊天','确定删除与「'+getDisplayName(c)+'」的聊天？',[
        {text:'取消',type:'cancel'},
        {text:'删除',type:'confirm',cb:()=>{
          LS.removeItem('tq_msgs_'+c.id);
          let p=lsGet('tq_chat_pinned',[]);
          p=p.filter(x=>x!==c.id);lsSet('tq_chat_pinned',p);
          renderMsgList();showToast('已删除');
        }}
      ]);
    });
    wrap.appendChild(delBtn);

    const el=document.createElement('div');
    el.className='msg-item'+(item.ip?' pinned':'');
    const avHTML=c.avatar?'<img src="'+c.avatar+'" alt="">':'<span class="mi-ph">'+c.name.charAt(0)+'</span>';
    const badge=item.unread>0?'<div class="msg-badge">'+item.unread+'</div>':'';
    const prev=item.lm?(item.lm.role==='user'?'我：':'')+item.lm.text.substring(0,30):'';
    el.innerHTML=`
      <div class="msg-item-avatar">${avHTML}${badge}</div>
      <div class="msg-item-body">
        <div class="msg-item-top">
          <div class="msg-item-name">${getDisplayName(c)}</div>
          <div class="msg-item-time">${fmtTime(item.lm?item.lm.time:null)}</div>
        </div>
        <div class="msg-item-preview">${prev}</div>
      </div>
    `;

    el.addEventListener('click',()=>{
      if(window.openChatDetail)window.openChatDetail(c.id);
      else showToast('聊天功能即将开放');
    });

    // 左滑
    let sx=0,cx=0,sw=false;
    el.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;cx=0;sw=false;},{passive:true});
    el.addEventListener('touchmove',e=>{
      const dx=e.touches[0].clientX-sx;
      if(dx<-10){sw=true;cx=Math.max(dx,-70);el.style.transform='translateX('+cx+'px)';}
    },{passive:true});
    el.addEventListener('touchend',()=>{
      if(sw){el.style.transform=cx<-35?'translateX(-70px)':'translateX(0)';}sw=false;
    },{passive:true});

    // 长按
    let pt=null;
    el.addEventListener('touchstart',()=>{
      pt=setTimeout(()=>{
        const pp=lsGet('tq_chat_pinned',[]);
        const isP=pp.includes(c.id);
        showModal('聊天操作',getDisplayName(c),[
          {text:isP?'取消置顶':'置顶',type:'cancel',cb:()=>{
            let p2=lsGet('tq_chat_pinned',[]);
            if(isP)p2=p2.filter(x=>x!==c.id);else p2.unshift(c.id);
            lsSet('tq_chat_pinned',p2);renderMsgList();
            showToast(isP?'已取消置顶':'已置顶');
          }},
          {text:'删除聊天',type:'confirm',cb:()=>{
            LS.removeItem('tq_msgs_'+c.id);
            let p3=lsGet('tq_chat_pinned',[]);
            p3=p3.filter(x=>x!==c.id);lsSet('tq_chat_pinned',p3);
            renderMsgList();showToast('已删除');
          }}
        ]);
      },600);
    },{passive:true});
    el.addEventListener('touchend',()=>clearTimeout(pt));
    el.addEventListener('touchmove',()=>clearTimeout(pt));

    wrap.appendChild(el);
    container.appendChild(wrap);
  });
};
// ===== 搜索功能 =====
$('#msg-search').addEventListener('input',function(){
  const kw=this.value.trim().toLowerCase();
  const container=$('#msg-list');
  if(!kw){renderMsgList();return;}

  const contacts=lsGet('tq_contacts',[]);
  const results=[];
  contacts.forEach(c=>{
    const msgs=lsGet('tq_msgs_'+c.id,[]);
    const matched=msgs.filter(m=>m.text&&m.text.toLowerCase().includes(kw));
    const nameMatch=c.name.toLowerCase().includes(kw)||
      (c.remark&&c.remark.toLowerCase().includes(kw));
    if(matched.length>0||nameMatch){
      results.push({c:c,matches:matched});
    }
  });

  $('#msg-empty').style.display='none';
  if(results.length===0){
    container.innerHTML='<div class="chat-empty" style="min-height:150px;"><div class="ce-icon">⌕</div><div>未找到相关结果</div></div>';
    return;
  }
  container.innerHTML='';
  results.forEach(r=>{
    const c=r.c;
    const el=document.createElement('div');
    el.className='msg-item';
    const avHTML=c.avatar?'<img src="'+c.avatar+'" alt="">':'<span class="mi-ph">'+c.name.charAt(0)+'</span>';
    let prev=r.matches.length>0
      ?r.matches[r.matches.length-1].text.substring(0,40)+' ('+r.matches.length+'条)'
      :'联系人匹配';
    el.innerHTML=`
      <div class="msg-item-avatar">${avHTML}</div>
      <div class="msg-item-body">
        <div class="msg-item-top"><div class="msg-item-name">${c.remark||c.name}</div></div>
        <div class="msg-item-preview">${prev}</div>
      </div>
    `;
    el.addEventListener('click',()=>{
      if(window.openChatDetail)window.openChatDetail(c.id);
      else showToast('聊天功能即将开放');
    });
    container.appendChild(el);
  });
});

// ===== 联系人列表渲染（支持备注名） =====
window.renderContactList=function(){
  const contacts=lsGet('tq_contacts',[]);
  const list=$('#contact-list');
  const empty=$('#contact-empty');

  if(contacts.length===0){
    empty.style.display='';list.innerHTML='';return;
  }
  empty.style.display='none';list.innerHTML='';

  contacts.forEach(c=>{
    const item=document.createElement('div');
    item.className='contact-item';
    const avHTML=c.avatar
      ?'<img src="'+c.avatar+'" alt="">'
      :'<span class="ci-ph">'+c.name.charAt(0)+'</span>';
    const rStr=c.remark?('备注：'+c.remark+' · '):'';
    const nStr=c.nickname?('称你：'+c.nickname):'';
    const gStr=c.gender?(' · '+c.gender):'';
    item.innerHTML=`
      <div class="contact-item-avatar">${avHTML}</div>
      <div class="contact-item-info">
        <div class="contact-item-name">${c.name}</div>
        <div class="contact-item-desc">${rStr+nStr+gStr}</div>
      </div>
    `;
    item.addEventListener('click',()=>{
      if(window.openChatDetail)window.openChatDetail(c.id);
      else showToast('聊天功能即将开放');
    });
    let pt=null;
    item.addEventListener('touchstart',()=>{
      pt=setTimeout(()=>{
        showModal('联系人操作',c.name,[
          {text:'编辑',type:'cancel',cb:()=>showNewContactPage(c.id)},
          {text:'删除',type:'confirm',cb:()=>{
            showModal('确认删除','确定删除「'+c.name+'」？',[
              {text:'取消',type:'cancel'},
              {text:'删除',type:'confirm',cb:()=>{
                let cts=lsGet('tq_contacts',[]);
                cts=cts.filter(x=>x.id!==c.id);
                lsSet('tq_contacts',cts);
                renderContactList();
                renderMsgList();
                showToast('已删除');
              }}
            ]);
          }}
        ]);
      },600);
    },{passive:true});
    item.addEventListener('touchend',()=>clearTimeout(pt));
    item.addEventListener('touchmove',()=>clearTimeout(pt));
    list.appendChild(item);
  });
};

// 初始渲染
renderMsgList();
renderContactList();

console.log('❝ C2补丁+C3聊天列表 加载完毕');

})();
// ===== C2补丁+C3 结束 =====
// ============================
// 补丁：聊天列表显示所有联系人
// ============================
(function patchMsgList(){

window.renderMsgList=function(){
  const contacts=lsGet('tq_contacts',[]);
  const pinned=lsGet('tq_chat_pinned',[]);
  const container=$('#msg-list');
  const empty=$('#msg-empty');

  if(contacts.length===0){
    empty.style.display='';container.innerHTML='';return;
  }
  empty.style.display='none';container.innerHTML='';

  function getLastMsg(cid){
    const msgs=lsGet('tq_msgs_'+cid,[]);
    return msgs.length?msgs[msgs.length-1]:null;
  }
  function getUnread(cid){
    const msgs=lsGet('tq_msgs_'+cid,[]);
    let n=0;
    for(let i=msgs.length-1;i>=0;i--){
      if(msgs[i].read===false&&msgs[i].role==='char')n++;else break;
    }
    return n;
  }
  function fmtTime(ts){
    if(!ts)return '';
    const d=new Date(ts);const now=new Date();const diff=now-d;
    if(diff<60000)return '刚刚';
    if(diff<3600000)return Math.floor(diff/60000)+'分钟前';
    if(d.toDateString()===now.toDateString())
      return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    const y=new Date(now);y.setDate(y.getDate()-1);
    if(d.toDateString()===y.toDateString())return '昨天';
    return (d.getMonth()+1)+'/'+d.getDate();
  }

  let list=[];
  contacts.forEach(c=>{
    const lm=getLastMsg(c.id);
    const ip=pinned.includes(c.id);
    list.push({c:c,lm:lm,ip:ip,unread:getUnread(c.id),st:lm?lm.time:c.createdAt});
  });
  list.sort((a,b)=>{
    if(a.ip&&!b.ip)return -1;
    if(!a.ip&&b.ip)return 1;
    return b.st-a.st;
  });

  list.forEach(item=>{
    const c=item.c;
    const wrap=document.createElement('div');
    wrap.className='msg-item-wrap';

    const delBtn=document.createElement('div');
    delBtn.className='msg-item-delete';delBtn.textContent='删除';
    delBtn.addEventListener('click',()=>{
      showModal('删除聊天','确定删除与「'+(c.remark||c.name)+'」的聊天？',[
        {text:'取消',type:'cancel'},
        {text:'删除',type:'confirm',cb:()=>{
          LS.removeItem('tq_msgs_'+c.id);
          let p=lsGet('tq_chat_pinned',[]);
          p=p.filter(x=>x!==c.id);lsSet('tq_chat_pinned',p);
          renderMsgList();showToast('已删除');
        }}
      ]);
    });
    wrap.appendChild(delBtn);

    const el=document.createElement('div');
    el.className='msg-item'+(item.ip?' pinned':'');
    const avHTML=c.avatar?'<img src="'+c.avatar+'" alt="">':'<span class="mi-ph">'+c.name.charAt(0)+'</span>';
    const badge=item.unread>0?'<div class="msg-badge">'+item.unread+'</div>':'';
    const prev=item.lm?(item.lm.role==='user'?'我：':'')+item.lm.text.substring(0,30):'点击开始聊天';
    const timeStr=item.lm?fmtTime(item.lm.time):'';
    el.innerHTML=`
      <div class="msg-item-avatar">${avHTML}${badge}</div>
      <div class="msg-item-body">
        <div class="msg-item-top">
          <div class="msg-item-name">${c.remark||c.name}</div>
          <div class="msg-item-time">${timeStr}</div>
        </div>
        <div class="msg-item-preview">${prev}</div>
      </div>
    `;

    el.addEventListener('click',()=>{
      if(window.openChatDetail)window.openChatDetail(c.id);
      else showToast('聊天功能即将开放');
    });

    let sx=0,cx=0,sw=false;
    el.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;cx=0;sw=false;},{passive:true});
    el.addEventListener('touchmove',e=>{
      const dx=e.touches[0].clientX-sx;
      if(dx<-10){sw=true;cx=Math.max(dx,-70);el.style.transform='translateX('+cx+'px)';}
    },{passive:true});
    el.addEventListener('touchend',()=>{
      if(sw){el.style.transform=cx<-35?'translateX(-70px)':'translateX(0)';}sw=false;
    },{passive:true});

    let pt=null;
    el.addEventListener('touchstart',()=>{
      pt=setTimeout(()=>{
        const pp=lsGet('tq_chat_pinned',[]);
        const isP=pp.includes(c.id);
        showModal('聊天操作',c.remark||c.name,[
          {text:isP?'取消置顶':'置顶',type:'cancel',cb:()=>{
            let p2=lsGet('tq_chat_pinned',[]);
            if(isP)p2=p2.filter(x=>x!==c.id);else p2.unshift(c.id);
            lsSet('tq_chat_pinned',p2);renderMsgList();
            showToast(isP?'已取消置顶':'已置顶');
          }},
          {text:'删除聊天',type:'confirm',cb:()=>{
            LS.removeItem('tq_msgs_'+c.id);
            let p3=lsGet('tq_chat_pinned',[]);
            p3=p3.filter(x=>x!==c.id);lsSet('tq_chat_pinned',p3);
            renderMsgList();showToast('已删除');
          }}
        ]);
      },600);
    },{passive:true});
    el.addEventListener('touchend',()=>clearTimeout(pt));
    el.addEventListener('touchmove',()=>clearTimeout(pt));

    wrap.appendChild(el);
    container.appendChild(wrap);
  });
};

renderMsgList();
console.log('🔧 聊天列表补丁已加载');
})();

// ============================
// 补丁：修复删除键闪出
// ============================
(function patchDelete(){
const fixCSS=document.createElement('style');
fixCSS.textContent=`
.msg-item-wrap{overflow:hidden !important;}
.msg-item-delete{
  opacity:0;
  transition:opacity .2s;
  pointer-events:none;
}
.msg-item-wrap.swiped .msg-item-delete{
  opacity:1;
  pointer-events:auto;
}
.msg-item{
  transition:transform .2s ease !important;
}
`;
document.head.appendChild(fixCSS);

// 覆盖渲染中的滑动逻辑
const origRender=window.renderMsgList;
const patchedRender=function(){
  origRender();
  // 重新绑定滑动逻辑
  document.querySelectorAll('.msg-item-wrap').forEach(wrap=>{
    const el=wrap.querySelector('.msg-item');
    if(!el)return;
    let sx=0,cx=0,sw=false,moved=false;

    el.addEventListener('touchstart',e=>{
      sx=e.touches[0].clientX;cx=0;sw=false;moved=false;
      // 收起其他已展开的
      document.querySelectorAll('.msg-item-wrap.swiped').forEach(w=>{
        if(w!==wrap){
          w.classList.remove('swiped');
          w.querySelector('.msg-item').style.transform='translateX(0)';
        }
      });
    },{passive:true});

    el.addEventListener('touchmove',e=>{
      moved=true;
      const dx=e.touches[0].clientX-sx;
      if(dx<-10){
        sw=true;
        cx=Math.max(dx,-70);
        el.style.transform='translateX('+cx+'px)';
        wrap.classList.add('swiped');
      }else if(dx>10&&wrap.classList.contains('swiped')){
        sw=true;
        cx=Math.min(dx,0);
        el.style.transform='translateX('+cx+'px)';
      }
    },{passive:true});

    el.addEventListener('touchend',()=>{
      if(sw){
        if(cx<-35){
          el.style.transform='translateX(-70px)';
          wrap.classList.add('swiped');
        }else{
          el.style.transform='translateX(0)';
          wrap.classList.remove('swiped');
        }
      }
      sw=false;
    },{passive:true});

    // 点击收起已展开的删除键
    el.addEventListener('click',e=>{
      if(wrap.classList.contains('swiped')){
        e.stopPropagation();
        e.preventDefault();
        el.style.transform='translateX(0)';
        wrap.classList.remove('swiped');
        return false;
      }
    },true);
  });
};

window.renderMsgList=patchedRender;
patchedRender();

console.log('🔧 删除键修复已加载');
})();
// ============================
// 阶段C4：聊天详情页（重写版）
// ============================
(function initC4(){

const c4css=document.createElement('style');
c4css.textContent=`
#chat-detail{
  position:fixed;top:0;left:0;width:100%;height:100%;
  z-index:230;background:var(--bg-pri);
  display:flex;flex-direction:column;
  transform:translateX(100%);
  transition:transform .35s cubic-bezier(.25,.46,.45,.94);
}
#chat-detail.open{transform:translateX(0);}
body.dark-mode #chat-detail{background:#1a1a1a;}

.cd-topbar{
  display:flex;align-items:center;
  padding:calc(var(--safe-t) + 8px) 12px 8px;
  flex-shrink:0;background:var(--bg-pri);
  border-bottom:1px solid var(--glass-border);
}
body.dark-mode .cd-topbar{background:#1a1a1a;border-color:rgba(80,80,80,0.3);}
.cd-topbar .cd-back{font-size:24px;color:var(--txt-sec);cursor:pointer;padding:4px 10px 4px 4px;}
.cd-topbar .cd-back:active{transform:scale(0.85);}
.cd-topbar-center{flex:1;text-align:center;min-width:0;}
.cd-topbar-name{font-size:15px;letter-spacing:1px;color:var(--txt-pri);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cd-topbar-status{font-size:10px;color:var(--txt-light);letter-spacing:1px;margin-top:1px;}
.cd-topbar .cd-menu{font-size:20px;color:var(--txt-sec);cursor:pointer;padding:4px 4px 4px 10px;}
body.dark-mode .cd-topbar-name{color:#e0e0e0;}
body.dark-mode .cd-topbar-status{color:#666;}
body.dark-mode .cd-topbar .cd-back,body.dark-mode .cd-topbar .cd-menu{color:#999;}

.cd-messages{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 14px;}
.cd-time-sep{text-align:center;margin:14px 0 10px;font-size:10px;color:var(--txt-light);letter-spacing:1px;}
body.dark-mode .cd-time-sep{color:#555;}

.cd-msg-row{display:flex;align-items:flex-start;margin-bottom:6px;}
.cd-msg-row.user{flex-direction:row-reverse;}
.cd-msg-avatar{
  width:34px;height:34px;border-radius:50%;overflow:hidden;flex-shrink:0;
  background:var(--bg-sec);display:flex;align-items:center;justify-content:center;
  border:1px solid var(--glass-border);cursor:pointer;
}
.cd-msg-avatar img{width:100%;height:100%;object-fit:cover;}
.cd-msg-avatar .ma-ph{font-size:13px;color:var(--txt-light);}
body.dark-mode .cd-msg-avatar{background:#2a2a2a;border-color:rgba(80,80,80,0.4);}

.cd-bubble-wrap{max-width:75%;}
.cd-msg-bubble{
  display:inline-block;width:fit-content;max-width:100%;
  white-space:pre-wrap;word-break:normal;overflow-wrap:anywhere;
  padding:7px 11px;border-radius:16px;
  font-size:12px;line-height:1.6;letter-spacing:0.3px;
  background:var(--glass-bg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border:1px solid var(--glass-border);color:var(--txt-pri);
}
.cd-msg-row.char .cd-msg-bubble{margin-left:8px;border-top-left-radius:4px;}
.cd-msg-row.user .cd-msg-bubble{margin-right:8px;border-top-right-radius:4px;}
body.dark-mode .cd-msg-bubble{
  background:rgba(40,40,40,0.6);border-color:rgba(80,80,80,0.4);color:#e0e0e0;
}

.cd-msg-quote{
  font-size:10px;color:var(--txt-sec);padding:3px 7px;margin-bottom:3px;
  border-left:2px solid var(--morandi-blue);border-radius:2px;
  background:rgba(0,0,0,0.03);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.cd-msg-status{font-size:9px;color:var(--txt-light);margin-top:2px;}
.cd-msg-row.char .cd-msg-status{text-align:left;margin-left:8px;}
.cd-msg-row.user .cd-msg-status{text-align:right;margin-right:8px;}

.cd-typing{display:flex;align-items:center;gap:4px;padding:8px 14px;margin-left:42px;margin-bottom:6px;}
.cd-typing span{width:5px;height:5px;border-radius:50%;background:var(--txt-light);animation:typB 1.2s infinite;}
.cd-typing span:nth-child(2){animation-delay:.2s;}
.cd-typing span:nth-child(3){animation-delay:.4s;}
@keyframes typB{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-5px);opacity:1;}}

.cd-inputbar{
  flex-shrink:0;padding:6px 10px calc(var(--safe-b) + 6px);
  background:var(--bg-pri);border-top:1px solid var(--glass-border);
}
body.dark-mode .cd-inputbar{background:#1a1a1a;border-color:rgba(80,80,80,0.3);}
.cd-quote-bar{display:none;align-items:center;padding:5px 10px;margin-bottom:4px;background:var(--bg-sec);border-radius:10px;font-size:11px;color:var(--txt-sec);}
.cd-quote-bar.show{display:flex;}
.cd-quote-bar .qb-text{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cd-quote-bar .qb-close{font-size:16px;color:var(--txt-light);cursor:pointer;margin-left:8px;}
.cd-input-row{display:flex;align-items:flex-end;gap:6px;}
.cd-expand-btn{
  width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:16px;color:var(--txt-sec);cursor:pointer;flex-shrink:0;transition:transform .3s;
}
.cd-expand-btn.rotated{transform:rotate(180deg);}
.cd-input-wrap{
  flex:1;border-radius:18px;background:var(--bg-sec);
  border:1px solid var(--glass-border);padding:0 12px;display:flex;align-items:center;min-height:34px;
}
.cd-input-wrap:focus-within{border-color:var(--morandi-blue);}
body.dark-mode .cd-input-wrap{background:#2a2a2a;border-color:rgba(80,80,80,0.4);}
.cd-input{
  width:100%;border:none;background:transparent;font-size:13px;color:var(--txt-pri);
  padding:7px 0;resize:none;max-height:100px;line-height:1.5;font-family:inherit;
}
.cd-input::placeholder{color:var(--silver);font-family:var(--font-cur);font-style:italic;}
body.dark-mode .cd-input{color:#e0e0e0;}
.cd-send-btns{display:flex;gap:3px;flex-shrink:0;}
.cd-send-btn{
  width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:15px;cursor:pointer;color:var(--morandi-blue);
}
.cd-send-btn:active{transform:scale(0.85);}
`;
document.head.appendChild(c4css);

// HTML
const dp=document.createElement('div');
dp.id='chat-detail';
dp.innerHTML=`
  <div class="cd-topbar">
    <span class="cd-back" onclick="window.closeChatDetail()">‹</span>
    <div class="cd-topbar-center">
      <div class="cd-topbar-name" id="cd-name">角色名</div>
      <div class="cd-topbar-status" id="cd-status">在线</div>
    </div>
    <span class="cd-menu" onclick="window.openChatSettings()">☰</span>
  </div>
  <div class="cd-messages" id="cd-messages"></div>
  <div class="cd-inputbar">
    <div class="cd-quote-bar" id="cd-quote-bar">
      <span class="qb-text" id="cd-quote-text"></span>
      <span class="qb-close" onclick="window.clearQuote()">✕</span>
    </div>
    <div class="cd-input-row">
      <div class="cd-expand-btn" id="cd-expand-btn" onclick="window.toggleExpand()">▾</div>
      <div class="cd-input-wrap">
        <textarea class="cd-input" id="cd-input" placeholder="say…" rows="1"></textarea>
      </div>
      <div class="cd-send-btns">
        <div class="cd-send-btn" onclick="window.triggerAIReply()" title="AI回复">↩</div>
        <div class="cd-send-btn" onclick="window.sendUserMsg()" title="发送">➹</div>
      </div>
    </div>
  </div>
`;
document.body.appendChild(dp);

// ============================
// 全局变量（挂window，所有补丁可访问）
// ============================
window._cdChatId=null;
window._cdContact=null;
window._cdQuote=null;
window._cdReplying=false;

// 打开
window.openChatDetail=function(cid){
  const contacts=lsGet('tq_contacts',[]);
  const c=contacts.find(x=>x.id===cid);
  if(!c){showToast('联系人不存在');return;}

  window._cdChatId=cid;
  window._cdContact=c;
  window._cdQuote=null;

  $('#cd-name').textContent=c.remark||c.name;
  $('#cd-status').textContent='在线';
  $('#cd-input').value='';
  window.clearQuote();

  // 标记已读
  const msgs=lsGet('tq_msgs_'+cid,[]);
  let changed=false;
  msgs.forEach(m=>{if(m.role==='char'&&m.read===false){m.read=true;changed=true;}});
  if(changed)lsSet('tq_msgs_'+cid,msgs);

  window.renderChatMessages();
  document.getElementById('chat-detail').classList.add('open');
  setTimeout(window.scrollChatBottom,100);
};

// 关闭
window.closeChatDetail=function(){
  document.getElementById('chat-detail').classList.remove('open');
  window._cdChatId=null;
  window._cdContact=null;
  if(window.renderMsgList)renderMsgList();
};

// 滚到底
window.scrollChatBottom=function(){
  const a=$('#cd-messages');
  if(a)a.scrollTop=a.scrollHeight;
};

// 引用
window.setQuote=function(msg){
  window._cdQuote=msg;
  $('#cd-quote-text').textContent=msg.text.substring(0,40);
  $('#cd-quote-bar').classList.add('show');
};
window.clearQuote=function(){
  window._cdQuote=null;
  $('#cd-quote-bar').classList.remove('show');
  $('#cd-quote-text').textContent='';
};

// 展开占位
window.toggleExpand=function(){
  showToast('展开功能将在下一阶段开放');
};

// 设置占位
window.openChatSettings=function(){
  showToast('聊天设置将在后续开放');
};

// 时间工具
function shouldShowTime(msgs,idx){
  if(idx===0)return true;
  return(msgs[idx].time-msgs[idx-1].time)>300000;
}
function fmtFullTime(ts){
  const d=new Date(ts);const now=new Date();
  const h=String(d.getHours()).padStart(2,'0');
  const m=String(d.getMinutes()).padStart(2,'0');
  if(d.toDateString()===now.toDateString())return h+':'+m;
  const y=new Date(now);y.setDate(y.getDate()-1);
  if(d.toDateString()===y.toDateString())return '昨天 '+h+':'+m;
  return(d.getMonth()+1)+'/'+d.getDate()+' '+h+':'+m;
}

// ============================
// 渲染消息
// ============================
window.renderChatMessages=function(){
  const area=$('#cd-messages');
  if(!window._cdChatId){area.innerHTML='';return;}

  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  area.innerHTML='';

  if(msgs.length===0){
    area.innerHTML='<div style="text-align:center;padding:40px 0;color:var(--txt-light);font-size:11px;letter-spacing:1px;">发一条消息开始聊天吧 ✧</div>';
    return;
  }

  const cc=window._cdContact;
  const userAv=lsGet('tq_user_avatar',null);

  msgs.forEach((msg,idx)=>{
    if(shouldShowTime(msgs,idx)){
      const sep=document.createElement('div');
      sep.className='cd-time-sep';
      sep.textContent=fmtFullTime(msg.time);
      area.appendChild(sep);
    }

    const row=document.createElement('div');
    row.className='cd-msg-row '+(msg.role==='user'?'user':'char');
    row.dataset.msgId=msg.id;

    const av=document.createElement('div');
    av.className='cd-msg-avatar';
    if(msg.role==='user'){
      av.innerHTML=userAv?'<img src="'+userAv+'" alt="">':'<span class="ma-ph">我</span>';
    }else{
      av.innerHTML=cc&&cc.avatar?'<img src="'+cc.avatar+'" alt="">':'<span class="ma-ph">'+(cc?cc.name.charAt(0):'?')+'</span>';
    }
    row.appendChild(av);

    const wrap=document.createElement('div');
    wrap.className='cd-bubble-wrap';

    if(msg.quote){
      const q=document.createElement('div');
      q.className='cd-msg-quote';
      q.textContent=msg.quote;
      wrap.appendChild(q);
    }

    const bubble=document.createElement('div');
    bubble.className='cd-msg-bubble';
    bubble.textContent=msg.text;
    wrap.appendChild(bubble);

    const st=document.createElement('div');
    st.className='cd-msg-status';
    if(msg.role==='user'){
      st.textContent='已发送';
    }
    wrap.appendChild(st);

    row.appendChild(wrap);
    area.appendChild(row);
  });
};

// ============================
// 发送消息
// ============================
window.sendUserMsg=function(){
  const input=$('#cd-input');
  const text=input.value.trim();
  if(!text||!window._cdChatId)return;

  const msg={
    id:'m_'+Date.now()+'_'+Math.random().toString(36).substr(2,4),
    role:'user',
    text:text,
    time:Date.now(),
    read:true,
    quote:window._cdQuote?window._cdQuote.text.substring(0,50):null
  };

  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  msgs.push(msg);
  lsSet('tq_msgs_'+window._cdChatId,msgs);

  input.value='';
  input.style.height='auto';
  window.clearQuote();
  window.renderChatMessages();
  window.scrollChatBottom();

  // 自动触发AI
  setTimeout(()=>window.triggerAIReply(),500);
};

// 回车发送
$('#cd-input').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey){
    e.preventDefault();
    window.sendUserMsg();
  }
});

// 输入框自适应
$('#cd-input').addEventListener('input',function(){
  this.style.height='auto';
  this.style.height=Math.min(this.scrollHeight,100)+'px';
});

// ============================
// AI 回复
// ============================
window.triggerAIReply=async function(){
  if(!window._cdChatId||!window._cdContact)return;
  if(window._cdReplying){showToast('正在回复中…');return;}

  const api=lsGet('tq_api_main',null);
  if(!api||!api.url||!api.key||!api.model){
    showToast('请先在设置中配置主API');return;
  }

  window._cdReplying=true;
  const cc=window._cdContact;
  const area=$('#cd-messages');

  // 打字动画
  const typing=document.createElement('div');
  typing.className='cd-typing';typing.id='cd-typing';
  typing.innerHTML='<span></span><span></span><span></span>';
  area.appendChild(typing);
  window.scrollChatBottom();

  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  const recent=msgs.slice(-30);

  // 世界书
  let wbText='';
  const wbs=lsGet('tq_worldbooks',[]);
  if(cc.worldbooks&&cc.worldbooks.length>0){
    cc.worldbooks.forEach(id=>{
      const wb=wbs.find(w=>w.id===id);
      if(wb)wbText+='\n【'+wb.name+'】\n'+wb.content+'\n';
    });
  }
  wbs.forEach(wb=>{
    if(wb.global&&(!cc.worldbooks||!cc.worldbooks.includes(wb.id))){
      wbText+='\n【'+wb.name+'】\n'+wb.content+'\n';
    }
  });

  const userName=lsGet('tq_user_name','用户');
  const callMe=cc.nickname||userName;

  const sysPrompt=`【你是「${cc.name}」，不是AI，不是助手，你是一个真实的人。】

【${cc.name}的人设 - 最高优先级，严格遵守】
${cc.persona||'（用户未设定人设，请表现出自然的个性）'}
${cc.gender?'性别：'+cc.gender:''}
${wbText?'\n【世界观设定】'+wbText:''}

【你与对方的关系】
- 对方叫「${userName}」，你称呼对方为「${callMe}」
- 根据人设决定你们的关系和相处方式

【聊天格式要求】
- 这是微信聊天，像真人一样发消息
- 不要写动作描写、不要写心理活动、不要写旁白
- 只发纯文字，可以用emoji和颜文字
- 回复拆成3条以上独立消息，用|||分隔
- 每条消息简短自然，像真人打字
- 例如：在干嘛呢|||我刚吃完饭|||你呢

【核心原则】
- 你有自己的情绪、想法、生活节奏
- 根据人设自主决定态度
- 不要讨好，不要每句都很热情，要真实自然
- 任何话题都可以聊，不受限制`;

  const apiMessages=[{role:'system',content:sysPrompt}];
  recent.forEach(m=>{
    apiMessages.push({role:m.role==='user'?'user':'assistant',content:m.text});
  });

  try{
    const reply=await tqCallAPI('main',apiMessages,{temperature:0.9});
    const t=document.getElementById('cd-typing');
    if(t)t.remove();

    if(!reply){
      window._cdReplying=false;
      showToast('AI回复失败');
      return;
    }

    // 清理 *动作* 和 （动作）
    let cleaned=reply.replace(/\*[^*]+\*/g,'').replace(/（[^）]+）/g,'').trim();

    // 拆分消息
    let parts=cleaned.split('|||').map(s=>s.trim()).filter(Boolean);
    if(parts.length===0)parts=[cleaned];

    // 如果没有|||分隔，尝试按换行拆
    if(parts.length===1&&parts[0].includes('\n')){
      const lines=parts[0].split('\n').map(s=>s.trim()).filter(Boolean);
      if(lines.length>=2)parts=lines;
    }

    // 逐条发送带延迟
    const allMsgs=lsGet('tq_msgs_'+window._cdChatId,[]);
    for(let i=0;i<parts.length;i++){
      await new Promise(r=>setTimeout(r,400+Math.random()*600));
      allMsgs.push({
        id:'m_'+Date.now()+'_'+Math.random().toString(36).substr(2,4),
        role:'char',
        text:parts[i],
        time:Date.now(),
        read:true
      });
      lsSet('tq_msgs_'+window._cdChatId,allMsgs);
      window.renderChatMessages();
      window.scrollChatBottom();
    }

  }catch(e){
    const t=document.getElementById('cd-typing');
    if(t)t.remove();
    showToast('回复出错：'+e.message);
  }

  window._cdReplying=false;
};

console.log('聊天详情页 · C4重写版 加载完毕');

})();
// ===== C4 重写版结束 =====


// ============================
// 修复：发送不自动触发AI
// ============================
(function fixSend(){
  window.sendUserMsg=function(){
    const input=$('#cd-input');
    const text=input.value.trim();
    if(!text||!window._cdChatId)return;

    const msg={
      id:'m_'+Date.now()+'_'+Math.random().toString(36).substr(2,4),
      role:'user',text:text,time:Date.now(),read:true,
      quote:window._cdQuote?window._cdQuote.text.substring(0,50):null
    };
    const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
    msgs.push(msg);
    lsSet('tq_msgs_'+window._cdChatId,msgs);
    input.value='';input.style.height='auto';
    window.clearQuote();
    window.renderChatMessages();
    window.scrollChatBottom();
  };
})();
// ============================
// 温度滑条
// ============================
(function initTemp(){
  const tCSS=document.createElement('style');
  tCSS.textContent=`
  .set-temp-wrap{margin-top:12px;}
  .set-temp-row{display:flex;align-items:center;gap:10px;}
  .set-temp-slider{
    flex:1;-webkit-appearance:none;appearance:none;
    height:4px;border-radius:2px;background:var(--bg-sec);
    border:1px solid var(--glass-border);outline:none;
  }
  .set-temp-slider::-webkit-slider-thumb{
    -webkit-appearance:none;width:18px;height:18px;border-radius:50%;
    background:var(--morandi-blue);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.15);
  }
  .set-temp-val{min-width:36px;text-align:center;font-size:13px;color:var(--txt-pri);font-weight:500;}
  .set-temp-hint{font-size:10px;color:var(--txt-sec);margin-top:4px;line-height:1.5;}
  body.dark-mode .set-temp-slider{background:#2a2a2a;border-color:rgba(80,80,80,0.4);}
  body.dark-mode .set-temp-val{color:#e0e0e0;}
  `;
  document.head.appendChild(tCSS);

  const apiContent=document.querySelector('#sg-api .set-group-content');
  if(apiContent){
    const tw=document.createElement('div');
    tw.className='set-temp-wrap';
    tw.innerHTML=`
      <div class="set-divider"></div>
      <div style="font-size:13px;color:var(--morandi-green);margin-bottom:8px;letter-spacing:1px;">回复温度</div>
      <div class="set-label">越低越遵循人设，越高越自由发挥</div>
      <div class="set-temp-row">
        <span style="font-size:10px;color:var(--txt-sec);">0</span>
        <input type="range" class="set-temp-slider" id="set-temperature" min="0" max="2" step="0.05" value="0.85">
        <span style="font-size:10px;color:var(--txt-sec);">2</span>
        <span class="set-temp-val" id="set-temp-val">0.85</span>
      </div>
      <div class="set-temp-hint">0~0.3 严格 · 0.4~0.7 稳定 · 0.8~1.2 活泼 · 1.3~2.0 奔放</div>
      <div class="set-btn-row" style="margin-top:8px;">
        <button class="set-btn set-btn-pri" onclick="saveTemperature()">保存</button>
      </div>
    `;
    apiContent.appendChild(tw);
  }
  const st=lsGet('tq_temperature',0.85);
  if($('#set-temperature')){$('#set-temperature').value=st;$('#set-temp-val').textContent=parseFloat(st).toFixed(2);}
  if($('#set-temperature'))$('#set-temperature').addEventListener('input',function(){$('#set-temp-val').textContent=parseFloat(this.value).toFixed(2);});
  window.saveTemperature=function(){lsSet('tq_temperature',parseFloat($('#set-temperature').value));showToast('温度已保存');};
})();


// ============================
// 阶段C5：心声弹窗 + 戳一戳
// ============================
(function initC5(){

const c5css=document.createElement('style');
c5css.textContent=`
/* ===== 心声/戳一戳弹窗 ===== */
.heart-overlay{
  position:fixed;top:0;left:0;width:100%;height:100%;
  z-index:600;background:rgba(0,0,0,0.25);
  display:flex;align-items:center;justify-content:center;
  opacity:0;pointer-events:none;transition:opacity .3s;
}
.heart-overlay.show{opacity:1;pointer-events:auto;}

.heart-box{
  width:min(75vw,280px);
  max-height:80vh;
  border-radius:20px;
  overflow:hidden;
  transform:scale(0.9);
  transition:transform .3s;
  position:relative;
  display:flex;flex-direction:column;
  background:rgba(255,255,255,0.85);
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,0.8);
  box-shadow:0 8px 40px rgba(0,0,0,0.08);
}
.heart-overlay.show .heart-box{transform:scale(1);}
body.dark-mode .heart-box{
  background:rgba(30,30,30,0.9);
  border-color:rgba(80,80,80,0.4);
}

/* 银饰花边顶部 */
.heart-border-top{
  text-align:center;
  padding:6px 0 0;
  font-size:13px;
  letter-spacing:6px;
  color:var(--silver);
  opacity:0.6;
  line-height:1;
}

/* 顶栏按钮 */
.heart-header{
  display:flex;justify-content:space-between;
  padding:4px 14px;flex-shrink:0;
}
.heart-header button{
  font-size:16px;color:var(--txt-sec);
  cursor:pointer;background:none;border:none;
  padding:4px 6px;
}
.heart-header button:active{transform:scale(0.85);}
body.dark-mode .heart-header button{color:#999;}

/* 头像区 */
.heart-avatar-area{
  display:flex;flex-direction:column;
  align-items:center;padding:0 14px 8px;flex-shrink:0;
}
.heart-avatar{
  width:56px;height:56px;border-radius:50%;
  overflow:hidden;border:2px solid var(--silver);
  box-shadow:0 2px 12px rgba(192,192,192,0.3);
  margin-bottom:6px;
}
.heart-avatar img{width:100%;height:100%;object-fit:cover;}
.heart-avatar .ha-ph{
  width:100%;height:100%;display:flex;align-items:center;
  justify-content:center;font-size:20px;color:var(--txt-light);
  background:var(--bg-sec);
}
.heart-status{
  font-size:10px;color:var(--txt-sec);
  text-align:center;line-height:1.5;
  max-width:90%;word-break:break-word;
}
body.dark-mode .heart-status{color:#888;}

/* 银饰分隔 */
.heart-divider{
  text-align:center;
  font-size:10px;letter-spacing:8px;
  color:var(--silver);opacity:0.5;
  padding:4px 0;flex-shrink:0;
}

/* 滚动内容区 */
.heart-content{
  flex:1;overflow-y:auto;
  padding:0 14px 10px;
  -webkit-overflow-scrolling:touch;
}

/* 心声项 */
.heart-item{
  margin-bottom:10px;
  border-radius:14px;
  padding:10px 12px;
  background:rgba(245,243,240,0.6);
  border:1px solid rgba(200,200,200,0.2);
}
body.dark-mode .heart-item{
  background:rgba(50,50,50,0.4);
  border-color:rgba(80,80,80,0.3);
}
.heart-item-title{
  font-size:10px;color:var(--silver);
  font-style:italic;text-decoration:underline;
  letter-spacing:1px;margin-bottom:5px;
  font-family:var(--font-cur);
}
.heart-item-text{
  font-size:11px;line-height:1.7;
  color:var(--txt-pri);
  word-break:break-word;
  white-space:pre-wrap;
}
body.dark-mode .heart-item-text{color:#ddd;}

/* 银饰花边底部 */
.heart-border-bottom{
  text-align:center;
  padding:0 0 8px;
  font-size:13px;
  letter-spacing:6px;
  color:var(--silver);
  opacity:0.6;
  line-height:1;
  flex-shrink:0;
}

/* 加载状态 */
.heart-loading{
  text-align:center;padding:30px 0;
  font-size:11px;color:var(--txt-light);
  letter-spacing:1px;
}
.heart-loading .hl-dots{
  display:inline-flex;gap:3px;margin-top:8px;
}
.heart-loading .hl-dots span{
  width:4px;height:4px;border-radius:50%;
  background:var(--silver);animation:typB 1.2s infinite;
}
.heart-loading .hl-dots span:nth-child(2){animation-delay:.2s;}
.heart-loading .hl-dots span:nth-child(3){animation-delay:.4s;}

/* 戳一戳专用 */
.poke-reaction{
  text-align:center;
  padding:6px 14px 2px;
  font-size:10px;
  color:var(--morandi-pink);
  font-style:italic;
  letter-spacing:1px;
  flex-shrink:0;
}
`;
document.head.appendChild(c5css);

// ===== HTML：心声弹窗 =====
const heartOverlay=document.createElement('div');
heartOverlay.className='heart-overlay';
heartOverlay.id='heart-overlay';
heartOverlay.innerHTML=`
<div class="heart-box" id="heart-box">
  <div class="heart-border-top">✦·.·✧·.·✦·.·✧·.·✦</div>
  <div class="heart-header">
    <button onclick="window.refreshHeart()" title="刷新">↺</button>
    <button onclick="window.closeHeart()">✕</button>
  </div>
  <div class="heart-avatar-area">
    <div class="heart-avatar" id="heart-avatar"></div>
    <div class="heart-status" id="heart-status">加载中…</div>
  </div>
  <div class="heart-divider">·✧·.·✦·.·✧·</div>
  <div class="heart-content" id="heart-content"></div>
  <div class="heart-border-bottom">✦·.·✧·.·✦·.·✧·.·✦</div>
</div>
`;
document.body.appendChild(heartOverlay);

// 点空白关闭
heartOverlay.addEventListener('click',e=>{
  if(e.target===heartOverlay)window.closeHeart();
});

// ===== HTML：戳一戳弹窗 =====
const pokeOverlay=document.createElement('div');
pokeOverlay.className='heart-overlay';
pokeOverlay.id='poke-overlay';
pokeOverlay.innerHTML=`
<div class="heart-box" id="poke-box">
  <div class="heart-border-top">✦·.·✧·.·✦·.·✧·.·✦</div>
  <div class="heart-header">
    <span></span>
    <button onclick="window.closePoke()">✕</button>
  </div>
  <div class="heart-avatar-area">
    <div class="heart-avatar" id="poke-avatar"></div>
    <div class="poke-reaction" id="poke-reaction"></div>
  </div>
  <div class="heart-divider">·✧·.·✦·.·✧·</div>
  <div class="heart-content" id="poke-content"></div>
  <div class="heart-border-bottom">✦·.·✧·.·✦·.·✧·.·✦</div>
</div>
`;
document.body.appendChild(pokeOverlay);

pokeOverlay.addEventListener('click',e=>{
  if(e.target===pokeOverlay)window.closePoke();
});

// ============================
// 头像点击：单击=心声 双击=戳一戳
// ============================
window._clickTimer=null;
window._clickCount=0;
window._pokeCount=0;

// 给消息渲染加头像事件
const origRenderChat=window.renderChatMessages;
window.renderChatMessages=function(){
  origRenderChat();

  // 给角色头像绑定事件
  const avatars=document.querySelectorAll('.cd-msg-row.char .cd-msg-avatar');
  avatars.forEach(av=>{
    av.addEventListener('click',e=>{
      e.stopPropagation();
      window._clickCount++;
      if(window._clickCount===1){
        window._clickTimer=setTimeout(()=>{
          // 单击 → 心声
          window._clickCount=0;
          window.showHeart();
        },300);
      }else if(window._clickCount>=2){
        // 双击 → 戳一戳
        clearTimeout(window._clickTimer);
        window._clickCount=0;
        window.showPoke();
      }
    });
  });
};
// ============================
// 心声弹窗
// ============================
window.showHeart=function(){
  if(!window._cdContact)return;
  const cc=window._cdContact;

  // 设置头像
  const avEl=$('#heart-avatar');
  avEl.innerHTML=cc.avatar
    ?'<img src="'+cc.avatar+'" alt="">'
    :'<div class="ha-ph">'+cc.name.charAt(0)+'</div>';

  $('#heart-status').textContent='读取中…';
  $('#heart-content').innerHTML='<div class="heart-loading">正在感知心声<div class="hl-dots"><span></span><span></span><span></span></div></div>';

  heartOverlay.classList.add('show');
  window.fetchHeart();
};

window.closeHeart=function(){
  heartOverlay.classList.remove('show');
};

window.refreshHeart=function(){
  $('#heart-content').innerHTML='<div class="heart-loading">正在刷新心声<div class="hl-dots"><span></span><span></span><span></span></div></div>';
  window.fetchHeart();
};

window.fetchHeart=async function(){
  const cc=window._cdContact;
  if(!cc)return;

  const api=lsGet('tq_api_main',null);
  if(!api||!api.url||!api.key||!api.model){
    $('#heart-status').textContent='API未配置';
    $('#heart-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:var(--txt-sec);">请先在设置中配置API</div></div>';
    return;
  }

  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  const recent=msgs.slice(-15);
  let chatContext='';
  recent.forEach(m=>{
    chatContext+=(m.role==='user'?'对方':'我')+'说：'+m.text+'\n';
  });

  const prompt=`你是「${cc.name}」。
${cc.persona||''}
${cc.gender?'性别：'+cc.gender:''}

以下是最近的聊天记录（"我"是${cc.name}，"对方"是和你聊天的人）：
${chatContext||'（暂无聊天记录）'}

请你以「${cc.name}」内存的视角，输出以下内容，每项3-4句话，完整输出不要截断：

当前状态:（用一小段话描述你现在的整体状态，作为状态栏显示）

当前模样:（描述你此刻的表情和神态）

当前心情:（描述你此刻的情绪感受）

当前着装:（描述你现在穿着什么）

当前动作:（描述你正在做什么具体动作）

当前所想:（你内心真实的想法，针对最近聊天内容）

当前行为:（你正在做的具体小动作或小习惯）

最想做:（你现在最想做的事情）

格式严格按照：
当前状态:内容
当前模样:内容
当前心情:内容
当前着装:内容
当前动作:内容
当前所想:内容
当前行为:内容
最想做:内容

不要加任何额外符号或解释。`;

  try{
    const reply=await tqCallAPI('main',[
      {role:'system',content:'你是'+cc.name+'，请严格按照要求格式输出。不要加*动作*描写。'},
      {role:'user',content:prompt}
    ],{temperature:0.85,max_tokens:1200});

    if(!reply){
      $('#heart-status').textContent='获取失败';
      $('#heart-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">API返回为空，请检查API配置和模型是否正确</div></div>';
      return;
    }

    // 解析回复
    const fields=['当前状态','当前模样','当前心情','当前着装','当前动作','当前所想','当前行为','最想做'];
    const titles=['Current State','Appearance','Mood','Outfit','Action','Thoughts','Behavior','Desire'];
    const parsed={};

    fields.forEach(f=>{
      const reg=new RegExp(f+'[:：]\\s*([\\s\\S]*?)(?=(?:当前模样|当前心情|当前着装|当前动作|当前所想|当前行为|最想做)[:：]|$)');
      const match=reply.match(reg);
      if(match)parsed[f]=match[1].trim();
    });

    // 状态栏
    const statusText=parsed['当前状态']||'感知中…';
    $('#heart-status').textContent=statusText;

    // 内容
    const contentEl=$('#heart-content');
    contentEl.innerHTML='';

    const displayFields=['当前模样','当前心情','当前着装','当前动作','当前所想','当前行为','最想做'];
    const displayTitles=['Appearance','Mood','Outfit','Action','Thoughts','Behavior','Desire'];

    displayFields.forEach((f,i)=>{
      const text=parsed[f]||'……';
      const item=document.createElement('div');
      item.className='heart-item';
      item.innerHTML=`
        <div class="heart-item-title">${displayTitles[i]}</div>
        <div class="heart-item-text">${text}</div>
      `;
      contentEl.appendChild(item);
    });

  }catch(e){
    $('#heart-status').textContent='出错了';
    $('#heart-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">API请求出错：'+e.message+'</div></div>';
  }
};

// ============================
// 戳一戳
// ============================
window._pokeCount=0;
window._pokeHistory=[];

window.showPoke=function(){
  if(!window._cdContact)return;
  const cc=window._cdContact;
  window._pokeCount++;

  const avEl=$('#poke-avatar');
  avEl.innerHTML=cc.avatar
    ?'<img src="'+cc.avatar+'" alt="">'
    :'<div class="ha-ph">'+cc.name.charAt(0)+'</div>';

  $('#poke-reaction').textContent='你戳了戳 '+cc.name+'（第'+window._pokeCount+'次）';
  $('#poke-content').innerHTML='<div class="heart-loading">等待反应<div class="hl-dots"><span></span><span></span><span></span></div></div>';

  pokeOverlay.classList.add('show');
  window.fetchPoke();
};

window.closePoke=function(){
  pokeOverlay.classList.remove('show');
};

window.fetchPoke=async function(){
  const cc=window._cdContact;
  if(!cc)return;

  const api=lsGet('tq_api_main',null);
  if(!api||!api.url||!api.key||!api.model){
    $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">请先在设置中配置API</div></div>';
    return;
  }

  const count=window._pokeCount;
  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  const recent=msgs.slice(-10);
  let chatCtx='';
  recent.forEach(m=>{
    chatCtx+=(m.role==='user'?'对方':'我')+'说：'+m.text+'\n';
  });

  // 之前的戳一戳记录，避免重复
  const prevPokes=window._pokeHistory.slice(-3).map(p=>'之前你的反应：'+p).join('\n');

  const prompt=`你是「${cc.name}」。
${cc.persona||''}
${cc.gender?'性别：'+cc.gender:''}

最近聊天（"我"是${cc.name}，"对方"是和你聊天的人）：
${chatCtx||'（暂无）'}

对方刚才戳了戳你，这是第${count}次被戳。

${prevPokes?'【注意：不要重复之前的反应，要有新的变化】\n'+prevPokes:''}

根据你的人设和被戳次数，你的反应会循序渐进变化：
- 第1-2次：可能觉得好玩/好奇/害羞
- 第3-5次：可能宠溺/撒娇/轻微不耐烦/口是心非
- 第6次以上：根据人设可能很不耐烦/生气/或者反而很享受

请以「${cc.name}」的内心视角，输出以下内容，每项完整输出3-4句话不要截断：

表面反应:（你表面上对被戳的反应，说了什么话、什么表情）

内心想法:（你内心真实的感受，可以和表面不同）

小动作:（你被戳后做了什么具体的小动作）

格式：
表面反应:内容
内心想法:内容
小动作:内容

不要加*动作*描写，不要加额外符号。`;

  try{
    const reply=await tqCallAPI('main',[
      {role:'system',content:'你是'+cc.name+'，输出严格按要求格式。'},
      {role:'user',content:prompt}
    ],{temperature:0.92,max_tokens:800});

    if(!reply){
      $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">API返回为空，请检查API配置和模型</div></div>';
      return;
    }

    // 解析
    const fields=['表面反应','内心想法','小动作'];
    const titles=['Reaction','Inner Thoughts','Little Action'];
    const parsed={};

    fields.forEach(f=>{
      const reg=new RegExp(f+'[:：]\\s*([\\s\\S]*?)(?=(?:内心想法|小动作)[:：]|$)');
      const match=reply.match(reg);
      if(match)parsed[f]=match[1].trim();
    });

    // 记录到历史避免重复
    const summary=Object.values(parsed).filter(Boolean).join(' ').substring(0,60);
    window._pokeHistory.push(summary);
    if(window._pokeHistory.length>6)window._pokeHistory.shift();

    // 渲染
    const contentEl=$('#poke-content');
    contentEl.innerHTML='';

    fields.forEach((f,i)=>{
      const text=parsed[f]||'……';
      const item=document.createElement('div');
      item.className='heart-item';
      item.innerHTML=`
        <div class="heart-item-title">${titles[i]}</div>
        <div class="heart-item-text">${text}</div>
      `;
      contentEl.appendChild(item);
    });

  }catch(e){
    $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">API请求出错：'+e.message+'</div></div>';
  }
};

// 重置戳一戳计数（切换角色时）
const origOpenDetail=window.openChatDetail;
window.openChatDetail=function(cid){
  window._pokeCount=0;
  window._pokeHistory=[];
  origOpenDetail(cid);
};

console.log('💕 心声+戳一戳 · C5 加载完毕');

})();
// ===== C5 结束 =====

// ============================
// 补丁B：心声兼容+认知修复+去第一人称
// ============================
(function patchB(){

function splitNums(text,count){
  const r=[];
  for(let i=1;i<=count;i++){
    const cur=text.indexOf(i+'.');
    if(cur===-1){r.push('…');continue;}
    let s=cur+(i+'.').length;
    const after=text.substring(s);
    const skip=after.match(/^[\s:：]*/);
    if(skip)s+=skip[0].length;
    let e=text.length;
    if(i<count){const n=text.indexOf((i+1)+'.',s);if(n>-1)e=n;}
    r.push(text.substring(s,e).trim()||'…');
  }
  return r;
}

window.fetchHeart=async function(){
  const cc=window._cdContact;
  if(!cc)return;

  const api=lsGet('tq_api_main',null);
  if(!api||!api.url||!api.key||!api.model){
    $('#heart-status').textContent='API未配置';
    $('#heart-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:var(--txt-sec);">请先配置API</div></div>';
    return;
  }

  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  const recent=msgs.slice(-10);
  const userName=lsGet('tq_user_name','用户');

  let ctx='';
  recent.forEach(m=>{
    if(m.role==='user'){
      ctx+=userName+'（对方）说：'+m.text+'\n';
    }else{
      ctx+=cc.name+'（角色本人）说：'+m.text+'\n';
    }
  });

  try{
    const reply=await tqCallAPI('main',[
      {role:'system',content:'你扮演'+cc.name+'。'+(cc.persona||'')+(cc.gender?'，性别'+cc.gender:'')+'\n'+userName+'是和你聊天的对方。'},
      {role:'user',content:`描述${cc.name}现在的状态。
不要用"我"开头，直接描述，像旁白一样。
例如：微微皱着眉，有点走神。
而不是：我微微皱着眉。
每项1-2句，不加*号括号。

${ctx?'最近'+cc.name+'和'+userName+'的聊天：\n'+ctx:'暂无聊天'}

按编号回答：
1.${cc.name}现在的状态（一句话）
2.表情神态
3.心情
4.穿着
5.正在做什么
6.对${userName}的真实想法
7.一个小动作
8.最想做什么`}
    ],{temperature:0.85,max_tokens:8192});

    if(!reply){
      $('#heart-status').textContent='获取失败';
      $('#heart-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">API返回为空，可能是模型不支持或API配置有误</div></div>';
      return;
    }

    const parts=splitNums(reply,8);
    const titles=['Appearance','Mood','Outfit','Action','Thoughts','Behavior','Desire'];

    $('#heart-status').textContent=parts[0]||'…';

    const el=$('#heart-content');
    el.innerHTML='';
    for(let i=0;i<7;i++){
      const d=document.createElement('div');
      d.className='heart-item';
      d.innerHTML='<div class="heart-item-title">'+titles[i]+'</div><div class="heart-item-text">'+(parts[i+1]||'…')+'</div>';
      el.appendChild(d);
    }

  }catch(e){
    $('#heart-status').textContent='出错了';
    $('#heart-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">请求失败：'+e.message+'<br>建议：换一个模型试试</div></div>';
  }
};

window.fetchPoke=async function(){
  const cc=window._cdContact;
  if(!cc)return;

  const api=lsGet('tq_api_main',null);
  if(!api||!api.url||!api.key||!api.model){
    $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">请先配置API</div></div>';
    return;
  }

  const count=window._pokeCount;
  const prevPokes=window._pokeHistory.slice(-3).join('；');
  const userName=lsGet('tq_user_name','用户');

  try{
    const reply=await tqCallAPI('main',[
      {role:'system',content:'你扮演'+cc.name+'。'+(cc.persona||'')+'\n'+userName+'是戳你的人。'},
      {role:'user',content:`${userName}戳了${cc.name}第${count}次。${prevPokes?'之前反应：'+prevPokes+'。这次要不同。':''}

不要用"我"开头，直接描述${cc.name}的反应，像旁白。
每项1-2句，不加*号括号：
1.${cc.name}表面的反应
2.${cc.name}内心真实感受
3.${cc.name}做了什么小动作`}
    ],{temperature:0.92,max_tokens:8192});

    if(!reply){
      $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">API返回为空，建议换模型试试</div></div>';
      return;
    }

    const parts=splitNums(reply,3);
    const titles=['Reaction','Inner Thoughts','Little Action'];

    const summary=parts.join(' ').substring(0,60);
    window._pokeHistory.push(summary);
    if(window._pokeHistory.length>6)window._pokeHistory.shift();

    const el=$('#poke-content');
    el.innerHTML='';
    for(let i=0;i<3;i++){
      const d=document.createElement('div');
      d.className='heart-item';
      d.innerHTML='<div class="heart-item-title">'+titles[i]+'</div><div class="heart-item-text">'+(parts[i]||'…')+'</div>';
      el.appendChild(d);
    }

  }catch(e){
    $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">请求失败：'+e.message+'<br>建议：换一个模型试试</div></div>';
  }
};

console.log('🔧 补丁B v2 已加载');
})();


// ============================
// 戳一戳完整版（单次API调用）
// ============================
(function pokeComplete(){

// 戳一戳颜色
const pokeCSS=document.createElement('style');
pokeCSS.textContent=`
  .poke-reaction{color:var(--morandi-blue) !important;}
  .poke-sys-msg{
    text-align:center;padding:6px 0;
    font-size:10px;color:var(--morandi-blue);
    font-style:italic;letter-spacing:1px;
  }
`;
document.head.appendChild(pokeCSS);

window.fetchPoke=async function(){
  const cc=window._cdContact;
  if(!cc)return;

  const api=lsGet('tq_api_main',null);
  if(!api||!api.url||!api.key||!api.model){
    $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">请先配置API</div></div>';
    return;
  }

  const count=window._pokeCount;
  const prevPokes=window._pokeHistory.slice(-3).join('；');
  const userName=lsGet('tq_user_name','用户');
  const callMe=cc.nickname||userName;

  // 获取最近聊天上下文
  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  const recent=msgs.slice(-10);
  let ctx='';
  recent.forEach(m=>{
    if(m.role==='user')ctx+=userName+'说：'+m.text+'\n';
    else if(m.role==='char')ctx+=cc.name+'说：'+m.text+'\n';
  });

  try{
    const reply=await tqCallAPI('main',[
      {role:'system',content:'你扮演'+cc.name+'。'+(cc.persona||'')+(cc.gender?'，性别'+cc.gender:'')},
      {role:'user',content:`${ctx?'最近聊天：\n'+ctx+'\n':''}${callMe}戳了${cc.name}第${count}次。${prevPokes?'之前反应：'+prevPokes+'。这次要不同。':''}
${count>4?cc.name+'已经被戳了很多次了，反应要更强烈。':''}

按编号回答，每项1-2句，不加*号括号，不用"我"开头：
1.${cc.name}表面的反应
2.${cc.name}内心真实感受
3.${cc.name}做了什么小动作
4.${cc.name}会发什么微信消息回应（像真人聊天，可以吐槽/撒娇/无奈/反戳，1-2条用|||分隔）
5.${cc.name}会不会反过来戳${callMe}（回答会或不会）`}
    ],{temperature:0.92,max_tokens:8192});

    if(!reply){
      $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">API返回为空，建议换模型试试</div></div>';
      return;
    }

    // 解析
    function splitNums(text,count){
      const r=[];
      for(let i=1;i<=count;i++){
        const cur=text.indexOf(i+'.');
        if(cur===-1){r.push('');continue;}
        let s=cur+(i+'.').length;
        const after=text.substring(s);
        const skip=after.match(/^[\s:：]*/);
        if(skip)s+=skip[0].length;
        let e=text.length;
        if(i<count){const n=text.indexOf((i+1)+'.',s);if(n>-1)e=n;}
        r.push(text.substring(s,e).trim());
      }
      return r;
    }

    const parts=splitNums(reply,5);
    const titles=['Reaction','Inner Thoughts','Little Action'];

    // 记录历史
    const summary=(parts[0]+' '+parts[1]).substring(0,60);
    window._pokeHistory.push(summary);
    if(window._pokeHistory.length>6)window._pokeHistory.shift();

    // 渲染弹窗
    const el=$('#poke-content');
    el.innerHTML='';
    for(let i=0;i<3;i++){
      const d=document.createElement('div');
      d.className='heart-item';
      d.innerHTML='<div class="heart-item-title">'+titles[i]+'</div><div class="heart-item-text">'+(parts[i]||'…')+'</div>';
      el.appendChild(d);
    }

    // 聊天记录插入戳一戳
    const allMsgs=lsGet('tq_msgs_'+window._cdChatId,[]);
    allMsgs.push({
      id:'m_'+Date.now()+'_poke',
      role:'system_poke',
      text:'[你戳了戳'+cc.name+' · 第'+count+'次]',
      time:Date.now(),read:true
    });

    // 角色反戳
    const pokeBackText=parts[4]||'';
    if(pokeBackText.includes('会')){
      allMsgs.push({
        id:'m_'+Date.now()+'_pokeback',
        role:'system_poke',
        text:'['+cc.name+'戳了戳你]',
        time:Date.now()+100,read:true
      });
    }

    // 角色聊天回应
    const chatReply=parts[3]||'';
    if(chatReply){
      let chatParts=chatReply.replace(/\*[^*]*\*/g,'').replace(/（[^）]*）/g,'').trim();
      let lines=chatParts.split('|||').map(s=>s.trim()).filter(Boolean);
      if(lines.length===0&&chatParts)lines=[chatParts];
      if(lines.length===1&&lines[0].includes('\n')){
        const nl=lines[0].split('\n').map(s=>s.trim()).filter(Boolean);
        if(nl.length>=2)lines=nl;
      }

      for(let i=0;i<lines.length;i++){
        allMsgs.push({
          id:'m_'+Date.now()+'_'+Math.random().toString(36).substr(2,4),
          role:'char',text:lines[i],
          time:Date.now()+200+(i*300),read:true
        });
      }
    }

    lsSet('tq_msgs_'+window._cdChatId,allMsgs);
    window.renderChatMessages();
    window.scrollChatBottom();

  }catch(e){
    $('#poke-content').innerHTML='<div class="heart-item"><div class="heart-item-text" style="color:#e07070;">请求失败：'+e.message+'</div></div>';
  }
};

// 覆盖渲染支持poke消息
const origRender=window.renderChatMessages;
window.renderChatMessages=function(){
  const area=$('#cd-messages');
  if(!area||!window._cdChatId)return;

  const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  const cc=window._cdContact;
  const userAv=lsGet('tq_user_avatar',null);
  area.innerHTML='';

  if(msgs.length===0){
    area.innerHTML='<div style="text-align:center;padding:40px 0;color:var(--txt-light);font-size:11px;">发一条消息开始聊天吧 ✧</div>';
    return;
  }

  function showT(idx){return idx===0||(msgs[idx].time-msgs[idx-1].time)>300000;}
  function fmtT(ts){
    const d=new Date(ts);const now=new Date();
    const h=String(d.getHours()).padStart(2,'0');
    const m=String(d.getMinutes()).padStart(2,'0');
    if(d.toDateString()===now.toDateString())return h+':'+m;
    const y=new Date(now);y.setDate(y.getDate()-1);
    if(d.toDateString()===y.toDateString())return '昨天 '+h+':'+m;
    return(d.getMonth()+1)+'/'+d.getDate()+' '+h+':'+m;
  }

  msgs.forEach((msg,idx)=>{
    if(showT(idx)){
      const sep=document.createElement('div');
      sep.className='cd-time-sep';
      sep.textContent=fmtT(msg.time);
      area.appendChild(sep);
    }

    if(msg.role==='system_poke'){
      const p=document.createElement('div');
      p.className='poke-sys-msg';
      p.textContent=msg.text;
      area.appendChild(p);
      return;
    }

    const row=document.createElement('div');
    row.className='cd-msg-row '+(msg.role==='user'?'user':'char');
    row.dataset.msgId=msg.id;

    const av=document.createElement('div');
    av.className='cd-msg-avatar';
    if(msg.role==='user'){
      av.innerHTML=userAv?'<img src="'+userAv+'" alt="">':'<span class="ma-ph">我</span>';
    }else{
      av.innerHTML=cc&&cc.avatar?'<img src="'+cc.avatar+'" alt="">':'<span class="ma-ph">'+(cc?cc.name.charAt(0):'?')+'</span>';
    }
    row.appendChild(av);

    const wrap=document.createElement('div');
    wrap.className='cd-bubble-wrap';
    if(msg.quote){
      const q=document.createElement('div');
      q.className='cd-msg-quote';q.textContent=msg.quote;
      wrap.appendChild(q);
    }
    const bubble=document.createElement('div');
    bubble.className='cd-msg-bubble';
    bubble.textContent=msg.text;
    wrap.appendChild(bubble);

    const st=document.createElement('div');
    st.className='cd-msg-status';
    if(msg.role==='user')st.textContent='已发送';
    wrap.appendChild(st);

    row.appendChild(wrap);
    area.appendChild(row);
  });

  // 头像事件
  document.querySelectorAll('.cd-msg-row.char .cd-msg-avatar').forEach(av=>{
    av.addEventListener('click',e=>{
      e.stopPropagation();
      window._clickCount++;
      if(window._clickCount===1){
        window._clickTimer=setTimeout(()=>{
          window._clickCount=0;
          window.showHeart();
        },300);
      }else if(window._clickCount>=2){
        clearTimeout(window._clickTimer);
        window._clickCount=0;
        window.showPoke();
      }
    });
  });
};

window.renderChatMessages();

console.log('🔧 戳一戳完整版已加载');
})();


// ============================
// C6 长按菜单（重写版）
// ============================
(function(){

const c6css=document.createElement('style');
c6css.textContent=`
.lp-menu-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:550;background:rgba(0,0,0,0.15);opacity:0;pointer-events:none;transition:opacity .2s;}
.lp-menu-overlay.show{opacity:1;pointer-events:auto;}
.lp-menu{position:absolute;border-radius:16px;padding:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;width:min(72vw,260px);background:rgba(255,255,255,0.9);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.8);box-shadow:0 6px 30px rgba(0,0,0,0.08);}
body.dark-mode .lp-menu{background:rgba(35,35,35,0.92);border-color:rgba(80,80,80,0.4);}
.lp-item{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 4px;border-radius:12px;cursor:pointer;gap:4px;}
.lp-item:active{background:rgba(0,0,0,0.05);}
.lp-item-icon{font-size:18px;line-height:1;}
.lp-item-label{font-size:10px;color:var(--txt-sec);letter-spacing:0.5px;}
.cd-select-circle{display:none;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--txt-light);flex-shrink:0;align-items:center;justify-content:center;margin-right:6px;cursor:pointer;}
.cd-msg-row.select-mode .cd-select-circle{display:flex !important;}
.cd-select-circle.checked{background:var(--morandi-blue);border-color:var(--morandi-blue);}
.cd-select-circle.checked::after{content:'✓';color:#fff;font-size:11px;}
.cd-select-bar{display:none;position:fixed;bottom:0;left:0;width:100%;padding:10px 20px calc(var(--safe-b) + 10px);background:var(--bg-pri);border-top:1px solid var(--glass-border);z-index:240;justify-content:space-between;align-items:center;}
.cd-select-bar.show{display:flex;}
body.dark-mode .cd-select-bar{background:#1a1a1a;}
.cd-select-bar button{padding:8px 20px;border-radius:12px;font-size:13px;cursor:pointer;}
.sb-cancel{background:var(--bg-sec);color:var(--txt-sec);}
.sb-action{background:var(--morandi-blue);color:#fff;}
.edit-msg-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:560;background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s;}
.edit-msg-overlay.show{opacity:1;pointer-events:auto;}
.edit-msg-box{width:min(80vw,300px);border-radius:18px;padding:20px;background:rgba(255,255,255,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.8);}
body.dark-mode .edit-msg-box{background:rgba(30,30,30,0.92);border-color:rgba(80,80,80,0.4);}
.edit-msg-box textarea{width:100%;min-height:80px;border:1px solid var(--glass-border);border-radius:12px;padding:10px;font-size:13px;color:var(--txt-pri);background:var(--bg-sec);resize:vertical;font-family:inherit;line-height:1.6;}
body.dark-mode .edit-msg-box textarea{background:#2a2a2a;color:#e0e0e0;}
.em-btns{display:flex;gap:8px;justify-content:flex-end;margin-top:10px;}
.em-btns button{padding:7px 16px;border-radius:10px;font-size:12px;cursor:pointer;}
`;
document.head.appendChild(c6css);

// HTML
const lpOv=document.createElement('div');
lpOv.className='lp-menu-overlay';lpOv.id='lp-overlay';
lpOv.innerHTML='<div class="lp-menu" id="lp-menu"></div>';
document.body.appendChild(lpOv);

const editOv=document.createElement('div');
editOv.className='edit-msg-overlay';editOv.id='edit-overlay';
editOv.innerHTML='<div class="edit-msg-box"><textarea id="edit-msg-input"></textarea><div class="em-btns"><button style="background:var(--bg-sec);color:var(--txt-sec);" onclick="window.closeEditMsg()">取消</button><button style="background:var(--morandi-blue);color:#fff;" onclick="window.confirmEditMsg()">确定</button></div></div>';
document.body.appendChild(editOv);

const selBar=document.createElement('div');
selBar.className='cd-select-bar';selBar.id='cd-select-bar';
selBar.innerHTML='<button class="sb-cancel" onclick="window.exitSelectMode()">取消</button><span id="sb-count" style="font-size:12px;color:var(--txt-sec);">已选0条</span><button class="sb-action" id="sb-action-btn">完成</button>';
document.body.appendChild(selBar);

lpOv.addEventListener('click',e=>{if(e.target===lpOv)lpOv.classList.remove('show');});
editOv.addEventListener('click',e=>{if(e.target===editOv)window.closeEditMsg();});

// 全局变量
window._lpTarget=null;
window._editingMsgId=null;
window._selectedMsgs=[];
window._selectAction='';

window.closeEditMsg=function(){$('#edit-overlay').classList.remove('show');};
window.exitSelectMode=function(){
  window._selectedMsgs=[];window._selectAction='';
  $('#cd-select-bar').classList.remove('show');
  document.querySelectorAll('.cd-select-circle').forEach(c=>c.remove());
  document.querySelectorAll('.select-mode').forEach(r=>r.classList.remove('select-mode'));
};

window.confirmEditMsg=function(){
  const t=$('#edit-msg-input').value.trim();
  if(!t){showToast('内容不能为空');return;}
  let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
  const i=msgs.findIndex(m=>m.id===window._editingMsgId);
  if(i>-1){msgs[i].text=t;msgs[i].edited=true;lsSet('tq_msgs_'+window._cdChatId,msgs);window.renderChatMessages();window.scrollChatBottom();showToast('已修改');}
  window.closeEditMsg();
};

// 菜单功能执行
window._doMenuAction=function(action,msg){
  if(!msg||!window._cdChatId)return;
  const cc=window._cdContact;

  if(action==='quote'){
    window.setQuote(msg);
  }else if(action==='edit'){
    window._editingMsgId=msg.id;
    $('#edit-msg-input').value=msg.text;
    $('#edit-overlay').classList.add('show');
  }else if(action==='delete'){
    showModal('删除消息','确定删除这条消息？',[{text:'取消',type:'cancel'},{text:'删除',type:'confirm',cb:()=>{
      let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
      msgs=msgs.filter(m=>m.id!==msg.id);
      lsSet('tq_msgs_'+window._cdChatId,msgs);
      window.renderChatMessages();showToast('已删除');
    }}]);
  }else if(action==='select'){
    window._selectAction='delete';window._selectedMsgs=[msg.id];
    $('#sb-action-btn').textContent='删除';$('#sb-count').textContent='已选1条';
    $('#cd-select-bar').classList.add('show');window._addSelectCircles();
  }else if(action==='regen'){
    let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
    while(msgs.length>0&&msgs[msgs.length-1].role==='char')msgs.pop();
    lsSet('tq_msgs_'+window._cdChatId,msgs);
    window.renderChatMessages();window.scrollChatBottom();
    window.triggerAIReply();
  }else if(action==='fav'){
    window._selectAction='fav';window._selectedMsgs=[msg.id];
    $('#sb-action-btn').textContent='收藏';$('#sb-count').textContent='已选1条';
    $('#cd-select-bar').classList.add('show');window._addSelectCircles();
  }else if(action==='forward'){
    window._selectAction='forward';window._selectedMsgs=[msg.id];
    $('#sb-action-btn').textContent='转发';$('#sb-count').textContent='已选1条';
    $('#cd-select-bar').classList.add('show');window._addSelectCircles();
  }else if(action==='recall'){
    showModal('撤回消息','是否让'+(cc?cc.name:'角色')+'知晓？',[
      {text:'不知晓',type:'cancel',cb:()=>{
        let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
        const i=msgs.findIndex(m=>m.id===msg.id);
        if(i>-1){msgs[i].recalled=true;msgs[i].recallKnown=false;msgs[i].text='[消息已撤回]';}
        lsSet('tq_msgs_'+window._cdChatId,msgs);window.renderChatMessages();showToast('已撤回');
      }},
      {text:'让TA知道',type:'confirm',cb:()=>{
        let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
        const i=msgs.findIndex(m=>m.id===msg.id);
        if(i>-1){msgs[i].recalled=true;msgs[i].recallKnown=true;msgs[i].text='[消息已撤回]';}
        lsSet('tq_msgs_'+window._cdChatId,msgs);window.renderChatMessages();showToast('已撤回');
      }}
    ]);
  }
};

// 多选圈
window._addSelectCircles=function(){
  document.querySelectorAll('.cd-msg-row').forEach(row=>{
    const mid=row.dataset.msgId;if(!mid)return;
    row.classList.add('select-mode');
    const old=row.querySelector('.cd-select-circle');if(old)old.remove();
    const c=document.createElement('div');c.className='cd-select-circle';
    if(window._selectedMsgs.includes(mid))c.classList.add('checked');
    c.addEventListener('click',e=>{
      e.stopPropagation();
      if(window._selectedMsgs.includes(mid)){window._selectedMsgs=window._selectedMsgs.filter(x=>x!==mid);c.classList.remove('checked');}
      else{window._selectedMsgs.push(mid);c.classList.add('checked');}
      $('#sb-count').textContent='已选'+window._selectedMsgs.length+'条';
    });
    row.insertBefore(c,row.firstChild);
  });
};

// 底部操作按钮
$('#sb-action-btn').addEventListener('click',()=>{
  if(!window._selectedMsgs||window._selectedMsgs.length===0){showToast('请先选择消息');return;}
  const cc=window._cdContact;
  if(window._selectAction==='delete'){
    showModal('批量删除','确定删除'+window._selectedMsgs.length+'条？',[{text:'取消',type:'cancel'},{text:'删除',type:'confirm',cb:()=>{
      let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
      msgs=msgs.filter(m=>!window._selectedMsgs.includes(m.id));
      lsSet('tq_msgs_'+window._cdChatId,msgs);window.exitSelectMode();window.renderChatMessages();showToast('已删除');
    }}]);
  }else if(window._selectAction==='fav'){
    const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
    const fm=msgs.filter(m=>window._selectedMsgs.includes(m.id));
    const fl=lsGet('tq_favorites',[]);
    fm.forEach(m=>{fl.push({id:'fav_'+Date.now()+'_'+Math.random().toString(36).substr(2,4),text:m.text,role:m.role,time:m.time,contactId:window._cdChatId,contactName:cc?cc.name:'',savedAt:Date.now()});});
    lsSet('tq_favorites',fl);
    showModal('收藏成功','已收藏'+fm.length+'条消息',[{text:'好的',type:'confirm'}]);
    window.exitSelectMode();
  }else if(window._selectAction==='forward'){
    const cts=lsGet('tq_contacts',[]);
    if(cts.length<=1){showToast('没有其他联系人');window.exitSelectMode();return;}
    // 转发选择器
    const ov=document.createElement('div');
    ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:570;background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;';
    let selTarget=null;
    let h='<div style="width:min(80vw,300px);max-height:60vh;border-radius:18px;padding:16px;background:rgba(255,255,255,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.8);overflow-y:auto;"><div style="font-size:14px;text-align:center;margin-bottom:12px;">选择转发对象</div>';
    cts.forEach(c=>{
      if(c.id===window._cdChatId)return;
      const av=c.avatar?'<img src="'+c.avatar+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">':'<div style="width:32px;height:32px;border-radius:50%;background:var(--bg-sec);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--txt-light);">'+c.name.charAt(0)+'</div>';
      h+='<div data-fid="'+c.id+'" style="display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:12px;cursor:pointer;">'+av+'<span style="font-size:13px;flex:1;">'+(c.remark||c.name)+'</span><span class="fwc" style="width:20px;height:20px;border-radius:50%;border:1.5px solid var(--txt-light);display:flex;align-items:center;justify-content:center;font-size:11px;"></span></div>';
    });
    h+='<div style="display:flex;gap:8px;justify-content:center;margin-top:14px;"><button class="fwCancel" style="padding:8px 18px;border-radius:12px;background:var(--bg-sec);color:var(--txt-sec);font-size:12px;cursor:pointer;">取消</button><button class="fwOk" style="padding:8px 18px;border-radius:12px;background:var(--morandi-blue);color:#fff;font-size:12px;cursor:pointer;">转发</button></div></div>';
    ov.innerHTML=h;
    document.body.appendChild(ov);
    ov.querySelectorAll('[data-fid]').forEach(el=>{
      el.addEventListener('click',()=>{
        ov.querySelectorAll('.fwc').forEach(c=>{c.textContent='';c.style.background='';c.style.borderColor='';});
        const ck=el.querySelector('.fwc');ck.textContent='✓';ck.style.background='var(--morandi-blue)';ck.style.borderColor='var(--morandi-blue)';ck.style.color='#fff';
        selTarget=el.dataset.fid;
      });
    });
    ov.querySelector('.fwCancel').addEventListener('click',()=>{ov.remove();window.exitSelectMode();});
    ov.addEventListener('click',e=>{if(e.target===ov){ov.remove();window.exitSelectMode();}});
    ov.querySelector('.fwOk').addEventListener('click',()=>{
      if(!selTarget){showToast('请选择联系人');return;}
      const srcMsgs=lsGet('tq_msgs_'+window._cdChatId,[]);
      const fwd=srcMsgs.filter(m=>window._selectedMsgs.includes(m.id));
      const cardText='[转发消息]\n'+fwd.map(m=>(m.role==='user'?'我':cc.name)+'：'+m.text).join('\n');
      const tMsgs=lsGet('tq_msgs_'+selTarget,[]);
      tMsgs.push({id:'m_'+Date.now()+'_fwd',role:'user',text:cardText,time:Date.now(),read:true,isForward:true});
      lsSet('tq_msgs_'+selTarget,tMsgs);
      ov.remove();window.exitSelectMode();showToast('已转发');
      if(window.renderMsgList)window.renderMsgList();
    });
  }
});

// 覆盖渲染：加入长按事件
const origRenderC6=window.renderChatMessages;
window.renderChatMessages=function(){
  origRenderC6();
  document.querySelectorAll('.cd-msg-row').forEach(row=>{
    const mid=row.dataset.msgId;if(!mid)return;
    let timer=null,moved=false;
    row.addEventListener('touchstart',function(e){
      moved=false;
      const t=e.touches[0];
      timer=setTimeout(()=>{
        if(moved)return;
        const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
        const target=msgs.find(m=>m.id===mid);
        if(!target)return;
        const items=[
          {icon:'❝',label:'引用',act:'quote'},{icon:'✎',label:'编辑',act:'edit'},
          {icon:'✕',label:'删除',act:'delete'},{icon:'☐',label:'多选',act:'select'},
          {icon:'↺',label:'重回',act:'regen'},{icon:'✧',label:'收藏',act:'fav'},
          {icon:'↗',label:'转发',act:'forward'},{icon:'↩',label:'撤回',act:'recall'}
        ];
        const menu=$('#lp-menu');menu.innerHTML='';
        items.forEach(it=>{
          const d=document.createElement('div');d.className='lp-item';
          d.innerHTML='<span class="lp-item-icon">'+it.icon+'</span><span class="lp-item-label">'+it.label+'</span>';
          d.addEventListener('click',ev=>{
            ev.stopPropagation();
            $('#lp-overlay').classList.remove('show');
            setTimeout(()=>window._doMenuAction(it.act,target),50);
          });
          menu.appendChild(d);
        });
        const vw=window.innerWidth;const mw=Math.min(vw*0.72,260);
        let left=t.clientX-mw/2;let top=t.clientY-170;
        if(left<8)left=8;if(left+mw>vw-8)left=vw-mw-8;if(top<60)top=t.clientY+10;
        menu.style.left=left+'px';menu.style.top=top+'px';
        $('#lp-overlay').classList.add('show');
      },500);
    },{passive:true});
    row.addEventListener('touchmove',()=>{moved=true;clearTimeout(timer);});
    row.addEventListener('touchend',()=>clearTimeout(timer));
  });
};

window.renderChatMessages();
console.log('📋 C6 长按菜单重写版 加载完毕');
})();
// ===== C6 重写版结束 =====
// ============================
// 补丁：转发折叠 + 撤回居中
// ============================
(function patchC6UI(){

const fixCSS=document.createElement('style');
fixCSS.textContent=`
/* 转发卡片折叠 */
.cd-forward-card{
  background:var(--bg-sec);
  border:1px solid var(--glass-border);
  border-radius:12px;
  padding:8px 10px;
  cursor:pointer;
  max-width:100%;
}
.cd-forward-title{
  font-size:10px;color:var(--morandi-blue);
  margin-bottom:4px;letter-spacing:0.5px;
}
.cd-forward-preview{
  font-size:11px;color:var(--txt-sec);
  line-height:1.5;
  max-height:42px;overflow:hidden;
  text-overflow:ellipsis;
}
body.dark-mode .cd-forward-card{
  background:rgba(50,50,50,0.4);
  border-color:rgba(80,80,80,0.3);
}

/* 转发展开弹窗 */
.cd-forward-detail{
  position:fixed;top:0;left:0;width:100%;height:100%;
  z-index:580;background:rgba(0,0,0,0.2);
  display:flex;align-items:center;justify-content:center;
  opacity:0;pointer-events:none;transition:opacity .2s;
}
.cd-forward-detail.show{opacity:1;pointer-events:auto;}
.cd-forward-box{
  width:min(82vw,310px);max-height:70vh;
  border-radius:18px;padding:16px;
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,0.8);
  overflow-y:auto;
}
body.dark-mode .cd-forward-box{
  background:rgba(30,30,30,0.92);border-color:rgba(80,80,80,0.4);
}
.cd-forward-box .fwd-header{
  font-size:13px;text-align:center;margin-bottom:10px;
  color:var(--txt-pri);letter-spacing:1px;
}
.cd-forward-box .fwd-line{
  font-size:12px;line-height:1.7;color:var(--txt-pri);
  padding:4px 0;border-bottom:1px solid var(--glass-border);
}
body.dark-mode .cd-forward-box .fwd-line{color:#ddd;}
.cd-forward-box .fwd-close{
  text-align:center;margin-top:12px;
}
.cd-forward-box .fwd-close button{
  padding:7px 24px;border-radius:12px;
  background:var(--bg-sec);color:var(--txt-sec);
  font-size:12px;cursor:pointer;
}

/* 撤回消息居中 */
.cd-recall-msg{
  text-align:center;padding:6px 0;
  font-size:10px;color:var(--morandi-blue);
  font-style:italic;letter-spacing:1px;
  cursor:pointer;
}
.cd-recall-msg:active{opacity:0.6;}

/* 撤回查看弹窗 */
.cd-recall-popup{
  position:fixed;top:0;left:0;width:100%;height:100%;
  z-index:580;background:rgba(0,0,0,0.2);
  display:flex;align-items:center;justify-content:center;
  opacity:0;pointer-events:none;transition:opacity .2s;
}
.cd-recall-popup.show{opacity:1;pointer-events:auto;}
.cd-recall-box{
  width:min(75vw,280px);border-radius:16px;padding:18px;
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,0.8);
  text-align:center;
}
body.dark-mode .cd-recall-box{
  background:rgba(30,30,30,0.92);border-color:rgba(80,80,80,0.4);
}
.cd-recall-box .rb-label{
  font-size:10px;color:var(--txt-light);margin-bottom:8px;letter-spacing:1px;
}
.cd-recall-box .rb-text{
  font-size:12px;color:var(--txt-pri);line-height:1.6;word-break:break-word;
}
body.dark-mode .cd-recall-box .rb-text{color:#ddd;}
`;
document.head.appendChild(fixCSS);

// 转发详情弹窗
const fwdDetail=document.createElement('div');
fwdDetail.className='cd-forward-detail';fwdDetail.id='fwd-detail';
fwdDetail.innerHTML='<div class="cd-forward-box" id="fwd-detail-box"></div>';
document.body.appendChild(fwdDetail);
fwdDetail.addEventListener('click',e=>{if(e.target===fwdDetail)fwdDetail.classList.remove('show');});

// 撤回查看弹窗
const recallPopup=document.createElement('div');
recallPopup.className='cd-recall-popup';recallPopup.id='recall-popup';
recallPopup.innerHTML='<div class="cd-recall-box" id="recall-box"></div>';
document.body.appendChild(recallPopup);
recallPopup.addEventListener('click',e=>{if(e.target===recallPopup)recallPopup.classList.remove('show');});

// 覆盖撤回：保存原文
const origDoMenu=window._doMenuAction;
window._doMenuAction=function(action,msg){
  if(action==='recall'){
    const cc=window._cdContact;
    showModal('撤回消息','是否让'+(cc?cc.name:'角色')+'知晓？',[
      {text:'不知晓',type:'cancel',cb:()=>{
        let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
        const i=msgs.findIndex(m=>m.id===msg.id);
        if(i>-1){msgs[i].recalledText=msgs[i].text;msgs[i].recalled=true;msgs[i].recallKnown=false;msgs[i].text='[消息已撤回]';}
        lsSet('tq_msgs_'+window._cdChatId,msgs);window.renderChatMessages();showToast('已撤回');
      }},
      {text:'让TA知道',type:'confirm',cb:()=>{
        let msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
        const i=msgs.findIndex(m=>m.id===msg.id);
        if(i>-1){msgs[i].recalledText=msgs[i].text;msgs[i].recalled=true;msgs[i].recallKnown=true;msgs[i].text='[消息已撤回]';}
        lsSet('tq_msgs_'+window._cdChatId,msgs);window.renderChatMessages();showToast('已撤回');
      }}
    ]);
    return;
  }
  origDoMenu(action,msg);
};

// 覆盖渲染：处理转发卡片和撤回居中
const origRender=window.renderChatMessages;
window.renderChatMessages=function(){
  origRender();

  const area=$('#cd-messages');
  if(!area)return;

  // 找转发消息，替换成折叠卡片
  area.querySelectorAll('.cd-msg-bubble').forEach(bubble=>{
    const text=bubble.textContent;
    if(text.startsWith('[转发消息]')){
      const wrap=bubble.parentElement;
      const card=document.createElement('div');
      card.className='cd-forward-card';
      const lines=text.replace('[转发消息]\n','').split('\n');
      const preview=lines.slice(0,2).join('\n');
      card.innerHTML='<div class="cd-forward-title">↗ 转发消息（'+lines.length+'条）</div><div class="cd-forward-preview">'+preview+(lines.length>2?'…':'')+'</div>';
      card.addEventListener('click',e=>{
        e.stopPropagation();
        const box=$('#fwd-detail-box');
        box.innerHTML='<div class="fwd-header">↗ 转发消息</div>';
        lines.forEach(l=>{
          const d=document.createElement('div');
          d.className='fwd-line';d.textContent=l;
          box.appendChild(d);
        });
        box.innerHTML+='<div class="fwd-close"><button onclick="document.getElementById(\'fwd-detail\').classList.remove(\'show\')">关闭</button></div>';
        fwdDetail.classList.add('show');
      });
      bubble.replaceWith(card);
    }
  });

  // 找撤回消息，改成居中显示
  area.querySelectorAll('.cd-msg-row').forEach(row=>{
    const mid=row.dataset.msgId;
    if(!mid)return;
    const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
    const msg=msgs.find(m=>m.id===mid);
    if(msg&&msg.recalled){
      const role=msg.role==='user'?'你':'('+((window._cdContact||{}).name||'角色')+')';
      const recallEl=document.createElement('div');
      recallEl.className='cd-recall-msg';
      recallEl.textContent=role+' 撤回了一条消息';
      if(msg.recalledText){
        recallEl.addEventListener('click',()=>{
          const box=$('#recall-box');
          box.innerHTML='<div class="rb-label">已撤回的消息</div><div class="rb-text">'+msg.recalledText+'</div>';
          recallPopup.classList.add('show');
        });
      }
      row.replaceWith(recallEl);
    }
  });
};

window.renderChatMessages();
console.log('🔧 转发折叠+撤回居中 已加载');
})();

// 补丁：转发弹窗滚动遮挡修复
(function(){
const fix=document.createElement('style');
fix.textContent=`
.cd-forward-box{
  max-height:55vh !important;
  overflow:hidden !important;
  display:flex !important;
  flex-direction:column !important;
}
.cd-forward-box .fwd-header{
  flex-shrink:0;
  padding-bottom:8px;
  border-bottom:1px solid var(--glass-border);
}
.cd-forward-box .fwd-close{
  flex-shrink:0;
  padding-top:8px;
  border-top:1px solid var(--glass-border);
}
.cd-forward-box .fwd-scroll{
  flex:1;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch;
  min-height:0;
}
`;
document.head.appendChild(fix);

// 覆盖转发卡片点击，加滚动容器
const origRender=window.renderChatMessages;
window.renderChatMessages=function(){
  origRender();

  const area=$('#cd-messages');
  if(!area)return;

  area.querySelectorAll('.cd-forward-card').forEach(card=>{
    const newCard=card.cloneNode(true);
    card.parentNode.replaceChild(newCard,card);

    newCard.addEventListener('click',e=>{
      e.stopPropagation();
      const text=newCard.closest('.cd-bubble-wrap')
        ?newCard.closest('.cd-bubble-wrap').dataset.fwdText
        :null;

      // 从消息中找原文
var rowEl = newCard.closest('.cd-msg-row');
var mid = rowEl ? rowEl.dataset.msgId : null;
      const msgs=lsGet('tq_msgs_'+window._cdChatId,[]);
      const msg=msgs.find(m=>m.id===mid);
      if(!msg)return;

      const rawText=msg.text.replace('[转发消息]\n','');
      const lines=rawText.split('\n');

      const box=$('#fwd-detail-box');
      box.innerHTML='';

      const header=document.createElement('div');
      header.className='fwd-header';
      header.textContent='↗ 转发消息（'+lines.length+'条）';
      box.appendChild(header);

      const scroll=document.createElement('div');
      scroll.className='fwd-scroll';
      lines.forEach(l=>{
        const d=document.createElement('div');
        d.className='fwd-line';d.textContent=l;
        scroll.appendChild(d);
      });
      box.appendChild(scroll);

      const close=document.createElement('div');
      close.className='fwd-close';
      close.innerHTML='<button onclick="document.getElementById(\'fwd-detail\').classList.remove(\'show\')" style="padding:7px 24px;border-radius:12px;background:var(--bg-sec);color:var(--txt-sec);font-size:12px;cursor:pointer;">关闭</button>';
      box.appendChild(close);

      $('#fwd-detail').classList.add('show');
    });
  });
};

window.renderChatMessages();
})();
// ============================
// 「我」Tab · 完整功能
// ============================
(function initMeTab(){

// ====== 注入CSS ======
const meCSS=document.createElement('style');
meCSS.textContent=`
.me-hero{position:relative;height:33vh;min-height:200px;overflow:hidden;border-radius:0 0 20px 20px;flex-shrink:0;}
.me-hero-bg{position:absolute;top:0;left:0;width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;background-color:var(--bg-sec);cursor:pointer;transition:background .3s;}
.me-hero-bg .me-bg-hint{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:10px;color:rgba(255,255,255,0.5);letter-spacing:1px;pointer-events:none;opacity:0;transition:opacity .3s;}
.me-hero-bg:not(.has-bg) .me-bg-hint{opacity:1;}
body.dark-mode .me-hero-bg{background-color:#222;}
.me-frame{position:absolute;top:16px;left:16px;width:56px;height:56px;border-radius:50%;overflow:hidden;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);background:rgba(255,255,255,0.18);border:1.5px solid rgba(255,255,255,0.35);box-shadow:0 2px 12px rgba(0,0,0,0.08);cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;transition:transform .2s;}
.me-frame:active{transform:scale(0.93);}
.me-frame img{width:100%;height:100%;object-fit:cover;}
.me-frame-ph{font-size:20px;color:rgba(255,255,255,0.5);}
body.dark-mode .me-frame{background:rgba(0,0,0,0.3);border-color:rgba(255,255,255,0.12);}
.me-bubbles{position:absolute;top:10px;left:82px;display:flex;flex-direction:column;gap:5px;z-index:2;max-width:calc(100% - 100px);}
.me-bubble{padding:5px 13px;border-radius:12px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);box-shadow:0 1px 6px rgba(0,0,0,0.06);font-size:11px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.15);letter-spacing:1px;width:fit-content;max-width:100%;word-break:normal;overflow-wrap:anywhere;cursor:pointer;transition:transform .15s,background .2s;line-height:1.5;}
.me-bubble:active{transform:scale(0.96);}
.me-bubble.editing{background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.5);outline:none;cursor:text;}
body.dark-mode .me-bubble{background:rgba(0,0,0,0.3);border-color:rgba(255,255,255,0.1);text-shadow:0 1px 3px rgba(0,0,0,0.3);}
body.dark-mode .me-bubble.editing{background:rgba(0,0,0,0.45);border-color:rgba(255,255,255,0.2);}
.me-bubble-save{position:absolute;top:10px;right:16px;z-index:3;padding:4px 14px;border-radius:10px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.35);font-size:11px;color:#fff;letter-spacing:1px;cursor:pointer;display:none;transition:transform .15s;}
.me-bubble-save.show{display:block;}
.me-bubble-save:active{transform:scale(0.92);}
.me-avatar-wrap{position:absolute;bottom:14px;right:16px;z-index:2;}
.me-avatar{width:58px;height:58px;border-radius:50%;overflow:hidden;border:2.5px solid rgba(255,255,255,0.6);box-shadow:0 3px 14px rgba(0,0,0,0.12);cursor:pointer;display:flex;align-items:center;justify-content:center;background:var(--bg-sec);transition:transform .2s;}
.me-avatar:active{transform:scale(0.93);}
.me-avatar img{width:100%;height:100%;object-fit:cover;}
.me-avatar-ph{font-size:22px;color:var(--txt-light);}
body.dark-mode .me-avatar{border-color:rgba(255,255,255,0.2);background:#2a2a2a;}
.me-content{flex:1;overflow-y:auto;padding:16px 16px 30px;}
.me-user-entry{display:flex;align-items:center;padding:14px 16px;border-radius:16px;background:var(--bg-sec);border:1px solid var(--glass-border);box-shadow:0 2px 10px var(--glass-shadow);cursor:pointer;margin-bottom:14px;transition:transform .15s;}
.me-user-entry:active{transform:scale(0.98);}
.me-ue-avatar{width:46px;height:46px;border-radius:50%;overflow:hidden;background:var(--bg-pri);flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--glass-border);}
.me-ue-avatar img{width:100%;height:100%;object-fit:cover;}
.me-ue-avatar .me-ue-ph{font-size:18px;color:var(--txt-light);}
.me-ue-info{flex:1;margin-left:12px;min-width:0;}
.me-ue-name{font-size:15px;color:var(--txt-pri);letter-spacing:1px;font-weight:400;}
.me-ue-desc{font-size:11px;color:var(--txt-sec);margin-top:2px;letter-spacing:0.5px;}
.me-ue-arrow{font-size:16px;color:var(--txt-light);flex-shrink:0;margin-left:8px;}
body.dark-mode .me-user-entry{background:rgba(40,40,40,0.8);border-color:rgba(80,80,80,0.4);}
body.dark-mode .me-ue-avatar{background:#333;border-color:rgba(80,80,80,0.4);}
body.dark-mode .me-ue-name{color:#e0e0e0;}
body.dark-mode .me-ue-desc{color:#777;}
body.dark-mode .me-ue-arrow{color:#555;}
.me-menu-list{border-radius:16px;background:var(--bg-sec);border:1px solid var(--glass-border);box-shadow:0 2px 10px var(--glass-shadow);overflow:hidden;}
.me-menu-item{display:flex;align-items:center;padding:15px 16px;cursor:pointer;transition:background .2s;border-bottom:1px solid var(--glass-border);}
.me-menu-item:last-child{border-bottom:none;}
.me-menu-item:active{background:rgba(0,0,0,0.03);}
.me-menu-icon{font-size:17px;width:28px;flex-shrink:0;text-align:center;}
.me-menu-text{flex:1;font-size:14px;color:var(--txt-pri);letter-spacing:1px;margin-left:6px;}
.me-menu-extra{font-size:12px;color:var(--txt-sec);margin-right:6px;}
.me-menu-arrow{font-size:14px;color:var(--txt-light);flex-shrink:0;}
body.dark-mode .me-menu-list{background:rgba(40,40,40,0.8);border-color:rgba(80,80,80,0.4);}
body.dark-mode .me-menu-item{border-color:rgba(80,80,80,0.3);}
body.dark-mode .me-menu-item:active{background:rgba(255,255,255,0.04);}
body.dark-mode .me-menu-text{color:#e0e0e0;}
body.dark-mode .me-menu-extra{color:#666;}
body.dark-mode .me-menu-arrow{color:#555;}
.me-sub-page{position:fixed;top:0;left:0;width:100%;height:100%;z-index:220;background:var(--bg-pri);overflow-y:auto;padding:calc(var(--safe-t,0px) + 12px) 0 calc(var(--safe-b,0px) + 30px);transform:translateX(100%);transition:transform .35s cubic-bezier(.25,.46,.45,.94);}
.me-sub-page.open{transform:translateX(0);}
body.dark-mode .me-sub-page{background:#1a1a1a;}
.me-sub-page.z230{z-index:230;}
.me-sub-header{display:flex;align-items:center;justify-content:space-between;padding:8px 16px 14px;}
.me-sub-header .msh-back{font-size:22px;color:var(--txt-sec);cursor:pointer;padding:4px 8px;}
.me-sub-header .msh-back:active{transform:scale(0.85);}
.me-sub-header .msh-title{font-size:15px;letter-spacing:2px;color:var(--txt-pri);font-weight:400;}
.me-sub-header .msh-right{font-size:13px;color:var(--txt-sec);cursor:pointer;padding:4px 8px;letter-spacing:1px;}
.me-sub-header .msh-right:active{transform:scale(0.9);}
.me-sub-header .msh-save{font-size:13px;padding:6px 16px;border-radius:12px;background:var(--morandi-blue);color:#fff;letter-spacing:1px;cursor:pointer;transition:transform .15s;}
.me-sub-header .msh-save:active{transform:scale(0.92);}
body.dark-mode .me-sub-header .msh-title{color:#e0e0e0;}
body.dark-mode .me-sub-header .msh-back,body.dark-mode .me-sub-header .msh-right{color:#999;}
.me-edit-body{padding:0 24px;}
.me-edit-avatar-wrap{display:flex;justify-content:center;margin-bottom:24px;}
.me-edit-avatar{width:80px;height:80px;border-radius:50%;overflow:hidden;border:2px solid var(--glass-border);box-shadow:0 3px 14px var(--glass-shadow);cursor:pointer;display:flex;align-items:center;justify-content:center;background:var(--bg-sec);position:relative;transition:transform .2s;}
.me-edit-avatar:active{transform:scale(0.95);}
.me-edit-avatar img{width:100%;height:100%;object-fit:cover;}
.me-edit-avatar .mea-ph{font-size:28px;color:var(--txt-light);}
.me-edit-avatar .mea-plus{position:absolute;bottom:2px;right:2px;width:22px;height:22px;border-radius:50%;background:var(--morandi-blue);color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.1);}
body.dark-mode .me-edit-avatar{background:#2a2a2a;border-color:rgba(80,80,80,0.5);}
.me-edit-field{margin-bottom:16px;}
.me-edit-field label{font-size:12px;color:var(--txt-sec);letter-spacing:1px;margin-bottom:5px;display:block;}
.me-edit-field input,.me-edit-field textarea{width:100%;padding:10px 14px;border-radius:12px;background:var(--bg-sec);font-size:13px;color:var(--txt-pri);border:1px solid var(--glass-border);transition:border-color .2s;font-family:inherit;}
.me-edit-field input:focus,.me-edit-field textarea:focus{border-color:var(--morandi-blue);}
.me-edit-field textarea{min-height:100px;resize:vertical;line-height:1.7;}
body.dark-mode .me-edit-field input,body.dark-mode .me-edit-field textarea{background:#2a2a2a;color:#e0e0e0;border-color:rgba(80,80,80,0.4);}
body.dark-mode .me-edit-field label{color:#999;}
.me-gender-row{display:flex;gap:10px;}
.me-gender-opt{flex:1;padding:10px 0;text-align:center;border-radius:12px;background:var(--bg-sec);font-size:13px;color:var(--txt-sec);cursor:pointer;border:1px solid var(--glass-border);transition:all .2s;letter-spacing:1px;}
.me-gender-opt.selected{background:var(--morandi-blue);color:#fff;border-color:var(--morandi-blue);}
body.dark-mode .me-gender-opt{background:#2a2a2a;color:#999;border-color:rgba(80,80,80,0.4);}
body.dark-mode .me-gender-opt.selected{background:var(--morandi-blue);color:#fff;}
.wallet-balance-card{margin:20px 20px 16px;padding:28px 24px;border-radius:20px;background:linear-gradient(135deg,var(--morandi-blue),var(--morandi-pink));color:#fff;box-shadow:0 6px 24px rgba(0,0,0,0.1);position:relative;overflow:hidden;}
.wallet-balance-card::after{content:'';position:absolute;top:-30%;right:-20%;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.08);}
.wbc-label{font-size:12px;letter-spacing:2px;opacity:.8;margin-bottom:8px;}
.wbc-amount{font-size:36px;font-weight:300;letter-spacing:1px;line-height:1;}
.wbc-amount span{font-size:16px;margin-right:4px;}
.wallet-actions{display:flex;gap:10px;margin:0 20px 20px;}
.wallet-act-btn{flex:1;padding:12px 0;text-align:center;border-radius:14px;background:var(--bg-sec);border:1px solid var(--glass-border);font-size:13px;color:var(--txt-pri);letter-spacing:1px;cursor:pointer;transition:transform .15s;}
.wallet-act-btn:active{transform:scale(0.96);}
body.dark-mode .wallet-act-btn{background:rgba(40,40,40,0.8);border-color:rgba(80,80,80,0.4);color:#e0e0e0;}
.wallet-records-title{padding:0 24px;font-size:13px;color:var(--txt-sec);letter-spacing:1px;margin-bottom:10px;}
.wallet-records{padding:0 20px;}
.wallet-record{display:flex;align-items:center;padding:13px 14px;background:var(--bg-sec);border:1px solid var(--glass-border);border-radius:14px;margin-bottom:8px;}
.wr-info{flex:1;min-width:0;}
.wr-desc{font-size:13px;color:var(--txt-pri);letter-spacing:0.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.wr-time{font-size:10px;color:var(--txt-light);margin-top:3px;}
.wr-amount{font-size:15px;font-weight:400;letter-spacing:0.5px;flex-shrink:0;margin-left:10px;}
.wr-amount.income{color:#6dba7a;}
.wr-amount.expense{color:#d47272;}
.wallet-empty{text-align:center;padding:40px 0;font-size:12px;color:var(--txt-light);letter-spacing:1px;}
body.dark-mode .wallet-record{background:rgba(40,40,40,0.8);border-color:rgba(80,80,80,0.4);}
body.dark-mode .wr-desc{color:#e0e0e0;}
.fav-item{display:flex;padding:14px 20px;border-bottom:1px solid var(--glass-border);align-items:flex-start;}
.fav-item .fav-check{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--glass-border);flex-shrink:0;margin-right:12px;margin-top:2px;cursor:pointer;display:none;align-items:center;justify-content:center;transition:all .2s;font-size:12px;}
.fav-item .fav-check.show{display:flex;}
.fav-item .fav-check.checked{background:var(--morandi-blue);border-color:var(--morandi-blue);color:#fff;}
.fav-body{flex:1;min-width:0;}
.fav-contact{font-size:12px;color:var(--morandi-blue);letter-spacing:0.5px;margin-bottom:3px;font-weight:500;}
.fav-text{font-size:13px;color:var(--txt-pri);line-height:1.6;letter-spacing:0.3px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.fav-time{font-size:10px;color:var(--txt-light);margin-top:4px;}
.fav-empty{text-align:center;padding:60px 0;font-size:12px;color:var(--txt-light);letter-spacing:1px;}
body.dark-mode .fav-item{border-color:rgba(80,80,80,0.3);}
body.dark-mode .fav-text{color:#e0e0e0;}
.mask-item{display:flex;align-items:center;padding:14px 20px;border-bottom:1px solid var(--glass-border);cursor:pointer;transition:background .2s;}
.mask-item:active{background:rgba(0,0,0,0.03);}
.mask-avatar{width:44px;height:44px;border-radius:50%;overflow:hidden;background:var(--bg-sec);flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--glass-border);}
.mask-avatar img{width:100%;height:100%;object-fit:cover;}
.mask-avatar .mask-ph{font-size:18px;color:var(--txt-light);}
.mask-info{flex:1;margin-left:12px;min-width:0;}
.mask-name{font-size:14px;color:var(--txt-pri);letter-spacing:1px;}
.mask-desc{font-size:11px;color:var(--txt-sec);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mask-active-tag{padding:3px 10px;border-radius:8px;background:var(--morandi-blue);color:#fff;font-size:10px;letter-spacing:1px;flex-shrink:0;margin-left:8px;}
.mask-empty{text-align:center;padding:60px 0;font-size:12px;color:var(--txt-light);letter-spacing:1px;}
body.dark-mode .mask-item{border-color:rgba(80,80,80,0.3);}
body.dark-mode .mask-item:active{background:rgba(255,255,255,0.04);}
body.dark-mode .mask-avatar{background:#2a2a2a;border-color:rgba(80,80,80,0.4);}
body.dark-mode .mask-name{color:#e0e0e0;}
body.dark-mode .mask-desc{color:#777;}
.me-recharge-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:600;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;}
.me-recharge-box{width:280px;border-radius:18px;padding:24px;background:var(--bg-pri);border:1px solid var(--glass-border);box-shadow:0 8px 30px rgba(0,0,0,0.12);}
body.dark-mode .me-recharge-box{background:#2a2a2a;border-color:rgba(80,80,80,0.4);}
`;
document.head.appendChild(meCSS);
// ====== 找到「我」Tab面板 ======
var mePanel=null;
var meTabBtn=null;
document.querySelectorAll('.chat-tab').forEach(function(t){
  if(t.textContent.trim()==='我') meTabBtn=t;
});
var allPanels=document.querySelectorAll('.chat-tab-panel');
if(allPanels.length>=4) mePanel=allPanels[3];
if(!mePanel&&allPanels.length>0) mePanel=allPanels[allPanels.length-1];
if(!mePanel){console.warn('me panel not found');return;}

// ====== 默认气泡 ======
var DEFAULT_BUBBLES=['我在看你','就像向日葵追逐着太阳','永远仰望着你','Σ>―♡→'];

// ====== 渲染主页面 ======
mePanel.innerHTML=''+
'<div class="me-hero">'+
  '<div class="me-hero-bg" id="me-hero-bg">'+
    '<span class="me-bg-hint">点击更换背景</span>'+
  '</div>'+
  '<div class="me-frame" id="me-frame">'+
    '<span class="me-frame-ph">+</span>'+
  '</div>'+
  '<div class="me-bubbles" id="me-bubbles"></div>'+
  '<div class="me-bubble-save" id="me-bubble-save">保存</div>'+
  '<div class="me-avatar-wrap">'+
    '<div class="me-avatar" id="me-avatar">'+
      '<span class="me-avatar-ph">𖥦</span>'+
    '</div>'+
  '</div>'+
'</div>'+
'<div class="me-content">'+
  '<div class="me-user-entry" id="me-user-entry">'+
    '<div class="me-ue-avatar" id="me-ue-avatar">'+
      '<span class="me-ue-ph">𖥦</span>'+
    '</div>'+
    '<div class="me-ue-info">'+
      '<div class="me-ue-name" id="me-ue-name">未设置</div>'+
      '<div class="me-ue-desc" id="me-ue-desc">点击编辑个人信息</div>'+
    '</div>'+
    '<span class="me-ue-arrow">›</span>'+
  '</div>'+
  '<div class="me-menu-list">'+
    '<div class="me-menu-item" id="me-menu-wallet">'+
      '<span class="me-menu-icon">○𝒮</span>'+
      '<span class="me-menu-text">钱包</span>'+
      '<span class="me-menu-extra" id="me-wallet-preview"></span>'+
      '<span class="me-menu-arrow">›</span>'+
    '</div>'+
    '<div class="me-menu-item" id="me-menu-fav">'+
      '<span class="me-menu-icon">☘</span>'+
      '<span class="me-menu-text">收藏</span>'+
      '<span class="me-menu-extra" id="me-fav-count"></span>'+
      '<span class="me-menu-arrow">›</span>'+
    '</div>'+
    '<div class="me-menu-item" id="me-menu-mask">'+
      '<span class="me-menu-icon">❊</span>'+
      '<span class="me-menu-text">人设面具</span>'+
      '<span class="me-menu-extra" id="me-mask-preview"></span>'+
      '<span class="me-menu-arrow">›</span>'+
    '</div>'+
  '</div>'+
'</div>';

// ====== 子页面容器 ======
var sp=document.createElement('div');
sp.innerHTML=''+
'<div class="me-sub-page" id="me-edit-page"></div>'+
'<div class="me-sub-page" id="me-wallet-page"></div>'+
'<div class="me-sub-page" id="me-fav-page"></div>'+
'<div class="me-sub-page" id="me-mask-page"></div>'+
'<div class="me-sub-page z230" id="me-mask-edit"></div>';
document.body.appendChild(sp);

// ====== 引用 ======
var heroBg=$('#me-hero-bg');
var frameEl=$('#me-frame');
var bubblesEl=$('#me-bubbles');
var bubbleSaveBtn=$('#me-bubble-save');
var avatarEl=$('#me-avatar');

// ====== 气泡 ======
var bubbleEditing=false;

function renderBubbles(arr){
  bubblesEl.innerHTML='';
  arr.forEach(function(txt,i){
    var b=document.createElement('div');
    b.className='me-bubble';
    b.textContent=txt;
    b.dataset.idx=i;
    b.addEventListener('click',function(){
      if(!bubbleEditing)startBubbleEdit();
    });
    bubblesEl.appendChild(b);
  });
}

function startBubbleEdit(){
  bubbleEditing=true;
  bubbleSaveBtn.classList.add('show');
  bubblesEl.querySelectorAll('.me-bubble').forEach(function(b){
    b.classList.add('editing');
    b.contentEditable='true';
  });
  var first=bubblesEl.querySelector('.me-bubble');
  if(first)first.focus();
}

function saveBubbles(){
  var arr=[];
  bubblesEl.querySelectorAll('.me-bubble').forEach(function(b){
    arr.push(b.textContent.trim()||'...');
    b.contentEditable='false';
    b.classList.remove('editing');
  });
  lsSet('tq_user_bubbles',arr);
  bubbleSaveBtn.classList.remove('show');
  bubbleEditing=false;
  showToast('气泡已保存');
}

bubbleSaveBtn.addEventListener('click',saveBubbles);

// ====== 刷新主页 ======
window.refreshMeTab=function(){
  var bg=localStorage.getItem('tq_user_bg')||'';
  if(bg){heroBg.style.backgroundImage='url("'+bg+'")';heroBg.classList.add('has-bg');}
  else{heroBg.style.backgroundImage='';heroBg.classList.remove('has-bg');}

  var frame=localStorage.getItem('tq_user_frame')||'';
  if(frame){frameEl.innerHTML='<img src="'+frame+'" alt="">';}
  else{frameEl.innerHTML='<span class="me-frame-ph">+</span>';}

  renderBubbles(lsGet('tq_user_bubbles',DEFAULT_BUBBLES));

  var avatar=localStorage.getItem('tq_user_avatar')||'';
  if(avatar){
    avatarEl.innerHTML='<img src="'+avatar+'" alt="">';
    $('#me-ue-avatar').innerHTML='<img src="'+avatar+'" alt="">';
  }else{
    avatarEl.innerHTML='<span class="me-avatar-ph">𖥦</span>';
    $('#me-ue-avatar').innerHTML='<span class="me-ue-ph">𖥦</span>';
  }

  var name=localStorage.getItem('tq_user_name')||'';
  var nickname=localStorage.getItem('tq_user_nickname')||'';
  $('#me-ue-name').textContent=name||'未设置';
  $('#me-ue-desc').textContent=nickname||'点击编辑个人信息';

  var bal=parseFloat(localStorage.getItem('tq_wallet_balance'))||0;
  $('#me-wallet-preview').textContent='¥'+bal.toFixed(2);

  var favs=lsGet('tq_favorites',[]);
  $('#me-fav-count').textContent=favs.length?favs.length+'条':'';

  var activeMask=localStorage.getItem('tq_active_mask')||'';
  if(activeMask){
    var masks=lsGet('tq_masks',[]);
    var m=masks.find(function(x){return x.id===activeMask;});
    $('#me-mask-preview').textContent=m?m.name:'';
  }else{$('#me-mask-preview').textContent='';}
};

// ====== 背景图 ======
heroBg.addEventListener('click',function(e){
  if(bubbleEditing)return;
  if(e.target!==heroBg&&!e.target.classList.contains('me-bg-hint'))return;
  openUploadModal('me_bg',function(k,src){
    localStorage.setItem('tq_user_bg',src);
    heroBg.style.backgroundImage='url("'+src+'")';
    heroBg.classList.add('has-bg');
    showToast('背景已更换');
  });
});

// ====== 圆框 ======
frameEl.addEventListener('click',function(){
  if(bubbleEditing)return;
  openUploadModal('me_frame',function(k,src){
    localStorage.setItem('tq_user_frame',src);
    frameEl.innerHTML='<img src="'+src+'" alt="">';
    showToast('圆框图片已设置');
  });
});

// ====== 头像/入口点击 ======
avatarEl.addEventListener('click',function(){
  if(bubbleEditing)return;
  if(window.openMeEditPage)window.openMeEditPage();
});
$('#me-user-entry').addEventListener('click',function(){
  if(window.openMeEditPage)window.openMeEditPage();
});
$('#me-menu-wallet').addEventListener('click',function(){
  if(window.openWalletPage)window.openWalletPage();
});
$('#me-menu-fav').addEventListener('click',function(){
  if(window.openFavPage)window.openFavPage();
});
$('#me-menu-mask').addEventListener('click',function(){
  if(window.openMaskPage)window.openMaskPage();
});

if(meTabBtn){
  meTabBtn.addEventListener('click',function(){
    setTimeout(window.refreshMeTab,50);
  });
}

refreshMeTab();
console.log('✦ 我·主页面 加载完毕');

// ============================
// 个人信息编辑页
// ============================
(function initMeEdit(){
var page=$('#me-edit-page');
var meEditAvatar=null;
var meEditGender='';

page.innerHTML=''+
'<div class="me-sub-header">'+
  '<span class="msh-back" onclick="closeMeEdit()">‹</span>'+
  '<span class="msh-title">编辑资料</span>'+
  '<span class="msh-save" onclick="saveMeEdit()">保存</span>'+
'</div>'+
'<div class="me-edit-body">'+
  '<div class="me-edit-avatar-wrap">'+
    '<div class="me-edit-avatar" id="mea-avatar" onclick="pickMeAvatar()">'+
      '<span class="mea-ph">𖥦</span><span class="mea-plus">+</span>'+
    '</div>'+
  '</div>'+
  '<div class="me-edit-field"><label>名字</label>'+
    '<input type="text" id="mea-name" placeholder="输入名字"></div>'+
  '<div class="me-edit-field"><label>昵称</label>'+
    '<input type="text" id="mea-nickname" placeholder="输入昵称"></div>'+
  '<div class="me-edit-field"><label>性别</label>'+
    '<div class="me-gender-row" id="mea-gender-row">'+
      '<div class="me-gender-opt" data-g="男">男</div>'+
      '<div class="me-gender-opt" data-g="女">女</div>'+
      '<div class="me-gender-opt" data-g="其他">其他</div>'+
    '</div></div>'+
  '<div class="me-edit-field"><label>人设</label>'+
    '<textarea id="mea-persona" placeholder="描述你的人设..."></textarea></div>'+
'</div>';

page.querySelectorAll('.me-gender-opt').forEach(function(opt){
  opt.addEventListener('click',function(){
    page.querySelectorAll('.me-gender-opt').forEach(function(o){o.classList.remove('selected');});
    opt.classList.add('selected');
    meEditGender=opt.dataset.g;
  });
});

window.openMeEditPage=function(){
  var avatar=localStorage.getItem('tq_user_avatar')||'';
  var name=localStorage.getItem('tq_user_name')||'';
  var nickname=localStorage.getItem('tq_user_nickname')||'';
  var gender=localStorage.getItem('tq_user_gender')||'';
  var persona=localStorage.getItem('tq_user_persona')||'';
  meEditAvatar=avatar||null;
  meEditGender=gender;
  var avEl=$('#mea-avatar');
  if(avatar){avEl.innerHTML='<img src="'+avatar+'" alt=""><span class="mea-plus">+</span>';}
  else{avEl.innerHTML='<span class="mea-ph">𖥦</span><span class="mea-plus">+</span>';}
  $('#mea-name').value=name;
  $('#mea-nickname').value=nickname;
  $('#mea-persona').value=persona;
  page.querySelectorAll('.me-gender-opt').forEach(function(o){
    o.classList.remove('selected');
    if(o.dataset.g===gender)o.classList.add('selected');
  });
  page.classList.add('open');
};

window.closeMeEdit=function(){page.classList.remove('open');};

window.pickMeAvatar=function(){
  openUploadModal('me_avatar',function(k,src){
    meEditAvatar=src;
    $('#mea-avatar').innerHTML='<img src="'+src+'" alt=""><span class="mea-plus">+</span>';
  });
};

window.saveMeEdit=function(){
  var name=$('#mea-name').value.trim();
  var nickname=$('#mea-nickname').value.trim();
  var persona=$('#mea-persona').value.trim();
  if(meEditAvatar)localStorage.setItem('tq_user_avatar',meEditAvatar);
  if(name)localStorage.setItem('tq_user_name',name);
  else localStorage.removeItem('tq_user_name');
  if(nickname)localStorage.setItem('tq_user_nickname',nickname);
  else localStorage.removeItem('tq_user_nickname');
  if(meEditGender)localStorage.setItem('tq_user_gender',meEditGender);
  else localStorage.removeItem('tq_user_gender');
  if(persona)localStorage.setItem('tq_user_persona',persona);
  else localStorage.removeItem('tq_user_persona');
  page.classList.remove('open');
  if(window.refreshMeTab)refreshMeTab();
  showToast('资料已保存');
};

console.log('✦ 我·编辑页 加载完毕');
})();
// ============================
// 钱包
// ============================
(function initWallet(){
var page=$('#me-wallet-page');

function getBalance(){return parseFloat(localStorage.getItem('tq_wallet_balance'))||0;}
function setBalance(v){localStorage.setItem('tq_wallet_balance',v.toFixed(2));}
function getRecords(){return lsGet('tq_wallet_records',[]);}
function addRecord(type,amount,desc){
  var records=getRecords();
  records.unshift({id:'wr_'+Date.now(),type:type,amount:amount,desc:desc||'',time:Date.now()});
  lsSet('tq_wallet_records',records);
}

window.tqWallet={
  getBalance:getBalance,setBalance:setBalance,addRecord:addRecord,
  spend:function(amount,desc){
    var bal=getBalance();
    if(bal<amount){showToast('余额不足');return false;}
    setBalance(bal-amount);addRecord('expense',amount,desc||'支出');return true;
  },
  earn:function(amount,desc){
    var bal=getBalance();setBalance(bal+amount);addRecord('income',amount,desc||'收入');
  }
};

function fmtTime(ts){
  var d=new Date(ts);
  return String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}

function renderWallet(){
  var bal=getBalance();
  var records=getRecords();
  var rHTML='';
  if(records.length===0){rHTML='<div class="wallet-empty">暂无记录</div>';}
  else{records.forEach(function(r){
    var cls=r.type==='income'?'income':'expense';
    var sign=r.type==='income'?'+':'-';
    rHTML+='<div class="wallet-record"><div class="wr-info"><div class="wr-desc">'+(r.desc||r.type)+'</div><div class="wr-time">'+fmtTime(r.time)+'</div></div><div class="wr-amount '+cls+'">'+sign+'¥'+r.amount.toFixed(2)+'</div></div>';
  });}

  page.innerHTML=''+
  '<div class="me-sub-header">'+
    '<span class="msh-back" onclick="closeWallet()">‹</span>'+
    '<span class="msh-title">钱包</span>'+
    '<span class="msh-right" style="opacity:0">.</span>'+
  '</div>'+
  '<div class="wallet-balance-card">'+
    '<div class="wbc-label">账户余额</div>'+
    '<div class="wbc-amount"><span>¥</span>'+bal.toFixed(2)+'</div>'+
  '</div>'+
  '<div class="wallet-actions">'+
    '<div class="wallet-act-btn" onclick="walletRecharge()">+ 充值</div>'+
    '<div class="wallet-act-btn" onclick="walletToggleRecords()">◎ 收支记录</div>'+
  '</div>'+
  '<div id="wallet-records-area" style="display:none">'+
    '<div class="wallet-records-title">收支明细</div>'+
    '<div class="wallet-records">'+rHTML+'</div>'+
  '</div>';
}

window.openWalletPage=function(){renderWallet();page.classList.add('open');};
window.closeWallet=function(){page.classList.remove('open');if(window.refreshMeTab)refreshMeTab();};
window.walletToggleRecords=function(){
  var area=$('#wallet-records-area');
  if(area)area.style.display=area.style.display==='none'?'block':'none';
};

window.walletRecharge=function(){
  var ov=document.createElement('div');
  ov.className='me-recharge-overlay';
  ov.innerHTML='<div class="me-recharge-box">'+
    '<div style="font-size:14px;color:var(--txt-pri);letter-spacing:1px;margin-bottom:16px;text-align:center">充值金额</div>'+
    '<input type="number" id="recharge-input" placeholder="输入金额" style="width:100%;padding:10px 14px;border-radius:12px;background:var(--bg-sec);font-size:15px;color:var(--txt-pri);border:1px solid var(--glass-border);text-align:center;font-family:inherit">'+
    '<div style="display:flex;gap:10px;margin-top:16px">'+
      '<div id="recharge-cancel" style="flex:1;text-align:center;padding:10px;border-radius:12px;background:var(--bg-sec);border:1px solid var(--glass-border);font-size:13px;color:var(--txt-sec);cursor:pointer;letter-spacing:1px">取消</div>'+
      '<div id="recharge-confirm" style="flex:1;text-align:center;padding:10px;border-radius:12px;background:var(--morandi-blue);font-size:13px;color:#fff;cursor:pointer;letter-spacing:1px">确认</div>'+
    '</div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
  ov.querySelector('#recharge-cancel').onclick=function(){ov.remove();};
  ov.querySelector('#recharge-confirm').onclick=function(){
    var val=parseFloat(document.querySelector('#recharge-input').value);
    if(!val||val<=0){showToast('请输入有效金额');return;}
    tqWallet.earn(val,'手动充值');ov.remove();renderWallet();
    showToast('充值成功 +¥'+val.toFixed(2));
  };
  setTimeout(function(){var inp=document.querySelector('#recharge-input');if(inp)inp.focus();},100);
};

console.log('✦ 我·钱包 加载完毕');
})();

// ============================
// 收藏
// ============================
(function initFavorites(){
var page=$('#me-fav-page');
var favEditMode=false;
var favSelected=new Set();

function fmtTime(ts){
  var d=new Date(ts);
  return String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}

function renderFavPage(){
  var favs=lsGet('tq_favorites',[]);
  favEditMode=false;favSelected.clear();
  var lHTML='';
  if(favs.length===0){lHTML='<div class="fav-empty">暂无收藏</div>';}
  else{favs.forEach(function(f){
    lHTML+='<div class="fav-item" data-fid="'+f.id+'"><div class="fav-check" data-fid="'+f.id+'"></div><div class="fav-body"><div class="fav-contact">'+(f.contactName||'未知')+'</div><div class="fav-text">'+(f.text||'')+'</div><div class="fav-time">'+fmtTime(f.savedAt||f.time)+'</div></div></div>';
  });}

  page.innerHTML=''+
  '<div class="me-sub-header">'+
    '<span class="msh-back" onclick="closeFavPage()">‹</span>'+
    '<span class="msh-title">收藏</span>'+
    '<span class="msh-right" id="fav-edit-btn" onclick="toggleFavEdit()">编辑</span>'+
  '</div>'+
  '<div id="fav-delete-bar" style="display:none;padding:8px 20px">'+
    '<div class="wallet-act-btn" onclick="deleteFavSelected()" style="background:#e07070;color:#fff;border:none">删除所选</div>'+
  '</div>'+
  '<div id="fav-list">'+lHTML+'</div>';

  page.querySelectorAll('.fav-check').forEach(function(ck){
    ck.addEventListener('click',function(){
      var fid=ck.dataset.fid;
      if(favSelected.has(fid)){favSelected.delete(fid);ck.classList.remove('checked');ck.textContent='';}
      else{favSelected.add(fid);ck.classList.add('checked');ck.textContent='✓';}
    });
  });
}

window.openFavPage=function(){renderFavPage();page.classList.add('open');};
window.closeFavPage=function(){page.classList.remove('open');if(window.refreshMeTab)refreshMeTab();};

window.toggleFavEdit=function(){
  favEditMode=!favEditMode;
  var btn=$('#fav-edit-btn');
  var bar=$('#fav-delete-bar');
  var checks=page.querySelectorAll('.fav-check');
  if(favEditMode){btn.textContent='完成';bar.style.display='block';checks.forEach(function(c){c.classList.add('show');});}
  else{btn.textContent='编辑';bar.style.display='none';favSelected.clear();checks.forEach(function(c){c.classList.remove('show','checked');c.textContent='';});}
};

window.deleteFavSelected=function(){
  if(favSelected.size===0){showToast('请先选择要删除的收藏');return;}
  showModal('确认删除','删除 '+favSelected.size+' 条收藏？',[
    {text:'取消',type:'cancel'},
    {text:'删除',type:'confirm',cb:function(){
      var favs=lsGet('tq_favorites',[]);
      favs=favs.filter(function(f){return !favSelected.has(f.id);});
      lsSet('tq_favorites',favs);renderFavPage();showToast('已删除');
    }}
  ]);
};

console.log('✦ 我·收藏 加载完毕');
})();
// ============================
// 人设面具
// ============================
(function initMasks(){
var page=$('#me-mask-page');
var editPage=$('#me-mask-edit');
var maskEditId=null;
var maskEditAvatar=null;

function getMasks(){return lsGet('tq_masks',[]);}
function saveMasks(arr){lsSet('tq_masks',arr);}
function getActive(){return localStorage.getItem('tq_active_mask')||'';}

function backupOriginal(){
  if(!localStorage.getItem('tq_user_original')){
    lsSet('tq_user_original',{
      name:localStorage.getItem('tq_user_name')||'',
      nickname:localStorage.getItem('tq_user_nickname')||'',
      avatar:localStorage.getItem('tq_user_avatar')||'',
      gender:localStorage.getItem('tq_user_gender')||'',
      persona:localStorage.getItem('tq_user_persona')||''
    });
  }
}
function restoreOriginal(){
  var orig=lsGet('tq_user_original',null);
  if(!orig)return;
  var keys=['name','nickname','avatar','gender','persona'];
  keys.forEach(function(k){
    if(orig[k])localStorage.setItem('tq_user_'+k,orig[k]);
    else localStorage.removeItem('tq_user_'+k);
  });
}
function applyMask(mask){
  backupOriginal();
  if(mask.name)localStorage.setItem('tq_user_name',mask.name);
  if(mask.nickname)localStorage.setItem('tq_user_nickname',mask.nickname);
  if(mask.avatar)localStorage.setItem('tq_user_avatar',mask.avatar);
  if(mask.persona)localStorage.setItem('tq_user_persona',mask.persona);
  localStorage.setItem('tq_active_mask',mask.id);
}

function renderMaskPage(){
  var masks=getMasks();
  var active=getActive();
  var lHTML='';
  if(masks.length===0){lHTML='<div class="mask-empty">暂无面具，点击右上角新建</div>';}
  else{masks.forEach(function(m){
    var isActive=m.id===active;
    var avHTML=m.avatar?'<img src="'+m.avatar+'" alt="">':'<span class="mask-ph">'+((m.name||'?').charAt(0))+'</span>';
    var tag=isActive?'<span class="mask-active-tag">使用中</span>':'';
    lHTML+='<div class="mask-item" data-mid="'+m.id+'"><div class="mask-avatar">'+avHTML+'</div><div class="mask-info"><div class="mask-name">'+(m.name||'未命名')+'</div><div class="mask-desc">'+(m.nickname||m.persona||'无描述')+'</div></div>'+tag+'</div>';
  });}

  page.innerHTML=''+
  '<div class="me-sub-header">'+
    '<span class="msh-back" onclick="closeMaskPage()">‹</span>'+
    '<span class="msh-title">人设面具</span>'+
    '<span class="msh-right" onclick="openMaskEdit()">+ 新建</span>'+
  '</div>'+
  '<div id="mask-list">'+lHTML+'</div>';

  page.querySelectorAll('.mask-item').forEach(function(item){
    var mid=item.dataset.mid;
    var pressTimer=null;
    var pressed=false;
    item.addEventListener('click',function(){
      if(pressed){pressed=false;return;}
      var masks2=getMasks();
      var m=masks2.find(function(x){return x.id===mid;});
      if(!m)return;
      if(getActive()===mid){
        localStorage.removeItem('tq_active_mask');
        restoreOriginal();localStorage.removeItem('tq_user_original');
        renderMaskPage();if(window.refreshMeTab)refreshMeTab();
        showToast('已取消面具');
      }else{
        applyMask(m);renderMaskPage();
        if(window.refreshMeTab)refreshMeTab();
        showToast('已切换为「'+m.name+'」');
      }
    });
    item.addEventListener('touchstart',function(){
      pressTimer=setTimeout(function(){
        pressed=true;
        showModal('面具操作','',[
          {text:'编辑',type:'cancel',cb:function(){openMaskEdit(mid);}},
          {text:'删除',type:'confirm',cb:function(){
            showModal('确认删除','删除此面具？',[
              {text:'取消',type:'cancel'},
              {text:'删除',type:'confirm',cb:function(){
                var ms=getMasks();
                ms=ms.filter(function(x){return x.id!==mid;});
                saveMasks(ms);
                if(getActive()===mid){
                  localStorage.removeItem('tq_active_mask');
                  restoreOriginal();localStorage.removeItem('tq_user_original');
                }
                renderMaskPage();if(window.refreshMeTab)refreshMeTab();showToast('已删除');
              }}
            ]);
          }}
        ]);
      },600);
    },{passive:true});
    item.addEventListener('touchend',function(){clearTimeout(pressTimer);});
    item.addEventListener('touchmove',function(){clearTimeout(pressTimer);});
  });
}

window.openMaskPage=function(){renderMaskPage();page.classList.add('open');};
window.closeMaskPage=function(){page.classList.remove('open');if(window.refreshMeTab)refreshMeTab();};

function renderMaskEdit(mask){
  maskEditId=mask?mask.id:null;
  maskEditAvatar=mask?(mask.avatar||null):null;
  var avHTML=maskEditAvatar
    ?'<img src="'+maskEditAvatar+'" alt=""><span class="mea-plus">+</span>'
    :'<span class="mea-ph">𖥦</span><span class="mea-plus">+</span>';

  editPage.innerHTML=''+
  '<div class="me-sub-header">'+
    '<span class="msh-back" onclick="closeMaskEdit()">‹</span>'+
    '<span class="msh-title">'+(mask?'编辑面具':'新建面具')+'</span>'+
    '<span class="msh-save" onclick="saveMaskEdit()">保存</span>'+
  '</div>'+
  '<div class="me-edit-body">'+
    '<div class="me-edit-avatar-wrap">'+
      '<div class="me-edit-avatar" id="mask-ea" onclick="pickMaskAvatar()">'+avHTML+'</div>'+
    '</div>'+
    '<div class="me-edit-field"><label>名字</label>'+
      '<input type="text" id="mask-e-name" placeholder="面具名字" value="'+(mask?mask.name:'')+'"></div>'+
    '<div class="me-edit-field"><label>昵称</label>'+
      '<input type="text" id="mask-e-nick" placeholder="面具昵称" value="'+(mask?mask.nickname:'')+'"></div>'+
    '<div class="me-edit-field"><label>人设</label>'+
      '<textarea id="mask-e-persona" placeholder="面具人设描述...">'+(mask?mask.persona:'')+'</textarea></div>'+
  '</div>';
}

window.openMaskEdit=function(mid){
  if(mid){
    var masks=getMasks();
    var m=masks.find(function(x){return x.id===mid;});
    renderMaskEdit(m||null);
  }else{renderMaskEdit(null);}
  editPage.classList.add('open');
};

window.closeMaskEdit=function(){editPage.classList.remove('open');};

window.pickMaskAvatar=function(){
  openUploadModal('mask_avatar',function(k,src){
    maskEditAvatar=src;
    $('#mask-ea').innerHTML='<img src="'+src+'" alt=""><span class="mea-plus">+</span>';
  });
};

window.saveMaskEdit=function(){
  var name=$('#mask-e-name').value.trim();
  if(!name){showToast('请输入面具名字');return;}
  var masks=getMasks();
  var data={
    id:maskEditId||('mask_'+Date.now()),
    name:name,
    nickname:$('#mask-e-nick').value.trim(),
    avatar:maskEditAvatar||'',
    persona:$('#mask-e-persona').value.trim()
  };
  if(maskEditId){
    var idx=masks.findIndex(function(x){return x.id===maskEditId;});
    if(idx>-1)masks[idx]=data;
  }else{masks.push(data);}
  saveMasks(masks);
  if(getActive()===data.id)applyMask(data);
  editPage.classList.remove('open');
  renderMaskPage();if(window.refreshMeTab)refreshMeTab();
  showToast(maskEditId?'面具已更新':'面具已创建');
};

console.log('✦ 我·面具 加载完毕');
})();

})();
// ============================
// 「我」Tab · 修复补丁
// ============================
(function initMePatch(){

// ====== 补丁CSS ======
var patchCSS=document.createElement('style');
patchCSS.textContent=`
.me-avatar-bubbles{position:absolute;bottom:12px;right:84px;display:flex;flex-direction:column;gap:5px;z-index:2;align-items:flex-end;max-width:calc(100% - 160px);}
.me-bubble .mb-del{display:none;margin-left:6px;font-size:10px;color:rgba(255,255,255,0.6);cursor:pointer;}
.me-bubble.editing .mb-del{display:inline;}
.me-bubble.editing .mb-del:active{color:#fff;}
.me-bubble-add{display:none;padding:4px 12px;border-radius:10px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,0.15);border:1px dashed rgba(255,255,255,0.35);font-size:11px;color:rgba(255,255,255,0.6);cursor:pointer;width:fit-content;letter-spacing:1px;margin-top:2px;}
.me-bubble-add.show{display:block;}
.me-bubble-add:active{background:rgba(255,255,255,0.25);}
body.dark-mode .me-bubble-add{background:rgba(0,0,0,0.25);border-color:rgba(255,255,255,0.15);}
.fav-del-btn{position:absolute;top:8px;right:16px;padding:4px 12px;border-radius:8px;background:#e07070;color:#fff;font-size:11px;letter-spacing:1px;cursor:pointer;display:none;transition:transform .15s;}
.fav-del-btn.show{display:block;}
.fav-del-btn:active{transform:scale(0.93);}
.fav-header-wrap{position:relative;}
.wallet-icon-circle{display:inline-flex;width:20px;height:20px;border-radius:50%;border:1.5px solid currentColor;align-items:center;justify-content:center;font-size:11px;line-height:1;}
`;
document.head.appendChild(patchCSS);

// ====== 1. 图片压缩工具 ======
window._tqCompressImg=function(src,maxW,quality,cb){
  if(!src||!src.startsWith('data:')){cb(src);return;}
  try{
    var img=new Image();
    img.onload=function(){
      var c=document.createElement('canvas');
      var w=img.width,h=img.height;
      if(w>maxW){h=Math.round(h*maxW/w);w=maxW;}
      c.width=w;c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      var out=c.toDataURL('image/jpeg',quality);
      cb(out);
    };
    img.onerror=function(){cb(src);};
    img.src=src;
  }catch(e){cb(src);}
};

// ====== 2. 修复头像上传（压缩大图） ======
window._mePatchAvatar=undefined;

window.pickMeAvatar=function(){
  openUploadModal('me_avatar',function(k,src){
    if(src&&src.startsWith('data:')&&src.length>80000){
      _tqCompressImg(src,400,0.7,function(compressed){
        window._mePatchAvatar=compressed;
        $('#mea-avatar').innerHTML='<img src="'+compressed+'" alt=""><span class="mea-plus">+</span>';
      });
    }else{
      window._mePatchAvatar=src;
      $('#mea-avatar').innerHTML='<img src="'+src+'" alt=""><span class="mea-plus">+</span>';
    }
  });
};

window.saveMeEdit=function(){
  var name=$('#mea-name').value.trim();
  var nickname=$('#mea-nickname').value.trim();
  var persona=$('#mea-persona').value.trim();
  var genderEl=document.querySelector('#me-edit-page .me-gender-opt.selected');
  var gender=genderEl?genderEl.dataset.g:'';
  var avatar=window._mePatchAvatar;

  if(typeof avatar==='string'&&avatar){
    try{localStorage.setItem('tq_user_avatar',avatar);}
    catch(e){showToast('图片太大，请用链接');return;}
  }
  if(name)localStorage.setItem('tq_user_name',name);
  else localStorage.removeItem('tq_user_name');
  if(nickname)localStorage.setItem('tq_user_nickname',nickname);
  else localStorage.removeItem('tq_user_nickname');
  if(gender)localStorage.setItem('tq_user_gender',gender);
  else localStorage.removeItem('tq_user_gender');
  if(persona)localStorage.setItem('tq_user_persona',persona);
  else localStorage.removeItem('tq_user_persona');

  $('#me-edit-page').classList.remove('open');
  window._mePatchAvatar=undefined;
  if(window.refreshMeTab)refreshMeTab();
  showToast('资料已保存');
};

window.openMeEditPage=function(){
  var avatar=localStorage.getItem('tq_user_avatar')||'';
  var name=localStorage.getItem('tq_user_name')||'';
  var nickname=localStorage.getItem('tq_user_nickname')||'';
  var gender=localStorage.getItem('tq_user_gender')||'';
  var persona=localStorage.getItem('tq_user_persona')||'';
  window._mePatchAvatar=avatar||undefined;
  var avEl=$('#mea-avatar');
  if(avatar){avEl.innerHTML='<img src="'+avatar+'" alt=""><span class="mea-plus">+</span>';}
  else{avEl.innerHTML='<span class="mea-ph">𖥦</span><span class="mea-plus">+</span>';}
  $('#mea-name').value=name;
  $('#mea-nickname').value=nickname;
  $('#mea-persona').value=persona;
  var page=$('#me-edit-page');
  page.querySelectorAll('.me-gender-opt').forEach(function(o){
    o.classList.remove('selected');
    if(o.dataset.g===gender)o.classList.add('selected');
  });
  page.classList.add('open');
};

// ====== 3. 修复钱包图标 ======
var walletIcon=document.querySelector('#me-menu-wallet .me-menu-icon');
if(walletIcon){
  walletIcon.innerHTML='<span class="wallet-icon-circle">𝒮</span>';
}

// ====== 4. 修复收藏删除按钮 ======
window.openFavPage=function(){
  renderFavPatch();
  $('#me-fav-page').classList.add('open');
};

var favEditMode2=false;
var favSelected2=new Set();

function fmtTimeFav(ts){
  var d=new Date(ts);
  return String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}

function renderFavPatch(){
  var page=$('#me-fav-page');
  var favs=lsGet('tq_favorites',[]);
  favEditMode2=false;
  favSelected2.clear();

  var lHTML='';
  if(favs.length===0){lHTML='<div class="fav-empty">暂无收藏</div>';}
  else{favs.forEach(function(f){
    lHTML+='<div class="fav-item" data-fid="'+f.id+'"><div class="fav-check" data-fid="'+f.id+'"></div><div class="fav-body"><div class="fav-contact">'+(f.contactName||'未知')+'</div><div class="fav-text">'+(f.text||'')+'</div><div class="fav-time">'+fmtTimeFav(f.savedAt||f.time)+'</div></div></div>';
  });}

  page.innerHTML=''+
  '<div class="fav-header-wrap">'+
    '<div class="me-sub-header">'+
      '<span class="msh-back" onclick="closeFavPage()">‹</span>'+
      '<span class="msh-title">收藏</span>'+
      '<span class="msh-right" id="fav-edit-btn2" onclick="toggleFavEdit2()">编辑</span>'+
    '</div>'+
    '<span class="fav-del-btn" id="fav-del-btn2" onclick="deleteFavSelected2()">删除</span>'+
  '</div>'+
  '<div id="fav-list">'+lHTML+'</div>';

  page.querySelectorAll('.fav-check').forEach(function(ck){
    ck.addEventListener('click',function(){
      var fid=ck.dataset.fid;
      if(favSelected2.has(fid)){favSelected2.delete(fid);ck.classList.remove('checked');ck.textContent='';}
      else{favSelected2.add(fid);ck.classList.add('checked');ck.textContent='✓';}
    });
  });
}

window.toggleFavEdit2=function(){
  favEditMode2=!favEditMode2;
  var btn=$('#fav-edit-btn2');
  var delBtn=$('#fav-del-btn2');
  var checks=document.querySelectorAll('#me-fav-page .fav-check');
  if(favEditMode2){
    btn.textContent='完成';
    delBtn.classList.add('show');
    checks.forEach(function(c){c.classList.add('show');});
  }else{
    btn.textContent='编辑';
    delBtn.classList.remove('show');
    favSelected2.clear();
    checks.forEach(function(c){c.classList.remove('show','checked');c.textContent='';});
  }
};
window.toggleFavEdit=window.toggleFavEdit2;

window.deleteFavSelected2=function(){
  if(favSelected2.size===0){showToast('请先选择收藏');return;}
  showModal('确认删除','删除 '+favSelected2.size+' 条收藏？',[
    {text:'取消',type:'cancel'},
    {text:'删除',type:'confirm',cb:function(){
      var favs=lsGet('tq_favorites',[]);
      favs=favs.filter(function(f){return !favSelected2.has(f.id);});
      lsSet('tq_favorites',favs);
      renderFavPatch();
      showToast('已删除');
    }}
  ]);
};
window.deleteFavSelected=window.deleteFavSelected2;
// ====== 5. 修复面具（压缩头像+安全存储） ======
function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

window.pickMaskAvatar=function(){
  openUploadModal('mask_avatar',function(k,src){
    if(src&&src.startsWith('data:')&&src.length>80000){
      _tqCompressImg(src,300,0.65,function(compressed){
        window._maskPatchAvatar=compressed;
        $('#mask-ea').innerHTML='<img src="'+compressed+'" alt=""><span class="mea-plus">+</span>';
      });
    }else{
      window._maskPatchAvatar=src;
      $('#mask-ea').innerHTML='<img src="'+src+'" alt=""><span class="mea-plus">+</span>';
    }
  });
};

window.openMaskEdit=function(mid){
  window._maskPatchAvatar=null;
  window._maskEditingId=null;
  if(mid){
    var masks=lsGet('tq_masks',[]);
    var m=masks.find(function(x){return x.id===mid;});
    if(m){
      window._maskEditingId=m.id;
      window._maskPatchAvatar=m.avatar||null;
      renderMaskEditPatch(m);
    }else{renderMaskEditPatch(null);}
  }else{renderMaskEditPatch(null);}
  $('#me-mask-edit').classList.add('open');
};

function renderMaskEditPatch(mask){
  var ep=$('#me-mask-edit');
  var avHTML=(mask&&mask.avatar)
    ?'<img src="'+mask.avatar+'" alt=""><span class="mea-plus">+</span>'
    :'<span class="mea-ph">𖥦</span><span class="mea-plus">+</span>';
  ep.innerHTML=''+
  '<div class="me-sub-header">'+
    '<span class="msh-back" onclick="closeMaskEdit()">‹</span>'+
    '<span class="msh-title">'+(mask?'编辑面具':'新建面具')+'</span>'+
    '<span class="msh-save" onclick="saveMaskEdit()">保存</span>'+
  '</div>'+
  '<div class="me-edit-body">'+
    '<div class="me-edit-avatar-wrap">'+
      '<div class="me-edit-avatar" id="mask-ea" onclick="pickMaskAvatar()">'+avHTML+'</div>'+
    '</div>'+
    '<div class="me-edit-field"><label>名字</label>'+
      '<input type="text" id="mask-e-name" placeholder="面具名字" value="'+escH(mask?mask.name:'')+'"></div>'+
    '<div class="me-edit-field"><label>昵称</label>'+
      '<input type="text" id="mask-e-nick" placeholder="面具昵称" value="'+escH(mask?mask.nickname:'')+'"></div>'+
    '<div class="me-edit-field"><label>人设</label>'+
      '<textarea id="mask-e-persona" placeholder="面具人设描述...">'+(mask?escH(mask.persona):'')+'</textarea></div>'+
  '</div>';
}

window.saveMaskEdit=function(){
  var name=$('#mask-e-name').value.trim();
  if(!name){showToast('请输入面具名字');return;}

  var masks=lsGet('tq_masks',[]);
  var mid=window._maskEditingId;
  var avatar=window._maskPatchAvatar||'';
  var data={
    id:mid||('mask_'+Date.now()+'_'+Math.random().toString(36).substr(2,4)),
    name:name,
    nickname:$('#mask-e-nick').value.trim(),
    avatar:avatar,
    persona:$('#mask-e-persona').value.trim()
  };

  if(mid){
    var idx=masks.findIndex(function(x){return x.id===mid;});
    if(idx>-1)masks[idx]=data;
    else masks.push(data);
  }else{masks.push(data);}

  try{
    lsSet('tq_masks',masks);
  }catch(e){
    showToast('存储空间不足，请用链接头像');
    return;
  }

  var active=localStorage.getItem('tq_active_mask')||'';
  if(active===data.id){
    if(data.name)localStorage.setItem('tq_user_name',data.name);
    if(data.nickname)localStorage.setItem('tq_user_nickname',data.nickname);
    if(data.avatar)localStorage.setItem('tq_user_avatar',data.avatar);
    if(data.persona)localStorage.setItem('tq_user_persona',data.persona);
  }

  $('#me-mask-edit').classList.remove('open');
  if(window.openMaskPage){
    var mp=$('#me-mask-page');
    if(mp.classList.contains('open')){
      window.closeMaskPage();
      setTimeout(function(){window.openMaskPage();},50);
    }
  }
  if(window.refreshMeTab)refreshMeTab();
  showToast(mid?'面具已更新':'面具已创建');
};

// ====== 6. 头像旁气泡 + 气泡删除功能 ======
var DEFAULT_BOTTOM=['在这里 ♡','想你'];

// 添加底部气泡容器
var heroEl=document.querySelector('.me-hero');
if(heroEl){
  var abWrap=document.createElement('div');
  abWrap.className='me-avatar-bubbles';
  abWrap.id='me-bubbles-bottom';
  heroEl.appendChild(abWrap);

  // 添加顶部+按钮
  var addBtnTop=document.createElement('div');
  addBtnTop.className='me-bubble-add';
  addBtnTop.id='me-bubble-add-top';
  addBtnTop.textContent='+ 添加气泡';
  var topBubbles=document.querySelector('#me-bubbles');
  if(topBubbles)topBubbles.parentNode.insertBefore(addBtnTop,topBubbles.nextSibling);

  // 添加底部+按钮
  var addBtnBot=document.createElement('div');
  addBtnBot.className='me-bubble-add';
  addBtnBot.id='me-bubble-add-bottom';
  addBtnBot.textContent='+ 添加气泡';
  addBtnBot.style.alignSelf='flex-end';
  abWrap.parentNode.insertBefore(addBtnBot,abWrap.nextSibling);
}

function renderBottomBubbles(arr){
  var el=$('#me-bubbles-bottom');
  if(!el)return;
  el.innerHTML='';
  arr.forEach(function(txt,i){
    var b=document.createElement('div');
    b.className='me-bubble';
    b.innerHTML=escH(txt)+'<span class="mb-del" data-pos="bottom" data-idx="'+i+'">✕</span>';
    b.querySelector('.mb-del').addEventListener('click',function(e){
      e.stopPropagation();
      deleteBubble('bottom',i);
    });
    b.addEventListener('click',function(){
      if(!window._bubbleEditing2)startBubbleEdit2();
    });
    el.appendChild(b);
  });
}

// 重写顶部气泡渲染（加删除按钮）
function renderTopBubbles(arr){
  var el=$('#me-bubbles');
  if(!el)return;
  el.innerHTML='';
  arr.forEach(function(txt,i){
    var b=document.createElement('div');
    b.className='me-bubble';
    b.innerHTML=escH(txt)+'<span class="mb-del" data-pos="top" data-idx="'+i+'">✕</span>';
    b.querySelector('.mb-del').addEventListener('click',function(e){
      e.stopPropagation();
      deleteBubble('top',i);
    });
    b.addEventListener('click',function(){
      if(!window._bubbleEditing2)startBubbleEdit2();
    });
    el.appendChild(b);
  });
}

window._bubbleEditing2=false;

function startBubbleEdit2(){
  window._bubbleEditing2=true;
  $('#me-bubble-save').classList.add('show');
  var addTop=$('#me-bubble-add-top');
  var addBot=$('#me-bubble-add-bottom');
  if(addTop)addTop.classList.add('show');
  if(addBot)addBot.classList.add('show');

  document.querySelectorAll('#me-bubbles .me-bubble, #me-bubbles-bottom .me-bubble').forEach(function(b){
    b.classList.add('editing');
    // 只让文字可编辑，不含删除按钮
    var del=b.querySelector('.mb-del');
    if(del)del.style.pointerEvents='auto';
    // 用span包裹文字
    var textNode=b.firstChild;
    if(textNode&&textNode.nodeType===3){
      var sp=document.createElement('span');
      sp.className='mb-text';
      sp.contentEditable='true';
      sp.textContent=textNode.textContent;
      b.replaceChild(sp,textNode);
    }else if(textNode&&textNode.classList&&!textNode.classList.contains('mb-del')){
      textNode.contentEditable='true';
    }
  });
}

// 覆盖保存按钮
var saveBtn=$('#me-bubble-save');
if(saveBtn){
  var newSave=saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSave,saveBtn);
  newSave.id='me-bubble-save';
  newSave.addEventListener('click',function(){
    var topArr=[];
    document.querySelectorAll('#me-bubbles .me-bubble').forEach(function(b){
      var sp=b.querySelector('.mb-text');
      var txt=sp?sp.textContent.trim():(b.firstChild?b.firstChild.textContent.trim():'');
      if(txt)topArr.push(txt);
    });
    var botArr=[];
    document.querySelectorAll('#me-bubbles-bottom .me-bubble').forEach(function(b){
      var sp=b.querySelector('.mb-text');
      var txt=sp?sp.textContent.trim():(b.firstChild?b.firstChild.textContent.trim():'');
      if(txt)botArr.push(txt);
    });

    lsSet('tq_user_bubbles',topArr);
    lsSet('tq_user_bubbles_bottom',botArr);

    window._bubbleEditing2=false;
    newSave.classList.remove('show');
    var addTop=$('#me-bubble-add-top');
    var addBot=$('#me-bubble-add-bottom');
    if(addTop)addTop.classList.remove('show');
    if(addBot)addBot.classList.remove('show');

    renderTopBubbles(topArr);
    renderBottomBubbles(botArr);
    showToast('气泡已保存');
  });
}

function deleteBubble(pos,idx){
  var key=pos==='top'?'tq_user_bubbles':'tq_user_bubbles_bottom';
  var def=pos==='top'?['我在看你','就像向日葵追逐着太阳','永远仰望着你','Σ>―♡→']:DEFAULT_BOTTOM;
  var arr=lsGet(key,def);
  arr.splice(idx,1);
  lsSet(key,arr);
  if(pos==='top')renderTopBubbles(arr);
  else renderBottomBubbles(arr);
  // 保持编辑状态
  if(window._bubbleEditing2)setTimeout(startBubbleEdit2,50);
}

// 添加气泡按钮事件
var addTopEl=$('#me-bubble-add-top');
if(addTopEl){
  addTopEl.addEventListener('click',function(){
    var arr=lsGet('tq_user_bubbles',['我在看你','就像向日葵追逐着太阳','永远仰望着你','Σ>―♡→']);
    arr.push('新气泡');
    lsSet('tq_user_bubbles',arr);
    renderTopBubbles(arr);
    if(window._bubbleEditing2)setTimeout(startBubbleEdit2,50);
  });
}
var addBotEl=$('#me-bubble-add-bottom');
if(addBotEl){
  addBotEl.addEventListener('click',function(){
    var arr=lsGet('tq_user_bubbles_bottom',DEFAULT_BOTTOM);
    arr.push('新气泡');
    lsSet('tq_user_bubbles_bottom',arr);
    renderBottomBubbles(arr);
    if(window._bubbleEditing2)setTimeout(startBubbleEdit2,50);
  });
}

// ====== 覆盖refreshMeTab中的气泡部分 ======
var origRefresh=window.refreshMeTab;
window.refreshMeTab=function(){
  origRefresh();
  // 重新渲染带删除按钮的气泡
  var topArr=lsGet('tq_user_bubbles',['我在看你','就像向日葵追逐着太阳','永远仰望着你','Σ>―♡→']);
  var botArr=lsGet('tq_user_bubbles_bottom',DEFAULT_BOTTOM);
  renderTopBubbles(topArr);
  renderBottomBubbles(botArr);
};

// 初始渲染底部气泡
var botArr=lsGet('tq_user_bubbles_bottom',DEFAULT_BOTTOM);
renderBottomBubbles(botArr);
// 重渲染顶部气泡（带删除按钮）
var topArr=lsGet('tq_user_bubbles',['我在看你','就像向日葵追逐着太阳','永远仰望着你','Σ>―♡→']);
renderTopBubbles(topArr);

console.log('✦ 我·修复补丁 加载完毕');
})();
// ============================
// 修复：添加气泡按钮位置
// ============================
(function(){
var s=document.createElement('style');
s.textContent=`
#me-bubble-add-top{
  position:absolute;
  left:16px;
  top:auto;
  bottom:14px;
  z-index:3;
}
`;
document.head.appendChild(s);

// 把按钮从气泡后面移到hero底部
var btn=$('#me-bubble-add-top');
var hero=document.querySelector('.me-hero');
if(btn&&hero){
  hero.appendChild(btn);
}

console.log('✦ 气泡按钮位置修复完毕');
})();
// ============================
// 聊天详情页 · 毛玻璃顶部+底部
// ============================
(function(){
var s=document.createElement('style');
s.textContent=`
.cd-topbar{
  background:rgba(255,255,255,0.18) !important;
  backdrop-filter:blur(14px) !important;
  -webkit-backdrop-filter:blur(14px) !important;
  border-bottom:1px solid rgba(255,255,255,0.3) !important;
  box-shadow:0 1px 6px rgba(0,0,0,0.04) !important;
}
body.dark-mode .cd-topbar{
  background:rgba(0,0,0,0.3) !important;
  border-bottom-color:rgba(255,255,255,0.08) !important;
}
.cd-inputbar{
  background:rgba(255,255,255,0.18) !important;
  backdrop-filter:blur(14px) !important;
  -webkit-backdrop-filter:blur(14px) !important;
  border-top:1px solid rgba(255,255,255,0.3) !important;
  box-shadow:0 -1px 6px rgba(0,0,0,0.04) !important;
}
body.dark-mode .cd-inputbar{
  background:rgba(0,0,0,0.3) !important;
  border-top-color:rgba(255,255,255,0.08) !important;
}
`;
document.head.appendChild(s);
console.log('✦ 聊天毛玻璃 加载完毕');
})();

/* =========================
   [CS-01-V2] 聊天设置 · 高颜值文字版壳子
========================= */
(function initChatSettingsShellV2(){
  if(window.__TQ_CS_SHELL_V2__) return;
  window.__TQ_CS_SHELL_V2__ = 1;

  const PAGE_ID = 'tq-chat-settings-page-v2';
  const STYLE_ID = 'tq-chat-settings-style-v2';

  function ensureStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
      #${PAGE_ID}{
        position:fixed;
        inset:0;
        z-index:9800;
        background:var(--bg-pri);
        display:none;
        flex-direction:column;
        overflow:hidden;
      }
      #${PAGE_ID}.open{
        display:flex;
      }

      body.dark-mode #${PAGE_ID}{
        background:#1a1a1a;
      }

      .cs2-topbar{
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding:calc(var(--safe-t,0px) + 8px) 16px 10px;
        flex-shrink:0;
        background:rgba(255,255,255,0.18);
        backdrop-filter:blur(14px);
        -webkit-backdrop-filter:blur(14px);
        border-bottom:1px solid rgba(255,255,255,0.3);
        box-shadow:0 1px 6px rgba(0,0,0,0.04);
      }
      body.dark-mode .cs2-topbar{
        background:rgba(0,0,0,0.3);
        border-bottom-color:rgba(255,255,255,0.08);
      }

      .cs2-back,
      .cs2-right{
        width:32px;
        height:32px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:22px;
        color:var(--txt-sec);
        cursor:pointer;
        user-select:none;
        flex-shrink:0;
      }
      .cs2-back:active,
      .cs2-right:active{
        transform:scale(0.88);
      }
      body.dark-mode .cs2-back,
      body.dark-mode .cs2-right{
        color:#999;
      }

      .cs2-title{
        flex:1;
        text-align:center;
        font-size:15px;
        letter-spacing:2px;
        color:var(--txt-pri);
        font-weight:400;
      }
      body.dark-mode .cs2-title{
        color:#e0e0e0;
      }

      .cs2-body{
        flex:1;
        overflow-y:auto;
        -webkit-overflow-scrolling:touch;
        padding:14px 16px 30px;
      }

      .cs2-group{
        margin-bottom:16px;
        border-radius:18px;
        overflow:hidden;
        background:rgba(255,255,255,0.58);
        backdrop-filter:blur(20px);
        -webkit-backdrop-filter:blur(20px);
        border:1px solid rgba(255,255,255,0.6);
        box-shadow:0 4px 18px rgba(0,0,0,0.04);
      }
      body.dark-mode .cs2-group{
        background:rgba(40,40,40,0.72);
        border-color:rgba(80,80,80,0.35);
      }

      .cs2-group-title{
        padding:12px 16px 8px;
        font-size:11px;
        color:var(--txt-light);
        letter-spacing:2px;
      }
      body.dark-mode .cs2-group-title{
        color:#777;
      }

      .cs2-item{
        display:flex;
        align-items:center;
        min-height:60px;
        padding:12px 16px;
        border-top:1px solid rgba(255,255,255,0.38);
        cursor:pointer;
        transition:background .16s;
      }
      .cs2-item:first-of-type{
        border-top:none;
      }
      .cs2-item:active{
        background:rgba(255,255,255,0.18);
      }
      body.dark-mode .cs2-item{
        border-top-color:rgba(255,255,255,0.05);
      }
      body.dark-mode .cs2-item:active{
        background:rgba(255,255,255,0.04);
      }

      .cs2-item-main{
        flex:1;
        min-width:0;
      }

      .cs2-item-title{
        font-size:14px;
        color:var(--txt-pri);
        letter-spacing:1px;
        line-height:1.4;
      }
      body.dark-mode .cs2-item-title{
        color:#e0e0e0;
      }

      .cs2-item-desc{
        margin-top:3px;
        font-size:11px;
        color:var(--txt-sec);
        line-height:1.5;
        letter-spacing:.5px;
      }
      body.dark-mode .cs2-item-desc{
        color:#777;
      }

      .cs2-arrow{
        margin-left:10px;
        color:var(--txt-light);
        font-size:14px;
        flex-shrink:0;
      }
      body.dark-mode .cs2-arrow{
        color:#555;
      }

      .cs2-switch{
        width:42px;
        height:23px;
        border-radius:12px;
        background:rgba(180,180,180,0.5);
        position:relative;
        flex-shrink:0;
        margin-left:12px;
        transition:background .25s;
      }
      .cs2-switch::after{
        content:'';
        position:absolute;
        top:2px;
        left:2px;
        width:19px;
        height:19px;
        border-radius:50%;
        background:#fff;
        box-shadow:0 1px 4px rgba(0,0,0,.12);
        transition:transform .25s;
      }
      .cs2-switch.on{
        background:var(--morandi-blue);
      }
      .cs2-switch.on::after{
        transform:translateX(19px);
      }

      .cs2-foot-note{
        padding:6px 4px 0;
        text-align:center;
        font-size:10px;
        color:var(--txt-light);
        letter-spacing:1px;
      }
      body.dark-mode .cs2-foot-note{
        color:#666;
      }
    `;
    document.head.appendChild(st);
  }

  function getBool(k, d=false){
    try{
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    }catch(e){
      return d;
    }
  }

  function setBool(k, v){
    try{
      localStorage.setItem(k, JSON.stringify(!!v));
    }catch(e){}
  }

  function toast(msg){
    if(typeof showToast === 'function') showToast(msg);
  }

  const GROUPS = [
    {
      title: '聊天个性',
      items: [
        { id:'bg', label:'背景图', desc:'聊天主页壁纸、单聊壁纸与显示优先级', type:'arrow' },
        { id:'bubble', label:'气泡管理', desc:'角色与用户气泡分开设置、方案保存与预设', type:'arrow' },
        { id:'translate', label:'双语翻译', desc:'角色发送非中文时自动显示原文与中文翻译', type:'switch', key:'cs_translate_on' }
      ]
    },
    {
      title: '互动逻辑',
      items: [
        { id:'block', label:'拉黑管理', desc:'拉黑时长、解除申请、情绪递变与上限次数', type:'arrow' },
        { id:'automsg', label:'主动消息', desc:'根据上下文与时间间隔触发角色主动发言', type:'switch', key:'cs_automsg_on' },
        { id:'timeaware', label:'时间感知', desc:'感知过了多久、跨天变化与情绪递进', type:'switch', key:'cs_time_aware_on' },
        { id:'noreply', label:'不回复规则', desc:'忙碌、冷战或特殊状态下可能暂时不回消息', type:'switch', key:'cs_noreply_on' }
      ]
    },
    {
      title: '记忆数据',
      items: [
        { id:'memory', label:'记忆系统', desc:'自动总结、存入记忆、支持查看编辑删除', type:'arrow' }
      ]
    }
  ];

  function buildItem(item){
    const row = document.createElement('div');
    row.className = 'cs2-item';
    row.dataset.csId = item.id;

    const main = document.createElement('div');
    main.className = 'cs2-item-main';
    main.innerHTML = `
      <div class="cs2-item-title">${item.label}</div>
      <div class="cs2-item-desc">${item.desc}</div>
    `;
    row.appendChild(main);

    if(item.type === 'arrow'){
      const arrow = document.createElement('div');
      arrow.className = 'cs2-arrow';
      arrow.textContent = '›';
      row.appendChild(arrow);

      row.addEventListener('click', function(){
        window.dispatchEvent(new CustomEvent('cs:open-sub', {
          detail: { id:item.id }
        }));
      });
    }else if(item.type === 'switch'){
      const sw = document.createElement('div');
      sw.className = 'cs2-switch' + (getBool(item.key,false) ? ' on' : '');
      row.appendChild(sw);

      row.addEventListener('click', function(){
        const next = !sw.classList.contains('on');
        sw.classList.toggle('on', next);
        setBool(item.key, next);
        window.dispatchEvent(new CustomEvent('cs:toggle', {
          detail: { id:item.id, key:item.key, value:next }
        }));
        toast(item.label + (next ? ' 已开启' : ' 已关闭'));
      });
    }

    return row;
  }

  function buildPage(){
    let old = document.getElementById(PAGE_ID);
    if(old) old.remove();

    const page = document.createElement('div');
    page.id = PAGE_ID;

    const top = document.createElement('div');
    top.className = 'cs2-topbar';
    top.innerHTML = `
      <div class="cs2-back" id="cs2-back">‹</div>
      <div class="cs2-title">聊天设置</div>
      <div class="cs2-right"></div>
    `;
    page.appendChild(top);

    const body = document.createElement('div');
    body.className = 'cs2-body';

    GROUPS.forEach(group => {
      const wrap = document.createElement('div');
      wrap.className = 'cs2-group';

      const title = document.createElement('div');
      title.className = 'cs2-group-title';
      title.textContent = group.title;
      wrap.appendChild(title);

      group.items.forEach(item => {
        wrap.appendChild(buildItem(item));
      });

      body.appendChild(wrap);
    });

    const note = document.createElement('div');
    note.className = 'cs2-foot-note';
    note.textContent = '先把入口做好，后面每一项我们再慢慢补进去';
    body.appendChild(note);

    page.appendChild(body);
    document.body.appendChild(page);

    page.querySelector('#cs2-back').addEventListener('click', closePage);
  }

  function openPage(){
    let page = document.getElementById(PAGE_ID);
    if(!page){
      buildPage();
      page = document.getElementById(PAGE_ID);
    }
    page.classList.add('open');
  }

  function closePage(){
    const page = document.getElementById(PAGE_ID);
    if(page) page.classList.remove('open');
  }

  function init(){
    ensureStyle();
    buildPage();

    window.openChatSettings = openPage;
    window.TQChatSettings = {
      open: openPage,
      close: closePage
    };
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  }else{
    init();
  }
})();
/* =========================
   [CS-02] 聊天设置 · 背景图子页面
========================= */
(function initChatSettingsBgPage(){
  if(window.__TQ_CS_BG_02__) return;
  window.__TQ_CS_BG_02__ = 1;

  const PAGE_ID = 'tq-chat-bg-page';
  const STYLE_ID = 'tq-chat-bg-style-02';
  const HOME_KEY = 'tq_chat_home_bg';
  const DETAIL_KEY_PREFIX = 'tq_chat_detail_bg_';

  function g(k,d){
    try{
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    }catch(e){ return d; }
  }
  function s(k,v){
    try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){}
  }
  function del(k){
    try{ localStorage.removeItem(k); }catch(e){}
  }
  function toast(msg){
    if(typeof showToast === 'function') showToast(msg);
  }

  function ensureStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
      #${PAGE_ID}{
        position:fixed;
        inset:0;
        z-index:9850;
        background:var(--bg-pri);
        display:none;
        flex-direction:column;
        overflow:hidden;
      }
      #${PAGE_ID}.open{
        display:flex;
      }
      body.dark-mode #${PAGE_ID}{
        background:#1a1a1a;
      }

      .csbg-topbar{
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding:calc(var(--safe-t,0px) + 8px) 16px 10px;
        flex-shrink:0;
        background:rgba(255,255,255,0.18);
        backdrop-filter:blur(14px);
        -webkit-backdrop-filter:blur(14px);
        border-bottom:1px solid rgba(255,255,255,0.3);
      }
      body.dark-mode .csbg-topbar{
        background:rgba(0,0,0,0.3);
        border-bottom-color:rgba(255,255,255,0.08);
      }

      .csbg-back,
      .csbg-right{
        width:32px;
        height:32px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:22px;
        color:var(--txt-sec);
        cursor:pointer;
        flex-shrink:0;
      }
      .csbg-back:active{transform:scale(.88);}
      body.dark-mode .csbg-back,
      body.dark-mode .csbg-right{
        color:#999;
      }

      .csbg-title{
        flex:1;
        text-align:center;
        font-size:15px;
        letter-spacing:2px;
        color:var(--txt-pri);
        font-weight:400;
      }
      body.dark-mode .csbg-title{
        color:#e0e0e0;
      }

      .csbg-body{
        flex:1;
        overflow-y:auto;
        -webkit-overflow-scrolling:touch;
        padding:14px 16px 30px;
      }

      .csbg-card{
        margin-bottom:16px;
        border-radius:18px;
        overflow:hidden;
        background:rgba(255,255,255,0.58);
        backdrop-filter:blur(20px);
        -webkit-backdrop-filter:blur(20px);
        border:1px solid rgba(255,255,255,0.6);
        box-shadow:0 4px 18px rgba(0,0,0,0.04);
        padding:14px;
      }
      body.dark-mode .csbg-card{
        background:rgba(40,40,40,0.72);
        border-color:rgba(80,80,80,0.35);
      }

      .csbg-label{
        font-size:13px;
        color:var(--txt-pri);
        letter-spacing:1px;
        margin-bottom:10px;
      }
      body.dark-mode .csbg-label{
        color:#e0e0e0;
      }

      .csbg-desc{
        font-size:11px;
        color:var(--txt-sec);
        line-height:1.6;
        margin-top:8px;
      }
      body.dark-mode .csbg-desc{
        color:#777;
      }

      .csbg-preview{
        width:100%;
        height:160px;
        border-radius:14px;
        overflow:hidden;
        border:1px solid var(--glass-border);
        background:var(--bg-sec);
        display:flex;
        align-items:center;
        justify-content:center;
        margin-bottom:10px;
      }
      .csbg-preview img{
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;
      }
      .csbg-preview-text{
        font-size:11px;
        color:var(--txt-light);
        letter-spacing:1px;
      }
      body.dark-mode .csbg-preview{
        background:#2a2a2a;
        border-color:rgba(80,80,80,0.35);
      }
      body.dark-mode .csbg-preview-text{
        color:#666;
      }

      .csbg-btn-row{
        display:flex;
        gap:8px;
        flex-wrap:wrap;
      }

      .csbg-btn{
        padding:9px 14px;
        border-radius:12px;
        font-size:12px;
        letter-spacing:1px;
        cursor:pointer;
        border:none;
      }
      .csbg-btn:active{
        transform:scale(.96);
      }
      .csbg-btn.pri{
        background:var(--morandi-blue);
        color:#fff;
      }
      .csbg-btn.sec{
        background:var(--bg-sec);
        color:var(--txt-sec);
        border:1px solid var(--glass-border);
      }
            #upload-modal.show{
        z-index:99999 !important;
      }

      body.dark-mode .csbg-btn.sec{
        background:#2a2a2a;
        color:#999;
        border-color:rgba(80,80,80,0.35);
      }
    `;
    document.head.appendChild(st);
  }

  function getCurrentChatId(){
    return window._cdChatId || null;
  }

  function getDetailKey(){
    const cid = getCurrentChatId();
    return cid ? (DETAIL_KEY_PREFIX + cid) : null;
  }

  function applyChatHomeBg(){
    const app = document.querySelector('#app-chat');
    if(!app) return;
    const src = g(HOME_KEY, null);
    if(src){
      app.style.setProperty('--chat-home-bg', 'url("' + String(src).replace(/"/g,'%22') + '")');
      app.classList.add('has-chat-home-bg');
    }else{
      app.style.setProperty('--chat-home-bg', 'none');
      app.classList.remove('has-chat-home-bg');
    }
  }

  function applyChatDetailBg(cid){
    const page = document.querySelector('#chat-detail');
    if(!page || !cid) return;
    const detail = g(DETAIL_KEY_PREFIX + cid, null);
    const home = g(HOME_KEY, null);
    const src = detail || home || null;
    if(src){
      page.style.setProperty('--chat-detail-bg', 'url("' + String(src).replace(/"/g,'%22') + '")');
      page.classList.add('has-chat-detail-bg');
    }else{
      page.style.setProperty('--chat-detail-bg', 'none');
      page.classList.remove('has-chat-detail-bg');
    }
  }

  function renderPreview(el, src){
    if(!el) return;
    if(src){
      el.innerHTML = '<img src="' + src + '" alt="">';
    }else{
      el.innerHTML = '<div class="csbg-preview-text">暂未设置</div>';
    }
  }

  function refreshPage(){
    const homeSrc = g(HOME_KEY, null);
    const detailKey = getDetailKey();
    const detailSrc = detailKey ? g(detailKey, null) : null;

    renderPreview(document.getElementById('csbg-home-preview'), homeSrc);
    renderPreview(document.getElementById('csbg-detail-preview'), detailSrc);

    const note = document.getElementById('csbg-detail-note');
    if(note){
      if(getCurrentChatId()){
        note.textContent = '当前单聊壁纸优先于聊天主页壁纸';
      }else{
        note.textContent = '请先进入一个单聊，再设置当前单聊壁纸';
      }
    }
  }

  function buildPage(){
    let old = document.getElementById(PAGE_ID);
    if(old) old.remove();

    const page = document.createElement('div');
    page.id = PAGE_ID;
    page.innerHTML = `
      <div class="csbg-topbar">
        <div class="csbg-back" id="csbg-back">‹</div>
        <div class="csbg-title">背景图</div>
        <div class="csbg-right"></div>
      </div>
      <div class="csbg-body">
        <div class="csbg-card">
          <div class="csbg-label">聊天主页壁纸</div>
          <div class="csbg-preview" id="csbg-home-preview"></div>
          <div class="csbg-btn-row">
            <button class="csbg-btn sec" id="csbg-home-pick">选择图片</button>
            <button class="csbg-btn sec" id="csbg-home-clear">清除</button>
          </div>
          <div class="csbg-desc">作用范围：聊天列表主页。若单聊没有单独设置壁纸，则会沿用这里的背景。</div>
        </div>

        <div class="csbg-card">
          <div class="csbg-label">当前单聊壁纸</div>
          <div class="csbg-preview" id="csbg-detail-preview"></div>
          <div class="csbg-btn-row">
            <button class="csbg-btn sec" id="csbg-detail-pick">选择图片</button>
            <button class="csbg-btn sec" id="csbg-detail-clear">清除</button>
          </div>
          <div class="csbg-desc" id="csbg-detail-note">当前单聊壁纸优先于聊天主页壁纸</div>
        </div>

        <div class="csbg-desc" style="text-align:center;padding:4px 4px 0;">
          优先级：单聊壁纸 ＞ 聊天主页壁纸
        </div>
      </div>
    `;
    document.body.appendChild(page);

    page.querySelector('#csbg-back').addEventListener('click', closePage);

    page.querySelector('#csbg-home-pick').addEventListener('click', function(){
      if(typeof openUploadModal !== 'function'){
        toast('上传模块未就绪');
        return;
      }
      openUploadModal('chat_home_bg', function(k, src){
        s(HOME_KEY, src);
        applyChatHomeBg();
        if(getCurrentChatId()) applyChatDetailBg(getCurrentChatId());
        refreshPage();
        toast('聊天主页壁纸已设置');
      });
    });

    page.querySelector('#csbg-home-clear').addEventListener('click', function(){
      del(HOME_KEY);
      applyChatHomeBg();
      if(getCurrentChatId()) applyChatDetailBg(getCurrentChatId());
      refreshPage();
      toast('聊天主页壁纸已清除');
    });

    page.querySelector('#csbg-detail-pick').addEventListener('click', function(){
      const cid = getCurrentChatId();
      if(!cid){
        toast('请先进入一个单聊');
        return;
      }
      if(typeof openUploadModal !== 'function'){
        toast('上传模块未就绪');
        return;
      }
      openUploadModal('chat_detail_bg_' + cid, function(k, src){
        s(DETAIL_KEY_PREFIX + cid, src);
        applyChatDetailBg(cid);
        refreshPage();
        toast('当前单聊壁纸已设置');
      });
    });

    page.querySelector('#csbg-detail-clear').addEventListener('click', function(){
      const cid = getCurrentChatId();
      if(!cid){
        toast('请先进入一个单聊');
        return;
      }
      del(DETAIL_KEY_PREFIX + cid);
      applyChatDetailBg(cid);
      refreshPage();
      toast('当前单聊壁纸已清除');
    });

    refreshPage();
  }

  function openPage(){
    let page = document.getElementById(PAGE_ID);
    if(!page){
      buildPage();
      page = document.getElementById(PAGE_ID);
    }
    refreshPage();
    page.classList.add('open');
  }

  function closePage(){
    const page = document.getElementById(PAGE_ID);
    if(page) page.classList.remove('open');
  }

  function bindOpenEvent(){
    window.addEventListener('cs:open-sub', function(e){
      if(!e.detail || e.detail.id !== 'bg') return;
      openPage();
    });
  }

  function init(){
    ensureStyle();
    buildPage();
    bindOpenEvent();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  }else{
    init();
  }

  window.TQChatBgSettings = {
    open: openPage,
    close: closePage,
    refresh: refreshPage
  };
})();
