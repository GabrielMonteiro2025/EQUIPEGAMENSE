import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft,
  ShieldCheck,
  Truck,
  Phone,
  Mail,
  Lock,
  MapPin,
  FileText,
  Wallet,
  Loader2
} from 'lucide-react';

const PRODUCTS = [
  { 
    id: 1, 
    name: "Boné Periquito Bolado", 
    price: 60.00, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Bone+Periquito", 
    category: "Acessórios",
    description: "Boné verde com mascote Periquito Bolado e escudo retrô. Silk com efeito 3D." 
  },
  { 
    id: 2, 
    name: "Boné 1975 Tradicional", 
    price: 60.00, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Bone+1975", 
    category: "Acessórios",
    description: "Boné verde com escudo tradicional 1975. Silk com efeito 3D e frase na lateral." 
  },
  { 
    id: 3, 
    name: "Shoulder Bag Branca/Verde 1975", 
    price: 89.90, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Bag+1975", 
    category: "Acessórios",
    description: "Shoulder bag estilizada com faixas e padrão 1975. Ideal para o estádio." 
  },
  { 
    id: 4, 
    name: "Copo Preto GAMA", 
    price: 15.00, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Copo+Gama", 
    category: "Acessórios",
    description: "Copo oficial com escudo e a frase 'Por todo lugar tem Gama'." 
  },
  { 
    id: 5, 
    name: "Shoulder Bag Verde Tradicional", 
    price: 89.90, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Bag+Verde", 
    category: "Acessórios",
    description: "Shoulder bag verde com listras brancas e ano de fundação 1975 em destaque." 
  },
  { 
    id: 6, 
    name: "Shoulder Bag Gama Sempre Gama", 
    price: 89.90, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Gama+Sempre", 
    category: "Acessórios",
    description: "Shoulder bag com padrão de faixas e dizeres 'Gama Sempre Gama'." 
  },
  {
    id: 7, 
    name: "Chapéu Bucket Verde", 
    price: 65.00, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Bucket+Hat", 
    category: "Acessórios",
    description: "Chapéu estilo bucket hat verde escuro com escudo clássico do Gama." 
  },
  {
    id: 8, 
    name: "Shoulder Bag Preta", 
    price: 89.90, 
    image: "https://placehold.co/400x400/065f46/FFFFFF/png?text=Bag+Preta", 
    category: "Acessórios",
    description: "Shoulder bag preta básica com escudo e texto Sociedade Esportiva do Gama." 
  }
];

const CATEGORIES = ["LANÇAMENTO", "MASCULINO", "FEMININO", "INFANTO JUVENIL", "ACESSÓRIOS", "OUTLET"];

// Adicionamos a variável de ESTOQUE aos produtos iniciais
const INITIAL_PRODUCTS = PRODUCTS.map(p => ({ 
  ...p, 
  stock: Math.floor(Math.random() * 15) + 3 // Simulando estoque inicial entre 3 e 18
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function App() {
  const [currentView, setCurrentView] = useState('shop');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Novos estados para o Tempo Real (Substituindo a constante PRODUCTS estática)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isLive, setIsLive] = useState(false);

  // Efeito que simula a conexão Socket.io do Front-end
  useEffect(() => {
    // Em produção com a Hostinger, você instalaria e usaria:
    // import { io } from "socket.io-client";
    // const socket = io("https://api.seusite.com.br");
    // socket.on("estoque_atualizado", (dados) => atualizarEstado(dados));

    // Para demonstrar o efeito "Ao Vivo" agora na prévia, 
    // vamos simular o servidor avisando que um produto foi vendido a cada 3 segundos:
    const connectToRealTimeServer = () => {
      setTimeout(() => setIsLive(true), 1500); // Simula o "handshake" do Socket conectando

      const interval = setInterval(() => {
        // Escolhe um produto aleatório para "vender"
        const randomProductId = Math.floor(Math.random() * 8) + 1;
        
        setProducts(prevProducts => 
          prevProducts.map(p => {
            if (p.id === randomProductId && p.stock > 0) {
              // Reduz o estoque em 1, simulando que alguém acabou de comprar
              return { ...p, stock: p.stock - 1 };
            }
            return p;
          })
        );
      }, 3000); // Atualiza a cada 3 segundos

      return () => clearInterval(interval);
    };

    const cleanup = connectToRealTimeServer();
    return cleanup;
  }, []);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('storegoias_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    cep: '',
    endereco: '',
    numero: '',
    metodoPagamento: 'pix'
  });

  useEffect(() => {
    try {
      localStorage.setItem('storegoias_cart', JSON.stringify(cart));
    } catch (error) {}
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId));

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      setCurrentView('checkout');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Aqui nós enviaríamos os dados para o nosso Back-end (server.js)
    // Exemplo: axios.post('http://localhost:3001/api/checkout', { cart, formData })
    
    // Simulando o tempo de resposta da API e processamento da InfinitePay
    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckoutModal(true);
      setCart([]); 
    }, 2000);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Agora filtramos os produtos da nossa variável de estado (que muda), não da constante fixa
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderHeader = () => (
    <header className="w-full flex flex-col bg-white">
      {/* Top Bar (Contatos) */}
      <div className="bg-emerald-800 text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Phone size={14}/> (61) 9999-9999</span>
            <span className="flex items-center gap-1"><Mail size={14}/> contato@gamastore.com.br</span>
          </div>
          <div className="flex gap-4">
            <span>Atendimento Seg-Sex 08h às 18h</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0 relative"
            onClick={() => setCurrentView('shop')}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-emerald-800 leading-none">GAMA</span>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest leading-none">Store</span>
            </div>

            {/* Indicador de Conexão em Tempo Real */}
            {isLive && (
              <div className="absolute -top-3 -right-16 flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border border-emerald-200 shadow-sm animate-in fade-in zoom-in duration-500">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                AO VIVO
              </div>
            )}
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-grow max-w-2xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Busque seu produto..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-800">
              <Search size={20} />
            </button>
          </div>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:text-emerald-600">
              <User size={24} className="text-gray-600" />
              <div className="text-sm">
                <p className="text-gray-500">Olá, Visitante</p>
                <p className="font-bold text-gray-800">Minha Conta</p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentView('cart')}
              className="relative p-2 flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <div className="relative">
                <ShoppingCart size={28} />
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-emerald-600 rounded-full">
                  {totalItems}
                </span>
              </div>
              <div className="hidden sm:block text-left text-sm">
                <p className="text-gray-500">Carrinho</p>
                <p className="font-bold text-gray-800">{formatCurrency(totalPrice)}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu (Categories) */}
      <div className="bg-emerald-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <ul className="flex items-center whitespace-nowrap py-3 gap-6 text-sm font-bold tracking-wide">
            {CATEGORIES.map(cat => (
              <li key={cat} className="cursor-pointer hover:text-emerald-200 transition-colors">
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );

  const renderShopView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      {/* Banner Principal estilo Lançamento */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-xl mb-10 text-white shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
        <div className="p-8 md:p-12 md:w-1/2">
          <span className="bg-yellow-400 text-emerald-900 text-xs font-black px-3 py-1 rounded-sm mb-4 inline-block uppercase tracking-wider">
            Coleção 1975
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase italic">Tradição Gamense</h1>
          <p className="text-emerald-100 text-lg mb-6">Conheça a nova linha de bonés e shoulder bags. A força do Gamão do Povo para você carregar no peito.</p>
          <button className="bg-white text-emerald-800 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors shadow-md">
            Garantir o Meu
          </button>
        </div>
        <div className="md:w-1/2 p-4 flex justify-center opacity-80 mix-blend-overlay">
           {/* Ícone gigante representando o futebol/time */}
           <ShieldCheck size={280} className="text-white transform rotate-12" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-100 pb-2">
        <h2 className="text-2xl font-black text-gray-800 uppercase italic">
          {searchQuery ? 'Resultados da Busca' : 'Destaques'}
        </h2>
        <div className="flex-grow h-1 bg-emerald-600 ml-4 rounded-full max-w-[50px]"></div>
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Nenhum produto encontrado para "{searchQuery}".</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-500 transition-all duration-300 group flex flex-col relative">
              
              <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-4 flex flex-col flex-grow text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{product.category}</span>
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 line-clamp-2 h-10 sm:h-12">{product.name}</h3>
                
                {/* Etiqueta de Estoque em Tempo Real */}
                <div className="text-xs font-bold mb-2 min-h-[24px] flex items-center justify-center">
                  {product.stock > 5 ? (
                     <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Estoque: {product.stock} un</span>
                  ) : product.stock > 0 ? (
                     <span className="text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-100 animate-pulse flex items-center gap-1">🔥 Corra! Só {product.stock} no estoque</span>
                  ) : (
                     <span className="text-red-700 bg-red-50 px-2 py-1 rounded border border-red-100">Esgotado</span>
                  )}
                </div>

                <div className="mt-auto pt-4 flex flex-col items-center">
                  <span className="text-2xl font-black text-emerald-700 mb-3">{formatCurrency(product.price)}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-2.5 rounded font-bold uppercase text-sm transition-colors shadow-sm flex items-center justify-center gap-2 ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  >
                    <ShoppingCart size={18} />
                    {product.stock === 0 ? 'Indisponível' : 'Comprar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCartView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <button 
        onClick={() => setCurrentView('shop')}
        className="flex items-center text-emerald-700 hover:text-emerald-800 transition-colors mb-6 font-bold"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Continuar Comprando
      </button>

      <h1 className="text-3xl font-black text-gray-800 uppercase italic mb-8 border-b-2 border-emerald-600 inline-block pr-8 pb-1">Seu Carrinho</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center flex flex-col items-center">
          <ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio!</h2>
          <p className="text-gray-500 mb-8">Navegue pelas categorias e adicione os itens do Gamão.</p>
          <button 
            onClick={() => setCurrentView('shop')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded font-bold uppercase transition-colors"
          >
            Voltar para a loja
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-4">
            {/* Cabeçalho da tabela do carrinho (Desktop) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 text-sm font-bold text-gray-500 uppercase">
              <div className="col-span-6">Produto</div>
              <div className="col-span-3 text-center">Quantidade</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4">
                
                <div className="col-span-6 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-50" />
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{item.name}</h3>
                    <p className="text-emerald-600 font-bold mt-1 text-sm">{formatCurrency(item.price)}</p>
                  </div>
                </div>

                <div className="col-span-3 flex justify-center items-center gap-4 sm:gap-0 sm:justify-center">
                  <span className="sm:hidden font-bold text-gray-500 text-sm">Qtd:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-gray-600 hover:bg-gray-100"><Minus size={14} /></button>
                    <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-gray-600 hover:bg-gray-100"><Plus size={14} /></button>
                  </div>
                </div>

                <div className="col-span-3 flex items-center justify-between sm:justify-end">
                  <span className="font-black text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-gray-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-black text-gray-800 uppercase mb-6 border-b border-gray-300 pb-2">Resumo</h2>
              
              <div className="space-y-4 text-gray-600 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} itens)</span>
                  <span className="font-bold text-gray-800">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="font-bold text-emerald-600">A calcular</span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-black text-emerald-700">{formatCurrency(totalPrice)}</span>
                </div>
                <p className="text-xs text-gray-500 text-right">Em até 6x sem juros</p>
              </div>

              {}
              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded font-black uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Lock size={20} />
                Ir para o Checkout
              </button>

              <div className="mt-6 flex flex-col gap-2 items-center justify-center text-xs text-gray-500">
                <div className="flex items-center gap-1"><Lock size={14} className="text-gray-400"/> Ambiente 100% Seguro</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCheckoutView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <button 
        onClick={() => setCurrentView('cart')}
        className="flex items-center text-emerald-700 hover:text-emerald-800 transition-colors mb-6 font-bold"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Carrinho
      </button>

      <h1 className="text-3xl font-black text-gray-800 uppercase italic mb-8 border-b-2 border-emerald-600 inline-block pr-8 pb-1">Finalizar Pedido</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={processPayment} className="w-full lg:w-2/3 space-y-6">
          
          {/* Seção de Dados Pessoais */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-emerald-600" /> Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="João da Silva" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input required type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="000.000.000-00" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="joao@exemplo.com" />
              </div>
            </div>
          </div>

          {/* Seção de Endereço */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-emerald-600" /> Endereço de Entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input required type="text" name="cep" value={formData.cep} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="00000-000" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua / Avenida</label>
                <input required type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="Ex: Av. dos Gamenses" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input required type="text" name="numero" value={formData.numero} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="123" />
              </div>
            </div>
          </div>

          {/* Seção de Pagamento */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Wallet className="text-emerald-600" /> Forma de Pagamento
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex items-center justify-center gap-2 p-4 border rounded cursor-pointer flex-1 transition-all ${formData.metodoPagamento === 'pix' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <input type="radio" name="metodoPagamento" value="pix" checked={formData.metodoPagamento === 'pix'} onChange={handleInputChange} className="hidden" />
                <div className="w-5 h-5 border-2 border-emerald-500 rounded-full flex justify-center items-center">
                  {formData.metodoPagamento === 'pix' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                </div>
                Pix (Aprovação na hora)
              </label>
              
              <label className={`flex items-center justify-center gap-2 p-4 border rounded cursor-pointer flex-1 transition-all ${formData.metodoPagamento === 'cartao' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <input type="radio" name="metodoPagamento" value="cartao" checked={formData.metodoPagamento === 'cartao'} onChange={handleInputChange} className="hidden" />
                <div className="w-5 h-5 border-2 border-emerald-500 rounded-full flex justify-center items-center">
                  {formData.metodoPagamento === 'cartao' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                </div>
                Cartão de Crédito
              </label>
            </div>
            {formData.metodoPagamento === 'cartao' && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 text-orange-800 text-sm rounded">
                ⚠️ O pagamento via Cartão de Crédito (Integração InfinitePay) requer tokenização no Front-end. Os campos do cartão não devem ser processados diretamente pelo HTML por segurança.
              </div>
            )}
          </div>

        </form>

        {/* Resumo Lateral do Checkout */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-black text-gray-800 uppercase mb-6 border-b border-gray-300 pb-2">Resumo da Compra</h2>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                  <span className="text-gray-600 truncate pr-2">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total a Pagar</span>
                <span className="text-2xl font-black text-emerald-700">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button 
              onClick={processPayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded font-black uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={20} /> Processando...</>
              ) : (
                <><CheckCircle size={20} /> Confirmar Pagamento</>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={14}/> Transação segura e criptografada
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      {renderHeader()}
      
      <main className="flex-grow">
        {}
        {currentView === 'shop' && renderShopView()}
        {currentView === 'cart' && renderCartView()}
        {currentView === 'checkout' && renderCheckoutView()}
      </main>

      {/* Footer Padrão de Loja */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12 border-t-4 border-emerald-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold uppercase mb-4">Sobre a Loja</h4>
            <p className="text-sm leading-relaxed">
              A GAMA Store é a loja oficial da Sociedade Esportiva do Gama. Aqui você encontra todos os produtos oficiais e licenciados com segurança e garantia de qualidade.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase mb-4">Atendimento</h4>
            <ul className="text-sm space-y-2">
              <li className="cursor-pointer hover:text-white transition-colors">Meus Pedidos</li>
              <li className="cursor-pointer hover:text-white transition-colors">Trocas e Devoluções</li>
              <li className="cursor-pointer hover:text-white transition-colors">Política de Privacidade</li>
              <li className="cursor-pointer hover:text-white transition-colors">Fale Conosco</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase mb-4">Segurança</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 bg-gray-800 p-2 rounded text-xs w-fit"><ShieldCheck size={16} className="text-emerald-500"/> Site Seguro</div>
              <div className="flex items-center gap-1 bg-gray-800 p-2 rounded text-xs w-fit"><Lock size={16} className="text-emerald-500"/> SSL</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase mb-4">Formas de Pagamento</h4>
            <div className="flex gap-2 flex-wrap">
               <CreditCard size={32} className="text-gray-300"/>
               <div className="h-8 w-12 bg-gray-800 rounded"></div>
               <div className="h-8 w-12 bg-gray-800 rounded"></div>
               <div className="h-8 w-12 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-xs text-center">
          © 2026 GAMA Store - Todos os direitos reservados.
        </div>
      </footer>

      {/* Modal de Sucesso */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase italic mb-2">Pedido Realizado!</h2>
            <p className="text-gray-600 mb-8">
              Sua compra foi confirmada com sucesso, alviverde! Em breve você receberá as atualizações por e-mail.
            </p>
            <button 
              onClick={() => {
                setShowCheckoutModal(false);
                setCurrentView('shop');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded font-bold uppercase transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      )}
    </div>
  );
}