(function(){
  var $=function(s){return document.querySelector(s)};
  var img=function(p){return encodeURI(p)};
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
  var short=function(d){return d.replace(/^2026년 /,'')};

  document.querySelectorAll('.themeBtn').forEach(function(b){b.addEventListener('click',function(){var l=document.body.classList.toggle('light');try{localStorage.setItem('wdpaTheme',l?'light':'dark')}catch(e){}})});

  (function intro(){
    var o=$('#introOverlay'),v=$('#introVideo');if(!o||!v)return;
    var seen=false;try{seen=sessionStorage.getItem('wdpaIntro')==='1'}catch(e){}
    if(seen)return;o.hidden=false;
    function hide(){try{sessionStorage.setItem('wdpaIntro','1')}catch(e){}o.classList.add('intro-hide');setTimeout(function(){o.style.display='none'},550)}
    o.addEventListener('click',hide);v.addEventListener('ended',hide);v.addEventListener('error',hide);
    var pr=v.play();if(pr&&pr.catch)pr.catch(hide);setTimeout(hide,12000);
  })();

  fetch('data.json').then(function(r){return r.json()}).then(function(D){
    var arts=D.articles.slice().sort(function(a,b){return b.id-a.id});
    if($('#article')) return renderArticle(arts);
    renderHome(D,arts);
  }).catch(function(){var m=$('main');if(m)m.innerHTML='<p style="padding:60px 0;color:#98989f">데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});

  function row(a){
    var r=el('a','row');r.href='article.html?id='+a.id;
    r.innerHTML='<div class="thumb"><img loading="lazy" alt="" src="'+img(a.cover)+'"></div><div class="tx"><b>'+esc(a.headline)+'</b><small>'+esc(a.tag)+' · '+esc(short(a.date))+'</small></div>';
    return r;
  }

  function renderHome(D,arts){
    var days=['내일 출근이 걸리지만, 한잔은 가능합니다','월요일부터 가능하세요?','화요일, 의외로 괜찮은 날입니다','수요일, 한 주의 딱 절반입니다','목요일, 사실상 금요일입니다','내일은 없습니다','오늘은 취해도 되는 날입니다'];
    $('#today').textContent=days[new Date().getDay()];

    arts.slice(0,6).forEach(function(a){
      var c=el('a','feat');c.href='article.html?id='+a.id;
      c.innerHTML='<span class="tag">'+esc(a.tag)+'</span><div class="ph"><img alt="" src="'+img(a.cover)+'"></div><b>'+esc(a.headline)+'</b><small>'+esc(short(a.date))+'</small>';
      $('#featRail').appendChild(c);
    });
    D.members.forEach(function(m){
      var c=el('a','avatar');c.href='#members';
      c.innerHTML='<div class="ph"><img loading="lazy" alt="" src="'+img(m.card)+'"></div><b>'+esc(m.name)+'</b><small>'+esc(m.role)+'</small>';
      $('#avRail').appendChild(c);
    });
    D.rules.slice(0,3).forEach(function(r){$('#homeRules').appendChild(el('div','plain','<span class="no">'+esc(r.tag)+'</span><span class="t">'+esc(r.text)+'</span>'))});

    var qs=[];arts.forEach(function(a){a.body.forEach(function(t){(t.replace(/<[^>]+>/g,'').match(/[“][^”]{16,70}[”]/g)||[]).forEach(function(q){qs.push({q:q,id:a.id,t:a.headline})})})});
    if(qs.length){var r=qs[Math.floor(Math.random()*qs.length)],qe=$('#quote');qe.href='article.html?id='+r.id;qe.hidden=false;qe.innerHTML='<b>'+esc(r.q)+'</b><small>'+esc(r.t)+'</small>'}

    var rows=$('#rows');
    function draw(f){rows.innerHTML='';arts.filter(function(a){return !f||(a.headline+a.tag).indexOf(f)>-1}).forEach(function(a){rows.appendChild(row(a))});if(!rows.firstChild)rows.innerHTML='<p style="padding:30px 0;color:var(--muted)">일치하는 기사가 없습니다.</p>'}
    draw('');$('#q').addEventListener('input',function(e){draw(e.target.value.trim())});

    var list=function(id,arr){var box=$(id);arr.forEach(function(r){box.appendChild(el('div','plain','<span class="no">'+esc(r.tag)+'</span><span class="t">'+esc(r.text)+'</span>'))})};
    list('#rules',D.rules);list('#talent',D.talent);
    D.history.forEach(function(h){$('#history').appendChild(el('div','tl','<b>'+esc(h.year)+'</b><ul>'+h.items.map(function(i){return '<li>'+esc(i)+'</li>'}).join('')+'</ul>'))});
    D.members.forEach(function(m){$('#members').appendChild(el('div','member','<img loading="lazy" alt="'+esc(m.name)+' 협회 인증카드" src="'+img(m.card)+'"><div class="nm"><b>'+esc(m.name)+'</b><span>'+esc(m.role)+'</span></div><p>'+esc(m.desc)+'</p>'))});
    var z=$('#zoom');
    document.querySelectorAll('.member img').forEach(function(im){im.addEventListener('click',function(){z.querySelector('img').src=im.src;z.classList.add('on')})});
    z.addEventListener('click',function(){z.classList.remove('on')});

    var top=arts[0],mini=$('#mini');
    mini.href='article.html?id='+top.id;mini.hidden=false;
    mini.innerHTML='<div class="thumb"><img alt="" src="'+img(top.cover)+'"></div><div class="tx"><b>'+esc(top.headline)+'</b><small>최신 기사</small></div><svg viewBox="0 0 24 24"><path d="M6 5l9 7-9 7z"/><rect x="17" y="5" width="2.4" height="14" rx="1"/></svg>';

    function tab(){
      var t=(location.hash||'#home').slice(1);
      if(!document.getElementById('v-'+t))t='home';
      document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('on',v.id==='v-'+t)});
      document.querySelectorAll('.tabbar a').forEach(function(a){a.classList.toggle('on',a.dataset.tab===t)});
      window.scrollTo(0,0);
    }
    window.addEventListener('hashchange',tab);tab();
  }

  function renderArticle(arts){
    var id=parseInt(new URLSearchParams(location.search).get('id'),10);
    var i=arts.findIndex(function(a){return a.id===id});if(i<0)i=0;
    var a=arts[i],newer=arts[i-1],older=arts[i+1];
    document.title=a.headline+' | 매주술권장협회';
    var cap=a.caption?'<p class="a-cap">'+esc(a.caption)+'</p>':'';
    var body=a.body.map(function(p){return '<p>'+p.replace(/\n/g,'<br>')+'</p>'}).join('');
    var nav='<div class="pn">'+(older?'<a href="article.html?id='+older.id+'">이전 기사<b>'+esc(older.headline)+'</b></a>':'<span style="flex:1"></span>')+(newer?'<a class="next" href="article.html?id='+newer.id+'">다음 기사<b>'+esc(newer.headline)+'</b></a>':'<span style="flex:1"></span>')+'</div>';
    $('#article').innerHTML='<div class="a-cover"><img alt="" src="'+img(a.cover)+'"></div><span class="a-tag">'+esc(a.tag)+'</span><h1 class="a-title">'+esc(a.headline)+'</h1><p class="a-date">입력 '+esc(a.date)+'</p>'+cap+'<div class="a-body">'+body+'</div>'+nav;
    window.scrollTo(0,0);
  }
})();
