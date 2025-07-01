
import React, { useState, useEffect } from 'react';
import type { ConflictCloud } from './types';
import ConflictCloudEditor from './components/ConflictCloudEditor';
import CloudListItem from './components/CloudListItem';

// --- Ícones SVG ---
const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

const FolderOpenIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const DocumentPlusIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 17.25v.008M9 17.25H4.521A2.25 2.25 0 0 1 2.27 15.126V5.25A2.25 2.25 0 0 1 4.521 3h10.958A2.25 2.25 0 0 1 17.75 5.25v4.834M9 17.25h3M9 17.25a2.25 2.25 0 0 1-2.25-2.25M15 12a2.25 2.25 0 0 0-2.25 2.25M15 12a2.25 2.25 0 0 1 2.25 2.25M15 12v5.25M17.25 17.25a2.25 2.25 0 0 1-2.25-2.25M17.25 17.25a2.25 2.25 0 0 0 2.25-2.25M17.25 17.25H15m2.25-5.25h3m-3 7.5h3M12.75 3v4.5A2.25 2.25 0 0 1 10.5 9.75H4.5A2.25 2.25 0 0 1 2.25 7.5V5.25" />
</svg>
);

const ExclamationTriangleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
  </svg>
);
// --- Fim dos Ícones SVG ---

const MOCK_INITIAL_CLOUDS: ConflictCloud[] = [
  {
    id: 'mock-cloud-1',
    title: 'Nuvem Exemplo: Lançamento de Produto',
    objective: 'Lançar um novo produto com sucesso no mercado.',
    requirementB: 'Garantir alta qualidade do produto.',
    requirementC: 'Cumprir o prazo de lançamento agressivo.',
    desireD: 'Realizar testes extensivos e rigorosos.',
    desireDPrime: 'Acelerar o desenvolvimento e pular algumas fases de teste.',
    solutions: [
      { id: 'sol-1-1', text: 'Implementar testes automatizados paralelos ao desenvolvimento.', isAiSuggested: false },
      { id: 'sol-1-2', text: 'Priorizar funcionalidades essenciais (MVP) para o lançamento inicial.', isAiSuggested: true },
    ],
    isSolved: false,
  },
  {
    id: 'mock-cloud-2',
    title: 'Nuvem Exemplo: Decisão de Carreira',
    objective: 'Ter uma carreira profissional satisfatória e próspera.',
    requirementB: 'Buscar estabilidade financeira e segurança no emprego.',
    requirementC: 'Encontrar trabalho com propósito e paixão.',
    desireD: 'Aceitar um emprego corporativo bem remunerado em uma grande empresa.',
    desireDPrime: 'Iniciar um projeto próprio arriscado, mas alinhado com valores pessoais.',
    solutions: [
         { id: 'sol-2-1', text: 'Buscar um emprego corporativo que ofereça desafios e oportunidades de crescimento alinhados com paixões.', isAiSuggested: false },
         { id: 'sol-2-2', text: 'Desenvolver o projeto próprio em paralelo com o emprego atual, como um "side project".', isAiSuggested: false },
    ],
    isSolved: true,
  },
];


const App: React.FC = () => {
  const [conflictClouds, setConflictClouds] = useState<ConflictCloud[]>([]);
  const [activeCloudId, setActiveCloudId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true);
    let initialClouds: ConflictCloud[] = MOCK_INITIAL_CLOUDS;
    let lastActiveId: string | null = null;

    const storedClouds = localStorage.getItem('conflictClouds');
    if (storedClouds) {
      try {
        const parsedClouds: any[] = JSON.parse(storedClouds);
        if (Array.isArray(parsedClouds) && parsedClouds.every(cloud => typeof cloud === 'object' && cloud !== null && 'id' in cloud && 'title' in cloud)) {
             const sanitizedClouds: ConflictCloud[] = parsedClouds.map(cloud => ({
                id: cloud.id || Date.now().toString() + Math.random(),
                title: cloud.title || 'Nuvem Sem Título',
                objective: cloud.objective || '',
                requirementB: cloud.requirementB || '',
                requirementC: cloud.requirementC || '',
                desireD: cloud.desireD || '',
                desireDPrime: cloud.desireDPrime || '',
                solutions: Array.isArray(cloud.solutions) ? cloud.solutions.map((sol: any) => ({
                    id: sol.id || Date.now().toString() + Math.random(),
                    text: sol.text || '',
                    isAiSuggested: sol.isAiSuggested || false,
                })) : [],
                isSolved: typeof cloud.isSolved === 'boolean' ? cloud.isSolved : false,
             }));
             initialClouds = sanitizedClouds;
        } else {
          console.warn("Dados do localStorage estão malformados. Usando dados mockados.");
          localStorage.removeItem('conflictClouds'); 
        }
      } catch (error) {
        console.error("Falha ao analisar nuvens do localStorage. Usando dados mockados:", error);
        localStorage.removeItem('conflictClouds'); 
      }
    }
    
    setConflictClouds(initialClouds);

    const storedActiveId = localStorage.getItem('activeCloudId');
    if (storedActiveId && initialClouds.some(c => c.id === storedActiveId)) {
        lastActiveId = storedActiveId;
    } else if (initialClouds.length > 0) {
        const firstUnsolved = initialClouds.find(c => !c.isSolved);
        lastActiveId = firstUnsolved ? firstUnsolved.id : initialClouds[0].id;
    }
    setActiveCloudId(lastActiveId);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) { 
        localStorage.setItem('conflictClouds', JSON.stringify(conflictClouds));
    }
  }, [conflictClouds, isLoading]);

  useEffect(() => {
    if (!isLoading) { 
        if (activeCloudId) {
          localStorage.setItem('activeCloudId', activeCloudId);
        } else {
          localStorage.removeItem('activeCloudId');
        }
    }
  }, [activeCloudId, isLoading]);

  const handleCreateCloud = () => {
    const newCloud: ConflictCloud = {
      id: Date.now().toString(),
      title: 'Nova Nuvem de Conflito',
      objective: '',
      requirementB: '',
      requirementC: '',
      desireD: '',
      desireDPrime: '',
      solutions: [],
      isSolved: false,
    };
    setConflictClouds((prevClouds) => [newCloud, ...prevClouds]);
    setActiveCloudId(newCloud.id); 
  };

  const handleUpdateCloud = (updatedCloud: ConflictCloud) => {
    setConflictClouds((prevClouds) =>
      prevClouds.map((cloud) => (cloud.id === updatedCloud.id ? updatedCloud : cloud))
    );
  };

  const handleDeleteCloud = (cloudId: string) => {
    setConflictClouds((prevClouds) => {
      const remainingClouds = prevClouds.filter((cloud) => cloud.id !== cloudId);
      if (activeCloudId === cloudId) {
        setActiveCloudId(remainingClouds.length > 0 ? remainingClouds[0].id : null);
      }
      return remainingClouds;
    });
  };

  const handleSelectCloud = (cloudId: string) => {
    setActiveCloudId((prevActiveId) => (prevActiveId === cloudId ? null : cloudId));
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="text-xl text-slate-500">Carregando Modelador...</div>
        </div>
    );
  }

  const activeCloud = activeCloudId ? conflictClouds.find(c => c.id === activeCloudId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white text-slate-800 p-3 sm:p-4 shadow-sm sticky top-0 z-30 border-b border-slate-200">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-700 text-center tracking-tight">Modelador de Nuvem de Conflito</h1>
      </header>

      <main className="flex-grow container mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        <aside className="lg:col-span-4 xl:col-span-3 bg-white p-4 rounded-md border border-slate-200 h-fit max-h-[calc(100vh-100px)] overflow-y-auto sticky top-[80px]">
          <button
            onClick={handleCreateCloud}
            className="w-full mb-4 px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            Criar Nova Nuvem
          </button>
          <h2 className="text-sm font-semibold mb-2 text-slate-600 pb-2 border-b border-slate-200">
            SUAS NUVENS
          </h2>
          {conflictClouds.length === 0 ? (
            <p className="text-slate-500 mt-4 text-center text-xs">Nenhuma nuvem criada.</p>
          ) : (
            <ul className="space-y-1.5 mt-3">
              {conflictClouds.map((cloud) => (
                <CloudListItem
                  key={cloud.id}
                  cloud={cloud}
                  isSelected={activeCloudId === cloud.id}
                  onSelect={() => handleSelectCloud(cloud.id)}
                />
              ))}
            </ul>
          )}
        </aside>

        <section className="lg:col-span-8 xl:col-span-9 min-h-[300px]">
          {activeCloud ? (
             <div className="bg-white rounded-md border border-slate-200 shadow-sm">
                <ConflictCloudEditor
                    key={activeCloud.id}
                    cloud={activeCloud}
                    onUpdateCloud={handleUpdateCloud}
                    onDeleteCloud={handleDeleteCloud}
                />
            </div>
          ) : activeCloudId ? (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-md border border-red-300 text-center">
                <ExclamationTriangleIcon className="text-red-400 mb-3" />
                <p className="text-md font-medium text-red-600">
                  Erro: Nuvem não encontrada.
                </p>
                <p className="text-xs text-slate-400 mt-1">A nuvem selecionada pode ter sido excluída.</p>
            </div>
          ) : conflictClouds.length > 0 ? (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-md border border-slate-200 text-center">
              <FolderOpenIcon className="text-slate-400 mb-3" />
              <p className="text-md font-medium text-slate-600">
                Selecione uma nuvem para visualizar ou editar.
              </p>
              <p className="text-xs text-slate-400 mt-1">Ou crie uma nova para começar a modelar.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-md border border-slate-200 text-center">
               <DocumentPlusIcon className="text-slate-400 mb-3" />
              <p className="text-md font-medium text-slate-600">
                Crie sua primeira Nuvem de Conflito.
              </p>
              <p className="text-xs text-slate-400 mt-1">Use o botão "Criar Nova Nuvem" ao lado.</p>
            </div>
           )}
        </section>
      </main>
      <footer className="text-center p-3 text-xs text-slate-400 bg-slate-50 border-t border-slate-200 mt-auto">
        Modelador de Nuvem de Conflito TOC. IA por Google Gemini.
      </footer>
    </div>
  );
};

export default App;
