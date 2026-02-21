'use client';

import { Brand } from '@cofounder/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface BrandContextType {
    activeBrand: Brand | null;
    setActiveBrand: (brand: Brand | null) => void;
    brands: Brand[];
    refreshBrands: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const DEFAULT_BRANDS: Brand[] = [
    { id: 'tuhinscollectionsectionsections', name: 'Tuhins Collections', slug: 'tuhinscollections' },
    { id: 'fruits-zone', name: 'Fruits Zone', slug: 'fruits-zone' },
    { id: 'stylehunt', name: 'StyleHunt', slug: 'stylehunt' },
    { id: 'bengolsale', name: 'BengolSale', slug: 'bengolsale' },
    { id: 'raafidan', name: 'Raafidan', slug: 'raafidan' },
];

export function BrandProvider({ children }: { children: React.ReactNode }) {
    const [brands, setBrands] = useState<Brand[]>(DEFAULT_BRANDS);
    const [activeBrand, setActiveBrandState] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setBrands(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const refreshBrands = async () => {
        await fetchBrands();
    };

    useEffect(() => {
        if (loading) return;

        const saved = localStorage.getItem('cofounder_brand_context');
        if (saved && saved !== '') {
            const brand = brands.find(b => b.id === saved);
            if (brand) setActiveBrandState(brand);
            else setActiveBrandState(null);
        } else {
            setActiveBrandState(null);
        }
    }, [loading, brands]);

    const setActiveBrand = (brand: Brand | null) => {
        setActiveBrandState(brand);
        if (brand && brand.id) {
            localStorage.setItem('cofounder_brand_context', brand.id);
        } else {
            localStorage.removeItem('cofounder_brand_context');
        }
    };

    return (
        <BrandContext.Provider value={{ activeBrand, setActiveBrand, brands, refreshBrands }}>
            {children}
        </BrandContext.Provider>
    );
}

export function useBrand() {
    const context = useContext(BrandContext);
    if (!context) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
}
