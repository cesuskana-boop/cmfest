(function(){
  var s=document.querySelector('.tier-slider'); if(!s) return;
  var t=s.querySelector('.tt'), cards=t.children, dots=s.querySelectorAll('.tdots button');
  function idx(){var w=cards[0].offsetWidth+parseFloat(getComputedStyle(t).columnGap||0);return Math.max(0,Math.min(cards.length-1,Math.round(t.scrollLeft/w)));}
  function go(i){i=Math.max(0,Math.min(cards.length-1,i));t.scrollTo({left:cards[i].offsetLeft-cards[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
  function sync(){var i=idx();dots.forEach(function(d,n){d.setAttribute('aria-current',n===i?'true':'false')});s.querySelector('.tprev').disabled=i===0;s.querySelector('.tnext').disabled=i===cards.length-1;}
  t.addEventListener('scroll',function(){requestAnimationFrame(sync)},{passive:true});
  s.querySelector('.tprev').addEventListener('click',function(){go(idx()-1)});
  s.querySelector('.tnext').addEventListener('click',function(){go(idx()+1)});
  dots.forEach(function(d,n){d.addEventListener('click',function(){go(n)})});
  t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(idx()+1);e.preventDefault()}if(e.key==='ArrowLeft'){go(idx()-1);e.preventDefault()}});
  sync();
})();
