'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, FileText, Shield, Scale } from 'lucide-react';

const suggestionChips = [
    {
        icon: Shield,
        text: 'GST compliance requirements',
    },
    {
        icon: FileText,
        text: 'ROC annual filings',
    },
    {
        icon: Scale,
        text: 'Labour law compliance',
    },
];

const HeroChatInput = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim()) return;

        // Store the message in sessionStorage for the ai-chat page to pick up
        sessionStorage.setItem('pendingMessage', query.trim());
        sessionStorage.setItem('loginSource', 'ai-chat');

        // Redirect to login with ai-chat redirect param
        router.push('/login?redirect=ai-chat');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className='w-full max-w-2xl mx-auto mt-8'>
            {/* Main Input Container */}
            <form onSubmit={handleSubmit} className='relative'>
                <div
                    className={`
						relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300
						${isFocused ? 'border-accent shadow-xl shadow-accent/10' : 'border-gray-200 hover:border-gray-300'}
					`}
                >
                    <div className='flex items-start p-2'>
                        <textarea
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={handleKeyDown}
                            placeholder='Ask anything about compliance...'
                            rows={1}
                            className='
								flex-1 resize-none bg-transparent border-0 
								text-gray-900 placeholder:text-gray-400
								focus:outline-none focus:ring-0
								text-base md:text-lg py-3 px-4
								min-h-[52px] max-h-[120px]
							'
                            style={{
                                height: 'auto',
                                overflow: 'hidden',
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                            }}
                        />
                        <Button
                            type='submit'
                            disabled={!query.trim()}
                            className={`
								shrink-0 h-12 w-12 rounded-xl p-0 m-1 transition-all duration-200
								${query.trim()
                                    ? 'bg-accent hover:bg-accent/90 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
							`}
                        >
                            <Send className='h-5 w-5' />
                        </Button>
                    </div>
                </div>
            </form>

            {/* Suggestion Chips */}
            <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
                <span className='text-sm text-gray-500 flex items-center gap-1'>
                    <Sparkles className='h-4 w-4' />
                    Try:
                </span>
                {suggestionChips.map((chip, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(chip.text)}
                        className='
							inline-flex items-center gap-1.5 px-3 py-1.5
							bg-gray-50 hover:bg-gray-100 
							border border-gray-200 hover:border-gray-300
							rounded-full text-sm text-gray-600 hover:text-gray-900
							transition-all duration-200
						'
                    >
                        <chip.icon className='h-3.5 w-3.5' />
                        {chip.text}
                    </button>
                ))}
            </div>

            {/* Subtle Helper Text */}
            <p className='text-center text-xs text-gray-400 mt-4'>
                Free to try • No credit card required
            </p>
        </div>
    );
};

export default HeroChatInput;
