"use client";

import { Camera, Sparkles, Heart, Star, Zap, Download, Share2, Image as ImageIcon, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MarketingPage() {
  const features = [
    {
      icon: Sparkles,
      title: "Filtros Profissionais",
      description: "8 filtros incríveis para transformar suas fotos instantaneamente",
    },
    {
      icon: Star,
      title: "Embelezamento IA",
      description: "Tecnologia de inteligência artificial para realçar sua beleza natural",
    },
    {
      icon: Heart,
      title: "Adesivos & Textos",
      description: "Personalize com emojis, textos coloridos e muito mais",
    },
    {
      icon: Zap,
      title: "Edição Instantânea",
      description: "Ajuste brilho, contraste e saturação em tempo real",
    },
    {
      icon: Download,
      title: "Salve & Compartilhe",
      description: "Baixe em alta qualidade ou compartilhe direto nas redes sociais",
    },
    {
      icon: ImageIcon,
      title: "Galeria Pessoal",
      description: "Armazene todas suas fotos editadas em um só lugar",
    },
  ];

  const gallery = [
    {
      before: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      filter: "Vintage",
    },
    {
      before: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      filter: "Vivid",
    },
    {
      before: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
      filter: "Drama",
    },
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Influenciadora Digital",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "O GlowUp Studio revolucionou minha forma de editar fotos! Super fácil e os resultados são incríveis.",
      rating: 5,
    },
    {
      name: "Carlos Mendes",
      role: "Fotógrafo",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      text: "Filtros profissionais e ferramentas poderosas. Perfeito para edições rápidas e de qualidade.",
      rating: 5,
    },
    {
      name: "Mariana Costa",
      role: "Criadora de Conteúdo",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      text: "Adoro os adesivos e textos! Minhas fotos ficam muito mais criativas e únicas.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-2 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                GlowUp Studio
              </h1>
            </div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Começar Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                ✨ Editor de Fotos Profissional
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Transforme suas fotos em{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                obras de arte
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Editor de fotos online com IA, filtros profissionais e ferramentas de beleza.
              Edite, salve e compartilhe suas melhores fotos em segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <Camera className="w-5 h-5 mr-2" />
                  Começar Gratuitamente
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-pink-300 hover:bg-pink-50 text-lg px-8 py-6 rounded-2xl">
                Ver Demonstração
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                </div>
                <div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">10.000+ usuários felizes</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop"
                alt="Hero"
                className="rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Filtro Aplicado</p>
                    <p className="text-sm text-gray-600">Vivid + Embelezamento</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50 backdrop-blur-sm rounded-3xl my-12">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            Recursos{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Poderosos
            </span>
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa para criar fotos incríveis em um único lugar
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-pink-100 hover:border-pink-300 group"
            >
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            Antes & Depois
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja a transformação incrível que nossos filtros podem fazer
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {gallery.map((item, index) => (
            <div key={index} className="group relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img
                      src={item.before}
                      alt="Before"
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Antes
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={item.after}
                      alt="After"
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Depois
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-bold text-lg">Filtro: {item.filter}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50 backdrop-blur-sm rounded-3xl my-12">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            O que nossos usuários{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              dizem
            </span>
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Milhares de pessoas já transformaram suas fotos com o GlowUp Studio
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            Planos & Preços
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano perfeito para você
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-pink-100">
            <h4 className="text-2xl font-bold mb-2">Gratuito</h4>
            <p className="text-gray-600 mb-6">Para começar</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">R$ 0</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>8 filtros básicos</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Ajustes básicos</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>10 fotos/mês</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Marca d'água</span>
              </li>
            </ul>
            <Link href="/">
              <Button variant="outline" className="w-full border-2 border-pink-300 hover:bg-pink-50">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-8 shadow-2xl border-2 border-pink-300 transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              Mais Popular
            </div>
            <h4 className="text-2xl font-bold mb-2 text-white">Pro</h4>
            <p className="text-pink-100 mb-6">Para criadores</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">R$ 19</span>
              <span className="text-pink-100">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 text-white">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span>Todos os filtros</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span>Ajustes avançados</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span>Fotos ilimitadas</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span>Sem marca d'água</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
            <Link href="/">
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                Começar Pro
              </Button>
            </Link>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-pink-100">
            <h4 className="text-2xl font-bold mb-2">Business</h4>
            <p className="text-gray-600 mb-6">Para equipes</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">R$ 49</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Tudo do Pro</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>5 usuários</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Branding customizado</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Suporte 24/7</span>
              </li>
            </ul>
            <Link href="/">
              <Button variant="outline" className="w-full border-2 border-pink-300 hover:bg-pink-50">
                Falar com Vendas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-12 md:p-20 text-center shadow-2xl">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para transformar suas fotos?
          </h3>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão criando fotos incríveis com o GlowUp Studio
          </p>
          <Link href="/">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <Camera className="w-5 h-5 mr-2" />
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-pink-100 mt-6">Sem cartão de crédito necessário • Cancele quando quiser</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-pink-100 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-2 rounded-xl">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  GlowUp Studio
                </h4>
              </div>
              <p className="text-gray-600 text-sm">
                Editor de fotos profissional com IA para criar imagens incríveis.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-gray-800">Produto</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-pink-500">Recursos</a></li>
                <li><a href="#" className="hover:text-pink-500">Preços</a></li>
                <li><a href="#" className="hover:text-pink-500">Tutoriais</a></li>
                <li><a href="#" className="hover:text-pink-500">API</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-gray-800">Empresa</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-pink-500">Sobre</a></li>
                <li><a href="#" className="hover:text-pink-500">Blog</a></li>
                <li><a href="#" className="hover:text-pink-500">Carreiras</a></li>
                <li><a href="#" className="hover:text-pink-500">Contato</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-gray-800">Legal</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-pink-500">Privacidade</a></li>
                <li><a href="#" className="hover:text-pink-500">Termos</a></li>
                <li><a href="#" className="hover:text-pink-500">Cookies</a></li>
                <li><a href="#" className="hover:text-pink-500">Licenças</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-pink-100 mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>© 2024 GlowUp Studio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
