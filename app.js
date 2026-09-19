const PRODUCTS = [
  {id:'vv01', name:'Satin Blue Overshirt', category:'Casual', gender:'Men', type:'Shirts', price:6490, oldPrice:7990, sizes:['S','M','L','XL'], colors:['Blue','White'], image:'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1000&q=85', rating:4.8, badge:'New'},
  {id:'vv02', name:'Ivory Tailored Blazer', category:'Formal', gender:'Women', type:'Jackets', price:12990, oldPrice:14990, sizes:['S','M','L'], colors:['Ivory','Black'], image:'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1000&q=85', rating:4.9, badge:'Best Seller'},
  {id:'vv03', name:'Soft Grey Essential Tee', category:'Casual', gender:'Unisex', type:'T-Shirts', price:3290, oldPrice:0, sizes:['S','M','L','XL'], colors:['Grey','White','Black'], image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85', rating:4.7, badge:''},
  {id:'vv04', name:'Midnight Pleated Trousers', category:'Formal', gender:'Men', type:'Trousers', price:8990, oldPrice:9990, sizes:['30','32','34','36'], colors:['Black','Navy'], image:'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1000&q=85', rating:4.8, badge:'Trending'},
  {id:'vv05', name:'Skyline Knit Co-ord', category:'Casual', gender:'Women', type:'Co-ords', price:7490, oldPrice:0, sizes:['S','M','L'], colors:['Blue','Cream'], image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85', rating:4.6, badge:'New'},
  {id:'vv06', name:'Minimal Leather Tote', category:'Accessories', gender:'Women', type:'Bags', price:5990, oldPrice:6990, sizes:['One Size'], colors:['Tan','Black'], image:'https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=1000&q=85', rating:4.9, badge:''},
  {id:'vv07', name:'Cloud White Oxford', category:'Formal', gender:'Men', type:'Shirts', price:5890, oldPrice:0, sizes:['S','M','L','XL'], colors:['White'], image:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=85', rating:4.8, badge:''},
  {id:'vv08', name:'Rose Gold Mini Bag', category:'Accessories', gender:'Women', type:'Bags', price:4890, oldPrice:5490, sizes:['One Size'], colors:['Rose Gold'], image:'https://images.unsplash.com/photo-1523476843875-43c2cb89aa85?auto=format&fit=crop&w=1000&q=85', rating:4.7, badge:'Limited'},
];

const money = value => new Intl.NumberFormat('en-LK', {style:'currency', currency:'LKR', maximumFractionDigits:0}).format(value);
const getCart = () => JSON.parse(localStorage.getItem('vv_cart') || '[]');
const saveCart = cart => { localStorage.setItem('vv_cart', JSON.stringify(cart)); updateCartBadge(); };
const getUsers = () => JSON.parse(localStorage.getItem('vv_users') || '[]');
const pageName = () => location.pathname.split('/').pop() || 'index.html';
const allProducts = () => [...PRODUCTS, ...JSON.parse(localStorage.getItem('vv_extra_products') || '[]')];

function updateCartBadge(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count);
}

function showToast(message){
  let t=document.querySelector('.toast');
  if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent=message; t.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove('show'),2200);
}

function productCard(p){
  return `<article class="card product-card">
    <div class="product-image"><a href="product-details.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>${p.badge?`<span class="tag">${p.badge}</span>`:''}<button class="wishlist" type="button" aria-label="Add to wishlist">♡</button></div>
    <div class="card-body"><div class="meta">${p.category} · ${p.gender}</div><a class="card-title" href="product-details.html?id=${p.id}">${p.name}</a><div class="stars">★★★★★ <span class="small">${p.rating}</span></div><div class="price-row"><div class="price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><button class="btn btn-secondary" data-add="${p.id}" type="button">Add</button></div></div>
  </article>`;
}

function renderProducts(target, list){ target.innerHTML=list.map(productCard).join(''); bindAddButtons(target); }
function bindAddButtons(root=document){
  root.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{
    const p=PRODUCTS.find(x=>x.id===btn.dataset.add); if(!p)return;
    const cart=getCart(); const existing=cart.find(i=>i.id===p.id);
    if(existing) existing.qty+=1; else cart.push({id:p.id, qty:1, size:p.sizes[0], color:p.colors[0]});
    saveCart(cart); showToast(`${p.name} added to cart`);
  }));
}

function initHome(){
  const target=document.querySelector('#featured-products'); if(target) renderProducts(target, PRODUCTS.slice(0,4));
  const trend=document.querySelector('#trending-products'); if(trend) renderProducts(trend, PRODUCTS.slice(4,8));
}

function initProducts(){
  const target=document.querySelector('#product-list'); if(!target) return;
  const gender=document.querySelector('#filter-gender'), type=document.querySelector('#filter-type'), price=document.querySelector('#filter-price'), search=document.querySelector('#product-search'), sort=document.querySelector('#sort-products');
  const update=()=>{
    let list=allProducts(); const s=(search?.value||'').trim().toLowerCase();
    if(s) list=list.filter(p=>(p.name+' '+p.category+' '+p.type).toLowerCase().includes(s));
    if(gender.value!=='All') list=list.filter(p=>p.gender===gender.value);
    if(type.value!=='All') list=list.filter(p=>p.type===type.value);
    if(price.value==='under5000') list=list.filter(p=>p.price<5000); if(price.value==='5000-9000') list=list.filter(p=>p.price>=5000&&p.price<=9000); if(price.value==='9000plus') list=list.filter(p=>p.price>9000);
    if(sort.value==='low') list.sort((a,b)=>a.price-b.price); if(sort.value==='high') list.sort((a,b)=>b.price-a.price); if(sort.value==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
    renderProducts(target,list); document.querySelector('#result-count').textContent=`${list.length} product${list.length===1?'':'s'}`;
  };
  [gender,type,price,search,sort].forEach(el=>el && el.addEventListener(el===search?'input':'change',update)); update();
}

function initDetails(){
  const params=new URLSearchParams(location.search); const p=PRODUCTS.find(x=>x.id===params.get('id')) || PRODUCTS[0];
  const wrap=document.querySelector('#product-detail'); if(!wrap)return;
  wrap.innerHTML=`<div class="detail-grid"><div class="detail-media"><img src="${p.image}" alt="${p.name}"></div><div class="detail-copy"><div class="eyebrow">${p.category} Collection</div><h1>${p.name}</h1><div class="stars">★★★★★ <span class="small">${p.rating} / 5</span></div><div class="detail-price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><p class="small">Designed for effortless styling with a clean, modern finish. Explore available sizes and colors before adding it to your cart.</p><div class="divider"></div><strong>Size</strong><div class="option-row" id="size-options">${p.sizes.map((x,i)=>`<button class="option-btn ${i===0?'active':''}" data-size="${x}">${x}</button>`).join('')}</div><strong>Color</strong><div class="option-row" id="color-options">${p.colors.map((x,i)=>`<button class="option-btn ${i===0?'active':''}" data-color="${x}">${x}</button>`).join('')}</div><div class="inline"><div class="qty"><button type="button" id="minus">−</button><input id="qty" value="1" inputmode="numeric"><button type="button" id="plus">+</button></div><button class="btn btn-primary" id="detail-add">Add to Cart</button></div><div class="notice" style="margin-top:16px">Free delivery on orders over ${money(15000)} · Easy exchanges within 7 days</div></div></div>`;
  let chosenSize=p.sizes[0], chosenColor=p.colors[0];
  document.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{chosenSize=b.dataset.size;document.querySelectorAll('[data-size]').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
  document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{chosenColor=b.dataset.color;document.querySelectorAll('[data-color]').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
  const qtyInput=document.querySelector('#qty'); document.querySelector('#minus').onclick=()=>qtyInput.value=Math.max(1,Number(qtyInput.value||1)-1); document.querySelector('#plus').onclick=()=>qtyInput.value=Number(qtyInput.value||1)+1;
  document.querySelector('#detail-add').onclick=()=>{ const qty=Math.max(1,Number(qtyInput.value)||1); const cart=getCart(); const existing=cart.find(i=>i.id===p.id&&i.size===chosenSize&&i.color===chosenColor); if(existing) existing.qty+=qty; else cart.push({id:p.id,qty,size:chosenSize,color:chosenColor}); saveCart(cart); showToast('Product added to cart'); };
}

function initCart(){
  const wrap=document.querySelector('#cart-items'); if(!wrap)return; const cart=getCart();
  if(!cart.length){ wrap.innerHTML=`<div class="empty"><h3>Your cart is empty</h3><p>Discover something new from Velvet Vogue.</p><a href="products.html" class="btn btn-primary">Shop now</a></div>`; updateSummary(0); return; }
  wrap.innerHTML=cart.map((item,index)=>{ const p=allProducts().find(x=>x.id===item.id); return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div class="item-info"><h4>${p.name}</h4><p>${item.size} · ${item.color}</p><div class="inline" style="margin-top:8px"><div class="qty"><button data-dec="${index}">−</button><input value="${item.qty}" data-qty="${index}"><button data-inc="${index}">+</button></div><button class="btn btn-danger" data-remove="${index}" type="button">Remove</button></div></div><div class="price"><div>${money(p.price*item.qty)}</div><span class="small">${money(p.price)} each</span></div></div>`; }).join('');
  wrap.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const c=getCart();c.splice(Number(b.dataset.remove),1);saveCart(c);initCart();});
  wrap.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{const c=getCart();c[Number(b.dataset.inc)].qty++;saveCart(c);initCart();});
  wrap.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{const c=getCart(),i=Number(b.dataset.dec);c[i].qty--;if(c[i].qty<=0)c.splice(i,1);saveCart(c);initCart();});
  wrap.querySelectorAll('[data-qty]').forEach(inp=>inp.onchange=()=>{const c=getCart(),i=Number(inp.dataset.qty);c[i].qty=Math.max(1,Number(inp.value)||1);saveCart(c);initCart();});
  const subtotal=cart.reduce((s,item)=>s+(allProducts().find(p=>p.id===item.id)?.price||0)*item.qty,0); updateSummary(subtotal);
}
function updateSummary(subtotal){ const shipping=subtotal===0?0:(subtotal>=15000?0:750); const total=subtotal+shipping; const s=document.querySelector('#summary'); if(s)s.innerHTML=`<div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-row"><span>Delivery</span><strong>${shipping?money(shipping):'Free'}</strong></div><div class="summary-row total"><span>Total</span><strong>${money(total)}</strong></div>`; }

function initCheckout(){
  const wrap=document.querySelector('#checkout-form'); if(!wrap)return; const cart=getCart(); if(!cart.length){ wrap.innerHTML=`<div class="empty"><h3>No items to checkout</h3><p>Add a product to your cart first.</p><a href="products.html" class="btn btn-primary">Browse products</a></div>`; return; }
  const subtotal=cart.reduce((s,item)=>s+(allProducts().find(p=>p.id===item.id)?.price||0)*item.qty,0); const shipping=subtotal>=15000?0:750; const total=subtotal+shipping; document.querySelector('#checkout-total').textContent=money(total);
  wrap.addEventListener('submit',e=>{e.preventDefault(); const form=new FormData(wrap); const order='VV'+Math.floor(100000+Math.random()*900000); localStorage.setItem('vv_last_order',JSON.stringify({order,total,customer:form.get('name')||'Customer'})); localStorage.removeItem('vv_cart'); location.href=`success.html?order=${order}`;});
}

function initSuccess(){ const p=new URLSearchParams(location.search); const order=p.get('order')||JSON.parse(localStorage.getItem('vv_last_order')||'{}').order||'VV------'; const el=document.querySelector('#order-number'); if(el)el.textContent=order; }
function initRegister(){ const f=document.querySelector('#register-form'); if(!f)return; f.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(f);const users=getUsers(); if(fd.get('password')!==fd.get('confirm')){showToast('Passwords do not match');return;} if(users.some(u=>u.email===fd.get('email'))){showToast('An account already exists with this email');return;} users.push({name:fd.get('name'),email:fd.get('email'),password:fd.get('password')});localStorage.setItem('vv_users',JSON.stringify(users));showToast('Registration successful');setTimeout(()=>location.href='login.html',700);}); }
function initLogin(){ const f=document.querySelector('#login-form'); if(!f)return; f.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(f);const users=getUsers(); const user=users.find(u=>u.email===fd.get('email')&&u.password===fd.get('password')); if(!user){showToast('Invalid email or password');return;} localStorage.setItem('vv_current_user',JSON.stringify({name:user.name,email:user.email})); showToast(`Welcome back, ${user.name.split(' ')[0]}`); setTimeout(()=>location.href='index.html',700);}); }
function initContact(){ const f=document.querySelector('#contact-form'); if(!f)return; f.addEventListener('submit',e=>{e.preventDefault();showToast('Thank you — your inquiry has been sent');f.reset();}); }

function initAdmin(){
  const form=document.querySelector('#admin-form'); const table=document.querySelector('#admin-table-body'); if(!form||!table)return;
  const load=()=>{ const extra=JSON.parse(localStorage.getItem('vv_extra_products')||'[]'); const all=[...PRODUCTS,...extra]; table.innerHTML=all.map(p=>`<tr><td><strong>${p.name}</strong><div class="small">${p.id}</div></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.sizes.join(', ')}</td><td><button class="btn btn-danger" data-admin-remove="${p.id}">Remove</button></td></tr>`).join(''); table.querySelectorAll('[data-admin-remove]').forEach(b=>b.onclick=()=>{const id=b.dataset.adminRemove;const extra=JSON.parse(localStorage.getItem('vv_extra_products')||'[]').filter(p=>p.id!==id);localStorage.setItem('vv_extra_products',JSON.stringify(extra));showToast('Demo product removed');load();}); };
  form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form); const extra=JSON.parse(localStorage.getItem('vv_extra_products')||'[]'); const id='vv'+Date.now(); extra.push({id,name:fd.get('name'),category:fd.get('category'),gender:fd.get('gender'),type:fd.get('type'),price:Number(fd.get('price')),oldPrice:0,sizes:(fd.get('sizes')||'S,M,L').split(',').map(x=>x.trim()),colors:(fd.get('colors')||'Blue').split(',').map(x=>x.trim()),image:'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=85',rating:5,badge:'New'}); localStorage.setItem('vv_extra_products',JSON.stringify(extra));form.reset();showToast('Demo product added');load();}); load();
}

function initNav(){ const menu=document.querySelector('#menu-btn'),links=document.querySelector('#nav-links'); if(menu&&links)menu.onclick=()=>links.classList.toggle('open'); updateCartBadge(); }

document.addEventListener('DOMContentLoaded',()=>{initNav();initHome();initProducts();initDetails();initCart();initCheckout();initSuccess();initRegister();initLogin();initContact();initAdmin();});
