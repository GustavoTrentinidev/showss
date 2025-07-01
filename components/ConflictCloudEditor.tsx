
import React, { useState } from 'react';
import type { ConflictCloud, ConflictCloudSolution } from '../types';
import { NodeKey } from '../types';
import CloudNode from './CloudNode';
import EditableTextarea from './EditableTextarea';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface ConflictCloudEditorProps {
  cloud: ConflictCloud;
  onUpdateCloud: (updatedCloud: ConflictCloud) => void;
  onDeleteCloud: (cloudId: string) => void;
}

const ArrowSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex justify-center items-center h-8 md:h-10 ${className}`}> {/* Slightly shorter */}
    <div className="conflict-node-arrow"></div>
  </div>
);

const ConflictSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex flex-col items-center justify-center text-xl font-bold text-red-500/70 ${className} my-1 md:my-0`}> {/* Muted color */}
    <span>↔</span> {/* Simpler conflict symbol */}
  </div>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${className}`}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.453 3.35a.75.75 0 0 0 .256 1.19l3.608 1.545L9.16 18.12a.75.75 0 0 0 1.19-.255l3.35-3.454.39-4.752 4.402-1.83a.75.75 0 0 0 0-1.737l-4.402-1.83-.39-4.752L10.868 2.884ZM9.25 11.25a.75.75 0 0 0 .75.75H11a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H10a.75.75 0 0 0-.75.75v1.25Z" clipRule="evenodd" />
    <path d="M2.563 3.468c.206-.462.77-.462.976 0l.661 1.481a.75.75 0 0 0 .709.527l1.613.218a.75.75 0 0 1 .504.884l-.92 1.68a.75.75 0 0 0 .145.848l1.295 1.294a.75.75 0 0 1-.198 1.162l-1.749.81a.75.75 0 0 0-.43.66l-.223 1.72a.75.75 0 0 1-1.09.58l-1.636-.726a.75.75 0 0 0-.736 0l-1.637.726a.75.75 0 0 1-1.09-.58l-.223-1.72a.75.75 0 0 0-.43-.66l-1.749-.81a.75.75 0 0 1-.198-1.162l1.295-1.294a.75.75 0 0 0 .145-.848l-.92-1.68a.75.75 0 0 1 .504-.884l1.613-.218a.75.75 0 0 0 .709-.527l.66-1.48Z" />
  </svg>
);

const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${className}`}> {/* Smaller trash icon */}
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4.5h8V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4.5A1.25 1.25 0 0 0 8.75 3.25V3.75h2.5V3.25A1.25 1.25 0 0 0 10 4.5ZM.75 5.75A.75.75 0 0 0 0 6.5v.75c0 .414.336.75.75.75h18.5c.414 0 .75-.336.75-.75V6.5a.75.75 0 0 0-.75-.75H.75ZM1.606 9.22l.84 8.411a2.75 2.75 0 0 0 2.742 2.619h10.624a2.75 2.75 0 0 0 2.742-2.619l.84-8.411H1.606Z" clipRule="evenodd" />
  </svg>
);


const ConflictCloudEditor: React.FC<ConflictCloudEditorProps> = ({ cloud, onUpdateCloud, onDeleteCloud }) => {
  const [newSolutionText, setNewSolutionText] = useState('');
  const [isSuggestingSolutions, setIsSuggestingSolutions] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const isReadOnly = cloud.isSolved;

  const handleFieldChange = (field: keyof Omit<ConflictCloud, 'solutions' | 'isSolved' | 'id'>, value: string) => {
    if (isReadOnly) return;
    onUpdateCloud({ ...cloud, [field]: value });
  };

  const handleToggleSolved = () => {
    onUpdateCloud({ ...cloud, isSolved: !cloud.isSolved });
  };

  const handleAddSolution = () => {
    if (isReadOnly || newSolutionText.trim() === '') return;
    const newSolution: ConflictCloudSolution = {
      id: Date.now().toString(),
      text: newSolutionText.trim(),
      isAiSuggested: false,
    };
    onUpdateCloud({ ...cloud, solutions: [...cloud.solutions, newSolution] });
    setNewSolutionText('');
  };

  const handleDeleteSolution = (solutionId: string) => {
    if (isReadOnly) return;
    onUpdateCloud({
      ...cloud,
      solutions: cloud.solutions.filter((s) => s.id !== solutionId),
    });
  };

  const handleSuggestSolutionsAI = async () => {
    if (isReadOnly) return;
    setIsSuggestingSolutions(true);
    setAiError(null);

    const prompt = `Dada a seguinte Nuvem de Conflito da Teoria das Restrições, por favor, sugira de 2 a 4 soluções potenciais para resolver o conflito.
Apresente cada solução como uma declaração concisa e acionável.
Objetivo (A): "${cloud.objective || 'Não especificado'}"
Requisito (B): "${cloud.requirementB || 'Não especificado'}" que leva ao Desejo (D): "${cloud.desireD || 'Não especificado'}"
Requisito (C): "${cloud.requirementC || 'Não especificado'}" que leva ao Desejo (D'): "${cloud.desireDPrime || 'Não especificado'}"
O conflito é entre o Desejo D e o Desejo D'.

Por favor, forneça as soluções como um array JSON de strings. Por exemplo: ["Solução 1: Fazer X", "Solução 2: Considerar Y"]`;

    try {
      if (!process.env.API_KEY) {
        console.warn("Chave da API do Google GenAI não configurada (process.env.API_KEY).");
        setAiError("A chave da API não está configurada para sugestões de IA.");
        setIsSuggestingSolutions(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const suggestedTexts: string[] = JSON.parse(jsonStr);
      
      if (!Array.isArray(suggestedTexts) || !suggestedTexts.every(item => typeof item === 'string')) {
        throw new Error("A resposta da IA não está no formato esperado (array de strings).");
      }

      const newAiSolutions: ConflictCloudSolution[] = suggestedTexts.map(text => ({
        id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text,
        isAiSuggested: true,
      }));
      
      onUpdateCloud({ ...cloud, solutions: [...cloud.solutions, ...newAiSolutions] });

    } catch (error) {
      console.error("Error suggesting solutions:", error);
      setAiError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao buscar sugestões.");
    } finally {
      setIsSuggestingSolutions(false);
    }
  };
  
  // Node styles are now handled by CloudNode itself for AWS clean look
  const editorClass = isReadOnly ? 'cursor-not-allowed' : '';

  return (
    <div className={`p-4 sm:p-5 space-y-5 bg-white ${editorClass}`}> 
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-200">
        <EditableTextarea
          id={`${cloud.id}-title`}
          value={cloud.title}
          onChange={(value) => handleFieldChange('title', value)}
          placeholder="Título da Nuvem"
          label="" // Label can be ommited if placeholder is clear enough
          className="flex-grow"
          textareaClassName="w-full p-2 text-md font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          rows={1}
          readOnly={isReadOnly} 
        />
        <div className="flex items-center gap-3 mt-1 sm:mt-0 self-end sm:self-center"> 
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={`${cloud.id}-isSolved`}
                    checked={cloud.isSolved}
                    onChange={handleToggleSolved}
                    className="h-4 w-4 text-sky-600 border-slate-400 rounded focus:ring-sky-500 focus:ring-1 focus:ring-offset-1"
                />
                <label htmlFor={`${cloud.id}-isSolved`} className="ml-1.5 text-xs font-medium text-slate-600">
                    Resolvida
                </label>
            </div>
            <button
                onClick={() => onDeleteCloud(cloud.id)}
                className="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-300 hover:text-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-400 flex items-center gap-1"
                aria-label="Excluir esta nuvem de conflito"
            >
                <TrashIcon className="w-3.5 h-3.5" />
                Excluir
            </button>
        </div>
      </div>

      <div className={`space-y-2.5 md:space-y-3 ${isReadOnly ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="flex justify-center">
          <CloudNode
            nodeId={NodeKey.OBJECTIVE}
            cloudIdPrefix={cloud.id}
            label="Objetivo Comum"
            symbol="A"
            value={cloud.objective}
            onValueChange={(val) => handleFieldChange(NodeKey.OBJECTIVE, val)}
            placeholder="Qual é o objetivo principal?"
            readOnly={isReadOnly}
          />
        </div>
        
        <ArrowSeparator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-start">
          <CloudNode
            nodeId={NodeKey.REQUIREMENT_B}
            cloudIdPrefix={cloud.id}
            label="Requisito"
            symbol="B"
            value={cloud.requirementB}
            onValueChange={(val) => handleFieldChange(NodeKey.REQUIREMENT_B, val)}
            placeholder="Necessidade para alcançar A"
            readOnly={isReadOnly}
          />
          <CloudNode
            nodeId={NodeKey.REQUIREMENT_C}
            cloudIdPrefix={cloud.id}
            label="Requisito"
            symbol="C"
            value={cloud.requirementC}
            onValueChange={(val) => handleFieldChange(NodeKey.REQUIREMENT_C, val)}
            placeholder="Outra necessidade para A"
            readOnly={isReadOnly}
          />
        </div>

         <ArrowSeparator />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-center">
          <CloudNode
            nodeId={NodeKey.DESIRE_D}
            cloudIdPrefix={cloud.id}
            label="Condição / Desejo"
            symbol="D"
            value={cloud.desireD}
            onValueChange={(val) => handleFieldChange(NodeKey.DESIRE_D, val)}
            placeholder="Para ter B, precisamos de D"
            readOnly={isReadOnly}
          />
          <ConflictSymbol />
          <CloudNode
            nodeId={NodeKey.DESIRE_D_PRIME}
            cloudIdPrefix={cloud.id}
            label="Condição / Desejo Conflitante"
            symbol="D'"
            value={cloud.desireDPrime}
            onValueChange={(val) => handleFieldChange(NodeKey.DESIRE_D_PRIME, val)}
            placeholder="Para ter C, precisamos de D'"
            readOnly={isReadOnly}
          />
        </div>
      </div>

      <div className={`pt-5 border-t border-slate-200 space-y-3 ${isReadOnly ? 'opacity-60 pointer-events-none' : ''}`}>
        <h3 className="text-sm font-semibold text-slate-700">Soluções Propostas</h3>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newSolutionText}
            onChange={(e) => setNewSolutionText(e.target.value)}
            placeholder="Descreva uma nova solução..."
            className="flex-grow p-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
            aria-label="Texto da nova solução"
            disabled={isReadOnly}
          />
          <button
            onClick={handleAddSolution}
            className="px-3 py-2 bg-slate-600 text-white text-xs font-medium rounded-md hover:bg-slate-700 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
            aria-label="Adicionar nova solução"
            disabled={isReadOnly || newSolutionText.trim() === ''}
          >
            Adicionar
          </button>
        </div>

        <div>
          <button
            onClick={handleSuggestSolutionsAI}
            disabled={isReadOnly || isSuggestingSolutions}
            className="w-full px-3 py-2 bg-sky-600 text-white text-xs font-medium rounded-md hover:bg-sky-700 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            aria-label="Sugerir soluções com IA"
          >
            {isSuggestingSolutions ? (
              <>
                <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sugerindo...
              </>
            ) : (
              <>
               <SparklesIcon className="mr-1 w-3.5 h-3.5" /> Sugerir com IA
              </>
            )}
          </button>
          {aiError && <p className="text-xs text-red-500 mt-1" role="alert">Erro: {aiError}</p>}
        </div>

        {cloud.solutions.length === 0 && !isSuggestingSolutions && (
          <p className="text-slate-400 text-xs text-center py-1">Nenhuma solução proposta.</p>
        )}
        <ul className="space-y-1.5">
          {cloud.solutions.map((solution) => (
            <li key={solution.id} className={`flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-200 group ${isReadOnly ? 'opacity-70' : ''}`}>
              <span className={`text-xs text-slate-700 flex-grow ${solution.isAiSuggested ? 'italic' : ''}`}>
                {solution.text}
                {solution.isAiSuggested && <SparklesIcon className="inline-block ml-1 text-sky-500 w-3 h-3" />}
              </span>
              {!isReadOnly && (
                <button
                  onClick={() => handleDeleteSolution(solution.id)}
                  className="ml-2 p-0.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 rounded-full hover:bg-red-100"
                  aria-label={`Excluir solução: ${solution.text}`}
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConflictCloudEditor;