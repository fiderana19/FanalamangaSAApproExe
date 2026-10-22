import React, { useRef, useState } from 'react';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useImportRessources } from '@/hooks/useImportRessources';
import { RessourceImportResult } from '@/interfaces/Ressource';
import RessourceCategorieBadge from '@/components/ressources/RessourceCategorieBadge';
import { pluriel } from '@/utils/Pluriel';

const RessourceImportPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [result, setResult] = useState<RessourceImportResult | null>(null);

  const { mutateAsync: importRessources, isPending: isImporting } = useImportRessources();

  const isJsonFile = (file: File) => file.type === "application/json" || file.name.toLowerCase().endsWith(".json");

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!isJsonFile(file)) {
      setSelectedFile(null);
      setPickError("Veuillez sélectionner un fichier au format .json");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
    setPickError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    try {
      const response = await importRessources(selectedFile);
      setResult(response.data);
    } catch {
      return;
    }
  };

  return (
    <div className='min-h-[70vh] flex flex-col'>
      {!result ? (
        <div className='flex-1 flex items-center justify-center'>
          <div className='panel w-full max-w-md p-6'>
            <div className='flex items-center gap-2.5 pb-2 mb-4'>
              <div className='grid place-items-center size-9 rounded bg-gray-100 text-gray-700'>
                <UploadOutlined />
              </div>
              <h2 className='text-lg font-bold'>Importer des ressources</h2>
            </div>
            <p className='text-sm text-brand-muted mb-4'>
              Sélectionnez un fichier JSON contenant vos ressources. Chaque ressource doit comporter{' '}
              <span className='font-medium text-foreground'>reference</span>,{' '}
              <span className='font-medium text-foreground'>designation</span>,{' '}
              <span className='font-medium text-foreground'>description</span>,{' '}
              <span className='font-medium text-foreground'>unite</span> et{' '}
              <span className='font-medium text-foreground'>categorie</span>.
            </p>

            <div
              role='button'
              aria-label='Sélectionner un fichier JSON'
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragOver
                  ? 'border-brand bg-brand/5'
                  : 'border-[#d9dee5] bg-gray-50 hover:border-brand/50'
              }`}
            >
              <InboxOutlined className='text-4xl text-brand' />
              <p className='text-sm font-medium text-gray-700'>
                {selectedFile ? selectedFile.name : 'Cliquez ou glissez votre fichier JSON ici'}
              </p>
              <p className='text-xs text-gray-400'>
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} Ko`
                  : 'Seul le format .json est accepté'}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='.json,application/json'
              className='hidden'
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {pickError && (
              <div className='mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600'>
                <CloseCircleOutlined /> {pickError}
              </div>
            )}

            <Button
              type='button'
              variant='brand'
              disabled={!selectedFile || isImporting}
              onClick={handleImport}
              className='mt-4 w-full'
            >
              {isImporting ? <LoadingOutlined /> : <UploadOutlined />}
              {isImporting ? 'Importation en cours…' : 'Importer'}
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center'>
          <div className='panel w-full max-w-lg p-6'>
            <div className='flex items-center gap-2.5 pb-2 mb-4'>
              <div className='grid place-items-center size-9 rounded bg-[#e9f5ee] text-brand'>
                <CheckCircleOutlined />
              </div>
              <h2 className='text-lg font-bold'>Résultat de l’importation</h2>
            </div>

            <div className='grid grid-cols-3 gap-3 mb-5'>
              <div className='rounded-lg bg-[#e9f5ee] p-3 text-center'>
                <div className='text-2xl font-extrabold text-brand'>{result.creees.length}</div>
                <div className='text-xs text-brand-muted'>{pluriel(result.creees.length, 'Créée', 'Créées')}</div>
              </div>
              <div className='rounded-lg bg-yellow-50 p-3 text-center'>
                <div className='text-2xl font-extrabold text-yellow-600'>{result.ignorees.length}</div>
                <div className='text-xs text-yellow-700/70'>{pluriel(result.ignorees.length, 'Ignorée', 'Ignorées')}</div>
              </div>
              <div className='rounded-lg bg-red-50 p-3 text-center'>
                <div className='text-2xl font-extrabold text-red-600'>{result.invalides.length}</div>
                <div className='text-xs text-red-700/70'>{pluriel(result.invalides.length, 'Invalide', 'Invalides')}</div>
              </div>
            </div>

            <div className='space-y-4'>
              {result.creees.length > 0 && (
                <div>
                  <div className='mb-1.5 text-[13px] font-semibold text-brand'>Ressources créées</div>
                  <ul className='space-y-1 text-sm'>
                    {result.creees.map((r) => (
                      <li key={r._id} className='flex items-center justify-between gap-2 rounded-md bg-gray-50 px-3 py-1.5'>
                        <span className='flex items-center gap-2.5 min-w-0'>
                          <span className='font-medium whitespace-nowrap'>{r.reference}</span>
                          <span className='truncate text-brand-muted'>{r.designationRessource}</span>
                        </span>
                        <RessourceCategorieBadge categorie={r.categorie} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.ignorees.length > 0 && (
                <div>
                  <div className='mb-1.5 text-[13px] font-semibold text-yellow-600'>Ressources ignorées</div>
                  <ul className='space-y-1 text-sm'>
                    {result.ignorees.map((r, index) => (
                      <li key={index} className='flex items-center gap-2 rounded-md bg-yellow-50 px-3 py-1.5'>
                        <ExclamationCircleOutlined className='text-yellow-600' />
                        <span>
                          <span className='font-medium'>{r.reference}</span>{' '}
                          <span className='text-brand-muted'>— {r.raison}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.invalides.length > 0 && (
                <div>
                  <div className='mb-1.5 text-[13px] font-semibold text-red-600'>Ressources invalides</div>
                  <ul className='space-y-1 text-sm'>
                    {result.invalides.map((r, index) => (
                      <li key={index} className='rounded-md bg-red-50 px-3 py-1.5'>
                        <div className='flex items-center gap-2'>
                          <CloseCircleOutlined className='text-red-600' />
                          <span className='font-medium'>
                            Ligne {r.ligne}
                            {r.reference ? ` (${r.reference})` : ''}
                          </span>
                        </div>
                        <ul className='mt-1 space-y-0.5 pl-6'>
                          {r.erreurs.map((erreur, i) => (
                            <li key={i} className='text-brand-muted'>{erreur}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              type='button'
              variant='secondary'
              onClick={() => navigate('/agent_appro/ressource')}
              className='mt-5 w-full'
            >
              Retour à la liste des ressources
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RessourceImportPage;