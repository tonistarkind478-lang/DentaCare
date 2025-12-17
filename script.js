const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence, useScroll, useMotionValueEvent } = window.Motion;

// --- UI КОМПОНЕНТЫ ---

// SVG Иконки
const Icons = {
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
    ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
    ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
    Star: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
};

const SectionTitle = ({ title, subtitle, center = true }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-12 ${center ? 'text-center' : 'text-left'}`}
    >
        <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-2">{subtitle}</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-dark">{title}</h2>
        <div className={`w-16 h-1 bg-primary mt-4 rounded-full ${center ? 'mx-auto' : ''}`}></div>
    </motion.div>
);

const Button = ({ children, outline = false, onClick, className = "" }) => (
    <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`px-8 py-4 rounded-full font-bold transition-shadow duration-300 shadow-lg ${
            outline 
            ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white' 
            : 'bg-primary text-white hover:bg-teal-700 hover:shadow-teal-500/30'
        } ${className}`}
    >
        {children}
    </motion.button>
);

// Компонент До/После Слайдер
const BeforeAfterSlider = ({ before, after, label }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);

    const handleMove = (event) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleTouchMove = (event) => {
            if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    }

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div 
                ref={containerRef}
                className="relative h-64 rounded-xl overflow-hidden mb-4 cursor-ew-resize select-none"
                onMouseMove={handleMove}
                onTouchMove={handleTouchMove}
            >
                {/* Картинка ПОСЛЕ (Фон) */}
                <img src={after} className="absolute inset-0 w-full h-full object-cover" draggable="false" />
                <div className="absolute top-4 right-4 bg-primary/80 text-white text-xs font-bold px-2 py-1 rounded">ПОСЛЕ</div>

                {/* Картинка ДО (Сверху, обрезается) */}
                <div 
                    className="absolute inset-0 overflow-hidden border-r-2 border-white"
                    style={{ width: `${sliderPosition}%` }}
                >
                    <img src={before} className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }} draggable="false" />
                    <div className="absolute top-4 left-4 bg-gray-800/80 text-white text-xs font-bold px-2 py-1 rounded">ДО</div>
                </div>

                {/* Ползунок */}
                <div 
                    className="absolute top-0 bottom-0 w-10 flex items-center justify-center -ml-5 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/></svg>
                    </div>
                </div>
            </div>
            <h4 className="font-bold text-lg text-center">{label}</h4>
            <p className="text-center text-xs text-gray-400 mt-1">Потяните слайдер</p>
        </div>
    );
};

// --- СЕКЦИИ ---

// 1. Navbar (С мобильным меню)
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = ['О клинике', 'Услуги', 'Врачи', 'Отзывы', 'Контакты'];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="text-2xl font-bold flex items-center gap-2 text-dark z-50 relative">
                    <div className="w-8 h-8 bg-primary rounded-tr-xl rounded-bl-xl"></div>
                    DentaCare
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 font-medium text-gray-600">
                    {menuItems.map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition">{item}</a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs text-gray-500">9:00 - 21:00</div>
                        <div className="font-bold whitespace-nowrap">+7 (999) 123-45-67</div>
                    </div>
                    <Button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>Записаться</Button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden z-50 text-dark" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <Icons.X /> : <Icons.Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        {menuItems.map(item => (
                            <a 
                                key={item} 
                                href={`#${item.toLowerCase()}`} 
                                className="text-2xl font-bold text-dark hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <Button onClick={() => { setIsOpen(false); document.getElementById('contact').scrollIntoView({behavior: 'smooth'}); }}>
                            Записаться на прием
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// 2. Hero Section
const Hero = () => (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8 }}
            >
                <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm text-primary font-bold text-sm mb-6 flex items-center gap-2">
                        <span className="text-yellow-400"><Icons.Star /></span> Рейтинг 5.0 на Яндекс.Картах
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-dark leading-tight mb-6">
                    Лечим зубы <br/>
                    <span className="text-primary">бережно и без боли</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                    Современная стоматология с гарантией качества. Имплантация, виниры и лечение под микроскопом.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>Записаться на осмотр</Button>
                    <Button outline onClick={() => document.getElementById('услуги').scrollIntoView({behavior: 'smooth'})}>Смотреть цены</Button>
                </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }} 
                className="relative hidden lg:block"
            >
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>
                <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Счастливая улыбка" className="relative z-10 rounded-[3rem] shadow-2xl w-full object-cover h-[500px]" />
                
                {/* Плавающая карточка */}
                <motion.div 
                    animate={{ y: [0, -15, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold"><Icons.Check /></div>
                        <div>
                            <div className="font-bold text-dark">Гарантия 10 лет</div>
                            <div className="text-xs text-gray-500">На все импланты</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    </section>
);

// 3. About Section
const About = () => (
    <section id="о клинике" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
                <motion.img 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80" 
                    className="rounded-2xl mt-12 shadow-lg" 
                />
                <motion.img 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80" 
                    className="rounded-2xl shadow-lg" 
                />
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <SectionTitle title="Мы возвращаем уверенность в себе" subtitle="О нас" center={false} />
                <p className="text-gray-600 mb-6 text-lg">
                    DentaCare — это не просто клиника, это место, где передовые технологии встречаются с заботой о пациенте. Мы используем немецкое оборудование Sirona и швейцарские материалы.
                </p>
                <ul className="space-y-4 mb-8">
                    {['Лечение под микроскопом', 'Собственная зуботехническая лаборатория', 'Компьютерная томография (КТ) на месте'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-medium text-dark">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm"><Icons.Check /></span>
                            {item}
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    </section>
);

// 4. Advantages
const Features = () => (
    <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { title: "Без боли", text: "Компьютерная анестезия STA без шприца." },
                    { title: "Безопасно", text: "Система Анти-СПИД и Анти-Гепатит." },
                    { title: "Рассрочка 0%", text: "Лечение сейчас — оплата потом." },
                    { title: "Удобно", text: "Бесплатная парковка для пациентов." }
                ].map((f, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition duration-300 border border-slate-100"
                    >
                        <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl mb-6">
                                <Icons.Check />
                        </div>
                        <h4 className="text-xl font-bold mb-2">{f.title}</h4>
                        <p className="text-gray-500 text-sm">{f.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// 5. Services
const Services = () => (
    <section id="услуги" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionTitle title="Наши услуги" subtitle="Комплексный подход" />
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { t: "Терапия", p: "Лечение кариеса, пульпита, реставрация.", price: "от 3 500 ₽" },
                    { t: "Имплантация", p: "Установка имплантов Osstem, Nobel.", price: "от 25 000 ₽" },
                    { t: "Ортодонтия", p: "Брекеты, элайнеры, исправление прикуса.", price: "от 40 000 ₽" },
                    { t: "Ортопедия", p: "Виниры, коронки из диоксида циркония.", price: "от 15 000 ₽" },
                    { t: "Хирургия", p: "Удаление зубов любой сложности (мудрости).", price: "от 2 500 ₽" },
                    { t: "Гигиена", p: "Чистка AirFlow, отбеливание Zoom 4.", price: "от 4 500 ₽" }
                ].map((s, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="group bg-slate-50 p-8 rounded-3xl hover:bg-primary transition duration-300 cursor-pointer"
                    >
                        <h4 className="text-2xl font-bold mb-3 group-hover:text-white transition">{s.t}</h4>
                        <p className="text-gray-500 mb-6 group-hover:text-white/80 transition">{s.p}</p>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-primary group-hover:text-white transition">{s.price}</span>
                            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary group-hover:text-primary"><Icons.ArrowRight /></span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// 6. Doctors
const Team = () => (
    <section id="врачи" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionTitle title="Ваши лечащие врачи" subtitle="Команда профессионалов" />
            <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                    { name: "Др. Иванов А.А.", spec: "Главный врач, Хирург", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80" },
                    { name: "Др. Петрова Е.С.", spec: "Ортодонт", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80" },
                    { name: "Др. Сидоров И.В.", spec: "Терапевт", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80" },
                    { name: "Др. Смирнова О.Д.", spec: "Детский стоматолог", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80" }
                ].map((doc, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }} 
                        className="group"
                    >
                        <div className="relative overflow-hidden rounded-2xl mb-4">
                            <img src={doc.img} alt={doc.name} className="w-full h-80 object-cover group-hover:scale-110 transition duration-700" />
                        </div>
                        <h4 className="text-xl font-bold text-dark">{doc.name}</h4>
                        <p className="text-primary text-sm font-medium">{doc.spec}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// 7. Portfolio (Интерактивный!)
const Portfolio = () => (
    <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
            <SectionTitle title="Результаты лечения" subtitle="Улыбки пациентов" />
            <div className="grid md:grid-cols-2 gap-8">
                {/* Интерактивный компонент 1 */}
                <BeforeAfterSlider 
                    label="Установка виниров E-max (10 зубов)"
                    before="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80"
                    after="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80"
                />
                {/* Интерактивный компонент 2 */}
                <BeforeAfterSlider 
                    label="Отбеливание Zoom 4"
                    before="https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=600&q=80"
                    after="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                />
            </div>
        </div>
    </section>
);

// 8. Process
const Steps = () => (
    <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
            <SectionTitle title="Ваш путь к здоровой улыбке" subtitle="Как мы работаем" />
            <div className="space-y-8">
                {[
                    { num: "01", title: "Запись и консультация", text: "Осмотр, фотопротокол и составление плана лечения." },
                    { num: "02", title: "Диагностика (КТ)", text: "Делаем 3D-снимок для точной постановки диагноза." },
                    { num: "03", title: "Лечение", text: "Безболезненные процедуры в комфортном кресле." },
                    { num: "04", title: "Профилактика", text: "Рекомендации по уходу и график осмотров." }
                ].map((step, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6 items-start md:items-center"
                    >
                        <div className="w-12 h-12 shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30 z-10">
                            {step.num}
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full hover:border-primary/30 transition hover:shadow-md">
                            <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                            <p className="text-gray-500">{step.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// 9. Reviews
const Reviews = () => (
    <section id="отзывы" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <SectionTitle title="Счастливые пациенты" subtitle="Отзывы" />
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    "Спасибо доктору Иванову! Удалил зуб мудрости за 5 минут, я даже не успела испугаться.",
                    "Ставила здесь брекеты. Результат превзошел ожидания. Очень приятная атмосфера и вежливый персонал.",
                    "Делал чистку зубов. Все прошло отлично, дали рекомендации. Теперь только сюда!"
                ].map((text, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-2xl shadow-sm"
                    >
                        <div className="flex text-yellow-400 mb-4 gap-1">
                            {[1,2,3,4,5].map(s => <Icons.Star key={s} />)}
                        </div>
                        <p className="text-gray-600 mb-6 italic">"{text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div className="font-bold text-sm text-dark">Пациент {i+1}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// 10. FAQ
const FAQ = () => {
    const [open, setOpen] = useState(0);
    return (
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <SectionTitle title="Частые вопросы" subtitle="FAQ" />
                <div className="space-y-4">
                    {[
                        { q: "Больно ли лечить зубы?", a: "Мы используем современные анестетики. Вы почувствуете только легкое прикосновение." },
                        { q: "Сколько стоит имплантация?", a: "Стоимость начинается от 25 000 рублей за имплант Osstem под ключ." },
                        { q: "Есть ли гарантия?", a: "Да, мы даем гарантию на пломбы 1 год, на импланты — пожизненная гарантия от производителя." },
                        { q: "Как записаться?", a: "Вы можете позвонить нам или оставить заявку на сайте." }
                    ].map((item, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => setOpen(open === i ? -1 : i)} 
                                className="w-full text-left p-6 font-bold flex justify-between items-center hover:bg-slate-50 transition"
                            >
                                {item.q}
                                <motion.span 
                                    animate={{ rotate: open === i ? 45 : 0 }} 
                                    className="text-primary text-2xl block"
                                >
                                    +
                                </motion.span>
                            </button>
                            <AnimatePresence>
                                {open === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                        <div className="p-6 pt-0 text-gray-500">{item.a}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 11. Contact Form (С Функционалом)
const Contact = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        // Имитация отправки
        setTimeout(() => {
            setStatus('success');
            e.target.reset();
            // Сброс статуса через 3 секунды
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    }

    return (
        <section id="контакты" className="py-24 bg-dark text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 rounded-l-full blur-3xl"></div>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 relative z-10">
                <div>
                    <h2 className="text-4xl font-bold mb-6">Запишитесь на <br/><span className="text-primary">бесплатный прием</span></h2>
                    <p className="text-gray-400 mb-8">Оставьте свои контакты, и администратор подберет удобное время для визита.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <input type="text" placeholder="Ваше имя" className="w-full p-4 rounded-xl bg-white/10 border border-white/10 focus:border-primary outline-none text-white transition" required />
                        <input type="tel" placeholder="+7 (___) ___-__-__" className="w-full p-4 rounded-xl bg-white/10 border border-white/10 focus:border-primary outline-none text-white transition" required />
                        
                        <button 
                            disabled={status === 'loading' || status === 'success'}
                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                                status === 'success' 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-primary hover:bg-teal-600'
                            }`}
                        >
                            {status === 'loading' && 'Отправка...'}
                            {status === 'success' && '✓ Заявка отправлена!'}
                            {status === 'idle' && 'Отправить заявку'}
                        </button>
                    </form>
                    
                    <div className="mt-12 space-y-4 text-gray-300">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">📍</div>
                            <div>г. Москва, ул. Ленина, д. 10</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">📞</div>
                            <div>+7 (999) 123-45-67</div>
                        </div>
                    </div>
                </div>
                <div className="h-96 bg-gray-800 rounded-3xl overflow-hidden relative border border-white/10">
                    {/* Заглушка карты */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Яндекс.Карта (Интеграция по API)
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-dark border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 font-bold text-white">DentaCare © 2025</div>
            <div className="flex gap-6">
                <a href="#" className="hover:text-white">Политика конфиденциальности</a>
                <a href="#" className="hover:text-white">Лицензия</a>
            </div>
        </div>
    </footer>
);

// Кнопка "Наверх"
const BackToTop = () => {
    const [visible, setVisible] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setVisible(latest > 500);
    });

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg z-50 hover:bg-teal-700 transition"
                >
                    <Icons.ChevronUp />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

// --- ГЛАВНОЕ ПРИЛОЖЕНИЕ ---
const App = () => {
    return (
        <div className="antialiased">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Features />
                <Services />
                <Team />
                <Portfolio />
                <Steps />
                <Reviews />
                <FAQ />
                <Contact />
            </main>
            <Footer />
            <BackToTop />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
