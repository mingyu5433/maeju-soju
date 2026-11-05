(function(){
  var themeBtn=document.getElementById('themeBtn');
  function setLabel(){if(themeBtn)themeBtn.textContent=document.body.classList.contains('light')?'심야모드':'주간모드'}
  if(themeBtn){setLabel();themeBtn.addEventListener('click',function(){var l=document.body.classList.toggle('light');try{localStorage.setItem('wdpaTheme',l?'light':'dark')}catch(e){}setLabel()})}
  (function intro(){
    var o=document.getElementById('introOverlay'),v=document.getElementById('introVideo');
    if(!o||!v)return;
    var seen=false;try{seen=sessionStorage.getItem('wdpaIntro')==='1'}catch(e){}
    if(seen)return;
    o.hidden=false;
    function hide(){try{sessionStorage.setItem('wdpaIntro','1')}catch(e){}o.classList.add('intro-hide');setTimeout(function(){o.style.display='none'},550)}
    o.addEventListener('click',hide);v.addEventListener('ended',hide);v.addEventListener('error',hide);
    var pr=v.play();if(pr&&pr.catch)pr.catch(hide);
    setTimeout(hide,12000);
  })();
  var $=function(s){return document.querySelector(s)};
  var img=function(p){return encodeURI(p)};
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}

  fetch('data.json').then(function(r){return r.json()}).then(function(D){
    var arts=D.articles.slice().sort(function(a,b){return b.id-a.id});
    if($('#article')) return renderArticle(D,arts);
    renderHome(D,arts);
  }).catch(function(){
    var m=$('main');if(m)m.innerHTML='<p class="muted" style="padding:40px 0">데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>';
  });

  function card(a){
    var c=el('a','card');c.href='article.html?id='+a.id;
    c.innerHTML='<div class="ph"><img loading="lazy" alt="" src="'+img(a.cover)+'"></div><div class="t">'+esc(a.headline)+'</div><div class="m">'+esc(a.tag)+' · '+esc(a.date.replace(/^2026년 /,''))+'</div>';
    return c;
  }

  function renderHome(D,arts){
    var top=arts[0],h=$('#hero');
    h.href='article.html?id='+top.id;
    h.innerHTML='<img alt="" src="'+img(top.cover)+'"><div class="cap"><span class="eyebrow">NEW · '+esc(top.tag)+'</span><b>'+esc(top.headline)+'</b></div>';
    var g=$('#grid');arts.slice(1).forEach(function(a){g.appendChild(card(a))});
    var qs=[];arts.forEach(function(a){a.body.forEach(function(t){(t.replace(/<[^>]+>/g,'').match(/[“][^”]{16,70}[”]/g)||[]).forEach(function(q){qs.push({q:q,id:a.id,t:a.headline})})})});
    if(qs.length){var r=qs[Math.floor(Math.random()*qs.length)],qe=$('#quote');qe.href='article.html?id='+r.id;qe.hidden=false;qe.innerHTML='<span class="eyebrow">오늘의 한 줄</span><b>'+esc(r.q)+'</b><small>'+esc(r.t)+' ›</small>'}
    $('#count').textContent='총 '+arts.length+'건';
    $('#issue').textContent='VOL.'+arts.length;

    var list=function(id,arr){var box=$(id);arr.forEach(function(r){box.appendChild(el('div','it','<span class="no">'+esc(r.tag)+'</span><span class="tx">'+esc(r.text)+'</span>'))})};
    list('#rules',D.rules);list('#talent',D.talent);
    D.history.forEach(function(h){$('#history').appendChild(el('div','tl','<b>'+esc(h.year)+'</b><ul>'+h.items.map(function(i){return '<li>'+esc(i)+'</li>'}).join('')+'</ul>'))});
    D.members.forEach(function(m){
      $('#members').appendChild(el('div','member','<img loading="lazy" alt="'+esc(m.name)+' 협회 인증카드" src="'+img(m.card)+'"><div class="nm"><b>'+esc(m.name)+'</b><span>'+esc(m.role)+'</span></div><p>'+esc(m.desc)+'</p>'));
    });

    var days=['내일 출근이 걸리지만, 한잔은 가능합니다','월요일부터 가능하세요?','화요일, 의외로 괜찮은 날입니다','수요일, 한 주의 딱 절반입니다','목요일, 사실상 금요일입니다','내일은 없습니다','오늘은 취해도 되는 날입니다'];
    $('#today').textContent=days[new Date().getDay()];
    var years=D.history.map(function(h){return parseInt(h.year,10)}).filter(Boolean);
    $('#stats').innerHTML='<div><b>'+Math.min.apply(null,years)+'</b><span>비공식 창립</span></div><div><b>'+D.members.length+'</b><span>임원진</span></div><div><b>'+arts.length+'</b><span>보도자료</span></div>';
    var z=$('#zoom');
    document.querySelectorAll('.member img').forEach(function(im){im.addEventListener('click',function(){z.querySelector('img').src=im.src;z.classList.add('on')})});
    z.addEventListener('click',function(){z.classList.remove('on')});

    function tab(){
      var t=(location.hash||'#articles').slice(1);
      if(!document.getElementById('v-'+t))t='articles';
      document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('on',v.id==='v-'+t)});
      document.querySelectorAll('.tabbar a').forEach(function(a){a.classList.toggle('on',a.dataset.tab===t)});
      window.scrollTo(0,0);
    }
    window.addEventListener('hashchange',tab);tab();
  }

  function renderArticle(D,arts){
    var id=parseInt(new URLSearchParams(location.search).get('id'),10);
    var i=arts.findIndex(function(a){return a.id===id});
    if(i<0){i=0}
    var a=arts[i],newer=arts[i-1],older=arts[i+1];
    document.title=a.headline+' | 매주술권장협회';
    var cap=a.caption?'<p class="a-cap">'+esc(a.caption)+'</p>':'';
    var body=a.body.map(function(p){return '<p>'+p.replace(/\n/g,'<br>')+'</p>'}).join('');
    var nav='<div class="pn">'+
      (older?'<a href="article.html?id='+older.id+'">‹ 이전 기사<b>'+esc(older.headline)+'</b></a>':'<span style="flex:1"></span>')+
      (newer?'<a class="next" href="article.html?id='+newer.id+'">다음 기사 ›<b>'+esc(newer.headline)+'</b></a>':'<span style="flex:1"></span>')+'</div>';
    $('#article').innerHTML=
      '<div class="a-cover"><img alt="" src="'+img(a.cover)+'"></div>'+
      '<span class="a-tag">'+esc(a.tag)+'</span>'+
      '<h1 class="a-title">'+esc(a.headline)+'</h1>'+
      '<p class="a-date">입력 '+esc(a.date)+'</p>'+cap+
      '<div class="a-body">'+body+'</div>'+nav;
    window.scrollTo(0,0);
  }
})();
