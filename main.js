AOS.init({ once: true });
const SUPABASE_URL = "https://zkhradhpwakvtgsilsyj.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_UrUxPsPD3XBTANwwp3tZOA_-REppnf3";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let products = [], cart = [], currentCat = 'Todos';

window.addEventListener('load', () => {
    const bar = document.getElementById('loading-bar');
    const screen = document.getElementById('loading-screen');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => { screen.style.opacity = '0'; setTimeout(() => screen.remove(), 600); }, 400);
        }
    }, 150);
});

async function fetchProducts() {
    try {
        const { data } = await _supabase.from('produtos').select('*').order('id', { ascending: false });
        products = data || [];
        setupCategories();
        renderProducts(products);
    } catch (e) { console.error(e); }
}

function setupCategories() {
    const cats = [...new Set(products.map(p => p.categoria).filter(c => c))];
    document.getElementById('categories-list').innerHTML = cats.map(c => `<button onclick="filterByCategory('${c}')" class="px-2 py-1 text-sm rounded-sm border border-transparent hover:border-gray-300 whitespace-nowrap">${c}</button>`).join('');
}

function filterByCategory(cat) {
    currentCat = cat; 
    const filtered = cat === 'Todos' ? products : products.filter(p => p.categoria === cat);
    renderProducts(filtered);
}

function filtrarBusca(el) {
    const termo = el.value.toLowerCase();
    renderProducts(products.filter(p => p.nome.toLowerCase().includes(termo)));
}

function getProductHTML(p) {
    const precoNum = parseFloat(p.preco);
    const precoAntigoNum = p.preco_antigo ? parseFloat(p.preco_antigo) : 0;
    const temDesconto = precoAntigoNum > precoNum;
    return `
        <div class="product-card cursor-pointer" onclick="showProductDetails(${p.id})" data-aos="fade-up">
            <div class="product-image-wrapper">
                 <img src="${p.imagem_url}" loading="lazy" class="max-h-full max-w-full">
            </div>
            <div class="product-info">
                <div class="product-price">
                     <span class="currency">R$</span>${precoNum.toFixed(2).replace('.', ',')}
                </div>
                ${temDesconto ? `<div class="text-[10px] md:text-xs line-through text-gray-500">R$${precoAntigoNum.toFixed(2).replace('.', ',')}</div>` : ''}

                <h3 class="text-xs font-normal text-gray-600 mt-2 line-clamp-2 h-8 overflow-hidden">${p.nome}</h3>

                <div class="product-shipping">Frete Grátis</div>
                <div class="product-sales">${Math.floor(Math.random() * (200 - 20 + 1)) + 20} vendidos</div>
            </div>
            ${temDesconto ? `<span class="absolute top-2 right-2 bg-[var(--promo-orange)] text-white text-[9px] font-bold px-2 py-1 rounded-sm shadow-md z-10">OFERTA</span>` : ''}
        </div>
    `;
}

function renderProducts(lista) {
    const promos = products.filter(p => p.preco_antigo && parseFloat(p.preco_antigo) > parseFloat(p.preco));
    const promoSection = document.getElementById('promo-section');
    const promoGrid = document.getElementById('promo-grid');
    
    if (currentCat === 'Todos' && promos.length > 0) {
        promoSection.classList.remove('hidden');
        promoGrid.innerHTML = promos.map(p => getProductHTML(p)).join('');
    } else {
        promoSection.classList.add('hidden');
    }
    document.getElementById('product-grid').innerHTML = lista.map(p => getProductHTML(p)).join('');
}

function showProductDetails(id) {
    const p = products.find(x => x.id === id);
    const imgs = [p.imagem_url, p.imagem_url_2, p.imagem_url_3, p.imagem_url_4].filter(u => u);
    document.getElementById('details-body').innerHTML = `
        <div class="space-y-6">
            <div class="w-full aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                <img id="main-view-img" src="${p.imagem_url}" class="w-full h-full object-contain">
            </div>
            <div class="flex gap-2 overflow-x-auto hide-scroll pb-2">${imgs.map((u, i) => `<div class="w-16 h-16 shrink-0 border border-gray-300 rounded-md cursor-pointer hover:border-[var(--aliexpress-red)] bg-white p-1 flex items-center justify-center"><img src="${u}" onclick="document.getElementById('main-view-img').src='${u}'" class="max-h-full"></div>`).join('')}</div>
            <h2 class="text-2xl md:text-3xl font-bold">${p.nome}</h2>
            <p class="text-xl md:text-2xl font-bold text-[var(--aliexpress-red)]">R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</p>
            <p class="text-sm text-gray-600 leading-relaxed">${p.descricao || ''}</p>
            <button onclick="addToCart(${p.id})" class="btn-main btn-primary w-full">Adicionar à Sacola</button>
        </div>
    `;
    document.getElementById('details-panel').classList.add('active');
}

function renderProfile() {
    const data = JSON.parse(localStorage.getItem('oque_profile'));
    const content = document.getElementById('profile-content');
    const logoHTML = `<div class="text-center mb-6"><div class="text-2xl font-bold text-black" style="font-weight: 800;">𝐒𝐇𝐎𝐏𝐏 <span class="text-[var(--aliexpress-red)]">𝐄𝐗𝐏𝐑𝐄𝐒𝐒</span></div></div>`;

    if (data?.nome) {
        content.innerHTML = `${logoHTML}<div class="text-center mb-6"><h2 class="font-bold text-xl mb-4">Olá, ${data.nome.split(' ')[0]}</h2></div><div class="bg-gray-100 p-4 rounded-lg border border-gray-200 mb-6 space-y-2 text-sm"><p class="font-bold text-xs uppercase text-gray-500">Seus Dados</p><p><i class="fa-brands fa-whatsapp text-green-500"></i> ${data.whatsapp}</p><p><i class="fa-solid fa-location-dot"></i> ${data.rua}, ${data.numero}</p><p>${data.bairro}</p></div><button onclick="localStorage.removeItem('oque_profile');renderProfile()" class="w-full text-sm text-red-500 font-bold uppercase mb-4">Sair</button><button onclick="toggleProfile()" class="w-full text-center p-2 rounded-md border border-gray-300 hover:bg-gray-100">Voltar</button>`;
    } else {
        content.innerHTML = `${logoHTML}<h2 class="text-center font-bold text-xl mb-6 uppercase">Seus Dados de Entrega</h2><div class="space-y-3"><input type="text" id="p-nome" placeholder="Nome Completo" class="w-full bg-gray-100 p-3 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--aliexpress-red)]"><div class="flex items-center border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-[var(--aliexpress-red)]"><span class="px-3 text-sm text-gray-500">+55</span><input type="tel" id="p-whatsapp" placeholder="(00) 00000-0000" class="w-full bg-transparent p-3 border-l text-sm outline-none"></div><input type="text" id="p-rua" placeholder="Rua" class="w-full bg-gray-100 p-3 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--aliexpress-red)]"><div class="flex gap-2"><input type="text" id="p-numero" placeholder="Nº" class="w-1/3 bg-gray-100 p-3 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--aliexpress-red)]"><input type="text" id="p-bairro" placeholder="Bairro" class="w-2/3 bg-gray-100 p-3 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--aliexpress-red)]"></div><button onclick="saveProfile()" class="btn-main btn-primary w-full mt-4">Salvar Informações</button><button onclick="toggleProfile()" class="w-full text-xs text-gray-500 uppercase mt-4 text-center">Fechar</button></div>`;
    }
}

function saveProfile() {
    const whatsappValue = document.getElementById('p-whatsapp').value;
    const d = { 
        nome: document.getElementById('p-nome').value, 
        whatsapp: `+55${whatsappValue}`, 
        rua: document.getElementById('p-rua').value, 
        numero: document.getElementById('p-numero').value, 
        bairro: document.getElementById('p-bairro').value 
    };
    if (!d.nome || !whatsappValue) return alert("Preencha Nome e WhatsApp.");
    localStorage.setItem('oque_profile', JSON.stringify(d)); 
    renderProfile();
}

function addToCart(id) {
    cart.push(products.find(x => x.id === id));
    updateCartUI(); 
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = "bg-white text-black p-3 rounded-md shadow-lg text-sm font-bold flex items-center gap-2";
    t.innerHTML = `<i class="fa-solid fa-check text-green-500"></i> Adicionado!`;
    container.appendChild(t);
    setTimeout(() => { t.style.animation = 'toast-out 0.5s forwards'; setTimeout(() => t.remove(), 500); }, 3000);
}

function updateCartUI() {
    let total = 0;
    document.getElementById('cart-items').innerHTML = cart.map((item, i) => { total += parseFloat(item.preco); return `<div class="flex items-center gap-4 bg-gray-100 p-2 rounded-md border"><img src="${item.imagem_url}" class="w-16 h-16 object-contain rounded bg-white p-1"><div class="flex-1 text-sm font-bold truncate">${item.nome}</div><button onclick="cart.splice(${i},1);updateCartUI()" class="text-red-500 text-xl">&times;</button></div>`; }).join('');
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.querySelectorAll('.cart-count-badge').forEach(b => b.innerText = cart.length);
}

async function finalizarPedido() {
    const user = JSON.parse(localStorage.getItem('oque_profile'));
    if(!user?.nome) { toggleCart(); setTimeout(toggleProfile, 500); return; }
    if(!cart.length) return alert("Sua sacola está vazia!");
    const pagamento = document.querySelector('input[name="payment"]:checked').value;
    const btn = document.getElementById('btn-finalizar');
    btn.disabled = true; btn.innerHTML = "PROCESSANDO...";
    const { error } = await _supabase.from('vendas').insert([{ cliente_nome: user.nome, cliente_whatsapp: user.whatsapp, endereco: `${user.rua}, ${user.numero} - ${user.bairro}`, itens: cart.map(i => i.nome).join(', '), total: cart.reduce((a, b) => a + parseFloat(b.preco), 0), pagamento, status: 'Pendente' }]);
    if(!error) { document.getElementById('success-modal').style.display = 'flex'; cart = []; updateCartUI(); toggleCart(); }
    btn.disabled = false; btn.innerHTML = "Finalizar Pedido";
}

function toggleCart() { document.getElementById('cart-panel').classList.toggle('active'); }
function toggleProfile() {
    const modal = document.getElementById('profile-modal');
    if (modal.classList.contains('hidden')) {
        renderProfile();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}
function closeDetails() { document.getElementById('details-panel').classList.remove('active'); }

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
});
