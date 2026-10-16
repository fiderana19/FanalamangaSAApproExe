import React from "react";
import { List } from "lucide-react";
import AideActionCard from "@/components/aide/AideActionCard";
import AideTexte from "@/components/aide/AideTexte";
import SectionHeader from "@/components/ui/SectionHeader";
import { getAideResume } from "@/constants/Aide";
import { getRoleLabel } from "@/constants/Role";
import { AideSection } from "@/interfaces/Aide";

interface AideGuideProps {
    role: string;
    sections: AideSection[];
}

const AideGuide: React.FC<AideGuideProps> = ({ role, sections }) => {
    const resume = getAideResume(role);

    return (
        <div className='flex flex-col gap-5'>
            <div className='panel p-5'>
                <div className='text-[11px] font-semibold uppercase tracking-wider text-brand'>
                    Espace {getRoleLabel(role)}
                </div>
                <h2 className='mt-1 text-xl font-bold text-gray-800'>
                    Guide d'utilisation
                </h2>
                {resume ? (
                    <p className='mt-2 max-w-3xl text-sm text-brand-muted'>
                        {resume}
                    </p>
                ) : null}
            </div>

            <div className='grid gap-5 lg:grid-cols-[220px_1fr]'>
                <aside className='hidden lg:block'>
                    <div className='panel sticky top-24 p-4'>
                        <div className='mb-2 flex items-center gap-2 text-gray-700'>
                            <List className='size-4' />
                            <h3 className='text-sm font-bold'>Sommaire</h3>
                        </div>
                        <nav className='flex flex-col'>
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className='rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-[#e9f5ee] hover:text-brand'
                                >
                                    {section.titre}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                <div className='flex flex-col gap-5'>
                    {sections.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            className='panel scroll-mt-24 p-5'
                        >
                            <SectionHeader
                                title={section.titre}
                                icon={
                                    <section.icone className='size-4 text-brand' />
                                }
                            />
                            <p className='mb-4 text-sm text-brand-muted'>
                                <AideTexte texte={section.intro} />
                            </p>
                            <div className='grid gap-3 md:grid-cols-2'>
                                {section.actions.map((action) => (
                                    <AideActionCard
                                        key={action.titre}
                                        action={action}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AideGuide;
