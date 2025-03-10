import Link from 'next/link';

const categories = [
  {
    title: 'Literacy',
    description: 'Focus: Growth & Learning',
    bgColor: 'bg-[#D8E5F0]',
    textColor: 'text-[#1E3A6E]',
    href: '/literacy',
  },
  {
    title: 'Career Guidance',
    description: 'Focus: Success & Stability',
    bgColor: 'bg-[#E49B97]',
    textColor: 'text-[#B84941]',
    href: '/career-guidance',
  },
  {
    title: 'Psychological Support',
    description: 'Focus: Calm & Mental Well-being',
    bgColor: 'bg-[#E2C8D3]',
    textColor: 'text-[#582C5E]',
    href: '/psychological-support',
  },
  {
    title: 'Legal Support',
    description: 'Focus: Authority & Trust',
    bgColor: 'bg-[#FFCB99]',
    textColor: 'text-[#D78448]',
    href: '/legal-support',
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#E1D9D1] flex flex-col items-center">
      <header className="w-full text-center py-10">
        <h1 className="text-4xl font-bold text-[#697867]">أمل</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl w-full">
        {categories.map((category, index) => (
          <Link key={index} href={category.href}>
            <div
              className={`p-8 rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${category.bgColor} ${category.textColor}`}
            >
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <p className="text-lg mt-2">{category.description}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default HomePage;
